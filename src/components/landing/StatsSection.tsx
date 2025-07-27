
import { FC } from "react";

const stats = [
  { number: "50+", label: "Cidades Atendidas" },
  { number: "1M+", label: "Cidadãos Beneficiados" },
  { number: "98%", label: "Satisfação" },
  { number: "24/7", label: "Suporte Disponível" }
];

export const StatsSection: FC = () => {
  return (
    <section className="py-24 gradient-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-40 h-40 gradient-accent rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-32 h-32 gradient-secondary rounded-full opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 gradient-warm rounded-full opacity-10 animate-float" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Resultados que <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">Transformam</span>
          </h2>
          <p className="text-xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
            Números que comprovam a eficácia do Digiurban na modernização municipal e satisfação dos cidadãos
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group animate-fade-in-delay"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl group-hover:bg-white/30 transition-all duration-500"></div>
                
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover-lift group-hover:bg-white/15 transition-all duration-500">
                  <div className="text-5xl md:text-7xl font-bold text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-white/90 text-lg font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
