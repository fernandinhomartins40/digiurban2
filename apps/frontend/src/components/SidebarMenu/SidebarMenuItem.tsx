
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
  
  const isActive = exactMatch 
    ? location.pathname === href 
    : location.pathname.startsWith(href);

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
