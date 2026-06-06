import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, ShieldCheck, Cpu, Globe, 
  Brain, Eye, TrendingUp, Link as LinkIcon, 
  LayoutDashboard, Database, Settings, FileText, 
  Beef, Leaf, ShoppingBag, Bug, Users, Truck 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const ProfessionalHeader = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full bg-[#0f172a] text-slate-200 font-sans rounded-2xl overflow-hidden mb-8 shadow-2xl">
      
      {/* 1. TOP STATUS BAR (Ultra-slim) */}
      <div className="flex justify-between items-center px-6 py-2 bg-white/5 backdrop-blur-md border-b border-white/10 text-[10px] uppercase tracking-widest font-medium text-slate-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-400">System Live</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-400" />
            <span>SOC2 Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-purple-400" />
            <span>Nodes: 04/04 Active</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-50">Encryption: AES-256</span>
          <span className="text-slate-200 font-bold">{currentTime} GMT</span>
        </div>
      </div>

      {/* 2. BRAND & MAIN TITLE AREA */}
      <div className="px-8 py-10 bg-gradient-to-b from-[#1e293b] to-[#0f172a] relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-accent/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-light tracking-tight text-white mb-2"
            >
              AgroMaître <span className="font-bold text-accent">Command Center</span>
            </motion.h1>
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] uppercase">Enterprise Edition</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="flex items-center gap-1 italic">Integrated Agricultural Intelligence v2.0</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-3">
             {/* Global Quick Actions */}
             <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-slate-300">
               <Settings size={20} />
             </button>
             <button className="px-5 py-3 rounded-xl bg-accent text-white font-bold shadow-lg shadow-accent/20 hover:scale-105 transition-all flex items-center gap-2">
               <FileText size={18} /> New Report
             </button>
          </div>
        </div>
      </div>

      {/* 3. SMART NAVIGATION HUB */}
      <div className="px-8 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Navigation Hub</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Mapping original routes to the new tiles style */}
          <NavTile to="/portails" icon={<Leaf size={18}/>} label="Portails" color="text-green-400" />
          <NavTile to="/modules" icon={<Database size={18}/>} label="Modules" color="text-blue-400" />
          <NavTile to="/dashboard" icon={<ShieldCheck size={18}/>} label="Dashboard" color="text-emerald-400" />
          <NavTile to="/infra" icon={<Cpu size={18}/>} label="Infrastructure" color="text-purple-400" />
          <NavTile to="/logs" icon={<LayoutDashboard size={18}/>} label="Logs Audit" color="text-slate-300" badge="New" />
          
          <NavTile to="/settings" icon={<Settings size={18}/>} label="Settings" color="text-slate-300" />
          <NavTile to="/agro-brain" icon={<Brain size={18}/>} label="Agro Brain" color="text-orange-400" badge="AI" />
          <NavTile to="/vision" icon={<Eye size={18}/>} label="Vision IA" color="text-red-400" badge="AI" />
          <NavTile to="/finance" icon={<TrendingUp size={18}/>} label="Finance ROI" color="text-yellow-400" />
          <NavTile to="/traceability" icon={<LinkIcon size={18}/>} label="Traceability" color="text-cyan-400" />
        </div>
      </div>
    </header>
  );
};

// Sub-component for Navigation Tiles using NavLink for routing
const NavTile = ({ icon, label, color, badge, to }: { icon: any, label: string, color: string, badge?: string, to: string }) => (
  <NavLink to={to} className="block outline-none">
    {({ isActive }) => (
      <motion.div 
        whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.08)' }}
        className={`group relative flex items-center gap-3 p-3 rounded-2xl bg-white/5 border transition-all hover:border-white/20 cursor-pointer ${
          isActive ? 'border-accent shadow-[0_0_15px_rgba(249,115,22,0.15)] bg-white/10' : 'border-white/10'
        }`}
      >
        <div className={`p-2 rounded-lg bg-slate-800 ${color} ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-medium transition-colors ${isActive ? 'text-white font-bold' : 'text-slate-300 group-hover:text-white'}`}>
            {label}
          </span>
          {badge && <span className="text-[9px] text-accent font-bold uppercase">{badge}</span>}
        </div>
      </motion.div>
    )}
  </NavLink>
);

export default ProfessionalHeader;
