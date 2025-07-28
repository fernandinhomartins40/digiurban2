-- =============================================================================
-- 05_SISTEMA_PROTOCOLOS.SQL
-- =============================================================================
-- Cria tabelas do sistema de protocolos/solicitações
-- Execute DEPOIS do script 04
-- =============================================================================

-- =====================================================
-- 1. TABELA PRINCIPAL DE PROTOCOLOS
-- =====================================================

CREATE TABLE IF NOT EXISTS protocolos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_protocolo TEXT UNIQUE NOT NULL,
    numero TEXT UNIQUE, -- Alias para compatibilidade
    
    -- Relações principais
    servico_id UUID REFERENCES servicos_municipais(id),
    solicitante_id UUID NOT NULL REFERENCES auth.users(id),
    secretaria_id UUID REFERENCES secretarias(id),
    setor_id UUID REFERENCES setores(id),
    responsavel_atual_id UUID REFERENCES auth.users(id),
    responsavel_id UUID REFERENCES auth.users(id), -- Alias para compatibilidade
    
    -- Dados básicos
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    
    -- Dados do solicitante (snapshot no momento da criação)
    dados_solicitante JSONB DEFAULT '{}'::jsonb,
    
    -- Dados específicos do formulário
    dados_especificos JSONB DEFAULT '{}'::jsonb,
    dados_formulario JSONB, -- Alias para compatibilidade
    
    -- Localização/endereço
    endereco_referencia JSONB,
    localizacao JSONB, -- Alias para compatibilidade
    coordenadas_gps POINT,
    
    -- Status e controle
    status status_protocolo_enum DEFAULT 'aberto',
    prioridade prioridade_enum DEFAULT 'media',
    
    -- Datas importantes
    data_abertura TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    prazo_resposta TIMESTAMP WITH TIME ZONE,
    data_prazo TIMESTAMP WITH TIME ZONE, -- Alias para compatibilidade
    prazo_resolucao TIMESTAMP WITH TIME ZONE,
    data_primeira_resposta TIMESTAMP WITH TIME ZONE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    
    -- Aprovação
    requer_aprovacao BOOLEAN DEFAULT false,
    aprovado BOOLEAN,
    aprovado_por UUID REFERENCES auth.users(id),
    aprovado_em TIMESTAMP WITH TIME ZONE,
    observacoes_aprovacao TEXT,
    
    -- Avaliação do cidadão
    avaliacao_nota INTEGER CHECK (avaliacao_nota BETWEEN 1 AND 5),
    avaliacao INTEGER, -- Alias para compatibilidade
    avaliacao_comentario TEXT,
    comentario_avaliacao TEXT, -- Alias para compatibilidade
    avaliado_em TIMESTAMP WITH TIME ZONE,
    data_avaliacao TIMESTAMP WITH TIME ZONE, -- Alias para compatibilidade
    
    -- Métricas automáticas
    tempo_primeira_resposta_horas DECIMAL(10,2),
    tempo_total_resolucao_horas DECIMAL(10,2),
    numero_interacoes INTEGER DEFAULT 0,
    numero_anexos INTEGER DEFAULT 0,
    
    -- Controle interno
    observacoes_internas TEXT,
    tags TEXT[],
    urgente BOOLEAN DEFAULT false,
    publico BOOLEAN DEFAULT true, -- Se aparece em consultas públicas
    
    -- Metadados
    origem TEXT DEFAULT 'web', -- 'web', 'mobile', 'presencial', 'telefone'
    canal_atendimento TEXT,
    ip_origem INET,
    user_agent TEXT,
    
    -- Controle de versão
    versao INTEGER DEFAULT 1,
    migrado_de TEXT, -- Sistema anterior, se houver
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentários
COMMENT ON TABLE protocolos IS 'Tabela principal de protocolos/solicitações do sistema';
COMMENT ON COLUMN protocolos.numero_protocolo IS 'Número único do protocolo gerado automaticamente';
COMMENT ON COLUMN protocolos.dados_solicitante IS 'Snapshot dos dados do solicitante no momento da criação';
COMMENT ON COLUMN protocolos.dados_especificos IS 'Dados específicos do formulário do serviço';
COMMENT ON COLUMN protocolos.coordenadas_gps IS 'Coordenadas GPS se aplicável';

-- =====================================================
-- 2. TABELA DE HISTÓRICO DE ALTERAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS protocolos_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocolo_id UUID NOT NULL REFERENCES protocolos(id) ON DELETE CASCADE,
    
    -- Ação realizada
    acao TEXT NOT NULL, -- 'criado', 'atualizado', 'status_alterado', 'comentario_adicionado', etc.
    
    -- Estados anterior e novo
    status_anterior status_protocolo_enum,
    status_novo status_protocolo_enum,
    responsavel_anterior_id UUID REFERENCES auth.users(id),
    responsavel_novo_id UUID REFERENCES auth.users(id),
    
    -- Dados completos para auditoria
    dados_anteriores JSONB,
    dados_novos JSONB,
    
    -- Observações da alteração
    observacoes TEXT,
    comentario TEXT, -- Comentário da ação
    
    -- Quem fez a alteração
    usuario_id UUID REFERENCES auth.users(id),
    usuario_nome TEXT,
    usuario_tipo tipo_usuario_enum,
    usuario_cargo TEXT,
    
    -- Controle técnico
    ip_address INET,
    user_agent TEXT,
    metadados JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE protocolos_historico IS 'Histórico completo de todas as alterações nos protocolos';

