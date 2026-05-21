import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  LogOut,
  Stethoscope,
  User,
  Calendar
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-200Translation' : 'text-slate-500 hover:bg-primary-50 hover:text-primary-600'}
    `}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const base = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
        { icon: User, label: 'My Profile', to: '/dashboard/profile' }
    ];

    if (user?.role === 'Doctor') {
      return [
        ...base,
        { icon: Calendar, label: 'Appointments', to: '/dashboard/appointments' }
      ];
    }

    return base;
  };

  return (
    <aside className="w-72 glass-card m-4 mr-0 flex flex-col h-[calc(100vh-2rem)] border-none">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary-600 p-2 rounded-xl text-white">
          <Stethoscope size={24} />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          MediLink
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {getMenuItems().map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
