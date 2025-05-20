
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
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Building,
  Phone,
  Mail,
  MapPin,
  Users,
  Clock,
  ChevronDown,
  User,
} from "lucide-react";
import { Unidade } from "@/types/assistencia-social";

// Mock data for CRAS e CREAS
const mockUnidades: Unidade[] = [
  {
    id: "1",
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
    equipe: [
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
    ],
    horarioFuncionamento: "Segunda a Sexta, 8h às 17h",
    areasAbrangencia: ["Centro", "Vila Nova", "Jardim Europa"]
  },
  {
    id: "2",
    nome: "CRAS Norte",
    tipo: "CRAS",
    endereco: "Rua das Acácias, 123",
    bairro: "Jardim Primavera",
    telefone: "(11) 3333-6666",
    email: "cras.norte@prefeitura.gov.br",
    coordenador: {
      id: "c2",
      nome: "Roberto Alves",
      cargo: "Coordenador",
      registro: "54321",
      email: "roberto.alves@prefeitura.gov.br",
      telefone: "(11) 3333-8888"
    },
    equipe: [
      {
        id: "t4",
        nome: "Fernanda Silva",
        cargo: "Assistente Social",
        registro: "CRESS 45678",
        email: "fernanda.silva@prefeitura.gov.br",
        telefone: "(11) 3333-1111"
      },
      {
        id: "t5",
        nome: "Ricardo Gomes",
        cargo: "Psicólogo",
        registro: "CRP 87654",
        email: "ricardo.gomes@prefeitura.gov.br",
        telefone: "(11) 3333-2222"
      }
    ],
    horarioFuncionamento: "Segunda a Sexta, 8h às 17h",
    areasAbrangencia: ["Jardim Primavera", "Vila Industrial", "Nova Esperança"]
  },
  {
    id: "3",
    nome: "CREAS Municipal",
    tipo: "CREAS",
    endereco: "Rua das Acácias, 200",
    bairro: "Jardim América",
    telefone: "(11) 3333-7777",
    email: "creas@prefeitura.gov.br",
    coordenador: {
      id: "c3",
      nome: "Juliana Pereira",
      cargo: "Coordenadora",
      registro: "98765",
      email: "juliana.pereira@prefeitura.gov.br",
      telefone: "(11) 3333-3333"
    },
    equipe: [
      {
        id: "t6",
        nome: "André Costa",
        cargo: "Assistente Social",
        registro: "CRESS 56789",
        email: "andre.costa@prefeitura.gov.br",
        telefone: "(11) 3333-4444"
      },
      {
        id: "t7",
        nome: "Camila Santos",
        cargo: "Psicóloga",
        registro: "CRP 12345",
        email: "camila.santos@prefeitura.gov.br",
        telefone: "(11) 3333-5555"
      },
      {
        id: "t8",
        nome: "Lucas Oliveira",
        cargo: "Advogado",
        registro: "OAB 98765",
        email: "lucas.oliveira@prefeitura.gov.br",
        telefone: "(11) 3333-6666"
      }
    ],
    horarioFuncionamento: "Segunda a Sexta, 8h às 18h",
    areasAbrangencia: ["Todo o município"]
  },
  {
    id: "4",
    nome: "Centro POP",
    tipo: "Outro",
    endereco: "Av. Central, 300",
    bairro: "Centro",
    telefone: "(11) 3333-8888",
    email: "centro.pop@prefeitura.gov.br",
    coordenador: {
      id: "c4",
      nome: "Eduardo Lima",
      cargo: "Coordenador",
      registro: "12345",
      email: "eduardo.lima@prefeitura.gov.br",
      telefone: "(11) 3333-9999"
    },
    equipe: [
      {
        id: "t9",
        nome: "Marcela Sousa",
        cargo: "Assistente Social",
        registro: "CRESS 87654",
        email: "marcela.sousa@prefeitura.gov.br",
        telefone: "(11) 3333-1111"
      },
      {
        id: "t10",
        nome: "Rodrigo Teixeira",
        cargo: "Educador Social",
        registro: "5432",
        email: "rodrigo.teixeira@prefeitura.gov.br",
        telefone: "(11) 3333-2222"
      }
    ],
    horarioFuncionamento: "Segunda a Domingo, 8h às 20h",
    areasAbrangencia: ["Todo o município"]
  }
];

