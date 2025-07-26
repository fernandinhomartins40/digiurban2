-- =====================================================
-- 18_login_simplificado_final.sql
-- VERSÃO ULTRA SIMPLIFICADA - APENAS PARA DESENVOLVIMENTO
-- =====================================================

-- ⚠️ Esta versão não usa criptografia - APENAS PARA DESENVOLVIMENTO/TESTE

-- =====================================================
-- 1. LIMPAR FUNÇÕES ANTERIORES
-- =====================================================

DROP FUNCTION IF EXISTS public.custom_login(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.verify_password(TEXT, TEXT);

-- =====================================================
-- 2. CRIAR TABELA TEMPORÁRIA DE SENHAS
-- =====================================================

-- Criar tabela simples para armazenar credenciais temporárias
CREATE TABLE IF NOT EXISTS public.temp_credentials (
    email TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Limpar dados anteriores
DELETE FROM public.temp_credentials;

-- Inserir credenciais de teste
INSERT INTO public.temp_credentials (email, password) VALUES
('prefeito@municipio.gov.br', 'Prefeito@2024'),
('chefe.gabinete@municipio.gov.br', 'ChefGab@2024'),
('secretario.saude@municipio.gov.br', 'SecSaude@2024'),
('secretario.educacao@municipio.gov.br', 'SecEdu@2024'),
('diretor.saude@municipio.gov.br', 'DirSaude@2024'),
('coord.educacao@municipio.gov.br', 'CoordEdu@2024'),
('funcionario.saude@municipio.gov.br', 'FuncSaude@2024'),
('funcionario.assistencia@municipio.gov.br', 'FuncAssis@2024'),
('atendente.recepcao@municipio.gov.br', 'AtendRec@2024'),
('atendente.saude@municipio.gov.br', 'AtendSaude@2024'),
('joao.silva@email.com', 'JoaoSilva@2024'),
('maria.santos@email.com', 'MariaSantos@2024');

SELECT 'Credenciais temporárias inseridas' as status;

-- =====================================================
-- 3. FUNÇÃO DE LOGIN ULTRA SIMPLES
-- =====================================================

CREATE OR REPLACE FUNCTION public.simple_login(
    user_email TEXT,
    user_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    temp_password TEXT;
    user_exists BOOLEAN := false;
    profile_data RECORD;
    result JSON;
BEGIN
    -- Verificar se email existe nas credenciais temporárias
    SELECT password INTO temp_password 
    FROM public.temp_credentials 
    WHERE email = user_email;
    
    -- Se email não encontrado na tabela temporária
    IF temp_password IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Email não encontrado',
            'user', null,
            'profile', null
        );
    END IF;
    
    -- Verificar senha (comparação simples)
    IF temp_password != user_password THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Senha incorreta',
            'user', null,
            'profile', null
        );
    END IF;
    
    -- Buscar dados do perfil
    SELECT 
        up.id,
        up.email,
        up.nome_completo,
        up.tipo_usuario,
        up.perfil_acesso_id,
        up.secretaria_id,
        up.cargo,
        up.status,
        up.cpf,
        up.telefone
    INTO profile_data
    FROM user_profiles up
    WHERE up.email = user_email;
    
    -- Se perfil não encontrado
    IF profile_data.id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Perfil não encontrado para este email',
            'user', null,
            'profile', null
        );
    END IF;
    
    -- Retornar sucesso com dados
    RETURN json_build_object(
        'success', true,
        'error', null,
        'user', json_build_object(
            'id', profile_data.id,
            'email', profile_data.email,
            'role', 'authenticated',
            'email_confirmed_at', NOW()
        ),
        'profile', json_build_object(
            'id', profile_data.id,
            'email', profile_data.email,
            'nome_completo', profile_data.nome_completo,
            'tipo_usuario', profile_data.tipo_usuario,
            'perfil_acesso_id', profile_data.perfil_acesso_id,
            'secretaria_id', profile_data.secretaria_id,
            'cargo', profile_data.cargo,
            'status', profile_data.status,
            'cpf', profile_data.cpf,
            'telefone', profile_data.telefone
        )
    );
END;
$$;

-- =====================================================
-- 4. MANTER FUNÇÕES AUXILIARES
-- =====================================================

-- Função para buscar permissões (sem alteração)
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_profile_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    permissions_result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', p.id,
            'codigo', p.codigo,
            'nome', p.nome,
            'descricao', p.descricao,
            'modulo', p.modulo,
            'concedida', COALESCE(pp.concedida, false)
        )
    ) INTO permissions_result
    FROM permissoes p
    LEFT JOIN perfil_permissoes pp ON pp.permissao_id = p.id
    LEFT JOIN user_profiles up ON up.perfil_acesso_id = pp.perfil_id
    WHERE up.id = user_profile_id
    AND pp.concedida = true;
    
    RETURN COALESCE(permissions_result, '[]'::json);
END;
$$;

-- Função para buscar secretaria (sem alteração)
CREATE OR REPLACE FUNCTION public.get_user_secretaria(secretaria_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    secretaria_result JSON;
BEGIN
    SELECT json_build_object(
        'id', s.id,
        'codigo', s.codigo,
        'nome', s.nome,
        'descricao', s.descricao,
        'responsavel_id', s.responsavel_id
    ) INTO secretaria_result
    FROM secretarias s
    WHERE s.id = secretaria_id;
    
    RETURN secretaria_result;
END;
$$;

-- =====================================================
-- 5. PERMITIR ACESSO ÀS FUNÇÕES
-- =====================================================

GRANT EXECUTE ON FUNCTION public.simple_login(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_secretaria(UUID) TO anon, authenticated;

-- Permitir acesso à tabela temporária
GRANT SELECT ON public.temp_credentials TO anon, authenticated;

-- =====================================================
-- 6. TESTE FINAL
-- =====================================================

-- Testar a nova função
SELECT 
    'TESTE SIMPLES: Prefeito' as teste,
    public.simple_login('prefeito@municipio.gov.br', 'Prefeito@2024') as resultado;

-- Verificar sucesso
SELECT 
    CASE 
        WHEN (public.simple_login('prefeito@municipio.gov.br', 'Prefeito@2024')->>'success')::boolean 
        THEN '✅ Login simplificado funcionando!'
        ELSE '❌ Ainda com problemas'
    END as status_final;

-- Testar senha errada
SELECT 
    'TESTE: Senha errada' as teste,
    public.simple_login('prefeito@municipio.gov.br', 'senha_errada') as resultado;

-- =====================================================
-- INSTRUÇÕES FINAIS
-- =====================================================

/*
🎯 ESTA VERSÃO É ULTRA SIMPLES:

✅ FUNCIONA COM:
- Tabela simples temp_credentials
- Comparação direta de strings
- Busca de perfil por email
- Retorno padronizado JSON

⚠️ IMPORTANTE:
- Não usa criptografia (desenvolvimento apenas)
- Tabela temporária separada
- Função chamada simple_login()

🔧 PRÓXIMO PASSO:
Atualize o código React para usar 'simple_login' 
em vez de 'custom_login'

📋 CREDENCIAIS TESTADAS:
Email: prefeito@municipio.gov.br
Senha: Prefeito@2024

🚀 DEVE FUNCIONAR AGORA!
*/