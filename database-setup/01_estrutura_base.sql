-- =============================================================================
-- 01_ESTRUTURA_BASE.SQL - DigiUrban Database Setup
-- =============================================================================
-- Cria a estrutura base do sistema municipal
-- Execute este script PRIMEIRO no SQL Editor do Supabase
-- =============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TIPOS CUSTOMIZADOS
-- =============================================================================

-- Tipos para o sistema de protocolos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_protocolo') THEN
    CREATE TYPE tipo_protocolo AS ENUM (
        'solicitacao',
        'reclamacao', 
        'sugestao',
        'denuncia',
        'informacao',
        'elogio'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_protocolo') THEN
    CREATE TYPE status_protocolo AS ENUM (
        'aberto',
        'em_andamento', 
        'aguardando_documentos',
        'aguardando_aprovacao',
        'aprovado',
        'rejeitado',
        'concluido',
        'cancelado'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prioridade_nivel') THEN
    CREATE TYPE prioridade_nivel AS ENUM (
        'baixa',
        'media', 
        'alta',
        'urgente'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_servico') THEN
    CREATE TYPE status_servico AS ENUM (
        'ativo',
        'inativo',
        'em_revisao'
    );
  END IF;
END $$;

-- =============================================================================
-- TABELA: Secretarias
-- =============================================================================
CREATE TABLE IF NOT EXISTS secretarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  sigla TEXT,
  descricao TEXT,
  email_oficial TEXT,
  telefone TEXT,
  endereco JSONB,
  responsavel_id UUID,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: Setores/Departamentos
-- =============================================================================
CREATE TABLE IF NOT EXISTS setores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  secretaria_id UUID NOT NULL REFERENCES secretarias(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  responsavel_id UUID,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: Perfis de Usuário
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  cpf TEXT UNIQUE,
  telefone TEXT,
  endereco JSONB,
  
  -- Dados profissionais (para servidores)
  cargo TEXT,
  matricula TEXT,
  secretaria_id UUID REFERENCES secretarias(id),
  setor_id UUID REFERENCES setores(id),
  
  -- Tipo de usuário
  tipo_usuario TEXT NOT NULL DEFAULT 'cidadao' CHECK (
    tipo_usuario IN ('super_admin', 'admin', 'secretario', 'diretor', 'coordenador', 'funcionario', 'atendente', 'cidadao')
  ),
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  primeiro_acesso BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  
  -- Foto de perfil
  foto_perfil TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: Catálogo de Serviços Municipais
-- =============================================================================
CREATE TABLE IF NOT EXISTS servicos_municipais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  subcategoria TEXT,
  secretaria_responsavel_id UUID NOT NULL REFERENCES secretarias(id),
  setor_responsavel_id UUID REFERENCES setores(id),
  
  -- Configurações do serviço
  requer_documentos BOOLEAN DEFAULT false,
  documentos_necessarios JSONB DEFAULT '[]',
  prazo_resposta_dias INTEGER DEFAULT 30,
  prazo_resolucao_dias INTEGER DEFAULT 60,
  taxa_servico DECIMAL(10,2) DEFAULT 0,
  
  -- Status e validação
  status status_servico DEFAULT 'ativo',
  requer_aprovacao_admin BOOLEAN DEFAULT false,
  aprovado_por UUID,
  aprovado_em TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- =============================================================================
-- ÍNDICES BÁSICOS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_secretarias_codigo ON secretarias(codigo);
CREATE INDEX IF NOT EXISTS idx_secretarias_ativo ON secretarias(ativo);
CREATE INDEX IF NOT EXISTS idx_setores_secretaria ON setores(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_setores_ativo ON setores(ativo);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tipo ON user_profiles(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_user_profiles_ativo ON user_profiles(ativo);
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos_municipais(categoria);
CREATE INDEX IF NOT EXISTS idx_servicos_status ON servicos_municipais(status);

-- =============================================================================
-- FUNÇÃO PARA UPDATED_AT
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================================================
DROP TRIGGER IF EXISTS update_secretarias_updated_at ON secretarias;
CREATE TRIGGER update_secretarias_updated_at 
    BEFORE UPDATE ON secretarias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_setores_updated_at ON setores;
CREATE TRIGGER update_setores_updated_at 
    BEFORE UPDATE ON setores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_servicos_updated_at ON servicos_municipais;
CREATE TRIGGER update_servicos_updated_at 
    BEFORE UPDATE ON servicos_municipais 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- DADOS INICIAIS - SECRETARIAS
-- =============================================================================
INSERT INTO secretarias (codigo, nome, sigla, descricao, ativo) VALUES
('SEC-ADM', 'Secretaria de Administração', 'ADM', 'Responsável pela gestão administrativa do município', true),
('SEC-FIN', 'Secretaria de Finanças', 'FIN', 'Gestão financeira e tributária', true),
('SEC-SAU', 'Secretaria de Saúde', 'SAUDE', 'Políticas e serviços de saúde pública', true),
('SEC-EDU', 'Secretaria de Educação', 'EDUC', 'Sistema educacional municipal', true),
('SEC-OBR', 'Secretaria de Obras', 'OBRAS', 'Infraestrutura e obras públicas', true),
('SEC-ASS', 'Secretaria de Assistência Social', 'ASSIST', 'Programas sociais e assistência', true),
('SEC-CUL', 'Secretaria de Cultura', 'CULT', 'Políticas culturais e eventos', true),
('SEC-ESP', 'Secretaria de Esportes', 'ESP', 'Esportes e recreação', true),
('SEC-AGR', 'Secretaria de Agricultura', 'AGR', 'Desenvolvimento rural e agricultura', true),
('SEC-TUR', 'Secretaria de Turismo', 'TUR', 'Fomento ao turismo local', true),
('SEC-HAB', 'Secretaria de Habitação', 'HAB', 'Políticas habitacionais', true),
('SEC-MEI', 'Secretaria de Meio Ambiente', 'MEIO', 'Preservação ambiental', true),
('SEC-PLA', 'Secretaria de Planejamento Urbano', 'PLAN', 'Planejamento urbano e territorial', true),
('SEC-SER', 'Secretaria de Serviços Públicos', 'SERV', 'Serviços públicos municipais', true),
('SEC-SEG', 'Secretaria de Segurança Pública', 'SEG', 'Segurança pública municipal', true)
ON CONFLICT (codigo) DO NOTHING;

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Estrutura base criada com sucesso!';
    RAISE NOTICE 'Secretarias criadas: %', (SELECT COUNT(*) FROM secretarias);
    RAISE NOTICE 'Próximo passo: Execute 02_auth_profiles.sql';
END $$;