const CRASeCREAS: FC = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [showNovaUnidade, setShowNovaUnidade] = useState(false);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | null>(null);
  const [showDetalhes, setShowDetalhes] = useState(false);

  const filtrarUnidades = () => {
    let unidadesFiltradas = [...mockUnidades];
    
    // Filtro por tipo baseado na tab
    if (activeTab !== "todos") {
      unidadesFiltradas = unidadesFiltradas.filter(u => {
        if (activeTab === "cras") return u.tipo === "CRAS";
        if (activeTab === "creas") return u.tipo === "CREAS";
        if (activeTab === "outros") return u.tipo !== "CRAS" && u.tipo !== "CREAS";
        return true;
      });
    }
    
    // Filtro por termo de busca
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      unidadesFiltradas = unidadesFiltradas.filter(u => 
        u.nome.toLowerCase().includes(termo) ||
        u.bairro.toLowerCase().includes(termo) ||
        u.areasAbrangencia.some(area => area.toLowerCase().includes(termo))
      );
    }
    
    return unidadesFiltradas;
  };

  const unidadesFiltradas = filtrarUnidades();

  const handleDetalhesUnidade = (unidade: Unidade) => {
    setUnidadeSelecionada(unidade);
    setShowDetalhes(true);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">CRAS e CREAS</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gerenciamento de unidades de atendimento da Assistência Social
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={showNovaUnidade} onOpenChange={setShowNovaUnidade}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Nova Unidade</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Nova Unidade</DialogTitle>
                  <DialogDescription>
                    Preencha as informações para criar uma nova unidade de atendimento.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome da Unidade
                      </label>
                      <Input id="nome" placeholder="Nome da unidade" />
                    </div>
                    
                    <div>
                      <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo
                      </label>
                      <select 
                        id="tipo"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="CRAS">CRAS</option>
                        <option value="CREAS">CREAS</option>
                        <option value="Outro">Outro</option>
                      </select>
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
                      <Input id="bairro" placeholder="Bairro" />
                    </div>
                    
                    <div>
                      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Telefone
                      </label>
                      <Input id="telefone" placeholder="(00) 0000-0000" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        E-mail
                      </label>
                      <Input id="email" type="email" placeholder="email@exemplo.com" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="horario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Horário de Funcionamento
                      </label>
                      <Input id="horario" placeholder="Ex: Segunda a Sexta, 8h às 17h" />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="areasAbrangencia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Áreas de Abrangência
                      </label>
                      <Textarea 
                        id="areasAbrangencia" 
                        placeholder="Digite os bairros atendidos, separados por vírgula" 
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowNovaUnidade(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={() => setShowNovaUnidade(false)}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Dialog para detalhes da unidade */}
            <Dialog open={showDetalhes} onOpenChange={setShowDetalhes}>
              {unidadeSelecionada && (
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>{unidadeSelecionada.nome}</DialogTitle>
                    <DialogDescription>
                      Detalhes completos da unidade de atendimento
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo:</h3>
                        <p className="mt-1">{unidadeSelecionada.tipo}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bairro:</h3>
                        <p className="mt-1">{unidadeSelecionada.bairro}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Endereço:</h3>
                        <p className="mt-1 flex items-start">
                          <MapPin className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
                          {unidadeSelecionada.endereco}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contato:</h3>
                        <p className="mt-1 flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-500" />
                          {unidadeSelecionada.telefone}
                        </p>
                        <p className="mt-1 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-500" />
                          {unidadeSelecionada.email}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Horário de Funcionamento:</h3>
                        <p className="mt-1 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          {unidadeSelecionada.horarioFuncionamento}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Coordenador(a):</h3>
                        <p className="mt-1 flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-500" />
                          {unidadeSelecionada.coordenador.nome} - {unidadeSelecionada.coordenador.cargo}
                        </p>
                      </div>
                      
                      <div className="col-span-2">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Áreas de Abrangência:</h3>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {unidadeSelecionada.areasAbrangencia.map((area, index) => (
                            <Badge key={index} variant="outline">{area}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Equipe Técnica:</h3>
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Cargo</TableHead>
                              <TableHead>Registro</TableHead>
                              <TableHead>Contato</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {unidadeSelecionada.equipe.map((membro) => (
                              <TableRow key={membro.id}>
                                <TableCell className="font-medium">{membro.nome}</TableCell>
                                <TableCell>{membro.cargo}</TableCell>
                                <TableCell>{membro.registro}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1 text-gray-500" />
                                    <span className="text-xs">{membro.email}</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
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
            <CardTitle>Unidades de Atendimento</CardTitle>
            <CardDescription>
              CRAS, CREAS e outras unidades da rede de assistência social
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar por nome ou bairro..."
                    className="pl-8"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="todos" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="cras">CRAS</TabsTrigger>
                  <TabsTrigger value="creas">CREAS</TabsTrigger>
                  <TabsTrigger value="outros">Outros</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Endereço</TableHead>
                          <TableHead>Contato</TableHead>
                          <TableHead>Coordenador</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {unidadesFiltradas.length > 0 ? (
                          unidadesFiltradas.map((unidade) => (
                            <TableRow key={unidade.id}>
                              <TableCell className="font-medium">{unidade.nome}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  unidade.tipo === "CRAS" ? "outline" :
                                  unidade.tipo === "CREAS" ? "secondary" : "default"
                                }>
                                  {unidade.tipo}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <MapPin className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  {unidade.bairro}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Phone className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  {unidade.telefone}
                                </div>
                              </TableCell>
                              <TableCell>
                                {unidade.coordenador.nome}
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
                                    <DropdownMenuItem onClick={() => handleDetalhesUnidade(unidade)}>
                                      Ver Detalhes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Editar Informações</DropdownMenuItem>
                                    <DropdownMenuItem>Gerenciar Equipe</DropdownMenuItem>
                                    <DropdownMenuItem>Atualizar Áreas</DropdownMenuItem>
                                    <DropdownMenuItem>Relatório de Atendimentos</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              Nenhuma unidade encontrada.
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
              Mostrando {unidadesFiltradas.length} de {mockUnidades.length} unidades
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CRASeCREAS;
