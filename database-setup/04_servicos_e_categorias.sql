-- =============================================================================
-- 04_SERVICOS_E_CATEGORIAS.SQL
-- =============================================================================
-- Cria tabelas do sistema de serviços municipais e categorias
-- Execute DEPOIS do script 03
-- =============================================================================

-- =====================================================
-- 1. TABELA DE CATEGORIAS DE SERVIÇOS
-- =====================================================

CREATE TABLE IF NOT EXISTS categorias_servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT,
    icone TEXT DEFAULT 'FileText',
    cor TEXT DEFAULT '#3B82F6',
    slug TEXT UNIQUE,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    publico BOOLEAN DEFAULT true, -- Se aparece no portal público
    requer_login BOOLEAN DEFAULT false, -- Se requer login para ver
    metadados JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentários
COMMENT ON TABLE categorias_servicos IS 'Categorias para organização dos serviços municipais';
COMMENT ON COLUMN categorias_servicos.slug IS 'URL amigável para a categoria';
COMMENT ON COLUMN categorias_servicos.publico IS 'Se a categoria aparece no portal público';
COMMENT ON COLUMN categorias_servicos.requer_login IS 'Se requer login para acessar serviços desta categoria';

-- =====================================================
-- 2. TABELA PRINCIPAL DE SERVIÇOS MUNICIPAIS
-- =====================================================

CREATE TABLE IF NOT EXISTS servicos_municipais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    categoria_id UUID REFERENCES categorias_servicos(id),
    categoria TEXT, -- Campo de compatibilidade com código existente
    subcategoria TEXT,
    slug TEXT UNIQUE,
    
    -- Responsabilidade
    secretaria_id UUID REFERENCES secretarias(id),
    setor_id UUID REFERENCES setores(id),
    responsavel_id UUID REFERENCES auth.users(id),
    
    -- Configurações do serviço
    publico BOOLEAN DEFAULT true,
    requer_login BOOLEAN DEFAULT true,
    requer_documentos BOOLEAN DEFAULT false,
    documentos_necessarios TEXT[] DEFAULT ARRAY[]::TEXT[],
    requer_localizacao BOOLEAN DEFAULT false,
    requer_agendamento BOOLEAN DEFAULT false,
    permite_acompanhamento BOOLEAN DEFAULT true,
    
    -- Prazos e custos
    prazo_resposta_dias INTEGER DEFAULT 5,
    prazo_resolucao_dias INTEGER DEFAULT 30,
    taxa_servico DECIMAL(10,2) DEFAULT 0.00,
    forma_pagamento TEXT[], -- ['dinheiro', 'pix', 'cartao', 'debito']
    
    -- Formulário dinâmico
    formulario_campos JSONB DEFAULT '[]'::jsonb,
    formulario_versao INTEGER DEFAULT 1,
    
    -- Aprovação e controle
    status status_geral_enum DEFAULT 'ativo',
    requer_aprovacao_admin BOOLEAN DEFAULT false,
    aprovado_por UUID REFERENCES auth.users(id),
    aprovado_em TIMESTAMP WITH TIME ZONE,
    
    -- Métricas e avaliação
    permite_avaliacao BOOLEAN DEFAULT true,
    nota_media DECIMAL(3,2) DEFAULT 0.00,
    total_avaliacoes INTEGER DEFAULT 0,
    total_solicitacoes INTEGER DEFAULT 0,
    
    -- Configurações avançadas
    instrucoes TEXT,
    observacoes_internas TEXT,
    palavras_chave TEXT[],
    configuracoes JSONB DEFAULT '{}'::jsonb,
    metadados JSONB DEFAULT '{}'::jsonb,
    
    -- Controle
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentários
COMMENT ON TABLE servicos_municipais IS 'Catálogo completo de serviços municipais oferecidos';
COMMENT ON COLUMN servicos_municipais.codigo IS 'Código único identificador do serviço';
COMMENT ON COLUMN servicos_municipais.formulario_campos IS 'Definição dos campos do formulário em JSON';
COMMENT ON COLUMN servicos_municipais.palavras_chave IS 'Tags para busca e categorização';

-- =====================================================
-- 3. TABELA DE REQUISITOS DE SERVIÇOS
-- =====================================================

