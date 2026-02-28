import { Link, useLocation } from 'react-router';
import { Activity, Home, Users, FileText, Clock } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/symptom-input', label: 'New Patient', icon: Activity },
    { path: '/dashboard', label: 'Dashboard', icon: Users },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img src="/nirog-logo.png" alt="Nirog Ai" className="h-10 w-auto" />
          </Link>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${active
                  ? 'bg-[#EFF6FF] text-[#3B82F6]'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>AI-Powered Triage System</p>
          <p className="text-gray-400">v2.4.1 • February 2026</p>
        </div>
      </div>
    </nav>
  );
}
