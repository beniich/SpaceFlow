import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Key, 
  Terminal, 
  Eye, 
  EyeOff, 
  Trash2, 
  RotateCw, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  Lock, 
  Plus, 
  History, 
  Network, 
  Zap, 
  MoreVertical,
  Globe,
  Fingerprint,
  Cpu
} from 'lucide-react';

const APISecurity: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Secure Edge v3.0
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 <Shield size={10} className="fill-current" /> SECURITY_LEVEL: HARDENED
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">API & Access Management</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Manage programmatic access to the AuditMaster Global infrastructure. API keys provide scoped access to forensic data, compliance logs, and administrative event-stores.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-[#091426] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all">
              <Terminal size={14} /> Documentation
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
              <Plus size={14} /> Generate New Key
            </button>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
             <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Integrations</p>
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <Network size={16} />
                </div>
             </div>
             <div className="mt-8">
                <h3 className="text-5xl font-black text-[#091426] tracking-tighter">12</h3>
                <div className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest gap-2 mt-4">
                   <Zap size={14} className="animate-pulse" /> +3 from last month
                </div>
             </div>
          </div>

          <div className="col-span-4 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
             <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">API Calls (24h)</p>
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-[#091426] group-hover:text-white transition-all">
                   <Activity size={16} />
                </div>
             </div>
             <div className="mt-8">
                <h3 className="text-5xl font-black text-[#091426] tracking-tighter">842,109</h3>
                <div className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest gap-2 mt-4 font-mono">
                   <CheckCircle2 size={14} /> 99.9% SUCCESS RATE
                </div>
             </div>
          </div>

          <div className="col-span-4 bg-[#091426] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between h-full">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Security Posture</p>
                <h3 className="text-4xl font-black text-blue-400 tracking-tighter uppercase">Hardened</h3>
             </div>
             <div className="relative z-10 flex items-center text-[10px] font-black text-emerald-400 uppercase tracking-widest gap-2">
                <Lock size={14} /> All keys scoped per-org
             </div>
          </div>
        </div>

        {/* API Key Table */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
           <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                 <Key size={18} className="text-blue-600" /> Active Access Tokens
              </h3>
              <div className="relative group">
                 <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                 <input className="pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-blue-100 outline-none w-64 transition-all" placeholder="Search keys..." />
              </div>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-10 py-4 font-semibold uppercase tracking-widest">Key Name / ID</th>
                    <th className="px-10 py-4 font-semibold uppercase tracking-widest">Token Secret</th>
                    <th className="px-10 py-4 font-semibold uppercase tracking-widest">Scope</th>
                    <th className="px-10 py-4 font-semibold uppercase tracking-widest">Status</th>
                    <th className="px-10 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-mono text-xs font-bold uppercase tracking-tight">
                   {[
                     { name: 'SIEM Integration (Prod)', id: 'key_01H2X...92K', secret: 'am_••••••••••••••••', scope: 'READ_ONLY', status: 'ACTIVE', color: 'emerald' },
                     { name: 'Automation Script v2', id: 'key_01J9W...33L', secret: 'am_9j2k...m4n1', scope: 'WRITE_LOGS', status: 'ACTIVE', color: 'emerald', visible: true },
                     { name: 'External Auditor Access', id: 'key_01G3B...11P', secret: 'am_••••••••••••••••', scope: 'READ_ONLY', status: 'REVOKED', color: 'slate', disabled: true },
                   ].map((key, i) => (
                     <tr key={i} className={`group hover:bg-slate-50 transition-colors ${key.disabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                       <td className="px-10 py-6">
                          <p className="text-sm font-black text-[#091426] mb-1">{key.name}</p>
                          <p className="text-[10px] font-mono text-slate-300">ID: {key.id}</p>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                             <code className="bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600">{key.secret}</code>
                             {!key.disabled && (
                               <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                 {key.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                               </button>
                             )}
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <span className={`inline-flex px-2 py-1 rounded border text-[8px] font-black tracking-widest ${
                            key.scope.includes('WRITE') ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {key.scope}
                          </span>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${key.color === 'emerald' ? 'bg-emerald-500 shadow-lg shadow-emerald-100 animate-pulse' : 'bg-slate-300'}`} />
                             <span className={`text-[10px] font-black ${key.color === 'emerald' ? 'text-emerald-700' : 'text-slate-400'}`}>{key.status}</span>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                             <button className="p-2 border border-slate-100 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-white transition-all"><RotateCw size={14} /></button>
                             <button className="p-2 border border-slate-100 text-slate-400 rounded-xl hover:text-red-600 hover:bg-white transition-all"><Trash2 size={14} /></button>
                          </div>
                       </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

        {/* Trail & Restrictions Grid */}
        <div className="grid grid-cols-12 gap-8">
           <div className="col-span-8 bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                 <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                    <History size={18} className="text-blue-600" /> Recent Key Activity
                 </h3>
                 <span className="text-[10px] font-mono font-black text-slate-300 uppercase">Latency: 14ms</span>
              </div>
              
              <div className="space-y-8 relative pl-8 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                 {[
                   { user: 'admin@auditmaster.global', activity: 'New API Key Created: "Automation Script v2"', time: '10:02 AM', color: 'blue' },
                   { user: 'System (Auto-Expiration)', activity: 'Key Revoked: "External Auditor Access"', time: 'Yesterday, 11:45 PM', color: 'red' },
                   { user: 'admin@auditmaster.global', activity: 'Key Secret Rotated: "SIEM Integration"', time: 'Oct 22, 16:30', color: 'slate' },
                 ].map((log, i) => (
                   <div key={i} className="relative group/log">
                      <div className={`absolute -left-[32px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-${log.color === 'blue' ? 'blue-600' : log.color === 'red' ? 'red-600' : 'slate-300'} z-10 transition-all group-hover/log:scale-125`} />
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-xs font-black text-[#091426] uppercase tracking-tight">{log.activity}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Authorized by: {log.user}</p>
                         </div>
                         <span className="text-[10px] font-mono font-black text-slate-300">{log.time}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="col-span-4 space-y-8">
              <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 -mr-4 -mt-4">
                    <Fingerprint size={120} />
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Best Practices
                 </h4>
                 <ul className="space-y-4">
                    {[
                      'Use scoped tokens instead of full access.',
                      'Rotate production keys every 90 days.',
                      'Monitor IP logs for suspicious activity.'
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3 text-[10px] font-bold uppercase tracking-tight leading-relaxed text-blue-100">
                         <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">√</div>
                         {step}
                      </li>
                    ))}
                 </ul>
              </div>

              <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
                 <h4 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] mb-8">Network Restrictions</h4>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between group cursor-pointer">
                       <span className="text-xs font-black text-slate-600 uppercase tracking-tight">IP Whitelisting</span>
                       <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full transition-all" />
                       </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Whitelist</p>
                       <div className="flex flex-wrap gap-2">
                          {['192.168.1.104', '10.0.0.45'].map(ip => (
                            <span key={ip} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-500">{ip}</span>
                          ))}
                          <button className="p-1 px-3 border-2 border-dashed border-slate-100 text-slate-300 rounded-lg hover:border-blue-200 hover:text-blue-500 transition-all">+</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* System Diagnostics */}
        <div className="pt-10 border-t border-slate-200 flex justify-between items-center relative overflow-hidden">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                 <Cpu size={20} className="text-slate-900" />
                 <div>
                    <p className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] leading-none mb-1">Compute Core</p>
                    <p className="text-[9px] font-mono text-slate-400 uppercase">Load: 12% // Latency: 4ms</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 pb-2 border-b-2 border-emerald-500">
                 <Shield size={20} className="text-emerald-500 fill-current" fillOpacity={0.1} />
                 <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Integrity Validated</span>
              </div>
           </div>
           <div className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest">
              BUILD v4.2.1-STABLE • RSA_4096_PKCS#1V15
           </div>
        </div>
      </div>
    </div>
  );
};

export default APISecurity;
