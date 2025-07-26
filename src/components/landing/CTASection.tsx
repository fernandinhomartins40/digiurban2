
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
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
            Pronto para <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">transformar</span> sua cidade?
          </h2>
          <p className="text-xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
            Junte-se a centenas de municípios que já modernizaram sua gestão com DigiUrbis.
            Nossa equipe está pronta para ajudar você a dar o próximo passo na transformação digital.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-16 animate-fade-in-delay max-w-5xl mx-auto">
          {/* Portal Administrativo */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover-lift flex flex-col items-center text-center flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0V9h6v7"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Portal Administrativo</h3>
            <p className="text-white/80 mb-6 leading-relaxed">Para servidores públicos, prefeito e gestores municipais</p>
            <Button size="lg" variant="secondary" asChild className="hover-lift glow-primary text-lg px-8 py-4 bg-white text-purple-600 hover:bg-white/90 shadow-glow w-full">
              <Link to="/admin/login">
                Acessar Portal Admin
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Portal do Cidadão */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover-lift flex flex-col items-center text-center flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Portal do Cidadão</h3>
            <p className="text-white/80 mb-6 leading-relaxed">Para munícipes acessarem serviços públicos online</p>
            <Button size="lg" variant="outline" asChild className="hover-lift text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm w-full">
              <Link to="/cidadao/login">Acessar Portal Cidadão</Link>
            </Button>
          </div>
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
