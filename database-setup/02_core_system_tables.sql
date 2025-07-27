-- =============================================================================
-- SCRIPT SQL PARA SISTEMA COMPLETO DE PROTOCOLOS MUNICIPAIS
-- =============================================================================
-- Execute este script no SQL Editor do Supabase: http://82.25.69.57:8162/project/default/sql
-- =============================================================================

-- Criar tipos customizados
CREATE TYPE tipo_protocolo AS ENUM (
    'solicitacao',
    'reclamacao', 
    'sugestao',
    'denuncia',
    'informacao',
    'elogio'
);

CREATE TYPE status_protocolo AS ENUM (
    'aberto',
    'em_andamento', 
    'aguardando_documentos',
    'aguardando_aprovacao',
    'aprovado',
    'rejeitado',
    'concluido',
    'cancelado'
);

CREATE TYPE prioridade_nivel AS ENUM (
    'baixa',
    'media', 
    'alta',
    'urgente'
);

CREATE TYPE status_servico AS ENUM (
    'ativo',
    'inativo',
    'em_revisao'
);

-- =============================================================================
-- TABELA: Secretarias (verificar se já existe e adaptar)
-- =============================================================================
-- Verificar se a tabela já existe e adicionar colunas se necessário
DO $$
BEGIN
  -- Verificar se a tabela secretarias existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'secretarias') THEN
    CREATE TABLE secretarias (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      codigo TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      sigla TEXT UNIQUE NOT NULL,
      descricao TEXT,
      responsavel_id UUID,
      email_oficial TEXT,
      telefone TEXT,
      endereco JSONB,
      ativo BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- Adicionar colunas que podem não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'secretarias' AND column_name = 'email_oficial') THEN
      ALTER TABLE secretarias ADD COLUMN email_oficial TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'secretarias' AND column_name = 'telefone') THEN
      ALTER TABLE secretarias ADD COLUMN telefone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'secretarias' AND column_name = 'endereco') THEN
      ALTER TABLE secretarias ADD COLUMN endereco JSONB;
    END IF;
  END IF;
END $$;

