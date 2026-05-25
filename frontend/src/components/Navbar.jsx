import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Menu } from 'lucide-react';

const Navbar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 flex items-center justify-between px-6 bg-white border-b border-slate-100 shrink-0">
      <div className="flex items-center gap-4">
        {/* Hamburger menu button visible only on mobile viewports */}
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Logo & Title */}
        <div className="flex lg:hidden items-center gap-2">
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              MediLink
            </span>
        </div>

        {/* Desktop Welcome Text */}
        <div className="hidden lg:flex flex-col">
          <h2 className="text-base sm:text-lg font-bold text-slate-850">Welcome back, {user?.name}</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">How's your day looking?</p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2.5 bg-slate-50 p-1.5 pr-3.5 sm:pr-4 rounded-xl border border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-s font-bold text-slate-800 leading-tight">{user?.name}</span>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
