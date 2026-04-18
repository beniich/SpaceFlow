import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Search, 
  ShieldCheck, 
  Activity, 
  Lock, 
  RefreshCw, 
  AlertTriangle, 
  Terminal, 
  Download, 
  PersonStanding, 
  FileCode, 
  History,
  Workflow,
  Share2,
  Gavel,
  CheckCircle2,
  ChevronRight,
  Filter,
  Monitor,
  Zap
} from 'lucide-react';
import { IncidentService, Incident } from '../services/IncidentService';

import { useQuery } from '@tanstack/react-query';
import { useLiveUpdates } from '../hooks/useLiveUpdates';

const IncidentWorkspace: React.FC = () => {
  useLiveUpdates();
  const [selectedIncidentId, setSelectedIncidentId] = React.useState<string | null>(null);

  const { data: incidents = [], isLoading: loading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => IncidentService.getIncidents(),
  });

  const incident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  if (loading) return <div className="p-10 text-slate-500 font-bold animate-pulse">LOADING FORENSIC DATA...</div>;
  if (!incident && incidents.length === 0) return <div className="p-10 font-bold text-red-600">NO INCIDENTS FOUND</div>;


  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border flex items-center gap-2 ${
                incident.severity === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'
              }`}>
                <AlertTriangle size={12} fill="currentColor" fillOpacity={0.2} /> {incident.severity} Finding Detected
              </span>
              <span className="text-slate-400 font-mono text-[10px] font-bold tracking-tight uppercase">
                ID / {incident.id.substring(0, 12)}
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase">{incident.title}</h1>
            <p className="text-slate-500 max-w-2xl mt-2 text-sm leading-relaxed font-medium">
              Forensic reconstruction of events originating from {incident.node?.name || 'Unknown Node'}. Event store integrity verified across the decentralized ledger.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-2.5 bg-white border border-slate-200 text-[#091426] rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all">
              <Share2 size={14} /> Export Audit Trail
            </button>
            <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-red-100 hover:bg-red-700 transition-all">
              <Gavel size={14} /> Formal Escalation
            </button>
          </div>
        </div>

        {/* Workspace Bento Grid */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column: Event Reconstruction Timeline */}
          <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[740px]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Workflow className="text-[#091426]" size={20} />
                <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Forensic Reconstruction</h3>
              </div>
              <Filter className="text-slate-300" size={18} />
            </div>
            
            <div className="flex-1 p-10 overflow-y-auto scrollbar-hide">
              <div className="relative border-l-2 border-slate-50 ml-4 py-2 space-y-12">
                {[
                  { time: '04:12:01 UTC', type: 'Root Detection', title: 'Non-conformity triggered', desc: 'External IP 45.22.1.92 initiated handshake bypassing WAF Protocol 14B.', node: 'NODE-X7', color: 'red', icon: <Zap size={16} /> },
                  { time: '04:14:55 UTC', type: 'Propagation', title: 'Credential Injection Attempt', desc: 'Shadow account admin_test_v2 created via lateral SQL injection in sub-ledger.', color: 'blue', icon: <Monitor size={16} /> },
                  { time: '04:18:22 UTC', type: 'Analysis Point', title: 'Encrypted Data Extraction', desc: '3.2GB of blob storage transferred to unauthorized endpoint. Payload identified.', active: true, color: 'blue', icon: <Activity size={16} /> },
                  { time: '04:22:10 UTC', type: 'Containment', title: 'Security Kill-Switch Engaged', desc: 'Automated protocol isolation successful. All APAC endpoints rotated.', color: 'slate', icon: <Lock size={16} /> },
                ].map((event, i) => (
                  <div key={i} className={`relative pl-12 group ${event.active ? 'bg-blue-50/50 -mx-10 px-10 py-6 border-y border-blue-100' : ''}`}>
                    <div className={`absolute left-[-13px] top-1 w-6 h-6 rounded-full bg-white border-2 border-current flex items-center justify-center z-10 
                      ${event.color === 'red' ? 'text-red-500' : event.color === 'blue' ? 'text-blue-500' : 'text-slate-400'}`}>
                      {event.icon}
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${event.color === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
                          {event.type} • {event.time}
                        </span>
                        {event.node && <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase">{event.node}</span>}
                      </div>
                      <h4 className={`text-sm font-black uppercase tracking-tight mb-2 ${event.active ? 'text-blue-900' : 'text-[#091426]'}`}>{event.title}</h4>
                      <p className={`text-xs leading-relaxed font-medium ${event.active ? 'text-blue-800' : 'text-slate-500'}`}>{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Evidence Control & Detail */}
          <div className="col-span-12 lg:col-span-7 space-y-8">
            
            {/* Evidence Configuration Grid */}
            <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-xl font-black text-[#091426] uppercase tracking-tight leading-none mb-2">Evidence Configuration</h3>
                    <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Segment Cluster: EXFIL-09</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Integrity Hash</p>
                      <p className="text-lg font-black text-emerald-600 font-mono tracking-tighter leading-none">99.98% OK</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 text-emerald-500">
                      <ShieldCheck size={32} fill="currentColor" fillOpacity={0.1} />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  {/* Console Log Snapshot */}
                  <div className="col-span-2 bg-[#091426] rounded-2xl p-6 font-mono text-[11px] text-blue-400 border border-slate-800 relative shadow-inner group">
                    <div className="flex justify-between items-center mb-4 text-slate-500 uppercase tracking-widest text-[9px] font-bold">
                      <span className="flex items-center gap-2"><Terminal size={12} /> Root_Log_Snapshot</span>
                      <span className="group-hover:text-blue-400 transition-colors">SHA-256 Verified</span>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed opacity-80">
                      <code>[2024-05-14T04:18:22.401Z] SIG_ALARM: DATA_FLOW_THRESHOLD_EXCEEDED{'\n'}</code>
                      <code>[2024-05-14T04:18:22.405Z] TRACE_ID: 982-AX-001{'\n'}</code>
                      <code>[2024-05-14T04:18:22.410Z] DEST: 104.28.1.5 (RU_MOSCOW_EXIT){'\n'}</code>
                      <code>[2024-05-14T04:18:22.412Z] SIZE: 3,219,842 KB{'\n'}</code>
                      <code>[2024-05-14T04:18:22.415Z] ACTION: INTERCEPT_DEFERRED</code>
                    </pre>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091426] via-transparent pointer-events-none" />
                  </div>

                  {/* Attachment Sample */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between hover:bg-white hover:border-blue-200 transition-all cursor-pointer">
                    <h4 className="text-[10px] font-black text-[#091426] uppercase tracking-widest mb-4 flex items-center gap-2">
                       <FileCode size={14} className="text-blue-500" /> Payload Sample
                    </h4>
                    <div className="h-24 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden group">
                       <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                         <div className="w-full h-full bg-[radial-gradient(#091426_1px,transparent_1px)] [background-size:12px_12px]" />
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="text-[10px] font-mono text-slate-400 font-bold mb-2">enc_fragment.vault</span>
                         <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Download Secure</span>
                       </div>
                    </div>
                  </div>

                  {/* Actor Profile */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between hover:bg-white hover:border-red-200 transition-all cursor-pointer">
                    <h4 className="text-[10px] font-black text-[#091426] uppercase tracking-widest mb-4 flex items-center gap-2">
                       <PersonStanding size={14} className="text-red-500" /> Actor Identification
                    </h4>
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shadow-sm">
                         <Lock size={20} />
                       </div>
                       <div>
                         <p className="text-xs font-black text-[#091426] uppercase tracking-tight">Service Account</p>
                         <p className="text-[10px] font-mono text-slate-400 font-bold">uid: 0092-SYS-AUTO</p>
                         <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mt-1">Status: Compromised</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Forensic Audit Log Component */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
               <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Forensic Audit Trail (Immuable)</h3>
                  <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all">
                    Export Full Log
                  </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-slate-50 font-bold text-[9px] text-slate-400 uppercase tracking-widest">
                       <th className="px-8 py-4">Timestamp (UTC)</th>
                       <th className="px-8 py-4">Authorizer</th>
                       <th className="px-8 py-4">Action Summary</th>
                       <th className="px-8 py-4 text-right">Verification</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 font-mono text-[10px]">
                     {[
                       { time: '10:45:22.091', auth: 'SYS_WATCHDOG', action: 'Auto-flagging: Threshold alert triggered', status: 'OK' },
                       { time: '10:48:10.422', auth: 'J. RODRIGUEZ', action: 'Manual investigation workspace opened', status: 'OK' },
                       { time: '11:02:05.118', auth: 'L3_INVESTIGATOR', action: 'Evidence cluster locked for forensic audit', status: 'OK' },
                     ].map((row, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-4 text-slate-400">{row.time}</td>
                         <td className="px-8 py-4 font-black text-[#091426]">{row.auth}</td>
                         <td className="px-8 py-4 text-slate-600 uppercase font-bold tracking-tighter">{row.action}</td>
                         <td className="px-8 py-4 text-right">
                           <CheckCircle2 size={12} className="text-emerald-500 ml-auto" fill="currentColor" fillOpacity={0.1} />
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <footer className="fixed bottom-0 right-0 p-8 z-50">
        <div className="bg-[#091426]/90 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Forensic Lab Sync: 100%</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <p className="text-[9px] font-mono font-bold text-slate-400 tracking-tighter uppercase">Cluster Alpha-21 Verification Locked</p>
        </div>
      </footer>
    </div>
  );
};

export default IncidentWorkspace;