-- =============================================================================
-- TABELA: Setores/Departamentos
-- =============================================================================
CREATE TABLE IF NOT EXISTS setores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  secretaria_id UUID NOT NULL REFERENCES secretarias(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  responsavel_id UUID,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: Catálogo de Serviços Municipais
-- =============================================================================
CREATE TABLE IF NOT EXISTS servicos_municipais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  subcategoria TEXT,
  secretaria_responsavel_id UUID NOT NULL REFERENCES secretarias(id),
  setor_responsavel_id UUID REFERENCES setores(id),
  
  -- Configurações do serviço
  requer_documentos BOOLEAN DEFAULT false,
  documentos_necessarios JSONB DEFAULT '[]',
  prazo_resposta_dias INTEGER DEFAULT 30,
  prazo_resolucao_dias INTEGER DEFAULT 60,
  taxa_servico DECIMAL(10,2) DEFAULT 0,
  
  -- Status e validação
  status status_servico DEFAULT 'ativo',
  requer_aprovacao_admin BOOLEAN DEFAULT false,
  aprovado_por UUID,
  aprovado_em TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- =============================================================================
-- TABELA: Protocolos de Solicitações
-- =============================================================================
CREATE TABLE IF NOT EXISTS protocolos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_protocolo TEXT UNIQUE NOT NULL,
  servico_id UUID NOT NULL REFERENCES servicos_municipais(id),
  
  -- Solicitante
  solicitante_id UUID NOT NULL,
  dados_solicitante JSONB NOT NULL, -- Nome, CPF, email, telefone, endereço
  
  -- Detalhes da solicitação
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  dados_especificos JSONB DEFAULT '{}', -- Campos específicos do serviço
  endereco_referencia JSONB, -- Local relacionado à solicitação
  
  -- Responsabilidade
  secretaria_id UUID NOT NULL REFERENCES secretarias(id),
  setor_id UUID REFERENCES setores(id),
  responsavel_atual_id UUID,
  
  -- Status e controle
  status status_protocolo DEFAULT 'aberto',
  prioridade prioridade_nivel DEFAULT 'media',
  
  -- Prazos
  prazo_resposta TIMESTAMP WITH TIME ZONE,
  prazo_resolucao TIMESTAMP WITH TIME ZONE,
  data_primeira_resposta TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  
  -- Aprovação administrativa
  requer_aprovacao BOOLEAN DEFAULT false,
  aprovado BOOLEAN,
  aprovado_por UUID,
  aprovado_em TIMESTAMP WITH TIME ZONE,
  observacoes_aprovacao TEXT,
  
  -- Avaliação do cidadão
  avaliacao_nota INTEGER CHECK (avaliacao_nota >= 1 AND avaliacao_nota <= 5),
  avaliacao_comentario TEXT,
  avaliado_em TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: Histórico de Protocolos
-- =============================================================================
CREATE TABLE IF NOT EXISTS protocolos_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo_id UUID NOT NULL REFERENCES protocolos(id) ON DELETE CASCADE,
  
  -- Mudança
  acao TEXT NOT NULL, -- 'criado', 'encaminhado', 'atualizado', 'aprovado', etc.
  status_anterior TEXT,
  status_novo TEXT,
  dados_anteriores JSONB,
  dados_novos JSONB,
  observacoes TEXT,
  
  -- Responsável pela ação
  usuario_id UUID,
  usuario_nome TEXT NOT NULL,
  usuario_tipo TEXT NOT NULL,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- =============================================================================
-- TABELA: Anexos de Protocolos
-- =============================================================================
CREATE TABLE IF NOT EXISTS protocolos_anexos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo_id UUID NOT NULL REFERENCES protocolos(id) ON DELETE CASCADE,
  
  -- Arquivo
  nome_arquivo TEXT NOT NULL,
  tipo_arquivo TEXT,
  tamanho_bytes BIGINT,
  url_storage TEXT NOT NULL, -- URL no Supabase Storage
  hash_arquivo TEXT,
  
  -- Classificação
  tipo_anexo TEXT DEFAULT 'documento' CHECK (tipo_anexo IN ('documento', 'comprovante', 'foto', 'outro')),
  obrigatorio BOOLEAN DEFAULT false,
  
  -- Metadados
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: Comentários de Protocolos
-- =============================================================================
CREATE TABLE IF NOT EXISTS protocolos_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo_id UUID NOT NULL REFERENCES protocolos(id) ON DELETE CASCADE,
  
  -- Comentário
  comentario TEXT NOT NULL,
  tipo TEXT DEFAULT 'observacao' CHECK (tipo IN ('observacao', 'resposta_oficial', 'solicitacao_documentos')),
  visivel_cidadao BOOLEAN DEFAULT true,
  
  -- Autor
  autor_id UUID,
  autor_nome TEXT NOT NULL,
  autor_cargo TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABELA: Notificações
-- =============================================================================
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Destinatário
  usuario_id UUID NOT NULL,
  
  -- Conteúdo
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT DEFAULT 'info' CHECK (tipo IN ('info', 'sucesso', 'aviso', 'erro', 'protocolo')),
  
  -- Referência (opcional)
  referencia_tipo TEXT, -- 'protocolo', 'chat', etc.
  referencia_id UUID,
  
  -- Status
  lida BOOLEAN DEFAULT false,
  lida_em TIMESTAMP WITH TIME ZONE,
  
  -- Configurações
  push_enviado BOOLEAN DEFAULT false,
  email_enviado BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================

-- Índices para protocolos
CREATE INDEX IF NOT EXISTS idx_protocolos_solicitante ON protocolos(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_servico ON protocolos(servico_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_secretaria ON protocolos(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_status ON protocolos(status);
CREATE INDEX IF NOT EXISTS idx_protocolos_numero ON protocolos(numero_protocolo);
CREATE INDEX IF NOT EXISTS idx_protocolos_created_at ON protocolos(created_at);

-- Índices para serviços
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos_municipais(categoria);
CREATE INDEX IF NOT EXISTS idx_servicos_secretaria ON servicos_municipais(secretaria_responsavel_id);
CREATE INDEX IF NOT EXISTS idx_servicos_status ON servicos_municipais(status);

-- Índices para histórico
CREATE INDEX IF NOT EXISTS idx_historico_protocolo ON protocolos_historico(protocolo_id);
CREATE INDEX IF NOT EXISTS idx_historico_created_at ON protocolos_historico(created_at);

-- Índices para notificações
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON notificacoes(tipo);

-- =============================================================================
-- FUNÇÃO PARA GERAR NÚMERO DE PROTOCOLO
-- =============================================================================
CREATE OR REPLACE FUNCTION gerar_numero_protocolo()
RETURNS TEXT AS $$
DECLARE
    ano TEXT;
    sequencial TEXT;
    numero_final TEXT;
BEGIN
    -- Pegar o ano atual
    ano := TO_CHAR(NOW(), 'YYYY');
    
    -- Gerar sequencial baseado na contagem de protocolos do ano
    SELECT LPAD((COUNT(*) + 1)::TEXT, 7, '0') INTO sequencial
    FROM protocolos 
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
    
    -- Formato: PROT-2025-0000001
    numero_final := 'PROT-' || ano || '-' || sequencial;
    
    RETURN numero_final;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGER PARA GERAR NÚMERO DE PROTOCOLO AUTOMATICAMENTE
-- =============================================================================
CREATE OR REPLACE FUNCTION trigger_gerar_numero_protocolo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_protocolo IS NULL OR NEW.numero_protocolo = '' THEN
        NEW.numero_protocolo := gerar_numero_protocolo();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_numero_protocolo
    BEFORE INSERT ON protocolos
    FOR EACH ROW EXECUTE FUNCTION trigger_gerar_numero_protocolo();

-- =============================================================================
-- TRIGGER PARA HISTÓRICO AUTOMÁTICO
-- =============================================================================
CREATE OR REPLACE FUNCTION trigger_protocolo_historico()
RETURNS TRIGGER AS $$
BEGIN
    -- Para INSERT (criação)
    IF TG_OP = 'INSERT' THEN
        INSERT INTO protocolos_historico (
            protocolo_id,
            acao,
            status_novo,
            dados_novos,
            usuario_id,
            usuario_nome,
            usuario_tipo,
            observacoes
        ) VALUES (
            NEW.id,
            'criado',
            NEW.status,
            row_to_json(NEW),
            NEW.solicitante_id,
            COALESCE((NEW.dados_solicitante->>'nome_completo'), 'Sistema'),
            'cidadao',
            'Protocolo criado pelo cidadão'
        );
        RETURN NEW;
    END IF;
    
    -- Para UPDATE (alteração)
    IF TG_OP = 'UPDATE' THEN
        -- Só registra se houve mudança significativa
        IF OLD.status != NEW.status OR 
           OLD.responsavel_atual_id != NEW.responsavel_atual_id OR
           OLD.secretaria_id != NEW.secretaria_id THEN
            
            INSERT INTO protocolos_historico (
                protocolo_id,
                acao,
                status_anterior,
                status_novo,
                dados_anteriores,
                dados_novos,
                usuario_id,
                usuario_nome,
                usuario_tipo,
                observacoes
            ) VALUES (
                NEW.id,
                CASE 
                    WHEN OLD.status != NEW.status THEN 'status_alterado'
                    WHEN OLD.responsavel_atual_id != NEW.responsavel_atual_id THEN 'responsavel_alterado'
                    WHEN OLD.secretaria_id != NEW.secretaria_id THEN 'encaminhado'
                    ELSE 'atualizado'
                END,
                OLD.status,
                NEW.status,
                row_to_json(OLD),
                row_to_json(NEW),
                COALESCE(NEW.responsavel_atual_id, NEW.solicitante_id),
                'Sistema',
                'sistema',
                'Alteração automática registrada'
            );
        END IF;
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protocolo_historico_trigger
    AFTER INSERT OR UPDATE ON protocolos
    FOR EACH ROW EXECUTE FUNCTION trigger_protocolo_historico();

-- =============================================================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_secretarias_updated_at 
    BEFORE UPDATE ON secretarias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setores_updated_at 
    BEFORE UPDATE ON setores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at 
    BEFORE UPDATE ON servicos_municipais 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocolos_updated_at 
    BEFORE UPDATE ON protocolos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comentarios_updated_at 
    BEFORE UPDATE ON protocolos_comentarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE secretarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos_municipais ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- POLÍTICAS RLS PARA SECRETARIAS
-- =============================================================================

-- Todos podem ver secretarias ativas
CREATE POLICY "public_view_active_secretarias" ON secretarias
  FOR SELECT USING (ativo = true);

-- Admins podem gerenciar secretarias
CREATE POLICY "admins_manage_secretarias" ON secretarias
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND tipo_usuario IN ('super_admin', 'admin')
    )
  );

-- =============================================================================
-- POLÍTICAS RLS PARA SERVIÇOS MUNICIPAIS
-- =============================================================================

-- Todos podem ver serviços ativos
CREATE POLICY "public_view_active_services" ON servicos_municipais
  FOR SELECT USING (status = 'ativo');

-- Admins podem gerenciar todos os serviços
CREATE POLICY "admins_manage_services" ON servicos_municipais
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND tipo_usuario IN ('super_admin', 'admin')
    )
  );

