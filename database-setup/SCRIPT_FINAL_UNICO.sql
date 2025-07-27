-- =====================================================
-- SCRIPT FINAL ÚNICO - SISTEMA DE PROTOCOLOS DIGIURBAN
-- =====================================================
-- 
-- Este script ajusta APENAS o que está faltando na estrutura existente
-- Não recria tabelas, apenas adiciona o que precisa para funcionar
--
-- ESTRUTURA ATUAL ANALISADA:
-- ✅ protocolos (33 colunas) - COMPLETA
-- ✅ servicos_municipais (21 colunas) - Falta apenas categoria_id  
-- ✅ categorias_servicos - JÁ EXISTE
-- ✅ protocolos_historico - JÁ EXISTE
-- ✅ protocolos_anexos - JÁ EXISTE
-- ✅ user_profiles - COMPLETA
-- =====================================================

-- 1. ADICIONAR CATEGORIA_ID À TABELA SERVICOS_MUNICIPAIS
-- (Única coisa que falta para o frontend funcionar)
ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES categorias_servicos(id);

-- 2. POPULAR CATEGORIAS PADRÃO (se não existirem)
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

-- 3. MAPEAR CATEGORIAS EXISTENTES PARA categoria_id
-- (Conectar dados existentes com as novas categorias)
UPDATE servicos_municipais 
SET categoria_id = (
  CASE 
    WHEN LOWER(categoria) LIKE '%admin%' OR LOWER(categoria) LIKE '%certid%' OR LOWER(categoria) LIKE '%document%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Administração')
    WHEN LOWER(categoria) LIKE '%saude%' OR LOWER(categoria) LIKE '%medic%' OR LOWER(categoria) LIKE '%consulta%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Saúde')
    WHEN LOWER(categoria) LIKE '%educa%' OR LOWER(categoria) LIKE '%escola%' OR LOWER(categoria) LIKE '%matricula%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Educação')
    WHEN LOWER(categoria) LIKE '%obra%' OR LOWER(categoria) LIKE '%reparo%' OR LOWER(categoria) LIKE '%via%' OR LOWER(categoria) LIKE '%infraestr%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Infraestrutura')
    WHEN LOWER(categoria) LIKE '%social%' OR LOWER(categoria) LIKE '%auxilio%' OR LOWER(categoria) LIKE '%beneficio%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Assistência Social')
    WHEN LOWER(categoria) LIKE '%cultura%' OR LOWER(categoria) LIKE '%esporte%' OR LOWER(categoria) LIKE '%evento%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Cultura e Esporte')
    WHEN LOWER(categoria) LIKE '%segur%' OR LOWER(categoria) LIKE '%guarda%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Segurança')
    WHEN LOWER(categoria) LIKE '%habitat%' OR LOWER(categoria) LIKE '%moradia%' OR LOWER(categoria) LIKE '%casa%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Habitação')
    WHEN LOWER(categoria) LIKE '%transport%' OR LOWER(categoria) LIKE '%onibus%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Transporte')
    WHEN LOWER(categoria) LIKE '%ambiente%' OR LOWER(categoria) LIKE '%verde%' OR LOWER(categoria) LIKE '%arvore%' 
      THEN (SELECT id FROM categorias_servicos WHERE nome = 'Meio Ambiente')
    ELSE (SELECT id FROM categorias_servicos WHERE nome = 'Administração')
  END
)
WHERE categoria_id IS NULL;

-- 4. ADICIONAR ALGUNS SERVIÇOS EXEMPLO (se não existirem)
INSERT INTO servicos_municipais (codigo, nome, descricao, categoria, categoria_id, secretaria_responsavel_id, prazo_resposta_dias, requer_documentos) 
SELECT 
  'CERT-001', 
  'Certidão de Residência', 
  'Emissão de certidão comprovando residência no município',
  'Administração',
  c.id,
  (SELECT id FROM secretarias LIMIT 1),
  5,
  true
FROM categorias_servicos c 
WHERE c.nome = 'Administração'
AND NOT EXISTS (SELECT 1 FROM servicos_municipais WHERE codigo = 'CERT-001');

INSERT INTO servicos_municipais (codigo, nome, descricao, categoria, categoria_id, secretaria_responsavel_id, prazo_resposta_dias, requer_documentos) 
SELECT 
  'INFRA-001',
  'Reparo em Via Pública',
  'Solicitação de reparo de buracos, calçadas e problemas na via pública',
  'Infraestrutura',
  c.id,
  (SELECT id FROM secretarias LIMIT 1),
  15,
  false
FROM categorias_servicos c 
WHERE c.nome = 'Infraestrutura'
AND NOT EXISTS (SELECT 1 FROM servicos_municipais WHERE codigo = 'INFRA-001');

