
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
import { Progress } from "@/components/ui/progress";
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
import { Calendar, User, Search, MapPin, FileText, Home } from "lucide-react";
import { ACSVisit } from "@/types/saude";

// Mock data
const mockVisits: ACSVisit[] = [
  {
    id: "1",
    agentName: "Ana Santos",
    area: "01",
    micro: "002",
    familyId: "F12345",
    address: "Rua das Flores, 123 - Bairro Central",
    visitDate: "2025-05-18",
    visitTime: "09:00",
    visitType: "rotina",
    completed: true,
    findings: "Família em boas condições de saúde. Acompanhamento regular de idoso hipertenso.",
    followUpRequired: false
  },
  {
    id: "2",
    agentName: "Carlos Oliveira",
    area: "02",
    micro: "005",
    familyId: "F23456",
    address: "Av. Principal, 456 - Bairro Norte",
    visitDate: "2025-05-18",
    visitTime: "10:30",
    visitType: "acompanhamento",
    completed: true,
    findings: "Gestante no 7º mês, pré-natal em dia. Orientada sobre sinais de alerta.",
    followUpRequired: true
  },
  {
    id: "3",
    agentName: "Mariana Silva",
    area: "03",
    micro: "001",
    familyId: "F34567",
    address: "Rua das Acácias, 789 - Bairro Sul",
    visitDate: "2025-05-19",
    visitTime: "14:00",
    visitType: "busca ativa",
    completed: false,
    findings: "",
    followUpRequired: false
  },
  {
    id: "4",
    agentName: "Pedro Souza",
    area: "01",
    micro: "003",
    familyId: "F45678",
    address: "Rua dos Ipês, 234 - Bairro Central",
    visitDate: "2025-05-19",
    visitTime: "15:30",
    visitType: "rotina",
    completed: false,
    findings: "",
    followUpRequired: false
  },
  {
    id: "5",
    agentName: "Juliana Costa",
    area: "04",
    micro: "002",
    familyId: "F56789",
    address: "Rua das Palmeiras, 567 - Bairro Oeste",
    visitDate: "2025-05-18",
    visitTime: "11:00",
    visitType: "primeira visita",
    completed: true,
    findings: "Família recém-chegada ao bairro. Dois adultos e três crianças. Uma criança com asma.",
    followUpRequired: true
  }
];

// Mock ACS Agents
const mockAgents = [
  { id: "1", name: "Ana Santos", area: "01", micros: ["001", "002"], totalFamilies: 120, visitedThisMonth: 78 },
  { id: "2", name: "Carlos Oliveira", area: "02", micros: ["005"], totalFamilies: 95, visitedThisMonth: 62 },
  { id: "3", name: "Mariana Silva", area: "03", micros: ["001"], totalFamilies: 110, visitedThisMonth: 55 },
  { id: "4", name: "Pedro Souza", area: "01", micros: ["003"], totalFamilies: 105, visitedThisMonth: 67 },
  { id: "5", name: "Juliana Costa", area: "04", micros: ["002"], totalFamilies: 115, visitedThisMonth: 71 },
];

// Mock Areas with coverage
const mockAreas = [
  { area: "01", name: "Centro", totalFamilies: 225, visitedFamilies: 145, coverage: 64 },
  { area: "02", name: "Norte", totalFamilies: 95, visitedFamilies: 62, coverage: 65 },
  { area: "03", name: "Sul", totalFamilies: 110, visitedFamilies: 55, coverage: 50 },
  { area: "04", name: "Oeste", totalFamilies: 115, visitedFamilies: 71, coverage: 62 },
];

const visitTypeColors: Record<string, string> = {
  "rotina": "bg-blue-500",
  "acompanhamento": "bg-purple-500",
  "busca ativa": "bg-amber-500",
  "primeira visita": "bg-green-500",
};

