-- =============================================================================
-- 01_EXTENSIONS_E_FUNCOES_BASE.SQL
-- =============================================================================
-- Habilita extensions necessárias e cria funções básicas do sistema
-- Execute PRIMEIRO para preparar o ambiente
-- =============================================================================

-- =====================================================
-- 1. HABILITAR EXTENSIONS NECESSÁRIAS
-- =====================================================

-- Extension para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension para geração de UUIDs mais modernas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 2. TIPOS ENUM GLOBAIS DO SISTEMA
-- =====================================================

-- Tipos de usuário do sistema
DROP TYPE IF EXISTS tipo_usuario_enum CASCADE;
CREATE TYPE tipo_usuario_enum AS ENUM (
    'super_admin',
    'admin', 
    'secretario',
    'diretor',
    'coordenador',
    'funcionario',
    'atendente',
    'cidadao'
);

-- Status geral para várias entidades
DROP TYPE IF EXISTS status_geral_enum CASCADE;
CREATE TYPE status_geral_enum AS ENUM (
    'ativo',
    'inativo',
    'suspenso',
    'arquivado'
);

-- Status específicos para protocolos
DROP TYPE IF EXISTS status_protocolo_enum CASCADE;
CREATE TYPE status_protocolo_enum AS ENUM (
    'aberto',
    'em_andamento',
    'aguardando_documentos',
    'aguardando_aprovacao',
    'aprovado',
    'rejeitado',
    'concluido',
    'cancelado'
);

-- Prioridades para protocolos
DROP TYPE IF EXISTS prioridade_enum CASCADE;
CREATE TYPE prioridade_enum AS ENUM (
    'baixa',
    'media',
    'alta',
    'urgente'
);

-- Tipos de notificação
DROP TYPE IF EXISTS tipo_notificacao_enum CASCADE;
CREATE TYPE tipo_notificacao_enum AS ENUM (
    'info',
    'sucesso',
    'aviso',
    'erro',
    'protocolo'
);

-- Tipos de comentários
DROP TYPE IF EXISTS tipo_comentario_enum CASCADE;
CREATE TYPE tipo_comentario_enum AS ENUM (
    'observacao',
    'resposta_oficial',
    'solicitacao_documentos'
);

-- Tipos de anexos
DROP TYPE IF EXISTS tipo_anexo_enum CASCADE;
CREATE TYPE tipo_anexo_enum AS ENUM (
    'documento',
    'comprovante',
    'foto',
    'outro'
);

-- =====================================================
-- 3. FUNÇÕES BÁSICAS DO SISTEMA
-- =====================================================

-- Função para atualizar campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para gerar número de protocolo único
CREATE OR REPLACE FUNCTION gerar_numero_protocolo()
RETURNS TEXT AS $$
DECLARE
    numero_protocolo TEXT;
    ano_atual TEXT;
    sequencial INTEGER;
BEGIN
    ano_atual := EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::TEXT;
    
    -- Buscar o próximo sequencial do ano
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_protocolo FROM 6 FOR 6) AS INTEGER)), 0) + 1
    INTO sequencial
    FROM protocolos
    WHERE numero_protocolo LIKE ano_atual || '%';
    
    -- Formatar: YYYY000001
    numero_protocolo := ano_atual || LPAD(sequencial::TEXT, 6, '0');
    
    RETURN numero_protocolo;
EXCEPTION
    WHEN others THEN
        -- Se a tabela protocolos ainda não existir, retornar padrão
        ano_atual := EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::TEXT;
        RETURN ano_atual || '000001';
END;
$$ LANGUAGE plpgsql;

