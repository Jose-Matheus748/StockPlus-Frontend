

  export enum TipoUsuario {
    CLIENTE = 'CLIENTE',
    LOJA = 'LOJA',
  }

  export interface Usuario {
    id?: number;
    nome: string;
    email: string;
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

  export type StatusPedido = 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

  export type FiltroStatus = StatusPedido | 'TODOS';

  export interface ItemPedido {
    protocoloId: number;
    protocoloNome: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }

  export interface ProtocoloPedido {
    protocoloId: number;
    protocoloNome?: string;
    valorTotal?: number;
  }

  export interface Pedido {
    id?: number;
    clienteId: number;
    clienteNome: string;
    lojaId: number;
    status: StatusPedido;
    itens: ItemPedido[];
    valorTotal: number;
    criadoEm?: string;
    atualizadoEm?: string;
  }

  export interface LojaPublica {
    id: number;
    nome: string;
    email: string;
    descricao?: string;
  }
  export interface PedidoExterno {
    id?: number;
    clienteId: number;
    clienteNome?: string;
    lojaId: number;
    lojaNome?: string;
    protocoloIds?: number[];
    protocolos?: ProtocoloPedido[];
    valorTotal?: number;
    status?: StatusPedido;
    dataCriacao?: string;
  }
  export interface CriarPedidoRequest {
    clienteId: number;
    lojaId: number;
    protocoloIds: number[];
  }