-- Secretários podem criar/editar serviços de sua secretaria
CREATE POLICY "secretaries_manage_own_services" ON servicos_municipais
  FOR ALL USING (
    secretaria_responsavel_id IN (
      SELECT secretaria_id FROM user_profiles 
      WHERE id = auth.uid() 
      AND tipo_usuario IN ('secretario', 'diretor')
    )
  );

-- =============================================================================
-- POLÍTICAS RLS PARA PROTOCOLOS
-- =============================================================================

-- Cidadãos podem ver apenas seus próprios protocolos
CREATE POLICY "citizens_own_protocols" ON protocolos
  FOR SELECT USING (
    solicitante_id = auth.uid()
  );

-- Cidadãos podem criar protocolos
CREATE POLICY "citizens_create_protocols" ON protocolos
  FOR INSERT WITH CHECK (
    solicitante_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND tipo_usuario = 'cidadao'
    )
  );

-- Servidores podem ver protocolos de sua responsabilidade
CREATE POLICY "servers_responsible_protocols" ON protocolos
  FOR SELECT USING (
    secretaria_id IN (
      SELECT secretaria_id FROM user_profiles 
      WHERE id = auth.uid()
    )
    OR responsavel_atual_id = auth.uid()
  );

-- Servidores podem atualizar protocolos de sua responsabilidade
CREATE POLICY "servers_update_protocols" ON protocolos
  FOR UPDATE USING (
    secretaria_id IN (
      SELECT secretaria_id FROM user_profiles 
      WHERE id = auth.uid()
    )
    OR responsavel_atual_id = auth.uid()
  );

