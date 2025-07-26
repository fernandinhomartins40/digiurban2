-- =====================================================
-- 11_criar_usuario_prefeito.sql
-- Criar usuário "prefeito" com acesso total ao sistema
-- =====================================================

-- IMPORTANTE: Este script deve ser executado APÓS o usuário "prefeito" 
-- ter sido criado via Supabase Auth (registro normal no sistema)
-- Substitua 'USER_UUID_AQUI' pelo UUID real do usuário criado

-- =====================================================
-- CRIAR PERFIL ESPECÍFICO PARA O PREFEITO
-- =====================================================

-- Verificar se já existe um perfil específico para prefeito
INSERT INTO perfis_acesso (nome, descricao, tipo_usuario, nivel_hierarquico)
VALUES ('Prefeito Municipal', 'Chefe do Executivo Municipal - Acesso Total', 'super_admin', 0)
ON CONFLICT (nome) DO NOTHING;

-- =====================================================
-- ATUALIZAR PERFIL DO USUÁRIO PREFEITO
-- =====================================================

-- SUBSTITUA 'USER_UUID_AQUI' pelo UUID real do usuário prefeito
-- Exemplo: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

UPDATE user_profiles 
SET 
    nome_completo = 'Prefeito Municipal',
    tipo_usuario = 'super_admin',
    perfil_acesso_id = (SELECT id FROM perfis_acesso WHERE nome = 'Prefeito Municipal'),
    secretaria_id = (SELECT id FROM secretarias WHERE codigo = 'GAB'),
    cargo = 'Prefeito',
    status = 'ativo',
    primeiro_acesso = false
WHERE id = 'USER_UUID_AQUI'; -- SUBSTITUA PELO UUID REAL

-- =====================================================
-- GARANTIR TODAS AS PERMISSÕES PARA O PREFEITO
-- =====================================================

-- Adicionar todas as permissões ao perfil do prefeito
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE nome = 'Prefeito Municipal'),
    p.id,
    true
FROM permissoes p
ON CONFLICT (perfil_id, permissao_id) DO UPDATE SET concedida = true;

-- =====================================================
-- CONFIGURAR COMO RESPONSÁVEL DO GABINETE
-- =====================================================

-- Definir o prefeito como responsável do Gabinete
UPDATE secretarias 
SET responsavel_id = 'USER_UUID_AQUI' -- SUBSTITUA PELO UUID REAL
WHERE codigo = 'GAB';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Script para verificar se tudo foi configurado corretamente
-- Execute este SELECT para confirmar as configurações

SELECT 
    'Configuração do Usuário Prefeito' as verificacao,
    up.nome_completo,
    up.email,
    up.tipo_usuario,
    pa.nome as perfil_nome,
    s.nome as secretaria_nome,
    up.cargo,
    up.status,
    COUNT(pp.permissao_id) as total_permissoes
FROM user_profiles up
LEFT JOIN perfis_acesso pa ON pa.id = up.perfil_acesso_id
LEFT JOIN secretarias s ON s.id = up.secretaria_id
LEFT JOIN perfil_permissoes pp ON pp.perfil_id = up.perfil_acesso_id AND pp.concedida = true
WHERE up.id = 'USER_UUID_AQUI' -- SUBSTITUA PELO UUID REAL
GROUP BY up.nome_completo, up.email, up.tipo_usuario, pa.nome, s.nome, up.cargo, up.status;

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================

/*
COMO USAR ESTE SCRIPT:

1. Primeiro, crie o usuário "prefeito" via interface do Supabase ou registro normal
   Email sugerido: prefeito@municipio.gov.br

2. Copie o UUID do usuário criado (pode ser obtido na tabela auth.users)

3. Substitua TODAS as ocorrências de 'USER_UUID_AQUI' neste script pelo UUID real

4. Execute este script no editor SQL do Supabase

5. Execute o SELECT de verificação no final para confirmar

EXEMPLO de como encontrar o UUID:
SELECT id, email FROM auth.users WHERE email = 'prefeito@municipio.gov.br';

Depois substitua 'USER_UUID_AQUI' pelo ID retornado.
*/