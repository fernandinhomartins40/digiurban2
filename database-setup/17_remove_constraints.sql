-- =====================================================
-- 17. REMOVER CONSTRAINTS PROBLEMÁTICAS
-- =====================================================

-- Remover todas as constraints NOT NULL problemáticas da tabela servicos_municipais
ALTER TABLE servicos_municipais ALTER COLUMN categoria DROP NOT NULL;
ALTER TABLE servicos_municipais ALTER COLUMN secretaria_responsavel_id DROP NOT NULL;
ALTER TABLE servicos_municipais ALTER COLUMN created_by_user_id DROP NOT NULL;

-- Atualizar registros existentes com valores padrão
UPDATE servicos_municipais 
SET 
  categoria = COALESCE(categoria, 'geral'),
  secretaria_responsavel_id = COALESCE(secretaria_responsavel_id, (SELECT id FROM secretarias LIMIT 1)),
  created_by_user_id = COALESCE(created_by_user_id, (SELECT id FROM user_profiles WHERE tipo_usuario IN ('admin', 'super_admin') LIMIT 1))
WHERE categoria IS NULL OR secretaria_responsavel_id IS NULL OR created_by_user_id IS NULL;

-- Adicionar colunas necessárias se não existirem
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS categoria_id UUID;
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS prazo_resposta_dias INTEGER DEFAULT 15;
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS requer_documentos BOOLEAN DEFAULT false;
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS documentos_necessarios TEXT[];
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS requer_localizacao BOOLEAN DEFAULT false;
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS taxa_servico DECIMAL(10,2) DEFAULT 0;
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS publico BOOLEAN DEFAULT true;
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS formulario_campos JSONB;
ALTER TABLE servicos_municipais ADD COLUMN IF NOT EXISTS instrucoes TEXT;

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categorias_servicos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  icone VARCHAR(50),
  cor VARCHAR(20),
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserir categorias
INSERT INTO categorias_servicos (nome, icone, cor, descricao, ordem) VALUES
('Administração', 'FileText', '#3b82f6', 'Serviços administrativos gerais', 1),
('Saúde', 'Heart', '#ef4444', 'Serviços de saúde pública', 2),
('Educação', 'GraduationCap', '#22c55e', 'Serviços educacionais', 3),
('Infraestrutura', 'Construction', '#f59e0b', 'Obras e infraestrutura urbana', 4),
('Meio Ambiente', 'Leaf', '#10b981', 'Serviços ambientais', 5),
('Assistência Social', 'Users', '#8b5cf6', 'Programas sociais', 6),
('Cultura e Esporte', 'Trophy', '#f97316', 'Atividades culturais e esportivas', 7),
('Segurança', 'Shield', '#dc2626', 'Segurança pública', 8),
('Habitação', 'Home', '#06b6d4', 'Programas habitacionais', 9),
('Transporte', 'Car', '#6366f1', 'Transporte público', 10)
ON CONFLICT (nome) DO NOTHING;

-- Atualizar categoria_id para serviços existentes
UPDATE servicos_municipais 
SET categoria_id = (SELECT id FROM categorias_servicos WHERE nome = 'Administração' LIMIT 1)
WHERE categoria_id IS NULL;

-- Inserir alguns serviços exemplo apenas se não existirem
INSERT INTO servicos_municipais (codigo, nome, descricao, categoria_id, prazo_resposta_dias, requer_documentos, publico) 
SELECT 
  'CERT-001', 
  'Certidão de Residência', 
  'Emissão de certidão comprovando residência no município',
  c.id,
  5,
  true,
  true
FROM categorias_servicos c 
WHERE c.nome = 'Administração'
AND NOT EXISTS (SELECT 1 FROM servicos_municipais WHERE codigo = 'CERT-001');

INSERT INTO servicos_municipais (codigo, nome, descricao, categoria_id, prazo_resposta_dias, requer_localizacao, publico)
SELECT 
  'INFRA-001',
  'Solicitação de Reparo em Via Pública',
  'Reportar buracos, calçadas danificadas e problemas na via pública',
  c.id,
  15,
  true,
  true
FROM categorias_servicos c 
WHERE c.nome = 'Infraestrutura'
AND NOT EXISTS (SELECT 1 FROM servicos_municipais WHERE codigo = 'INFRA-001');

INSERT INTO servicos_municipais (codigo, nome, descricao, categoria_id, prazo_resposta_dias, publico)
SELECT 
  'SAUDE-001',
  'Agendamento de Consulta Médica',
  'Agendar consulta nas unidades básicas de saúde',
  c.id,
  3,
  true
FROM categorias_servicos c 
WHERE c.nome = 'Saúde'
AND NOT EXISTS (SELECT 1 FROM servicos_municipais WHERE codigo = 'SAUDE-001');

-- Políticas RLS básicas
ALTER TABLE categorias_servicos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categorias são públicas" ON categorias_servicos;
CREATE POLICY "Categorias são públicas" ON categorias_servicos FOR SELECT USING (true);

-- Configurar RLS para servicos_municipais se possível
DO $$
BEGIN
  ALTER TABLE servicos_municipais ENABLE ROW LEVEL SECURITY;
  
  DROP POLICY IF EXISTS "Serviços públicos são visíveis" ON servicos_municipais;
  CREATE POLICY "Serviços públicos são visíveis" ON servicos_municipais 
    FOR SELECT USING (publico = true OR auth.uid() IS NOT NULL);
    
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Erro ao configurar RLS em servicos_municipais: %', SQLERRM;
END
$$;