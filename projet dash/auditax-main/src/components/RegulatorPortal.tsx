import React from 'react';
import { motion } from 'motion/react';
import { 
  Gavel, 
  Search, 
  ShieldCheck, 
  History, 
  Key, 
  Download, 
  Fingerprint, 
  MoreVertical, 
  Eye, 
  ExternalLink,
  ChevronRight,
  Shield,
  FileCheck,
  Activity,
  Lock
} from 'lucide-react';

const RegulatorPortal: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header & Scoped Selector */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Forensic Gateway v2.4
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5">
                <ShieldCheck size={10} className="fill-current" /> SECURED BY EVENT-STORE
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Regulator Access Portal</h1>
            <p className="text-slate-500 max-w-2xl mt-2 text-sm leading-relaxed font-medium">
              Forensic compliance gateway for external auditing bodies. All data is cryptographically anchored to the global event store of AuditMaster.
            </p>
          </div>
          <div className="w-80">
            <label className="block text-[9px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">Scoped Entity Selection</label>
            <div className="relative group">
              <select className="w-full bg-white border-2 border-slate-100 rounded-xl py-3.5 px-5 appearance-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 text-sm font-black text-[#091426] uppercase tracking-tight transition-all cursor-pointer">
                <option>ISO-9001 Compliance Wing</option>
                <option>FDA Pharmaceutical Div.</option>
                <option>GDPR Protection Bureau</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-600 transition-colors">
                 <MoreVertical size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="col-span-8 space-y-8">
            
            {/* Stats Bento Grid */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Total Reports Shared', value: '142', status: 'VERIFIED', icon: <FileCheck className="text-emerald-500" /> },
                { label: 'Active Inquiries', value: '04', status: 'IN REVIEW', icon: <Activity className="text-blue-500" /> },
                { label: 'Integrity Score', value: '99.9%', status: '24H SYNC', icon: <Lock className="text-slate-400" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                     <div className="opacity-40 group-hover:scale-110 transition-transform">{React.cloneElement(stat.icon as React.ReactElement, { size: 16 })}</div>
                  </div>
                  <p className="text-3xl font-black text-[#091426] tracking-tighter mb-4">{stat.value}</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[8px] font-black tracking-widest uppercase ${
                    stat.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                    stat.status === 'IN REVIEW' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {stat.status === 'VERIFIED' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    {stat.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Reports Table Container */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Download size={16} /> Shared Audit Reports
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500"><Search size={16} /></button>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500"><Download size={16} /></button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 font-black text-[9px] text-slate-400 uppercase tracking-[0.2em]">
                        <th className="px-8 py-4">Report ID</th>
                        <th className="px-8 py-4">Audit Scope</th>
                        <th className="px-8 py-4">Timestamp</th>
                        <th className="px-8 py-4">Integrity Seal</th>
                        <th className="px-8 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { id: 'AUD-2023-9921', scope: 'Q4 Infrastructure Security', date: 'Oct 24, 14:22', seal: 'VERIFIED' },
                        { id: 'AUD-2023-9944', scope: 'Data Sovereignty Protocol', date: 'Oct 22, 09:15', seal: 'VERIFIED' },
                        { id: 'AUD-2023-1005', scope: 'Biotech Lab Compliance', date: 'Oct 20, 18:44', seal: 'VERIFIED' },
                        { id: 'AUD-2023-1022', scope: 'Incident Recovery Drills', date: 'Oct 18, 11:30', seal: 'VERIFIED' },
                      ].map((report, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5 font-mono text-xs font-black text-blue-600">{report.id}</td>
                          <td className="px-8 py-5 text-xs font-black text-[#091426] uppercase tracking-tight">{report.scope}</td>
                          <td className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase">{report.date}</td>
                          <td className="px-8 py-5">
                             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[9px] font-black border border-emerald-100">
                               <ShieldCheck size={12} className="fill-current" fillOpacity={0.1} /> VERIFIED BY PROOF-OF-LOG
                             </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1.5 ml-auto translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                              View Ledger <Eye size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>

            {/* Cryptographic Proof Banner */}
            <div className="bg-[#091426] rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />
               <div className="flex items-center justify-between relative z-10">
                 <div className="space-y-4 max-w-xl">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                      <Fingerprint size={24} className="text-blue-400" /> Cryptographic Proof of Audit
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                      Our Event-Store technology ensures that audit logs are immutable and sequentially anchored. Download the verification root key to cross-reference with global nodes.
                    </p>
                    <button className="mt-4 flex items-center gap-3 bg-white text-[#091426] px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/40">
                      <Key size={14} /> Download Root Key
                    </button>
                 </div>
                 <div className="opacity-10 scale-150 rotate-12 -mr-10">
                    <Fingerprint size={160} className="text-white" />
                 </div>
               </div>
            </div>
          </div>

          {/* Side Rail */}
          <div className="col-span-4 space-y-8">
            {/* Entity Context Card */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-[#091426] shadow-inner">
                    <Shield size={28} className="fill-current" fillOpacity={0.05} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#091426] uppercase tracking-tight">ISO Internal Audit</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certified Body #8841-B</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  {[
                    { label: 'Access Level', value: 'READ-ONLY (SCOPED)', color: 'text-[#091426]' },
                    { label: 'Session IP', value: '192.168.1.104', color: 'text-slate-500 font-mono' },
                    { label: 'Token Expires', value: '2h 14m', color: 'text-red-600' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{row.label}</span>
                      <span className={`text-[10px] font-black uppercase tracking-tight ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
               </div>

               <div className="mt-10 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none">Session Status: Monitored & Stable</span>
               </div>
            </div>

            {/* Transparency Log */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
               <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em]">Transparency Logs</h3>
                  <Lock size={12} className="text-slate-400" />
               </div>
               <div className="p-8 space-y-8 relative before:absolute before:left-[39px] before:top-10 before:bottom-10 before:w-px before:bg-slate-100">
                  {[
                    { time: '14:52', msg: 'Accessed Report: AUD-2023-9921', detail: 'SHA-256: 4f1a...b2e3', active: true },
                    { time: '14:15', msg: 'Account Authentication Success', detail: 'Node: SG-WEST-02', active: false },
                    { time: 'OCT 23', msg: 'Downloaded Integrity Root Key', detail: 'Signature: RSA_2048', active: false },
                    { time: 'OCT 23', msg: 'Access Granted by Admin', detail: 'Auth ID: #X-99', active: false },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-6 relative">
                      <div className="w-8 shrink-0 text-right">
                         <span className="text-[9px] font-mono font-black text-slate-300 uppercase leading-none">{log.time}</span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border-4 border-white shadow-md z-10 mt-0.5 ${log.active ? 'bg-blue-600' : 'bg-slate-200'}`} />
                      <div className="space-y-1">
                        <p className="text-xs font-black text-[#091426] uppercase tracking-tight leading-none">{log.msg}</p>
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{log.detail}</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full mt-4 py-3 border-2 border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:border-slate-200 hover:text-slate-600 transition-all">
                    Load Archive Logs
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorPortal;
