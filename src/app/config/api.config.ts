export const API_CONFIG = {
  baseURL: 'http://localhost:8080',
  timeout: 30000,
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
  },

  usuarios: {
    create: '/usuarios',
    getAll: '/usuarios',
    getById: (id: number) => `/usuarios/${id}`,
    update: (id: number) => `/usuarios/${id}`,
    delete: (id: number) => `/usuarios/${id}`,
  },

  estoques: {
    create: '/estoques',
    getAll: '/estoques',
    getById: (id: number) => `/estoques/${id}`,
    update: (id: number) => `/estoques/${id}`,
    delete: (id: number) => `/estoques/${id}`,
    listarProdutos: (id: number) => `/estoques/${id}/produtos`,
    calcularValorTotal: (id: number) => `/estoques/${id}/valor-total`,

    meusEstoques: '/estoques/meus-estoques',
  },

  produtos: {
    create: '/produtos',
    getAll: '/produtos',
    getById: (id: number) => `/produtos/${id}`,
    update: (id: number) => `/produtos/${id}`,
    delete: (id: number) => `/produtos/${id}`,
    addQuantidade: (id: number) => `/produtos/${id}/add`,
    removeQuantidade: (id: number) => `/produtos/${id}/remove`,
    getValorTotal: '/produtos/valor-total',
    listarPorUsuario: (usuarioId: number) => `/produtos/meus-produtos?usuarioId=${usuarioId}`,
  },

  protocolos: {
    getAll: '/protocolos',
    create: '/protocolos',
    getById: (id: number) => `/protocolos/${id}`,
    getByUsuario: (usuarioId: number) => `/protocolos/usuario/${usuarioId}`,
    update: (id: number) => `/protocolos/${id}`,
    delete: (id: number) => `/protocolos/${id}`,

    addItem: (protocoloId: number) => `/protocolos/${protocoloId}/itens`,
    removeItem: (itemId: number) => `/protocolos/itens/${itemId}`,

    getItens: (protocoloId: number) => `/protocolos/${protocoloId}/itens`,
  }
};
