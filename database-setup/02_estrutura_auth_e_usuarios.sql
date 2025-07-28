-- =============================================================================
-- 02_ESTRUTURA_AUTH_E_USUARIOS.SQL
-- =============================================================================
-- Cria tabelas de autenticação e perfis de usuários
-- Execute DEPOIS do script 01
-- =============================================================================

-- =====================================================
-- 1. TABELA DE CREDENCIAIS TEMPORÁRIAS (AUTH DIRETO)
-- =====================================================

CREATE TABLE IF NOT EXISTS temp_credentials (
    email TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentários da tabela
COMMENT ON TABLE temp_credentials IS 'Credenciais temporárias para autenticação direta de servidores';
COMMENT ON COLUMN temp_credentials.email IS 'Email do usuário (chave primária)';
COMMENT ON COLUMN temp_credentials.password IS 'Senha em texto plano (apenas para desenvolvimento)';

-- =====================================================
-- 2. TABELA PRINCIPAL DE PERFIS DE USUÁRIO
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nome_completo TEXT NOT NULL,
    tipo_usuario tipo_usuario_enum NOT NULL DEFAULT 'cidadao',
    secretaria_id UUID,
    setor_id UUID,
    cargo TEXT,
    cpf TEXT,
    telefone TEXT,
    endereco JSONB,
    foto_perfil_url TEXT,
    bio TEXT,
    status status_geral_enum DEFAULT 'ativo',
    primeiro_acesso BOOLEAN DEFAULT true,
    data_ultimo_acesso TIMESTAMP WITH TIME ZONE,
    configuracoes JSONB DEFAULT '{}'::jsonb,
    metadados JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentários da tabela
COMMENT ON TABLE user_profiles IS 'Perfis estendidos dos usuários do sistema';
COMMENT ON COLUMN user_profiles.id IS 'UUID do usuário (referência para auth.users)';
COMMENT ON COLUMN user_profiles.email IS 'Email único do usuário';
COMMENT ON COLUMN user_profiles.nome_completo IS 'Nome completo do usuário';
COMMENT ON COLUMN user_profiles.tipo_usuario IS 'Tipo/nível de acesso do usuário';
COMMENT ON COLUMN user_profiles.secretaria_id IS 'Secretaria à qual o usuário pertence';
COMMENT ON COLUMN user_profiles.setor_id IS 'Setor específico do usuário';
COMMENT ON COLUMN user_profiles.endereco IS 'Endereço completo em formato JSON';
COMMENT ON COLUMN user_profiles.configuracoes IS 'Configurações personalizadas do usuário';
COMMENT ON COLUMN user_profiles.metadados IS 'Dados adicionais flexíveis';

-- =====================================================
-- 3. SISTEMA DE PERFIS DE ACESSO
-- =====================================================

CREATE TABLE IF NOT EXISTS perfis_acesso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT,
    nivel_acesso INTEGER DEFAULT 1,
    ativo BOOLEAN DEFAULT true,
    sistema BOOLEAN DEFAULT false, -- Perfis do sistema não podem ser editados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE perfis_acesso IS 'Perfis de acesso do sistema com níveis hierárquicos';

-- =====================================================
-- 4. MÓDULOS DO SISTEMA
-- =====================================================

CREATE TABLE IF NOT EXISTS modulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    icone TEXT,
    cor TEXT,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    sistema BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE modulos IS 'Módulos funcionais do sistema';

-- =====================================================
-- 5. PERMISSÕES ESPECÍFICAS
-- =====================================================

CREATE TABLE IF NOT EXISTS permissoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    modulo_id UUID REFERENCES modulos(id) ON DELETE CASCADE,
    recurso TEXT NOT NULL, -- ex: 'protocolos', 'usuarios'
    acao TEXT NOT NULL, -- ex: 'read', 'write', 'delete', 'admin'
    ativo BOOLEAN DEFAULT true,
    sistema BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE permissoes IS 'Permissões específicas por recurso e ação';

-- =====================================================
-- 6. RELACIONAMENTO PERFIS X PERMISSÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS perfil_permissoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID REFERENCES perfis_acesso(id) ON DELETE CASCADE,
    permissao_id UUID REFERENCES permissoes(id) ON DELETE CASCADE,
    concedida BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(perfil_id, permissao_id)
);

