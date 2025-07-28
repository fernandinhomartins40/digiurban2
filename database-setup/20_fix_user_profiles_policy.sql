-- Corrigir política RLS para usar auth.uid() corretamente
-- A política anterior pode estar usando uid() em vez de auth.uid()

-- Remover política existente
DROP POLICY IF EXISTS "Users can view other profiles for chat" ON user_profiles;

-- Criar nova política com auth.uid() explícito
CREATE POLICY "Users can view other profiles for chat" ON user_profiles
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

-- Verificar se RLS está habilitado na tabela
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Verificar políticas atuais
SELECT 
    schemaname,
    tablename, 
    policyname, 
    permissive, 
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;