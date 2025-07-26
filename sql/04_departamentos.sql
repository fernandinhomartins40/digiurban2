-- =====================================================
-- 04_departamentos.sql
-- Tabelas específicas dos departamentos municipais
-- =====================================================

-- =====================================================
-- SAÚDE
-- =====================================================

-- Tabela para Agentes Comunitários de Saúde
CREATE TABLE acs_agentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES auth.users(id),
    codigo_agente VARCHAR(20) UNIQUE,
    nome_completo VARCHAR(200) NOT NULL,
    area_cobertura TEXT[],
    familias_cobertas INTEGER DEFAULT 0,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para Programas de Saúde
CREATE TABLE programas_saude (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    publico_alvo TEXT,
    responsavel_id UUID REFERENCES auth.users(id),
    data_inicio DATE,
    data_fim DATE,
    status status_geral DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EDUCAÇÃO
-- =====================================================

-- Tabela para Escolas
CREATE TABLE escolas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    codigo_inep VARCHAR(20),
    endereco_id UUID REFERENCES enderecos(id),
    diretor_id UUID REFERENCES auth.users(id),
    tipo_ensino VARCHAR(50), -- infantil, fundamental, medio
    capacidade_alunos INTEGER,
    telefone VARCHAR(20),
    email VARCHAR(255),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para Alunos
CREATE TABLE alunos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matricula VARCHAR(50) UNIQUE NOT NULL,
    nome_completo VARCHAR(200) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    data_nascimento DATE,
    escola_id UUID REFERENCES escolas(id),
    serie_ano VARCHAR(20),
    responsavel_nome VARCHAR(200),
    responsavel_telefone VARCHAR(20),
    endereco_id UUID REFERENCES enderecos(id),
    status status_geral DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ASSISTÊNCIA SOCIAL
-- =====================================================

-- Tabela para Famílias Vulneráveis
CREATE TABLE familias_vulneraveis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_familia VARCHAR(50) UNIQUE,
    responsavel_familiar VARCHAR(200) NOT NULL,
    cpf_responsavel VARCHAR(14),
    numero_membros INTEGER DEFAULT 1,
    renda_familiar DECIMAL(10,2),
    endereco_id UUID REFERENCES enderecos(id),
    situacao_vulnerabilidade TEXT,
    assistente_social_id UUID REFERENCES auth.users(id),
    status status_geral DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para Benefícios Sociais
CREATE TABLE beneficios_sociais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    valor_beneficio DECIMAL(10,2),
    criterios_elegibilidade TEXT,
    responsavel_id UUID REFERENCES auth.users(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AGRICULTURA
-- =====================================================

-- Tabela para Produtores Rurais
CREATE TABLE produtores_rurais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_produtor VARCHAR(50) UNIQUE,
    nome_completo VARCHAR(200) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    propriedade_nome VARCHAR(200),
    area_total_hectares DECIMAL(10,2),
    culturas_principais TEXT[],
    endereco_propriedade_id UUID REFERENCES enderecos(id),
    telefone VARCHAR(20),
    email VARCHAR(255),
    tecnico_responsavel_id UUID REFERENCES auth.users(id),
    status status_geral DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- OBRAS PÚBLICAS
-- =====================================================

-- Tabela para Obras e Intervenções
CREATE TABLE obras_intervencoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_obra VARCHAR(50) UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    tipo_obra VARCHAR(100), -- pavimentacao, drenagem, construcao
    endereco_id UUID REFERENCES enderecos(id),
    valor_orcado DECIMAL(15,2),
    valor_executado DECIMAL(15,2),
    data_inicio DATE,
    data_prevista_fim DATE,
    data_conclusao DATE,
    percentual_executado INTEGER DEFAULT 0,
    responsavel_obra_id UUID REFERENCES auth.users(id),
    empresa_executora VARCHAR(200),
    status status_geral DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MEIO AMBIENTE
-- =====================================================

-- Tabela para Áreas Protegidas
CREATE TABLE areas_protegidas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    tipo_area VARCHAR(100), -- parque, reserva, app
    area_hectares DECIMAL(10,2),
    perimetro_coordenadas JSONB, -- Array de coordenadas lat/lng
    endereco_referencia_id UUID REFERENCES enderecos(id),
    responsavel_id UUID REFERENCES auth.users(id),
    decreto_criacao VARCHAR(100),
    data_criacao DATE,
    status status_geral DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para Licenças Ambientais
CREATE TABLE licencas_ambientais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_licenca VARCHAR(50) UNIQUE,
    tipo_licenca VARCHAR(100), -- previa, instalacao, operacao
    requerente_nome VARCHAR(200) NOT NULL,
    requerente_cpf_cnpj VARCHAR(18),
    atividade_descricao TEXT,
    endereco_atividade_id UUID REFERENCES enderecos(id),
    data_solicitacao DATE NOT NULL,
    data_vencimento DATE,
    valor_taxa DECIMAL(10,2),
    analista_responsavel_id UUID REFERENCES auth.users(id),
    status status_geral DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRIGGERS para updated_at
-- =====================================================

CREATE TRIGGER update_acs_agentes_updated_at 
    BEFORE UPDATE ON acs_agentes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programas_saude_updated_at 
    BEFORE UPDATE ON programas_saude 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escolas_updated_at 
    BEFORE UPDATE ON escolas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alunos_updated_at 
    BEFORE UPDATE ON alunos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_familias_vulneraveis_updated_at 
    BEFORE UPDATE ON familias_vulneraveis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficios_sociais_updated_at 
    BEFORE UPDATE ON beneficios_sociais 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produtores_rurais_updated_at 
    BEFORE UPDATE ON produtores_rurais 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obras_intervencoes_updated_at 
    BEFORE UPDATE ON obras_intervencoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_areas_protegidas_updated_at 
    BEFORE UPDATE ON areas_protegidas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licencas_ambientais_updated_at 
    BEFORE UPDATE ON licencas_ambientais 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para ACS
CREATE INDEX idx_acs_agentes_codigo ON acs_agentes(codigo_agente);
CREATE INDEX idx_acs_agentes_usuario ON acs_agentes(usuario_id);

-- Índices para escolas
CREATE INDEX idx_escolas_codigo_inep ON escolas(codigo_inep);
CREATE INDEX idx_escolas_diretor ON escolas(diretor_id);

-- Índices para alunos
CREATE INDEX idx_alunos_matricula ON alunos(matricula);
CREATE INDEX idx_alunos_escola ON alunos(escola_id);
CREATE INDEX idx_alunos_cpf ON alunos(cpf);

-- Índices para famílias vulneráveis
CREATE INDEX idx_familias_codigo ON familias_vulneraveis(codigo_familia);
CREATE INDEX idx_familias_assistente ON familias_vulneraveis(assistente_social_id);

-- Índices para produtores rurais
CREATE INDEX idx_produtores_codigo ON produtores_rurais(codigo_produtor);
CREATE INDEX idx_produtores_cpf ON produtores_rurais(cpf);
CREATE INDEX idx_produtores_tecnico ON produtores_rurais(tecnico_responsavel_id);

-- Índices para obras
CREATE INDEX idx_obras_codigo ON obras_intervencoes(codigo_obra);
CREATE INDEX idx_obras_responsavel ON obras_intervencoes(responsavel_obra_id);
CREATE INDEX idx_obras_status ON obras_intervencoes(status);

-- Índices para licenças ambientais
CREATE INDEX idx_licencas_numero ON licencas_ambientais(numero_licenca);
CREATE INDEX idx_licencas_analista ON licencas_ambientais(analista_responsavel_id);
CREATE INDEX idx_licencas_status ON licencas_ambientais(status);