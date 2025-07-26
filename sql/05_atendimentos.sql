-- =====================================================
-- 05_atendimentos.sql
-- Sistema completo de atendimentos
-- =====================================================

-- Tipos de canal de atendimento
CREATE TYPE canal_atendimento AS ENUM (
    'presencial',
    'telefone',
    'whatsapp',
    'email',
    'site',
    'app_mobile'
);

-- =====================================================
-- TABELA: Atendimentos
-- =====================================================
CREATE TABLE atendimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocolo_id UUID REFERENCES protocolos(id),
    numero_atendimento VARCHAR(50) UNIQUE NOT NULL,
    
    -- Dados do solicitante
    solicitante_id UUID REFERENCES auth.users(id),
    solicitante_nome VARCHAR(200) NOT NULL,
    solicitante_cpf VARCHAR(14),
    solicitante_telefone VARCHAR(20),
    solicitante_email VARCHAR(255),
    
    -- Atendimento
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    canal canal_atendimento NOT NULL,
    
    -- Classificação
    categoria VARCHAR(100), -- Ex: reclamacao, solicitacao, informacao
    subcategoria VARCHAR(100),
    assunto VARCHAR(200),
    
    -- Localização
    endereco_id UUID REFERENCES enderecos(id),
    ponto_referencia TEXT,
    
    -- Responsabilidade
    secretaria_id UUID REFERENCES secretarias(id),
    setor_id UUID REFERENCES setores(id),
    atendente_id UUID REFERENCES auth.users(id),
    responsavel_atual_id UUID REFERENCES auth.users(id),
    
    -- Status e controle
    status status_atendimento DEFAULT 'aberto',
    prioridade priority_level DEFAULT 'media',
    
    -- Prazos
    prazo_resposta TIMESTAMP WITH TIME ZONE,
    prazo_resolucao TIMESTAMP WITH TIME ZONE,
    data_primeira_resposta TIMESTAMP WITH TIME ZONE,
    data_resolucao TIMESTAMP WITH TIME ZONE,
    data_fechamento TIMESTAMP WITH TIME ZONE,
    
    -- Avaliação
    nota_avaliacao INTEGER CHECK (nota_avaliacao >= 1 AND nota_avaliacao <= 5),
    comentario_avaliacao TEXT,
    data_avaliacao TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Encaminhamentos de atendimentos
-- =====================================================
CREATE TABLE atendimento_encaminhamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atendimento_id UUID NOT NULL REFERENCES atendimentos(id) ON DELETE CASCADE,
    
    -- Origem
    secretaria_origem_id UUID REFERENCES secretarias(id),
    setor_origem_id UUID REFERENCES setores(id),
    usuario_origem_id UUID REFERENCES auth.users(id),
    
    -- Destino
    secretaria_destino_id UUID NOT NULL REFERENCES secretarias(id),
    setor_destino_id UUID REFERENCES setores(id),
    usuario_destino_id UUID REFERENCES auth.users(id),
    
    -- Encaminhamento
    motivo TEXT NOT NULL,
    observacoes TEXT,
    urgente BOOLEAN DEFAULT false,
    prazo_resposta TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pendente', -- pendente, aceito, recusado
    data_aceite TIMESTAMP WITH TIME ZONE,
    data_recusa TIMESTAMP WITH TIME ZONE,
    motivo_recusa TEXT,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Respostas de atendimentos
-- =====================================================
CREATE TABLE atendimento_respostas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atendimento_id UUID NOT NULL REFERENCES atendimentos(id) ON DELETE CASCADE,
    
    -- Resposta
    resposta TEXT NOT NULL,
    tipo_resposta VARCHAR(50) DEFAULT 'oficial', -- oficial, informativa, parcial
    publica BOOLEAN DEFAULT true, -- se o cidadão pode ver
    
    -- Autor
    autor_id UUID REFERENCES auth.users(id),
    autor_nome VARCHAR(200),
    autor_cargo VARCHAR(100),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Acompanhamentos de atendimentos
-- =====================================================
CREATE TABLE atendimento_acompanhamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atendimento_id UUID NOT NULL REFERENCES atendimentos(id) ON DELETE CASCADE,
    
    -- Acompanhamento
    descricao TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'andamento', -- andamento, conclusao, observacao
    percentual_conclusao INTEGER DEFAULT 0 CHECK (percentual_conclusao >= 0 AND percentual_conclusao <= 100),
    
    -- Responsável
    responsavel_id UUID REFERENCES auth.users(id),
    responsavel_nome VARCHAR(200),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Categorias de atendimento
