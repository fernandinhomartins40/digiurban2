
import { FC } from "react";
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
  Image
} from "lucide-react";

export const Sidebar: FC = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg hidden md:block transition-all duration-300 ease-in-out h-screen">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SidebarLogo />
        </div>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <UserProfile />
        </div>
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              }
            >
              Catálogo de Serviços
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2m0 0V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              }
            >
              Meus Protocolos
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
              }
            >
              Chat com Setores
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
                    d="M7 21h10a2 2 0 002-2V9a2 2 0 012-2m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              }
            >
              Documentos Pessoais
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  ></path>
                </svg>
              }
            >
              Minhas Avaliações
            </SidebarMenuItem>
          </SidebarMenuGroup>

          <div className="px-3 py-2 mt-3">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
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
              <SidebarMenuItem href="#">
                <Book className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Matrículas Online
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <School className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Escolas /CMEI's
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Bus className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Transporte Escolar
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Notas e Frequências
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Comunicação com Responsáveis
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <BookOpenText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Cardápios Escolares
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Registro de Ocorrências
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Calendar className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Calendário Escolar
              </SidebarMenuItem>
            </SidebarSubmenu>

            <SidebarSubmenu 
              title="Assistência Social" 
              icon={<HandHeart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
            >
              <SidebarMenuItem href="#">
                <Users className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Atendimentos
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <HandCoins className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Famílias Vulneraveis
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Building className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                CRAS e CREAS
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <HandHeart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Programas Sociais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <HandCoins className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
                Gerenciamento de Benefícios
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <Package className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Entregas Emergenciais
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
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

          </div>
        </div>
      </div>
    </div>
  );
};
