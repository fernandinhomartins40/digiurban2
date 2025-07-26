-- =====================================================
-- 11_criar_usuario_prefeito.sql
-- Criar usuário "prefeito" com acesso total ao sistema
-- =====================================================

-- INSTRUÇÕES:
-- 1. Primeiro execute a busca abaixo para encontrar o UUID do usuário prefeito
-- 2. Depois execute os comandos de configuração substituindo o UUID

-- =====================================================
-- PASSO 1: ENCONTRAR O UUID DO USUÁRIO PREFEITO
-- =====================================================

-- Execute esta consulta primeiro para encontrar o UUID:
-- SELECT id, email FROM auth.users WHERE email = 'prefeito@municipio.gov.br';
-- OU se o email for diferente:
-- SELECT id, email FROM auth.users WHERE email ILIKE '%prefeito%';

-- =====================================================
-- PASSO 2: CRIAR PERFIL ESPECÍFICO PARA O PREFEITO
-- =====================================================

-- Criar perfil específico (execute sempre)
INSERT INTO perfis_acesso (nome, descricao, tipo_usuario, nivel_hierarquico)
VALUES ('Prefeito Municipal', 'Chefe do Executivo Municipal - Acesso Total', 'super_admin', 0)
ON CONFLICT (nome) DO NOTHING;

-- Adicionar todas as permissões ao perfil do prefeito
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE nome = 'Prefeito Municipal'),
    p.id,
    true
FROM permissoes p
ON CONFLICT (perfil_id, permissao_id) DO UPDATE SET concedida = true;

-- =====================================================
-- PASSO 3: CONFIGURAR USUÁRIO ESPECÍFICO
-- =====================================================

-- IMPORTANTE: SUBSTITUA o email 'prefeito@municipio.gov.br' pelo email real do usuário
-- Este comando irá configurar o usuário baseado no email

DO $$
DECLARE
    usuario_email TEXT := 'prefeito@municipio.gov.br'; -- ALTERE ESTE EMAIL
    usuario_uuid UUID;
BEGIN
    -- Buscar o UUID do usuário pelo email
    SELECT au.id INTO usuario_uuid
    FROM auth.users au
    WHERE au.email = usuario_email;
    
    -- Verificar se o usuário foi encontrado
    IF usuario_uuid IS NULL THEN
        RAISE NOTICE 'ERRO: Usuário com email % não encontrado!', usuario_email;
        RAISE NOTICE 'Verifique se o usuário foi criado no Supabase Auth';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Configurando usuário: % (UUID: %)', usuario_email, usuario_uuid;
    
    -- Inserir ou atualizar o perfil do usuário
    INSERT INTO user_profiles (
        id,
        email,
        nome_completo,
        tipo_usuario,
        perfil_acesso_id,
        secretaria_id,
        cargo,
        status,
        primeiro_acesso
    ) VALUES (
        usuario_uuid,
        usuario_email,
        'Prefeito Municipal',
        'super_admin',
        (SELECT id FROM perfis_acesso WHERE nome = 'Prefeito Municipal'),
        (SELECT id FROM secretarias WHERE codigo = 'GAB'),
        'Prefeito',
        'ativo',
        false
    )
    ON CONFLICT (id) DO UPDATE SET
        nome_completo = 'Prefeito Municipal',
        tipo_usuario = 'super_admin',
        perfil_acesso_id = (SELECT id FROM perfis_acesso WHERE nome = 'Prefeito Municipal'),
        secretaria_id = (SELECT id FROM secretarias WHERE codigo = 'GAB'),
        cargo = 'Prefeito',
        status = 'ativo',
        primeiro_acesso = false;
    
    -- Definir como responsável do Gabinete
    UPDATE secretarias 
    SET responsavel_id = usuario_uuid
    WHERE codigo = 'GAB';
    
    RAISE NOTICE 'Usuário prefeito configurado com sucesso!';
    
END $$;

-- =====================================================
-- PASSO 4: VERIFICAÇÃO
-- =====================================================

-- Execute esta consulta para verificar se tudo foi configurado corretamente
SELECT 
    'VERIFICAÇÃO: Configuração do Usuário Prefeito' as status,
    up.nome_completo,
    up.email,
    up.tipo_usuario,
    pa.nome as perfil_nome,
    s.nome as secretaria_nome,
    up.cargo,
    up.status,
    COUNT(pp.permissao_id) as total_permissoes,
    CASE 
        WHEN s.responsavel_id = up.id THEN 'SIM' 
        ELSE 'NÃO' 
    END as responsavel_gabinete
FROM user_profiles up
LEFT JOIN perfis_acesso pa ON pa.id = up.perfil_acesso_id
LEFT JOIN secretarias s ON s.id = up.secretaria_id
LEFT JOIN perfil_permissoes pp ON pp.perfil_id = up.perfil_acesso_id AND pp.concedida = true
WHERE up.email = 'prefeito@municipio.gov.br' -- ALTERE ESTE EMAIL SE NECESSÁRIO
GROUP BY up.id, up.nome_completo, up.email, up.tipo_usuario, pa.nome, s.nome, up.cargo, up.status, s.responsavel_id;