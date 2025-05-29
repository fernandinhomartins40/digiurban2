
export interface AtendimentoEsportivo {
  id: string;
  cidadao: string;
  cpf: string;
  telefone: string;
  modalidade: string;
  categoria: 'Infantil' | 'Juvenil' | 'Adulto' | 'Terceira Idade';
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  data: string;
  observacoes: string;
}

export interface EquipeEsportiva {
  id: string;
  nome: string;
  modalidade: string;
  categoria: 'Base' | 'Juvenil' | 'Adulto' | 'Master';
  tecnico: string;
  numeroAtletas: number;
  status: 'Ativa' | 'Inativa' | 'Em Formação';
  competicoes: string[];
  descricao: string;
}

export interface Competicao {
  id: string;
  nome: string;
  modalidade: string;
  tipo: 'Municipal' | 'Regional' | 'Estadual' | 'Nacional';
  dataInicio: string;
  dataFim: string;
  local: string;
  equipesParticipantes: string[];
  premiacao: string;
  status: 'Planejada' | 'Em Andamento' | 'Finalizada' | 'Cancelada';
  regulamento: string;
}

export interface AtletaFederado {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  modalidade: string;
  categoria: string;
  federacao: string;
  numeroRegistro: string;
  vigencia: string;
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  conquistas: string[];
}

export interface EscolinhaSport {
  id: string;
  nome: string;
  modalidade: string;
  idadeMinima: number;
  idadeMaxima: number;
  professor: string;
  local: string;
  horarios: string;
  diasSemana: string[];
  vagas: number;
  vagasOcupadas: number;
  valor: number;
  descricao: string;
  status: 'Ativa' | 'Inativa' | 'Cheia';
}

export interface EventoEsportivo {
  id: string;
  nome: string;
  tipo: 'Torneio' | 'Festival' | 'Clínica' | 'Palestra' | 'Outro';
  modalidade: string;
  data: string;
  horario: string;
  local: string;
  publicoAlvo: string;
  inscricoes: number;
  limiteInscricoes: number;
  valor: number;
  organizador: string;
  descricao: string;
  status: 'Planejado' | 'Aberto' | 'Em Andamento' | 'Finalizado' | 'Cancelado';
}

export interface InfraestruturaSport {
  id: string;
  nome: string;
  tipo: 'Quadra' | 'Campo' | 'Piscina' | 'Academia' | 'Pista' | 'Outro';
  endereco: string;
  capacidade: number;
  modalidades: string[];
  equipamentos: string[];
  horarioFuncionamento: string;
  responsavel: string;
  telefone: string;
  status: 'Ativo' | 'Em Manutenção' | 'Inativo';
  observacoes: string;
}
