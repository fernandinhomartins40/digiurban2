
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Calendar as CalendarIcon, Search, Filter, Clock, Users, HandHeart, Building, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Atendimento, FiltroBusca, Cidadao } from "@/types/assistencia-social";

// Mock data
const mockAtendimentos: Atendimento[] = [
  {
    id: "1",
    cidadao: {
      id: "c1",
      nome: "Maria da Silva",
      cpf: "123.456.789-00",
      dataNascimento: "1985-03-15",
      endereco: "Rua das Flores, 123",
      bairro: "Centro",
      telefone: "(11) 98765-4321",
      dataCadastro: "2022-01-15",
      vulnerabilidades: ["Desemprego", "Baixa renda"]
    },
    dataAtendimento: "2023-06-10T14:30:00",
    tipoAtendimento: "Orientação sobre Benefícios",
    descricao: "Orientação sobre como solicitar o Bolsa Família e documentos necessários.",
    encaminhamentos: ["CRAS Centro"],
    status: "Concluído",
    tecnicoResponsavel: {
      id: "t1",
      nome: "Carlos Santos",
      cargo: "Assistente Social",
      registro: "CRESS 12345",
      email: "carlos.santos@prefeitura.gov.br",
      telefone: "(11) 3333-4444"
    },
    unidade: {
      id: "u1",
      nome: "CRAS Centro",
      tipo: "CRAS",
      endereco: "Av. Principal, 500",
      bairro: "Centro",
      telefone: "(11) 3333-5555",
      email: "cras.centro@prefeitura.gov.br",
      coordenador: {
        id: "c1",
        nome: "Ana Oliveira",
        cargo: "Coordenadora",
        registro: "12345",
        email: "ana.oliveira@prefeitura.gov.br",
        telefone: "(11) 3333-4445"
      },
      equipe: [],
      horarioFuncionamento: "Segunda a Sexta, 8h às 17h",
      areasAbrangencia: ["Centro", "Vila Nova", "Jardim Europa"]
    }
  },
  {
    id: "2",
    cidadao: {
      id: "c2",
      nome: "João Pereira",
      cpf: "987.654.321-00",
      dataNascimento: "1978-07-22",
      endereco: "Rua dos Pinheiros, 456",
      bairro: "Vila Nova",
      telefone: "(11) 91234-5678",
      dataCadastro: "2021-11-23",
      vulnerabilidades: ["Violência doméstica", "Desemprego"]
    },
    dataAtendimento: "2023-06-12T10:00:00",
    tipoAtendimento: "Atendimento Psicossocial",
    descricao: "Acompanhamento devido à situação de violência familiar e encaminhamento para acolhimento.",
    encaminhamentos: ["CREAS", "Defensoria Pública"],
    status: "Em andamento",
    tecnicoResponsavel: {
      id: "t2",
      nome: "Mariana Lima",
      cargo: "Psicóloga",
      registro: "CRP 54321",
      email: "mariana.lima@prefeitura.gov.br",
      telefone: "(11) 3333-6666"
    },
    unidade: {
      id: "u2",
      nome: "CREAS Municipal",
      tipo: "CREAS",
      endereco: "Rua das Acácias, 200",
      bairro: "Jardim América",
      telefone: "(11) 3333-7777",
      email: "creas@prefeitura.gov.br",
      coordenador: {
        id: "c2",
        nome: "Roberto Alves",
        cargo: "Coordenador",
        registro: "54321",
        email: "roberto.alves@prefeitura.gov.br",
        telefone: "(11) 3333-8888"
      },
      equipe: [],
      horarioFuncionamento: "Segunda a Sexta, 8h às 18h",
      areasAbrangencia: ["Todo o município"]
    }
  },
  {
    id: "3",
    cidadao: {
      id: "c3",
      nome: "Ana Carolina Souza",
      cpf: "456.789.123-00",
      dataNascimento: "1990-11-05",
      endereco: "Av. das Palmeiras, 789",
      bairro: "Jardim Europa",
      telefone: "(11) 97777-8888",
      dataCadastro: "2022-03-10",
      vulnerabilidades: ["Insegurança alimentar", "Baixa renda"]
    },
    dataAtendimento: "2023-06-15T09:30:00",
    tipoAtendimento: "Solicitação de Benefício Eventual",
    descricao: "Solicitação de cesta básica devido à situação de insegurança alimentar.",
    encaminhamentos: ["Cadastro Único"],
    status: "Aguardando retorno",
    tecnicoResponsavel: {
      id: "t3",
      nome: "Paulo Mendes",
      cargo: "Assistente Social",
      registro: "CRESS 67890",
      email: "paulo.mendes@prefeitura.gov.br",
      telefone: "(11) 3333-9999"
    },
    unidade: {
      id: "u1",
      nome: "CRAS Centro",
      tipo: "CRAS",
      endereco: "Av. Principal, 500",
      bairro: "Centro",
      telefone: "(11) 3333-5555",
      email: "cras.centro@prefeitura.gov.br",
      coordenador: {
        id: "c1",
        nome: "Ana Oliveira",
        cargo: "Coordenadora",
        registro: "12345",
        email: "ana.oliveira@prefeitura.gov.br",
        telefone: "(11) 3333-4445"
      },
      equipe: [],
      horarioFuncionamento: "Segunda a Sexta, 8h às 17h",
      areasAbrangencia: ["Centro", "Vila Nova", "Jardim Europa"]
    }
  }
];

