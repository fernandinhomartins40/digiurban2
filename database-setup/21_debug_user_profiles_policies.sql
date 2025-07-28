-- Debug completo das políticas RLS na tabela user_profiles

-- 1. Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 2. Listar todas as políticas
SELECT 
    schemaname,
    tablename, 
    policyname, 
    permissive, 
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 3. Verificar colunas da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Testar uma consulta simples como usuário anônimo
-- (Execute manualmente se necessário)
-- SELECT id, nome_completo FROM user_profiles LIMIT 1;