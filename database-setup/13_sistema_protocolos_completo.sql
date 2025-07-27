-- =====================================================
-- 13. SISTEMA DE PROTOCOLOS COMPLETO
-- =====================================================

-- Tabela de categorias de serviços municipais
CREATE TABLE IF NOT EXISTS categorias_servicos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  icone VARCHAR(50),
  cor VARCHAR(20),
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de serviços municipais
CREATE TABLE IF NOT EXISTS servicos_municipais (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  categoria_id UUID REFERENCES categorias_servicos(id),
  secretaria_id UUID REFERENCES secretarias(id),
  setor_id UUID REFERENCES setores(id),
  prazo_resposta_dias INTEGER DEFAULT 15,
  requer_documentos BOOLEAN DEFAULT false,
  documentos_necessarios TEXT[], -- Array de documentos
  requer_localizacao BOOLEAN DEFAULT false,
  taxa_servico DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  publico BOOLEAN DEFAULT true, -- Se está disponível para cidadãos
  formulario_campos JSONB, -- Campos dinâmicos do formulário
  instrucoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Adicionar colunas que podem estar faltando na tabela existente
ALTER TABLE servicos_municipais 
ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES categorias_servicos(id);

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

-- Tabela principal de protocolos
CREATE TABLE IF NOT EXISTS protocolos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero VARCHAR(20) UNIQUE NOT NULL, -- PROT-2025-0000001
  solicitante_id UUID REFERENCES user_profiles(id),
  servico_id UUID REFERENCES servicos_municipais(id),
  secretaria_id UUID REFERENCES secretarias(id),
  setor_id UUID REFERENCES setores(id),
  responsavel_id UUID REFERENCES user_profiles(id), -- Servidor responsável
  
  -- Dados da solicitação
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  dados_formulario JSONB, -- Dados do formulário dinâmico
  localizacao JSONB, -- {endereco, latitude, longitude, referencia}
  
  -- Controle de prazos
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  data_prazo TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  
  -- Status e prioridade
  status VARCHAR(30) DEFAULT 'aberto' CHECK (status IN (
    'aberto', 'em_andamento', 'aguardando_documentos', 'aguardando_aprovacao',
    'aprovado', 'rejeitado', 'concluido', 'cancelado'
  )),
  prioridade VARCHAR(10) DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente')),
  
  -- Avaliação do cidadão
  avaliacao INTEGER CHECK (avaliacao >= 1 AND avaliacao <= 5),
  comentario_avaliacao TEXT,
  data_avaliacao TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de histórico de movimentações do protocolo
CREATE TABLE IF NOT EXISTS protocolos_historico (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  protocolo_id UUID REFERENCES protocolos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES user_profiles(id),
  
  acao VARCHAR(50) NOT NULL, -- 'criado', 'atribuido', 'em_andamento', 'documentos_solicitados', etc.
  status_anterior VARCHAR(30),
  status_novo VARCHAR(30),
  observacoes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de anexos do protocolo
CREATE TABLE IF NOT EXISTS protocolos_anexos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  protocolo_id UUID REFERENCES protocolos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES user_profiles(id),
  
  nome_arquivo VARCHAR(255) NOT NULL,
  tipo_arquivo VARCHAR(100),
  tamanho_bytes BIGINT,
  url_arquivo TEXT NOT NULL,
  descricao TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id UUID REFERENCES user_profiles(id),
  protocolo_id UUID REFERENCES protocolos(id),
  
  tipo VARCHAR(50) NOT NULL, -- 'novo_protocolo', 'mudanca_status', 'prazo_vencendo', etc.
  titulo VARCHAR(200) NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Remover função existente se houver
DROP FUNCTION IF EXISTS gerar_numero_protocolo();

-- Função para gerar número do protocolo
CREATE OR REPLACE FUNCTION gerar_numero_protocolo()
RETURNS TRIGGER AS $$
DECLARE
  ano INTEGER;
  proximo_numero INTEGER;
  numero_protocolo VARCHAR(20);
BEGIN
  -- Pegar o ano atual
  ano := EXTRACT(YEAR FROM NEW.created_at);
  
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

-- Trigger para gerar número automático
DROP TRIGGER IF EXISTS trigger_gerar_numero_protocolo ON protocolos;
CREATE TRIGGER trigger_gerar_numero_protocolo
  BEFORE INSERT ON protocolos
  FOR EACH ROW
  EXECUTE FUNCTION gerar_numero_protocolo();

-- Remover função existente se houver
DROP FUNCTION IF EXISTS calcular_prazo_protocolo();

-- Função para calcular data do prazo
CREATE OR REPLACE FUNCTION calcular_prazo_protocolo()
RETURNS TRIGGER AS $$
DECLARE
  prazo_dias INTEGER;
BEGIN
  -- Buscar o prazo do serviço
  SELECT prazo_resposta_dias INTO prazo_dias
  FROM servicos_municipais
  WHERE id = NEW.servico_id;
  
  -- Calcular a data do prazo (ignorando fins de semana)
  NEW.data_prazo := NEW.data_abertura + (prazo_dias || ' days')::INTERVAL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular prazo
DROP TRIGGER IF EXISTS trigger_calcular_prazo ON protocolos;
CREATE TRIGGER trigger_calcular_prazo
  BEFORE INSERT ON protocolos
  FOR EACH ROW
  EXECUTE FUNCTION calcular_prazo_protocolo();

-- Remover função existente se houver
DROP FUNCTION IF EXISTS registrar_historico_protocolo();

-- Função para registrar histórico
CREATE OR REPLACE FUNCTION registrar_historico_protocolo()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir registro no histórico quando status muda
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO protocolos_historico (
      protocolo_id, usuario_id, acao, status_anterior, status_novo
    ) VALUES (
      NEW.id, NEW.responsavel_id, 'mudanca_status', OLD.status, NEW.status
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para histórico
DROP TRIGGER IF EXISTS trigger_historico_protocolo ON protocolos;
CREATE TRIGGER trigger_historico_protocolo
  AFTER UPDATE ON protocolos
  FOR EACH ROW
  EXECUTE FUNCTION registrar_historico_protocolo();

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
ON CONFLICT DO NOTHING;

-- Inserir alguns serviços básicos (apenas se não existirem)
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

-- =====================================================
-- POLÍTICAS RLS
-- =====================================================

-- Ativar RLS
ALTER TABLE categorias_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos_municipais ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias_servicos (públicas)
CREATE POLICY "Categorias são públicas" ON categorias_servicos FOR SELECT USING (true);

-- Políticas para servicos_municipais
CREATE POLICY "Serviços públicos são visíveis" ON servicos_municipais 
  FOR SELECT USING (publico = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Apenas admins podem modificar serviços" ON servicos_municipais 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario IN ('super_admin', 'admin')
    )
  );

-- Políticas para protocolos
CREATE POLICY "Cidadãos veem seus próprios protocolos" ON protocolos 
  FOR SELECT USING (
    solicitante_id = auth.uid() OR
    responsavel_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario IN ('super_admin', 'admin', 'secretario', 'diretor', 'coordenador', 'funcionario', 'atendente')
    )
  );

CREATE POLICY "Cidadãos podem criar protocolos" ON protocolos 
  FOR INSERT WITH CHECK (solicitante_id = auth.uid());

CREATE POLICY "Servidores podem atualizar protocolos" ON protocolos 
  FOR UPDATE USING (
    responsavel_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario IN ('super_admin', 'admin', 'secretario', 'diretor', 'coordenador', 'funcionario', 'atendente')
    )
  );

