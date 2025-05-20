
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, FileDown, MapPin, Box, Calendar } from "lucide-react";
import { EntregaEmergencial } from "@/types/assistencia-social";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for demonstration
const mockEntregas: EntregaEmergencial[] = [
  {
    id: "1",
    tipo: "Cesta Básica",
    descricao: "Cesta básica com itens alimentícios",
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
    },
    dataEntrega: "2023-06-15",
    responsavelEntrega: {
      id: "901",
      nome: "Carlos Mendes",
      cargo: "Assistente Social",
      registro: "CRESS 12345",
      email: "carlos@prefeitura.gov.br",
      telefone: "(11) 3333-4444"
    },
    motivo: "Situação de vulnerabilidade alimentar"
  },
  {
    id: "2",
    tipo: "Kit Higiene",
    descricao: "Kit com itens básicos de higiene pessoal",
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
    },
    dataEntrega: "2023-06-10",
    responsavelEntrega: {
      id: "902",
      nome: "Ana Paula Santos",
      cargo: "Assistente Social",
      registro: "CRESS 54321",
      email: "ana@prefeitura.gov.br",
      telefone: "(11) 3333-5555"
    },
    motivo: "Família em situação de vulnerabilidade social"
  },
  {
    id: "3",
    tipo: "Kit Bebê",
    descricao: "Kit com itens para recém-nascidos",
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
    },
    dataEntrega: "2023-06-05",
    responsavelEntrega: {
      id: "901",
      nome: "Carlos Mendes",
      cargo: "Assistente Social",
      registro: "CRESS 12345",
      email: "carlos@prefeitura.gov.br",
      telefone: "(11) 3333-4444"
    },
    motivo: "Família com recém-nascido em situação de vulnerabilidade"
  },
  {
    id: "4",
    tipo: "Cobertor",
    descricao: "Cobertores para proteção contra o frio",
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
    },
    dataEntrega: "2023-06-01",
    responsavelEntrega: {
      id: "903",
      nome: "Roberto Almeida",
      cargo: "Técnico Social",
      registro: "TS-2345",
      email: "roberto@prefeitura.gov.br",
      telefone: "(11) 3333-6666"
    },
    motivo: "Campanha de inverno para famílias vulneráveis"
  },
  {
    id: "5",
    tipo: "Outro",
    descricao: "Colchão para família afetada por alagamento",
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
    },
    dataEntrega: "2023-05-28",
    responsavelEntrega: {
      id: "902",
      nome: "Ana Paula Santos",
      cargo: "Assistente Social",
      registro: "CRESS 54321",
      email: "ana@prefeitura.gov.br",
      telefone: "(11) 3333-5555"
    },
    motivo: "Família afetada por alagamento na residência",
    observacoes: "Entrega realizada diretamente na residência devido à dificuldade de locomoção da família"
  }
];

const EntregasEmergenciais = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Entregas Emergenciais</h1>

        {/* Resumo em cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Entregas (Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
              <p className="text-xs text-gray-500">+12% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cestas Básicas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">25</p>
              <p className="text-xs text-gray-500">18 em estoque</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Kits de Higiene</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-gray-500">23 em estoque</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Outras Entregas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-gray-500">Cobertores, colchões, etc.</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="entregas" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="entregas">Entregas Realizadas</TabsTrigger>
              <TabsTrigger value="estoque">Estoque</TabsTrigger>
              <TabsTrigger value="programadas">Entregas Programadas</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Entrega
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Registrar Nova Entrega Emergencial</DialogTitle>
                    <DialogDescription>
                      Preencha os dados da entrega emergencial. Campos marcados com * são obrigatórios.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Cidadão*</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o beneficiário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maria">Maria Silva (123.456.789-00)</SelectItem>
                          <SelectItem value="joao">João Pereira (987.654.321-00)</SelectItem>
                          <SelectItem value="ana">Ana Souza (111.222.333-44)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Tipo*</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Tipo de entrega" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cesta">Cesta Básica</SelectItem>
                          <SelectItem value="kit-higiene">Kit Higiene</SelectItem>
                          <SelectItem value="kit-bebe">Kit Bebê</SelectItem>
                          <SelectItem value="cobertor">Cobertor</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Descrição*</label>
                      <Input className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Motivo*</label>
                      <Input className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Observações</label>
                      <Input className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Data Entrega*</label>
                      <Input type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Responsável*</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carlos">Carlos Mendes (CRESS 12345)</SelectItem>
                          <SelectItem value="ana">Ana Paula Santos (CRESS 54321)</SelectItem>
                          <SelectItem value="roberto">Roberto Almeida (TS-2345)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Registrar Entrega</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Barra de pesquisa e filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar por nome, CPF ou tipo de entrega..."
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Entrega" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cesta">Cesta Básica</SelectItem>
                  <SelectItem value="kit-higiene">Kit Higiene</SelectItem>
                  <SelectItem value="kit-bebe">Kit Bebê</SelectItem>
                  <SelectItem value="cobertor">Cobertor</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="entregas" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Beneficiário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEntregas.map((entrega) => (
                  <TableRow key={entrega.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(entrega.dataEntrega).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{entrega.cidadao.nome}</p>
                        <p className="text-xs text-gray-500">{entrega.cidadao.cpf}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Box className="h-3 w-3" />
                        {entrega.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {entrega.cidadao.bairro}
                      </div>
                    </TableCell>
                    <TableCell>{entrega.responsavelEntrega.nome}</TableCell>
                    <TableCell className="max-w-xs truncate">{entrega.motivo}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="estoque">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-md text-center">
              <p className="text-gray-500">Controle de estoque de itens para entregas emergenciais</p>
              <Button className="mt-4">Acessar Módulo de Estoque</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="programadas">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-md text-center">
              <p className="text-gray-500">Entregas programadas para os próximos dias</p>
              <Button className="mt-4">Ver Agenda de Entregas</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EntregasEmergenciais;
