
export interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  rg?: string;
  telefone: string;
  email?: string;
  endereco: string;
  propriedade: {
    nome: string;
    area: number; // em hectares
    endereco: string;
    coordenadas?: string;
  };
  tipoProducao: string[];
  documentos: {
    car?: string; // Cadastro Ambiental Rural
    ccir?: string; // Certificado de Cadastro de Imóvel Rural
    itr?: boolean; // Imposto Territorial Rural em dia
  };
  programasVinculados: string[];
  status: "ativo" | "inativo" | "pendente";
  dataUltimoAtendimento?: string;
  observacoes?: string;
}

export interface AtendimentoAgricula {
  id: string;
  protocoloNumero: string;
  produtorId: string;
  produtorNome: string;
  dataAtendimento: string;
  tipoAtendimento: string;
  assunto: string;
  descricao: string;
  tecnicoResponsavel: string;
  status: "agendado" | "em_andamento" | "concluido" | "cancelado";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  documentosAnexos?: string[];
  encaminhamentos?: string[];
  proximoContato?: string;
  observacoes?: string;
}

export interface AssistenciaTecnica {
  id: string;
  produtorId: string;
  produtorNome: string;
  propriedade: string;
  tipoAssistencia: string;
  categoria: string;
  dataInicio: string;
  dataFim?: string;
  tecnicoResponsavel: string;
  descricaoAtividade: string;
  objetivo: string;
  metodologia?: string;
  resultadosEsperados: string;
  resultadosObtidos?: string;
  status: "planejada" | "em_execucao" | "concluida" | "suspensa" | "cancelada";
  custoEstimado?: number;
  custoReal?: number;
  materiaisNecessarios?: string[];
  cronograma?: any[];
  avaliacaoProdutor?: number; // 1-5
  observacoes?: string;
}

export interface ProgramaRural {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  objetivos: string[];
  publicoAlvo: string;
  requisitos: string[];
  beneficios: string[];
  dataInicio: string;
  dataFim?: string;
  coordenador: string;
  equipe: string[];
  orcamento?: number;
  fonteRecurso?: string;
  participantesInscritos: number;
  participantesAtivos: number;
  metasEstabelecidas: any[];
  resultadosAlcancados?: any[];
  status: "planejamento" | "inscricoes_abertas" | "em_execucao" | "concluido" | "suspenso";
  documentosNecessarios?: string[];
  observacoes?: string;
}

export interface CursoCapacitacao {
  id: string;
  nome: string;
  categoria: string;
  modalidade: "presencial" | "online" | "hibrido";
  instrutor: string;
  dataInicio: string;
  dataFim: string;
  horarioInicio: string;
  horarioFim: string;
  local?: string;
  linkOnline?: string;
  cargaHoraria: number;
  vagas: number;
  vagasOcupadas: number;
  valor?: number;
  gratuito: boolean;
  descricao: string;
  conteudoProgramatico: string[];
  materiaisInclusos?: string[];
  requisitos?: string[];
  certificacao: boolean;
  entidadeCertificadora?: string;
  status: "planejado" | "inscricoes_abertas" | "em_andamento" | "finalizado" | "cancelado";
  participantes?: string[];
  avaliacaoMedia?: number; // 1-5
  observacoes?: string;
}
