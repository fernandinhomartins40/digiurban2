-- =====================================================
-- 14_diagnosticar_erro_login.sql
-- DIAGNOSTICAR E CORRIGIR ERRO DE LOGIN NO SUPABASE
-- =====================================================

-- ⚠️ Execute este script no SQL Editor do Supabase para diagnosticar o problema

-- =====================================================
-- 1. VERIFICAR SE AS TABELAS EXISTEM
-- =====================================================

SELECT 
    'Verificando tabelas necessárias...' as status;

-- Verificar auth.users
SELECT 
    'auth.users' as tabela,
    COUNT(*) as total_registros
FROM auth.users
WHERE email LIKE '%@municipio.gov.br' OR email LIKE '%@email.com';

-- Verificar user_profiles
SELECT 
    'user_profiles' as tabela,
    COUNT(*) as total_registros
FROM user_profiles
WHERE email LIKE '%@municipio.gov.br' OR email LIKE '%@email.com';

-- Verificar secretarias
SELECT 
    'secretarias' as tabela,
    COUNT(*) as total_registros
FROM secretarias;

-- Verificar perfis_acesso
SELECT 
    'perfis_acesso' as tabela,
    COUNT(*) as total_registros
FROM perfis_acesso;

-- =====================================================
-- 2. VERIFICAR USUÁRIO ESPECÍFICO
-- =====================================================

-- Verificar se o usuário prefeito existe no auth.users
SELECT 
    'Usuário prefeito em auth.users' as verificacao,
    u.id,
    u.email,
    u.email_confirmed_at,
    u.role,
    u.aud,
    CASE 
        WHEN u.encrypted_password IS NOT NULL THEN 'Senha definida'
        ELSE 'Senha não definida'
    END as status_senha
FROM auth.users u
WHERE u.email = 'prefeito@municipio.gov.br';

-- Verificar se o usuário prefeito existe no user_profiles
SELECT 
    'Usuário prefeito em user_profiles' as verificacao,
    up.id,
    up.email,
    up.nome_completo,
    up.tipo_usuario,
    up.status,
    pa.nome as perfil_nome
FROM user_profiles up
LEFT JOIN perfis_acesso pa ON pa.id = up.perfil_acesso_id
WHERE up.email = 'prefeito@municipio.gov.br';

-- =====================================================
-- 3. VERIFICAR POLICIES RLS
-- =====================================================

-- Verificar se RLS está ativo
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_ativo
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'secretarias', 'perfis_acesso', 'permissoes');

-- Verificar policies existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'secretarias', 'perfis_acesso');

-- =====================================================
-- 4. TESTAR FUNÇÃO DE LOGIN (SIMULAÇÃO)
-- =====================================================

-- Verificar se conseguimos buscar dados do usuário
SELECT 
    'Simulação de busca de perfil' as teste,
    u.id as user_id,
    u.email,
    up.nome_completo,
    up.tipo_usuario,
    pa.nome as perfil_nome,
    s.nome as secretaria_nome
FROM auth.users u
LEFT JOIN user_profiles up ON up.id = u.id
LEFT JOIN perfis_acesso pa ON pa.id = up.perfil_acesso_id
LEFT JOIN secretarias s ON s.id = up.secretaria_id
WHERE u.email = 'prefeito@municipio.gov.br';

-- =====================================================
-- 5. VERIFICAR PERMISSÕES DO USUÁRIO auth
-- =====================================================

-- Verificar se o role do Supabase tem permissões adequadas
SELECT 
    'Permissões do role atual' as verificacao,
    current_user as usuario_atual,
    session_user as sessao_usuario;

-- Verificar se podemos acessar as tabelas necessárias
SELECT 
    'Teste de acesso às tabelas' as teste,
    'user_profiles' as tabela,
    COUNT(*) as total_acessivel
FROM user_profiles
LIMIT 1;

-- =====================================================
-- 6. VERIFICAR FUNÇÕES E TRIGGERS
-- =====================================================

