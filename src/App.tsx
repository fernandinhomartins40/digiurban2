
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
