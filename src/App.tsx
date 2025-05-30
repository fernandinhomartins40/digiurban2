import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Import all pages
import Index from './pages/Index';
import Chat from './pages/Chat';
import CatalogoServicos from './pages/CatalogoServicos';
import MeusProtocolos from './pages/MeusProtocolos';
import DocumentosPessoais from './pages/DocumentosPessoais';
import MinhasAvaliacoes from './pages/MinhasAvaliacoes';

// Gabinete
import GabineteAtendimentos from './pages/gabinete/Atendimentos';
import GabineteVisaoGeral from './pages/gabinete/VisaoGeral';
import GabineteMapaDemandas from './pages/gabinete/MapaDemandas';
import GabineteRelatoriosExecutivos from './pages/gabinete/RelatoriosExecutivos';
import GabineteOrdensSetores from './pages/gabinete/OrdensSetores';
import GabineteGerenciarPermissoes from './pages/gabinete/GerenciarPermissoes';

// Correio
import CorreioCaixaEntrada from './pages/correio/CaixaEntrada';
import CorreioCaixaSaida from './pages/correio/CaixaSaida';
import CorreioNovoEmail from './pages/correio/NovoEmail';
import CorreioRascunhos from './pages/correio/Rascunhos';
import CorreioLixeira from './pages/correio/Lixeira';
import CorreioBibliotecaModelos from './pages/correio/BibliotecaModelos';
import CorreioAssinaturasDigitais from './pages/correio/AssinaturasDigitais';

// Administração
import AdministracaoGerenciamentoUsuarios from './pages/administracao/GerenciamentoUsuarios';
import AdministracaoPerfisPermissoes from './pages/administracao/PerfisPermissoes';
import AdministracaoSetoresGrupos from './pages/administracao/SetoresGrupos';
import AdministracaoConfiguracoesGerais from './pages/administracao/ConfiguracoesGerais';
import AdministracaoAuditoriaAcessos from './pages/administracao/AuditoriaAcessos';

// Relatórios
import RelatoriosRelatorios from './pages/relatorios/Relatorios';
import RelatoriosIndicadoresAtendimentos from './pages/relatorios/IndicadoresAtendimentos';
import RelatoriosEstatisticasUso from './pages/relatorios/EstatisticasUso';
import RelatoriosExportacoes from './pages/relatorios/Exportacoes';

// Configurações
import ConfiguracoesMeuPerfil from './pages/configuracoes/MeuPerfil';
import ConfiguracoesTrocarSenha from './pages/configuracoes/TrocarSenha';
import ConfiguracoesPreferenciasNotificacao from './pages/configuracoes/PreferenciasNotificacao';
import ConfiguracoesIdiomaAcessibilidade from './pages/configuracoes/IdiomaAcessibilidade';

// Saúde
import SaudeAtendimentos from './pages/saude/Atendimentos';
import SaudeAgendamentosMedicos from './pages/saude/AgendamentosMedicos';
import SaudeControleMedicamentos from './pages/saude/ControleMedicamentos';
import SaudeCampanhasSaude from './pages/saude/CampanhasSaude';
import SaudeProgramasSaude from './pages/saude/ProgramasSaude';
import SaudeEncaminhamentosTFD from './pages/saude/EncaminhamentosTFD';
import SaudeExames from './pages/saude/Exames';
import SaudeACS from './pages/saude/ACS';
import SaudeTransportePacientes from './pages/saude/TransportePacientes';

// Educação
import EducacaoMatriculaAlunos from './pages/educacao/MatriculaAlunos';
import EducacaoGestaoEscolar from './pages/educacao/GestaoEscolar';
import EducacaoTransporteEscolar from './pages/educacao/TransporteEscolar';
import EducacaoMerendaEscolar from './pages/educacao/MerendaEscolar';
import EducacaoRegistroOcorrencias from './pages/educacao/RegistroOcorrencias';
import EducacaoCalendarioEscolar from './pages/educacao/CalendarioEscolar';

// Assistência Social
import AssistenciaSocialAtendimentos from './pages/assistencia-social/Atendimentos';
import AssistenciaSocialFamiliasVulneraveis from './pages/assistencia-social/FamiliasVulneraveis';
import AssistenciaSocialCrasECreas from './pages/assistencia-social/CrasECreas';
import AssistenciaSocialProgramasSociais from './pages/assistencia-social/ProgramasSociais';
import AssistenciaSocialGerenciamentoBeneficios from './pages/assistencia-social/GerenciamentoBeneficios';
import AssistenciaSocialEntregasEmergenciais from './pages/assistencia-social/EntregasEmergenciais';
import AssistenciaSocialRegistroVisitas from './pages/assistencia-social/RegistroVisitas';

