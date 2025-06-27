// src/services/APIService.ts
import axios from 'axios';
import { useAuth } from '../context/auth'
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store'
import Constants from 'expo-constants'
import { router } from 'expo-router';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.15.16:5000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('token');
}
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Trata respostas 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Token inválido ou ausente. Redirecionando para login...");
      await SecureStore.deleteItemAsync('token');
      router.replace('/login');
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
    dataAgendamento: Date;
    servicos: Array<{
      servico: string;
      quantidade: number;
    }>;
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
    servicos?: Array<{
      servico: string;
      quantidade: number;
    }>;
    total?: number;
    status?: string;
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

  getByFirebaseUid: async (firebase_uid: string) => {
    try {
      const response = await api.get(`/clientes/firebase/${firebase_uid}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cliente por firebase_uid:', error);
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

  getBarbeiros: async () => {
    try {
      const response = await api.get('/usuarios/barbeiros');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
      throw error;
    }
  },

  getByFirebaseUid: async (firebase_uid: string) => {
    try {
      const response = await api.get(`/usuarios/firebase/${firebase_uid}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário por firebase_uid:', error);
      throw error;
    }
  },

  create: async (usuarioData: {
    name: string;
    email: string;
    senha: string;
    telefone: string;
    role: string;
    firebase_uid: string;
    salario?: number;
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

// Exporta os serviços
export default {
  agendamento: AgendamentoService,
  cliente: ClienteService,
  servico: ServicoService,
  usuario: UsuarioService,
  barbeiro: BarbeiroService,
};