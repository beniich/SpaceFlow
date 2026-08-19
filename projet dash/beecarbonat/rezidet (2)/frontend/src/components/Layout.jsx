import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Package, MapPin,
  ClipboardList, BarChart3, LogOut, Wrench, Box,
  Bell, Globe, Download, Database, Layers, Menu, X,
  FileText, Cpu, WifiOff, Wifi, RefreshCw, HardDrive,
  Zap, Activity, ShieldCheck, CheckCircle2, TrendingUp, QrCode, Users, Settings, Shield, LayoutGrid
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/executive',   icon: TrendingUp,      label: 'Executive View' },
  { to: '/assets',      icon: Package,         label: 'Assets' },
  { to: '/scanner',     icon: QrCode,          label: 'QR Code Scanner' },
  { to: '/spaces',      icon: MapPin,          label: 'Spaces' },
  { to: '/work-orders', icon: ClipboardList,   label: 'Work Orders' },
  { to: '/maintenance', icon: Wrench,          label: 'Maintenance' },
  { to: '/team',        icon: Users,           label: 'Team Operations' },
];

const innovationPillars = [
  { to: '/intervention',          icon: CheckCircle2, label: 'FieldTech Mobile & OT' },
  { to: '/energy',                icon: Zap,          label: 'Energy & ESG Copilot' },
  { to: '/bim',                   icon: Layers,       label: 'BIM & 3D Viewer' },
  { to: '/digital-twin',          icon: Box,          label: 'Digital Twin' },
  { to: '/predictive-maintenance', icon: Activity,    label: 'Predictive AI & Health' },
  { to: '/tenants',               icon: Globe,        label: 'Occupants & Tenant Care' },
];

const advancedItems = [
  { to: '/cmms',           icon: Wrench,       label: 'CMMS / BEECARBONAT' },
  { to: '/erp',            icon: Database,     label: 'ERP Integration' },
  { to: '/analytics',      icon: BarChart3,    label: 'Analytics' },
  { to: '/leases',         icon: FileText,     label: 'Leases & Contracts' },
  { to: '/exports',        icon: Download,     label: 'PDF Exports & Reports' },
  { to: '/notifications',  icon: Bell,         label: 'Notifications & Alerts' },
  { to: '/ai',             icon: Cpu,          label: 'Generative AI Assistant' },
  { to: '/security',       icon: Shield,       label: 'Security & Access' },
  { to: '/settings',       icon: Settings,     label: 'System Configuration' },
  { to: '/design-gallery', icon: LayoutGrid,   label: 'UI Design Gallery' },
];

const linkClass = ({ isActive }) =>
  clsx(
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs uppercase tracking-widest font-mono transition-all duration-200 group',
    isActive
      ? 'bg-brand-orange text-black shadow-[0_0_15px_rgba(243,128,32,0.3)] font-semibold'
      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
  );

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { isOnline, isOffline, cacheInfo, refreshFacilityCache } = useOfflineStatus();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshingCache, setRefreshingCache] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSyncCache = () => {
    setRefreshingCache(true);
    refreshFacilityCache();
    setTimeout(() => setRefreshingCache(false), 800);
  };

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <>
      {/* Logo & Offline Badge */}
      <div className="p-6 border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center relative shrink-0">
            <div className="absolute inset-0 bg-brand-cyan/10 blur-xl rounded-full"></div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-[0_0_5px_rgba(243,128,32,0.6)]">
              <path d="M12 2v20" stroke="var(--brand-orange, #f38020)" />
              <path d="M7 6v16" stroke="var(--brand-cyan, #00dbe7)" />
              <path d="M17 6v16" stroke="var(--brand-cyan, #00dbe7)" />
              <path d="M3 10v12" stroke="var(--brand-cyan, #00dbe7)" />
              <path d="M21 10v12" stroke="var(--brand-cyan, #00dbe7)" />
              <path d="M12 2L7 6L3 10" stroke="var(--brand-orange, #f38020)" />
              <path d="M12 2L17 6L21 10" stroke="var(--brand-orange, #f38020)" />
              <path d="M3 22h18" stroke="var(--brand-orange, #f38020)" />
              <path d="M7 14l5-3l5 3" stroke="var(--brand-orange, #f38020)" />
              <path d="M7 18l5-3l5 3" stroke="var(--brand-orange, #f38020)" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-zinc-50 font-sans tracking-tight text-base">
              BEECARBONAT
            </h1>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className={clsx(
            'inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border',
            isOnline
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
          )}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <button
            onClick={handleSyncCache}
            title="Pre-load / synchronize facility data"
            className="text-[10px] text-zinc-400 hover:text-zinc-200 font-mono flex items-center gap-1 hover:bg-zinc-800 px-1.5 py-0.5 rounded transition-colors"
          >
            <HardDrive className={clsx('w-3 h-3', refreshingCache && 'animate-spin')} />
            Sync
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={closeSidebar}>
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}

        <div className="pt-4 pb-1">
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-orange/90 px-3">5 Strategic Pillars</p>
        </div>

        {innovationPillars.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={closeSidebar}>
            {({ isActive }) => (
              <>
                <item.icon className={clsx("w-4 h-4 shrink-0", isActive ? "text-black" : "text-cyan-400")} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4 pb-1">
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-600 px-3">Modules &amp; System</p>
        </div>

        {advancedItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={closeSidebar}>
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-sm flex items-center justify-center shrink-0">
            <span className="text-xs font-mono font-medium text-zinc-300">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-50 font-mono truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-zinc-500 font-mono tracking-wider truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 border border-zinc-800 rounded-sm transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background text-zinc-50 font-sans">

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 bg-surface border-r border-zinc-800 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ──────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar (drawer) ─────────────────────────────────────────── */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-zinc-800 flex flex-col transition-transform duration-300 md:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-50"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-zinc-800 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-zinc-400 hover:text-zinc-50 rounded-sm"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-300">BEECARBONAT</span>
            {isOffline && (
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 border border-amber-500/30 font-mono uppercase">
                Offline
              </span>
            )}
          </div>
          <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-sm flex items-center justify-center">
            <span className="text-xs font-mono text-zinc-300">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
        </header>

        {/* Global Offline Mode Status Banner */}
        {isOffline && (
          <div className="bg-amber-950/40 border-b border-amber-600/40 px-6 py-2.5 flex items-center justify-between text-amber-200 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                <strong className="font-bold text-amber-300">OFFLINE MODE ACTIVE:</strong> You are viewing state reports and facility data cached by the Service Worker.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-amber-400/80 uppercase">
                Cache Service Worker v3
              </span>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

