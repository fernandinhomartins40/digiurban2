
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronDown, Download, FileText, Printer, Share2 } from "lucide-react";
import { FC } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

// Dados de exemplo para os relatórios
const dadosDesempenhoMensal = [
  { mes: "Jan", atendidos: 65, pendentes: 20 },
  { mes: "Fev", atendidos: 75, pendentes: 25 },
  { mes: "Mar", atendidos: 70, pendentes: 18 },
  { mes: "Abr", atendidos: 90, pendentes: 30 },
  { mes: "Mai", atendidos: 85, pendentes: 22 },
];

const dadosOrcamentoAnual = [
  { id: "Saúde", value: 32 },
  { id: "Educação", value: 27 },
  { id: "Infraestrutura", value: 18 },
  { id: "Assistência Social", value: 12 },
  { id: "Administração", value: 11 },
];

const dadosProjetos = [
  { mes: "Jan", concluido: 4, andamento: 12, planejamento: 6 },
  { mes: "Fev", concluido: 6, andamento: 14, planejamento: 5 },
  { mes: "Mar", concluido: 8, andamento: 15, planejamento: 4 },
  { mes: "Abr", concluido: 7, andamento: 16, planejamento: 7 },
  { mes: "Mai", concluido: 9, andamento: 14, planejamento: 8 },
];

const dadosPerformance = [
  { id: "eficiencia", data: [
    { x: "Jan", y: 70 },
    { x: "Fev", y: 75 },
    { x: "Mar", y: 73 },
    { x: "Abr", y: 82 },
    { x: "Mai", y: 85 },
  ]},
  { id: "satisfacao", data: [
    { x: "Jan", y: 85 },
    { x: "Fev", y: 82 },
    { x: "Mar", y: 80 },
    { x: "Abr", y: 87 },
    { x: "Mai", y: 90 },
  ]},
  { id: "tempo_medio", data: [
    { x: "Jan", y: 65 },
    { x: "Fev", y: 68 },
    { x: "Mar", y: 72 },
    { x: "Abr", y: 75 },
    { x: "Mai", y: 79 },
  ]},
];

// Componente para o botão de filtro
const FilterButton: FC<{ label: string; children?: React.ReactNode }> = ({ label, children }) => (
  <Button variant="outline" className="flex items-center gap-2">
    {label} <ChevronDown className="h-4 w-4" />
  </Button>
);

// Componente para a barra de ações
const ActionBar: FC = () => (
  <div className="flex space-x-2 mt-4">
    <Button variant="outline" className="flex items-center gap-2">
      <Printer className="h-4 w-4" /> Imprimir
    </Button>
    <Button variant="outline" className="flex items-center gap-2">
      <Download className="h-4 w-4" /> Exportar PDF
    </Button>
    <Button variant="outline" className="flex items-center gap-2">
      <FileText className="h-4 w-4" /> Exportar Excel
    </Button>
    <Button variant="outline" className="flex items-center gap-2">
      <Share2 className="h-4 w-4" /> Compartilhar
    </Button>
  </div>
);

// Componente para cabeçalho de relatório
const ReportHeader: FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="mb-4">
    <h2 className="text-xl font-bold">{title}</h2>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

