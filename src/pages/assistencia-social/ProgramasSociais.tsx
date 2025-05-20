
import { FC, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  User,
  Users,
  HandHeart,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ProgramaSocial, Funcionario, FiltroBusca } from "@/types/assistencia-social";

// Mock data for programas sociais
const mockResponsaveis: Funcionario[] = [
  {
    id: "t1",
    nome: "Carlos Santos",
    cargo: "Assistente Social",
    registro: "CRESS 12345",
    email: "carlos.santos@prefeitura.gov.br",
    telefone: "(11) 3333-4444"
  },
  {
    id: "t2",
    nome: "Mariana Lima",
    cargo: "Psicóloga",
    registro: "CRP 54321",
    email: "mariana.lima@prefeitura.gov.br",
    telefone: "(11) 3333-6666"
  },
  {
    id: "t3",
    nome: "Paulo Mendes",
    cargo: "Assistente Social",
    registro: "CRESS 67890",
    email: "paulo.mendes@prefeitura.gov.br",
    telefone: "(11) 3333-9999"
  }
];

const mockProgramas: ProgramaSocial[] = [
  {
    id: "1",
    nome: "Renda Cidadã Municipal",
    descricao: "Programa de transferência de renda para famílias em situação de vulnerabilidade social.",
    publico: "Famílias com renda per capita inferior a meio salário mínimo.",
    criterios: [
      "Residir no município há pelo menos 2 anos",
      "Estar inscrito no Cadastro Único",
      "Possuir renda per capita inferior a meio salário mínimo",
      "Manter crianças e adolescentes na escola"
    ],
    beneficios: [
      "Auxílio financeiro mensal de R$ 200,00 por família",
      "Prioridade em cursos profissionalizantes"
    ],
    duracao: "12 meses, renovável mediante avaliação",
    responsavel: mockResponsaveis[0],
    status: "Ativo",
    dataInicio: "2022-03-01",
    vagas: 500,
    vagasOcupadas: 432
  },
  {
    id: "2",
    nome: "Inclusão Produtiva",
    descricao: "Projeto de qualificação profissional e inclusão no mercado de trabalho.",
    publico: "Pessoas em situação de vulnerabilidade social com idade entre 18 e 59 anos.",
    criterios: [
      "Estar desempregado há mais de 6 meses",
      "Estar inscrito no Cadastro Único",
      "Possuir renda familiar per capita inferior a um salário mínimo"
    ],
    beneficios: [
      "Curso de qualificação profissional",
      "Auxílio transporte durante o período do curso",
      "Encaminhamento para vagas de emprego"
    ],
    duracao: "6 meses",
    responsavel: mockResponsaveis[1],
    status: "Ativo",
    dataInicio: "2023-01-15",
    dataTermino: "2023-07-15",
    vagas: 100,
    vagasOcupadas: 87
  },
  {
    id: "3",
    nome: "Proteção ao Idoso",
    descricao: "Programa de proteção e apoio a pessoas idosas em situação de vulnerabilidade.",
    publico: "Idosos com 60 anos ou mais em situação de vulnerabilidade social.",
    criterios: [
      "Ter 60 anos ou mais",
      "Estar em situação de vulnerabilidade social",
      "Residir no município"
    ],
    beneficios: [
      "Visitas domiciliares regulares",
      "Participação em grupos de convivência",
      "Acompanhamento de saúde",
      "Atividades culturais e de lazer"
    ],
    responsavel: mockResponsaveis[2],
    status: "Ativo",
    dataInicio: "2022-06-01",
    vagas: 200,
    vagasOcupadas: 175
  },
  {
    id: "4",
    nome: "Primeira Infância Feliz",
    descricao: "Programa de acompanhamento de gestantes e crianças até 6 anos.",
    publico: "Gestantes e famílias com crianças de até 6 anos em situação de vulnerabilidade.",
    criterios: [
      "Estar inscrito no Cadastro Único",
      "Possuir renda per capita inferior a meio salário mínimo",
      "Ter gestante ou criança até 6 anos na família"
    ],
    beneficios: [
      "Visitas domiciliares semanais",
      "Acompanhamento do desenvolvimento infantil",
      "Orientação sobre cuidados na primeira infância",
      "Encaminhamentos para serviços de saúde"
    ],
    duracao: "Até a criança completar 6 anos",
    responsavel: mockResponsaveis[0],
    status: "Ativo",
    dataInicio: "2021-09-01",
    vagas: 300,
    vagasOcupadas: 275
  },
  {
    id: "5",
    nome: "Aluguel Social",
    descricao: "Auxílio temporário para pagamento de aluguel a famílias em situação de vulnerabilidade habitacional.",
    publico: "Famílias em situação de vulnerabilidade habitacional.",
    criterios: [
      "Estar em situação de vulnerabilidade habitacional",
      "Possuir renda familiar de até 3 salários mínimos",
      "Não possuir imóvel próprio",
      "Residir no município há pelo menos 1 ano"
    ],
    beneficios: [
      "Auxílio financeiro para pagamento de aluguel (até R$ 600,00)",
      "Acompanhamento social",
      "Inclusão em programas habitacionais permanentes"
    ],
    duracao: "Até 18 meses",
    responsavel: mockResponsaveis[2],
    status: "Ativo",
    dataInicio: "2022-04-15",
    vagas: 80,
    vagasOcupadas: 72
  },
  {
    id: "6",
    nome: "Segurança Alimentar Municipal",
    descricao: "Programa de combate à insegurança alimentar através da distribuição de alimentos.",
    publico: "Famílias em situação de insegurança alimentar.",
    criterios: [
      "Estar em situação de insegurança alimentar",
      "Possuir renda per capita inferior a meio salário mínimo",
      "Estar inscrito no Cadastro Único"
    ],
    beneficios: [
      "Cesta básica mensal",
      "Orientação nutricional",
      "Acesso a restaurantes populares"
    ],
    duracao: "6 meses, renovável mediante avaliação",
    responsavel: mockResponsaveis[1],
    status: "Inativo",
    dataInicio: "2021-10-01",
    dataTermino: "2022-10-01",
    vagas: 400,
    vagasOcupadas: 0
  }
];

