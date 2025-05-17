import { FC, useState } from "react";
import { SidebarLogo } from "./SidebarLogo";
import { UserProfile } from "./UserProfile";
import { SidebarMenuItem, SidebarMenuGroup, SidebarSubmenu } from "./SidebarMenu";

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
                <SidebarMenuItem href="#">Consultas Agendadas</SidebarMenuItem>
                <SidebarMenuItem href="#">Medicamentos Distribuídos</SidebarMenuItem>
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
                <SidebarMenuItem href="#">Matrículas</SidebarMenuItem>
                <SidebarMenuItem href="#">Comunicação com Responsáveis</SidebarMenuItem>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
