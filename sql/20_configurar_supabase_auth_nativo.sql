-- =============================================
-- Script 20: Configurar Supabase Auth Nativo
-- Configuração adequada para usar o sistema de autenticação padrão
-- =============================================

-- 1. Primeiro, vamos limpar as configurações anteriores
DROP TABLE IF EXISTS public.temp_credentials;

-- 2. Habilitar RLS na tabela auth.users (se necessário)
-- Nota: Esta tabela já tem RLS por padrão no Supabase

-- 3. Verificar se temos acesso às tabelas necessárias
SELECT 
    'Verificando estrutura das tabelas...' as status,
    schemaname, 
    tablename 
FROM pg_tables 
WHERE schemaname IN ('auth', 'public') 
AND tablename IN ('users', 'user_profiles', 'cidadao_profiles')
ORDER BY schemaname, tablename;

-- 4. Criar função para handle automatico de novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Para usuários que se registram pelo portal do cidadão
  -- vamos criar automaticamente um perfil na tabela cidadao_profiles
  IF NEW.raw_user_meta_data->>'tipo_usuario' = 'cidadao' THEN
    INSERT INTO public.cidadao_profiles (
      id, 
      email, 
      nome_completo, 
      cpf,
      telefone,
      status,
      primeiro_acesso
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
      COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
      COALESCE(NEW.raw_user_meta_data->>'telefone', ''),
      'ativo',
      true
    );
    
    -- Também criar na tabela user_profiles para compatibilidade
    INSERT INTO public.user_profiles (
      id,
      email,
      nome_completo,
      tipo_usuario,
      status,
      primeiro_acesso,
      cpf,
      telefone
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
      'cidadao',
      'ativo',
      true,
      COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
      COALESCE(NEW.raw_user_meta_data->>'telefone', '')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Criar usuários administrativos no sistema auth nativo
-- Nota: Estes serão criados via interface admin ou com insert direto

-- Função para criar usuário administrativo
CREATE OR REPLACE FUNCTION public.create_admin_user(
  user_email text,
  user_password text,
  user_name text,
  user_type text,
  user_cargo text DEFAULT NULL,
  secretaria_id_param uuid DEFAULT NULL
)
RETURNS json AS $$
DECLARE
  new_user_id uuid;
  result json;
BEGIN
  -- Gerar ID único
  new_user_id := gen_random_uuid();
  
  -- Inserir usuário na tabela auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    raw_user_meta_data,
    is_super_admin
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    json_build_object(
      'nome_completo', user_name,
      'tipo_usuario', user_type
    ),
    CASE WHEN user_type = 'super_admin' THEN true ELSE false END
  );
  
  -- Inserir perfil na tabela user_profiles
  INSERT INTO public.user_profiles (
    id,
    email,
    nome_completo,
    tipo_usuario,
    cargo,
    secretaria_id,
    status,
    primeiro_acesso
  ) VALUES (
    new_user_id,
    user_email,
    user_name,
    user_type,
    user_cargo,
    secretaria_id_param,
    'ativo',
    true
  );
  
  result := json_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', user_email,
    'message', 'Usuário criado com sucesso'
  );
  
  RETURN result;
  
EXCEPTION WHEN others THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Criar usuários de teste (se não existirem)
DO $$
DECLARE
  gabinete_secretaria_id uuid;
  saude_secretaria_id uuid;
  educacao_secretaria_id uuid;
