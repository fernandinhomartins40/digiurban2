
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-municipal-management.jpg";

export const HeroSection: FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
      <div className="absolute inset-0 bg-blue-800/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transforme sua
              <span className="block text-yellow-300">
                Gestão Municipal
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              A plataforma completa para modernizar a administração pública, 
              conectar cidadãos e otimizar processos com tecnologia de ponta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" asChild className="text-base px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 transition-colors">
                <a href="#contact">
                  Entre em Contato
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-base px-6 py-3 border-white/30 text-white hover:bg-white/10 transition-colors">
                <a href="#modules">Conhecer Módulos</a>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center text-white">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                <span className="text-sm">Implementação rápida e suporte completo</span>
              </div>
              <div className="flex items-center text-white">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                <span className="text-sm">Interface intuitiva para cidadãos e servidores</span>
              </div>
              <div className="flex items-center text-white">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                <span className="text-sm">Segurança e transparência garantidas</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <img
                src={heroImage}
                alt="Gestão Municipal Digital - Dashboard DigiUrbis"
                className="relative rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">98%</div>
                  <div className="text-gray-600 text-sm font-medium">Satisfação</div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-green-500 p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-xl font-bold text-white mb-1">50+</div>
                  <div className="text-white/90 text-xs font-medium">Cidades</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
