import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - manejar errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Token expirado o inválido
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('organization');
        toast.error('Sesión expirada. Por favor, inicia sesión de nuevo.');
        window.location.href = '/login';
      }
      
      // Error 403 - Sin permisos
      else if (status === 403) {
        toast.error(data.message || 'No tienes permisos para realizar esta acción');
      }
      
      // Error 404 - No encontrado
      else if (status === 404) {
        toast.error(data.message || 'Recurso no encontrado');
      }
      
      // Error 409 - Conflicto (email duplicado, etc)
      else if (status === 409) {
        toast.error(data.message || 'El recurso ya existe');
      }
      
      // Error 500 - Error del servidor
      else if (status === 500) {
        toast.error('Error del servidor. Por favor, intenta de nuevo más tarde.');
      }
      
      // Otros errores
      else {
        toast.error(data.message || 'Ha ocurrido un error');
      }
    } else if (error.request) {
      // No hay respuesta del servidor
      toast.error('No se puede conectar con el servidor. Verifica que el backend esté corriendo.');
    } else {
      toast.error('Ha ocurrido un error inesperado');
    }
    
    return Promise.reject(error);
  }
);

export default api;
