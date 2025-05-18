
import { FC } from "react";
import { Edit, LogOut } from "lucide-react";

export const UserProfile: FC = () => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxwcm9maWxlfGVufDB8fHx8MTc0NzQ1MTczMXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
          ></div>
        </div>
        <div className="flex-1 min-w-0">
          <h2
            className="text-sm font-medium text-gray-900 dark:text-white truncate"
          >
            Carlos Silva
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            Secretaria de Obras • Diretor
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex items-center justify-center space-x-2 text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors w-full">
          <Edit size={14} />
          <span>Editar perfil</span>
        </button>
        <button className="flex items-center justify-center space-x-2 text-xs px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors w-full">
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
