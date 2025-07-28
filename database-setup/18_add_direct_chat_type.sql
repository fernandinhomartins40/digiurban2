-- Adicionar tipo 'direct' para conversas diretas entre usuários
-- Atualizar constraint da tabela chat_rooms

-- Primeiro, remover a constraint existente se houver
ALTER TABLE chat_rooms DROP CONSTRAINT IF EXISTS chat_rooms_type_check;

-- Adicionar nova constraint incluindo 'direct'
ALTER TABLE chat_rooms ADD CONSTRAINT chat_rooms_type_check 
CHECK (type IN ('general', 'department', 'support', 'citizen_support', 'direct'));

-- Comentário para documentar
COMMENT ON COLUMN chat_rooms.type IS 'Tipo da sala: general (geral), department (departamental), support (suporte), citizen_support (suporte ao cidadão), direct (conversa direta)';