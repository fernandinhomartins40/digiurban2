import { FC } from "react";
import { Link } from "react-router-dom";
import { SidebarLogo } from "./SidebarLogo";
import { UserProfile } from "./UserProfile";
import { SidebarMenuItem, SidebarMenuGroup, SidebarSubmenu } from "./SidebarMenu";
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
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Topo fixo - Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <SidebarLogo />
        </div>
        
        {/* Meio com scroll - Menus */}
        <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
          <SidebarMenuGroup title="Portal do Cidadão" icon="🔷">
            <SidebarMenuItem 
              href="/" 
              exactMatch={true}
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
              icon={<MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Chat
            </SidebarMenuItem>

            <SidebarMenuItem 
              href="/catalogo-servicos"
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
              icon={<FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Meus Protocolos
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              href="/documentos-pessoais"
              icon={<FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Documentos Pessoais
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              href="/minhas-avaliacoes"
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
              <SidebarMenuItem href="/gabinete/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/visao-geral">
                Visão Geral
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/mapa-demandas">
                Mapa de Demandas
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/relatorios-executivos">
                Relatórios Executivos
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/ordens-setores">
                Ordens aos Setores
              </SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/gerenciar-permissoes">
                Gerenciar Permissões
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Correio Interno" 
              icon={<Mail className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/correio"
            >
              <SidebarMenuItem href="/correio/caixa-entrada">
                Caixa de Entrada
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/caixa-saida">
                Caixa de Saída
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/novo-email">
                Novo Email
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/rascunhos">
                Rascunhos
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/lixeira">
                Lixeira
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/biblioteca-modelos">
                Biblioteca de Modelos
              </SidebarMenuItem>
              <SidebarMenuItem href="/correio/assinaturas-digitais">
                Assinaturas Digitais
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Administração do Sistema" 
              icon={<Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/administracao"
            >
              <SidebarMenuItem href="/administracao/gerenciamento-usuarios">
                Gerenciamento de Usuários
              </SidebarMenuItem>
              <SidebarMenuItem href="/administracao/perfis-permissoes">
                Perfis e Permissões
              </SidebarMenuItem>
              <SidebarMenuItem href="/administracao/setores-grupos">
                Setores e Grupos
              </SidebarMenuItem>
              <SidebarMenuItem href="/administracao/configuracoes-gerais">
                Configurações Gerais
              </SidebarMenuItem>
              <SidebarMenuItem href="/administracao/auditoria-acessos">
                Auditoria de Acessos
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Relatórios e Indicadores" 
              icon={<BarChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/relatorios"
            >
              <SidebarMenuItem href="/relatorios/relatorios">
                Relatórios
              </SidebarMenuItem>
              <SidebarMenuItem href="/relatorios/indicadores-atendimentos">
                Indicadores de Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/relatorios/estatisticas-uso">
                Estatísticas de Uso
              </SidebarMenuItem>
              <SidebarMenuItem href="/relatorios/exportacoes">
                Exportações (PDF/Excel)
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Configurações do Usuário" 
              icon={<User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/configuracoes"
            >
              <SidebarMenuItem href="/configuracoes/meu-perfil">
                Meu Perfil
              </SidebarMenuItem>
              <SidebarMenuItem href="/configuracoes/trocar-senha">
                Trocar Senha
              </SidebarMenuItem>
              <SidebarMenuItem href="/configuracoes/preferencias-notificacao">
                Preferências de Notificação
              </SidebarMenuItem>
              <SidebarMenuItem href="/configuracoes/idioma-acessibilidade">
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
              <SidebarMenuItem href="/saude/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/agendamentos-medicos">
                Agendamentos Médicos
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/controle-medicamentos">
                Controle de Medicamentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/campanhas-saude">
                Campanhas de Saúde
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/programas-saude">
                Programas de Saúde
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/encaminhamentos-tfd">
                Encaminhamentos TFD
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/exames">
                Exames
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/acs">
                ACS - Agentes de Saúde
              </SidebarMenuItem>
              <SidebarMenuItem href="/saude/transporte-pacientes">
                Transporte de Pacientes
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Educação" 
              icon={<Book className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/educacao"
            >
              <SidebarMenuItem href="/educacao/matricula-alunos">
                Matrícula de Alunos
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/gestao-escolar">
                Gestão Escolar
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/transporte-escolar">
                Transporte Escolar
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/merenda-escolar">
                Merenda Escolar
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/registro-ocorrencias">
                Registro de Ocorrências
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/calendario-escolar">
                Calendário Escolar
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Assistência Social" 
              icon={<HandHeart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/assistencia-social"
            >
              <SidebarMenuItem href="/assistencia-social/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/familias-vulneraveis">
                Famílias Vulneráveis
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/cras-e-creas">
                CRAS e CREAS
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/programas-sociais">
                Programas Sociais
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/gerenciamento-beneficios">
                Gerenciamento de Benefícios
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/entregas-emergenciais">
                Entregas Emergenciais
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/registro-visitas">
                Registro de Visitas
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Cultura" 
              icon={<Headphones className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/cultura"
            >
              <SidebarMenuItem href="/cultura/espacos-culturais">
                Espaços Culturais
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/projetos-culturais">
                Projetos Culturais
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/eventos">
                Eventos Culturais
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/grupos-artisticos">
                Grupos Artísticos
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/oficinas-cursos">
                Oficinas e Cursos
              </SidebarMenuItem>
              <SidebarMenuItem href="/cultura/manifestacoes-culturais">
                Manifestações Culturais
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Segurança Pública" 
              icon={<Shield className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/seguranca-publica"
            >
              <SidebarMenuItem href="/seguranca-publica/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/registro-ocorrencias">
                Registro de Ocorrências
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/apoio-guarda">
                Apoio da Guarda
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/mapa-pontos-criticos">
                Mapa de Pontos Críticos
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/alertas-seguranca">
                Alertas de Segurança
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/estatisticas-regionais">
                Estatísticas Regionais
              </SidebarMenuItem>
              <SidebarMenuItem href="/seguranca-publica/vigilancia-integrada">
                Vigilância Integrada
              </SidebarMenuItem>
            </SidebarSubmenu>

            {/* Continue with other submenus, each with proper basePath */}
            <SidebarSubmenu 
              title="Planejamento Urbano" 
              icon={<Building className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/planejamento-urbano"
            >
              <SidebarMenuItem href="/planejamento-urbano/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/aprovacao-projetos">
                Aprovação de Projetos
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/emissao-alvaras">
                Emissão de Alvarás
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/reclamacoes-denuncias">
                Reclamações e Denúncias
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/consultas-publicas">
                Consultas Públicas
              </SidebarMenuItem>
              <SidebarMenuItem href="/planejamento-urbano/mapa-urbano">
                Mapa Urbano
              </SidebarMenuItem>
            </SidebarSubmenu>

            {/* Add placeholder submenus for other modules with proper basePaths */}
            <SidebarSubmenu 
              title="Agricultura" 
              icon={<Leaf className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/agricultura"
            >
              <SidebarMenuItem href="/agricultura/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/agricultura/cadastro-produtores">
                Cadastro de Produtores
              </SidebarMenuItem>
              <SidebarMenuItem href="/agricultura/assistencia-tecnica">
                Assistência Técnica
              </SidebarMenuItem>
              <SidebarMenuItem href="/agricultura/programas-rurais">
                Programas Rurais
              </SidebarMenuItem>
              <SidebarMenuItem href="/agricultura/cursos-capacitacoes">
                Cursos e Capacitações
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Esportes" 
              icon={<Trophy className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/esportes"
            >
              <SidebarMenuItem href="/esportes/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/equipes-esportivas">
                Equipes Esportivas
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/competicoes-torneios">
                Competições e Torneios
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/atletas-federados">
                Atletas Federados
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/escolinhas-esportivas">
                Escolinhas Esportivas
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/eventos-esportivos">
                Eventos Esportivos
              </SidebarMenuItem>
              <SidebarMenuItem href="/esportes/infraestrutura-esportiva">
                Infraestrutura Esportiva
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Turismo" 
              icon={<Compass className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/turismo"
            >
              <SidebarMenuItem href="/turismo/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/pontos-turisticos">
                Pontos Turísticos
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/estabelecimentos-locais">
                Estabelecimentos Locais
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/programas-turisticos">
                Programas Turísticos
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/mapa-turistico">
                Mapa Turístico
              </SidebarMenuItem>
              <SidebarMenuItem href="/turismo/informacoes-turisticas">
                Informações Turísticas
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Habitação" 
              icon={<Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/habitacao"
            >
              <SidebarMenuItem href="/habitacao/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/habitacao/inscricoes">
                Inscrições
              </SidebarMenuItem>
              <SidebarMenuItem href="/habitacao/programas-habitacionais">
                Programas Habitacionais
              </SidebarMenuItem>
              <SidebarMenuItem href="/habitacao/unidades-habitacionais">
                Unidades Habitacionais
              </SidebarMenuItem>
              <SidebarMenuItem href="/habitacao/regularizacao-fundiaria">
                Regularização Fundiária
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Meio Ambiente" 
              icon={<TreeDeciduous className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/meio-ambiente"
            >
              <SidebarMenuItem href="/meio-ambiente/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/meio-ambiente/licencas-ambientais">
                Licenças Ambientais
              </SidebarMenuItem>
              <SidebarMenuItem href="/meio-ambiente/registro-denuncias">
                Registro de Denúncias
              </SidebarMenuItem>
              <SidebarMenuItem href="/meio-ambiente/areas-protegidas">
                Áreas Protegidas
              </SidebarMenuItem>
              <SidebarMenuItem href="/meio-ambiente/programas-ambientais">
                Programas Ambientais
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Obras Públicas" 
              icon={<Construction className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/obras-publicas"
            >
              <SidebarMenuItem href="/obras-publicas/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/obras-publicas/obras-intervencoes">
                Obras e Intervenções
              </SidebarMenuItem>
              <SidebarMenuItem href="/obras-publicas/progresso-obras">
                Progresso de Obras
              </SidebarMenuItem>
              <SidebarMenuItem href="/obras-publicas/mapa-obras">
                Mapa de Obras
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Serviços Públicos" 
              icon={<Wrench className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              basePath="/servicos-publicos"
            >
              <SidebarMenuItem href="/servicos-publicos/atendimentos">
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/iluminacao-publica">
                Iluminação Pública
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/limpeza-urbana">
                Limpeza Urbana
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/coleta-especial">
                Coleta Especial
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/problemas-com-foto">
                Problemas com Foto
              </SidebarMenuItem>
              <SidebarMenuItem href="/servicos-publicos/programacao-equipes">
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
