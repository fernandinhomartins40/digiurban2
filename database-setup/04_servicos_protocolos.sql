-- =============================================================================
-- 04_SERVICOS_PROTOCOLOS.SQL - DigiUrban Database Setup
-- =============================================================================
-- Sistema completo de protocolos e serviços municipais
-- Execute APÓS 03_secretarias_setores.sql
-- =============================================================================

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

DROP TRIGGER IF EXISTS set_numero_protocolo ON protocolos;
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

DROP TRIGGER IF EXISTS protocolo_historico_trigger ON protocolos;
CREATE TRIGGER protocolo_historico_trigger
    AFTER INSERT OR UPDATE ON protocolos
    FOR EACH ROW EXECUTE FUNCTION trigger_protocolo_historico();

-- =============================================================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================================================
DROP TRIGGER IF EXISTS update_protocolos_updated_at ON protocolos;
CREATE TRIGGER update_protocolos_updated_at 
    BEFORE UPDATE ON protocolos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comentarios_updated_at ON protocolos_comentarios;
CREATE TRIGGER update_comentarios_updated_at 
    BEFORE UPDATE ON protocolos_comentarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- HABILITAR ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE protocolos ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SERVIÇOS MUNICIPAIS BÁSICOS
-- =============================================================================
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
  '["CPF ou CNPJ", "Comprovante de endereço"]'::jsonb,
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
  '["CPF", "Número da inscrição imobiliária"]'::jsonb,
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
  '["Cartão SUS", "CPF", "Comprovante de endereço"]'::jsonb,
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
  '["Certidão de nascimento", "CPF dos pais", "Comprovante de endereço", "Cartão de vacinação"]'::jsonb,
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
  '[]'::jsonb,
  7,
  60
FROM secretarias s WHERE s.codigo = 'SEC-OBR'
ON CONFLICT (codigo) DO NOTHING;

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Sistema de protocolos configurado!';
    RAISE NOTICE 'Serviços municipais: %', (SELECT COUNT(*) FROM servicos_municipais);
    RAISE NOTICE 'Tabelas criadas: protocolos, histórico, anexos, comentários, notificações';
    RAISE NOTICE 'Próximo passo: Execute 05_chat_sistema.sql';
END $$;