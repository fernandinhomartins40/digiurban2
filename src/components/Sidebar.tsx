
import { FC } from "react";
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Settings, 
  Users,
  Building2,
  Mail,
  BarChart3,
  Heart,
  GraduationCap,
  Handshake,
  Palette,
  Sprout,
  Trophy,
  MapPin,
  Building,
  Leaf,
  Map,
  Hammer,
  Lightbulb,
  Shield
} from "lucide-react";
import { SidebarMenuItem } from "./SidebarMenu/SidebarMenuItem";
import { SidebarMenuGroup } from "./SidebarMenu/SidebarMenuGroup";
import { SidebarSubmenu } from "./SidebarMenu/SidebarSubmenu";

export const Sidebar: FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <Building2 className="mr-2 h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Prefeitura
          </span>
        </div>

        <nav>
          <SidebarMenuGroup title="Principal">
            <SidebarMenuItem href="/" icon={<Home className="mr-3 h-5 w-5" />} exactMatch>
              Início
            </SidebarMenuItem>
            <SidebarMenuItem href="/chat" icon={<MessageSquare className="mr-3 h-5 w-5" />}>
              Chat Municipal
            </SidebarMenuItem>
            <SidebarMenuItem href="/catalogo-servicos" icon={<FileText className="mr-3 h-5 w-5" />}>
              Catálogo de Serviços
            </SidebarMenuItem>
            <SidebarMenuItem href="/meus-protocolos" icon={<FileText className="mr-3 h-5 w-5" />}>
              Meus Protocolos
            </SidebarMenuItem>
          </SidebarMenuGroup>

          <SidebarMenuGroup title="Gabinete">
            <SidebarSubmenu 
              title="Gabinete" 
              icon={<Building2 className="mr-3 h-5 w-5" />}
              basePath="/gabinete"
            >
              <SidebarMenuItem href="/gabinete/visao-geral">Visão Geral</SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/atendimentos">Atendimentos</SidebarMenuItem>
              <SidebarMenuItem href="/gabinete/gerenciar-alertas">Gerenciar Alertas</SidebarMenuItem>
            </SidebarSubmenu>
          </SidebarMenuGroup>

          <SidebarMenuGroup title="Comunicação">
            <SidebarSubmenu 
              title="Correio" 
              icon={<Mail className="mr-3 h-5 w-5" />}
              basePath="/correio"
            >
              <SidebarMenuItem href="/correio/caixa-entrada">Caixa de Entrada</SidebarMenuItem>
              <SidebarMenuItem href="/correio/caixa-saida">Caixa de Saída</SidebarMenuItem>
              <SidebarMenuItem href="/correio/novo-email">Novo Email</SidebarMenuItem>
            </SidebarSubmenu>
          </SidebarMenuGroup>

          <SidebarMenuGroup title="Secretarias">
            <SidebarSubmenu 
              title="Saúde" 
              icon={<Heart className="mr-3 h-5 w-5" />}
              basePath="/saude"
            >
              <SidebarMenuItem href="/saude/atendimentos">Atendimentos</SidebarMenuItem>
              <SidebarMenuItem href="/saude/agendamentos-medicos">Agendamentos Médicos</SidebarMenuItem>
            </SidebarSubmenu>
            
            <SidebarSubmenu 
              title="Educação" 
              icon={<GraduationCap className="mr-3 h-5 w-5" />}
              basePath="/educacao"
            >
              <SidebarMenuItem href="/educacao/matricula-alunos">Matrícula de Alunos</SidebarMenuItem>
              <SidebarMenuItem href="/educacao/gestao-escolar">Gestão Escolar</SidebarMenuItem>
            </SidebarSubmenu>
          </SidebarMenuGroup>

          <SidebarMenuGroup title="Administração">
            <SidebarSubmenu 
              title="Administração" 
              icon={<Users className="mr-3 h-5 w-5" />}
              basePath="/administracao"
            >
              <SidebarMenuItem href="/administracao/gerenciamento-usuarios">Gerenciamento de Usuários</SidebarMenuItem>
              <SidebarMenuItem href="/administracao/perfis-permissoes">Perfis e Permissões</SidebarMenuItem>
            </SidebarSubmenu>
            
            <SidebarSubmenu 
              title="Relatórios" 
              icon={<BarChart3 className="mr-3 h-5 w-5" />}
              basePath="/relatorios"
            >
              <SidebarMenuItem href="/relatorios/relatorios">Relatórios</SidebarMenuItem>
              <SidebarMenuItem href="/relatorios/indicadores-atendimentos">Indicadores</SidebarMenuItem>
            </SidebarSubmenu>
          </SidebarMenuGroup>

          <SidebarMenuGroup title="Configurações">
            <SidebarSubmenu 
              title="Configurações" 
              icon={<Settings className="mr-3 h-5 w-5" />}
              basePath="/configuracoes"
            >
              <SidebarMenuItem href="/configuracoes/meu-perfil">Meu Perfil</SidebarMenuItem>
              <SidebarMenuItem href="/configuracoes/trocar-senha">Trocar Senha</SidebarMenuItem>
              <SidebarMenuItem href="/configuracoes/preferencias-notificacao">Preferências</SidebarMenuItem>
            </SidebarSubmenu>
          </SidebarMenuGroup>
        </nav>
      </div>
    </aside>
  );
};
