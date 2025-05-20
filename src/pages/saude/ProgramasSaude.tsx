
import { useState } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Search, Activity, FileText, User } from "lucide-react";
import { HealthProgram } from "@/types/saude";

// Mock data
const mockPrograms: HealthProgram[] = [
  {
    id: "1",
    name: "Hipertensão e Diabetes (HiperDia)",
    description: "Programa de acompanhamento contínuo para pacientes hipertensos e diabéticos",
    targetAudience: "Pessoas diagnosticadas com hipertensão e/ou diabetes",
    startDate: "2023-01-01",
    coordinator: "Dra. Ana Pereira",
    status: "ativo",
    enrolledPatients: 780,
    metrics: {
      consultas: 3120,
      exames: 2340,
      medicamentos: 6240,
      vacinacao: 624
    }
  },
  {
    id: "2",
    name: "Saúde da Gestante",
    description: "Acompanhamento pré-natal para gestantes",
    targetAudience: "Gestantes de todas as idades",
    startDate: "2023-03-15",
    coordinator: "Dra. Mariana Alves",
    status: "ativo",
    enrolledPatients: 245,
    metrics: {
      consultas: 1225,
      exames: 980,
      medicamentos: 735,
      vacinacao: 245
    }
  },
  {
    id: "3",
    name: "Saúde Mental na Comunidade",
    description: "Atendimento e acompanhamento para casos de saúde mental",
    targetAudience: "Pessoas com transtornos mentais leves, moderados e graves",
    startDate: "2023-06-10",
    coordinator: "Dr. Ricardo Martins",
    status: "ativo",
    enrolledPatients: 320,
    metrics: {
      consultas: 1280,
      grupos: 96,
      medicamentos: 2880,
      encaminhamentos: 64
    }
  },
  {
    id: "4",
    name: "Saúde do Idoso",
    description: "Programa de atenção integral à saúde da pessoa idosa",
    targetAudience: "Pessoas acima de 60 anos",
    startDate: "2023-02-20",
    coordinator: "Dr. Carlos Santos",
    status: "ativo",
    enrolledPatients: 520,
    metrics: {
      consultas: 2080,
      visitas: 1560,
      exames: 1560,
      medicamentos: 4680
    }
  },
  {
    id: "5",
    name: "Tabagismo",
    description: "Programa de controle e abandono do tabagismo",
    targetAudience: "Fumantes que desejam abandonar o vício",
    startDate: "2023-09-05",
    coordinator: "Dr. Felipe Souza",
    status: "ativo",
    enrolledPatients: 150,
    metrics: {
      consultas: 600,
      grupos: 120,
      medicamentos: 450,
      abandonos: 30
    }
  },
  {
    id: "6",
    name: "Saúde da Criança",
    description: "Acompanhamento do crescimento e desenvolvimento infantil",
    targetAudience: "Crianças de 0 a 10 anos",
    startDate: "2023-01-10",
    coordinator: "Dra. Mariana Alves",
    status: "ativo",
    enrolledPatients: 430,
    metrics: {
      consultas: 1720,
      vacinacao: 1290,
      exames: 860,
      avaliacao_nutricional: 430
    }
  },
  {
    id: "7",
    name: "Controle da Tuberculose",
    description: "Diagnóstico, tratamento e acompanhamento de casos de tuberculose",
    targetAudience: "Pessoas com diagnóstico de tuberculose e seus contatos",
    startDate: "2023-08-15",
    coordinator: "Dr. Carlos Santos",
    status: "ativo",
    enrolledPatients: 45,
    metrics: {
      consultas: 270,
      exames: 135,
      medicamentos: 405,
      visitas: 90
    }
  },
  {
    id: "8",
    name: "Prevenção de ISTs",
    description: "Programa de prevenção e controle de infecções sexualmente transmissíveis",
    targetAudience: "População sexualmente ativa",
    startDate: "2023-05-10",
    status: "em planejamento",
    coordinator: "Dra. Ana Pereira",
    enrolledPatients: 0,
    metrics: {}
  }
];

const statusColors: Record<string, string> = {
  "ativo": "bg-green-500",
  "em planejamento": "bg-amber-500",
  "inativo": "bg-red-500",
};

// Sample patient data for the detailed program view
const samplePatients = [
  { id: "P1", name: "Maria Silva", age: 65, enrollment: "2023-02-25", lastVisit: "2025-05-10", status: "regular" },
  { id: "P2", name: "João Oliveira", age: 58, enrollment: "2023-03-12", lastVisit: "2025-05-05", status: "regular" },
  { id: "P3", name: "Antônio Ferreira", age: 72, enrollment: "2023-02-28", lastVisit: "2025-04-20", status: "irregular" },
  { id: "P4", name: "Luiza Costa", age: 67, enrollment: "2023-04-05", lastVisit: "2025-05-15", status: "regular" },
  { id: "P5", name: "Roberto Gomes", age: 70, enrollment: "2023-03-18", lastVisit: "2025-03-10", status: "irregular" },
];

