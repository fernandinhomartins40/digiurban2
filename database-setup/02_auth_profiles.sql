-- =============================================================================
-- 02_AUTH_PROFILES.SQL - DigiUrban Database Setup
-- =============================================================================
-- Configura autenticação Supabase e perfis de usuário
-- Execute APÓS 01_estrutura_base.sql
-- =============================================================================

-- =============================================================================
-- HABILITAR ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE secretarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos_municipais ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- POLÍTICAS RLS BÁSICAS
-- =============================================================================

-- Secretarias: visíveis para todos
DROP POLICY IF EXISTS "public_view_secretarias" ON secretarias;
CREATE POLICY "public_view_secretarias" ON secretarias
  FOR SELECT USING (ativo = true);

-- Admins podem gerenciar secretarias
DROP POLICY IF EXISTS "admins_manage_secretarias" ON secretarias;
CREATE POLICY "admins_manage_secretarias" ON secretarias
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND tipo_usuario IN ('super_admin', 'admin')
    )
  );

-- Setores: visíveis para todos
DROP POLICY IF EXISTS "public_view_setores" ON setores;
CREATE POLICY "public_view_setores" ON setores
  FOR SELECT USING (ativo = true);

-- Serviços: visíveis para todos quando ativos
DROP POLICY IF EXISTS "public_view_services" ON servicos_municipais;
CREATE POLICY "public_view_services" ON servicos_municipais
  FOR SELECT USING (status = 'ativo');

-- Perfis: usuários podem ver e editar apenas o próprio perfil
DROP POLICY IF EXISTS "users_own_profile" ON user_profiles;
CREATE POLICY "users_own_profile" ON user_profiles
  FOR ALL USING (id = auth.uid());

-- Admins podem ver todos os perfis
DROP POLICY IF EXISTS "admins_view_all_profiles" ON user_profiles;
CREATE POLICY "admins_view_all_profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.tipo_usuario IN ('super_admin', 'admin')
    )
  );

-- Perfis são visíveis entre servidores da mesma secretaria
DROP POLICY IF EXISTS "same_secretaria_profiles" ON user_profiles;
CREATE POLICY "same_secretaria_profiles" ON user_profiles
  FOR SELECT USING (
    secretaria_id IN (
      SELECT secretaria_id FROM user_profiles 
      WHERE id = auth.uid()
    )
    AND tipo_usuario != 'cidadao'
  );

-- =============================================================================
-- FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    nome_completo,
    tipo_usuario,
    ativo,
    primeiro_acesso
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cidadao'),
    true,
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
-- =============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- FUNÇÃO PARA ATUALIZAR ÚLTIMO ACESSO
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_last_access()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET ultimo_acesso = NOW(),
      primeiro_acesso = false
  WHERE id = auth.uid();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- BUCKET PARA UPLOADS
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-uploads',
    'user-uploads', 
    true, 
    1048576, -- 1MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- POLÍTICAS RLS PARA STORAGE
-- =============================================================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Política para visualização pública de fotos de perfil
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = 'profiles');

-- Política para upload de fotos próprias
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- Política para atualização de fotos próprias
CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- Política para remoção de fotos próprias
CREATE POLICY "Users can delete their own avatar" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'user-uploads' 
    AND (storage.foldername(name))[1] = 'profiles'
    AND auth.uid()::text = (regexp_split_to_array((storage.foldername(name))[2], '-'))[2]
);

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Autenticação e perfis configurados!';
    RAISE NOTICE 'RLS habilitado em % tabelas', (
        SELECT COUNT(*) FROM pg_tables 
        WHERE schemaname = 'public' 
        AND rowsecurity = true
    );
    RAISE NOTICE 'Próximo passo: Execute 03_secretarias_setores.sql';
END $$;