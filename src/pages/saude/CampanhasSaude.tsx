
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
import { Calendar, Users, Search, MapPin, FileText, Calendar as CalendarIcon } from "lucide-react";
import { HealthCampaign } from "@/types/saude";

// Mock data
const mockCampaigns: HealthCampaign[] = [
  {
    id: "1",
    title: "Vacinação contra Influenza",
    description: "Campanha anual de vacinação contra a gripe",
    startDate: "2025-04-10",
    endDate: "2025-06-30",
    targetAudience: "População geral acima de 6 meses",
    location: "Todas as UBSs do município",
    status: "em andamento",
    coverageGoal: 5000,
    currentCoverage: 3200,
  },
  {
    id: "2",
    title: "Prevenção de Hipertensão",
    description: "Avaliação e orientação para prevenção da hipertensão arterial",
    startDate: "2025-05-15",
    endDate: "2025-05-25",
    targetAudience: "Adultos acima de 40 anos",
    location: "UBS Central e UBS Norte",
    status: "em andamento",
    coverageGoal: 1200,
    currentCoverage: 450,
  },
  {
    id: "3",
    title: "Saúde Bucal nas Escolas",
    description: "Avaliação odontológica preventiva para crianças",
    startDate: "2025-06-10",
    endDate: "2025-07-15",
    targetAudience: "Crianças de 5 a 12 anos",
    location: "Escolas municipais",
    status: "planejada",
    coverageGoal: 2800,
    currentCoverage: 0,
  },
  {
    id: "4",
    title: "Outubro Rosa",
    description: "Prevenção e diagnóstico precoce do câncer de mama",
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    targetAudience: "Mulheres acima de 40 anos",
    location: "Todas as UBSs do município",
    status: "planejada",
    coverageGoal: 3500,
    currentCoverage: 0,
  },
  {
    id: "5",
    title: "Vacinação contra HPV",
    description: "Imunização contra o Papilomavírus Humano",
    startDate: "2025-03-01",
    endDate: "2025-04-30",
    targetAudience: "Meninas e meninos de 9 a 14 anos",
    location: "Escolas e UBSs",
    status: "concluída",
    coverageGoal: 1800,
    currentCoverage: 1650,
  },
  {
    id: "6",
    title: "Combate à Dengue",
    description: "Ações de prevenção e combate ao mosquito Aedes Aegypti",
    startDate: "2025-01-15",
    endDate: "2025-04-15",
    targetAudience: "População geral",
    location: "Todo o município",
    status: "concluída",
    coverageGoal: 10000,
    currentCoverage: 9750,
  },
];

const statusColors: Record<string, string> = {
  "em andamento": "bg-blue-500",
  "planejada": "bg-amber-500",
  "concluída": "bg-green-500",
  "cancelada": "bg-red-500",
};

const calculateCoveragePercentage = (current: number, goal: number) => {
  return Math.min(Math.round((current / goal) * 100), 100);
};

const getCoverageColor = (percentage: number) => {
  if (percentage < 30) return "bg-red-500";
  if (percentage < 70) return "bg-amber-500";
  return "bg-green-500";
};

