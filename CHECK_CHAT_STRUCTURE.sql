-- Verificar estrutura exata da tabela chat_rooms
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'chat_rooms' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar constraints da tabela
SELECT conname, contype, pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conrelid = 'chat_rooms'::regclass;

-- Testar a consulta exata que está falhando
SELECT * 
FROM chat_rooms 
WHERE is_active = true 
AND type IN ('general', 'department', 'citizen_support') 
ORDER BY updated_at DESC;