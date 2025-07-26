
export type Familia = {
  id: string;
  nome: string;
  responsavel: string;
  numeroMembros: number;
  endereco: string;
  telefone: string;
  dataCadastro: string;
  vulnerabilidades: string[];
  prioridade: 'alta' | 'media' | 'baixa';
  nis: string;
  rendaMensal: number;
  status: 'ativo' | 'inativo' | 'pendente';
};

export type Atendimento = {
  id: string;
  cidadao: string;
  cpf: string;
  dataAtendimento: string;
  tipo: string;
  descricao: string;
  status: 'concluido' | 'em andamento' | 'agendado' | 'cancelado';
  responsavel: string;
  local: string;
  encaminhamentos?: string[];
};

export type UnidadeCRAS = {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  coordenador: string;
  horarioFuncionamento: string;
  servicosOferecidos: string[];
  areaAbrangencia: string[];
  equipe: Funcionario[];
};

export type ProgramaSocial = {
  id: string;
  nome: string;
  descricao: string;
  publico: string;
  requisitos: string[];
  beneficios: string[];
  periodoInscricao: string;
  status: 'ativo' | 'inativo' | 'em planejamento';
  responsavel: string;
  orcamento: number;
  atendidos: number;
  meta: number;
};

export type Beneficio = {
  id: string;
  nome: string;
  tipo: 'financeiro' | 'material' | 'servico';
  descricao: string;
  valor?: number;
  periodicidade?: string;
  familiasBeneficiadas: number;
  dataInicio: string;
  dataFim?: string;
  status: 'ativo' | 'suspenso' | 'encerrado';
  condicionalidades?: string[];
};

export type EntregaEmergencial = {
  id: string;
  familia: string;
  enderecoEntrega: string;
  itens: Item[];
  dataEntrega: string;
  status: 'solicitada' | 'aprovada' | 'separada' | 'em rota' | 'entregue' | 'cancelada';
  responsavelEntrega?: string;
  observacoes?: string;
  motivoSolicitacao: string;
};

export type Item = {
  id: string;
  nome: string;
  quantidade: number;
  tipo: 'alimento' | 'higiene' | 'limpeza' | 'medicamento' | 'vestuario' | 'outro';
};

export type Visita = {
  id: string;
  familia: string;
  endereco: string;
  dataVisita: string;
  tecnico: string;
  motivo: string;
  relatorio: string;
  situacaoEncontrada: string;
  encaminhamentos?: string[];
  status: 'agendada' | 'realizada' | 'cancelada' | 'redesignada';
  anexos?: string[];
};

export type Funcionario = {
  id: string;
  nome: string;
  cargo: string;
  registro: string;
  contato: string;
};
