import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Map as MapIcon, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Lock, 
  AlertTriangle, 
  Download, 
  Search, 
  Bell, 
  Shield, 
  History,
  LayoutGrid,
  MapPin,
  RefreshCw,
  Server,
  Cloud,
  FileText
} from 'lucide-react';

const SovereigntyMonitor: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-200">
              System Nominal
            </span>
            <span className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase">
              Last Verified: 2023-10-24 14:32:01 UTC
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase">Data Sovereignty & Residency</h1>
          <p className="font-medium text-slate-500 max-w-2xl mt-2 text-sm leading-relaxed">
            Real-time visualization of global data distribution and compliance status across 24 regional data centers. All replication paths are cryptographically attested.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Global Map Visualization (Large Focus) */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden relative min-h-[550px] shadow-sm">
            <div className="absolute top-8 left-8 z-10">
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-2xl space-y-1">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Global Health Index</div>
                <div className="text-3xl font-black text-[#091426] tracking-tighter">99.98%</div>
                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={14} fill="currentColor" fillOpacity={0.1} />
                  Compliant
                </div>
              </div>
            </div>

            {/* Simulated Map Design with Nodes */}
            <div className="absolute inset-0 bg-[#0f172a] overflow-hidden">
               {/* World Map SVG or Illustration Placeholder */}
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]" />
               
               {/* Animated Connections */}
               <svg className="absolute inset-0 w-full h-full opacity-30">
                 <path d="M200,200 Q400,150 600,200" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse" />
                 <path d="M600,200 Q800,300 900,400" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
               </svg>

               {/* Map Nodes */}
               <div className="absolute top-1/3 left-1/4 group cursor-help">
                 <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute" />
                 <div className="w-4 h-4 bg-blue-500 rounded-full relative border-2 border-white shadow-lg" title="NA-EAST-1: 1.2PB STORED" />
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   whileHover={{ opacity: 1, y: 0 }}
                   className="absolute top-full mt-3 bg-[#091426] text-white p-3 rounded-xl text-[9px] font-mono font-bold whitespace-nowrap z-20 border border-slate-700 shadow-2xl"
                 >
                   <p className="text-blue-400 mb-1">NODE: NA-EAST-1</p>
                   <p>CAPACITY: 1.2 PB</p>
                   <p>LATENCY: 14MS</p>
                 </motion.div>
               </div>

               <div className="absolute top-[45%] left-1/2 group cursor-help">
                 <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute" />
                 <div className="w-4 h-4 bg-blue-500 rounded-full relative border-2 border-white shadow-lg" title="EU-CENTRAL-1: 840TB STORED" />
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   whileHover={{ opacity: 1, y: 0 }}
                   className="absolute top-full mt-3 bg-[#091426] text-white p-3 rounded-xl text-[9px] font-mono font-bold whitespace-nowrap z-20 border border-slate-700 shadow-2xl"
                 >
                   <p className="text-blue-400 mb-1">NODE: EU-CENTRAL-1</p>
                   <p>CAPACITY: 840 TB</p>
                   <p>LATENCY: 8MS</p>
                 </motion.div>
               </div>
            </div>

            <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-xl space-y-3">
              {[
                { label: 'Primary Storage', color: 'bg-blue-600' },
                { label: 'Disaster Recovery', color: 'bg-slate-300' },
                { label: 'Compliance Alert', color: 'bg-red-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Breakdown Cards */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            {[
              { region: 'European Union', code: 'GDPR Scope: HIGH', icon: <Globe size={20} />, status: '100% LOCAL', primary: 'Frankfurt', backup: 'Paris', color: 'text-blue-600' },
              { region: 'North America', code: 'CCPA/PIPEDA Compliance', icon: <Server size={20} />, status: '100% LOCAL', primary: 'Oregon', backup: 'Virginia', color: 'text-blue-600' },
              { region: 'APAC', code: 'PIPL Requirements', icon: <Cloud size={20} />, status: 'RESTRICTED', primary: 'Tokyo', backup: 'Singapore', color: 'text-amber-600', special: true },
            ].map((item, i) => (
              <div key={i} className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${item.special ? 'border-l-4 border-l-amber-500' : 'border-slate-200'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black text-[#091426] uppercase tracking-tight">{item.region}</h3>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest mt-1">{item.code}</p>
                  </div>
                  <div className={`${item.color} opacity-20`}>{item.icon}</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Data Residency</span>
                    <span className={item.color}>{item.status}</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden shadow-inner border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: i === 2 ? '65%' : '100%' }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`${item.color.replace('text-', 'bg-')} h-full`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1 leading-none">Primary</div>
                      <div className="text-xs font-bold text-slate-700">{item.primary}</div>
                    </div>
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1 leading-none">Backup</div>
                      <div className="text-xs font-bold text-slate-700">{item.backup}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cryptographic Residency Logs */}
          <div className="col-span-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
              <div>
                <h2 className="text-xl font-black text-[#091426] uppercase tracking-tight">Cryptographic Residency Logs</h2>
                <p className="text-sm text-slate-400 font-medium mt-1">Immutable record of data movement across sovereign boundaries.</p>
              </div>
              <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-blue-100">
                <Download size={14} /> Export Manifest
              </button>
            </div>

            <div className="relative border-l-2 border-slate-50 ml-3 space-y-12">
              {[
                { type: 'MIGRATION_VERIFIED', desc: 'Payload SHA-256: 4f1a...9d2 successfully homed in EU-WEST-1 (Dublin).', time: '2023-10-24 12:04:11', meta: 'NODES: 14/14', icon: <Lock size={12} fill="currentColor" />, color: 'text-blue-600' },
                { type: 'REPLICATION_SYNC', desc: 'DR failover synchronization completed for APAC-SOUTH-2 (Singapore).', time: '2023-10-24 10:15:45', meta: 'LATENCY: 42MS', icon: <RefreshCw size={12} />, color: 'text-slate-400' },
                { type: 'POLICY_UPDATE', desc: 'Updated data residency tags for Australian Consumer Law (ACL) compliance.', time: '2023-10-23 23:59:59', meta: 'ADMIN: J.SMITH', icon: <AlertTriangle size={12} fill="currentColor" />, color: 'text-orange-500' },
              ].map((log, i) => (
                <div key={i} className="relative pl-10">
                  <div className={`absolute left-[-13px] top-1 w-6 h-6 rounded-full bg-white border-2 border-current flex items-center justify-center z-10 ${log.color}`}>
                    {log.icon}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${log.color}`}>{log.type}</div>
                      <div className="text-sm font-medium text-slate-600 leading-relaxed">
                        {log.desc.split(' ').map((word, j) => 
                          (word.toUpperCase() === word && word.length > 5) || word.startsWith('SHA-') ? 
                          <span key={j} className="text-[#091426] font-bold font-mono text-[10px] bg-slate-50 px-1 rounded">{word} </span> : word + ' '
                        )}
                      </div>
                    </div>
                    <div className="text-left md:text-right space-y-1">
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{log.time}</div>
                      <div className="inline-block bg-slate-50 border border-slate-100 rounded-lg px-3 py-1 text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest leading-none mt-1">
                        {log.meta}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action for Visualization */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-blue-700 transition-colors shadow-blue-200"
      >
        <MapIcon size={24} />
      </motion.button>
    </div>
  );
};

export default SovereigntyMonitor;