INSERT INTO servicos_municipais (codigo, nome, descricao, categoria, categoria_id, secretaria_responsavel_id, prazo_resposta_dias, requer_documentos) 
SELECT 
  'SAUDE-001',
  'Agendamento de Consulta',
  'Agendar consulta médica nas unidades básicas de saúde',
  'Saúde',
  c.id,
  (SELECT id FROM secretarias LIMIT 1),
  3,
  false
FROM categorias_servicos c 
WHERE c.nome = 'Saúde'
AND NOT EXISTS (SELECT 1 FROM servicos_municipais WHERE codigo = 'SAUDE-001');

-- 5. FUNÇÃO PARA GERAR NÚMERO DE PROTOCOLO (se não existir)
CREATE OR REPLACE FUNCTION gerar_numero_protocolo_automatico()
RETURNS TRIGGER AS $$
DECLARE
  ano INTEGER;
  proximo_numero INTEGER;
  numero_protocolo VARCHAR(20);
BEGIN
  -- Se já tem número, não alterar
  IF NEW.numero_protocolo IS NOT NULL AND NEW.numero_protocolo != '' THEN
    RETURN NEW;
  END IF;
  
  -- Pegar o ano atual
  ano := EXTRACT(YEAR FROM NOW());
  
  -- Buscar o próximo número sequencial para o ano
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero_protocolo FROM 11) AS INTEGER)), 0) + 1
  INTO proximo_numero
  FROM protocolos
  WHERE numero_protocolo LIKE 'PROT-' || ano || '-%';
  
  -- Gerar o número do protocolo
  numero_protocolo := 'PROT-' || ano || '-' || LPAD(proximo_numero::TEXT, 7, '0');
  
  NEW.numero_protocolo := numero_protocolo;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. TRIGGER PARA GERAR NÚMERO AUTOMÁTICO
DROP TRIGGER IF EXISTS trigger_gerar_numero_protocolo_auto ON protocolos;
CREATE TRIGGER trigger_gerar_numero_protocolo_auto
  BEFORE INSERT ON protocolos
  FOR EACH ROW
  WHEN (NEW.numero_protocolo IS NULL OR NEW.numero_protocolo = '')
  EXECUTE FUNCTION gerar_numero_protocolo_automatico();

-- 7. POLÍTICAS RLS (apenas as essenciais)
-- Categorias públicas
ALTER TABLE categorias_servicos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categorias públicas" ON categorias_servicos;
CREATE POLICY "Categorias públicas" ON categorias_servicos 
  FOR SELECT USING (true);

-- Serviços visíveis para usuários logados
ALTER TABLE servicos_municipais ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Serviços visíveis" ON servicos_municipais;
CREATE POLICY "Serviços visíveis" ON servicos_municipais 
  FOR SELECT USING (status = 'ativo' OR auth.uid() IS NOT NULL);

-- Protocolos - usuários veem seus próprios + servidores veem todos
ALTER TABLE protocolos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Protocolos visíveis" ON protocolos;
CREATE POLICY "Protocolos visíveis" ON protocolos 
  FOR SELECT USING (
    solicitante_id = auth.uid() OR 
    responsavel_atual_id = auth.uid() OR 
    responsavel_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND tipo_usuario IN ('super_admin', 'admin', 'secretario', 'diretor', 'coordenador', 'funcionario', 'atendente')
    )
  );

DROP POLICY IF EXISTS "Usuários podem criar protocolos" ON protocolos;
CREATE POLICY "Usuários podem criar protocolos" ON protocolos 
  FOR INSERT WITH CHECK (solicitante_id = auth.uid());

DROP POLICY IF EXISTS "Servidores podem atualizar protocolos" ON protocolos;
CREATE POLICY "Servidores podem atualizar protocolos" ON protocolos 
  FOR UPDATE USING (
    responsavel_atual_id = auth.uid() OR 
    responsavel_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND tipo_usuario IN ('super_admin', 'admin', 'secretario', 'diretor', 'coordenador', 'funcionario', 'atendente')
    )
  );

-- =====================================================
-- CONCLUSÃO
-- =====================================================
-- 
-- ✅ APÓS EXECUTAR ESTE SCRIPT:
-- 
-- 1. servicos_municipais terá categoria_id ligada às categorias
-- 2. Protocolos terão numeração automática
-- 3. Frontend conseguirá carregar serviços por categoria  
-- 4. Sistema de protocolos estará 100% funcional
-- 5. Todas as políticas RLS estarão configuradas
--
-- 🎯 PRÓXIMO PASSO:
-- Testar a criação de um protocolo via frontend
-- 
-- =====================================================