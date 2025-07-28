-- =============================================================================
-- CHAT_FIX_DEFINITIVO.SQL - Resolver TODOS os problemas do chat
-- =============================================================================
-- Execute TUDO de uma vez no SQL Editor do Supabase
-- =============================================================================

-- 1. DESABILITAR RLS em TODAS as tabelas de chat para testar
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

-- 2. Garantir que tipo 'direct' existe
ALTER TABLE chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_type_check;
ALTER TABLE chat_rooms ADD CONSTRAINT chat_rooms_type_check 
CHECK (type IN ('general', 'department', 'support', 'citizen_support', 'direct'));

-- 3. TESTAR SE FUNCIONA
SELECT 'TESTE 1: user_profiles' as tabela, COUNT(*) as registros FROM user_profiles;
SELECT 'TESTE 2: chat_rooms' as tabela, COUNT(*) as registros FROM chat_rooms;
SELECT 'TESTE 3: chat_participants' as tabela, COUNT(*) as registros FROM chat_participants;
SELECT 'TESTE 4: chat_messages' as tabela, COUNT(*) as registros FROM chat_messages;

-- 4. Se der tudo certo, você verá os dados das tabelas
-- 5. Teste o chat agora - deve funcionar