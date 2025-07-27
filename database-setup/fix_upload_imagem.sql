-- =============================================================================
-- FIX_UPLOAD_IMAGEM.SQL - Correção específica para upload de foto de perfil
-- =============================================================================
-- Execute este script para corrigir o erro de upload de imagem
-- =============================================================================

-- 1. Verificar se bucket user-uploads existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'user-uploads') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'user-uploads',
            'user-uploads', 
            true, 
            1048576, -- 1MB limit
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
        );
        RAISE NOTICE '✅ Bucket user-uploads criado';
    ELSE
        RAISE NOTICE '✅ Bucket user-uploads já existe';
    END IF;
END $$;

-- 2. Verificar se coluna foto_perfil existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'foto_perfil'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.user_profiles 
        ADD COLUMN foto_perfil TEXT;
        
        COMMENT ON COLUMN public.user_profiles.foto_perfil IS 'URL da foto de perfil do usuário armazenada no Supabase Storage';
        
        RAISE NOTICE '✅ Coluna foto_perfil adicionada à tabela user_profiles';
    ELSE
        RAISE NOTICE '✅ Coluna foto_perfil já existe na tabela user_profiles';
    END IF;
END $$;

-- 3. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- 4. Criar políticas RLS para storage
-- Política para visualização pública de fotos de perfil
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = 'profiles');

-- Política para upload de fotos próprias
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- Política para atualização de fotos próprias
CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- Política para remoção de fotos próprias
CREATE POLICY "Users can delete their own avatar" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- 5. Verificação final
DO $$
DECLARE
    bucket_exists BOOLEAN;
    column_exists BOOLEAN;
    policies_count INTEGER;
BEGIN
    -- Verificar bucket
    SELECT EXISTS (
        SELECT 1 FROM storage.buckets 
        WHERE name = 'user-uploads'
    ) INTO bucket_exists;
    
    -- Verificar coluna
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'foto_perfil'
    ) INTO column_exists;
    
    -- Contar políticas
    SELECT COUNT(*) INTO policies_count
    FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
    AND policyname LIKE '%avatar%';
    
    RAISE NOTICE '';
    RAISE NOTICE '=== VERIFICAÇÃO DO FIX ===';
    
    IF bucket_exists THEN
        RAISE NOTICE '✅ Bucket user-uploads: OK';
    ELSE
        RAISE NOTICE '❌ Bucket user-uploads: ERRO';
    END IF;
    
    IF column_exists THEN
        RAISE NOTICE '✅ Coluna foto_perfil: OK';
    ELSE
        RAISE NOTICE '❌ Coluna foto_perfil: ERRO';
    END IF;
    
    RAISE NOTICE '✅ Políticas RLS criadas: %', policies_count;
    
    IF bucket_exists AND column_exists AND policies_count = 4 THEN
        RAISE NOTICE '';
        RAISE NOTICE '🎉 UPLOAD DE IMAGEM CORRIGIDO!';
        RAISE NOTICE 'Agora você pode testar o upload na página de perfil.';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '❌ Ainda há problemas. Execute verify_storage_setup.sql para mais detalhes.';
    END IF;
    
    RAISE NOTICE '';
END $$;