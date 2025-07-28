-- =============================================================================
-- 06_SISTEMA_NOTIFICACOES.SQL
-- =============================================================================
-- Cria tabelas do sistema de notificações
-- Execute DEPOIS do script 05
-- =============================================================================

-- =====================================================
-- 1. TABELA PRINCIPAL DE NOTIFICAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Destinatário
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Conteúdo da notificação
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo tipo_notificacao_enum DEFAULT 'info',
    
    -- Referências (para criar links)
    referencia_tipo TEXT, -- 'protocolo', 'servico', 'usuario', etc.
    referencia_id UUID,
    protocolo_id UUID REFERENCES protocolos(id) ON DELETE CASCADE,
    
    -- Dados adicionais em JSON
    dados_extras JSONB DEFAULT '{}'::jsonb,
    
    -- Configurações de apresentação
    icone TEXT,
    cor TEXT,
    url_acao TEXT, -- URL para onde direcionar quando clicado
    botao_acao TEXT, -- Texto do botão de ação
    
    -- Status de leitura
    lida BOOLEAN DEFAULT false,
    lida_em TIMESTAMP WITH TIME ZONE,
    
    -- Canais de entrega
    push_enviado BOOLEAN DEFAULT false,
    push_enviado_em TIMESTAMP WITH TIME ZONE,
    email_enviado BOOLEAN DEFAULT false,
    email_enviado_em TIMESTAMP WITH TIME ZONE,
    sms_enviado BOOLEAN DEFAULT false,
    sms_enviado_em TIMESTAMP WITH TIME ZONE,
    
    -- Agendamento e expiração
    agendada_para TIMESTAMP WITH TIME ZONE,
    expira_em TIMESTAMP WITH TIME ZONE,
    
    -- Controle de tentativas
    tentativas_push INTEGER DEFAULT 0,
    tentativas_email INTEGER DEFAULT 0,
    tentativas_sms INTEGER DEFAULT 0,
    
    -- Metadados
    origem TEXT DEFAULT 'sistema', -- 'sistema', 'usuario', 'webhook', 'cron'
    prioridade INTEGER DEFAULT 1, -- 1=baixa, 2=normal, 3=alta, 4=urgente
    categoria TEXT,
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentários
COMMENT ON TABLE notificacoes IS 'Sistema completo de notificações do DigiUrban';
COMMENT ON COLUMN notificacoes.referencia_tipo IS 'Tipo de entidade referenciada para criar links';
COMMENT ON COLUMN notificacoes.dados_extras IS 'Dados adicionais específicos da notificação';
COMMENT ON COLUMN notificacoes.url_acao IS 'URL para redirecionar quando a notificação é clicada';

-- =====================================================
-- 2. TABELA DE TEMPLATES DE NOTIFICAÇÃO
-- =====================================================

CREATE TABLE IF NOT EXISTS notificacao_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    
    -- Templates para diferentes canais
    template_web_titulo TEXT,
    template_web_mensagem TEXT,
    template_email_assunto TEXT,
    template_email_corpo TEXT,
    template_push_titulo TEXT,
    template_push_corpo TEXT,
    template_sms TEXT,
    
    -- Configurações
    tipo_padrao tipo_notificacao_enum DEFAULT 'info',
    icone_padrao TEXT,
    cor_padrao TEXT,
    
    -- Variáveis aceitas (para documentação)
    variaveis_aceitas TEXT[], -- ['{{nome_usuario}}', '{{numero_protocolo}}', etc.]
    
    -- Controle
    ativo BOOLEAN DEFAULT true,
    sistema BOOLEAN DEFAULT false, -- Templates do sistema não podem ser editados
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notificacao_templates IS 'Templates reutilizáveis para notificações';

-- =====================================================
-- 3. TABELA DE PREFERÊNCIAS DE NOTIFICAÇÃO
-- =====================================================

CREATE TABLE IF NOT EXISTS usuario_preferencias_notificacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Preferências por tipo
    protocolo_web BOOLEAN DEFAULT true,
    protocolo_email BOOLEAN DEFAULT true,
    protocolo_push BOOLEAN DEFAULT true,
    protocolo_sms BOOLEAN DEFAULT false,
    
    sistema_web BOOLEAN DEFAULT true,
    sistema_email BOOLEAN DEFAULT false,
    sistema_push BOOLEAN DEFAULT true,
    sistema_sms BOOLEAN DEFAULT false,
    
    promocional_web BOOLEAN DEFAULT true,
    promocional_email BOOLEAN DEFAULT false,
    promocional_push BOOLEAN DEFAULT false,
    promocional_sms BOOLEAN DEFAULT false,
    
    -- Horários permitidos
    horario_inicio TIME DEFAULT '08:00',
    horario_fim TIME DEFAULT '22:00',
    
    -- Dias da semana (0=domingo, 6=sábado)
    dias_semana INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6], -- Segunda a sábado
    
    -- Configurações avançadas
    agrupar_notificacoes BOOLEAN DEFAULT true,
    frequencia_resumo TEXT DEFAULT 'diario', -- 'tempo_real', 'diario', 'semanal'
    
    -- Contatos alternativos
    email_alternativo TEXT,
    telefone_alternativo TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(usuario_id)
);