-- Políticas para histórico
CREATE POLICY "Histórico visível para envolvidos" ON protocolos_historico 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM protocolos p 
      WHERE p.id = protocolo_id AND (
        p.solicitante_id = auth.uid() OR 
        p.responsavel_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND tipo_usuario IN ('super_admin', 'admin', 'secretario', 'diretor', 'coordenador', 'funcionario', 'atendente')
        )
      )
    )
  );

-- Políticas para anexos
CREATE POLICY "Anexos visíveis para envolvidos" ON protocolos_anexos 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM protocolos p 
      WHERE p.id = protocolo_id AND (
        p.solicitante_id = auth.uid() OR 
        p.responsavel_id = auth.uid()
      )
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario IN ('super_admin', 'admin', 'secretario', 'diretor', 'coordenador', 'funcionario', 'atendente')
    )
  );

CREATE POLICY "Usuários podem inserir anexos" ON protocolos_anexos 
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

-- Políticas para notificações
CREATE POLICY "Usuários veem suas notificações" ON notificacoes 
  FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY "Sistema pode criar notificações" ON notificacoes 
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_protocolos_numero ON protocolos(numero);
CREATE INDEX IF NOT EXISTS idx_protocolos_solicitante ON protocolos(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_status ON protocolos(status);
CREATE INDEX IF NOT EXISTS idx_protocolos_data_abertura ON protocolos(data_abertura);
CREATE INDEX IF NOT EXISTS idx_protocolos_secretaria ON protocolos(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_responsavel ON protocolos(responsavel_id);

CREATE INDEX IF NOT EXISTS idx_historico_protocolo ON protocolos_historico(protocolo_id);
CREATE INDEX IF NOT EXISTS idx_anexos_protocolo ON protocolos_anexos(protocolo_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_nao_lidas ON notificacoes(usuario_id, lida) WHERE lida = false;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE protocolos IS 'Tabela principal para gerenciamento de protocolos de atendimento';
COMMENT ON TABLE servicos_municipais IS 'Catálogo de serviços disponíveis para os cidadãos';
COMMENT ON TABLE protocolos_historico IS 'Auditoria completa de todas as movimentações dos protocolos';
COMMENT ON TABLE protocolos_anexos IS 'Arquivos e documentos anexados aos protocolos';
COMMENT ON TABLE notificacoes IS 'Sistema de notificações para usuários';

-- Remover função existente se houver
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Atualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover triggers existentes
DROP TRIGGER IF EXISTS update_categorias_servicos_updated_at ON categorias_servicos;
DROP TRIGGER IF EXISTS update_servicos_municipais_updated_at ON servicos_municipais;
DROP TRIGGER IF EXISTS update_protocolos_updated_at ON protocolos;

-- Triggers para updated_at
CREATE TRIGGER update_categorias_servicos_updated_at BEFORE UPDATE ON categorias_servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicos_municipais_updated_at BEFORE UPDATE ON servicos_municipais FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_protocolos_updated_at BEFORE UPDATE ON protocolos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();