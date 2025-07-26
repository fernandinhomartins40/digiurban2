-- =====================================================
-- 02_users_profiles.sql
-- Sistema de usuários, perfis e permissões
-- =====================================================

-- Tipos de usuário
CREATE TYPE user_type AS ENUM (
    'super_admin',     -- Administrador do sistema
    'admin',           -- Administrador municipal
    'secretario',      -- Secretário de pasta
    'diretor',         -- Diretor de departamento
    'coordenador',     -- Coordenador de setor
    'funcionario',     -- Funcionário padrão
    'atendente',       -- Atendente público
    'cidadao'          -- Cidadão/munícipe
);

-- Status do usuário
CREATE TYPE user_status AS ENUM (
    'ativo',
    'inativo',
    'suspenso',
    'bloqueado'
);

-- Níveis de prioridade
CREATE TYPE priority_level AS ENUM (
    'baixa',
    'media',
    'alta',
    'urgente',
    'critica'
);

-- =====================================================
-- TABELA: Perfis de acesso
-- =====================================================
CREATE TABLE perfis_acesso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    tipo_usuario user_type NOT NULL,
    nivel_hierarquico INTEGER NOT NULL DEFAULT 0, -- 0 = mais alto
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: Secretarias/Departamentos
-- =====================================================
CREATE TABLE secretarias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    sigla VARCHAR(10),
    descricao TEXT,
    responsavel_id UUID,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: Setores
-- =====================================================
CREATE TABLE setores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    secretaria_id UUID NOT NULL REFERENCES secretarias(id),
    responsavel_id UUID,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: Perfis de usuário (extensão do auth.users)
-- =====================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome_completo VARCHAR(200) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    avatar_url TEXT,
    
    -- Informações funcionais
    tipo_usuario user_type NOT NULL DEFAULT 'cidadao',
    perfil_acesso_id UUID REFERENCES perfis_acesso(id),
    secretaria_id UUID REFERENCES secretarias(id),
    setor_id UUID REFERENCES setores(id),
    cargo VARCHAR(100),
    matricula VARCHAR(50) UNIQUE,
    
    -- Status e controle
    status user_status DEFAULT 'ativo',
    primeiro_acesso BOOLEAN DEFAULT true,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    tentativas_login INTEGER DEFAULT 0,
    bloqueado_ate TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- TABELA: Módulos do sistema
-- =====================================================
CREATE TABLE modulos_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    icone VARCHAR(50),
    rota VARCHAR(200),
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: Permissões
-- =====================================================
CREATE TABLE permissoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(100) UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    modulo_id UUID REFERENCES modulos_sistema(id),
    recurso VARCHAR(100), -- Ex: atendimentos, usuarios, relatorios
    acao VARCHAR(50), -- Ex: criar, editar, excluir, visualizar
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: Permissões por perfil
-- =====================================================
CREATE TABLE perfil_permissoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfil_id UUID NOT NULL REFERENCES perfis_acesso(id) ON DELETE CASCADE,
    permissao_id UUID NOT NULL REFERENCES permissoes(id) ON DELETE CASCADE,
    concedida BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    UNIQUE(perfil_id, permissao_id)
);

-- =====================================================
-- TABELA: Permissões específicas por usuário
-- =====================================================
CREATE TABLE user_permissoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permissao_id UUID NOT NULL REFERENCES permissoes(id) ON DELETE CASCADE,
    concedida BOOLEAN DEFAULT true,
    motivo TEXT,
    valido_ate TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    UNIQUE(user_id, permissao_id)
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_secretarias_updated_at 
    BEFORE UPDATE ON secretarias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setores_updated_at 
    BEFORE UPDATE ON setores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_perfis_acesso_updated_at 
    BEFORE UPDATE ON perfis_acesso 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para user_profiles
CREATE INDEX idx_user_profiles_tipo_usuario ON user_profiles(tipo_usuario);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_secretaria ON user_profiles(secretaria_id);
CREATE INDEX idx_user_profiles_setor ON user_profiles(setor_id);
CREATE INDEX idx_user_profiles_perfil ON user_profiles(perfil_acesso_id);
CREATE INDEX idx_user_profiles_cpf ON user_profiles(cpf);
CREATE INDEX idx_user_profiles_matricula ON user_profiles(matricula);

-- Índices para permissões
CREATE INDEX idx_permissoes_codigo ON permissoes(codigo);
CREATE INDEX idx_permissoes_modulo ON permissoes(modulo_id);
CREATE INDEX idx_perfil_permissoes_perfil ON perfil_permissoes(perfil_id);
CREATE INDEX idx_user_permissoes_user ON user_permissoes(user_id);