COMMENT ON TABLE usuario_preferencias_notificacao IS 'Preferências de notificação por usuário';

-- =====================================================
-- 4. TABELA DE LOG DE ENTREGAS
-- =====================================================

CREATE TABLE IF NOT EXISTS notificacao_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notificacao_id UUID NOT NULL REFERENCES notificacoes(id) ON DELETE CASCADE,
    
    -- Detalhes da entrega
    canal TEXT NOT NULL, -- 'web', 'email', 'push', 'sms'
    status TEXT NOT NULL, -- 'enviado', 'entregue', 'lido', 'erro', 'rejeitado'
    
    -- Dados do envio
    destinatario TEXT, -- email, número de telefone, etc.
    provedor TEXT, -- Nome do provedor usado
    
    -- Resposta do provedor
    provider_id TEXT, -- ID retornado pelo provedor
    provider_response JSONB,
    
    -- Erro (se houver)
    erro_codigo TEXT,
    erro_mensagem TEXT,
    
    -- Timestamps
    enviado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    entregue_em TIMESTAMP WITH TIME ZONE,
    lido_em TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    user_agent TEXT,
    ip_address INET,
    dispositivo TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notificacao_logs IS 'Log detalhado de todas as entregas de notificação';

-- =====================================================
-- 5. TABELA DE NOTIFICAÇÕES EM LOTE
-- =====================================================

