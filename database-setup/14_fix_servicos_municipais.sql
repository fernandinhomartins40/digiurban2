-- =====================================================
-- 14. CORREÇÃO TABELA SERVIÇOS MUNICIPAIS
-- =====================================================

-- Primeiro, vamos verificar e corrigir a estrutura da tabela servicos_municipais

-- Remover constraint NOT NULL da coluna categoria se existir
ALTER TABLE servicos_municipais ALTER COLUMN categoria DROP NOT NULL;

-- Adicionar a nova coluna categoria_id se não existir
ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES categorias_servicos(id);

-- Adicionar outras colunas necessárias
ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS prazo_resposta_dias INTEGER DEFAULT 15;

ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS requer_documentos BOOLEAN DEFAULT false;

ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS documentos_necessarios TEXT[];

ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS requer_localizacao BOOLEAN DEFAULT false;

ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS taxa_servico DECIMAL(10,2) DEFAULT 0;

ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS publico BOOLEAN DEFAULT true;

ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS formulario_campos JSONB;

ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS instrucoes TEXT;

-- Criar categorias se não existirem
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

-- Atualizar registros existentes para ter categoria_id válido
-- Primeiro, definir uma categoria padrão para registros sem categoria
UPDATE servicos_municipais 
SET categoria_id = (SELECT id FROM categorias_servicos WHERE nome = 'Administração' LIMIT 1)
WHERE categoria_id IS NULL;

-- Atualizar outros campos com valores padrão se estiverem NULL
UPDATE servicos_municipais 
SET 
  prazo_resposta_dias = COALESCE(prazo_resposta_dias, 15),
  requer_documentos = COALESCE(requer_documentos, false),
  requer_localizacao = COALESCE(requer_localizacao, false),
  taxa_servico = COALESCE(taxa_servico, 0),
  ativo = COALESCE(ativo, true),
  publico = COALESCE(publico, true)
WHERE categoria_id IS NOT NULL;

-- Inserir serviços exemplo se não existirem
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

INSERT INTO servicos_municipais (codigo, nome, descricao, categoria_id, prazo_resposta_dias, publico)
SELECT 
  'EDU-001',
  'Matrícula Escolar',
  'Solicitação de matrícula em escolas municipais',
  c.id,
  10,
  true
FROM categorias_servicos c 
WHERE c.nome = 'Educação'
AND NOT EXISTS (SELECT 1 FROM servicos_municipais WHERE codigo = 'EDU-001');

INSERT INTO servicos_municipais (codigo, nome, descricao, categoria_id, prazo_resposta_dias, publico)
SELECT 
  'SOCIAL-001',
  'Auxílio Emergencial',
  'Solicitação de auxílio emergencial municipal',
  c.id,
  7,
  true
FROM categorias_servicos c 
WHERE c.nome = 'Assistência Social'
AND NOT EXISTS (SELECT 1 FROM servicos_municipais WHERE codigo = 'SOCIAL-001');