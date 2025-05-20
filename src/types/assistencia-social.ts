
export interface Cidadao {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  endereco: string;
  bairro: string;
  telefone: string;
  email?: string;
  nis?: string;
  cadernico?: boolean;
  dataCadastro: string;
  vulnerabilidades: string[];
  familiaId?: string;
}

export interface Familia {
  id: string;
  referencia: Cidadao;
  membros: Cidadao[];
  rendaFamiliar: number;
  vulnerabilidades: string[];
  programasSociais: string[];
  beneficiosRecebidos: Beneficio[];
  visitasRealizadas: Visita[];
}

export interface Atendimento {
  id: string;
  cidadao: Cidadao;
  dataAtendimento: string;
  tipoAtendimento: string;
  descricao: string;
  encaminhamentos: string[];
  status: 'Concluído' | 'Em andamento' | 'Aguardando retorno';
  tecnicoResponsavel: Funcionario;
  unidade: Unidade;
}

export interface Beneficio {
  id: string;
  nome: string;
  descricao: string;
  valorMensal?: number;
  dataInicio: string;
  dataFim?: string;
  status: 'Ativo' | 'Suspenso' | 'Cancelado' | 'Em análise';
  motivoStatus?: string;
  cidadao: Cidadao;
}

export interface Unidade {
  id: string;
  nome: string;
  tipo: 'CRAS' | 'CREAS' | 'Centro POP' | 'Outro';
  endereco: string;
  bairro: string;
  telefone: string;
  email: string;
  coordenador: Funcionario;
  equipe: Funcionario[];
  horarioFuncionamento: string;
  areasAbrangencia: string[];
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  registro: string;
  email: string;
  telefone: string;
  unidade?: Unidade;
}

export interface ProgramaSocial {
  id: string;
  nome: string;
  descricao: string;
  publico: string;
  criterios: string[];
  beneficios: string[];
  duracao?: string;
  responsavel: Funcionario;
  status: 'Ativo' | 'Inativo';
  dataInicio: string;
  dataTermino?: string;
  vagas: number;
  vagasOcupadas: number;
}

export interface EntregaEmergencial {
  id: string;
  tipo: 'Cesta Básica' | 'Kit Higiene' | 'Kit Bebê' | 'Cobertor' | 'Outro';
  descricao: string;
  cidadao: Cidadao;
  familia?: Familia;
  dataEntrega: string;
  responsavelEntrega: Funcionario;
  motivo: string;
  observacoes?: string;
}

export interface Visita {
  id: string;
  familia: Familia;
  endereco: string;
  dataVisita: string;
  tecnicoResponsavel: Funcionario;
  motivoVisita: string;
  relatorio: string;
  encaminhamentos: string[];
  retornoNecessario: boolean;
  dataProximaVisita?: string;
  status: 'Realizada' | 'Cancelada' | 'Agendada' | 'Não realizada';
  motivoNaoRealizada?: string;
}

export interface FiltroBusca {
  termo?: string;
  dataInicio?: Date;
  dataFim?: Date;
  status?: string;
  tipo?: string;
  unidade?: string;
  bairro?: string;
}
