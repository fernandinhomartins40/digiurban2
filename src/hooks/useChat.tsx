
import { useState, useEffect, useCallback } from 'react';
import { ChatRoom, ChatMessage, ChatParticipant, ChatState, SendMessageRequest } from '@/types/chat';
import { toast } from '@/components/ui/use-toast';

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
      const response = await fetch('/api/chat/rooms');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const rooms: ChatRoom[] = await response.json();
      console.log('✅ Chat rooms fetched:', rooms.length, 'rooms');
      setState(prev => ({ ...prev, rooms, isLoading: false }));
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
    }
  }, []);

  // Fetch messages for a room
  const fetchMessages = useCallback(async (roomId: number, page = 1) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log(`🔄 Fetching messages for room ${roomId}...`);
      const response = await fetch(`/api/chat/rooms/${roomId}/messages?page=${page}&limit=50`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const messages: ChatMessage[] = await response.json();
      console.log('✅ Messages fetched:', messages.length, 'messages');
      setState(prev => ({ ...prev, messages, isLoading: false }));
    } catch (error) {
      console.error('❌ Failed to fetch messages:', error);
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
      console.log(`🔄 Fetching participants for room ${roomId}...`);
      const response = await fetch(`/api/chat/rooms/${roomId}/participants`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch participants: ${response.status}`);
      }
      
      const participants: ChatParticipant[] = await response.json();
      console.log('✅ Participants fetched:', participants.length, 'participants');
      setState(prev => ({ ...prev, participants }));
    } catch (error) {
      console.error('❌ Failed to fetch participants:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch participants'
      }));
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
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      const newMessage: ChatMessage = await response.json();
      console.log('✅ Message sent successfully');
      
      // Add the new message to the current messages
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));

      return newMessage;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
      throw error;
    }
  }, []);

  // Set active room
  const setActiveRoom = useCallback((room: ChatRoom | null) => {
    console.log('🔄 Setting active room:', room?.name || 'none');
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
      console.log('✅ Messages marked as read for room', roomId);
    } catch (error) {
      console.error('❌ Failed to mark messages as read:', error);
    }
  }, []);

  // Initialize chat
  useEffect(() => {
    console.log('🔄 Initializing chat...');
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
