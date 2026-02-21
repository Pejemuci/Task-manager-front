import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { MetricCard } from '../components/dashboard/MetricCard';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { CheckSquare, Clock, TrendingUp, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { taskService } from '../services/task.service';
import { Task, DashboardStats } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
  });
  const [highPriorityTasks, setHighPriorityTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Cargar todas las tareas
      const allTasks = await taskService.getTasks();
      
      // Calcular estadísticas
      const dashboardStats: DashboardStats = {
        total: allTasks.length,
        pending: allTasks.filter(t => t.status === 'PENDING').length,
        inProgress: allTasks.filter(t => t.status === 'IN_PROGRESS').length,
        completed: allTasks.filter(t => t.status === 'COMPLETED').length,
        highPriority: allTasks.filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED').length,
      };
      setStats(dashboardStats);

      // Tareas vencidas (no completadas)
      const overdue = allTasks
        .filter(t => t.isOverdue && t.status !== 'COMPLETED')
        .slice(0, 6);
      setOverdueTasks(overdue);

      // Tareas de alta prioridad no completadas (máximo 6)
      const highPriority = allTasks
        .filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED')
        .slice(0, 6);
      setHighPriorityTasks(highPriority);
    } catch (error) {
      toast.error('Error al cargar el dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    navigate('/tasks', { state: { editTask: task } });
  };

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <Loading text="Cargando dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <MetricCard
          title="Total de Tareas"
          value={stats.total}
          icon={CheckSquare}
          color="blue"
        />
        <MetricCard
          title="Pendientes"
          value={stats.pending}
          icon={Clock}
          color="yellow"
          percentage={stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}
        />
        <MetricCard
          title="En Progreso"
          value={stats.inProgress}
          icon={TrendingUp}
          color="purple"
          percentage={stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}
        />
        <MetricCard
          title="Completadas"
          value={stats.completed}
          icon={CheckCircle2}
          color="green"
          percentage={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
        />
        <MetricCard
          title="Alta Prioridad"
          value={stats.highPriority}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Tareas Vencidas Alert */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              Tienes {overdueTasks.length} tarea{overdueTasks.length > 1 ? 's' : ''} vencida{overdueTasks.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Revisa las tareas que han superado su fecha límite
            </p>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tareas Vencidas */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Tareas Vencidas
          </h2>
          {overdueTasks.length > 0 ? (
            <div className="space-y-4">
              {overdueTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={handleViewTask}
                  onEdit={handleEditTask}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-text-secondary text-center py-8">
                No hay tareas vencidas
              </p>
            </Card>
          )}
        </div>

        {/* Tareas de Alta Prioridad */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Alta Prioridad
          </h2>
          {highPriorityTasks.length > 0 ? (
            <div className="space-y-4">
              {highPriorityTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={handleViewTask}
                  onEdit={handleEditTask}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-text-secondary text-center py-8">
                No hay tareas de alta prioridad pendientes
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        onEdit={handleEditTask}
      />
    </Layout>
  );
};
