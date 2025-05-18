
import { FC, ReactNode } from "react";
import { Header } from "./Header";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <SidebarInset className="flex-1 overflow-auto p-4">
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};
