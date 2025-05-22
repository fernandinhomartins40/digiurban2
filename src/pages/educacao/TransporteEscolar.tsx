
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Bus, 
  User, 
  Users, 
  Map, 
  FileText, 
  Clock,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { TransportRoute } from "@/types/educacao";

// Mock data for transport routes
const mockRoutes: TransportRoute[] = [
  {
    id: "route1",
    name: "Rota 01 - Centro / Vila Nova",
    description: "Atende as escolas do centro e bairro Vila Nova",
    vehicle: {
      id: "veh1",
      type: "bus",
      plate: "ABC-1234",
      capacity: 44,
      driver: "João Silva"
    },
    schools: [
      {
        id: "sch1",
        name: "Escola Municipal João Paulo",
        arrivalTime: "06:45",
        departureTime: "12:15"
      },
      {
        id: "sch2",
        name: "Escola Municipal Maria José",
        arrivalTime: "07:00",
        departureTime: "12:30"
      }
    ],
    stops: [
      {
        id: "stop1",
        name: "Terminal Central",
        time: "06:15",
        location: "Av. Central, s/n",
        studentsCount: 12
      },
      {
        id: "stop2",
        name: "Praça Vila Nova",
        time: "06:30",
        location: "Rua das Flores, 123",
        studentsCount: 8
      },
      {
        id: "stop3",
        name: "Mercado Municipal",
        time: "06:40",
        location: "Av. do Comércio, 500",
        studentsCount: 10
      }
    ],
    distance: 15.5,
    estimatedTime: 45,
    active: true
  },
  {
    id: "route2",
    name: "Rota 02 - Zona Rural",
    description: "Atende alunos da zona rural para as escolas do centro",
    vehicle: {
      id: "veh2",
      type: "van",
      plate: "DEF-5678",
      capacity: 16,
      driver: "Maria Oliveira"
    },
    schools: [
      {
        id: "sch1",
        name: "Escola Municipal João Paulo",
        arrivalTime: "07:00",
        departureTime: "12:15"
      }
    ],
    stops: [
      {
        id: "stop4",
        name: "Fazenda São João",
        time: "05:45",
        location: "Estrada Rural, km 5",
        studentsCount: 4
      },
      {
        id: "stop5",
        name: "Vila dos Agricultores",
        time: "06:00",
        location: "Estrada Rural, km 8",
        studentsCount: 6
      },
      {
        id: "stop6",
        name: "Ponte do Rio Claro",
        time: "06:20",
        location: "Estrada Rural, km 12",
        studentsCount: 5
      }
    ],
    distance: 28.3,
    estimatedTime: 75,
    active: true
  },
  {
    id: "route3",
    name: "Rota 03 - Jardim América",
    description: "Atende o bairro Jardim América e adjacências",
    vehicle: {
      id: "veh3",
      type: "microbus",
      plate: "GHI-9012",
      capacity: 28,
      driver: "Carlos Santos",
      helper: "Ana Lima"
    },
    schools: [
      {
        id: "sch2",
        name: "Escola Municipal Maria José",
        arrivalTime: "06:50",
        departureTime: "12:30"
      },
      {
        id: "sch3",
        name: "CMEI Pequeno Príncipe",
        arrivalTime: "07:10",
        departureTime: "17:00"
      }
    ],
    stops: [
      {
        id: "stop7",
        name: "Praça Jardim América",
        time: "06:15",
        location: "Rua das Acácias, 50",
        studentsCount: 9
      },
      {
        id: "stop8",
        name: "Mercado Bom Preço",
        time: "06:25",
        location: "Av. das Palmeiras, 300",
        studentsCount: 11
      },
      {
        id: "stop9",
        name: "Posto de Saúde",
        time: "06:35",
        location: "Rua da Saúde, 75",
        studentsCount: 8
      }
    ],
    distance: 12.8,
    estimatedTime: 55,
    active: false
  }
];

// Helper function for vehicle type badge
const getVehicleTypeBadge = (type: string) => {
  switch (type) {
    case "bus":
      return {
        label: "Ônibus",
        class: "bg-blue-100 text-blue-800"
      };
    case "van":
      return {
        label: "Van",
        class: "bg-green-100 text-green-800"
      };
    case "microbus":
      return {
        label: "Micro-ônibus",
        class: "bg-purple-100 text-purple-800"
      };
    case "car":
      return {
        label: "Carro",
        class: "bg-amber-100 text-amber-800"
      };
    default:
      return {
        label: type,
        class: "bg-gray-100 text-gray-800"
      };
  }
};

