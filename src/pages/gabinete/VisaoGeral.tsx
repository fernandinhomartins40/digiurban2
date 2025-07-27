
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FC, useState, useEffect } from "react";
import { 
  Activity, 
  Calendar, 
  ChevronUp, 
  ChevronDown,
  Clock, 
  FileBadge, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  BarChart3,
  RefreshCw,
  Bell
} from "lucide-react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

// Dados de exemplo para gráficos - Dashboard Executivo Avançado
const demandasPorSetorData = [
  { setor: "Saúde", demandas: 45, resolvidas: 38, urgentes: 7 },
  { setor: "Educação", demandas: 32, resolvidas: 28, urgentes: 4 },
  { setor: "Infraestrutura", demandas: 27, resolvidas: 20, urgentes: 7 },
  { setor: "Assistência Social", demandas: 19, resolvidas: 15, urgentes: 4 },
  { setor: "Cultura", demandas: 15, resolvidas: 12, urgentes: 3 },
  { setor: "Esportes", demandas: 12, resolvidas: 10, urgentes: 2 },
];

const evolucaoMensalData = [
  { x: "Jan", protocolos: 24, resolvidos: 20, satisfacao: 85 },
  { x: "Fev", protocolos: 28, resolvidos: 25, satisfacao: 88 },
  { x: "Mar", protocolos: 35, resolvidos: 30, satisfacao: 82 },
  { x: "Abr", protocolos: 30, resolvidos: 28, satisfacao: 90 },
  { x: "Mai", protocolos: 42, resolvidos: 35, satisfacao: 87 },
];

// Dados de performance por secretaria
const performanceSecretariasData = [
  { id: "Saúde", label: "Saúde", value: 89, color: "hsl(142, 71%, 45%)" },
  { id: "Educação", label: "Educação", value: 92, color: "hsl(210, 71%, 45%)" },
  { id: "Infraestrutura", label: "Infraestrutura", value: 74, color: "hsl(346, 71%, 45%)" },
  { id: "Assistência Social", label: "Assistência Social", value: 79, color: "hsl(47, 71%, 45%)" },
];

// Alertas e tendências
const alertasTendencias = [
  {
    tipo: "critico",
    titulo: "Tempo de Resposta Elevado",
    descricao: "Secretaria de Infraestrutura com tempo médio de 5.2 dias",
    secretaria: "Infraestrutura",
    impacto: "Alto",
    desde: "2025-01-20"
  },
  {
    tipo: "atencao",
    titulo: "Aumento de Demandas",
    descricao: "35% de aumento nas solicitações de saúde este mês",
    secretaria: "Saúde",
    impacto: "Médio",
    desde: "2025-01-15"
  },
  {
    tipo: "positivo",
    titulo: "Meta de Satisfação Atingida",
    descricao: "Educação alcançou 92% de satisfação dos cidadãos",
    secretaria: "Educação",
    impacto: "Positivo",
    desde: "2025-01-18"
  },
  {
    tipo: "atencao",
    titulo: "Backlog Crescente",
    descricao: "Acúmulo de 23 processos pendentes em Assistência Social",
    secretaria: "Assistência Social",
    impacto: "Médio",
    desde: "2025-01-12"
  }
];

// KPIs executivos em tempo real
const kpisExecutivos = {
  protocolosAbertos: { atual: 156, anterior: 142, meta: 120 },
  tempoMedioResposta: { atual: 3.2, anterior: 3.8, meta: 2.5 },
  satisfacaoGeral: { atual: 87, anterior: 85, meta: 90 },
  taxaResolucao: { atual: 83, anterior: 79, meta: 85 },
  custoPorAtendimento: { atual: 45.30, anterior: 47.80, meta: 40.00 },
  produtividade: { atual: 94, anterior: 89, meta: 95 }
};

// Atividades recentes
const atividadesRecentes = [
  {
    tipo: "reuniao",
    titulo: "Reunião com Secretariado",
    data: "2025-05-18T14:30:00",
    descricao: "Discussão sobre o planejamento estratégico de 2025",
  },
  {
    tipo: "despacho",
    titulo: "Despacho de processos",
    data: "2025-05-17T10:00:00",
    descricao: "Assinatura de contratos e aprovação de licitações",
  },
  {
    tipo: "evento",
    titulo: "Inauguração da UBS Centro",
    data: "2025-05-16T09:00:00",
    descricao: "Cerimônia de inauguração da nova Unidade Básica de Saúde",
  },
  {
    tipo: "despacho",
    titulo: "Análise de projetos",
    data: "2025-05-15T16:00:00",
    descricao: "Avaliação de novos projetos para a Secretaria de Educação",
  },
];

