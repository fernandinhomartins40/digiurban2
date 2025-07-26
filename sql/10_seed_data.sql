-- =====================================================
-- 10_seed_data.sql
-- Dados iniciais para o sistema
-- =====================================================

-- =====================================================
-- MÓDULOS DO SISTEMA
-- =====================================================

INSERT INTO modulos_sistema (codigo, nome, descricao, icone, rota, ordem) VALUES
('dashboard', 'Dashboard', 'Painel principal do sistema', 'LayoutDashboard', '/', 1),
('atendimentos', 'Atendimentos', 'Sistema de atendimento ao cidadão', 'Users', '/atendimentos', 2),
('protocolos', 'Protocolos', 'Protocolização de documentos', 'FileText', '/protocolos', 3),
('gabinete', 'Gabinete', 'Gestão executiva municipal', 'Crown', '/gabinete', 4),
('administracao', 'Administração', 'Gestão administrativa', 'Settings', '/administracao', 5),
('saude', 'Saúde', 'Gestão da saúde municipal', 'Heart', '/saude', 6),
('educacao', 'Educação', 'Gestão educacional', 'GraduationCap', '/educacao', 7),
('assistencia-social', 'Assistência Social', 'Programas sociais', 'HandHeart', '/assistencia-social', 8),
('agricultura', 'Agricultura', 'Desenvolvimento rural', 'Sprout', '/agricultura', 9),
('obras-publicas', 'Obras Públicas', 'Infraestrutura municipal', 'HardHat', '/obras-publicas', 10),
('meio-ambiente', 'Meio Ambiente', 'Gestão ambiental', 'Leaf', '/meio-ambiente', 11),
('turismo', 'Turismo', 'Desenvolvimento turístico', 'MapPin', '/turismo', 12),
('cultura', 'Cultura', 'Atividades culturais', 'Palette', '/cultura', 13),
('esportes', 'Esportes', 'Atividades esportivas', 'Trophy', '/esportes', 14),
('habitacao', 'Habitação', 'Programas habitacionais', 'Home', '/habitacao', 15),
('servicos-publicos', 'Serviços Públicos', 'Serviços urbanos', 'Truck', '/servicos-publicos', 16),
('planejamento-urbano', 'Planejamento Urbano', 'Desenvolvimento urbano', 'Map', '/planejamento-urbano', 17),
('seguranca-publica', 'Segurança Pública', 'Segurança municipal', 'Shield', '/seguranca-publica', 18),
('relatorios', 'Relatórios', 'Relatórios gerenciais', 'BarChart3', '/relatorios', 19),
('configuracoes', 'Configurações', 'Configurações pessoais', 'User', '/configuracoes', 20);

-- =====================================================
-- PERFIS DE ACESSO
-- =====================================================

INSERT INTO perfis_acesso (nome, descricao, tipo_usuario, nivel_hierarquico) VALUES
('Super Administrador', 'Acesso total ao sistema', 'super_admin', 0),
('Administrador Municipal', 'Gestão geral do município', 'admin', 1),
('Secretário Municipal', 'Gestão de secretaria', 'secretario', 2),
('Diretor de Departamento', 'Gestão departamental', 'diretor', 3),
('Coordenador de Setor', 'Coordenação setorial', 'coordenador', 4),
('Funcionário Público', 'Operações funcionais', 'funcionario', 5),
('Atendente', 'Atendimento ao público', 'atendente', 6),
('Cidadão', 'Acesso cidadão', 'cidadao', 7);

-- =====================================================
-- PERMISSÕES BÁSICAS
-- =====================================================

INSERT INTO permissoes (codigo, nome, descricao, modulo_id, recurso, acao) VALUES
-- Dashboard
('dashboard.visualizar', 'Visualizar Dashboard', 'Acessar painel principal', (SELECT id FROM modulos_sistema WHERE codigo = 'dashboard'), 'dashboard', 'visualizar'),

