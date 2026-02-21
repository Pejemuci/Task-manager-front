import { useCallback, useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import { taskService } from '../services/task.service';
import toast from 'react-hot-toast';

interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export const useKanban = (tasks: Task[]) => {
  // Organizar tareas por columnas (usa useMemo para optimizar)
  const columns = useMemo((): KanbanColumn[] => {
    return [
      {
        id: 'PENDING',
        title: 'Pendiente',
        tasks: tasks.filter(t => t.status === 'PENDING'),
      },
      {
        id: 'IN_PROGRESS',
        title: 'En Progreso',
        tasks: tasks.filter(t => t.status === 'IN_PROGRESS'),
      },
      {
        id: 'COMPLETED',
        title: 'Completado',
        tasks: tasks.filter(t => t.status === 'COMPLETED'),
      },
    ];
  }, [tasks]);

  // Mover tarea a otra columna
  const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      // Actualizar en backend
      await taskService.updateTask(taskId, { status: newStatus });
    } catch (error) {
      toast.error('Error al mover la tarea');
      throw error; // Propagar error para que el componente lo maneje
    }
  }, [tasks]);

  return {
    columns,
    moveTask,
  };
};
