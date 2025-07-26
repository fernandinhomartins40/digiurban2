-- =============================================
-- Script 19: Separação de Dashboards - Autenticação
-- Criação de tabelas para suporte aos portais separados
-- =============================================

-- 1. Criar tabela específica para perfis de cidadãos
CREATE TABLE IF NOT EXISTS public.cidadao_profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email text UNIQUE NOT NULL,
    nome_completo text NOT NULL,
    cpf text UNIQUE NOT NULL,
    telefone text,
    endereco text,
    data_nascimento date,
    status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    primeiro_acesso boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_cidadao_profiles_cpf ON public.cidadao_profiles(cpf);
CREATE INDEX IF NOT EXISTS idx_cidadao_profiles_email ON public.cidadao_profiles(email);
CREATE INDEX IF NOT EXISTS idx_cidadao_profiles_status ON public.cidadao_profiles(status);

-- 3. Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at_cidadao_profiles()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cidadao_profiles_updated_at
    BEFORE UPDATE ON public.cidadao_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at_cidadao_profiles();

-- 4. Criar tabela para protocolos dos cidadãos
CREATE TABLE IF NOT EXISTS public.protocolos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    numero text UNIQUE NOT NULL,
    assunto text NOT NULL,
    descricao text,
    status text NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'resolvido', 'cancelado')),
    prioridade text DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente')),
    data_abertura timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    data_atualizacao timestamp with time zone DEFAULT timezone('utc'::text, now()),
    data_resolucao timestamp with time zone,
    cidadao_id uuid REFERENCES public.cidadao_profiles(id) ON DELETE CASCADE NOT NULL,
    secretaria_id uuid REFERENCES public.secretarias(id),
    servico_id uuid, -- Referência para futura tabela de serviços
    responsavel_id uuid REFERENCES public.user_profiles(id),
    observacoes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Criar índices para protocolos
