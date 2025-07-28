-- =============================================================================
-- 03_ESTRUTURA_ORGANIZACIONAL.SQL
-- =============================================================================
-- Cria tabelas da estrutura organizacional (secretarias, setores)
-- Execute DEPOIS do script 02
-- =============================================================================

-- =====================================================
-- 1. TABELA DE SECRETARIAS MUNICIPAIS
-- =====================================================

CREATE TABLE IF NOT EXISTS secretarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    sigla TEXT NOT NULL,
    descricao TEXT,
    responsavel_id UUID REFERENCES auth.users(id),
    vice_responsavel_id UUID REFERENCES auth.users(id),
    email_oficial TEXT,
    telefone TEXT,
    celular TEXT,
    endereco JSONB,
    horario_funcionamento JSONB DEFAULT '{
        "segunda": {"inicio": "08:00", "fim": "17:00"},
        "terca": {"inicio": "08:00", "fim": "17:00"},
        "quarta": {"inicio": "08:00", "fim": "17:00"},
        "quinta": {"inicio": "08:00", "fim": "17:00"},
        "sexta": {"inicio": "08:00", "fim": "17:00"},
        "sabado": null,
        "domingo": null
    }'::jsonb,
    orcamento_anual DECIMAL(15,2),
    meta_protocolos_mes INTEGER DEFAULT 100,
    cor_identificacao TEXT DEFAULT '#3B82F6',
    icone TEXT DEFAULT 'Building',
    ativa BOOLEAN DEFAULT true,
    ordem_exibicao INTEGER DEFAULT 0,
    configuracoes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentários
COMMENT ON TABLE secretarias IS 'Secretarias municipais do sistema';
COMMENT ON COLUMN secretarias.codigo IS 'Código único da secretaria (ex: SECSAU, SECEDU)';
COMMENT ON COLUMN secretarias.horario_funcionamento IS 'Horários de funcionamento por dia da semana';
COMMENT ON COLUMN secretarias.configuracoes IS 'Configurações específicas da secretaria';

-- =====================================================
-- 2. TABELA DE SETORES DENTRO DAS SECRETARIAS
-- =====================================================

CREATE TABLE IF NOT EXISTS setores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secretaria_id UUID NOT NULL REFERENCES secretarias(id) ON DELETE CASCADE,
    codigo TEXT NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    responsavel_id UUID REFERENCES auth.users(id),
    email TEXT,
    telefone TEXT,
    localizacao TEXT, -- Ex: "Andar 2, Sala 201"
    competencias TEXT[], -- Array de competências/atribuições
    ativo BOOLEAN DEFAULT true,
    ordem_exibicao INTEGER DEFAULT 0,
    meta_protocolos_mes INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(secretaria_id, codigo)
);

-- Comentários
COMMENT ON TABLE setores IS 'Setores/departamentos dentro das secretarias';
COMMENT ON COLUMN setores.codigo IS 'Código único do setor dentro da secretaria';
COMMENT ON COLUMN setores.competencias IS 'Lista de competências e atribuições do setor';

-- =====================================================
-- 3. RELACIONAR USUÁRIOS COM SECRETARIA/SETOR
-- =====================================================

-- Adicionar foreign keys na tabela user_profiles
ALTER TABLE user_profiles 
ADD CONSTRAINT fk_user_profiles_secretaria 
FOREIGN KEY (secretaria_id) REFERENCES secretarias(id);

ALTER TABLE user_profiles 
ADD CONSTRAINT fk_user_profiles_setor 
FOREIGN KEY (setor_id) REFERENCES setores(id);

-- =====================================================
-- 4. TABELA DE HIERARQUIA ORGANIZACIONAL
-- =====================================================

CREATE TABLE IF NOT EXISTS hierarquia_organizacional (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    superior_id UUID NOT NULL REFERENCES auth.users(id),
    subordinado_id UUID NOT NULL REFERENCES auth.users(id),
    tipo_relacao TEXT DEFAULT 'direto', -- 'direto', 'funcional', 'temporario'
    ativo BOOLEAN DEFAULT true,
    data_inicio DATE DEFAULT CURRENT_DATE,
    data_fim DATE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(superior_id, subordinado_id)
);

COMMENT ON TABLE hierarquia_organizacional IS 'Define hierarquia funcional entre usuários';

-- =====================================================
-- 5. TABELA DE METAS E INDICADORES POR SETOR
-- =====================================================

CREATE TABLE IF NOT EXISTS metas_setoriais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setor_id UUID NOT NULL REFERENCES setores(id) ON DELETE CASCADE,
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    meta_protocolos INTEGER DEFAULT 0,
    meta_resolucao_dias DECIMAL(5,2) DEFAULT 30.0,
    meta_satisfacao DECIMAL(3,2) DEFAULT 4.0 CHECK (meta_satisfacao BETWEEN 1.0 AND 5.0),
    protocolos_recebidos INTEGER DEFAULT 0,
    protocolos_concluidos INTEGER DEFAULT 0,
    tempo_medio_resolucao DECIMAL(5,2),
    satisfacao_media DECIMAL(3,2),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(setor_id, ano, mes)
);

COMMENT ON TABLE metas_setoriais IS 'Metas e indicadores de performance por setor/mês';

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices na tabela secretarias
CREATE INDEX IF NOT EXISTS idx_secretarias_codigo ON secretarias(codigo);
CREATE INDEX IF NOT EXISTS idx_secretarias_ativa ON secretarias(ativa);
CREATE INDEX IF NOT EXISTS idx_secretarias_responsavel ON secretarias(responsavel_id);

