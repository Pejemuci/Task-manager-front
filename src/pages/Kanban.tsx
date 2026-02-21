import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Layout } from '../components/layout/Layout';
import { Loading } from '../components/ui/Loading';
import { KanbanColumn } from '../components/kanban/KanbanColumn';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { FilterBar } from '../components/kanban/FilterBar';
import { taskService } from '../services/task.service';
import { organizationService } from '../services/organization.service';
import { Task, CreateTaskData, User } from '../types';

interface Member {
  id: string;
  name: string;
  email: string;
}

export const Kanban: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<string>('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const tasksData = await taskService.getTasks();
      const membersData = await organizationService.getMembers();
      setTasks(tasksData);
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (priorityFilter && task.priority !== priorityFilter) {
        return false;
      }

      if (assignedFilter && task.assignedTo?.id !== assignedFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchTerm, priorityFilter, assignedFilter]);

  const pendingTasks = filteredTasks.filter((t) => t.status === 'PENDING');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = filteredTasks.filter((t) => t.status === 'COMPLETED');

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const VALID_STATUSES: string[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    // over.id puede ser el ID de una columna (status válido) o el ID de otra tarea (UUID).
    // Solo procedemos si over.id corresponde a una columna válida.
    const newStatus = over.id as string;
    if (!VALID_STATUSES.includes(newStatus)) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as any } : t))
      );

      await taskService.updateTask(taskId, { status: newStatus } as any);
      await loadData();
    } catch (error) {
      console.error('Error updating task:', error);
      await loadData();
    }
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setNewTaskStatus('');
    setIsModalOpen(true);
  };

  const handleQuickComplete = async (taskId: string) => {
    try {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: 'COMPLETED' as any } : t))
      );
      await taskService.updateTask(taskId, { status: 'COMPLETED' } as any);
      await loadData();
    } catch (error) {
      console.error('Error completing task:', error);
      await loadData();
    }
  };

  const handleQuickEdit = (task: Task) => {
    setEditingTask(task);
    setNewTaskStatus('');
    setIsModalOpen(true);
  };

  const handleQuickDelete = async (taskId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddTask = (status: string) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: CreateTaskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, data);
      } else {
        const taskData = newTaskStatus ? { ...data, status: newTaskStatus as any } : data;
        await taskService.createTask(taskData);
      }
      await loadData();
      setIsModalOpen(false);
      setEditingTask(null);
      setNewTaskStatus('');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (loading) {
    return (
      <Layout title="Kanban">
        <Loading text="Cargando tablero..." />
      </Layout>
    );
  }

  return (
    <Layout title="Kanban">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vista Kanban</h1>
            <p className="text-gray-600 mt-1">
              Arrastra las tareas para cambiar su estado
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setNewTaskStatus('');
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Nueva Tarea
          </button>
        </div>

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          assignedFilter={assignedFilter}
          onAssignedChange={setAssignedFilter}
          members={members}
        />

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            <KanbanColumn
              id="PENDING"
              title="Pendiente"
              tasks={pendingTasks}
              onTaskClick={handleTaskClick}
              onQuickComplete={handleQuickComplete}
              onQuickEdit={handleQuickEdit}
              onQuickDelete={handleQuickDelete}
              onAddTask={() => handleAddTask('PENDING')}
            />
            <KanbanColumn
              id="IN_PROGRESS"
              title="En Progreso"
              tasks={inProgressTasks}
              onTaskClick={handleTaskClick}
              onQuickComplete={handleQuickComplete}
              onQuickEdit={handleQuickEdit}
              onQuickDelete={handleQuickDelete}
              onAddTask={() => handleAddTask('IN_PROGRESS')}
            />
            <KanbanColumn
              id="COMPLETED"
              title="Completado"
              tasks={completedTasks}
              onTaskClick={handleTaskClick}
              onQuickComplete={handleQuickComplete}
              onQuickEdit={handleQuickEdit}
              onQuickDelete={handleQuickDelete}
              onAddTask={() => handleAddTask('COMPLETED')}
            />
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="opacity-80">
                <TaskCard task={activeTask} onClick={() => { }} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Task Form Modal */}
        {isModalOpen && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(null);
              setNewTaskStatus('');
            }}
            onSubmit={handleModalSubmit}
            task={editingTask || undefined}
            members={members}
          />
        )}
      </div>
    </Layout>
  );
};
