import { FC } from "react";
import { Link } from "react-router-dom";
import { SidebarLogo } from "./SidebarLogo";
import { UserProfile } from "./UserProfile";
import { SidebarMenuItem, SidebarMenuGroup, SidebarSubmenu } from "./SidebarMenu";
import { useSidebarScroll } from "../hooks/useSidebarScroll";
import { 
  Activity, 
  Calendar, 
  Pill, 
  Heart, 
  ArrowRightToLine, 
  TestTube, 
  User, 
  Truck,
  Book,
  School,
  Bus, 
  FileText,
  MessageSquare,
  BookOpenText,
  Users,
  HandHeart,
  Building,
  HandCoins,
  Package,
  Bell,
  Leaf,
  Tractor,
  Handshake,
  Wheat,
  Trophy,
  MapPin,
  UserCheck,
  Headphones,
  Film,
  Compass,
  Landmark,
  Store,
  Map,
  Info,
  Home,
  FileSearch,
  FileBadge,
  AlertTriangle,
  TreeDeciduous,
  Award,
  LucideLeafyGreen,
  BarChart,
  FileWarning,
  Search,
  Clock,
  Car,
  Signpost,
  Construction,
  Hammer,
  Camera,
  Lightbulb, 
  Trash2, 
  Box, 
  Image,
  Shield,
  FileCheck,
  BadgeHelp,
  Radio,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  Calculator,
  TrendingUp,
  ShoppingCart,
  ClipboardList,
  ShoppingBag,
  Briefcase,
  BadgeCheck,
  UserPlus,
  ListChecks,
  Mail,
  Presentation,
  GraduationCap,
  Settings,
  Eye,
  LayoutDashboard,
  FileOutput,
  UserCog,
  KeyRound,
  Lock,
  BellRing,
  Languages,
  Network,
  UsersRound,
  ShieldCheck,
  FolderCog,
  ScrollText,
  Mail as EnvelopeMail,
  Send,
  FileType2,
  Signature,
  FileArchive,
  PieChart,
  BarChart3,
  Download,
  UserCircle2,
  Star,
  Palette,
  Wrench
} from "lucide-react";

