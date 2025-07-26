
import { useState, useEffect, useCallback } from 'react';
import { ChatRoom, ChatMessage, ChatParticipant, ChatState, SendMessageRequest } from '@/types/chat';
import { toast } from '@/hooks/use-toast';

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
      console.log('🔄 Fetching chat rooms...');
      const response = await fetch('/api/chat/rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const rooms: ChatRoom[] = await response.json();
      console.log('✅ Chat rooms fetched:', rooms.length, 'rooms');
      
      setState(prev => ({ 
        ...prev, 
        rooms, 
        isLoading: false,
        error: null 
      }));
      
      return rooms;
    } catch (error) {
      console.error('❌ Failed to fetch rooms:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch rooms';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }));

      toast({
        variant: "destructive",
        title: "Erro de Conexão",
        description: "Não foi possível carregar as salas de chat. Verifique se o backend está executando."
      });
      
      throw error;
    }
  }, []);

  // Fetch messages for a room
  const fetchMessages = useCallback(async (roomId: number, page = 1) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log(`🔄 Fetching messages for room ${roomId}...`);
      const response = await fetch(`/api/chat/rooms/${roomId}/messages?page=${page}&limit=50`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const messages: ChatMessage[] = await response.json();
      console.log('✅ Messages fetched:', messages.length, 'messages');
      
      setState(prev => ({ 
        ...prev, 
        messages, 
        isLoading: false,
        error: null 
      }));
      
      return messages;
    } catch (error) {
      console.error('❌ Failed to fetch messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }));
      
      toast({
        variant: "destructive",
        title: "Erro ao Carregar Mensagens",
        description: errorMessage
      });
      
      throw error;
    }
  }, []);

  // Fetch participants for a room
  const fetchParticipants = useCallback(async (roomId: number) => {
    try {
      console.log(`🔄 Fetching participants for room ${roomId}...`);
      const response = await fetch(`/api/chat/rooms/${roomId}/participants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const participants: ChatParticipant[] = await response.json();
      console.log('✅ Participants fetched:', participants.length, 'participants');
      
      setState(prev => ({ 
        ...prev, 
        participants,
        error: null 
      }));
      
      return participants;
    } catch (error) {
      console.error('❌ Failed to fetch participants:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch participants';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage
      }));
      
      // Don't show toast for participants error as it's not critical
      throw error;
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (roomId: number, messageData: Omit<SendMessageRequest, 'room_id'>) => {
    try {
      console.log(`🔄 Sending message to room ${roomId}...`);
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...messageData, room_id: roomId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const newMessage: ChatMessage = await response.json();
      console.log('✅ Message sent successfully');
      
      // Add the new message to the current messages
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        error: null
      }));

      return newMessage;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage
      }));
      
      toast({
        variant: "destructive",
        title: "Erro ao Enviar Mensagem",
        description: errorMessage
      });
      
      throw error;
    }
  }, []);

  // Set active room
  const setActiveRoom = useCallback((room: ChatRoom | null) => {
    console.log('🔄 Setting active room:', room?.name || 'none');
    setState(prev => ({ 
      ...prev, 
      activeRoom: room,
      messages: [], // Clear messages when switching rooms
      participants: [], // Clear participants when switching rooms
      error: null // Clear any previous errors
    }));
    
    if (room) {
      // Fetch data for the new room
      Promise.all([
        fetchMessages(room.id).catch(console.error),
        fetchParticipants(room.id).catch(console.error),
        markAsRead(room.id).catch(console.error)
      ]);
    }
  }, [fetchMessages, fetchParticipants, markAsRead]);

  // Mark messages as read
  const markAsRead = useCallback(async (roomId: number) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Failed to mark messages as read:', response.status);
        return;
      }
      
      console.log('✅ Messages marked as read for room', roomId);
    } catch (error) {
      console.warn('❌ Failed to mark messages as read:', error);
      // Don't throw or show toast for this non-critical operation
    }
  }, []);

  // Initialize chat
  useEffect(() => {
    console.log('🔄 Initializing chat...');
    fetchRooms().catch(console.error);
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
