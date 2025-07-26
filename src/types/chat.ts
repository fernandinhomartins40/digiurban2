
export interface ChatRoom {
  id: number;
  name: string;
  type: 'general' | 'department' | 'support';
  department?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  last_message?: ChatMessage;
  participants_count?: number;
}

export interface ChatParticipant {
  id: number;
  room_id: number;
  user_id: number;
  role: 'participant' | 'moderator' | 'admin';
  joined_at: string;
  last_seen: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
}

export interface ChatMessage {
  id: number;
  room_id: number;
  user_id: number;
  message: string;
  message_type: 'text' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  reply_to?: number;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  reactions?: ChatMessageReaction[];
  reply_message?: ChatMessage;
}

export interface ChatMessageReaction {
  id: number;
  message_id: number;
  user_id: number;
  reaction: 'like' | 'helpful' | 'resolved';
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface ChatState {
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  messages: ChatMessage[];
  participants: ChatParticipant[];
  isLoading: boolean;
  error: string | null;
}

export interface SendMessageRequest {
  room_id: number;
  message: string;
  message_type?: 'text' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  reply_to?: number;
}

export type ChatStatus = 'online' | 'away' | 'offline';

export interface UserStatus {
  user_id: number;
  status: ChatStatus;
  last_seen: string;
}
