import { supabase } from './supabase'
import { useAuth } from '../contexts/AuthContext'

export interface ChatRoom {
  id: string
  name: string
  type: 'general' | 'department' | 'support' | 'citizen_support'
  description?: string
  is_active: boolean
  department_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  message: string
  message_type: 'text' | 'file' | 'system'
  file_url?: string
  file_name?: string
  reply_to?: string
  created_at: string
  updated_at: string
  user?: {
    id: string
    nome_completo: string
    email: string
    tipo_usuario: string
  }
  reply_message?: ChatMessage
}

export interface ChatParticipant {
  id: string
  room_id: string
  user_id: string
  role: 'participant' | 'moderator' | 'admin'
  joined_at: string
  last_seen?: string
  user?: {
    id: string
    nome_completo: string
    email: string
    tipo_usuario: string
  }
}

export const chatService = {
  // Buscar ou criar sala de suporte para o cidadão
  async getOrCreateSupportRoom(citizenId: string): Promise<ChatRoom> {
    // Verificar se já existe uma sala de suporte para este cidadão
    const { data: existingRoom, error: searchError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('type', 'citizen_support')
      .eq('created_by', citizenId)
      .eq('is_active', true)
      .single()

    if (existingRoom && !searchError) {
      return existingRoom
    }

    // Se não existe, criar uma nova sala
    const { data: newRoom, error: createError } = await supabase
      .from('chat_rooms')
      .insert([{
        name: `Suporte - Cidadão`,
        type: 'citizen_support',
        description: 'Sala de suporte ao cidadão',
        is_active: true,
        created_by: citizenId
      }])
      .select()
      .single()

    if (createError) throw createError
    if (!newRoom) throw new Error('Erro ao criar sala de chat')

    // Adicionar o cidadão como participante
    await this.addParticipant(newRoom.id, citizenId, 'participant')

    return newRoom
  },

  // Buscar salas do usuário
  async getUserRooms(userId: string, userType: string): Promise<ChatRoom[]> {
    let query = supabase
      .from('chat_rooms')
      .select(`
        *,
        chat_participants!inner(user_id)
      `)
      .eq('is_active', true)

    if (userType === 'cidadao') {
      // Cidadãos veem apenas suas salas de suporte
      query = query.eq('created_by', userId)
    } else {
      // Servidores veem salas gerais, departamentais e de suporte
      query = query.or(`type.eq.general,type.eq.department,type.eq.citizen_support`)
    }

    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar mensagens de uma sala
  async getRoomMessages(roomId: string, limit = 50): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user:user_profiles(id, nome_completo, email, tipo_usuario),
        reply_message:chat_messages!reply_to(
          id,
          message,
          user:user_profiles(id, nome_completo)
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Enviar mensagem
  async sendMessage(roomId: string, message: string, userId: string, replyTo?: string): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        room_id: roomId,
        user_id: userId,
        message: message.trim(),
        message_type: 'text',
        reply_to: replyTo
      }])
      .select(`
        *,
        user:user_profiles(id, nome_completo, email, tipo_usuario)
      `)
      .single()

    if (error) throw error
    if (!data) throw new Error('Erro ao enviar mensagem')

    // Atualizar timestamp da sala
    await supabase
      .from('chat_rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', roomId)

    return data
  },

  // Adicionar participante à sala
  async addParticipant(roomId: string, userId: string, role: 'participant' | 'moderator' | 'admin' = 'participant'): Promise<void> {
    const { error } = await supabase
      .from('chat_participants')
      .upsert([{
        room_id: roomId,
        user_id: userId,
        role,
        last_seen: new Date().toISOString()
      }])

    if (error) throw error
  },

  // Buscar participantes de uma sala
  async getRoomParticipants(roomId: string): Promise<ChatParticipant[]> {
    const { data, error } = await supabase
      .from('chat_participants')
      .select(`
        *,
        user:user_profiles(id, nome_completo, email, tipo_usuario)
      `)
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Buscar salas de suporte disponíveis para servidores
  async getSupportRooms(): Promise<ChatRoom[]> {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        creator:user_profiles!created_by(nome_completo, email),
        latest_message:chat_messages(message, created_at)
      `)
      .eq('type', 'citizen_support')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Marcar mensagens como lidas
  async markMessagesAsRead(roomId: string, userId: string): Promise<void> {
    // Atualizar last_seen do participante
    const { error } = await supabase
      .from('chat_participants')
      .update({ last_seen: new Date().toISOString() })
      .eq('room_id', roomId)
      .eq('user_id', userId)

    if (error) throw error
  },

  // Subscrever a mudanças em tempo real
  subscribeToRoom(roomId: string, onMessage: (message: ChatMessage) => void) {
    return supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // Buscar mensagem completa com dados do usuário
          const { data } = await supabase
            .from('chat_messages')
            .select(`
              *,
              user:user_profiles(id, nome_completo, email, tipo_usuario)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            onMessage(data)
          }
        }
      )
      .subscribe()
  },

  // Criar sala geral/departamental (apenas para admins)
  async createRoom(name: string, type: 'general' | 'department', departmentId?: string, createdBy?: string): Promise<ChatRoom> {
    const { data, error } = await supabase
      .from('chat_rooms')
      .insert([{
        name,
        type,
        department_id: departmentId,
        is_active: true,
        created_by: createdBy
      }])
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Erro ao criar sala')

    return data
  }
}