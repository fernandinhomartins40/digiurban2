-- =====================================================
-- 06_alertas_notificacoes.sql
-- Sistema de alertas e notificações
-- =====================================================

-- Tipos de alerta
CREATE TYPE tipo_alerta AS ENUM (
    'info',
    'success',
    'warning',
    'error',
    'urgent'
);

-- Tipos de notificação
CREATE TYPE tipo_notificacao AS ENUM (
    'sistema',
    'atendimento',
    'protocolo',
    'prazo',
    'lembrete',
    'aprovacao'
);

-- Status de notificação
CREATE TYPE status_notificacao AS ENUM (
    'pendente',
    'enviada',
    'lida',
    'erro'
);

-- =====================================================
-- TABELA: Alertas do sistema
-- =====================================================
CREATE TABLE alertas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo tipo_alerta NOT NULL DEFAULT 'info',
    
    -- Destinatários
    destinatario_tipo VARCHAR(50), -- 'todos', 'secretaria', 'setor', 'perfil', 'usuario'
    destinatario_id UUID, -- ID da secretaria, setor, perfil ou usuário
    
    -- Configurações
    ativo BOOLEAN DEFAULT true,
    fixo BOOLEAN DEFAULT false, -- true = sempre visível
    data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_fim TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Notificações
-- =====================================================
CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Conteúdo
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo tipo_notificacao NOT NULL,
    
    -- Destinatário
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Referência (opcional)
    referencia_tabela VARCHAR(100), -- Ex: 'atendimentos', 'protocolos'
    referencia_id UUID,
    
    -- Status
    status status_notificacao DEFAULT 'pendente',
    lida_em TIMESTAMP WITH TIME ZONE,
    
    -- Configurações
    push_notification BOOLEAN DEFAULT false,
    email_notification BOOLEAN DEFAULT false,
    sms_notification BOOLEAN DEFAULT false,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABELA: Configurações de notificação por usuário
-- =====================================================
CREATE TABLE user_notificacao_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Preferências por tipo
    notif_sistema_push BOOLEAN DEFAULT true,
    notif_sistema_email BOOLEAN DEFAULT true,
    notif_sistema_sms BOOLEAN DEFAULT false,
    
    notif_atendimento_push BOOLEAN DEFAULT true,
    notif_atendimento_email BOOLEAN DEFAULT true,
    notif_atendimento_sms BOOLEAN DEFAULT false,
    
    notif_protocolo_push BOOLEAN DEFAULT true,
    notif_protocolo_email BOOLEAN DEFAULT true,
    notif_protocolo_sms BOOLEAN DEFAULT false,
    
    notif_prazo_push BOOLEAN DEFAULT true,
    notif_prazo_email BOOLEAN DEFAULT true,
    notif_prazo_sms BOOLEAN DEFAULT true,
    
    -- Configurações gerais
    horario_nao_perturbe_inicio TIME DEFAULT '22:00',
    horario_nao_perturbe_fim TIME DEFAULT '06:00',
    dias_nao_perturbe INTEGER[] DEFAULT ARRAY[0, 6], -- 0=domingo, 6=sábado
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(usuario_id)
);

-- =====================================================
-- TABELA: Templates de notificação
-- =====================================================
CREATE TABLE notificacao_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(100) UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    tipo tipo_notificacao NOT NULL,
    
    -- Templates
    titulo_template VARCHAR(200) NOT NULL,
    mensagem_template TEXT NOT NULL,
    email_subject_template VARCHAR(200),
    email_body_template TEXT,
    sms_template VARCHAR(160),
    
    -- Variáveis aceitas (JSON)
    variaveis_disponiveis JSONB,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Log de envio de notificações
-- =====================================================
CREATE TABLE notificacao_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notificacao_id UUID REFERENCES notificacoes(id),
    
    -- Detalhes do envio
    canal VARCHAR(50) NOT NULL, -- push, email, sms
    destinatario VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL, -- enviado, erro, pendente
    tentativas INTEGER DEFAULT 1,
    erro_detalhes TEXT,
    
    -- Resposta do serviço
    response_data JSONB,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: Regras de notificação automática
-- =====================================================
CREATE TABLE notificacao_regras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    
    -- Condições
    evento VARCHAR(100) NOT NULL, -- Ex: 'atendimento_criado', 'prazo_vencendo'
    condicoes JSONB, -- Condições em formato JSON
    
    -- Ação
    template_id UUID REFERENCES notificacao_templates(id),
    destinatarios_query TEXT, -- Query SQL para buscar destinatários
    
    -- Configurações
    ativo BOOLEAN DEFAULT true,
    delay_minutos INTEGER DEFAULT 0,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Lembretes
-- =====================================================
CREATE TABLE lembretes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Conteúdo
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    
    -- Destinatário
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Agendamento
    data_lembrete TIMESTAMP WITH TIME ZONE NOT NULL,
    repetir VARCHAR(50) DEFAULT 'nao', -- nao, diario, semanal, mensal
    repetir_ate TIMESTAMP WITH TIME ZONE,
    
    -- Referência (opcional)
    referencia_tabela VARCHAR(100),
    referencia_id UUID,
    
    -- Status
    enviado BOOLEAN DEFAULT false,
    data_envio TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para criar configuração padrão de notificações para novos usuários
CREATE OR REPLACE FUNCTION create_default_notification_config()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_notificacao_config (usuario_id)
    VALUES (NEW.id)
    ON CONFLICT (usuario_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_notification_config
    AFTER INSERT ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION create_default_notification_config();

-- Triggers para updated_at
CREATE TRIGGER update_alertas_updated_at 
    BEFORE UPDATE ON alertas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notificacao_config_updated_at 
    BEFORE UPDATE ON user_notificacao_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notificacao_templates_updated_at 
    BEFORE UPDATE ON notificacao_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notificacao_regras_updated_at 
    BEFORE UPDATE ON notificacao_regras 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lembretes_updated_at 
    BEFORE UPDATE ON lembretes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para alertas
CREATE INDEX idx_alertas_tipo ON alertas(tipo);
CREATE INDEX idx_alertas_ativo ON alertas(ativo);
CREATE INDEX idx_alertas_destinatario ON alertas(destinatario_tipo, destinatario_id);
CREATE INDEX idx_alertas_periodo ON alertas(data_inicio, data_fim);

-- Índices para notificações
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_tipo ON notificacoes(tipo);
CREATE INDEX idx_notificacoes_status ON notificacoes(status);
CREATE INDEX idx_notificacoes_referencia ON notificacoes(referencia_tabela, referencia_id);
CREATE INDEX idx_notificacoes_created_at ON notificacoes(created_at);
CREATE INDEX idx_notificacoes_expires_at ON notificacoes(expires_at);

-- Índices para logs
CREATE INDEX idx_notificacao_logs_notificacao ON notificacao_logs(notificacao_id);
CREATE INDEX idx_notificacao_logs_canal ON notificacao_logs(canal);
CREATE INDEX idx_notificacao_logs_status ON notificacao_logs(status);
CREATE INDEX idx_notificacao_logs_created_at ON notificacao_logs(created_at);

-- Índices para lembretes
CREATE INDEX idx_lembretes_usuario ON lembretes(usuario_id);
CREATE INDEX idx_lembretes_data ON lembretes(data_lembrete);
CREATE INDEX idx_lembretes_enviado ON lembretes(enviado);
CREATE INDEX idx_lembretes_referencia ON lembretes(referencia_tabela, referencia_id);