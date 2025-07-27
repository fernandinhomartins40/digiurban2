
import { FC, ReactNode, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

type SidebarMenuItemProps = {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  exactMatch?: boolean;
  onSetRef?: (href: string, element: HTMLElement | null) => void;
};

export const SidebarMenuItem: FC<SidebarMenuItemProps> = ({ 
  href, 
  icon, 
  children,
  exactMatch = false,
  onSetRef
}) => {
  const location = useLocation();
  const itemRef = useRef<HTMLLIElement>(null);
  
  // Melhor lógica para detectar item ativo
  const isActive = (() => {
    const currentPath = location.pathname;
    
    if (exactMatch) {
      return currentPath === href;
    }
    
    // Para rotas que começam com /admin/ ou /cidadao/, normalizar para comparação
    const normalizeRoute = (route: string) => {
      // Se a rota atual tem prefixo admin/cidadao mas o href não tem, normalizar
      if (currentPath.startsWith('/admin/') && !href.startsWith('/admin/')) {
        return currentPath.replace('/admin', '');
      }
      if (currentPath.startsWith('/cidadao/') && !href.startsWith('/cidadao/')) {
        return currentPath.replace('/cidadao', '');
      }
      return currentPath;
    };
    
    const normalizedPath = normalizeRoute(currentPath);
    
    // Verificação direta
    if (normalizedPath === href || currentPath === href) {
      return true;
    }
    
    // Verificação por prefixo (para subpáginas)
    if (normalizedPath.startsWith(href) || currentPath.startsWith(href)) {
      return true;
    }
    
    return false;
  })();

  useEffect(() => {
    if (onSetRef && itemRef.current) {
      onSetRef(href, itemRef.current);
    }
    
    return () => {
      if (onSetRef) {
        onSetRef(href, null);
      }
    };
  }, [href, onSetRef]);

  return (
    <li ref={itemRef}>
      <Link
        to={href}
        className={cn(
          "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isActive
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
