import React from 'react';
import { Search } from 'lucide-react';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { TaskFilters as TaskFiltersType, User } from '../../types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: TaskFiltersType) => void;
  members: User[];
  hideStatusFilter?: boolean;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  members,
  hideStatusFilter = false,
}) => {
  return (
    <div className="bg-background-card rounded-xl p-4 shadow-card mb-6">
      <div className={`grid grid-cols-1 ${hideStatusFilter ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4`}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={filters.searchTerm || ''}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        {!hideStatusFilter && (
          <Select
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'PENDING', label: 'Pendiente' },
              { value: 'IN_PROGRESS', label: 'En Progreso' },
              { value: 'COMPLETED', label: 'Completada' },
            ]}
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
          />
        )}

        {/* Priority Filter */}
        <Select
          options={[
            { value: '', label: 'Todas las prioridades' },
            { value: 'LOW', label: 'Baja' },
            { value: 'MEDIUM', label: 'Media' },
            { value: 'HIGH', label: 'Alta' },
          ]}
          value={filters.priority || ''}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as any })}
        />

        {/* Assigned To Filter */}
        <Select
          options={[
            { value: '', label: 'Todos los usuarios' },
            ...members.map(member => ({
              value: member.id,
              label: member.name,
            })),
          ]}
          value={filters.assignedToId || ''}
          onChange={(e) => onFilterChange({ ...filters, assignedToId: e.target.value })}
        />
      </div>
    </div>
  );
};
