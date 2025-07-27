import { CidadaoLayout } from "../../../components/CidadaoLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, MessageSquare, User, Star, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { protocolService } from "../../../lib/protocols";

const CidadaoDashboard = () => {
  const [estatisticas, setEstatisticas] = useState({
    abertos: 0,
    em_andamento: 0,
    concluidos: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        const stats = await protocolService.getEstatisticasUsuario();
        setEstatisticas(stats);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarEstatisticas();
  }, []);

  return (
    <CidadaoLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portal do Cidadão</h1>
          <p className="text-muted-foreground">
            Acesse os serviços municipais de forma rápida e prática
          </p>
        </div>

        {/* Cards de Acesso Rápido */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catálogo de Serviços</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Explore todos os serviços disponíveis
              </p>
              <Button asChild className="w-full">
                <Link to="/cidadao/catalogo-servicos">Acessar Catálogo</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meus Protocolos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Acompanhe suas solicitações
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/cidadao/meus-protocolos">Ver Protocolos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Acesse seus documentos pessoais
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/cidadao/documentos-pessoais">Meus Documentos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Avalie os serviços utilizados
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/cidadao/minhas-avaliacoes">Minhas Avaliações</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resumo de Protocolos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protocolos Abertos</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {loading ? '...' : estatisticas.abertos}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando atendimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? '...' : estatisticas.em_andamento}
              </div>
              <p className="text-xs text-muted-foreground">
                Sendo processados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protocolos Resolvidos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? '...' : estatisticas.concluidos}
              </div>
              <p className="text-xs text-muted-foreground">
                Finalizados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Serviços Mais Utilizados */}
        <Card>
          <CardHeader>
            <CardTitle>Serviços Mais Utilizados</CardTitle>
            <CardDescription>
              Acesse rapidamente os serviços que você mais usa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Consulta de IPTU</div>
                  <div className="text-sm text-muted-foreground">Verifique débitos e 2ª via</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Agendamento Médico</div>
                  <div className="text-sm text-muted-foreground">Marque consultas</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Solicitação de Documentos</div>
                  <div className="text-sm text-muted-foreground">Certidões e declarações</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Avisos e Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Avisos Importantes</CardTitle>
            <CardDescription>
              Fique por dentro das novidades da cidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">Nova funcionalidade disponível</div>
                  <div className="text-sm text-blue-700">
                    Agora você pode acompanhar seus protocolos em tempo real pelo aplicativo.
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900">Manutenção programada concluída</div>
                  <div className="text-sm text-green-700">
                    Os sistemas estão funcionando normalmente após a manutenção de ontem.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CidadaoLayout>
  );
};

export default CidadaoDashboard;