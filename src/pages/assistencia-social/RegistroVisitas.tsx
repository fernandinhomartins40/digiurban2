
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, Filter, Plus, FileDown, MapPin, User, Users, AlertCircle, Check } from "lucide-react";
import { Visita } from "@/types/assistencia-social";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for demonstration
const mockVisitas: Visita[] = [
  {
    id: "1",
    familia: {
      id: "f1",
      referencia: {
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
      membros: [],
      rendaFamiliar: 1200,
      vulnerabilidades: ["Baixa renda", "Moradia precária"],
      programasSociais: ["Bolsa Família"],
      beneficiosRecebidos: [],
      visitasRealizadas: []
    },
    endereco: "Rua das Flores, 123, Centro",
    dataVisita: "2023-06-20",
    tecnicoResponsavel: {
      id: "901",
      nome: "Carlos Mendes",
      cargo: "Assistente Social",
      registro: "CRESS 12345",
      email: "carlos@prefeitura.gov.br",
      telefone: "(11) 3333-4444"
    },
    motivoVisita: "Verificação de condições de moradia",
    relatorio: "Visita realizada para verificar as condições de moradia da família. A casa apresenta problemas estruturais no telhado e infiltrações. Família necessita de apoio para reforma emergencial.",
    encaminhamentos: ["Encaminhamento para programa de reforma habitacional", "Inclusão em programa de auxílio aluguel temporário"],
    retornoNecessario: true,
    dataProximaVisita: "2023-07-20",
    status: "Realizada"
  },
  {
    id: "2",
    familia: {
      id: "f2",
      referencia: {
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
      membros: [],
      rendaFamiliar: 950,
      vulnerabilidades: ["Pessoa com deficiência na família", "Baixa renda"],
      programasSociais: ["BPC", "Tarifa Social de Energia"],
      beneficiosRecebidos: [],
      visitasRealizadas: []
    },
    endereco: "Av. Principal, 456, Vila Nova",
    dataVisita: "2023-06-18",
    tecnicoResponsavel: {
      id: "902",
      nome: "Ana Paula Santos",
      cargo: "Assistente Social",
      registro: "CRESS 54321",
      email: "ana@prefeitura.gov.br",
      telefone: "(11) 3333-5555"
    },
    motivoVisita: "Acompanhamento familiar",
    relatorio: "Visita realizada para acompanhamento da família que possui membro com deficiência. Verificado que estão necessitando de equipamentos de acessibilidade e orientações sobre direitos.",
    encaminhamentos: ["Encaminhamento para programa de tecnologia assistiva", "Agendamento de consulta com assistente social especializada"],
    retornoNecessario: true,
    dataProximaVisita: "2023-08-18",
    status: "Realizada"
  },
  {
    id: "3",
    familia: {
      id: "f3",
      referencia: {
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
      membros: [],
      rendaFamiliar: 850,
      vulnerabilidades: ["Desempregado", "Família numerosa"],
      programasSociais: ["Auxílio Brasil", "Tarifa Social de Água"],
      beneficiosRecebidos: [],
      visitasRealizadas: []
    },
    endereco: "Rua dos Ipês, 789, Jardim América",
    dataVisita: "2023-06-25",
    tecnicoResponsavel: {
      id: "901",
      nome: "Carlos Mendes",
      cargo: "Assistente Social",
      registro: "CRESS 12345",
      email: "carlos@prefeitura.gov.br",
      telefone: "(11) 3333-4444"
    },
    motivoVisita: "Denúncia de negligência com crianças",
    relatorio: "Visita realizada para verificar denúncia anônima sobre negligência com as crianças. Após avaliação, constatou-se que a denúncia não procede. As crianças estão sendo bem cuidadas, apesar da situação de vulnerabilidade econômica da família.",
    encaminhamentos: ["Inclusão em programa de transferência de renda", "Encaminhamento para banco de alimentos"],
    retornoNecessario: false,
    status: "Realizada"
  },
  {
    id: "4",
    familia: {
      id: "f4",
      referencia: {
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
      membros: [],
      rendaFamiliar: 1100,
      vulnerabilidades: ["Baixa renda", "Família monoparental"],
      programasSociais: ["Bolsa Família"],
      beneficiosRecebidos: [],
      visitasRealizadas: []
    },
    endereco: "Rua dos Lírios, 321, Jardim Primavera",
    dataVisita: "2023-07-05",
    tecnicoResponsavel: {
      id: "903",
      nome: "Roberto Almeida",
      cargo: "Técnico Social",
      registro: "TS-2345",
      email: "roberto@prefeitura.gov.br",
      telefone: "(11) 3333-6666"
    },
    motivoVisita: "Atualização cadastral",
    relatorio: "Visita agendada para atualização do CadÚnico e verificação da situação atual da família.",
    encaminhamentos: [],
    retornoNecessario: false,
    status: "Agendada"
  },
  {
    id: "5",
    familia: {
      id: "f5",
      referencia: {
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
      membros: [],
      rendaFamiliar: 780,
      vulnerabilidades: ["Moradia em área de risco", "Baixa renda"],
      programasSociais: ["Auxílio Aluguel"],
      beneficiosRecebidos: [],
      visitasRealizadas: []
    },
    endereco: "Rua das Palmeiras, 654, Vila Esperança",
    dataVisita: "2023-06-15",
    tecnicoResponsavel: {
      id: "902",
      nome: "Ana Paula Santos",
      cargo: "Assistente Social",
      registro: "CRESS 54321",
      email: "ana@prefeitura.gov.br",
      telefone: "(11) 3333-5555"
    },
    motivoVisita: "Verificação emergencial por risco de deslizamento",
    relatorio: "",
    encaminhamentos: [],
    retornoNecessario: true,
    status: "Não realizada",
    motivoNaoRealizada: "Família não estava em casa no momento da visita"
  }
];

const RegistroVisitas = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Registro de Visitas</h1>

        <Tabs defaultValue="todas" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="todas">Todas as Visitas</TabsTrigger>
              <TabsTrigger value="realizadas">Realizadas</TabsTrigger>
              <TabsTrigger value="agendadas">Agendadas</TabsTrigger>
              <TabsTrigger value="pendentes">Não Realizadas</TabsTrigger>
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
                    Agendar Visita
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Agendar Nova Visita</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para agendar uma nova visita. Campos marcados com * são obrigatórios.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Família/Cidadão*</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione a família" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maria">Família de Maria Silva</SelectItem>
                          <SelectItem value="joao">Família de João Pereira</SelectItem>
                          <SelectItem value="ana">Família de Ana Souza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Endereço*</label>
                      <Input className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Data da Visita*</label>
                      <Input type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Horário*</label>
                      <Input type="time" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Motivo*</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cadastramento">Cadastramento</SelectItem>
                          <SelectItem value="verificacao">Verificação de moradia</SelectItem>
                          <SelectItem value="denuncia">Atendimento de denúncia</SelectItem>
                          <SelectItem value="acompanhamento">Acompanhamento familiar</SelectItem>
                          <SelectItem value="emergencial">Visita emergencial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Detalhes do motivo</label>
                      <Textarea className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Técnico responsável*</label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o técnico" />
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
                    <Button type="submit">Agendar Visita</Button>
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
                placeholder="Buscar por nome, endereço ou motivo da visita..."
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Técnico Responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="carlos">Carlos Mendes</SelectItem>
                  <SelectItem value="ana">Ana Paula Santos</SelectItem>
                  <SelectItem value="roberto">Roberto Almeida</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="todas" className="space-y-4">
            {mockVisitas.map((visita) => (
              <VisitaCard key={visita.id} visita={visita} />
            ))}
          </TabsContent>
          
          <TabsContent value="realizadas" className="space-y-4">
            {mockVisitas
              .filter(v => v.status === "Realizada")
              .map((visita) => (
                <VisitaCard key={visita.id} visita={visita} />
              ))}
          </TabsContent>
          
          <TabsContent value="agendadas" className="space-y-4">
            {mockVisitas
              .filter(v => v.status === "Agendada")
              .map((visita) => (
                <VisitaCard key={visita.id} visita={visita} />
              ))}
          </TabsContent>
          
          <TabsContent value="pendentes" className="space-y-4">
            {mockVisitas
              .filter(v => v.status === "Não realizada" || v.status === "Cancelada")
              .map((visita) => (
                <VisitaCard key={visita.id} visita={visita} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

const VisitaCard = ({ visita }: { visita: Visita }) => {
  const statusColor = {
    "Realizada": "bg-green-100 text-green-800",
    "Agendada": "bg-blue-100 text-blue-800",
    "Não realizada": "bg-amber-100 text-amber-800",
    "Cancelada": "bg-red-100 text-red-800"
  };

  const statusClass = statusColor[visita.status as keyof typeof statusColor] || "bg-gray-100 text-gray-800";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Família de {visita.familia.referencia.nome}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(visita.dataVisita).toLocaleDateString()}
              {visita.status === "Agendada" && <Clock className="h-4 w-4 ml-2 mr-1" />}
            </div>
          </div>
          <Badge className={statusClass}>{visita.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> Endereço
            </p>
            <p>{visita.endereco}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium flex items-center">
              <User className="h-4 w-4 mr-1" /> Técnico Responsável
            </p>
            <p>{visita.tecnicoResponsavel.nome}</p>
            <p className="text-xs text-gray-500">{visita.tecnicoResponsavel.cargo} ({visita.tecnicoResponsavel.registro})</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Motivo da Visita</p>
            <p>{visita.motivoVisita}</p>
          </div>
        </div>
        
        {visita.relatorio && (
          <div className="mt-4">
            <p className="text-gray-500 font-medium mb-1">Relatório da Visita</p>
            <p className="text-sm bg-gray-50 p-2 rounded">{visita.relatorio}</p>
          </div>
        )}
        
        {visita.encaminhamentos && visita.encaminhamentos.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-500 font-medium mb-1">Encaminhamentos</p>
            <ul className="list-disc list-inside text-sm pl-2">
              {visita.encaminhamentos.map((encaminhamento, index) => (
                <li key={index}>{encaminhamento}</li>
              ))}
            </ul>
          </div>
        )}
        
        {visita.motivoNaoRealizada && (
          <div className="mt-4 p-2 bg-amber-50 border border-amber-100 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Motivo de não realização</p>
              <p className="text-sm text-amber-700">{visita.motivoNaoRealizada}</p>
            </div>
          </div>
        )}
        
        {visita.retornoNecessario && (
          <div className="mt-4 flex items-center gap-2">
            <Check className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-700 font-medium">
              Retorno necessário
              {visita.dataProximaVisita && ` (agendado para ${new Date(visita.dataProximaVisita).toLocaleDateString()})`}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Ver detalhes</Button>
        
        {visita.status === "Agendada" && (
          <>
            <Button variant="outline" size="sm">Remarcar</Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
              Cancelar
            </Button>
          </>
        )}
        
        {visita.status === "Agendada" && (
          <Button size="sm">Registrar Visita</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RegistroVisitas;
