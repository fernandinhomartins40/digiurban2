import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';

// Landing Page
import LandingPage from './pages/LandingPage';

// Portal Apps
import AdminApp from './components/AdminApp';
import CidadaoApp from './components/CidadaoApp';

// Shared pages
import NotFound from './pages/NotFound';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            
            {/* Portal Administrativo */}
            <Route path="/admin/*" element={<AdminApp />} />
            
            {/* Portal do Cidadão */}
            <Route path="/cidadao/*" element={<CidadaoApp />} />
            
            {/* Páginas públicas */}
            <Route path="/transparencia" element={<div>Transparência - Em desenvolvimento</div>} />
            <Route path="/sobre" element={<div>Sobre a Cidade - Em desenvolvimento</div>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
