import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  priorityFilter: string;
  onPriorityChange: (value: string) => void;
  assignedFilter: string;
  onAssignedChange: (value: string) => void;
  members: Array<{ id: string; name: string }>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  assignedFilter,
  onAssignedChange,
  members,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="min-w-[150px]">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">Todas las prioridades</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
        </div>

        {/* Assigned Filter */}
        <div className="min-w-[150px]">
          <select
            value={assignedFilter}
            onChange={(e) => onAssignedChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">Todos los asignados</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || priorityFilter || assignedFilter) && (
          <button
            onClick={() => {
              onSearchChange('');
              onPriorityChange('');
              onAssignedChange('');
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};
