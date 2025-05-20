
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
import { Ambulance, Calendar, Search, User, MapPin, FileText } from "lucide-react";
import { PatientTransport } from "@/types/saude";

// Mock data
const mockTransports: PatientTransport[] = [
  {
    id: "1",
    patientId: "101",
    patientName: "Maria Silva",
    origin: "Residência - Rua das Flores, 123",
    destination: "Hospital Regional",
    date: "2025-05-22",
    time: "09:00",
    returnScheduled: true,
    returnDate: "2025-05-22",
    returnTime: "13:00",
    reason: "Consulta com cardiologista",
    specialRequirements: "Paciente com dificuldade de locomoção",
    vehicleType: "van",
    status: "agendado",
    responsibleName: "Pedro Motorista"
  },
  {
    id: "2",
    patientId: "102",
    patientName: "João Oliveira",
    origin: "UBS Central",
    destination: "Hospital Estadual",
    date: "2025-05-22",
    time: "10:30",
    returnScheduled: true,
    returnDate: "2025-05-22",
    returnTime: "16:00",
    reason: "Ressonância Magnética",
    vehicleType: "ambulância",
    status: "em andamento",
    responsibleName: "Carlos Motorista"
  },
  {
    id: "3",
    patientId: "103",
    patientName: "Antônio Ferreira",
    origin: "Residência - Av. Principal, 456",
    destination: "Clínica de Fisioterapia",
    date: "2025-05-22",
    time: "14:00",
    returnScheduled: true,
    returnDate: "2025-05-22",
    returnTime: "15:30",
    reason: "Sessão de fisioterapia",
    vehicleType: "carro",
    status: "agendado",
    responsibleName: "Ana Motorista"
  },
  {
    id: "4",
    patientId: "104",
    patientName: "Luiza Costa",
    origin: "Residência - Rua dos Pinheiros, 789",
    destination: "Hospital Regional",
    date: "2025-05-21",
    time: "08:30",
    returnScheduled: true,
    returnDate: "2025-05-21",
    returnTime: "12:00",
    reason: "Hemodiálise",
    specialRequirements: "Paciente em cadeira de rodas",
    vehicleType: "van",
    status: "concluído",
    responsibleName: "Pedro Motorista"
  },
  {
    id: "5",
    patientId: "105",
    patientName: "Roberto Gomes",
    origin: "UBS Norte",
    destination: "Hospital de Especialidades",
    date: "2025-05-23",
    time: "07:00",
    returnScheduled: false,
    reason: "Internação para cirurgia",
    specialRequirements: "Paciente acamado, necessita de maca",
    vehicleType: "ambulância",
    status: "agendado",
    responsibleName: "Carlos Motorista"
  },
  {
    id: "6",
    patientId: "106",
    patientName: "Fernanda Martins",
    origin: "Residência - Rua das Acácias, 234",
    destination: "Centro de Reabilitação",
    date: "2025-05-21",
    time: "13:30",
    returnScheduled: true,
    returnDate: "2025-05-21",
    returnTime: "15:30",
    reason: "Terapia ocupacional",
    vehicleType: "carro",
    status: "concluído",
    responsibleName: "Ana Motorista"
  },
  {
    id: "7",
    patientId: "107",
    patientName: "Paulo Rodrigues",
    origin: "CAPS",
    destination: "Residência - Rua Bela Vista, 567",
    date: "2025-05-20",
    time: "16:00",
    returnScheduled: false,
    reason: "Retorno para residência após atendimento",
    vehicleType: "van",
    status: "cancelado",
    responsibleName: "Pedro Motorista"
  }
];

