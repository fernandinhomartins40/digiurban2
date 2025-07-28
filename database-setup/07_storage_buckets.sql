-- =============================================================================
-- 07_STORAGE_BUCKETS.SQL
-- =============================================================================
-- Cria buckets de storage e configurações básicas
-- Execute DEPOIS do script 06
-- =============================================================================

-- =====================================================
-- 1. CRIAR BUCKETS DE STORAGE
-- =====================================================

-- Bucket para anexos de protocolos (privado)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'protocolos-anexos',
    'protocolos-anexos',
    false, -- Privado, acesso controlado por RLS
    52428800, -- 50MB por arquivo
    ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para uploads de usuários (perfis, documentos pessoais)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-uploads',
    'user-uploads',
    false, -- Privado, acesso controlado por RLS
    10485760, -- 10MB por arquivo
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para documentos públicos (editais, leis, decretos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documentos-publicos',
    'documentos-publicos',
    true, -- Público, qualquer um pode ler
    104857600, -- 100MB por arquivo
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/jpeg',
        'image/png'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para imagens do sistema (logos, banners, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'system-assets',
    'system-assets',
    true, -- Público
    5242880, -- 5MB por arquivo
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================================================
-- 2. POLÍTICAS DE ACESSO PARA BUCKET protocolos-anexos
-- =====================================================

-- Policy para INSERT (upload) - apenas o próprio usuário ou servidor do setor
CREATE POLICY "protocolos_anexos_insert_policy" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'protocolos-anexos' AND (
        -- Proprietário do protocolo pode fazer upload
        EXISTS (
            SELECT 1 FROM protocolos 
            WHERE id::text = (storage.foldername(name))[1] 
            AND solicitante_id = auth.uid()
        )
        OR
        -- Servidores do setor responsável podem fazer upload
        EXISTS (
            SELECT 1 FROM protocolos p
            JOIN user_profiles up ON up.id = auth.uid()
            WHERE p.id::text = (storage.foldername(name))[1]
            AND (p.secretaria_id = up.secretaria_id OR p.setor_id = up.setor_id)
            AND up.tipo_usuario != 'cidadao'
        )
        OR
        -- Admins podem fazer upload em qualquer protocolo
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND tipo_usuario IN ('super_admin', 'admin')
        )
    )
);

-- Policy para SELECT (download/visualização)
CREATE POLICY "protocolos_anexos_select_policy" ON storage.objects
FOR SELECT USING (
    bucket_id = 'protocolos-anexos' AND (
        -- Proprietário do protocolo pode ver anexos
        EXISTS (
            SELECT 1 FROM protocolos 
            WHERE id::text = (storage.foldername(name))[1] 
            AND solicitante_id = auth.uid()
        )
        OR
        -- Servidores do setor responsável podem ver anexos
        EXISTS (
            SELECT 1 FROM protocolos p
            JOIN user_profiles up ON up.id = auth.uid()
            WHERE p.id::text = (storage.foldername(name))[1]
            AND (p.secretaria_id = up.secretaria_id OR p.setor_id = up.setor_id)
            AND up.tipo_usuario != 'cidadao'
        )
        OR
        -- Admins podem ver todos os anexos
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND tipo_usuario IN ('super_admin', 'admin')
        )
    )
);

-- Policy para UPDATE (atualizar metadados)
CREATE POLICY "protocolos_anexos_update_policy" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'protocolos-anexos' AND (
        -- Servidores do setor responsável podem atualizar
        EXISTS (
            SELECT 1 FROM protocolos p
            JOIN user_profiles up ON up.id = auth.uid()
            WHERE p.id::text = (storage.foldername(name))[1]
            AND (p.secretaria_id = up.secretaria_id OR p.setor_id = up.setor_id)
            AND up.tipo_usuario != 'cidadao'
        )
        OR
        -- Admins podem atualizar qualquer anexo
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND tipo_usuario IN ('super_admin', 'admin')
        )
    )
);

