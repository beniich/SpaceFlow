import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  UserCheck, 
  ShieldCheck, 
  History, 
  MessageSquare, 
  FileText, 
  Paperclip, 
  ChevronRight, 
  BarChart3, 
  Flag, 
  MoreVertical,
  Terminal,
  Eraser,
  PenTool
} from 'lucide-react';

const QAReview: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Module Header */}
        <div className="flex justify-between items-end bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                QA Review Mode Active
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 Session: QA_772A // Entity: #9921-XPR
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Quality Assurance Review</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium capitalize">
               Cross-verification of Audit Entity #9921-XPR: Financial Integrity Protocol. All reviewer logic is anchored to the global forensic trail.
            </p>
          </div>
          <div className="text-right space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Overall Confidence</span>
            <div className="flex gap-1.5 items-center">
              {[1, 1, 1, 1, 0].map((v, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${v ? 'bg-blue-600 w-10 shadow-lg shadow-blue-50' : 'bg-slate-200 w-8'}`} />
              ))}
              <span className="font-mono text-sm font-black text-blue-600 ml-2">82%</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Canvas */}
        <div className="grid grid-cols-2 gap-8 items-stretch h-[calc(100vh-420px)] min-h-[700px]">
          
          {/* Auditor Submission Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-100 border-x border-t border-slate-200 rounded-t-3xl">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auditor Submission (Read-Only)</span>
               <div className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: AUD_RESP_044</div>
            </div>
            <div className="flex-1 bg-white border border-slate-200 p-12 rounded-b-3xl shadow-sm overflow-y-auto space-y-12 relative group">
               <div className="absolute top-8 left-1/2 -translate-x-1/2 font-black text-[80px] text-slate-50/50 pointer-events-none select-none tracking-tighter uppercase">Submission</div>
               
               <section className="relative z-10">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">01. Observation Narrative</h4>
                  <p className="text-body-md text-[#091426] leading-[1.8] font-medium">
                     Upon reviewing the transaction logs for Q3, the entity displayed consistent adherence to the 'Separation of Duties' mandate. However, a 48-hour lag was noted in the reconciliation of automated clearinghouse (ACH) transfers. This appears to be a systemic bottleneck rather than a compliance failure.
                  </p>
               </section>

               <section className="relative z-10">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">02. Evidence Artifacts</h4>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { name: 'ACH_LOG_Q3.csv', size: '12.4 MB', type: 'Ledger' },
                       { name: 'AUTH_MATRIX.pdf', size: '1.2 MB', type: 'Matrix' },
                     ].map((file, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group/file hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer">
                           <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover/file:text-blue-500 transition-colors">
                              <FileText size={20} />
                           </div>
                           <div>
                              <p className="text-xs font-black text-[#091426] uppercase tracking-tight">{file.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{file.size} // {file.type}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="relative z-10">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">03. Remediation Roadmap</h4>
                  <div className="p-6 bg-slate-50/50 border-l-[6px] border-blue-500 rounded-r-2xl">
                     <p className="text-[14px] leading-relaxed italic text-slate-600 font-medium">
                        "Implement a real-time API monitoring tool for ACH settlements to reduce the current 48-hour manual verification window from the operational baseline."
                     </p>
                  </div>
               </section>

               <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                        <img alt="Auditor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQeZnI9l_v_8mv5u9NW3HPQLObw34OaOYNwEqckV0mrUGj2DsMzBUvnkBTHhV6_ECbH-ejyOOUoXad0wDbk8pfJkc00aSF0Ks4AZPg4uI8dFWrhAhfFLG7re__igKXvY9NF7GqvOnBsMFt7YNB-n7YmdAp3lQADBEIHwcNfl2MTZhEy8oilBLK3-k5F45U3yxyNi1diWS63dFy0xblSJyX8WI-4ZQzdfa0IOcZt5AJdylYqJxnLPLBsndstv-d_tKyRoQC6ZYk0bc" />
                     </div>
                     <div>
                        <p className="text-xs font-black text-[#091426] uppercase tracking-tight">Mark S. Henderson</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Senior Lead Auditor</p>
                     </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded border border-emerald-100 uppercase tracking-widest">Verified_Signature</div>
               </div>
            </div>
          </div>

          {/* QA Reviewer Workspace Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-x border-t border-slate-900 rounded-t-3xl shadow-2xl z-20">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QA Reviewer Workspace (Edit Mode)</span>
               <div className="flex items-center gap-2 text-emerald-400 font-mono text-[9px] font-black tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE_EVIDENCE_STREAM
               </div>
            </div>
            <div className="flex-1 bg-white border border-slate-200 p-12 rounded-b-3xl shadow-2xl overflow-y-auto space-y-12 relative">
               
               {/* Metrics Scorecard */}
               <section>
                  <div className="flex justify-between items-center mb-6">
                     <h4 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em]">Verification Scorecard</h4>
                     <span className="font-mono text-xs font-black text-blue-600">4 / 5 CRITERIA PASSED</span>
                  </div>
                  <div className="space-y-4">
                     {[
                       { label: 'Standard 10.4 Adherence', status: 'PASS', score: 'EXCELLENT' },
                       { label: 'Evidence Sufficiency', status: 'PASS', score: 'SATISFACTORY' },
                       { label: 'Forensic Depth of Analysis', status: 'FAIL', score: 'NEEDS_REVISION', critical: true },
                     ].map((item, i) => (
                        <div key={i} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${
                           item.critical ? 'bg-red-50 border-red-100 shadow-lg shadow-red-50' : 'bg-white border-slate-100 hover:shadow-md hover:shadow-slate-50'
                        }`}>
                           <div className="flex items-center gap-4">
                              {item.status === 'PASS' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-red-500" />}
                              <span className={`text-xs font-black uppercase tracking-tight ${item.critical ? 'text-red-900' : 'text-[#091426]'}`}>{item.label}</span>
                           </div>
                           <select className={`text-[10px] font-black uppercase tracking-widest bg-transparent cursor-pointer outline-none ${item.critical ? 'text-red-600' : 'text-blue-600'}`}>
                              <option>{item.score}</option>
                              <option>FAIL</option>
                              <option>EXCELLENT</option>
                           </select>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Feedback Loop */}
               <section className="flex-1 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                     <MessageSquare size={16} className="text-blue-600" />
                     <h4 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em]">Critical Feedback Loop</h4>
                  </div>
                  <textarea 
                    className="w-full flex-1 min-h-[160px] p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all text-sm font-medium leading-relaxed outline-none" 
                    placeholder="Enter detailed corrective actions and forensic findings..."
                  />
                  
                  <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400">Reviewer Confidence</span>
                       <span className="text-blue-600">85% Certainty</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-blue-600 shadow-sm" />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono font-black text-slate-400 uppercase tracking-[0.2em]">
                       <span>Skeptical</span>
                       <span className="text-[#091426]">Certainty Threshold</span>
                       <span>Absolute</span>
                    </div>
                  </div>
               </section>

               {/* Action Footer */}
               <div className="grid grid-cols-2 gap-4 mt-auto pt-6">
                  <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-200 rounded-2xl text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all">
                     <Flag size={14} /> Flag for Re-Audit
                  </button>
                  <button className="flex items-center justify-center gap-3 py-4 bg-[#091426] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                     <UserCheck size={14} /> Finalize QA Review
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Forensic Accountability Trail */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 group-hover:bg-blue-50/50 rounded-full -mr-20 -mt-20 blur-[80px] transition-colors duration-1000" />
           <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50 relative z-10">
              <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                 <Terminal size={18} className="text-blue-600" /> Chain of Custody & Audit Trail
              </h3>
              <ShieldCheck size={20} className="text-emerald-500" />
           </div>
           
           <div className="space-y-8 relative pl-8 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {[
                { activity: 'QA Review Initiated', meta: 'Reviewer: Sarah Jennings', date: 'Oct 12, 14:32 UTC', status: 'ACTIVE', color: 'blue' },
                { activity: 'Submission Received', meta: 'Mark Henderson ID: AUD_044', date: 'Oct 12, 09:15 UTC', status: 'COMPLETED', color: 'slate' },
                { activity: 'Audit Framework Locked', meta: 'System Hash: 0x882A...F01', date: 'Oct 11, 23:59 UTC', status: 'VERIFIED', color: 'emerald' },
              ].map((log, i) => (
                <div key={i} className="relative group/log">
                  <div className={`absolute -left-[32px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-${log.color === 'blue' ? 'blue-600' : log.color === 'emerald' ? 'emerald-500' : 'slate-300'} z-10 transition-all group-hover/log:scale-125`} />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-[#091426] uppercase tracking-tight">{log.activity}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{log.meta}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] font-black text-slate-400">{log.date}</p>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${
                        log.color === 'blue' ? 'text-blue-600' : log.color === 'emerald' ? 'text-emerald-600' : 'text-slate-400'
                      }`}>{log.status}</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default QAReview;
