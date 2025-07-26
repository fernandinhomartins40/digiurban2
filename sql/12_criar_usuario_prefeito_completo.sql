-- =====================================================
-- 12_criar_usuario_prefeito_completo.sql
-- Configurar usuário "prefeito" (deve ser criado manualmente primeiro)
-- =====================================================

-- ⚠️  INSTRUÇÕES IMPORTANTES:
-- 1. Crie o usuário MANUALMENTE no painel Supabase primeiro:
--    - Vá em Authentication > Users > Add User
--    - Email: prefeito@municipio.gov.br
--    - Senha: Prefeito@2024 (ou sua escolha)
--    - Marque "Auto Confirm User"
-- 2. Depois execute este script para dar as permissões

-- =====================================================
-- CONFIGURAÇÃO DO USUÁRIO PREFEITO
-- =====================================================

DO $$
DECLARE
    usuario_email TEXT := 'prefeito@municipio.gov.br'; -- ALTERE SE NECESSÁRIO
    usuario_nome TEXT := 'Prefeito Municipal';
    usuario_uuid UUID;
BEGIN
    RAISE NOTICE '=== CONFIGURANDO USUÁRIO PREFEITO ===';
    RAISE NOTICE 'Buscando usuário: %', usuario_email;
    
    -- Buscar usuário existente
    SELECT id INTO usuario_uuid FROM auth.users WHERE email = usuario_email;
    
    IF usuario_uuid IS NULL THEN
        RAISE NOTICE '❌ ERRO: Usuário % não encontrado!', usuario_email;
        RAISE NOTICE '';
        RAISE NOTICE '📋 INSTRUÇÕES:';
        RAISE NOTICE '1. Vá no painel Supabase > Authentication > Users';
        RAISE NOTICE '2. Clique em "Add User"';
        RAISE NOTICE '3. Email: %', usuario_email;
        RAISE NOTICE '4. Senha: Prefeito@2024 (ou sua escolha)';
        RAISE NOTICE '5. Marque "Auto Confirm User"';
        RAISE NOTICE '6. Execute este script novamente';
        RAISE NOTICE '';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Usuário encontrado! UUID: %', usuario_uuid;
    
    -- Criar perfil específico para prefeito se não existir
    INSERT INTO perfis_acesso (nome, descricao, tipo_usuario, nivel_hierarquico)
    VALUES ('Prefeito Municipal', 'Chefe do Executivo Municipal - Acesso Total', 'super_admin', 0)
    ON CONFLICT (nome) DO NOTHING;
    
    -- Adicionar todas as permissões ao perfil
    INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
    SELECT 
        (SELECT id FROM perfis_acesso WHERE nome = 'Prefeito Municipal'),
        p.id,
        true
    FROM permissoes p
    ON CONFLICT (perfil_id, permissao_id) DO UPDATE SET concedida = true;
    
    -- Criar/atualizar perfil do usuário
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
        usuario_nome,
        'super_admin',
        (SELECT id FROM perfis_acesso WHERE nome = 'Prefeito Municipal'),
        (SELECT id FROM secretarias WHERE codigo = 'GAB'),
        'Prefeito',
        'ativo',
        false
    )
    ON CONFLICT (id) DO UPDATE SET
        nome_completo = usuario_nome,
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
    
    RAISE NOTICE '=== USUÁRIO PREFEITO CRIADO COM SUCESSO ===';
    RAISE NOTICE 'UUID: %', usuario_uuid;
    RAISE NOTICE 'Email: %', usuario_email;
    RAISE NOTICE 'Senha: %', usuario_senha;
    RAISE NOTICE 'Status: Ativo com acesso total';
    RAISE NOTICE '=========================================';
    
END $$;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 
    '✅ VERIFICAÇÃO: Usuário Prefeito Criado' as status,
    up.nome_completo,
    up.email,
    up.tipo_usuario,
    pa.nome as perfil_nome,
    s.nome as secretaria_nome,
    up.cargo,
    up.status,
    COUNT(pp.permissao_id) as total_permissoes,
    CASE 
        WHEN s.responsavel_id = up.id THEN '✅ SIM' 
        ELSE '❌ NÃO' 
    END as responsavel_gabinete
FROM user_profiles up
LEFT JOIN perfis_acesso pa ON pa.id = up.perfil_acesso_id
LEFT JOIN secretarias s ON s.id = up.secretaria_id
LEFT JOIN perfil_permissoes pp ON pp.perfil_id = up.perfil_acesso_id AND pp.concedida = true
WHERE up.email = 'prefeito@municipio.gov.br'
GROUP BY up.id, up.nome_completo, up.email, up.tipo_usuario, pa.nome, s.nome, up.cargo, up.status, s.responsavel_id;

-- =====================================================
-- INSTRUÇÕES DE LOGIN
-- =====================================================

/*
🔐 CREDENCIAIS SUGERIDAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: prefeito@municipio.gov.br
Senha: Prefeito@2024

📋 PROCESSO COMPLETO:
1. Criar usuário manualmente no painel Supabase
2. Executar este script para dar permissões
3. Fazer login com as credenciais criadas

⚠️  IMPORTANTE:
- Usuário deve ser criado MANUALMENTE primeiro
- Este script apenas configura permissões
- Usuário terá ACESSO TOTAL ao sistema
- Altere a senha no primeiro acesso
*/