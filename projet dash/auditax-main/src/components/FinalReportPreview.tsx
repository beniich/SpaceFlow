import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  BarChart3, 
  Calendar, 
  User, 
  Globe, 
  ExternalLink,
  Award,
  Signature,
  Stamp,
  Lock,
  History
} from 'lucide-react';

const FinalReportPreview: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-10 font-sans cursor-default flex justify-center">
      <div className="max-w-[1000px] w-full space-y-8">
        
        {/* Actions Bar */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-3xl shadow-xl sticky top-4 z-50">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#091426] text-white rounded-xl flex items-center justify-center shadow-lg">
                 <FileText size={20} />
              </div>
              <div>
                 <h2 className="text-xs font-black text-[#091426] uppercase tracking-widest leading-none mb-1">AUDIT_REPORT_2024_082.PDF</h2>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Generated: 2024-05-22 14:02 UTC</p>
              </div>
           </div>
           <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-[#091426] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-blue-600 transition-all">
                 <Printer size={14} /> Print
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#091426] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">
                 <Download size={14} /> Download PDF
              </button>
              <div className="w-px h-8 bg-slate-200 mx-2" />
              <button className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 transition-all">
                 <Share2 size={18} />
              </button>
           </div>
        </div>

        {/* Paper Container */}
        <div className="bg-white shadow-2xl rounded-sm min-h-[1400px] p-20 border border-slate-200 relative overflow-hidden ring-1 ring-slate-900/5">
           
           {/* Watermark */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg]">
              <span className="text-[200px] font-black tracking-tighter uppercase">AuditMaster</span>
           </div>

           {/* Report Header */}
           <div className="flex justify-between items-start border-b-[6px] border-[#091426] pb-16 relative z-10">
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#091426] text-white flex items-center justify-center rounded">
                       <ShieldCheck size={32} className="fill-current" />
                    </div>
                    <div>
                       <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Final Audit Report</h1>
                       <p className="text-slate-500 font-black text-xs uppercase tracking-[0.4em] mt-2">Compliance & Risk Assessment</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-10 pt-6">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Entity</p>
                       <p className="text-sm font-black text-[#091426] uppercase">Datacenter Paris-Alpha (DCP-01)</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Cycle</p>
                       <p className="text-sm font-black text-[#091426] uppercase">Q2 2024 Fiscal Audit</p>
                    </div>
                 </div>
              </div>
              <div className="text-right flex flex-col items-end gap-4">
                 <div className="bg-[#091426] text-white p-6 rounded shadow-2xl flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Global Score</span>
                    <span className="text-5xl font-black tracking-tighter">94</span>
                    <span className="text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded tracking-widest uppercase mt-2">Certified</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase">
                    <Lock size={12} /> SEC_ID: 0xFF92-ZA
                 </div>
              </div>
           </div>

           {/* Executive Summary */}
           <div className="py-16 space-y-8 relative z-10">
              <h2 className="text-sm font-black text-[#091426] uppercase tracking-[0.3em] flex items-center gap-3">
                 <BarChart3 size={18} /> Executive Summary
              </h2>
              <p className="text-lg font-medium text-slate-700 leading-relaxed italic border-l-[4px] border-slate-100 pl-8 py-2">
                 "The comprehensive security audit for DCP-01 indicates a robust posture with significant improvements in identity perimeter controls. While structural gaps exist in legacy encryption protocols, the overall risk remains within acceptable institutional thresholds."
              </p>
              <div className="grid grid-cols-3 gap-8">
                 <div className="bg-slate-50 p-6 rounded-2xl space-y-3 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Findings Resolved</p>
                    <p className="text-3xl font-black text-[#091426]">42 / 48</p>
                    <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 w-[88%]" />
                    </div>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-2xl space-y-3 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Severe Risks</p>
                    <p className="text-3xl font-black text-red-600">02</p>
                    <p className="text-[9px] font-mono font-black text-slate-400 uppercase italic leading-none">Mitigation in Progress</p>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-2xl space-y-3 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Sovereignty</p>
                    <p className="text-3xl font-black text-emerald-600">100%</p>
                    <p className="text-[9px] font-mono font-black text-slate-400 uppercase leading-none">All Assets Localized</p>
                 </div>
              </div>
           </div>

           {/* Compliance Breakdown */}
           <div className="py-16 space-y-10 relative z-10">
              <h2 className="text-sm font-black text-[#091426] uppercase tracking-[0.3em] flex items-center gap-3">
                 <ShieldCheck size={18} /> Regulatory Compliance Frameworks
              </h2>
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                       <th className="py-4">Framework</th>
                       <th className="py-4">Control Groups</th>
                       <th className="py-4">Status</th>
                       <th className="py-4 text-right">Confidence</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { name: 'ISO 27001:2022', controls: 'Security Management', status: 'PASS', conf: '98.2%' },
                      { name: 'SOC 2 TYPE II', controls: 'Trust Services Criteria', status: 'PASS', conf: '94.5%' },
                      { name: 'GDPR / RPD', controls: 'Privacy Rights', status: 'WARN', conf: '88.1%' },
                      { name: 'NIST CSF', controls: 'Identify/Protect/Detect', status: 'PASS', conf: '96.0%' },
                    ].map((row, i) => (
                      <tr key={i} className="text-xs font-black text-[#091426] uppercase tracking-tight">
                         <td className="py-6 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> {row.name}
                         </td>
                         <td className="py-6 text-slate-400">{row.controls}</td>
                         <td className="py-6">
                            <span className={`px-2 py-0.5 rounded-sm border text-[9px] ${
                               row.status === 'PASS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>{row.status}</span>
                         </td>
                         <td className="py-6 text-right font-mono">{row.conf}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Significant Findings */}
           <div className="py-16 space-y-10 relative z-10">
              <h2 className="text-sm font-black text-[#091426] uppercase tracking-[0.3em] flex items-center gap-3">
                 <AlertTriangle size={18} className="text-amber-500" /> Significant Audit Findings
              </h2>
              <div className="space-y-6">
                 {[
                   { id: 'ADT-2023-902', title: 'Perimeter Ingress Mismatch', severity: 'HIGH', impact: 'Potential unauthorized access to subnet 10.0.4.x via legacy VPN endpoint.', remediated: true },
                   { id: 'ADT-2024-011', title: 'Asymmetric Key Length Insufficiency', severity: 'MEDIUM', impact: 'Legacy backup controllers using 1024-bit RSA keys. Minimum required: 2048-bit.', remediated: false },
                 ].map((find, i) => (
                   <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase">FINDING ID: {find.id}</p>
                            <h4 className="text-sm font-black text-[#091426] uppercase">{find.title}</h4>
                         </div>
                         <span className={`px-3 py-1 rounded text-[9px] font-black uppercase text-white ${
                            find.severity === 'HIGH' ? 'bg-red-600' : 'bg-amber-500'
                         }`}>{find.severity}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{find.impact}</p>
                      <div className="pt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className="flex items-center gap-2 text-slate-400">
                            Status: <span className={find.remediated ? 'text-emerald-600' : 'text-amber-600'}>{find.remediated ? 'RESOLVED' : 'PENDING'}</span>
                         </span>
                         {find.remediated && <span className="text-blue-600 flex items-center gap-2 underline cursor-pointer">View Remediation Artifact <ExternalLink size={10} /></span>}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Digital Authorization */}
           <div className="py-16 mt-16 border-t border-slate-100 flex justify-between items-end relative z-10">
              <div className="space-y-10">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
                    <div className="h-16 flex items-center">
                       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpY0S_M5q0oW9qK1eB0A_6d7vWdZ5f0A1vD3o6S1C" alt="Signature Placeholder" className="h-12 opacity-80" />
                    </div>
                    <p className="text-sm font-black text-[#091426] uppercase">Dr. Stefan Chen, Chief Compliance Officer</p>
                 </div>
                 <div className="flex gap-10">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Verify Ledger</p>
                       <p className="text-[10px] font-mono text-slate-400 uppercase">0x8F2...C91E / BLOCK: 442,102</p>
                    </div>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-6">
                 <div className="w-32 h-32 border-4 border-slate-100 rounded-full flex items-center justify-center relative scale-110">
                    <Stamp size={80} className="text-slate-100 -rotate-12" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#091426]/20">
                       <span className="text-[8px] font-black tracking-widest rotate-[-15deg] uppercase">AuditMaster</span>
                       <span className="text-[12px] font-black rotate-[-15deg] mt-1">CERTIFIED</span>
                    </div>
                 </div>
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] text-right">Page 1 of 42 // Final_Release_Build_2024</p>
              </div>
           </div>

        </div>

        {/* Audit Metadata Footer */}
        <div className="py-10 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex justify-between items-center italic">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-blue-600" />
                 <span>Cryptographically Signed Paperless Artifact</span>
              </div>
              <div className="h-4 w-px bg-slate-300" />
              <span>Retention Policy: 7 Years / Archival Node: Houston-7</span>
           </div>
           <p>ISO/IEC 27001 COMPLIANT DOC REF: AM-DCP-01-Q2-24</p>
        </div>
      </div>
    </div>
  );
};

export default FinalReportPreview;
