
import { FC } from "react";
import { SidebarMenuGroup, SidebarMenuItem } from "@/components/SidebarMenu";
import { 
  Eye, 
  Users, 
  FileText, 
  MapPin, 
  ClipboardList,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  FileSearch,
  Bell
} from "lucide-react";

export const GabineteMenu: FC = () => {
  const pathname = window.location.pathname;
  
  return (
    <SidebarMenuGroup title="Gabinete do Prefeito" icon={<Eye className="h-4 w-4" />}>
      <SidebarMenuItem 
        href="/gabinete/visao-geral"
        icon={<Eye className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/visao-geral"}
      >
        Visão Geral
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/atendimentos"
        icon={<Users className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/atendimentos"}
      >
        Atendimentos
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/gerenciar-alertas"
        icon={<Bell className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/gerenciar-alertas"}
      >
        Alertas e Mensagens
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/ordens-setores"
        icon={<FileText className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/ordens-setores"}
      >
        Ordens aos Setores
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/mapa-demandas"
        icon={<MapPin className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/mapa-demandas"}
      >
        Mapa de Demandas
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/projetos-estrategicos"
        icon={<ClipboardList className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/projetos-estrategicos"}
      >
        Projetos Estratégicos
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/agenda-executiva"
        icon={<Calendar className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/agenda-executiva"}
      >
        Agenda Executiva
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/relatorios-executivos"
        icon={<BarChart3 className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/relatorios-executivos"}
      >
        Relatórios Executivos
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/monitoramento-kpis"
        icon={<BarChart3 className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/monitoramento-kpis"}
      >
        Monitoramento de KPIs
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/comunicacao-oficial"
        icon={<FileText className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/comunicacao-oficial"}
      >
        Comunicação Oficial
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/auditoria-transparencia"
        icon={<FileSearch className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/auditoria-transparencia"}
      >
        Auditoria e Transparência
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/gerenciar-permissoes"
        icon={<Shield className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/gerenciar-permissoes"}
      >
        Gerenciar Permissões
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/configuracoes-sistema"
        icon={<Settings className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/configuracoes-sistema"}
      >
        Configurações do Sistema
      </SidebarMenuItem>
    </SidebarMenuGroup>
  );
};