-- =====================================================
-- 3. TABELA DE COMENTÁRIOS/INTERAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS protocolos_comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocolo_id UUID NOT NULL REFERENCES protocolos(id) ON DELETE CASCADE,
    
    -- Conteúdo
    comentario TEXT NOT NULL,
    tipo tipo_comentario_enum DEFAULT 'observacao',
    
    -- Visibilidade
    visivel_cidadao BOOLEAN DEFAULT true,
    interno BOOLEAN DEFAULT false,
    
    -- Autor
    autor_id UUID NOT NULL REFERENCES auth.users(id),
    autor_nome TEXT,
    autor_cargo TEXT,
    autor_setor TEXT,
    
    -- Resposta a outro comentário
    resposta_a_id UUID REFERENCES protocolos_comentarios(id),
    
    -- Anexos relacionados
    anexos_ids UUID[],
    
    -- Metadados
    editado BOOLEAN DEFAULT false,
    editado_em TIMESTAMP WITH TIME ZONE,
    editado_por UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE protocolos_comentarios IS 'Comentários e interações nos protocolos';

-- =====================================================
-- 4. TABELA DE ANEXOS/DOCUMENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS protocolos_anexos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocolo_id UUID NOT NULL REFERENCES protocolos(id) ON DELETE CASCADE,
    
    -- Dados do arquivo
    nome_arquivo TEXT NOT NULL,
    nome_original TEXT, -- Nome original do arquivo
    tipo_arquivo TEXT, -- MIME type
    tamanho_bytes BIGINT,
    hash_arquivo TEXT, -- Para verificar integridade
    
    -- URLs de acesso
    url_arquivo TEXT, -- URL pública (para compatibilidade)
    url_storage TEXT, -- URL do Supabase Storage
    bucket_name TEXT DEFAULT 'protocolos-anexos',
    storage_path TEXT, -- Caminho no storage
    
    -- Classificação
    tipo_anexo tipo_anexo_enum DEFAULT 'documento',
    categoria_documento TEXT, -- 'comprovante_residencia', 'identidade', etc.
    descricao TEXT,
    obrigatorio BOOLEAN DEFAULT false,
    
    -- Controle
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    usuario_id UUID REFERENCES auth.users(id), -- Alias para compatibilidade
    aprovado BOOLEAN,
    aprovado_por UUID REFERENCES auth.users(id),
    aprovado_em TIMESTAMP WITH TIME ZONE,
    observacoes_aprovacao TEXT,
    
    -- Versioning
    versao INTEGER DEFAULT 1,
    substitui_anexo_id UUID REFERENCES protocolos_anexos(id),
    
    -- Metadados
    metadados JSONB DEFAULT '{}'::jsonb,
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE protocolos_anexos IS 'Anexos e documentos dos protocolos';

-- =====================================================
-- 5. TABELA DE ETAPAS DO FLUXO
-- =====================================================

