-- =============================================
-- Script 01: Estrutura Base para Nova Instância
-- Execute PRIMEIRO na nova instância Supabase
-- =============================================

-- 1. Criar tipos ENUM necessários
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM (
        'super_admin',
        'admin', 
        'secretario',
        'diretor',
        'coordenador',
        'funcionario',
        'atendente',
        'cidadao'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Criar tabela de secretarias
CREATE TABLE IF NOT EXISTS public.secretarias (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo text UNIQUE NOT NULL,
    nome text NOT NULL,
    sigla text,
    descricao text,
    cor text DEFAULT '#3B82F6',
    icone text DEFAULT 'building',
    responsavel_id uuid,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Criar tabela de perfis de acesso
CREATE TABLE IF NOT EXISTS public.perfis_acesso (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome text NOT NULL,
    descricao text,
    nivel_acesso integer DEFAULT 1,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Criar tabela de permissões
CREATE TABLE IF NOT EXISTS public.permissoes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo text UNIQUE NOT NULL,
    nome text NOT NULL,
    descricao text,
    modulo text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Criar tabela de perfil_permissões (relacionamento)
CREATE TABLE IF NOT EXISTS public.perfil_permissoes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    perfil_id uuid REFERENCES public.perfis_acesso(id) ON DELETE CASCADE,
    permissao_id uuid REFERENCES public.permissoes(id) ON DELETE CASCADE,
    concedida boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(perfil_id, permissao_id)
);

-- 6. Criar tabela principal de perfis de usuário
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email text UNIQUE NOT NULL,
    nome_completo text NOT NULL,
    tipo_usuario user_type NOT NULL DEFAULT 'cidadao',
    perfil_acesso_id uuid REFERENCES public.perfis_acesso(id),
    secretaria_id uuid REFERENCES public.secretarias(id),
    setor_id uuid,
    cargo text,
    cpf text,
    telefone text,
    status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    primeiro_acesso boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tipo_usuario ON public.user_profiles(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_user_profiles_secretaria_id ON public.user_profiles(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);

CREATE INDEX IF NOT EXISTS idx_secretarias_codigo ON public.secretarias(codigo);
CREATE INDEX IF NOT EXISTS idx_perfis_acesso_nivel ON public.perfis_acesso(nivel_acesso);
CREATE INDEX IF NOT EXISTS idx_permissoes_codigo ON public.permissoes(codigo);
CREATE INDEX IF NOT EXISTS idx_permissoes_modulo ON public.permissoes(modulo);

-- 8. Criar funções de trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Criar triggers para updated_at
DROP TRIGGER IF EXISTS trigger_secretarias_updated_at ON public.secretarias;
CREATE TRIGGER trigger_secretarias_updated_at
    BEFORE UPDATE ON public.secretarias
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_perfis_acesso_updated_at ON public.perfis_acesso;
CREATE TRIGGER trigger_perfis_acesso_updated_at
    BEFORE UPDATE ON public.perfis_acesso
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 10. Verificação final
SELECT 
    'Tabela criada' as status,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('secretarias', 'perfis_acesso', 'permissoes', 'perfil_permissoes', 'user_profiles')
ORDER BY table_name;

-- Script 01 concluído
SELECT 'Script 01 - Estrutura Base executado com sucesso!' as resultado;