-- =============================================================================
-- FIX_RLS_STORAGE_SIMPLE.SQL - Solução mais direta para RLS
-- =============================================================================
-- Execute este script SE o fix_rls_storage.sql não resolver
-- =============================================================================

-- OPÇÃO 1: Desabilitar temporariamente RLS no storage (CUIDADO: menos seguro)
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- OPÇÃO 2: Política super permissiva para user-uploads
DROP POLICY IF EXISTS "Permissive user uploads policy" ON storage.objects;

CREATE POLICY "Permissive user uploads policy" 
ON storage.objects FOR ALL 
USING (bucket_id = 'user-uploads')
WITH CHECK (bucket_id = 'user-uploads');

-- VERIFICAÇÃO
SELECT 
    'TESTE_POLITICA' as tipo,
    bucket_id,
    name,
    'Deve aparecer se a política funciona' as resultado
FROM storage.objects 
WHERE bucket_id = 'user-uploads'
LIMIT 1;

-- Status final
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🚨 POLÍTICA SUPER PERMISSIVA APLICADA';
    RAISE NOTICE 'Qualquer usuário autenticado pode acessar user-uploads';
    RAISE NOTICE 'TESTE O UPLOAD AGORA!';
    RAISE NOTICE '';
    RAISE NOTICE 'Se funcionar, depois podemos ajustar a segurança';
    RAISE NOTICE '';
END $$;