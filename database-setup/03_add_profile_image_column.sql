-- =============================================================================
-- ADICIONAR COLUNA FOTO_PERFIL À TABELA USER_PROFILES
-- =============================================================================
-- Execute este script no SQL Editor do Supabase para adicionar suporte a fotos de perfil
-- =============================================================================

-- Verificar se a coluna foto_perfil já existe, se não, adicionar
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

-- =============================================================================
-- CONFIGURAR STORAGE PARA FOTOS DE PERFIL
-- =============================================================================

-- Criar bucket para uploads de usuários se não existir
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
-- POLÍTICAS RLS PARA STORAGE
-- =============================================================================

-- Remover políticas existentes e recriar
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Permitir que usuários autenticados vejam fotos de perfil públicas
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = 'profiles');

-- Permitir que usuários autenticados façam upload de suas próprias fotos
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- Permitir que usuários atualizem suas próprias fotos
CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- Permitir que usuários deletem suas próprias fotos
CREATE POLICY "Users can delete their own avatar" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- =============================================================================
-- POLÍTICA RLS PARA COLUNA FOTO_PERFIL
-- =============================================================================

-- Verificar se existe uma política para user_profiles e ajustar se necessário
-- (As políticas existentes devem permitir que usuários atualizem seu próprio perfil)

RAISE NOTICE 'Configuração de foto de perfil concluída com sucesso!';
RAISE NOTICE 'Lembre-se de:';
RAISE NOTICE '1. Verificar se as políticas RLS existentes em user_profiles permitem UPDATE';
RAISE NOTICE '2. Testar o upload de imagens no frontend';
RAISE NOTICE '3. Verificar se o bucket user-uploads foi criado corretamente no Storage';