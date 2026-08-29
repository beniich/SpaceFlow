import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Search, Bell, Download, Wifi, WifiOff, HardDrive, RefreshCw,
  ChevronLeft, ChevronRight, Sun, Moon, PanelLeftClose, PanelLeftOpen, Globe
} from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../hooks/useTheme';
import { ConflictResolutionModal } from './modals';
import BeeCarbonatLogo from './BeeCarbonatLogo';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const navCategories = [
  {
    categoryKey: 'cat_roadmap_ops',
    categoryDefault: 'Opérations & Maintenance',
    items: [
      { to: '/dashboard', labelKey: 'nav_dashboard', defaultLabel: 'Tableau de bord', icon: 'dashboard' },
      { to: '/lighting', labelKey: 'nav_lighting', defaultLabel: 'Lighting - City Pulse', icon: 'lightbulb' },
      { to: '/water', labelKey: 'nav_water', defaultLabel: 'Water - Hydro Sync', icon: 'water_drop' },
      { to: '/waste', labelKey: 'nav_waste', defaultLabel: 'Waste - Circular Flow', icon: 'recycling' },
      { to: '/assets', labelKey: 'nav_assets', defaultLabel: 'Assets', icon: 'inventory_2' },
      { to: '/scanner', labelKey: 'nav_qr_scanner', defaultLabel: 'QR Code Scanner', icon: 'qr_code_scanner' },
      { to: '/spaces', labelKey: 'nav_spaces', defaultLabel: 'Spaces', icon: 'domain' },
      { to: '/work-orders', labelKey: 'nav_work_orders', defaultLabel: 'Work Orders', icon: 'assignment' },
      { to: '/maintenance', labelKey: 'nav_maintenance', defaultLabel: 'Maintenance', icon: 'build' },
      { to: '/team', labelKey: 'nav_team_ops', defaultLabel: 'Team Operations', icon: 'group' },
    ]
  },
  {
    categoryKey: 'cat_strategic_pillars',
    categoryDefault: 'Climat & ESG Stratégique',
    items: [
      { to: '/market', labelKey: 'nav_carbon_market', defaultLabel: 'Carbon Credits Market', icon: 'public' },
      { to: '/air-quality', labelKey: 'nav_air_quality', defaultLabel: 'Air Quality & AQI', icon: 'air' },
      { to: '/impact', labelKey: 'nav_impact', defaultLabel: 'Environmental Impact Report', icon: 'nature_people' },
      { to: '/energy', labelKey: 'nav_energy', defaultLabel: 'Energy & ESG Copilot', icon: 'eco' },
      { to: '/bim', labelKey: 'nav_bim', defaultLabel: 'BIM & 3D Viewer', icon: 'view_in_3d' },
      { to: '/digital-twin', labelKey: 'nav_digital_twin', defaultLabel: 'Digital Twin', icon: 'view_in_ar' },
      { to: '/predictive-maintenance', labelKey: 'nav_predictive_ai', defaultLabel: 'Predictive AI & Health', icon: 'psychology' },
      { to: '/tenants', labelKey: 'nav_tenants', defaultLabel: 'Occupants & Tenant Care', icon: 'person_pin' },
    ]
  },
  {
    categoryKey: 'cat_modules_system',
    categoryDefault: 'Ecosystème & Système',
    items: [
      { to: '/about', labelKey: 'nav_about', defaultLabel: 'BeeCarbonat About (Roots)', icon: 'info' },
      { to: '/case-studies', labelKey: 'nav_case_studies', defaultLabel: 'Success Stories', icon: 'auto_awesome' },
      { to: '/careers', labelKey: 'nav_careers', defaultLabel: 'Careers Workspace', icon: 'work' },
      { to: '/partner-portal', labelKey: 'nav_partner', defaultLabel: 'Partner Portal (B2B)', icon: 'vpn_key' },
      { to: '/cmms', labelKey: 'nav_cmms', defaultLabel: 'CMMS / BEECARBONAT', icon: 'precision_manufacturing' },
      { to: '/erp', labelKey: 'nav_erp', defaultLabel: 'ERP Integration', icon: 'hub' },
      { to: '/analytics', labelKey: 'nav_analytics', defaultLabel: 'Analytics', icon: 'analytics' },
      { to: '/ai', labelKey: 'nav_ai_assistant', defaultLabel: 'Generative AI Assistant', icon: 'smart_toy' },
      { to: '/security', labelKey: 'nav_security', defaultLabel: 'Security & Access', icon: 'shield' },
      { to: '/settings', labelKey: 'nav_settings', defaultLabel: 'System Configuration', icon: 'settings' },
    ]
  }
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { isOnline, pendingSyncCount, syncNow } = useOfflineStatus();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMoreNav, setShowMoreNav] = useState(false);
  
  // Collapsible Sidebar State ("réduire la barre latérale")
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  // Theme hook (Mode Clair / Mode Sobre / Système)
  const { isDark: isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isCollapsed ? 'true' : 'false');
  }, [isCollapsed]);

  // Offline Conflict Resolution States
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [isResolvingConflicts] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleManualSync = async () => {
    const toastId = toast.loading('Synchronisation des données en cours...');
    try {
      const result = await syncNow();
      if (result.flushed > 0) {
        toast.success(`${result.flushed} modification(s) synchronisée(s) !`, { id: toastId });
      } else {
        toast.success('Données déjà synchronisées.', { id: toastId });
      }
    } catch {
      toast.error('Erreur lors de la synchronisation.', { id: toastId });
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={clsx(
      "min-h-screen font-sans antialiased flex flex-col selection:bg-[#ff5500] selection:text-white transition-colors duration-200",
      isDarkMode ? "bg-black text-white" : "bg-white text-black"
    )}>
      
      {/* ── Fixed Desktop Sidebar ─────────────────────────────────────────── */}
      <aside className={clsx(
        "fixed left-0 top-0 h-full z-50 hidden md:flex flex-col transition-all duration-300 ease-in-out border-r shadow-sm backdrop-blur-xl",
        isCollapsed ? "w-[76px]" : "w-[260px]",
        isDarkMode 
          ? "bg-black/95 border-zinc-800 text-white" 
          : "bg-white/95 border-zinc-200 text-black"
      )}>
        {/* Brand Header */}
        <div className={clsx(
          "h-[64px] flex items-center justify-between border-b shrink-0 transition-all duration-300",
          isCollapsed ? "px-3" : "px-5",
          isDarkMode ? "border-zinc-800" : "border-zinc-200"
        )}>
          <NavLink to="/dashboard" className="flex items-center gap-3 group min-w-0" title="BeeCarbonat">
            <BeeCarbonatLogo size={36} showText={!isCollapsed} />
          </NavLink>

          {/* Collapse Toggle Button ("réduire la barre latérale") */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Agrandir la barre latérale" : "Réduire la barre latérale"}
            className={clsx(
              "p-1.5 rounded-lg transition-colors cursor-pointer shrink-0",
              isDarkMode 
                ? "text-zinc-400 hover:text-white hover:bg-zinc-800" 
                : "text-zinc-600 hover:text-black hover:bg-zinc-100"
            )}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          {navCategories.map((cat, catIdx) => (
            <div key={cat.categoryKey} className="flex flex-col gap-1">
              {!isCollapsed && (
                <div className={clsx(
                  "px-3 py-1 text-[9px] font-mono uppercase tracking-widest font-bold",
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                )}>
                  {t(cat.categoryKey, cat.categoryDefault)}
                </div>
              )}
              {isCollapsed && catIdx > 0 && (
                <div className={clsx("my-1 border-t", isDarkMode ? "border-zinc-800" : "border-zinc-200")} />
              )}
              {cat.items.map((item) => {
                const isActive = location.pathname === item.to;
                const itemLabel = t(item.labelKey, item.defaultLabel);
                return (
                  <NavLink
                    key={`${cat.categoryKey}-${item.to}-${item.labelKey}`}
                    to={item.to}
                    title={isCollapsed ? itemLabel : undefined}
                    className={clsx(
                      'flex items-center rounded-xl transition-all group font-mono text-[11px] uppercase tracking-wider relative',
                      isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 gap-3',
                      isActive
                        ? 'bg-[#FF5500] text-white font-bold shadow-[0_2px_10px_rgba(255,85,0,0.3)]'
                        : isDarkMode
                          ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                          : 'text-zinc-700 hover:text-black hover:bg-zinc-100'
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform shrink-0">
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate font-semibold">{itemLabel}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className={clsx(
          "p-3 mt-auto border-t shrink-0",
          isDarkMode ? "border-zinc-800" : "border-zinc-200"
        )}>
          <div className={clsx(
            "p-2.5 rounded-xl flex items-center justify-between gap-2 border transition-all",
            isDarkMode 
              ? "bg-zinc-900 border-zinc-800 text-zinc-100" 
              : "bg-zinc-50 border-zinc-200 text-black"
          )}>
            <div className="flex items-center gap-2.5 min-w-0" title={`${user?.firstName || 'System'} ${user?.lastName || 'Admin'}`}>
              <div className={clsx(
                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow shrink-0",
                isDarkMode ? "bg-zinc-800 text-cyan-400" : "bg-zinc-200 text-zinc-800"
              )}>
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[11px] font-bold truncate">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'System Admin'}
                  </span>
                  <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider truncate">
                    {user?.role === 'ADMIN' ? 'Tier 01 Operator' : (user?.role || 'Tier 01 Operator')}
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                title="Déconnexion"
                className={clsx(
                  "p-1.5 rounded-lg transition-colors cursor-pointer",
                  isDarkMode ? "text-zinc-400 hover:text-rose-400 hover:bg-zinc-800" : "text-zinc-500 hover:text-rose-600 hover:bg-zinc-200"
                )}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Mobile Sidebar (Drawer) ───────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          onClick={closeSidebar}
        />
      )}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col transition-transform duration-300 md:hidden border-r shadow-2xl',
          isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-white border-zinc-200 text-black",
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className={clsx(
          "h-[64px] flex items-center justify-between px-5 border-b",
          isDarkMode ? "border-zinc-800" : "border-zinc-200"
        )}>
          <div className="flex items-center gap-3">
            <BeeCarbonatLogo size={32} showText={true} />
          </div>
          <button 
            onClick={closeSidebar} 
            className={clsx(
              "p-1.5 rounded-lg transition-colors",
              isDarkMode ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          {navCategories.map((cat) => (
            <div key={`mobile-${cat.categoryKey}`} className="flex flex-col gap-1">
              <div className={clsx(
                "px-3 py-1 text-[9px] font-mono uppercase tracking-widest font-bold",
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              )}>
                {t(cat.categoryKey, cat.categoryDefault)}
              </div>
              {cat.items.map((item) => (
                <NavLink
                  key={`mobile-${cat.categoryKey}-${item.to}-${item.labelKey}`}
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) => clsx(
                    'flex items-center px-3.5 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-wider transition-all',
                    isActive 
                      ? 'bg-[#FF5500] text-white font-bold shadow-md' 
                      : isDarkMode 
                        ? 'text-zinc-300 hover:bg-zinc-900 hover:text-white' 
                        : 'text-zinc-700 hover:bg-zinc-100 hover:text-black'
                  )}
                >
                  <span className="material-symbols-outlined mr-3 text-[18px]">{item.icon}</span>
                  <span className="font-semibold">{t(item.labelKey, item.defaultLabel)}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main Content Layout ────────────────────────────────────────────── */}
      <div className={clsx(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "md:pl-[76px]" : "md:pl-[260px]"
      )}>
        
        {/* Fixed Top Header */}
        <header className={clsx(
          "fixed top-0 right-0 h-[64px] z-40 px-6 flex items-center justify-between border-b backdrop-blur-xl transition-all duration-300 ease-in-out left-0",
          isCollapsed ? "md:left-[76px]" : "md:left-[260px]",
          isDarkMode 
            ? "bg-black/90 border-zinc-800 text-white" 
            : "bg-white/90 border-zinc-200 text-black"
        )}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Site Context Selector */}
            <div className={clsx(
              "flex items-center gap-2 border px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shadow-xs transition-colors",
              isDarkMode 
                ? "bg-zinc-900 border-zinc-800 text-zinc-200" 
                : "bg-white border-zinc-200 text-black"
            )}>
              <span className="material-symbols-outlined text-[18px] text-[#0F172A] dark:text-[#00F0FF]">apartment</span>
              <select className="bg-transparent focus:outline-none cursor-pointer">
                <option value="paris" className={isDarkMode ? "bg-black text-white" : "bg-white text-black"}>{t('header_paris_hq', 'Paris HQ - Bâtiment Alpha')}</option>
                <option value="lyon" className={isDarkMode ? "bg-black text-white" : "bg-white text-black"}>{t('header_lyon_hub', 'Lyon - Hub Béta')}</option>
                <option value="berlin" className={isDarkMode ? "bg-black text-white" : "bg-white text-black"}>{t('header_berlin_campus', 'Berlin - Tech Campus')}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* 🌐 3-Language Selector (Français, English, Español) */}
            <div className={clsx(
              "flex items-center gap-1.5 border px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors shadow-xs",
              isDarkMode 
                ? "bg-zinc-900 border-zinc-800 text-zinc-200" 
                : "bg-white border-zinc-200 text-black"
            )}>
              <Globe size={15} className="text-[#FF5500] shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold pr-1"
                aria-label="Sélectionner la langue / Select language"
              >
                <option value="fr" className={isDarkMode ? "bg-black text-white" : "bg-white text-black"}>🇫🇷 FR - Français</option>
                <option value="en" className={isDarkMode ? "bg-black text-white" : "bg-white text-black"}>🇬🇧 EN - English</option>
                <option value="es" className={isDarkMode ? "bg-black text-white" : "bg-white text-black"}>🇪🇸 ES - Español</option>
              </select>
            </div>

            {/* Mode Switcher Button (Mode Clair / Mode Sombre) */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? "Activer le Mode Clair (Blanc pur)" : "Activer le Mode Sobre (Noir pur)"}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer",
                isDarkMode 
                  ? "bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800" 
                  : "bg-zinc-100 border-zinc-200 text-black hover:bg-zinc-200"
              )}
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
              <span className="hidden sm:inline">{isDarkMode ? t('dark_mode', 'Mode Sobre') : t('light_mode', 'Mode Clair')}</span>
            </button>

            {/* Online Sync Status Indicator */}
            <div 
              onClick={handleManualSync}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors shadow-xs",
                isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200"
              )}
              title="Cliquer pour synchroniser manuellement"
            >
              <span className={clsx(
                "w-2 h-2 rounded-full",
                isOnline 
                  ? "bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" 
                  : "bg-rose-500 shadow-[0_0_8px_#ef4444]"
              )} />
              <span className="font-mono text-[10px] uppercase tracking-wider hidden sm:inline font-bold">
                {isOnline ? t('system_sync_online', 'Système Synchro: En ligne') : t('system_sync_offline', 'Mode Hors Ligne')}
              </span>
              {pendingSyncCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#FF5500] text-white font-mono text-[9px] font-bold rounded-full">
                  {pendingSyncCount}
                </span>
              )}
            </div>

            {/* Quick Search */}
            <button
              onClick={() => navigate('/spaces')}
              className={clsx(
                "p-2 rounded-xl transition-colors cursor-pointer",
                isDarkMode ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-600 hover:text-black hover:bg-zinc-100"
              )}
              title={t('search_placeholder', 'Rechercher des espaces ou équipements')}
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className={clsx(
                "p-2 rounded-xl transition-colors relative cursor-pointer",
                isDarkMode ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-600 hover:text-black hover:bg-zinc-100"
              )}
              title="Notifications système"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5500] rounded-full shadow-[0_0_6px_#FF5500]"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className={clsx(
          "relative pt-[64px] flex-1 transition-colors duration-200",
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        )}>
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className={clsx(
          "border-t px-6 py-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest transition-colors",
          isDarkMode ? "bg-black border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-500"
        )}>
          <div className="flex items-center gap-3">
            <BeeCarbonatLogo size={20} showText={false} />
            <span className="font-semibold">BeeCarbonat x Spider CAFM © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", isOnline ? "bg-emerald-500 shadow-[0_0_5px_#10B981]" : "bg-rose-500")}></span>
              <span>{isOnline ? "Système En Ligne" : "Hors Ligne"}</span>
            </div>
            <span>v2.4.0 Production</span>
          </div>
        </footer>
      </div>

      {/* Offline Conflict Resolution Modal */}
      <ConflictResolutionModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        conflicts={conflicts}
        onResolve={(id, choice) => {
          setConflicts(prev => prev.map(c => c.id === id ? { ...c, resolved: choice } : c));
        }}
        onKeepAll={(choice) => {
          setConflicts(prev => prev.map(c => ({ ...c, resolved: choice })));
        }}
        onApply={() => {
          setShowConflictModal(false);
          toast.success('Résolutions enregistrées');
        }}
        isSyncing={isResolvingConflicts}
      />
    </div>
  );
}



