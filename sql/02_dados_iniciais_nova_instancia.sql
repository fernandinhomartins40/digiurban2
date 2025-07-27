-- =============================================
-- Script 02: Dados Iniciais para Nova Instância  
-- Execute SEGUNDO (após Script 01)
-- =============================================

-- 1. Inserir secretarias padrão
INSERT INTO public.secretarias (codigo, nome, sigla, descricao, cor, icone) VALUES
('GABINETE', 'Gabinete do Prefeito', 'GAB', 'Gabinete do Prefeito Municipal', '#8B5CF6', 'crown'),
('ADMINISTRACAO', 'Secretaria de Administração', 'ADM', 'Administração e Recursos Humanos', '#3B82F6', 'briefcase'),
('FAZENDA', 'Secretaria da Fazenda', 'FAZ', 'Finanças e Tributação Municipal', '#10B981', 'dollar-sign'),
('SAUDE', 'Secretaria de Saúde', 'SAU', 'Saúde Pública Municipal', '#EF4444', 'heart'),
('EDUCACAO', 'Secretaria de Educação', 'EDU', 'Educação Municipal', '#F59E0B', 'book'),
('ASSISTENCIA', 'Secretaria de Assistência Social', 'ASS', 'Assistência e Desenvolvimento Social', '#06B6D4', 'users'),
('OBRAS', 'Secretaria de Obras Públicas', 'OBR', 'Obras e Infraestrutura', '#6B7280', 'hammer'),
('MEIO_AMBIENTE', 'Secretaria de Meio Ambiente', 'MMA', 'Meio Ambiente e Sustentabilidade', '#22C55E', 'leaf'),
('CULTURA', 'Secretaria de Cultura', 'CUL', 'Cultura e Turismo', '#A855F7', 'palette'),
('ESPORTES', 'Secretaria de Esportes', 'ESP', 'Esportes e Lazer', '#F97316', 'trophy'),
('AGRICULTURA', 'Secretaria de Agricultura', 'AGR', 'Agricultura e Desenvolvimento Rural', '#84CC16', 'tractor'),
('SEGURANCA', 'Secretaria de Segurança Pública', 'SEG', 'Segurança Pública Municipal', '#DC2626', 'shield'),
('HABITACAO', 'Secretaria de Habitação', 'HAB', 'Habitação e Desenvolvimento Urbano', '#0EA5E9', 'home'),
('SERVICOS', 'Secretaria de Serviços Públicos', 'SER', 'Serviços Públicos e Limpeza Urbana', '#64748B', 'truck'),
('PLANEJAMENTO', 'Secretaria de Planejamento', 'PLA', 'Planejamento Urbano e Desenvolvimento', '#7C3AED', 'map'),
('TURISMO', 'Secretaria de Turismo', 'TUR', 'Turismo e Desenvolvimento Econômico', '#EC4899', 'camera');

-- 2. Inserir perfis de acesso
INSERT INTO public.perfis_acesso (nome, descricao, nivel_acesso) VALUES
('Super Administrador', 'Acesso total ao sistema', 10),
('Administrador', 'Acesso administrativo geral', 9),
('Secretário Municipal', 'Acesso à secretaria específica', 8),
('Diretor', 'Acesso diretorial', 7),
('Coordenador', 'Acesso de coordenação', 6),
('Funcionário', 'Acesso funcional básico', 5),
('Atendente', 'Acesso para atendimento público', 4),
('Cidadão', 'Acesso público aos serviços', 1);

-- 3. Inserir permissões por módulo
INSERT INTO public.permissoes (codigo, nome, descricao, modulo) VALUES
-- Gabinete
('GAB_VIEW', 'Visualizar Gabinete', 'Visualizar informações do gabinete', 'gabinete'),
('GAB_EDIT', 'Editar Gabinete', 'Editar informações do gabinete', 'gabinete'),
('GAB_REPORTS', 'Relatórios Executivos', 'Acessar relatórios executivos', 'gabinete'),
('GAB_ALERTS', 'Gerenciar Alertas', 'Gerenciar alertas do sistema', 'gabinete'),
('GAB_PERMISSIONS', 'Gerenciar Permissões', 'Gerenciar permissões de usuários', 'gabinete'),

