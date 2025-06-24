
import { FC } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Prefeita de Cidade Nova",
    content: "O DigiUrbis revolucionou nossa gestão. Agora conseguimos atender os cidadãos com muito mais eficiência e transparência.",
    rating: 5
  },
  {
    name: "João Santos",
    role: "Secretário de Saúde",
    content: "A organização dos agendamentos médicos melhorou drasticamente. Os cidadãos estão muito mais satisfeitos com o atendimento.",
    rating: 5
  },
  {
    name: "Ana Costa",
    role: "Coordenadora de TI",
    content: "A implementação foi surpreendentemente rápida e o suporte técnico é excepcional. Recomendo para qualquer município.",
    rating: 5
  }
];

export const TestimonialsSection: FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Depoimentos reais de gestores públicos que já transformaram suas cidades com DigiUrbis
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
