
export interface AtendimentoTuristico {
  id: string;
  cidadao: string;
  cpf: string;
  telefone: string;
  email: string;
  tipoAtendimento: 'Informações' | 'Reclamação' | 'Sugestão' | 'Agendamento' | 'Outro';
  assunto: string;
  descricao: string;
  status: 'Pendente' | 'Em Andamento' | 'Resolvido' | 'Cancelado';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  data: string;
  dataResolucao?: string;
  responsavel: string;
  observacoes: string;
}

export interface PontoTuristico {
  id: string;
  nome: string;
  tipo: 'Histórico' | 'Natural' | 'Cultural' | 'Religioso' | 'Gastronômico' | 'Outro';
  endereco: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  descricao: string;
  horarioFuncionamento: string;
  telefone: string;
  email: string;
  website: string;
  valorEntrada: number;
  acessibilidade: boolean;
  estacionamento: boolean;
  guiaDisponivel: boolean;
  fotos: string[];
  status: 'Ativo' | 'Inativo' | 'Em Manutenção';
  avaliacaoMedia: number;
  visitantesAno: number;
}

export interface EstabelecimentoLocal {
  id: string;
  nome: string;
  tipo: 'Hotel' | 'Pousada' | 'Restaurante' | 'Lanchonete' | 'Bar' | 'Loja de Souvenirs' | 'Agência de Turismo' | 'Outro';
  categoria: string;
  endereco: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  telefone: string;
  email: string;
  website: string;
  redesSociais: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  horarioFuncionamento: string;
  descricao: string;
  especialidades: string[];
  preco: 'Econômico' | 'Médio' | 'Alto' | 'Premium';
  avaliacaoMedia: number;
  fotos: string[];
  status: 'Ativo' | 'Inativo' | 'Temporariamente Fechado';
  certificacoes: string[];
}

export interface ProgramaTuristico {
  id: string;
  nome: string;
  tipo: 'City Tour' | 'Trilha Ecológica' | 'Tour Cultural' | 'Tour Gastronômico' | 'Tour Religioso' | 'Outro';
  descricao: string;
  duracao: string;
  preco: number;
  inclusos: string[];
  roteiro: {
    horario: string;
    local: string;
    atividade: string;
  }[];
  pontoEncontro: string;
  horarioSaida: string;
  capacidadeMaxima: number;
  idadeMinima: number;
  dificuldade: 'Fácil' | 'Moderada' | 'Difícil';
  equipamentosNecessarios: string[];
  observacoes: string;
  guia: string;
  telefoneContato: string;
  status: 'Ativo' | 'Inativo' | 'Sazonal';
  diasFuncionamento: string[];
}

export interface LocalMapaTuristico {
  id: string;
  nome: string;
  tipo: 'Ponto Turístico' | 'Estabelecimento' | 'Serviço Público' | 'Transporte' | 'Emergência';
  categoria: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  endereco: string;
  descricao: string;
  icone: string;
  cor: string;
  visibilidade: boolean;
  informacoesAdicionais: {
    telefone?: string;
    horario?: string;
    website?: string;
  };
}

export interface InformacaoTuristica {
  id: string;
  titulo: string;
  tipo: 'Evento' | 'Notícia' | 'Dica' | 'Alerta' | 'Promoção' | 'Guia';
  categoria: string;
  conteudo: string;
  resumo: string;
  autor: string;
  dataPublicacao: string;
  dataVencimento?: string;
  tags: string[];
  imagem: string;
  anexos: string[];
  status: 'Publicado' | 'Rascunho' | 'Arquivado';
  destaque: boolean;
  visualizacoes: number;
  publicoAlvo: 'Turistas' | 'Moradores' | 'Empresários' | 'Todos';
}
