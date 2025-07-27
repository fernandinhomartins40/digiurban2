-- =====================================================
-- 16. SISTEMA DE PROTOCOLOS MÍNIMO
-- =====================================================

-- Primeiro, vamos só adicionar as colunas essenciais à tabela protocolos existente
ALTER TABLE protocolos ADD COLUMN IF NOT EXISTS responsavel_id UUID;
ALTER TABLE protocolos ADD COLUMN IF NOT EXISTS data_prazo TIMESTAMP WITH TIME ZONE;
ALTER TABLE protocolos ADD COLUMN IF NOT EXISTS data_conclusao TIMESTAMP WITH TIME ZONE;
ALTER TABLE protocolos ADD COLUMN IF NOT EXISTS avaliacao INTEGER;
ALTER TABLE protocolos ADD COLUMN IF NOT EXISTS comentario_avaliacao TEXT;
ALTER TABLE protocolos ADD COLUMN IF NOT EXISTS data_avaliacao TIMESTAMP WITH TIME ZONE;
ALTER TABLE protocolos ADD COLUMN IF NOT EXISTS prioridade VARCHAR(10) DEFAULT 'normal';
ALTER TABLE protocolos ADD COLUMN IF NOT EXISTS dados_formulario JSONB;
ALTER TABLE protocolos ADD COLUMN IF NOT EXISTS localizacao JSONB;

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

-- Tentar criar tabela de histórico (se falhar, não tem problema)
CREATE TABLE IF NOT EXISTS protocolos_historico (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  protocolo_id UUID,
  usuario_id UUID,
  acao VARCHAR(50) NOT NULL,
  status_anterior VARCHAR(30),
  status_novo VARCHAR(30),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Adicionar colunas à tabela histórico se ela já existir
ALTER TABLE protocolos_historico ADD COLUMN IF NOT EXISTS usuario_id UUID;
ALTER TABLE protocolos_historico ADD COLUMN IF NOT EXISTS acao VARCHAR(50);
ALTER TABLE protocolos_historico ADD COLUMN IF NOT EXISTS status_anterior VARCHAR(30);
ALTER TABLE protocolos_historico ADD COLUMN IF NOT EXISTS status_novo VARCHAR(30);
ALTER TABLE protocolos_historico ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Criar tabela de anexos
CREATE TABLE IF NOT EXISTS protocolos_anexos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  protocolo_id UUID,
  usuario_id UUID,
  nome_arquivo VARCHAR(255) NOT NULL,
  tipo_arquivo VARCHAR(100),
  tamanho_bytes BIGINT,
  url_arquivo TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- FUNÇÃO SIMPLES PARA NÚMERO DE PROTOCOLO
-- =====================================================

-- Remover funções existentes
DROP FUNCTION IF EXISTS gerar_numero_protocolo();

-- Função simples para gerar número do protocolo
CREATE OR REPLACE FUNCTION gerar_numero_protocolo()
RETURNS TRIGGER AS $$
DECLARE
  ano INTEGER;
  proximo_numero INTEGER;
  numero_protocolo VARCHAR(20);
BEGIN
  -- Se já tem número, não alterar
  IF NEW.numero IS NOT NULL AND NEW.numero != '' THEN
    RETURN NEW;
  END IF;
  
  -- Pegar o ano atual
  ano := EXTRACT(YEAR FROM NOW());
  
  -- Buscar o próximo número sequencial para o ano
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero FROM 11) AS INTEGER)), 0) + 1
  INTO proximo_numero
  FROM protocolos
  WHERE numero LIKE 'PROT-' || ano || '-%';
  
  -- Gerar o número do protocolo
  numero_protocolo := 'PROT-' || ano || '-' || LPAD(proximo_numero::TEXT, 7, '0');
  
  NEW.numero := numero_protocolo;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para gerar número
DROP TRIGGER IF EXISTS trigger_gerar_numero_protocolo ON protocolos;
CREATE TRIGGER trigger_gerar_numero_protocolo
  BEFORE INSERT ON protocolos
  FOR EACH ROW
  EXECUTE FUNCTION gerar_numero_protocolo();

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir categorias de serviços
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

-- =====================================================
-- POLÍTICAS RLS BÁSICAS
-- =====================================================

-- Ativar RLS apenas nas tabelas que conseguimos criar
ALTER TABLE categorias_servicos ENABLE ROW LEVEL SECURITY;

-- Política básica para categorias
DROP POLICY IF EXISTS "Categorias são públicas" ON categorias_servicos;
CREATE POLICY "Categorias são públicas" ON categorias_servicos FOR SELECT USING (true);

-- Tentar ativar RLS em protocolos (pode falhar se a estrutura for muito diferente)
DO $$
BEGIN
  ALTER TABLE protocolos ENABLE ROW LEVEL SECURITY;
  
  -- Política básica para protocolos
  DROP POLICY IF EXISTS "Usuarios veem protocolos relacionados" ON protocolos;
  CREATE POLICY "Usuarios veem protocolos relacionados" ON protocolos 
    FOR SELECT USING (
      solicitante_id = auth.uid() OR
      responsavel_id = auth.uid() OR
      auth.uid() IS NOT NULL
    );
    
  DROP POLICY IF EXISTS "Usuarios podem criar protocolos" ON protocolos;
  CREATE POLICY "Usuarios podem criar protocolos" ON protocolos 
    FOR INSERT WITH CHECK (solicitante_id = auth.uid());
    
EXCEPTION
  WHEN OTHERS THEN
    -- Se falhar, só registrar o erro mas continuar
    RAISE NOTICE 'Erro ao configurar RLS em protocolos: %', SQLERRM;
END
$$;