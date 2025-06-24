
import { FC } from "react";

const stats = [
  { number: "50+", label: "Cidades Atendidas" },
  { number: "1M+", label: "Cidadãos Beneficiados" },
  { number: "98%", label: "Satisfação" },
  { number: "24/7", label: "Suporte Disponível" }
];

export const StatsSection: FC = () => {
  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Resultados que Transformam
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Números que comprovam a eficácia do DigiUrbis na modernização municipal
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-blue-100 text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