const CampanhasSaude = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  
  // Filter campaigns based on the search term and status
  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? campaign.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Count campaigns by status
  const activeCampaigns = mockCampaigns.filter(c => c.status === "em andamento").length;
  const plannedCampaigns = mockCampaigns.filter(c => c.status === "planejada").length;
  const completedCampaigns = mockCampaigns.filter(c => c.status === "concluída").length;

  // Get statuses for the filter
  const statuses = Array.from(new Set(mockCampaigns.map((c) => c.status)));

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Campanhas de Saúde</h1>
          <Button>
            <Calendar className="mr-2 h-4 w-4" /> Nova Campanha
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle>Campanhas Ativas</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{activeCampaigns}</div>
              <p className="text-sm text-muted-foreground mt-2">Campanhas em andamento</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
              <CardTitle>Campanhas Planejadas</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{plannedCampaigns}</div>
              <p className="text-sm text-muted-foreground mt-2">Campanhas a serem iniciadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <CardTitle>Campanhas Concluídas</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{completedCampaigns}</div>
              <p className="text-sm text-muted-foreground mt-2">Campanhas finalizadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
              <CardTitle>Público Alcançado</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">
                {mockCampaigns.reduce((total, campaign) => total + campaign.currentCoverage, 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Pessoas atendidas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="todas">
          <TabsList className="grid grid-cols-4 mb-4 w-[500px]">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="ativas">Ativas</TabsTrigger>
            <TabsTrigger value="planejadas">Planejadas</TabsTrigger>
            <TabsTrigger value="mapa">Mapa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todas">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Campanhas de Saúde</CardTitle>
                <CardDescription>
                  Visualize e gerencie todas as campanhas de saúde
                </CardDescription>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar campanha..."
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
                        <TableHead>Campanha</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Local</TableHead>
                        <TableHead>Público Alvo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cobertura</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            Nenhuma campanha encontrada com os filtros aplicados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCampaigns.map((campaign) => {
                          const coveragePercentage = calculateCoveragePercentage(
                            campaign.currentCoverage, campaign.coverageGoal
                          );
                          const coverageColor = getCoverageColor(coveragePercentage);
                          
                          return (
                            <TableRow key={campaign.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <div className="font-bold">{campaign.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {campaign.description}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  <div>
                                    <div>{new Date(campaign.startDate).toLocaleDateString('pt-BR')}</div>
                                    <div className="text-xs text-muted-foreground">
                                      até {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <MapPin className="mr-2 h-4 w-4" />
                                  {campaign.location}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Users className="mr-2 h-4 w-4" />
                                  {campaign.targetAudience}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={`${statusColors[campaign.status]} text-white`}>
                                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>{campaign.currentCoverage} pessoas</span>
                                    <span>{coveragePercentage}%</span>
                                  </div>
                                  <Progress value={coveragePercentage} className={coverageColor} />
                                  <div className="text-xs text-muted-foreground">
                                    Meta: {campaign.coverageGoal} pessoas
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Exibindo {filteredCampaigns.length} de {mockCampaigns.length} campanhas
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="ativas">
            <Card>
              <CardHeader>
                <CardTitle>Campanhas Ativas</CardTitle>
                <CardDescription>
                  Campanhas de saúde em andamento no município
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockCampaigns
                    .filter((campaign) => campaign.status === "em andamento")
                    .map((campaign) => {
                      const coveragePercentage = calculateCoveragePercentage(
                        campaign.currentCoverage, campaign.coverageGoal
                      );
                      const coverageColor = getCoverageColor(coveragePercentage);
                      
                      return (
                        <Card key={campaign.id}>
                          <CardHeader>
                            <CardTitle>{campaign.title}</CardTitle>
                            <CardDescription>{campaign.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium">Período</h4>
                                <div className="flex items-center mt-1">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  <span>
                                    {new Date(campaign.startDate).toLocaleDateString('pt-BR')} até{' '}
                                    {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Local</h4>
                                <div className="flex items-center mt-1">
                                  <MapPin className="mr-2 h-4 w-4" />
                                  <span>{campaign.location}</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Público Alvo</h4>
                                <div className="flex items-center mt-1">
                                  <Users className="mr-2 h-4 w-4" />
                                  <span>{campaign.targetAudience}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Progresso</h4>
                              <div className="flex justify-between text-sm">
                                <span>{campaign.currentCoverage} pessoas atendidas</span>
                                <span>{coveragePercentage}% da meta</span>
                              </div>
                              <Progress value={coveragePercentage} className={coverageColor} />
                              <div className="text-sm text-muted-foreground">
                                Meta: {campaign.coverageGoal} pessoas
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" className="mr-2">
                              <FileText className="mr-2 h-4 w-4" />
                              Detalhes
                            </Button>
                            <Button>
                              Atualizar Dados
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                    
                    {mockCampaigns.filter((campaign) => campaign.status === "em andamento").length === 0 && (
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">Nenhuma campanha ativa no momento</h3>
                        <p className="text-muted-foreground">
                          Não há campanhas de saúde em andamento atualmente.
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="planejadas">
            <Card>
              <CardHeader>
                <CardTitle>Campanhas Planejadas</CardTitle>
                <CardDescription>
                  Próximas campanhas de saúde agendadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCampaigns
                    .filter((campaign) => campaign.status === "planejada")
                    .map((campaign) => (
                      <Card key={campaign.id}>
                        <CardHeader>
                          <CardTitle>{campaign.title}</CardTitle>
                          <CardDescription>{campaign.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium">Período</h4>
                              <div className="flex items-center mt-1">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>
                                  {new Date(campaign.startDate).toLocaleDateString('pt-BR')} até{' '}
                                  {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Local</h4>
                              <div className="flex items-center mt-1">
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>{campaign.location}</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Público Alvo</h4>
                              <div className="flex items-center mt-1">
                                <Users className="mr-2 h-4 w-4" />
                                <span>{campaign.targetAudience}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium">Meta de Atendimentos</h4>
                            <div className="mt-1 text-lg font-medium">{campaign.coverageGoal} pessoas</div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="mr-2">
                            <FileText className="mr-2 h-4 w-4" />
                            Detalhes
                          </Button>
                          <Button>
                            Iniciar Campanha
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {mockCampaigns.filter((campaign) => campaign.status === "planejada").length === 0 && (
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">Nenhuma campanha planejada</h3>
                        <p className="text-muted-foreground">
                          Não há campanhas planejadas para o futuro próximo.
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mapa">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Campanhas de Saúde</CardTitle>
                <CardDescription>
                  Visualização geográfica das campanhas no município
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[600px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  [Aqui será exibido um mapa interativo com a localização das campanhas]
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CampanhasSaude;
