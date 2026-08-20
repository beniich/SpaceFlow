import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useCrmAuthStore } from '../../store/crmAuthStore';
import { LayoutDashboard, Users, Target, Settings, LogOut, Loader, Activity, Menu, X, Bell } from 'lucide-react';
import PWAInstallPrompt from './PWAInstallPrompt';
import NotificationManager from './NotificationManager';

export default function CRMLayout() {
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useCrmAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const verify = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) navigate('/crm/login');
    };
    if (!isAuthenticated) verify();
  }, [isAuthenticated, checkAuth, navigate]);

  if (isLoading || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090b]">
        <Loader className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  const menuItems = [
    { path: '/crm/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/crm/contacts', icon: Users, label: 'Contacts' },
    { path: '/crm/deals', icon: Target, label: 'Pipeline (Deals)' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/crm/login');
  };

  const handleNavClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#09090b] font-sans text-zinc-300">
      {/* Overlay mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-[#18181b]/80 backdrop-blur-xl border-r border-zinc-800 flex flex-col z-50 transition-transform ${
        isMobile
          ? `fixed inset-y-0 left-0 w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'w-64 relative'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
          <div className="flex items-center">
            <Activity className="text-indigo-500 mr-3" size={24} />
            <span className="font-bold text-lg text-white tracking-wide">BEECARBONAT <span className="font-light">CRM</span></span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-4 border-b border-zinc-800/50">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Organisation</p>
          <div className="font-medium text-white truncate" title={user.organization?.name}>
            {user.organization?.name}
          </div>
          <div className="mt-2 text-xs">
            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
              Plan {user.organization?.plan}
            </span>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-300 ${
                  active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'hover:bg-zinc-800/50 hover:text-white border border-transparent'
                }`}
              >
                <item.icon size={20} className={`mr-3 ${active ? 'text-indigo-400' : 'text-zinc-500'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800/50 bg-[#09090b]/30">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white mr-3 border border-zinc-700">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-zinc-800/50 transition-colors">
              <Settings size={16} className="mr-3 text-zinc-500" />
              Parametres
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
            >
              <LogOut size={16} className="mr-3" />
              Deconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Glow Effect Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Topbar mobile */}
        {isMobile && (
          <header className="h-16 bg-[#18181b]/80 backdrop-blur-md border-b border-zinc-800 px-4 flex items-center justify-between z-30">
            <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white">
              <Menu size={24} />
            </button>
            <h2 className="font-semibold text-white tracking-wide">BEECARBONAT CRM</h2>
            <button className="relative text-zinc-400 hover:text-white">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#18181b]"></span>
            </button>
          </header>
        )}

        {/* Trial Banner */}
        {user.organization?.plan === 'FREE' && user.organization?.trialEndsAt && (
          <div className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/80 text-zinc-300 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10 relative">
            <div className="flex items-center text-sm font-medium">
              <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-md mr-3 shadow-[0_0_10px_rgba(99,102,241,0.2)]">Essai Gratuit</span>
              <span>Il reste <span className="text-white mx-1 font-bold">{Math.ceil((new Date(user.organization.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24))}</span> jours d'essai.</span>
            </div>
            <button onClick={() => alert("Fonctionnalite de paiement a integrer (Stripe)")} className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-md font-bold hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] w-full sm:w-auto">
              Mettre a niveau
            </button>
          </div>
        )}

        <div className="flex-1 overflow-auto relative z-10">
          <Outlet />
        </div>
      </div>
      
      <NotificationManager />
      <PWAInstallPrompt />
    </div>
  );
}
