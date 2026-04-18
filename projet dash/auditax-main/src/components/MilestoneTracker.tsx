import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight, 
  Search, 
  Bell, 
  History, 
  Network as AccountTree, 
  Terminal, 
  MoreVertical,
  Flag,
  Target,
  GanttChart as GanttChartSquare,
  Zap
} from 'lucide-react';

const MilestoneTracker: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Compliance Roadmap 2024
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5">
                <Zap size={10} className="fill-current" /> Telemetry: Active
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase">Milestone Tracker</h1>
            <p className="text-slate-500 max-w-2xl mt-1 text-sm leading-relaxed font-medium">
              Cross-referencing regulatory deadlines with live audit telemetry. Automated verification of forensic milestones across global jurisdictions.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">System Integrity</span>
            <div className="flex items-center gap-2 font-mono text-[11px] font-black text-emerald-600 uppercase tracking-widest px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               99.8% Crypto-Verified
            </div>
          </div>
        </div>

        {/* Strategic Cards Grid */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 transition-all group-hover:w-2" />
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-xl font-black text-[#091426] uppercase tracking-tight">Critical Path Progress</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Global Strategic Compliance</p>
              </div>
              <span className="text-[9px] font-black bg-blue-50 text-blue-700 px-3 py-1 border border-blue-100 rounded-lg uppercase tracking-widest">Phase: Execution</span>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-[#091426] uppercase tracking-wide">Basel IV Capital Accord Compliance</span>
                  <span className="font-mono text-sm font-black text-[#091426]">72%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '72%' }}
                    className="bg-blue-600 h-full shadow-lg shadow-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {[
                  { label: 'Upcoming Deadline', value: 'Oct 24, 2024', color: 'slate' },
                  { label: 'Days Remaining', value: '14 Days', color: 'blue' },
                  { label: 'Risk Exposure', value: 'Moderate', color: 'amber' },
                ].map((stat, i) => (
                  <div key={i} className={`p-5 rounded-2xl border bg-slate-50/50 border-slate-100`}>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">{stat.label}</span>
                    <span className={`text-xs font-black uppercase tracking-tight ${
                        stat.color === 'blue' ? 'text-blue-600' : stat.color === 'amber' ? 'text-amber-600' : 'text-[#091426]'
                    }`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                  <AlertCircle size={20} className="fill-current" fillOpacity={0.1} />
                </div>
                <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Drop-Dead Dates</h3>
              </div>
              <div className="space-y-6">
                {[
                  { title: 'GDPR Privacy Audit', sub: 'Section 4.2 Attestation', date: 'Sep 30', status: 'OVERDUE' },
                  { title: 'SEC Form 10-K', sub: 'Full Certification', date: 'Oct 12', status: 'URGENT' },
                  { title: 'SOX 404 Controls', sub: 'Quarterly Review', date: 'Nov 05', status: 'PENDING' },
                ].map((date, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-4 group last:border-0 last:pb-0">
                    <div>
                      <p className="text-xs font-black text-[#091426] uppercase tracking-tight group-hover:text-red-600 transition-colors">{date.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{date.sub}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-xs font-black mb-1 ${date.status === 'PENDING' ? 'text-slate-400' : 'text-red-600'}`}>{date.date}</p>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                        date.status === 'PENDING' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-red-50 text-red-700 border-red-100'
                      } uppercase tracking-widest`}>{date.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full mt-10 py-3 bg-white border-2 border-red-600 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-50 transition-all shadow-lg shadow-red-50">
                Initiate Emergency Review
            </button>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em]">Timeline Visualization (Q3-Q4)</h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 border border-slate-300 rounded-sm" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Planned Schedule</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-12 mb-6 font-black text-[9px] text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">
               <div className="col-span-3">Process / Milestone</div>
               <div className="col-span-3 text-center border-l border-slate-50">September</div>
               <div className="col-span-3 text-center border-l border-slate-50">October</div>
               <div className="col-span-3 text-center border-l border-slate-50">November</div>
            </div>
            
            <div className="space-y-8 divide-y divide-slate-50">
              {[
                { title: 'Financial Reporting Integrity', sub: 'Internal Controls Phase', progress: 52, planned: 60, alert: true },
                { title: 'IT Systems & Data Privacy', sub: 'ISO 27001 Refresh', progress: 48, planned: 45, color: 'emerald' },
                { title: 'Global ESG Disclosure', sub: 'New EU Standards', progress: 10, planned: 50, delay: true },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-12 items-center pt-8 first:pt-0">
                  <div className="col-span-3 pr-8">
                    <p className="text-xs font-black text-[#091426] uppercase tracking-tight">{row.title}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{row.sub}</p>
                  </div>
                  <div className="col-span-9 relative h-6 group">
                     {/* Planned Ghost Bar */}
                     <div 
                      className="absolute top-1.5 h-3 border border-dashed border-slate-200 rounded-full" 
                      style={{ left: i * 20 + '%', width: row.planned + '%' }} 
                     />
                     {/* Actual Progress Bar */}
                     <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: row.progress + '%' }}
                      className={`absolute top-1.5 h-3 rounded-full shadow-lg ${
                        row.color === 'emerald' ? 'bg-emerald-500 shadow-emerald-50' : 
                        row.delay ? 'bg-blue-400 shadow-blue-50' : 'bg-blue-600 shadow-blue-100'
                      }`}
                      style={{ left: i * 20 + '%' }}
                     />
                     {/* Alert Marker */}
                     {row.alert && (
                       <div className="absolute top-0 h-6 w-px bg-red-600" style={{ left: (i * 20 + row.progress) + '%' }}>
                          <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-600 rounded-full ring-4 ring-red-100 shadow-lg" />
                       </div>
                     )}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Day Pointer */}
            <div className="grid grid-cols-12 mt-12 relative pointer-events-none">
               <div className="col-span-3" />
               <div className="col-span-9 relative">
                  <div className="absolute left-[33%] flex flex-col items-center">
                    <div className="h-48 w-px bg-slate-200 border-l border-dashed border-slate-400 opacity-30 absolute bottom-6" />
                    <span className="bg-[#091426] text-white font-mono text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">Today: Sep 26</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Forensic Terminal Section */}
        <div className="bg-[#091426] rounded-[2rem] p-10 text-slate-300 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-all duration-700" />
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <Terminal size={22} className="text-emerald-400" />
              <h3 className="font-mono text-lg font-black text-white tracking-widest">Forensic Audit Log_</h3>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Telemetry active // Signal: Stable</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-6 font-mono text-xs uppercase">
            {[
              { time: '14:22:09', tag: 'SYSTEM', msg: 'Milestone "Q3 Financial Close" status → ', target: 'COMPLETE', val: 'user@compliance.global', color: 'emerald' },
              { time: '13:58:31', tag: 'ACTION', msg: 'Evidence hash [SHA-256: 8f4e2...] anchored → ', target: 'BLOCKCHAIN', val: 'MT: IT_PRIVACY_4.2', color: 'blue' },
              { time: '12:11:44', tag: 'ALERT', msg: 'Deadline variance in "ESG Global Reporting" → ', target: '+4.2 DAYS', val: 'baseline_drift_detected', color: 'red' },
              { time: '10:45:00', tag: 'INFO', msg: 'Automated diagnostic run complete — ', target: '12,490 TX', val: 'milestone_verified_ok', color: 'slate' },
            ].map((log, i) => (
              <div key={i} className="flex gap-6 group/log">
                <span className="text-slate-600 font-bold shrink-0">{log.time}</span>
                <span className={`font-black tracking-widest ${
                  log.color === 'emerald' ? 'text-emerald-500' : log.color === 'blue' ? 'text-blue-500' : log.color === 'red' ? 'text-red-500' : 'text-slate-500'
                } shrink-0`}>[{log.tag}]</span>
                <p className="text-slate-400 font-medium group-hover/log:text-white transition-colors">
                  {log.msg} <span className={`font-black ${
                      log.color === 'emerald' ? 'text-emerald-400' : log.color === 'blue' ? 'text-blue-400' : log.color === 'red' ? 'text-red-400' : 'text-slate-200'
                  }`}>{log.target}</span> <span className="text-slate-500 italic ml-2">:: {log.val}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;
