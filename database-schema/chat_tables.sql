-- Tabelas para o sistema de chat

-- Tabela de salas de chat
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('general', 'department', 'support', 'citizen_support')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  department_id UUID REFERENCES secretarias(id),
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de participantes das salas
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'moderator', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, user_id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  file_url TEXT,
  file_name TEXT,
  reply_to UUID REFERENCES chat_messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_active ON chat_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Política para chat_rooms: usuários podem ver salas onde são participantes
CREATE POLICY "Users can view rooms they participate in" ON chat_rooms
  FOR SELECT USING (
    id IN (
      SELECT room_id FROM chat_participants 
      WHERE user_id = auth.uid()
    )
    OR 
    (type IN ('general', 'department') AND auth.jwt() ->> 'tipo_usuario' != 'cidadao')
    OR
    (type = 'citizen_support' AND created_by = auth.uid())
  );

-- Política para chat_participants: usuários podem ver participantes das salas onde estão
CREATE POLICY "Users can view participants of rooms they are in" ON chat_participants
  FOR SELECT USING (
    room_id IN (
      SELECT room_id FROM chat_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Política para chat_messages: usuários podem ver mensagens das salas onde são participantes
CREATE POLICY "Users can view messages from rooms they participate in" ON chat_messages
  FOR SELECT USING (
    room_id IN (
      SELECT room_id FROM chat_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Política para inserir mensagens: apenas em salas onde o usuário é participante
CREATE POLICY "Users can send messages to rooms they participate in" ON chat_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    room_id IN (
      SELECT room_id FROM chat_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Política para inserir participantes: admins podem adicionar, usuários podem se auto-adicionar em salas públicas
CREATE POLICY "Users can join public rooms or be added by admins" ON chat_participants
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR
    (
      auth.jwt() ->> 'tipo_usuario' IN ('super_admin', 'admin', 'secretario')
    )
  );

-- Função para criar sala de suporte automaticamente para cidadãos
CREATE OR REPLACE FUNCTION create_citizen_support_room()
RETURNS TRIGGER AS $$
DECLARE
  room_id UUID;
BEGIN
  -- Criar sala de suporte apenas para cidadãos
  IF NEW.tipo_usuario = 'cidadao' THEN
    INSERT INTO chat_rooms (name, type, description, created_by)
    VALUES (
      'Suporte - ' || NEW.nome_completo,
      'citizen_support',
      'Sala de suporte para ' || NEW.nome_completo,
      NEW.id
    )
    RETURNING id INTO room_id;
    
    -- Adicionar o cidadão como participante
    INSERT INTO chat_participants (room_id, user_id, role)
    VALUES (room_id, NEW.id, 'participant');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar sala automaticamente ao cadastrar cidadão
CREATE TRIGGER auto_create_citizen_support_room
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_citizen_support_room();