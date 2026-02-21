import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { CheckSquare } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { LoginCredentials } from '../types';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.organization);
      toast.success('¡Bienvenido de vuelta!');
      navigate('/dashboard');
    } catch (error) {
      // El error ya se maneja en el interceptor de axios
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <CheckSquare className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-text-primary">TaskManager</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-background-card rounded-2xl shadow-card p-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Iniciar Sesión</h1>
          <p className="text-text-secondary mb-6">
            Ingresa tus credenciales para acceder
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
