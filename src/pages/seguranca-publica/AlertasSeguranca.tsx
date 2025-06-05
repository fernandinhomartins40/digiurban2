
import { FC, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Plus,
  Search,
  Bell,
  Clock,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { AlertaSeguranca } from "@/types/seguranca-publica";

const mockAlertas: AlertaSeguranca[] = [
  {
    id: "1",
    tipo: "emergencia",
    nivel: "critico",
    titulo: "Situação de Risco na Escola Municipal",
    descricao: "Ameaça de bomba reportada na Escola Municipal Centro. Evacuação em andamento.",
    local: "Escola Municipal Centro",
    coordenadas: { lat: -23.5505, lng: -46.6333 },
    dataInicio: "2024-01-15T14:00:00",
    dataFim: undefined,
    status: "ativo",
    canais: ["sms", "email", "app", "sirene"],
    populacaoAlvo: ["Pais de alunos", "Funcionários", "Comunidade local"],
    responsavel: "Comandante Silva",
    instrucoesSeguranca: [
      "Mantenha-se afastado da área",
      "Aguarde orientações oficiais",
      "Não espalhe rumores"
    ],
    contatosEmergencia: [
      { nome: "Comandante Silva", telefone: "(11) 99999-9999", funcao: "Coordenador" },
      { nome: "Bombeiros", telefone: "193", funcao: "Emergência" }
    ],
    dataCriacao: "2024-01-15T14:00:00"
  },
  {
    id: "2",
    tipo: "preventivo",
    nivel: "medio",
    titulo: "Evento na Praça Central - Reforço de Segurança",
    descricao: "Durante o evento cultural na Praça Central, haverá reforço da segurança.",
    local: "Praça Central",
    dataInicio: "2024-01-20T18:00:00",
    dataFim: "2024-01-20T22:00:00",
    status: "ativo",
    canais: ["email", "app"],
    populacaoAlvo: ["Participantes do evento", "Comerciantes locais"],
    responsavel: "Sgt. Santos",
    instrucoesSeguranca: [
      "Evite aglomerações desnecessárias",
      "Mantenha pertences pessoais seguros",
      "Procure a Guarda Municipal em caso de necessidade"
    ],
    dataCriacao: "2024-01-18T10:00:00"
  }
];

const AlertasSeguranca: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [nivelFilter, setNivelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaSeguranca | null>(null);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "emergencia": return "bg-red-500 text-white";
      case "atencao": return "bg-orange-500 text-white";
      case "informativo": return "bg-blue-500 text-white";
      case "preventivo": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "critico": return "bg-red-600 text-white";
      case "alto": return "bg-orange-600 text-white";
      case "medio": return "bg-yellow-600 text-white";
      case "baixo": return "bg-green-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels: { [key: string]: string } = {
      emergencia: "Emergência",
      atencao: "Atenção",
      informativo: "Informativo",
      preventivo: "Preventivo"
    };
    return labels[tipo] || tipo;
  };

  const getNivelLabel = (nivel: string) => {
    const labels: { [key: string]: string } = {
      critico: "Crítico",
      alto: "Alto",
      medio: "Médio",
      baixo: "Baixo"
    };
    return labels[nivel] || nivel;
  };

  const filteredAlertas = mockAlertas.filter(alerta => {
    const matchesSearch = searchTerm === "" || 
      alerta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alerta.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === "" || alerta.tipo === tipoFilter;
    const matchesNivel = nivelFilter === "" || alerta.nivel === nivelFilter;
    const matchesStatus = statusFilter === "" || alerta.status === statusFilter;
    
    return matchesSearch && matchesTipo && matchesNivel && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <AlertTriangle className="mr-3 h-8 w-8 text-orange-600" />
              Alertas de Segurança
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie alertas e comunicações de segurança pública
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo Alerta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Alerta</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Alerta</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergencia">Emergência</SelectItem>
                      <SelectItem value="atencao">Atenção</SelectItem>
                      <SelectItem value="informativo">Informativo</SelectItem>
                      <SelectItem value="preventivo">Preventivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nivel">Nível</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixo">Baixo</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="critico">Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="titulo">Título do Alerta</Label>
                  <Input id="titulo" placeholder="Título claro e objetivo" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <textarea
                    id="descricao"
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Descreva a situação detalhadamente..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local">Local (opcional)</Label>
                  <Input id="local" placeholder="Local específico" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input id="responsavel" placeholder="Nome do responsável" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-orange-600 hover:bg-orange-700">Criar Alerta</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Críticos</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Resolvidos</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">35</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar alertas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="emergencia">Emergência</SelectItem>
                  <SelectItem value="atencao">Atenção</SelectItem>
                  <SelectItem value="informativo">Informativo</SelectItem>
                  <SelectItem value="preventivo">Preventivo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={nivelFilter} onValueChange={setNivelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os níveis</SelectItem>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                Enviar Alerta
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedAlerta(alerta)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{alerta.titulo}</h3>
                        <Badge className={getTipoColor(alerta.tipo)}>
                          {getTipoLabel(alerta.tipo)}
                        </Badge>
                        <Badge className={getNivelColor(alerta.nivel)}>
                          {getNivelLabel(alerta.nivel)}
                        </Badge>
                        <Badge 
                          className={alerta.status === 'ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {alerta.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alerta.descricao}</p>
                      {alerta.local && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {alerta.local}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          <Clock className="inline h-3 w-3 mr-1" />
                          {new Date(alerta.dataInicio).toLocaleString()}
                        </span>
                        <span>Responsável: {alerta.responsavel}</span>
                        <span>Canais: {alerta.canais.length}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedAlerta && (
          <Dialog open={!!selectedAlerta} onOpenChange={() => setSelectedAlerta(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Detalhes do Alerta - {selectedAlerta.titulo}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Tipo e Nível</Label>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getTipoColor(selectedAlerta.tipo)}>
                        {getTipoLabel(selectedAlerta.tipo)}
                      </Badge>
                      <Badge className={getNivelColor(selectedAlerta.nivel)}>
                        {getNivelLabel(selectedAlerta.nivel)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedAlerta.descricao}</p>
                  </div>
                  {selectedAlerta.local && (
                    <div>
                      <Label>Local</Label>
                      <p className="text-sm">{selectedAlerta.local}</p>
                    </div>
                  )}
                  <div>
                    <Label>Período</Label>
                    <p className="text-sm">
                      Início: {new Date(selectedAlerta.dataInicio).toLocaleString()}
                    </p>
                    {selectedAlerta.dataFim && (
                      <p className="text-sm">
                        Fim: {new Date(selectedAlerta.dataFim).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Canais de Comunicação</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedAlerta.canais.map((canal, index) => (
                        <Badge key={index} variant="outline">{canal.toUpperCase()}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>População Alvo</Label>
                    <ul className="text-sm bg-gray-50 p-3 rounded">
                      {selectedAlerta.populacaoAlvo.map((grupo, index) => (
                        <li key={index}>• {grupo}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedAlerta.instrucoesSeguranca && (
                    <div>
                      <Label>Instruções de Segurança</Label>
                      <ul className="text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
                        {selectedAlerta.instrucoesSeguranca.map((instrucao, index) => (
                          <li key={index}>• {instrucao}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedAlerta.contatosEmergencia && (
                    <div>
                      <Label>Contatos de Emergência</Label>
                      <div className="text-sm bg-red-50 p-3 rounded border border-red-200">
                        {selectedAlerta.contatosEmergencia.map((contato, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{contato.nome} ({contato.funcao})</span>
                            <span className="font-medium">{contato.telefone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <Label>Responsável</Label>
                    <p className="text-sm">{selectedAlerta.responsavel}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setSelectedAlerta(null)}>
                  Fechar
                </Button>
                {selectedAlerta.status === 'ativo' && (
                  <Button className="bg-red-600 hover:bg-red-700">
                    Resolver Alerta
                  </Button>
                )}
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Editar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default AlertasSeguranca;
