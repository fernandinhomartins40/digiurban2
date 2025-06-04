
export interface AtendimentoObras {
  id: string;
  protocolo: string;
  cidadao: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  tipoAtendimento: 'solicitacao_obra' | 'reclamacao_obra' | 'informacao_obra' | 'vistoria' | 'outros';
  assunto: string;
  descricao: string;
  localizacao?: {
    endereco: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'aberto' | 'em_analise' | 'aprovado' | 'negado' | 'em_execucao' | 'concluido';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataAbertura: string;
  dataAtualizacao: string;
  responsavel?: string;
  observacoes: string;
  anexos: string[];
}

export interface ObraPublica {
  id: string;
  numeroContrato: string;
  nome: string;
  descricao: string;
  categoria: 'infraestrutura' | 'edificacao' | 'saneamento' | 'pavimentacao' | 'drenagem' | 'iluminacao' | 'paisagismo';
  tipo: 'nova' | 'reforma' | 'ampliacao' | 'manutencao' | 'reconstrucao';
  localizacao: {
    endereco: string;
    bairro: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
    area: number;
  };
  status: 'planejada' | 'licitacao' | 'contratada' | 'em_andamento' | 'paralisada' | 'concluida' | 'cancelada';
  contratada: {
    empresa: string;
    cnpj: string;
    responsavelTecnico: string;
    telefone: string;
    email: string;
  };
  orcamento: {
    valorContratado: number;
    valorExecutado: number;
    fonte: string;
    numeroEmpenho?: string;
  };
  cronograma: {
    dataInicio: string;
    dataPrevisaoTermino: string;
    dataTerminoReal?: string;
    percentualConcluido: number;
  };
  fiscalizacao: {
    responsavelFiscalizacao: string;
    ultimaVistoria?: string;
    proximaVistoria?: string;
  };
  documentos: {
    tipo: string;
    nome: string;
    url: string;
    dataUpload: string;
  }[];
  fotos: {
    url: string;
    legenda: string;
    data: string;
    fase: 'antes' | 'durante' | 'depois';
  }[];
  observacoes: string;
}

export interface PequenaIntervencao {
  id: string;
  numeroOS: string;
  descricao: string;
  tipo: 'tapa_buraco' | 'limpeza_terreno' | 'poda_arvores' | 'pintura' | 'sinalizacao' | 'reparo_calcada' | 'outros';
  localizacao: {
    endereco: string;
    bairro: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'solicitada' | 'agendada' | 'em_execucao' | 'concluida' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  equipe: {
    responsavel: string;
    membros: string[];
    equipamentos: string[];
  };
  agendamento: {
    dataAgendada: string;
    horaInicio?: string;
    horaFim?: string;
  };
  custo: {
    valorEstimado: number;
    valorReal?: number;
    materiais: {
      item: string;
      quantidade: number;
      valor: number;
    }[];
  };
  dataAbertura: string;
  dataConclusao?: string;
  fotos: {
    url: string;
    legenda: string;
    data: string;
    tipo: 'antes' | 'durante' | 'depois';
  }[];
  observacoes: string;
}

export interface ProgressoObra {
  obraId: string;
  data: string;
  percentualAnterior: number;
  percentualAtual: number;
  atividades: {
    descricao: string;
    status: 'iniciada' | 'em_andamento' | 'concluida' | 'paralisada';
    percentual: number;
  }[];
  medicoes: {
    item: string;
    quantidadePrevista: number;
    quantidadeExecutada: number;
    unidade: string;
  }[];
  problemas?: {
    descricao: string;
    impacto: 'baixo' | 'medio' | 'alto';
    solucao?: string;
  }[];
  fotos: {
    url: string;
    legenda: string;
    area: string;
  }[];
  responsavel: string;
  observacoes: string;
}

export interface IndicadorObras {
  id: string;
  nome: string;
  categoria: 'execucao' | 'financeiro' | 'prazo' | 'qualidade';
  valor: number;
  meta?: number;
  unidade: string;
  periodo: string;
  tendencia: 'crescente' | 'decrescente' | 'estavel';
  historico: {
    periodo: string;
    valor: number;
  }[];
}
