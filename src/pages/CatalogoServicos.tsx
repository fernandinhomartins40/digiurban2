
import { CidadaoLayout } from "../components/CidadaoLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FC, useState, useMemo } from "react";
import { Search, FileText, Heart, Bus, School, Building, Home, Leaf, Construction, Shield, CreditCard, User, Clock, DollarSign } from "lucide-react";
import { useServicos, servicosUtils } from "../lib/services";
import { useNavigate } from "react-router-dom";

// Ícones para categorias
const categoryIcons: Record<string, any> = {
  'financas': CreditCard,
  'saude': Heart,
  'educacao': School,
  'obras': Construction,
  'meio-ambiente': Leaf,
  'seguranca': Shield,
  'assistencia-social': User,
  'cultura': FileText,
  'esportes': FileText,
  'turismo': FileText,
  'agricultura': Leaf,
  'habitacao': Home
};

const CatalogoServicos: FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  
  const { servicos, loading, error } = useServicos();

  // Extrair categorias únicas dos serviços
  const categories = useMemo(() => {
    const categoriasUnicas = [...new Set(servicos.map(s => s.categoria))];
    return [
      { id: "todos", label: "Todos" },
      ...categoriasUnicas.map(cat => ({
        id: cat,
        label: servicosUtils.formatarCategoria(cat)
      }))
    ];
  }, [servicos]);

  // Filtrar serviços baseado na categoria e busca
  const servicosFiltrados = useMemo(() => {
    let filtrados = servicos;

    // Filtrar por categoria
    if (selectedCategory !== "todos") {
      filtrados = filtrados.filter(s => s.categoria === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtrados = filtrados.filter(s =>
        s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servicosUtils.formatarCategoria(s.categoria).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtrados;
  }, [servicos, selectedCategory, searchTerm]);

  const handleSolicitarServico = (servicoId: string) => {
    // Navegar para formulário de criação de protocolo
    navigate(`/cidadao/protocolo/novo?servico=${servicoId}`);
  };

  if (error) {
    return (
      <CidadaoLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Erro ao carregar serviços
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {error}
            </p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </CidadaoLayout>
    );
  }

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
            <Input 
              placeholder="Pesquisar serviços..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
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
              {loading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mt-2" />
                        <Skeleton className="h-4 w-full mt-1" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardHeader>
                      <CardFooter>
                        <Skeleton className="h-10 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {servicosFiltrados.map((servico) => {
                    const IconComponent = categoryIcons[servico.categoria] || FileText;
                    
                    return (
                      <Card key={servico.id} className="h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                              <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            {servico.requer_aprovacao_admin && (
                              <Badge variant="outline" className="text-xs">
                                Requer Aprovação
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg mt-2">{servico.nome}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {servico.descricao}
                          </CardDescription>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {servico.prazo_resposta_dias} dias
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {servicosUtils.formatarTaxa(servico.taxa_servico)}
                            </div>
                          </div>

                          {servico.requer_documentos && servico.documentos_necessarios.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Documentos necessários:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {servico.documentos_necessarios.slice(0, 2).map((doc, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {doc}
                                  </Badge>
                                ))}
                                {servico.documentos_necessarios.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{servico.documentos_necessarios.length - 2} mais
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardHeader>
                        
                        <CardFooter>
                          <Button 
                            variant="default" 
                            className="w-full"
                            onClick={() => handleSolicitarServico(servico.id)}
                          >
                            Solicitar Serviço
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
              
              {!loading && servicosFiltrados.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">Nenhum serviço encontrado</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm 
                      ? `Nenhum serviço encontrado para "${searchTerm}"`
                      : "Nenhum serviço encontrado nesta categoria."
                    }
                  </p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchTerm("")}
                    >
                      Limpar busca
                    </Button>
                  )}
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
