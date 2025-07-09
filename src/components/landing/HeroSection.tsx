
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

export const HeroSection: FC = () => {
  return (
    <section className="relative overflow-hidden gradient-primary py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 gradient-accent rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 gradient-secondary rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 gradient-warm rounded-full opacity-10 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Transforme sua
              <span className="block text-gradient bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Gestão Municipal
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              A plataforma completa para modernizar a administração pública, 
              conectar cidadãos e otimizar processos com tecnologia de ponta.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <Button size="lg" variant="secondary" asChild className="hover-lift glow-primary text-lg px-8 py-4 bg-white text-purple-600 hover:bg-white/90">
                <Link to="/admin">
                  Começar Agora
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="hover-lift text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
                <Link to="/admin">Ver Demonstração</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 animate-fade-in-delay">
              <div className="flex items-center text-white/90 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="h-6 w-6 text-green-400 mr-4 flex-shrink-0" />
                <span className="text-lg">Implementação rápida e suporte completo</span>
              </div>
              <div className="flex items-center text-white/90 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="h-6 w-6 text-green-400 mr-4 flex-shrink-0" />
                <span className="text-lg">Interface intuitiva para cidadãos e servidores</span>
              </div>
              <div className="flex items-center text-white/90 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="h-6 w-6 text-green-400 mr-4 flex-shrink-0" />
                <span className="text-lg">Segurança e transparência garantidas</span>
              </div>
            </div>
          </div>
          <div className="animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 gradient-accent rounded-3xl opacity-20 animate-glow"></div>
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80"
                alt="Gestão Municipal Digital"
                className="relative rounded-3xl shadow-glow hover-lift"
              />
              <div className="absolute -bottom-8 -right-8 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-card animate-float">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">98%</div>
                  <div className="text-gray-600 font-medium">Satisfação dos Usuários</div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-2xl shadow-card animate-float" style={{animationDelay: '1s'}}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">50+</div>
                  <div className="text-white/90 text-sm font-medium">Cidades</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
