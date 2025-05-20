
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
import { CalendarIcon, FileText, Search, User, MapPin, Ambulance } from "lucide-react";
import { TFDReferral } from "@/types/saude";

// Mock data
const mockReferrals: TFDReferral[] = [
  {
    id: "1",
    patientId: "101",
    patientName: "Maria Silva",
    originUnit: "UBS Central",
    destinationUnit: "Hospital Regional",
    specialtyRequired: "Cardiologia",
    referralDate: "2025-05-10",
    scheduledDate: "2025-05-25",
    status: "aprovado",
    priority: "normal",
    transportation: "terrestre",
    accommodationNeeded: false,
    medicalReport: "Paciente com histórico de arritmia cardíaca, necessita avaliação especializada."
  },
  {
    id: "2",
    patientId: "102",
    patientName: "João Oliveira",
    originUnit: "UBS Norte",
    destinationUnit: "Hospital Estadual",
    specialtyRequired: "Neurologia",
    referralDate: "2025-05-12",
    scheduledDate: "2025-06-05",
    status: "aprovado",
    priority: "urgente",
    transportation: "terrestre",
    accommodationNeeded: true,
    medicalReport: "Paciente com suspeita de AVC isquêmico, necessita avaliação neurológica urgente."
  },
  {
    id: "3",
    patientId: "103",
    patientName: "Antônio Ferreira",
    originUnit: "UBS Leste",
    destinationUnit: "Hospital Universitário",
    specialtyRequired: "Oncologia",
    referralDate: "2025-05-15",
    status: "solicitado",
    priority: "normal",
    transportation: "terrestre",
    accommodationNeeded: false,
    medicalReport: "Paciente com lesão suspeita, necessita avaliação oncológica."
  },
  {
    id: "4",
    patientId: "104",
    patientName: "Luiza Costa",
    originUnit: "UBS Sul",
    destinationUnit: "Hospital de Referência",
    specialtyRequired: "Oftalmologia",
    referralDate: "2025-05-08",
    scheduledDate: "2025-05-30",
    status: "em andamento",
    priority: "normal",
    transportation: "terrestre",
    accommodationNeeded: false,
    medicalReport: "Paciente com suspeita de glaucoma, necessita avaliação especializada."
  },
  {
    id: "5",
    patientId: "105",
    patientName: "Roberto Gomes",
    originUnit: "UBS Oeste",
    destinationUnit: "Hospital Regional",
    specialtyRequired: "Pneumologia",
    referralDate: "2025-05-05",
    status: "solicitado",
    priority: "emergência",
    transportation: "aéreo",
    accommodationNeeded: true,
    medicalReport: "Paciente com insuficiência respiratória grave, necessita transferência urgente."
  },
  {
    id: "6",
    patientId: "106",
    patientName: "Fernanda Martins",
    originUnit: "UBS Central",
    destinationUnit: "Hospital Estadual",
    specialtyRequired: "Ortopedia",
    referralDate: "2025-05-01",
    scheduledDate: "2025-05-18",
    status: "concluído",
    priority: "normal",
    transportation: "terrestre",
    accommodationNeeded: false,
    medicalReport: "Paciente com fratura no fêmur, necessitou avaliação e procedimento especializado."
  },
  {
    id: "7",
    patientId: "107",
    patientName: "Paulo Rodrigues",
    originUnit: "UBS Norte",
    destinationUnit: "Hospital Universitário",
    specialtyRequired: "Nefrologia",
    referralDate: "2025-04-28",
    status: "negado",
    priority: "normal",
    transportation: "terrestre",
    accommodationNeeded: false,
    medicalReport: "Solicitação negada. Tratamento disponível na rede municipal."
  },
];

const statusColors: Record<string, string> = {
  "solicitado": "bg-amber-500",
  "aprovado": "bg-blue-500",
  "em andamento": "bg-purple-500",
  "concluído": "bg-green-500",
  "negado": "bg-red-500",
};

const priorityColors: Record<string, string> = {
  "normal": "bg-blue-500",
  "urgente": "bg-amber-500",
  "emergência": "bg-red-500",
};

