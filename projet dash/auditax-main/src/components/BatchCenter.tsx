import React from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  UploadCloud, 
  FileJson, 
  FileSpreadsheet, 
  FileText, 
  ShieldCheck, 
  Activity, 
  History, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  Lock,
  Zap,
  HardDrive,
  ShieldCheck as Verified,
  TrendingUp,
  CloudUpload
} from 'lucide-react';

const BatchCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Orchestrator v4.2
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 <ShieldCheck size={10} className="fill-current" /> SYSTEM_HEALTH: NOMINAL
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none text-balance">Batch Import/Export Center</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Orchestrate high-volume compliance data migrations and audits. Secure, signed, and validated for regulatory submission via global event-store anchoring.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="h-14 w-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-50/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Zap size={24} className="relative z-10 animate-pulse" />
             </div>
          </div>
        </div>

        {/* Top Row: Summary Stats & Active Jobs */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-8">
             <div className="flex justify-between items-center mb-2">
                <div>
                   <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Active Transfers</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Monitoring 4 concurrent background processes</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                   <CloudUpload size={18} className="text-blue-500" />
                </div>
             </div>
             
             <div className="space-y-6">
                {[
                  { name: 'Q4_FINANCIAL_RECON_V2.csv', progress: 78, status: 'UPLOADING', color: 'blue' },
                  { name: 'EVIDENCE_SIGNED_HASH_LOGS.json', progress: 42, status: 'SIGNING...', color: 'emerald' },
                ].map((job, i) => (
                  <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all">
                    <div className="flex justify-between items-center mb-4">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${job.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center`}>
                             {job.color === 'blue' ? <UploadCloud size={14} /> : <ShieldCheck size={14} />}
                          </div>
                          <span className="text-xs font-mono font-black text-[#091426] tracking-tight">{job.name}</span>
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${job.color === 'blue' ? 'text-blue-600' : 'text-emerald-600'}`}>
                          {job.progress}% COMPLETE
                       </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: job.progress + '%' }} 
                         className={`h-full ${job.color === 'blue' ? 'bg-blue-600 shadow-blue-50' : 'bg-emerald-500 shadow-emerald-50'}`} 
                       />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="col-span-4 flex flex-col gap-8">
             <div className="bg-[#091426] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Records Processed</p>
                   <div className="text-5xl font-black tracking-tighter mb-4">1,204,551</div>
                </div>
                <div className="relative z-10 flex items-center text-[10px] font-black text-emerald-400 uppercase tracking-widest gap-2">
                   <TrendingUp size={14} /> +12.4% vs last week
                </div>
             </div>

             <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm h-full flex flex-col justify-between group hover:shadow-xl hover:shadow-red-50 transition-all">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Validation Health</p>
                   <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                      <AlertCircle size={14} />
                   </div>
                </div>
                <div className="text-4xl font-black text-red-600 tracking-tighter">99.2%</div>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-tight">9,421 failed validations detected</p>
             </div>
          </div>
        </div>

        {/* Main Content Area: Staging and Export */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Staging Area (Left) */}
          <div className="col-span-8 bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
             <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                   <Database size={18} className="text-blue-600" /> Import Staging Area
                </h3>
                <div className="flex gap-4">
                   <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-[#091426] rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-slate-300 transition-all">
                      <Filter size={14} /> Filter Errors
                   </button>
                   <button className="flex items-center gap-2 px-6 py-2 bg-[#091426] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                      Commit Batch
                   </button>
                </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-10 py-4">Row ID</th>
                      <th className="px-10 py-4">Legal Entity</th>
                      <th className="px-10 py-4">Transaction ID</th>
                      <th className="px-10 py-4">Status</th>
                      <th className="px-10 py-4 text-right">Value (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-mono text-xs">
                    {[
                      { id: '#00441', entity: 'Global_Corp_EMEA', txn: 'TX-88219-B', status: 'VALID', value: '42,500.00' },
                      { id: '#00442', entity: 'Global_Corp_APAC', txn: 'NULL_PTR_ERR', status: 'MISSING_ID', value: '--', error: true },
                      { id: '#00443', entity: 'Americas_Retail_Div', txn: 'TX-91122-C', status: 'VALID', value: '1,120.40' },
                      { id: '#00444', entity: 'Global_Corp_EMEA', txn: 'TX-88220-A', status: 'SCHEMA_FAIL', value: '99,000.00', error: true },
                      { id: '#00445', entity: 'Nordic_Solutions_SA', txn: 'TX-44512-Z', status: 'VALID', value: '304.50' },
                    ].map((row, i) => (
                      <tr key={i} className={`group hover:bg-slate-50 transition-colors ${row.error ? 'bg-red-50/30' : ''}`}>
                        <td className={`px-10 py-5 font-black ${row.error ? 'text-red-600 underline' : 'text-slate-400'}`}>{row.id}</td>
                        <td className="px-10 py-5 text-[#091426] font-bold uppercase tracking-tight">{row.entity}</td>
                        <td className="px-10 py-5 text-slate-500 font-bold">{row.txn}</td>
                        <td className="px-10 py-5">
                           <span className={`inline-flex px-2 py-1 rounded border text-[8px] font-black uppercase tracking-widest ${
                             row.error ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                           }`}>
                             {row.status}
                           </span>
                        </td>
                        <td className="px-10 py-5 text-right font-black text-[#091426] tracking-tighter">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
             <button className="w-full py-5 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-600 hover:bg-blue-50/50 transition-all border-t border-slate-100">
                View 826 more records
             </button>
          </div>

          {/* Side Panel: Export & Audit */}
          <div className="col-span-4 space-y-8">
             <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
                <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] mb-8">Export Configuration</h3>
                <div className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Format</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'CSV', icon: <FileSpreadsheet />, active: true },
                          { label: 'JSON', icon: <FileJson /> },
                          { label: 'PDF', icon: <FileText /> },
                        ].map((fmt, i) => (
                          <button key={i} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                            fmt.active ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100' : 'border-slate-50 bg-slate-50 text-slate-400 opacity-60 hover:opacity-100'
                          }`}>
                             {React.cloneElement(fmt.icon as React.ReactElement, { size: 20 })}
                             <span className="text-[10px] font-black">{fmt.label}</span>
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <div className="flex items-start gap-4">
                         <div className="shrink-0 mt-1">
                            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white">
                               <Verified size={12} />
                            </div>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[11px] font-black text-[#091426] uppercase tracking-tight">Cryptographic Signature</p>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Appends a SHA-256 HMAC signature using the organization's root certificate for chain-of-custody.</p>
                         </div>
                      </div>
                   </div>

                   <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
                      <Download size={14} /> Start Secure Export
                   </button>
                </div>
             </div>

             <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex justify-between items-center">
                   Batch Audit Trail <History size={14} className="text-slate-300" />
                </h3>
                <div className="space-y-8 relative pl-6 before:absolute before:left-0.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                   {[
                     { time: '16:10:04', msg: 'Export Q3_RECON initiated by admin_77', active: true },
                     { time: '15:45:21', msg: 'Import failed at row #442 (Missing ID)', error: true },
                     { time: '15:40:00', msg: 'Staging manifest uploaded (12,400 rec)', active: false },
                   ].map((log, i) => (
                     <div key={i} className="relative">
                        <div className={`absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm z-10 ${
                          log.error ? 'bg-red-500' : log.active ? 'bg-blue-600 outline outline-4 outline-blue-50' : 'bg-slate-300'
                        }`} />
                        <div className="space-y-1">
                           <span className="text-[10px] font-mono font-black text-slate-300 uppercase leading-none">{log.time} UTC</span>
                           <p className={`text-[11px] font-bold tracking-tight leading-tight ${log.error ? 'text-red-900' : 'text-[#091426]'}`}>{log.msg}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Technical Footer */}
        <div className="pt-10 border-t border-slate-100 flex justify-between items-center overflow-hidden">
           <div className="flex items-center gap-6">
              <div className="h-10 px-4 bg-slate-900 rounded-xl flex items-center gap-3 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Protocol: AES-256-GCM / TLS 1.3</span>
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">BUILD v4.2.1-STABLE // EPOCH_1698</p>
           </div>
           <div className="opacity-10 translate-x-10">
              <HardDrive size={80} className="text-slate-900" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default BatchCenter;
