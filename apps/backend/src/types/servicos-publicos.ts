
export interface AtendimentoServicos {
  id: string;
  protocolo: string;
  cidadao: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  tipoServico: 'iluminacao' | 'limpeza' | 'coleta_especial' | 'outros';
  assunto: string;
  descricao: string;
  localizacao?: {
    endereco: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'aberto' | 'em_analise' | 'agendado' | 'em_execucao' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataAbertura: string;
  dataAtualizacao: string;
  responsavel?: string;
  observacoes: string;
  anexos: string[];
}

export interface PontoIluminacao {
  id: string;
  numeroPoste: string;
  tipo: 'led' | 'sodio' | 'mercurio' | 'halogenio';
  potencia: number;
  localizacao: {
    endereco: string;
    bairro: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'funcionando' | 'defeito' | 'manutencao' | 'desligado';
  ultimaManutencao?: string;
  proximaManutencao?: string;
  consumoMensal: number;
  custo: {
    instalacao: number;
    manutencaoMensal: number;
  };
  problemas: {
    descricao: string;
    data: string;
    resolvido: boolean;
  }[];
  observacoes: string;
}

export interface ServicoLimpeza {
  id: string;
  numeroOS: string;
  tipo: 'varracao' | 'capinacao' | 'limpeza_terreno' | 'remocao_entulho' | 'outros';
  area: {
    endereco: string;
    bairro: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
    tamanho: number;
  };
  status: 'agendado' | 'em_execucao' | 'concluido' | 'cancelado';
  frequencia: 'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'eventual';
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

export interface ColetaEspecial {
  id: string;
  numeroColeta: string;
  tipoMaterial: 'eletronicos' | 'moveis' | 'entulho' | 'podas' | 'oleo' | 'baterias' | 'outros';
  solicitante: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  localizacao: {
    endereco: string;
    bairro: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'solicitado' | 'agendado' | 'coletado' | 'cancelado';
  agendamento: {
    dataAgendada: string;
    horaInicio: string;
    horaFim: string;
  };
  equipe: {
    responsavel: string;
    veiculo: string;
    membros: string[];
  };
  quantidadeEstimada: number;
  quantidadeColetada?: number;
  unidade: string;
  destino: string;
  custo: {
    transporte: number;
    destinacao: number;
    total: number;
  };
  dataSolicitacao: string;
  dataColeta?: string;
  fotos: {
    url: string;
    legenda: string;
    data: string;
  }[];
  observacoes: string;
}

export interface ProblemaFoto {
  id: string;
  protocolo: string;
  categoria: 'iluminacao' | 'limpeza' | 'calcada' | 'sinalizacao' | 'esgoto' | 'outros';
  descricao: string;
  localizacao: {
    endereco: string;
    bairro: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'reportado' | 'em_analise' | 'agendado' | 'resolvido' | 'nao_procede';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  cidadao: {
    nome: string;
    telefone: string;
    email: string;
  };
  fotos: {
    url: string;
    legenda: string;
    data: string;
  }[];
  dataReporte: string;
  dataResolucao?: string;
  responsavel?: string;
  solucao?: string;
  custoEstimado?: number;
  observacoes: string;
}

export interface EquipeServicos {
  id: string;
  nome: string;
  tipo: 'iluminacao' | 'limpeza' | 'coleta' | 'geral';
  membros: {
    nome: string;
    funcao: string;
    telefone: string;
  }[];
  responsavel: string;
  veiculo?: {
    placa: string;
    modelo: string;
    capacidade: number;
  };
  equipamentos: {
    item: string;
    quantidade: number;
    estado: 'bom' | 'regular' | 'ruim';
  }[];
  agenda: {
    data: string;
    servico: string;
    status: 'agendado' | 'em_execucao' | 'concluido';
    localizacao: string;
  }[];
  status: 'ativa' | 'inativa' | 'manutencao';
  observacoes: string;
}

export interface IndicadorServicos {
  id: string;
  nome: string;
  categoria: 'atendimento' | 'execucao' | 'qualidade' | 'custo';
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
