import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { Pagination } from '../components/ui/Pagination';
import { Loading } from '../components/ui/Loading';
import { Plus } from 'lucide-react';
import { taskService } from '../services/task.service';
import { organizationService } from '../services/organization.service';
import { Task, TaskFilters as TaskFiltersType, User, CreateTaskData } from '../types';
import toast from 'react-hot-toast';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [members, setMembers] = useState<User[]>([]);
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Resetear a página 1 cuando cambian los filtros enviados al servidor
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.status, filters.priority, filters.assignedToId]);

  // Recargar cuando cambia la página o los filtros del servidor
  useEffect(() => {
    loadData(currentPage, {
      status: filters.status,
      priority: filters.priority,
      assignedToId: filters.assignedToId,
    });
  }, [currentPage, filters.status, filters.priority, filters.assignedToId]);

  const loadData = async (page = currentPage, apiFilters: Pick<TaskFiltersType, 'status' | 'priority' | 'assignedToId'> = {}) => {
    try {
      const [response, membersData] = await Promise.all([
        taskService.getTasks(apiFilters, page, itemsPerPage),
        organizationService.getMembers(),
      ]);
      setTasks(Array.isArray(response.data) ? response.data : []);
      setTotal(Number(response.total) || 0);
      setMembers(membersData);
    } catch (error) {
      toast.error('Error al cargar las tareas');
    } finally {
      setIsLoading(false);
    }
  };

  const reload = () => loadData(currentPage, {
    status: filters.status,
    priority: filters.priority,
    assignedToId: filters.assignedToId,
  });

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      await taskService.createTask(data);
      toast.success('Tarea creada exitosamente');
      reload();
    } catch (error) {
      // El error ya se muestra en el interceptor de Axios
      throw error;
    }
  };

  const handleUpdateTask = async (data: CreateTaskData) => {
    if (!editingTask) return;
    try {
      await taskService.updateTask(editingTask.id, data);
      toast.success('Tarea actualizada exitosamente');
      setEditingTask(undefined);
      reload();
    } catch (error) {
      // El error ya se muestra en el interceptor de Axios
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await taskService.deleteTask(taskId);
        toast.success('Tarea eliminada exitosamente');
        reload();
      } catch (error) {
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  if (isLoading) {
    return (
      <Layout title="Tasks">
        <Loading text="Cargando tareas..." />
      </Layout>
    );
  }

  // Filtros client-side sobre la página recibida (showCompleted y searchTerm)
  const displayTasks = (Array.isArray(tasks) ? tasks : []).filter(task => {
    if (!showCompleted && task.status === 'COMPLETED') return false;
    if (filters.searchTerm) {
      const s = filters.searchTerm.toLowerCase();
      return task.title.toLowerCase().includes(s) || task.description?.toLowerCase().includes(s);
    }
    return true;
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <Layout title="Tasks">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Gestión de Tareas</h2>
          <p className="text-text-secondary mt-1">
            {total} {total === 1 ? 'tarea' : 'tareas'}
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nueva Tarea
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFilterChange={setFilters}
        members={members}
      />

      {/* Toggle Mostrar Completadas */}
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary cursor-pointer"
          />
          <span className="text-sm text-text-primary font-medium">
            Mostrar tareas completadas
          </span>
        </label>
      </div>

      {/* Tasks Table */}
      <TaskTable tasks={displayTasks} onTaskClick={handleViewTask} />

      {/* Pagination */}
      {total > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        members={members}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        onEdit={(task) => {
          setIsDetailModalOpen(false);
          handleEditTask(task);
        }}
      />
    </Layout>
  );
};
