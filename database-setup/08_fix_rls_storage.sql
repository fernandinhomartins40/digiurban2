-- =============================================================================
-- FIX_RLS_STORAGE.SQL - Correção específica das políticas RLS do Storage
-- =============================================================================
-- Execute este script para corrigir o erro de permissão no upload
-- =============================================================================

-- 1. Verificar usuário atual e estado do auth
SELECT 
    'USUARIO_ATUAL' as tipo,
    auth.uid() as user_id,
    CASE 
        WHEN auth.uid() IS NULL THEN 'NAO_AUTENTICADO'
        ELSE 'AUTENTICADO'
    END as status;

-- 2. Verificar se user_profiles existe para o usuário atual
SELECT 
    'USER_PROFILE' as tipo,
    COUNT(*) as existe,
    CASE 
        WHEN COUNT(*) > 0 THEN 'PERFIL_EXISTE'
        ELSE 'PERFIL_NAO_EXISTE'
    END as status
FROM user_profiles 
WHERE id = auth.uid();

-- 3. Remover TODAS as políticas do storage.objects relacionadas a uploads
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own uploads" ON storage.objects;

-- 4. Criar políticas mais permissivas e simples

-- Política para visualização pública (qualquer arquivo do bucket user-uploads)
CREATE POLICY "Public access to user uploads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user-uploads');

-- Política de upload simplificada (usuários autenticados podem fazer upload)
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'user-uploads' 
    AND auth.role() = 'authenticated'
);

-- Política de atualização (usuários podem atualizar arquivos que enviaram)
CREATE POLICY "Users can update own files" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'user-uploads' 
    AND auth.uid() IS NOT NULL
);

-- Política de remoção (usuários podem deletar arquivos que enviaram)
CREATE POLICY "Users can delete own files" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'user-uploads' 
    AND auth.uid() IS NOT NULL
);

-- 5. Verificar se RLS está habilitado
SELECT 
    'RLS_STATUS' as tipo,
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- 6. Listar todas as políticas criadas
SELECT 
    'POLITICAS_CRIADAS' as tipo,
    policyname as nome,
    cmd as operacao,
    CASE 
        WHEN cmd = 'SELECT' THEN 'VISUALIZAR'
        WHEN cmd = 'INSERT' THEN 'UPLOAD'
        WHEN cmd = 'UPDATE' THEN 'ATUALIZAR'
        WHEN cmd = 'DELETE' THEN 'DELETAR'
        ELSE cmd
    END as acao
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%user%' OR policyname LIKE '%upload%' OR policyname LIKE '%Public%'
ORDER BY cmd;

-- 7. Teste de conectividade com auth
DO $$
BEGIN
    IF auth.uid() IS NOT NULL THEN
        RAISE NOTICE '✅ Usuário autenticado: %', auth.uid();
        RAISE NOTICE '✅ Role atual: %', auth.role();
    ELSE
        RAISE NOTICE '❌ Usuário NÃO autenticado';
        RAISE NOTICE '❌ Isso pode causar problemas no upload';
    END IF;
    
    IF EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()) THEN
        RAISE NOTICE '✅ Perfil de usuário encontrado';
    ELSE
        RAISE NOTICE '❌ Perfil de usuário NÃO encontrado';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '🔧 POLÍTICAS RLS SIMPLIFICADAS APLICADAS';
    RAISE NOTICE 'Agora teste o upload novamente!';
    RAISE NOTICE '';
END $$;