-- Admins podem ver todos os protocolos
CREATE POLICY "admins_all_protocols" ON protocolos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND tipo_usuario IN ('super_admin', 'admin')
    )
  );

-- =============================================================================
-- POLÍTICAS RLS PARA HISTÓRICO
-- =============================================================================

-- Usuários podem ver histórico dos protocolos que têm acesso
CREATE POLICY "users_view_accessible_history" ON protocolos_historico
  FOR SELECT USING (
    protocolo_id IN (
      SELECT id FROM protocolos
      WHERE solicitante_id = auth.uid()
      OR secretaria_id IN (
        SELECT secretaria_id FROM user_profiles 
        WHERE id = auth.uid()
      )
      OR responsavel_atual_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND tipo_usuario IN ('super_admin', 'admin')
      )
    )
  );

-- =============================================================================
-- POLÍTICAS RLS PARA ANEXOS
-- =============================================================================

-- Usuários podem ver anexos dos protocolos que têm acesso
CREATE POLICY "users_view_accessible_attachments" ON protocolos_anexos
  FOR SELECT USING (
    protocolo_id IN (
      SELECT id FROM protocolos
      WHERE solicitante_id = auth.uid()
      OR secretaria_id IN (
        SELECT secretaria_id FROM user_profiles 
        WHERE id = auth.uid()
      )
      OR responsavel_atual_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND tipo_usuario IN ('super_admin', 'admin')
      )
    )
  );

