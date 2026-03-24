import api from './api';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters, PaginatedResponse } from '../types';

export const taskService = {
  async getTasks(filters?: TaskFilters, page?: number, limit?: number): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));

    const { data } = await api.get<any>(`/tasks?${params.toString()}`);

    // Formato A: { success, data: { data: Task[], total, page } }  ← anidado
    const payload = data?.data;
    if (payload && !Array.isArray(payload) && Array.isArray(payload.data)) {
      return {
        data: payload.data,
        total: Number(payload.total) || 0,
        page: Number(payload.page) || 1,
      };
    }

    // Formato B: { success, data: Task[], total, page }  ← paginación en raíz del envelope
    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: Number(data.total) || payload.length,
        page: Number(data.page) || 1,
      };
    }

    // Formato C: { data: Task[], total, page }  ← sin wrapper success
    if (Array.isArray(data?.data) === false && Array.isArray(data)) {
      return { data: data as Task[], total: (data as any).length, page: 1 };
    }

    return { data: [], total: 0, page: 1 };
  },

  async getTask(id: string): Promise<Task> {
    const { data } = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    if (data.data) {
      return data.data;
    }
    throw new Error('Tarea no encontrada');
  },

  async createTask(taskData: CreateTaskData): Promise<Task> {
    const { data } = await api.post<ApiResponse<Task>>('/tasks', taskData);
    if (data.data) {
      return data.data;
    }
    throw new Error('Error al crear tarea');
  },

  async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
    const { data} = await api.put<ApiResponse<Task>>(`/tasks/${id}`, taskData);
    if (data.data) {
      return data.data;
    }
    throw new Error('Error al actualizar tarea');
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
