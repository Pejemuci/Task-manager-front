import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../types';
import { SortableTaskCard } from './SortableTaskCard';
import { Plus, ChevronDown } from 'lucide-react';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onQuickComplete: (taskId: string) => void;
  onQuickEdit: (task: Task) => void;
  onQuickDelete: (taskId: string) => void;
  onAddTask?: () => void;
  onSortChange?: (sortBy: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  onTaskClick,
  onQuickComplete,
  onQuickEdit,
  onQuickDelete,
  onAddTask,
  onSortChange,
}) => {
  const [sortBy, setSortBy] = useState('default');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const { setNodeRef } = useDroppable({
    id,
  });

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setShowSortMenu(false);
    if (onSortChange) {
      onSortChange(newSort);
    }
  };

  // Sort tasks based on selected option
  const sortedTasks = React.useMemo(() => {
    const tasksCopy = [...tasks];
    
    switch (sortBy) {
      case 'priority':
        return tasksCopy.sort((a, b) => {
          const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                 priorityOrder[b.priority as keyof typeof priorityOrder];
        });
      case 'dueDate':
        return tasksCopy.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      case 'assignedTo':
        return tasksCopy.sort((a, b) => {
          const nameA = a.assignedTo?.name || 'ZZZ';
          const nameB = b.assignedTo?.name || 'ZZZ';
          return nameA.localeCompare(nameB);
        });
      default:
        return tasksCopy;
    }
  }, [tasks, sortBy]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-w-[300px] flex flex-col">
      {/* Header with counter and sort */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            {title}
            <span className="text-sm font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </h3>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="p-1 hover:bg-white rounded transition-colors"
              title="Ordenar"
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            {showSortMenu && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[150px]">
                <button
                  onClick={() => handleSortChange('default')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    sortBy === 'default' ? 'bg-gray-100 font-medium' : ''
                  }`}
                >
                  Por defecto
                </button>
                <button
                  onClick={() => handleSortChange('priority')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    sortBy === 'priority' ? 'bg-gray-100 font-medium' : ''
                  }`}
                >
                  Por prioridad
                </button>
                <button
                  onClick={() => handleSortChange('dueDate')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    sortBy === 'dueDate' ? 'bg-gray-100 font-medium' : ''
                  }`}
                >
                  Por fecha
                </button>
                <button
                  onClick={() => handleSortChange('assignedTo')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    sortBy === 'assignedTo' ? 'bg-gray-100 font-medium' : ''
                  }`}
                >
                  Por asignado
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Add Button */}
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors border border-dashed border-gray-300 hover:border-gray-400"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva tarea</span>
          </button>
        )}
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className="flex-1 space-y-3 min-h-[200px]"
      >
        <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {sortedTasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onQuickComplete={() => onQuickComplete(task.id)}
              onQuickEdit={() => onQuickEdit(task)}
              onQuickDelete={() => onQuickDelete(task.id)}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No hay tareas
          </div>
        )}
      </div>
    </div>
  );
};