-- Índices na tabela setores
CREATE INDEX IF NOT EXISTS idx_setores_secretaria ON setores(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_setores_codigo ON setores(codigo);
CREATE INDEX IF NOT EXISTS idx_setores_ativo ON setores(ativo);
CREATE INDEX IF NOT EXISTS idx_setores_responsavel ON setores(responsavel_id);

-- Índices na tabela hierarquia_organizacional
CREATE INDEX IF NOT EXISTS idx_hierarquia_superior ON hierarquia_organizacional(superior_id);
CREATE INDEX IF NOT EXISTS idx_hierarquia_subordinado ON hierarquia_organizacional(subordinado_id);
CREATE INDEX IF NOT EXISTS idx_hierarquia_ativo ON hierarquia_organizacional(ativo);

-- Índices na tabela metas_setoriais
CREATE INDEX IF NOT EXISTS idx_metas_setor ON metas_setoriais(setor_id);
CREATE INDEX IF NOT EXISTS idx_metas_ano_mes ON metas_setoriais(ano, mes);

-- =====================================================
-- 7. TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE TRIGGER update_secretarias_updated_at
    BEFORE UPDATE ON secretarias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setores_updated_at
    BEFORE UPDATE ON setores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metas_setoriais_updated_at
    BEFORE UPDATE ON metas_setoriais
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. FUNÇÕES ESPECÍFICAS PARA ESTRUTURA ORGANIZACIONAL
-- =====================================================

-- Função para obter hierarquia completa de um usuário
CREATE OR REPLACE FUNCTION obter_hierarquia_usuario(p_user_id UUID)
RETURNS TABLE(
    nivel INTEGER,
    user_id UUID,
    nome_completo TEXT,
    cargo TEXT,
    tipo_relacao TEXT
) AS $$
WITH RECURSIVE hierarquia AS (
    -- Caso base: o próprio usuário
    SELECT 
        0 as nivel,
        up.id,
        up.nome_completo,
        up.cargo,
        'self'::TEXT as tipo_relacao
    FROM user_profiles up
    WHERE up.id = p_user_id
    
    UNION ALL
    
    -- Recursão: superiores
    SELECT 
        h.nivel + 1,
        up.id,
        up.nome_completo,
        up.cargo,
        ho.tipo_relacao
    FROM hierarquia h
    JOIN hierarquia_organizacional ho ON ho.subordinado_id = h.id
    JOIN user_profiles up ON up.id = ho.superior_id
    WHERE ho.ativo = true
    AND h.nivel < 10 -- Evitar loops infinitos
)
SELECT * FROM hierarquia ORDER BY nivel;
$$ LANGUAGE sql;

-- Função para obter equipe de um usuário
CREATE OR REPLACE FUNCTION obter_equipe_usuario(p_user_id UUID)
RETURNS TABLE(
    user_id UUID,
    nome_completo TEXT,
    cargo TEXT,
    tipo_relacao TEXT,
    setor_nome TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.nome_completo,
        up.cargo,
        ho.tipo_relacao,
        s.nome as setor_nome
    FROM hierarquia_organizacional ho
    JOIN user_profiles up ON up.id = ho.subordinado_id
    LEFT JOIN setores s ON s.id = up.setor_id
    WHERE ho.superior_id = p_user_id
    AND ho.ativo = true
    ORDER BY up.nome_completo;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. RLS (HABILITADO, POLICIES NO SCRIPT 08)
-- =====================================================

ALTER TABLE secretarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE hierarquia_organizacional ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas_setoriais ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. CONSTRAINTS ADICIONAIS
-- =====================================================

-- Email deve ser válido se fornecido
ALTER TABLE secretarias ADD CONSTRAINT check_secretaria_email_valido 
    CHECK (email_oficial IS NULL OR validar_email(email_oficial));

ALTER TABLE setores ADD CONSTRAINT check_setor_email_valido 
    CHECK (email IS NULL OR validar_email(email));

-- Responsável não pode ser subordinado de si mesmo
ALTER TABLE hierarquia_organizacional ADD CONSTRAINT check_nao_auto_subordinacao
    CHECK (superior_id != subordinado_id);

-- Data fim deve ser posterior à data início
ALTER TABLE hierarquia_organizacional ADD CONSTRAINT check_datas_validas
    CHECK (data_fim IS NULL OR data_fim >= data_inicio);

-- Ano deve ser razoável
ALTER TABLE metas_setoriais ADD CONSTRAINT check_ano_valido
    CHECK (ano BETWEEN 2020 AND 2050);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'SCRIPT 03 - ESTRUTURA ORGANIZACIONAL EXECUTADO COM SUCESSO' AS status;

-- Verificar tabelas criadas
SELECT 'TABELAS CRIADAS:' AS info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'secretarias',
    'setores',
    'hierarquia_organizacional',
    'metas_setoriais'
)
ORDER BY table_name;

-- Verificar foreign keys adicionadas
SELECT 'FOREIGN KEYS CRIADAS:' AS info;
SELECT 
    tc.table_name, 
    tc.constraint_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_schema = 'public'
AND tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('secretarias', 'setores', 'user_profiles')
ORDER BY tc.table_name, tc.constraint_name;

-- Verificar funções criadas
SELECT 'FUNÇÕES CRIADAS:' AS info;
SELECT proname AS function_name 
FROM pg_proc 
WHERE proname IN ('obter_hierarquia_usuario', 'obter_equipe_usuario')
ORDER BY proname;