CREATE TABLE IF NOT EXISTS notificacao_lotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    
    -- Filtros para seleção de usuários
    filtros JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Template usado
    template_id UUID REFERENCES notificacao_templates(id),
    template_personalizado JSONB, -- Se não usar template pré-definido
    
    -- Status do envio
    status TEXT DEFAULT 'preparando', -- 'preparando', 'enviando', 'concluido', 'erro'
    
    -- Estatísticas
    total_destinatarios INTEGER DEFAULT 0,
    total_enviados INTEGER DEFAULT 0,
    total_entregues INTEGER DEFAULT 0,
    total_lidos INTEGER DEFAULT 0,
    total_erros INTEGER DEFAULT 0,
    
    -- Agendamento
    agendado_para TIMESTAMP WITH TIME ZONE,
    iniciado_em TIMESTAMP WITH TIME ZONE,
    concluido_em TIMESTAMP WITH TIME ZONE,
    
    -- Controle
    criado_por UUID REFERENCES auth.users(id),
    cancelado BOOLEAN DEFAULT false,
    cancelado_por UUID REFERENCES auth.users(id),
    cancelado_em TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notificacao_lotes IS 'Notificações em lote para múltiplos usuários';

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices principais na tabela notificacoes
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON notificacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_protocolo ON notificacoes(protocolo_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_referencia ON notificacoes(referencia_tipo, referencia_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_agendada ON notificacoes(agendada_para) WHERE agendada_para IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notificacoes_expira ON notificacoes(expira_em) WHERE expira_em IS NOT NULL;

-- Índice composto para consultas comuns
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario_lida ON notificacoes(usuario_id, lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario_tipo ON notificacoes(usuario_id, tipo);

-- Índices nas outras tabelas
CREATE INDEX IF NOT EXISTS idx_notificacao_templates_codigo ON notificacao_templates(codigo);
CREATE INDEX IF NOT EXISTS idx_notificacao_logs_notificacao ON notificacao_logs(notificacao_id);
CREATE INDEX IF NOT EXISTS idx_notificacao_logs_canal_status ON notificacao_logs(canal, status);
CREATE INDEX IF NOT EXISTS idx_notificacao_lotes_status ON notificacao_lotes(status);
CREATE INDEX IF NOT EXISTS idx_notificacao_lotes_agendado ON notificacao_lotes(agendado_para);

-- =====================================================
-- 7. TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE TRIGGER update_notificacoes_updated_at
    BEFORE UPDATE ON notificacoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notificacao_templates_updated_at
    BEFORE UPDATE ON notificacao_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuario_preferencias_notificacao_updated_at
    BEFORE UPDATE ON usuario_preferencias_notificacao
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notificacao_lotes_updated_at
    BEFORE UPDATE ON notificacao_lotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. FUNÇÕES ESPECÍFICAS PARA NOTIFICAÇÕES
-- =====================================================

-- Função para criar notificação a partir de template
CREATE OR REPLACE FUNCTION criar_notificacao_template(
    p_usuario_id UUID,
    p_template_codigo TEXT,
    p_variaveis JSONB DEFAULT '{}'::jsonb,
    p_protocolo_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    template_rec RECORD;
    titulo_final TEXT;
    mensagem_final TEXT;
    notificacao_id UUID;
    var_key TEXT;
    var_value TEXT;
BEGIN
    -- Buscar template
    SELECT * INTO template_rec 
    FROM notificacao_templates 
    WHERE codigo = p_template_codigo AND ativo = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template % não encontrado', p_template_codigo;
    END IF;
    
    -- Processar variáveis no título
    titulo_final := template_rec.template_web_titulo;
    mensagem_final := template_rec.template_web_mensagem;
    
    -- Substituir variáveis
    FOR var_key, var_value IN SELECT * FROM jsonb_each_text(p_variaveis)
    LOOP
        titulo_final := REPLACE(titulo_final, '{{' || var_key || '}}', var_value);
        mensagem_final := REPLACE(mensagem_final, '{{' || var_key || '}}', var_value);
    END LOOP;
    
    -- Criar notificação
    INSERT INTO notificacoes (
        usuario_id,
        titulo,
        mensagem,
        tipo,
        protocolo_id,
        icone,
        cor,
        dados_extras
    ) VALUES (
        p_usuario_id,
        titulo_final,
        mensagem_final,
        template_rec.tipo_padrao,
        p_protocolo_id,
        template_rec.icone_padrao,
        template_rec.cor_padrao,
        p_variaveis
    ) RETURNING id INTO notificacao_id;
    
    RETURN notificacao_id;
END;
$$ LANGUAGE plpgsql;

-- Função para marcar notificação como lida
CREATE OR REPLACE FUNCTION marcar_notificacao_lida(p_notificacao_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE notificacoes 
    SET lida = true, lida_em = CURRENT_TIMESTAMP
    WHERE id = p_notificacao_id AND lida = false;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função para obter contadores de notificações
CREATE OR REPLACE FUNCTION obter_contador_notificacoes(p_usuario_id UUID)
RETURNS TABLE(
    total_nao_lidas INTEGER,
    total_protocolos INTEGER,
    total_sistema INTEGER,
    mais_recente TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_nao_lidas,
        COUNT(*) FILTER (WHERE tipo = 'protocolo')::INTEGER as total_protocolos,
        COUNT(*) FILTER (WHERE tipo IN ('info', 'sucesso', 'aviso', 'erro'))::INTEGER as total_sistema,
        MAX(created_at) as mais_recente
    FROM notificacoes
    WHERE usuario_id = p_usuario_id 
    AND lida = false
    AND (expira_em IS NULL OR expira_em > CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Função para validar dias da semana
CREATE OR REPLACE FUNCTION validar_dias_semana(dias INTEGER[])
RETURNS BOOLEAN AS $$
DECLARE
    dia INTEGER;
BEGIN
    IF dias IS NULL OR array_length(dias, 1) = 0 THEN
        RETURN FALSE;
    END IF;
    
    FOREACH dia IN ARRAY dias
    LOOP
        IF dia < 0 OR dia > 6 THEN
            RETURN FALSE;
        END IF;
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. RLS (HABILITADO, POLICIES NO SCRIPT 08)
-- =====================================================

ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacao_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_preferencias_notificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacao_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacao_lotes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. CONSTRAINTS ADICIONAIS
-- =====================================================

-- Prioridade deve estar entre 1 e 4
ALTER TABLE notificacoes ADD CONSTRAINT check_prioridade_valida
    CHECK (prioridade BETWEEN 1 AND 4);

-- Se tem referência, deve ter tipo
ALTER TABLE notificacoes ADD CONSTRAINT check_referencia_completa
    CHECK ((referencia_tipo IS NULL AND referencia_id IS NULL) OR 
           (referencia_tipo IS NOT NULL AND referencia_id IS NOT NULL));

-- Horários válidos
ALTER TABLE usuario_preferencias_notificacao ADD CONSTRAINT check_horarios_validos
    CHECK (horario_fim > horario_inicio);

-- Dias da semana válidos (usando função de validação)
ALTER TABLE usuario_preferencias_notificacao ADD CONSTRAINT check_dias_semana_validos
    CHECK (validar_dias_semana(dias_semana));

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'SCRIPT 06 - SISTEMA DE NOTIFICAÇÕES EXECUTADO COM SUCESSO' AS status;

-- Verificar tabelas criadas
SELECT 'TABELAS CRIADAS:' AS info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'notificacoes',
    'notificacao_templates',
    'usuario_preferencias_notificacao',
    'notificacao_logs',
    'notificacao_lotes'
)
ORDER BY table_name;

-- Verificar funções criadas
SELECT 'FUNÇÕES CRIADAS:' AS info;
SELECT proname AS function_name 
FROM pg_proc 
WHERE proname IN (
    'criar_notificacao_template',
    'marcar_notificacao_lida',
    'obter_contador_notificacoes',
    'validar_dias_semana'
)
ORDER BY proname;