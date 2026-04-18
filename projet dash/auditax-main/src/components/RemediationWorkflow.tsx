import React from 'react';
import { motion } from 'motion/react';
import { 
  Workflow, 
  Gavel, 
  AlertTriangle, 
  BarChart3, 
  Search, 
  Plus, 
  Filter, 
  SortAsc, 
  MoreHorizontal, 
  Paperclip, 
  UploadCloud, 
  ChevronRight, 
  History, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  DollarSign,
  TrendingUp,
  LayoutGrid,
  ScrollText
} from 'lucide-react';

const RemediationWorkflow: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <Workflow size={12} className="fill-current text-blue-400" /> Lifecycle_Management v2.4
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 STRUCTURAL_WORKFLOW_2024
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Audit Remediation Workflow</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Managing structural fixes for multi-quarter initiatives and capital expenditure (CapEx) alignment. Bridging finding resolution with global infrastructure strategy.
            </p>
          </div>
          <div className="flex gap-4 relative z-10 font-mono text-[9px] font-black uppercase tracking-widest text-[#091426]">
             <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner">
                <button className="px-5 py-2.5 bg-white text-blue-600 rounded-lg shadow-sm font-black">Overview</button>
                <button className="px-5 py-2.5 text-slate-400 hover:text-slate-600">Kanban Board</button>
                <button className="px-5 py-2.5 text-slate-400 hover:text-slate-600">CapEx Linkage</button>
             </div>
          </div>
        </div>

        {/* Strategic Metrics Bento Grid */}
        <div className="grid grid-cols-12 gap-8">
           
           {/* Multi-Quarter Initiatives Card */}
           <div className="col-span-8 bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm flex flex-col gap-10 group hover:shadow-xl transition-all duration-500">
              <div className="flex justify-between items-center">
                 <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                    <History size={18} className="text-blue-600" /> Multi-Quarter Initiatives
                 </h3>
                 <div className="flex gap-2 p-1 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Verified Log</span>
                 </div>
              </div>

              <div className="space-y-10">
                 {[
                   { title: 'Tier-1 Data Center Migration', budget: '$4.2M', finding: 'ADT-2023-902', prog: '68%', tag: 'INFRASTRUCTURE' },
                   { title: 'Legacy Mainframe Encryption', budget: '$1.8M', finding: 'ADT-2024-011', prog: '24%', tag: 'SECURE_TRANSIT' },
                 ].map((init, i) => (
                   <div key={i} className="space-y-4">
                      <div className="flex justify-between items-end">
                         <div className="space-y-1">
                            <h4 className="text-xs font-black text-[#091426] uppercase tracking-tight">{init.title} (CapEx: {init.budget})</h4>
                            <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">FINDING ID: {init.finding}</p>
                         </div>
                         <span className="text-xs font-mono font-black text-blue-600">{init.prog} COMPLETE</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: init.prog }} className="h-full bg-blue-600 shadow-lg shadow-blue-100" />
                      </div>
                      <div className="flex gap-3">
                         <span className="text-[8px] font-black text-slate-400 border border-slate-100 rounded-md px-2 py-0.5 uppercase tracking-widest tracking-tighter">PHASE_0{i+2} START</span>
                         <span className="text-[8px] font-black text-slate-400 border border-slate-100 rounded-md px-2 py-0.5 uppercase tracking-widest tracking-tighter">{init.tag} CLUSTER</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* CapEx Utilization Stats Card */}
           <div className="col-span-4 bg-[#091426] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 p-10 opacity-10 blur-md">
                 <DollarSign size={120} />
              </div>
              <div className="relative z-10">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-2">CapEx Utilization</h3>
                 <p className="text-[9px] font-mono font-black text-blue-400 uppercase tracking-[0.4em] mb-10">Structural Fix Budgeting</p>
                 <div className="space-y-8">
                    {[
                      { l: 'Total Budgeted Allocation', v: '$12.5M' },
                      { l: 'Committed CapEx (Verified)', v: '$8.9M', trend: '+1.2%' },
                    ].map((row, i) => (
                      <div key={i} className="space-y-2 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{row.l}</p>
                         <div className="flex justify-between items-end">
                            <p className="text-3xl font-black text-white tracking-tighter leading-none">{row.v}</p>
                            {row.trend && (
                              <span className="text-[10px] font-mono font-black text-emerald-400 flex items-center gap-1">
                                 <TrendingUp size={12} /> {row.trend}
                              </span>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="relative z-10 pt-10 aspect-video rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <div className="text-center space-y-2">
                     <BarChart3 size={32} className="text-blue-400 mx-auto opacity-40" />
                     <p className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">Visualization::Generating</p>
                  </div>
              </div>
           </div>
        </div>

        {/* Remediation Kanban Board */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                 <LayoutGrid size={18} className="text-blue-600" /> Remediation Task Board
              </h3>
              <div className="flex gap-4">
                 <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-[#091426] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-blue-200 transition-all">
                    <Filter size={14} /> Filter
                 </button>
                 <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-[#091426] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-blue-200 transition-all">
                    <SortAsc size={14} /> Priority
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-3 gap-8">
              
              {/* Backlog Column */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Backlog (4)</span>
                    <button className="p-1 hover:bg-white rounded-md transition-colors text-slate-400"><Plus size={16} /></button>
                 </div>
                 {[
                   { title: 'Update Core Firewall Rules', desc: 'Relates to ADT-2023-772: Perimeter Deficit.', prio: 'HIGH_PRIORITY', est: '2W' },
                   { title: 'Backup Power Grid Hardening', desc: 'Linked to CapEx #INFRA-2024-CAP-08.', prio: 'STRUCTURAL', est: 'PROG' },
                 ].map((task, i) => (
                   <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                         <span className={`text-[8px] font-black px-3 py-1 rounded-sm tracking-widest ${
                           task.prio === 'HIGH_PRIORITY' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                         }`}>{task.prio}</span>
                         <MoreHorizontal size={16} className="text-slate-200 group-hover:text-slate-400" />
                      </div>
                      <h5 className="text-xs font-black text-[#091426] uppercase tracking-tight mb-2 leading-relaxed">{task.title}</h5>
                      <p className="text-[10px] font-medium text-slate-400 leading-relaxed min-h-[40px] mb-6">{task.desc}</p>
                      <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                         <div className="flex -space-x-3">
                            {[1, 2].map(n => <div key={n} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 overflow-hidden shadow-sm">
                               <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=32&h=32" alt="Avatar" className="w-full h-full object-cover" />
                            </div>)}
                         </div>
                         <span className="text-[9px] font-mono font-black text-slate-300 uppercase">EST: {task.est}</span>
                      </div>
                   </div>
                 ))}
              </div>

              {/* In Progress Column */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Progress (2)</span>
                 </div>
                 <div className="bg-white border-l-8 border-blue-600 border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-[8px] font-black px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-sm tracking-widest uppercase">IN_REVIEW::VALIDATING</span>
                       <MoreHorizontal size={16} className="text-slate-200" />
                    </div>
                    <h5 className="text-xs font-black text-[#091426] uppercase tracking-tight mb-2 leading-relaxed">Patch SAP R/3 Kernel Clusters</h5>
                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed mb-6 italic">Finding ID: SAP-FIN-881. Critical vulnerability in legacy core.</p>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-2 text-[8px] font-black text-slate-300 uppercase">
                          <Paperclip size={12} /> 3 Artifacts Linked
                       </div>
                       <span className="text-[9px] font-mono font-black text-blue-600 uppercase">DUE: OCT 12</span>
                    </div>
                 </div>
              </div>

              {/* Evidence Completion Column */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ready for Evidence (1)</span>
                 </div>
                 <div className="bg-emerald-50/20 border-2 border-dashed border-emerald-200 p-8 rounded-[3rem] transition-all group flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-40">
                       <ShieldCheck size={40} className="text-emerald-400 rotate-12" />
                    </div>
                    <div className="relative z-10 w-full">
                       <h5 className="text-xs font-black text-[#091426] uppercase tracking-tight mb-2">SSO Deployment Phase II</h5>
                       <p className="text-[10px] font-medium text-slate-500 mb-8 max-w-[200px] mx-auto">Implementation of Azure AD cluster verified. Upload log manifest.</p>
                       <div className="bg-white border-2 border-dashed border-emerald-100 rounded-[2rem] p-10 hover:bg-emerald-50 transition-all cursor-pointer shadow-sm group/upload">
                          <UploadCloud size={40} className="text-emerald-400 mx-auto mb-4 group-hover/upload:-translate-y-2 transition-transform duration-500" />
                          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Upload Manifest</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">.PDF, .LOG (Max 50MB)</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Workflow Audit Trail Footer */}
        <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden flex flex-col">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-[#091426] text-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                 <ScrollText size={16} className="text-blue-400" /> Workflow Audit Journal
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white/60 hover:text-white transition-all">
                 <Download size={14} /> Export Immutable Log
              </button>
           </div>
           
           <div className="p-10 space-y-12 relative pl-16 before:absolute before:left-10 before:top-14 before:bottom-14 before:w-px before:bg-slate-100">
              {[
                { time: '2024-05-22 14:02 UTC', user: 'ADMIN_S_CHEN', act: 'CapEx Budget Adjusted', obj: 'TIER-1_MIGRATION', color: 'blue', desc: 'Allocation set to +15% based on hardware variance' },
                { time: '2024-05-22 09:15 UTC', user: 'SYS_DAEMON', act: 'Task Workflow Elevation', obj: 'PATCH_SAP_KERNEL', color: 'slate', desc: 'Moved from BACKLOG to IN_PROGRESS via auto-trigger' },
                { time: '2024-05-21 17:55 UTC', user: 'ROBOT_COMPLY', act: 'Evidence Lock Executed', obj: 'SSO_DEPLOY_PH1.PDF', color: 'emerald', desc: 'SHA-256 anchoring successful. Object made immutable.' },
              ].map((log, i) => (
                <div key={i} className="relative group">
                   <div className={`absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 transition-all group-hover:scale-125 ${
                     log.color === 'blue' ? 'bg-blue-600 shadow-blue-50' :
                     log.color === 'emerald' ? 'bg-emerald-500 shadow-emerald-50' : 'bg-slate-300'
                   }`} />
                   <div className="space-y-1">
                      <div className="flex gap-4 items-center mb-1">
                         <span className="text-[9px] font-mono font-black text-slate-300 uppercase">{log.time}</span>
                         <span className="text-[9px] font-black text-slate-400 opacity-40 uppercase tracking-[0.2em]">Principal: {log.user}</span>
                      </div>
                      <p className="text-xs font-black text-[#091426] uppercase tracking-tight">
                        {log.act} :: <span className={log.color === 'blue' ? 'text-blue-600' : log.color === 'emerald' ? 'text-emerald-600' : ''}>{log.obj}</span>
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 max-w-2xl">{log.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Technical Validation Strip */}
        <div className="pt-10 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.4em]">
           <p className="flex items-center gap-3">
              <ScrollText size={16} className="text-[#091426]" /> 
              Workflow_State: SYNCED // Protocol: AES-256GCM
           </p>
           <p className="text-blue-600 flex items-center gap-2">
              <ShieldCheck size={12} className="fill-current" /> Integrity Verified
           </p>
        </div>
      </div>
    </div>
  );
};

export default RemediationWorkflow;
