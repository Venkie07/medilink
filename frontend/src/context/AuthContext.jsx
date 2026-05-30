import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearApiCache } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = sessionStorage.getItem('medilink_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    const handleUnauthorized = () => {
      setSessionExpired(true);
    };
    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('medilink_user', JSON.stringify(userData));
    setSessionExpired(false);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    clearApiCache();
    sessionStorage.removeItem('medilink_user');
    setSessionExpired(false);
    navigate('/login');
  };

  const switchRole = (role) => {
    if (user) {
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        sessionStorage.setItem('medilink_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, loading }}>
      {children}
      {sessionExpired && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800">Session Expired</h2>
            <p className="text-slate-500">Your session has expired or is invalid. Please log in to continue.</p>
            <button onClick={logout} className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 px-6 rounded-xl w-full">
              Sign In
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
