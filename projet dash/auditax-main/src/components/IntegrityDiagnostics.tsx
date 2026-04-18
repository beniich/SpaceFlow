import React from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Cpu, 
  Lock, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  History, 
  Network,
  Fingerprint,
  HardDrive,
  Terminal,
  Server
} from 'lucide-react';

const IntegrityDiagnostics: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Forensic Node v5.1
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 <ShieldCheck size={10} className="fill-current" /> CRYPTO_ANCHORED: VERIFIED
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Data Integrity Diagnostics</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Real-time cryptographic verification of the global event store ledger. Monitor immutability health, Merkle root consistency, and cross-node synchronization levels.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#091426] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all active:scale-95 group">
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" /> Re-Sync Nodes
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#091426] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all">
              <Download size={14} /> Export Audit Log
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Main Visualization: Network Map */}
          <div className="col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50 relative z-10">
                <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                   <Globe size={18} className="text-blue-600" /> Global Event Store Nodes
                </h3>
                <div className="flex gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-100" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Healthy (24)</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Syncing (2)</span>
                   </div>
                </div>
             </div>

             <div className="relative h-[480px] bg-[#091426] rounded-[2rem] overflow-hidden border border-slate-900 group/map shadow-2xl">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                   <svg width="100%" height="100%" className="text-blue-500/20">
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                         <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                   </svg>
                </div>
                
                {/* Node Markers */}
                {[
                  { x: '20%', y: '30%', label: 'NODE_US_EAST', status: 'VERIFIED', color: 'bg-emerald-500' },
                  { x: '75%', y: '25%', label: 'NODE_EU_W', status: 'VERIFIED', color: 'bg-emerald-500' },
                  { x: '82%', y: '65%', label: 'NODE_ASIA_S', status: 'SYNCING', color: 'bg-amber-500', pulse: true },
                  { x: '35%', y: '75%', label: 'NODE_SA_1', status: 'VERIFIED', color: 'bg-emerald-500' },
                ].map((node, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ left: node.x, top: node.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node"
                  >
                    <div className="relative">
                       <div className={`w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center bg-[#091426] shadow-xl group-hover/node:scale-125 transition-all ${node.pulse ? 'animate-pulse' : ''}`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${node.color} shadow-lg shadow-emerald-900`} />
                       </div>
                       <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl min-w-[120px] opacity-0 group-hover/node:opacity-100 transition-all scale-75 group-hover/node:scale-100">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">{node.label}</p>
                          <p className="text-[8px] font-mono text-slate-400 mt-1 uppercase underline underline-offset-4">{node.status} _NODE</p>
                       </div>
                    </div>
                  </motion.div>
                ))}

                <div className="absolute bottom-10 left-10 space-y-2">
                   <p className="text-[8px] font-mono font-black text-blue-400 uppercase tracking-[0.3em]">Mapping global_shards_v4</p>
                   <div className="flex gap-1">
                      {[1, 1, 1, 1, 1, 0.4].map((v, i) => (
                        <div key={i} className={`w-4 h-1 rounded-full ${v === 1 ? 'bg-blue-600' : 'bg-blue-600/20'}`} />
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Side Gauges */}
          <div className="col-span-4 space-y-8">
             <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col group hover:shadow-xl transition-all">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex justify-between items-start">
                   Immutability Health <ShieldCheck size={14} className="text-blue-600" />
                </h4>
                <div className="flex items-center gap-8">
                   <div className="relative w-32 h-32 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle className="text-slate-50" cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" />
                         <motion.circle 
                           initial={{ strokeDashoffset: 364 }}
                           animate={{ strokeDashoffset: 3.64 * (100 - 99.9) }}
                           className="text-blue-600" cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.2" strokeLinecap="round" 
                         />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-black text-[#091426] tracking-tighter">99.9%</span>
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1 leading-none italic">Last Corrupt Bit Detected</p>
                         <p className="text-sm font-black text-[#091426] uppercase font-mono tracking-tighter leading-none">184 Days Ago</p>
                      </div>
                      <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[99.9%]" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hash Verification Progress</h4>
                <div className="space-y-8">
                   {[
                     { label: 'Current Block: 7,294,102', progress: 84 },
                     { label: 'Merkle Root Consistency', progress: 100 },
                   ].map((item, i) => (
                     <div key={i} className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-500">{item.label}</span>
                           <span className={item.progress === 100 ? 'text-emerald-600' : 'text-blue-600'}>{item.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: item.progress + '%' }} className={`h-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'} rounded-full shadow-lg shadow-blue-50`} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-[#091426] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Activity size={80} />
                </div>
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                   System Alerts <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                </h4>
                <div className="space-y-4">
                   {[
                     { icon: <CheckCircle2 size={14} className="text-emerald-400" />, msg: 'Daily integrity snapshot stored successfully.', tag: 'SNAPSHOT_OK' },
                     { icon: <RefreshCw size={14} className="text-blue-400" />, msg: 'New node registered: DX-881 (Ireland)', tag: 'NODE_ADDED' },
                   ].map((alert, i) => (
                     <div key={i} className="space-y-1 p-3 bg-white/5 border border-white/10 rounded-xl group/alert hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                           {alert.icon}
                           <span className="text-[7px] font-mono font-black text-slate-500 uppercase leading-none">{alert.tag}</span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-300 tracking-tight leading-relaxed">{alert.msg}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Forensic Log Table */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden overflow-x-auto">
           <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                 <Terminal size={18} className="text-blue-600" /> Real-time Forensic Log
              </h3>
              <div className="font-mono text-[9px] font-black text-slate-300 uppercase leading-none tracking-[0.2em]">
                 Live Stream _ Latency: 12ms
              </div>
           </div>
           
           <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                   <th className="px-10 py-5">Timestamp (UTC)</th>
                   <th className="px-10 py-5">Operation ID</th>
                   <th className="px-10 py-5 text-center">Entity Path</th>
                   <th className="px-10 py-5">Hash Checksum</th>
                   <th className="px-10 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-[11px] font-bold tracking-tight">
                 {[
                   { time: '14:22:18.401', id: 'TX_77218_AB', path: '/ledger_v4/block_294', hash: '8f2d...3a1c', status: 'VERIFIED', color: 'emerald' },
                   { time: '14:22:15.112', id: 'TX_77219_XC', path: '/ledger_v4/block_295', hash: '4a1b...e92d', status: 'VERIFIED', color: 'emerald' },
                   { time: '14:22:12.879', id: 'TX_77220_ZQ', path: '/ledger_v4/block_296', hash: 'bc81...012a', status: 'VALIDATING', color: 'blue', animate: true },
                   { time: '14:22:10.004', id: 'TX_77221_LM', path: '/ledger_v4/block_297', hash: 'dd24...776f', status: 'VERIFIED', color: 'emerald' },
                 ].map((log, i) => (
                   <tr key={i} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-4 text-slate-400">{log.time}</td>
                      <td className="px-10 py-4 text-[#091426] font-black">{log.id}</td>
                      <td className="px-10 py-4 text-slate-500 font-medium text-center">{log.path}</td>
                      <td className="px-10 py-4 text-blue-600 font-black">{log.hash}</td>
                      <td className="px-10 py-4 text-right">
                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                           log.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                         }`}>
                            {log.animate && <RefreshCw size={10} className="animate-spin" />}
                            {log.status === 'VERIFIED' && <Verified size={10} className="fill-current" fillOpacity={0.1} />}
                            {log.status}
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Technical Summary Footer */}
        <div className="pt-10 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.2em] relative overflow-hidden">
           <div className="flex gap-10 items-center">
              <div className="flex items-center gap-3">
                 <Server size={16} className="text-slate-900" />
                 <span>Primary Cluster: EU-WEST-01</span>
              </div>
              <div className="flex items-center gap-3 border-l border-slate-100 pl-10">
                 <HardDrive size={16} className="text-slate-900" />
                 <span>Storage: 14.8 PB // ZDrive_v9</span>
              </div>
           </div>
           <p>SYSTEM_EPOCH: 1698163200 // PROTOCOL: BLAKE3_HASHING</p>
        </div>
      </div>
    </div>
  );
};

const Verified = ({ size, className, fillOpacity }: { size: number, className?: string, fillOpacity?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    style={{ fillOpacity }}
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </svg>
);

export default IntegrityDiagnostics;
