import React, { useState } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface NavbarProps {
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    clearAuth();
    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  };

  return (
    <header className="bg-background-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-primary-light transition-colors">
            <Bell className="h-5 w-5 text-text-secondary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary-light transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-secondary">{user?.role}</p>
              </div>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-background-card rounded-xl shadow-lg border border-border py-2 z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-primary-light transition-colors flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
