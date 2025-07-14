export interface ChatRoom {
  id: number;
  name: string;
  type: 'general' | 'department' | 'support';
  department?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  participants_count?: number;
  unread_count?: number;
  last_message?: {
    id: number;
    message: string;
    user_name: string;
    created_at: Date;
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
  created_at: Date;
  updated_at: Date;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  reply_message?: {
    id: number;
    message: string;
    user: {
      name: string;
    };
  };
}

export interface ChatParticipant {
  id: number;
  room_id: number;
  user_id: number;
  role: 'participant' | 'moderator' | 'admin';
  joined_at: Date;
  last_seen: Date;
}

export interface SendMessageRequest {
  message: string;
  message_type?: 'text' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  reply_to?: number;
}

export interface CreateRoomRequest {
  name: string;
  type?: 'general' | 'department' | 'support';
  department?: string;
}

export interface MessageReaction {
  id: number;
  message_id: number;
  user_id: number;
  reaction: string;
  created_at: Date;
} 