
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail } from "lucide-react";

export const CTASection: FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Pronto para transformar sua cidade?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Junte-se a centenas de municípios que já modernizaram sua gestão com DigiUrbis.
          Nossa equipe está pronta para ajudar você a dar o próximo passo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" variant="secondary" asChild className="hover-scale">
            <Link to="/admin">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="hover-scale bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
            <Link to="/admin">Agendar Demonstração</Link>
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-blue-100">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            <span>(11) 9999-9999</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            <span>contato@digiurbis.com</span>
          </div>
        </div>
      </div>
    </section>
  );
};