// Cultura
import CulturaEspacosCulturais from './pages/cultura/EspacosCulturais';
import CulturaProjetosCulturais from './pages/cultura/ProjetosCulturais';
import CulturaEventos from './pages/cultura/Eventos';
import CulturaGruposArtisticos from './pages/cultura/GruposArtisticos';
import CulturaManifestacoesCulturais from './pages/cultura/ManifestacoesCulturais';
import CulturaOficinasCursos from './pages/cultura/OficinasCursos';

// Agricultura
import AgriculturaAtendimentos from './pages/agricultura/Atendimentos';
import AgriculturaCadastroProdutores from './pages/agricultura/CadastroProdutores';
import AgriculturaAssistenciaTecnica from './pages/agricultura/AssistenciaTecnica';
import AgriculturaProgramasRurais from './pages/agricultura/ProgramasRurais';
import AgriculturaCursosCapacitacoes from './pages/agricultura/CursosCapacitacoes';

// Esportes
import EsportesAtendimentos from './pages/esportes/Atendimentos';
import EsportesEquipesEsportivas from './pages/esportes/EquipesEsportivas';
import EsportesCompeticoesTorneios from './pages/esportes/CompeticoesTorneios';
import EsportesAtletasFederados from './pages/esportes/AtletasFederados';
import EsportesEscolinhasEsportivas from './pages/esportes/EscolinhasEsportivas';
import EsportesEventosEsportivos from './pages/esportes/EventosEsportivos';
import EsportesInfraestruturaEsportiva from './pages/esportes/InfraestruturaEsportiva';

// Turismo
import TurismoAtendimentos from './pages/turismo/Atendimentos';
import TurismoPontosTuristicos from './pages/turismo/PontosTuristicos';
import TurismoEstabelecimentosLocais from './pages/turismo/EstabelecimentosLocais';
import TurismoProgramasTuristicos from './pages/turismo/ProgramasTuristicos';
import TurismoMapaTuristico from './pages/turismo/MapaTuristico';
import TurismoInformacoesTuristicas from './pages/turismo/InformacoesTuristicas';

