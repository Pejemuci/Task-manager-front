import React from 'react';
import { Task } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { 
  Calendar, 
  User as UserIcon, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!task) return null;

  const statusConfig = {
    PENDING: {
      label: 'Pendiente',
      icon: Circle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100',
    },
    IN_PROGRESS: {
      label: 'En Progreso',
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    COMPLETED: {
      label: 'Completada',
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-100',
    },
  };

  const priorityConfig = {
    LOW: { label: 'Baja', color: 'text-gray-500', bg: 'bg-gray-100' },
    MEDIUM: { label: 'Media', color: 'text-yellow-500', bg: 'bg-yellow-100' },
    HIGH: { label: 'Alta', color: 'text-red-500', bg: 'bg-red-100' },
  };

  const currentStatus = statusConfig[task.status];
  const currentPriority = priorityConfig[task.priority];
  const StatusIcon = currentStatus.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de Tarea"
      size="lg"
    >
      <div className="space-y-6">
        {/* Overdue Alert */}
        {task.isOverdue && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Tarea Vencida</p>
              <p className="text-xs text-red-600 mt-1">
                Esta tarea ha superado su fecha límite
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            {task.title}
          </h3>
        </div>

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-3">
          {/* Status */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${currentStatus.bg}`}>
            <StatusIcon className={`h-4 w-4 ${currentStatus.color}`} />
            <span className={`text-sm font-medium ${currentStatus.color}`}>
              {currentStatus.label}
            </span>
          </div>

          {/* Priority */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${currentPriority.bg}`}>
            <div className={`h-2 w-2 rounded-full ${currentPriority.color.replace('text', 'bg')}`} />
            <span className={`text-sm font-medium ${currentPriority.color}`}>
              Prioridad {currentPriority.label}
            </span>
          </div>

          {/* Overdue Badge */}
          {task.isOverdue && (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-100">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">
                Vencida
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Descripción
            </h4>
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assigned To */}
          <div className="bg-background rounded-xl p-4">
            <div className="flex items-center space-x-2 text-text-secondary mb-2">
              <UserIcon className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Asignado a</span>
            </div>
            <p className="text-text-primary font-medium">
              {task.assignedTo?.name || 'Sin asignar'}
            </p>
            {task.assignedTo && (
              <p className="text-xs text-text-secondary mt-1">
                {task.assignedTo.email}
              </p>
            )}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="bg-background rounded-xl p-4">
              <div className="flex items-center space-x-2 text-text-secondary mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">Fecha límite</span>
              </div>
              <p className={`font-medium ${task.isOverdue ? 'text-red-600' : 'text-text-primary'}`}>
                {format(new Date(task.dueDate), "dd 'de' MMMM, yyyy", { locale: es })}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {format(new Date(task.dueDate), 'HH:mm')} hrs
              </p>
            </div>
          )}

          {/* Created By */}
          <div className="bg-background rounded-xl p-4">
            <div className="flex items-center space-x-2 text-text-secondary mb-2">
              <UserIcon className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Creado por</span>
            </div>
            <p className="text-text-primary font-medium">
              {task.createdBy.name}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {task.createdBy.email}
            </p>
          </div>

          {/* Created At */}
          <div className="bg-background rounded-xl p-4">
            <div className="flex items-center space-x-2 text-text-secondary mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Fecha creación</span>
            </div>
            <p className="text-text-primary font-medium">
              {format(new Date(task.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {format(new Date(task.createdAt), 'HH:mm')} hrs
            </p>
          </div>
        </div>

        {/* Actions */}
        {onEdit && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onEdit(task);
                onClose();
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              Editar Tarea
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
