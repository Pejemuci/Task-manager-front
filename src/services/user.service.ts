import api from './api';
import type { UpdateProfileData, UpdatePasswordData, ApiResponse, User } from '../types';

export const userService = {
  // Obtener perfil del usuario actual
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data.data!;
  },

  // Actualizar perfil
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.patch<ApiResponse<User>>('/users/profile', data);
    return response.data.data!;
  },

  // Cambiar contraseña
  async updatePassword(data: UpdatePasswordData): Promise<void> {
    await api.patch<ApiResponse>('/users/password', data);
  },
};
