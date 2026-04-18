import React from 'react';
import { motion } from 'motion/react';
import { 
  Library, 
  Search, 
  Folder, 
  FolderOpen, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Download, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  Activity, 
  History, 
  ExternalLink,
  Gavel,
  Lock,
  Zap,
  HardDrive
} from 'lucide-react';

const PolicyLibrary: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fbff] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Global Repository v5.1
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 <ShieldCheck size={10} className="fill-current" /> CRYPTO-ANCHORED
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Global Policy Library</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Central repository for all organizational policies linked directly to cryptographic audit controls and compliance milestones across global hubs.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#091426] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all">
              <Filter size={14} /> Refine Library
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#091426] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all">
              <Download size={14} /> Export Archive
            </button>
          </div>
        </div>

        {/* High-Level Search */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
          <input 
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-8 pl-16 pr-8 text-lg font-bold text-[#091426] placeholder:text-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm outline-none" 
            placeholder="High-speed search across policy documents, mandates, and control links..." 
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-4 items-center">
             <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest">Type to fuzzy search_</span>
             <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-black text-slate-400">ESC</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Sidebar: Hierarchy & Health */}
          <div className="col-span-3 space-y-8">
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center justify-between">
                Policy Hierarchies <HardDrive size={12} />
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Financial Controls', count: 12, icon: <Folder /> },
                  { label: 'IT & Cybersecurity', count: 8, icon: <FolderOpen />, active: true, children: ['Network Security', 'Data Privacy', 'Access Governance'] },
                  { label: 'Ethics & Conduct', count: 5, icon: <Folder /> },
                ].map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                      cat.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'hover:bg-slate-50 text-[#091426]'
                    }`}>
                      <div className="flex items-center gap-3">
                        {React.cloneElement(cat.icon as React.ReactElement, { size: 16 })}
                        <span className="text-xs font-black uppercase tracking-tight">{cat.label}</span>
                      </div>
                      <span className={`font-mono text-[10px] font-black ${cat.active ? 'text-blue-200' : 'text-slate-300'}`}>{cat.count}</span>
                    </div>
                    {cat.active && cat.children && (
                      <div className="ml-8 border-l border-blue-100 py-1 space-y-1">
                        {cat.children.map((child, ci) => (
                          <div key={ci} className={`px-5 py-2 text-[11px] font-bold uppercase tracking-tight cursor-pointer transition-colors ${
                             child === 'Access Governance' ? 'text-blue-600 border-l-2 border-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-blue-400'
                          }`}>
                            {child}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-8">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Library Health</h3>
               {[
                 { label: 'Read Compliance', val: 94, color: 'emerald' },
                 { label: 'Pending Approvals', val: 15, color: 'blue' },
               ].map((stat, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-500">{stat.label}</span>
                       <span className={`text-${stat.color}-600`}>{stat.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: stat.val + '%' }} className={`h-full bg-${stat.color === 'emerald' ? 'emerald-500' : 'blue-600'}`} />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9 space-y-8">
            
            {/* Pinned / Spotlight */}
            <div className="grid grid-cols-2 gap-8">
               {[
                 { id: 'DOC-IT-8821', title: 'IT Access Control Framework', desc: 'Governance protocols for privileged access and MFA enforcement across global cloud infrastructure.', ver: 'v5.1.0', status: 'VERIFIED', color: 'emerald' },
                 { id: 'DOC-IT-9102', title: 'Shadow Data Lifecycle', desc: 'Policy for handling unstructured data fossils and temporary forensic snapshots.', ver: 'v3.0.4', status: 'IN REVIEW', color: 'blue' },
               ].map((item, i) => (
                 <div key={i} className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full opacity-50 group-hover:bg-blue-50 transition-colors" />
                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           <span className={`text-[8px] font-black px-2 py-1 rounded border uppercase tracking-widest ${
                             item.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                           }`}>{item.status}</span>
                           <span className="text-[10px] font-mono font-black text-slate-300">{item.ver}</span>
                        </div>
                        <span className="text-[9px] font-mono font-black text-slate-200 uppercase tracking-widest group-hover:text-blue-200 transition-colors">{item.id}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-[#091426] uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors leading-tight">{item.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                         <div className="flex -space-x-2">
                           {[1, 2, 3].map(v => (
                             <div key={v} className="w-7 h-7 bg-slate-100 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">H</div>
                           ))}
                         </div>
                         <button className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-transform">
                            Open Protocol <ChevronRight size={14} />
                         </button>
                      </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Policy Index Table */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
               <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-2">
                    <BookOpen size={16} /> Central Policy Index
                  </h3>
                  <div className="flex gap-8">
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active (242)</span></div>
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Draft (46)</span></div>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                         <th className="px-10 py-5">Document Title</th>
                         <th className="px-10 py-5">Audit Control Link</th>
                         <th className="px-10 py-5 text-center">Version</th>
                         <th className="px-10 py-5">Read Integrity</th>
                         <th className="px-10 py-5 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { title: 'Privileged Admin Policy', id: 'DOC-IT-8821', control: 'ISO-27001-A.9.4', ver: 'v5.1.0', integrity: 100, color: 'emerald' },
                         { title: 'Remote Access Standard', id: 'DOC-IT-8840', control: 'NIST-SP-800-AC-17', ver: 'v2.4.1', integrity: 82, color: 'blue' },
                         { title: 'Cryptographic Key Policy', id: 'DOC-IT-9102', control: 'FIPS-140-2', ver: 'v1.2.0', integrity: 98, color: 'emerald' },
                         { title: 'Third-Party Onboarding', id: 'DOC-VND-001', control: 'SOC2-CC2.1', ver: 'v3.0.0', integrity: 45, color: 'amber' },
                       ].map((policy, i) => (
                         <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <FileText size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                 <div>
                                    <p className="text-sm font-black text-[#091426] uppercase tracking-tight">{policy.title}</p>
                                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{policy.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                 {policy.control}
                              </span>
                           </td>
                           <td className="px-10 py-6 text-center">
                              <span className="text-xs font-mono font-bold text-slate-500 tracking-tighter">{policy.ver}</span>
                           </td>
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <span className={`text-[11px] font-black ${policy.integrity === 100 ? 'text-emerald-600' : 'text-[#091426]'}`}>{policy.integrity}%</span>
                                 <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full bg-${policy.color === 'emerald' ? 'emerald-500' : policy.color === 'blue' ? 'blue-600' : 'amber-500'}`} style={{ width: policy.integrity + '%' }} />
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <button className="text-slate-300 hover:text-[#091426] transition-colors"><MoreVertical size={16} /></button>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
               <div className="px-10 py-6 bg-slate-50/50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Showing 4 of 288 Global Policies</span>
                  <div className="flex gap-4">
                     <button className="hover:text-blue-600 transition-colors">Prev Session</button>
                     <div className="flex gap-2">
                        <span className="text-blue-600">01</span>
                        <span>02</span>
                        <span>03</span>
                     </div>
                     <button className="hover:text-blue-600 transition-colors">Next Session</button>
                  </div>
               </div>
            </div>

            {/* Audit Trail Bento Section */}
            <div className="grid grid-cols-12 gap-8">
               <div className="col-span-8 bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Cryptographic Audit Trail</h3>
                    <div className="flex items-center gap-2 font-mono text-[9px] font-black text-slate-300">
                       <History size={12} /> LAST_SYNC: 14:02 UTC
                    </div>
                  </div>
                  <div className="space-y-8 relative pl-8 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-slate-50">
                     {[
                       { date: 'MAY 24, 14:10', activity: 'Policy Update Published', desc: 'DOC-IT-8821 version v5.1.0 promoted to Active. Ledger hash anchored.', hash: '0x88f...2e11', user: 'Sarah Chen' },
                       { date: 'MAY 24, 09:30', activity: 'Workflow Approval: Legal', desc: 'Legal department approved revision v5.1.0 with zero findings.', user: 'System-Auto' },
                       { date: 'MAY 23, 16:45', activity: 'Draft Revision Created', desc: 'Initial v5.1.0 protocol initialized with AI-assisted control mapping.', user: 'Sarah Chen' },
                     ].map((log, i) => (
                       <div key={i} className="relative">
                          <div className={`absolute -left-[32px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-${i === 0 ? 'blue-600' : 'slate-300'} z-10`} />
                          <div className="flex flex-col gap-2">
                             <div className="flex justify-between">
                                <span className="text-[10px] font-mono font-black text-slate-300 uppercase">{log.date}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{log.user}</span>
                             </div>
                             <h5 className="text-xs font-black text-[#091426] uppercase tracking-tight leading-none">{log.activity}</h5>
                             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{log.desc}</p>
                             {log.hash && <span className="text-[9px] font-mono font-black text-blue-500 uppercase">Hash: {log.hash}</span>}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="col-span-4 bg-[#091426] rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />
                  <div className="relative z-10 flex flex-col h-full">
                     <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-10">Read Acknowledgement</h3>
                     <div className="flex-1 space-y-2">
                        <div className="text-5xl font-black tracking-tighter mb-4">2,481</div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-10">Pending 'Read & Understood' confirmations across global departments.</p>
                     </div>
                     <div className="space-y-4">
                        <button className="w-full bg-white text-[#091426] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-blue-950">
                           Send Bulk Reminders
                        </button>
                        <button className="w-full bg-white/5 border border-white/10 text-slate-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                           View Deficit Report
                        </button>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyLibrary;