const EncaminhamentosTFD = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("");
  
  // Filter referrals based on search, status, and specialty
  const filteredReferrals = mockReferrals.filter((referral) => {
    const matchesSearch = 
      referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.specialtyRequired.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.destinationUnit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? referral.status === filterStatus : true;
    const matchesSpecialty = filterSpecialty ? referral.specialtyRequired === filterSpecialty : true;
    
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  // Extract unique specialties for the filter
  const specialties = Array.from(new Set(mockReferrals.map((ref) => ref.specialtyRequired)));
  
  // Extract unique statuses for the filter
  const statuses = Array.from(new Set(mockReferrals.map((ref) => ref.status)));

  // Count referrals by status
  const pendingCount = mockReferrals.filter(r => r.status === "solicitado").length;
  const approvedCount = mockReferrals.filter(r => r.status === "aprovado").length;
  const inProgressCount = mockReferrals.filter(r => r.status === "em andamento").length;
  const completedCount = mockReferrals.filter(r => r.status === "concluído").length;
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Encaminhamentos TFD</h1>
          <Button>
            <FileText className="mr-2 h-4 w-4" /> Novo Encaminhamento
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className={pendingCount > 0 ? "border-amber-500" : ""}>
            <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
              <CardTitle>Solicitados</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{pendingCount}</div>
              <p className="text-sm text-muted-foreground mt-2">Aguardando aprovação</p>
            </CardContent>
          </Card>
          
          <Card className={approvedCount > 0 ? "border-blue-500" : ""}>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <CardTitle>Aprovados</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{approvedCount}</div>
              <p className="text-sm text-muted-foreground mt-2">Em processo de agendamento</p>
            </CardContent>
          </Card>
          
          <Card className={inProgressCount > 0 ? "border-purple-500" : ""}>
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
              <CardTitle>Em Andamento</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{inProgressCount}</div>
              <p className="text-sm text-muted-foreground mt-2">Processos iniciados</p>
            </CardContent>
          </Card>
          
          <Card className={completedCount > 0 ? "border-green-500" : ""}>
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle>Concluídos</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{completedCount}</div>
              <p className="text-sm text-muted-foreground mt-2">Processos finalizados</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="todos">
          <TabsList className="grid grid-cols-3 mb-4 w-[400px]">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos">
            <Card>
              <CardHeader>
                <CardTitle>Encaminhamentos TFD</CardTitle>
                <CardDescription>
                  Visualize e gerencie encaminhamentos para Tratamento Fora do Domicílio
                </CardDescription>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por paciente, especialidade ou destino..."
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
                  
                  <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as especialidades</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
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
                        <TableHead>Paciente</TableHead>
                        <TableHead>Especialidade</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Data Solicitação</TableHead>
                        <TableHead>Data Agendada</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReferrals.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            Nenhum encaminhamento encontrado com os filtros aplicados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredReferrals.map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                {referral.patientName}
                              </div>
                            </TableCell>
                            <TableCell>{referral.specialtyRequired}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                {referral.destinationUnit}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(referral.referralDate).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              {referral.scheduledDate 
                                ? new Date(referral.scheduledDate).toLocaleDateString('pt-BR')
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${statusColors[referral.status]} text-white`}>
                                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${priorityColors[referral.priority]} text-white`}>
                                {referral.priority.charAt(0).toUpperCase() + referral.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                {referral.status === "solicitado" && (
                                  <Button variant="outline" size="sm">
                                    <CalendarIcon className="h-4 w-4" />
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
                  Exibindo {filteredReferrals.length} de {mockReferrals.length} encaminhamentos
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button variant="outline" size="sm">Próximo</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documentos">
            <Card>
              <CardHeader>
                <CardTitle>Documentos Necessários</CardTitle>
                <CardDescription>
                  Documentação exigida para encaminhamentos TFD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Requisitos para solicitação de TFD</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Laudo médico detalhado do especialista solicitante</li>
                      <li>Justificativa da necessidade do encaminhamento</li>
                      <li>Exames comprobatórios da condição de saúde do paciente</li>
                      <li>Documentos pessoais do paciente (RG, CPF, Cartão SUS, comprovante de residência)</li>
                      <li>Formulário de solicitação de TFD preenchido pelo médico</li>
                      <li>Termo de consentimento informado assinado pelo paciente ou responsável</li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Formulários</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Formulário de Solicitação de TFD</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Laudo Médico Padrão</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Termo de Consentimento</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Formulário de Acompanhante</a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Instruções</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Manual de Preenchimento</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Fluxo do Processo de TFD</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Critérios de Elegibilidade</a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Legislação</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Portaria SAS/MS nº 055/1999</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Portaria Municipal nº 123/2024</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <a href="#" className="text-blue-600 hover:underline">Manual Operacional TFD</a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Ambulance className="mr-2 h-5 w-5" />
                      Transporte e Hospedagem
                    </h3>
                    <p className="mb-2">
                      O TFD pode incluir ajuda de custo para transporte, alimentação e hospedagem para o paciente e acompanhante (quando necessário). 
                      Os requisitos específicos incluem:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Justificativa médica para necessidade de acompanhante</li>
                      <li>Documentação do acompanhante (RG, CPF)</li>
                      <li>Comprovante de agendamento na unidade de destino</li>
                      <li>Formulário de solicitação de transporte especial (quando aplicável)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Iniciar Nova Solicitação
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="estatisticas">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Encaminhamentos</CardTitle>
                <CardDescription>
                  Análise dos encaminhamentos por especialidade e destino
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  [Aqui serão exibidos gráficos e estatísticas dos encaminhamentos TFD]
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EncaminhamentosTFD;
