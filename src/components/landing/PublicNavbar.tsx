
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const PublicNavbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-800">
                DigiUrbis
              </h1>
            </div>
            <div className="hidden md:block ml-12">
              <div className="flex items-baseline space-x-6">
                <a href="#benefits" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Benefícios
                </a>
                <a href="#modules" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Módulos
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Depoimentos
                </a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Contato
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" asChild className="text-sm px-4 py-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
              <Link to="/admin/login">Portal Admin</Link>
            </Button>
            <Button asChild className="text-sm px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors">
              <Link to="/cidadao/login">Portal Cidadão</Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a href="#benefits" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600">
                Benefícios
              </a>
              <a href="#modules" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600">
                Módulos
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600">
                Depoimentos
              </a>
              <a href="#contact" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600">
                Contato
              </a>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link to="/admin/login" className="block px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md text-center">
                  Portal Admin
                </Link>
                <Link to="/cidadao/login" className="block px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md text-center">
                  Portal Cidadão
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
