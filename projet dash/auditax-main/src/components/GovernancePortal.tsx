import React, { useState } from 'react';
import { 
  Gavel, 
  FileCheck, 
  History, 
  Fingerprint, 
  ShieldCheck, 
  Key, 
  Download, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  Search,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

export const GovernancePortal = () => {
  const [activePortalTab, setActivePortalTab] = useState<'REPORTS' | 'TRANSPARENCY' | 'EXECUTIVE'>('REPORTS');

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-1000 mt-2">
      {/* Header & Scoped Selector */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Governance & Regulatory Portal</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">Forensic compliance gateway for external auditing bodies and board-level reporting. All artifacts are cryptographically signed.</p>
        </div>
        <div className="w-80">
          <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest px-1">Scoped Entity Selection</label>
          <div className="relative group">
            <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 appearance-none focus:ring-2 focus:ring-blue-500/20 text-xs font-black uppercase tracking-tight shadow-sm cursor-pointer transition-all hover:border-blue-600">
               <option>ISO-9001 Compliance Wing</option>
               <option>FDA Pharmaceutical Div.</option>
               <option>GDPR Protection Bureau</option>
            </select>
            <ChevronRight size={16} className="absolute right-3 top-3.5 text-slate-400 group-hover:text-blue-600 rotate-90" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Shared Reports & Summary (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
           
           {/* Stat Cards */}
           <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Reports Shared', value: '142', status: 'VERIFIED', color: 'text-blue-600' },
                { label: 'Active Inquiries', value: '04', status: 'IN REVIEW', color: 'text-amber-600' },
                { label: 'Integrity Score', value: '99.9%', status: '24H SYNC', color: 'text-emerald-600' }
              ].map(stat => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                   <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
                   <div className="mt-4 inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                      <ShieldCheck size={10} className={stat.color} />
                      <span className="text-[8px] font-black text-slate-500 uppercase">{stat.status}</span>
                   </div>
                </div>
              ))}
           </div>

           {/* Shared Audit Reports Table */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
                 <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Shared Audit Artifacts</h3>
                 <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors text-slate-400"><Search size={14} /></button>
                    <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors text-slate-400"><Download size={14} /></button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">Report ID / Scope</th>
                          <th className="px-6 py-4">Timestamp</th>
                          <th className="px-6 py-4">Integrity Seal</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                       {[
                         { id: 'AUD-2023-9921', scope: 'Q4 Infrastructure Security', date: '2023-10-24', status: 'VERIFIED' },
                         { id: 'AUD-2023-9944', scope: 'Data Sovereignty Protocol', date: '2023-10-22', status: 'VERIFIED' },
                         { id: 'AUD-2023-1005', scope: 'Biotech Lab Compliance', date: '2023-10-20', status: 'VERIFIED' }
                       ].map(report => (
                         <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                               <p className="text-[11px] font-black text-blue-600 uppercase font-mono tracking-tighter">{report.id}</p>
                               <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">{report.scope}</p>
                            </td>
                            <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">{report.date}</td>
                            <td className="px-6 py-4">
                               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full border border-emerald-100 dark:border-emerald-800 text-[9px] font-black uppercase tracking-widest">
                                  <Fingerprint size={12} /> VERIFIED SIGNATURE
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1 ml-auto">
                                  View Ledger <ExternalLink size={10} />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Cryptographic Proof Section */}
           <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-8 relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                 <h4 className="text-xl font-black text-white mb-2 italic">Cryptographic Proof of Audit</h4>
                 <p className="text-slate-400 text-sm max-w-md leading-relaxed">Our Event-Store technology ensures that audit logs are immutable and sequentially anchored. Download the verification key to cross-reference with global nodes.</p>
                 <button className="mt-8 flex items-center gap-2 px-8 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95">
                    <Key size={16} /> Download Root Verification Key
                 </button>
              </div>
              <div className="absolute top-1/2 -right-12 -translate-y-1/2 opacity-10">
                 <Fingerprint size={280} className="text-white" />
              </div>
           </div>
        </div>

        {/* Right Column: Auditor Details & Logs (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           
           {/* Regulator Account Card */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
                    <Gavel size={28} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">ISO Internal Audit</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certified Body #8841-B</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Access Level</span>
                    <span className="text-blue-600 uppercase font-black">Read-Only (Scoped)</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Session IP</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">192.168.1.104</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Token Expires</span>
                    <span className="text-red-500 font-black">2H 14M</span>
                 </div>
              </div>
           </div>

           {/* Transparency Logs */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
                 <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Transparency Logs</h3>
                 <Lock size={14} className="text-slate-400" />
              </div>
              <div className="p-8 flex-1">
                 <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-10">
                    <div className="relative">
                       <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-600 shadow-md"></div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">14:52 Today</p>
                       <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Accessed Report: AUD-9921</p>
                       <p className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">SHA-256: 4f1a...b2e3</p>
                    </div>
                    <div className="relative">
                       <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700"></div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">14:15 Today</p>
                       <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Auth Success: ISO_GATEWAY</p>
                       <p className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">Node: SG-WEST-02</p>
                    </div>
                    <div className="relative">
                       <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700"></div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Yesterday</p>
                       <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Downloaded Root Key</p>
                       <p className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">SIG: RSA_4096_V1</p>
                    </div>
                 </div>
                 <button className="w-full mt-12 py-3 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-500 rounded-xl border border-slate-100 dark:border-slate-700 uppercase tracking-widest hover:bg-slate-100 transition-all">Load Full Session History</button>
              </div>
           </div>
        </div>
      </div>

      {/* Secure footer */}
      <div className="fixed bottom-6 right-6 z-50">
         <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6">
            <div className="flex items-center gap-2">
               <ShieldCheck size={16} className="text-emerald-500" />
               <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Secure Channel Active</span>
            </div>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Session monitored for regulatory transparency.</p>
         </div>
      </div>
    </div>
  );
};
