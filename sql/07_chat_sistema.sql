-- =====================================================
-- 07_chat_sistema.sql
-- Sistema de chat interno
-- =====================================================

-- Tipos de chat
CREATE TYPE tipo_chat AS ENUM (
    'privado',      -- Entre 2 usuários
    'grupo',        -- Grupo fechado
    'departamento', -- Chat do departamento
    'atendimento'   -- Chat relacionado a atendimento
);

-- Status da mensagem
CREATE TYPE status_mensagem AS ENUM (
    'enviada',
    'entregue',
    'lida',
    'erro'
);

-- =====================================================
-- TABELA: Conversas/Chats
-- =====================================================
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200),
    descricao TEXT,
    tipo tipo_chat NOT NULL DEFAULT 'privado',
    
    -- Referência externa (opcional)
    referencia_tabela VARCHAR(100), -- Ex: 'atendimentos', 'protocolos'
    referencia_id UUID,
    
    -- Configurações
    ativo BOOLEAN DEFAULT true,
    arquivado BOOLEAN DEFAULT false,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Participantes do chat
-- =====================================================
CREATE TABLE chat_participantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Permissões
    admin BOOLEAN DEFAULT false,
    pode_adicionar_membros BOOLEAN DEFAULT false,
    pode_remover_membros BOOLEAN DEFAULT false,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    silenciado BOOLEAN DEFAULT false,
    data_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_saida TIMESTAMP WITH TIME ZONE,
    
    -- Última visualização
    ultima_visualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    adicionado_por UUID REFERENCES auth.users(id),
    
    UNIQUE(chat_id, usuario_id)
);

-- =====================================================
-- TABELA: Mensagens
-- =====================================================
CREATE TABLE mensagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    
    -- Remetente
    remetente_id UUID NOT NULL REFERENCES auth.users(id),
    remetente_nome VARCHAR(200) NOT NULL,
    
    -- Conteúdo
    conteudo TEXT NOT NULL,
    tipo_conteudo VARCHAR(50) DEFAULT 'texto', -- texto, imagem, arquivo, sistema
    
    -- Resposta/Thread
    resposta_mensagem_id UUID REFERENCES mensagens(id),
    
    -- Status
    status status_mensagem DEFAULT 'enviada',
    editada BOOLEAN DEFAULT false,
    data_edicao TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: Anexos de mensagens
-- =====================================================
CREATE TABLE mensagem_anexos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mensagem_id UUID NOT NULL REFERENCES mensagens(id) ON DELETE CASCADE,
    
    -- Arquivo
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_arquivo VARCHAR(100),
    tamanho_bytes BIGINT,
    url_arquivo TEXT NOT NULL,
    hash_arquivo VARCHAR(255),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Status de leitura das mensagens
-- =====================================================
CREATE TABLE mensagem_leituras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mensagem_id UUID NOT NULL REFERENCES mensagens(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Status
    lida BOOLEAN DEFAULT true,
    data_leitura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(mensagem_id, usuario_id)
);

-- =====================================================
-- TABELA: Mensagens fixadas
-- =====================================================
CREATE TABLE mensagens_fixadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    mensagem_id UUID NOT NULL REFERENCES mensagens(id) ON DELETE CASCADE,
    
    -- Controle
    fixada_por UUID REFERENCES auth.users(id),
    fixada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(chat_id, mensagem_id)
);