-- Policy para DELETE (remover arquivos)
CREATE POLICY "protocolos_anexos_delete_policy" ON storage.objects
FOR DELETE USING (
    bucket_id = 'protocolos-anexos' AND (
        -- Apenas admins podem deletar anexos
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND tipo_usuario IN ('super_admin', 'admin')
        )
        OR
        -- Responsável do setor pode deletar se protocolo ainda estiver aberto
        EXISTS (
            SELECT 1 FROM protocolos p
            JOIN user_profiles up ON up.id = auth.uid()
            WHERE p.id::text = (storage.foldername(name))[1]
            AND (p.secretaria_id = up.secretaria_id OR p.setor_id = up.setor_id)
            AND up.tipo_usuario != 'cidadao'
            AND p.status IN ('aberto', 'em_andamento')
        )
    )
);

-- =====================================================
-- 3. POLÍTICAS DE ACESSO PARA BUCKET user-uploads
-- =====================================================

-- Policy para INSERT - usuário pode fazer upload apenas na sua pasta
CREATE POLICY "user_uploads_insert_policy" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'user-uploads' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy para SELECT - usuário pode ver apenas seus próprios arquivos
CREATE POLICY "user_uploads_select_policy" ON storage.objects
FOR SELECT USING (
    bucket_id = 'user-uploads' AND (
        -- Próprio usuário pode ver seus arquivos
        (storage.foldername(name))[1] = auth.uid()::text
        OR
        -- Admins podem ver todos os arquivos
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND tipo_usuario IN ('super_admin', 'admin')
        )
    )
);

-- Policy para UPDATE - usuário pode atualizar apenas seus próprios arquivos
CREATE POLICY "user_uploads_update_policy" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'user-uploads' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy para DELETE - usuário pode deletar apenas seus próprios arquivos
CREATE POLICY "user_uploads_delete_policy" ON storage.objects
FOR DELETE USING (
    bucket_id = 'user-uploads' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- 4. POLÍTICAS PARA BUCKET documentos-publicos
-- =====================================================

-- Policy para SELECT - qualquer um pode ler documentos públicos
CREATE POLICY "documentos_publicos_select_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'documentos-publicos');

-- Policy para INSERT - apenas servidores e admins podem fazer upload
CREATE POLICY "documentos_publicos_insert_policy" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'documentos-publicos' AND 
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND tipo_usuario != 'cidadao'
    )
);

-- Policy para UPDATE/DELETE - apenas admins
CREATE POLICY "documentos_publicos_admin_policy" ON storage.objects
FOR ALL USING (
    bucket_id = 'documentos-publicos' AND 
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND tipo_usuario IN ('super_admin', 'admin')
    )
);

-- =====================================================
-- 5. POLÍTICAS PARA BUCKET system-assets
-- =====================================================

-- Policy para SELECT - qualquer um pode ler assets do sistema
CREATE POLICY "system_assets_select_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'system-assets');

-- Policy para INSERT/UPDATE/DELETE - apenas admins
CREATE POLICY "system_assets_admin_policy" ON storage.objects
FOR ALL USING (
    bucket_id = 'system-assets' AND 
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND tipo_usuario IN ('super_admin', 'admin')
    )
);

-- =====================================================
-- 6. FUNÇÕES AUXILIARES PARA STORAGE
-- =====================================================

-- Função para gerar path único para arquivo
CREATE OR REPLACE FUNCTION gerar_storage_path(
    p_bucket TEXT,
    p_folder TEXT,
    p_filename TEXT
)
RETURNS TEXT AS $$
DECLARE
    extension TEXT;
    base_name TEXT;
    timestamp_str TEXT;
    unique_path TEXT;
