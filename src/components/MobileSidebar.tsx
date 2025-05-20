import { FC, useState } from "react";
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
  Send,
  FileType2,
  Signature,
  FileArchive,
  PieChart,
  BarChart3,
  Download,
  UserCircle2,
  Star
} from "lucide-react";

export const MobileSidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile sidebar trigger */}
      <button
        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={toggleSidebar}
      >
        <svg
          className="h-6 w-6"
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
      </button>

      {/* Backdrop */}
      <div
        className={`md:hidden absolute inset-y-0 left-0 z-40 bg-gray-600 bg-opacity-75 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        onClick={toggleSidebar}
      ></div>

      {/* Mobile sidebar */}
      <div
        className={`md:hidden absolute inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col h-full`}
      >
        {/* Topo fixo - Logo e Botão de fechar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <SidebarLogo />
            <button
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleSidebar}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Meio com scroll - Menus */}
        <div className="flex-1 overflow-y-auto py-2">
          <SidebarMenuGroup title="Portal do Cidadão" icon="🔷">
            <SidebarMenuItem 
              href="#" 
              active={true}
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
              href="#"
              icon={<MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Chat
            </SidebarMenuItem>

            <SidebarMenuItem 
              href="#"
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
              href="#"
              icon={<FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Meus Protocolos
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              href="#"
              icon={<FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              Documentos Pessoais
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              href="#"
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
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Visão Geral
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Map className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Mapa de Demandas
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Relatórios Executivos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileOutput className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Ordens aos Setores
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Lock className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Gerenciar Permissões
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Correio Interno" 
              icon={<Mail className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Chat
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <EnvelopeMail className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Email Interno
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Send className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Criador de Ofícios
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileType2 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Biblioteca de Modelos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Signature className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Assinaturas Digitais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileArchive className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Protocolos
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Administração do Sistema" 
              icon={<Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <UsersRound className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Gerenciamento de Usuários
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <ShieldCheck className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Perfis e Permissões
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Network className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Setores e Grupos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FolderCog className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Configurações Gerais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <ScrollText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Auditoria de Acessos
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Relatórios e Indicadores" 
              icon={<BarChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Relatórios
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <PieChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Indicadores de Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <BarChart3 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Estatísticas de Uso
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Download className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Exportações (PDF/Excel)
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Configurações do Usuário" 
              icon={<User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <UserCircle2 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Meu Perfil
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <KeyRound className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Trocar Senha
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <BellRing className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Preferências de Notificação
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Languages className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Idioma e Acessibilidade
              </SidebarMenuItem>
            </SidebarSubmenu>

            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center mt-4">
              Módulos Setoriais
            </div>
            
            <SidebarSubmenu 
              title="Saúde" 
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              }
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Calendar className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Agendamentos Médicos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Pill className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Controle de Medicamentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Heart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Campanhas de Saúde
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Heart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Programas de Saúde
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <ArrowRightToLine className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Encaminhamentos TFD
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <TestTube className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Exames
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                ACS - Agentes de Saúde
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Truck className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Transporte de Pacientes
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Educação" 
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              }
            >
              <SidebarMenuItem href="/educacao/matriculas-online">
                <Book className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Matrículas Online
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/escolas">
                <School className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Escolas /CMEI's
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/transporte-escolar">
                <Bus className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Transporte Escolar
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/notas-frequencias">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Notas e Frequências
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/comunicacao-responsaveis">
                <MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Comunicação com Responsáveis
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/cardapios-escolares">
                <BookOpenText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Cardápios Escolares
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/registro-ocorrencias">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Registro de Ocorrências
              </SidebarMenuItem>
              <SidebarMenuItem href="/educacao/calendario-escolar">
                <Calendar className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Calendário Escolar
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Assistência Social" 
              icon={<HandHeart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="/assistencia-social/atendimentos">
                <Users className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/familias-vulneraveis">
                <HandCoins className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Famílias Vulneraveis
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/cras-creas">
                <Building className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                CRAS e CREAS
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/programas-sociais">
                <HandHeart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Programas Sociais
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/gerenciamento-beneficios">
                <HandCoins className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Gerenciamento de Benefícios
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/entregas-emergenciais">
                <Package className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Entregas Emergenciais
              </SidebarMenuItem>
              <SidebarMenuItem href="/assistencia-social/registro-visitas">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Registro de Visitas
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Agricultura" 
              icon={<Leaf className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Users className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Tractor className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Cadastro de Produtores
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Handshake className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Assistência Técnica
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Wheat className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Programas Rurais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Book className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Cursos e Capacitações
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Esportes" 
              icon={<Trophy className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <UserCheck className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atletas e Professores
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <School className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Aulas e Treinamentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Trophy className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Campeonatoes e Competições
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <MapPin className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Espaços Esportivos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Calendar className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Agendamento de Espaços
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Registro de Resultados
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Cultura" 
              icon={<Headphones className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Headphones className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Book className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Cursos e Oficinas
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Building className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Espaços Culturais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Solicitação de Espaços
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Users className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Grupos Artísticos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Film className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Eventos Culturais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Calendar className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Agenda de Eventos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Book className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Programas Culturais
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Turismo" 
              icon={<Compass className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Landmark className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Pontos Turísticos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Store className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Estabelecimentos Locais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Compass className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Programas Turisticos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Map className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Mapa Turistico
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Info className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Informações Turisticas
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Habitação" 
              icon={<Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Inscrições
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Building className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Programas Habitacionais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Unidades Habitacionais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileSearch className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Regularização Fundiária
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Meio Ambiente" 
              icon={<Leaf className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileBadge className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Licenças
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <AlertTriangle className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Registro de Denúncias
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <TreeDeciduous className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Cadastro de Áreas Protegidas
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Leaf className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Programas Ambientais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Award className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Campanhas Ambientais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <BarChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Indicadores Ambientais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Map className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Mapa de Ocorrências
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Planejamento Urbano" 
              icon={<Building className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileSearch className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Aprovação de Projetos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Emissão de Alvarás
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Reclamações e Denuncias
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Search className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Consultas Públicas
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Map className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Mapa Urbano
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Obras Públicas" 
              icon={<Construction className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Hammer className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Obras e Pequenas Intervenções
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <BarChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Progresso de Obras
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Map className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Mapa de Obras
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Feedback dos Cidadãos
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Serviços Públicos" 
              icon={<Construction className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Lightbulb className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Iluminação Pública
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Trash2 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Limpeza Urbana
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Box className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Coleta Especial
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Image className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Problemas com Foto
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Calendar className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Programação de Equipes
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Segurança Pública" 
              icon={<Shield className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileCheck className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Registro de Ocorrências
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <BadgeHelp className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Apoio da Guarda
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Map className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Mapa de Pontos Críticos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Bell className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Alertas de Segurança
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <BarChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Estatísticas Regionais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Radio className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Vigilância Integrada
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Gabinete do Prefeito" 
              icon={<Briefcase className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Calendar className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Agenda do Prefeito
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <UserPlus className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Solicitação de Audiências
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <ListChecks className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Acompanhamento de Projetos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Mail className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Comunicações Oficiais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Presentation className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Eventos Institucionais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <GraduationCap className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Projetos Especiais
              </SidebarMenuItem>
            </SidebarSubmenu>
          </div>
        </div>
        
        {/* Parte inferior fixa - Perfil do usuário */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <UserProfile />
        </div>
      </div>
    </>
  );
};