CREATE TABLE IF NOT EXISTS servico_requisitos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    servico_id UUID NOT NULL REFERENCES servicos_municipais(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- 'documento', 'informacao', 'taxa', 'agendamento'
    nome TEXT NOT NULL,
    descricao TEXT,
    obrigatorio BOOLEAN DEFAULT true,
    formato_aceito TEXT[], -- ['pdf', 'jpg', 'png'] para documentos
    tamanho_max_mb INTEGER, -- Para uploads
    validacao_regex TEXT, -- Para validação de campos
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE servico_requisitos IS 'Requisitos específicos para cada serviço';

-- =====================================================
-- 4. TABELA DE FLUXO DE APROVAÇÃO DE SERVIÇOS
-- =====================================================

CREATE TABLE IF NOT EXISTS servico_fluxo_aprovacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    servico_id UUID NOT NULL REFERENCES servicos_municipais(id) ON DELETE CASCADE,
    etapa INTEGER NOT NULL,
    nome_etapa TEXT NOT NULL,
    responsavel_tipo TEXT NOT NULL, -- 'setor', 'usuario', 'cargo'
    responsavel_id UUID, -- Pode ser setor_id ou user_id
    responsavel_cargo TEXT, -- Se responsavel_tipo = 'cargo'
    prazo_dias INTEGER DEFAULT 5,
    obrigatoria BOOLEAN DEFAULT true,
    permite_delegar BOOLEAN DEFAULT false,
    acao_automatica BOOLEAN DEFAULT false,
    condicoes JSONB, -- Condições para executar esta etapa
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE servico_fluxo_aprovacao IS 'Define o fluxo de aprovação para cada serviço';

-- =====================================================
-- 5. TABELA DE HORÁRIOS DE ATENDIMENTO POR SERVIÇO
-- =====================================================

CREATE TABLE IF NOT EXISTS servico_horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    servico_id UUID NOT NULL REFERENCES servicos_municipais(id) ON DELETE CASCADE,
    dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0=domingo
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(servico_id, dia_semana)
);

COMMENT ON TABLE servico_horarios IS 'Horários de atendimento específicos por serviço';

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices na tabela categorias_servicos
CREATE INDEX IF NOT EXISTS idx_categorias_nome ON categorias_servicos(nome);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias_servicos(slug);
CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON categorias_servicos(ativo);
CREATE INDEX IF NOT EXISTS idx_categorias_publico ON categorias_servicos(publico);

