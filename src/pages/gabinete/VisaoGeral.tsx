
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FC } from "react";
import { Activity, Calendar, ChevronUp, Clock, FileBadge, FileText } from "lucide-react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

// Dados de exemplo para gráficos
const demandasPorSetorData = [
  { setor: "Saúde", demandas: 45 },
  { setor: "Educação", demandas: 32 },
  { setor: "Infra", demandas: 27 },
  { setor: "Social", demandas: 19 },
  { setor: "Cultura", demandas: 15 },
  { setor: "Esportes", demandas: 12 },
];

const evolucaoMensalData = [
  { x: "Jan", y: 24 },
  { x: "Fev", y: 28 },
  { x: "Mar", y: 35 },
  { x: "Abr", y: 30 },
  { x: "Mai", y: 42 },
];

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

// Componente de KPI Card
const KpiCard: FC<{ title: string; value: string; description: string; icon: React.ReactNode; trend?: string }> = ({ 
  title, 
  value, 
  description, 
  icon,
  trend 
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className="flex items-center pt-1 text-xs text-green-600">
          <ChevronUp className="h-4 w-4" />
          <span>{trend} em relação ao mês anterior</span>
        </div>
      )}
    </CardContent>
  </Card>
);

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
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Visão Geral do Gabinete</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard 
            title="Atendimentos em Aberto" 
            value="24" 
            description="Total de atendimentos aguardando resolução"
            icon={<FileBadge />}
            trend="12% aumento"
          />
          <KpiCard 
            title="Projetos em Andamento" 
            value="18" 
            description="Projetos ativos sob supervisão do gabinete"
            icon={<Activity />}
            trend="5% aumento"
          />
          <KpiCard 
            title="Compromissos da Semana" 
            value="12" 
            description="Eventos e reuniões agendados"
            icon={<Calendar />}
          />
          <KpiCard 
            title="Documentos Pendentes" 
            value="8" 
            description="Documentos aguardando análise ou assinatura"
            icon={<FileText />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Demandas por Setor</CardTitle>
              <CardDescription>Distribuição de demandas por secretarias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveBar
                  data={demandasPorSetorData}
                  keys={["demandas"]}
                  indexBy="setor"
                  margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                  padding={0.3}
                  colors={{ scheme: "nivo" }}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Setor",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Demandas",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal de Atendimentos</CardTitle>
              <CardDescription>Quantidade de atendimentos nos últimos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveLine
                  data={[
                    {
                      id: "atendimentos",
                      color: "hsl(210, 70%, 50%)",
                      data: evolucaoMensalData,
                    },
                  ]}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: true,
                    reverse: false,
                  }}
                  yFormat=" >-.2f"
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
                  pointLabelYOffset={-12}
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
                      symbolBorderColor: "rgba(0, 0, 0, .5)",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemBackground: "rgba(0, 0, 0, .03)",
                            itemOpacity: 1,
                          },
                        },
                      ],
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
