
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FC, useState } from "react";
import { AlertCircle, ChevronDown, ChevronRight, Download, Eye, LockIcon, Plus, Search, Shield, UserCircle, UserPlus, Users, UsersRound } from "lucide-react";

// Dados de exemplo para usuários
const usuariosData = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@prefeitura.gov.br",
    departamento: "Gabinete",
    perfil: "Admin",
    status: "ativo",
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    email: "maria.oliveira@prefeitura.gov.br",
    departamento: "Secretaria de Saúde",
    perfil: "Gestor",
    status: "ativo",
  },
  {
    id: 3,
    nome: "Carlos Santos",
    email: "carlos.santos@prefeitura.gov.br",
    departamento: "Secretaria de Educação",
    perfil: "Gestor",
    status: "ativo",
  },
  {
    id: 4,
    nome: "Ana Pereira",
    email: "ana.pereira@prefeitura.gov.br",
    departamento: "Secretaria de Finanças",
    perfil: "Operador",
    status: "ativo",
  },
  {
    id: 5,
    nome: "Paulo Ribeiro",
    email: "paulo.ribeiro@prefeitura.gov.br",
    departamento: "Departamento Jurídico",
    perfil: "Visualizador",
    status: "inativo",
  },
  {
    id: 6,
    nome: "Fernanda Lima",
    email: "fernanda.lima@prefeitura.gov.br",
    departamento: "Secretaria de Cultura",
    perfil: "Operador",
    status: "ativo",
  },
];

// Dados de exemplo para perfis
const perfisData = [
  {
    id: "admin",
    nome: "Admin",
    descricao: "Acesso total ao sistema",
    usuarios: 3,
    permissoes: {
      visualizar: true,
      criar: true,
      editar: true,
      excluir: true,
      aprovar: true,
      gerenciar_usuarios: true,
    },
  },
  {
    id: "gestor",
    nome: "Gestor",
    descricao: "Acesso de gestão ao departamento",
    usuarios: 8,
    permissoes: {
      visualizar: true,
      criar: true,
      editar: true,
      excluir: false,
      aprovar: true,
      gerenciar_usuarios: false,
    },
  },
  {
    id: "operador",
    nome: "Operador",
    descricao: "Acesso operacional básico",
    usuarios: 15,
    permissoes: {
      visualizar: true,
      criar: true,
      editar: true,
      excluir: false,
      aprovar: false,
      gerenciar_usuarios: false,
    },
  },
  {
    id: "visualizador",
    nome: "Visualizador",
    descricao: "Acesso somente para visualização",
    usuarios: 12,
    permissoes: {
      visualizar: true,
      criar: false,
      editar: false,
      excluir: false,
      aprovar: false,
      gerenciar_usuarios: false,
    },
  },
];

// Dados de exemplo para módulos e recursos
const recursosData = [
  {
    id: "gabinete",
    nome: "Gabinete",
    recursos: [
      { id: "gabinete.atendimentos", nome: "Atendimentos", acesso: "total" },
      { id: "gabinete.visao_geral", nome: "Visão Geral", acesso: "total" },
      { id: "gabinete.mapa_demandas", nome: "Mapa de Demandas", acesso: "total" },
      { id: "gabinete.relatorios", nome: "Relatórios Executivos", acesso: "leitura" },
      { id: "gabinete.ordens", nome: "Ordens aos Setores", acesso: "total" },
      { id: "gabinete.permissoes", nome: "Gerenciar Permissões", acesso: "total" },
    ],
  },
  {
    id: "saude",
    nome: "Saúde",
    recursos: [
      { id: "saude.atendimentos", nome: "Atendimentos", acesso: "total" },
      { id: "saude.agendamentos", nome: "Agendamentos Médicos", acesso: "leitura" },
      { id: "saude.medicamentos", nome: "Controle de Medicamentos", acesso: "negado" },
      { id: "saude.campanhas", nome: "Campanhas de Saúde", acesso: "leitura" },
    ],
  },
  {
    id: "educacao",
    nome: "Educação",
    recursos: [
      { id: "educacao.matriculas", nome: "Matrículas", acesso: "total" },
      { id: "educacao.escolas", nome: "Escolas/CMEI's", acesso: "leitura" },
      { id: "educacao.transporte", nome: "Transporte Escolar", acesso: "negado" },
      { id: "educacao.notas", nome: "Notas e Frequências", acesso: "negado" },
    ],
  },
];

