import express from 'express';
import pool from '../db';
import { ChatRoom, ChatMessage, ChatParticipant, SendMessageRequest } from '../../types/chat';
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

// Apply mock auth to all routes
router.use(mockAuth);

// Get all chat rooms for current user
router.get('/rooms', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    
    const query = `
      SELECT 
        cr.*,
        COUNT(DISTINCT cp.user_id) as participants_count,
        COUNT(CASE WHEN cm.is_read = false AND cm.user_id != $1 THEN 1 END) as unread_count,
        (
          SELECT row_to_json(latest_message)
          FROM (
            SELECT cm2.*, u.name as user_name
            FROM chat_messages cm2
            JOIN users u ON cm2.user_id = u.id
            WHERE cm2.room_id = cr.id
            ORDER BY cm2.created_at DESC
            LIMIT 1
          ) latest_message
        ) as last_message
      FROM chat_rooms cr
      LEFT JOIN chat_participants cp ON cr.id = cp.room_id
      LEFT JOIN chat_messages cm ON cr.id = cm.room_id
      WHERE cr.is_active = true
      GROUP BY cr.id
      ORDER BY cr.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

// Get messages for a specific room
router.get('/rooms/:roomId/messages', async (req: express.Request, res: express.Response) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const query = `
      SELECT 
        cm.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        reply_msg.message as reply_message,
        reply_user.name as reply_user_name
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      LEFT JOIN chat_messages reply_msg ON cm.reply_to = reply_msg.id
      LEFT JOIN users reply_user ON reply_msg.user_id = reply_user.id
      WHERE cm.room_id = $1
      ORDER BY cm.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [roomId, limit, offset]);
    
    // Transform the result to match our ChatMessage interface
    const messages = result.rows.map(row => ({
      id: row.id,
      room_id: row.room_id,
      user_id: row.user_id,
      message: row.message,
      message_type: row.message_type,
      file_url: row.file_url,
      file_name: row.file_name,
      reply_to: row.reply_to,
      is_read: row.is_read,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        role: row.user_role
      },
      reply_message: row.reply_message ? {
        message: row.reply_message,
        user: { name: row.reply_user_name }
      } : undefined
    }));
    
    res.json(messages.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a new message
router.post('/rooms/:roomId/messages', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.id;
    const { message, message_type = 'text', file_url, file_name, reply_to }: SendMessageRequest = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Ensure user is a participant in the room
    await pool.query(
      'INSERT INTO chat_participants (room_id, user_id) VALUES ($1, $2) ON CONFLICT (room_id, user_id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP',
      [roomId, userId]
    );
    
    const insertQuery = `
      INSERT INTO chat_messages (room_id, user_id, message, message_type, file_url, file_name, reply_to)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [
      roomId, userId, message, message_type, file_url, file_name, reply_to
    ]);
    
    // Get the complete message with user info
    const messageQuery = `
      SELECT 
        cm.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.id = $1
    `;
    
    const messageResult = await pool.query(messageQuery, [result.rows[0].id]);
    const newMessage = messageResult.rows[0];
    
    const responseMessage = {
      id: newMessage.id,
      room_id: newMessage.room_id,
      user_id: newMessage.user_id,
      message: newMessage.message,
      message_type: newMessage.message_type,
      file_url: newMessage.file_url,
      file_name: newMessage.file_name,
      reply_to: newMessage.reply_to,
      is_read: newMessage.is_read,
      created_at: newMessage.created_at,
      updated_at: newMessage.updated_at,
      user: {
        id: newMessage.user_id,
        name: newMessage.user_name,
        email: newMessage.user_email,
        role: newMessage.user_role
      }
    };
    
    res.status(201).json(responseMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get participants for a room
router.get('/rooms/:roomId/participants', async (req: express.Request, res: express.Response) => {
  try {
    const { roomId } = req.params;
    
    const query = `
      SELECT 
        cp.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role
      FROM chat_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.room_id = $1
      ORDER BY cp.joined_at ASC
    `;
    
    const result = await pool.query(query, [roomId]);
    
    const participants = result.rows.map(row => ({
      id: row.id,
      room_id: row.room_id,
      user_id: row.user_id,
      role: row.role,
      joined_at: row.joined_at,
      last_seen: row.last_seen,
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        role: row.user_role
      }
    }));
    
    res.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// Mark messages as read
router.post('/rooms/:roomId/mark-read', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    await pool.query(
      'UPDATE chat_messages SET is_read = true WHERE room_id = $1 AND user_id != $2',
      [roomId, userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

export default router;
