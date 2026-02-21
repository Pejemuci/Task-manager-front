import React from 'react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { Calendar, User as UserIcon, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface KanbanCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onClick }) => {
  const priorityConfig = {
    LOW: { label: 'Baja', variant: 'default' as const },
    MEDIUM: { label: 'Media', variant: 'MEDIUM' as const },
    HIGH: { label: 'Alta', variant: 'HIGH' as const },
  };

  const currentPriority = priorityConfig[task.priority];

  return (
    <div
      onClick={() => onClick(task)}
      className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md group ${
        task.isOverdue ? 'border-red-300' : 'border-border'
      }`}
    >
      {/* Overdue Badge */}
      {task.isOverdue && (
        <div className="flex items-center space-x-1 text-xs text-red-600 mb-2 bg-red-50 px-2 py-1 rounded-lg w-fit">
          <AlertCircle className="h-3 w-3" />
          <span className="font-medium">Vencida</span>
        </div>
      )}

      {/* Title */}
      <h4 className="font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Priority Badge */}
      <div className="mb-3">
        <Badge variant={currentPriority.variant} className="text-xs">
          {currentPriority.label}
        </Badge>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-secondary pt-2 border-t border-border">
        {/* Assigned to */}
        <div className="flex items-center space-x-1">
          <UserIcon className="h-3 w-3" />
          <span className="truncate max-w-[100px]">
            {task.assignedTo?.name || 'Sin asignar'}
          </span>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className={`flex items-center space-x-1 ${task.isOverdue ? 'text-red-500 font-medium' : ''}`}>
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(task.dueDate), 'dd MMM', { locale: es })}</span>
          </div>
        )}
      </div>
    </div>
  );
};