-- Administração
('ADM_USERS', 'Gerenciar Usuários', 'Gerenciar usuários do sistema', 'administracao'),
('ADM_PROFILES', 'Gerenciar Perfis', 'Gerenciar perfis de acesso', 'administracao'),
('ADM_AUDIT', 'Auditoria', 'Acessar logs de auditoria', 'administracao'),
('ADM_CONFIG', 'Configurações', 'Configurações gerais do sistema', 'administracao'),

-- Saúde
('SAU_VIEW', 'Visualizar Saúde', 'Visualizar dados de saúde', 'saude'),
('SAU_EDIT', 'Editar Saúde', 'Editar dados de saúde', 'saude'),
('SAU_APPOINTMENTS', 'Agendamentos', 'Gerenciar agendamentos médicos', 'saude'),
('SAU_MEDICINE', 'Medicamentos', 'Controlar medicamentos', 'saude'),

-- Educação  
('EDU_VIEW', 'Visualizar Educação', 'Visualizar dados educacionais', 'educacao'),
('EDU_EDIT', 'Editar Educação', 'Editar dados educacionais', 'educacao'),
('EDU_STUDENTS', 'Alunos', 'Gerenciar alunos', 'educacao'),
('EDU_SCHOOLS', 'Escolas', 'Gerenciar escolas', 'educacao'),

-- Assistência Social
('ASS_VIEW', 'Visualizar Assistência', 'Visualizar dados assistenciais', 'assistencia'),
('ASS_EDIT', 'Editar Assistência', 'Editar dados assistenciais', 'assistencia'),
('ASS_FAMILIES', 'Famílias', 'Gerenciar famílias vulneráveis', 'assistencia'),
('ASS_BENEFITS', 'Benefícios', 'Gerenciar benefícios sociais', 'assistencia'),

-- Cidadão
('CID_SERVICES', 'Serviços Públicos', 'Acessar catálogo de serviços', 'cidadao'),
('CID_PROTOCOLS', 'Protocolos', 'Gerenciar protocolos pessoais', 'cidadao'),
('CID_DOCUMENTS', 'Documentos', 'Acessar documentos pessoais', 'cidadao'),
('CID_EVALUATIONS', 'Avaliações', 'Avaliar serviços utilizados', 'cidadao');

-- 4. Criar relacionamentos perfil x permissões

-- Super Admin - Todas as permissões
INSERT INTO public.perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    pa.id,
    p.id,
    true
FROM public.perfis_acesso pa
CROSS JOIN public.permissoes p
WHERE pa.nome = 'Super Administrador';

-- Admin - Permissões administrativas
INSERT INTO public.perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    pa.id,
    p.id,
    true
FROM public.perfis_acesso pa
CROSS JOIN public.permissoes p
WHERE pa.nome = 'Administrador'
AND p.codigo IN ('GAB_VIEW', 'GAB_EDIT', 'GAB_REPORTS', 'ADM_USERS', 'ADM_PROFILES', 'ADM_CONFIG');

-- Secretário - Permissões de sua área
INSERT INTO public.perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    pa.id,
    p.id,
    true
FROM public.perfis_acesso pa
CROSS JOIN public.permissoes p
WHERE pa.nome = 'Secretário Municipal'
AND p.codigo LIKE 'SAU_%' OR p.codigo LIKE 'EDU_%' OR p.codigo LIKE 'ASS_%';

-- Funcionário - Permissões básicas
INSERT INTO public.perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    pa.id,
    p.id,
    true
FROM public.perfis_acesso pa
CROSS JOIN public.permissoes p
WHERE pa.nome = 'Funcionário'
AND p.codigo LIKE '%_VIEW';

-- Cidadão - Apenas serviços públicos
INSERT INTO public.perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    pa.id,
    p.id,
    true
FROM public.perfis_acesso pa
CROSS JOIN public.permissoes p
WHERE pa.nome = 'Cidadão'
AND p.codigo LIKE 'CID_%';

-- 5. Verificar dados inseridos
SELECT 'Secretarias criadas' as item, COUNT(*) as total FROM public.secretarias
UNION ALL
SELECT 'Perfis de acesso' as item, COUNT(*) as total FROM public.perfis_acesso
UNION ALL  
SELECT 'Permissões criadas' as item, COUNT(*) as total FROM public.permissoes
UNION ALL
SELECT 'Relacionamentos perfil-permissão' as item, COUNT(*) as total FROM public.perfil_permissoes;

-- Script 02 concluído
SELECT 'Script 02 - Dados Iniciais executado com sucesso!' as resultado;