import { FC } from "react";
import { SidebarLogo } from "./SidebarLogo";
import { UserProfile } from "./UserProfile";
import { SidebarMenuItem, SidebarMenuGroup, SidebarSubmenu } from "./SidebarMenu";
import { 
  BarChart2, 
  Building, 
  FileText, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  Archive, 
  Leaf, 
  Bug, 
  TreeDeciduous, 
  Lightbulb, 
  ChartLine, 
  Map, 
  ListOrdered, 
  ShieldCheck, 
  Settings, 
  Mail, 
  Pen, 
  History, 
  Folder, 
  MessageSquare, 
  Bell, 
  Loader, 
  Search, 
  Check, 
  User, 
  UserPlus, 
  Globe, 
  Lock, 
  Activity, 
  LayoutDashboard 
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
          {/* Portal do Cidadão */}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                    d="M7 21h10a2 2 0 002-2V9a2 2 0 012-2m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0M7 13h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
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
              <span className="mr-1">🏢</span> Módulos Setoriais
            </div>
            
            {/* Saúde */}
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
              <SidebarMenuItem href="#">Consultas Agendadas</SidebarMenuItem>
              <SidebarMenuItem href="#">Medicamentos Distribuídos</SidebarMenuItem>
              <SidebarMenuItem href="#">Campanhas de Saúde</SidebarMenuItem>
              <SidebarMenuItem href="#">Encaminhamentos (TFD)</SidebarMenuItem>
              <SidebarMenuItem href="#">Atendimento Domiciliar</SidebarMenuItem>
            </SidebarSubmenu>

            {/* Educação */}
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
              <SidebarMenuItem href="#">Matrículas</SidebarMenuItem>
              <SidebarMenuItem href="#">Comunicação com Responsáveis</SidebarMenuItem>
              <SidebarMenuItem href="#">Cardápio Escolar</SidebarMenuItem>
              <SidebarMenuItem href="#">Transporte Escolar</SidebarMenuItem>
              <SidebarMenuItem href="#">Ocorrências Escolares</SidebarMenuItem>
            </SidebarSubmenu>

            {/* Obras Públicas */}
            <SidebarSubmenu 
              title="Obras Públicas" 
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              }
              defaultOpen={true}
            >
              <SidebarMenuItem href="#">Acompanhamento de Obras</SidebarMenuItem>
              <SidebarMenuItem href="#">Registro Fotográfico</SidebarMenuItem>
              <SidebarMenuItem href="#">Solicitação de Intervenções</SidebarMenuItem>
              <SidebarMenuItem href="#">Cronograma de Obras</SidebarMenuItem>
              <SidebarMenuItem href="#">Feedback da População</SidebarMenuItem>
            </SidebarSubmenu>

            {/* Finanças */}
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
              <SidebarMenuItem href="#">Guias de Pagamento</SidebarMenuItem>
              <SidebarMenuItem href="#">Consulta de Débitos</SidebarMenuItem>
              <SidebarMenuItem href="#">Certidões Online</SidebarMenuItem>
              <SidebarMenuItem href="#">Parcelamentos</SidebarMenuItem>
              <SidebarMenuItem href="#">Relatórios Financeiros</SidebarMenuItem>
            </SidebarSubmenu>
            
            {/* Recursos Humanos */}
            <SidebarSubmenu 
              title="Recursos Humanos" 
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              }
            >
              <SidebarMenuItem href="#">Solicitações de Férias/Licenças</SidebarMenuItem>
              <SidebarMenuItem href="#">Declarações</SidebarMenuItem>
              <SidebarMenuItem href="#">Comunicação de Ocorrências</SidebarMenuItem>
              <SidebarMenuItem href="#">Ponto Eletrônico</SidebarMenuItem>
              <SidebarMenuItem href="#">Documentos Pessoais</SidebarMenuItem>
            </SidebarSubmenu>

            {/* Compras - Updated with correct items */}
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
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Solicitação de Materiais
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Aprovações de Compras
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Fornecedores
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Orçamentos
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <Archive className="mr-2 h-4 w-4" />
                  Estoque e Almoxarifado
                </span>
              </SidebarMenuItem>
            </SidebarSubmenu>
            
            {/* New: Meio Ambiente */}
            <SidebarSubmenu 
              title="Meio Ambiente" 
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  ></path>
                </svg>
              }
            >
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <Leaf className="mr-2 h-4 w-4" />
                  Solicitação de Licenças
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <Bug className="mr-2 h-4 w-4" />
                  Denúncias Ambientais
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <TreeDeciduous className="mr-2 h-4 w-4" />
                  Áreas Protegidas
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Conscientização
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <ChartLine className="mr-2 h-4 w-4" />
                  Indicadores Ambientais
                </span>
              </SidebarMenuItem>
            </SidebarSubmenu>
          </div>
          
          {/* New: Gabinete do Prefeito */}
          <SidebarMenuGroup title="Gabinete do Prefeito" icon="🏛">
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Building className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Visão Geral
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Map className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Mapa de Demandas
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Relatórios Executivos
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <ListOrdered className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Ordens aos Setores
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <ShieldCheck className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Protocolos Prioritários
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Gerenciar Permissões
              </span>
            </SidebarMenuItem>
          </SidebarMenuGroup>
          
          {/* New: Correio Interno */}
          <SidebarMenuGroup title="Correio Interno" icon="✉️">
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Criar Ofício
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Modelos de Documentos
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Pen className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Assinaturas Digitais
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <History className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Histórico de Envio/Recebimento
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Folder className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Arquivos e Pastas
              </span>
            </SidebarMenuItem>
          </SidebarMenuGroup>
          
          {/* New: Comunicação Integrada */}
          <SidebarMenuGroup title="Comunicação Integrada" icon="💬">
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Chat Interno
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Chat Cidadão ↔ Setor
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Bell className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Notificações Push/SMS/Email
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Modelos de Mensagens
              </span>
            </SidebarMenuItem>
          </SidebarMenuGroup>
          
          {/* New: Sistema de Protocolos */}
          <SidebarMenuGroup title="Sistema de Protocolos" icon="🧾">
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Todos os Protocolos
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Loader className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Aguardando Atendimento
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Search className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Em Análise
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Check className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Finalizados
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Minhas Responsabilidades
              </span>
            </SidebarMenuItem>
          </SidebarMenuGroup>
          
          {/* New: Administração do Sistema */}
          <SidebarMenuGroup title="Administração do Sistema" icon="📂">
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <UserPlus className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Cadastro de Usuários
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Perfis e Permissões
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Folder className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Setores e Grupos
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Configurações Gerais
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <ShieldCheck className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Auditoria de Acessos
              </span>
            </SidebarMenuItem>
          </SidebarMenuGroup>
          
          {/* New: Relatórios e Indicadores */}
          <SidebarMenuGroup title="Relatórios e Indicadores" icon="📈">
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <BarChart2 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Relatórios por Setor
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Dashboards de Atendimentos
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Estatísticas de Uso
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Exportações (PDF/Excel)
              </span>
            </SidebarMenuItem>
          </SidebarMenuGroup>
          
          {/* New: Configurações do Usuário */}
          <SidebarMenuGroup title="Configurações do Usuário" icon="⚙️">
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Meu Perfil
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Lock className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Trocar Senha
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Preferências de Notificação
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem href="#">
              <span className="flex items-center">
                <Globe className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Idioma e Acessibilidade
              </span>
            </SidebarMenuItem>
          </SidebarMenuGroup>
        </div>
      </div>
    </div>
  );
};
