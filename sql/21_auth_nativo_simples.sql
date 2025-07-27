-- =============================================
-- Script 21: Autenticação Nativa Supabase - SIMPLES
-- Usar apenas o sistema padrão sem reinventar a roda
-- =============================================

-- 1. Limpar configurações anteriores desnecessárias
DROP TABLE IF EXISTS public.temp_credentials CASCADE;
DROP TABLE IF EXISTS public.cidadao_profiles CASCADE;
DROP TABLE IF EXISTS public.protocolos CASCADE;
DROP TABLE IF EXISTS public.servicos_publicos CASCADE;
DROP TABLE IF EXISTS public.protocolo_historico CASCADE;

-- 2. Apenas ajustar a tabela user_profiles existente para trabalhar com auth.users
-- Verificar se já existe a referência para auth.users
DO $$
BEGIN
    -- Verificar se a coluna id já é uma foreign key para auth.users
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_id_fkey' 
        AND table_name = 'user_profiles'
    ) THEN
        -- Adicionar a foreign key se não existir
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Habilitar RLS na tabela user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Limpar políticas antigas
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Cidadãos podem ver apenas seu próprio perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Cidadãos podem atualizar apenas seu próprio perfil" ON public.user_profiles;

-- 5. Criar políticas RLS simples
CREATE POLICY "Usuários podem ver próprio perfil" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND tipo_usuario IN ('super_admin', 'admin')
        )
    );

-- 6. Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (
        id,
        email,
        nome_completo,
        tipo_usuario,
        status,
        primeiro_acesso
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cidadao'),
        'ativo',
        true
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Função simples para buscar perfil do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_profile()
RETURNS SETOF public.user_profiles AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.user_profiles
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Criar usuários administrativos diretamente na tabela auth.users
-- (Isso deve ser feito via interface do Supabase ou API admin)

-- 10. Inserir perfis para usuários que já existem no auth.users
INSERT INTO public.user_profiles (
    id, email, nome_completo, tipo_usuario, status, primeiro_acesso
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'nome_completo', au.email),
    COALESCE(au.raw_user_meta_data->>'tipo_usuario', 'cidadao'),
    'ativo',
    true
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = au.id
);

-- 11. Dar permissões necessárias
GRANT EXECUTE ON FUNCTION public.get_user_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 12. Verificar resultado
SELECT 
    'Usuários no auth.users' as tabela,
    COUNT(*) as total
FROM auth.users
UNION ALL
SELECT 
    'Perfis em user_profiles' as tabela,
    COUNT(*) as total
FROM public.user_profiles;

-- Script concluído
SELECT 'Autenticação nativa configurada com sucesso!' as resultado;