
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

export const HeroSection: FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforme sua
              <span className="text-blue-600 block">Gestão Municipal</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A plataforma completa para modernizar a administração pública, 
              conectar cidadãos e otimizar processos com tecnologia de ponta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" asChild className="hover-scale">
                <Link to="/admin">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="hover-scale">
                <Link to="/admin">Ver Demonstração</Link>
              </Button>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Implementação rápida e suporte completo</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Interface intuitiva para cidadãos e servidores</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Segurança e transparência garantidas</span>
              </div>
            </div>
          </div>
          <div className="lg:order-first animate-scale-in">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80"
                alt="Gestão Municipal Digital"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
