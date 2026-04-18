import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, LayoutDashboard, ClipboardList, History, Settings, Bell } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${
      active 
        ? 'bg-brand-accent/10 border-l-4 border-brand-accent text-white opacity-100' 
        : 'text-white/70 hover:opacity-100 hover:bg-white/5'
    }`}
  >
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export const Layout = ({ children, activeTab, onTabChange }: { children: React.ReactNode, activeTab: string, onTabChange: (tab: string) => void }) => {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen bg-brand-bg font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-sidebar flex flex-col py-8 hidden lg:flex">
        <div className="px-6 mb-12">
          <h1 className="text-lg font-extrabold tracking-tighter text-brand-accent uppercase">
            Global Audit Engine
          </h1>
        </div>

        <nav className="flex flex-col">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Tableau de bord" 
            active={activeTab === 'dashboard'} 
            onClick={() => onTabChange('dashboard')} 
          />
          <SidebarItem 
            icon={ClipboardList} 
            label="Audits en cours" 
            active={activeTab === 'audits'} 
            onClick={() => onTabChange('audits')} 
          />
          <SidebarItem 
            icon={History} 
            label="Piste d'audit" 
            active={activeTab === 'trail'} 
            onClick={() => onTabChange('trail')} 
          />
          <div className="h-px bg-white/10 my-4 mx-6" />
          <SidebarItem 
            icon={Settings} 
            label="Configuration" 
            active={activeTab === 'settings'} 
            onClick={() => onTabChange('settings')} 
          />
        </nav>

        <div className="mt-auto mx-6 p-4 bg-white/5 rounded-xl border border-white/10 text-white/50">
          <p className="text-[10px] mb-2 font-mono uppercase tracking-widest">IAM: AUTH_VALID</p>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="bg-brand-success h-full" 
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Header */}
        <header className="h-[72px] border-b border-brand-border bg-white flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4 text-brand-text-muted">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-success" />
              Service Connected
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="mr-2 text-right hidden md:block">
              <p className="text-xs font-bold text-brand-text-main leading-tight">{user?.fullName || 'Inspecteur'}</p>
              <p className="text-[10px] text-brand-text-muted">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
            </button>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-full border border-slate-300" } }} />
          </div>
        </header>

        <div className="p-8 flex-1 audit-grid mb-20 lg:mb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border h-16 flex items-center justify-around z-50 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => onTabChange('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-brand-accent' : 'text-slate-400'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Dashboard</span>
        </button>
        <button onClick={() => onTabChange('audits')} className={`flex flex-col items-center gap-1 ${activeTab === 'audits' ? 'text-brand-accent' : 'text-slate-400'}`}>
          <ClipboardList size={20} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Missions</span>
        </button>
        <button onClick={() => onTabChange('trail')} className={`flex flex-col items-center gap-1 ${activeTab === 'trail' ? 'text-brand-accent' : 'text-slate-400'}`}>
          <History size={20} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Piste</span>
        </button>
        <button onClick={() => onTabChange('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-brand-accent' : 'text-slate-400'}`}>
          <Settings size={20} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Config</span>
        </button>
      </nav>
    </div>
  );
};
