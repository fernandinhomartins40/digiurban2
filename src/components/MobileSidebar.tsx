import { FC, useState } from "react";
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
  Bulb, 
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
              <SidebarMenuItem href="#" 
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
              </SidebarSubmenu>
              
              {/* Other modules (simplified for mobile) */}
              <SidebarSubmenu 
                title="Compras" 
                icon={<ShoppingCart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              >
                <SidebarMenuItem href="#">Solicitação de Materiais</SidebarMenuItem>
                <SidebarMenuItem href="#">Fornecedores</SidebarMenuItem>
              </SidebarSubmenu>
              
              <SidebarSubmenu 
                title="Meio Ambiente" 
                icon={<Leaf className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />}
              >
                <SidebarMenuItem href="#">Denúncias Ambientais</SidebarMenuItem>
                <SidebarMenuItem href="#">Solicitação de Licenças</SidebarMenuItem>
              </SidebarSubmenu>
            </div>
            
            {/* Additional menu groups (simplified for mobile) */}
            <SidebarMenuGroup title="Gabinete do Prefeito" icon="🏛">
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Visão Geral
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <Map className="mr-2 h-4 w-4" />
                  Mapa de Demandas
                </span>
              </SidebarMenuItem>
            </SidebarMenuGroup>
            
            <SidebarMenuGroup title="Sistema de Protocolos" icon="🧾">
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Todos os Protocolos
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Finalizados
                </span>
              </SidebarMenuItem>
            </SidebarMenuGroup>
            
            <SidebarMenuGroup title="Configurações do Usuário" icon="⚙️">
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem href="#">
                <span className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Trocar Senha
                </span>
              </SidebarMenuItem>
            </SidebarMenuGroup>
          </div>
        </div>
      </div>
    </>
  );
};
