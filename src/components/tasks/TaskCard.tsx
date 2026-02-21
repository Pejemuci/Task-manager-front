import React, { useState } from 'react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, Edit2, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onQuickComplete?: () => void;
  onQuickEdit?: () => void;
  onQuickDelete?: () => void;
}

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-500';
    case 'MEDIUM':
      return 'bg-yellow-500';
    case 'LOW':
      return 'bg-green-500';
    default:
      return 'bg-gray-400';
  }
};

const getPriorityLabel = (priority: string): string => {
  switch (priority) {
    case 'HIGH':
      return 'Alta';
    case 'MEDIUM':
      return 'Media';
    case 'LOW':
      return 'Baja';
    default:
      return priority;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick,
  onQuickComplete,
  onQuickEdit,
  onQuickDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  const handleQuickAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer
        border-l-4 ${getPriorityColor(task.priority)}
        ${isOverdue ? 'bg-red-50' : ''}
      `}
    >
      {/* Quick Actions */}
      {isHovered && task.status !== 'COMPLETED' && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white rounded-lg shadow-lg p-1 z-10">
          {onQuickComplete && task.status !== 'COMPLETED' && (
            <button
              onClick={(e) => handleQuickAction(e, onQuickComplete)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Completar"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          {onQuickEdit && (
            <button
              onClick={(e) => handleQuickAction(e, onQuickEdit)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onQuickDelete && (
            <button
              onClick={(e) => handleQuickAction(e, onQuickDelete)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-gray-900 flex-1 line-clamp-2">
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'default' : 'warning'}>
              {task.status === 'COMPLETED' ? 'Completada' : task.status === 'IN_PROGRESS' ? 'En progreso' : 'Pendiente'}
            </Badge>
            <span className="text-xs text-gray-500">
              {getPriorityLabel(task.priority)}
            </span>
          </div>

          {task.assignedTo && (
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
                {task.assignedTo.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {task.dueDate && (
          <div className={`mt-2 text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {isOverdue ? '⚠️ Vencida: ' : '📅 '}
            {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: es })}
          </div>
        )}
      </div>
    </div>
  );
};
