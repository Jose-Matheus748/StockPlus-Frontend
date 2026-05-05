/**
 * Modelos TypeScript para as entidades da aplicação
 */

export enum TipoUsuario {
  CLIENTE = 'CLIENTE',
  LOJA = 'LOJA',
}

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  cpfOuCnpj: string;
  tipo: TipoUsuario;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  token?: string;
}

export interface Estoque {
  id?: number;
  nome: string;
  descricao?: string;
  usuarioId: number;
}

export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  fornecedor: string;
  marca: string;
  quantidade: number;
  precoUnitario: number;
  estoqueIds: number[];
}


export interface ValorTotalEstoque {
  valorTotal: number;
  quantidadeTotal: number;
}

export interface Protocolo {
  id?: number;
  nome: string;
  preco: number;
  lojaId: number; 
  itens: ItemProtocoloDTO[];
  valorTotal?: number;
}

export interface ItemProtocoloDTO {
  id?: number;
  produtoId: number;
  produtoNome?: string;
  quantidade: number;
  valorItem?: number;
}

export interface ItemProtocolo {
  id?: number;
  protocoloId: number;
  produtoId: number;
  quantidade: number;
}

export enum StatusPedido {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
}

export interface Pedido {
  id?: number;
  clienteId: number;
  lojaId: number;
  protocoloId: number;
  status: StatusPedido;
}