-- Usuários podem adicionar anexos aos seus protocolos
CREATE POLICY "users_add_attachments" ON protocolos_anexos
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND
    protocolo_id IN (
      SELECT id FROM protocolos
      WHERE solicitante_id = auth.uid()
      OR secretaria_id IN (
        SELECT secretaria_id FROM user_profiles 
        WHERE id = auth.uid()
      )
      OR responsavel_atual_id = auth.uid()
    )
  );

-- =============================================================================
-- POLÍTICAS RLS PARA COMENTÁRIOS
-- =============================================================================

-- Usuários podem ver comentários dos protocolos que têm acesso
CREATE POLICY "users_view_accessible_comments" ON protocolos_comentarios
  FOR SELECT USING (
    protocolo_id IN (
      SELECT id FROM protocolos
      WHERE solicitante_id = auth.uid()
      OR secretaria_id IN (
        SELECT secretaria_id FROM user_profiles 
        WHERE id = auth.uid()
      )
      OR responsavel_atual_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND tipo_usuario IN ('super_admin', 'admin')
      )
    )
    AND (
      visivel_cidadao = true 
      OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND tipo_usuario != 'cidadao'
      )
    )
  );

-- Usuários podem adicionar comentários
CREATE POLICY "users_add_comments" ON protocolos_comentarios
  FOR INSERT WITH CHECK (
    autor_id = auth.uid() AND
    protocolo_id IN (
      SELECT id FROM protocolos
      WHERE solicitante_id = auth.uid()
      OR secretaria_id IN (
        SELECT secretaria_id FROM user_profiles 
        WHERE id = auth.uid()
      )
      OR responsavel_atual_id = auth.uid()
    )
  );

-- =============================================================================
-- POLÍTICAS RLS PARA NOTIFICAÇÕES
-- =============================================================================

-- Usuários podem ver apenas suas próprias notificações
CREATE POLICY "users_own_notifications" ON notificacoes
  FOR SELECT USING (usuario_id = auth.uid());

-- Usuários podem atualizar suas próprias notificações (marcar como lida)
CREATE POLICY "users_update_own_notifications" ON notificacoes
  FOR UPDATE USING (usuario_id = auth.uid());

-- Sistema pode criar notificações
CREATE POLICY "system_create_notifications" ON notificacoes
  FOR INSERT WITH CHECK (true);

-- =============================================================================
-- HABILITAR REALTIME
-- =============================================================================

-- Habilitar realtime para as tabelas necessárias
ALTER PUBLICATION supabase_realtime ADD TABLE protocolos;
ALTER PUBLICATION supabase_realtime ADD TABLE protocolos_historico;
ALTER PUBLICATION supabase_realtime ADD TABLE protocolos_comentarios;
ALTER PUBLICATION supabase_realtime ADD TABLE notificacoes;

-- =============================================================================
-- DADOS INICIAIS DE EXEMPLO
-- =============================================================================

-- Inserir secretarias de exemplo (se não existirem)
INSERT INTO secretarias (codigo, nome, sigla, descricao, ativo)
VALUES 
  ('SEC-ADM', 'Secretaria de Administração', 'ADMIN', 'Gestão administrativa municipal', true),
  ('SEC-SAU', 'Secretaria de Saúde', 'SAUDE', 'Serviços de saúde pública', true),
  ('SEC-EDU', 'Secretaria de Educação', 'EDUC', 'Educação municipal', true),
  ('SEC-OBR', 'Secretaria de Obras', 'OBRAS', 'Obras e infraestrutura', true),
  ('SEC-FIN', 'Secretaria de Finanças', 'FINAN', 'Gestão financeira municipal', true),
  ('SEC-MEI', 'Secretaria de Meio Ambiente', 'MEIO', 'Meio ambiente e sustentabilidade', true)
