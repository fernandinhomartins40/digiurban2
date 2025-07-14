-- DigiUrban Sistema Municipal - Schema Completo

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de documentos
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat system database schema

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'general', -- 'general', 'department', 'support'
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_room_type CHECK (type IN ('general', 'department', 'support'))
);

-- Chat participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'participant', -- 'participant', 'moderator', 'admin'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, user_id),
  CONSTRAINT valid_participant_role CHECK (role IN ('participant', 'moderator', 'admin'))
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'file', 'system'
  file_url VARCHAR(500),
  file_name VARCHAR(255),
  reply_to INTEGER REFERENCES chat_messages(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'file', 'system')),
  CONSTRAINT non_empty_message CHECK (LENGTH(TRIM(message)) > 0)
);

-- Chat message reactions table
CREATE TABLE IF NOT EXISTS chat_message_reactions (
  id SERIAL PRIMARY KEY,
  message_id INTEGER NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reaction VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(message_id, user_id, reaction)
);

-- Sistema de Alertas e Mensagens para Cidadãos

-- Tabela de categorias de alertas
CREATE TABLE IF NOT EXISTS alert_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Cor hex para identificação visual
  icon VARCHAR(50) DEFAULT 'bell',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela principal de alertas/mensagens
CREATE TABLE IF NOT EXISTS citizen_alerts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  alert_type VARCHAR(50) NOT NULL DEFAULT 'info', -- info, warning, urgent, emergency
  category_id INTEGER REFERENCES alert_categories(id),
  priority INTEGER DEFAULT 1, -- 1=baixa, 2=média, 3=alta, 4=crítica
  target_type VARCHAR(50) NOT NULL DEFAULT 'all', -- all, department, region, custom
  target_criteria JSONB, -- Critérios de segmentação
  sender_id INTEGER REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  schedule_at TIMESTAMP WITH TIME ZONE, -- Para mensagens agendadas
  expires_at TIMESTAMP WITH TIME ZONE, -- Data de expiração
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de destinatários dos alertas
CREATE TABLE IF NOT EXISTS alert_recipients (
  id SERIAL PRIMARY KEY,
  alert_id INTEGER REFERENCES citizen_alerts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(alert_id, user_id)
);

-- Tabela de estatísticas de entrega
CREATE TABLE IF NOT EXISTS alert_delivery_stats (
  id SERIAL PRIMARY KEY,
  alert_id INTEGER REFERENCES citizen_alerts(id) ON DELETE CASCADE,
  total_recipients INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers para atualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_citizen_alerts_updated_at BEFORE UPDATE ON citizen_alerts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_delivery_stats_updated_at BEFORE UPDATE ON alert_delivery_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- Chat índices
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_department ON chat_rooms(department);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_message_reactions_message ON chat_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_message_reactions_user ON chat_message_reactions(user_id);

-- Alert índices
CREATE INDEX IF NOT EXISTS idx_alert_categories_active ON alert_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_sender ON citizen_alerts(sender_id);
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_category ON citizen_alerts(category_id);
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_type ON citizen_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_priority ON citizen_alerts(priority);
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_active ON citizen_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_schedule ON citizen_alerts(schedule_at);
CREATE INDEX IF NOT EXISTS idx_alert_recipients_user ON alert_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_recipients_read ON alert_recipients(is_read);

-- Inserção de dados iniciais
INSERT INTO users (name, email, role) VALUES
  ('Admin Sistema', 'admin@digiurban.com', 'admin'),
  ('Secretário Saúde', 'saude@digiurban.com', 'secretary'),
  ('Secretário Educação', 'educacao@digiurban.com', 'secretary'),
  ('Operador Suporte', 'suporte@digiurban.com', 'support'),
  ('Cidadão Teste', 'cidadao@teste.com', 'citizen')
ON CONFLICT (email) DO NOTHING;

INSERT INTO alert_categories (name, description, color, icon) VALUES
  ('Emergência', 'Alertas de emergência e situações críticas', '#EF4444', 'alert-triangle'),
  ('Saúde', 'Informações sobre saúde pública', '#10B981', 'heart'),
  ('Educação', 'Comunicados sobre educação', '#3B82F6', 'book'),
  ('Transporte', 'Informações sobre transporte público', '#F59E0B', 'car'),
  ('Obras', 'Informações sobre obras públicas', '#8B5CF6', 'construction'),
  ('Eventos', 'Divulgação de eventos municipais', '#EC4899', 'calendar'),
  ('Geral', 'Informações gerais da prefeitura', '#6B7280', 'info')
ON CONFLICT DO NOTHING;

INSERT INTO chat_rooms (name, type, department) VALUES
  ('Suporte Geral', 'support', 'TI'),
  ('Secretaria de Saúde', 'department', 'Saúde'),
  ('Secretaria de Educação', 'department', 'Educação'),
  ('Obras Públicas', 'department', 'Obras'),
  ('Chat Geral', 'general', NULL)
ON CONFLICT DO NOTHING; 