CREATE TABLE IF NOT EXISTS protocolo_etapas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocolo_id UUID NOT NULL REFERENCES protocolos(id) ON DELETE CASCADE,
    
    -- Definição da etapa
    etapa_numero INTEGER NOT NULL,
    nome_etapa TEXT NOT NULL,
    descricao TEXT,
    
    -- Responsabilidade
    responsavel_id UUID REFERENCES auth.users(id),
    setor_responsavel_id UUID REFERENCES setores(id),
    
    -- Status da etapa
    status TEXT DEFAULT 'pendente', -- 'pendente', 'em_andamento', 'concluida', 'pulada'
    obrigatoria BOOLEAN DEFAULT true,
    
    -- Datas
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    prazo_etapa TIMESTAMP WITH TIME ZONE,
    
    -- Resultado
    aprovada BOOLEAN,
    observacoes TEXT,
    dados_etapa JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE protocolo_etapas IS 'Etapas do fluxo de tramitação dos protocolos';

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices principais na tabela protocolos
CREATE INDEX IF NOT EXISTS idx_protocolos_numero ON protocolos(numero_protocolo);
CREATE INDEX IF NOT EXISTS idx_protocolos_solicitante ON protocolos(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_servico ON protocolos(servico_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_secretaria ON protocolos(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_setor ON protocolos(setor_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_responsavel ON protocolos(responsavel_atual_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_status ON protocolos(status);
CREATE INDEX IF NOT EXISTS idx_protocolos_prioridade ON protocolos(prioridade);
CREATE INDEX IF NOT EXISTS idx_protocolos_data_abertura ON protocolos(data_abertura);
CREATE INDEX IF NOT EXISTS idx_protocolos_prazo_resposta ON protocolos(prazo_resposta);

-- Índice composto para consultas comuns
CREATE INDEX IF NOT EXISTS idx_protocolos_status_data ON protocolos(status, data_abertura);
CREATE INDEX IF NOT EXISTS idx_protocolos_responsavel_status ON protocolos(responsavel_atual_id, status);

-- Índice para busca textual
CREATE INDEX IF NOT EXISTS idx_protocolos_busca_texto ON protocolos 
    USING gin(to_tsvector('portuguese', titulo || ' ' || descricao));

-- Índices nas tabelas relacionadas
CREATE INDEX IF NOT EXISTS idx_protocolos_historico_protocolo ON protocolos_historico(protocolo_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_historico_data ON protocolos_historico(created_at);
CREATE INDEX IF NOT EXISTS idx_protocolos_historico_usuario ON protocolos_historico(usuario_id);

CREATE INDEX IF NOT EXISTS idx_protocolos_comentarios_protocolo ON protocolos_comentarios(protocolo_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_comentarios_autor ON protocolos_comentarios(autor_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_comentarios_tipo ON protocolos_comentarios(tipo);

CREATE INDEX IF NOT EXISTS idx_protocolos_anexos_protocolo ON protocolos_anexos(protocolo_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_anexos_uploaded_by ON protocolos_anexos(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_protocolos_anexos_tipo ON protocolos_anexos(tipo_anexo);

CREATE INDEX IF NOT EXISTS idx_protocolo_etapas_protocolo ON protocolo_etapas(protocolo_id);
CREATE INDEX IF NOT EXISTS idx_protocolo_etapas_responsavel ON protocolo_etapas(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_protocolo_etapas_status ON protocolo_etapas(status);

-- =====================================================
-- 7. TRIGGERS PARA AUTOMAÇÃO
-- =====================================================

-- Trigger para gerar número de protocolo
CREATE OR REPLACE FUNCTION trigger_gerar_numero_protocolo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_protocolo IS NULL THEN
        NEW.numero_protocolo := gerar_numero_protocolo();
    END IF;
    
    -- Garantir que alias também seja preenchido
    IF NEW.numero IS NULL THEN
        NEW.numero := NEW.numero_protocolo;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protocolo_numero_trigger
    BEFORE INSERT ON protocolos
    FOR EACH ROW
    EXECUTE FUNCTION trigger_gerar_numero_protocolo();

-- Trigger para updated_at
CREATE TRIGGER update_protocolos_updated_at
    BEFORE UPDATE ON protocolos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocolos_comentarios_updated_at
    BEFORE UPDATE ON protocolos_comentarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocolo_etapas_updated_at
    BEFORE UPDATE ON protocolo_etapas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para registrar histórico automático
CREATE OR REPLACE FUNCTION trigger_protocolo_historico()
RETURNS TRIGGER AS $$
DECLARE
    acao_realizada TEXT;
    dados_antigos JSONB;
    dados_novos JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        acao_realizada := 'criado';
        dados_novos := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        acao_realizada := 'atualizado';
        dados_antigos := to_jsonb(OLD);
        dados_novos := to_jsonb(NEW);
        
        -- Ação específica para mudança de status
        IF OLD.status != NEW.status THEN
            acao_realizada := 'status_alterado';
        END IF;
    END IF;
    
    INSERT INTO protocolos_historico (
        protocolo_id,
        acao,
        status_anterior,
        status_novo,
        responsavel_anterior_id,
        responsavel_novo_id,
        dados_anteriores,
        dados_novos,
        usuario_id,
        usuario_nome
    ) VALUES (
        COALESCE(NEW.id, OLD.id),
        acao_realizada,
        CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN NEW.status ELSE NULL END,
        CASE WHEN TG_OP = 'UPDATE' THEN OLD.responsavel_atual_id ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN NEW.responsavel_atual_id ELSE NULL END,
        dados_antigos,
        dados_novos,
        auth.uid(), -- ID do usuário atual
        (SELECT nome_completo FROM user_profiles WHERE id = auth.uid())
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protocolo_historico_trigger
    AFTER INSERT OR UPDATE ON protocolos
    FOR EACH ROW
    EXECUTE FUNCTION trigger_protocolo_historico();

-- =====================================================
-- 8. RLS (HABILITADO, POLICIES NO SCRIPT 08)
-- =====================================================

ALTER TABLE protocolos ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolo_etapas ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'SCRIPT 05 - SISTEMA DE PROTOCOLOS EXECUTADO COM SUCESSO' AS status;

-- Verificar tabelas criadas
SELECT 'TABELAS CRIADAS:' AS info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'protocolos',
    'protocolos_historico',
    'protocolos_comentarios',
    'protocolos_anexos',
    'protocolo_etapas'
)
ORDER BY table_name;

-- Verificar triggers criados
SELECT 'TRIGGERS CRIADOS:' AS info;
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table IN ('protocolos', 'protocolos_comentarios', 'protocolo_etapas')
ORDER BY event_object_table, trigger_name;