
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail } from "lucide-react";

export const CTASection: FC = () => {
  return (
    <section className="py-24 gradient-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-48 h-48 gradient-accent rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 gradient-secondary rounded-full opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 gradient-warm rounded-full opacity-5 animate-float" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Pronto para <span className="text-gradient bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">transformar</span> sua cidade?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Junte-se a centenas de municípios que já modernizaram sua gestão com DigiUrbis.
            Nossa equipe está pronta para ajudar você a dar o próximo passo na transformação digital.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-delay">
          <Button size="lg" variant="secondary" asChild className="hover-lift glow-primary text-xl px-10 py-5 bg-white text-purple-600 hover:bg-white/90 shadow-glow">
            <Link to="/admin">
              Começar Agora
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="hover-lift text-xl px-10 py-5 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
            <Link to="/admin">Agendar Demonstração</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto animate-fade-in-delay">
          <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover-lift">
            <Phone className="h-6 w-6 mr-3 text-white/90" />
            <span className="text-white/90 text-lg font-medium">(11) 9999-9999</span>
          </div>
          <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover-lift">
            <Mail className="h-6 w-6 mr-3 text-white/90" />
            <span className="text-white/90 text-lg font-medium">contato@digiurbis.com</span>
          </div>
        </div>
      </div>
    </section>
  );
};
