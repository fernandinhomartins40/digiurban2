
export interface AtendimentoAmbiental {
  id: string;
  protocolo: string;
  cidadao: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  tipoAtendimento: 'licenciamento' | 'denuncia' | 'consulta' | 'recurso';
  assunto: string;
  descricao: string;
  localizacao?: {
    endereco: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'aberto' | 'em_analise' | 'em_vistoria' | 'resolvido' | 'indeferido';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataAbertura: string;
  dataAtualizacao: string;
  responsavel?: string;
  observacoes: string;
  anexos: string[];
}

export interface LicencaAmbiental {
  id: string;
  numeroLicenca: string;
  requerente: {
    nome: string;
    cpfCnpj: string;
    telefone: string;
    email: string;
    endereco: string;
  };
  tipoLicenca: 'previa' | 'instalacao' | 'operacao' | 'corretiva';
  atividade: string;
  descricaoAtividade: string;
  localizacao: {
    endereco: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
    area: number;
  };
  status: 'protocolada' | 'em_analise' | 'em_vistoria' | 'aprovada' | 'negada' | 'vencida';
  dataProtocolo: string;
  dataVencimento?: string;
  condicoes: string[];
  documentos: {
    tipo: string;
    nome: string;
    url: string;
    dataUpload: string;
  }[];
  historico: {
    data: string;
    acao: string;
    observacao: string;
    responsavel: string;
  }[];
}

export interface DenunciaAmbiental {
  id: string;
  protocolo: string;
  denunciante?: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  tipoViolacao: 'desmatamento' | 'poluicao_agua' | 'poluicao_ar' | 'descarte_irregular' | 'ruido' | 'outros';
  descricao: string;
  localizacao: {
    endereco: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'registrada' | 'em_investigacao' | 'em_vistoria' | 'comprovada' | 'improcedente' | 'resolvida';
  dataRegistro: string;
  dataVistoria?: string;
  fotos: string[];
  observacoes: string;
  responsavel?: string;
}

export interface AreaProtegida {
  id: string;
  nome: string;
  tipo: 'reserva_legal' | 'app' | 'parque' | 'reserva_biologica' | 'arie' | 'rppn';
  descricao: string;
  localizacao: {
    coordenadas: {
      latitude: number;
      longitude: number;
    };
    poligono: Array<{
      latitude: number;
      longitude: number;
    }>;
  };
  area: number;
  status: 'ativa' | 'em_processo' | 'suspensa';
  legislacao: string;
  restricoes: string[];
  responsavel: string;
  dataCriacao: string;
  caracteristicas: {
    vegetacao: string[];
    fauna: string[];
    recursosHidricos: string[];
  };
  fotos: string[];
}

export interface ProgramaAmbiental {
  id: string;
  nome: string;
  tipo: 'educacao' | 'conservacao' | 'recuperacao' | 'monitoramento';
  descricao: string;
  objetivos: string[];
  publicoAlvo: string;
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'suspenso';
  dataInicio: string;
  dataFim?: string;
  responsavel: string;
  parceiros: string[];
  orcamento: number;
  indicadores: {
    nome: string;
    meta: number;
    realizado: number;
    unidade: string;
  }[];
  atividades: {
    id: string;
    nome: string;
    descricao: string;
    dataInicio: string;
    dataFim?: string;
    status: 'pendente' | 'em_andamento' | 'concluida';
  }[];
}

export interface CampanhaAmbiental {
  id: string;
  nome: string;
  tema: 'agua' | 'energia' | 'residuos' | 'biodiversidade' | 'mudancas_climaticas';
  descricao: string;
  objetivos: string[];
  publicoAlvo: string;
  dataInicio: string;
  dataFim: string;
  status: 'planejada' | 'ativa' | 'concluida' | 'cancelada';
  canais: string[];
  materiais: {
    tipo: string;
    nome: string;
    url: string;
  }[];
  metricas: {
    alcance: number;
    participantes: number;
    engajamento: number;
  };
  responsavel: string;
}

export interface IndicadorAmbiental {
  id: string;
  nome: string;
  categoria: 'qualidade_ar' | 'qualidade_agua' | 'biodiversidade' | 'residuos' | 'energia' | 'carbono';
  unidade: string;
  frequenciaMedicao: 'diaria' | 'semanal' | 'mensal' | 'trimestral' | 'anual';
  metaAnual: number;
  pontoMonitoramento: {
    nome: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  medicoes: {
    data: string;
    valor: number;
    observacoes?: string;
  }[];
  responsavel: string;
  ultimaAtualizacao: string;
}

export interface OcorrenciaAmbiental {
  id: string;
  tipo: 'acidente' | 'vazamento' | 'incendio' | 'erosao' | 'contaminacao';
  descricao: string;
  localizacao: {
    endereco: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'ativa' | 'controlada' | 'resolvida';
  dataOcorrencia: string;
  dataResolucao?: string;
  responsavel: string;
  medidasAdotadas: string[];
  fotos: string[];
  impactos: string[];
}
