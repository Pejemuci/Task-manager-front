import React from 'react';
import { clsx } from 'clsx';
import { TaskStatus, TaskPriority } from '../../types';

interface BadgeProps {
  variant: TaskStatus | TaskPriority | 'default';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className }) => {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
  
  const variants = {
    // Task Status
    PENDING: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-gray-100 text-gray-700', // Sin color especial (gris neutro)
    COMPLETED: 'bg-green-100 text-green-700',  // Verde para completadas
    
    // Task Priority
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-orange-100 text-orange-700',
    HIGH: 'bg-red-100 text-red-700',
    
    // Default
    default: 'bg-primary-light text-primary',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
};
