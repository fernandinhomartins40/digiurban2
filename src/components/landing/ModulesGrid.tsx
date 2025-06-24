
import { FC } from "react";
import { Heart, Book, HandHeart, Building, Shield, Leaf, Trophy, Compass, Home, Construction } from "lucide-react";

const modules = [
  {
    icon: Heart,
    title: "Saúde",
    description: "Agendamentos, controle de medicamentos, campanhas e programas de saúde.",
    color: "bg-red-100 text-red-600"
  },
  {
    icon: Book,
    title: "Educação",
    description: "Matrículas, gestão escolar, transporte e merenda escolar.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: HandHeart,
    title: "Assistência Social",
    description: "CRAS, CREAS, programas sociais e benefícios assistenciais.",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Building,
    title: "Planejamento Urbano",
    description: "Aprovação de projetos, alvarás e consultas públicas.",
    color: "bg-gray-100 text-gray-600"
  },
  {
    icon: Shield,
    title: "Segurança Pública",
    description: "Ocorrências, apoio da guarda e vigilância integrada.",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Leaf,
    title: "Meio Ambiente",
    description: "Licenças ambientais, denúncias e áreas protegidas.",
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    icon: Trophy,
    title: "Esportes",
    description: "Equipes, competições, atletas e infraestrutura esportiva.",
    color: "bg-orange-100 text-orange-600"
  },
  {
    icon: Compass,
    title: "Turismo",
    description: "Pontos turísticos, estabelecimentos e programas turísticos.",
    color: "bg-cyan-100 text-cyan-600"
  },
  {
    icon: Home,
    title: "Habitação",
    description: "Programas habitacionais e regularização fundiária.",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    icon: Construction,
    title: "Obras Públicas",
    description: "Gestão de obras, progresso e mapa de intervenções.",
    color: "bg-yellow-100 text-yellow-600"
  }
];

export const ModulesGrid: FC = () => {
  return (
    <section id="modules" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Módulos Especializados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada área da administração municipal tem suas especificidades. 
            O DigiUrbis oferece módulos dedicados para atender todas as demandas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover-scale border border-gray-100"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${module.color}`}>
                <module.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {module.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
