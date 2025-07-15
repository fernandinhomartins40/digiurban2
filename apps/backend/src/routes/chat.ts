import express from 'express';
import pool from '../database/db';
import { ChatRoom, ChatMessage, ChatParticipant, SendMessageRequest } from '../types/chat';
import { AuthenticatedRequest } from '../types/auth';

const router = express.Router();

// Mock authentication middleware - replace with your actual auth implementation
const mockAuth = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  // For now, mock a user - replace this with your actual authentication logic
  req.user = {
    id: 1,
    name: 'Mock User',
    email: 'user@example.com',
    role: 'user'
  };
  next();
};

// Apply auth middleware to all routes
router.use(mockAuth);

// Get all chat rooms for current user
router.get('/rooms', async (req: AuthenticatedRequest, res) => {
  try {
    console.log('🔄 Fetching chat rooms for user:', req.user?.id);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const query = `
      SELECT 
        cr.id,
        cr.name,
        cr.type,
        cr.department,
        cr.is_active,
        cr.created_at,
        cr.updated_at,
        COUNT(DISTINCT cp.user_id) as participants_count,
        COUNT(CASE WHEN cm.is_read = false AND cm.user_id != $1 THEN 1 END) as unread_count,
        (
          SELECT json_build_object(
            'id', cm2.id,
            'message', cm2.message,
            'user_name', u2.name,
            'created_at', cm2.created_at
          )
          FROM chat_messages cm2
          JOIN users u2 ON cm2.user_id = u2.id
          WHERE cm2.room_id = cr.id
          ORDER BY cm2.created_at DESC
          LIMIT 1
        ) as last_message
      FROM chat_rooms cr
      LEFT JOIN chat_participants cp ON cr.id = cp.room_id
      LEFT JOIN chat_messages cm ON cr.id = cm.room_id
      WHERE cr.is_active = true
      GROUP BY cr.id, cr.name, cr.type, cr.department, cr.is_active, cr.created_at, cr.updated_at
      ORDER BY cr.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    const rooms = result.rows.map((row: any) => ({
      ...row,
      participants_count: parseInt(row.participants_count) || 0,
      unread_count: parseInt(row.unread_count) || 0
    }));
    
    console.log('✅ Chat rooms fetched successfully:', rooms.length, 'rooms');
    res.json(rooms);
  } catch (error) {
    console.error('❌ Error fetching chat rooms:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat rooms',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get messages for a specific room
router.get('/rooms/:roomId/messages', async (req: AuthenticatedRequest, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const userId = req.user?.id;
    
    console.log(`🔄 Fetching messages for room ${roomId}, user ${userId}`);
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Verify room exists and is active
    const roomCheck = await pool.query(
      'SELECT id FROM chat_rooms WHERE id = $1 AND is_active = true',
      [roomId]
    );
    
    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Chat room not found or inactive' });
    }
    
    const query = `
      SELECT 
        cm.id,
        cm.room_id,
        cm.user_id,
        cm.message,
        cm.message_type,
        cm.file_url,
        cm.file_name,
        cm.reply_to,
        cm.is_read,
        cm.created_at,
        cm.updated_at,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'role', u.role
        ) as user,
        CASE 
          WHEN cm.reply_to IS NOT NULL THEN
            json_build_object(
              'id', reply_msg.id,
              'message', reply_msg.message,
              'user', json_build_object('name', reply_user.name)
            )
          ELSE NULL
        END as reply_message
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      LEFT JOIN chat_messages reply_msg ON cm.reply_to = reply_msg.id
      LEFT JOIN users reply_user ON reply_msg.user_id = reply_user.id
      WHERE cm.room_id = $1
      ORDER BY cm.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [roomId, limit, offset]);
    
    const messages = result.rows.reverse();
    
    console.log('✅ Messages fetched successfully:', messages.length, 'messages');
    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Send a new message
router.post('/rooms/:roomId/messages', async (req: AuthenticatedRequest, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.id;
    const { message, message_type = 'text', file_url, file_name, reply_to }: SendMessageRequest = req.body;
    
    console.log(`🔄 Sending message to room ${roomId} from user ${userId}`);
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }
    
    // Verify room exists and is active
    const roomCheck = await pool.query(
      'SELECT id FROM chat_rooms WHERE id = $1 AND is_active = true',
      [roomId]
    );
    
    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Chat room not found or inactive' });
    }
    
    // Ensure user is a participant in the room
    await pool.query(
      `INSERT INTO chat_participants (room_id, user_id, role) 
       VALUES ($1, $2, 'participant') 
       ON CONFLICT (room_id, user_id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP`,
      [roomId, userId]
    );
    
    // Insert the message
    const insertQuery = `
      INSERT INTO chat_messages (room_id, user_id, message, message_type, file_url, file_name, reply_to)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, created_at, updated_at
    `;
    
    const result = await pool.query(insertQuery, [
      roomId, userId, message.trim(), message_type, file_url, file_name, reply_to
    ]);
    
    const newMessage = result.rows[0];
    
    // Get the complete message with user info
    const messageQuery = `
      SELECT 
        cm.id,
        cm.room_id,
        cm.user_id,
        cm.message,
        cm.message_type,
        cm.file_url,
        cm.file_name,
        cm.reply_to,
        cm.is_read,
        cm.created_at,
        cm.updated_at,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'role', u.role
        ) as user
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.id = $1
    `;
    
    const messageResult = await pool.query(messageQuery, [newMessage.id]);
    const responseMessage = messageResult.rows[0];
    
    console.log('✅ Message sent successfully:', responseMessage.id);
    res.status(201).json(responseMessage);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Mark message as read
router.patch('/rooms/:roomId/messages/:messageId/read', async (req: AuthenticatedRequest, res) => {
  try {
    const { roomId, messageId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    await pool.query(
      'UPDATE chat_messages SET is_read = true WHERE id = $1 AND room_id = $2 AND user_id != $3',
      [messageId, roomId, userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error marking message as read:', error);
    res.status(500).json({ 
      error: 'Failed to mark message as read',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create a new chat room
router.post('/rooms', async (req: AuthenticatedRequest, res) => {
  try {
    const { name, type = 'general', department } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Room name is required' });
    }
    
    // Create the room
    const roomQuery = `
      INSERT INTO chat_rooms (name, type, department)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const roomResult = await pool.query(roomQuery, [name.trim(), type, department]);
    const newRoom = roomResult.rows[0];
    
    // Add creator as moderator
    await pool.query(
      'INSERT INTO chat_participants (room_id, user_id, role) VALUES ($1, $2, $3)',
      [newRoom.id, userId, 'moderator']
    );
    
    console.log('✅ Chat room created successfully:', newRoom.id);
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('❌ Error creating chat room:', error);
    res.status(500).json({ 
      error: 'Failed to create chat room',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 