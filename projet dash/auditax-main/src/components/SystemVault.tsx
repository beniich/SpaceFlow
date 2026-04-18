import React from 'react';
import { 
  Database, 
  ShieldCheck, 
  Activity, 
  Lock, 
  Network, 
  Zap,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { useLiveUpdates } from '../hooks/useLiveUpdates';
import { InfrastructureService } from '../services/InfrastructureService';

const Gauge = ({ value, label, sublabel }: { value: number, label: string, sublabel: string }) => (
  // ... Gauge implementation unchanged ...
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <ShieldCheck size={16} className="text-blue-600" />
    </div>
    <div className="flex items-center gap-6">
       <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
             <circle className="text-slate-100 dark:text-slate-800" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
             <circle className="text-blue-600" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - value/100)} strokeWidth="8" strokeLinecap="round"></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-slate-900 dark:text-white">{value}%</div>
       </div>
       <div className="flex-1">
          <p className="text-[11px] font-bold text-slate-500 mb-1">{sublabel}</p>
          <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Integrity Verified</p>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500" style={{ width: `${value}%` }}></div>
          </div>
       </div>
    </div>
  </div>
);

export const SystemVault = () => {
  useLiveUpdates();
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => InfrastructureService.getStats(),
  });

  const healthyPercent = stats ? Math.round((stats.healthy / stats.total) * 100) : 100;

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider font-mono">SYSTEM_ACTIVE</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-tighter">Session: 0xFF821A...</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Integrity Diagnostics</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time cryptographic verification of the global event store ledger.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 uppercase tracking-widest transition-all shadow-sm">
            <RefreshCw size={16} /> Re-Sync Nodes
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 uppercase tracking-widest transition-all shadow-lg">
            <Database size={16} /> Export Audit Log
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Network Topology Map (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
           <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                <Network size={20} className="text-blue-600" />
                Global Event Store Nodes
              </h3>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Healthy ({stats?.healthy || 0})</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Degraded ({stats?.degraded || 0})</span>
                 </div>
              </div>
           </div>

           <div className="flex-1 relative bg-slate-950 overflow-hidden group">
              {/* Animated Network Lines (SVG) */}
              <div className="absolute inset-0 opacity-20 pointer-events-none grayscale">
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                   <path d="M100,100 L400,150 L800,100 M400,150 L500,400 L200,300" stroke="white" strokeWidth="0.5" fill="none" />
                </svg>
              </div>

              {/* Floating Node Chips */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] left-[15%] flex flex-col items-center gap-2"
              >
                 <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 backdrop-blur-md">
                    <Database size={24} />
                 </div>
                 <span className="text-[9px] font-black text-white px-2 py-0.5 bg-emerald-950/80 rounded border border-emerald-500/30 font-mono tracking-widest uppercase">NODE_US_EAST</span>
              </motion.div>

              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] left-[60%] flex flex-col items-center gap-2"
              >
                 <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/40 rounded-full flex items-center justify-center text-amber-400 animate-pulse backdrop-blur-md">
                    <RefreshCw size={28} className="animate-spin-slow" />
                 </div>
                 <span className="text-[9px] font-black text-white px-2 py-0.5 bg-amber-950/80 rounded border border-amber-500/30 font-mono tracking-widest uppercase">NODE_ASIA_S (SYNCING)</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[75%] flex flex-col items-center gap-2"
              >
                 <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 backdrop-blur-md">
                    <Database size={20} />
                 </div>
                 <span className="text-[9px] font-black text-white px-2 py-0.5 bg-emerald-950/80 rounded border border-emerald-500/30 font-mono tracking-widest uppercase">NODE_EU_W</span>
              </motion.div>
           </div>
        </div>

        {/* Right Sidebar Gauges (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
           <Gauge value={99.9} label="Immutability Health" sublabel="Last Corrupt Bit Detected" />
           
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Verification Progress</h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase mb-2">
                       <span className="text-slate-500">Current Block: 7,294,102</span>
                       <span className="text-blue-600">84%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600" style={{ width: '84%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase mb-2">
                       <span className="text-slate-500">Merkle Root Consistency</span>
                       <span className="text-emerald-600">100%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 uppercase tracking-widest" style={{ width: '100%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">System Alerts</h4>
              <div className="flex flex-col gap-3">
                 <div className="flex gap-3 items-start p-3 bg-blue-600/10 border-l-4 border-blue-600 rounded">
                    <Activity size={16} className="text-blue-500" />
                    <div>
                       <p className="text-[11px] font-bold text-blue-200 uppercase tracking-tighter leading-none">New node registered</p>
                       <p className="text-[10px] text-blue-400 mt-1">DX-881 (Ireland) joined network.</p>
                    </div>
                 </div>
                 <div className="flex gap-3 items-start p-3 bg-emerald-600/10 border-l-4 border-emerald-600 rounded">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <div>
                       <p className="text-[11px] font-bold text-emerald-200 uppercase tracking-tighter leading-none">Integrity Snapshot</p>
                       <p className="text-[10px] text-emerald-400 mt-1">Daily block confirmed successfully.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Live Forensic Table (12 Cols) */}
        <div className="col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
           <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Lock size={16} className="text-blue-600" />
                Live Blockchain Stream
              </h3>
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Latency: 12ms</span>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp (UTC)</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation ID</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Block Hash</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {[
                      { ts: '14:22:18Z', id: 'TX_77218_AB', hash: '8f2d...3a1c', status: 'VERIFIED' },
                      { ts: '14:22:15Z', id: 'TX_77219_XC', hash: '4a1b...e92d', status: 'VERIFIED' },
                      { ts: '14:22:12Z', id: 'TX_77220_ZQ', hash: 'bc81...012a', status: 'HASHING' },
                      { ts: '14:22:10Z', id: 'TX_77221_LM', hash: 'dd24...776f', status: 'VERIFIED' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                         <td className="px-6 py-4 font-mono text-[11px] text-slate-500 font-bold">{row.ts}</td>
                         <td className="px-6 py-4 text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{row.id}</td>
                         <td className="px-6 py-4 font-mono text-[11px] text-slate-400 group-hover:text-blue-600 transition-colors font-bold">{row.hash}</td>
                         <td className="px-6 py-4 text-right">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               row.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600 animate-pulse'
                            }`}>
                               {row.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};
