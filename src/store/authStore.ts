import { create } from 'zustand';
import { User, Organization } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  setAuth: (user: User, organization: Organization) => void;
  setUser: (user: User) => void; 
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  isAuthenticated: false,

  setAuth: (user, organization) => {
    set({ user, organization, isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user });
  },

  clearAuth: () => {
    authService.logout();
    set({ user: null, organization: null, isAuthenticated: false });
  },

  initAuth: () => {
    const user = authService.getCurrentUser();
    const organization = authService.getCurrentOrganization();
    const isAuthenticated = authService.isAuthenticated();
    if (user && isAuthenticated) {
      set({ user, organization, isAuthenticated: true });
    }
  },
}));
