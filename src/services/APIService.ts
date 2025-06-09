// src/services/APIService.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviço de Agendamento
const AgendamentoService = {
  getAll: async () => {
    try {
      const response = await api.get('/agendamentos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/agendamentos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      throw error;
    }
  },

  create: async (agendamentoData: {
    cliente: string;
    usuario: string;
    dataAgendamento: Date;
    total: number;
  }) => {
    try {
      const response = await api.post('/agendamentos', agendamentoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  update: async (id: string, updateData: {
    dataAgendamento?: Date;
    cliente?: string;
    usuario?: string;
  }) => {
    try {
      const response = await api.put(`/agendamentos/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/agendamentos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      throw error;
    }
  },
};

// Serviço de Cliente
const ClienteService = {
  getAll: async () => {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  },

  create: async (clienteData: {
    firebase_uid: string;
    name: string;
    email: string;
    senha: string;
    CPF: string;
    dataNascimento: string;
    endereco: string;
    role: string;
  }) => {
    try {
      const response = await api.post('/clientes', clienteData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  update: async (id: string, updateData: {
    name?: string;
    email?: string;
    senha?: string;
    chaveSeguraRecuperaSenha?: string;
    role?: string;
  }) => {
    try {
      const response = await api.put(`/clientes/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  },
};

// Serviço de Serviço
const ServicoService = {
  getAll: async () => {
    try {
      const response = await api.get('/servicos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      throw error;
    }
  },

  create: async (servicoData: {
    name: string;
    price: number;
    duracao: number;
    isActive: boolean;
  }) => {
    try {
      const response = await api.post('/servicos', servicoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw error;
    }
  },

  update: async (id: string, updateData: {
    name?: string;
    price?: number;
    duracao?: number;
    isActive?: boolean;
  }) => {
    try {
      const response = await api.put(`/servicos/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/servicos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      throw error;
    }
  },
};

// Serviço de SolicitarServico
const SolicitarServicoService = {
  getAll: async () => {
    try {
      const response = await api.get('/solicitarservicos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/solicitarservicos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
  },

  create: async (solicitacaoData: {
    servico: string;
    quantidade: number;
    preco: number;
    total: number;
    agendamento: string;
  }) => {
    try {
      const response = await api.post('/solicitarservicos', solicitacaoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  },

  update: async (id: string, updateData: {
    servico?: string;
    quantidade?: number;
    agendamento?: string;
  }) => {
    try {
      const response = await api.put(`/solicitarservicos/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/solicitarservicos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar solicitação:', error);
      throw error;
    }
  },
};

// Serviço de Usuário
const UsuarioService = {
  getAll: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  create: async (usuarioData: {
    name: string;
    email: string;
    senha: string;
    telefone: string;
    role: string;
  }) => {
    try {
      const response = await api.post('/usuarios', usuarioData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  update: async (id: string, updateData: {
    name?: string;
    email?: string;
    senha?: string;
    telefone?: string;
    role?: string;
  }) => {
    try {
      const response = await api.put(`/usuarios/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  },
};

export default {
  agendamento: AgendamentoService,
  cliente: ClienteService,
  servico: ServicoService,
  solicitarServico: SolicitarServicoService,
  usuario: UsuarioService,
};