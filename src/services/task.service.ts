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

    // Normaliza la respuesta paginada al formato interno { data, total, page }.
    // El backend devuelve: { success, data: { tasks: Task[], limit, totalPages } }

    const payload = data?.data;

    // Formato A – envelope anidado: data.data es un objeto con el array bajo algún campo
    if (payload !== null && payload !== undefined && !Array.isArray(payload) && typeof payload === 'object') {
      const nestedArray: Task[] | undefined =
        Array.isArray(payload.tasks)   ? payload.tasks   :
        Array.isArray(payload.data)    ? payload.data    :
        Array.isArray(payload.items)   ? payload.items   :
        Array.isArray(payload.rows)    ? payload.rows    :
        Array.isArray(payload.results) ? payload.results :
        undefined;

      if (nestedArray !== undefined) {
        const totalPages = Number(payload.totalPages ?? payload.pageCount ?? 1);
        const perPage    = Number(payload.limit ?? payload.pageSize ?? nestedArray.length) || nestedArray.length;
        return {
          data:  nestedArray,
          total: Number(payload.total ?? payload.count ?? payload.totalItems) || (totalPages * perPage),
          page:  Number(payload.page  ?? payload.currentPage) || 1,
        };
      }
    }

    // Formato B – array en data.data, con total/page en la raíz del envelope
    if (Array.isArray(payload)) {
      const totalPages = Number(data.totalPages ?? data.pageCount ?? 1);
      const perPage    = Number(data.limit ?? data.pageSize ?? payload.length) || payload.length;
      return {
        data:  payload,
        total: Number(data.total ?? data.count ?? data.totalItems) || (totalPages * perPage),
        page:  Number(data.page  ?? data.currentPage) || 1,
      };
    }

    // Formato C – la respuesta HTTP es el array directamente
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
