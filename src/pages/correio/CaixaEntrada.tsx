
import { FC } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Inbox, Search, Star, MoreVertical, Trash2, Ban, Archive, Flag, Tag } from "lucide-react";

interface EmailMessage {
  id: string;
  read: boolean;
  starred: boolean;
  from: string;
  subject: string;
  excerpt: string;
  date: string;
  hasAttachment: boolean;
  category?: string;
}

const mockEmails: EmailMessage[] = [
  {
    id: "1",
    read: false,
    starred: true,
    from: "Secretaria de Saúde",
    subject: "Relatório Mensal de Atendimentos",
    excerpt: "Segue anexo o relatório mensal de atendimentos do posto central conforme solicitado...",
    date: "Hoje, 10:45",
    hasAttachment: true,
    category: "primary"
  },
  {
    id: "2",
    read: true,
    starred: false,
    from: "Departamento Financeiro",
    subject: "Aprovação de Verbas - Projeto Cidade Limpa",
    excerpt: "Prezado, informamos que a solicitação de verba para o projeto cidade limpa foi aprovada...",
    date: "Ontem, 16:32",
    hasAttachment: false,
    category: "primary"
  },
  {
    id: "3",
    read: false,
    starred: false,
    from: "Secretaria de Educação",
    subject: "Calendário Escolar 2025",
    excerpt: "Solicitamos a aprovação do calendário escolar para o ano letivo 2025 conforme documento...",
    date: "12/05, 08:15",
    hasAttachment: true,
    category: "updates"
  },
  {
    id: "4",
    read: true,
    starred: true,
    from: "Gabinete Vice-Prefeito",
    subject: "Agenda de Reuniões - Próxima Semana",
    excerpt: "Segue a agenda de compromissos e reuniões para a próxima semana conforme decidido...",
    date: "10/05, 17:20",
    hasAttachment: false,
    category: "primary"
  },
  {
    id: "5",
    read: true,
    starred: false,
    from: "Recursos Humanos",
    subject: "Novas Contratações - Processo Seletivo",
    excerpt: "Encaminhamos a lista de aprovados no último processo seletivo para as vagas...",
    date: "09/05, 11:05",
    hasAttachment: true,
    category: "updates"
  }
];

const CaixaEntrada: FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Caixa de Entrada</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm py-1 px-3">
              128 não lidos
            </Badge>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-full">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Mensagens</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Pesquisar emails..." className="pl-8" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          <span>Arquivar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          <span>Marcar como importante</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Tag className="mr-2 h-4 w-4" />
                          <span>Categorizar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Ban className="mr-2 h-4 w-4" />
                          <span>Marcar como spam</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription>Gerencie suas mensagens recebidas</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="primary" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="primary" className="relative">
                      Principal
                      <Badge className="ml-2 bg-blue-500 text-white" variant="secondary">3</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="updates">
                      Atualizações
                      <Badge className="ml-2 bg-green-500 text-white" variant="secondary">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="forum">
                      Fóruns
                    </TabsTrigger>
                    <TabsTrigger value="promotions">
                      Promoções
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="primary">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Remetente</TableHead>
                          <TableHead>Assunto</TableHead>
                          <TableHead className="text-right">Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockEmails
                          .filter(email => email.category === "primary")
                          .map((email) => (
                          <TableRow key={email.id} className={email.read ? "" : "font-semibold bg-gray-50"}>
                            <TableCell className="p-2">
                              <Checkbox />
                            </TableCell>
                            <TableCell className="p-2">
                              <Button variant="ghost" size="icon">
                                <Star 
                                  className={`h-4 w-4 ${email.starred ? "fill-yellow-400 text-yellow-400" : ""}`} 
                                />
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium">{email.from}</TableCell>
                            <TableCell>
                              <div>
                                <span className="block">{email.subject}</span>
                                <span className="block text-sm text-gray-500 truncate max-w-md">
                                  {email.excerpt}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{email.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="updates">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Remetente</TableHead>
                          <TableHead>Assunto</TableHead>
                          <TableHead className="text-right">Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockEmails
                          .filter(email => email.category === "updates")
                          .map((email) => (
                          <TableRow key={email.id} className={email.read ? "" : "font-semibold bg-gray-50"}>
                            <TableCell className="p-2">
                              <Checkbox />
                            </TableCell>
                            <TableCell className="p-2">
                              <Button variant="ghost" size="icon">
                                <Star 
                                  className={`h-4 w-4 ${email.starred ? "fill-yellow-400 text-yellow-400" : ""}`} 
                                />
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium">{email.from}</TableCell>
                            <TableCell>
                              <div>
                                <span className="block">{email.subject}</span>
                                <span className="block text-sm text-gray-500 truncate max-w-md">
                                  {email.excerpt}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{email.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="forum">
                    <div className="py-10 text-center text-gray-500">
                      <Inbox className="mx-auto h-12 w-12 opacity-30" />
                      <p className="mt-2 text-lg">Nenhuma mensagem nesta categoria</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="promotions">
                    <div className="py-10 text-center text-gray-500">
                      <Inbox className="mx-auto h-12 w-12 opacity-30" />
                      <p className="mt-2 text-lg">Nenhuma mensagem nesta categoria</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaixaEntrada;