-- Atendimentos
('atendimentos.visualizar', 'Visualizar Atendimentos', 'Ver lista de atendimentos', (SELECT id FROM modulos_sistema WHERE codigo = 'atendimentos'), 'atendimentos', 'visualizar'),
('atendimentos.visualizar_todos', 'Visualizar Todos Atendimentos', 'Ver todos os atendimentos', (SELECT id FROM modulos_sistema WHERE codigo = 'atendimentos'), 'atendimentos', 'visualizar_todos'),
('atendimentos.criar', 'Criar Atendimentos', 'Criar novos atendimentos', (SELECT id FROM modulos_sistema WHERE codigo = 'atendimentos'), 'atendimentos', 'criar'),
('atendimentos.editar', 'Editar Atendimentos', 'Modificar atendimentos', (SELECT id FROM modulos_sistema WHERE codigo = 'atendimentos'), 'atendimentos', 'editar'),
('atendimentos.excluir', 'Excluir Atendimentos', 'Remover atendimentos', (SELECT id FROM modulos_sistema WHERE codigo = 'atendimentos'), 'atendimentos', 'excluir'),
('atendimentos.encaminhar', 'Encaminhar Atendimentos', 'Encaminhar para outros setores', (SELECT id FROM modulos_sistema WHERE codigo = 'atendimentos'), 'atendimentos', 'encaminhar'),
('atendimentos.responder', 'Responder Atendimentos', 'Responder aos cidadãos', (SELECT id FROM modulos_sistema WHERE codigo = 'atendimentos'), 'atendimentos', 'responder'),

-- Protocolos
('protocolos.visualizar', 'Visualizar Protocolos', 'Ver protocolos', (SELECT id FROM modulos_sistema WHERE codigo = 'protocolos'), 'protocolos', 'visualizar'),
('protocolos.visualizar_todos', 'Visualizar Todos Protocolos', 'Ver todos os protocolos', (SELECT id FROM modulos_sistema WHERE codigo = 'protocolos'), 'protocolos', 'visualizar_todos'),
('protocolos.criar', 'Criar Protocolos', 'Criar novos protocolos', (SELECT id FROM modulos_sistema WHERE codigo = 'protocolos'), 'protocolos', 'criar'),
('protocolos.editar', 'Editar Protocolos', 'Modificar protocolos', (SELECT id FROM modulos_sistema WHERE codigo = 'protocolos'), 'protocolos', 'editar'),

-- Usuários
('usuarios.visualizar', 'Visualizar Usuários', 'Ver lista de usuários', (SELECT id FROM modulos_sistema WHERE codigo = 'administracao'), 'usuarios', 'visualizar'),
('usuarios.criar', 'Criar Usuários', 'Criar novos usuários', (SELECT id FROM modulos_sistema WHERE codigo = 'administracao'), 'usuarios', 'criar'),
('usuarios.editar', 'Editar Usuários', 'Modificar usuários', (SELECT id FROM modulos_sistema WHERE codigo = 'administracao'), 'usuarios', 'editar'),
('usuarios.excluir', 'Excluir Usuários', 'Remover usuários', (SELECT id FROM modulos_sistema WHERE codigo = 'administracao'), 'usuarios', 'excluir'),

-- Secretarias
('secretarias.visualizar', 'Visualizar Secretarias', 'Ver secretarias', (SELECT id FROM modulos_sistema WHERE codigo = 'administracao'), 'secretarias', 'visualizar'),
('secretarias.editar', 'Editar Secretarias', 'Modificar secretarias', (SELECT id FROM modulos_sistema WHERE codigo = 'administracao'), 'secretarias', 'editar'),

-- Setores
('setores.visualizar', 'Visualizar Setores', 'Ver setores', (SELECT id FROM modulos_sistema WHERE codigo = 'administracao'), 'setores', 'visualizar'),
('setores.editar', 'Editar Setores', 'Modificar setores', (SELECT id FROM modulos_sistema WHERE codigo = 'administracao'), 'setores', 'editar'),

-- Relatórios
('relatorios.visualizar', 'Visualizar Relatórios', 'Acessar relatórios', (SELECT id FROM modulos_sistema WHERE codigo = 'relatorios'), 'relatorios', 'visualizar'),
('relatorios.exportar', 'Exportar Relatórios', 'Exportar dados', (SELECT id FROM modulos_sistema WHERE codigo = 'relatorios'), 'relatorios', 'exportar'),

-- Sistema
('sistema.configurar', 'Configurar Sistema', 'Alterar configurações gerais', (SELECT id FROM modulos_sistema WHERE codigo = 'administracao'), 'sistema', 'configurar'),
('historico.visualizar', 'Visualizar Histórico', 'Ver histórico de ações', NULL, 'historico', 'visualizar'),
('anexos.visualizar', 'Visualizar Anexos', 'Ver anexos', NULL, 'anexos', 'visualizar'),
('comentarios.visualizar_internos', 'Ver Comentários Internos', 'Visualizar comentários internos', NULL, 'comentarios', 'visualizar_internos');

-- =====================================================
-- PERMISSÕES POR PERFIL
-- =====================================================

-- Super Administrador: TODAS as permissões
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE tipo_usuario = 'super_admin'),
    p.id,
    true
