import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/user.service';
import { organizationService } from '../services/organization.service';
import { User, Building2, Lock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { UpdateProfileData, UpdatePasswordData, UpdateOrganizationData } from '../types';

type Tab = 'profile' | 'organization' | 'security';

export const Settings: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Organization form
  const [orgForm, setOrgForm] = useState({
    name: '',
  });

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      const org = await organizationService.getOrganization();
      setOrgForm({ name: org.name });
    } catch (error) {
      console.error('Error loading organization:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: UpdateProfileData = {
        name: profileForm.name !== user?.name ? profileForm.name : undefined,
        email: profileForm.email !== user?.email ? profileForm.email : undefined,
      };

      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const data: UpdatePasswordData = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      };

      await userService.updatePassword(data);
      toast.success('Contraseña actualizada exitosamente');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Error al actualizar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.role !== 'ADMIN') {
      toast.error('Solo los administradores pueden editar la organización');
      return;
    }

    setLoading(true);

    try {
      const data: UpdateOrganizationData = {
        name: orgForm.name,
      };

      await organizationService.updateOrganization(data);
      toast.success('Organización actualizada exitosamente');
    } catch (error) {
      toast.error('Error al actualizar organización');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Perfil', icon: User },
    { id: 'organization' as Tab, label: 'Organización', icon: Building2 },
    { id: 'security' as Tab, label: 'Seguridad', icon: Lock },
  ];

  return (
    <Layout title="Configuración">
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <Card className="mb-6 p-2">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-primary-light'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Información del Perfil
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Nombre"
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                placeholder="Tu nombre"
                required
              />

              <Input
                label="Email"
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                placeholder="tu@email.com"
                required
              />

              <div className="bg-background rounded-xl p-4">
                <p className="text-sm text-text-secondary mb-1">Rol</p>
                <p className="font-medium text-text-primary">
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Miembro'}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" loading={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Organization Tab */}
        {activeTab === 'organization' && (
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Configuración de Organización
            </h2>

            {user?.role === 'ADMIN' ? (
              <form onSubmit={handleUpdateOrganization} className="space-y-4">
                <Input
                  label="Nombre de la Organización"
                  type="text"
                  value={orgForm.name}
                  onChange={(e) =>
                    setOrgForm({ ...orgForm, name: e.target.value })
                  }
                  placeholder="Mi Empresa S.A."
                  required
                />

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Los cambios en el nombre de la organización
                    serán visibles para todos los miembros.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" loading={loading}>
                    <Check className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-background rounded-xl p-6 text-center">
                <Lock className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">
                  Solo los administradores pueden modificar la configuración de la
                  organización.
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Cambiar Contraseña
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input
                label="Contraseña Actual"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                required
              />

              <Input
                label="Nueva Contraseña"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="••••••••"
                required
              />

              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                required
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Después de cambiar tu contraseña,
                  deberás iniciar sesión nuevamente en todos tus dispositivos.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" loading={loading}>
                  <Lock className="h-4 w-4 mr-2" />
                  Actualizar Contraseña
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </Layout>
  );
};