const ProgramasSociais: FC = () => {
  const [activeTab, setActiveTab] = useState("ativos");
  const [filtros, setFiltros] = useState<FiltroBusca>({});
  const [termoBusca, setTermoBusca] = useState("");
  const [showNovoPrograma, setShowNovoPrograma] = useState(false);
  const [programaSelecionado, setProgramaSelecionado] = useState<ProgramaSocial | null>(null);
  const [showDetalhes, setShowDetalhes] = useState(false);

  const filtrarProgramas = () => {
    let programasFiltrados = [...mockProgramas];
    
    // Filtro por status baseado na tab
    if (activeTab !== "todos") {
      programasFiltrados = programasFiltrados.filter(p => {
        if (activeTab === "ativos") return p.status === "Ativo";
        if (activeTab === "inativos") return p.status === "Inativo";
        return true;
      });
    }
    
    // Filtro por termo de busca
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      programasFiltrados = programasFiltrados.filter(p => 
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo) ||
        p.publico.toLowerCase().includes(termo)
      );
    }
    
    return programasFiltrados;
  };

  const programasFiltrados = filtrarProgramas();
  
  const handleDetalhePrograma = (programa: ProgramaSocial) => {
    setProgramaSelecionado(programa);
    setShowDetalhes(true);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Programas Sociais</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gerenciamento de programas e projetos da Assistência Social
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={showNovoPrograma} onOpenChange={setShowNovoPrograma}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Novo Programa</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Programa Social</DialogTitle>
                  <DialogDescription>
                    Preencha as informações para criar um novo programa social.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome do Programa
                      </label>
                      <Input id="nome" placeholder="Nome do programa" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descrição
                      </label>
                      <Textarea id="descricao" placeholder="Descrição do programa" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="publico" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Público-alvo
                      </label>
                      <Textarea id="publico" placeholder="Descrição do público-alvo" />
                    </div>
                    
                    <div>
                      <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data de Início
                      </label>
                      <Input id="dataInicio" type="date" />
                    </div>
                    
                    <div>
                      <label htmlFor="dataTermino" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data de Término (Opcional)
                      </label>
                      <Input id="dataTermino" type="date" />
                    </div>
                    
                    <div>
                      <label htmlFor="duracao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duração
                      </label>
                      <Input id="duracao" placeholder="Ex: 12 meses" />
                    </div>
                    
                    <div>
                      <label htmlFor="vagas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total de Vagas
                      </label>
                      <Input id="vagas" type="number" min="1" placeholder="0" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="criterios" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Critérios (um por linha)
                      </label>
                      <Textarea id="criterios" placeholder="Digite os critérios do programa, um por linha" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="beneficios" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Benefícios (um por linha)
                      </label>
                      <Textarea id="beneficios" placeholder="Digite os benefícios oferecidos, um por linha" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Responsável
                      </label>
                      <select 
                        id="responsavel"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione o responsável</option>
                        {mockResponsaveis.map(resp => (
                          <option key={resp.id} value={resp.id}>
                            {resp.nome} ({resp.cargo})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowNovoPrograma(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={() => setShowNovoPrograma(false)}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Dialog para detalhes do programa */}
            <Dialog open={showDetalhes} onOpenChange={setShowDetalhes}>
              {programaSelecionado && (
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>{programaSelecionado.nome}</DialogTitle>
                    <DialogDescription>
                      Detalhes completos do programa social
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Descrição:</h3>
                      <p className="mt-1">{programaSelecionado.descricao}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</h3>
                        <p className="mt-1">
                          <Badge variant={programaSelecionado.status === "Ativo" ? "outline" : "secondary"}>
                            {programaSelecionado.status}
                          </Badge>
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duração:</h3>
                        <p className="mt-1">{programaSelecionado.duracao || "Indeterminado"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Início:</h3>
                        <p className="mt-1 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          {format(new Date(programaSelecionado.dataInicio), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Término:</h3>
                        <p className="mt-1 flex items-center">
                          {programaSelecionado.dataTermino ? (
                            <>
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              {format(new Date(programaSelecionado.dataTermino), "dd/MM/yyyy", { locale: ptBR })}
                            </>
                          ) : (
                            "Não definido"
                          )}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Responsável:</h3>
                        <p className="mt-1 flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-500" />
                          {programaSelecionado.responsavel.nome} ({programaSelecionado.responsavel.cargo})
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ocupação:</h3>
                        <div className="mt-1">
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span>
                              {programaSelecionado.vagasOcupadas} de {programaSelecionado.vagas} vagas
                            </span>
                            <span>
                              {Math.round((programaSelecionado.vagasOcupadas / programaSelecionado.vagas) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(programaSelecionado.vagasOcupadas / programaSelecionado.vagas) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Público-alvo:</h3>
                      <p className="mt-1">{programaSelecionado.publico}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Critérios:</h3>
                        <ul className="mt-1 list-disc list-inside space-y-1">
                          {programaSelecionado.criterios.map((criterio, index) => (
                            <li key={index} className="text-sm">{criterio}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Benefícios:</h3>
                        <ul className="mt-1 list-disc list-inside space-y-1">
                          {programaSelecionado.beneficios.map((beneficio, index) => (
                            <li key={index} className="text-sm">{beneficio}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button 
                      type="button" 
                      variant={programaSelecionado.status === "Ativo" ? "destructive" : "default"}
                    >
                      {programaSelecionado.status === "Ativo" ? "Desativar" : "Ativar"}
                    </Button>
                    <Button type="button" variant="outline">
                      Editar
                    </Button>
                    <Button type="button" onClick={() => setShowDetalhes(false)}>
                      Fechar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Programas Sociais</CardTitle>
            <CardDescription>
              Gerenciamento de programas, projetos e benefícios socioassistenciais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar programas..."
                    className="pl-8"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="ativos" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="ativos">Ativos</TabsTrigger>
                  <TabsTrigger value="inativos">Inativos</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome do Programa</TableHead>
                          <TableHead>Público-alvo</TableHead>
                          <TableHead>Vagas</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Responsável</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {programasFiltrados.length > 0 ? (
                          programasFiltrados.map((programa) => (
                            <TableRow key={programa.id}>
                              <TableCell className="font-medium">
                                <div>{programa.nome}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {programa.descricao.substring(0, 60)}...
                                </div>
                              </TableCell>
                              <TableCell>{programa.publico.split(".")[0]}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between mb-1 text-xs">
                                    <span>
                                      {programa.vagasOcupadas} / {programa.vagas}
                                    </span>
                                    <span>
                                      {Math.round((programa.vagasOcupadas / programa.vagas) * 100)}%
                                    </span>
                                  </div>
                                  <Progress 
                                    value={(programa.vagasOcupadas / programa.vagas) * 100} 
                                    className="h-2"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={programa.status === "Ativo" ? "outline" : "secondary"}>
                                  {programa.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{programa.responsavel.nome}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleDetalhePrograma(programa)}>
                                      Ver Detalhes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem>Lista de Beneficiários</DropdownMenuItem>
                                    <DropdownMenuItem>Relatório de Atendimentos</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className={programa.status === "Ativo" ? "text-red-600" : "text-green-600"}>
                                      {programa.status === "Ativo" ? "Desativar Programa" : "Ativar Programa"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              Nenhum programa encontrado.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {programasFiltrados.length} de {mockProgramas.length} programas
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ProgramasSociais;