import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/catalogo-servicos" element={<CatalogoServicos />} />
          <Route path="/meus-protocolos" element={<MeusProtocolos />} />
          <Route path="/documentos-pessoais" element={<DocumentosPessoais />} />
          <Route path="/minhas-avaliacoes" element={<MinhasAvaliacoes />} />

          {/* Gabinete */}
          <Route path="/gabinete/atendimentos" element={<GabineteAtendimentos />} />
          <Route path="/gabinete/visao-geral" element={<GabineteVisaoGeral />} />
          <Route path="/gabinete/mapa-demandas" element={<GabineteMapaDemandas />} />
          <Route path="/gabinete/relatorios-executivos" element={<GabineteRelatoriosExecutivos />} />
          <Route path="/gabinete/ordens-setores" element={<GabineteOrdensSetores />} />
          <Route path="/gabinete/gerenciar-permissoes" element={<GabineteGerenciarPermissoes />} />

          {/* Correio */}
          <Route path="/correio/caixa-entrada" element={<CorreioCaixaEntrada />} />
          <Route path="/correio/caixa-saida" element={<CorreioCaixaSaida />} />
          <Route path="/correio/novo-email" element={<CorreioNovoEmail />} />
          <Route path="/correio/rascunhos" element={<CorreioRascunhos />} />
          <Route path="/correio/lixeira" element={<CorreioLixeira />} />
          <Route path="/correio/biblioteca-modelos" element={<CorreioBibliotecaModelos />} />
          <Route path="/correio/assinaturas-digitais" element={<CorreioAssinaturasDigitais />} />

          {/* Administração */}
          <Route path="/administracao/gerenciamento-usuarios" element={<AdministracaoGerenciamentoUsuarios />} />
          <Route path="/administracao/perfis-permissoes" element={<AdministracaoPerfisPermissoes />} />
          <Route path="/administracao/setores-grupos" element={<AdministracaoSetoresGrupos />} />
          <Route path="/administracao/configuracoes-gerais" element={<AdministracaoConfiguracoesGerais />} />
          <Route path="/administracao/auditoria-acessos" element={<AdministracaoAuditoriaAcessos />} />

          {/* Relatórios */}
          <Route path="/relatorios/relatorios" element={<RelatoriosRelatorios />} />
          <Route path="/relatorios/indicadores-atendimentos" element={<RelatoriosIndicadoresAtendimentos />} />
          <Route path="/relatorios/estatisticas-uso" element={<RelatoriosEstatisticasUso />} />
          <Route path="/relatorios/exportacoes" element={<RelatoriosExportacoes />} />

          {/* Configurações */}
          <Route path="/configuracoes/meu-perfil" element={<ConfiguracoesMeuPerfil />} />
          <Route path="/configuracoes/trocar-senha" element={<ConfiguracoesTrocarSenha />} />
          <Route path="/configuracoes/preferencias-notificacao" element={<ConfiguracoesPreferenciasNotificacao />} />
          <Route path="/configuracoes/idioma-acessibilidade" element={<ConfiguracoesIdiomaAcessibilidade />} />

          {/* Saúde */}
          <Route path="/saude/atendimentos" element={<SaudeAtendimentos />} />
          <Route path="/saude/agendamentos-medicos" element={<SaudeAgendamentosMedicos />} />
          <Route path="/saude/controle-medicamentos" element={<SaudeControleMedicamentos />} />
          <Route path="/saude/campanhas-saude" element={<SaudeCampanhasSaude />} />
          <Route path="/saude/programas-saude" element={<SaudeProgramasSaude />} />
          <Route path="/saude/encaminhamentos-tfd" element={<SaudeEncaminhamentosTFD />} />
          <Route path="/saude/exames" element={<SaudeExames />} />
          <Route path="/saude/acs" element={<SaudeACS />} />
          <Route path="/saude/transporte-pacientes" element={<SaudeTransportePacientes />} />

          {/* Educação */}
          <Route path="/educacao/matricula-alunos" element={<EducacaoMatriculaAlunos />} />
          <Route path="/educacao/gestao-escolar" element={<EducacaoGestaoEscolar />} />
          <Route path="/educacao/transporte-escolar" element={<EducacaoTransporteEscolar />} />
          <Route path="/educacao/merenda-escolar" element={<EducacaoMerendaEscolar />} />
          <Route path="/educacao/registro-ocorrencias" element={<EducacaoRegistroOcorrencias />} />
          <Route path="/educacao/calendario-escolar" element={<EducacaoCalendarioEscolar />} />

          {/* Assistência Social */}
          <Route path="/assistencia-social/atendimentos" element={<AssistenciaSocialAtendimentos />} />
          <Route path="/assistencia-social/familias-vulneraveis" element={<AssistenciaSocialFamiliasVulneraveis />} />
          <Route path="/assistencia-social/cras-e-creas" element={<AssistenciaSocialCrasECreas />} />
          <Route path="/assistencia-social/programas-sociais" element={<AssistenciaSocialProgramasSociais />} />
          <Route path="/assistencia-social/gerenciamento-beneficios" element={<AssistenciaSocialGerenciamentoBeneficios />} />
          <Route path="/assistencia-social/entregas-emergenciais" element={<AssistenciaSocialEntregasEmergenciais />} />
          <Route path="/assistencia-social/registro-visitas" element={<AssistenciaSocialRegistroVisitas />} />

          {/* Cultura */}
          <Route path="/cultura/espacos-culturais" element={<CulturaEspacosCulturais />} />
          <Route path="/cultura/projetos-culturais" element={<CulturaProjetosCulturais />} />
          <Route path="/cultura/eventos" element={<CulturaEventos />} />
          <Route path="/cultura/grupos-artisticos" element={<CulturaGruposArtisticos />} />
          <Route path="/cultura/manifestacoes-culturais" element={<CulturaManifestacoesCulturais />} />
          <Route path="/cultura/oficinas-cursos" element={<CulturaOficinasCursos />} />

          {/* Agricultura */}
          <Route path="/agricultura/atendimentos" element={<AgriculturaAtendimentos />} />
          <Route path="/agricultura/cadastro-produtores" element={<AgriculturaCadastroProdutores />} />
          <Route path="/agricultura/assistencia-tecnica" element={<AgriculturaAssistenciaTecnica />} />
          <Route path="/agricultura/programas-rurais" element={<AgriculturaProgramasRurais />} />
          <Route path="/agricultura/cursos-capacitacoes" element={<AgriculturaCursosCapacitacoes />} />

          {/* Esportes */}
          <Route path="/esportes/atendimentos" element={<EsportesAtendimentos />} />
          <Route path="/esportes/equipes-esportivas" element={<EsportesEquipesEsportivas />} />
          <Route path="/esportes/competicoes-torneios" element={<EsportesCompeticoesTorneios />} />
          <Route path="/esportes/atletas-federados" element={<EsportesAtletasFederados />} />
          <Route path="/esportes/escolinhas-esportivas" element={<EsportesEscolinhasEsportivas />} />
          <Route path="/esportes/eventos-esportivos" element={<EsportesEventosEsportivos />} />
          <Route path="/esportes/infraestrutura-esportiva" element={<EsportesInfraestruturaEsportiva />} />

          {/* Turismo */}
          <Route path="/turismo/atendimentos" element={<TurismoAtendimentos />} />
          <Route path="/turismo/pontos-turisticos" element={<TurismoPontosTuristicos />} />
          <Route path="/turismo/estabelecimentos-locais" element={<TurismoEstabelecimentosLocais />} />
          <Route path="/turismo/programas-turisticos" element={<TurismoProgramasTuristicos />} />
          <Route path="/turismo/mapa-turistico" element={<TurismoMapaTuristico />} />
          <Route path="/turismo/informacoes-turisticas" element={<TurismoInformacoesTuristicas />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
