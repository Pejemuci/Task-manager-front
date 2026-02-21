import api from './api';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters, ApiResponse } from '../types';

export const taskService = {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);
    
    const { data } = await api.get<ApiResponse<Task[]>>(`/tasks?${params.toString()}`);
    return data.data || [];
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
