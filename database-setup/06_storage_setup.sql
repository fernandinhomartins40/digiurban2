-- =============================================================================
-- 06_STORAGE_SETUP.SQL - DigiUrban Database Setup
-- =============================================================================
-- Configuração completa de Storage (arquivos e imagens)
-- Execute APÓS 05_chat_sistema.sql
-- =============================================================================

-- =============================================================================
-- BUCKET PARA UPLOADS DE DOCUMENTOS
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents', 
    false, -- Documentos são privados
    10485760, -- 10MB limit
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/webp'
    ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- BUCKET PARA CHAT (ARQUIVOS COMPARTILHADOS)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'chat-files',
    'chat-files', 
    false, -- Arquivos de chat são privados
    5242880, -- 5MB limit
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- POLÍTICAS RLS PARA BUCKET DOCUMENTS
-- =============================================================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
DROP POLICY IF EXISTS "Servers can view relevant documents" ON storage.objects;

-- Usuários podem ver documentos que enviaram
CREATE POLICY "Users can view own documents" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Servidores podem ver documentos de protocolos de sua secretaria
CREATE POLICY "Servers can view relevant documents" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'documents' 
    AND EXISTS (
        SELECT 1 FROM protocolos p
        JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.id::text = (storage.foldername(name))[2]
        AND (
            p.secretaria_id = up.secretaria_id 
            OR p.responsavel_atual_id = auth.uid()
            OR up.tipo_usuario IN ('super_admin', 'admin')
        )
    )
);

-- Usuários podem fazer upload de documentos
CREATE POLICY "Users can upload documents" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Usuários podem atualizar seus próprios documentos
CREATE POLICY "Users can update own documents" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Usuários podem deletar seus próprios documentos
CREATE POLICY "Users can delete own documents" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =============================================================================
-- POLÍTICAS RLS PARA BUCKET CHAT-FILES
-- =============================================================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Chat participants can view files" ON storage.objects;
DROP POLICY IF EXISTS "Chat participants can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own chat files" ON storage.objects;

-- Participantes do chat podem ver arquivos das salas que participam
CREATE POLICY "Chat participants can view files" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'chat-files' 
    AND (storage.foldername(name))[1] IN (
        SELECT room_id::text FROM chat_participants 
        WHERE user_id = auth.uid()
    )
);

-- Participantes podem fazer upload de arquivos
CREATE POLICY "Chat participants can upload files" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'chat-files' 
    AND (storage.foldername(name))[1] IN (
        SELECT room_id::text FROM chat_participants 
        WHERE user_id = auth.uid()
    )
);

-- Usuários podem deletar arquivos que enviaram
CREATE POLICY "Users can delete own chat files" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'chat-files' 
    AND (storage.foldername(name))[3] = auth.uid()::text
);

-- =============================================================================
-- FUNÇÃO PARA LIMPAR ARQUIVOS ÓRFÃOS
-- =============================================================================
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Limpar arquivos de perfil órfãos (mais de 30 dias sem referência)
    DELETE FROM storage.objects 
    WHERE bucket_id = 'user-uploads'
    AND created_at < NOW() - INTERVAL '30 days'
    AND NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE foto_perfil LIKE '%' || name || '%'
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE 'Arquivos órfãos removidos: %', deleted_count;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- FUNÇÃO PARA VERIFICAR QUOTA DE STORAGE
-- =============================================================================
CREATE OR REPLACE FUNCTION check_storage_usage()
RETURNS TABLE(
    bucket_name TEXT,
    file_count BIGINT,
    total_size_mb NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bucket_id as bucket_name,
        COUNT(*) as file_count,
        ROUND(SUM(metadata->>'size')::NUMERIC / 1024 / 1024, 2) as total_size_mb
    FROM storage.objects 
    GROUP BY bucket_id
    ORDER BY bucket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- ATUALIZAR TABELA DE ANEXOS PARA REFERENCIAR STORAGE
-- =============================================================================
ALTER TABLE protocolos_anexos 
ADD COLUMN IF NOT EXISTS bucket_name TEXT DEFAULT 'documents',
ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_anexos_storage_path ON protocolos_anexos(storage_path);

-- =============================================================================
-- VERIFICAÇÃO FINAL
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Storage configurado com sucesso!';
    RAISE NOTICE 'Buckets criados:';
    
    FOR rec IN 
        SELECT name, public, file_size_limit/1024/1024 as size_mb
        FROM storage.buckets 
        WHERE name IN ('user-uploads', 'documents', 'chat-files')
        ORDER BY name
    LOOP
        RAISE NOTICE '  % - Público: % - Limite: %MB', rec.name, rec.public, rec.size_mb;
    END LOOP;
    
    RAISE NOTICE 'Políticas RLS criadas para todos os buckets';
    RAISE NOTICE 'Próximo passo: Execute 07_rls_policies.sql';
END $$;