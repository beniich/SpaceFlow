import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Search, 
  ShieldAlert, 
  Zap, 
  ChevronRight, 
  Clock, 
  HelpCircle, 
  Activity, 
  Lock, 
  UserPlus, 
  FileText, 
  CheckCircle2, 
  History, 
  MoreVertical,
  Flag,
  PenTool,
  UploadCloud,
  Layers,
  Terminal,
  Eraser
} from 'lucide-react';

const AuditExceptions: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-50 text-blue-700 font-mono font-black text-[10px] px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-[0.2em]">
                EXC-992-ALPHA
              </span>
              <span className="bg-red-50 text-red-600 font-black text-[10px] px-3 py-1 rounded-lg border border-red-100 uppercase tracking-[0.2em] flex items-center gap-2">
                 <AlertTriangle size={14} className="fill-current" fillOpacity={0.1} /> Critical Exception
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Exception Management Workspace</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Forensic workspace for resolving structural audit deviations. All justifications are anchored to the immutable global evidence chain.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white border-2 border-slate-100 text-[#091426] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-slate-300 transition-all">
              Defer Action
            </button>
            <button className="px-8 py-3 bg-[#091426] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
              Resolve Exception
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Panel: Forensic Analysis */}
          <div className="col-span-8 space-y-8">
             
             {/* Question vs Observed Dashboard */}
             <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/20 flex justify-between items-center">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Forensic Discrepancy Analysis</h3>
                   <span className="text-[10px] font-mono font-black text-slate-300">TS: 2023-10-27T14:22:01.004Z</span>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 relative">
                  <div className="absolute left-1/2 top-10 bottom-10 w-px bg-slate-100 hidden md:block" />
                  
                  {/* Audit Control Point */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-slate-400">
                       <HelpCircle size={16} />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Control Point</span>
                    </div>
                    <p className="text-xl font-black text-[#091426] leading-[1.4] uppercase tracking-tight">Does logic volume exceed allocated liquidity threshold?</p>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 group hover:border-blue-200 transition-colors">
                       <span className="text-[9px] font-black text-slate-400 block mb-2 uppercase tracking-widest">EXPECTED VALUE</span>
                       <span className="text-lg font-mono font-black text-blue-600">≤ $250,000.00 USD</span>
                    </div>
                  </div>

                  {/* System Response */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-red-500">
                       <AlertTriangle size={16} />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Observed Response</span>
                    </div>
                    <p className="text-xl font-black text-red-600 leading-[1.4] uppercase tracking-tight">$842,500.00 USD</p>
                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100 group hover:bg-red-500 group-hover:text-white transition-all">
                       <span className="text-[9px] font-black text-red-400 block mb-2 uppercase tracking-widest group-hover:text-red-100">DELTA OBSERVED</span>
                       <span className="text-lg font-mono font-black tracking-tighter">+$592,500.00 (237% OVER)</span>
                    </div>
                  </div>
                </div>
             </div>

             {/* Root Cause Component */}
             <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-lg font-black text-[#091426] uppercase tracking-tight">Root Cause Diagnosis</h3>
                   <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                      <UserPlus size={14} /> Add Investigator
                   </button>
                </div>
                
                <div className="grid grid-cols-3 gap-6 mb-10">
                   {[
                     { label: 'System Latency', sub: 'API Timeout during validation', icon: <Clock /> },
                     { label: 'Manual Override', sub: 'Privileged user bypassed lock', icon: <PenTool />, active: true },
                     { label: 'Policy Conflict', sub: 'Contradicting regional rules', icon: <Layers /> },
                   ].map((cause, i) => (
                     <div key={i} className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${
                       cause.active ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xl shadow-blue-100' : 'border-slate-50 bg-slate-50 text-slate-400 opacity-60 hover:opacity-100'
                     }`}>
                        <div className="mb-4">{React.cloneElement(cause.icon as React.ReactElement, { size: 18 })}</div>
                        <p className="text-xs font-black uppercase tracking-tight mb-1">{cause.label}</p>
                        <p className={`text-[10px] font-bold tracking-tight ${cause.active ? 'text-blue-400' : 'text-slate-400'}`}>{cause.sub}</p>
                     </div>
                   ))}
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Forensic Investigative findings</label>
                   <div className="relative">
                      <textarea 
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] p-10 text-sm font-medium leading-relaxed outline-none transition-all min-h-[160px]" 
                        placeholder="Provide detailed narrative of the investigation..."
                      />
                      <div className="absolute top-8 left-4 w-1 h-20 bg-blue-600/10 rounded-full" />
                   </div>
                </div>
             </div>

             {/* Timeline Component */}
             <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Evidence Chain & History</h3>
                <div className="space-y-10 relative pl-10 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                   {[
                     { title: 'Exception Flagged', desc: 'System automatically identified threshold violation', time: 'Oct 27, 14:22', icon: <ShieldAlert className="text-blue-600" /> },
                     { title: 'Initial Triage', desc: 'Assigned to Lead Auditor: Sarah Jennings', time: 'Oct 27, 15:10', icon: <Clock className="text-slate-300" /> },
                     { title: 'Evidence Attached', desc: 'TXN_LOG_0912.csv added to global vault', time: 'Oct 27, 16:45', icon: <UploadCloud className="text-slate-300" /> },
                   ].map((event, i) => (
                     <div key={i} className="relative group">
                        <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-blue-50 transition-all">
                           {React.cloneElement(event.icon as React.ReactElement, { size: 14 })}
                        </div>
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-sm font-black text-[#091426] uppercase tracking-tight">{event.title}</p>
                              <p className="text-xs text-slate-500 font-medium">{event.desc}</p>
                           </div>
                           <span className="text-[10px] font-mono font-black text-slate-300">{event.time} UTC</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Panel: Workflow */}
          <div className="col-span-4 space-y-8 sticky top-10">
             <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-10 border-b border-slate-50">
                   <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Resolution Workflow</h3>
                   <div className="mt-8 flex gap-2">
                      <div className="h-1.5 flex-1 bg-blue-600 rounded-full shadow-lg shadow-blue-50" />
                      <div className="h-1.5 flex-1 bg-blue-100 rounded-full" />
                      <div className="h-1.5 flex-1 bg-slate-100 rounded-full" />
                   </div>
                </div>

                <div className="p-10 space-y-10 relative pl-16">
                   <div className="absolute left-[39px] top-10 bottom-10 w-px bg-slate-50" />
                   
                   {[
                     { step: '01', title: 'Investigation', desc: 'Verify system logs and transaction authenticity.', status: 'DONE' },
                     { step: '02', title: 'Justification', desc: 'Provide mandatory reasoning for the override.', status: 'ACTIVE' },
                     { step: '03', title: 'Final Approval', desc: 'Sign-off by Compliance Officer and Risk Lead.', status: 'LOCKED' },
                   ].map((step, i) => (
                     <div key={i} className={`relative pb-6 last:pb-0 ${step.status === 'LOCKED' ? 'opacity-40' : ''}`}>
                        <div className={`absolute -left-[54px] top-0 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center text-[10px] font-black z-10 ${
                          step.status === 'DONE' ? 'bg-emerald-500 text-white' : step.status === 'ACTIVE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                           {step.status === 'DONE' ? <CheckCircle2 size={14} /> : step.step}
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center">
                              <h4 className="text-xs font-black uppercase tracking-tight text-[#091426]">{step.title}</h4>
                              {step.status === 'ACTIVE' && (
                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100 italic animate-pulse">Running</span>
                              )}
                           </div>
                           <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                           
                           {step.status === 'ACTIVE' && (
                             <div className="mt-6 bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                                <div className="space-y-2">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reasoning Logic</label>
                                   <select className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold uppercase tracking-tight focus:ring-4 focus:ring-blue-100 outline-none">
                                      <option>Operational Emergency</option>
                                      <option>Pre-Approved Bulk Batch</option>
                                      <option>System Error / False Pos.</option>
                                   </select>
                                </div>
                                <div className="space-y-4 pt-2">
                                   <button className="w-full py-3 bg-[#091426] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all">Submit for Review</button>
                                   <button className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">
                                      <Eraser size={12} /> Clear Current Input
                                   </button>
                                </div>
                             </div>
                           )}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-auto p-10 bg-slate-50 border-t border-slate-100 flex items-center gap-6">
                   <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm p-0.5 flex items-center justify-center grayscale group hover:grayscale-0 transition-all overflow-hidden relative">
                      <img alt="Reviewer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzkLWmsSanaJo3nCUJi_T6C3JzQBcqXFOO2amTSISJug0QSVWbOIk9KnautY-gJhg7EbT3SEnwogIJ8CzwraAntV3kF01DuVOSZ6b7kL3EZGdOpEs0UflW_FA5OH3mLV9zPxG9-X7MvWD1VgOiqR-SSqe8CREHt8_OddUW7Lc_7s955YW43fwyWawb5iPs9OIXmy-xTDh4IJ-G7faTA0otQYdHHPBdUXRL6n58aoonzh70bghz9Qjj6IO1Y50ogvdwG5hnAhSZxrs" />
                      <div className="absolute inset-0 border-2 border-white/50 rounded-2xl" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Active Reviewer</p>
                      <h5 className="text-xs font-black text-[#091426] uppercase tracking-tight">Marcus Thorne</h5>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Lead Compliance
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-[#091426] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Terminal size={100} />
                </div>
                <div className="space-y-4 relative z-10">
                   <h5 className="text-xs font-black uppercase tracking-widest text-blue-400">System Trace Integrity</h5>
                   <p className="text-[11px] text-slate-400 leading-relaxed font-medium">All exception resolutions trigger a dedicated forensic snapshot on global nodes.</p>
                   <div className="bg-white/5 border border-white/10 p-3 rounded-xl font-mono text-[9px] text-blue-200">
                      LE_ANCHOR::0x882A...F01
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuditExceptions;
