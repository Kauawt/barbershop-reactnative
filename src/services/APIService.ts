// src/services/APIService.ts
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para pegar o token do Firebase
async function getFirebaseToken(forceRefresh = false) {
  if (Platform.OS === 'web') {
    if (forceRefresh) {
      const user = getAuth().currentUser;
      if (user) {
        const newToken = await user.getIdToken(true);
        localStorage.setItem('token', newToken);
        return newToken;
      }
    }
    return localStorage.getItem('token');
  } else {
    if (forceRefresh) {
      const user = getAuth().currentUser;
      if (user) {
        const newToken = await user.getIdToken(true);
        await SecureStore.setItemAsync('token', newToken);
        return newToken;
      }
    }
    return await SecureStore.getItemAsync('token');
  }
}

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
  try {
    const token = await getFirebaseToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Erro ao obter token:", error);
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Tenta atualizar o token
        const newToken = await getFirebaseToken(true);
        if (newToken) {
          // Atualiza o token no header
          error.config.headers.Authorization = `Bearer ${newToken}`;
          // Tenta a requisição novamente
          return api(error.config);
        }
      } catch (refreshError) {
        console.error("Erro ao atualizar token:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

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
    dataAgendamento: string;
    servicos: Array<{
      servico: string;
      quantidade: number;
    }>;
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
    dataAgendamento?: string;
    cliente?: string;
    usuario?: string;
    servicos?: Array<{
      servico: string;
      quantidade: number;
    }>;
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

// Barbeiros (usuários do tipo barbeiro)
const BarbeiroService = {
  getAll: async () => {
    try {
      const response = await api.get('/usuarios?tipo=barbeiro');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
      throw error;
    }
  }
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

  getById: async (id: string) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      throw error;
    }
  },

  getByFirebaseUid: async (firebase_uid: string) => {
    try {
      // Primeiro, buscar o usuário pelo firebase_uid
      const userResponse = await api.get(`/usuarios/firebase/${firebase_uid}`);
      if (userResponse.data && userResponse.data._id) {
        // Se encontrou o usuário, buscar o cliente pelo ID do MongoDB
        const clienteResponse = await api.get(`/clientes/${userResponse.data._id}`);
        return clienteResponse.data;
      }
      throw new Error('Usuário não encontrado');
    } catch (error) {
      console.error('Erro ao buscar cliente por firebase_uid:', error);
      throw error;
    }
  },

  create: async (clienteData: {
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
    phone?: string;
    address?: {
      street: string;
      number: string;
      city: string;
      state: string;
      zipCode: string;
    };
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

  getById: async (id: string) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  },

  getByFirebaseUid: async (firebase_uid: string) => {
    try {
      const response = await api.get(`/usuarios/firebase/${firebase_uid}`);
      // O backend deve retornar o token do MongoDB junto com os dados do usuário
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário por firebase_uid:', error);
      throw error;
    }
  },

  getBarbeiros: async () => {
    try {
      const response = await api.get('/usuarios/barbeiros');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
      throw error;
    }
  },

  create: async (usuarioData: {
    name: string;
    email: string;
    senha: string;
    role: string;
    firebase_uid: string;
    CPF?: string;
    dataNascimento?: string;
    endereco?: string;
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

// Exporta os serviços
export default {
  agendamento: AgendamentoService,
  cliente: ClienteService,
  servico: ServicoService,
  usuario: UsuarioService,
  barbeiro: BarbeiroService,
};