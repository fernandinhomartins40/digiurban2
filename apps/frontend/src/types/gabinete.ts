
export interface Atendimento {
  id: string;
  solicitante: string;
  tipo: 'Audiência' | 'Reclamação' | 'Solicitação' | 'Denúncia' | string;
  data: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  responsavel: string;
  detalhes?: string;
  urgente?: boolean;
  anexos?: string[];
  observacoes?: string;
}

export interface OrdemSetor {
  id: string;
  setor: string;
  assunto: string;
  descricao: string;
  dataEnvio: string;
  prazo: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  prioridade: 'alta' | 'media' | 'baixa';
  responsavel: string;
  responsavelEmail?: string;
  documentos?: {
    nome: string;
    tamanho: string;
    data: string;
  }[];
  historico?: {
    data: string;
    hora: string;
    acao: string;
    autor: string;
  }[];
  comentarios?: {
    autor: string;
    data: string;
    hora: string;
    texto: string;
  }[];
}

export interface Demanda {
  id: string;
  descricao: string;
  bairro: string;
  regiao: string;
  categoria: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  prioridade: 'alta' | 'media' | 'baixa';
  dataCriacao: string;
  dataAtualizacao?: string;
  prazo?: string;
  solicitante?: string;
  documento?: string;
  endereco?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  fotos?: string[];
  responsavel?: string;
  resolucao?: string;
}

export interface ProjetoEstrategico {
  id: string;
  nome: string;
  descricao: string;
  status: 'planejamento' | 'em_andamento' | 'execucao' | 'concluido' | 'pausado';
  prioridade: 'alta' | 'media' | 'baixa';
  progresso: number;
  dataInicio: string;
  dataFim: string;
  orcamento: number;
  orcamentoGasto: number;
  responsavel: string;
  equipe: string[];
  metas: {
    descricao: string;
    concluida: boolean;
  }[];
}

export interface CompromissoAgenda {
  id: string;
  titulo: string;
  tipo: 'reuniao' | 'audiencia' | 'evento' | 'videoconferencia';
  data: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  participantes: string[];
  status: 'agendado' | 'confirmado' | 'cancelado' | 'realizado';
  prioridade: 'alta' | 'media' | 'baixa';
  descricao: string;
  observacoes?: string;
}

export interface KPI {
  id: string;
  nome: string;
  categoria: 'Atendimento' | 'Financeiro' | 'Infraestrutura' | 'Transparencia' | string;
  valor: number;
  meta: number;
  unidade: string;
  status: 'sucesso' | 'atencao' | 'critico';
  tendencia: 'up' | 'down' | 'stable';
  descricao: string;
  ultimaAtualizacao: string;
}

export interface ComunicacaoOficial {
  id: string;
  titulo: string;
  tipo: 'decreto' | 'portaria' | 'nota' | 'comunicado' | 'edital';
  status: 'rascunho' | 'revisao' | 'aprovado' | 'agendado' | 'publicado' | 'arquivado';
  autor: string;
  dataCreacao: string;
  dataPublicacao: string | null;
  canal: string;
  conteudo: string;
  anexos: string[];
  visualizacoes: number;
}

export interface Auditoria {
  id: string;
  titulo: string;
  categoria: string;
  status: 'planejada' | 'em_andamento' | 'concluida' | 'suspensa';
  dataInicio: string;
  dataFim: string;
  responsavel: string;
  valorAuditado: number;
  achados: number;
  recomendacoes: number;
  implementadas: number;
  relatorio: string | null;
}
