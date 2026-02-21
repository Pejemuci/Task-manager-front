import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'green' | 'purple' | 'red';
  percentage?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  percentage,
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {percentage !== undefined && (
            <p className="text-text-secondary text-sm mt-2">
              {percentage}% del total
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};