// Mock vehicle data
const mockVehicles = [
  { id: "V01", type: "ambulância", plate: "AAA-1234", driver: "Carlos Motorista", capacity: "1 maca + 3 passageiros", status: "disponível" },
  { id: "V02", type: "ambulância", plate: "BBB-5678", driver: "Amanda Motorista", capacity: "1 maca + 3 passageiros", status: "em serviço" },
  { id: "V03", type: "van", plate: "CCC-9012", driver: "Pedro Motorista", capacity: "8 passageiros", status: "disponível" },
  { id: "V04", type: "van", plate: "DDD-3456", driver: "Regina Motorista", capacity: "6 passageiros + 2 cadeirantes", status: "em manutenção" },
  { id: "V05", type: "carro", plate: "EEE-7890", driver: "Ana Motorista", capacity: "4 passageiros", status: "disponível" },
  { id: "V06", type: "carro", plate: "FFF-1234", driver: "João Motorista", capacity: "4 passageiros", status: "em serviço" },
];

const statusColors: Record<string, string> = {
  "agendado": "bg-blue-500",
  "em andamento": "bg-purple-500",
  "concluído": "bg-green-500",
  "cancelado": "bg-red-500",
};

const vehicleColors: Record<string, string> = {
  "ambulância": "bg-red-500",
  "van": "bg-blue-500",
  "carro": "bg-green-500",
  "outro": "bg-purple-500",
};

const vehicleStatusColors: Record<string, string> = {
  "disponível": "bg-green-500",
  "em serviço": "bg-blue-500",
  "em manutenção": "bg-amber-500",
  "indisponível": "bg-red-500",
};

const TransportePacientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterVehicleType, setFilterVehicleType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  // Filter transports based on the search, status, vehicle type, and date
  const filteredTransports = mockTransports.filter((transport) => {
    const matchesSearch = 
      transport.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? transport.status === filterStatus : true;
    const matchesVehicle = filterVehicleType ? transport.vehicleType === filterVehicleType : true;
    const matchesDate = selectedDate ? transport.date === selectedDate : true;
    
    return matchesSearch && matchesStatus && matchesVehicle && matchesDate;
  });

  // Extract unique statuses for the filter
  const statuses = Array.from(new Set(mockTransports.map((t) => t.status)));
  
  // Extract unique vehicle types for the filter
  const vehicleTypes = Array.from(new Set(mockTransports.map((t) => t.vehicleType)));

  // Count transports by status
  const scheduledCount = mockTransports.filter(t => t.status === "agendado").length;
  const inProgressCount = mockTransports.filter(t => t.status === "em andamento").length;
  const completedCount = mockTransports.filter(t => t.status === "concluído").length;
  const canceledCount = mockTransports.filter(t => t.status === "cancelado").length;

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transporte de Pacientes</h1>
          <Button>
            <Ambulance className="mr-2 h-4 w-4" /> Novo Transporte
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className={scheduledCount > 0 ? "border-blue-500" : ""}>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <CardTitle>Agendados</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{scheduledCount}</div>
              <p className="text-sm text-muted-foreground mt-2">Transportes programados</p>
            </CardContent>
          </Card>
          
          <Card className={inProgressCount > 0 ? "border-purple-500" : ""}>
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
              <CardTitle>Em Andamento</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{inProgressCount}</div>
              <p className="text-sm text-muted-foreground mt-2">Transportes em execução</p>
            </CardContent>
          </Card>
          
          <Card className={completedCount > 0 ? "border-green-500" : ""}>
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle>Concluídos</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{completedCount}</div>
              <p className="text-sm text-muted-foreground mt-2">Transportes finalizados</p>
            </CardContent>
          </Card>
          
          <Card className={canceledCount > 0 ? "border-red-500" : ""}>
            <CardHeader className="bg-red-50 dark:bg-red-900/20">
              <CardTitle>Cancelados</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{canceledCount}</div>
              <p className="text-sm text-muted-foreground mt-2">Transportes não realizados</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="agenda">
          <TabsList className="grid grid-cols-4 mb-4 w-[600px]">
            <TabsTrigger value="agenda">Agenda de Transportes</TabsTrigger>
            <TabsTrigger value="veiculos">Veículos</TabsTrigger>
            <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
            <TabsTrigger value="rotas">Rotas e Otimização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="agenda">
            <Card>
              <CardHeader>
                <CardTitle>Agenda de Transportes</CardTitle>
                <CardDescription>
                  Gerenciamento dos transportes de pacientes programados
                </CardDescription>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por paciente ou destino..."
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
                  
                  <Select value={filterVehicleType} onValueChange={setFilterVehicleType}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Tipo de Veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os veículos</SelectItem>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full sm:w-[180px]"
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            Nenhum transporte encontrado com os filtros aplicados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransports.map((transport) => (
                          <TableRow key={transport.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                {transport.patientName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>{new Date(transport.date).toLocaleDateString('pt-BR')}</div>
                                <div className="text-xs text-muted-foreground">{transport.time}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                {transport.origin}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                {transport.destination}
                              </div>
                            </TableCell>
                            <TableCell>{transport.reason}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${vehicleColors[transport.vehicleType]} text-white`}>
                                {transport.vehicleType.charAt(0).toUpperCase() + transport.vehicleType.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${statusColors[transport.status]} text-white`}>
                                {transport.status.charAt(0).toUpperCase() + transport.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                {(transport.status === "agendado" || transport.status === "em andamento") && (
                                  <Button variant="outline" size="sm">
                                    <Calendar className="h-4 w-4" />
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
                  Exibindo {filteredTransports.length} de {mockTransports.length} transportes
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button variant="outline" size="sm">Próximo</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="veiculos">
            <Card>
              <CardHeader>
                <CardTitle>Frota de Veículos</CardTitle>
                <CardDescription>
                  Gerenciamento da frota disponível para transporte de pacientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="bg-red-50 dark:bg-red-900/20 py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Ambulâncias</CardTitle>
                        <Badge>
                          {mockVehicles.filter(v => v.type === "ambulância" && v.status === "disponível").length}/{mockVehicles.filter(v => v.type === "ambulância").length} disponíveis
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      <p className="text-muted-foreground text-sm">
                        Veículos equipados para transporte de pacientes que necessitam de monitoramento especial
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20 py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Vans</CardTitle>
                        <Badge>
                          {mockVehicles.filter(v => v.type === "van" && v.status === "disponível").length}/{mockVehicles.filter(v => v.type === "van").length} disponíveis
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      <p className="text-muted-foreground text-sm">
                        Veículos para transporte coletivo adaptados para pessoas com necessidades especiais
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="bg-green-50 dark:bg-green-900/20 py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Carros</CardTitle>
                        <Badge>
                          {mockVehicles.filter(v => v.type === "carro" && v.status === "disponível").length}/{mockVehicles.filter(v => v.type === "carro").length} disponíveis
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      <p className="text-muted-foreground text-sm">
                        Veículos para transporte individual ou de pequenos grupos de pacientes
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Placa</TableHead>
                        <TableHead>Motorista</TableHead>
                        <TableHead>Capacidade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">{vehicle.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${vehicleColors[vehicle.type]} text-white`}>
                              {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{vehicle.plate}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              {vehicle.driver}
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.capacity}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`${vehicleStatusColors[vehicle.status]} text-white`}>
                              {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Calendar className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Ambulance className="mr-2 h-4 w-4" />
                  Adicionar Veículo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="solicitacoes">
            <Card>
              <CardHeader>
                <CardTitle>Solicitação de Transporte</CardTitle>
                <CardDescription>
                  Formulário para solicitação de transporte de pacientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Informações do Paciente</h3>
                      <p className="text-xs text-muted-foreground">
                        Dados do paciente que será transportado
                      </p>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patient-name">Nome do Paciente</Label>
                          <Input id="patient-name" placeholder="Nome completo" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patient-id">Nº do Cartão SUS</Label>
                          <Input id="patient-id" placeholder="000 0000 0000 0000" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patient-address">Endereço Completo</Label>
                        <Input id="patient-address" placeholder="Rua, número, bairro" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patient-phone">Telefone</Label>
                          <Input id="patient-phone" placeholder="(00) 00000-0000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patient-companion">Acompanhante</Label>
                          <Input id="patient-companion" placeholder="Nome do acompanhante (se houver)" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Detalhes do Transporte</h3>
                      <p className="text-xs text-muted-foreground">
                        Informações sobre o transporte solicitado
                      </p>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="origin">Origem</Label>
                          <Input id="origin" placeholder="Local de origem" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destination">Destino</Label>
                          <Input id="destination" placeholder="Local de destino" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="transport-date">Data</Label>
                          <Input id="transport-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transport-time">Hora</Label>
                          <Input id="transport-time" type="time" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicle-type">Tipo de Veículo</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ambulancia">Ambulância</SelectItem>
                              <SelectItem value="van">Van</SelectItem>
                              <SelectItem value="carro">Carro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason">Motivo do Transporte</Label>
                        <Input id="reason" placeholder="Consulta, exame, terapia, etc." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="special-requirements">Necessidades Especiais</Label>
                        <Input id="special-requirements" placeholder="Cadeira de rodas, maca, etc." />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="return-trip" className="rounded" />
                        <Label htmlFor="return-trip">Necessita de transporte de retorno</Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="return-date">Data de Retorno</Label>
                          <Input id="return-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="return-time">Hora de Retorno</Label>
                          <Input id="return-time" type="time" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Solicitante</h3>
                      <p className="text-xs text-muted-foreground">
                        Informações sobre quem está solicitando o transporte
                      </p>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="requester-name">Nome</Label>
                          <Input id="requester-name" placeholder="Nome do solicitante" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="requester-role">Função</Label>
                          <Input id="requester-role" placeholder="Médico, enfermeiro, etc." />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requester-unit">Unidade</Label>
                        <Input id="requester-unit" placeholder="Unidade de saúde" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Limpar</Button>
                <div className="space-x-2">
                  <Button variant="outline">Salvar Rascunho</Button>
                  <Button>Enviar Solicitação</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="rotas">
            <Card>
              <CardHeader>
                <CardTitle>Rotas e Otimização</CardTitle>
                <CardDescription>
                  Planejamento e otimização de rotas para transporte de pacientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-[400px] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      [Aqui será exibido o mapa interativo com as rotas]
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Otimização de Rotas</CardTitle>
                        <CardDescription>
                          Planejamento para maximizar a eficiência
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Rota 1: Norte → Centro → Hospital Regional</h4>
                              <p className="text-sm text-muted-foreground">3 pacientes • Carlos Motorista • Van</p>
                            </div>
                            <Badge>Ativa</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Rota 2: Sul → Oeste → Hospital Estadual</h4>
                              <p className="text-sm text-muted-foreground">2 pacientes • Ana Motorista • Carro</p>
                            </div>
                            <Badge>Pendente</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Rota 3: Centro → Clínica Especializada</h4>
                              <p className="text-sm text-muted-foreground">4 pacientes • Pedro Motorista • Van</p>
                            </div>
                            <Badge>Planejada</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Ver Todas as Rotas</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Indicadores de Eficiência</CardTitle>
                        <CardDescription>
                          Métricas de utilização e eficiência
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Ocupação média dos veículos</span>
                              <span className="text-sm font-medium">78%</span>
                            </div>
                            <Progress value={78} />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Pontualidade</span>
                              <span className="text-sm font-medium">93%</span>
                            </div>
                            <Progress value={93} className="bg-green-500" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Otimização de rotas</span>
                              <span className="text-sm font-medium">65%</span>
                            </div>
                            <Progress value={65} className="bg-amber-500" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Solicitações atendidas</span>
                              <span className="text-sm font-medium">87%</span>
                            </div>
                            <Progress value={87} className="bg-blue-500" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Ver Relatório Completo</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Simple Label component for the form
const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
    </label>
  );
};

export default TransportePacientes;
