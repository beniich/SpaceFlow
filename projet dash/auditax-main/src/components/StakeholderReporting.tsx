import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Settings, 
  Share2, 
  Eye, 
  ShieldCheck, 
  Layout, 
  Calendar, 
  Lock, 
  ChevronRight, 
  Clock, 
  FileText, 
  PieChart, 
  TrendingUp, 
  PlusCircle, 
  History,
  Activity,
  UserCheck,
  Zap
} from 'lucide-react';

const StakeholderReporting: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
                Reporting Engine v3.0
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Zap size={10} className="fill-current" /> Telemetry: Active
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Stakeholder Reporting Engine</h1>
            <p className="text-slate-500 max-w-2xl mt-3 text-sm leading-relaxed font-medium">
              Configure and share cryptographic-grade reports for board members and institutional investors. Real-time data anchoring with secure distribution controls.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-[#091426] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all">
              <Eye size={14} /> Preview Portal
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
              <Share2 size={14} /> Generate Secure Link
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Workflow Stepper */}
          <div className="col-span-3 space-y-4 sticky top-10">
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Report Configuration</h3>
              <div className="space-y-0 relative border-l-2 border-slate-100 pl-8 ml-2">
                {[
                  { id: '01', title: 'Widget Selection', sub: 'Executive modules', active: true },
                  { id: '02', title: 'Data Period', sub: 'Fiscal window' },
                  { id: '03', title: 'Security & Access', sub: 'Encryption / MFA' },
                  { id: '04', title: 'Distribution', sub: 'Final review' },
                ].map((step, i) => (
                  <div key={i} className={`relative pb-10 last:pb-0 group`}>
                    <div className={`absolute -left-[43px] top-0 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center text-[10px] font-black transition-all ${
                      step.active ? 'bg-blue-600 text-white scale-110 shadow-blue-100' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step.id}
                    </div>
                    <div className={step.active ? 'translate-x-1 transition-transform' : 'opacity-40'}>
                      <h4 className={`text-xs font-black uppercase tracking-tight ${step.active ? 'text-[#091426]' : 'text-slate-400'}`}>{step.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#091426] rounded-3xl p-6 text-white text-center shadow-xl">
               <ShieldCheck size={32} className="mx-auto text-blue-400 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Encryption Mode</p>
               <h4 className="text-xs font-bold text-blue-100 uppercase tracking-widest px-4 py-2 border border-blue-900 bg-blue-950/40 rounded-xl">Hardware MFA Active</h4>
            </div>
          </div>

          {/* Main Reporting Canvas */}
          <div className="col-span-9 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#091426] uppercase tracking-tight">Report Canvas (Draft)</h2>
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Clock size={12} /> Last auto-save: 2m ago
              </span>
            </div>

            {/* Widget: Executive Summary */}
            <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm relative group overflow-hidden">
               <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                  <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white text-slate-400"><Layout size={16} /></button>
                  <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white text-slate-400"><Settings size={16} /></button>
               </div>
               
               <div className="mb-10">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 block">Module 01: Summary</span>
                  <h3 className="text-2xl font-black text-[#091426] uppercase tracking-tighter">Executive Compliance Overview</h3>
               </div>

               <div className="grid grid-cols-3 gap-8">
                  {[
                    { label: 'Cumulative Compliance', value: '98.4%', trend: '↑ 2.1%', sub: 'Q4 2024 Target attained' },
                    { label: 'Critical Risks Open', value: '12', trend: '↓ 4', sub: 'High-velocity resolution' },
                    { label: 'Audit Velocity', value: '0.8d', trend: 'STABLE', sub: 'Mean response latency' },
                  ].map((metric, i) => (
                    <div key={i} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/80">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">{metric.label}</p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <p className="text-3xl font-black text-[#091426] tracking-tighter">{metric.value}</p>
                        <span className={`text-[10px] font-black ${metric.trend.includes('↑') ? 'text-emerald-600' : 'text-blue-600'}`}>
                          {metric.trend}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{metric.sub}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Key Risk Indicators */}
              <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Key Risk Indicators (KRI)</h3>
                  <Activity size={18} className="text-slate-300" />
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'CYBER_SEC_VULN', risk: 'CRITICAL', color: 'red' },
                    { label: 'FISCAL_EXP_LMT', risk: 'NOMINAL', color: 'slate' },
                    { label: 'OPER_CONT_VAL', risk: 'VERIFIED', color: 'emerald' },
                  ].map((kri, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl group hover:shadow-lg hover:shadow-slate-50 transition-all">
                      <span className="font-mono text-xs font-black text-slate-600 tracking-wider">[{kri.label}]</span>
                      <span className={`text-[8px] font-black px-2 py-1 rounded border uppercase tracking-widest ${
                        kri.color === 'red' ? 'bg-red-50 text-red-700 border-red-100' : 
                        kri.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                         {kri.risk}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:border-blue-200 hover:text-blue-500 transition-all group">
                   <PlusCircle size={14} className="group-hover:scale-125 transition-transform" /> Add Risk Matrix Module
                </button>
              </div>

              {/* Remediation Progress */}
              <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Remediation Velocity</h3>
                  <TrendingUp size={18} className="text-slate-300" />
                </div>
                <div className="flex-1 flex items-end gap-3 px-2">
                   {[40, 55, 70, 65, 85].map((h, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-3">
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: h + '%' }} 
                          className={`w-full rounded-t-xl shadow-lg ${i === 4 ? 'bg-blue-600 shadow-blue-50' : 'bg-slate-200'}`}
                        />
                        <span className="text-[10px] font-mono font-black text-slate-300 uppercase">{['JAN','FEB','MAR','APR','MAY'][i]}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Distribution Controls */}
            <div className="bg-[#091426] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-10 relative z-10">
                  <div className="max-w-md">
                     <h3 className="text-xl font-black uppercase tracking-tight mb-2">Stakeholder Access Control</h3>
                     <p className="text-slate-400 text-sm font-medium">Generated links are time-boxed, hardware-verified, and cryptographically shadowed.</p>
                  </div>
                  <Lock size={32} className="text-blue-600" />
               </div>
               
               <div className="grid grid-cols-2 gap-10 relative z-10">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Secure Link Expiry</label>
                      <select className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-4 text-xs font-black uppercase focus:ring-1 focus:ring-blue-600 outline-none cursor-pointer appearance-none">
                        <option>24 Hours (Single Use)</option>
                        <option>7 Days (Read Only)</option>
                        <option>30 Days (Full Portal)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Shadow Watermarking</label>
                      <input className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-4 text-xs font-mono focus:ring-1 focus:ring-blue-600 outline-none" placeholder="Enter recipient email for ID anchoring..." />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4">
                     <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck size={18} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Advanced Protections</span>
                     </div>
                     {[
                        { label: 'Enforce Multi-Factor Auth', active: true },
                        { label: 'Watermark all pages', active: true },
                        { label: 'Block Local Downloads', active: false },
                     ].map((opt, i) => (
                        <div key={i} className="flex items-center justify-between group/opt cursor-pointer">
                           <span className="text-xs font-medium text-slate-300 group-hover/opt:text-white transition-colors">{opt.label}</span>
                           <div className={`w-8 h-4 rounded-full relative transition-colors ${opt.active ? 'bg-blue-600' : 'bg-white/10'}`}>
                              <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${opt.active ? 'left-5' : 'left-1'}`} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Distribution Audit Trail */}
            <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Distribution Audit Trail</h3>
                  <History size={18} className="text-slate-300" />
               </div>
               <div className="space-y-8 relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                  {[
                    { user: 'Board Member ID: #7742', msg: 'Secure report link dispatched via encrypted relay.', time: '14:22:01 UTC', tag: 'DISPATCHED', color: 'blue' },
                    { user: 'Compliance Lead (Self)', msg: 'Draft v3.0 snapshot saved to forensic event-store.', time: '11:05:44 UTC', tag: 'SNAP_SAVED', color: 'slate' },
                    { user: 'System-Automator', msg: 'Investor-Quarter template profile applied to new session.', time: '09:00:12 UTC', tag: 'PROFILE_LOAD', color: 'slate' },
                  ].map((log, i) => (
                    <div key={i} className="relative group">
                      <div className={`absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-${log.color === 'blue' ? 'blue-600' : 'slate-300'} z-10`} />
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-[#091426] uppercase tracking-tight">{log.user}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${
                              log.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>{log.tag}</span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium">{log.msg}</p>
                        </div>
                        <span className="text-[10px] font-mono font-black text-slate-300">{log.time}</span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderReporting;
