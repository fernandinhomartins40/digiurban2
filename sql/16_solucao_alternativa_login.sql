-- =====================================================
-- 16_solucao_alternativa_login.sql
-- SOLUÇÃO ALTERNATIVA: USAR SERVICE ROLE PARA LOGIN
-- =====================================================

-- ⚠️ Esta é uma solução temporária para contornar problemas de GoTrue
-- Execute este script para criar uma função de login customizada

-- =====================================================
-- 1. FUNÇÃO PERSONALIZADA DE AUTENTICAÇÃO
-- =====================================================

CREATE OR REPLACE FUNCTION public.custom_login(
    user_email TEXT,
    user_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record auth.users%ROWTYPE;
    profile_record user_profiles%ROWTYPE;
    result JSON;
BEGIN
    -- Verificar se o usuário existe e a senha está correta
    SELECT * INTO user_record
    FROM auth.users
    WHERE email = user_email
    AND encrypted_password = crypt(user_password, encrypted_password);
    
    -- Se usuário não encontrado ou senha incorreta
    IF user_record.id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Email ou senha incorretos',
            'user', null,
            'profile', null
        );
    END IF;
    
    -- Buscar perfil do usuário
    SELECT * INTO profile_record
    FROM user_profiles
    WHERE id = user_record.id;
    
    -- Se perfil não encontrado
    IF profile_record.id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Perfil de usuário não encontrado',
            'user', null,
            'profile', null
        );
    END IF;
    
    -- Retornar dados do usuário e perfil
    RETURN json_build_object(
        'success', true,
        'error', null,
        'user', json_build_object(
            'id', user_record.id,
            'email', user_record.email,
            'role', user_record.role,
            'email_confirmed_at', user_record.email_confirmed_at
        ),
        'profile', json_build_object(
            'id', profile_record.id,
            'email', profile_record.email,
            'nome_completo', profile_record.nome_completo,
            'tipo_usuario', profile_record.tipo_usuario,
            'perfil_acesso_id', profile_record.perfil_acesso_id,
            'secretaria_id', profile_record.secretaria_id,
            'cargo', profile_record.cargo,
            'status', profile_record.status,
            'cpf', profile_record.cpf,
            'telefone', profile_record.telefone
        )
    );
END;
$$;

-- =====================================================
-- 2. FUNÇÃO PARA BUSCAR PERMISSÕES
-- =====================================================

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

-- =====================================================
-- 3. FUNÇÃO PARA BUSCAR SECRETARIA
-- =====================================================

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
-- 4. PERMITIR ACESSO PÚBLICO ÀS FUNÇÕES
-- =====================================================

-- Permitir acesso anônimo às funções de login
GRANT EXECUTE ON FUNCTION public.custom_login(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_secretaria(UUID) TO anon, authenticated;

-- =====================================================
-- 5. TESTE DA FUNÇÃO
-- =====================================================

-- Testar a função de login customizada
SELECT public.custom_login('prefeito@municipio.gov.br', 'Prefeito@2024') as login_test;

-- Verificar se retorna sucesso
SELECT 
    CASE 
        WHEN (public.custom_login('prefeito@municipio.gov.br', 'Prefeito@2024')->>'success')::boolean 
        THEN '✅ Login customizado funcionando'
        ELSE '❌ Erro no login customizado'
    END as status_login;

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================

/*
🎯 ESTA É UMA SOLUÇÃO TEMPORÁRIA

📋 O QUE FOI CRIADO:
- Função custom_login() que autentica diretamente no banco
- Função get_user_permissions() para buscar permissões
- Função get_user_secretaria() para buscar dados da secretaria

🔧 PRÓXIMO PASSO:
Agora você precisa atualizar o código React para usar estas funções
em vez do Supabase auth padrão.

⚠️ IMPORTANTE:
Esta solução contorna o problema do GoTrue,
mas você deve configurar corretamente o Supabase depois.

✅ VANTAGENS:
- Funciona independente da configuração GoTrue
- Mantém toda a lógica de permissões
- Permite testar o sistema completo

❌ DESVANTAGENS:
- Não tem refresh tokens automáticos
- Não tem sessão automática
- Precisa implementar logout manual

🎯 USE ESTA SOLUÇÃO PARA:
- Testar o sistema imediatamente
- Demonstrar funcionalidades
- Desenvolver módulos específicos
*/