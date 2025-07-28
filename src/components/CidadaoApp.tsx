import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Páginas do cidadão (transferidas do dashboard principal)
import CatalogoServicos from '../pages/CatalogoServicos';
import SolicitarServico from '../pages/SolicitarServico';
import MeusProtocolos from '../pages/MeusProtocolos';
import DocumentosPessoais from '../pages/DocumentosPessoais';
import MinhasAvaliacoes from '../pages/MinhasAvaliacoes';

// Auth pages do cidadão
import RegisterCitizen from '../pages/auth/RegisterCitizen';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

// Dashboard do cidadão
import CidadaoDashboard from '../pages/cidadao/dashboard/CidadaoDashboard';

// Auth pages do cidadão
import CidadaoLogin from '../pages/cidadao/auth/CidadaoLogin';

// Configurações
import MeuPerfil from '../pages/configuracoes/MeuPerfil';
import TrocarSenha from '../pages/configuracoes/TrocarSenha';
import PreferenciasNotificacao from '../pages/configuracoes/PreferenciasNotificacao';
import IdiomaAcessibilidade from '../pages/configuracoes/IdiomaAcessibilidade';

function CidadaoApp() {
  return (
    <Routes>
      {/* Authentication routes */}
      <Route path="/login" element={<CidadaoLogin />} />
      <Route path="/auth/login" element={<CidadaoLogin />} />
      <Route path="/register" element={<RegisterCitizen />} />
      <Route path="/auth/register" element={<RegisterCitizen />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Cidadão dashboard */}
      <Route path="/" element={
        <ProtectedRoute>
          <CidadaoDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <CidadaoDashboard />
        </ProtectedRoute>
      } />


      {/* Serviços do cidadão */}
      <Route path="/servicos" element={
        <ProtectedRoute>
          <CatalogoServicos />
        </ProtectedRoute>
      } />
      <Route path="/catalogo-servicos" element={
        <ProtectedRoute>
          <CatalogoServicos />
        </ProtectedRoute>
      } />

      <Route path="/solicitar-servico" element={
        <ProtectedRoute>
          <SolicitarServico />
        </ProtectedRoute>
      } />
      
      <Route path="/protocolos" element={
        <ProtectedRoute>
          <MeusProtocolos />
        </ProtectedRoute>
      } />
      <Route path="/meus-protocolos" element={
        <ProtectedRoute>
          <MeusProtocolos />
        </ProtectedRoute>
      } />
      
      <Route path="/documentos" element={
        <ProtectedRoute>
          <DocumentosPessoais />
        </ProtectedRoute>
      } />
      <Route path="/documentos-pessoais" element={
        <ProtectedRoute>
          <DocumentosPessoais />
        </ProtectedRoute>
      } />
      
      <Route path="/avaliacoes" element={
        <ProtectedRoute>
          <MinhasAvaliacoes />
        </ProtectedRoute>
      } />
      <Route path="/minhas-avaliacoes" element={
        <ProtectedRoute>
          <MinhasAvaliacoes />
        </ProtectedRoute>
      } />

      {/* Configurações */}
      <Route path="/configuracoes/meu-perfil" element={
        <ProtectedRoute>
          <MeuPerfil />
        </ProtectedRoute>
      } />
      <Route path="/configuracoes/trocar-senha" element={
        <ProtectedRoute>
          <TrocarSenha />
        </ProtectedRoute>
      } />
      <Route path="/configuracoes/preferencias-notificacao" element={
        <ProtectedRoute>
          <PreferenciasNotificacao />
        </ProtectedRoute>
      } />
      <Route path="/configuracoes/idioma-acessibilidade" element={
        <ProtectedRoute>
          <IdiomaAcessibilidade />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default CidadaoApp;