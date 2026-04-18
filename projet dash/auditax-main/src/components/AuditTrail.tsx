import React, { useState } from 'react';
import { 
  History, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  Download, 
  Fingerprint,
  ChevronRight,
  Database
} from 'lucide-react';
import { Audit } from '../types';

export const AuditTrail = ({ audits }: { audits: Audit[] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Forensic Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Fingerprint size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Forensic Traceability</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Immutable Event Ledger</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">Reconstruct integrity by replaying transaction logs from the cryptographic event store. Bit-perfect state verification.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg flex items-center gap-3 shadow-sm">
           <Database size={20} className="text-blue-600" />
           <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Event Store Status</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">ONLINE / SHA-256 Chain Locked</p>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-96">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filter by hash, user, or entity..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">
            <Download size={14} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10">
            Verify Full Chain
          </button>
        </div>
      </div>

      {/* Forensic List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Timeline - Main Column */}
        <div className="md:col-span-2 space-y-6">
          {audits.map((audit) => (
            <div key={audit.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm group">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <FileText size={16} className="text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{audit.entityId}</h4>
                    <p className="text-[9px] font-mono text-slate-400 font-bold">UUID: {audit.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-2 py-0.5 rounded leading-none flex items-center gap-1">
                    <ShieldCheck size={10} /> CHAIN_VALID
                  </span>
                </div>
              </div>
              
              <div className="p-6 relative">
                 <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800" />
                 
                 <div className="space-y-8 relative">
                    {/* Reconstructing 3 fake forensic entries per audit for visual impact */}
                    <div className="flex gap-6 items-start">
                       <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 ring-1 ring-blue-100 z-10 mt-1" />
                       <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 group-hover:border-blue-100 transition-all">
                          <div className="flex justify-between mb-1">
                             <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">STATUS_CHANGE: SUBMITTED</span>
                             <span className="text-[9px] font-mono text-slate-500 font-bold">14:22:10Z</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono italic">Signature: 8f2a...c91e | Verified by System_Automation</p>
                       </div>
                    </div>

                    <div className="flex gap-6 items-start">
                       <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-900 ring-1 ring-slate-100 z-10 mt-1" />
                       <div className="flex-1 p-3">
                          <div className="flex justify-between mb-1">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">RESPONSE_ADDED: Section [HSE]</span>
                             <span className="text-[9px] font-mono text-slate-400 font-bold">14:05:44Z</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-6 items-start">
                       <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 ring-1 ring-emerald-100 z-10 mt-1" />
                       <div className="flex-1 bg-emerald-50/30 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100/50 dark:border-emerald-900/50">
                          <div className="flex justify-between mb-1">
                             <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-tighter">EVIDENCE_VERIFIED: IMG_402.PNG</span>
                             <span className="text-[9px] font-mono text-emerald-600 font-bold">13:59:02Z</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    Expand Replay <ChevronRight size={14} />
                 </button>
                 <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">Hash Block 0xFD42...A1</span>
              </div>
            </div>
          ))}
        </div>

        {/* Investigative Sidebar */}
        <div className="flex flex-col gap-8">
           <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl overflow-hidden relative">
              <div className="absolute -right-4 -top-4 opacity-10">
                 <Fingerprint size={120} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4">Forensic Stats</h3>
              <div className="space-y-6 relative z-10">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Hash Checks</p>
                    <p className="text-2xl font-black">104,292</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Integrity Failures</p>
                    <p className="text-2xl font-black text-red-400">0</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">System Latency</p>
                    <p className="text-2xl font-black text-emerald-400">12ms</p>
                 </div>
              </div>
              <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                 Launch Deep Scan
              </button>
           </div>

           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">Recent Anomaly Clusters</h3>
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-lg">
                    <AlertCircle size={20} className="text-red-500" />
                    <div>
                       <p className="text-xs font-bold text-red-900 dark:text-red-400">Timestamp Drift</p>
                       <p className="text-[10px] text-red-700 dark:text-red-500 font-medium">EMEA-Paris-01 | +1.2s variance</p>
                    </div>
                 </div>
                 <div className="text-center p-6 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">No other threats detected</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