// Componente para a tabela de dados
const DataTable: FC<{ data: any[]; columns: { key: string; label: string }[] }> = ({ data, columns }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
        <tr>
          {columns.map((column) => (
            <th 
              key={column.key}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td 
                key={`${rowIndex}-${column.key}`}
                className="px-6 py-4 whitespace-nowrap text-sm"
              >
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RelatoriosExecutivos: FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Relatórios Executivos</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Geração de Relatórios</CardTitle>
            <CardDescription>Selecione o tipo de relatório e os filtros desejados</CardDescription>
            <div className="flex flex-wrap gap-2 mt-4">
              <Select defaultValue="maio">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="janeiro">Janeiro/2025</SelectItem>
                  <SelectItem value="fevereiro">Fevereiro/2025</SelectItem>
                  <SelectItem value="marco">Março/2025</SelectItem>
                  <SelectItem value="abril">Abril/2025</SelectItem>
                  <SelectItem value="maio">Maio/2025</SelectItem>
                  <SelectItem value="personalizado">Período personalizado</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="todos">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os setores</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                  <SelectItem value="social">Assistência Social</SelectItem>
                  <SelectItem value="admin">Administração</SelectItem>
                </SelectContent>
              </Select>

              <FilterButton label="Mais filtros" />
              
              <Button className="flex items-center gap-2 ml-auto">
                <FileText className="h-4 w-4" /> Gerar Relatório
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="desempenho">
              <div className="border-b mb-4">
                <TabsList className="w-full flex justify-start">
                  <TabsTrigger value="desempenho" className="flex-1 max-w-[200px]">Desempenho</TabsTrigger>
                  <TabsTrigger value="orcamento" className="flex-1 max-w-[200px]">Orçamento</TabsTrigger>
                  <TabsTrigger value="projetos" className="flex-1 max-w-[200px]">Projetos</TabsTrigger>
                  <TabsTrigger value="operacionais" className="flex-1 max-w-[200px]">Operacionais</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="desempenho" className="mt-4">
                <ReportHeader 
                  title="Relatório de Desempenho" 
                  description="Análise de indicadores-chave de performance do gabinete"
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Demandas Atendidas vs. Pendentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveBar
                          data={dadosDesempenhoMensal}
                          keys={["atendidos", "pendentes"]}
                          indexBy="mes"
                          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                          padding={0.3}
                          groupMode="grouped"
                          colors={{ scheme: "nivo" }}
                          axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Mês",
                            legendPosition: "middle",
                            legendOffset: 32
                          }}
                          axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Quantidade",
                            legendPosition: "middle",
                            legendOffset: -40
                          }}
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
                              effects: [
                                {
                                  on: "hover",
                                  style: {
                                    itemOpacity: 1
                                  }
                                }
                              ]
                            }
                          ]}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Indicadores de Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveLine
                          data={dadosPerformance}
                          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                          xScale={{ type: "point" }}
                          yScale={{
                            type: "linear",
                            min: "auto",
                            max: "auto",
                            stacked: false,
                            reverse: false
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
                            legendPosition: "middle"
                          }}
                          axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Pontuação",
                            legendOffset: -40,
                            legendPosition: "middle"
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
                                    itemOpacity: 1
                                  }
                                }
                              ]
                            }
                          ]}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dados Detalhados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTable 
                      data={[
                        { indicador: "Atendimentos realizados", valor: "218", variacao: "+12%", meta: "200" },
                        { indicador: "Tempo médio de resposta", valor: "2.3 dias", variacao: "-8%", meta: "3 dias" },
                        { indicador: "Taxa de resolução", valor: "87%", variacao: "+4%", meta: "85%" },
                        { indicador: "Satisfação do cidadão", valor: "4.2/5", variacao: "+0.3", meta: "4.0/5" },
                        { indicador: "Eficiência operacional", valor: "93%", variacao: "+2%", meta: "90%" }
                      ]}
                      columns={[
                        { key: "indicador", label: "Indicador" },
                        { key: "valor", label: "Valor" },
                        { key: "variacao", label: "Variação" },
                        { key: "meta", label: "Meta" }
                      ]}
                    />
                  </CardContent>
                </Card>

                <ActionBar />
              </TabsContent>

              <TabsContent value="orcamento" className="mt-4">
                <ReportHeader 
                  title="Relatório Orçamentário" 
                  description="Análise da execução orçamentária por setor"
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Distribuição do Orçamento por Setor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsivePie
                          data={dadosOrcamentoAnual}
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
                              effects: [
                                {
                                  on: "hover",
                                  style: {
                                    itemTextColor: "#000"
                                  }
                                }
                              ]
                            }
                          ]}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Execução Orçamentária</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DataTable 
                        data={[
                          { setor: "Saúde", previsto: "R$ 3.200.000,00", executado: "R$ 2.880.000,00", percentual: "90%" },
                          { setor: "Educação", previsto: "R$ 2.700.000,00", executado: "R$ 2.430.000,00", percentual: "90%" },
                          { setor: "Infraestrutura", previsto: "R$ 1.800.000,00", executado: "R$ 1.440.000,00", percentual: "80%" },
                          { setor: "Assistência Social", previsto: "R$ 1.200.000,00", executado: "R$ 1.080.000,00", percentual: "90%" },
                          { setor: "Administração", previsto: "R$ 1.100.000,00", executado: "R$ 990.000,00", percentual: "90%" }
                        ]}
                        columns={[
                          { key: "setor", label: "Setor" },
                          { key: "previsto", label: "Orçamento Previsto" },
                          { key: "executado", label: "Orçamento Executado" },
                          { key: "percentual", label: "% Execução" }
                        ]}
                      />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tendências e Análises</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      <strong>Análise Executiva:</strong> A execução orçamentária do município está alinhada com as metas estabelecidas para o ano fiscal corrente.
                      Destaca-se o percentual de execução na área da Saúde e Educação, ambos atingindo 90% do previsto, demonstrando eficiência na 
                      utilização dos recursos públicos. O setor de Infraestrutura apresenta a menor taxa de execução (80%), o que pode indicar 
                      atrasos em licitações ou obras planejadas.
                    </p>
                    <p className="text-sm">
                      <strong>Recomendações:</strong> Sugere-se um acompanhamento mais próximo dos processos no setor de Infraestrutura para 
                      identificar gargalos e agilizar a execução dos projetos previstos. Para os demais setores, manter o ritmo atual de 
                      execução garantirá o cumprimento das metas orçamentárias anuais.
                    </p>
                  </CardContent>
                </Card>

                <ActionBar />
              </TabsContent>

              <TabsContent value="projetos" className="mt-4">
                <ReportHeader 
                  title="Relatório de Projetos" 
                  description="Status e indicadores de projetos estratégicos"
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Status dos Projetos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveBar
                          data={dadosProjetos}
                          keys={["concluido", "andamento", "planejamento"]}
                          indexBy="mes"
                          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                          padding={0.3}
                          groupMode="stacked"
                          colors={{ scheme: "nivo" }}
                          axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Mês",
                            legendPosition: "middle",
                            legendOffset: 32
                          }}
                          axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Quantidade",
                            legendPosition: "middle",
                            legendOffset: -40
                          }}
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
                              effects: [
                                {
                                  on: "hover",
                                  style: {
                                    itemOpacity: 1
                                  }
                                }
                              ]
                            }
                          ]}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Projetos Prioritários</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DataTable 
                        data={[
                          { 
                            projeto: "Revitalização do Centro", 
                            responsavel: "Sec. Infraestrutura", 
                            prazo: "Out/2025",
                            status: "Em andamento",
                            progresso: "65%"
                          },
                          { 
                            projeto: "Informatização das Escolas", 
                            responsavel: "Sec. Educação", 
                            prazo: "Jul/2025",
                            status: "Em andamento",
                            progresso: "80%"
                          },
                          { 
                            projeto: "Ampliação do Hospital Municipal", 
                            responsavel: "Sec. Saúde", 
                            prazo: "Dez/2025",
                            status: "Em andamento",
                            progresso: "30%"
                          },
                          { 
                            projeto: "Programa Social Casa Feliz", 
                            responsavel: "Sec. Assistência Social", 
                            prazo: "Set/2025",
                            status: "Em andamento",
                            progresso: "45%"
                          },
                          { 
                            projeto: "Portal de Transparência 2.0", 
                            responsavel: "Sec. Administração", 
                            prazo: "Jun/2025",
                            status: "Em andamento",
                            progresso: "95%"
                          }
                        ]}
                        columns={[
                          { key: "projeto", label: "Projeto" },
                          { key: "responsavel", label: "Responsável" },
                          { key: "prazo", label: "Prazo" },
                          { key: "status", label: "Status" },
                          { key: "progresso", label: "Progresso" }
                        ]}
                      />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Análise de Desempenho</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      <strong>Análise Geral:</strong> Os projetos estratégicos do município apresentam um progresso consistente,
                      com uma taxa média de avanço de 63%. Destaca-se o projeto "Portal de Transparência 2.0", com 95% de progresso
                      e previsão de conclusão antecipada. Por outro lado, o projeto "Ampliação do Hospital Municipal" apresenta
                      atraso em relação ao cronograma inicial, com apenas 30% de progresso.
                    </p>
                    <p className="text-sm">
                      <strong>Riscos Identificados:</strong> Possível escassez de recursos para o projeto "Ampliação do Hospital Municipal"
                      e dificuldades na contratação de profissionais especializados. Recomenda-se revisão do cronograma e alocação
                      adicional de recursos para garantir a entrega dentro do prazo estipulado.
                    </p>
                  </CardContent>
                </Card>

                <ActionBar />
              </TabsContent>

              <TabsContent value="operacionais" className="mt-4">
                <ReportHeader 
                  title="Relatório Operacional" 
                  description="Indicadores de operações e processos internos"
                />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resumo Operacional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Processos em Tramitação</p>
                        <p className="text-2xl font-bold">285</p>
                        <p className="text-xs text-green-600">+12% em relação ao mês anterior</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Atendimentos ao Público</p>
                        <p className="text-2xl font-bold">523</p>
                        <p className="text-xs text-green-600">+8% em relação ao mês anterior</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Documentos Emitidos</p>
                        <p className="text-2xl font-bold">198</p>
                        <p className="text-xs text-green-600">+5% em relação ao mês anterior</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Tempo Médio de Tramitação</p>
                        <p className="text-2xl font-bold">3.5 dias</p>
                        <p className="text-xs text-green-600">-0.5 dias em relação ao mês anterior</p>
                      </div>
                    </div>

                    <DataTable 
                      data={[
                        { atividade: "Atendimento presencial", quantidade: 312, tempoMedio: "15 min", satisfacao: "4.8/5" },
                        { atividade: "Atendimento telefônico", quantidade: 211, tempoMedio: "8 min", satisfacao: "4.5/5" },
                        { atividade: "Emissão de documentos", quantidade: 198, tempoMedio: "1.5 dias", satisfacao: "4.3/5" },
                        { atividade: "Análise de processos", quantidade: 154, tempoMedio: "3.2 dias", satisfacao: "4.0/5" },
                        { atividade: "Despachos do Gabinete", quantidade: 87, tempoMedio: "2.0 dias", satisfacao: "4.6/5" }
                      ]}
                      columns={[
                        { key: "atividade", label: "Atividade" },
                        { key: "quantidade", label: "Quantidade" },
                        { key: "tempoMedio", label: "Tempo Médio" },
                        { key: "satisfacao", label: "Satisfação" }
                      ]}
                    />
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-base">Desempenho por Departamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTable 
                      data={[
                        { departamento: "Gabinete", processos: 87, prazoMedio: "2.0 dias", eficiencia: "96%", nivel: "Excelente" },
                        { departamento: "Protocolo", processos: 215, prazoMedio: "1.5 dias", eficiencia: "94%", nivel: "Excelente" },
                        { departamento: "Jurídico", processos: 112, prazoMedio: "4.5 dias", eficiencia: "88%", nivel: "Bom" },
                        { departamento: "Contabilidade", processos: 78, prazoMedio: "3.2 dias", eficiencia: "90%", nivel: "Muito Bom" },
                        { departamento: "Recursos Humanos", processos: 95, prazoMedio: "2.8 dias", eficiencia: "92%", nivel: "Muito Bom" }
                      ]}
                      columns={[
                        { key: "departamento", label: "Departamento" },
                        { key: "processos", label: "Processos" },
                        { key: "prazoMedio", label: "Prazo Médio" },
                        { key: "eficiencia", label: "Eficiência" },
                        { key: "nivel", label: "Nível" }
                      ]}
                    />
                  </CardContent>
                </Card>

                <ActionBar />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatoriosExecutivos;
