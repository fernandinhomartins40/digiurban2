import { useState } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart,
  Users,
  Calendar,
  Package,
  TrendingUp,
  Activity,
  Ambulance,
  Stethoscope,
  Pill,
  MapPin,
  FileText
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const agendamentosData = [
  { mes: "Jan", agendados: 320, realizados: 280, cancelados: 40 },
  { mes: "Fev", agendados: 280, realizados: 250, cancelados: 30 },
  { mes: "Mar", agendados: 360, realizados: 340, cancelados: 20 },
  { mes: "Abr", agendados: 420, realizados: 380, cancelados: 40 },
  { mes: "Mai", agendados: 380, realizados: 350, cancelados: 30 }
];

const campanhasData = [
  { mes: "Jan", meta: 85, cobertura: 78 },
  { mes: "Fev", meta: 90, cobertura: 85 },
  { mes: "Mar", meta: 80, cobertura: 82 },
  { mes: "Abr", meta: 95, cobertura: 88 },
  { mes: "Mai", meta: 85, cobertura: 91 }
];

const transporteData = [
  { name: "Realizados", value: 145, color: "#10b981" },
  { name: "Agendados", value: 68, color: "#3b82f6" },
  { name: "Cancelados", value: 12, color: "#ef4444" }
];

const estoqueAlertas = [
  { medicamento: "Dipirona 500mg", estoque: 85, minimo: 100, status: "baixo" },
  { medicamento: "Metformina 850mg", estoque: 15, minimo: 100, status: "critico" },
  { medicamento: "Insulina NPH", estoque: 25, minimo: 20, status: "critico" },
  { medicamento: "Amoxicilina 500mg", estoque: 45, minimo: 50, status: "baixo" }
];

const DashboardSaude = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("mes");

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Heart className="mr-3 h-8 w-8 text-red-500" />
              Dashboard Secretaria de Saúde
            </h1>
            <p className="text-muted-foreground">Visão geral dos indicadores de saúde pública</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Relatório Mensal
            </Button>
            <Button size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Exportar Dados
            </Button>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
              <Stethoscope className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação a ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Cobertura média: 87%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transportes</CardTitle>
              <Ambulance className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">225</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Estoque</CardTitle>
              <Package className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                Medicamentos em falta
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList>
            <TabsTrigger value="geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atendimentos por Especialidade</CardTitle>
                  <CardDescription>Distribuição de consultas por área médica</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { especialidade: "Clínica Geral", total: 145 },
                      { especialidade: "Pediatria", total: 89 },
                      { especialidade: "Ginecologia", total: 67 },
                      { especialidade: "Cardiologia", total: 45 },
                      { especialidade: "Ortopedia", total: 34 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="especialidade" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Indicadores de Qualidade</CardTitle>
                  <CardDescription>Métricas de desempenho dos serviços</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Taxa de Satisfação</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">94%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tempo Médio de Espera</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">18 min</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Taxa de Comparecimento</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">87%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Resolução em 1ª Consulta</span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">76%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Evolução Mensal dos Atendimentos</CardTitle>
                  <CardDescription>Comparativo de agendamentos vs realizações</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={agendamentosData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="agendados" stroke="#3b82f6" name="Agendados" />
                      <Line type="monotone" dataKey="realizados" stroke="#10b981" name="Realizados" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unidades de Saúde</CardTitle>
                  <CardDescription>Status das unidades</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">UBS Ativas</span>
                    </div>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm">Em Manutenção</span>
                    </div>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">ESF Ativas</span>
                    </div>
                    <span className="text-sm font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">CAPS</span>
                    </div>
                    <span className="text-sm font-medium">1</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agendamentos" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Agendamentos por Mês</CardTitle>
                  <CardDescription>Evolução dos agendamentos médicos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={agendamentosData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="agendados" fill="#3b82f6" name="Agendados" />
                      <Bar dataKey="realizados" fill="#10b981" name="Realizados" />
                      <Bar dataKey="cancelados" fill="#ef4444" name="Cancelados" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximos Agendamentos</CardTitle>
                  <CardDescription>Consultas para hoje</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">Dr. Carlos Santos</p>
                      <p className="text-xs text-muted-foreground">Clínica Geral - 08:30</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">12 pacientes</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">Dra. Ana Pereira</p>
                      <p className="text-xs text-muted-foreground">Cardiologia - 09:00</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">8 pacientes</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">Dr. Ricardo Martins</p>
                      <p className="text-xs text-muted-foreground">Ortopedia - 14:00</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">6 pacientes</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campanhas" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cobertura das Campanhas</CardTitle>
                  <CardDescription>Meta vs Realizado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={campanhasData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="meta" stroke="#ef4444" name="Meta" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="cobertura" stroke="#10b981" name="Cobertura" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Campanhas em Andamento</CardTitle>
                  <CardDescription>Status atual das campanhas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Vacinação Contra Gripe</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Hiperdia</span>
                      <span className="text-sm">53%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '53%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Saúde Bucal</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="estoque" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alertas de Estoque</CardTitle>
                  <CardDescription>Medicamentos com estoque baixo ou crítico</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {estoqueAlertas.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <Pill className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{item.medicamento}</p>
                            <p className="text-xs text-muted-foreground">
                              Estoque: {item.estoque} | Mínimo: {item.minimo}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={item.status === 'critico' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}
                        >
                          {item.status === 'critico' ? 'Crítico' : 'Baixo'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status dos Transportes</CardTitle>
                  <CardDescription>Distribuição dos transportes de pacientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={transporteData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {transporteData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {transporteData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardSaude;