import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Terminal, 
  UserCheck, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  History, 
  AlertTriangle, 
  Key, 
  ShieldCheck as Verified, 
  Fingerprint,
  TrendingUp,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';

const SecurityAuditLog: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <ShieldAlert size={12} className="fill-current text-red-500" /> Forensic_Core v4.0
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 Global Ledger: Synchronized
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">System Security Audit Log</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Forensic record of all administrative overrides, role modifications, and authentication lifecycle events across the AuditMaster global infrastructure.
            </p>
          </div>
          <div className="flex gap-4 relative z-10 font-mono text-[9px] font-black uppercase tracking-widest text-[#091426]">
             <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button className="px-5 py-2.5 bg-[#091426] text-white rounded-lg shadow-xl shadow-slate-200">Real-time</button>
                <button className="px-5 py-2.5 text-slate-400">Historical</button>
             </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-4 gap-8">
           {[
             { label: 'Alerts (24h)', val: '12', icon: <AlertTriangle />, color: 'red', delta: '+8%', up: true },
             { label: 'Active Sessions', val: '482', icon: <UserCheck />, color: 'blue', delta: 'Normal', up: false },
             { label: 'Override Requests', val: '07', icon: <Key />, color: 'amber', delta: 'Approved', up: true },
             { label: 'System Integrity', val: '99.9%', icon: <Verified />, color: 'emerald', delta: 'Encrypted', up: true },
           ].map((stat, i) => (
             <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm group hover:shadow-xl transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <div className={`p-2 rounded-xl scale-110 ${
                     stat.color === 'red' ? 'bg-red-50 text-red-600' :
                     stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                     stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                   }`}>
                      {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
                   </div>
                </div>
                <p className="text-4xl font-black text-[#091426] tracking-tighter mb-4">{stat.val}</p>
                <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] font-mono ${
                  stat.color === 'red' ? 'text-red-500' :
                  stat.color === 'blue' ? 'text-blue-500' :
                  stat.color === 'amber' ? 'text-amber-600' : 'text-emerald-500'
                }`}>
                   {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {stat.delta}
                </div>
             </div>
           ))}
        </div>

        {/* Main Log Interface */}
        <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden flex flex-col">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/10">
              <div className="flex gap-10">
                {['ALL EVENTS', 'SECURITY', 'ACCESS', 'OVERRIDES'].map((cat, i) => (
                  <button key={i} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${
                    i === 0 ? 'text-blue-600 border-blue-600' : 'text-slate-300 border-transparent hover:text-slate-500'
                  }`}>{cat}</button>
                ))}
              </div>
              <div className="relative">
                 <input className="pl-10 pr-6 py-3 bg-slate-50 border-none rounded-2xl w-80 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-100 transition-all font-sans" placeholder="Search event fingerprints..." />
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
           </div>

           <table className="w-full text-left font-sans">
              <thead>
                 <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-10 py-6">Timestamp (UTC)</th>
                    <th className="px-10 py-6">Event Fingerprint</th>
                    <th className="px-10 py-6">Subject Principal</th>
                    <th className="px-10 py-6">Action / Protocol</th>
                    <th className="px-10 py-6">Result</th>
                    <th className="px-10 py-6 text-right">Criticity</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-[10px] font-black uppercase tracking-tight text-slate-500">
                 {[
                   { time: '2023-11-24 14:22:01.092', id: 'EV-982-XQ', sub: 'usr_root_admin', act: 'ROLE_MOD_ESCALATION', res: 'SUCCESS', crit: 'LOW' },
                   { time: '2023-11-24 14:19:44.811', id: 'EV-981-AB', sub: 'svc_worker_node_04', act: 'BATCH_PROCESS_INIT', res: 'COMPLETED', crit: 'INFO' },
                   { time: '2023-11-24 14:15:12.003', id: 'EV-980-CR', sub: 'usr_external_guest', act: 'UNAUTHORIZED_ACCESS', res: 'REJECTED', crit: 'CRITICAL' },
                   { time: '2023-11-24 14:12:09.992', id: 'EV-979-ZZ', sub: 'usr_compliance_mngr', act: 'DATA_EXPORT_RESTRICTED', res: 'PENDING', crit: 'HIGH' },
                   { time: '2023-11-24 14:08:33.111', id: 'EV-978-PL', sub: 'sys_cron_job_77', act: 'DB_CLEANUP_SEQ', res: 'SUCCESS', crit: 'INFO' },
                 ].map((row, i) => (
                   <tr key={i} className={`group transition-colors cursor-default ${row.crit === 'CRITICAL' ? 'bg-red-50/20 hover:bg-red-50/40' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-10 py-6 text-slate-300">{row.time}</td>
                      <td className="px-10 py-6 text-[#091426]">{row.id}</td>
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${row.sub.startsWith('usr') ? 'bg-blue-600 shadow-[0_0_5px_rgba(37,99,235,0.5)]' : 'bg-slate-300'}`} />
                            {row.sub}
                         </div>
                      </td>
                      <td className={`px-10 py-6 ${row.crit === 'CRITICAL' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>{row.act}</td>
                      <td className="px-10 py-6">
                         <span className={`inline-flex px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${
                           row.res === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                           row.res === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                           row.res === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                         }`}>{row.res}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <span className={`inline-flex px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm ${
                           row.crit === 'CRITICAL' ? 'bg-red-600 text-white' :
                           row.crit === 'HIGH' ? 'bg-amber-500 text-white' :
                           row.crit === 'LOW' ? 'bg-[#091426] text-white' : 'bg-slate-500 text-white opacity-40'
                         }`}>{row.crit}</span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>

           <div className="p-10 border-t border-slate-50 flex justify-between items-center bg-slate-50/10">
              <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span>Showing 1-25 of 1,429 entries</span>
                 <div className="h-4 w-px bg-slate-200" />
                 <select className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest p-0 focus:ring-0 cursor-pointer text-[#091426]">
                    <option>Rows per page: 25</option>
                    <option>50</option>
                    <option>100</option>
                 </select>
              </div>
              <div className="flex gap-4">
                 <button className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm bg-white"><ChevronLeft size={16} /></button>
                 <div className="flex gap-2">
                    <button className="w-10 h-10 bg-[#091426] text-white rounded-xl shadow-xl shadow-slate-200 font-black text-xs">1</button>
                    <button className="w-10 h-10 border border-slate-200 rounded-xl text-slate-400 hover:border-slate-400 transition-colors bg-white font-black text-xs">2</button>
                    <button className="w-10 h-10 border border-slate-200 rounded-xl text-slate-400 font-black text-xs">...</button>
                    <button className="w-10 h-10 border border-slate-200 rounded-xl text-slate-400 hover:border-slate-400 transition-colors bg-white font-black text-xs">58</button>
                 </div>
                 <button className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm bg-white"><ChevronRight size={16} /></button>
              </div>
           </div>
        </div>

        {/* Asymmetric Visual Panels */}
        <div className="grid grid-cols-12 gap-8">
           <div className="col-span-8 bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm flex flex-col gap-10 group hover:shadow-xl transition-all">
              <div className="flex justify-between items-center">
                 <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                    <Activity size={18} className="text-blue-600" /> Administrative Threat Heatmap
                 </h3>
                 <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group/btn">
                    Expand Visualization <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                 </button>
              </div>
              <div className="aspect-[21/9] w-full bg-[#091426] rounded-[2rem] border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner">
                 <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                 <div className="text-center relative z-10 space-y-4">
                    <div className="w-16 h-16 bg-blue-600/10 text-blue-400 rounded-full flex items-center justify-center mx-auto animate-pulse border border-blue-400/20">
                       <Terminal size={32} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-[0.3em]">Cryptographic_Data_Mapping::NOMINAL</p>
                 </div>
              </div>
           </div>

           <div className="col-span-4 bg-[#091426] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <History size={120} />
              </div>
              <div className="relative z-10">
                 <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                    <History size={16} className="text-blue-400" /> Recent Timeline
                 </h4>
                 <div className="space-y-10 relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                    {[
                      { time: '14:22 UTC', act: 'Escalated perm for Admin_01', color: 'blue', desc: 'Auth by SecOps Policy 4' },
                      { time: '14:19 UTC', act: 'Worker Node 04 Re-sync', color: 'slate', desc: 'Integrity validation passed' },
                      { time: '14:15 UTC', act: 'Critical Access Blocked', color: 'red', desc: 'IP 192.168.1.102 blacklisted' },
                    ].map((item, i) => (
                      <div key={i} className="relative group/time">
                         <div className={`absolute -left-[30px] top-1 w-4 h-4 rounded-full border-4 border-[#091426] z-10 shadow-sm ${
                           item.color === 'blue' ? 'bg-blue-600' :
                           item.color === 'red' ? 'bg-red-500' : 'bg-slate-700'
                         }`} />
                         <div className="space-y-1">
                            <p className="text-[9px] font-mono font-black text-blue-400 group-hover/time:text-white transition-colors uppercase tracking-widest">{item.time}</p>
                            <p className="text-sm font-black uppercase tracking-tight leading-none mb-1">{item.act}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <button className="relative z-10 w-full py-4 mt-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#091426] transition-all">View All Stream History</button>
           </div>
        </div>

        {/* Technical Footer */}
        <div className="pt-10 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.3em] overflow-hidden">
           <div className="flex gap-10 items-center">
              <div className="flex items-center gap-3">
                 <Terminal size={16} className="text-slate-900" />
                 <span>Audit_Node: SEC-7A (HOUSTON)</span>
              </div>
              <div className="h-4 w-px bg-slate-100" />
              <p>Buffer Status: NOMINAL // Load: 0.04%</p>
           </div>
           <p className="flex items-center gap-2 text-blue-600 font-extrabold group">
              <Fingerprint size={12} className="group-hover:scale-125 transition-transform" /> SECURE_LINK_ACTIVE
           </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditLog;
