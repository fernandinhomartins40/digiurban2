-- =============================================================================
-- 12_DEBUG_UPLOAD_ISSUE.SQL - Debug do problema de upload após modificações
-- =============================================================================
-- Execute para investigar o que pode ter quebrado
-- =============================================================================

-- 1. Verificar se usuário atual tem dados corretos
SELECT 
    'USUARIO_ATUAL' as tipo,
    auth.uid() as user_id,
    CASE 
        WHEN auth.uid() IS NULL THEN 'NAO_AUTENTICADO'
        ELSE 'AUTENTICADO'
    END as status;

-- 2. Verificar perfil do usuário atual
SELECT 
    'PERFIL_USUARIO' as tipo,
    id,
    nome_completo,
    tipo_usuario,
    foto_perfil,
    CASE 
        WHEN foto_perfil IS NOT NULL THEN 'TEM_FOTO'
        ELSE 'SEM_FOTO'
    END as status_foto
FROM user_profiles 
WHERE id = auth.uid();

-- 3. Verificar bucket user-uploads
SELECT 
    'BUCKET_STATUS' as tipo,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'user-uploads';

-- 4. Verificar políticas RLS ativas
SELECT 
    'POLITICAS_RLS' as tipo,
    policyname,
    cmd,
    CASE 
        WHEN cmd = 'SELECT' THEN 'VISUALIZAR'
        WHEN cmd = 'INSERT' THEN 'UPLOAD'
        WHEN cmd = 'UPDATE' THEN 'ATUALIZAR' 
        WHEN cmd = 'DELETE' THEN 'DELETAR'
    END as acao
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND (policyname LIKE '%user%' OR policyname LIKE '%upload%' OR policyname LIKE '%Public%')
ORDER BY cmd;

-- 5. Verificar arquivos existentes no storage para o usuário atual
SELECT 
    'ARQUIVOS_STORAGE' as tipo,
    name,
    bucket_id,
    created_at,
    ROUND((metadata->>'size')::NUMERIC / 1024, 2) as size_kb
FROM storage.objects 
WHERE bucket_id = 'user-uploads'
AND name LIKE '%' || auth.uid()::text || '%'
ORDER BY created_at DESC
LIMIT 5;

-- 6. Teste de conectividade com auth
DO $$
DECLARE
    user_id UUID;
    profile_exists BOOLEAN;
    bucket_exists BOOLEAN;
    policies_count INTEGER;
BEGIN
    user_id := auth.uid();
    
    -- Verificar se perfil existe
    SELECT EXISTS (
        SELECT 1 FROM user_profiles WHERE id = user_id
    ) INTO profile_exists;
    
    -- Verificar se bucket existe
    SELECT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'user-uploads'
    ) INTO bucket_exists;
    
    -- Contar políticas
    SELECT COUNT(*) INTO policies_count
    FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects';
    
    RAISE NOTICE '';
    RAISE NOTICE '=== DIAGNÓSTICO DO UPLOAD ===';
    
    IF user_id IS NOT NULL THEN
        RAISE NOTICE '✅ Usuário autenticado: %', user_id;
    ELSE
        RAISE NOTICE '❌ Usuário NÃO autenticado';
    END IF;
    
    IF profile_exists THEN
        RAISE NOTICE '✅ Perfil existe no banco';
    ELSE
        RAISE NOTICE '❌ Perfil NÃO existe no banco';
    END IF;
    
    IF bucket_exists THEN
        RAISE NOTICE '✅ Bucket user-uploads existe';
    ELSE
        RAISE NOTICE '❌ Bucket user-uploads NÃO existe';
    END IF;
    
    RAISE NOTICE 'Políticas RLS: % políticas encontradas', policies_count;
    
    IF user_id IS NOT NULL AND profile_exists AND bucket_exists AND policies_count >= 4 THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅ INFRAESTRUTURA OK - Problema pode ser no frontend';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '❌ PROBLEMAS NA INFRAESTRUTURA - Corrigir primeiro';
    END IF;
    
    RAISE NOTICE '';
END $$;