const ACS = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState<string>("");
  const [filterAgent, setFilterAgent] = useState<string>("");
  
  // Filter visits based on the search, area, and agent
  const filteredVisits = mockVisits.filter((visit) => {
    const matchesSearch = 
      visit.familyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea ? visit.area === filterArea : true;
    const matchesAgent = filterAgent ? visit.agentName === filterAgent : true;
    
    return matchesSearch && matchesArea && matchesAgent;
  });

  // Extract unique areas for the filter
  const areas = Array.from(new Set(mockVisits.map((visit) => visit.area)));
  
  // Extract unique agents for the filter
  const agents = Array.from(new Set(mockVisits.map((visit) => visit.agentName)));

  // Calculate coverage statistics
  const totalFamilies = mockAreas.reduce((sum, area) => sum + area.totalFamilies, 0);
  const totalVisited = mockAreas.reduce((sum, area) => sum + area.visitedFamilies, 0);
  const overallCoverage = Math.round((totalVisited / totalFamilies) * 100);

  // Count statistics
  const pendingVisits = mockVisits.filter(v => !v.completed).length;
  const completedVisits = mockVisits.filter(v => v.completed).length;
  const followUpRequired = mockVisits.filter(v => v.followUpRequired).length;

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">ACS - Agentes Comunitários de Saúde</h1>
          <Button>
            <Calendar className="mr-2 h-4 w-4" /> Agendar Visita
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <CardTitle>Cobertura</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{overallCoverage}%</div>
              <div className="mt-2">
                <Progress value={overallCoverage} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {totalVisited} de {totalFamilies} famílias visitadas este mês
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle>Visitas Realizadas</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{completedVisits}</div>
              <p className="text-sm text-muted-foreground mt-2">Visitas concluídas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
              <CardTitle>Visitas Pendentes</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{pendingVisits}</div>
              <p className="text-sm text-muted-foreground mt-2">Agendadas para hoje e amanhã</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
              <CardTitle>Acompanhamentos</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{followUpRequired}</div>
              <p className="text-sm text-muted-foreground mt-2">Necessitam de seguimento</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visitas">
          <TabsList className="grid grid-cols-4 mb-4 w-[500px]">
            <TabsTrigger value="visitas">Visitas</TabsTrigger>
            <TabsTrigger value="agentes">Agentes</TabsTrigger>
            <TabsTrigger value="areas">Áreas</TabsTrigger>
            <TabsTrigger value="mapa">Mapa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visitas">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Visitas Domiciliares</CardTitle>
                <CardDescription>
                  Acompanhe e registre as visitas dos Agentes Comunitários de Saúde
                </CardDescription>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por família ou endereço..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={filterArea} onValueChange={setFilterArea}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as áreas</SelectItem>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>
                          Área {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterAgent} onValueChange={setFilterAgent}>
                    <SelectTrigger className="w-full sm:w-[220px]">
                      <SelectValue placeholder="Agente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os agentes</SelectItem>
                      {agents.map((agent) => (
                        <SelectItem key={agent} value={agent}>
                          {agent}
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
                        <TableHead>Família</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Agente</TableHead>
                        <TableHead>Área/Micro</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Tipo de Visita</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVisits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            Nenhuma visita encontrada com os filtros aplicados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredVisits.map((visit) => (
                          <TableRow key={visit.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Home className="mr-2 h-4 w-4" />
                                {visit.familyId}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                {visit.address}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                {visit.agentName}
                              </div>
                            </TableCell>
                            <TableCell>
                              {visit.area}/{visit.micro}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>{new Date(visit.visitDate).toLocaleDateString('pt-BR')}</div>
                                <div className="text-xs text-muted-foreground">{visit.visitTime}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${visitTypeColors[visit.visitType]} text-white`}>
                                {visit.visitType.charAt(0).toUpperCase() + visit.visitType.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={visit.completed ? "outline" : "secondary"} className={visit.completed ? "bg-green-100 text-green-800" : ""}>
                                {visit.completed ? "Realizada" : "Pendente"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {visit.completed ? (
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button variant="default" size="sm">
                                    Registrar
                                  </Button>
                                )}
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
                  Exibindo {filteredVisits.length} de {mockVisits.length} visitas
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="agentes">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        <CardTitle>{agent.name}</CardTitle>
                      </div>
                      <Badge>Área {agent.area}</Badge>
                    </div>
                    <CardDescription>
                      Microáreas: {agent.micros.join(", ")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Cobertura do mês</span>
                          <span className="text-sm font-medium">{Math.round((agent.visitedThisMonth / agent.totalFamilies) * 100)}%</span>
                        </div>
                        <Progress value={Math.round((agent.visitedThisMonth / agent.totalFamilies) * 100)} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {agent.visitedThisMonth} de {agent.totalFamilies} famílias visitadas
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Visitas hoje</p>
                          <p className="text-2xl font-bold">
                            {Math.floor(Math.random() * 8) + 1}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Pendentes</p>
                          <p className="text-2xl font-bold">
                            {Math.floor(Math.random() * 5)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        Agenda
                      </Button>
                      <Button className="flex-1">
                        Relatório
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="areas">
            <Card>
              <CardHeader>
                <CardTitle>Cobertura por Área</CardTitle>
                <CardDescription>
                  Acompanhamento da cobertura de visitas por área geográfica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Área</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Total de Famílias</TableHead>
                        <TableHead>Visitadas no Mês</TableHead>
                        <TableHead>Cobertura</TableHead>
                        <TableHead>Agentes</TableHead>
                        <TableHead>Situação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAreas.map((area) => (
                        <TableRow key={area.area}>
                          <TableCell className="font-medium">{area.area}</TableCell>
                          <TableCell>{area.name}</TableCell>
                          <TableCell>{area.totalFamilies}</TableCell>
                          <TableCell>{area.visitedFamilies}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{area.coverage}%</span>
                              </div>
                              <Progress value={area.coverage} className={area.coverage < 50 ? "bg-red-500" : area.coverage < 70 ? "bg-amber-500" : "bg-green-500"} />
                            </div>
                          </TableCell>
                          <TableCell>
                            {mockAgents.filter(agent => agent.area === area.area).length}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              area.coverage < 50 
                                ? "bg-red-100 text-red-800" 
                                : area.coverage < 70 
                                ? "bg-amber-100 text-amber-800" 
                                : "bg-green-100 text-green-800"
                            }>
                              {area.coverage < 50 
                                ? "Baixa" 
                                : area.coverage < 70 
                                ? "Regular" 
                                : "Boa"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Situações de Risco Identificadas</h3>
                  
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="bg-red-50 dark:bg-red-900/20 py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Área 03 - Micro 001</CardTitle>
                          <Badge variant="destructive">Alta Prioridade</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3">
                        <p>Identificadas 3 gestantes sem acompanhamento pré-natal adequado</p>
                      </CardContent>
                      <CardFooter className="py-3 flex justify-end">
                        <Button size="sm">Ver Detalhes</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="bg-amber-50 dark:bg-amber-900/20 py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Área 01 - Micro 002</CardTitle>
                          <Badge className="bg-amber-500 text-white">Média Prioridade</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3">
                        <p>5 idosos hipertensos não compareceram à última consulta agendada</p>
                      </CardContent>
                      <CardFooter className="py-3 flex justify-end">
                        <Button size="sm">Ver Detalhes</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mapa">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Atuação dos ACS</CardTitle>
                <CardDescription>
                  Visualização geográfica da cobertura dos Agentes Comunitários de Saúde
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[600px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  [Aqui será exibido um mapa interativo com a distribuição geográfica das áreas e microáreas]
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ACS;
