-- =============================================================================
-- 03_SECRETARIAS_SETORES.SQL - DigiUrban Database Setup
-- =============================================================================
-- Configura setores dentro das secretarias
-- Execute APÓS 02_auth_profiles.sql
-- =============================================================================

-- =============================================================================
-- SETORES DA SECRETARIA DE SAÚDE
-- =============================================================================
INSERT INTO setores (secretaria_id, nome, descricao, ativo)
SELECT s.id, nome_setor, desc_setor, true
FROM secretarias s,
(VALUES 
  ('Atenção Básica', 'Unidades Básicas de Saúde e Estratégia Saúde da Família'),
  ('Vigilância em Saúde', 'Vigilância Epidemiológica, Sanitária e Ambiental'),
  ('Urgência e Emergência', 'SAMU, UPA e Pronto Socorro'),
  ('Saúde Bucal', 'Odontologia e prevenção em saúde bucal'),
  ('Farmácia Central', 'Dispensação e controle de medicamentos'),
  ('Regulação', 'Central de Regulação e agendamentos')
) AS novos_setores(nome_setor, desc_setor)
WHERE s.codigo = 'SEC-SAU'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SETORES DA SECRETARIA DE EDUCAÇÃO
-- =============================================================================
INSERT INTO setores (secretaria_id, nome, descricao, ativo)
SELECT s.id, nome_setor, desc_setor, true
FROM secretarias s,
(VALUES 
  ('Ensino Infantil', 'Creches e pré-escolas municipais'),
  ('Ensino Fundamental', 'Escolas municipais de ensino fundamental'),
  ('Educação de Jovens e Adultos', 'EJA e alfabetização de adultos'),
  ('Transporte Escolar', 'Gestão do transporte escolar'),
  ('Merenda Escolar', 'Alimentação escolar e nutrição'),
  ('Coordenação Pedagógica', 'Suporte pedagógico e formação continuada')
) AS novos_setores(nome_setor, desc_setor)
WHERE s.codigo = 'SEC-EDU'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SETORES DA SECRETARIA DE ASSISTÊNCIA SOCIAL
-- =============================================================================
INSERT INTO setores (secretaria_id, nome, descricao, ativo)
SELECT s.id, nome_setor, desc_setor, true
FROM secretarias s,
(VALUES 
  ('CRAS - Centro de Referência', 'Centro de Referência de Assistência Social'),
  ('CREAS - Centro Especializado', 'Centro de Referência Especializado'),
  ('Benefícios e Transferência', 'Cadastro Único, Bolsa Família e benefícios'),
  ('Proteção Social Básica', 'Programas de proteção básica'),
  ('Proteção Social Especial', 'Atendimento especializado'),
  ('Gestão do SUAS', 'Sistema Único de Assistência Social')
) AS novos_setores(nome_setor, desc_setor)
WHERE s.codigo = 'SEC-ASS'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SETORES DA SECRETARIA DE OBRAS
-- =============================================================================
INSERT INTO setores (secretaria_id, nome, descricao, ativo)
SELECT s.id, nome_setor, desc_setor, true
FROM secretarias s,
(VALUES 
  ('Infraestrutura Viária', 'Pavimentação, manutenção de ruas e estradas'),
  ('Obras Públicas', 'Construção e reforma de prédios públicos'),
  ('Drenagem e Esgoto', 'Sistema de drenagem pluvial e esgotamento'),
  ('Engenharia', 'Projetos técnicos e fiscalização'),
  ('Maquinário e Equipamentos', 'Gestão de máquinas e equipamentos'),
  ('Pontes e Viadutos', 'Manutenção de pontes e estruturas')
) AS novos_setores(nome_setor, desc_setor)
WHERE s.codigo = 'SEC-OBR'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SETORES DA SECRETARIA DE FINANÇAS
-- =============================================================================
INSERT INTO setores (secretaria_id, nome, descricao, ativo)
SELECT s.id, nome_setor, desc_setor, true
FROM secretarias s,
(VALUES 
  ('Arrecadação', 'Tributos municipais e receitas'),
  ('Contabilidade', 'Controle contábil e prestação de contas'),
  ('Orçamento', 'Planejamento orçamentário e execução'),
  ('Tesouraria', 'Pagamentos e controle financeiro'),
  ('Fiscalização Tributária', 'Fiscalização de tributos municipais'),
  ('Dívida Ativa', 'Cobrança e recuperação de créditos')
) AS novos_setores(nome_setor, desc_setor)
WHERE s.codigo = 'SEC-FIN'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SETORES BÁSICOS PARA OUTRAS SECRETARIAS
-- =============================================================================

-- Administração
INSERT INTO setores (secretaria_id, nome, descricao, ativo)
SELECT s.id, nome_setor, desc_setor, true
FROM secretarias s,
(VALUES 
  ('Recursos Humanos', 'Gestão de pessoal e concursos'),
  ('Protocolo e Arquivo', 'Protocolo de documentos e arquivo'),
  ('Compras e Licitações', 'Processos licitatórios e compras'),
  ('Patrimônio', 'Controle patrimonial')
) AS novos_setores(nome_setor, desc_setor)
WHERE s.codigo = 'SEC-ADM'
ON CONFLICT DO NOTHING;

-- Serviços Públicos
INSERT INTO setores (secretaria_id, nome, descricao, ativo)
SELECT s.id, nome_setor, desc_setor, true
FROM secretarias s,
(VALUES 
  ('Limpeza Urbana', 'Coleta de lixo e limpeza pública'),
  ('Iluminação Pública', 'Manutenção da iluminação'),
  ('Parques e Jardins', 'Manutenção de praças e áreas verdes'),
  ('Cemitério Municipal', 'Administração do cemitério')
) AS novos_setores(nome_setor, desc_setor)
WHERE s.codigo = 'SEC-SER'
ON CONFLICT DO NOTHING;

-- Planejamento Urbano
INSERT INTO setores (secretaria_id, nome, descricao, ativo)
SELECT s.id, nome_setor, desc_setor, true
FROM secretarias s,
(VALUES 
  ('Licenciamento', 'Aprovação de projetos e alvarás'),
  ('Fiscalização Urbana', 'Fiscalização de obras e posturas'),
  ('Geoprocessamento', 'Mapas e sistemas geográficos'),
  ('Plano Diretor', 'Planejamento territorial')
) AS novos_setores(nome_setor, desc_setor)
WHERE s.codigo = 'SEC-PLA'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- ÍNDICES ADICIONAIS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_setores_nome ON setores(nome);
CREATE INDEX IF NOT EXISTS idx_user_profiles_secretaria ON user_profiles(secretaria_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_setor ON user_profiles(setor_id);

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Secretarias e setores configurados!';
    RAISE NOTICE 'Total de secretarias: %', (SELECT COUNT(*) FROM secretarias WHERE ativo = true);
    RAISE NOTICE 'Total de setores: %', (SELECT COUNT(*) FROM setores WHERE ativo = true);
    
    -- Mostrar resumo por secretaria
    FOR rec IN 
        SELECT s.nome, COUNT(st.id) as qtd_setores 
        FROM secretarias s 
        LEFT JOIN setores st ON s.id = st.secretaria_id 
        WHERE s.ativo = true 
        GROUP BY s.nome 
        ORDER BY s.nome
    LOOP
        RAISE NOTICE '  % - % setores', rec.nome, rec.qtd_setores;
    END LOOP;
    
    RAISE NOTICE 'Próximo passo: Execute 04_servicos_protocolos.sql';
END $$;