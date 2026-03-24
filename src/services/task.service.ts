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
    console.log('[getTasks] respuesta cruda de la API:', JSON.stringify(data, null, 2));

    // Normaliza la respuesta paginada independientemente del formato que devuelva el backend:
    //   Formato A – envelope ApiResponse anidado: { success, data: { data|items|rows: Task[], total, page } }
    //   Formato B – paginación en raíz del envelope: { success?, data: Task[], total, page }
    //   Formato C – array crudo: Task[]

    const payload = data?.data;

    // Formato A: payload es un objeto que contiene el array bajo cualquier campo conocido
    if (payload !== null && payload !== undefined && !Array.isArray(payload) && typeof payload === 'object') {
      const nestedArray: Task[] | undefined =
        Array.isArray(payload.data)    ? payload.data    :
        Array.isArray(payload.items)   ? payload.items   :
        Array.isArray(payload.rows)    ? payload.rows    :
        Array.isArray(payload.results) ? payload.results :
        undefined;

      if (nestedArray !== undefined) {
        return {
          data: nestedArray,
          total: Number(payload.total ?? payload.count ?? payload.totalItems) || nestedArray.length,
          page:  Number(payload.page  ?? payload.currentPage) || 1,
        };
      }
    }

    // Formato B: payload es directamente el array de tareas, con total/page en la raíz
    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: Number(data.total ?? data.count ?? data.totalItems) || payload.length,
        page:  Number(data.page  ?? data.currentPage) || 1,
      };
    }

    // Formato C: la respuesta HTTP ES el array directamente (sin envoltorio)
    if (Array.isArray(data)) {
      return { data: data as Task[], total: data.length, page: 1 };
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
