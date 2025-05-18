
import { FC } from "react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "./SidebarLogo";
import { UserProfile } from "./UserProfile";
import { Home, Settings, LayoutDashboard, FileText, Users, Mail, Briefcase } from "lucide-react";
import { 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export const AppSidebar: FC = () => {
  return (
    <Sidebar>
      {/* Fixed Logo Section */}
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>

      {/* Scrollable Menu Section */}
      <SidebarContent>
        {/* Main Navigation Menu */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Painel do Cidadão" isActive={true}>
              <Home className="mr-3 h-5 w-5" />
              <span>Painel do Cidadão</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Dashboard">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Relatórios">
              <FileText className="mr-3 h-5 w-5" />
              <span>Relatórios</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Usuários">
              <Users className="mr-3 h-5 w-5" />
              <span>Usuários</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Correio">
              <Mail className="mr-3 h-5 w-5" />
              <span>Correio Interno</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Gabinete">
              <Briefcase className="mr-3 h-5 w-5" />
              <span>Gabinete do Prefeito</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Configurações">
              <Settings className="mr-3 h-5 w-5" />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Fixed User Profile Section */}
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};
