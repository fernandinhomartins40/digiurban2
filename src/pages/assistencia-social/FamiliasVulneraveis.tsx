
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Search,
  Filter,
  Users,
  HandCoins,
  ChevronDown,
  HandHeart,
  FileText,
  Home,
  Calendar,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Familia, FiltroBusca } from "@/types/assistencia-social";

// Mock data for famílias vulneráveis
const mockFamilias: Familia[] = [
  {
    id: "1",
    referencia: {
      id: "c1",
      nome: "Maria da Silva",
      cpf: "123.456.789-00",
      dataNascimento: "1985-03-15",
      endereco: "Rua das Flores, 123",
      bairro: "Centro",
      telefone: "(11) 98765-4321",
      dataCadastro: "2022-01-15",
      vulnerabilidades: ["Desemprego", "Baixa renda"],
      nis: "12345678901",
      cadernico: true
    },
    membros: [
      {
        id: "c5",
        nome: "Pedro da Silva",
        cpf: "123.456.789-01",
        dataNascimento: "1980-05-12",
        endereco: "Rua das Flores, 123",
        bairro: "Centro",
        telefone: "(11) 98765-4321",
        dataCadastro: "2022-01-15",
        vulnerabilidades: ["Desemprego"]
      },
      {
        id: "c6",
        nome: "Ana da Silva",
        cpf: "123.456.789-02",
        dataNascimento: "2010-07-22",
        endereco: "Rua das Flores, 123",
        bairro: "Centro",
        telefone: "(11) 98765-4321",
        dataCadastro: "2022-01-15",
        vulnerabilidades: ["Criança"]
      },
    ],
    rendaFamiliar: 1200.00,
    vulnerabilidades: ["Baixa renda", "Desemprego", "Insegurança alimentar"],
    programasSociais: ["Bolsa Família", "Tarifa Social de Energia"],
    beneficiosRecebidos: [
      {
        id: "b1",
        nome: "Bolsa Família",
        descricao: "Programa de transferência de renda",
        valorMensal: 600,
        dataInicio: "2022-02-01",
        status: "Ativo",
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
        }
      }
    ],
    visitasRealizadas: [
      {
        id: "v1",
        familia: {} as Familia, // será preenchido recursivamente
        endereco: "Rua das Flores, 123 - Centro",
        dataVisita: "2023-03-10",
        tecnicoResponsavel: {
          id: "t1",
          nome: "Ana Paula Silva",
          cargo: "Assistente Social",
          registro: "CRESS 12345",
          email: "ana.silva@prefeitura.gov.br",
          telefone: "(11) 3333-4444"
        },
        motivoVisita: "Acompanhamento familiar",
        relatorio: "Família com dificuldades financeiras, necessitando de apoio para acesso a benefícios.",
        encaminhamentos: ["CRAS para atualização do Cadastro Único"],
        retornoNecessario: true,
        dataProximaVisita: "2023-06-10",
        status: "Realizada"
      }
    ]
  },
  {
    id: "2",
    referencia: {
      id: "c2",
      nome: "João Pereira",
      cpf: "987.654.321-00",
      dataNascimento: "1978-07-22",
      endereco: "Rua dos Pinheiros, 456",
      bairro: "Vila Nova",
      telefone: "(11) 91234-5678",
      dataCadastro: "2021-11-23",
      vulnerabilidades: ["Violência doméstica", "Desemprego"],
      nis: "23456789012",
      cadernico: true
    },
    membros: [
      {
        id: "c7",
        nome: "Mariana Pereira",
        cpf: "987.654.321-01",
        dataNascimento: "1982-08-14",
        endereco: "Rua dos Pinheiros, 456",
        bairro: "Vila Nova",
        telefone: "(11) 91234-5678",
        dataCadastro: "2021-11-23",
        vulnerabilidades: ["Violência doméstica"]
      },
      {
        id: "c8",
        nome: "Lucas Pereira",
        cpf: "987.654.321-02",
        dataNascimento: "2008-12-10",
        endereco: "Rua dos Pinheiros, 456",
        bairro: "Vila Nova",
        telefone: "(11) 91234-5678",
        dataCadastro: "2021-11-23",
        vulnerabilidades: ["Criança"]
      },
      {
        id: "c9",
        nome: "Julia Pereira",
        cpf: "987.654.321-03",
        dataNascimento: "2012-02-28",
        endereco: "Rua dos Pinheiros, 456",
        bairro: "Vila Nova",
        telefone: "(11) 91234-5678",
        dataCadastro: "2021-11-23",
        vulnerabilidades: ["Criança"]
      }
    ],
    rendaFamiliar: 950.00,
    vulnerabilidades: ["Baixa renda", "Violência doméstica", "Habitação precária"],
    programasSociais: ["Bolsa Família", "Auxílio Aluguel"],
    beneficiosRecebidos: [
      {
        id: "b2",
        nome: "Bolsa Família",
        descricao: "Programa de transferência de renda",
        valorMensal: 800,
        dataInicio: "2021-12-15",
        status: "Ativo",
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
        }
      },
      {
        id: "b3",
        nome: "Auxílio Aluguel",
        descricao: "Programa habitacional emergencial",
        valorMensal: 350,
        dataInicio: "2022-03-10",
        dataFim: "2023-03-10",
        status: "Suspenso",
        motivoStatus: "Não renovação do cadastro",
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
        }
      }
    ],
    visitasRealizadas: []
  },
  {
    id: "3",
    referencia: {
      id: "c3",
      nome: "Ana Carolina Souza",
      cpf: "456.789.123-00",
      dataNascimento: "1990-11-05",
      endereco: "Av. das Palmeiras, 789",
      bairro: "Jardim Europa",
      telefone: "(11) 97777-8888",
      dataCadastro: "2022-03-10",
      vulnerabilidades: ["Insegurança alimentar", "Baixa renda"],
      nis: "34567890123",
      cadernico: true
    },
    membros: [
      {
        id: "c10",
        nome: "Miguel Souza",
        cpf: "456.789.123-01",
        dataNascimento: "2015-04-20",
        endereco: "Av. das Palmeiras, 789",
        bairro: "Jardim Europa",
        telefone: "(11) 97777-8888",
        dataCadastro: "2022-03-10",
        vulnerabilidades: ["Criança"]
      }
    ],
    rendaFamiliar: 800.00,
    vulnerabilidades: ["Extrema pobreza", "Insegurança alimentar", "Família monoparental"],
    programasSociais: ["Bolsa Família", "Tarifa Social de Água", "Cesta Básica"],
    beneficiosRecebidos: [
      {
        id: "b4",
        nome: "Bolsa Família",
        descricao: "Programa de transferência de renda",
        valorMensal: 600,
        dataInicio: "2022-04-01",
        status: "Ativo",
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
        }
      }
    ],
    visitasRealizadas: [
      {
        id: "v2",
        familia: {} as Familia, // será preenchido recursivamente
        endereco: "Av. das Palmeiras, 789 - Jardim Europa",
        dataVisita: "2023-05-15",
        tecnicoResponsavel: {
          id: "t2",
          nome: "Carlos Mendes",
          cargo: "Assistente Social",
          registro: "CRESS 67890",
          email: "carlos.mendes@prefeitura.gov.br",
          telefone: "(11) 3333-5555"
        },
        motivoVisita: "Verificação de condições de habitabilidade",
        relatorio: "Residência em condições adequadas, mas família em situação de insegurança alimentar severa.",
        encaminhamentos: ["Inclusão no programa de cestas básicas", "Encaminhamento para curso profissionalizante"],
        retornoNecessario: true,
        dataProximaVisita: "2023-08-15",
        status: "Realizada"
      }
    ]
  }
];

