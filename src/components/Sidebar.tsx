import { FC } from "react";
import { SidebarLogo } from "./SidebarLogo";
import { UserProfile } from "./UserProfile";
import { Activity, Calendar, Pill, Heart, ArrowRightToLine, TestTube, User, Truck, 
  Book, School, Bus, FileText, MessageSquare, BookOpenText, Users, HandHeart, 
  Building, HandCoins, Package, Bell, Leaf, Tractor, Handshake, Wheat, Trophy, 
  MapPin, UserCheck, Headphones, Film, Compass, Landmark, Store, Map, Info, Home, 
  FileSearch, FileBadge, AlertTriangle, TreeDeciduous, Award, BarChart, FileWarning, 
  Search, Clock, Car, Signpost, Construction, Hammer, Camera, Lightbulb, Trash2, 
  Box, Image, Shield, FileCheck, BadgeHelp, Radio, CreditCard, Receipt, FileSpreadsheet, 
  Calculator, TrendingUp, ShoppingCart, ClipboardList, ShoppingBag, Briefcase, BadgeCheck, 
  UserPlus, ListChecks, Mail, Presentation, GraduationCap, Settings, Eye, LayoutDashboard, 
  FileOutput, UserCog, KeyRound, Lock, BellRing, Languages, Network, UsersRound, ShieldCheck, 
  FolderCog, ScrollText, Send, FileType2, Signature, FileArchive, PieChart, BarChart3, 
  Download, UserCircle2, Star, Edit, Inbox } from "lucide-react";
import { SidebarMenuItem, SidebarMenuGroup, SidebarSubmenu } from "./SidebarMenu";
import { Link } from "react-router-dom";