// Dados de exemplo para logs de alterações
const logsData = [
  {
    id: 1,
    data: "2025-05-19 10:15",
    usuario: "João Silva",
    acao: "Criou usuário",
    detalhes: "Criou o usuário 'Fernanda Lima'",
  },
  {
    id: 2,
    data: "2025-05-18 15:30",
    usuario: "João Silva",
    acao: "Alterou permissões",
    detalhes: "Alterou permissões do perfil 'Gestor'",
  },
  {
    id: 3,
    data: "2025-05-17 09:45",
    usuario: "Maria Oliveira",
    acao: "Desativou usuário",
    detalhes: "Desativou o usuário 'Paulo Ribeiro'",
  },
  {
    id: 4,
    data: "2025-05-15 14:20",
    usuario: "João Silva",
    acao: "Criou perfil",
    detalhes: "Criou o perfil 'Visualizador'",
  },
  {
    id: 5,
    data: "2025-05-14 11:05",
    usuario: "João Silva",
    acao: "Alterou permissões",
    detalhes: "Alterou permissões do módulo 'Saúde' para o perfil 'Operador'",
  },
];

// Componente para o status do usuário
const StatusUsuario: FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    ativo: { label: "Ativo", className: "bg-green-500 text-green-50" },
    inativo: { label: "Inativo", className: "bg-gray-500 text-gray-50" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: "bg-gray-500 text-gray-50" };

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

// Componente para nível de acesso
const NivelAcesso: FC<{ acesso: string }> = ({ acesso }) => {
  const acessoConfig = {
    total: { label: "Total", className: "bg-green-100 text-green-800 border-green-200" },
    leitura: { label: "Leitura", className: "bg-blue-100 text-blue-800 border-blue-200" },
    negado: { label: "Negado", className: "bg-red-100 text-red-800 border-red-200" },
  };

  const config = acessoConfig[acesso as keyof typeof acessoConfig] || 
                { label: acesso, className: "bg-gray-100 text-gray-800 border-gray-200" };

  return (
    <span className={`px-2 py-1 text-xs rounded border ${config.className}`}>
      {config.label}
    </span>
  );
};