-- Índices na tabela servicos_municipais
CREATE INDEX IF NOT EXISTS idx_servicos_codigo ON servicos_municipais(codigo);
CREATE INDEX IF NOT EXISTS idx_servicos_nome ON servicos_municipais(nome);
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos_municipais(categoria_id);
CREATE INDEX IF NOT EXISTS idx_servicos_secretaria ON servicos_municipais(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_servicos_setor ON servicos_municipais(setor_id);
CREATE INDEX IF NOT EXISTS idx_servicos_status ON servicos_municipais(status);
CREATE INDEX IF NOT EXISTS idx_servicos_publico ON servicos_municipais(publico);

-- Índice para busca textual
CREATE INDEX IF NOT EXISTS idx_servicos_busca_texto ON servicos_municipais 
    USING gin(to_tsvector('portuguese', nome || ' ' || COALESCE(descricao, '')));

-- Índices nas tabelas auxiliares
CREATE INDEX IF NOT EXISTS idx_servico_requisitos_servico ON servico_requisitos(servico_id);
CREATE INDEX IF NOT EXISTS idx_servico_fluxo_servico ON servico_fluxo_aprovacao(servico_id);
CREATE INDEX IF NOT EXISTS idx_servico_horarios_servico ON servico_horarios(servico_id);

-- =====================================================
-- 7. TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE TRIGGER update_categorias_servicos_updated_at
    BEFORE UPDATE ON categorias_servicos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicos_municipais_updated_at
    BEFORE UPDATE ON servicos_municipais
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. FUNÇÕES ESPECÍFICAS PARA SERVIÇOS
-- =====================================================

-- Função para gerar slug automático
CREATE OR REPLACE FUNCTION gerar_slug(texto TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Remove acentos, converte para minúsculo e substitui espaços por hífens
    RETURN LOWER(
        REGEXP_REPLACE(
            TRANSLATE(
                texto,
                'áàâãäéèêëíìîïóòôõöúùûüçñ',
                'aaaaaeeeeiiiioooooouuuucn'
            ),
            '[^a-z0-9\s]', '', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar slug automaticamente
CREATE OR REPLACE FUNCTION trigger_gerar_slug_categoria()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := gerar_slug(NEW.nome);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categorias_servicos_slug_trigger
    BEFORE INSERT OR UPDATE ON categorias_servicos
    FOR EACH ROW
    EXECUTE FUNCTION trigger_gerar_slug_categoria();

CREATE OR REPLACE FUNCTION trigger_gerar_slug_servico()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := gerar_slug(NEW.nome);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER servicos_municipais_slug_trigger
    BEFORE INSERT OR UPDATE ON servicos_municipais
    FOR EACH ROW
    EXECUTE FUNCTION trigger_gerar_slug_servico();

-- Função para buscar serviços
CREATE OR REPLACE FUNCTION buscar_servicos(
    p_termo TEXT DEFAULT NULL,
    p_categoria_id UUID DEFAULT NULL,
    p_secretaria_id UUID DEFAULT NULL,
    p_apenas_publicos BOOLEAN DEFAULT true
)
RETURNS TABLE(
    id UUID,
    codigo TEXT,
    nome TEXT,
    descricao TEXT,
    categoria_nome TEXT,
    secretaria_nome TEXT,
    prazo_dias INTEGER,
    taxa DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.codigo,
        s.nome,
        s.descricao,
        c.nome as categoria_nome,
        sec.nome as secretaria_nome,
        s.prazo_resolucao_dias as prazo_dias,
        s.taxa_servico as taxa
    FROM servicos_municipais s
    LEFT JOIN categorias_servicos c ON c.id = s.categoria_id
    LEFT JOIN secretarias sec ON sec.id = s.secretaria_id
    WHERE 
        (NOT p_apenas_publicos OR s.publico = true)
        AND s.status = 'ativo'
        AND (p_termo IS NULL OR s.nome ILIKE '%' || p_termo || '%' OR s.descricao ILIKE '%' || p_termo || '%')
        AND (p_categoria_id IS NULL OR s.categoria_id = p_categoria_id)
        AND (p_secretaria_id IS NULL OR s.secretaria_id = p_secretaria_id)
    ORDER BY s.nome;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. RLS (HABILITADO, POLICIES NO SCRIPT 08)
-- =====================================================

ALTER TABLE categorias_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos_municipais ENABLE ROW LEVEL SECURITY;
ALTER TABLE servico_requisitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servico_fluxo_aprovacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE servico_horarios ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. CONSTRAINTS ADICIONAIS
-- =====================================================

-- Prazo deve ser positivo
ALTER TABLE servicos_municipais ADD CONSTRAINT check_prazos_positivos
    CHECK (prazo_resposta_dias > 0 AND prazo_resolucao_dias > 0);

-- Taxa deve ser não negativa
ALTER TABLE servicos_municipais ADD CONSTRAINT check_taxa_nao_negativa
    CHECK (taxa_servico >= 0);

-- Nota média deve estar entre 0 e 5
ALTER TABLE servicos_municipais ADD CONSTRAINT check_nota_media_valida
    CHECK (nota_media BETWEEN 0 AND 5);

-- Horário de fim deve ser posterior ao de início
ALTER TABLE servico_horarios ADD CONSTRAINT check_horario_valido
    CHECK (hora_fim > hora_inicio);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'SCRIPT 04 - SERVIÇOS E CATEGORIAS EXECUTADO COM SUCESSO' AS status;

-- Verificar tabelas criadas
SELECT 'TABELAS CRIADAS:' AS info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'categorias_servicos',
    'servicos_municipais',
    'servico_requisitos',
    'servico_fluxo_aprovacao',
    'servico_horarios'
)
ORDER BY table_name;

-- Verificar índices criados
SELECT 'ÍNDICES CRIADOS:' AS info;
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN (
    'categorias_servicos',
    'servicos_municipais',
    'servico_requisitos',
    'servico_fluxo_aprovacao',
    'servico_horarios'
)
ORDER BY indexname;

-- Verificar funções criadas
SELECT 'FUNÇÕES CRIADAS:' AS info;
SELECT proname AS function_name 
FROM pg_proc 
WHERE proname IN ('gerar_slug', 'buscar_servicos')
ORDER BY proname;