BEGIN
    -- Extrair extensão
    extension := LOWER(RIGHT(p_filename, 4));
    base_name := LEFT(p_filename, LENGTH(p_filename) - LENGTH(extension));
    
    -- Gerar timestamp
    timestamp_str := TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS');
    
    -- Gerar path único
    unique_path := p_folder || '/' || timestamp_str || '-' || 
                   REPLACE(REPLACE(LOWER(base_name), ' ', '-'), '_', '-') || extension;
    
    RETURN unique_path;
END;
$$ LANGUAGE plpgsql;

-- Função para validar tipo de arquivo
CREATE OR REPLACE FUNCTION validar_tipo_arquivo(
    p_bucket TEXT,
    p_mime_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    tipos_permitidos TEXT[];
BEGIN
    -- Buscar tipos permitidos para o bucket
    SELECT allowed_mime_types INTO tipos_permitidos
    FROM storage.buckets
    WHERE id = p_bucket;
    
    -- Se não tem restrição, permite tudo
    IF tipos_permitidos IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Verificar se o tipo está na lista
    RETURN p_mime_type = ANY(tipos_permitidos);
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas de uso do storage
CREATE OR REPLACE FUNCTION obter_estatisticas_storage()
RETURNS TABLE(
    bucket_name TEXT,
    total_arquivos BIGINT,
    tamanho_total_bytes BIGINT,
    tamanho_total_mb DECIMAL,
    arquivo_maior_bytes BIGINT,
    arquivo_menor_bytes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.bucket_id,
        COUNT(*) as total_arquivos,
        COALESCE(SUM((o.metadata->>'size')::bigint), 0) as tamanho_total_bytes,
        ROUND(COALESCE(SUM((o.metadata->>'size')::bigint), 0) / 1024.0 / 1024.0, 2) as tamanho_total_mb,
        COALESCE(MAX((o.metadata->>'size')::bigint), 0) as arquivo_maior_bytes,
        COALESCE(MIN((o.metadata->>'size')::bigint), 0) as arquivo_menor_bytes
    FROM storage.objects o
    GROUP BY o.bucket_id
    ORDER BY o.bucket_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. CONFIGURAÇÕES DE PERFORMANCE
-- =====================================================

-- Habilitar compressão automática para buckets (se suportado)
-- Nota: Esta configuração pode variar dependendo da versão do Supabase

-- Configurar lifecycle policies (limpeza automática de arquivos antigos)
-- Nota: Implementar conforme necessidade da aplicação

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'SCRIPT 07 - STORAGE BUCKETS EXECUTADO COM SUCESSO' AS status;

-- Verificar buckets criados
SELECT 'BUCKETS CRIADOS:' AS info;
SELECT 
    id as bucket_id,
    name as nome,
    public as publico,
    file_size_limit as limite_tamanho,
    array_length(allowed_mime_types, 1) as tipos_permitidos
FROM storage.buckets
WHERE id IN ('protocolos-anexos', 'user-uploads', 'documentos-publicos', 'system-assets')
ORDER BY id;

-- Verificar policies criadas
SELECT 'POLICIES CRIADAS:' AS info;
SELECT 
    policyname as nome_policy,
    cmd as operacao,
    CASE 
        WHEN policyname LIKE '%protocolos_anexos%' THEN 'protocolos-anexos'
        WHEN policyname LIKE '%user_uploads%' THEN 'user-uploads'  
        WHEN policyname LIKE '%documentos_publicos%' THEN 'documentos-publicos'
        WHEN policyname LIKE '%system_assets%' THEN 'system-assets'
        ELSE 'outro'
    END as bucket
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%_policy'
ORDER BY bucket, cmd;

-- Verificar funções de storage criadas
SELECT 'FUNÇÕES DE STORAGE CRIADAS:' AS info;
SELECT proname AS function_name 
FROM pg_proc 
WHERE proname IN (
    'gerar_storage_path',
    'validar_tipo_arquivo',
    'obter_estatisticas_storage'
)
ORDER BY proname;