-- Verificar se as funções foram criadas
SELECT 
    'Funções criadas' as verificacao,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%user%';

-- =====================================================
-- 7. CORRIGIR PROBLEMAS COMUNS
-- =====================================================

-- Garantir que o usuário prefeito tenha dados completos
DO $$
BEGIN
    -- Verificar se existe inconsistência entre auth.users e user_profiles
    IF EXISTS (
        SELECT 1 FROM auth.users u 
        WHERE u.email = 'prefeito@municipio.gov.br' 
        AND NOT EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.id = u.id
        )
    ) THEN
        RAISE NOTICE '⚠️ PROBLEMA: Usuário existe em auth.users mas não em user_profiles';
        
        -- Buscar o ID do usuário
        DECLARE
            user_uuid UUID;
        BEGIN
            SELECT id INTO user_uuid FROM auth.users WHERE email = 'prefeito@municipio.gov.br';
            
            -- Criar perfil se não existir
            INSERT INTO user_profiles (
                id, email, nome_completo, tipo_usuario, 
                perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso
            ) VALUES (
                user_uuid, 
                'prefeito@municipio.gov.br', 
                'Prefeito Municipal', 
                'super_admin',
                (SELECT id FROM perfis_acesso WHERE nome = 'Super Administrador' LIMIT 1),
                (SELECT id FROM secretarias WHERE codigo = 'GAB' LIMIT 1),
                'Prefeito', 
                'ativo', 
                false
            )
            ON CONFLICT (id) DO NOTHING;
            
            RAISE NOTICE '✅ Perfil do prefeito corrigido/criado';
        END;
    ELSE
        RAISE NOTICE '✅ Usuário prefeito está consistente';
    END IF;
END $$;

-- =====================================================
-- 8. HABILITAR FEATURES NECESSÁRIAS
-- =====================================================

-- Verificar se o email está confirmado
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email = 'prefeito@municipio.gov.br' 
AND email_confirmed_at IS NULL;

-- =====================================================
-- 9. VERIFICAÇÃO FINAL
-- =====================================================

SELECT 
    '🔍 VERIFICAÇÃO FINAL' as status,
    u.email,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
        ELSE '❌ Email não confirmado'
    END as email_status,
    CASE 
        WHEN u.encrypted_password IS NOT NULL THEN '✅ Senha definida'
        ELSE '❌ Senha não definida'
    END as senha_status,
    CASE 
        WHEN up.id IS NOT NULL THEN '✅ Perfil existe'
        ELSE '❌ Perfil não existe'
    END as perfil_status,
    up.tipo_usuario,
    up.status as user_status
FROM auth.users u
LEFT JOIN user_profiles up ON up.id = u.id
WHERE u.email = 'prefeito@municipio.gov.br';

-- =====================================================
-- INSTRUÇÕES DE DIAGNÓSTICO
-- =====================================================

/*
🔍 COMO USAR ESTE SCRIPT DE DIAGNÓSTICO:

1. 📋 COPIE TODO O CÓDIGO ACIMA
2. 🔗 COLE NO SQL EDITOR DO SUPABASE
3. ▶️ EXECUTE E ANALISE OS RESULTADOS

📊 O QUE VERIFICAR NOS RESULTADOS:

✅ SUCESSO SE:
- Todas as tabelas têm registros
- Usuário prefeito existe em auth.users E user_profiles
- Email está confirmado
- Senha está definida
- RLS está configurado
- Perfil tem tipo_usuario = 'super_admin'

❌ PROBLEMAS COMUNS:
- "total_registros = 0" → Scripts anteriores não executaram
- "Perfil não existe" → Inconsistência entre tabelas
- "Email não confirmado" → Usuario não pode fazer login
- "Senha não definida" → Senha não foi criptografada

🛠️ PRÓXIMOS PASSOS:
Se encontrar problemas, execute os scripts de 01 a 12 novamente
ou me informe qual erro específico apareceu!
*/