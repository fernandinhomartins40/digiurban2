-- Política RLS para permitir que usuários visualizem outros perfis para o chat
-- Necessário para o sistema de busca de usuários no chat

-- Remover política existente se houver conflito
DROP POLICY IF EXISTS "Users can view other profiles for chat" ON user_profiles;

-- Criar política para permitir leitura de outros perfis
CREATE POLICY "Users can view other profiles for chat" ON user_profiles
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

-- Comentário para documentar
COMMENT ON POLICY "Users can view other profiles for chat" ON user_profiles 
IS 'Permite que usuários autenticados visualizem perfis de outros usuários para funcionalidade de chat';

-- Verificar políticas existentes
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