-- =============================================
-- Script 22: Fix Auth Final - Resolver "Database error querying schema"
-- Configurar exatamente o que o Supabase Auth precisa
-- =============================================

-- 1. Verificar e corrigir permissões na tabela auth.users
GRANT USAGE ON SCHEMA auth TO authenticated, anon;
GRANT SELECT ON auth.users TO authenticated;

-- 2. Verificar se user_profiles tem as colunas necessárias
DO $$
BEGIN
    -- Verificar se a tabela user_profiles existe e tem estrutura correta
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        RAISE EXCEPTION 'Tabela user_profiles não existe!';
    END IF;
    
    -- Verificar colunas essenciais
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'id') THEN
        RAISE EXCEPTION 'Coluna id não existe em user_profiles!';
    END IF;
END $$;

-- 3. Remover TODAS as políticas RLS e recriar simples
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.user_profiles;

-- 4. Dar permissões básicas na tabela user_profiles
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;

-- 5. Reabilitar RLS apenas com política básica
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Política super simples: qualquer usuário autenticado pode ver qualquer perfil
CREATE POLICY "Permitir acesso autenticado" ON public.user_profiles
    FOR ALL TO authenticated USING (true);

-- 6. Remover trigger problemático temporariamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 7. Criar função simples para buscar perfil atual
CREATE OR REPLACE FUNCTION public.get_current_profile()
RETURNS TABLE (
    id uuid,
    email text,
    nome_completo text,
    tipo_usuario text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.email,
        up.nome_completo,
        up.tipo_usuario::text
    FROM public.user_profiles up
    WHERE up.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Dar permissões à função
GRANT EXECUTE ON FUNCTION public.get_current_profile() TO authenticated;

-- 9. Verificar se há usuários na tabela auth.users
DO $$
DECLARE
    user_count integer;
BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users;
    RAISE NOTICE 'Total de usuários em auth.users: %', user_count;
    
    -- Se não há usuários, criar um admin básico
    IF user_count = 0 THEN
        RAISE NOTICE 'Nenhum usuário encontrado. Crie usuários manualmente no Supabase Dashboard.';
    END IF;
END $$;

-- 10. Inserir perfil para usuários existentes (sem trigger)
INSERT INTO public.user_profiles (id, email, nome_completo, tipo_usuario, status, primeiro_acesso)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'nome_completo', au.email),
    CASE 
        WHEN au.raw_user_meta_data->>'tipo_usuario' = 'admin' THEN 'admin'::user_type
        WHEN au.raw_user_meta_data->>'tipo_usuario' = 'super_admin' THEN 'super_admin'::user_type
        ELSE 'cidadao'::user_type
    END,
    'ativo',
    true
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_profiles up WHERE up.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- 11. Verificar resultado
SELECT 
    'Usuários em auth.users' as origem,
    COUNT(*) as total
FROM auth.users
UNION ALL
SELECT 
    'Perfis em user_profiles' as origem,
    COUNT(*) as total
FROM public.user_profiles;

-- 12. Mostrar perfis criados
SELECT 
    id,
    email,
    nome_completo,
    tipo_usuario
FROM public.user_profiles
ORDER BY created_at DESC;

-- Script concluído
SELECT 'Auth fix aplicado! Teste o login agora.' as resultado;