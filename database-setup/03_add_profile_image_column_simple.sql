-- =============================================================================
-- ADICIONAR COLUNA FOTO_PERFIL À TABELA USER_PROFILES - VERSÃO SIMPLIFICADA
-- =============================================================================
-- Execute este script no SQL Editor do Supabase
-- =============================================================================

-- 1. Adicionar coluna foto_perfil à tabela user_profiles
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
        
        RAISE NOTICE 'Coluna foto_perfil adicionada à tabela user_profiles';
    ELSE
        RAISE NOTICE 'Coluna foto_perfil já existe na tabela user_profiles';
    END IF;
END $$;

-- 2. Criar bucket para uploads de usuários (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets 
        WHERE name = 'user-uploads'
    ) THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'user-uploads',
            'user-uploads', 
            true, 
            1048576, -- 1MB limit
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
        );
        
        RAISE NOTICE 'Bucket user-uploads criado com sucesso';
    ELSE
        RAISE NOTICE 'Bucket user-uploads já existe';
    END IF;
END $$;

-- =============================================================================
-- MANUAL: CONFIGURAR POLÍTICAS RLS NO STORAGE (Execute separadamente)
-- =============================================================================

/*
IMPORTANTE: Execute estes comandos SEPARADAMENTE no SQL Editor:

-- 3a. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- 3b. Política para visualização pública de fotos de perfil
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = 'profiles');

-- 3c. Política para upload de fotos próprias
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- 3d. Política para atualização de fotos próprias
CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- 3e. Política para remoção de fotos próprias
CREATE POLICY "Users can delete their own avatar" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);
*/

-- =============================================================================
-- VERIFICAÇÃO FINAL
-- =============================================================================

-- Verificar se tudo foi criado corretamente
DO $$
BEGIN
    -- Verificar coluna
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'foto_perfil'
    ) THEN
        RAISE NOTICE '✅ Coluna foto_perfil existe na tabela user_profiles';
    ELSE
        RAISE NOTICE '❌ Coluna foto_perfil NÃO foi criada';
    END IF;
    
    -- Verificar bucket
    IF EXISTS (
        SELECT 1 FROM storage.buckets 
        WHERE name = 'user-uploads'
    ) THEN
        RAISE NOTICE '✅ Bucket user-uploads foi criado';
    ELSE
        RAISE NOTICE '❌ Bucket user-uploads NÃO foi criado';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '🔧 PRÓXIMOS PASSOS:';
    RAISE NOTICE '1. Execute as políticas RLS separadamente (veja comentários acima)';
    RAISE NOTICE '2. Verifique o Storage no painel do Supabase';
    RAISE NOTICE '3. Teste o upload de imagem no frontend';
END $$;