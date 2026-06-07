import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldCheck, Cpu, Brain, Eye, TrendingUp, Link as LinkIcon, 
  LayoutDashboard, Database, Settings, Leaf, Users, Mail, CreditCard
} from 'lucide-react';

const RightSidebar = () => {
  return (
    <aside className="w-16 h-full bg-[#0f172a] border-l border-white/10 flex flex-col items-center py-4 gap-3 z-50 shrink-0 overflow-y-auto scrollbar-none">
      
      <SidebarLink to="/portails" icon={<Leaf size={18}/>} label="Portails" />
      <SidebarLink to="/modules" icon={<Database size={18}/>} label="Modules" />
      <SidebarLink to="/dashboard" icon={<ShieldCheck size={18}/>} label="Dashboard" />
      <SidebarLink to="/infra" icon={<Cpu size={18}/>} label="Infrastructure" />
      <SidebarLink to="/logs" icon={<LayoutDashboard size={18}/>} label="Logs Audit" />
      
      <div className="w-8 h-px bg-white/10 my-0.5" />
      
      <SidebarLink to="/agro-brain" icon={<Brain size={18}/>} label="Agro Brain" />
      <SidebarLink to="/vision" icon={<Eye size={18}/>} label="Vision IA" />
      <SidebarLink to="/finance" icon={<TrendingUp size={18}/>} label="Finance ROI" />
      <SidebarLink to="/traceability" icon={<LinkIcon size={18}/>} label="Traceability" />
      
      <div className="w-8 h-px bg-white/10 my-0.5" />
      
      <SidebarLink to="/team" icon={<Users size={18}/>} label="Équipe & Rôles" />
      <SidebarLink to="/reports" icon={<Mail size={18}/>} label="Rapports Auto" />
      <SidebarLink to="/billing" icon={<CreditCard size={18}/>} label="Abonnement & Jetons" />
      
      <div className="w-8 h-px bg-white/10 my-0.5" />
      <SidebarLink to="/settings" icon={<Settings size={18}/>} label="Settings" />
      
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string, icon: any, label: string }) => (
  <div className="relative group">
    <NavLink 
      to={to}
      className={({ isActive }) => `block p-3 rounded-xl transition-all duration-200 ${
        isActive 
        ? 'bg-accent text-white shadow-lg shadow-accent/20' 
        : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
      }`}
    >
      {icon}
    </NavLink>
    
    {/* Tooltip on the left of the right sidebar */}
    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10 z-50">
      {label}
    </div>
  </div>
);

export default RightSidebar;