BEGIN
  -- Buscar IDs das secretarias
  SELECT id INTO gabinete_secretaria_id FROM public.secretarias WHERE codigo = 'GABINETE' LIMIT 1;
  SELECT id INTO saude_secretaria_id FROM public.secretarias WHERE codigo = 'SAUDE' LIMIT 1;
  SELECT id INTO educacao_secretaria_id FROM public.secretarias WHERE codigo = 'EDUCACAO' LIMIT 1;
  
  -- Criar usuários apenas se não existirem
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'prefeito@municipio.gov.br') THEN
    PERFORM public.create_admin_user(
      'prefeito@municipio.gov.br',
      'Prefeito@2024',
      'João da Silva Prefeito',
      'super_admin',
      'Prefeito Municipal',
      gabinete_secretaria_id
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'chefe.gabinete@municipio.gov.br') THEN
    PERFORM public.create_admin_user(
      'chefe.gabinete@municipio.gov.br',
      'ChefGab@2024',
      'Maria Santos Chefe',
      'admin',
      'Chefe de Gabinete',
      gabinete_secretaria_id
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'secretario.saude@municipio.gov.br') THEN
    PERFORM public.create_admin_user(
      'secretario.saude@municipio.gov.br',
      'SecSaude@2024',
      'Dr. Carlos Medicina',
      'secretario',
      'Secretário de Saúde',
      saude_secretaria_id
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'funcionario.saude@municipio.gov.br') THEN
    PERFORM public.create_admin_user(
      'funcionario.saude@municipio.gov.br',
      'FuncSaude@2024',
      'Ana Paula Enfermeira',
      'funcionario',
      'Enfermeira',
      saude_secretaria_id
    );
  END IF;
  
  RAISE NOTICE 'Usuários de teste criados no sistema auth nativo';
END $$;

-- 8. Configurar políticas RLS para auth integration
-- Política para permitir que usuários vejam apenas seus próprios dados
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Criar novas políticas
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para admins verem todos os perfis
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() 
      AND tipo_usuario IN ('super_admin', 'admin')
    )
  );

-- 9. Configurar políticas para cidadao_profiles
ALTER TABLE public.cidadao_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cidadãos podem ver apenas seu próprio perfil" ON public.cidadao_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Cidadãos podem atualizar apenas seu próprio perfil" ON public.cidadao_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 10. Função para obter perfil do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS json AS $$
DECLARE
  user_profile public.user_profiles%ROWTYPE;
  cidadao_profile public.cidadao_profiles%ROWTYPE;
  result json;
BEGIN
  -- Verificar se está autenticado
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('error', 'Não autenticado');
  END IF;
  
  -- Buscar perfil na tabela user_profiles
  SELECT * INTO user_profile 
  FROM public.user_profiles 
  WHERE id = auth.uid();
  
  IF user_profile.id IS NOT NULL THEN
    -- Se for cidadão, buscar dados complementares
    IF user_profile.tipo_usuario = 'cidadao' THEN
      SELECT * INTO cidadao_profile 
      FROM public.cidadao_profiles 
      WHERE id = auth.uid();
      
      result := json_build_object(
        'id', user_profile.id,
        'email', user_profile.email,
        'nome_completo', user_profile.nome_completo,
        'tipo_usuario', user_profile.tipo_usuario,
        'status', user_profile.status,
        'cpf', COALESCE(cidadao_profile.cpf, user_profile.cpf),
        'telefone', COALESCE(cidadao_profile.telefone, user_profile.telefone),
        'endereco', cidadao_profile.endereco,
        'data_nascimento', cidadao_profile.data_nascimento
      );
    ELSE
      -- Usuário administrativo
      result := json_build_object(
        'id', user_profile.id,
        'email', user_profile.email,
        'nome_completo', user_profile.nome_completo,
        'tipo_usuario', user_profile.tipo_usuario,
        'cargo', user_profile.cargo,
        'secretaria_id', user_profile.secretaria_id,
        'status', user_profile.status,
        'cpf', user_profile.cpf,
        'telefone', user_profile.telefone
      );
    END IF;
    
    RETURN result;
  ELSE
    RETURN json_build_object('error', 'Perfil não encontrado');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Dar permissões necessárias
GRANT EXECUTE ON FUNCTION public.get_current_user_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.create_admin_user(text, text, text, text, text, uuid) TO service_role;

-- 12. Verificar configuração
SELECT 
  'Verificação final...' as status,
  COUNT(*) as total_usuarios_auth
FROM auth.users;

SELECT 
  'Perfis criados...' as status,
  tipo_usuario,
  COUNT(*) as total
FROM public.user_profiles 
GROUP BY tipo_usuario;

-- Script concluído
SELECT 'Script 20 - Configuração Supabase Auth Nativo concluído!' as resultado;