CREATE INDEX IF NOT EXISTS idx_protocolos_numero ON public.protocolos(numero);
CREATE INDEX IF NOT EXISTS idx_protocolos_cidadao_id ON public.protocolos(cidadao_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_status ON public.protocolos(status);
CREATE INDEX IF NOT EXISTS idx_protocolos_secretaria_id ON public.protocolos(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_protocolos_data_abertura ON public.protocolos(data_abertura);

-- 6. Trigger para atualizar updated_at dos protocolos
CREATE OR REPLACE FUNCTION public.handle_updated_at_protocolos()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    IF NEW.status != OLD.status THEN
        NEW.data_atualizacao = timezone('utc'::text, now());
    END IF;
    IF NEW.status = 'resolvido' AND OLD.status != 'resolvido' THEN
        NEW.data_resolucao = timezone('utc'::text, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_protocolos_updated_at
    BEFORE UPDATE ON public.protocolos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at_protocolos();

-- 7. Criar tabela para serviços públicos
CREATE TABLE IF NOT EXISTS public.servicos_publicos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo text UNIQUE NOT NULL,
    nome text NOT NULL,
    descricao text,
    categoria text NOT NULL,
    secretaria_id uuid REFERENCES public.secretarias(id) NOT NULL,
    ativo boolean DEFAULT true,
    online boolean DEFAULT false,
    documentos_necessarios text[], -- Array de documentos necessários
    prazo_dias integer,
    taxa_valor decimal(10,2),
    instrucoes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Índices para serviços públicos
CREATE INDEX IF NOT EXISTS idx_servicos_publicos_codigo ON public.servicos_publicos(codigo);
CREATE INDEX IF NOT EXISTS idx_servicos_publicos_categoria ON public.servicos_publicos(categoria);
CREATE INDEX IF NOT EXISTS idx_servicos_publicos_secretaria_id ON public.servicos_publicos(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_servicos_publicos_ativo ON public.servicos_publicos(ativo);
CREATE INDEX IF NOT EXISTS idx_servicos_publicos_online ON public.servicos_publicos(online);

-- 9. Trigger para serviços públicos
CREATE TRIGGER trigger_servicos_publicos_updated_at
    BEFORE UPDATE ON public.servicos_publicos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 10. Criar tabela para histórico de protocolos
CREATE TABLE IF NOT EXISTS public.protocolo_historico (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    protocolo_id uuid REFERENCES public.protocolos(id) ON DELETE CASCADE NOT NULL,
    status_anterior text,
    status_novo text NOT NULL,
    observacao text,
    usuario_id uuid REFERENCES public.user_profiles(id),
    data_mudanca timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Índices para histórico
CREATE INDEX IF NOT EXISTS idx_protocolo_historico_protocolo_id ON public.protocolo_historico(protocolo_id);
CREATE INDEX IF NOT EXISTS idx_protocolo_historico_data_mudanca ON public.protocolo_historico(data_mudanca);

-- 12. Função para criar histórico automaticamente
CREATE OR REPLACE FUNCTION public.create_protocolo_historico()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN
        INSERT INTO public.protocolo_historico (protocolo_id, status_anterior, status_novo, observacao)
        VALUES (NEW.id, OLD.status, NEW.status, COALESCE(NEW.observacoes, 'Status alterado automaticamente'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_protocolo_historico
    AFTER UPDATE ON public.protocolos
    FOR EACH ROW
    EXECUTE FUNCTION public.create_protocolo_historico();

-- 13. Criar view para dashboard do cidadão
CREATE OR REPLACE VIEW public.v_cidadao_dashboard AS
SELECT 
    cp.id,
    cp.nome_completo,
    cp.email,
    COUNT(p.id) as total_protocolos,
    COUNT(CASE WHEN p.status = 'aberto' THEN 1 END) as protocolos_abertos,
    COUNT(CASE WHEN p.status = 'em_andamento' THEN 1 END) as protocolos_andamento,
    COUNT(CASE WHEN p.status = 'resolvido' THEN 1 END) as protocolos_resolvidos,
    COUNT(CASE WHEN p.status = 'cancelado' THEN 1 END) as protocolos_cancelados
FROM public.cidadao_profiles cp
LEFT JOIN public.protocolos p ON cp.id = p.cidadao_id
GROUP BY cp.id, cp.nome_completo, cp.email;

-- 14. Inserir alguns serviços públicos padrão
INSERT INTO public.servicos_publicos (codigo, nome, descricao, categoria, secretaria_id, ativo, online, documentos_necessarios, prazo_dias) 
SELECT 
    'IPTU_CONSULTA',
    'Consulta de IPTU',
    'Consulte débitos e emita segunda via do IPTU',
    'Tributário',
    s.id,
    true,
    true,
    ARRAY['CPF', 'Número da Inscrição Imobiliária'],
    1
FROM public.secretarias s 
WHERE s.codigo = 'FAZENDA'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO public.servicos_publicos (codigo, nome, descricao, categoria, secretaria_id, ativo, online, documentos_necessarios, prazo_dias)
SELECT 
    'CERTIDAO_NASCIMENTO',
    'Certidão de Nascimento',
    'Solicite segunda via da certidão de nascimento',
    'Documentos',
    s.id,
    true,
    true,
    ARRAY['CPF', 'RG', 'Comprovante de Residência'],
    5
FROM public.secretarias s 
WHERE s.codigo = 'ADMINISTRACAO'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO public.servicos_publicos (codigo, nome, descricao, categoria, secretaria_id, ativo, online, documentos_necessarios, prazo_dias)
SELECT 
    'AGENDAMENTO_MEDICO',
    'Agendamento Médico',
    'Agende consultas médicas nas unidades de saúde',
    'Saúde',
    s.id,
    true,
    true,
    ARRAY['CPF', 'Cartão SUS', 'Comprovante de Residência'],
    3
FROM public.secretarias s 
WHERE s.codigo = 'SAUDE'
ON CONFLICT (codigo) DO NOTHING;

-- 15. Configurar RLS (Row Level Security)
ALTER TABLE public.cidadao_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocolos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos_publicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocolo_historico ENABLE ROW LEVEL SECURITY;

-- 16. Políticas RLS para cidadao_profiles
CREATE POLICY "Cidadãos podem ver apenas seu próprio perfil" ON public.cidadao_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Cidadãos podem atualizar apenas seu próprio perfil" ON public.cidadao_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis de cidadãos" ON public.cidadao_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND tipo_usuario IN ('super_admin', 'admin')
        )
    );

-- 17. Políticas RLS para protocolos
CREATE POLICY "Cidadãos podem ver apenas seus próprios protocolos" ON public.protocolos
    FOR SELECT USING (cidadao_id = auth.uid());

CREATE POLICY "Cidadãos podem criar protocolos" ON public.protocolos
    FOR INSERT WITH CHECK (cidadao_id = auth.uid());

CREATE POLICY "Servidores podem ver protocolos de sua secretaria" ON public.protocolos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND (
                tipo_usuario IN ('super_admin', 'admin') 
                OR secretaria_id = protocolos.secretaria_id
            )
        )
    );

CREATE POLICY "Servidores podem atualizar protocolos de sua secretaria" ON public.protocolos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND (
                tipo_usuario IN ('super_admin', 'admin') 
                OR secretaria_id = protocolos.secretaria_id
            )
        )
    );

-- 18. Políticas RLS para serviços públicos
CREATE POLICY "Todos podem visualizar serviços ativos" ON public.servicos_publicos
    FOR SELECT USING (ativo = true);

CREATE POLICY "Apenas admins podem gerenciar serviços" ON public.servicos_publicos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND tipo_usuario IN ('super_admin', 'admin')
        )
    );