// Componente para a tabela de usuários
const TabelaUsuarios: FC<{ usuarios: typeof usuariosData }> = ({ usuarios }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Departamento</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Perfil</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {usuarios.map((usuario) => (
          <tr key={usuario.id} className={usuario.status === "inativo" ? "bg-gray-50 dark:bg-gray-900/30" : ""}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{usuario.nome}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{usuario.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{usuario.departamento}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{usuario.perfil}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <StatusUsuario status={usuario.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
              <Button variant="ghost" size="sm">Editar</Button>
              <Button 
                variant={usuario.status === "ativo" ? "ghost" : "outline"} 
                size="sm"
              >
                {usuario.status === "ativo" ? "Desativar" : "Ativar"}
              </Button>
              <Button variant="ghost" size="sm" className="ml-2">
                <LockIcon className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Componente para o formulário de novo usuário
const NovoUsuarioForm: FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input id="nome" placeholder="Nome do usuário" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="email@prefeitura.gov.br" />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="departamento">Departamento</Label>
        <Select>
          <SelectTrigger id="departamento">
            <SelectValue placeholder="Selecione um departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gabinete">Gabinete</SelectItem>
            <SelectItem value="saude">Secretaria de Saúde</SelectItem>
            <SelectItem value="educacao">Secretaria de Educação</SelectItem>
            <SelectItem value="financas">Secretaria de Finanças</SelectItem>
            <SelectItem value="cultura">Secretaria de Cultura</SelectItem>
            <SelectItem value="juridico">Departamento Jurídico</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="perfil">Perfil</Label>
        <Select>
          <SelectTrigger id="perfil">
            <SelectValue placeholder="Selecione um perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="gestor">Gestor</SelectItem>
            <SelectItem value="operador">Operador</SelectItem>
            <SelectItem value="visualizador">Visualizador</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="senha">Senha Temporária</Label>
      <Input id="senha" type="password" placeholder="Senha temporária para primeiro acesso" />
    </div>

    <div className="flex items-center space-x-2">
      <Checkbox id="enviar-email" />
      <Label htmlFor="enviar-email">Enviar email com instruções de acesso</Label>
    </div>
  </div>
);

// Componente para o card de perfil
const PerfilCard: FC<{ perfil: typeof perfisData[0] }> = ({ perfil }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{perfil.nome}</CardTitle>
          <Badge variant="outline">{perfil.usuarios} usuários</Badge>
        </div>
        <CardDescription>{perfil.descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Button 
              variant="ghost" 
              className="flex items-center text-sm p-1"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
              {expanded ? "Ocultar permissões" : "Ver permissões"}
            </Button>
            <div className="space-x-2">
              <Button variant="outline" size="sm">Editar</Button>
              <Button variant="ghost" size="sm">Ver Usuários</Button>
            </div>
          </div>
          
          {expanded && (
            <div className="rounded border p-3 space-y-2 bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="text-sm">Visualizar</span>
                <div className="flex h-4 items-center">
                  <Checkbox checked={perfil.permissoes.visualizar} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Criar</span>
                <div className="flex h-4 items-center">
                  <Checkbox checked={perfil.permissoes.criar} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Editar</span>
                <div className="flex h-4 items-center">
                  <Checkbox checked={perfil.permissoes.editar} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Excluir</span>
                <div className="flex h-4 items-center">
                  <Checkbox checked={perfil.permissoes.excluir} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Aprovar</span>
                <div className="flex h-4 items-center">
                  <Checkbox checked={perfil.permissoes.aprovar} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Gerenciar Usuários</span>
                <div className="flex h-4 items-center">
                  <Checkbox checked={perfil.permissoes.gerenciar_usuarios} />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para a matriz de permissões
const MatrizPermissoes: FC = () => (
  <div className="space-y-6">
    {recursosData.map((modulo) => (
      <div key={modulo.id} className="space-y-2">
        <h3 className="font-medium">{modulo.nome}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border rounded-md">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recurso</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gestor</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Operador</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visualizador</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {modulo.recursos.map((recurso) => (
                <tr key={recurso.id}>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">{recurso.nome}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <NivelAcesso acesso="total" />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <Select defaultValue={recurso.acesso}>
                      <SelectTrigger className="h-7 w-24 mx-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">Total</SelectItem>
                        <SelectItem value="leitura">Leitura</SelectItem>
                        <SelectItem value="negado">Negado</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <Select defaultValue="leitura">
                      <SelectTrigger className="h-7 w-24 mx-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">Total</SelectItem>
                        <SelectItem value="leitura">Leitura</SelectItem>
                        <SelectItem value="negado">Negado</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <Select defaultValue="leitura">
                      <SelectTrigger className="h-7 w-24 mx-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">Total</SelectItem>
                        <SelectItem value="leitura">Leitura</SelectItem>
                        <SelectItem value="negado">Negado</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ))}
    
    <div className="flex justify-end">
      <Button>Salvar Alterações</Button>
    </div>
  </div>
);

// Componente para o formulário de novo perfil
const NovoPerfilForm: FC = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="nome_perfil">Nome do Perfil</Label>
      <Input id="nome_perfil" placeholder="Nome do perfil" />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="descricao_perfil">Descrição</Label>
      <Input id="descricao_perfil" placeholder="Breve descrição do perfil" />
    </div>
    
    <div className="space-y-2">
      <Label>Permissões Base</Label>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="perm_visualizar" defaultChecked />
            <Label htmlFor="perm_visualizar">Visualizar</Label>
          </div>
          <div className="text-xs text-muted-foreground">Permitir visualização de conteúdo</div>
        </div>
        
        <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="perm_criar" />
            <Label htmlFor="perm_criar">Criar</Label>
          </div>
          <div className="text-xs text-muted-foreground">Permitir criação de conteúdo</div>
        </div>
        
        <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="perm_editar" />
            <Label htmlFor="perm_editar">Editar</Label>
          </div>
          <div className="text-xs text-muted-foreground">Permitir edição de conteúdo</div>
        </div>
        
        <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="perm_excluir" />
            <Label htmlFor="perm_excluir">Excluir</Label>
          </div>
          <div className="text-xs text-muted-foreground">Permitir exclusão de conteúdo</div>
        </div>
        
        <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="perm_aprovar" />
            <Label htmlFor="perm_aprovar">Aprovar</Label>
          </div>
          <div className="text-xs text-muted-foreground">Permitir aprovação de conteúdo</div>
        </div>
        
        <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="perm_gerenciar_usuarios" />
            <Label htmlFor="perm_gerenciar_usuarios">Gerenciar Usuários</Label>
          </div>
          <div className="text-xs text-muted-foreground">Permitir gerenciamento de usuários</div>
        </div>
      </div>
    </div>
  </div>
);

// Componente principal da página
const GerenciarPermissoes: FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Permissões</h1>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Gestão de Usuários e Permissões</CardTitle>
            <CardDescription>Configure usuários, perfis e permissões de acesso ao sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="usuarios">
              <TabsList className="mb-4">
                <TabsTrigger value="usuarios" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" /> Usuários
                </TabsTrigger>
                <TabsTrigger value="perfis" className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Perfis
                </TabsTrigger>
                <TabsTrigger value="permissoes" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Permissões
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" /> Logs
                </TabsTrigger>
              </TabsList>

              {/* Tab de Usuários */}
              <TabsContent value="usuarios" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuários..."
                      className="pl-8"
                    />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" /> Adicionar Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                        <DialogDescription>
                          Preencha as informações para criar um novo usuário no sistema.
                        </DialogDescription>
                      </DialogHeader>
                      <NovoUsuarioForm />
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline">Cancelar</Button>
                        <Button>Criar Usuário</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <UsersRound className="h-5 w-5 text-primary" />
                    <span className="font-medium">6 usuários cadastrados</span>
                    <span className="text-sm text-muted-foreground">(5 ativos, 1 inativo)</span>
                  </div>
                </div>

                <TabelaUsuarios usuarios={usuariosData} />
              </TabsContent>

              {/* Tab de Perfis */}
              <TabsContent value="perfis" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Perfis do Sistema</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Novo Perfil
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Criar Novo Perfil</DialogTitle>
                        <DialogDescription>
                          Defina as informações e permissões para o novo perfil.
                        </DialogDescription>
                      </DialogHeader>
                      <NovoPerfilForm />
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline">Cancelar</Button>
                        <Button>Criar Perfil</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {perfisData.map((perfil) => (
                    <PerfilCard key={perfil.id} perfil={perfil} />
                  ))}
                </div>
              </TabsContent>

              {/* Tab de Permissões */}
              <TabsContent value="permissoes" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Matriz de Permissões</h3>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Exportar Matriz
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <LockIcon className="h-5 w-5 text-primary" />
                    <span className="font-medium">Níveis de acesso: </span>
                    <div className="flex items-center space-x-2">
                      <NivelAcesso acesso="total" /> <span className="text-sm">Acesso total</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <NivelAcesso acesso="leitura" /> <span className="text-sm">Somente leitura</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <NivelAcesso acesso="negado" /> <span className="text-sm">Acesso negado</span>
                    </div>
                  </div>
                </div>

                <MatrizPermissoes />
              </TabsContent>

              {/* Tab de Logs */}
              <TabsContent value="logs" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Logs de Alterações</h3>
                  <div className="flex space-x-2">
                    <Input type="date" className="w-40" />
                    <Button variant="outline">Filtrar</Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" /> Exportar Logs
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data/Hora</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuário</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ação</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detalhes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {logsData.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.data}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{log.usuario}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.acao}</td>
                          <td className="px-6 py-4 text-sm">{log.detalhes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Atenção</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Alterações nas permissões de usuário e perfis afetam diretamente o acesso ao sistema. 
              É recomendado revisar cuidadosamente todas as modificações. 
              Alterações realizadas serão registradas com seu usuário nos logs de auditoria.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GerenciarPermissoes;
