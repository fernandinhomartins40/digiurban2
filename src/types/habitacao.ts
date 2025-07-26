
export interface Atendimento {
  id: string;
  protocolo: string;
  cidadao: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  tipoAtendimento: 'inscricao' | 'informacao' | 'reclamacao' | 'recurso';
  assunto: string;
  descricao: string;
  status: 'aberto' | 'em_andamento' | 'pendente' | 'resolvido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataAbertura: string;
  dataAtualizacao: string;
  responsavel?: string;
  observacoes: string;
  anexos: string[];
}

export interface Inscricao {
  id: string;
  numeroInscricao: string;
  cidadao: {
    nome: string;
    cpf: string;
    rg: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: {
      rua: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cep: string;
      cidade: string;
      estado: string;
    };
  };
  programa: string;
  situacaoFamiliar: {
    estadoCivil: string;
    numeroFilhos: number;
    rendaFamiliar: number;
    composicaoFamiliar: Array<{
      nome: string;
      parentesco: string;
      idade: number;
      renda: number;
    }>;
  };
  documentos: {
    tipo: string;
    nome: string;
    url: string;
    dataUpload: string;
  }[];
  status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'aguardando_documentos';
  dataInscricao: string;
  dataAnalise?: string;
  pontuacao?: number;
  observacoes: string;
}

export interface ProgramaHabitacional {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'casa_propria' | 'aluguel_social' | 'reforma' | 'regularizacao';
  status: 'ativo' | 'inativo' | 'em_planejamento' | 'concluido';
  criterios: {
    rendaMaxima: number;
    rendaMinima: number;
    idadeMinima?: number;
    idadeMaxima?: number;
    tempoResidencia: number;
    outros: string[];
  };
  beneficios: string[];
  vagas: {
    total: number;
    ocupadas: number;
    disponiveis: number;
  };
  prazoInscricao: {
    inicio: string;
    fim: string;
  };
  documentosNecessarios: string[];
  responsavel: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface UnidadeHabitacional {
  id: string;
  codigo: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cep: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  tipo: 'casa' | 'apartamento' | 'lote';
  especificacoes: {
    area: number;
    quartos: number;
    banheiros: number;
    garagem: boolean;
    areaTerreno?: number;
  };
  status: 'disponivel' | 'ocupada' | 'em_construcao' | 'em_reforma' | 'indisponivel';
  programa: string;
  valor: {
    venda?: number;
    aluguel?: number;
  };
  beneficiario?: {
    nome: string;
    cpf: string;
    dataOcupacao: string;
  };
  infraestrutura: {
    agua: boolean;
    esgoto: boolean;
    energia: boolean;
    internet: boolean;
    transporte: boolean;
    escola: boolean;
    saude: boolean;
  };
  fotos: string[];
  documentos: string[];
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface ProcessoRegularizacao {
  id: string;
  numeroProcesso: string;
  interessado: {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
  };
  imovel: {
    endereco: string;
    area: number;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
    tipoOcupacao: 'proprio' | 'posse' | 'cessao' | 'outro';
    tempoOcupacao: number;
  };
  tipoRegularizacao: 'usucapiao' | 'doacao' | 'compra_venda' | 'demarcacao';
  etapa: 'protocolo' | 'analise_documental' | 'vistoria' | 'medicao' | 'aprovacao' | 'titulo';
  status: 'em_andamento' | 'aguardando_documentos' | 'aguardando_vistoria' | 'concluido' | 'indeferido';
  documentos: {
    tipo: string;
    nome: string;
    url: string;
    dataUpload: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
  }[];
  historico: {
    data: string;
    etapa: string;
    observacao: string;
    responsavel: string;
  }[];
  vistoria?: {
    data: string;
    tecnico: string;
    observacoes: string;
    fotos: string[];
  };
  dataAbertura: string;
  previsaoConclusao?: string;
}