-- Função para registrar logs de auditoria
CREATE OR REPLACE FUNCTION registrar_log_auditoria(
    p_tabela TEXT,
    p_operacao TEXT,
    p_registro_id UUID,
    p_dados_anteriores JSONB DEFAULT NULL,
    p_dados_novos JSONB DEFAULT NULL,
    p_usuario_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Esta função será implementada quando a tabela de logs for criada
    -- Por enquanto, apenas registra no log do PostgreSQL
    RAISE NOTICE 'AUDIT: % % on % by %', p_operacao, p_tabela, p_registro_id, COALESCE(p_usuario_id::TEXT, 'SYSTEM');
END;
$$ LANGUAGE plpgsql;

-- Função para validar CPF (simplificada)
CREATE OR REPLACE FUNCTION validar_cpf(cpf TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Remove caracteres não numéricos
    cpf := REGEXP_REPLACE(cpf, '[^0-9]', '', 'g');
    
    -- Verifica se tem 11 dígitos
    IF LENGTH(cpf) != 11 THEN
        RETURN FALSE;
    END IF;
    
    -- Verifica se todos os dígitos são iguais (CPF inválido)
    IF cpf ~ '^(.)\1*$' THEN
        RETURN FALSE;
    END IF;
    
    -- Para simplificar, aceita qualquer CPF que passe nas validações básicas
    -- Em produção, implementar validação completa dos dígitos verificadores
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Função para validar email
CREATE OR REPLACE FUNCTION validar_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. FUNÇÕES DE UTILIDADE PARA JSONB
-- =====================================================

-- Função para mesclar dados JSONB (merge)
CREATE OR REPLACE FUNCTION jsonb_merge(
    original JSONB,
    updates JSONB
)
RETURNS JSONB AS $$
BEGIN
    RETURN original || updates;
END;
$$ LANGUAGE plpgsql;

-- Função para extrair endereço formatado
CREATE OR REPLACE FUNCTION formatar_endereco(endereco JSONB)
RETURNS TEXT AS $$
DECLARE
    endereco_formatado TEXT := '';
BEGIN
    IF endereco IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Monta endereço: Rua, Número - Bairro, Cidade/UF, CEP
    IF endereco->>'logradouro' IS NOT NULL THEN
        endereco_formatado := endereco->>'logradouro';
    END IF;
    
    IF endereco->>'numero' IS NOT NULL THEN
        endereco_formatado := endereco_formatado || ', ' || (endereco->>'numero');
    END IF;
    
    IF endereco->>'bairro' IS NOT NULL THEN
        endereco_formatado := endereco_formatado || ' - ' || (endereco->>'bairro');
    END IF;
    
    IF endereco->>'cidade' IS NOT NULL THEN
        endereco_formatado := endereco_formatado || ', ' || (endereco->>'cidade');
    END IF;
    
    IF endereco->>'uf' IS NOT NULL THEN
        endereco_formatado := endereco_formatado || '/' || (endereco->>'uf');
    END IF;
    
    IF endereco->>'cep' IS NOT NULL THEN
        endereco_formatado := endereco_formatado || ', CEP: ' || (endereco->>'cep');
    END IF;
    
    RETURN TRIM(endereco_formatado);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'SCRIPT 01 - EXTENSIONS E FUNÇÕES BASE EXECUTADO COM SUCESSO' AS status;

-- Verificar extensions instaladas
SELECT 'EXTENSIONS INSTALADAS:' AS info;
SELECT extname AS extension_name 
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY extname;

-- Verificar tipos criados
SELECT 'TIPOS ENUM CRIADOS:' AS info;
SELECT typname AS enum_type 
FROM pg_type 
WHERE typtype = 'e' 
AND typname LIKE '%_enum'
ORDER BY typname;

-- Verificar funções criadas
SELECT 'FUNÇÕES CRIADAS:' AS info;
SELECT proname AS function_name 
FROM pg_proc 
WHERE proname IN (
    'update_updated_at_column',
    'gerar_numero_protocolo',
    'registrar_log_auditoria',
    'validar_cpf',
    'validar_email',
    'jsonb_merge',
    'formatar_endereco'
)
ORDER BY proname;