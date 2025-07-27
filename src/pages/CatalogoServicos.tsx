
import { CidadaoLayout } from "../components/CidadaoLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";
import { Search, FileText, Heart, Bus, School, Building, Home, Leaf, Construction, Shield, CreditCard, User } from "lucide-react";

// Dummy data for services
const services = [
  { 
    id: 1, 
    title: "Certidão Negativa de Débitos", 
    description: "Solicite a certidão que comprova a inexistência de débitos municipais.",
    icon: FileText,
    category: "financas",
    popular: true
  },
  { 
    id: 2, 
    title: "Agendamento de Consultas", 
    description: "Agende consultas médicas nas unidades de saúde do município.",
    icon: Heart,
    category: "saude",
    popular: true
  },
  { 
    id: 3, 
    title: "Solicitação de Transporte", 
    description: "Solicite transporte para consultas e exames fora do município.",
    icon: Bus,
    category: "saude"
  },
  { 
    id: 4, 
    title: "Matrícula Online", 
    description: "Faça a matrícula escolar online para a rede municipal de ensino.",
    icon: School,
    category: "educacao",
    popular: true
  },
  { 
    id: 5, 
    title: "Alvarás e Licenças", 
    description: "Solicite a emissão de alvarás e licenças para seu negócio.",
    icon: Building,
    category: "obras"
  },
  { 
    id: 6, 
    title: "Aprovação de Projetos", 
    description: "Submeta projetos de construção para aprovação da prefeitura.",
    icon: Home,
    category: "obras"
  },
  { 
    id: 7, 
    title: "Licença Ambiental", 
    description: "Solicite licenças ambientais para atividades específicas.",
    icon: Leaf,
    category: "meio-ambiente"
  },
  { 
    id: 8, 
    title: "Solicitação de Reparos", 
    description: "Solicite reparos em vias públicas, iluminação e outros serviços.",
    icon: Construction,
    category: "obras",
    popular: true
  },
  { 
    id: 9, 
    title: "Boletim de Ocorrência", 
    description: "Registre ocorrências de segurança pública e vigilância.",
    icon: Shield,
    category: "seguranca"
  },
  { 
    id: 10, 
    title: "Segunda Via de IPTU", 
    description: "Solicite a segunda via do seu boleto de IPTU.",
    icon: CreditCard,
    category: "financas",
    popular: true
  },
  { 
    id: 11, 
    title: "Cadastro Único", 
    description: "Faça seu cadastro para programas sociais do governo.",
    icon: User,
    category: "assistencia-social"
  },
  { 
    id: 12, 
    title: "Solicitação de Poda de Árvores", 
    description: "Solicite serviço de poda ou remoção de árvores em vias públicas.",
    icon: Leaf,
    category: "meio-ambiente"
  },
];

const categories = [
  { id: "todos", label: "Todos" },
  { id: "populares", label: "Populares" },
  { id: "financas", label: "Finanças" },
  { id: "saude", label: "Saúde" },
  { id: "educacao", label: "Educação" },
  { id: "obras", label: "Obras e Urbanismo" },
  { id: "meio-ambiente", label: "Meio Ambiente" },
  { id: "seguranca", label: "Segurança" },
  { id: "assistencia-social", label: "Assistência Social" },
];

const CatalogoServicos: FC = () => {
  return (
    <CidadaoLayout>
      <div className="h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Catálogo de Serviços</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Encontre e solicite os serviços oferecidos pela prefeitura
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Input placeholder="Pesquisar serviços..." className="pl-10" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="mb-4 overflow-x-auto flex flex-nowrap w-full justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="whitespace-nowrap">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent 
              key={category.id} 
              value={category.id} 
              className="mt-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services
                  .filter(service => 
                    category.id === "todos" || 
                    (category.id === "populares" && service.popular) || 
                    service.category === category.id
                  )
                  .map((service) => (
                    <Card key={service.id} className="h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <service.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-2">{service.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="default" className="w-full">
                          Solicitar Serviço
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              
              {services.filter(service => 
                category.id === "todos" || 
                (category.id === "populares" && service.popular) || 
                service.category === category.id
              ).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum serviço encontrado nesta categoria.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </CidadaoLayout>
  );
};

export default CatalogoServicos;
