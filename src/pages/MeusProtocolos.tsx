
import { CidadaoLayout } from "../components/CidadaoLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FC, useState } from "react";
import { Search, FileText, ChevronDown, ChevronUp, Calendar, Clock, AlertCircle, CheckCircle, Clock3, FilterX } from "lucide-react";

// Dummy data for protocols
const protocols = [
  {
    id: "PROT-2025-0012345",
    title: "Solicitação de Reparo de Iluminação Pública",
    department: "Secretaria de Obras",
    date: "10/05/2025",
    status: "em-andamento",
    lastUpdate: "15/05/2025",
    description: "Solicitação de reparo em poste de iluminação na Rua das Flores, número 123.",
    history: [
      { date: "10/05/2025", time: "09:45", action: "Protocolo criado", user: "Maria Silva" },
      { date: "12/05/2025", time: "14:30", action: "Encaminhado para análise técnica", user: "Setor de Triagem" },
      { date: "15/05/2025", time: "10:15", action: "Em análise pela equipe técnica", user: "Departamento de Iluminação" }
    ]
  },
  {
    id: "PROT-2025-0012344",
    title: "Solicitação de Poda de Árvore",
    department: "Secretaria de Meio Ambiente",
    date: "08/05/2025",
    status: "concluido",
    lastUpdate: "16/05/2025",
    description: "Solicitação de poda de árvore na Avenida Principal, em frente ao número 500.",
    history: [
      { date: "08/05/2025", time: "11:20", action: "Protocolo criado", user: "Maria Silva" },
      { date: "09/05/2025", time: "13:45", action: "Encaminhado para análise técnica", user: "Setor de Triagem" },
      { date: "12/05/2025", time: "09:30", action: "Vistoria agendada", user: "Departamento de Parques e Jardins" },
      { date: "14/05/2025", time: "14:00", action: "Vistoria realizada", user: "Técnico José Santos" },
      { date: "15/05/2025", time: "08:20", action: "Serviço executado", user: "Equipe de Poda" },
      { date: "16/05/2025", time: "11:00", action: "Protocolo concluído", user: "Sistema" }
    ]
  },
  {
    id: "PROT-2025-0012342",
    title: "Segunda Via de IPTU",
    department: "Secretaria de Finanças",
    date: "05/05/2025",
    status: "concluido",
    lastUpdate: "05/05/2025",
    description: "Solicitação de segunda via do boleto de IPTU referente ao imóvel na Rua dos Ipês, 789.",
    history: [
      { date: "05/05/2025", time: "10:05", action: "Protocolo criado", user: "Maria Silva" },
      { date: "05/05/2025", time: "10:06", action: "Segunda via gerada automaticamente", user: "Sistema" },
      { date: "05/05/2025", time: "10:06", action: "Protocolo concluído", user: "Sistema" }
    ]
  },
  {
    id: "PROT-2025-0012341",
    title: "Solicitação de Alvará para Evento",
    department: "Secretaria de Administração",
    date: "03/05/2025",
    status: "aguardando-documentos",
    lastUpdate: "12/05/2025",
    description: "Solicitação de alvará para realização de evento cultural na Praça Central no dia 20/06/2025.",
    history: [
      { date: "03/05/2025", time: "15:30", action: "Protocolo criado", user: "Maria Silva" },
      { date: "07/05/2025", time: "11:45", action: "Análise preliminar", user: "Setor de Eventos" },
      { date: "12/05/2025", time: "09:00", action: "Solicitação de documentos complementares", user: "Fiscal João Pereira" }
    ]
  },
  {
    id: "PROT-2025-0012340",
    title: "Reclamação sobre Barulho Excessivo",
    department: "Secretaria de Segurança",
    date: "01/05/2025",
    status: "em-andamento",
    lastUpdate: "14/05/2025",
    description: "Reclamação sobre barulho excessivo em estabelecimento comercial na Rua das Palmeiras, 456.",
    history: [
      { date: "01/05/2025", time: "20:15", action: "Protocolo criado", user: "Maria Silva" },
      { date: "03/05/2025", time: "09:30", action: "Encaminhado para Fiscalização", user: "Setor de Triagem" },
      { date: "10/05/2025", time: "14:00", action: "Vistoria agendada", user: "Equipe de Fiscalização" },
      { date: "14/05/2025", time: "19:30", action: "Vistoria realizada", user: "Fiscal Pedro Mendes" }
    ]
  }
];

const MeusProtocolos: FC = () => {
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);
  
  const toggleProtocol = (id: string) => {
    setExpandedProtocol(expandedProtocol === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em-andamento":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Em andamento</Badge>;
      case "concluido":
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      case "aguardando-documentos":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Aguardando documentos</Badge>;
      case "cancelado":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
      default:
        return <Badge>Indefinido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "em-andamento":
        return <Clock3 className="h-5 w-5 text-blue-500" />;
      case "concluido":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "aguardando-documentos":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "cancelado":
        return <FilterX className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <CidadaoLayout>
      <div className="h-full flex flex-col p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Meus Protocolos</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Acompanhe o andamento de suas solicitações
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Input placeholder="Pesquisar protocolos..." className="pl-10" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="em-andamento">Em andamento</TabsTrigger>
            <TabsTrigger value="concluido">Concluídos</TabsTrigger>
            <TabsTrigger value="aguardando-documentos">Aguardando</TabsTrigger>
          </TabsList>
          
          {["todos", "em-andamento", "concluido", "aguardando-documentos"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0 space-y-4">
              {protocols
                .filter(protocol => tab === "todos" || protocol.status === tab)
                .map((protocol) => (
                  <Card key={protocol.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleProtocol(protocol.id)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getStatusIcon(protocol.status)}
                          <div>
                            <CardTitle className="text-lg">{protocol.title}</CardTitle>
                            <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <FileText className="h-3.5 w-3.5 mr-1" /> {protocol.id}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" /> {protocol.date}
                              </span>
                              <span>{protocol.department}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {getStatusBadge(protocol.status)}
                          {expandedProtocol === protocol.id ? 
                            <ChevronUp className="h-5 w-5" /> : 
                            <ChevronDown className="h-5 w-5" />
                          }
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedProtocol === protocol.id && (
                      <CardContent className="pt-4">
                        <div className="border-t pt-4 mt-2">
                          <h4 className="font-medium mb-2">Descrição</h4>
                          <p className="text-gray-700 dark:text-gray-300">{protocol.description}</p>
                          
                          <h4 className="font-medium mt-4 mb-2">Histórico</h4>
                          <div className="space-y-3">
                            {protocol.history.map((item, index) => (
                              <div 
                                key={index} 
                                className="flex items-start p-3 rounded-md bg-gray-50 dark:bg-gray-800/50"
                              >
                                <div className="mr-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{item.action}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.date} às {item.time} - {item.user}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" className="mr-2">
                              Imprimir
                            </Button>
                            {protocol.status === "aguardando-documentos" && (
                              <Button>
                                Anexar Documentos
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
                
                {protocols.filter(protocol => tab === "todos" || protocol.status === tab).length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">Nenhum protocolo encontrado</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Você não possui protocolos {tab !== "todos" ? "com este status" : "registrados"}.
                    </p>
                  </div>
                )}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 flex justify-center">
          <Button className="px-6">
            <FileText className="mr-2 h-4 w-4" />
            Novo Protocolo
          </Button>
        </div>
      </div>
    </CidadaoLayout>
  );
};

export default MeusProtocolos;
