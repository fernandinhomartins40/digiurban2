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
  Signpost
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
        } transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                }
              >
                Catálogo de Serviços
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
                title="Finanças" 
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                }
              >
                <SidebarMenuItem href="#">Emissão de Guias</SidebarMenuItem>
                <SidebarMenuItem href="#">Consulta de Débitos</SidebarMenuItem>
                <SidebarMenuItem href="#">Certidões Online</SidebarMenuItem>
                <SidebarMenuItem href="#">Parcelamento de Dívidas</SidebarMenuItem>
                <SidebarMenuItem href="#">Painel de Arrecadação</SidebarMenuItem>
                <SidebarMenuItem href="#">Projeções Financeiras</SidebarMenuItem>
              </SidebarSubmenu>

              <SidebarSubmenu 
                title="Compras" 
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                }
              >
                <SidebarMenuItem href="#">Solicitação de Materiais</SidebarMenuItem>
                <SidebarMenuItem href="#">Aprovações Pendentes</SidebarMenuItem>
                <SidebarMenuItem href="#">Fluxo de Compra</SidebarMenuItem>
                <SidebarMenuItem href="#">Cadastro de Fornecedores</SidebarMenuItem>
                <SidebarMenuItem href="#">Gestão de Orçamentos</SidebarMenuItem>
                <SidebarMenuItem href="#">Relatórios por Setor</SidebarMenuItem>
              </SidebarSubmenu>

              <SidebarSubmenu 
                title="Transporte e Mobilidade" 
                icon={<Bus className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              >
                <SidebarMenuItem href="#">
                  <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Atendimentos
                </SidebarMenuItem>
                <SidebarMenuItem href="#">
                  <MapPin className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Solicitação de Pontos de Ônibus
                </SidebarMenuItem>
                <SidebarMenuItem href="#">
                  <Car className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Cadastro de Transporte Especial
                </SidebarMenuItem>
                <SidebarMenuItem href="#">
                  <Signpost className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Sinalização Viária
                </SidebarMenuItem>
                <SidebarMenuItem href="#">
                  <Clock className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Horários de Transporte Público
                </SidebarMenuItem>
                <SidebarMenuItem href="#">
                  <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Credenciais de Estacionamento
                </SidebarMenuItem>
                <SidebarMenuItem href="#">
                  <Map className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Mapa de Linhas e Pontos
                </SidebarMenuItem>
              </SidebarSubmenu>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};