// Compromissos na agenda
const compromissosAgenda = [
  {
    titulo: "Reunião com Empresários",
    data: "2025-05-21T10:00:00",
    local: "Sala de Reuniões do Gabinete",
  },
  {
    titulo: "Visita à Escola Municipal",
    data: "2025-05-22T14:00:00",
    local: "E.M. Paulo Freire",
  },
  {
    titulo: "Sessão na Câmara Municipal",
    data: "2025-05-23T09:00:00",
    local: "Câmara Municipal",
  },
];

// Componente de KPI Card Avançado
const KpiCardAvancado: FC<{ 
  title: string; 
  atual: number; 
  anterior: number; 
  meta: number; 
  formato?: string;
  icon: React.ReactNode; 
  unidade?: string;
}> = ({ title, atual, anterior, meta, formato = "number", icon, unidade = "" }) => {
  const tendencia = atual > anterior;
  const atingiuMeta = atual >= meta;
  const percentualMeta = (atual / meta) * 100;
  const percentualTendencia = Math.abs(((atual - anterior) / anterior) * 100);

  const formatarValor = (valor: number) => {
    if (formato === "currency") return `R$ ${valor.toFixed(2)}`;
    if (formato === "percentage") return `${valor}%`;
    if (formato === "decimal") return valor.toFixed(1);
    return valor.toString();
  };

  return (
    <Card className={atingiuMeta ? "border-green-200 bg-green-50/50" : "border-amber-200 bg-amber-50/50"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatarValor(atual)}{unidade}
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>Meta: {formatarValor(meta)}{unidade}</span>
          <Progress value={Math.min(percentualMeta, 100)} className="w-16 h-1" />
        </div>
        <div className={`flex items-center pt-1 text-xs ${tendencia ? "text-green-600" : "text-red-600"}`}>
          {tendencia ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          <span>{percentualTendencia.toFixed(1)}% vs mês anterior</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de Alerta
const AlertaCard: FC<{
  tipo: string;
  titulo: string;
  descricao: string;
  secretaria: string;
  impacto: string;
  desde: string;
}> = ({ tipo, titulo, descricao, secretaria, impacto, desde }) => {
  const tipoConfig = {
    critico: { icon: AlertTriangle, cor: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    atencao: { icon: Bell, cor: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
    positivo: { icon: TrendingUp, cor: "text-green-600", bg: "bg-green-50", border: "border-green-200" }
  };

  const config = tipoConfig[tipo as keyof typeof tipoConfig];
  const Icon = config.icon;

  return (
    <Card className={`${config.bg} ${config.border}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Icon className={`h-5 w-5 ${config.cor} mt-0.5`} />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{titulo}</p>
              <Badge variant={tipo === "critico" ? "destructive" : tipo === "positivo" ? "default" : "secondary"}>
                {impacto}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{descricao}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{secretaria}</span>
              <span>Desde {new Date(desde).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para as atividades recentes
const AtividadeRecente: FC<{
  tipo: string;
  titulo: string;
  data: string;
  descricao: string;
}> = ({ tipo, titulo, data, descricao }) => {
  const tipoIcons = {
    reuniao: <Calendar className="h-8 w-8 p-1 rounded-full bg-blue-100 text-blue-500" />,
    despacho: <FileText className="h-8 w-8 p-1 rounded-full bg-green-100 text-green-500" />,
    evento: <Activity className="h-8 w-8 p-1 rounded-full bg-purple-100 text-purple-500" />,
  };

  return (
    <div className="flex items-start space-x-4 mb-4">
      <div>{tipoIcons[tipo as keyof typeof tipoIcons]}</div>
      <div>
        <p className="font-medium">{titulo}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(data).toLocaleString()} - {descricao}
        </p>
      </div>
    </div>
  );
};

// Componente para compromissos da agenda
const CompromissoAgenda: FC<{
  titulo: string;
  data: string;
  local: string;
}> = ({ titulo, data, local }) => (
  <div className="flex items-center space-x-4 py-2">
    <div className="bg-primary/10 p-2 rounded-full">
      <Clock className="h-4 w-4 text-primary" />
    </div>
    <div className="flex-1 space-y-1">
      <p className="font-medium leading-none">{titulo}</p>
      <p className="text-sm text-muted-foreground">
        {new Date(data).toLocaleString()} - {local}
      </p>
    </div>
  </div>
);

const VisaoGeral: FC = () => {
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());

  const atualizarDados = () => {
    setUltimaAtualizacao(new Date());
    // Aqui seria feita a chamada para atualizar os dados do backend
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Executivo</h1>
            <p className="text-sm text-muted-foreground">
              Última atualização: {ultimaAtualizacao.toLocaleTimeString("pt-BR")}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={atualizarDados}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Mapa de Demandas
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios Executivos
            </Button>
          </div>
        </div>

        {/* KPIs Executivos Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <KpiCardAvancado
            title="Protocolos Abertos"
            atual={kpisExecutivos.protocolosAbertos.atual}
            anterior={kpisExecutivos.protocolosAbertos.anterior}
            meta={kpisExecutivos.protocolosAbertos.meta}
            icon={<FileBadge />}
          />
          <KpiCardAvancado
            title="Tempo Médio Resposta"
            atual={kpisExecutivos.tempoMedioResposta.atual}
            anterior={kpisExecutivos.tempoMedioResposta.anterior}
            meta={kpisExecutivos.tempoMedioResposta.meta}
            formato="decimal"
            unidade=" dias"
            icon={<Clock />}
          />
          <KpiCardAvancado
            title="Satisfação Geral"
            atual={kpisExecutivos.satisfacaoGeral.atual}
            anterior={kpisExecutivos.satisfacaoGeral.anterior}
            meta={kpisExecutivos.satisfacaoGeral.meta}
            formato="percentage"
            icon={<Users />}
          />
          <KpiCardAvancado
            title="Taxa de Resolução"
            atual={kpisExecutivos.taxaResolucao.atual}
            anterior={kpisExecutivos.taxaResolucao.anterior}
            meta={kpisExecutivos.taxaResolucao.meta}
            formato="percentage"
            icon={<Activity />}
          />
          <KpiCardAvancado
            title="Custo por Atendimento"
            atual={kpisExecutivos.custoPorAtendimento.atual}
            anterior={kpisExecutivos.custoPorAtendimento.anterior}
            meta={kpisExecutivos.custoPorAtendimento.meta}
            formato="currency"
            icon={<BarChart3 />}
          />
          <KpiCardAvancado
            title="Produtividade"
            atual={kpisExecutivos.produtividade.atual}
            anterior={kpisExecutivos.produtividade.anterior}
            meta={kpisExecutivos.produtividade.meta}
            formato="percentage"
            icon={<TrendingUp />}
          />
        </div>

        {/* Alertas e Tendências */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Alertas e Tendências</h2>
            <Badge variant="secondary">
              {alertasTendencias.filter(a => a.tipo === "critico").length} críticos
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {alertasTendencias.map((alerta, index) => (
              <AlertaCard
                key={index}
                tipo={alerta.tipo}
                titulo={alerta.titulo}
                descricao={alerta.descricao}
                secretaria={alerta.secretaria}
                impacto={alerta.impacto}
                desde={alerta.desde}
              />
            ))}
          </div>
        </div>

        {/* Gráficos Analíticos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Demandas por Secretaria</CardTitle>
              <CardDescription>Total vs Resolvidas vs Urgentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveBar
                  data={demandasPorSetorData}
                  keys={["demandas", "resolvidas", "urgentes"]}
                  indexBy="setor"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  colors={["hsl(210, 70%, 50%)", "hsl(142, 70%, 45%)", "hsl(0, 70%, 50%)"]}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: "Secretaria",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Quantidade",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: "left-to-right",
                      itemOpacity: 0.85,
                      symbolSize: 20,
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal Executiva</CardTitle>
              <CardDescription>Protocolos vs Resolvidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveLine
                  data={[
                    {
                      id: "Protocolos",
                      color: "hsl(210, 70%, 50%)",
                      data: evolucaoMensalData.map(d => ({ x: d.x, y: d.protocolos })),
                    },
                    {
                      id: "Resolvidos",
                      color: "hsl(142, 70%, 45%)",
                      data: evolucaoMensalData.map(d => ({ x: d.x, y: d.resolvidos })),
                    },
                  ]}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                    reverse: false,
                  }}
                  curve="cardinal"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Mês",
                    legendOffset: 36,
                    legendPosition: "middle",
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Quantidade",
                    legendOffset: -40,
                    legendPosition: "middle",
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
                      symbolShape: "circle",
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance por Secretaria</CardTitle>
              <CardDescription>Indicador geral de eficiência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsivePie
                  data={performanceSecretariasData}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                  legends={[
                    {
                      anchor: "bottom",
                      direction: "row",
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: "#999",
                      itemDirection: "left-to-right",
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: "circle",
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas atividades realizadas pelo gabinete</CardDescription>
            </CardHeader>
            <CardContent>
              {atividadesRecentes.map((atividade, index) => (
                <AtividadeRecente
                  key={index}
                  tipo={atividade.tipo}
                  titulo={atividade.titulo}
                  data={atividade.data}
                  descricao={atividade.descricao}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agenda do Prefeito</CardTitle>
              <CardDescription>Próximos compromissos agendados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {compromissosAgenda.map((compromisso, index) => (
                <CompromissoAgenda
                  key={index}
                  titulo={compromisso.titulo}
                  data={compromisso.data}
                  local={compromisso.local}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default VisaoGeral;
