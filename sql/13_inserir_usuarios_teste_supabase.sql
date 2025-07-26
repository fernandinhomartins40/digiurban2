-- =====================================================
-- 13_inserir_usuarios_teste_supabase.sql
-- INSERIR USUÁRIOS DE TESTE DIRETAMENTE NO SUPABASE
-- =====================================================

-- ⚠️  IMPORTANTE: Este script insere usuários diretamente na tabela auth.users
-- Execute este script no SQL Editor do Supabase Dashboard

-- =====================================================
-- INSERIR USUÁRIOS DE TESTE
-- =====================================================

DO $$
DECLARE
    prefeito_id UUID;
    chefe_gab_id UUID;
    sec_saude_id UUID;
    sec_edu_id UUID;
    dir_saude_id UUID;
    coord_edu_id UUID;
    func_saude_id UUID;
    func_assis_id UUID;
    atend_rec_id UUID;
    atend_saude_id UUID;
    cidadao1_id UUID;
    cidadao2_id UUID;
BEGIN
    RAISE NOTICE '🚀 CRIANDO USUÁRIOS DE TESTE...';
    
    -- =====================================================
    -- 1. PREFEITO (SUPER ADMIN)
    -- =====================================================
    
    prefeito_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        email_change_confirm_status,
        banned_until,
        email_change_token_current,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        confirmed_at,
        email_confirmed,
        phone_confirmed_at,
        phone_confirmed
    ) VALUES (
        prefeito_id,
        '00000000-0000-0000-0000-000000000000',
        'prefeito@municipio.gov.br',
        crypt('Prefeito@2024', gen_salt('bf')),
        now(),
        now(),
        now(),
        '',
        '',
        '',
        '',
        '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Prefeito Municipal"}',
        false,
        'authenticated',
        'authenticated',
        null,
        null,
        null,
        0,
        null,
        '',
        null,
        '',
        null,
        now(),
        true,
        null,
        false
    );
    
    -- =====================================================
    -- 2. CHEFE DE GABINETE (ADMIN)
    -- =====================================================
    
    chefe_gab_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        chefe_gab_id, '00000000-0000-0000-0000-000000000000', 'chefe.gabinete@municipio.gov.br',
        crypt('ChefGab@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Chefe de Gabinete"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 3. SECRETÁRIO DA SAÚDE
    -- =====================================================
    
    sec_saude_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        sec_saude_id, '00000000-0000-0000-0000-000000000000', 'secretario.saude@municipio.gov.br',
        crypt('SecSaude@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Secretário da Saúde"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 4. SECRETÁRIO DA EDUCAÇÃO
    -- =====================================================
    
    sec_edu_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        sec_edu_id, '00000000-0000-0000-0000-000000000000', 'secretario.educacao@municipio.gov.br',
        crypt('SecEdu@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Secretário da Educação"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 5. DIRETOR DE SAÚDE
    -- =====================================================
    
    dir_saude_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        dir_saude_id, '00000000-0000-0000-0000-000000000000', 'diretor.saude@municipio.gov.br',
        crypt('DirSaude@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Diretor de Saúde"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 6. COORDENADOR DE EDUCAÇÃO
    -- =====================================================
    
    coord_edu_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        coord_edu_id, '00000000-0000-0000-0000-000000000000', 'coord.educacao@municipio.gov.br',
        crypt('CoordEdu@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Coordenador de Educação"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 7. FUNCIONÁRIO DA SAÚDE
    -- =====================================================
    
    func_saude_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        func_saude_id, '00000000-0000-0000-0000-000000000000', 'funcionario.saude@municipio.gov.br',
        crypt('FuncSaude@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Funcionário da Saúde"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 8. FUNCIONÁRIO DA ASSISTÊNCIA SOCIAL
    -- =====================================================
    
    func_assis_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        func_assis_id, '00000000-0000-0000-0000-000000000000', 'funcionario.assistencia@municipio.gov.br',
        crypt('FuncAssis@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Funcionário da Assistência"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 9. ATENDENTE DA RECEPÇÃO
    -- =====================================================
    
    atend_rec_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        atend_rec_id, '00000000-0000-0000-0000-000000000000', 'atendente.recepcao@municipio.gov.br',
        crypt('AtendRec@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Atendente da Recepção"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 10. ATENDENTE DA SAÚDE
    -- =====================================================
    
    atend_saude_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        atend_saude_id, '00000000-0000-0000-0000-000000000000', 'atendente.saude@municipio.gov.br',
        crypt('AtendSaude@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Atendente da Saúde"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 11. CIDADÃO TESTE 1
    -- =====================================================
    
    cidadao1_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        cidadao1_id, '00000000-0000-0000-0000-000000000000', 'joao.silva@email.com',
        crypt('JoaoSilva@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "João Silva"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    -- =====================================================
    -- 12. CIDADÃO TESTE 2
    -- =====================================================
    
    cidadao2_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
        confirmation_sent_at, recovery_sent_at, email_change_sent_at, email_change_confirm_status,
        banned_until, email_change_token_current, phone_change, phone_change_token,
        phone_change_sent_at, confirmed_at, email_confirmed, phone_confirmed_at, phone_confirmed
    ) VALUES (
        cidadao2_id, '00000000-0000-0000-0000-000000000000', 'maria.santos@email.com',
        crypt('MariaSantos@2024', gen_salt('bf')), now(), now(), now(),
        '', '', '', '', '{"provider": "email", "providers": ["email"]}',
        '{"nome": "Maria Santos"}', false, 'authenticated', 'authenticated',
        null, null, null, 0, null, '', null, '', null, now(), true, null, false
    );
    
    RAISE NOTICE '✅ USUÁRIOS DE AUTENTICAÇÃO CRIADOS!';
    
    -- =====================================================
    -- CRIAR PERFIS DOS USUÁRIOS
    -- =====================================================
    
    RAISE NOTICE '👥 CRIANDO PERFIS DOS USUÁRIOS...';
    
    -- 1. Prefeito
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        prefeito_id, 'prefeito@municipio.gov.br', 'Prefeito Municipal', 'super_admin',
        (SELECT id FROM perfis_acesso WHERE nome = 'Super Administrador'),
        (SELECT id FROM secretarias WHERE codigo = 'GAB'),
        'Prefeito', 'ativo', false
    );
    
    -- 2. Chefe de Gabinete
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        chefe_gab_id, 'chefe.gabinete@municipio.gov.br', 'Chefe de Gabinete', 'admin',
        (SELECT id FROM perfis_acesso WHERE nome = 'Administrador'),
        (SELECT id FROM secretarias WHERE codigo = 'GAB'),
        'Chefe de Gabinete', 'ativo', false
    );
    
    -- 3. Secretário da Saúde
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        sec_saude_id, 'secretario.saude@municipio.gov.br', 'Secretário da Saúde', 'secretario',
        (SELECT id FROM perfis_acesso WHERE nome = 'Secretário'),
        (SELECT id FROM secretarias WHERE codigo = 'SAUDE'),
        'Secretário', 'ativo', false
    );
    
    -- 4. Secretário da Educação
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        sec_edu_id, 'secretario.educacao@municipio.gov.br', 'Secretário da Educação', 'secretario',
        (SELECT id FROM perfis_acesso WHERE nome = 'Secretário'),
        (SELECT id FROM secretarias WHERE codigo = 'EDUCACAO'),
        'Secretário', 'ativo', false
    );
    
    -- 5. Diretor de Saúde
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        dir_saude_id, 'diretor.saude@municipio.gov.br', 'Diretor de Saúde', 'diretor',
        (SELECT id FROM perfis_acesso WHERE nome = 'Diretor'),
        (SELECT id FROM secretarias WHERE codigo = 'SAUDE'),
        'Diretor', 'ativo', false
    );
    
    -- 6. Coordenador de Educação
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        coord_edu_id, 'coord.educacao@municipio.gov.br', 'Coordenador de Educação', 'coordenador',
        (SELECT id FROM perfis_acesso WHERE nome = 'Coordenador'),
        (SELECT id FROM secretarias WHERE codigo = 'EDUCACAO'),
        'Coordenador', 'ativo', false
    );
    
    -- 7. Funcionário da Saúde
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        func_saude_id, 'funcionario.saude@municipio.gov.br', 'Funcionário da Saúde', 'funcionario',
        (SELECT id FROM perfis_acesso WHERE nome = 'Funcionário'),
        (SELECT id FROM secretarias WHERE codigo = 'SAUDE'),
        'Funcionário', 'ativo', false
    );
    
    -- 8. Funcionário da Assistência
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        func_assis_id, 'funcionario.assistencia@municipio.gov.br', 'Funcionário da Assistência', 'funcionario',
        (SELECT id FROM perfis_acesso WHERE nome = 'Funcionário'),
        (SELECT id FROM secretarias WHERE codigo = 'ASSISTENCIA'),
        'Funcionário', 'ativo', false
    );
    
    -- 9. Atendente da Recepção
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        atend_rec_id, 'atendente.recepcao@municipio.gov.br', 'Atendente da Recepção', 'atendente',
        (SELECT id FROM perfis_acesso WHERE nome = 'Atendente'),
        (SELECT id FROM secretarias WHERE codigo = 'GAB'),
        'Atendente', 'ativo', false
    );
    
    -- 10. Atendente da Saúde
    INSERT INTO user_profiles (id, email, nome_completo, tipo_usuario, perfil_acesso_id, secretaria_id, cargo, status, primeiro_acesso)
    VALUES (
        atend_saude_id, 'atendente.saude@municipio.gov.br', 'Atendente da Saúde', 'atendente',
        (SELECT id FROM perfis_acesso WHERE nome = 'Atendente'),
        (SELECT id FROM secretarias WHERE codigo = 'SAUDE'),
        'Atendente', 'ativo', false
    );
    
    -- 11. Cidadão João Silva
    INSERT INTO user_profiles (id, email, nome_completo, cpf, telefone, tipo_usuario, perfil_acesso_id, status, primeiro_acesso)
    VALUES (
        cidadao1_id, 'joao.silva@email.com', 'João Silva', '12345678901', '(11) 99999-1111', 'cidadao',
        (SELECT id FROM perfis_acesso WHERE nome = 'Cidadão'),
        'ativo', false
    );
    
    -- 12. Cidadão Maria Santos
    INSERT INTO user_profiles (id, email, nome_completo, cpf, telefone, tipo_usuario, perfil_acesso_id, status, primeiro_acesso)
    VALUES (
        cidadao2_id, 'maria.santos@email.com', 'Maria Santos', '98765432100', '(11) 99999-2222', 'cidadao',
        (SELECT id FROM perfis_acesso WHERE nome = 'Cidadão'),
        'ativo', false
    );
    
    RAISE NOTICE '✅ PERFIS DE USUÁRIOS CRIADOS!';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 TODOS OS USUÁRIOS DE TESTE FORAM CRIADOS COM SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 CREDENCIAIS CRIADAS:';
    RAISE NOTICE '1. prefeito@municipio.gov.br / Prefeito@2024';
    RAISE NOTICE '2. chefe.gabinete@municipio.gov.br / ChefGab@2024';
    RAISE NOTICE '3. secretario.saude@municipio.gov.br / SecSaude@2024';
    RAISE NOTICE '4. secretario.educacao@municipio.gov.br / SecEdu@2024';
    RAISE NOTICE '5. diretor.saude@municipio.gov.br / DirSaude@2024';
    RAISE NOTICE '6. coord.educacao@municipio.gov.br / CoordEdu@2024';
    RAISE NOTICE '7. funcionario.saude@municipio.gov.br / FuncSaude@2024';
    RAISE NOTICE '8. funcionario.assistencia@municipio.gov.br / FuncAssis@2024';
    RAISE NOTICE '9. atendente.recepcao@municipio.gov.br / AtendRec@2024';
    RAISE NOTICE '10. atendente.saude@municipio.gov.br / AtendSaude@2024';
    RAISE NOTICE '11. joao.silva@email.com / JoaoSilva@2024';
    RAISE NOTICE '12. maria.santos@email.com / MariaSantos@2024';
    
END $$;

-- =====================================================
-- VERIFICAÇÃO DOS USUÁRIOS CRIADOS
-- =====================================================

SELECT 
    '✅ VERIFICAÇÃO: Usuários Criados' as status,
    up.nome_completo,
    up.email,
    up.tipo_usuario,
    pa.nome as perfil_nome,
    COALESCE(s.nome, 'N/A') as secretaria_nome,
    up.cargo,
    up.status
FROM user_profiles up
LEFT JOIN perfis_acesso pa ON pa.id = up.perfil_acesso_id
LEFT JOIN secretarias s ON s.id = up.secretaria_id
WHERE up.email IN (
    'prefeito@municipio.gov.br',
    'chefe.gabinete@municipio.gov.br',
    'secretario.saude@municipio.gov.br',
    'secretario.educacao@municipio.gov.br',
    'diretor.saude@municipio.gov.br',
    'coord.educacao@municipio.gov.br',
    'funcionario.saude@municipio.gov.br',
    'funcionario.assistencia@municipio.gov.br',
    'atendente.recepcao@municipio.gov.br',
    'atendente.saude@municipio.gov.br',
    'joao.silva@email.com',
    'maria.santos@email.com'
)
ORDER BY 
    CASE up.tipo_usuario
        WHEN 'super_admin' THEN 1
        WHEN 'admin' THEN 2
        WHEN 'secretario' THEN 3
        WHEN 'diretor' THEN 4
        WHEN 'coordenador' THEN 5
        WHEN 'funcionario' THEN 6
        WHEN 'atendente' THEN 7
        WHEN 'cidadao' THEN 8
    END;

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================

/*
🎯 COMO USAR ESTE SCRIPT:

1. 📝 COPIE TODO O CÓDIGO ACIMA
2. 🔗 ACESSE O SUPABASE DASHBOARD
3. 🛠️ VÁ EM "SQL Editor"
4. 📋 COLE O CÓDIGO COMPLETO
5. ▶️ CLIQUE EM "RUN"

⚠️ IMPORTANTE:
- Execute DEPOIS dos scripts de estrutura (01 a 11)
- Usuários serão criados com senhas criptografadas
- Todos os usuários estarão confirmados e ativos
- Use as credenciais do arquivo CREDENCIAIS_TESTE.md

🔐 CREDENCIAL PRINCIPAL:
Email: prefeito@municipio.gov.br
Senha: Prefeito@2024
Acesso: TOTAL

✅ PRONTO PARA TESTES!
*/