const TransporteEscolar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("rotas");

  // Filter routes based on search and filters
  const filteredRoutes = mockRoutes.filter((route) => {
    return (
      (route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       route.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (vehicleFilter === "" || route.vehicle.type === vehicleFilter) &&
      (schoolFilter === "" || route.schools.some(school => school.id === schoolFilter)) &&
      (statusFilter === "" || 
       (statusFilter === "active" && route.active) ||
       (statusFilter === "inactive" && !route.active))
    );
  });

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Transporte Escolar</h1>
        
        <Tabs defaultValue="rotas" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="rotas">Rotas</TabsTrigger>
            <TabsTrigger value="veiculos">Veículos</TabsTrigger>
            <TabsTrigger value="motoristas">Motoristas</TabsTrigger>
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
          </TabsList>

          <TabsContent value="rotas">
            <Card>
              <CardHeader>
                <CardTitle>Rotas de Transporte Escolar</CardTitle>
                <CardDescription>
                  Gerenciamento das rotas de transporte para os alunos da rede
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Buscar por nome ou descrição..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tipo de veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os tipos</SelectItem>
                      <SelectItem value="bus">Ônibus</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="microbus">Micro-ônibus</SelectItem>
                      <SelectItem value="car">Carro</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Escola" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as escolas</SelectItem>
                      <SelectItem value="sch1">E.M. João Paulo</SelectItem>
                      <SelectItem value="sch2">E.M. Maria José</SelectItem>
                      <SelectItem value="sch3">CMEI Pequeno Príncipe</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="active">Ativas</SelectItem>
                      <SelectItem value="inactive">Inativas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={() => setActiveTab("nova-rota")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Rota
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome da Rota</TableHead>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Motorista</TableHead>
                        <TableHead>Escolas</TableHead>
                        <TableHead>Distância</TableHead>
                        <TableHead>Alunos</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoutes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            Nenhuma rota encontrada com os filtros selecionados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRoutes.map((route) => {
                          const vehicleBadge = getVehicleTypeBadge(route.vehicle.type);
                          const totalStudents = route.stops.reduce((sum, stop) => sum + stop.studentsCount, 0);
                          
                          return (
                            <TableRow key={route.id}>
                              <TableCell className="font-medium">
                                <div>
                                  {route.name}
                                  <div className="text-xs text-gray-500 mt-1">
                                    {route.description}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={vehicleBadge.class}
                                >
                                  {vehicleBadge.label} ({route.vehicle.plate})
                                </Badge>
                              </TableCell>
                              <TableCell>{route.vehicle.driver}</TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  {route.schools.map((school) => (
                                    <div key={school.id} className="text-sm">
                                      {school.name.length > 20 
                                        ? school.name.substring(0, 20) + "..." 
                                        : school.name}
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>{route.distance} km</TableCell>
                              <TableCell>{totalStudents}</TableCell>
                              <TableCell>
                                {route.active ? (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    Ativa
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-100 text-red-800">
                                    Inativa
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                    <DropdownMenuItem>Editar Rota</DropdownMenuItem>
                                    <DropdownMenuItem>Ver Mapa</DropdownMenuItem>
                                    <DropdownMenuItem>Lista de Alunos</DropdownMenuItem>
                                    <DropdownMenuItem>Imprimir Rota</DropdownMenuItem>
                                    {route.active ? (
                                      <DropdownMenuItem>Desativar Rota</DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem>Ativar Rota</DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Exibindo {filteredRoutes.length} de {mockRoutes.length} rotas
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Exportar Lista</Button>
                  <Button variant="outline">Imprimir Mapa de Rotas</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="veiculos">
            <Card>
              <CardHeader>
                <CardTitle>Veículos de Transporte Escolar</CardTitle>
                <CardDescription>
                  Gerenciamento e manutenção da frota de veículos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Buscar por placa ou motorista..."
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tipo de veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="bus">Ônibus</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="microbus">Micro-ônibus</SelectItem>
                      <SelectItem value="car">Carro</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="active">Em operação</SelectItem>
                      <SelectItem value="maintenance">Em manutenção</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Veículo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Vehicle Card */}
                  <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Em operação
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bus className="h-5 w-5 text-blue-500" />
                        <div>
                          <span>Ônibus - ABC-1234</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <div className="text-gray-500">Capacidade:</div>
                        <div>44 alunos</div>
                        
                        <div className="text-gray-500">Motorista:</div>
                        <div>João Silva</div>
                        
                        <div className="text-gray-500">Ano/Modelo:</div>
                        <div>2020</div>
                        
                        <div className="text-gray-500">Última Revisão:</div>
                        <div>10/03/2023</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Detalhes do Veículo
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Vehicle Card */}
                  <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Em operação
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bus className="h-5 w-5 text-green-500" />
                        <div>
                          <span>Van - DEF-5678</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <div className="text-gray-500">Capacidade:</div>
                        <div>16 alunos</div>
                        
                        <div className="text-gray-500">Motorista:</div>
                        <div>Maria Oliveira</div>
                        
                        <div className="text-gray-500">Ano/Modelo:</div>
                        <div>2021</div>
                        
                        <div className="text-gray-500">Última Revisão:</div>
                        <div>05/04/2023</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Detalhes do Veículo
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Vehicle Card - Maintenance */}
                  <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        Em manutenção
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bus className="h-5 w-5 text-purple-500" />
                        <div>
                          <span>Micro-ônibus - GHI-9012</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <div className="text-gray-500">Capacidade:</div>
                        <div>28 alunos</div>
                        
                        <div className="text-gray-500">Motorista:</div>
                        <div>Carlos Santos</div>
                        
                        <div className="text-gray-500">Ano/Modelo:</div>
                        <div>2019</div>
                        
                        <div className="text-gray-500">Retorno previsto:</div>
                        <div className="text-amber-600">15/05/2023</div>
                      </div>
                      
                      <div className="bg-amber-50 p-2 rounded-md border border-amber-200 mt-2">
                        <div className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-xs text-amber-700">
                            Em manutenção corretiva do sistema de freios. Previsão de retorno em 15/05/2023.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Detalhes do Veículo
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Veículo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="motoristas">
            <Card>
              <CardHeader>
                <CardTitle>Motoristas e Monitores</CardTitle>
                <CardDescription>
                  Gestão dos profissionais de transporte escolar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Buscar por nome, documento ou função..."
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as funções</SelectItem>
                      <SelectItem value="driver">Motorista</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os veículos</SelectItem>
                      <SelectItem value="veh1">Ônibus - ABC-1234</SelectItem>
                      <SelectItem value="veh2">Van - DEF-5678</SelectItem>
                      <SelectItem value="veh3">Micro-ônibus - GHI-9012</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Profissional
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Rotas</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">João Silva</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Motorista
                          </Badge>
                        </TableCell>
                        <TableCell>123.456.789-00</TableCell>
                        <TableCell>Ônibus - ABC-1234</TableCell>
                        <TableCell>Rota 01 - Centro / Vila Nova</TableCell>
                        <TableCell>(11) 99999-8888</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Maria Oliveira</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Motorista
                          </Badge>
                        </TableCell>
                        <TableCell>987.654.321-00</TableCell>
                        <TableCell>Van - DEF-5678</TableCell>
                        <TableCell>Rota 02 - Zona Rural</TableCell>
                        <TableCell>(11) 98888-7777</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Carlos Santos</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Motorista
                          </Badge>
                        </TableCell>
                        <TableCell>111.222.333-44</TableCell>
                        <TableCell>Micro-ônibus - GHI-9012</TableCell>
                        <TableCell>Rota 03 - Jardim América</TableCell>
                        <TableCell>(11) 97777-6666</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Ana Lima</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800">
                            Monitora
                          </Badge>
                        </TableCell>
                        <TableCell>444.555.666-77</TableCell>
                        <TableCell>Micro-ônibus - GHI-9012</TableCell>
                        <TableCell>Rota 03 - Jardim América</TableCell>
                        <TableCell>(11) 96666-5555</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Exibindo 4 profissionais
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Exportar Lista</Button>
                  <Button variant="outline">Escala de Trabalho</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="alunos">
            <Card>
              <CardHeader>
                <CardTitle>Alunos Transportados</CardTitle>
                <CardDescription>
                  Gerenciamento dos alunos que utilizam o transporte escolar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Buscar por nome ou endereço..."
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Escola" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as escolas</SelectItem>
                      <SelectItem value="sch1">E.M. João Paulo</SelectItem>
                      <SelectItem value="sch2">E.M. Maria José</SelectItem>
                      <SelectItem value="sch3">CMEI Pequeno Príncipe</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Rota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as rotas</SelectItem>
                      <SelectItem value="route1">Rota 01 - Centro / Vila Nova</SelectItem>
                      <SelectItem value="route2">Rota 02 - Zona Rural</SelectItem>
                      <SelectItem value="route3">Rota 03 - Jardim América</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Aluno
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <p className="text-2xl font-bold">78</p>
                          <p className="text-xs text-gray-500">transportados</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Distância Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Map className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                          <p className="text-2xl font-bold">56,6 km</p>
                          <p className="text-xs text-gray-500">diariamente</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Bus className="h-8 w-8 text-purple-500 mr-3" />
                        <div>
                          <p className="text-2xl font-bold">3</p>
                          <p className="text-xs text-gray-500">em operação</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Clock className="h-8 w-8 text-amber-500 mr-3" />
                        <div>
                          <p className="text-2xl font-bold">42 min</p>
                          <p className="text-xs text-gray-500">por rota</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Escola</TableHead>
                        <TableHead>Série/Turma</TableHead>
                        <TableHead>Rota</TableHead>
                        <TableHead>Ponto de Embarque</TableHead>
                        <TableHead>Turno</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Ana Silva</TableCell>
                        <TableCell>E.M. João Paulo</TableCell>
                        <TableCell>5º ano A</TableCell>
                        <TableCell>Rota 01 - Centro / Vila Nova</TableCell>
                        <TableCell>Terminal Central</TableCell>
                        <TableCell>Manhã</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pedro Santos</TableCell>
                        <TableCell>E.M. João Paulo</TableCell>
                        <TableCell>5º ano A</TableCell>
                        <TableCell>Rota 01 - Centro / Vila Nova</TableCell>
                        <TableCell>Praça Vila Nova</TableCell>
                        <TableCell>Manhã</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Maria Oliveira</TableCell>
                        <TableCell>E.M. Maria José</TableCell>
                        <TableCell>8º ano B</TableCell>
                        <TableCell>Rota 03 - Jardim América</TableCell>
                        <TableCell>Posto de Saúde</TableCell>
                        <TableCell>Manhã</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">João Pereira</TableCell>
                        <TableCell>E.M. Maria José</TableCell>
                        <TableCell>5º ano C</TableCell>
                        <TableCell>Rota 02 - Zona Rural</TableCell>
                        <TableCell>Fazenda São João</TableCell>
                        <TableCell>Manhã</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Exibindo 4 de 78 alunos
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Exportar Lista</Button>
                  <Button variant="outline">Imprimir Carteirinhas</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="nova-rota">
            <Card>
              <CardHeader>
                <CardTitle>Cadastrar Nova Rota</CardTitle>
                <CardDescription>
                  Defina uma nova rota para o transporte escolar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações da Rota</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome da Rota</label>
                      <Input placeholder="Ex: Rota 04 - Jardim Primavera" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descrição</label>
                      <Input placeholder="Descreva brevemente a rota" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Veículo</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um veículo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veh1">Ônibus - ABC-1234</SelectItem>
                          <SelectItem value="veh2">Van - DEF-5678</SelectItem>
                          <SelectItem value="veh3">Micro-ônibus - GHI-9012</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Motorista</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um motorista" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="driver1">João Silva</SelectItem>
                          <SelectItem value="driver2">Maria Oliveira</SelectItem>
                          <SelectItem value="driver3">Carlos Santos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Monitor</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um monitor (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monitor1">Ana Lima</SelectItem>
                          <SelectItem value="monitor2">Paulo Ferreira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Turno</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Manhã</SelectItem>
                          <SelectItem value="afternoon">Tarde</SelectItem>
                          <SelectItem value="evening">Noite</SelectItem>
                          <SelectItem value="all">Todos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Escolas Atendidas</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 items-end">
                      <div className="col-span-3 md:col-span-1 space-y-2">
                        <label className="text-sm font-medium">Escola</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma escola" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sch1">Escola Municipal João Paulo</SelectItem>
                            <SelectItem value="sch2">Escola Municipal Maria José</SelectItem>
                            <SelectItem value="sch3">CMEI Pequeno Príncipe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Horário de Chegada</label>
                        <Input type="time" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Horário de Saída</label>
                        <Input type="time" />
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Outra Escola
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pontos de Parada</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-8 gap-4 items-end">
                      <div className="col-span-8 md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Nome do Ponto</label>
                        <Input placeholder="Ex: Terminal Central" />
                      </div>
                      
                      <div className="col-span-8 md:col-span-3 space-y-2">
                        <label className="text-sm font-medium">Endereço</label>
                        <Input placeholder="Rua, número, bairro" />
                      </div>
                      
                      <div className="col-span-4 md:col-span-1 space-y-2">
                        <label className="text-sm font-medium">Horário</label>
                        <Input type="time" />
                      </div>
                      
                      <div className="col-span-4 md:col-span-1 space-y-2">
                        <label className="text-sm font-medium">Nº Alunos</label>
                        <Input type="number" placeholder="0" />
                      </div>
                      
                      <div className="col-span-8 md:col-span-1 self-end">
                        <Button variant="ghost" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Outro Ponto
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Adicionais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Distância Total (km)</label>
                      <Input type="number" step="0.1" placeholder="0.0" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tempo Estimado (minutos)</label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Observações</label>
                    <Textarea placeholder="Informações adicionais sobre a rota" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("rotas")}>
                  Cancelar
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">Visualizar no Mapa</Button>
                  <Button onClick={() => setActiveTab("rotas")}>
                    Salvar Rota
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TransporteEscolar;
