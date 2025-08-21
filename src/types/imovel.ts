
export interface Imovel {
  id: number;
  codigo: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  tipo: 'aluguel' | 'venda';
  valor: number;
  descricao?: string;
  foto_capa?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Agendamento {
  id: number;
  id_imovel: number;
  nome_cliente: string;
  data_hora: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ImovelWithAgendamento extends Imovel {
  agendamento?: Agendamento;
}
