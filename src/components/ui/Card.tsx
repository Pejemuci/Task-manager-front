import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        'bg-background-card rounded-2xl shadow-card p-6',
        hover && 'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
