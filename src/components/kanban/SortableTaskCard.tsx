import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { TaskCard } from '../tasks/TaskCard';

interface SortableTaskCardProps {
  task: Task;
  onClick: () => void;
  onQuickComplete: () => void;
  onQuickEdit: () => void;
  onQuickDelete: () => void;
}

export const SortableTaskCard: React.FC<SortableTaskCardProps> = ({
  task,
  onClick,
  onQuickComplete,
  onQuickEdit,
  onQuickDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onClick={onClick}
        onQuickComplete={onQuickComplete}
        onQuickEdit={onQuickEdit}
        onQuickDelete={onQuickDelete}
      />
    </div>
  );
};
