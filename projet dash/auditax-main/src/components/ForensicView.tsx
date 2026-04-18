import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  History, 
  Lock, 
  Key, 
  Fingerprint, 
  Download, 
  Filter,
  Eye,
  AlertTriangle,
  Play,
  RotateCcw,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
  FileCode,
  FileText,
  Activity,
  VerifiedIcon
} from 'lucide-react';

const ForensicView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#091426] tracking-tighter uppercase">Forensic File Recovery</h1>
            <p className="text-slate-500 font-medium mt-2 max-w-2xl">
              Restore integrity by replaying transaction logs from the Event Store. Investigative tools for bit-perfect file state reconstruction.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 px-6 py-3 rounded-xl flex items-center gap-4 shadow-sm">
              <Database className="text-blue-600" size={24} />
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">Event Store Status</p>
                <p className="font-mono text-sm font-bold text-[#091426]">ONLINE / 4.2 PB Indexed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Workspace Bento Grid */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Timeline/Replay Controller */}
          <section className="col-span-8 bg-white border border-slate-200 p-8 rounded-2xl flex flex-col gap-8 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
              <div className="flex items-center gap-3">
                <Activity className="text-blue-600" size={20} />
                <h2 className="text-lg font-bold text-[#091426] uppercase tracking-wider">Transaction Replay Timeline</h2>
              </div>
              <div className="flex gap-2">
                <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-100">
                  <ShieldCheck size={12} fill="currentColor" fillOpacity={0.2} />
                  CRYPTO-VERIFIED
                </span>
              </div>
            </div>

            {/* Visual Timeline Card */}
            <div className="h-56 bg-slate-50 rounded-2xl relative border border-slate-100 flex flex-col justify-end p-6 group overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 39px, #94a3b8 40px)' }}></div>
              
              {/* Event Markers Visualization */}
              <div className="relative h-24 w-full flex items-end gap-1.5">
                {[40, 60, 90, 45, 30, 70, 10, 15, 85, 40, 50, 65, 30, 20].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={`flex-1 min-w-4 rounded-t-sm transition-all cursor-crosshair
                      ${h > 80 ? 'bg-red-200 border-t-2 border-red-400 hover:bg-red-400' : 'bg-blue-200 border-t-2 border-blue-400 hover:bg-blue-400'}
                    `}
                  />
                ))}
                
                {/* Current Playhead */}
                <div className="absolute left-1/3 top-[-60px] bottom-0 w-0.5 bg-blue-600 flex flex-col items-center">
                  <div className="bg-blue-600 text-white font-mono text-[10px] px-3 py-1 rounded-full mb-2 whitespace-nowrap shadow-lg">
                    T-MINUS 14:02:11
                  </div>
                  <div className="w-2 h-2 bg-blue-600 rotate-45" />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-4 gap-8 py-2">
              <div className="col-span-1 border-r border-slate-50 pr-8">
                <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-widest">Recovery Point</label>
                <p className="font-mono text-xs font-bold text-blue-600 truncate uppercase">SHA-256: 8f2a...c91e</p>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-8">
                <button className="text-slate-400 hover:text-blue-600 transition-colors"><Rewind size={20} /></button>
                <button className="text-slate-400 hover:text-blue-600 transition-colors"><SkipBack size={20} /></button>
                <button className="w-14 h-14 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-200/50">
                  <Play size={24} fill="currentColor" />
                </button>
                <button className="text-slate-400 hover:text-blue-600 transition-colors"><SkipForward size={20} /></button>
                <button className="text-slate-400 hover:text-blue-600 transition-colors"><FastForward size={20} /></button>
              </div>
              <div className="col-span-1 flex flex-col items-end pl-8 border-l border-slate-50">
                <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-widest">Replay Speed</label>
                <select className="bg-transparent border-none font-mono text-sm p-0 focus:ring-0 cursor-pointer font-bold text-[#091426]">
                  <option>1.0x Real-time</option>
                  <option>10x Forensic</option>
                  <option>Step-by-Step</option>
                </select>
              </div>
            </div>
          </section>

          {/* Forensic Journal Sidebar */}
          <aside className="col-span-4 bg-white border border-slate-200 rounded-2xl flex flex-col shadow-sm">
            <div className="p-6 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
              <History size={18} className="text-[#091426]" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#091426]">Audit Trail Log</h2>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-6 scrollbar-hide">
              {[
                { time: '14:02:11.002', type: 'WRITE_OP', desc: 'finance_report_Q3.pdf', detail: 'Delta: +1.2 MB | Buffer 0xAF44', color: 'text-blue-600' },
                { time: '14:03:04.991', type: 'PERMISSION_ERR', desc: "Access Denied: User 'guest_02'", detail: 'Unauthorized ACL bypass attempt', color: 'text-red-500' },
                { time: '14:08:45.332', type: 'METADATA_UPD', desc: 'Timestamp Alteration detected', detail: 'MFT Entry #40292 modified', color: 'text-amber-600' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 relative pl-5 border-l-2 border-slate-100 pb-2">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-current flex items-center justify-center ${log.color}`}>
                    <div className="w-1 h-1 bg-current rounded-full" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{log.time}</span>
                      <span className={`font-mono text-[9px] font-black ${log.color} uppercase tracking-widest`}>{log.type}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{log.desc}</p>
                    <p className="text-[10px] font-mono font-medium text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {log.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-50 bg-slate-50/30">
              <button className="w-full text-center py-3 text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] hover:bg-white rounded-lg transition-all border border-transparent hover:border-blue-100">
                EXPORT FULL RECOVERY LOG (.CSV)
              </button>
            </div>
          </aside>
        </div>

        {/* Investigation Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Target File Info */}
          <div className="col-span-4 bg-white border border-slate-200 p-8 rounded-2xl flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner border border-blue-100">
                <FileText size={28} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#091426] uppercase tracking-wider">Target Entity</h3>
                <p className="font-mono text-[11px] text-blue-600 truncate mt-0.5">/VOL01/FIN/ARCHIVE/reports_2023.db</p>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-50">
              {[
                { label: 'Original Size', value: '14.2 GB' },
                { label: 'Last Valid State', value: '2023-11-20 04:12:00' },
                { label: 'Integrity Hash', value: 'MATCHED', valClass: 'text-emerald-600 font-black' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">{row.label}</span>
                  <span className={`font-mono font-bold ${row.valClass || 'text-slate-700'}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bit-Level Preview */}
          <div className="col-span-8 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#091426]">Hexadecimal Stream Preview (Reconstructed)</h3>
              <div className="flex gap-2">
                <button className="text-[9px] font-black uppercase px-3 py-1 bg-slate-100 rounded-full text-slate-500 tracking-widest">ASCII</button>
                <button className="text-[9px] font-black uppercase px-3 py-1 bg-blue-600 rounded-full text-white tracking-widest shadow-lg shadow-blue-100">HEX</button>
              </div>
            </div>
            <div className="bg-[#091426] rounded-xl p-6 font-mono text-[12px] text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
              00000000: 4c 6f 72 65 6d 20 69 70 73 75 6d 20 64 6f 6c 6f  Lorem ipsum dolo<br/>
              00000010: 72 20 73 69 74 20 61 6d 65 74 2c 20 63 6f 6e 73  r sit amet, cons<br/>
              00000020: 65 63 74 65 74 75 72 20 61 64 69 70 69 73 63 69  ectetur adipisci<br/>
              00000030: <span className="bg-red-500/20 text-red-400 px-1 border border-red-500/30 rounded">6e 67 20 65 6c 69 74 2e</span> 20 53 65 64 20 64 6f 20  ng elit. Sed do <br/>
              00000040: 65 69 75 73 6d 6f 64 20 74 65 6d 70 6f 72 20 69  eiusmod tempor i
            </div>
            <p className="text-[10px] text-red-500 mt-4 flex items-center gap-2 font-black uppercase tracking-[0.1em]">
              <AlertTriangle size={14} className="animate-pulse" />
              Corrupted sequence detected at offset 0x0030. Recalculating checksum...
            </p>
          </div>
        </div>

        {/* Recovery Clusters Table */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#091426]">Identified Recovery Clusters</h2>
            <div className="flex gap-3">
              <button className="bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50">EXPORT SELECTED</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700">RECOVER 4 CLUSTERS</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100 font-mono text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">
                  <th className="px-8 py-4">Cluster ID</th>
                  <th className="px-8 py-4">Timestamp (UTC)</th>
                  <th className="px-8 py-4">Event Type</th>
                  <th className="px-8 py-4">Confidence</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: 'C-9902-A', time: '2023-11-24 14:02:11', type: 'BLOCK_WRITE', conf: 98, status: 'INTACT', color: 'text-emerald-500' },
                  { id: 'C-9902-B', time: '2023-11-24 14:02:45', type: 'METADATA_TX', conf: 85, status: 'INTACT', color: 'text-emerald-500' },
                  { id: 'C-9902-C', time: '2023-11-24 14:03:04', type: 'ACL_MOD', conf: 45, status: 'SUSPECT', color: 'text-red-500' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-mono text-xs text-blue-600 font-bold">{row.id}</td>
                    <td className="px-8 py-5 text-sm text-slate-600 font-medium">{row.time}</td>
                    <td className="px-8 py-5">
                      <span className="bg-slate-100 text-slate-600 font-mono text-[9px] font-black px-2 py-1 rounded tracking-widest uppercase">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${row.conf}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full ${row.conf > 70 ? 'bg-emerald-400 shadow-sm shadow-emerald-200' : 'bg-red-400'}`}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">{row.conf}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`font-black text-[10px] flex items-center gap-1.5 tracking-tighter ${row.color}`}>
                        <CheckCircle2 size={12} fill="currentColor" fillOpacity={0.1} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex gap-2 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-500 hover:text-blue-600 border border-transparent hover:border-slate-100"><Eye size={16} /></button>
                        <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-500 hover:text-blue-600 border border-transparent hover:border-slate-100"><Download size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Floating Action for Quick Investigation */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 bg-[#091426] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group z-50 animate-bounce"
      >
        <RotateCcw className="group-hover:rotate-180 transition-transform duration-700" size={24} />
        <div className="absolute right-20 bg-[#091426] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-xl border border-slate-700">
          Launch Deep Scan
        </div>
      </motion.button>
    </div>
  );
};

export default ForensicView;
