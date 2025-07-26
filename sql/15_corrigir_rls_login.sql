-- =====================================================
-- 15_corrigir_rls_login.sql
-- CORRIGIR PROBLEMAS DE RLS PARA LOGIN
-- =====================================================

-- ⚠️ Execute este script para corrigir problemas de Row Level Security

-- =====================================================
-- 1. TEMPORARIAMENTE DESABILITAR RLS PARA TESTE
-- =====================================================

-- Desabilitar RLS temporariamente para testes de login
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE secretarias DISABLE ROW LEVEL SECURITY;
ALTER TABLE perfis_acesso DISABLE ROW LEVEL SECURITY;
ALTER TABLE permissoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE perfil_permissoes DISABLE ROW LEVEL SECURITY;

SELECT 'RLS temporariamente desabilitado para testes de login' as status;

-- =====================================================
-- 2. VERIFICAR SE O PROBLEMA PERSISTE
-- =====================================================

-- Agora teste o login novamente
-- Se funcionar, o problema era RLS
-- Se não funcionar, o problema é na configuração do cliente

-- =====================================================
-- 3. CRIAR POLICIES MAIS PERMISSIVAS (SE NECESSÁRIO)
-- =====================================================

-- Reabilitar RLS com policies mais permissivas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy para permitir leitura de perfis durante autenticação
CREATE POLICY "Permitir leitura de perfis para autenticação" ON user_profiles
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy para permitir leitura de secretarias
ALTER TABLE secretarias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura de secretarias" ON secretarias
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy para permitir leitura de perfis de acesso
ALTER TABLE perfis_acesso ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura de perfis de acesso" ON perfis_acesso
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy para permitir leitura de permissões
ALTER TABLE permissoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura de permissões" ON permissoes
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy para permitir leitura de perfil_permissões
ALTER TABLE perfil_permissoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura de perfil_permissões" ON perfil_permissoes
    FOR SELECT
    TO authenticated, anon
    USING (true);

SELECT 'Policies mais permissivas criadas' as status;

-- =====================================================
-- 4. VERIFICAÇÃO FINAL
-- =====================================================

-- Testar acesso às tabelas
SELECT 
    'Teste final de acesso' as teste,
    COUNT(*) as total_user_profiles
FROM user_profiles;

SELECT 
    'Teste final de acesso' as teste,
    COUNT(*) as total_secretarias  
FROM secretarias;

SELECT 
    'Teste final de acesso' as teste,
    COUNT(*) as total_perfis_acesso
FROM perfis_acesso;

-- =====================================================
-- INSTRUÇÕES
-- =====================================================

/*
🎯 COMO USAR:

1. ▶️ EXECUTE ESTE SCRIPT COMPLETO
2. 🧪 TESTE O LOGIN NOVAMENTE
3. ✅ SE FUNCIONAR: O problema era RLS
4. ❌ SE NÃO FUNCIONAR: Problema é na configuração do cliente

🔧 SE O LOGIN FUNCIONAR APÓS ESTE SCRIPT:
- As policies antigas eram muito restritivas
- Use as novas policies mais permissivas
- O login agora deve funcionar normalmente

⚠️ SE AINDA NÃO FUNCIONAR:
- Verifique as variáveis de ambiente (.env)
- Confirme a URL e API Key do Supabase
- Verifique se o projeto Supabase está ativo
*/