ON CONFLICT (codigo) DO NOTHING;

-- Inserir serviços municipais de exemplo
INSERT INTO servicos_municipais (
  codigo, nome, descricao, categoria, secretaria_responsavel_id,
  requer_documentos, documentos_necessarios, prazo_resposta_dias, prazo_resolucao_dias
)
SELECT 
  'SRV-001', 
  'Certidão Negativa de Débitos',
  'Emissão de certidão que comprova a inexistência de débitos municipais',
  'financas',
  s.id,
  true,
  '["CPF ou CNPJ", "Comprovante de endereço"]',
  5,
  10
FROM secretarias s WHERE s.codigo = 'SEC-FIN'
UNION ALL
SELECT 
  'SRV-002',
  'Segunda Via de IPTU', 
  'Emissão de segunda via do boleto de IPTU',
  'financas',
  s.id,
  true,
  '["CPF", "Número da inscrição imobiliária"]',
  1,
  3
FROM secretarias s WHERE s.codigo = 'SEC-FIN'
UNION ALL
SELECT 
  'SRV-003',
  'Agendamento de Consulta Médica',
  'Agendamento de consultas nas unidades de saúde municipais',
  'saude',
  s.id,
  true,
  '["Cartão SUS", "CPF", "Comprovante de endereço"]',
  3,
  30
FROM secretarias s WHERE s.codigo = 'SEC-SAU'
UNION ALL
SELECT 
  'SRV-004',
  'Matrícula Escolar',
  'Matrícula na rede municipal de ensino',
  'educacao',
  s.id,
  true,
  '["Certidão de nascimento", "CPF dos pais", "Comprovante de endereço", "Cartão de vacinação"]',
  15,
  30
FROM secretarias s WHERE s.codigo = 'SEC-EDU'
UNION ALL
SELECT 
  'SRV-005',
  'Solicitação de Reparo em Via Pública',
  'Solicitação de reparo em ruas, calçadas e outros logradouros',
  'obras',
  s.id,
  false,
  '[]',
  7,
  60
FROM secretarias s WHERE s.codigo = 'SEC-OBR'
UNION ALL
SELECT 
  'SRV-006',
  'Licença Ambiental',
  'Solicitação de licenças para atividades potencialmente poluidoras',
  'meio-ambiente',
  s.id,
  true,
  '["Projeto técnico", "EIA/RIMA", "ART do responsável técnico"]',
  30,
  90
FROM secretarias s WHERE s.codigo = 'SEC-MEI'
ON CONFLICT (codigo) DO NOTHING;

-- =============================================================================
-- VERIFICAÇÃO FINAL
-- =============================================================================

-- Verificar se as tabelas foram criadas
SELECT 
  'secretarias' as tabela,
  COUNT(*) as registros
FROM secretarias
UNION ALL
SELECT 
  'servicos_municipais' as tabela,
  COUNT(*) as registros  
FROM servicos_municipais
UNION ALL
SELECT 
  'protocolos' as tabela,
  COUNT(*) as registros
FROM protocolos;

-- Listar serviços criados
SELECT 
  s.codigo,
  s.nome,
  s.categoria,
  sec.nome as secretaria,
  s.status
FROM servicos_municipais s
JOIN secretarias sec ON s.secretaria_responsavel_id = sec.id
ORDER BY s.categoria, s.nome;

-- =============================================================================
-- SCRIPT EXECUTADO COM SUCESSO!
-- =============================================================================
-- O sistema completo de protocolos municipais está configurado e pronto para uso.
-- 
-- Próximos passos:
-- 1. Implementar os serviços de API no frontend
-- 2. Adaptar os componentes React
-- 3. Testar o fluxo completo de protocolos
-- =============================================================================