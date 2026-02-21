import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Columns, Building2, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tareas' },
  { to: '/kanban', icon: Columns, label: 'Kanban' },
  { to: '/organization', icon: Building2, label: 'Organización' },
  { to: '/settings', icon: SettingsIcon, label: 'Configuración' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-background-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary">TaskManager</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:bg-primary-light hover:text-primary'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={clsx(
                  'w-2 h-2 rounded-full',
                  isActive ? 'bg-white' : 'bg-primary-lighter'
                )} />
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Help Center Widget */}
      <div className="m-4">
        <div className="bg-primary rounded-2xl p-6 relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white opacity-10 rounded-full" />
          
          <div className="relative">
            <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            
            <h3 className="text-white font-semibold mb-2">Help Center</h3>
            <p className="text-white text-sm opacity-90 mb-4">
              Having Trouble in Learning. Please contact us for more questions.
            </p>
            
            <button className="w-full bg-white text-primary py-2 px-4 rounded-lg font-medium text-sm hover:bg-opacity-90 transition-all">
              Go To Help Center
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
