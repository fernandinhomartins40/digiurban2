
export interface AtendimentoUrbano {
  id: string;
  protocolo: string;
  cidadao: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  tipoAtendimento: 'consulta' | 'solicitacao' | 'recurso' | 'informacao';
  assunto: string;
  descricao: string;
  localizacao?: {
    endereco: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'aberto' | 'em_analise' | 'aprovado' | 'negado' | 'pendente_documentos';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataAbertura: string;
  dataAtualizacao: string;
  responsavel?: string;
  observacoes: string;
  anexos: string[];
}

export interface ProjetoUrbano {
  id: string;
  numeroProtocolo: string;
  requerente: {
    nome: string;
    cpfCnpj: string;
    telefone: string;
    email: string;
    endereco: string;
  };
  tipoProjeto: 'residencial' | 'comercial' | 'industrial' | 'misto' | 'publico';
  categoria: 'construcao_nova' | 'reforma' | 'ampliacao' | 'demolicao' | 'regularizacao';
  descricao: string;
  localizacao: {
    endereco: string;
    lote: string;
    quadra: string;
    bairro: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
    area: number;
  };
  status: 'protocolado' | 'em_analise' | 'aprovado' | 'negado' | 'pendente_correcoes';
  dataProtocolo: string;
  dataAnalise?: string;
  dataAprovacao?: string;
  responsavelAnalise?: string;
  documentos: {
    tipo: string;
    nome: string;
    url: string;
    dataUpload: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
  }[];
  observacoes: string;
  condicoes?: string[];
  historico: {
    data: string;
    acao: string;
    observacao: string;
    responsavel: string;
  }[];
}

export interface AlvaraUrbano {
  id: string;
  numeroAlvara: string;
  tipoAlvara: 'construcao' | 'funcionamento' | 'demolicao' | 'ocupacao';
  requerente: {
    nome: string;
    cpfCnpj: string;
    telefone: string;
    email: string;
    endereco: string;
  };
  empreendimento: {
    nome: string;
    atividade: string;
    endereco: string;
    area: number;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'solicitado' | 'em_analise' | 'aprovado' | 'negado' | 'vencido';
  dataEmissao?: string;
  dataVencimento?: string;
  dataSolicitacao: string;
  condicoes: string[];
  taxas: {
    tipo: string;
    valor: number;
    status: 'pendente' | 'pago' | 'isento';
  }[];
  documentos: {
    tipo: string;
    nome: string;
    url: string;
    obrigatorio: boolean;
    status: 'pendente' | 'aprovado' | 'rejeitado';
  }[];
  responsavel?: string;
}

export interface ReclamacaoUrbana {
  id: string;
  protocolo: string;
  denunciante?: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  tipoReclamacao: 'construcao_irregular' | 'poluicao_sonora' | 'ocupacao_via' | 'propaganda_irregular' | 'outros';
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
  acoes: {
    data: string;
    acao: string;
    responsavel: string;
    observacao: string;
  }[];
}

export interface ConsultaPublica {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'plano_diretor' | 'zoneamento' | 'obra_publica' | 'regulamentacao' | 'projeto_urbano';
  status: 'planejada' | 'ativa' | 'encerrada' | 'suspensa';
  dataInicio: string;
  dataFim: string;
  localizacao?: {
    endereco: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  documentos: {
    tipo: string;
    nome: string;
    url: string;
    dataPublicacao: string;
  }[];
  contribuicoes: {
    id: string;
    cidadao: string;
    data: string;
    contribuicao: string;
    status: 'pendente' | 'analisada' | 'incorporada' | 'rejeitada';
  }[];
  responsavel: string;
  resultados?: string;
}

export interface ZonaUrbana {
  id: string;
  nome: string;
  tipo: 'residencial' | 'comercial' | 'industrial' | 'mista' | 'preservacao' | 'especial';
  descricao: string;
  parametros: {
    coeficienteAproveitamento: number;
    taxaOcupacao: number;
    recuoFrontal: number;
    recuoLateral: number;
    alturaMaxima: number;
    garitoMaximo: number;
  };
  poligono: Array<{
    latitude: number;
    longitude: number;
  }>;
  restricoes: string[];
  usoPermitido: string[];
  legislacao: string;
  dataVigencia: string;
}

export interface IndicadorUrbano {
  id: string;
  nome: string;
  categoria: 'densidade' | 'uso_solo' | 'mobilidade' | 'infraestrutura' | 'qualidade_vida';
  unidade: string;
  valor: number;
  meta?: number;
  periodo: string;
  fonte: string;
  metodologia: string;
  historico: {
    periodo: string;
    valor: number;
  }[];
}