COMMENT ON TABLE perfil_permissoes IS 'Relacionamento entre perfis de acesso e permissões';

-- =====================================================
-- 7. RELACIONAMENTO USUÁRIOS X PERFIS EXTRAS
-- =====================================================

CREATE TABLE IF NOT EXISTS usuario_perfis_extras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    perfil_id UUID REFERENCES perfis_acesso(id) ON DELETE CASCADE,
    concedido_por UUID REFERENCES auth.users(id),
    concedido_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true,
    
    UNIQUE(user_id, perfil_id)
);

COMMENT ON TABLE usuario_perfis_extras IS 'Perfis adicionais concedidos a usuários específicos';

-- =====================================================
-- 8. LOGS DE AUDITORIA
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tabela TEXT NOT NULL,
    operacao TEXT NOT NULL, -- INSERT, UPDATE, DELETE
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    usuario_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE audit_logs IS 'Logs de auditoria para rastreamento de alterações';

-- =====================================================
-- 9. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices na tabela user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tipo_usuario ON user_profiles(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_user_profiles_secretaria ON user_profiles(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_setor ON user_profiles(setor_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- Índices na tabela perfil_permissoes
CREATE INDEX IF NOT EXISTS idx_perfil_permissoes_perfil ON perfil_permissoes(perfil_id);
CREATE INDEX IF NOT EXISTS idx_perfil_permissoes_permissao ON perfil_permissoes(permissao_id);

-- Índices na tabela audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_tabela ON audit_logs(tabela);
CREATE INDEX IF NOT EXISTS idx_audit_logs_usuario ON audit_logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- 10. TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_perfis_acesso_updated_at
    BEFORE UPDATE ON perfis_acesso
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 11. RLS (HABILITADO, POLICIES NO SCRIPT 08)
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis_acesso ENABLE ROW LEVEL SECURITY;
ALTER TABLE modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfil_permissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_perfis_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- temp_credentials não precisa de RLS (acesso apenas por sistema)

-- =====================================================
-- 12. CONSTRAINTS ADICIONAIS
-- =====================================================

-- Validar CPF se fornecido
ALTER TABLE user_profiles ADD CONSTRAINT check_cpf_valido 
    CHECK (cpf IS NULL OR validar_cpf(cpf));

-- Validar email
ALTER TABLE user_profiles ADD CONSTRAINT check_email_valido 
    CHECK (validar_email(email));

-- Validar estrutura básica do endereço
ALTER TABLE user_profiles ADD CONSTRAINT check_endereco_estrutura
    CHECK (endereco IS NULL OR (endereco ? 'cidade' AND endereco ? 'uf'));

-- Nível de acesso deve ser positivo
ALTER TABLE perfis_acesso ADD CONSTRAINT check_nivel_acesso_positivo
    CHECK (nivel_acesso > 0);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'SCRIPT 02 - ESTRUTURA AUTH E USUÁRIOS EXECUTADO COM SUCESSO' AS status;

-- Verificar tabelas criadas
SELECT 'TABELAS CRIADAS:' AS info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'temp_credentials',
    'user_profiles', 
    'perfis_acesso',
    'modulos',
    'permissoes',
    'perfil_permissoes',
    'usuario_perfis_extras',
    'audit_logs'
)
ORDER BY table_name;

-- Verificar RLS habilitado
SELECT 'RLS STATUS:' AS info;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'user_profiles', 
    'perfis_acesso',
    'modulos',
    'permissoes',
    'perfil_permissoes',
    'usuario_perfis_extras',
    'audit_logs'
)
ORDER BY tablename;