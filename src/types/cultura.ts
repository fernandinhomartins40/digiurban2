
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
