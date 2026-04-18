import React from 'react';
import { 
  Settings, 
  Server, 
  Database, 
  Key, 
  Globe, 
  ShieldCheck, 
  Activity,
  Cpu,
  RefreshCw,
  Power
} from 'lucide-react';
import { motion } from 'motion/react';

export const SystemConfig = () => {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-1000 mt-2">
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Configuration</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">Manage global compliance nodes, API webhooks, and database synchronization logic.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Left Column - System Integration Health */}
         <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
               <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex items-center gap-3">
                     <Cpu size={16} className="text-blue-600" />
                     <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Integration Health & Endpoints</h3>
                  </div>
                  <button className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors tracking-widest">
                     <RefreshCw size={12} /> Ping All
                  </button>
               </div>
               
               <div className="divide-y divide-slate-50 dark:divide-slate-800/50 p-2">
                  {[
                    { name: 'Primary Database (PostgreSQL)', status: 'Connected', latency: '12ms', url: 'db.cluster-alpha.internal:5432' },
                    { name: 'Forensic Event Store', status: 'Connected', latency: '4ms', url: 'events.auditmaster.local:4222' },
                    { name: 'AI Diagnostics Engine', status: 'Syncing', latency: '185ms', url: 'ai.diagnostics.ext/v1/predict' },
                    { name: 'LDAP / AD Auth Gateway', status: 'Connected', latency: '45ms', url: 'auth.enterprise.net:636' }
                  ].map(endpoint => (
                    <div key={endpoint.name} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 flex items-center justify-between rounded-xl transition-colors">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                             endpoint.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            <Server size={18} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900 dark:text-white">{endpoint.name}</p>
                             <p className="text-[10px] text-slate-400 font-mono mt-0.5">{endpoint.url}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="flex items-center justify-end gap-2 mb-1">
                             <div className={`w-1.5 h-1.5 rounded-full ${endpoint.status === 'Connected' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{endpoint.status}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{endpoint.latency} latency</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Security & Encryption Rules</h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                     <ShieldCheck size={24} className="text-blue-600 mb-3" />
                     <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Data at Rest</h4>
                     <p className="text-xs text-slate-500 mb-4">AES-256 encryption is mandated across all active databases.</p>
                     <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
                        <span className="text-[10px] font-bold text-slate-400">Strict Mode</span>
                        <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                           <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                     </div>
                  </div>
                  <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                     <Key size={24} className="text-blue-600 mb-3" />
                     <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">API Key Rotation</h4>
                     <p className="text-xs text-slate-500 mb-4">Automatically rotate external integration keys every 30 days.</p>
                     <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
                        <span className="text-[10px] font-bold text-slate-400">Auto-Rotate</span>
                        <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                           <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column - System Controls */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl shadow-xl overflow-hidden text-white relative">
               <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-3xl rounded-full"></div>
               <div className="relative z-10 p-8">
                  <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-6">Master Controls</h3>
                  
                  <div className="space-y-6">
                     <div>
                        <p className="text-sm font-bold text-white uppercase mb-1">Maintenance Mode</p>
                        <p className="text-xs text-slate-400">Locks out all non-admin users during patching.</p>
                        <button className="mt-3 w-full py-2.5 bg-slate-800 hover:bg-red-600 hover:text-white transition-all text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-lg border border-slate-700">
                           <Power size={14} /> Enable Maintenance
                        </button>
                     </div>
                     <div className="h-px bg-slate-800"></div>
                     <div>
                        <p className="text-sm font-bold text-white uppercase mb-1">Cache Flattening</p>
                        <p className="text-xs text-slate-400">Clear global UI and endpoint telemetry caches.</p>
                        <button className="mt-3 w-full py-2.5 bg-slate-800 hover:bg-slate-700 transition-all text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-lg border border-slate-700">
                           <Database size={14} /> Clear System Cache
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Version Info</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500">Platform Core</span>
                    <span className="font-mono bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600">v3.4.1-STABLE</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500">React Client</span>
                    <span className="font-mono bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600">v18.2.0</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500">Last Deployment</span>
                    <span className="font-mono text-slate-500">4 hours ago</span>
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};
