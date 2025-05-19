
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
