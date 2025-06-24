
import { FC } from "react";
import { Clock, Users, Shield, BarChart, Smartphone, Globe } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Eficiência Operacional",
    description: "Automatize processos e reduza o tempo de resposta aos cidadãos em até 70%."
  },
  {
    icon: Users,
    title: "Atendimento Centralizado",
    description: "Portal único para todos os serviços municipais, facilitando o acesso dos cidadãos."
  },
  {
    icon: Shield,
    title: "Segurança e Transparência",
    description: "Dados protegidos e processos transparentes com auditoria completa."
  },
  {
    icon: BarChart,
    title: "Gestão Baseada em Dados",
    description: "Relatórios e indicadores em tempo real para tomada de decisões estratégicas."
  },
  {
    icon: Smartphone,
    title: "Acesso Mobile",
    description: "Interface responsiva que funciona perfeitamente em qualquer dispositivo."
  },
  {
    icon: Globe,
    title: "Integração Total",
    description: "Conecte todos os departamentos e sistemas existentes em uma única plataforma."
  }
];

export const BenefitsSection: FC = () => {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que escolher DigiUrbis?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforme sua administração municipal com tecnologia moderna e processos otimizados
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 hover-scale"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
