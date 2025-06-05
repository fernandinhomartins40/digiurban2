
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

const kpisData = [
  {
    id: "kpi-001",
    nome: "Atendimento ao Cidadão",
    categoria: "Atendimento",
    valor: 92,
    meta: 95,
    unidade: "%",
    status: "atencao",
    tendencia: "up",
    descricao: "Percentual de satisfação no atendimento",
    ultimaAtualizacao: "2025-05-18"
  },
  {
    id: "kpi-002", 
    nome: "Execução Orçamentária",
    categoria: "Financeiro",
    valor: 78,
    meta: 85,
    unidade: "%",
    status: "critico",
    tendencia: "down",
    descricao: "Percentual do orçamento executado",
    ultimaAtualizacao: "2025-05-17"
  },
  {
    id: "kpi-003",
    nome: "Obras Concluídas",
    categoria: "Infraestrutura",
    valor: 15,
    meta: 12,
    unidade: "obras",
    status: "sucesso",
    tendencia: "up",
    descricao: "Número de obras finalizadas no período",
    ultimaAtualizacao: "2025-05-18"
  },
  {
    id: "kpi-004",
    nome: "Tempo Médio de Resposta",
    categoria: "Atendimento",
    valor: 3.2,
    meta: 2.5,
    unidade: "dias",
    status: "atencao",
    tendencia: "stable",
    descricao: "Tempo médio para resposta aos protocolos",
    ultimaAtualizacao: "2025-05-18"
  },
  {
    id: "kpi-005",
    nome: "Receita Própria",
    categoria: "Financeiro",
    valor: 2.1,
    meta: 1.8,
    unidade: "M",
    status: "sucesso",
    tendencia: "up",
    descricao: "Receita própria arrecadada (em milhões)",
    ultimaAtualizacao: "2025-05-17"
  },
  {
    id: "kpi-006",
    nome: "Transparência Ativa",
    categoria: "Transparencia",
    valor: 95,
    meta: 90,
    unidade: "%",
    status: "sucesso",
    tendencia: "up",
    descricao: "Percentual de informações publicadas no prazo",
    ultimaAtualizacao: "2025-05-18"
  }
];

const evolucaoMensal = [
  { mes: "Jan", atendimento: 85, orcamento: 65, obras: 8 },
  { mes: "Fev", atendimento: 88, orcamento: 70, obras: 10 },
  { mes: "Mar", atendimento: 90, orcamento: 75, obras: 12 },
  { mes: "Abr", atendimento: 91, orcamento: 76, obras: 13 },
  { mes: "Mai", atendimento: 92, orcamento: 78, obras: 15 }
];

const StatusIndicator: FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    sucesso: { icon: <CheckCircle className="h-4 w-4" />, color: "text-green-600", bg: "bg-green-100" },
    atencao: { icon: <AlertTriangle className="h-4 w-4" />, color: "text-yellow-600", bg: "bg-yellow-100" },
    critico: { icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-600", bg: "bg-red-100" }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.atencao;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
      {config.icon}
    </div>
  );
};

const TendenciaIcon: FC<{ tendencia: string }> = ({ tendencia }) => {
  const tendenciaConfig = {
    up: { icon: <TrendingUp className="h-4 w-4 text-green-600" />, label: "Crescendo" },
    down: { icon: <TrendingDown className="h-4 w-4 text-red-600" />, label: "Decrescendo" },
    stable: { icon: <Clock className="h-4 w-4 text-gray-600" />, label: "Estável" }
  };

  const config = tendenciaConfig[tendencia as keyof typeof tendenciaConfig] || tendenciaConfig.stable;

  return (
    <div className="flex items-center gap-1" title={config.label}>
      {config.icon}
    </div>
  );
};

const KPICard: FC<{ kpi: typeof kpisData[0] }> = ({ kpi }) => {
  const percentualMeta = (kpi.valor / kpi.meta) * 100;
  const atingiuMeta = kpi.valor >= kpi.meta;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{kpi.nome}</CardTitle>
          <div className="flex items-center gap-2">
            <StatusIndicator status={kpi.status} />
            <TendenciaIcon tendencia={kpi.tendencia} />
          </div>
        </div>
        <CardDescription className="text-xs">{kpi.descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{kpi.valor}</span>
            <span className="text-sm text-muted-foreground">{kpi.unidade}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Meta: {kpi.meta}{kpi.unidade}</span>
              <span className={atingiuMeta ? "text-green-600" : "text-red-600"}>
                {atingiuMeta ? "✓ Meta atingida" : "Meta não atingida"}
              </span>
            </div>
            <Progress 
              value={Math.min(percentualMeta, 100)} 
              className="h-2"
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Última atualização: {new Date(kpi.ultimaAtualizacao).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MonitoramentoKPIs: FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Monitoramento de KPIs</h1>
          <div className="flex gap-2">
            <Select defaultValue="mensal">
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Exportar Relatório</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">KPIs Monitorados</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Indicadores ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Metas Atingidas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">18</div>
              <p className="text-xs text-muted-foreground">75% das metas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Indicadores Críticos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-xs text-muted-foreground">Requerem atenção</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Performance Geral</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visao-geral" className="space-y-6">
          <TabsList>
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="atendimento">Atendimento</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="infraestrutura">Infraestrutura</TabsTrigger>
            <TabsTrigger value="transparencia">Transparência</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpisData.map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução dos KPIs Principais</CardTitle>
                  <CardDescription>Tendência dos indicadores ao longo dos meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveLine
                      data={[
                        {
                          id: "Atendimento",
                          color: "hsl(210, 70%, 50%)",
                          data: evolucaoMensal.map(item => ({ x: item.mes, y: item.atendimento }))
                        },
                        {
                          id: "Orçamento",
                          color: "hsl(120, 70%, 50%)",
                          data: evolucaoMensal.map(item => ({ x: item.mes, y: item.orcamento }))
                        }
                      ]}
                      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                      xScale={{ type: "point" }}
                      yScale={{ type: "linear", min: "auto", max: "auto" }}
                      curve="cardinal"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Mês",
                        legendOffset: 36,
                        legendPosition: "middle"
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Percentual",
                        legendOffset: -40,
                        legendPosition: "middle"
                      }}
                      pointSize={10}
                      pointColor={{ theme: "background" }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: "serieColor" }}
                      useMesh={true}
                      legends={[
                        {
                          anchor: "bottom-right",
                          direction: "column",
                          justify: false,
                          translateX: 100,
                          translateY: 0,
                          itemsSpacing: 0,
                          itemDirection: "left-to-right",
                          itemWidth: 80,
                          itemHeight: 20,
                          itemOpacity: 0.75,
                          symbolSize: 12,
                          symbolShape: "circle"
                        }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                  <CardDescription>Status atual dos KPIs monitorados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Sucesso</span>
                      </div>
                      <span className="text-sm font-medium">18 (75%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Atenção</span>
                      </div>
                      <span className="text-sm font-medium">3 (12.5%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Crítico</span>
                      </div>
                      <span className="text-sm font-medium">3 (12.5%)</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-l-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="atendimento" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpisData.filter(kpi => kpi.categoria === "Atendimento").map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpisData.filter(kpi => kpi.categoria === "Financeiro").map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="infraestrutura" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpisData.filter(kpi => kpi.categoria === "Infraestrutura").map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transparencia" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpisData.filter(kpi => kpi.categoria === "Transparencia").map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MonitoramentoKPIs;
