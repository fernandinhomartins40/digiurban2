
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
  click_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir categorias padrão
INSERT INTO alert_categories (name, description, color, icon) VALUES
('Saúde Pública', 'Alertas relacionados à saúde e campanhas de vacinação', '#10B981', 'heart'),
('Segurança', 'Alertas de segurança pública e emergências', '#EF4444', 'shield'),
('Trânsito', 'Informações sobre trânsito e obras viárias', '#F59E0B', 'car'),
('Educação', 'Comunicados escolares e educacionais', '#3B82F6', 'book'),
('Meio Ambiente', 'Alertas ambientais e sustentabilidade', '#22C55E', 'leaf'),
('Eventos', 'Divulgação de eventos municipais', '#8B5CF6', 'calendar'),
('Serviços Públicos', 'Informações sobre serviços municipais', '#6B7280', 'settings'),
('Emergência', 'Alertas de emergência e calamidades', '#DC2626', 'alert-triangle')
ON CONFLICT DO NOTHING;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_type ON citizen_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_priority ON citizen_alerts(priority);
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_active ON citizen_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_citizen_alerts_schedule ON citizen_alerts(schedule_at);
CREATE INDEX IF NOT EXISTS idx_alert_recipients_user ON alert_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_recipients_read ON alert_recipients(is_read);
