
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, FileDown, FileUp, Edit, Eye, Trash2 } from "lucide-react";
import { Beneficio } from "@/types/assistencia-social";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for demonstration
const mockBeneficios: Beneficio[] = [
  {
    id: "1",
    nome: "Auxílio Aluguel",
    descricao: "Apoio financeiro para família em situação de vulnerabilidade social",
    valorMensal: 300,
    dataInicio: "2023-05-15",
    status: "Ativo",
    cidadao: {
      id: "101",
      nome: "Maria Silva",
      cpf: "123.456.789-00",
      dataNascimento: "1985-03-10",
      endereco: "Rua das Flores, 123",
      bairro: "Centro",
      telefone: "(11) 99999-8888",
      email: "maria@email.com",
      nis: "12345678901",
      dataCadastro: "2023-01-15",
      vulnerabilidades: ["Baixa renda", "Moradia precária"]
    }
  },
  {
    id: "2",
    nome: "Bolsa Inclusão",
    descricao: "Auxílio para famílias com crianças com deficiência",
    valorMensal: 450,
    dataInicio: "2023-04-01",
    status: "Ativo",
    cidadao: {
      id: "102",
      nome: "João Pereira",
      cpf: "987.654.321-00",
      dataNascimento: "1979-08-22",
      endereco: "Av. Principal, 456",
      bairro: "Vila Nova",
      telefone: "(11) 99999-7777",
      dataCadastro: "2022-11-20",
      vulnerabilidades: ["Pessoa com deficiência na família", "Baixa renda"]
    }
  },
  {
    id: "3",
    nome: "Auxílio Emergencial Municipal",
    descricao: "Apoio financeiro temporário para cidadãos afetados por calamidades",
    valorMensal: 600,
    dataInicio: "2023-03-15",
    dataFim: "2023-09-15",
    status: "Suspenso",
    motivoStatus: "Não compareceu à reavaliação",
    cidadao: {
      id: "103",
      nome: "Ana Souza",
      cpf: "111.222.333-44",
      dataNascimento: "1990-12-05",
      endereco: "Rua dos Ipês, 789",
      bairro: "Jardim América",
      telefone: "(11) 99999-6666",
      dataCadastro: "2023-02-28",
      vulnerabilidades: ["Desempregado", "Família numerosa"]
    }
  },
  {
    id: "4",
    nome: "Programa Primeiro Passo",
    descricao: "Auxílio para famílias com crianças de 0 a 3 anos",
    valorMensal: 250,
    dataInicio: "2023-06-01",
    status: "Em análise",
    cidadao: {
      id: "104",
      nome: "Pedro Santos",
      cpf: "444.555.666-77",
      dataNascimento: "1988-04-15",
      endereco: "Rua dos Lírios, 321",
      bairro: "Jardim Primavera",
      telefone: "(11) 99999-5555",
      dataCadastro: "2023-05-20",
      vulnerabilidades: ["Baixa renda", "Família monoparental"]
    }
  },
  {
    id: "5",
    nome: "Auxílio Reforma Residencial",
    descricao: "Apoio financeiro único para reforma de residências em áreas de risco",
    valorMensal: 2000,
    dataInicio: "2023-02-10",
    dataFim: "2023-02-10",
    status: "Cancelado",
    motivoStatus: "Beneficiário não utilizou o recurso conforme o propósito",
    cidadao: {
      id: "105",
      nome: "Lucia Oliveira",
      cpf: "777.888.999-00",
      dataNascimento: "1975-09-30",
      endereco: "Rua das Palmeiras, 654",
      bairro: "Vila Esperança",
      telefone: "(11) 99999-4444",
      dataCadastro: "2022-12-05",
      vulnerabilidades: ["Moradia em área de risco", "Baixa renda"]
    }
  }
];

const GerenciamentoBeneficios = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Benefícios</h1>

        <Tabs defaultValue="ativos" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="ativos">Benefícios Ativos</TabsTrigger>
              <TabsTrigger value="pendentes">Em Análise</TabsTrigger>
              <TabsTrigger value="suspensos">Suspensos/Cancelados</TabsTrigger>
              <TabsTrigger value="todos">Todos</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Benefício
              </Button>
            </div>
          </div>

          {/* Barra de pesquisa e filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar por nome, CPF ou tipo de benefício..."
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Benefício" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auxilio-aluguel">Auxílio Aluguel</SelectItem>
                  <SelectItem value="bolsa-inclusao">Bolsa Inclusão</SelectItem>
                  <SelectItem value="auxilio-emergencial">Auxílio Emergencial</SelectItem>
                  <SelectItem value="primeiro-passo">Programa Primeiro Passo</SelectItem>
                  <SelectItem value="auxilio-reforma">Auxílio Reforma</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="ativos" className="space-y-4">
            {mockBeneficios
              .filter(b => b.status === "Ativo")
              .map((beneficio) => (
                <BeneficioCard key={beneficio.id} beneficio={beneficio} />
              ))}
          </TabsContent>
          
          <TabsContent value="pendentes" className="space-y-4">
            {mockBeneficios
              .filter(b => b.status === "Em análise")
              .map((beneficio) => (
                <BeneficioCard key={beneficio.id} beneficio={beneficio} />
              ))}
          </TabsContent>
          
          <TabsContent value="suspensos" className="space-y-4">
            {mockBeneficios
              .filter(b => b.status === "Suspenso" || b.status === "Cancelado")
              .map((beneficio) => (
                <BeneficioCard key={beneficio.id} beneficio={beneficio} />
              ))}
          </TabsContent>
          
          <TabsContent value="todos" className="space-y-4">
            {mockBeneficios.map((beneficio) => (
              <BeneficioCard key={beneficio.id} beneficio={beneficio} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

const BeneficioCard = ({ beneficio }: { beneficio: Beneficio }) => {
  const statusColor = {
    "Ativo": "bg-green-100 text-green-800",
    "Suspenso": "bg-amber-100 text-amber-800",
    "Cancelado": "bg-red-100 text-red-800",
    "Em análise": "bg-blue-100 text-blue-800"
  };

  const statusClass = statusColor[beneficio.status as keyof typeof statusColor] || "bg-gray-100 text-gray-800";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{beneficio.nome}</CardTitle>
            <CardDescription className="text-sm mt-1">
              Beneficiário: {beneficio.cidadao.nome} | CPF: {beneficio.cidadao.cpf}
            </CardDescription>
          </div>
          <Badge className={statusClass}>{beneficio.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 font-medium">Descrição</p>
            <p>{beneficio.descricao}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Valor Mensal</p>
            <p>R$ {beneficio.valorMensal?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Período</p>
            <p>Início: {new Date(beneficio.dataInicio).toLocaleDateString()}</p>
            {beneficio.dataFim && (
              <p>Fim: {new Date(beneficio.dataFim).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        
        {beneficio.motivoStatus && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
            <span className="font-medium">Motivo do status:</span> {beneficio.motivoStatus}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Ver detalhes
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        {beneficio.status !== "Cancelado" && (
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GerenciamentoBeneficios;