export const Sidebar: FC = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg hidden md:flex flex-col h-screen">
      {/* Topo fixo - Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <SidebarLogo />
      </div>
      
      {/* Meio com scroll - Menus */}
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarMenuGroup title="Portal do Cidadão" icon="🔷">
          <SidebarMenuItem 
            href="/" 
            active={window.location.pathname === "/"}
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
            active={window.location.pathname === "/chat"}
            icon={<MessageSquare className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
          >
            Chat
          </SidebarMenuItem>
          
          <SidebarMenuItem 
            href="/catalogo-servicos"
            active={window.location.pathname === "/catalogo-servicos"}
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
            active={window.location.pathname === "/meus-protocolos"}
            icon={<FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
          >
            Meus Protocolos
          </SidebarMenuItem>
          
          <SidebarMenuItem 
            href="/documentos-pessoais"
            active={window.location.pathname === "/documentos-pessoais"}
            icon={<FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
          >
            Documentos Pessoais
          </SidebarMenuItem>
          
          <SidebarMenuItem 
            href="/minhas-avaliacoes"
            active={window.location.pathname === "/minhas-avaliacoes"}
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
            <SidebarMenuItem href="/gabinete/atendimentos">
              <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Atendimentos
            </SidebarMenuItem>
            <SidebarMenuItem href="/gabinete/visao-geral">
              <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Visão Geral
            </SidebarMenuItem>
            <SidebarMenuItem href="/gabinete/mapa-demandas">
              <Map className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Mapa de Demandas
            </SidebarMenuItem>
            <SidebarMenuItem href="/gabinete/relatorios-executivos">
              <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Relatórios Executivos
            </SidebarMenuItem>
            <SidebarMenuItem href="/gabinete/ordens-setores">
              <FileOutput className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Ordens aos Setores
            </SidebarMenuItem>
            <SidebarMenuItem href="/gabinete/gerenciar-permissoes">
              <Lock className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Gerenciar Permissões
            </SidebarMenuItem>
          </SidebarSubmenu>

          <SidebarSubmenu 
            title="Correio Interno" 
            icon={<Mail className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
          >
            <SidebarMenuItem 
              href="/correio/caixa-entrada"
              active={window.location.pathname === "/correio/caixa-entrada"}
            >
              <Inbox className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Caixa de Entrada
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/correio/caixa-saida"
              active={window.location.pathname === "/correio/caixa-saida"}
            >
              <Send className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Caixa de Saída
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/correio/novo-email"
              active={window.location.pathname === "/correio/novo-email"}
            >
              <Edit className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Novo Email
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/correio/rascunhos"
              active={window.location.pathname === "/correio/rascunhos"}
            >
              <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Rascunhos
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/correio/lixeira"
              active={window.location.pathname === "/correio/lixeira"}
            >
              <Trash2 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Lixeira
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/correio/biblioteca-modelos"
              active={window.location.pathname === "/correio/biblioteca-modelos"}
            >
              <FileType2 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Biblioteca de Modelos
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/correio/assinaturas-digitais"
              active={window.location.pathname === "/correio/assinaturas-digitais"}
            >
              <Signature className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Assinaturas Digitais
            </SidebarMenuItem>
          </SidebarSubmenu>

          <SidebarSubmenu 
            title="Administração do Sistema" 
            icon={<Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
          >
            <SidebarMenuItem 
              href="/administracao/gerenciamento-usuarios"
              active={window.location.pathname === "/administracao/gerenciamento-usuarios"}
            >
              <UsersRound className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Gerenciamento de Usuários
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/administracao/perfis-permissoes"
              active={window.location.pathname === "/administracao/perfis-permissoes"}
            >
              <ShieldCheck className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Perfis e Permissões
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/administracao/setores-grupos"
              active={window.location.pathname === "/administracao/setores-grupos"}
            >
              <Network className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Setores e Grupos
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/administracao/configuracoes-gerais"
              active={window.location.pathname === "/administracao/configuracoes-gerais"}
            >
              <FolderCog className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Configurações Gerais
            </SidebarMenuItem>
            <SidebarMenuItem 
              href="/administracao/auditoria-acessos"
              active={window.location.pathname === "/administracao/auditoria-acessos"}
            >
              <ScrollText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Auditoria de Acessos
            </SidebarMenuItem>
          </SidebarSubmenu>

          <SidebarSubmenu 
            title="Relatórios e Indicadores" 
            icon={<BarChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
          >
            <SidebarMenuItem href="/relatorios/relatorios">
              <FileText className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Relatórios
            </SidebarMenuItem>
            <SidebarMenuItem href="/relatorios/indicadores-atendimentos">
              <PieChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Indicadores de Atendimentos
            </SidebarMenuItem>
            <SidebarMenuItem href="/relatorios/estatisticas-uso">
              <BarChart3 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Estatísticas de Uso
            </SidebarMenuItem>
            <SidebarMenuItem href="/relatorios/exportacoes">
              <Download className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Exportações (PDF/Excel)
            </SidebarMenuItem>
          </SidebarSubmenu>

          <SidebarSubmenu 
            title="Configurações do Usuário" 
            icon={<User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
          >
            <SidebarMenuItem href="/configuracoes/meu-perfil">
              <UserCircle2 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Meu Perfil
            </SidebarMenuItem>
            <SidebarMenuItem href="/configuracoes/trocar-senha">
              <KeyRound className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Trocar Senha
            </SidebarMenuItem>
            <SidebarMenuItem href="/configuracoes/preferencias-notificacao">
              <BellRing className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Preferências de Notificação
            </SidebarMenuItem>
            <SidebarMenuItem href="/configuracoes/idioma-acessibilidade">
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
            <SidebarMenuItem href="/saude/atendimentos">
              <Activity className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Atendimentos
            </SidebarMenuItem>
            <SidebarMenuItem href="/saude/agendamentos-medicos">
              <Calendar className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Agendamentos Médicos
            </SidebarMenuItem>
            <SidebarMenuItem href="/saude/controle-medicamentos">
              <Pill className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Controle de Medicamentos
            </SidebarMenuItem>
            <SidebarMenuItem href="/saude/campanhas-saude">
              <Heart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Campanhas de Saúde
            </SidebarMenuItem>
            <SidebarMenuItem href="/saude/programas-saude">
              <Heart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={3} />
              Programas de Saúde
            </SidebarMenuItem>
            <SidebarMenuItem href="/saude/encaminhamentos-tfd">
              <ArrowRightToLine className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Encaminhamentos TFD
            </SidebarMenuItem>
            <SidebarMenuItem href="/saude/exames">
              <TestTube className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Exames
            </SidebarMenuItem>
            <SidebarMenuItem href="/saude/acs">
              <User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              ACS - Agentes de Saúde
            </SidebarMenuItem>
            <SidebarMenuItem href="/saude/transporte-pacientes">
              <Truck className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Transporte de Pacientes
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
              Famílias Vulneráveis
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

          {/* ... keep existing code (other modules) */}
        </div>
      </div>
      
      {/* Parte inferior fixa - Perfil do usuário */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <UserProfile />
      </div>
    </div>
  );
};
