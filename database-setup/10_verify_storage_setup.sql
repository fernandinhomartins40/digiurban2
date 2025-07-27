-- =============================================================================
-- VERIFICAÇÃO COMPLETA DO SETUP DE STORAGE PARA FOTO DE PERFIL
-- =============================================================================
-- Execute este script no SQL Editor do Supabase para verificar se tudo está correto
-- =============================================================================

-- 1. Verificar se a coluna foto_perfil existe
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'foto_perfil';

-- 2. Verificar se o bucket user-uploads existe
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets 
WHERE name = 'user-uploads';

-- 3. Verificar políticas RLS do storage
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
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%avatar%' 
ORDER BY policyname;

-- 4. Testar se usuário atual tem permissão
SELECT 
    auth.uid() as current_user_id,
    current_setting('role') as current_role;

-- 5. Verificar RLS habilitado na tabela storage.objects
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- =============================================================================
-- RESULTADOS ESPERADOS:
-- =============================================================================
/*
1. Coluna foto_perfil deve existir em user_profiles (TEXT, nullable)
2. Bucket user-uploads deve existir com:
   - public: true
   - file_size_limit: 1048576 (1MB)
   - allowed_mime_types: {image/jpeg,image/png,image/webp,image/gif}
3. Deve haver 4 políticas de avatar:
   - Avatar images are publicly accessible (SELECT)
   - Users can upload their own avatar (INSERT)
   - Users can update their own avatar (UPDATE)
   - Users can delete their own avatar (DELETE)
4. current_user_id deve mostrar o UUID do usuário autenticado
5. rowsecurity deve ser true para storage.objects
*/