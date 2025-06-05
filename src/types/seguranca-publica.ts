
export interface Ocorrencia {
  id: string;
  protocolo: string;
  tipo: 'furto' | 'roubo' | 'vandalismo' | 'perturbacao' | 'acidente' | 'violencia' | 'outros';
  status: 'aberta' | 'em_andamento' | 'resolvida' | 'arquivada';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  descricao: string;
  local: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  dataOcorrencia: string;
  dataCriacao: string;
  solicitante: {
    nome: string;
    telefone?: string;
    email?: string;
    documento?: string;
  };
  responsavel?: {
    nome: string;
    setor: string;
  };
  anexos?: string[];
  observacoes?: string;
  resolucao?: string;
  dataResolucao?: string;
}

export interface ApoioGuarda {
  id: string;
  protocolo: string;
  tipo: 'escolta' | 'patrulhamento' | 'evento' | 'investigacao' | 'apoio_operacional';
  status: 'solicitado' | 'aprovado' | 'em_execucao' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  solicitante: {
    nome: string;
    setor: string;
    telefone: string;
    email: string;
  };
  descricao: string;
  local: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  dataInicio: string;
  dataFim: string;
  horarioInicio: string;
  horarioFim: string;
  equipeSolicitada: number;
  motivoSolicitacao: string;
  observacoes?: string;
  equipesDesignadas?: GuardaMunicipal[];
  relatorioExecucao?: string;
  dataCriacao: string;
}

export interface GuardaMunicipal {
  id: string;
  nome: string;
  matricula: string;
  cargo: string;
  status: 'ativo' | 'inativo' | 'licenca' | 'ferias';
  telefone: string;
  turno: 'manha' | 'tarde' | 'noite' | 'madrugada';
  area_atuacao: string[];
  especializacoes: string[];
}

export interface PontoCritico {
  id: string;
  nome: string;
  tipo: 'alto_risco' | 'medio_risco' | 'baixo_risco' | 'atencao_especial';
  coordenadas: {
    lat: number;
    lng: number;
  };
  endereco: string;
  descricao: string;
  tiposOcorrencia: string[];
  frequencia: 'diaria' | 'semanal' | 'mensal' | 'esporadica';
  horariosCriticos?: string[];
  medidasPreventivas: string[];
  statusMonitoramento: 'ativo' | 'inativo' | 'em_analise';
  ultimaAtualizacao: string;
  historico: {
    data: string;
    evento: string;
    observacao: string;
  }[];
}

export interface AlertaSeguranca {
  id: string;
  tipo: 'emergencia' | 'atencao' | 'informativo' | 'preventivo';
  nivel: 'baixo' | 'medio' | 'alto' | 'critico';
  titulo: string;
  descricao: string;
  local?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  dataInicio: string;
  dataFim?: string;
  status: 'ativo' | 'resolvido' | 'expirado';
  canais: ('sms' | 'email' | 'app' | 'sirene' | 'radio')[];
  populacaoAlvo: string[];
  responsavel: string;
  instrucoesSeguranca?: string[];
  contatosEmergencia?: {
    nome: string;
    telefone: string;
    funcao: string;
  }[];
  dataCriacao: string;
}

export interface EstatisticaRegional {
  regiao: string;
  periodo: {
    inicio: string;
    fim: string;
  };
  totalOcorrencias: number;
  ocorrenciasPorTipo: {
    tipo: string;
    quantidade: number;
    percentual: number;
  }[];
  evolucaoMensal: {
    mes: string;
    quantidade: number;
  }[];
  pontosQuentes: {
    local: string;
    ocorrencias: number;
    coordenadas?: {
      lat: number;
      lng: number;
    };
  }[];
  tempoMedioResolucao: number;
  taxaResolucao: number;
  horariosFrequentes: {
    horario: string;
    quantidade: number;
  }[];
}

export interface SistemaVigilancia {
  id: string;
  nome: string;
  tipo: 'camera_fixa' | 'camera_movel' | 'sensor_movimento' | 'alarme' | 'cerca_eletronica';
  status: 'online' | 'offline' | 'manutencao' | 'erro';
  localizacao: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  especificacoes: {
    resolucao?: string;
    visao_noturna?: boolean;
    zoom?: string;
    angulo_visao?: string;
    alcance?: string;
  };
  conectividade: 'wifi' | 'ethernet' | '4g' | '5g';
  qualidadeSinal: number;
  ultimaManutencao: string;
  proximaManutencao: string;
  alertasConfigurados: string[];
  gravacoes?: {
    duracao_retencao: number;
    qualidade: string;
    backup: boolean;
  };
  responsavel: string;
}

export interface FiltrosOcorrencia {
  tipo?: string[];
  status?: string[];
  prioridade?: string[];
  dataInicio?: string;
  dataFim?: string;
  local?: string;
  responsavel?: string;
}

export interface FiltrosApoio {
  tipo?: string[];
  status?: string[];
  prioridade?: string[];
  dataInicio?: string;
  dataFim?: string;
  solicitante?: string;
}