const ProgramasSaude = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  
  // Filter programs based on the search term and status
  const filteredPrograms = mockPrograms.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? program.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Count programs by status
  const activePrograms = mockPrograms.filter(p => p.status === "ativo").length;
  const planningPrograms = mockPrograms.filter(p => p.status === "em planejamento").length;
  const enrolledTotal = mockPrograms.reduce((total, program) => total + program.enrolledPatients, 0);

  // Get statuses for the filter
  const statuses = Array.from(new Set(mockPrograms.map((p) => p.status)));

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Programas de Saúde</h1>
          <Button>
            <Calendar className="mr-2 h-4 w-4" /> Novo Programa
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle>Programas Ativos</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{activePrograms}</div>
              <p className="text-sm text-muted-foreground mt-2">Programas em execução</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
              <CardTitle>Em Planejamento</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{planningPrograms}</div>
              <p className="text-sm text-muted-foreground mt-2">Novos programas em desenvolvimento</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <CardTitle>Pessoas Atendidas</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{enrolledTotal.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">Pacientes em acompanhamento</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={selectedProgram || "todos"} onValueChange={(value) => {
          if (value !== "todos" && value !== "novo") {
            setSelectedProgram(value);
          }
        }}>
          <TabsList className="mb-4 overflow-auto">
            <TabsTrigger value="todos">Todos os Programas</TabsTrigger>
            {filteredPrograms.map((program) => (
              <TabsTrigger key={program.id} value={program.id}>{program.name}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="todos">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Programas de Saúde</CardTitle>
                <CardDescription>
                  Visualize e gerencie os programas contínuos de saúde
                </CardDescription>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar programa..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Programa</TableHead>
                        <TableHead>Público Alvo</TableHead>
                        <TableHead>Coordenador</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Pacientes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrograms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            Nenhum programa encontrado com os filtros aplicados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPrograms.map((program) => (
                          <TableRow key={program.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div className="font-bold">{program.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {program.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Users className="mr-2 h-4 w-4" />
                                {program.targetAudience}
                              </div>
                            </TableCell>
                            <TableCell>{program.coordinator}</TableCell>
                            <TableCell>{new Date(program.startDate).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {program.enrolledPatients} pacientes
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${statusColors[program.status]} text-white`}>
                                {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedProgram(program.id)}>
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Activity className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Exibindo {filteredPrograms.length} de {mockPrograms.length} programas
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {filteredPrograms.map((program) => (
            <TabsContent key={program.id} value={program.id}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>{program.name}</CardTitle>
                          <CardDescription>{program.description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className={`${statusColors[program.status]} text-white`}>
                          {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Informações do Programa</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Público Alvo</p>
                              <p>{program.targetAudience}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Coordenador</p>
                              <p>{program.coordinator}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Data de Início</p>
                              <p>{new Date(program.startDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Total de Pacientes</p>
                              <p>{program.enrolledPatients} pacientes em acompanhamento</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Indicadores</h3>
                          <div className="space-y-4">
                            {Object.entries(program.metrics).map(([key, value]) => (
                              <div key={key}>
                                <p className="text-sm font-medium text-muted-foreground">
                                  {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                                </p>
                                <p>{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Pacientes Cadastrados</h3>
                        
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Idade</TableHead>
                                <TableHead>Data de Cadastro</TableHead>
                                <TableHead>Último Atendimento</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {samplePatients.map((patient) => (
                                <TableRow key={patient.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center">
                                      <User className="mr-2 h-4 w-4" />
                                      {patient.name}
                                    </div>
                                  </TableCell>
                                  <TableCell>{patient.age} anos</TableCell>
                                  <TableCell>{new Date(patient.enrollment).toLocaleDateString('pt-BR')}</TableCell>
                                  <TableCell>{new Date(patient.lastVisit).toLocaleDateString('pt-BR')}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={patient.status === "regular" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                                      {patient.status === "regular" ? "Regular" : "Irregular"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button variant="outline" size="sm">
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div className="mt-2 flex justify-between">
                          <p className="text-sm text-muted-foreground">
                            Exibindo {samplePatients.length} de {program.enrolledPatients} pacientes
                          </p>
                          <Button variant="outline" size="sm">Ver todos os pacientes</Button>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setSelectedProgram("")}>
                        Voltar para a lista
                      </Button>
                      <div>
                        <Button variant="outline" className="mr-2">
                          <FileText className="mr-2 h-4 w-4" />
                          Relatórios
                        </Button>
                        <Button>
                          Gerenciar Programa
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
                
                <div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Faixa Etária</CardTitle>
                        <CardDescription>Distribuição por idade</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[200px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                        <p className="text-muted-foreground">
                          [Gráfico de faixa etária]
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Área Geográfica</CardTitle>
                        <CardDescription>Cobertura por bairro</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[200px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                        <p className="text-muted-foreground">
                          [Mapa de calor por região]
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Efetividade</CardTitle>
                        <CardDescription>Indicadores de resultado</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[200px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                        <p className="text-muted-foreground">
                          [Gráfico de efetividade]
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProgramasSaude;
