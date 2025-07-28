-- =============================================================================
-- DEBUG_CHAT_TABLES.SQL - Verificar se as tabelas de chat existem
-- =============================================================================

-- 1. Verificar se as tabelas existem
SELECT 
    table_name, 
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'chat_%'
ORDER BY table_name;

-- 2. Verificar colunas da tabela chat_rooms
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'chat_rooms' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar se há dados em chat_rooms
SELECT COUNT(*) as total_rooms FROM chat_rooms;

-- 4. Ver algumas salas se existirem
SELECT * FROM chat_rooms LIMIT 5;

-- 5. Testar a consulta que está falhando
SELECT * 
FROM chat_rooms 
WHERE is_active = true 
AND type IN ('general', 'department', 'citizen_support') 
ORDER BY updated_at DESC;

-- 6. Se der erro, criar uma sala de teste
INSERT INTO chat_rooms (name, type, description, created_by) 
VALUES (
    'Sala Geral', 
    'general', 
    'Sala geral para testes', 
    '4d3b26d0-f64a-402d-8608-ccc0faf6b151'
) 
ON CONFLICT DO NOTHING;