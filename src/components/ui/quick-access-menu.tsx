
import { FC } from "react";
import { MessageSquare, Users, FileText, Settings, Bell } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Link } from "react-router-dom";

export const QuickAccessMenu: FC = () => {
  return (
    <div className="flex items-center space-x-2">
      {/* Chat Quick Access */}
      <Link to="/chat">
        <Button variant="outline" size="sm" className="relative">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>
      </Link>
      
      {/* Protocols Quick Access */}
      <Link to="/meus-protocolos">
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Protocolos
        </Button>
      </Link>
      
      {/* Services Quick Access */}
      <Link to="/catalogo-servicos">
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Serviços
        </Button>
      </Link>
    </div>
  );
};
