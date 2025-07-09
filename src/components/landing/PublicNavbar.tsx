
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const PublicNavbar: FC = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-elegant border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-gradient gradient-primary bg-clip-text text-transparent">
                DigiUrbis
              </h1>
            </div>
            <div className="hidden md:block ml-12">
              <div className="flex items-baseline space-x-8">
                <a href="#benefits" className="text-gray-700 hover:text-purple-600 px-4 py-3 text-lg font-medium transition-all duration-300 hover-lift relative group">
                  Benefícios
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
                <a href="#modules" className="text-gray-700 hover:text-purple-600 px-4 py-3 text-lg font-medium transition-all duration-300 hover-lift relative group">
                  Módulos
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-purple-600 px-4 py-3 text-lg font-medium transition-all duration-300 hover-lift relative group">
                  Depoimentos
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
                <a href="#contact" className="text-gray-700 hover:text-purple-600 px-4 py-3 text-lg font-medium transition-all duration-300 hover-lift relative group">
                  Contato
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild className="hover-lift text-lg px-6 py-3 border-purple-200 text-purple-600 hover:bg-purple-50">
              <Link to="/admin">Demonstração</Link>
            </Button>
            <Button asChild className="hover-lift glow-primary text-lg px-6 py-3 gradient-primary text-white shadow-elegant">
              <Link to="/admin">Fazer Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
