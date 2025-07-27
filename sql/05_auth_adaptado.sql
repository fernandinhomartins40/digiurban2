-- =============================================
-- Script 05: Auth Adaptado para Instância Existente
-- =============================================

-- 1. Função para buscar perfil do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE (
    id uuid,
    email text,
    nome_completo text,
    tipo_usuario text,
    secretaria_id uuid,
    cargo text,
    status text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.email,
        up.nome_completo,
        up.tipo_usuario::text,
        up.secretaria_id,
        up.cargo,
        up.status
    FROM public.user_profiles up
    WHERE up.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Função para buscar permissões do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_permissions()
RETURNS TABLE (
    codigo text,
    nome text,
    modulo text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.codigo,
        p.nome,
        p.modulo
    FROM public.user_profiles up
    JOIN public.perfil_permissoes pp ON pp.perfil_id = up.perfil_acesso_id
    JOIN public.permissoes p ON p.id = pp.permissao_id
    WHERE up.id = auth.uid()
    AND pp.concedida = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Função para inserir perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
        COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cidadao')::user_type,
        (
            SELECT id FROM public.perfis_acesso 
            WHERE nome = CASE 
                WHEN COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cidadao') = 'super_admin' THEN 'Super Administrador'
                WHEN COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cidadao') = 'admin' THEN 'Administrador'
                WHEN COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cidadao') = 'secretario' THEN 'Secretário Municipal'
                WHEN COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cidadao') = 'funcionario' THEN 'Funcionário'
                ELSE 'Cidadão'
            END
            LIMIT 1
        ),
        'ativo',
        true
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Dar permissões às funções
GRANT EXECUTE ON FUNCTION public.get_current_user_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 6. Dar permissões de leitura nas tabelas auxiliares
GRANT SELECT ON public.secretarias TO authenticated;
GRANT SELECT ON public.perfis_acesso TO authenticated;
GRANT SELECT ON public.permissoes TO authenticated;
GRANT SELECT ON public.perfil_permissoes TO authenticated;

-- 7. Inserir perfis para usuários já existentes no auth.users
INSERT INTO public.user_profiles (
    id, 
    email, 
    nome_completo, 
    tipo_usuario, 
    perfil_acesso_id,
    status, 
    primeiro_acesso
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'nome_completo', au.email),
    COALESCE(au.raw_user_meta_data->>'tipo_usuario', 'cidadao')::user_type,
    (
        SELECT id FROM public.perfis_acesso 
        WHERE nome = CASE 
            WHEN COALESCE(au.raw_user_meta_data->>'tipo_usuario', 'cidadao') = 'super_admin' THEN 'Super Administrador'
            WHEN COALESCE(au.raw_user_meta_data->>'tipo_usuario', 'cidadao') = 'admin' THEN 'Administrador'
            WHEN COALESCE(au.raw_user_meta_data->>'tipo_usuario', 'cidadao') = 'secretario' THEN 'Secretário Municipal'
            WHEN COALESCE(au.raw_user_meta_data->>'tipo_usuario', 'cidadao') = 'funcionario' THEN 'Funcionário'
            ELSE 'Cidadão'
        END
        LIMIT 1
    ),
    'ativo',
    true
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = au.id
);

-- 8. Verificar configuração final
SELECT 
    'Usuários no auth.users' as tabela,
    COUNT(*) as total
FROM auth.users
UNION ALL
SELECT 
    'Perfis em user_profiles' as tabela,
    COUNT(*) as total
FROM public.user_profiles;

-- 9. Mostrar perfis criados
SELECT 
    up.email,
    up.nome_completo,
    up.tipo_usuario,
    pa.nome as perfil_acesso,
    up.status
FROM public.user_profiles up
LEFT JOIN public.perfis_acesso pa ON pa.id = up.perfil_acesso_id
ORDER BY up.created_at DESC;

-- Script 05 concluído
SELECT 'Script 05 - Auth Adaptado executado com sucesso!' as resultado;