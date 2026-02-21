import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Loading } from '../components/ui/Loading';
import { Building2, Users, UserPlus, Trash2, Copy } from 'lucide-react';
import { organizationService } from '../services/organization.service';
import { useAuthStore } from '../store/authStore';
import { OrganizationWithMembers, User, InviteMemberData } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const inviteSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  role: z.enum(['ADMIN', 'MEMBER']),
});

export const Organization: React.FC = () => {
  const { user } = useAuthStore();
  const [organization, setOrganization] = useState<OrganizationWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempPassword, setTempPassword] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'MEMBER',
    },
  });

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      const data = await organizationService.getOrganization();
      setOrganization(data);
    } catch (error) {
      toast.error('Error al cargar la organización');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMember = async (data: InviteMemberData) => {
    setIsSubmitting(true);
    try {
      const response = await organizationService.inviteMember(data);
      setTempPassword(response.temporaryPassword);
      toast.success('Miembro invitado exitosamente');
      reset();
      loadOrganization();
    } catch (error) {
      // Error manejado en interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
      try {
        await organizationService.removeMember(memberId);
        toast.success('Miembro eliminado exitosamente');
        loadOrganization();
      } catch (error) {
        toast.error('Error al eliminar el miembro');
      }
    }
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setTempPassword('');
    reset();
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    toast.success('Contraseña copiada al portapapeles');
  };

  if (isLoading) {
    return (
      <Layout title="Organization">
        <Loading text="Cargando organización..." />
      </Layout>
    );
  }

  if (!organization) {
    return (
      <Layout title="Organization">
        <p className="text-text-secondary">No se pudo cargar la organización</p>
      </Layout>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <Layout title="Organization">
      {/* Organization Info */}
      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{organization.name}</h2>
              <p className="text-text-secondary mt-1">
                Creada el {format(new Date(organization.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-primary-light px-4 py-2 rounded-lg inline-block">
              <p className="text-sm text-text-secondary">Total Miembros</p>
              <p className="text-2xl font-bold text-primary">{organization.users.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Members Section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Miembros del Equipo
        </h3>
        {isAdmin && (
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Invitar Miembro
          </Button>
        )}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organization.users.map((member) => (
          <Card key={member.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">{member.name}</h4>
                  <p className="text-sm text-text-secondary">{member.email}</p>
                  <div className="mt-2">
                    <Badge variant={member.role === 'ADMIN' ? 'HIGH' : 'default'}>
                      {member.role}
                    </Badge>
                  </div>
                </div>
              </div>
              {isAdmin && member.id !== user?.id && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        title="Invitar Miembro"
        size="md"
      >
        {tempPassword ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800 mb-2">¡Miembro invitado exitosamente!</p>
              <p className="text-xs text-green-600">
                Comparte esta contraseña temporal con el nuevo miembro:
              </p>
            </div>
            <div className="bg-primary-light border border-primary rounded-lg p-4 mb-4">
              <p className="text-sm text-text-secondary mb-2">Contraseña temporal:</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-2xl font-mono font-bold text-primary">{tempPassword}</code>
                <button
                  onClick={copyPassword}
                  className="p-2 rounded-lg hover:bg-primary-lighter transition-colors"
                >
                  <Copy className="h-5 w-5 text-primary" />
                </button>
              </div>
            </div>
            <p className="text-xs text-text-secondary mb-4">
              El usuario deberá cambiar esta contraseña en su primer inicio de sesión
            </p>
            <Button onClick={handleCloseInviteModal} className="w-full">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleInviteMember)} className="space-y-4">
            <Input
              label="Nombre"
              placeholder="Nombre del miembro"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="email@ejemplo.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Select
              label="Rol"
              options={[
                { value: 'MEMBER', label: 'Miembro' },
                { value: 'ADMIN', label: 'Administrador' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={handleCloseInviteModal}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Invitar
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </Layout>
  );
};
