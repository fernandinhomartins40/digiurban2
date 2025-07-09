import { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Footer: FC = () => {
  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-32 h-32 gradient-primary rounded-full opacity-5 animate-float"></div>
        <div className="absolute bottom-10 right-1/4 w-24 h-24 gradient-accent rounded-full opacity-5 animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 animate-slide-up">
            <h3 className="text-4xl font-bold mb-6 text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              DigiUrbis
            </h3>
            <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
              A plataforma completa para modernizar a gestão municipal e conectar 
              cidadãos com os serviços públicos de forma eficiente e transparente.
            </p>
            <div className="text-gray-400 text-lg">
              <p>© 2024 DigiUrbis. Todos os direitos reservados.</p>
            </div>
          </div>
          
          <div className="animate-fade-in-delay" style={{animationDelay: '0.1s'}}>
            <h4 className="text-xl font-bold mb-6 text-white">Produto</h4>
            <ul className="space-y-4 text-gray-300">
              <li><a href="#benefits" className="hover:text-purple-400 transition-all duration-300 hover-lift text-lg relative group">
                Benefícios
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><a href="#modules" className="hover:text-purple-400 transition-all duration-300 hover-lift text-lg relative group">
                Módulos
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><Link to="/admin" className="hover:text-purple-400 transition-all duration-300 hover-lift text-lg relative group">
                Demonstração
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link></li>
              <li><a href="#" className="hover:text-purple-400 transition-all duration-300 hover-lift text-lg relative group">
                Preços
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
            </ul>
          </div>
          
          <div className="animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
            <h4 className="text-xl font-bold mb-6 text-white">Suporte</h4>
            <ul className="space-y-4 text-gray-300">
              <li><a href="#" className="hover:text-purple-400 transition-all duration-300 hover-lift text-lg relative group">
                Central de Ajuda
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><a href="#" className="hover:text-purple-400 transition-all duration-300 hover-lift text-lg relative group">
                Documentação
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><a href="#" className="hover:text-purple-400 transition-all duration-300 hover-lift text-lg relative group">
                Contato
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><a href="#" className="hover:text-purple-400 transition-all duration-300 hover-lift text-lg relative group">
                Status do Sistema
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center animate-fade-in-delay">
          <div className="text-gray-300 text-lg">
            <a href="#" className="hover:text-purple-400 mr-8 transition-all duration-300 hover-lift">Política de Privacidade</a>
            <a href="#" className="hover:text-purple-400 mr-8 transition-all duration-300 hover-lift">Termos de Uso</a>
            <a href="#" className="hover:text-purple-400 transition-all duration-300 hover-lift">Cookies</a>
          </div>
          <div className="mt-6 sm:mt-0">
            <Button variant="outline" size="lg" asChild className="hover-lift bg-transparent text-purple-300 border-purple-400/50 hover:bg-purple-600/20 hover:text-white hover:border-purple-400 text-lg px-6 py-3 glow-accent">
              <Link to="/admin">Acessar Sistema</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
