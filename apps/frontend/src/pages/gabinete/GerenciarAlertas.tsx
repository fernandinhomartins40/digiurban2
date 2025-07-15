
import { FC, useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  Users, 
  Eye,
  MessageSquare,
  AlertTriangle,
  Info,
  Shield
} from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { CitizenAlert, AlertFilters } from "@/types/alerts";

const AlertTypeIcon: FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'urgent': return <Shield className="h-4 w-4 text-orange-500" />;
    case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    default: return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const PriorityBadge: FC<{ priority: number }> = ({ priority }) => {
  const colors = {
    1: 'bg-gray-100 text-gray-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-orange-100 text-orange-800',
    4: 'bg-red-100 text-red-800'
  };
  
  const labels = {
    1: 'Baixa',
    2: 'Média', 
    3: 'Alta',
    4: 'Crítica'
  };
  
  return (
    <Badge className={colors[priority as keyof typeof colors] || colors[1]}>
      {labels[priority as keyof typeof labels] || 'Baixa'}
    </Badge>
  );
};

const AlertCard: FC<{ alert: CitizenAlert; onClick: () => void }> = ({ alert, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const deliveryRate = alert.delivery_stats?.total_recipients 
    ? ((alert.delivery_stats.read_count / alert.delivery_stats.total_recipients) * 100).toFixed(1)
    : 0;

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTypeIcon type={alert.alert_type} />
            <h3 className="font-medium text-sm">{alert.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={alert.priority} />
            {alert.category && (
              <Badge 
                variant="outline" 
                style={{ borderColor: alert.category.color, color: alert.category.color }}
              >
                {alert.category.name}
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {alert.message}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {alert.delivery_stats?.total_recipients || 0} destinatários
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {alert.delivery_stats?.read_count || 0} lidas ({deliveryRate}%)
            </span>
          </div>
          <span>{formatDate(alert.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const GerenciarAlertas: FC = () => {
  const { alerts, categories, isLoading, error, fetchAlerts, fetchStatistics } = useAlerts();
  const [filters, setFilters] = useState<AlertFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statistics, setStatistics] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchAlerts(filters);
    fetchStatistics().then(setStatistics);
  }, [fetchAlerts, fetchStatistics, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  return (
    <Layout>
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Gerenciar Alertas e Mensagens</h1>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Alerta
          </Button>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Alertas</p>
                    <p className="text-2xl font-bold text-blue-600">{statistics.total_alerts}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Alertas Ativos</p>
                    <p className="text-2xl font-bold text-green-600">{statistics.active_alerts}</p>
                  </div>
                  <Bell className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Enviados</p>
                    <p className="text-2xl font-bold text-purple-600">{statistics.total_recipients}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Leitura</p>
                    <p className="text-2xl font-bold text-orange-600">{statistics.read_rate}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch}>
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar alertas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" size="icon" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Filter options would go here */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Tipo de Alerta</h4>
                {['info', 'warning', 'urgent', 'emergency'].map(type => (
                  <label key={type} className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, alert_type: type }));
                        } else {
                          setFilters(prev => ({ ...prev, alert_type: undefined }));
                        }
                      }}
                    />
                    <AlertTypeIcon type={type} />
                    {type === 'info' ? 'Informação' : 
                     type === 'warning' ? 'Aviso' :
                     type === 'urgent' ? 'Urgente' : 'Emergência'}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Alertas Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {isLoading && <p className="text-center py-4">Carregando...</p>}
                {error && <p className="text-center py-4 text-red-500">{error}</p>}
                {alerts.length === 0 && !isLoading && (
                  <p className="text-center py-4 text-gray-500">Nenhum alerta encontrado</p>
                )}
                {alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onClick={() => {
                      // TODO: Open alert details modal
                      console.log('Open alert details:', alert.id);
                    }}
                  />
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default GerenciarAlertas;