FROM permissoes p;

-- Administrador Municipal: quase todas as permissões
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE tipo_usuario = 'admin'),
    p.id,
    true
FROM permissoes p
WHERE p.codigo NOT IN ('sistema.configurar'); -- Exceto configuração de sistema

-- Secretário: permissões de gestão da secretaria
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE tipo_usuario = 'secretario'),
    p.id,
    true
FROM permissoes p
WHERE p.codigo IN (
    'dashboard.visualizar',
    'atendimentos.visualizar_todos',
    'atendimentos.criar',
    'atendimentos.editar',
    'atendimentos.encaminhar',
    'atendimentos.responder',
    'protocolos.visualizar_todos',
    'protocolos.criar',
    'protocolos.editar',
    'usuarios.visualizar',
    'usuarios.editar',
    'relatorios.visualizar',
    'relatorios.exportar',
    'historico.visualizar',
    'anexos.visualizar',
    'comentarios.visualizar_internos'
);

-- Diretor: permissões departamentais
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE tipo_usuario = 'diretor'),
    p.id,
    true
FROM permissoes p
WHERE p.codigo IN (
    'dashboard.visualizar',
    'atendimentos.visualizar',
    'atendimentos.criar',
    'atendimentos.editar',
    'atendimentos.encaminhar',
    'atendimentos.responder',
    'protocolos.visualizar',
    'protocolos.criar',
    'relatorios.visualizar',
    'historico.visualizar',
    'anexos.visualizar',
    'comentarios.visualizar_internos'
);

-- Coordenador: permissões setoriais
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE tipo_usuario = 'coordenador'),
    p.id,
    true
FROM permissoes p
WHERE p.codigo IN (
    'dashboard.visualizar',
    'atendimentos.visualizar',
    'atendimentos.criar',
    'atendimentos.editar',
    'atendimentos.responder',
    'protocolos.visualizar',
    'protocolos.criar',
    'anexos.visualizar'
);

-- Funcionário: permissões operacionais
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE tipo_usuario = 'funcionario'),
    p.id,
    true
FROM permissoes p
WHERE p.codigo IN (
    'dashboard.visualizar',
    'atendimentos.visualizar',
    'atendimentos.criar',
    'atendimentos.responder',
    'protocolos.visualizar',
    'anexos.visualizar'
);

-- Atendente: permissões básicas de atendimento
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE tipo_usuario = 'atendente'),
    p.id,
    true
FROM permissoes p
WHERE p.codigo IN (
    'dashboard.visualizar',
    'atendimentos.visualizar',
    'atendimentos.criar',
    'atendimentos.responder',
    'protocolos.criar'
);

-- Cidadão: permissões mínimas
INSERT INTO perfil_permissoes (perfil_id, permissao_id, concedida)
SELECT 
    (SELECT id FROM perfis_acesso WHERE tipo_usuario = 'cidadao'),
    p.id,
    true
FROM permissoes p
WHERE p.codigo IN (
    'dashboard.visualizar',
    'atendimentos.criar',
    'protocolos.criar'
);

-- =====================================================
-- SECRETARIAS PADRÃO
-- =====================================================

INSERT INTO secretarias (codigo, nome, sigla, descricao) VALUES
('GAB', 'Gabinete do Prefeito', 'GAB', 'Gabinete executivo municipal'),
('ADMIN', 'Administração', 'ADMIN', 'Secretaria de Administração'),
('SAUDE', 'Secretaria de Saúde', 'SESAU', 'Gestão da saúde pública municipal'),
('EDUCACAO', 'Secretaria de Educação', 'SEMED', 'Gestão da educação municipal'),
('ASSIST_SOCIAL', 'Assistência Social', 'SEMAS', 'Secretaria de Assistência Social'),
('AGRICULTURA', 'Agricultura e Pecuária', 'SEAGRI', 'Desenvolvimento rural e agropecuário'),
('OBRAS', 'Obras Públicas', 'SEOBRAS', 'Infraestrutura e obras municipais'),
('MEIO_AMBIENTE', 'Meio Ambiente', 'SEMMA', 'Gestão ambiental municipal'),
('TURISMO', 'Turismo', 'SETUR', 'Desenvolvimento turístico'),
('CULTURA', 'Cultura', 'SECULT', 'Atividades e patrimônio cultural'),
('ESPORTES', 'Esportes', 'SEEL', 'Esportes e lazer'),
('HABITACAO', 'Habitação', 'SEHAB', 'Programas habitacionais'),
('SERVICOS', 'Serviços Públicos', 'SESERV', 'Serviços públicos urbanos'),
('PLANEJAMENTO', 'Planejamento Urbano', 'SEPLAN', 'Planejamento e desenvolvimento urbano'),
('SEGURANCA', 'Segurança Pública', 'SESEG', 'Segurança pública municipal');

