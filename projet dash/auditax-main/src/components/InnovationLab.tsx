import React from 'react';
import { motion } from 'motion/react';
import { 
  FlaskConical, 
  Beaker, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Database, 
  Dna, 
  CloudLightning, 
  Cpu as Microchip, 
  Settings, 
  ArrowRight,
  Sparkles,
  Layers,
  Terminal,
  History,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';

const InnovationLab: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-10 opacity-5 grayscale">
             <FlaskConical size={240} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <Sparkles size={12} className="fill-current" /> Experimental_Core v0.8.2
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 Session: 0xFF_ALPHA_22
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Innovation Lab & Beta Features</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Modify advanced configurations and early-access modules. Changes here affect platform behavior at the core cryptographic layer. Proceed with calculated caution.
            </p>
          </div>
          <div className="flex gap-4 relative z-10">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-[#091426] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all">
              <History size={14} /> View Audits
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-[#091426] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">
              Reset All Flags
            </button>
          </div>
        </div>

        {/* Top Research Row */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Main Experiment Card */}
          <div className="col-span-8 bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm shadow-slate-100 flex flex-col group hover:shadow-xl transition-all duration-500">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                <div>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Primary Experiment: Phase 4</p>
                   <h3 className="text-2xl font-black text-[#091426] uppercase tracking-tighter">AI-Driven Forensic Pattern Analysis</h3>
                </div>
                <div className="flex gap-4 items-center">
                   <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Stability
                   </div>
                   <div className="w-14 h-7 bg-blue-600 rounded-full relative p-1 cursor-pointer shadow-lg shadow-blue-100">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-1 shadow-sm" />
                   </div>
                </div>
             </div>
             <div className="flex-1 grid grid-cols-2">
                <div className="p-10 space-y-8 flex flex-col justify-center border-r border-slate-50">
                   <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase tracking-tight">Enable autonomous agent processing for massive datasets. Reduces time-to-detection by ~40% via LLM-based verification logs.</p>
                   <ul className="space-y-4">
                      {['Real-time anomaly anchoring', 'Natural language audit querying', 'Auto-tagging of compliance violations'].map((feat, i) => (
                        <li key={i} className="flex gap-3 text-xs font-black text-[#091426] uppercase tracking-tight items-start">
                           <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 size={12} />
                           </div>
                           {feat}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="p-10 flex flex-col gap-6 justify-center bg-slate-50/20">
                   <div className="aspect-video w-full bg-[#091426] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                      <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm scale-150 group-hover:scale-100 transition-transform duration-1000">
                         <Globe size={100} />
                      </div>
                      <div className="flex justify-between items-start">
                         <span className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-widest">VISUAL_ENGINE::READY</span>
                         <Microchip size={18} className="text-slate-600" />
                      </div>
                      <div className="flex justify-center items-center py-4">
                         <Activity size={40} className="text-blue-500 stroke-[3px]" />
                      </div>
                      <div className="flex justify-between items-end font-mono text-[9px] text-slate-500 uppercase">
                         <span>CPU: 12.4%</span>
                         <span>THREADS: 256</span>
                      </div>
                   </div>
                   <button className="w-full py-4 bg-white border border-slate-200 text-[#091426] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">Configure Neural Weights</button>
                </div>
             </div>
          </div>

          {/* Quick Laboratory Stats */}
          <div className="col-span-4 flex flex-col gap-8">
             <div className="bg-[#091426] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Beaker size={120} />
                </div>
                <div className="relative z-10 space-y-2">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Laboratory Health</p>
                   <h4 className="text-6xl font-black tracking-tighter">14</h4>
                   <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">Active Experiments Running</p>
                </div>
                <div className="relative z-10 space-y-3">
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '67%' }} className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)]" />
                   </div>
                   <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest flex justify-between">
                      <span>SYSTEM CAPACITY</span>
                      <span>67% UTILIZED</span>
                   </p>
                </div>
             </div>

             <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm h-full flex flex-col justify-between group hover:shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Terminal size={14} className="text-slate-300" /> Recent Deployments
                   </h4>
                   <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-50 animate-pulse" />
                </div>
                <div className="space-y-6">
                   {[
                     { time: '14:02', user: 'ADMIN_RT', act: 'MOD: DEBUG_OVERLAY' },
                     { time: '13:45', user: 'SYSTEM', act: 'OFF: HYPER_GRAPH' },
                     { time: '09:12', user: 'ADMIN_SC', act: 'SYNC: MASTER_NODE' },
                   ].map((log, i) => (
                     <div key={i} className="flex justify-between items-center group/log">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-[#091426] uppercase tracking-tight">{log.act}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.user}</p>
                        </div>
                        <span className="text-[9px] font-mono font-black text-slate-300 group-hover/log:text-blue-600 transition-colors uppercase">{log.time} UTC</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Beta Feature Grid */}
        <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden flex flex-col">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/10">
              <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                 <Settings size={18} className="text-blue-600" /> Advanced Feature Repository
              </h3>
              <div className="flex gap-4">
                 {['ALL', 'SECURITY', 'UI/UX', 'NETWORK'].map((cat, i) => (
                   <button key={i} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                     i === 0 ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-900'
                   }`}>{cat}</button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-slate-50">
              {[
                { title: 'Raw JSON Auditor', id: 'RAW_JSON_X_44', icon: <Database />, active: false, desc: 'Expose raw response bodies in audit trail for backend debugging.' },
                { title: 'Turbo Engine V3', id: 'SCAN_TURBO_MOD', icon: <Zap />, active: true, desc: 'Enables multi-threaded scanning across all global compliance clusters.' },
                { title: 'Stealth Mode Logs', id: 'SEC_STEALTH_V8', icon: <Lock />, active: false, desc: 'Prevents internal logging of high-priority forensic sessions.' },
                { title: 'Blockchain Notarization', id: 'CHAIN_NOTARY_PRO', icon: <Globe />, active: false, desc: 'Anchor audit log entries to public immutable ledgers.' },
                { title: 'Modern Glass UI', id: 'UI_GLASS_MODERN', icon: <Layers />, active: true, desc: 'Enables frosted glass effects and high-depth shadows.' },
                { title: 'Verbose Debugging', id: 'DEV_VERBOSE_LOGS', icon: <Terminal />, active: false, desc: 'Display internal system stack traces in the frontend console.' },
              ].map((feat, i) => (
                <div key={i} className="p-10 group hover:bg-slate-50 transition-all cursor-default">
                   <div className="flex justify-between items-start mb-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                        feat.active ? 'bg-blue-600 text-white shadow-blue-100 rotate-3' : 'bg-slate-50 text-slate-400 grayscale group-hover:grayscale-0'
                      }`}>
                         {React.cloneElement(feat.icon as React.ReactElement, { size: 24 })}
                      </div>
                      <div className={`w-12 h-6 rounded-full relative p-1 transition-all ${feat.active ? 'bg-blue-600' : 'bg-slate-200'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all ${feat.active ? 'right-1' : 'left-1'}`} />
                      </div>
                   </div>
                   <h4 className="text-xs font-black text-[#091426] uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-all">{feat.title}</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">{feat.desc}</p>
                   <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                      <span className="text-[9px] font-mono font-black text-slate-300 uppercase leading-none">ID: {feat.id}</span>
                      <ArrowRight size={14} className="text-slate-100 group-hover:text-blue-200 transition-colors" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Change History Footer */}
        <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden">
           <div className="px-10 py-6 border-b border-slate-50 bg-[#091426] text-white flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <History size={14} /> Critical Override History
              </h4>
           </div>
           <table className="w-full text-left font-sans">
              <thead className="bg-slate-50/50">
                 <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-10 py-4">Timestamp</th>
                    <th className="px-10 py-4">Admin Principal</th>
                    <th className="px-10 py-4">Feature Target</th>
                    <th className="px-10 py-4">Protocol Result</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-[10px] font-black uppercase tracking-tight text-slate-500">
                 {[
                   { time: '2023-11-24 10:22:45', user: 'ADMIN_01::ROOT', target: 'UI_GLASS_MODERN', res: 'SUCCESS' },
                   { time: '2023-11-24 09:14:12', user: 'SYSTEM::DAEMON', target: 'SCAN_TURBO_MOD', res: 'AUTO_SYNC' },
                   { time: '2023-11-23 18:05:33', user: 'SARAH_C::SEC', target: 'SEC_STEALTH_V8', res: 'REJECTED' },
                 ].map((row, i) => (
                   <tr key={i} className="group hover:bg-slate-50 transition-colors cursor-default">
                      <td className="px-10 py-5 text-slate-300">{row.time}</td>
                      <td className="px-10 py-5 text-[#091426]">{row.user}</td>
                      <td className="px-10 py-5 text-blue-600">{row.target}</td>
                      <td className="px-10 py-5">
                         <span className={`inline-flex px-2 py-0.5 rounded-sm border text-[8px] font-black ${
                           row.res === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                           row.res === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                         }`}>{row.res}</span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

      </div>
    </div>
  );
};

export default InnovationLab;
