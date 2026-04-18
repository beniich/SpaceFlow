import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  BookOpen, 
  AlertTriangle, 
  UserCheck, 
  Search, 
  Download,
  Activity,
  ShieldAlert,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';

export const CertificationsHub = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ONBOARDING' | 'PERFORMANCE' | 'COI'>('ONBOARDING');

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-1000 mt-2">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Governance & RH Hub</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">Access portals for state auditors, global certifications, and conflict of interest registry.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveSubTab('ONBOARDING')}
             className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
               activeSubTab === 'ONBOARDING' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
             }`}
           >
             Onboarding
           </button>
           <button 
             onClick={() => setActiveSubTab('PERFORMANCE')}
             className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
               activeSubTab === 'PERFORMANCE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
             }`}
           >
             Performance
           </button>
           <button 
             onClick={() => setActiveSubTab('COI')}
             className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
               activeSubTab === 'COI' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
             }`}
           >
             COI Registry
           </button>
        </div>
      </div>

      {/* Dynamic Content area */}
      <div className="grid grid-cols-12 gap-8">

        {activeSubTab === 'ONBOARDING' && (
          <div className="col-span-12 font-sans">
             <div className="grid grid-cols-3 gap-6 mb-8">
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                     <UserCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Auditors</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">428</p>
                  </div>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600">
                     <Award size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certifications ISSUED</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,902</p>
                  </div>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600">
                     <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Training</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">14</p>
                  </div>
               </div>
             </div>

             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                   <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Auditor Onboarding Pipeline</h3>
                   <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-700">Invite Auditor</button>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/20 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Auditor / Entity</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Progress</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {[
                      { name: 'Dr. Sarah Jenkins', entity: 'State Regulator Board', status: 'IN_REVIEW', progress: 85 },
                      { name: 'Michael Chen', entity: 'External Agency (APAC)', status: 'ACTIVE', progress: 100 },
                      { name: 'Robert Fox', entity: 'ISO Compliance Validator', status: 'PENDING_DOCS', progress: 40 }
                    ].map(auditor => (
                      <tr key={auditor.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-900 dark:text-white">{auditor.name}</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{auditor.entity}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             auditor.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' :
                             auditor.status === 'IN_REVIEW' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                           }`}>{auditor.status}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600 rounded-full" style={{ width: `${auditor.progress}%` }}></div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500">{auditor.progress}%</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeSubTab === 'COI' && (
          <div className="col-span-12 font-sans space-y-8">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 flex items-start gap-4">
              <div className="text-red-500 mt-1">
                <ShieldAlert size={24} />
              </div>
              <div>
                 <h3 className="text-sm font-black text-red-900 dark:text-red-400 tracking-tight">Active Conflict of Interest Alerts</h3>
                 <p className="text-xs text-red-600 dark:text-red-300 mt-1">Our AI Engine identified 2 instances where an assigned auditor has a history of financial relationships with the audited entity in the past 36 months.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">COI Registry Ledger</h3>
                 <Search size={16} className="text-slate-400" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { id: 'COI-091A', auditor: 'David Bowman', target: 'Aerotech Defense', severity: 'HIGH', date: '2023-11-20', detail: 'Prior board member of subsidiary.' },
                    { id: 'COI-084X', auditor: 'Julia Childress', target: 'Global Pharma', severity: 'MEDIUM', date: '2023-10-15', detail: 'Spouse holds 2% equity in supply chain partner.' }
                  ].map(coi => (
                    <div key={coi.id} className="flex gap-6 items-center p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                       <div className="flex-1">
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-mono text-slate-400">{coi.id}</span>
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                               coi.severity === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                             }`}>{coi.severity} RISK</span>
                          </div>
                          <p className="text-sm font-black text-slate-900 dark:text-white mt-1 pt-1">{coi.auditor} <span className="text-slate-400 text-xs font-normal">→ conflict with →</span> {coi.target}</p>
                          <p className="text-xs text-slate-500 mt-1">{coi.detail}</p>
                       </div>
                       <div>
                          <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors">
                             Recuse
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'PERFORMANCE' && (
          <div className="col-span-12 font-sans space-y-6">
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full border-[6px] border-emerald-500 flex items-center justify-center mb-4">
                     <span className="font-black text-xl text-slate-900 dark:text-white">94%</span>
                  </div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Average Audit Accuracy</h3>
                  <p className="text-xs text-slate-500 mt-2">Based on peer reviews and regulatory overrides.</p>
               </div>
               <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Auditor Efficiency Index</h3>
                  <div className="space-y-4">
                    <div>
                       <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          <span>Report Turnaround</span>
                          <span className="text-slate-900 dark:text-white">4.2 Days</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[70%]"></div></div>
                    </div>
                    <div>
                       <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          <span>Finding Acceptance</span>
                          <span className="text-slate-900 dark:text-white">98%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[98%]"></div></div>
                    </div>
                  </div>
               </div>
            </div>
            
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-8">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Performance Insights App</h3>
               <div className="flex items-center justify-center py-10 opacity-50 flex-col gap-4">
                  <Activity size={40} className="text-blue-600" />
                  <p className="text-sm font-bold text-slate-500">Analytics charts loading from core telemetry...</p>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
