import React from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageSquare, 
  LifeBuoy, 
  ArrowRight, 
  ShieldCheck, 
  Gavel, 
  Lock, 
  Activity, 
  FileText,
  Star,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Database,
  Terminal,
  Cpu
} from 'lucide-react';

const SystemHelp: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="bg-[#091426] rounded-[3rem] p-20 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-10 opacity-10 blur-xl scale-125">
              <HelpCircle size={400} />
           </div>
           <div className="absolute bottom-0 left-0 p-20 opacity-5">
              <Cpu size={300} />
           </div>
           
           <div className="relative z-10 max-w-3xl space-y-8">
              <div className="flex items-center gap-3">
                 <span className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl">
                    <Sparkles size={12} className="fill-current" /> Global_Support_Node
                 </span>
                 <span className="text-slate-400 text-[10px] font-mono font-black tracking-widest uppercase pl-4 border-l border-white/10">
                    AuditMaster Instruction Core
                 </span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">How can we help you secure your infrastructure?</h1>
              <div className="relative pt-6">
                 <Search className="absolute left-6 top-[calc(1.5rem+1.5rem)] -translate-y-1/2 text-slate-400" />
                 <input className="w-full bg-white text-[#091426] pl-16 pr-8 py-6 rounded-[2rem] text-lg font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-600/20 transition-all shadow-2xl shadow-blue-900/20" placeholder="Search for modules, compliance laws, or UI guides..." />
              </div>
              <div className="flex gap-6 pt-4 text-[10px] font-black uppercase tracking-widest text-[#091426] items-center">
                 <p className="text-slate-400">Popular:</p>
                 {['Integrity Vault', 'Sovereignty MoC', 'ISO 27001 Mapping'].map((tag, i) => (
                   <button key={i} className="bg-white/10 text-white/60 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full">{tag}</button>
                 ))}
              </div>
           </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-4 gap-8">
           {[
             { title: 'Compliance Base', icon: <Gavel />, desc: 'Understanding regulatory frameworks and local law mapping.', color: 'blue' },
             { title: 'Security Protocols', icon: <ShieldCheck />, desc: 'Deep-dive into the cryptographic event store and vault security.', color: 'emerald' },
             { title: 'Forensic Tools', icon: <Activity />, desc: 'Documentation for event replay, node analysis, and incident labs.', color: 'amber' },
             { title: 'Platform Admin', icon: <Lock />, desc: 'Managing RBAC, entities, and global system configurations.', color: 'purple' },
           ].map((cat, i) => (
             <div key={i} className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm group hover:shadow-xl transition-all duration-500 cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all shadow-sm ${
                  cat.color === 'blue' ? 'bg-blue-50 text-blue-600 shadow-blue-50' :
                  cat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-50' :
                  cat.color === 'amber' ? 'bg-amber-50 text-amber-600 shadow-amber-50' : 'bg-purple-50 text-purple-600 shadow-purple-50'
                }`}>
                   {React.cloneElement(cat.icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.1em] mb-3 group-hover:text-blue-600 transition-colors">{cat.title}</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase leading-relaxed tracking-tight mb-8">{cat.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-[#091426] uppercase tracking-widest pt-6 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                   Explore Documentation <ChevronRight size={14} />
                </div>
             </div>
           ))}
        </div>

        {/* Knowledge & Tutorials */}
        <div className="grid grid-cols-12 gap-12">
           
           {/* Essential Reading */}
           <div className="col-span-8 bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm space-y-10">
              <div className="flex justify-between items-center">
                 <h2 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                    <BookOpen size={20} className="text-blue-600" /> Essential Reading & Guides
                 </h2>
                 <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All Articles</button>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                 {[
                   { title: 'The AuditMaster Lifecycle', read: '12 min', cat: 'FOUNDATIONS' },
                   { title: 'Securing Decentralized Nodes', read: '15 min', cat: 'ADVANCED' },
                   { title: 'RBAC Best Practices', read: '8 min', cat: 'SECURITY' },
                   { title: 'Interpreting Forensic Timelines', read: '20 min', cat: 'ANALYSIS' },
                 ].map((guide, i) => (
                   <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                         <span className="text-[9px] font-mono font-black text-blue-400 uppercase tracking-widest">{guide.cat}</span>
                         <span className="text-[8px] font-black text-slate-300 uppercase">{guide.read} READ</span>
                      </div>
                      <h4 className="text-sm font-black text-[#091426] uppercase tracking-tight group-hover:text-blue-600 transition-colors">{guide.title}</h4>
                      <div className="mt-4 flex items-center gap-2 text-slate-100 group-hover:text-slate-300 pointer-events-none transition-colors">
                         <div className="h-px flex-1 bg-current opacity-10" />
                         <ArrowRight size={14} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Video Training */}
           <div className="col-span-4 bg-slate-50 border border-slate-200 rounded-[3rem] p-12 shadow-sm flex flex-col justify-between group hover:bg-white transition-all">
              <div className="space-y-6">
                 <h2 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                    <Video size={20} className="text-red-500" /> Video Tutorials
                 </h2>
                 <div className="aspect-video w-full bg-[#091426] rounded-3xl relative overflow-hidden flex items-center justify-center shadow-xl">
                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&h=225" alt="Video Placeholder" className="w-full h-full object-cover opacity-20" />
                    <button className="w-16 h-16 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all scale-100 hover:scale-110 border border-white/20">
                       <LifeBuoy size={24} className="fill-current" />
                    </button>
                 </div>
                 <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-[#091426] uppercase tracking-tight">Certification Onboarding v2</h5>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Recorded: Oct 2023 // 4 sessions</p>
                 </div>
              </div>
              <button className="w-full py-4 bg-[#091426] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 mt-10 hover:bg-slate-800 transition-all">Launch Training Academy</button>
           </div>
        </div>

        {/* Global Support Actions */}
        <div className="grid grid-cols-3 gap-8">
           <div className="bg-blue-600 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 transition-transform group-hover:rotate-0 duration-700">
                 <MessageSquare size={120} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-4">Direct Protocol Support</h4>
              <p className="text-xs font-medium text-blue-100 leading-relaxed max-w-[200px] mb-8 italic">Communicate directly with the AuditMaster core engineers for critical bug reporting.</p>
              <button className="flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                 Open Support Ticket <ExternalLink size={12} />
              </button>
           </div>
           
           <div className="col-span-2 bg-white border border-slate-200 rounded-[3rem] p-12 flex justify-between items-center group relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
              <div className="flex gap-10 items-center">
                 <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                    <LifeBuoy size={40} className="animate-spin-slow" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-sm font-black text-[#091426] uppercase tracking-tight">Critical System Incident?</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase max-w-sm">If you suspect a platform integrity breach, trigger the Emergency Protocol immediately.</p>
                 </div>
              </div>
              <button className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-red-100 hover:bg-red-700 transition-all">
                 EMERGENCY SHUTDOWN
              </button>
           </div>
        </div>

        {/* Technical Help Footer */}
        <div className="pt-12 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.2em]">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                 <Database size={16} className="text-slate-900" />
                 <span>Instruction Meta Index: G-HELP-99</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <p>Last Sync: 2024-05-22 09:15 UTC</p>
           </div>
           <p className="flex items-center gap-2 text-blue-600 font-extrabold cursor-pointer group">
              <Star size={12} className="fill-current group-hover:rotate-45 transition-transform" /> OFFICIAL_DOCUMENTATION_SITE
           </p>
        </div>
      </div>
    </div>
  );
};

export default SystemHelp;
