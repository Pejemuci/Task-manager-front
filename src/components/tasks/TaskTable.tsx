import React from 'react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onTaskClick }) => {
  const statusLabels = {
    PENDING: 'Pendiente',
    IN_PROGRESS: 'En Progreso',
    COMPLETED: 'Completada',
  };

  const priorityLabels = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-background-card rounded-xl p-8 text-center">
        <p className="text-text-secondary">No hay tareas para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-background-card rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary border-b border-border">
            <tr>
              <th className="px-6 py-4 text-white text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-4 text-white text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-white text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-4 text-white text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Asignado a
              </th>
              <th className="px-6 py-4 text-white text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Fecha límite
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`cursor-pointer transition-colors hover:bg-primary-light ${
                  task.isOverdue ? 'bg-red-50' : ''
                }`}
              >
                {/* Título */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-text-primary">
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-sm text-text-secondary line-clamp-1 mt-1">
                        {task.description}
                      </span>
                    )}
                  </div>
                </td>

                {/* Estado */}
                <td className="px-6 py-4">
                  <Badge variant={task.status}>
                    {statusLabels[task.status]}
                  </Badge>
                </td>

                {/* Prioridad */}
                <td className="px-6 py-4">
                  <Badge variant={task.priority}>
                    {priorityLabels[task.priority]}
                  </Badge>
                </td>

                {/* Asignado a */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-text-secondary" />
                    <span className="text-sm text-text-primary">
                      {task.assignedTo?.name || 'Sin asignar'}
                    </span>
                  </div>
                </td>

                {/* Fecha límite */}
                <td className="px-6 py-4">
                  {task.dueDate ? (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-text-secondary" />
                      <span
                        className={`text-sm ${
                          task.isOverdue
                            ? 'text-red-600 font-medium'
                            : 'text-text-primary'
                        }`}
                      >
                        {format(new Date(task.dueDate), "dd MMM yyyy", { locale: es })}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-text-secondary">Sin fecha</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
