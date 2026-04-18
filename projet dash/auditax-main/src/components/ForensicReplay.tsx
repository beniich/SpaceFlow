import React from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  Play, 
  RotateCcw, 
  FastForward, 
  Rewind, 
  ShieldCheck, 
  Database, 
  Search, 
  FileText, 
  AlertCircle, 
  Download, 
  MoreHorizontal,
  StepForward,
  StepBack,
  Fingerprint,
  Zap,
  Activity,
  User,
  Clock,
  Terminal
} from 'lucide-react';

const ForensicReplay: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Forensic Node v5.1
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 <ShieldCheck size={10} className="fill-current" /> CRYPTO_VERIFIED: NOMINAL
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Forensic Event Replay</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Restore environmental integrity by replaying transaction logs from the global Event Store. Bit-perfect reconstruction of file states and authentication sequences.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm group hover:border-blue-200 transition-all">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center animate-pulse">
                   <Database size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Store Status</p>
                   <p className="text-xs font-black text-[#091426] uppercase">ONLINE / 4.2 PB Indexed</p>
                </div>
             </div>
          </div>
        </div>

        {/* Main Replay Interface */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Replay Timeline Controller */}
          <div className="col-span-8 space-y-8">
             <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm space-y-10 relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                   <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                      <Clock size={18} className="text-blue-600" /> Transaction Replay Timeline
                   </h3>
                   <div className="flex gap-2">
                      <span className="bg-emerald-50 text-emerald-700 font-black text-[9px] px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> IMMUTABLE
                      </span>
                   </div>
                </div>

                {/* Visual Audio-like Timeline */}
                <div className="h-56 bg-slate-900 rounded-[2rem] border border-slate-800 relative overflow-hidden group">
                   <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 39px, #94a3b8 40px)' }} />
                   
                   <div className="absolute inset-x-10 bottom-10 h-32 flex items-end gap-1.5">
                      {[40, 60, 90, 45, 30, 70, 10, 15, 85, 40, 55, 30, 20, 75, 90, 40, 60].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: h + '%' }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex-1 rounded-t-sm transition-all duration-300 ${
                            i === 2 ? 'bg-red-500 shadow-lg shadow-red-900/50' : 
                            i === 5 ? 'bg-emerald-500 shadow-lg shadow-emerald-900/50' : 
                            'bg-blue-600 opacity-40 group-hover:opacity-100'
                          }`}
                        />
                      ))}
                   </div>

                   {/* Playhead */}
                   <div className="absolute left-[35%] top-0 bottom-0 w-0.5 bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)] z-20 flex flex-col items-center">
                      <div className="bg-blue-400 text-[#091426] font-mono text-[9px] font-black px-3 py-1 mt-6 rounded whitespace-nowrap uppercase tracking-widest shadow-xl">
                         T-MINUS 14:02:11
                      </div>
                      <div className="w-4 h-4 bg-blue-400 rotate-45 -mt-2 shadow-lg" />
                   </div>
                </div>

                {/* Replay Controls */}
                <div className="grid grid-cols-4 gap-10 py-4 items-center">
                   <div className="col-span-1 border-r border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Recovery Anchor</p>
                      <p className="text-xs font-mono font-black text-[#091426] tracking-tighter">SHA256: 8F2A...C91E</p>
                   </div>
                   <div className="col-span-2 flex items-center justify-center gap-10">
                      <button className="text-slate-300 hover:text-blue-600 transition-all active:scale-90"><Rewind size={24} /></button>
                      <button className="text-slate-300 hover:text-blue-600 transition-all active:scale-90"><StepBack size={24} /></button>
                      <button className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-100 flex items-center justify-center hover:bg-blue-700 transition-all active:scale-95 group">
                         <Play size={28} className="fill-current group-hover:scale-110 transition-transform ml-1" />
                      </button>
                      <button className="text-slate-300 hover:text-blue-600 transition-all active:scale-90"><StepForward size={24} /></button>
                      <button className="text-slate-300 hover:text-blue-600 transition-all active:scale-90"><FastForward size={24} /></button>
                   </div>
                   <div className="col-span-1 flex flex-col items-end border-l border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic text-right">Replay Velocity</p>
                      <select className="bg-transparent border-none font-black text-xs text-[#091426] p-0 focus:ring-0 cursor-pointer uppercase tracking-widest text-right">
                         <option>1.0x Real-time</option>
                         <option>10x Forensic</option>
                         <option>Step-by-Step</option>
                      </select>
                   </div>
                </div>
             </div>

             {/* Investigation Tools Bento */}
             <div className="grid grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-6 group hover:shadow-xl transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                         <FileText size={20} />
                      </div>
                      <div>
                         <h4 className="text-xs font-black text-[#091426] uppercase">Target Entity</h4>
                         <p className="text-[10px] font-mono text-blue-600">reports_2023.db</p>
                      </div>
                   </div>
                   <div className="space-y-4 pt-4 border-t border-slate-50 font-mono text-[10px] font-bold uppercase tracking-tight text-slate-500">
                      <div className="flex justify-between"><span>Size</span><span className="text-[#091426]">14.2 GB</span></div>
                      <div className="flex justify-between"><span>State</span><span className="text-emerald-600 underline">MATCHED</span></div>
                   </div>
                </div>

                <div className="col-span-2 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                   <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hexstream Preview (Offset 0x0030)</h4>
                      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                         <button className="px-3 py-1 bg-white text-[9px] font-black text-[#091426] rounded-md shadow-sm uppercase tracking-widest">HEX</button>
                         <button className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">ASCII</button>
                      </div>
                   </div>
                   <div className="bg-slate-900 rounded-2xl p-6 font-mono text-[11px] text-emerald-400/80 leading-relaxed overflow-x-auto shadow-inner">
                      <div className="flex gap-6">
                         <span className="text-slate-700">00000030:</span>
                         <span className="text-red-400 bg-red-900/30 px-1 rounded">6e 67 20 65 6c 69 74 2e</span>
                         <span className="text-slate-600">20 53 65 64 20 64 6f 20</span>
                         <span className="text-slate-400">ng elit. Sed do</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3 text-red-400 font-bold uppercase tracking-widest text-[9px]">
                         <AlertCircle size={12} className="animate-pulse" /> Checksum Mismatch detected at offset
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Forensic Sidebar Journal */}
          <div className="col-span-4 space-y-8">
             <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col h-[740px] overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                   <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Terminal size={14} className="text-blue-600" /> Audit Trail Log
                   </h3>
                   <span className="text-[9px] font-black text-slate-300 uppercase">Live Journal</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-10 space-y-10 relative pl-12 before:absolute before:left-6 before:top-10 before:bottom-10 before:w-px before:bg-slate-100">
                   {[
                     { time: '14:02:11.002', type: 'WRITE_OP', item: 'finance_report_Q3.pdf', color: 'blue', desc: 'Delta: +1.2 MB | Buffer 0xAF44' },
                     { time: '14:03:04.991', type: 'AUTH_FAIL', item: 'User guest_02 blocked', color: 'red', desc: 'Unauthorized ACL bypass attempt' },
                     { time: '14:05:22.118', type: 'READ_OP', item: 'Metadata Root Scan', color: 'slate', desc: 'System-triggered consistency check' },
                     { time: '14:08:45.332', type: 'ACL_MOD', item: 'MFT Entry #40292 updated', color: 'emerald', desc: 'Timestamp alteration detected' },
                   ].map((log, i) => (
                     <div key={i} className="relative group">
                        <div className={`absolute -left-[30px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 transition-all group-hover:scale-125 ${
                          log.color === 'blue' ? 'bg-blue-600 shadow-blue-100' :
                          log.color === 'red' ? 'bg-red-500 shadow-red-100' :
                          log.color === 'emerald' ? 'bg-emerald-500' : 'bg-slate-300'
                        }`} />
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-mono font-black text-slate-300 uppercase">
                              <span>{log.time}</span>
                              <span className={log.color === 'red' ? 'text-red-600' : log.color === 'blue' ? 'text-blue-600' : ''}>{log.type}</span>
                           </div>
                           <p className="text-xs font-black text-[#091426] uppercase tracking-tight">{log.item}</p>
                           <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{log.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100">
                   <button className="w-full py-4 bg-white border border-slate-200 text-[#091426] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2 group shadow-sm">
                      <Download size={14} className="group-hover:-translate-y-1 transition-transform" /> Export Full Stream
                   </button>
                </div>
             </div>

             <div className="bg-[#091426] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Fingerprint size={120} />
                </div>
                <div className="relative z-10 space-y-6">
                   <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                      <Zap size={16} /> Forensic Agent
                   </h4>
                   <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Agent is currently hashing recovery clusters. Probability of full restoration: <span className="text-emerald-400">92.4%</span></p>
                   <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all">
                      <Activity size={16} className="text-blue-400" />
                      <div className="flex-1 space-y-2">
                         <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Technical Footer */}
        <div className="pt-10 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.2em] relative overflow-hidden">
           <div className="flex gap-10 items-center">
              <div className="flex items-center gap-3">
                 <Terminal size={16} className="text-slate-900" />
                 <span>Process Core: PR7-G88</span>
              </div>
              <p>System_Epoch: 1698163200 // Stream_ID: 0xFF21Z</p>
           </div>
           <p className="flex items-center gap-2 text-blue-600 font-black">
              <Zap size={10} className="fill-current" /> ALL SYSTEMS GO
           </p>
        </div>
      </div>
    </div>
  );
};

export default ForensicReplay;
