
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, Filter, Info, MapPin, PieChart, Share2 } from "lucide-react";
import { FC } from "react";

// Dados fictícios de regiões e demandas
const regioesData = [
  { id: 1, nome: "Centro", totalDemandas: 124, pendentes: 45, emAndamento: 32, concluidas: 47 },
  { id: 2, nome: "Zona Norte", totalDemandas: 87, pendentes: 28, emAndamento: 41, concluidas: 18 },
  { id: 3, nome: "Zona Sul", totalDemandas: 152, pendentes: 63, emAndamento: 57, concluidas: 32 },
  { id: 4, nome: "Zona Leste", totalDemandas: 98, pendentes: 37, emAndamento: 29, concluidas: 32 },
  { id: 5, nome: "Zona Oeste", totalDemandas: 115, pendentes: 51, emAndamento: 38, concluidas: 26 },
];

// Tipos de demandas mais comuns
const tiposDemandas = [
  { tipo: "Iluminação pública", quantidade: 87 },
  { tipo: "Pavimentação", quantidade: 74 },
  { tipo: "Limpeza urbana", quantidade: 64 },
  { tipo: "Segurança", quantidade: 49 },
  { tipo: "Saúde", quantidade: 43 },
];

// Dados de exemplo de demandas específicas
const demandasExemplo = [
  {
    id: "DM-2025-001",
    descricao: "Falta de iluminação na Rua das Flores",
    bairro: "Centro",
    status: "pendente",
    prioridade: "alta",
    dataCriacao: "2025-05-10",
  },
  {
    id: "DM-2025-002",
    descricao: "Buraco na pavimentação da Av. Principal",
    bairro: "Zona Norte",
    status: "em_andamento",
    prioridade: "média",
    dataCriacao: "2025-05-08",
  },
  {
    id: "DM-2025-003",
    descricao: "Coleta de lixo irregular",
    bairro: "Zona Sul",
    status: "concluida",
    prioridade: "baixa",
    dataCriacao: "2025-05-05",
  },
];

// Componente para a barra de estatísticas
const EstatsBar: FC<{
  totalDemandas: number;
  pendentes: number;
  emAndamento: number;
  concluidas: number;
}> = ({ totalDemandas, pendentes, emAndamento, concluidas }) => {
  const pendentesPerc = (pendentes / totalDemandas) * 100;
  const emAndamentoPerc = (emAndamento / totalDemandas) * 100;
  const concluidasPerc = (concluidas / totalDemandas) * 100;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
      <div
        className="bg-yellow-500 h-full float-left"
        style={{ width: `${pendentesPerc}%` }}
      />
      <div
        className="bg-blue-500 h-full float-left"
        style={{ width: `${emAndamentoPerc}%` }}
      />
      <div
        className="bg-green-500 h-full float-left"
        style={{ width: `${concluidasPerc}%` }}
      />
    </div>
  );
};

// Componente para o indicador de status
const StatusIndicator: FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    pendente: { label: "Pendente", className: "bg-yellow-500 text-yellow-50" },
    em_andamento: { label: "Em Andamento", className: "bg-blue-500 text-blue-50" },
    concluida: { label: "Concluída", className: "bg-green-500 text-green-50" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: "bg-gray-500 text-gray-50" };

  return (
    <Badge className={config.className}>{config.label}</Badge>
  );
};

// Componente para o indicador de prioridade
const PriorityIndicator: FC<{ prioridade: string }> = ({ prioridade }) => {
  const prioridadeConfig = {
    alta: { label: "Alta", className: "bg-red-500 text-red-50" },
    média: { label: "Média", className: "bg-orange-500 text-orange-50" },
    baixa: { label: "Baixa", className: "bg-green-500 text-green-50" },
  };

  const config = prioridadeConfig[prioridade as keyof typeof prioridadeConfig] || { label: prioridade, className: "bg-gray-500 text-gray-50" };

  return (
    <Badge className={config.className}>{config.label}</Badge>
  );
};

