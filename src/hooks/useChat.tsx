import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, ChatRoom, ChatMessage, ChatParticipant } from '../lib/chat';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface ChatState {
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  messages: ChatMessage[];
  participants: ChatParticipant[];
  isLoading: boolean;
  error: string | null;
}

export const useChat = () => {
  const { user, profile } = useAuth();
  const [state, setState] = useState<ChatState>({
    rooms: [],
    activeRoom: null,
    messages: [],
    participants: [],
    isLoading: false,
    error: null
  });

  const subscriptionRef = useRef<any>(null);

  // Buscar salas do usuário
  const fetchRooms = useCallback(async () => {
    if (!user || !profile) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🔄 Fetching chat rooms...');
      
      let rooms: ChatRoom[] = [];

      if (profile.tipo_usuario === 'cidadao') {
        // Para cidadãos: buscar conversas diretas e sala de suporte
        const [directRooms, supportRoom] = await Promise.all([
          chatService.getDirectRooms(user.id),
          chatService.getOrCreateSupportRoom(user.id)
        ]);
        rooms = [...directRooms, supportRoom];
      } else {
        // Para servidores: buscar todas as salas + conversas diretas
        const [generalRooms, supportRooms, directRooms] = await Promise.all([
          chatService.getUserRooms(user.id, profile.tipo_usuario),
          chatService.getSupportRooms(),
          chatService.getDirectRooms(user.id)
        ]);
        rooms = [...directRooms, ...generalRooms, ...supportRooms];
      }
      
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

      toast.error("Não foi possível carregar as salas de chat.");
      
      throw error;
    }
  }, [user, profile]);

  // Buscar mensagens de uma sala
  const fetchMessages = useCallback(async (roomId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log(`🔄 Fetching messages for room ${roomId}...`);
      const messages = await chatService.getRoomMessages(roomId);
      
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
      
      toast.error("Erro ao carregar mensagens");
      
      throw error;
    }
  }, []);

  // Buscar participantes de uma sala
  const fetchParticipants = useCallback(async (roomId: string) => {
    try {
      console.log(`🔄 Fetching participants for room ${roomId}...`);
      const participants = await chatService.getRoomParticipants(roomId);
      
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
      
      throw error;
    }
  }, []);

  // Enviar mensagem
  const sendMessage = useCallback(async (roomId: string, messageData: { message: string; reply_to?: string }) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      console.log(`🔄 Sending message to room ${roomId}...`);
      const newMessage = await chatService.sendMessage(
        roomId, 
        messageData.message, 
        user.id, 
        messageData.reply_to
      );
      
      console.log('✅ Message sent successfully');
      
      // A mensagem será adicionada via subscription em tempo real
      return newMessage;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage
      }));
      
      toast.error("Erro ao enviar mensagem");
      
      throw error;
    }
  }, [user]);

  // Definir sala ativa
  const setActiveRoom = useCallback((room: ChatRoom | null) => {
    console.log('🔄 Setting active room:', room?.name || 'none');
    
    // Cancelar subscription anterior
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    setState(prev => ({ 
      ...prev, 
      activeRoom: room,
      messages: [],
      participants: [],
      error: null
    }));
    
    if (room && user) {
      // Buscar dados da nova sala
      Promise.all([
        fetchMessages(room.id).catch(console.error),
        fetchParticipants(room.id).catch(console.error),
        chatService.markMessagesAsRead(room.id, user.id).catch(console.error)
      ]);

      // Subscribir para mensagens em tempo real
      subscriptionRef.current = chatService.subscribeToRoom(room.id, (newMessage) => {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage]
        }));
      });
    }
  }, [fetchMessages, fetchParticipants, user]);

  // Marcar mensagens como lidas
  const markAsRead = useCallback(async (roomId: string) => {
    if (!user) return;

    try {
      await chatService.markMessagesAsRead(roomId, user.id);
      console.log('✅ Messages marked as read for room', roomId);
    } catch (error) {
      console.warn('❌ Failed to mark messages as read:', error);
    }
  }, [user]);

  // Inicializar chat
  useEffect(() => {
    if (user && profile) {
      console.log('🔄 Initializing chat...');
      fetchRooms().catch(console.error);
    }

    // Cleanup subscription ao desmontar
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [fetchRooms, user, profile]);

  // Criar conversa direta com usuário
  const createDirectChat = useCallback(async (otherUserId: string, otherUserName: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      console.log(`🔄 Creating direct chat with user ${otherUserId}...`);
      
      const directRoom = await chatService.getOrCreateDirectRoom(user.id, otherUserId);
      
      console.log('✅ Direct chat created/found:', directRoom.id);
      
      // Atualizar lista de salas
      await fetchRooms();
      
      // Definir como sala ativa
      setActiveRoom(directRoom);
      
      return directRoom;
    } catch (error) {
      console.error('❌ Failed to create direct chat:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create direct chat';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage
      }));
      
      toast.error("Erro ao criar conversa");
      
      throw error;
    }
  }, [user, fetchRooms, setActiveRoom]);

  return {
    ...state,
    fetchRooms,
    fetchMessages,
    fetchParticipants,
    sendMessage,
    setActiveRoom,
    markAsRead,
    createDirectChat
  };
};