const tiposAtendimento = [
  "Orientação sobre Benefícios",
  "Atendimento Psicossocial",
  "Solicitação de Benefício Eventual",
  "Encaminhamentos",
  "Acompanhamento Familiar",
  "Cadastro Único",
  "Denúncia de Violação de Direitos",
  "Acolhimento Institucional",
  "Atendimento Domiciliar",
  "Outro"
];

const unidades = [
  "CRAS Centro",
  "CRAS Norte",
  "CRAS Sul",
  "CRAS Leste",
  "CRAS Oeste",
  "CREAS Municipal",
  "Centro POP",
  "Outro"
];

const statusAtendimento = [
  "Concluído",
  "Em andamento",
  "Aguardando retorno"
];

const Atendimentos: FC = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [filtros, setFiltros] = useState<FiltroBusca>({});
  const [termoBusca, setTermoBusca] = useState("");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [showNovoAtendimento, setShowNovoAtendimento] = useState(false);

  const filtrarAtendimentos = () => {
    let atendimentosFiltrados = [...mockAtendimentos];
    
    // Filtro por status baseado na tab
    if (activeTab !== "todos") {
      atendimentosFiltrados = atendimentosFiltrados.filter(a => {
        if (activeTab === "concluidos") return a.status === "Concluído";
        if (activeTab === "emAndamento") return a.status === "Em andamento";
        if (activeTab === "aguardando") return a.status === "Aguardando retorno";
        return true;
      });
    }
    
    // Filtro por termo de busca
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      atendimentosFiltrados = atendimentosFiltrados.filter(a => 
        a.cidadao.nome.toLowerCase().includes(termo) ||
        a.cidadao.cpf.includes(termo) ||
        a.tipoAtendimento.toLowerCase().includes(termo) ||
        a.descricao.toLowerCase().includes(termo)
      );
    }
    
    // Filtro por data de início
    if (dataInicio) {
      atendimentosFiltrados = atendimentosFiltrados.filter(a => 
        new Date(a.dataAtendimento) >= dataInicio
      );
    }
    
    // Filtro por data de fim
    if (dataFim) {
      atendimentosFiltrados = atendimentosFiltrados.filter(a => 
        new Date(a.dataAtendimento) <= dataFim
      );
    }
    
    // Filtro por tipo de atendimento
    if (filtros.tipo) {
      atendimentosFiltrados = atendimentosFiltrados.filter(a => 
        a.tipoAtendimento === filtros.tipo
      );
    }
    
    // Filtro por unidade
    if (filtros.unidade) {
      atendimentosFiltrados = atendimentosFiltrados.filter(a => 
        a.unidade.nome === filtros.unidade
      );
    }
    
    return atendimentosFiltrados;
  };

  const atendimentosFiltrados = filtrarAtendimentos();

  const handleClearFilters = () => {
    setTermoBusca("");
    setDataInicio(undefined);
    setDataFim(undefined);
    setFiltros({});
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Atendimentos</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gerenciamento de atendimentos da Assistência Social
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={showNovoAtendimento} onOpenChange={setShowNovoAtendimento}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Novo Atendimento</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Novo Atendimento</DialogTitle>
                  <DialogDescription>
                    Preencha as informações para registrar um novo atendimento.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="cidadao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cidadão
                      </label>
                      <Select>
                        <SelectTrigger id="cidadao">
                          <SelectValue placeholder="Selecione o cidadão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Cidadãos</SelectLabel>
                            {mockAtendimentos.map(a => (
                              <SelectItem key={a.cidadao.id} value={a.cidadao.id}>
                                {a.cidadao.nome} - CPF: {a.cidadao.cpf}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="tipoAtendimento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo de Atendimento
                      </label>
                      <Select>
                        <SelectTrigger id="tipoAtendimento">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tipos de Atendimento</SelectLabel>
                            {tiposAtendimento.map(tipo => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="unidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unidade
                      </label>
                      <Select>
                        <SelectTrigger id="unidade">
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Unidades</SelectLabel>
                            {unidades.map(unidade => (
                              <SelectItem key={unidade} value={unidade}>
                                {unidade}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descrição do Atendimento
                      </label>
                      <Textarea 
                        id="descricao" 
                        placeholder="Descreva o atendimento realizado..." 
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="encaminhamentos" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Encaminhamentos
                      </label>
                      <Textarea 
                        id="encaminhamentos" 
                        placeholder="Liste os encaminhamentos realizados..." 
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowNovoAtendimento(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={() => setShowNovoAtendimento(false)}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Atendimentos Registrados</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os atendimentos realizados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar por nome, CPF ou tipo..."
                    className="pl-8"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Filtros</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Filtrar por</h4>

                          <div>
                            <label htmlFor="tipoSelect" className="text-xs text-gray-500 dark:text-gray-400">
                              Tipo de Atendimento
                            </label>
                            <Select
                              value={filtros.tipo || ""}
                              onValueChange={(value) => setFiltros({ ...filtros, tipo: value })}
                            >
                              <SelectTrigger id="tipoSelect">
                                <SelectValue placeholder="Selecione um tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="">Todos os tipos</SelectItem>
                                  {tiposAtendimento.map(tipo => (
                                    <SelectItem key={tipo} value={tipo}>
                                      {tipo}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label htmlFor="unidadeSelect" className="text-xs text-gray-500 dark:text-gray-400">
                              Unidade
                            </label>
                            <Select
                              value={filtros.unidade || ""}
                              onValueChange={(value) => setFiltros({ ...filtros, unidade: value })}
                            >
                              <SelectTrigger id="unidadeSelect">
                                <SelectValue placeholder="Selecione uma unidade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="">Todas as unidades</SelectItem>
                                  {unidades.map(unidade => (
                                    <SelectItem key={unidade} value={unidade}>
                                      {unidade}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400">
                                Data Início
                              </label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dataInicio ? (
                                      format(dataInicio, "dd/MM/yyyy", { locale: ptBR })
                                    ) : (
                                      <span>Selecione...</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={dataInicio}
                                    onSelect={setDataInicio}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400">
                                Data Fim
                              </label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dataFim ? (
                                      format(dataFim, "dd/MM/yyyy", { locale: ptBR })
                                    ) : (
                                      <span>Selecione...</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={dataFim}
                                    onSelect={setDataFim}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          
                          <Button 
                            variant="secondary"
                            className="w-full mt-2"
                            onClick={handleClearFilters}
                          >
                            Limpar Filtros
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Tabs defaultValue="todos" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
                  <TabsTrigger value="emAndamento">Em Andamento</TabsTrigger>
                  <TabsTrigger value="aguardando">Aguardando</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cidadão</TableHead>
                          <TableHead>Data/Hora</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Unidade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {atendimentosFiltrados.length > 0 ? (
                          atendimentosFiltrados.map((atendimento) => (
                            <TableRow key={atendimento.id}>
                              <TableCell className="font-medium">
                                {atendimento.cidadao.nome}
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  CPF: {atendimento.cidadao.cpf}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  {format(new Date(atendimento.dataAtendimento), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                </div>
                              </TableCell>
                              <TableCell>{atendimento.tipoAtendimento}</TableCell>
                              <TableCell>{atendimento.unidade.nome}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    atendimento.status === "Concluído" ? "outline" :
                                    atendimento.status === "Em andamento" ? "secondary" : "default"
                                  }
                                >
                                  {atendimento.status}
                                </Badge>
                              </TableCell>
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
                                    <DropdownMenuItem>Visualizar</DropdownMenuItem>
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem>Adicionar Encaminhamento</DropdownMenuItem>
                                    <DropdownMenuItem>Alterar Status</DropdownMenuItem>
                                    <DropdownMenuItem>Gerar Relatório</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              Nenhum atendimento encontrado.
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
              Mostrando {atendimentosFiltrados.length} de {mockAtendimentos.length} atendimentos
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Atendimentos;
