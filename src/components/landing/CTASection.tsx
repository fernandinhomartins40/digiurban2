
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail } from "lucide-react";

export const CTASection: FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 relative">
      <div className="absolute inset-0 bg-blue-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Pronto para <span className="text-yellow-300">transformar</span> sua cidade?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Junte-se a centenas de municípios que já modernizaram sua gestão com DigiUrbis.
            Nossa equipe está pronta para ajudar você a dar o próximo passo na transformação digital.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
          <div className="flex items-center justify-center bg-white/10 rounded-lg p-4">
            <Phone className="h-5 w-5 mr-3 text-white" />
            <span className="text-white text-sm font-medium">(11) 9999-9999</span>
          </div>
          <div className="flex items-center justify-center bg-white/10 rounded-lg p-4">
            <Mail className="h-5 w-5 mr-3 text-white" />
            <span className="text-white text-sm font-medium">contato@digiurbis.com</span>
          </div>
        </div>
      </div>
    </section>
  );
};