// Componente para a página de Mapa de Demandas
const MapaDemandas: FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mapa de Demandas</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" /> Exportar
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Compartilhar
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Info className="h-4 w-4" /> Ajuda
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sobre o Mapa de Demandas</DialogTitle>
                  <DialogDescription>
                    O Mapa de Demandas apresenta uma visualização georreferenciada de todas as solicitações, reclamações e demandas
                    recebidas pela prefeitura. Utilize os filtros para refinar a visualização e clique em qualquer região para ver
                    detalhes específicos.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <h4 className="font-medium">Como usar:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Use os filtros para visualizar demandas por categoria, status ou período</li>
                    <li>Clique em uma região para ver as estatísticas específicas</li>
                    <li>Selecione uma demanda específica para ver detalhes completos</li>
                    <li>Use as opções de exportação para gerar relatórios</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Visualização do Mapa</CardTitle>
                <CardDescription>Clique em uma região para ver detalhes</CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Select defaultValue="todas">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as categorias</SelectItem>
                      <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                      <SelectItem value="saneamento">Saneamento</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="seguranca">Segurança</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="todos">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="andamento">Em andamento</SelectItem>
                      <SelectItem value="concluido">Concluídas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="30d">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Últimos 7 dias</SelectItem>
                      <SelectItem value="30d">Últimos 30 dias</SelectItem>
                      <SelectItem value="90d">Últimos 90 dias</SelectItem>
                      <SelectItem value="1a">Último ano</SelectItem>
                      <SelectItem value="todos">Todo o período</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" /> Mais filtros
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Mapa interativo será carregado aqui</p>
                    <p className="text-sm">Visualização georreferenciada de demandas por região</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs">Pendentes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs">Em andamento</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Concluídas</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total: 576 demandas
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Detalhes da Região</CardTitle>
                <CardDescription>Estatísticas e demandas específicas</CardDescription>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma região" />
                  </SelectTrigger>
                  <SelectContent>
                    {regioesData.map((regiao) => (
                      <SelectItem key={regiao.id} value={regiao.id.toString()}>
                        {regiao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[480px]">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Estatísticas da Região Centro</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Total de Demandas</span>
                          <span className="font-medium">124</span>
                        </div>
                        <EstatsBar
                          totalDemandas={124}
                          pendentes={45}
                          emAndamento={32}
                          concluidas={47}
                        />
                        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                          <span>45 Pendentes</span>
                          <span>32 Em andamento</span>
                          <span>47 Concluídas</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Tipos de demandas mais comuns</h4>
                        <div className="space-y-2">
                          {tiposDemandas.map((tipo, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{tipo.tipo}</span>
                              <span className="font-medium">{tipo.quantidade}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Demandas específicas</h3>
                    <Tabs defaultValue="todas">
                      <TabsList className="w-full">
                        <TabsTrigger value="todas" className="flex-1">Todas</TabsTrigger>
                        <TabsTrigger value="pendentes" className="flex-1">Pendentes</TabsTrigger>
                        <TabsTrigger value="emAndamento" className="flex-1">Em andamento</TabsTrigger>
                        <TabsTrigger value="concluidas" className="flex-1">Concluídas</TabsTrigger>
                      </TabsList>

                      <TabsContent value="todas" className="mt-4 space-y-4">
                        {demandasExemplo.map((demanda) => (
                          <div
                            key={demanda.id}
                            className="p-3 border rounded-lg border-border hover:bg-muted cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{demanda.descricao}</p>
                                <p className="text-sm text-muted-foreground">
                                  {demanda.bairro} - {new Date(demanda.dataCriacao).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <StatusIndicator status={demanda.status} />
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-muted-foreground">{demanda.id}</div>
                              <PriorityIndicator prioridade={demanda.prioridade} />
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="pendentes" className="mt-4 space-y-4">
                        <div className="p-3 border rounded-lg border-border hover:bg-muted cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Falta de iluminação na Rua das Flores</p>
                              <p className="text-sm text-muted-foreground">
                                Centro - 10/05/2025
                              </p>
                            </div>
                            <div>
                              <StatusIndicator status="pendente" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-muted-foreground">DM-2025-001</div>
                            <PriorityIndicator prioridade="alta" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="emAndamento" className="mt-4 space-y-4">
                        <div className="p-3 border rounded-lg border-border hover:bg-muted cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Buraco na pavimentação da Av. Principal</p>
                              <p className="text-sm text-muted-foreground">
                                Zona Norte - 08/05/2025
                              </p>
                            </div>
                            <div>
                              <StatusIndicator status="em_andamento" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-muted-foreground">DM-2025-002</div>
                            <PriorityIndicator prioridade="média" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="concluidas" className="mt-4 space-y-4">
                        <div className="p-3 border rounded-lg border-border hover:bg-muted cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Coleta de lixo irregular</p>
                              <p className="text-sm text-muted-foreground">
                                Zona Sul - 05/05/2025
                              </p>
                            </div>
                            <div>
                              <StatusIndicator status="concluida" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-muted-foreground">DM-2025-003</div>
                            <PriorityIndicator prioridade="baixa" />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline">Carregar mais</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Análise de Tendências</CardTitle>
            <CardDescription>Evolução e distribuição de demandas ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>Gráficos analíticos serão carregados aqui</p>
                <p className="text-sm">Visualizações de tendências e comparativo entre regiões</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MapaDemandas;
