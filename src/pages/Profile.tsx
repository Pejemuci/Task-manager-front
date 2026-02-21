import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Building2, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <Layout title="Profile">
        <p className="text-text-secondary">No se pudo cargar el perfil</p>
      </Layout>
    );
  }

  return (
    <Layout title="Profile">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-text-primary">{user.name}</h1>
                <Badge variant={user.role === 'ADMIN' ? 'HIGH' : 'default'}>
                  {user.role}
                </Badge>
              </div>
              <p className="text-text-secondary">{user.email}</p>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Email</p>
                <p className="font-semibold text-text-primary">{user.email}</p>
              </div>
            </div>
          </Card>

          {/* Role */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Rol</p>
                <p className="font-semibold text-text-primary">
                  {user.role === 'ADMIN' ? 'Administrador' : 'Miembro'}
                </p>
              </div>
            </div>
          </Card>

          {/* Organization ID */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Organización</p>
                <p className="font-semibold text-text-primary text-xs break-all">
                  {user.organizationId}
                </p>
              </div>
            </div>
          </Card>

          {/* Member Since */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Miembro desde</p>
                <p className="font-semibold text-text-primary">
                  {user.createdAt 
                    ? format(new Date(user.createdAt), "d 'de' MMMM, yyyy", { locale: es })
                    : 'Fecha no disponible'
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Permissions Card */}
        {user.role === 'ADMIN' && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Permisos de Administrador</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-text-secondary">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Gestionar organización
              </li>
              <li className="flex items-center gap-2 text-text-secondary">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Invitar y eliminar miembros
              </li>
              <li className="flex items-center gap-2 text-text-secondary">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Gestionar roles
              </li>
              <li className="flex items-center gap-2 text-text-secondary">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Acceso completo a todas las tareas
              </li>
            </ul>
          </Card>
        )}
      </div>
    </Layout>
  );
};
