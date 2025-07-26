-- =====================================================
-- 03_core_tables.sql
-- Tabelas principais do sistema
-- =====================================================

-- Tipos de status gerais
CREATE TYPE status_geral AS ENUM (
    'ativo',
    'inativo',
    'pendente',
    'cancelado',
    'finalizado'
);

-- Tipos de protocolo
CREATE TYPE tipo_protocolo AS ENUM (
    'solicitacao',
    'reclamacao',
    'sugestao',
    'denuncia',
    'informacao',
    'elogio'
);

-- Status de atendimento
CREATE TYPE status_atendimento AS ENUM (
    'aberto',
    'em_andamento',
    'aguardando_resposta',
    'aguardando_documentos',
    'resolvido',
    'fechado',
    'cancelado'
);

-- =====================================================
-- TABELA: Endereços
-- =====================================================
CREATE TABLE enderecos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cep VARCHAR(10),
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100) DEFAULT 'Município',
    uf VARCHAR(2) DEFAULT 'UF',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: Protocolos (Sistema geral de protocolos)
-- =====================================================
CREATE TABLE protocolos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_protocolo VARCHAR(50) UNIQUE NOT NULL,
    tipo tipo_protocolo NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    
    -- Solicitante
    solicitante_id UUID REFERENCES auth.users(id),
    solicitante_nome VARCHAR(200),
    solicitante_cpf VARCHAR(14),
    solicitante_email VARCHAR(255),
    solicitante_telefone VARCHAR(20),
    
    -- Localização
    endereco_id UUID REFERENCES enderecos(id),
    
    -- Responsabilidade
    secretaria_id UUID REFERENCES secretarias(id),
    setor_id UUID REFERENCES setores(id),
    responsavel_id UUID REFERENCES auth.users(id),
    
    -- Status e controle
    status status_atendimento DEFAULT 'aberto',
    prioridade priority_level DEFAULT 'media',
    prazo_resposta TIMESTAMP WITH TIME ZONE,
    data_resposta TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Anexos
-- =====================================================
CREATE TABLE anexos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_arquivo VARCHAR(100),
    tamanho_bytes BIGINT,
    url_arquivo TEXT NOT NULL,
    hash_arquivo VARCHAR(255),
    
    -- Referência genérica
    referencia_tabela VARCHAR(100) NOT NULL, -- Ex: 'protocolos', 'atendimentos'
    referencia_id UUID NOT NULL,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Histórico de ações
-- =====================================================
CREATE TABLE historico_acoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Referência genérica
    referencia_tabela VARCHAR(100) NOT NULL,
    referencia_id UUID NOT NULL,
    
    -- Ação
    acao VARCHAR(100) NOT NULL, -- Ex: 'criado', 'atualizado', 'encaminhado'
    descricao TEXT NOT NULL,
    dados_anteriores JSONB,
    dados_novos JSONB,
    
    -- Responsável
    usuario_id UUID REFERENCES auth.users(id),
    usuario_nome VARCHAR(200),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- =====================================================
-- TABELA: Comentários/Observações
-- =====================================================
CREATE TABLE comentarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Referência genérica
    referencia_tabela VARCHAR(100) NOT NULL,
    referencia_id UUID NOT NULL,
    
    -- Comentário
    comentario TEXT NOT NULL,
    interno BOOLEAN DEFAULT false, -- true = apenas funcionários veem
    
    -- Autor
    autor_id UUID REFERENCES auth.users(id),
    autor_nome VARCHAR(200),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Configurações do sistema
-- =====================================================
CREATE TABLE configuracoes_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    descricao TEXT,
    grupo VARCHAR(100), -- Ex: 'geral', 'email', 'notificacoes'
    editavel BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para gerar número de protocolo
CREATE OR REPLACE FUNCTION generate_protocol_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_protocolo IS NULL THEN
        NEW.numero_protocolo := generate_unique_code('protocolos', 'numero_protocolo', 
            TO_CHAR(NOW(), 'YYYY') || '', 8);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_protocol_number
    BEFORE INSERT ON protocolos
    FOR EACH ROW EXECUTE FUNCTION generate_protocol_number();

-- Triggers para updated_at
CREATE TRIGGER update_enderecos_updated_at 
    BEFORE UPDATE ON enderecos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocolos_updated_at 
    BEFORE UPDATE ON protocolos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comentarios_updated_at 
    BEFORE UPDATE ON comentarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_sistema_updated_at 
    BEFORE UPDATE ON configuracoes_sistema 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para protocolos
CREATE INDEX idx_protocolos_numero ON protocolos(numero_protocolo);
CREATE INDEX idx_protocolos_tipo ON protocolos(tipo);
CREATE INDEX idx_protocolos_status ON protocolos(status);
CREATE INDEX idx_protocolos_solicitante ON protocolos(solicitante_id);
CREATE INDEX idx_protocolos_secretaria ON protocolos(secretaria_id);
CREATE INDEX idx_protocolos_setor ON protocolos(setor_id);
CREATE INDEX idx_protocolos_responsavel ON protocolos(responsavel_id);
CREATE INDEX idx_protocolos_created_at ON protocolos(created_at);
CREATE INDEX idx_protocolos_prioridade ON protocolos(prioridade);

-- Índices para anexos
CREATE INDEX idx_anexos_referencia ON anexos(referencia_tabela, referencia_id);
CREATE INDEX idx_anexos_tipo ON anexos(tipo_arquivo);

-- Índices para histórico
CREATE INDEX idx_historico_referencia ON historico_acoes(referencia_tabela, referencia_id);
CREATE INDEX idx_historico_usuario ON historico_acoes(usuario_id);
CREATE INDEX idx_historico_created_at ON historico_acoes(created_at);

-- Índices para comentários
CREATE INDEX idx_comentarios_referencia ON comentarios(referencia_tabela, referencia_id);
CREATE INDEX idx_comentarios_autor ON comentarios(autor_id);
CREATE INDEX idx_comentarios_interno ON comentarios(interno);

-- Índices para configurações
CREATE INDEX idx_configuracoes_chave ON configuracoes_sistema(chave);
CREATE INDEX idx_configuracoes_grupo ON configuracoes_sistema(grupo);