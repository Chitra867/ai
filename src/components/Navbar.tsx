import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/threats', label: 'Threat Analysis', icon: '🔍' },
    { path: '/malware', label: 'Malware Scanner', icon: '🛡️' },
    { path: '/upload', label: 'File Upload', icon: '📁' },
    { path: '/reports', label: 'Risk Reports', icon: '📈' },
    { path: '/logs', label: 'System Logs', icon: '📋' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-gray/20 border-r border-slate-gray z-40">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-medium-slate-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <span className="text-xl font-bold">ThreatGuard</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link flex items-center space-x-3 w-full ${
                isActive(item.path) ? 'active' : ''
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-gray">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-medium-slate-blue rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium">{user?.username}</div>
            <div className="text-xs text-gray-400">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;