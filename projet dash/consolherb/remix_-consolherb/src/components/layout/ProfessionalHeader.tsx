import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Cpu, Settings, FileText
} from 'lucide-react';

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
    </header>
  );
};

export default ProfessionalHeader;
