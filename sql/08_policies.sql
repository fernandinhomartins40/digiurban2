-- =====================================================
-- 08_policies.sql
-- Políticas de segurança (Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas principais
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE secretarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis_acesso ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocolos ENABLE ROW LEVEL SECURITY;
ALTER TABLE atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_acoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FUNÇÕES AUXILIARES PARA POLÍTICAS
-- =====================================================

-- Função para verificar se o usuário tem permissão específica
CREATE OR REPLACE FUNCTION user_has_permission(permission_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID := auth.uid();
    has_perm BOOLEAN := false;
BEGIN
    -- Se não há usuário autenticado
    IF user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Verificar permissão via perfil
    SELECT EXISTS(
        SELECT 1 
        FROM user_profiles up
        JOIN perfil_permissoes pp ON pp.perfil_id = up.perfil_acesso_id
        JOIN permissoes p ON p.id = pp.permissao_id
        WHERE up.id = user_id 
          AND p.codigo = permission_code 
          AND pp.concedida = true
          AND up.status = 'ativo'
    ) INTO has_perm;
    
    -- Se não tem via perfil, verificar permissão específica do usuário
    IF NOT has_perm THEN
        SELECT EXISTS(
            SELECT 1 
            FROM user_permissoes up
            JOIN permissoes p ON p.id = up.permissao_id
            WHERE up.user_id = user_id 
              AND p.codigo = permission_code 
              AND up.concedida = true
              AND (up.valido_ate IS NULL OR up.valido_ate > NOW())
        ) INTO has_perm;
    END IF;
    
    RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID := auth.uid();
BEGIN
    IF user_id IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS(
        SELECT 1 
        FROM user_profiles 
        WHERE id = user_id 
          AND tipo_usuario IN ('super_admin', 'admin')
          AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o usuário pertence à secretaria
CREATE OR REPLACE FUNCTION user_in_secretaria(secretaria_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID := auth.uid();
BEGIN
    IF user_id IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS(
        SELECT 1 
        FROM user_profiles 
        WHERE id = user_id 
          AND secretaria_id = secretaria_uuid
          AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o usuário pertence ao setor
CREATE OR REPLACE FUNCTION user_in_setor(setor_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID := auth.uid();
BEGIN
    IF user_id IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS(
        SELECT 1 
        FROM user_profiles 
        WHERE id = user_id 
          AND setor_id = setor_uuid
          AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o usuário é gestor (secretário, diretor, coordenador)
CREATE OR REPLACE FUNCTION is_gestor()
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID := auth.uid();
BEGIN
    IF user_id IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS(
        SELECT 1 
        FROM user_profiles 
        WHERE id = user_id 
          AND tipo_usuario IN ('super_admin', 'admin', 'secretario', 'diretor', 'coordenador')
          AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POLÍTICAS PARA USER_PROFILES
-- =====================================================

-- Visualizar: próprio perfil ou ser admin/gestor
CREATE POLICY "user_profiles_select_policy" ON user_profiles
    FOR SELECT USING (
        id = auth.uid() OR 
        is_admin() OR 
        user_has_permission('usuarios.visualizar')
    );

-- Atualizar: próprio perfil ou ter permissão
CREATE POLICY "user_profiles_update_policy" ON user_profiles
    FOR UPDATE USING (
        id = auth.uid() OR 
        user_has_permission('usuarios.editar')
    );

-- Inserir: apenas admins ou com permissão
CREATE POLICY "user_profiles_insert_policy" ON user_profiles
    FOR INSERT WITH CHECK (
        user_has_permission('usuarios.criar')
    );

-- =====================================================
-- POLÍTICAS PARA PROTOCOLOS
-- =====================================================

-- Visualizar: próprios protocolos, da mesma secretaria/setor, ou ser gestor
CREATE POLICY "protocolos_select_policy" ON protocolos
    FOR SELECT USING (
        solicitante_id = auth.uid() OR
        responsavel_id = auth.uid() OR
        is_admin() OR
        user_in_secretaria(secretaria_id) OR
        user_in_setor(setor_id) OR
        user_has_permission('protocolos.visualizar_todos')
    );

-- Atualizar: responsável, da mesma secretaria/setor, ou gestor
CREATE POLICY "protocolos_update_policy" ON protocolos
    FOR UPDATE USING (
        responsavel_id = auth.uid() OR
        is_gestor() OR
        user_in_secretaria(secretaria_id) OR
        user_has_permission('protocolos.editar')
    );

-- Inserir: qualquer usuário autenticado pode criar
CREATE POLICY "protocolos_insert_policy" ON protocolos
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- POLÍTICAS PARA ATENDIMENTOS
-- =====================================================

-- Visualizar: solicitante, responsáveis, da mesma secretaria/setor
CREATE POLICY "atendimentos_select_policy" ON atendimentos
    FOR SELECT USING (
        solicitante_id = auth.uid() OR
        atendente_id = auth.uid() OR
        responsavel_atual_id = auth.uid() OR
        is_admin() OR
        user_in_secretaria(secretaria_id) OR
        user_in_setor(setor_id) OR
        user_has_permission('atendimentos.visualizar_todos')
    );

-- Atualizar: atendente, responsável, ou da mesma secretaria/setor
CREATE POLICY "atendimentos_update_policy" ON atendimentos
    FOR UPDATE USING (
        atendente_id = auth.uid() OR
        responsavel_atual_id = auth.uid() OR
        is_gestor() OR
        user_in_secretaria(secretaria_id) OR
        user_has_permission('atendimentos.editar')
    );

-- Inserir: funcionários com permissão
CREATE POLICY "atendimentos_insert_policy" ON atendimentos
    FOR INSERT WITH CHECK (
        user_has_permission('atendimentos.criar') OR
        is_gestor()
    );

-- =====================================================
-- POLÍTICAS PARA ANEXOS
-- =====================================================

-- Visualizar: baseado na referência
CREATE POLICY "anexos_select_policy" ON anexos
    FOR SELECT USING (
        created_by = auth.uid() OR
        is_admin() OR
        user_has_permission('anexos.visualizar') OR
        -- Verifica se tem acesso ao objeto pai
        CASE 
            WHEN referencia_tabela = 'protocolos' THEN
                EXISTS(SELECT 1 FROM protocolos p WHERE p.id = referencia_id AND (
                    p.solicitante_id = auth.uid() OR
                    p.responsavel_id = auth.uid() OR
                    user_in_secretaria(p.secretaria_id)
                ))
            WHEN referencia_tabela = 'atendimentos' THEN
                EXISTS(SELECT 1 FROM atendimentos a WHERE a.id = referencia_id AND (
                    a.solicitante_id = auth.uid() OR
                    a.responsavel_atual_id = auth.uid() OR
                    user_in_secretaria(a.secretaria_id)
                ))
            ELSE true
        END
    );

-- =====================================================
-- POLÍTICAS PARA NOTIFICAÇÕES
-- =====================================================

-- Visualizar: apenas próprias notificações
CREATE POLICY "notificacoes_select_policy" ON notificacoes
    FOR SELECT USING (
        usuario_id = auth.uid() OR
        is_admin()
    );

-- Atualizar: apenas próprias notificações (para marcar como lida)
CREATE POLICY "notificacoes_update_policy" ON notificacoes
    FOR UPDATE USING (
        usuario_id = auth.uid()
    );

-- =====================================================
-- POLÍTICAS PARA ALERTAS
-- =====================================================

-- Visualizar: baseado no destinatário
CREATE POLICY "alertas_select_policy" ON alertas
    FOR SELECT USING (
        ativo = true AND
        (data_inicio IS NULL OR data_inicio <= NOW()) AND
        (data_fim IS NULL OR data_fim >= NOW()) AND
        (
            destinatario_tipo = 'todos' OR
            is_admin() OR
            CASE 
                WHEN destinatario_tipo = 'usuario' THEN destinatario_id::text = auth.uid()::text
                WHEN destinatario_tipo = 'secretaria' THEN user_in_secretaria(destinatario_id)
                WHEN destinatario_tipo = 'setor' THEN user_in_setor(destinatario_id)
                WHEN destinatario_tipo = 'perfil' THEN EXISTS(
                    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND perfil_acesso_id = destinatario_id
                )
                ELSE false
            END
        )
    );

-- =====================================================
-- POLÍTICAS PARA CHATS
-- =====================================================

-- Visualizar: apenas chats onde é participante
CREATE POLICY "chats_select_policy" ON chats
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM chat_participantes cp 
            WHERE cp.chat_id = id 
              AND cp.usuario_id = auth.uid() 
              AND cp.ativo = true
        ) OR is_admin()
    );

-- =====================================================
-- POLÍTICAS PARA MENSAGENS
-- =====================================================

-- Visualizar: mensagens dos chats onde participa
CREATE POLICY "mensagens_select_policy" ON mensagens
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM chat_participantes cp 
            WHERE cp.chat_id = mensagens.chat_id 
              AND cp.usuario_id = auth.uid() 
              AND cp.ativo = true
        ) OR is_admin()
    );

-- Inserir: apenas em chats onde participa
CREATE POLICY "mensagens_insert_policy" ON mensagens
    FOR INSERT WITH CHECK (
        EXISTS(
            SELECT 1 FROM chat_participantes cp 
            WHERE cp.chat_id = mensagens.chat_id 
              AND cp.usuario_id = auth.uid() 
              AND cp.ativo = true
        )
    );

-- =====================================================
-- POLÍTICAS PARA SECRETARIAS E SETORES
-- =====================================================

-- Visualizar secretarias: todos podem ver (dados básicos)
CREATE POLICY "secretarias_select_policy" ON secretarias
    FOR SELECT USING (ativo = true);

-- Atualizar: apenas admins ou responsáveis
CREATE POLICY "secretarias_update_policy" ON secretarias
    FOR UPDATE USING (
        is_admin() OR
        responsavel_id = auth.uid() OR
        user_has_permission('secretarias.editar')
    );

-- Visualizar setores: todos podem ver setores ativos
CREATE POLICY "setores_select_policy" ON setores
    FOR SELECT USING (ativo = true);

-- Atualizar: admins, responsáveis da secretaria ou do setor
CREATE POLICY "setores_update_policy" ON setores
    FOR UPDATE USING (
        is_admin() OR
        responsavel_id = auth.uid() OR
        EXISTS(SELECT 1 FROM secretarias s WHERE s.id = secretaria_id AND s.responsavel_id = auth.uid()) OR
        user_has_permission('setores.editar')
    );

-- =====================================================
-- POLÍTICAS PARA HISTÓRICO
-- =====================================================

-- Visualizar: baseado na referência e permissões
CREATE POLICY "historico_acoes_select_policy" ON historico_acoes
    FOR SELECT USING (
        usuario_id = auth.uid() OR
        is_admin() OR
        user_has_permission('historico.visualizar')
    );

-- Inserir: sistema automaticamente
CREATE POLICY "historico_acoes_insert_policy" ON historico_acoes
    FOR INSERT WITH CHECK (true); -- Será controlado pela aplicação

-- =====================================================
-- POLÍTICAS PARA COMENTÁRIOS
-- =====================================================

-- Visualizar: baseado na referência e se é interno
CREATE POLICY "comentarios_select_policy" ON comentarios
    FOR SELECT USING (
        autor_id = auth.uid() OR
        (NOT interno) OR
        is_gestor() OR
        user_has_permission('comentarios.visualizar_internos')
    );

-- Inserir: usuários autenticados
CREATE POLICY "comentarios_insert_policy" ON comentarios
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);