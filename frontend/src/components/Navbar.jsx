import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, ChevronDown, CheckCircle, Info } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifications = [
    { id: 1, type: 'info', text: 'Welcome to MediLink!', time: 'Recently' },
    { id: 2, type: 'success', text: 'System initialized.', time: '1h ago' },
  ];

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-slate-800">Welcome back, {user?.name}</h2>
        <p className="text-sm text-slate-500 font-medium">How's your day looking?</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-1.5 pr-4 rounded-2xl shadow-sm border border-white">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-100">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-800 tracking-tight">{user?.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role}</span>
          </div>
        </div>

        {/* <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-xl transition-all shadow-sm border border-slate-100 hover:border-primary-100 relative group"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50 group-hover:border-white animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-card p-4 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 border-primary-100">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-800">Notifications</h4>
                <span className="text-[10px] bg-primary-100 text-primary-700 font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">2 New</span>
              </div>
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="flex gap-3 p-3 bg-white/50 rounded-xl hover:bg-white transition-colors cursor-pointer group">
                    <div className={n.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}>
                      {n.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-700">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}
      </div>
    </header>
  );
};

export default Navbar;
