
import { FC, ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { 
  Shield, 
  FileText, 
  Users, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Camera,
  Eye 
} from "lucide-react";

type SidebarMenuItemProps = {
  href: string;
  icon?: ReactNode;
  active?: boolean;
  children: ReactNode;
};

export const SidebarMenuItem: FC<SidebarMenuItemProps> = ({ 
  href, 
  icon, 
  active = false, 
  children 
}) => {
  return (
    <li>
      <Link
        to={href}
        className={cn(
          "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
          active
            ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
      >
        {icon}
        {children}
      </Link>
    </li>
  );
};

type SidebarSubmenuProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

export const SidebarSubmenu: FC<SidebarSubmenuProps> = ({ 
  title, 
  icon, 
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details className="mt-1 group" open={isOpen}>
      <summary
        className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        {icon}
        <span className="flex-1">{title}</span>
        <svg
          className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </summary>
      <ul className="pl-10 mt-1 space-y-1">
        {children}
      </ul>
    </details>
  );
};

type SidebarMenuGroupProps = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
};

export const SidebarMenuGroup: FC<SidebarMenuGroupProps> = ({ title, icon, children }) => {
  return (
    <div className="px-3 py-2">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {title}
      </h3>
      <ul className="mt-2 space-y-1">
        {children}
      </ul>
    </div>
  );
};

export const SegurancaPublicaMenu: FC = () => {
  const pathname = window.location.pathname;
  
  return (
    <SidebarMenuGroup title="Segurança Pública" icon={<Shield className="h-4 w-4" />}>
      <SidebarMenuItem 
        href="/seguranca-publica/atendimentos"
        icon={<Shield className="mr-3 h-5 w-5" />}
        active={pathname === "/seguranca-publica/atendimentos"}
      >
        Atendimentos
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/seguranca-publica/registro-ocorrencias"
        icon={<FileText className="mr-3 h-5 w-5" />}
        active={pathname === "/seguranca-publica/registro-ocorrencias"}
      >
        Registro de Ocorrências
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/seguranca-publica/apoio-guarda"
        icon={<Users className="mr-3 h-5 w-5" />}
        active={pathname === "/seguranca-publica/apoio-guarda"}
      >
        Apoio da Guarda
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/seguranca-publica/mapa-pontos-criticos"
        icon={<MapPin className="mr-3 h-5 w-5" />}
        active={pathname === "/seguranca-publica/mapa-pontos-criticos"}
      >
        Mapa de Pontos Críticos
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/seguranca-publica/alertas-seguranca"
        icon={<AlertTriangle className="mr-3 h-5 w-5" />}
        active={pathname === "/seguranca-publica/alertas-seguranca"}
      >
        Alertas de Segurança
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/seguranca-publica/estatisticas-regionais"
        icon={<BarChart3 className="mr-3 h-5 w-5" />}
        active={pathname === "/seguranca-publica/estatisticas-regionais"}
      >
        Estatísticas Regionais
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/seguranca-publica/vigilancia-integrada"
        icon={<Camera className="mr-3 h-5 w-5" />}
        active={pathname === "/seguranca-publica/vigilancia-integrada"}
      >
        Vigilância Integrada
      </SidebarMenuItem>
    </SidebarMenuGroup>
  );
};

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
        icon={<FileText className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/projetos-estrategicos"}
      >
        Projetos Estratégicos
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/agenda-executiva"
        icon={<FileText className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/agenda-executiva"}
      >
        Agenda Executiva
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
        icon={<FileText className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/auditoria-transparencia"}
      >
        Auditoria e Transparência
      </SidebarMenuItem>
      <SidebarMenuItem 
        href="/gabinete/configuracoes-sistema"
        icon={<FileText className="mr-3 h-5 w-5" />}
        active={pathname === "/gabinete/configuracoes-sistema"}
      >
        Configurações do Sistema
      </SidebarMenuItem>
    </SidebarMenuGroup>
  );
};
