-- =============================================================================
-- CHAT_SETUP_FINAL.SQL - Script ÚNICO e DEFINITIVO para o Sistema de Chat
-- =============================================================================
-- Execute APENAS este script para configurar TUDO relacionado ao chat
-- =============================================================================

-- PROBLEMA: "Erro ao carregar usuários" no chat
-- SOLUÇÃO: Este script resolve TUDO de uma vez

-- =============================================================================
-- PASSO 1: ATUALIZAR TIPOS DE SALA DE CHAT (Adicionar 'direct')
-- =============================================================================

-- Remover constraint antiga se existir
ALTER TABLE chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_type_check;

-- Adicionar nova constraint com tipo 'direct' para conversas entre usuários
ALTER TABLE chat_rooms ADD CONSTRAINT chat_rooms_type_check 
CHECK (type IN ('general', 'department', 'support', 'citizen_support', 'direct'));

-- =============================================================================
-- PASSO 2: RESOLVER PROBLEMA DE PERMISSÕES (RLS) - AQUI ESTÁ O PROBLEMA!
-- =============================================================================

-- Remover todas as políticas antigas que podem estar causando conflito
DROP POLICY IF EXISTS "Users can view other profiles for chat" ON user_profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;

-- POLÍTICA SIMPLES E DEFINITIVA: Usuários autenticados podem ver outros perfis
CREATE POLICY "chat_users_can_view_profiles" ON user_profiles
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

-- Garantir que RLS esteja habilitado
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PASSO 3: POLÍTICAS DE CHAT (Se não existirem)
-- =============================================================================

-- Políticas para chat_rooms
DROP POLICY IF EXISTS "Users can view chat rooms" ON chat_rooms;
CREATE POLICY "Users can view chat rooms" ON chat_rooms
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create direct rooms" ON chat_rooms;
CREATE POLICY "Users can create direct rooms" ON chat_rooms
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL AND type = 'direct');

-- Políticas para chat_participants  
DROP POLICY IF EXISTS "Users can view participants" ON chat_participants;
CREATE POLICY "Users can view participants" ON chat_participants
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can join as participants" ON chat_participants;
CREATE POLICY "Users can join as participants" ON chat_participants
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Políticas para chat_messages
DROP POLICY IF EXISTS "Users can view messages" ON chat_messages;
CREATE POLICY "Users can view messages" ON chat_messages
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can send messages" ON chat_messages;
CREATE POLICY "Users can send messages" ON chat_messages
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- PASSO 4: VERIFICAÇÃO FINAL
-- =============================================================================

-- Verificar se as políticas foram criadas corretamente
SELECT 
    tablename, 
    policyname, 
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'chat_rooms', 'chat_participants', 'chat_messages')
ORDER BY tablename, policyname;

-- Testar uma consulta simples de usuários
SELECT 
    id, 
    nome_completo, 
    email, 
    tipo_usuario 
FROM user_profiles 
LIMIT 3;

-- =============================================================================
-- RESULTADO ESPERADO
-- =============================================================================
-- ✅ Deve mostrar as políticas criadas
-- ✅ Deve retornar alguns usuários na consulta de teste
-- ✅ Chat deve funcionar sem erro "Erro ao carregar usuários"

-- =============================================================================
-- SE AINDA DER ERRO
-- =============================================================================
-- Execute apenas isto para desabilitar RLS temporariamente:
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;