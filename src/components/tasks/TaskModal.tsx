import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Task, CreateTaskData, User } from '../../types';

const taskSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
});

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  task?: Task;
  members: User[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  members,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'PENDING',
      priority: 'MEDIUM',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedToId: task.assignedToId || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: '',
        assignedToId: '',
      });
    }
  }, [task, reset]);

  const handleFormSubmit = async (data: CreateTaskData) => {
    setIsLoading(true);
    try {
      // Convertir fecha a ISO si existe
      if (data.dueDate) {
        data.dueDate = new Date(data.dueDate).toISOString();
      }
      
      // Eliminar assignedToId si está vacío
      if (!data.assignedToId) {
        delete data.assignedToId;
      }

      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error manejado en el interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Editar Tarea' : 'Nueva Tarea'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Título"
          placeholder="Ej: Implementar nueva funcionalidad"
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          label="Descripción"
          placeholder="Describe la tarea..."
          rows={4}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Estado"
            options={[
              { value: 'PENDING', label: 'Pendiente' },
              { value: 'IN_PROGRESS', label: 'En Progreso' },
              { value: 'COMPLETED', label: 'Completada' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />

          <Select
            label="Prioridad"
            options={[
              { value: 'LOW', label: 'Baja' },
              { value: 'MEDIUM', label: 'Media' },
              { value: 'HIGH', label: 'Alta' },
            ]}
            error={errors.priority?.message}
            {...register('priority')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Fecha Límite"
            type="date"
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />

          <Select
            label="Asignado a"
            options={[
              { value: '', label: 'Sin asignar' },
              ...members.map(member => ({
                value: member.id,
                label: member.name,
              })),
            ]}
            error={errors.assignedToId?.message}
            {...register('assignedToId')}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {task ? 'Actualizar' : 'Crear'} Tarea
          </Button>
        </div>
      </form>
    </Modal>
  );
};