-- =====================================================
CREATE TABLE categorias_atendimento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    categoria_pai_id UUID REFERENCES categorias_atendimento(id),
    secretaria_id UUID REFERENCES secretarias(id),
    cor_hex VARCHAR(7) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    prazo_resposta_horas INTEGER DEFAULT 72,
    prazo_resolucao_dias INTEGER DEFAULT 30,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: SLA (Service Level Agreement)
-- =====================================================
CREATE TABLE sla_configuracao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categoria_id UUID REFERENCES categorias_atendimento(id),
    prioridade priority_level NOT NULL,
    
    -- Tempos em horas
    tempo_primeira_resposta INTEGER NOT NULL DEFAULT 24,
    tempo_resolucao INTEGER NOT NULL DEFAULT 168, -- 7 dias
    tempo_feedback INTEGER DEFAULT 24,
    
    -- Configurações
    notificar_gestor BOOLEAN DEFAULT true,
    escalamento_automatico BOOLEAN DEFAULT false,
    
    -- Metadados
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(categoria_id, prioridade)
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para gerar número de atendimento
CREATE OR REPLACE FUNCTION generate_atendimento_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_atendimento IS NULL THEN
        NEW.numero_atendimento := 'AT' || generate_unique_code('atendimentos', 'numero_atendimento', 
            TO_CHAR(NOW(), 'YYYY'), 8);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_atendimento_number
    BEFORE INSERT ON atendimentos
    FOR EACH ROW EXECUTE FUNCTION generate_atendimento_number();

-- Trigger para atualizar status baseado em respostas
CREATE OR REPLACE FUNCTION update_atendimento_status_on_response()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar data da primeira resposta se for a primeira
    UPDATE atendimentos 
    SET 
        data_primeira_resposta = COALESCE(data_primeira_resposta, NOW()),
        status = CASE 
            WHEN status = 'aberto' THEN 'em_andamento'
            ELSE status 
        END,
        updated_at = NOW()
    WHERE id = NEW.atendimento_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_atendimento_status_on_response
    AFTER INSERT ON atendimento_respostas
    FOR EACH ROW EXECUTE FUNCTION update_atendimento_status_on_response();

-- Triggers para updated_at
CREATE TRIGGER update_atendimentos_updated_at 
    BEFORE UPDATE ON atendimentos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_atendimento_updated_at 
    BEFORE UPDATE ON categorias_atendimento 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sla_configuracao_updated_at 
    BEFORE UPDATE ON sla_configuracao 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para atendimentos
CREATE INDEX idx_atendimentos_numero ON atendimentos(numero_atendimento);
CREATE INDEX idx_atendimentos_status ON atendimentos(status);
CREATE INDEX idx_atendimentos_prioridade ON atendimentos(prioridade);
CREATE INDEX idx_atendimentos_solicitante ON atendimentos(solicitante_id);
CREATE INDEX idx_atendimentos_secretaria ON atendimentos(secretaria_id);
CREATE INDEX idx_atendimentos_setor ON atendimentos(setor_id);
CREATE INDEX idx_atendimentos_atendente ON atendimentos(atendente_id);
CREATE INDEX idx_atendimentos_responsavel ON atendimentos(responsavel_atual_id);
CREATE INDEX idx_atendimentos_canal ON atendimentos(canal);
CREATE INDEX idx_atendimentos_categoria ON atendimentos(categoria);
CREATE INDEX idx_atendimentos_created_at ON atendimentos(created_at);
CREATE INDEX idx_atendimentos_cpf ON atendimentos(solicitante_cpf);

-- Índices para encaminhamentos
CREATE INDEX idx_encaminhamentos_atendimento ON atendimento_encaminhamentos(atendimento_id);
CREATE INDEX idx_encaminhamentos_origem ON atendimento_encaminhamentos(secretaria_origem_id, setor_origem_id);
CREATE INDEX idx_encaminhamentos_destino ON atendimento_encaminhamentos(secretaria_destino_id, setor_destino_id);
CREATE INDEX idx_encaminhamentos_status ON atendimento_encaminhamentos(status);

-- Índices para respostas
CREATE INDEX idx_respostas_atendimento ON atendimento_respostas(atendimento_id);
CREATE INDEX idx_respostas_autor ON atendimento_respostas(autor_id);
CREATE INDEX idx_respostas_tipo ON atendimento_respostas(tipo_resposta);

-- Índices para acompanhamentos
CREATE INDEX idx_acompanhamentos_atendimento ON atendimento_acompanhamentos(atendimento_id);
CREATE INDEX idx_acompanhamentos_responsavel ON atendimento_acompanhamentos(responsavel_id);

-- Índices para categorias
CREATE INDEX idx_categorias_codigo ON categorias_atendimento(codigo);
CREATE INDEX idx_categorias_pai ON categorias_atendimento(categoria_pai_id);
CREATE INDEX idx_categorias_secretaria ON categorias_atendimento(secretaria_id);