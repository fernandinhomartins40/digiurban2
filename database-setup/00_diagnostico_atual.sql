-- =============================================================================
-- 00_DIAGNOSTICO_ATUAL.SQL - DigiUrban Database Setup
-- =============================================================================
-- Execute PRIMEIRO para diagnosticar o estado atual do banco
-- =============================================================================

-- =============================================================================
-- VERIFICAR EXTENSÕES
-- =============================================================================
SELECT 
    'EXTENSÕES' as categoria,
    extname as nome,
    'OK' as status
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY extname;

-- =============================================================================
-- VERIFICAR TABELAS EXISTENTES
-- =============================================================================
SELECT 
    'TABELAS' as categoria,
    table_name as nome,
    CASE 
        WHEN table_name IN ('user_profiles', 'secretarias', 'setores') THEN 'ESSENCIAL'
        WHEN table_name LIKE 'chat_%' THEN 'CHAT'
        WHEN table_name LIKE 'protocolo%' THEN 'PROTOCOLOS'
        ELSE 'OUTRAS'
    END as tipo
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =============================================================================
-- VERIFICAR COLUNAS ESPECÍFICAS
-- =============================================================================
SELECT 
    'COLUNAS' as categoria,
    CONCAT(table_name, '.', column_name) as nome,
    data_type as tipo
FROM information_schema.columns 
WHERE table_schema = 'public'
AND (
    (table_name = 'user_profiles' AND column_name = 'foto_perfil')
    OR (table_name = 'secretarias' AND column_name = 'codigo')
    OR (table_name = 'user_profiles' AND column_name = 'tipo_usuario')
)
ORDER BY table_name, column_name;

-- =============================================================================
-- VERIFICAR BUCKETS DE STORAGE
-- =============================================================================
SELECT 
    'STORAGE_BUCKETS' as categoria,
    name as nome,
    CONCAT(
        'Public: ', public::text, 
        ' | Size: ', (file_size_limit/1024/1024)::text, 'MB'
    ) as configuracao
FROM storage.buckets 
WHERE name IN ('user-uploads', 'documents', 'chat-files')
ORDER BY name;

-- =============================================================================
-- VERIFICAR POLÍTICAS RLS
-- =============================================================================
SELECT 
    'RLS_POLICIES' as categoria,
    CONCAT(schemaname, '.', tablename) as tabela,
    COUNT(*) as qtd_policies
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
AND tablename IN ('user_profiles', 'secretarias', 'objects')
GROUP BY schemaname, tablename
ORDER BY schemaname, tablename;

-- =============================================================================
-- VERIFICAR USUÁRIOS EXISTENTES
-- =============================================================================
SELECT 
    'USUARIOS' as categoria,
    COALESCE(up.tipo_usuario, 'SEM_PERFIL') as tipo,
    COUNT(*) as quantidade
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
GROUP BY up.tipo_usuario
ORDER BY up.tipo_usuario;

-- =============================================================================
-- VERIFICAR SECRETARIAS
-- =============================================================================
SELECT 
    'SECRETARIAS' as categoria,
    codigo as nome,
    'OK' as status
FROM secretarias 
WHERE ativo = true
ORDER BY codigo;

-- =============================================================================
-- RESUMO DE PROBLEMAS IDENTIFICADOS
-- =============================================================================
DO $$
DECLARE
    missing_items TEXT := '';
    has_user_profiles BOOLEAN;
    has_foto_perfil_column BOOLEAN;
    has_storage_bucket BOOLEAN;
    has_secretarias BOOLEAN;
BEGIN
    -- Verificar user_profiles
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_profiles'
    ) INTO has_user_profiles;
    
    -- Verificar coluna foto_perfil
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'foto_perfil'
    ) INTO has_foto_perfil_column;
    
    -- Verificar bucket user-uploads
    SELECT EXISTS (
        SELECT 1 FROM storage.buckets 
        WHERE name = 'user-uploads'
    ) INTO has_storage_bucket;
    
    -- Verificar secretarias
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'secretarias'
    ) INTO has_secretarias;
    
    RAISE NOTICE '';
    RAISE NOTICE '=== DIAGNÓSTICO DE PROBLEMAS ===';
    
    IF NOT has_user_profiles THEN
        RAISE NOTICE '❌ CRÍTICO: Tabela user_profiles não existe';
        missing_items := missing_items || '01_estrutura_base.sql,02_auth_profiles.sql,';
    END IF;
    
    IF has_user_profiles AND NOT has_foto_perfil_column THEN
        RAISE NOTICE '❌ PROBLEMA: Coluna foto_perfil não existe em user_profiles';
        missing_items := missing_items || '02_auth_profiles.sql,';
    END IF;
    
    IF NOT has_storage_bucket THEN
        RAISE NOTICE '❌ PROBLEMA: Bucket user-uploads não existe';
        missing_items := missing_items || '02_auth_profiles.sql,06_storage_setup.sql,';
    END IF;
    
    IF NOT has_secretarias THEN
        RAISE NOTICE '❌ CRÍTICO: Tabela secretarias não existe';
        missing_items := missing_items || '01_estrutura_base.sql,03_secretarias_setores.sql,';
    END IF;
    
    IF missing_items = '' THEN
        RAISE NOTICE '✅ BANCO PARECE ESTAR CONFIGURADO CORRETAMENTE';
        RAISE NOTICE 'Se ainda há erros, execute verify_storage_setup.sql para detalhes';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '📋 SCRIPTS NECESSÁRIOS (execute nesta ordem):';
        RAISE NOTICE '%', REPLACE(missing_items, ',', CHR(10));
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '=== FIM DO DIAGNÓSTICO ===';
END $$;