// Fixing circular references in mock data
mockFamilias.forEach(familia => {
  familia.visitasRealizadas.forEach(visita => {
    visita.familia = familia;
  });
});

const vulnerabilidades = [
  "Baixa renda",
  "Extrema pobreza",
  "Desemprego",
  "Insegurança alimentar",
  "Violência doméstica",
  "Habitação precária",
  "Família monoparental",
  "Pessoa com deficiência",
  "Idoso dependente",
  "Criança em situação de risco",
  "Dependência química",
  "Trabalho infantil"
];

const bairros = [
  "Centro",
  "Vila Nova",
  "Jardim Europa",
  "Jardim América",
  "Vila Industrial",
  "Vila Operária",
  "Santa Terezinha",
  "São José",
  "Nova Esperança",
  "Parque das Flores"
];

const FamiliasVulneraveis: FC = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [filtros, setFiltros] = useState<FiltroBusca>({});
  const [termoBusca, setTermoBusca] = useState("");
  const [showNovaFamilia, setShowNovaFamilia] = useState(false);

  const filtrarFamilias = () => {
    let familiasFiltradas = [...mockFamilias];
    
    // Filtro por vulnerabilidades baseado na tab
    if (activeTab === "extremaPobreza") {
      familiasFiltradas = familiasFiltradas.filter(f => 
        f.vulnerabilidades.includes("Extrema pobreza")
      );
    } else if (activeTab === "violencia") {
      familiasFiltradas = familiasFiltradas.filter(f => 
        f.vulnerabilidades.includes("Violência doméstica")
      );
    } else if (activeTab === "insegurancaAlimentar") {
      familiasFiltradas = familiasFiltradas.filter(f => 
        f.vulnerabilidades.includes("Insegurança alimentar")
      );
    }
    
    // Filtro por termo de busca
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      familiasFiltradas = familiasFiltradas.filter(f => 
        f.referencia.nome.toLowerCase().includes(termo) ||
        f.referencia.cpf.includes(termo) ||
        f.referencia.nis?.includes(termo) ||
        f.membros.some(m => m.nome.toLowerCase().includes(termo) || m.cpf.includes(termo))
      );
    }
    
    // Filtro por bairro
    if (filtros.bairro) {
      familiasFiltradas = familiasFiltradas.filter(f => 
        f.referencia.bairro === filtros.bairro
      );
    }
    
    // Filtro por vulnerabilidade específica
    if (filtros.tipo) {
      familiasFiltradas = familiasFiltradas.filter(f => 
        f.vulnerabilidades.includes(filtros.tipo)
      );
    }
    
    return familiasFiltradas;
  };

  const familiasFiltradas = filtrarFamilias();

  const handleClearFilters = () => {
    setTermoBusca("");
    setFiltros({});
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Famílias Vulneráveis</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gerenciamento e acompanhamento de famílias em situação de vulnerabilidade
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={showNovaFamilia} onOpenChange={setShowNovaFamilia}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Cadastrar Nova Família</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cadastro de Família Vulnerável</DialogTitle>
                  <DialogDescription>
                    Preencha as informações para cadastrar uma nova família.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Responsável Familiar
                      </label>
                      <Input id="responsavel" placeholder="Nome completo" />
                    </div>
                    
                    <div>
                      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CPF
                      </label>
                      <Input id="cpf" placeholder="000.000.000-00" />
                    </div>
                    
                    <div>
                      <label htmlFor="nis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        NIS (Opcional)
                      </label>
                      <Input id="nis" placeholder="Número do NIS" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Endereço
                      </label>
                      <Input id="endereco" placeholder="Endereço completo" />
                    </div>
                    
                    <div>
                      <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bairro
                      </label>
                      <Select>
                        <SelectTrigger id="bairro">
                          <SelectValue placeholder="Selecione o bairro" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {bairros.map(bairro => (
                              <SelectItem key={bairro} value={bairro}>
                                {bairro}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Telefone
                      </label>
                      <Input id="telefone" placeholder="(00) 00000-0000" />
                    </div>
                    
                    <div>
                      <label htmlFor="renda" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Renda Familiar
                      </label>
                      <Input id="renda" type="number" placeholder="0.00" />
                    </div>
                    
                    <div>
                      <label htmlFor="membros" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantidade de Membros
                      </label>
                      <Input id="membros" type="number" placeholder="1" min="1" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="vulnerabilidades" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Vulnerabilidades
                      </label>
                      <Select>
                        <SelectTrigger id="vulnerabilidades">
                          <SelectValue placeholder="Selecione as vulnerabilidades" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {vulnerabilidades.map(v => (
                              <SelectItem key={v} value={v}>
                                {v}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <div className="mt-2 space-x-1 space-y-1">
                        {["Extrema pobreza", "Insegurança alimentar"].map((v) => (
                          <Badge key={v} variant="outline" className="mr-1">
                            {v} <span className="ml-1 cursor-pointer">×</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowNovaFamilia(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={() => setShowNovaFamilia(false)}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Famílias Cadastradas</CardTitle>
            <CardDescription>
              Visualize e gerencie as famílias em situação de vulnerabilidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar por nome, CPF ou NIS..."
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
                            <label htmlFor="vulnerabilidadeSelect" className="text-xs text-gray-500 dark:text-gray-400">
                              Vulnerabilidade
                            </label>
                            <Select
                              value={filtros.tipo || ""}
                              onValueChange={(value) => setFiltros({ ...filtros, tipo: value })}
                            >
                              <SelectTrigger id="vulnerabilidadeSelect">
                                <SelectValue placeholder="Selecione uma vulnerabilidade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="">Todas as vulnerabilidades</SelectItem>
                                  {vulnerabilidades.map(v => (
                                    <SelectItem key={v} value={v}>
                                      {v}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label htmlFor="bairroSelect" className="text-xs text-gray-500 dark:text-gray-400">
                              Bairro
                            </label>
                            <Select
                              value={filtros.bairro || ""}
                              onValueChange={(value) => setFiltros({ ...filtros, bairro: value })}
                            >
                              <SelectTrigger id="bairroSelect">
                                <SelectValue placeholder="Selecione um bairro" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="">Todos os bairros</SelectItem>
                                  {bairros.map(bairro => (
                                    <SelectItem key={bairro} value={bairro}>
                                      {bairro}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
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
                  <TabsTrigger value="extremaPobreza">Extrema Pobreza</TabsTrigger>
                  <TabsTrigger value="violencia">Violência</TabsTrigger>
                  <TabsTrigger value="insegurancaAlimentar">Insegurança Alimentar</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Família</TableHead>
                          <TableHead>Membros</TableHead>
                          <TableHead>Vulnerabilidades</TableHead>
                          <TableHead>Benefícios</TableHead>
                          <TableHead>Renda</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {familiasFiltradas.length > 0 ? (
                          familiasFiltradas.map((familia) => (
                            <TableRow key={familia.id}>
                              <TableCell className="font-medium">
                                <div>{familia.referencia.nome}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  CPF: {familia.referencia.cpf}
                                </div>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <Home className="mr-1 h-3 w-3" />
                                  {familia.referencia.bairro}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Users className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  <span>{familia.membros.length + 1}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {familia.vulnerabilidades.slice(0, 2).map((v, i) => (
                                    <Badge key={i} variant="outline" className="mr-1">
                                      {v}
                                    </Badge>
                                  ))}
                                  {familia.vulnerabilidades.length > 2 && (
                                    <Badge variant="outline" className="mr-1">
                                      +{familia.vulnerabilidades.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {familia.programasSociais.map((programa, i) => (
                                    <div key={i} className="flex items-center text-sm">
                                      <HandCoins className="mr-1 h-3 w-3 text-gray-500 dark:text-gray-400" />
                                      <span>{programa}</span>
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>R$ {familia.rendaFamiliar.toFixed(2)}</TableCell>
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
                                    <DropdownMenuItem>Visualizar Detalhes</DropdownMenuItem>
                                    <DropdownMenuItem>Editar Dados</DropdownMenuItem>
                                    <DropdownMenuItem>Adicionar Membro</DropdownMenuItem>
                                    <DropdownMenuItem>Registrar Visita</DropdownMenuItem>
                                    <DropdownMenuItem>Gerenciar Benefícios</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              Nenhuma família encontrada.
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
              Mostrando {familiasFiltradas.length} de {mockFamilias.length} famílias
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default FamiliasVulneraveis;
