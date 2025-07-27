-- =============================================================================
-- 11_FIX_USER_PROFILES_STRUCTURE.SQL - Corrigir estrutura da tabela user_profiles
-- =============================================================================
-- Execute para garantir que a tabela user_profiles está correta
-- =============================================================================

-- 1. Verificar estrutura atual da tabela user_profiles
SELECT 
    'ESTRUTURA_ATUAL' as tipo,
    column_name as coluna,
    data_type as tipo_dados,
    is_nullable as permite_null,
    column_default as valor_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se existe coluna user_id (deve ser removida se existir)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'user_id'
    ) THEN
        RAISE NOTICE '❌ PROBLEMA: Coluna user_id existe (deve ser removida)';
        
        -- Se existir dados importantes em user_id, migrar para id
        -- CUIDADO: Só execute se souber o que está fazendo
        -- UPDATE user_profiles SET id = user_id WHERE id IS NULL AND user_id IS NOT NULL;
        
        -- Remover coluna user_id se existir
        -- ALTER TABLE user_profiles DROP COLUMN IF EXISTS user_id;
        
        RAISE NOTICE '⚠️  Execute manualmente se necessário: ALTER TABLE user_profiles DROP COLUMN user_id;';
    ELSE
        RAISE NOTICE '✅ OK: Coluna user_id não existe (correto)';
    END IF;
END $$;

-- 3. Verificar se coluna id existe e é a chave primária
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'id'
        AND table_schema = 'public'
    ) THEN
        RAISE NOTICE '✅ OK: Coluna id existe';
        
        -- Verificar se é chave primária
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_name = 'user_profiles'
            AND tc.constraint_type = 'PRIMARY KEY'
            AND kcu.column_name = 'id'
        ) THEN
            RAISE NOTICE '✅ OK: Coluna id é chave primária';
        ELSE
            RAISE NOTICE '❌ PROBLEMA: Coluna id não é chave primária';
        END IF;
    ELSE
        RAISE NOTICE '❌ CRÍTICO: Coluna id não existe';
    END IF;
END $$;

-- 4. Verificar se coluna foto_perfil existe
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'foto_perfil'
    ) THEN
        RAISE NOTICE '✅ OK: Coluna foto_perfil existe';
    ELSE
        RAISE NOTICE '❌ PROBLEMA: Coluna foto_perfil não existe';
        
        -- Adicionar coluna foto_perfil
        ALTER TABLE user_profiles ADD COLUMN foto_perfil TEXT;
        RAISE NOTICE '✅ CORRIGIDO: Coluna foto_perfil adicionada';
    END IF;
END $$;

-- 5. Mostrar alguns registros para verificar dados
SELECT 
    'DADOS_EXEMPLO' as tipo,
    id,
    nome_completo,
    tipo_usuario,
    CASE 
        WHEN foto_perfil IS NOT NULL THEN 'TEM_FOTO'
        ELSE 'SEM_FOTO'
    END as status_foto
FROM user_profiles 
LIMIT 3;

-- 6. Resumo final
DO $$
DECLARE
    tem_id BOOLEAN;
    tem_foto_perfil BOOLEAN;
    tem_user_id BOOLEAN;
BEGIN
    -- Verificações finais
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'id'
    ) INTO tem_id;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'foto_perfil'
    ) INTO tem_foto_perfil;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'user_id'
    ) INTO tem_user_id;
    
    RAISE NOTICE '';
    RAISE NOTICE '=== RESUMO DA CORREÇÃO ===';
    
    IF tem_id AND tem_foto_perfil AND NOT tem_user_id THEN
        RAISE NOTICE '✅ ESTRUTURA CORRETA!';
        RAISE NOTICE '✅ Tabela user_profiles configurada corretamente';
        RAISE NOTICE '✅ Upload de imagem deve funcionar agora';
    ELSE
        RAISE NOTICE '❌ Ainda há problemas na estrutura:';
        RAISE NOTICE '  - Coluna id: %', CASE WHEN tem_id THEN 'OK' ELSE 'FALTANDO' END;
        RAISE NOTICE '  - Coluna foto_perfil: %', CASE WHEN tem_foto_perfil THEN 'OK' ELSE 'FALTANDO' END;
        RAISE NOTICE '  - Coluna user_id: %', CASE WHEN tem_user_id THEN 'PROBLEMA (deve ser removida)' ELSE 'OK (não existe)' END;
    END IF;
    
    RAISE NOTICE '';
END $$;