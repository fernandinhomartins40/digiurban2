
import { useState, useEffect, useCallback } from 'react';
import { ChatRoom, ChatMessage, ChatParticipant, ChatState, SendMessageRequest } from '@/types/chat';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    rooms: [],
    activeRoom: null,
    messages: [],
    participants: [],
    isLoading: false,
    error: null
  });

  // Fetch chat rooms
  const fetchRooms = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/chat/rooms');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      
      const rooms: ChatRoom[] = await response.json();
      setState(prev => ({ ...prev, rooms, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch rooms',
        isLoading: false 
      }));
    }
  }, []);

  // Fetch messages for a room
  const fetchMessages = useCallback(async (roomId: number, page = 1) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages?page=${page}&limit=50`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const messages: ChatMessage[] = await response.json();
      setState(prev => ({ ...prev, messages, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
        isLoading: false 
      }));
    }
  }, []);

  // Fetch participants for a room
  const fetchParticipants = useCallback(async (roomId: number) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/participants`);
      if (!response.ok) throw new Error('Failed to fetch participants');
      
      const participants: ChatParticipant[] = await response.json();
      setState(prev => ({ ...prev, participants }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch participants'
      }));
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (roomId: number, messageData: Omit<SendMessageRequest, 'room_id'>) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...messageData, room_id: roomId })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const newMessage: ChatMessage = await response.json();
      
      // Add the new message to the current messages
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));

      return newMessage;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
      throw error;
    }
  }, []);

  // Set active room
  const setActiveRoom = useCallback((room: ChatRoom | null) => {
    setState(prev => ({ ...prev, activeRoom: room }));
    
    if (room) {
      fetchMessages(room.id);
      fetchParticipants(room.id);
      markAsRead(room.id);
    }
  }, [fetchMessages, fetchParticipants]);

  // Mark messages as read
  const markAsRead = useCallback(async (roomId: number) => {
    try {
      await fetch(`/api/chat/rooms/${roomId}/mark-read`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, []);

  // Initialize chat
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    ...state,
    fetchRooms,
    fetchMessages,
    fetchParticipants,
    sendMessage,
    setActiveRoom,
    markAsRead
  };
};
