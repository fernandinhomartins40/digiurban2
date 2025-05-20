
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import CatalogoServicos from "./pages/CatalogoServicos";
import MeusProtocolos from "./pages/MeusProtocolos";
import DocumentosPessoais from "./pages/DocumentosPessoais";
import MinhasAvaliacoes from "./pages/MinhasAvaliacoes";
import Atendimentos from "./pages/gabinete/Atendimentos";
import VisaoGeral from "./pages/gabinete/VisaoGeral";
import MapaDemandas from "./pages/gabinete/MapaDemandas";
import RelatoriosExecutivos from "./pages/gabinete/RelatoriosExecutivos";
import OrdensSetores from "./pages/gabinete/OrdensSetores";
import GerenciarPermissoes from "./pages/gabinete/GerenciarPermissoes";
import CaixaEntrada from "./pages/correio/CaixaEntrada";
import CaixaSaida from "./pages/correio/CaixaSaida";
import NovoEmail from "./pages/correio/NovoEmail";
import Rascunhos from "./pages/correio/Rascunhos";
import Lixeira from "./pages/correio/Lixeira";
import BibliotecaModelos from "./pages/correio/BibliotecaModelos";
import AssinaturasDigitais from "./pages/correio/AssinaturasDigitais";
import GerenciamentoUsuarios from "./pages/administracao/GerenciamentoUsuarios";
import PerfisPermissoes from "./pages/administracao/PerfisPermissoes";
import SetoresGrupos from "./pages/administracao/SetoresGrupos";
import ConfiguracoesGerais from "./pages/administracao/ConfiguracoesGerais";
import AuditoriaAcessos from "./pages/administracao/AuditoriaAcessos";
import Relatorios from "./pages/relatorios/Relatorios";
import IndicadoresAtendimentos from "./pages/relatorios/IndicadoresAtendimentos";
import EstatisticasUso from "./pages/relatorios/EstatisticasUso";
import Exportacoes from "./pages/relatorios/Exportacoes";
import MeuPerfil from "./pages/configuracoes/MeuPerfil";
import TrocarSenha from "./pages/configuracoes/TrocarSenha";
import PreferenciasNotificacao from "./pages/configuracoes/PreferenciasNotificacao";
import IdiomaAcessibilidade from "./pages/configuracoes/IdiomaAcessibilidade";

// Saúde module imports
import AtendimentosSaude from "./pages/saude/Atendimentos";
import AgendamentosMedicos from "./pages/saude/AgendamentosMedicos";
import ControleMedicamentos from "./pages/saude/ControleMedicamentos";
import CampanhasSaude from "./pages/saude/CampanhasSaude";
import ProgramasSaude from "./pages/saude/ProgramasSaude";
import EncaminhamentosTFD from "./pages/saude/EncaminhamentosTFD";
import Exames from "./pages/saude/Exames";
import ACS from "./pages/saude/ACS";
import TransportePacientes from "./pages/saude/TransportePacientes";

