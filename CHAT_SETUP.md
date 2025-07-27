# 💬 Setup do Sistema de Chat

## 🗃️ **PASSO 1: Executar SQL no Supabase**

Acesse o **SQL Editor** do Supabase em: `http://82.25.69.57:8162/project/default/sql`

Execute o seguinte script SQL:

```sql
-- Tabelas para o sistema de chat

-- Tabela de salas de chat
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('general', 'department', 'support', 'citizen_support')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  department_id UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de participantes das salas
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'moderator', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, user_id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  file_url TEXT,
  file_name TEXT,
  reply_to UUID REFERENCES chat_messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_active ON chat_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para chat_rooms
CREATE POLICY "Users can view accessible rooms" ON chat_rooms
  FOR SELECT USING (
    -- Usuários podem ver salas onde são participantes
    id IN (
      SELECT room_id FROM chat_participants 
      WHERE user_id = auth.uid()
    )
    OR 
    -- Servidores podem ver salas gerais e departamentais
    (type IN ('general', 'department', 'citizen_support') AND EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario != 'cidadao'
    ))
    OR
    -- Criadores podem ver suas próprias salas
    created_by = auth.uid()
  );

-- Políticas para chat_participants
CREATE POLICY "Users can view participants of accessible rooms" ON chat_participants
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE id IN (
        SELECT room_id FROM chat_participants 
        WHERE user_id = auth.uid()
      )
      OR (type IN ('general', 'department', 'citizen_support') AND EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND tipo_usuario != 'cidadao'
      ))
      OR created_by = auth.uid()
    )
  );

-- Políticas para chat_messages
CREATE POLICY "Users can view messages from accessible rooms" ON chat_messages
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE id IN (
        SELECT room_id FROM chat_participants 
        WHERE user_id = auth.uid()
      )
      OR (type IN ('general', 'department', 'citizen_support') AND EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND tipo_usuario != 'cidadao'
      ))
      OR created_by = auth.uid()
    )
  );

-- Política para inserir mensagens
CREATE POLICY "Users can send messages to accessible rooms" ON chat_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE id IN (
        SELECT room_id FROM chat_participants 
        WHERE user_id = auth.uid()
      )
      OR (type IN ('general', 'department', 'citizen_support') AND EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND tipo_usuario != 'cidadao'
      ))
      OR created_by = auth.uid()
    )
  );

-- Política para inserir participantes
CREATE POLICY "Users can join rooms or be added" ON chat_participants
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario IN ('super_admin', 'admin', 'secretario')
    )
  );

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;
```

## 🧪 **PASSO 2: Criar Dados de Teste**

Execute também este script para criar algumas salas de exemplo:

```sql
-- Criar sala geral para servidores
INSERT INTO chat_rooms (name, type, description, is_active, created_by)
VALUES 
  ('Suporte Geral', 'general', 'Sala geral para comunicação entre servidores', true, '4d3b26d0-f64a-402d-8608-ccc0faf6b151'),
  ('Secretaria de Saúde', 'department', 'Canal da Secretaria de Saúde', true, '4d3b26d0-f64a-402d-8608-ccc0faf6b151');

-- Criar sala de suporte para o cidadão de teste
INSERT INTO chat_rooms (name, type, description, is_active, created_by)
VALUES 
  ('Suporte - João Cidadão', 'citizen_support', 'Sala de suporte para João Cidadão', true, '692b6d1f-918f-4bf4-af4c-55325666c371');

-- Adicionar participantes
INSERT INTO chat_participants (room_id, user_id, role)
SELECT cr.id, '692b6d1f-918f-4bf4-af4c-55325666c371', 'participant'
FROM chat_rooms cr 
WHERE cr.name = 'Suporte - João Cidadão';

-- Adicionar admin nas salas gerais
INSERT INTO chat_participants (room_id, user_id, role)
SELECT cr.id, '4d3b26d0-f64a-402d-8608-ccc0faf6b151', 'admin'
FROM chat_rooms cr 
WHERE cr.type IN ('general', 'department');
```

## 🎯 **PASSO 3: Testar o Sistema**

### **Para Cidadãos:**
1. Acesse: `http://localhost:8081/cidadao/login`
2. Login: `cidadao@teste.com` / `123456`
3. Vá para: Chat → deve ver sua sala de suporte automática
4. Envie mensagens

### **Para Servidores/Admins:**
1. Acesse: `http://localhost:8081/admin/login`
2. Login: `admin@cidade.gov.br` / `123456`
3. Vá para: Chat → deve ver salas gerais + salas de suporte dos cidadãos
4. Responda mensagens dos cidadãos

## 🚀 **Funcionalidades Implementadas:**

### ✅ **Cidadãos:**
- Sala automática de suporte criada ao se cadastrar
- Chat direto com servidores
- Interface limpa focada em suporte

### ✅ **Servidores:**
- Visualizar todas as salas de suporte de cidadãos
- Salas gerais para comunicação interna
- Salas departamentais por secretaria
- Responder e gerenciar suporte

### ✅ **Tecnologia:**
- **Real-time**: Mensagens em tempo real via Supabase Realtime
- **Segurança**: Row Level Security (RLS) para controle de acesso
- **Performance**: Índices otimizados e queries eficientes
- **Escalabilidade**: Sistema preparado para milhares de usuários

### ✅ **Interface:**
- Layout responsivo
- Busca de conversas
- Indicadores de status
- Mensagens com timestamp
- Suporte para diferentes tipos de usuário

## 🔧 **Próximos Passos (Opcionais):**
- [ ] Upload de arquivos nas mensagens
- [ ] Notificações push
- [ ] Indicadores de "digitando..."
- [ ] Reações nas mensagens
- [ ] Mensagens de sistema automáticas
- [ ] Histórico de conversas
- [ ] Transferência de tickets entre setores