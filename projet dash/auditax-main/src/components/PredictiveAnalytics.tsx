import React from 'react';
import { 
  TrendingUp, 
  Map as MapIcon, 
  Search, 
  AlertCircle, 
  ChevronRight, 
  Activity,
  Globe,
  PieChart,
  BarChart3,
  Download,
  Fingerprint,
  FileCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export const PredictiveAnalytics = () => {
  return (
    <div className="flex flex-col gap-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-1000">
      {/* Dynamic Header */}
      <div className="flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Global Intelligence</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Risk Jurisdictional View</span>
          </nav>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Predictive Risk Analytics</h2>
          <p className="text-slate-500 text-sm mt-1">Cross-jurisdictional threat modeling and regulatory drift forecasting.</p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Map View</button>
           <button className="px-5 py-2 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Grid Analytics</button>
        </div>
      </div>

      {/* Main Analytics Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Interactive Map Drilldown */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm relative group h-[600px] flex flex-col">
           <div className="absolute top-6 left-6 z-10 space-y-3">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2 rounded-xl shadow-lg flex flex-col gap-1">
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600"><TrendingUp size={16}/></button>
                 <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2"></div>
                 <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600"><Search size={16}/></button>
              </div>
           </div>

           <div className="absolute bottom-6 right-6 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xl">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Threat Profile Key</p>
              <div className="flex gap-4">
                 {[
                   { label: 'Low', color: 'bg-emerald-500' },
                   { label: 'Med', color: 'bg-amber-400' },
                   { label: 'High', color: 'bg-orange-500' },
                   { label: 'Critical', color: 'bg-red-600' }
                 ].map(k => (
                   <div key={k.label} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${k.color}`}></div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase">{k.label}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3VF3TfSwSvg5clsfM_ZPAzvsTfbgYNoX_qngzaX7LAY4eo0IEO8sXxjxfqIE6iiKbg8DjRIEfgUPrIafRyX6xnLF-cammUbr2ivu8I5H6oh7p_RX1F1Xj-fQae8Qn0LdHJ4XIDdFTZxwGK1pOuJKm8xgTyfVWj-lXg5pK9W5fT12QQR7zFJ-EIGKGFmnj1oQ_rk8x6Lg1KhlfU13oQ6kF22VkNIqV7nFyQte58cZOvV7qx4M-LJruwtVEVWHXdaty7HRhJOiONrQ"
                className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-30 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
                alt="Risk Map"
              />
              
              {/* Interactive Hotspots */}
              <div className="absolute top-[35%] left-[48%] pointer-events-none">
                 <div className="relative flex items-center justify-center">
                    <div className="absolute w-12 h-12 bg-red-500/20 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
                 </div>
              </div>

              <div className="absolute top-[50%] left-[40%] pointer-events-none">
                 <div className="w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
           </div>
        </div>

        {/* Sidebar Intelligence (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           
           {/* Summary Tooltips */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Active Jurisdiction Metrics</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Total Risk Score</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">68.4 <span className="text-sm font-bold text-slate-300">/ 100</span></p>
                    </div>
                    <div className="w-14 h-14 rounded-full border-[6px] border-slate-100 dark:border-slate-800 flex items-center justify-center border-t-amber-500 border-r-amber-500 -rotate-45">
                       <span className="text-[10px] font-black text-slate-900 dark:text-white rotate-45">68%</span>
                    </div>
                 </div>
                 <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational</p>
                       <p className="text-xl font-black text-emerald-600">82%</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Compliance</p>
                       <p className="text-xl font-black text-red-600">34%</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* City-Level Breakdown */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                 <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Zone Breakdown</h3>
                 <BarChart3 size={14} className="text-slate-400" />
              </div>
              <div className="flex-1 overflow-y-auto max-h-[280px]">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-5 py-3 font-bold">Zone</th>
                          <th className="px-5 py-3 font-bold">Threat</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                       {[
                         { city: 'London, UK', risk: '2.1 LOW', color: 'text-emerald-500 bg-emerald-100' },
                         { city: 'Berlin, DE', risk: '5.4 MED', color: 'text-amber-600 bg-amber-100' },
                         { city: 'Paris, FR', risk: '4.2 MED', color: 'text-amber-600 bg-amber-100' },
                         { city: 'Madrid, ES', risk: '6.9 HIGH', color: 'text-orange-600 bg-orange-100' },
                         { city: 'Brussels, BE', risk: '8.1 CRIT', color: 'text-red-600 bg-red-100' }
                       ].map(row => (
                         <tr key={row.city} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                            <td className="px-5 py-3 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{row.city}</td>
                            <td className="px-5 py-3">
                               <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${row.color}`}>{row.risk}</span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                 <button className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-blue-600 hover:bg-blue-600 hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg uppercase tracking-widest transition-all">Download Signal Log</button>
              </div>
           </div>
        </div>

        {/* Bottom Insight Feed */}
        <div className="col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
           <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <PieChart size={18} className="text-blue-600" />
                Regional Risk Audit Trail
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 Live Monitoring Active
              </div>
           </div>

           <div className="relative pl-6">
              <div className="absolute left-[31px] top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="space-y-10 relative">
                 <div className="flex gap-6 items-start group">
                    <div className="w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-100 dark:ring-red-900/30 z-10 mt-1 shadow-lg"></div>
                    <div className="flex-1 transition-all group-hover:translate-x-1">
                       <div className="flex justify-between items-start">
                          <p className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Critical Breach Detected - Frankfurt Node DE-7</p>
                          <span className="text-[10px] font-mono font-bold text-slate-400">14:22:01 UTC</span>
                       </div>
                       <p className="text-xs text-slate-500 mt-1 leading-relaxed">Unauthorized access attempt flagged by biometric firewall. Jurisdictional risk score adjusted +4.2 points.</p>
                    </div>
                 </div>

                 <div className="flex gap-6 items-start group opacity-60 hover:opacity-100 transition-opacity">
                    <div className="w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-50 dark:ring-blue-900/10 z-10 mt-1 shadow-md"></div>
                    <div className="flex-1 transition-all group-hover:translate-x-1">
                       <div className="flex justify-between items-start">
                          <p className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Compliance Scan Completed - Paris Sector FR-2</p>
                          <span className="text-[10px] font-mono font-bold text-slate-400">13:10:45 UTC</span>
                       </div>
                       <p className="text-xs text-slate-500 mt-1">Scheduled GDPR alignment check performed. 98.4% consistency recorded.</p>
                    </div>
                 </div>
              </div>
            </div>
         </div>

         {/* Sprint 14 Integration: Data Integrity & ICF Explorer */}
         <div className="col-span-12 grid grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <FileCheck size={16} className="text-blue-600" />
                     ICF Explorer (Internal Control Framework)
                  </h3>
                  <button className="text-[9px] font-black uppercase text-blue-600 hover:underline tracking-widest">Browse Controls</button>
               </div>
               <div className="space-y-4">
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex gap-4 items-center">
                     <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-lg text-slate-500 font-black text-xs">A.1</div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Information Security Policies</p>
                        <p className="text-xs text-slate-500 mt-0.5">Control objective: Management direction and support for OSINT.</p>
                     </div>
                     <div className="text-right">
                        <span className="text-[9px] font-black px-2 py-1 bg-emerald-100 text-emerald-600 rounded uppercase">100% Aligned</span>
                     </div>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex gap-4 items-center">
                     <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-lg text-slate-500 font-black text-xs">A.9</div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Access Control Safeguards</p>
                        <p className="text-xs text-slate-500 mt-0.5">Limit access to forensic data loops based on role-based access.</p>
                     </div>
                     <div className="text-right">
                        <span className="text-[9px] font-black px-2 py-1 bg-amber-100 text-amber-600 rounded uppercase">84% Partial</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 shadow-xl relative overflow-hidden">
               <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
               <div className="relative z-10 flex justify-between items-center mb-6">
                  <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                     <Fingerprint size={16} />
                     Data Integrity Diagnostics (AI)
                  </h3>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                     <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Model Online</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Anomalies Prevented</p>
                     <p className="text-2xl font-black text-white">1,402</p>
                     <p className="text-[8px] text-emerald-400 uppercase font-bold mt-1 tracking-widest">+12% vs last week</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg AI Verdict Latency</p>
                     <p className="text-2xl font-black text-white">24ms</p>
                     <p className="text-[8px] text-emerald-400 uppercase font-bold mt-1 tracking-widest">Optimized Edge inference</p>
                  </div>
                  <div className="col-span-2 bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl mt-2">
                     <div className="flex justify-between items-center mb-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Model Confidence Drift</p>
                        <span className="text-[9px] text-white font-mono">0.002%</span>
                     </div>
                     <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-[98%] h-full bg-blue-500"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
