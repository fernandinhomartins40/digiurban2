
export interface EspacoCultural {
  id: string;
  nome: string;
  tipo: string;
  endereco: string;
  capacidade: number;
  horarioFuncionamento: string;
  equipamentos: string[];
  acessibilidade: string[];
  valor?: number;
  gratuito: boolean;
  responsavel: string;
  telefone: string;
  email?: string;
  status: "disponivel" | "ocupado" | "manutencao" | "interditado";
}

export interface ProjetoCultural {
  id: string;
  nome: string;
  categoria: string;
  coordenador: string;
  participantes: string[];
  dataInicio: string;
  dataFim: string;
  orcamento?: number;
  fonteRecurso?: string;
  objetivos: string;
  publicoAlvo: string;
  metodologia: string;
  cronograma: any[];
  resultadosEsperados: string;
  status: "em elaboracao" | "aprovado" | "em execucao" | "concluido" | "suspenso" | "cancelado";
}

export interface ManifestacaoCultural {
  id: string;
  nome: string;
  tipo: string;
  origem: string;
  descricao: string;
  historia?: string;
  caracteristicas: string[];
  praticantes: string[];
  locaisPratica: string[];
  periodicidade?: string;
  materiaisNecessarios?: string[];
  status: "ativo" | "em risco" | "perdido" | "documentado";
  inscritos?: string[];
}

export interface Oficina {
  id: string;
  nome: string;
  categoria: string;
  instrutor: string;
  dataInicio: string;
  dataFim: string;
  diasSemana: string[];
  horarioInicio: string;
  horarioFim: string;
  local: string;
  vagas: number;
  vagasOcupadas: number;
  idadeMinima?: number;
  material: string[];
  valor?: number;
  gratuita: boolean;
  descricao: string;
  status: "planejada" | "aberta" | "em andamento" | "finalizada" | "cancelada";
  inscritos?: string[];
}

export interface EventoCultural {
  id: string;
  nome: string;
  categoria: string;
  dataInicio: string;
  dataFim: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  capacidade: number;
  inscricoes: number;
  organizador: string;
  descricao: string;
  valor?: number;
  gratuito: boolean;
  status: "planejado" | "aberto" | "em_andamento" | "finalizado" | "cancelado";
  publicoAlvo: string;
  requisitos?: string;
  participantes?: string[];
}

export interface GrupoArtistico {
  id: string;
  nome: string;
  categoria: string;
  lider: string;
  telefone?: string;
  email?: string;
  membros: number;
  dataFundacao: string;
  descricao: string;
  local: string;
  status: "ativo" | "inativo" | "suspenso";
  proximaApresentacao?: string;
  localApresentacao?: string;
  historico: string[];
}