// Assistência Social module imports
import AtendimentosAssistencia from "./pages/assistencia-social/Atendimentos";
import FamiliasVulneraveis from "./pages/assistencia-social/FamiliasVulneraveis";
import CRASeCREAS from "./pages/assistencia-social/CRASeCREAS";
import ProgramasSociais from "./pages/assistencia-social/ProgramasSociais";
import GerenciamentoBeneficios from "./pages/assistencia-social/GerenciamentoBeneficios";
import EntregasEmergenciais from "./pages/assistencia-social/EntregasEmergenciais";
import RegistroVisitas from "./pages/assistencia-social/RegistroVisitas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/catalogo-servicos" element={<CatalogoServicos />} />
          <Route path="/meus-protocolos" element={<MeusProtocolos />} />
          <Route path="/documentos-pessoais" element={<DocumentosPessoais />} />
          <Route path="/minhas-avaliacoes" element={<MinhasAvaliacoes />} />
          <Route path="/gabinete/atendimentos" element={<Atendimentos />} />
          <Route path="/gabinete/visao-geral" element={<VisaoGeral />} />
          <Route path="/gabinete/mapa-demandas" element={<MapaDemandas />} />
          <Route path="/gabinete/relatorios-executivos" element={<RelatoriosExecutivos />} />
          <Route path="/gabinete/ordens-setores" element={<OrdensSetores />} />
          <Route path="/gabinete/gerenciar-permissoes" element={<GerenciarPermissoes />} />
          {/* Correio Interno Routes */}
          <Route path="/correio/caixa-entrada" element={<CaixaEntrada />} />
          <Route path="/correio/caixa-saida" element={<CaixaSaida />} />
          <Route path="/correio/novo-email" element={<NovoEmail />} />
          <Route path="/correio/rascunhos" element={<Rascunhos />} />
          <Route path="/correio/lixeira" element={<Lixeira />} />
          <Route path="/correio/biblioteca-modelos" element={<BibliotecaModelos />} />
          <Route path="/correio/assinaturas-digitais" element={<AssinaturasDigitais />} />
          {/* Administração do Sistema Routes */}
          <Route path="/administracao/gerenciamento-usuarios" element={<GerenciamentoUsuarios />} />
          <Route path="/administracao/perfis-permissoes" element={<PerfisPermissoes />} />
          <Route path="/administracao/setores-grupos" element={<SetoresGrupos />} />
          <Route path="/administracao/configuracoes-gerais" element={<ConfiguracoesGerais />} />
          <Route path="/administracao/auditoria-acessos" element={<AuditoriaAcessos />} />
          {/* Relatórios e Indicadores Routes */}
          <Route path="/relatorios/relatorios" element={<Relatorios />} />
          <Route path="/relatorios/indicadores-atendimentos" element={<IndicadoresAtendimentos />} />
          <Route path="/relatorios/estatisticas-uso" element={<EstatisticasUso />} />
          <Route path="/relatorios/exportacoes" element={<Exportacoes />} />
          {/* Configurações do Usuário Routes */}
          <Route path="/configuracoes/meu-perfil" element={<MeuPerfil />} />
          <Route path="/configuracoes/trocar-senha" element={<TrocarSenha />} />
          <Route path="/configuracoes/preferencias-notificacao" element={<PreferenciasNotificacao />} />
          <Route path="/configuracoes/idioma-acessibilidade" element={<IdiomaAcessibilidade />} />
          {/* Módulo de Saúde Routes */}
          <Route path="/saude/atendimentos" element={<AtendimentosSaude />} />
          <Route path="/saude/agendamentos-medicos" element={<AgendamentosMedicos />} />
          <Route path="/saude/controle-medicamentos" element={<ControleMedicamentos />} />
          <Route path="/saude/campanhas-saude" element={<CampanhasSaude />} />
          <Route path="/saude/programas-saude" element={<ProgramasSaude />} />
          <Route path="/saude/encaminhamentos-tfd" element={<EncaminhamentosTFD />} />
          <Route path="/saude/exames" element={<Exames />} />
          <Route path="/saude/acs" element={<ACS />} />
          <Route path="/saude/transporte-pacientes" element={<TransportePacientes />} />
          {/* Módulo de Assistência Social Routes */}
          <Route path="/assistencia-social/atendimentos" element={<AtendimentosAssistencia />} />
          <Route path="/assistencia-social/familias-vulneraveis" element={<FamiliasVulneraveis />} />
          <Route path="/assistencia-social/cras-creas" element={<CRASeCREAS />} />
          <Route path="/assistencia-social/programas-sociais" element={<ProgramasSociais />} />
          <Route path="/assistencia-social/gerenciamento-beneficios" element={<GerenciamentoBeneficios />} />
          <Route path="/assistencia-social/entregas-emergenciais" element={<EntregasEmergenciais />} />
          <Route path="/assistencia-social/registro-visitas" element={<RegistroVisitas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
