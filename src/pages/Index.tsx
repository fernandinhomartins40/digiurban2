
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickAccessMenu } from "@/components/ui/quick-access-menu";
import { MessageSquare, FileText, Users, BarChart3, Calendar, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Bem-vindo ao Portal Municipal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Acesse todos os serviços municipais em um só lugar
            </p>
          </div>
          <QuickAccessMenu />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens Não Lidas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                <Link to="/chat" className="text-blue-600 hover:underline">
                  Ver no chat
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protocolos Ativos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                +5 desde ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação a ontem
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/chat">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-3 h-6 w-6 text-blue-600" />
                  Chat Municipal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Converse em tempo real com diferentes departamentos e obtenha suporte imediato.
                </p>
                <Button className="mt-4 w-full">Acessar Chat</Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/catalogo-servicos">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-green-600" />
                  Catálogo de Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Encontre e solicite todos os serviços oferecidos pela prefeitura.
                </p>
                <Button className="mt-4 w-full" variant="outline">Ver Serviços</Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/meus-protocolos">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-3 h-6 w-6 text-orange-600" />
                  Meus Protocolos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Acompanhe o status dos seus protocolos e solicitações.
                </p>
                <Button className="mt-4 w-full" variant="outline">Ver Protocolos</Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-3 h-6 w-6" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">Nova mensagem no chat</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Secretaria de Saúde respondeu sua pergunta</p>
                  </div>
                </div>
                <Link to="/chat">
                  <Button size="sm">Ver</Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Protocolo atualizado</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Protocolo #2024001 foi aprovado</p>
                  </div>
                </div>
                <Link to="/meus-protocolos">
                  <Button size="sm" variant="outline">Ver</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
