import React from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  Settings as SettingsInputComponent, 
  CloudCheck as CloudDone, 
  CheckSquare as Task, 
  BarChart as Analytics, 
  Key as VpnKey, 
  Settings, 
  Code,
  Database as Schema,
  Copy as ContentCopy,
  Download,
  History as HistoryEdu
} from 'lucide-react';

const EvidenceCollectorConfig: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-8">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Automated Evidence Collector Config</h1>
              <p className="text-slate-500 max-w-2xl font-medium">Forensic-grade orchestration for API-based compliance evidence gathering. Manage bot permissions, polling intervals, and data integrity verification.</p>
           </div>
           <div className="flex gap-4">
              <button className="px-5 py-2 border border-slate-200 bg-white text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded transition-colors hover:bg-slate-50 shadow-sm">
                 Test Connections
              </button>
              <button className="px-5 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
                 Add Connector
              </button>
           </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
           {/* Data Volume Chart */}
           <div className="col-span-8 bg-white border border-slate-200 rounded-xl p-8 flex flex-col h-80 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold text-slate-900">Evidence Intake Volume</h3>
                 <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span className="w-2 h-2 rounded-full bg-blue-600" /> Successful
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span className="w-2 h-2 rounded-full bg-slate-200" /> Quarantined
                    </span>
                 </div>
              </div>
              <div className="flex-1 flex items-end gap-2">
                 {/* Simulated Bar Chart */}
                 {[40, 60, 55, 85, 45, 70, 95, 50, 40, 30, 65, 80].map((val, i) => (
                    <div key={i} className="flex-1 bg-slate-100 rounded-t-sm hover:bg-blue-100 transition-colors relative cursor-pointer group flex items-end">
                       <div className="w-full bg-blue-600 rounded-t-sm transition-all group-hover:opacity-80" style={{ height: `${val}%` }} />
                    </div>
                 ))}
              </div>
           </div>

           {/* Health Stats */}
           <div className="col-span-4 bg-[#091426] text-white rounded-xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Terminal size={120} />
              </div>
              <div className="relative z-10">
                 <span className="text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest">System Health</span>
                 <h2 className="text-6xl font-black mt-2 tracking-tighter">99.9%</h2>
                 <p className="text-slate-400 text-xs font-medium mt-1">Uptime across 12 active clusters</p>
              </div>
              <div className="relative z-10 mt-8">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Threads</span>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Running</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[72%]" />
                 </div>
              </div>
           </div>

           {/* Connectors Table */}
           <div className="col-span-12 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-lg font-bold text-slate-900">Active Connectors</h3>
                 <div className="flex bg-white border border-slate-200 p-1 rounded-lg">
                    <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-widest shadow-sm">All</button>
                    <button className="px-4 py-1.5 text-slate-500 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-colors">Cloud</button>
                    <button className="px-4 py-1.5 text-slate-500 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-colors">SaaS</button>
                 </div>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <th className="px-6 py-4">Connector</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Last Successful Run</th>
                       <th className="px-6 py-4 text-right">Data Vol (24h)</th>
                       <th className="px-6 py-4"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <CloudDone size={20} />
                             </div>
                             <div>
                                <div className="text-sm font-bold text-slate-900">AWS CloudTrail</div>
                                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">IAM & Config Monitoring</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono text-[10px] font-bold">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> VERIFIED
                          </span>
                       </td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-600">2023-11-24 14:02:11 UTC</td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-600 text-right">14.2 GB</td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-blue-600"><Settings size={18} /></button>
                       </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Task size={20} />
                             </div>
                             <div>
                                <div className="text-sm font-bold text-slate-900">JIRA API</div>
                                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Change Management Logs</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono text-[10px] font-bold">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> VERIFIED
                          </span>
                       </td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-600">2023-11-24 13:58:04 UTC</td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-600 text-right">284 MB</td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-blue-600"><Settings size={18} /></button>
                       </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Analytics size={20} />
                             </div>
                             <div>
                                <div className="text-sm font-bold text-slate-900">Datadog Logs</div>
                                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Infrastructure Metrics</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-amber-50 border border-amber-100 text-amber-700 font-mono text-[10px] font-bold">
                             <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> DEGRADED
                          </span>
                       </td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-600">2023-11-24 10:15:44 UTC</td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-600 text-right">1.4 GB</td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-blue-600"><Settings size={18} /></button>
                       </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <VpnKey size={20} />
                             </div>
                             <div>
                                <div className="text-sm font-bold text-slate-900">Okta Auth</div>
                                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Identity & Access Logs</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono text-[10px] font-bold">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> VERIFIED
                          </span>
                       </td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-600">2023-11-24 14:03:00 UTC</td>
                       <td className="px-6 py-4 font-mono text-xs text-slate-600 text-right">4.8 GB</td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-blue-600"><Settings size={18} /></button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>

           {/* JSON IDE */}
           <div className="col-span-12 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex h-[500px]">
              <div className="w-64 border-r border-slate-200 bg-slate-50 p-4">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Config Files</h4>
                 <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded bg-blue-600 text-white text-xs font-mono shadow-sm cursor-pointer border border-blue-700 block">
                       <Code size={16} /> main_config.json
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded text-slate-600 hover:bg-slate-200 text-xs font-mono cursor-pointer transition-colors block">
                       <Settings size={16} /> aws_lambda.yaml
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded text-slate-600 hover:bg-slate-200 text-xs font-mono cursor-pointer transition-colors block">
                       <Schema size={16} /> auth_proxy.env
                    </div>
                 </div>
              </div>
              <div className="flex-1 flex flex-col bg-slate-900 text-slate-300 font-mono text-sm">
                 <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
                    <div className="flex gap-4">
                       <span className="text-[10px] text-blue-400 font-bold">master_config.json</span>
                       <span className="text-[10px] text-slate-500">Read-Only Mode</span>
                    </div>
                    <div className="flex gap-4">
                       <ContentCopy size={14} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
                       <Download size={14} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
                    </div>
                 </div>
                 <div className="flex-1 p-6 overflow-y-auto leading-relaxed">
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">01</span><span>&#123;</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">02</span><span className="pl-4">"orchestrator_version": <span className="text-amber-300">"2.4.1-stable"</span>,</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">03</span><span className="pl-4">"global_polling_interval": <span className="text-blue-400">300</span>,</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">04</span><span className="pl-4">"retry_policy": &#123;</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">05</span><span className="pl-8">"max_attempts": <span className="text-blue-400">3</span>,</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">06</span><span className="pl-8">"backoff_exponential": <span className="text-blue-400">true</span></span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">07</span><span className="pl-4">&#125;,</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">08</span><span className="pl-4">"endpoints": [</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">09</span><span className="pl-8">&#123;</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">10</span><span className="pl-12">"id": <span className="text-amber-300">"aws-trail-01"</span>,</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">11</span><span className="pl-12">"region": <span className="text-amber-300">"us-east-1"</span>,</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">12</span><span className="pl-12">"secure_hash": <span className="text-amber-300">"SHA-256/f798...21"</span></span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">13</span><span className="pl-8">&#125;</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">14</span><span className="pl-4">]</span></div>
                    <div className="flex"><span className="w-8 text-slate-600 select-none mr-4">15</span><span>&#125;</span></div>
                 </div>
                 <div className="h-14 bg-slate-950 border-t border-slate-800 flex items-center justify-end px-6 gap-4">
                    <button className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Discard</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors">Commit JSON</button>
                 </div>
              </div>
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default EvidenceCollectorConfig;