-- =====================================================
-- TABELA: Configurações de chat por usuário
-- =====================================================
CREATE TABLE user_chat_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Preferências
    som_notificacao BOOLEAN DEFAULT true,
    notif_push BOOLEAN DEFAULT true,
    notif_email BOOLEAN DEFAULT false,
    
    -- Status
    status_presenca VARCHAR(50) DEFAULT 'online', -- online, ausente, ocupado, invisivel
    mensagem_status VARCHAR(200),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(usuario_id)
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Função para marcar mensagens como lidas
CREATE OR REPLACE FUNCTION marcar_mensagens_como_lidas(
    p_chat_id UUID,
    p_usuario_id UUID,
    p_ultima_mensagem_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Se uma mensagem específica foi fornecida, marcar até ela
    IF p_ultima_mensagem_id IS NOT NULL THEN
        INSERT INTO mensagem_leituras (mensagem_id, usuario_id)
        SELECT m.id, p_usuario_id
        FROM mensagens m
        WHERE m.chat_id = p_chat_id
          AND m.remetente_id != p_usuario_id
          AND m.created_at <= (SELECT created_at FROM mensagens WHERE id = p_ultima_mensagem_id)
          AND NOT EXISTS (
              SELECT 1 FROM mensagem_leituras ml 
              WHERE ml.mensagem_id = m.id AND ml.usuario_id = p_usuario_id
          );
    ELSE
        -- Marcar todas as mensagens não lidas do chat
        INSERT INTO mensagem_leituras (mensagem_id, usuario_id)
        SELECT m.id, p_usuario_id
        FROM mensagens m
        WHERE m.chat_id = p_chat_id
          AND m.remetente_id != p_usuario_id
          AND NOT EXISTS (
              SELECT 1 FROM mensagem_leituras ml 
              WHERE ml.mensagem_id = m.id AND ml.usuario_id = p_usuario_id
          );
    END IF;
    
    -- Atualizar última visualização do participante
    UPDATE chat_participantes 
    SET ultima_visualizacao = NOW()
    WHERE chat_id = p_chat_id AND usuario_id = p_usuario_id;
END;
$$ LANGUAGE plpgsql;

-- Função para obter contagem de mensagens não lidas
CREATE OR REPLACE FUNCTION get_mensagens_nao_lidas(p_usuario_id UUID)
RETURNS TABLE(chat_id UUID, nao_lidas BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.chat_id,
        COUNT(m.id) as nao_lidas
    FROM mensagens m
    INNER JOIN chat_participantes cp ON cp.chat_id = m.chat_id
    WHERE cp.usuario_id = p_usuario_id
      AND cp.ativo = true
      AND m.remetente_id != p_usuario_id
      AND NOT EXISTS (
          SELECT 1 FROM mensagem_leituras ml 
          WHERE ml.mensagem_id = m.id AND ml.usuario_id = p_usuario_id
      )
    GROUP BY m.chat_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para atualizar timestamp do chat quando nova mensagem
CREATE OR REPLACE FUNCTION update_chat_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chats 
    SET updated_at = NOW()
    WHERE id = NEW.chat_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_on_new_message
    AFTER INSERT ON mensagens
    FOR EACH ROW EXECUTE FUNCTION update_chat_on_new_message();

-- Trigger para criar configuração padrão de chat para novos usuários
CREATE OR REPLACE FUNCTION create_default_chat_config()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_chat_config (usuario_id)
    VALUES (NEW.id)
    ON CONFLICT (usuario_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_chat_config
    AFTER INSERT ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION create_default_chat_config();

-- Triggers para updated_at
CREATE TRIGGER update_chats_updated_at 
    BEFORE UPDATE ON chats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mensagens_updated_at 
    BEFORE UPDATE ON mensagens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_chat_config_updated_at 
    BEFORE UPDATE ON user_chat_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para chats
CREATE INDEX idx_chats_tipo ON chats(tipo);
CREATE INDEX idx_chats_ativo ON chats(ativo);
CREATE INDEX idx_chats_referencia ON chats(referencia_tabela, referencia_id);
CREATE INDEX idx_chats_created_at ON chats(created_at);

-- Índices para participantes
CREATE INDEX idx_chat_participantes_chat ON chat_participantes(chat_id);
CREATE INDEX idx_chat_participantes_usuario ON chat_participantes(usuario_id);
CREATE INDEX idx_chat_participantes_ativo ON chat_participantes(ativo);

-- Índices para mensagens
CREATE INDEX idx_mensagens_chat ON mensagens(chat_id);
CREATE INDEX idx_mensagens_remetente ON mensagens(remetente_id);
CREATE INDEX idx_mensagens_created_at ON mensagens(created_at);
CREATE INDEX idx_mensagens_resposta ON mensagens(resposta_mensagem_id);
CREATE INDEX idx_mensagens_tipo ON mensagens(tipo_conteudo);

-- Índices para leituras
CREATE INDEX idx_mensagem_leituras_mensagem ON mensagem_leituras(mensagem_id);
CREATE INDEX idx_mensagem_leituras_usuario ON mensagem_leituras(usuario_id);

-- Índices para anexos
CREATE INDEX idx_mensagem_anexos_mensagem ON mensagem_anexos(mensagem_id);
CREATE INDEX idx_mensagem_anexos_tipo ON mensagem_anexos(tipo_arquivo);