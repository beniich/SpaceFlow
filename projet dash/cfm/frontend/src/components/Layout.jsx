import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Package, MapPin, Wrench,
  ClipboardList, BarChart3, FileText, Settings, LogOut,
  Box, Bell, Users, Download, Contact, Briefcase
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/assets', icon: Package, label: 'Actifs' },
  { to: '/cmms', icon: Wrench, label: 'GMAO / CMMS' },
  { to: '/digital-twin', icon: Box, label: 'Jumeau Numérique' },
  { to: '/contacts', icon: Contact, label: 'Contacts (CRM)' },
  { to: '/deals', icon: Briefcase, label: 'Ventes (Pipeline)' },
  { to: '/spaces', icon: MapPin, label: 'Espaces' },
  { to: '/work-orders', icon: ClipboardList, label: 'Ordres de travail' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/analytics', icon: BarChart3, label: 'Analytique' },
  { to: '/tenant', icon: Users, label: 'Organisation' },
  { to: '/exports', icon: Download, label: 'Rapports & Exports' },
  { to: '/settings', icon: Settings, label: 'Paramètres' }
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">CAFM Pro</h1>
              <p className="text-xs text-slate-500">Facility Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-700">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
