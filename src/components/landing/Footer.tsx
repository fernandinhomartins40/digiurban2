import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Footer: FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    if (user && profile && profile.tipo_usuario !== 'cidadao') {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const handleCidadaoAccess = () => {
    if (user && profile && profile.tipo_usuario === 'cidadao') {
      navigate('/cidadao/dashboard');
    } else {
      navigate('/cidadao/login');
    }
  };

  return (
    <footer id="contact" className="gradient-primary text-white py-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-48 h-48 gradient-accent rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 gradient-secondary rounded-full opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 gradient-warm rounded-full opacity-5 animate-float" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 animate-slide-up">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
              Digiurban
            </h3>
            <p className="text-white/90 mb-8 max-w-md text-lg leading-relaxed drop-shadow-md">
              A plataforma completa para modernizar a gestão municipal e conectar 
              cidadãos com os serviços públicos de forma eficiente e transparente.
            </p>
            <div className="text-white/70 text-lg">
              <p>© 2024 Digiurban. Todos os direitos reservados.</p>
            </div>
          </div>
          
          <div className="animate-fade-in-delay" style={{animationDelay: '0.1s'}}>
            <h4 className="text-xl font-bold mb-6 text-white drop-shadow-md">Produto</h4>
            <ul className="space-y-4 text-white/80">
              <li><a href="#benefits" className="hover:text-yellow-300 transition-all duration-300 hover-lift text-lg relative group">
                Benefícios
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-300 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><a href="#modules" className="hover:text-yellow-300 transition-all duration-300 hover-lift text-lg relative group">
                Módulos
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-300 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><button onClick={handleAdminAccess} disabled={loading} className="hover:text-yellow-300 transition-all duration-300 hover-lift text-lg relative group disabled:opacity-50">
                {user && profile && profile.tipo_usuario !== 'cidadao' ? 'Ir para Painel Admin' : 'Portal Admin'}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-300 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </button></li>
              <li><button onClick={handleCidadaoAccess} disabled={loading} className="hover:text-yellow-300 transition-all duration-300 hover-lift text-lg relative group disabled:opacity-50">
                {user && profile && profile.tipo_usuario === 'cidadao' ? 'Ir para Meus Serviços' : 'Portal Cidadão'}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-300 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </button></li>
            </ul>
          </div>
          
          <div className="animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
            <h4 className="text-xl font-bold mb-6 text-white drop-shadow-md">Suporte</h4>
            <ul className="space-y-4 text-white/80">
              <li><a href="#contact" className="hover:text-yellow-300 transition-all duration-300 hover-lift text-lg relative group">
                Central de Ajuda
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-300 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><a href="#testimonials" className="hover:text-yellow-300 transition-all duration-300 hover-lift text-lg relative group">
                Depoimentos
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-300 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><a href="#contact" className="hover:text-yellow-300 transition-all duration-300 hover-lift text-lg relative group">
                Contato
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-300 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
              <li><a href="tel:(11)99999999" className="hover:text-yellow-300 transition-all duration-300 hover-lift text-lg relative group">
                (11) 9999-9999
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-300 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/30 flex flex-col sm:flex-row justify-between items-center animate-fade-in-delay">
          <div className="text-white/70 text-lg">
            <a href="#" className="hover:text-yellow-300 mr-8 transition-all duration-300 hover-lift">Política de Privacidade</a>
            <a href="#" className="hover:text-yellow-300 mr-8 transition-all duration-300 hover-lift">Termos de Uso</a>
            <a href="#" className="hover:text-yellow-300 transition-all duration-300 hover-lift">Cookies</a>
          </div>
          <div className="mt-6 sm:mt-0 flex gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleAdminAccess}
              disabled={loading}
              className="hover-lift bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white hover:border-white/50 text-lg px-6 py-3 transition-all disabled:opacity-50"
            >
              {user && profile && profile.tipo_usuario !== 'cidadao' ? 'Ir para Painel Admin' : 'Portal Admin'}
            </Button>
            <Button 
              size="lg" 
              onClick={handleCidadaoAccess}
              disabled={loading}
              className="hover-lift glow-primary text-lg px-6 py-3 bg-white text-purple-600 hover:bg-white/90 shadow-glow disabled:opacity-50"
            >
              {user && profile && profile.tipo_usuario === 'cidadao' ? 'Ir para Meus Serviços' : 'Portal Cidadão'}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
