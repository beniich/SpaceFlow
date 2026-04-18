import React from 'react';
import { motion } from 'motion/react';
import { 
  Network, 
  Search, 
  CheckCircle2, 
  Activity, 
  Lock, 
  RefreshCw, 
  AlertTriangle, 
  Download, 
  Bell, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Compass,
  Building2,
  MoreVertical,
  ShieldCheck as Verified,
  Globe,
  MapPin
} from 'lucide-react';

const EntityMapper: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Structural Mapping
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                GEMS Sync: Active
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase">Organizational Entity Mapper</h1>
            <p className="text-slate-500 max-w-2xl mt-2 text-sm leading-relaxed font-medium">
              Visualizing parent-child hierarchies across 42 global subsidiaries with real-time audit status and ownership verification.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Last Synced</span>
            <span className="font-mono text-sm font-bold text-[#091426]">2023-10-27 14:22:01 UTC</span>
          </div>
        </div>

        {/* Bento Dashboard Section */}
        <div className="grid grid-cols-12 gap-8">
          {/* Main Parent Card */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 p-8 rounded-2xl flex flex-col justify-between min-h-[220px] shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 font-mono text-[10px] font-black border border-blue-100 uppercase tracking-widest">
                  Ultimate Parent
                </span>
                <Verified className="text-blue-500" size={24} fill="currentColor" fillOpacity={0.1} />
              </div>
              <h3 className="text-2xl font-black text-[#091426] uppercase tracking-tight">AuditMaster Global Holdings</h3>
              <p className="font-mono text-[11px] text-slate-400 mt-2 uppercase tracking-wide">LEI: 549300V9876XYZ54321</p>
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jurisdiction</span>
              </div>
              <span className="text-sm font-bold text-[#091426] uppercase">Delaware, US</span>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
              <Building2 size={180} />
            </div>
          </div>

          {/* Metric Bento Items */}
          <div className="col-span-12 lg:col-span-2 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col justify-center items-center hover:border-blue-200 transition-colors">
            <span className="text-5xl font-black text-[#091426] mb-2 tracking-tighter">42</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center leading-tight">Active Entities</span>
          </div>
          
          <div className="col-span-12 lg:col-span-2 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col justify-center items-center hover:border-emerald-200 transition-colors">
            <span className="text-5xl font-black text-emerald-600 mb-2 tracking-tighter">38</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center leading-tight">Audits Verified</span>
          </div>

          {/* System Health / Abstract Card */}
          <div className="col-span-12 lg:col-span-4 bg-[#091426] p-8 rounded-2xl shadow-xl flex flex-col justify-between border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <span className="text-blue-400 font-mono text-[10px] font-bold tracking-[0.2em]">SYSTEM_HEALTH</span>
              <div className="flex gap-1.5 items-end">
                {[8, 12, 6, 10, 14, 8].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [8, h, 8] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                    className="w-1 bg-blue-500 rounded-full"
                    style={{ height: 12 }}
                  />
                ))}
              </div>
            </div>
            <div className="relative z-10 pt-8">
              <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
                Node-link diagram synchronized with Global Entity Management System (GEMS). All ownership percentages recalculated post-reorg.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
          </div>

          {/* Main Visualizer Container */}
          <div className="col-span-12 lg:col-span-9 bg-white border border-slate-200 rounded-3xl relative min-h-[640px] overflow-hidden shadow-sm group">
            {/* Visualizer Controls */}
            <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
              <button className="bg-white/80 backdrop-blur border border-slate-200 p-3 rounded-xl hover:bg-white shadow-xl hover:text-blue-600 transition-all">
                <Maximize2 size={18} />
              </button>
              <button className="bg-white/80 backdrop-blur border border-slate-200 p-3 rounded-xl hover:bg-white shadow-xl hover:text-blue-600 transition-all">
                <Compass size={18} />
              </button>
            </div>

            {/* Simulated Data Visualization Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
               <div className="w-full h-full bg-[radial-gradient(#e2e8f0_2px,transparent_2px)] [background-size:40px_40px]" />
               <svg className="absolute inset-0 w-full h-full">
                 <path d="M720,120 L300,320 M720,120 L720,320 M720,120 L1140,320" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                 <path d="M300,320 L200,520 M300,320 L400,520" stroke="#3b82f6" strokeWidth="1" fill="none" />
               </svg>
            </div>

            {/* Hierarchical Nodes */}
            <div className="absolute inset-0 p-12 flex flex-col items-center">
              {/* Root */}
              <div className="w-72 bg-white border-2 border-blue-600 p-5 rounded-xl shadow-2xl relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Primary Node</span>
                  <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">UID: 001-HQ</span>
                </div>
                <p className="text-sm font-black text-[#091426] uppercase mb-1">AuditMaster Global HQ</p>
                <div className="h-1 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-600 h-full w-[100%]" />
                </div>
              </div>

              {/* Children Tier */}
              <div className="flex w-full justify-between mt-40">
                {/* Child 1 */}
                <div className="w-64 bg-white border border-slate-200 p-5 rounded-xl shadow-lg hover:border-blue-600 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded text-[9px] font-black tracking-widest border border-emerald-100 uppercase">100% OWNED</span>
                    <CheckCircle2 size={16} className="text-emerald-500" fill="currentColor" fillOpacity={0.1} />
                  </div>
                  <p className="text-xs font-black text-[#091426] uppercase">AMG EMEA Ltd</p>
                  <p className="text-[10px] text-slate-400 font-mono font-bold mt-1 tracking-wider">UK | GB-987654</p>
                </div>

                {/* Child 2 */}
                <div className="w-64 bg-white border border-slate-200 p-5 rounded-xl shadow-lg hover:border-blue-600 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded text-[9px] font-black tracking-widest border border-amber-100 uppercase">75% OWNED</span>
                    <AlertTriangle size={16} className="text-amber-500" />
                  </div>
                  <p className="text-xs font-black text-[#091426] uppercase">AMG Asia-Pac Pte</p>
                  <p className="text-[10px] text-slate-400 font-mono font-bold mt-1 tracking-wider">SG | SGP-2012</p>
                </div>

                {/* Child 3 */}
                <div className="w-64 bg-white border border-slate-200 p-5 rounded-xl shadow-lg hover:border-blue-600 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded text-[9px] font-black tracking-widest border border-red-100 uppercase">Joint Venture</span>
                    <Lock size={16} className="text-red-500" />
                  </div>
                  <p className="text-xs font-black text-[#091426] uppercase">AMG Brasil Servicos</p>
                  <p className="text-[10px] text-slate-400 font-mono font-bold mt-1 tracking-wider">BR | CJ-12345</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Detailed View */}
          <div className="col-span-12 lg:col-span-3 space-y-8">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Entity Deep Dive</h4>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 block mb-1.5 uppercase tracking-widest">Selected Unit</span>
                  <span className="text-sm font-black text-[#091426] uppercase tracking-tight">AMG EMEA Ltd</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block mb-1 uppercase tracking-widest">Loal Auditor</span>
                    <span className="text-xs font-bold text-slate-700">PwC London</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block mb-1 uppercase tracking-widest">Status</span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Verified</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Progress</span>
                    <span className="text-[10px] font-mono font-black text-blue-600">92%</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100">
                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="bg-blue-600 h-full" />
                  </div>
                </div>
                <button className="w-full py-3 bg-[#091426] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
                  Launch Local Audit
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm overflow-hidden">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Verification Trail</h4>
              <div className="relative pl-6 space-y-8 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                {[
                  { user: 'E. THOMPSON', action: 'Ownership verified for EMEA.', time: '2H AGO', color: 'blue' },
                  { user: 'SYSTEM_SYNC', action: 'GEMS DB record updated.', time: 'OCT 26', color: 'slate' },
                  { user: 'LEGAL_DEPT', action: 'New AoA for Brasil JV.', time: 'OCT 24', color: 'slate' },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-${item.color === 'blue' ? 'blue-600' : 'slate-300'}`} />
                    <p className="text-[11px] font-medium text-slate-700 leading-snug">
                      <span className="font-black text-[#091426]">{item.user}</span> {item.action}
                    </p>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 block leading-none">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Ledger Table */}
          <div className="col-span-12">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div>
                  <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Regional Compliance Ledger</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Consolidated view of all registered sovereign entities.</p>
                </div>
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all">
                  Export Dataset (.CSV)
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="border-b border-slate-100 font-bold text-[10px] text-slate-400 uppercase tracking-[0.1em]">
                      <th className="px-8 py-5">Entity Detail</th>
                      <th className="px-8 py-5 text-right">Ownership</th>
                      <th className="px-8 py-5">Jurisdiction</th>
                      <th className="px-8 py-5">Tax Identifier</th>
                      <th className="px-8 py-5">Audit Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {[
                      { name: 'AMG EMEA Ltd', owner: '100.00%', juris: 'United Kingdom', tax: 'GB-987654321', status: 'VERIFIED', color: 'emerald' },
                      { name: 'AMG Asia-Pac Pte', owner: '75.00%', juris: 'Singapore', tax: 'SGP-20123456', status: 'IN PROGRESS', color: 'blue' },
                      { name: 'AMG Brasil Servicos', owner: '51.00%', juris: 'Brazil', tax: 'BR-123.456.78', status: 'ACTION REQ', color: 'red' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-5 text-xs font-black text-[#091426] uppercase tracking-tight">{row.name}</td>
                        <td className="px-8 py-5 text-right font-mono text-[11px] text-blue-600 font-black">{row.owner}</td>
                        <td className="px-8 py-5 text-xs text-slate-600 uppercase font-bold tracking-tighter">{row.juris}</td>
                        <td className="px-8 py-5 text-[11px] font-mono font-bold text-slate-400">{row.tax}</td>
                        <td className="px-8 py-5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-${row.color}-100 bg-${row.color}-50 text-${row.color}-700`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="text-slate-300 hover:text-blue-600 transition-colors">
                            <MoreVertical size={16} />
                          </button>
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
    </div>
  );
};

export default EntityMapper;