-- 19. Políticas RLS para histórico de protocolos
CREATE POLICY "Cidadãos podem ver histórico de seus protocolos" ON public.protocolo_historico
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.protocolos 
            WHERE id = protocolo_historico.protocolo_id 
            AND cidadao_id = auth.uid()
        )
    );

CREATE POLICY "Servidores podem ver histórico dos protocolos de sua secretaria" ON public.protocolo_historico
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.protocolos p
            JOIN public.user_profiles up ON up.id = auth.uid()
            WHERE p.id = protocolo_historico.protocolo_id 
            AND (
                up.tipo_usuario IN ('super_admin', 'admin') 
                OR up.secretaria_id = p.secretaria_id
            )
        )
    );

-- 20. Função para migrar cidadãos existentes
CREATE OR REPLACE FUNCTION public.migrate_existing_citizens()
RETURNS void AS $$
BEGIN
    -- Migrar usuários com tipo 'cidadao' para a nova tabela
    INSERT INTO public.cidadao_profiles (
        id, email, nome_completo, cpf, telefone, status, primeiro_acesso, created_at, updated_at
    )
    SELECT 
        id, 
        email, 
        nome_completo, 
        COALESCE(cpf, '00000000000'), -- CPF padrão se não existir
        telefone,
        status,
        primeiro_acesso,
        created_at,
        updated_at
    FROM public.user_profiles 
    WHERE tipo_usuario = 'cidadao'
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Migração de cidadãos concluída';
END;
$$ LANGUAGE plpgsql;

-- 21. Executar migração
SELECT public.migrate_existing_citizens();

-- 22. Adicionar comentários para documentação
COMMENT ON TABLE public.cidadao_profiles IS 'Perfis específicos para cidadãos do município';
COMMENT ON TABLE public.protocolos IS 'Protocolos de atendimento dos cidadãos';
COMMENT ON TABLE public.servicos_publicos IS 'Catálogo de serviços públicos oferecidos';
COMMENT ON TABLE public.protocolo_historico IS 'Histórico de mudanças nos protocolos';

COMMENT ON COLUMN public.cidadao_profiles.cpf IS 'CPF do cidadão (obrigatório e único)';
COMMENT ON COLUMN public.protocolos.numero IS 'Número único do protocolo (formato: AAAANNNNNN)';
COMMENT ON COLUMN public.servicos_publicos.documentos_necessarios IS 'Array com lista de documentos necessários';

-- 23. Criar função para gerar número de protocolo
CREATE OR REPLACE FUNCTION public.generate_protocol_number()
RETURNS text AS $$
DECLARE
    current_year text;
    sequence_number text;
    protocol_number text;
BEGIN
    current_year := EXTRACT(year FROM CURRENT_DATE)::text;
    
    -- Buscar próximo número sequencial do ano
    SELECT COALESCE(
        (
            SELECT RIGHT(numero, 6)::integer + 1
            FROM public.protocolos 
            WHERE numero LIKE current_year || '%'
            ORDER BY numero DESC 
            LIMIT 1
        ), 
        1
    )::text INTO sequence_number;
    
    -- Formatar com zeros à esquerda
    sequence_number := LPAD(sequence_number, 6, '0');
    
    protocol_number := current_year || sequence_number;
    
    RETURN protocol_number;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.generate_protocol_number() IS 'Gera número sequencial único para protocolos (formato: AAAANNNNNN)';

-- Script concluído
SELECT 'Script 19 - Separação de Dashboards executado com sucesso!' as resultado;