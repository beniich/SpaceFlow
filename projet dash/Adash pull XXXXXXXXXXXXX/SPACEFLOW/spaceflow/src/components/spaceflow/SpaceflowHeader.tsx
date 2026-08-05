import React, { useState } from 'react';
import { GoogleAuthUser, PageId } from '../../types';
import { 
  Building2, Users, Calendar, CreditCard, BarChart3, Smartphone, 
  UserCheck, Settings, Bell, Shield, Sparkles, Moon, Sun, Menu, X, LogIn, Mail, CheckCircle2
} from 'lucide-react';

interface SpaceflowHeaderProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userRole?: string;
  googleUser?: GoogleAuthUser | null;
  onLogoutGoogle?: () => void;
}

export const SpaceflowHeader: React.FC<SpaceflowHeaderProps> = ({
  currentPage,
  setCurrentPage,
  isDarkMode,
  setIsDarkMode,
  isLoggedIn,
  setIsLoggedIn,
  googleUser,
  onLogoutGoogle,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as PageId, label: 'ACCUEIL', icon: Building2 },
    { id: 'dashboard' as PageId, label: 'DASHBOARD', icon: BarChart3, requiresAuth: true },
    { id: 'members' as PageId, label: 'MEMBRES', icon: Users, requiresAuth: true },
    { id: 'bookings' as PageId, label: 'RÉSERVATIONS', icon: Calendar, requiresAuth: true },
    { id: 'billing' as PageId, label: 'FACTURATION', icon: CreditCard, requiresAuth: true },
    { id: 'analytics' as PageId, label: 'ANALYTICS & IA', icon: Sparkles, requiresAuth: true },
    { id: 'visitors' as PageId, label: 'VISITEURS', icon: UserCheck, requiresAuth: true },
    { id: 'mobile_pwa' as PageId, label: 'APP COWORKER', icon: Smartphone },
    { id: 'pricing' as PageId, label: 'TARIFS', icon: CreditCard },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
      isDarkMode 
        ? 'bg-slate-950/85 border-white/10 text-slate-100' 
        : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 cursor-pointer group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-lg tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                SPACEFLOW
              </div>
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                Coworking SaaS OS
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.requiresAuth && !isLoggedIn && !googleUser) {
                    setCurrentPage('login');
                  } else {
                    setCurrentPage(item.id);
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : isDarkMode
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10' 
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 shadow-xs'
            }`}
            title={isDarkMode ? "Passer en Mode Clair" : "Passer en Mode Sombre"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Auth Status / Action */}
          {googleUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                {googleUser.avatar ? (
                  <img src={googleUser.avatar} alt="User" className="w-6 h-6 rounded-full border border-emerald-400/50 object-cover" />
                ) : (
                  <Mail className="w-4 h-4 text-emerald-400" />
                )}
                <div className="hidden sm:block leading-none">
                  <div className="text-[11px] font-black text-emerald-400">{googleUser.name}</div>
                  <div className="text-[9px] font-mono text-emerald-500/80">API Gmail Active</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onLogoutGoogle) onLogoutGoogle();
                  setIsLoggedIn(false);
                }}
                className="p-2 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold cursor-pointer transition-all"
                title="Déconnexion Google"
              >
                <LogIn className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>MANAGER ACTIF</span>
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="p-2 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold cursor-pointer transition-all"
                title="Déconnexion"
              >
                <LogIn className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage('login')}
              className="px-4 py-2 rounded-xl btn-gradient-orange text-white text-xs font-extrabold flex items-center gap-2 shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>CONNEXION GOOGLE</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl border cursor-pointer ${
              isDarkMode ? 'border-white/10 text-slate-300 hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 py-3 space-y-2 ${
          isDarkMode ? 'bg-slate-950 border-white/10' : 'bg-white border-slate-200'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.requiresAuth && !isLoggedIn && !googleUser) {
                    setCurrentPage('login');
                  } else {
                    setCurrentPage(item.id);
                  }
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 ${
                  currentPage === item.id
                    ? 'bg-orange-500 text-white'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-white/5'
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