export const Sidebar: FC = () => {
  const { sidebarRef, setMenuItemRef } = useSidebarScroll();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Topo fixo - Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <SidebarLogo />
        </div>
        
        {/* Meio com scroll - Menus */}
        <div ref={sidebarRef} className="mt-5 flex-1 flex flex-col overflow-y-auto">
          {/* Portal do Cidadão */}
          <SidebarMenuGroup title="Portal do Cidadão" icon="🔷">
            <SidebarMenuItem 
              href="/" 
              exactMatch={true}
              onSetRef={setMenuItemRef}
              icon={
                <svg
                  className="mr-3 h-5 w-5 text-blue-500 dark:text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  ></path>
                </svg>
              }
            >
              Painel do Cidadão
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              href="/chat"
              onSetRef={setMenuItemRef}
              icon={<MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Chat
            </SidebarMenuItem>

            
            <SidebarMenuItem 
              href="/catalogo-servicos"
              onSetRef={setMenuItemRef}
              icon={
                <svg
                  className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              }
            >
              Catálogo de Serviços
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              href="/meus-protocolos"
              onSetRef={setMenuItemRef}
              icon={<FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Meus Protocolos
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              href="/documentos-pessoais"
              onSetRef={setMenuItemRef}
              icon={<FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Documentos Pessoais
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              href="/minhas-avaliacoes"
              onSetRef={setMenuItemRef}
              icon={<Star className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Minhas Avaliações
            </SidebarMenuItem>
          </SidebarMenuGroup>

          
          <div className="px-3 py-2 mt-3">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
              Área Administrativa
            </div>
            
            <SidebarSubmenu 
              title="Gabinete do Prefeito" 
              icon={<Briefcase className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/gabinete"
            >
              <SidebarMenuItem href="/gabinete/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/visao-geral" onSetRef={setMenuItemRef}>
                Visão Geral
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/mapa-demandas" onSetRef={setMenuItemRef}>
                Mapa de Demandas
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/relatorios-executivos" onSetRef={setMenuItemRef}>
                Relatórios Executivos
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/ordens-setores" onSetRef={setMenuItemRef}>
                Ordens aos Setores
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/gerenciar-permissoes" onSetRef={setMenuItemRef}>
                Gerenciar Permissões
              </SidebarMenuItem>
            </SidebarSubmenu>

            
            <SidebarSubmenu 
              title="Correio Interno" 
              icon={<Mail className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/correio"
            >
              <SidebarMenuItem href="/correio/caixa-entrada" onSetRef={setMenuItemRef}>
                Caixa de Entrada
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/caixa-saida" onSetRef={setMenuItemRef}>
                Caixa de Saída
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/novo-email" onSetRef={setMenuItemRef}>
                Novo Email
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/rascunhos" onSetRef={setMenuItemRef}>
                Rascunhos
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/lixeira" onSetRef={setMenuItemRef}>
                Lixeira
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/biblioteca-modelos" onSetRef={setMenuItemRef}>
                Biblioteca de Modelos
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/assinaturas-digitais" onSetRef={setMenuItemRef}>
                Assinaturas Digitais
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Administração do Sistema" 
              icon={<Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/administracao"
            >
              <SidebarMenuItem href="/administracao/gerenciamento-usuarios" onSetRef={setMenuItemRef}>
                Gerenciamento de Usuários
              </SidebarMenuItem>
              <SidebarMenuItem href="/administracao/perfis-permissoes" onSetRef={setMenuItemRef}>
                Perfis e Permissões
              </SidebarMenuItem>
              <SidebarMenuItem href="/administracao/setores-grupos" onSetRef={setMenuItemRef}>
                Setores e Grupos
              </SidebarMenuItem>
              <SidebarMenuItem href="/administracao/configuracoes-gerais" onSetRef={setMenuItemRef}>
                Configurações Gerais
              </SidebarMenuItem>
              <SidebarMenuItem href="/administracao/auditoria-acessos" onSetRef={setMenuItemRef}>
                Auditoria de Acessos
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Relatórios e Indicadores" 
              icon={<BarChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/relatorios"
            >
              <SidebarMenuItem href="/relatorios/relatorios" onSetRef={setMenuItemRef}>
                Relatórios
              </SidebarMenuItem>
              <SidebarMenuItem href="/relatorios/indicadores-atendimentos" onSetRef={setMenuItemRef}>
                Indicadores de Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/relatorios/estatisticas-uso" onSetRef={setMenuItemRef}>
                Estatísticas de Uso
              </SidebarMenuItem>
              <SidebarMenuItem href="/relatorios/exportacoes" onSetRef={setMenuItemRef}>
                Exportações (PDF/Excel)
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Configurações do Usuário" 
              icon={<User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/configuracoes"
            >
              <SidebarMenuItem href="/configuracoes/meu-perfil" onSetRef={setMenuItemRef}>
                Meu Perfil
              </SidebarMenuItem>
              <SidebarMenuItem href="/configuracoes/trocar-senha" onSetRef={setMenuItemRef}>
                Trocar Senha
              </SidebarMenuItem>
              <SidebarMenuItem href="/configuracoes/preferencias-notificacao" onSetRef={setMenuItemRef}>
                Preferências de Notificação
              </SidebarMenuItem>
              <SidebarMenuItem href="/configuracoes/idioma-acessibilidade" onSetRef={setMenuItemRef}>
                Idioma e Acessibilidade
              </SidebarMenuItem>
            </SidebarSubmenu>

            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center mt-4">
              Módulos Setoriais
            </div>
            
            <SidebarSubmenu 
              title="Saúde" 
              icon={<Heart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/saude"
            >
              <SidebarMenuItem href="/saude/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/agendamentos-medicos" onSetRef={setMenuItemRef}>
                Agendamentos Médicos
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/controle-medicamentos" onSetRef={setMenuItemRef}>
                Controle de Medicamentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/campanhas-saude" onSetRef={setMenuItemRef}>
                Campanhas de Saúde
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/programas-saude" onSetRef={setMenuItemRef}>
                Programas de Saúde
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/encaminhamentos-tfd" onSetRef={setMenuItemRef}>
                Encaminhamentos TFD
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/exames" onSetRef={setMenuItemRef}>
                Exames
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/acs" onSetRef={setMenuItemRef}>
                ACS - Agentes de Saúde
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/transporte-pacientes" onSetRef={setMenuItemRef}>
                Transporte de Pacientes
              </SidebarMenuItem>
            </SidebarSubmenu>

            
            <SidebarSubmenu 
              title="Educação" 
              icon={<Book className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/educacao"
            >
              <SidebarMenuItem href="/educacao/matricula-alunos" onSetRef={setMenuItemRef}>
                Matrícula de Alunos
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/gestao-escolar" onSetRef={setMenuItemRef}>
                Gestão Escolar
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/transporte-escolar" onSetRef={setMenuItemRef}>
                Transporte Escolar
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/merenda-escolar" onSetRef={setMenuItemRef}>
                Merenda Escolar
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/registro-ocorrencias" onSetRef={setMenuItemRef}>
                Registro de Ocorrências
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/calendario-escolar" onSetRef={setMenuItemRef}>
                Calendário Escolar
              </SidebarMenuItem>
            </SidebarSubmenu>

            
            <SidebarSubmenu 
              title="Assistência Social" 
              icon={<HandHeart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/assistencia-social"
            >
              <SidebarMenuItem href="/assistencia-social/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/familias-vulneraveis" onSetRef={setMenuItemRef}>
                Famílias Vulneráveis
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/cras-e-creas" onSetRef={setMenuItemRef}>
                CRAS e CREAS
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/programas-sociais" onSetRef={setMenuItemRef}>
                Programas Sociais
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/gerenciamento-beneficios" onSetRef={setMenuItemRef}>
                Gerenciamento de Benefícios
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/entregas-emergenciais" onSetRef={setMenuItemRef}>
                Entregas Emergenciais
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/registro-visitas" onSetRef={setMenuItemRef}>
                Registro de Visitas
              </SidebarMenuItem>
            </SidebarSubmenu>

            
            <SidebarSubmenu 
              title="Cultura" 
              icon={<Headphones className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/cultura"
            >
              <SidebarMenuItem href="/cultura/espacos-culturais" onSetRef={setMenuItemRef}>
                Espaços Culturais
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/projetos-culturais" onSetRef={setMenuItemRef}>
                Projetos Culturais
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/eventos" onSetRef={setMenuItemRef}>
                Eventos
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/grupos-artisticos" onSetRef={setMenuItemRef}>
                Grupos Artísticos
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/oficinas-cursos" onSetRef={setMenuItemRef}>
                Oficinas e Cursos
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/manifestacoes-culturais" onSetRef={setMenuItemRef}>
                Manifestações Culturais
              </SidebarMenuItem>
            </SidebarSubmenu>

            
            <SidebarSubmenu 
              title="Segurança Pública" 
              icon={<Shield className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/seguranca-publica"
            >
              <SidebarMenuItem href="/seguranca-publica/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/registro-ocorrencias" onSetRef={setMenuItemRef}>
                Registro de Ocorrências
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/apoio-guarda" onSetRef={setMenuItemRef}>
                Apoio da Guarda
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/mapa-pontos-criticos" onSetRef={setMenuItemRef}>
                Mapa de Pontos Críticos
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/alertas-seguranca" onSetRef={setMenuItemRef}>
                Alertas de Segurança
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/estatisticas-regionais" onSetRef={setMenuItemRef}>
                Estatísticas Regionais
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/vigilancia-integrada" onSetRef={setMenuItemRef}>
                Vigilância Integrada
              </SidebarMenuItem>
            </SidebarSubmenu>

            {/* Continue with other submenus, each with proper basePath */}
            <SidebarSubmenu 
              title="Planejamento Urbano" 
              icon={<Building className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/planejamento-urbano"
            >
              <SidebarMenuItem href="/planejamento-urbano/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/aprovacao-projetos" onSetRef={setMenuItemRef}>
                Aprovação de Projetos
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/emissao-alvaras" onSetRef={setMenuItemRef}>
                Emissão de Alvarás
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/reclamacoes-denuncias" onSetRef={setMenuItemRef}>
                Reclamações e Denúncias
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/consultas-publicas" onSetRef={setMenuItemRef}>
                Consultas Públicas
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/mapa-urbano" onSetRef={setMenuItemRef}>
                Mapa Urbano
              </SidebarMenuItem>
            </SidebarSubmenu>

            {/* Add placeholder submenus for other modules with proper basePaths */}
            <SidebarSubmenu 
              title="Agricultura" 
              icon={<Leaf className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/agricultura"
            >
              <SidebarMenuItem href="/agricultura/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/agricultura/cadastro-produtores" onSetRef={setMenuItemRef}>
                Cadastro de Produtores
              </SidebarMenuItem>
              <SidebarMenuItem href="/agricultura/assistencia-tecnica" onSetRef={setMenuItemRef}>
                Assistência Técnica
              </SidebarMenuItem>
              <SidebarMenuItem href="/agricultura/programas-rurais" onSetRef={setMenuItemRef}>
                Programas Rurais
              </SidebarMenuItem>
              <SidebarMenuItem href="/agricultura/cursos-capacitacoes" onSetRef={setMenuItemRef}>
                Cursos e Capacitações
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Esportes" 
              icon={<Trophy className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/esportes"
            >
              <SidebarMenuItem href="/esportes/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/equipes-esportivas" onSetRef={setMenuItemRef}>
                Equipes Esportivas
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/competicoes-torneios" onSetRef={setMenuItemRef}>
                Competições e Torneios
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/atletas-federados" onSetRef={setMenuItemRef}>
                Atletas Federados
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/escolinhas-esportivas" onSetRef={setMenuItemRef}>
                Escolinhas Esportivas
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/eventos-esportivos" onSetRef={setMenuItemRef}>
                Eventos Esportivos
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/infraestrutura-esportiva" onSetRef={setMenuItemRef}>
                Infraestrutura Esportiva
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Turismo" 
              icon={<Compass className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/turismo"
            >
              <SidebarMenuItem href="/turismo/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/pontos-turisticos" onSetRef={setMenuItemRef}>
                Pontos Turísticos
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/estabelecimentos-locais" onSetRef={setMenuItemRef}>
                Estabelecimentos Locais
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/programas-turisticos" onSetRef={setMenuItemRef}>
                Programas Turísticos
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/mapa-turistico" onSetRef={setMenuItemRef}>
                Mapa Turístico
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/informacoes-turisticas" onSetRef={setMenuItemRef}>
                Informações Turísticas
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Habitação" 
              icon={<Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/habitacao"
            >
              <SidebarMenuItem href="/habitacao/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/habitacao/inscricoes" onSetRef={setMenuItemRef}>
                Inscrições
              </SidebarMenuItem>
              <SidebarMenuItem href="/habitacao/programas-habitacionais" onSetRef={setMenuItemRef}>
                Programas Habitacionais
              </SidebarMenuItem>
              <SidebarMenuItem href="/habitacao/unidades-habitacionais" onSetRef={setMenuItemRef}>
                Unidades Habitacionais
              </SidebarMenuItem>
              <SidebarMenuItem href="/habitacao/regularizacao-fundiaria" onSetRef={setMenuItemRef}>
                Regularização Fundiária
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Meio Ambiente" 
              icon={<TreeDeciduous className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/meio-ambiente"
            >
              <SidebarMenuItem href="/meio-ambiente/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/meio-ambiente/licencas-ambientais" onSetRef={setMenuItemRef}>
                Licenças Ambientais
              </SidebarMenuItem>
              <SidebarMenuItem href="/meio-ambiente/registro-denuncias" onSetRef={setMenuItemRef}>
                Registro de Denúncias
              </SidebarMenuItem>
              <SidebarMenuItem href="/meio-ambiente/areas-protegidas" onSetRef={setMenuItemRef}>
                Áreas Protegidas
              </SidebarMenuItem>
              <SidebarMenuItem href="/meio-ambiente/programas-ambientais" onSetRef={setMenuItemRef}>
                Programas Ambientais
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Obras Públicas" 
              icon={<Construction className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/obras-publicas"
            >
              <SidebarMenuItem href="/obras-publicas/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/obras-publicas/obras-intervencoes" onSetRef={setMenuItemRef}>
                Obras e Intervenções
              </SidebarMenuItem>
              <SidebarMenuItem href="/obras-publicas/progresso-obras" onSetRef={setMenuItemRef}>
                Progresso de Obras
              </SidebarMenuItem>
              <SidebarMenuItem href="/obras-publicas/mapa-obras" onSetRef={setMenuItemRef}>
                Mapa de Obras
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Serviços Públicos" 
              icon={<Wrench className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/servicos-publicos"
            >
              <SidebarMenuItem href="/servicos-publicos/atendimentos" onSetRef={setMenuItemRef}>
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/iluminacao-publica" onSetRef={setMenuItemRef}>
                Iluminação Pública
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/limpeza-urbana" onSetRef={setMenuItemRef}>
                Limpeza Urbana
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/coleta-especial" onSetRef={setMenuItemRef}>
                Coleta Especial
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/problemas-com-foto" onSetRef={setMenuItemRef}>
                Problemas com Foto
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/programacao-equipes" onSetRef={setMenuItemRef}>
                Programação de Equipes
              </SidebarMenuItem>
            </SidebarSubmenu>
          </div>
        </div>
        
        {/* Parte inferior fixa - Perfil do usuário */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <UserProfile />
        </div>
      </div>
    </div>
  );
};
