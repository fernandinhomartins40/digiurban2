-- =============================================
-- Script 06: Corrigir Trigger de Criação de Perfil
-- =============================================

-- 1. Verificar se existe conflito na tabela user_profiles
SELECT 
    'Problema detectado' as status,
    'user_profiles já tem constraint que impede novos usuários' as descricao
WHERE EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' 
    AND constraint_type = 'FOREIGN KEY'
);

-- 2. Remover e recriar o trigger de forma mais segura
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Criar função mais robusta para novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    perfil_id_var uuid;
    tipo_usuario_val text;
BEGIN
    -- Determinar tipo de usuário
    tipo_usuario_val := COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cidadao');
    
    -- Buscar ID do perfil correspondente
    SELECT id INTO perfil_id_var 
    FROM public.perfis_acesso 
    WHERE nome = CASE 
        WHEN tipo_usuario_val = 'super_admin' THEN 'Super Administrador'
        WHEN tipo_usuario_val = 'admin' THEN 'Administrador'
        WHEN tipo_usuario_val = 'secretario' THEN 'Secretário Municipal'
        WHEN tipo_usuario_val = 'funcionario' THEN 'Funcionário'
        ELSE 'Cidadão'
    END
    LIMIT 1;
    
    -- Se não encontrou o perfil, usar Cidadão como padrão
    IF perfil_id_var IS NULL THEN
        SELECT id INTO perfil_id_var 
        FROM public.perfis_acesso 
        WHERE nome = 'Cidadão'
        LIMIT 1;
    END IF;
    
    -- Inserir perfil do usuário (com tratamento de erro)
    BEGIN
        INSERT INTO public.user_profiles (
            id,
            email,
            nome_completo,
            tipo_usuario,
            perfil_acesso_id,
            status,
            primeiro_acesso
        )
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
            tipo_usuario_val::user_type,
            perfil_id_var,
            'ativo',
            true
        );
    EXCEPTION
        WHEN others THEN
            -- Log o erro mas não falha a criação do usuário
            RAISE WARNING 'Erro criando perfil para usuário %: %', NEW.email, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recriar o trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Dar permissões necessárias
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 6. Verificar se há constraints problemáticas na user_profiles
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_profiles'
    AND tc.table_schema = 'public';

-- 7. Garantir que a tabela user_profiles aceita novos registros
GRANT INSERT, UPDATE, SELECT ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Script concluído
SELECT 'Trigger corrigido! Teste o registro agora.' as resultado;