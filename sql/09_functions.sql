-- =====================================================
-- 09_functions.sql
-- Funções utilitárias e triggers do sistema
-- =====================================================

-- =====================================================
-- FUNÇÕES DE RELATÓRIOS E ESTATÍSTICAS
-- =====================================================

-- Função para obter estatísticas de atendimentos
CREATE OR REPLACE FUNCTION get_atendimentos_stats(
    p_data_inicio DATE DEFAULT NULL,
    p_data_fim DATE DEFAULT NULL,
    p_secretaria_id UUID DEFAULT NULL
)
RETURNS TABLE(
    total_atendimentos BIGINT,
    abertos BIGINT,
    em_andamento BIGINT,
    resolvidos BIGINT,
    fechados BIGINT,
    tempo_medio_resposta INTERVAL,
    tempo_medio_resolucao INTERVAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_atendimentos,
        COUNT(*) FILTER (WHERE status = 'aberto') as abertos,
        COUNT(*) FILTER (WHERE status = 'em_andamento') as em_andamento,
        COUNT(*) FILTER (WHERE status = 'resolvido') as resolvidos,
        COUNT(*) FILTER (WHERE status = 'fechado') as fechados,
        AVG(data_primeira_resposta - created_at) FILTER (WHERE data_primeira_resposta IS NOT NULL) as tempo_medio_resposta,
        AVG(data_resolucao - created_at) FILTER (WHERE data_resolucao IS NOT NULL) as tempo_medio_resolucao
    FROM atendimentos a
    WHERE (p_data_inicio IS NULL OR a.created_at::date >= p_data_inicio)
      AND (p_data_fim IS NULL OR a.created_at::date <= p_data_fim)
      AND (p_secretaria_id IS NULL OR a.secretaria_id = p_secretaria_id);
END;
$$ LANGUAGE plpgsql;

-- Função para obter ranking de atendentes
CREATE OR REPLACE FUNCTION get_ranking_atendentes(
    p_data_inicio DATE DEFAULT NULL,
    p_data_fim DATE DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    atendente_id UUID,
    atendente_nome VARCHAR,
    total_atendimentos BIGINT,
    resolvidos BIGINT,
    tempo_medio_resolucao INTERVAL,
    nota_media DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id as atendente_id,
        up.nome_completo as atendente_nome,
        COUNT(a.id) as total_atendimentos,
        COUNT(a.id) FILTER (WHERE a.status IN ('resolvido', 'fechado')) as resolvidos,
        AVG(a.data_resolucao - a.created_at) FILTER (WHERE a.data_resolucao IS NOT NULL) as tempo_medio_resolucao,
        AVG(a.nota_avaliacao) FILTER (WHERE a.nota_avaliacao IS NOT NULL) as nota_media
    FROM user_profiles up
    LEFT JOIN atendimentos a ON a.atendente_id = up.id
    WHERE up.tipo_usuario IN ('atendente', 'funcionario', 'coordenador')
      AND (p_data_inicio IS NULL OR a.created_at::date >= p_data_inicio)
      AND (p_data_fim IS NULL OR a.created_at::date <= p_data_fim)
    GROUP BY up.id, up.nome_completo
    HAVING COUNT(a.id) > 0
    ORDER BY resolvidos DESC, nota_media DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÕES DE WORKFLOW
-- =====================================================

-- Função para encaminhar atendimento
CREATE OR REPLACE FUNCTION encaminhar_atendimento(
    p_atendimento_id UUID,
    p_secretaria_destino_id UUID,
    p_setor_destino_id UUID DEFAULT NULL,
    p_usuario_destino_id UUID DEFAULT NULL,
    p_motivo TEXT DEFAULT '',
    p_urgente BOOLEAN DEFAULT false,
    p_prazo_horas INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_encaminhamento_id UUID;
    v_user_id UUID := auth.uid();
    v_user_profile RECORD;
BEGIN
    -- Verificar se o usuário tem permissão
    SELECT * INTO v_user_profile FROM user_profiles WHERE id = v_user_id;
    
    IF v_user_profile IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado';
    END IF;
    
    -- Criar o encaminhamento
    INSERT INTO atendimento_encaminhamentos (
        atendimento_id,
        secretaria_origem_id,
        setor_origem_id,
        usuario_origem_id,
        secretaria_destino_id,
        setor_destino_id,
        usuario_destino_id,
        motivo,
        urgente,
        prazo_resposta,
        created_by
    ) VALUES (
        p_atendimento_id,
        v_user_profile.secretaria_id,
        v_user_profile.setor_id,
        v_user_id,
        p_secretaria_destino_id,
        p_setor_destino_id,
        p_usuario_destino_id,
        p_motivo,
        p_urgente,
        CASE WHEN p_prazo_horas IS NOT NULL THEN NOW() + (p_prazo_horas || ' hours')::INTERVAL ELSE NULL END,
        v_user_id
    ) RETURNING id INTO v_encaminhamento_id;
    
    -- Atualizar o atendimento
    UPDATE atendimentos 
    SET 
        secretaria_id = p_secretaria_destino_id,
        setor_id = p_setor_destino_id,
        responsavel_atual_id = p_usuario_destino_id,
        status = 'em_andamento',
        updated_at = NOW()
    WHERE id = p_atendimento_id;
    
    -- Registrar no histórico
    INSERT INTO historico_acoes (
        referencia_tabela,
        referencia_id,
        acao,
        descricao,
        usuario_id,
        usuario_nome
    ) VALUES (
        'atendimentos',
        p_atendimento_id,
        'encaminhado',
        format('Atendimento encaminhado para %s. Motivo: %s', 
            (SELECT nome FROM secretarias WHERE id = p_secretaria_destino_id),
            p_motivo
        ),
        v_user_id,
        v_user_profile.nome_completo
    );
    
    RETURN v_encaminhamento_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para responder atendimento
CREATE OR REPLACE FUNCTION responder_atendimento(
    p_atendimento_id UUID,
    p_resposta TEXT,
    p_tipo_resposta VARCHAR DEFAULT 'oficial',
    p_resolver BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
    v_resposta_id UUID;
    v_user_id UUID := auth.uid();
    v_user_profile RECORD;
BEGIN
    SELECT * INTO v_user_profile FROM user_profiles WHERE id = v_user_id;
    
    -- Criar a resposta
    INSERT INTO atendimento_respostas (
        atendimento_id,
        resposta,
        tipo_resposta,
        autor_id,
        autor_nome,
        autor_cargo,
        created_by
    ) VALUES (
        p_atendimento_id,
        p_resposta,
        p_tipo_resposta,
        v_user_id,
        v_user_profile.nome_completo,
        v_user_profile.cargo,
        v_user_id
    ) RETURNING id INTO v_resposta_id;
    
    -- Se deve resolver o atendimento
    IF p_resolver THEN
        UPDATE atendimentos 
        SET 
            status = 'resolvido',
            data_resolucao = NOW(),
            updated_at = NOW()
        WHERE id = p_atendimento_id;
        
        -- Registrar no histórico
        INSERT INTO historico_acoes (
            referencia_tabela,
            referencia_id,
            acao,
            descricao,
            usuario_id,
            usuario_nome
        ) VALUES (
            'atendimentos',
            p_atendimento_id,
            'resolvido',
            'Atendimento marcado como resolvido',
            v_user_id,
            v_user_profile.nome_completo
        );
    END IF;
    
    RETURN v_resposta_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÕES DE NOTIFICAÇÃO
-- =====================================================

-- Função para criar notificação
CREATE OR REPLACE FUNCTION criar_notificacao(
    p_usuario_id UUID,
    p_titulo VARCHAR,
    p_mensagem TEXT,
    p_tipo tipo_notificacao DEFAULT 'sistema',
    p_referencia_tabela VARCHAR DEFAULT NULL,
    p_referencia_id UUID DEFAULT NULL,
    p_push BOOLEAN DEFAULT false,
    p_email BOOLEAN DEFAULT false,
    p_sms BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
    v_notificacao_id UUID;
BEGIN
    INSERT INTO notificacoes (
        usuario_id,
        titulo,
        mensagem,
        tipo,
        referencia_tabela,
        referencia_id,
        push_notification,
        email_notification,
        sms_notification
    ) VALUES (
        p_usuario_id,
        p_titulo,
        p_mensagem,
        p_tipo,
        p_referencia_tabela,
        p_referencia_id,
        p_push,
        p_email,
        p_sms
    ) RETURNING id INTO v_notificacao_id;
    
    RETURN v_notificacao_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS PARA NOTIFICAÇÕES AUTOMÁTICAS
-- =====================================================

-- Trigger para notificar novo atendimento
CREATE OR REPLACE FUNCTION trigger_notificar_novo_atendimento()
RETURNS TRIGGER AS $$
DECLARE
    v_responsavel RECORD;
BEGIN
    -- Notificar responsável da secretaria se definido
    IF NEW.responsavel_atual_id IS NOT NULL THEN
        PERFORM criar_notificacao(
            NEW.responsavel_atual_id,
            'Novo Atendimento',
            format('Você recebeu um novo atendimento: %s', NEW.titulo),
            'atendimento',
            'atendimentos',
            NEW.id,
            true,
            true,
            false
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notificar_novo_atendimento
    AFTER INSERT ON atendimentos
    FOR EACH ROW EXECUTE FUNCTION trigger_notificar_novo_atendimento();

-- Trigger para notificar encaminhamento
CREATE OR REPLACE FUNCTION trigger_notificar_encaminhamento()
RETURNS TRIGGER AS $$
BEGIN
    -- Notificar usuário de destino se especificado
    IF NEW.usuario_destino_id IS NOT NULL THEN
        PERFORM criar_notificacao(
            NEW.usuario_destino_id,
            'Atendimento Encaminhado',
            format('Um atendimento foi encaminhado para você. Motivo: %s', NEW.motivo),
            'atendimento',
            'atendimentos',
            NEW.atendimento_id,
            true,
            true,
            NEW.urgente
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notificar_encaminhamento
    AFTER INSERT ON atendimento_encaminhamentos
    FOR EACH ROW EXECUTE FUNCTION trigger_notificar_encaminhamento();

-- =====================================================
-- FUNÇÕES DE LIMPEZA E MANUTENÇÃO
-- =====================================================

-- Função para limpar notificações antigas
CREATE OR REPLACE FUNCTION limpar_notificacoes_antigas(dias INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    v_deletadas INTEGER;
BEGIN
    DELETE FROM notificacoes 
    WHERE created_at < NOW() - (dias || ' days')::INTERVAL
      AND status = 'lida'
      AND expires_at IS NULL;
    
    GET DIAGNOSTICS v_deletadas = ROW_COUNT;
    
    RETURN v_deletadas;
END;
$$ LANGUAGE plpgsql;

-- Função para arquivar atendimentos antigos
CREATE OR REPLACE FUNCTION arquivar_atendimentos_antigos(dias INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    v_arquivados INTEGER;
BEGIN
    -- Esta função pode ser implementada para mover atendimentos antigos
    -- para uma tabela de arquivo
    
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO PARA VERIFICAR PRAZOS VENCIDOS
-- =====================================================

CREATE OR REPLACE FUNCTION verificar_prazos_vencidos()
RETURNS TABLE(
    atendimento_id UUID,
    numero_atendimento VARCHAR,
    titulo VARCHAR,
    dias_atraso INTEGER,
    responsavel_id UUID,
    responsavel_nome VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id as atendimento_id,
        a.numero_atendimento,
        a.titulo,
        EXTRACT(days FROM NOW() - a.prazo_resolucao)::INTEGER as dias_atraso,
        a.responsavel_atual_id as responsavel_id,
        up.nome_completo as responsavel_nome
    FROM atendimentos a
    LEFT JOIN user_profiles up ON up.id = a.responsavel_atual_id
    WHERE a.status IN ('aberto', 'em_andamento')
      AND a.prazo_resolucao IS NOT NULL
      AND a.prazo_resolucao < NOW()
    ORDER BY dias_atraso DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS DO DASHBOARD
-- =====================================================

CREATE OR REPLACE FUNCTION get_dashboard_stats(p_usuario_id UUID)
RETURNS JSON AS $$
DECLARE
    v_stats JSON;
    v_user_profile RECORD;
BEGIN
    SELECT * INTO v_user_profile FROM user_profiles WHERE id = p_usuario_id;
    
    WITH stats AS (
        SELECT 
            -- Atendimentos
            COUNT(*) FILTER (WHERE referencia_tabela = 'atendimentos') as total_atendimentos,
            COUNT(*) FILTER (WHERE referencia_tabela = 'atendimentos' AND created_at >= CURRENT_DATE) as atendimentos_hoje,
            
            -- Protocolos
            COUNT(*) FILTER (WHERE referencia_tabela = 'protocolos') as total_protocolos,
            COUNT(*) FILTER (WHERE referencia_tabela = 'protocolos' AND created_at >= CURRENT_DATE) as protocolos_hoje,
            
            -- Notificações não lidas
            (SELECT COUNT(*) FROM notificacoes WHERE usuario_id = p_usuario_id AND status = 'pendente') as notificacoes_nao_lidas,
            
            -- Mensagens não lidas
            (SELECT COALESCE(SUM(nao_lidas), 0) FROM get_mensagens_nao_lidas(p_usuario_id)) as mensagens_nao_lidas
            
        FROM historico_acoes
        WHERE usuario_id = p_usuario_id
          AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    )
    SELECT json_build_object(
        'total_atendimentos', total_atendimentos,
        'atendimentos_hoje', atendimentos_hoje,
        'total_protocolos', total_protocolos,
        'protocolos_hoje', protocolos_hoje,
        'notificacoes_nao_lidas', notificacoes_nao_lidas,
        'mensagens_nao_lidas', mensagens_nao_lidas,
        'usuario_tipo', v_user_profile.tipo_usuario,
        'secretaria_nome', (SELECT nome FROM secretarias WHERE id = v_user_profile.secretaria_id)
    ) INTO v_stats
    FROM stats;
    
    RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;