-- =====================================================
-- CONFIGURAÇÕES PADRÃO DO SISTEMA
-- =====================================================

INSERT INTO configuracoes_sistema (chave, valor, tipo, descricao, grupo) VALUES
('sistema.nome', 'DigiUrban2', 'string', 'Nome do sistema', 'geral'),
('sistema.versao', '2.0.0', 'string', 'Versão do sistema', 'geral'),
('municipio.nome', 'Município', 'string', 'Nome do município', 'geral'),
('municipio.uf', 'UF', 'string', 'Estado do município', 'geral'),
('atendimento.prazo_resposta_padrao', '72', 'number', 'Prazo padrão para resposta (horas)', 'atendimento'),
('atendimento.prazo_resolucao_padrao', '720', 'number', 'Prazo padrão para resolução (horas)', 'atendimento'),
('notificacao.email_remetente', 'noreply@municipio.gov.br', 'string', 'Email remetente das notificações', 'email'),
('notificacao.email_nome_remetente', 'Sistema DigiUrban2', 'string', 'Nome do remetente dos emails', 'email'),
('chat.max_anexo_mb', '10', 'number', 'Tamanho máximo de anexo no chat (MB)', 'chat'),
('sistema.manutencao', 'false', 'boolean', 'Sistema em manutenção', 'geral'),
('sistema.registro_publico', 'true', 'boolean', 'Permitir registro público de cidadãos', 'geral');

-- =====================================================
-- CATEGORIAS DE ATENDIMENTO PADRÃO
-- =====================================================

INSERT INTO categorias_atendimento (codigo, nome, descricao, prazo_resposta_horas, prazo_resolucao_dias, cor_hex, icone) VALUES
('RECLAMACAO', 'Reclamação', 'Reclamações de serviços públicos', 24, 15, '#DC2626', 'AlertTriangle'),
('SOLICITACAO', 'Solicitação', 'Solicitações de serviços', 48, 30, '#2563EB', 'FileText'),
('INFORMACAO', 'Informação', 'Pedidos de informação', 24, 7, '#059669', 'Info'),
('DENUNCIA', 'Denúncia', 'Denúncias e irregularidades', 12, 10, '#DC2626', 'Shield'),
('SUGESTAO', 'Sugestão', 'Sugestões de melhoria', 72, 30, '#7C3AED', 'Lightbulb'),
('ELOGIO', 'Elogio', 'Elogios aos serviços', 72, 7, '#059669', 'Heart');

-- =====================================================
-- TEMPLATES DE NOTIFICAÇÃO
-- =====================================================

INSERT INTO notificacao_templates (codigo, nome, tipo, titulo_template, mensagem_template, email_subject_template, email_body_template, sms_template) VALUES
('novo_atendimento', 'Novo Atendimento', 'atendimento', 
 'Novo Atendimento #{numero}', 
 'Você recebeu um novo atendimento: {titulo}. Protocolo: {numero}',
 'Novo Atendimento - {numero}',
 'Prezado(a) {responsavel_nome},\n\nVocê recebeu um novo atendimento:\n\nProtocolo: {numero}\nTítulo: {titulo}\nSolicitante: {solicitante_nome}\n\nAcesse o sistema para mais detalhes.',
 'Novo atendimento {numero}: {titulo}'),

('atendimento_encaminhado', 'Atendimento Encaminhado', 'atendimento',
 'Atendimento Encaminhado', 
 'O atendimento {numero} foi encaminhado para você. Motivo: {motivo}',
 'Atendimento Encaminhado - {numero}',
 'Prezado(a) {responsavel_nome},\n\nO atendimento {numero} foi encaminhado para você.\n\nMotivo: {motivo}\n\nAcesse o sistema para mais detalhes.',
 'Atendimento {numero} encaminhado: {motivo}'),

('prazo_vencendo', 'Prazo Vencendo', 'prazo',
 'Prazo Vencendo', 
 'O atendimento {numero} tem prazo vencendo em {dias} dias',
 'Atenção: Prazo Vencendo - {numero}',
 'Prezado(a) {responsavel_nome},\n\nO atendimento {numero} tem prazo vencendo em {dias} dias.\n\nTítulo: {titulo}\n\nTome as providências necessárias.',
 'Prazo vencendo: {numero} ({dias} dias)');