import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, ApiResponse } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (data.success && data.data) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    }
    throw new Error('Error al iniciar sesión');
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', registerData);
    if (data.success && data.data) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    }
    throw new Error('Error al registrar usuario');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
