-- =============================================================================
-- SCRIPT SQL PARA CONFIGURAR SISTEMA DE CHAT NO SUPABASE
-- =============================================================================
-- Execute este script no SQL Editor do Supabase: http://82.25.69.57:8162/project/default/sql
-- =============================================================================

-- Tabela de salas de chat
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

-- Tabela de participantes das salas
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'moderator', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, user_id)
);

-- Tabela de mensagens
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_active ON chat_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_chat_rooms_updated_at 
  BEFORE UPDATE ON chat_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at 
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =============================================================================

-- Política para chat_rooms: controla quem pode ver quais salas
CREATE POLICY "Users can view accessible rooms" ON chat_rooms
  FOR SELECT USING (
    -- Usuários podem ver salas onde são participantes
    id IN (
      SELECT room_id FROM chat_participants 
      WHERE user_id = auth.uid()
    )
    OR 
    -- Servidores podem ver salas gerais, departamentais e de suporte
    (type IN ('general', 'department', 'citizen_support') AND EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario != 'cidadao'
    ))
    OR
    -- Criadores podem ver suas próprias salas
    created_by = auth.uid()
  );

-- Política para inserir salas: apenas admins e servidores
CREATE POLICY "Admins and servers can create rooms" ON chat_rooms
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario IN ('super_admin', 'admin', 'secretario', 'funcionario')
    )
  );

-- Política para chat_participants: ver participantes de salas acessíveis
CREATE POLICY "Users can view participants of accessible rooms" ON chat_participants
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE id IN (
        SELECT room_id FROM chat_participants 
        WHERE user_id = auth.uid()
      )
      OR (type IN ('general', 'department', 'citizen_support') AND EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND tipo_usuario != 'cidadao'
      ))
      OR created_by = auth.uid()
    )
  );

-- Política para inserir participantes
CREATE POLICY "Users can join rooms or be added" ON chat_participants
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario IN ('super_admin', 'admin', 'secretario')
    )
  );

-- Política para chat_messages: ver mensagens de salas acessíveis
CREATE POLICY "Users can view messages from accessible rooms" ON chat_messages
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE id IN (
        SELECT room_id FROM chat_participants 
        WHERE user_id = auth.uid()
      )
      OR (type IN ('general', 'department', 'citizen_support') AND EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND tipo_usuario != 'cidadao'
      ))
      OR created_by = auth.uid()
    )
  );

-- Política para inserir mensagens: apenas em salas acessíveis
CREATE POLICY "Users can send messages to accessible rooms" ON chat_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE id IN (
        SELECT room_id FROM chat_participants 
        WHERE user_id = auth.uid()
      )
      OR (type IN ('general', 'department', 'citizen_support') AND EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND tipo_usuario != 'cidadao'
      ))
      OR created_by = auth.uid()
    )
  );

-- =============================================================================
-- HABILITAR REALTIME
-- =============================================================================

-- Habilitar realtime para as tabelas do chat
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;

-- =============================================================================
-- DADOS DE TESTE
-- =============================================================================

-- Criar salas de exemplo
INSERT INTO chat_rooms (name, type, description, is_active, created_by)
VALUES 
  ('Suporte Geral', 'general', 'Sala geral para comunicação entre servidores', true, '4d3b26d0-f64a-402d-8608-ccc0faf6b151'),
  ('Secretaria de Saúde', 'department', 'Canal da Secretaria de Saúde', true, '4d3b26d0-f64a-402d-8608-ccc0faf6b151'),
  ('Secretaria de Educação', 'department', 'Canal da Secretaria de Educação', true, '4d3b26d0-f64a-402d-8608-ccc0faf6b151')
ON CONFLICT DO NOTHING;

-- Criar sala de suporte para o cidadão de teste
INSERT INTO chat_rooms (name, type, description, is_active, created_by)
VALUES 
  ('Suporte - João Cidadão', 'citizen_support', 'Sala de suporte para João Cidadão', true, '692b6d1f-918f-4bf4-af4c-55325666c371')
ON CONFLICT DO NOTHING;

-- Adicionar participantes às salas
INSERT INTO chat_participants (room_id, user_id, role)
SELECT cr.id, '692b6d1f-918f-4bf4-af4c-55325666c371', 'participant'
FROM chat_rooms cr 
WHERE cr.name = 'Suporte - João Cidadão'
ON CONFLICT (room_id, user_id) DO NOTHING;

-- Adicionar admin nas salas gerais
INSERT INTO chat_participants (room_id, user_id, role)
SELECT cr.id, '4d3b26d0-f64a-402d-8608-ccc0faf6b151', 'admin'
FROM chat_rooms cr 
WHERE cr.type IN ('general', 'department')
ON CONFLICT (room_id, user_id) DO NOTHING;

-- Adicionar mensagens de exemplo
INSERT INTO chat_messages (room_id, user_id, message, message_type)
SELECT 
  cr.id,
  '692b6d1f-918f-4bf4-af4c-55325666c371',
  'Olá! Preciso de ajuda com um serviço municipal.',
  'text'
FROM chat_rooms cr 
WHERE cr.name = 'Suporte - João Cidadão'
LIMIT 1;

INSERT INTO chat_messages (room_id, user_id, message, message_type)
SELECT 
  cr.id,
  '4d3b26d0-f64a-402d-8608-ccc0faf6b151',
  'Olá! Como posso ajudá-lo hoje?',
  'text'
FROM chat_rooms cr 
WHERE cr.name = 'Suporte - João Cidadão'
LIMIT 1;

-- =============================================================================
-- FUNÇÃO PARA CRIAR SALA DE SUPORTE AUTOMÁTICA PARA NOVOS CIDADÃOS
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

-- Trigger para criar sala automaticamente ao cadastrar cidadão
DROP TRIGGER IF EXISTS auto_create_citizen_support_room ON user_profiles;
CREATE TRIGGER auto_create_citizen_support_room
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_citizen_support_room();

-- =============================================================================
-- VERIFICAÇÃO FINAL
-- =============================================================================

-- Verificar se as tabelas foram criadas
SELECT 
  'chat_rooms' as tabela,
  COUNT(*) as registros
FROM chat_rooms
UNION ALL
SELECT 
  'chat_participants' as tabela,
  COUNT(*) as registros  
FROM chat_participants
UNION ALL
SELECT 
  'chat_messages' as tabela,
  COUNT(*) as registros
FROM chat_messages;

-- Verificar salas criadas
SELECT 
  id,
  name,
  type,
  description,
  is_active,
  created_at
FROM chat_rooms
ORDER BY created_at;

-- =============================================================================
-- SCRIPT EXECUTADO COM SUCESSO!
-- =============================================================================
-- Agora o sistema de chat está configurado e pronto para uso.
-- 
-- Para testar:
-- 1. Cidadão: http://localhost:8081/cidadao/login (cidadao@teste.com / 123456)
-- 2. Admin: http://localhost:8081/admin/login (admin@cidade.gov.br / 123456)
-- =============================================================================