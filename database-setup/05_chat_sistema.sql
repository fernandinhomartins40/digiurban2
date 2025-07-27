-- =============================================================================
-- 05_CHAT_SISTEMA.SQL - DigiUrban Database Setup
-- =============================================================================
-- Sistema seguro de chat e comunicação
-- Execute APÓS 04_servicos_protocolos.sql
-- =============================================================================

-- =============================================================================
-- TABELA: Salas de Chat
-- =============================================================================
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('general', 'department', 'support', 'citizen_support')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  department_id UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- TABELA: Participantes das Salas
-- =============================================================================
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'moderator', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, user_id)
);

-- =============================================================================
-- TABELA: Mensagens
-- =============================================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  file_url TEXT,
  file_name TEXT,
  reply_to UUID REFERENCES chat_messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_active ON chat_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- =============================================================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================================================
DROP TRIGGER IF EXISTS update_chat_rooms_updated_at ON chat_rooms;
CREATE TRIGGER update_chat_rooms_updated_at 
  BEFORE UPDATE ON chat_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at 
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- HABILITAR ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- FUNÇÃO PARA CRIAR SALA DE SUPORTE AUTOMÁTICA
-- =============================================================================
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
    
    -- Adicionar mensagem de boas-vindas
    INSERT INTO chat_messages (room_id, user_id, message, message_type)
    VALUES (
      room_id,
      NEW.id,
      'Olá! Esta é sua sala de suporte. Como podemos ajudá-lo hoje?',
      'system'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TRIGGER PARA CRIAR SALA AUTOMATICAMENTE
-- =============================================================================
DROP TRIGGER IF EXISTS auto_create_citizen_support_room ON user_profiles;
CREATE TRIGGER auto_create_citizen_support_room
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_citizen_support_room();

-- =============================================================================
-- HABILITAR REALTIME
-- =============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Sistema de chat configurado!';
    RAISE NOTICE 'Tabelas criadas: chat_rooms, chat_participants, chat_messages';
    RAISE NOTICE 'Realtime habilitado para todas as tabelas de chat';
    RAISE NOTICE 'Próximo passo: Execute 06_storage_setup.sql';
END $$;