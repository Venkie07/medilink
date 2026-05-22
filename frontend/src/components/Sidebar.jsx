import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  LogOut,
  Stethoscope,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Pill,
  FlaskConical,
  ClipboardList
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
      ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
      ${isCollapsed ? 'justify-center px-0 w-12 h-12 mx-auto' : ''}
    `}
  >
    <Icon size={20} className="shrink-0" />
    {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
    
    {/* Accessible tooltip when collapsed */}
    {isCollapsed && (
      <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-md">
        {label}
      </div>
    )}
  </NavLink>
);

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
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
    
    if (user?.role === 'Lab Technician') {
      return [
        ...base,
        { icon: FlaskConical, label: 'Lab Queue', to: '/dashboard' }
      ];
    }

    if (user?.role === 'Pharmacy' || user?.role === 'Pharmacist') {
      return [
        ...base,
        { icon: Pill, label: 'Pharmacy Queue', to: '/dashboard' }
      ];
    }

    return base;
  };

  return (
    <>
      {/* Mobile Overlay Background */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside 
        className={`
          fixed inset-y-0 left-0 lg:static z-50 flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className={`p-5 flex items-center justify-between border-b border-slate-100 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-sm">
              <Stethoscope size={20} />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold text-slate-800 tracking-tight">
                MediLink
              </span>
            )}
          </div>
          
          {/* Close button on mobile */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className={`flex-1 p-4 space-y-1.5 ${isCollapsed ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {getMenuItems().map((item, index) => (
            <SidebarItem 
              key={index} 
              {...item} 
              isCollapsed={isCollapsed} 
            />
          ))}
        </nav>

        {/* Bottom Panel (Collapse Toggle & Sign Out) */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center gap-2 w-full py-2 hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-500 transition-all text-xs font-semibold"
          >
            {isCollapsed ? <ChevronRight size={16} /> : (
              <>
                <ChevronLeft size={16} />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group relative
              ${isCollapsed ? 'justify-center px-0' : ''}
            `}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="font-semibold text-sm">Sign Out</span>}
            
            {isCollapsed && (
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-md">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
