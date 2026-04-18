import React from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  PieChart, 
  Calendar, 
  Search as SearchIcon, 
  Filter, 
  MoreHorizontal, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Wallet,
  Building2,
  FileText
} from 'lucide-react';

const BudgetAnalysis: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Financial Control
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                Ledger Sync: active
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase">Cost & Budget Management</h1>
            <p className="text-slate-500 max-w-2xl mt-2 text-sm leading-relaxed font-medium">
              Global fiscal oversight and real-time expense reconciliation. Securely integrated with decentralized ledger for bit-perfect financial auditability.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                {['Overview', 'Expense Reports', 'Allocation'].map((tab, i) => (
                    <button key={i} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                        i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'
                    }`}>
                        {tab}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Financial Summary Row */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Budget Allocated', value: '$2,450,000.00', trend: '+4.2%', sub: 'from last FY', color: 'blue' },
            { label: 'Total Actual Spend', value: '$1,892,443.12', progress: 77, color: 'blue' },
            { label: 'Vendor Fees (YTD)', value: '$412,000.00', sub: '18 Active Contracts', color: 'slate' },
            { label: 'Travel & Expenses', value: '$128,550.45', alert: 'Threshold Reach', color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:border-blue-100 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">{stat.label}</span>
              <p className="text-2xl font-black text-[#091426] tracking-tight">{stat.value}</p>
              {stat.trend && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <TrendingUp size={10} /> {stat.trend}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.sub}</span>
                </div>
              )}
              {stat.progress && (
                <div className="mt-6">
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.progress}%` }} className="bg-blue-600 h-full" />
                  </div>
                </div>
              )}
              {stat.sub && !stat.trend && <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-widest">{stat.sub}</p>}
              {stat.alert && <p className="text-[9px] font-black text-red-600 mt-4 uppercase tracking-[0.1em]">{stat.alert}</p>}
            </div>
          ))}
        </div>

        {/* Chart & Breakdown Section */}
        <div className="grid grid-cols-12 gap-8">
          {/* Variance Chart */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Budget vs. Actual Variance</h3>
              <div className="flex gap-2">
                {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
                   <button key={i} className={`px-4 py-1.5 text-[10px] font-black rounded-lg border border-slate-100 ${
                       q === 'Q3' ? 'bg-[#091426] text-white' : 'bg-slate-50 text-slate-400'
                   }`}>{q}</button>
                ))}
              </div>
            </div>
            <div className="h-[340px] flex items-end justify-between gap-6 relative px-4">
               {/* Grid line placeholders */}
               <div className="absolute inset-x-0 top-0 bottom-10 flex flex-col justify-between opacity-5">
                  {[1, 2, 3, 4, 5].map(j => <div key={j} className="border-t border-[#091426] w-full" />)}
               </div>
               
               {[
                 { month: 'JUL', target: 60, actual: 55 },
                 { month: 'AUG', target: 75, actual: 70 },
                 { month: 'SEP', target: 85, actual: 90 },
                 { month: 'OCT', target: 70, actual: 68 },
                 { month: 'NOV', target: 80, actual: 75 },
                 { month: 'DEC', target: 95, actual: 80 },
               ].map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 relative z-10">
                    <div className="flex items-end gap-1.5 w-full h-64">
                       <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${m.target}%` }} 
                        className="flex-1 bg-slate-100 rounded-t-lg" 
                       />
                       <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${m.actual}%` }} 
                        className="flex-1 bg-blue-600 rounded-t-lg shadow-lg shadow-blue-100" 
                       />
                    </div>
                    <span className="text-[10px] font-mono font-black text-slate-400">{m.month}</span>
                  </div>
               ))}
               
               {/* Legend */}
               <div className="absolute top-0 left-4 flex gap-6">
                 <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 bg-slate-100 rounded-full" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Allocated</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-lg shadow-blue-100" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Actual</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Cost Allocation Breakdown */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex-1">
              <div className="flex justify-between items-start mb-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cost Breakdown</h4>
                <PieChart size={18} className="text-slate-300" />
              </div>
              <div className="space-y-6">
                 {[
                   { label: 'Internal Staff', value: '$845,000', progress: 45, color: 'bg-[#091426]' },
                   { label: 'Travel & Lodging', value: '$128,550', progress: 12, color: 'bg-blue-600' },
                   { label: 'Third-party Tools', value: '$506,893', progress: 28, color: 'bg-blue-400' },
                   { label: 'Vendor Consulting', value: '$412,000', progress: 15, color: 'bg-slate-300' },
                 ].map((item, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-500 uppercase tracking-tight">{item.label}</span>
                        <span className="text-[#091426] font-mono">{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress * 2}%` }} className={`${item.color} h-full`} />
                      </div>
                   </div>
                 ))}
              </div>
            </div>
            
            <div className={`bg-[#091426] text-white p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden flex items-center justify-between`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full" />
              <div className="relative z-10">
                <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Efficiency Metric</h4>
                <p className="text-3xl font-black tracking-tighter">92.4%</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Budget Accuracy</p>
              </div>
              <div className="w-16 h-16 rounded-2xl border border-slate-700 flex items-center justify-center relative z-10">
                <ShieldCheck size={32} className="text-blue-500" fill="currentColor" fillOpacity={0.1} />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Ledger Section */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/10">
              <div>
                <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Active Audit Ledger</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium italic">All figures in USD :: Live decentralized verification active</p>
              </div>
              <div className="flex gap-4">
                <div className="relative group">
                  <SearchIcon size={14} className="absolute left-4 top-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <input className="pl-10 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-100 transition-all outline-none" placeholder="Search entity..." />
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">
                  <Download size={14} /> Export CSV
                </button>
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-50">
                   <th className="px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Audit ID</th>
                   <th className="px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Entity / Region</th>
                   <th className="px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Projected Cost</th>
                   <th className="px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Actual To-Date</th>
                   <th className="px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Variance</th>
                   <th className="px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Status</th>
                   <th className="px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-widest text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 font-mono text-[11px]">
                 {[
                   { id: 'AU-2024-001', entity: 'Global HQ - London, UK', target: '$450,000.00', actual: '$422,110.00', var: '-6.2%', status: 'VERIFIED', color: 'emerald' },
                   { id: 'AU-2024-002', entity: 'APAC Data Center - SG', target: '$215,000.00', actual: '$232,000.00', var: '+7.9%', status: 'IN-PROGRESS', color: 'blue' },
                   { id: 'AU-2024-003', entity: 'South America Branch - BR', target: '$180,000.00', actual: '$178,500.00', var: '-0.8%', status: 'DRAFT', color: 'slate' },
                 ].map((row, i) => (
                   <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                     <td className="px-8 py-5 font-black text-slate-400 uppercase">{row.id}</td>
                     <td className="px-8 py-5 font-black text-[#091426] transition-colors group-hover:text-blue-600">{row.entity}</td>
                     <td className="px-8 py-5 text-slate-500">{row.target}</td>
                     <td className="px-8 py-5 font-black text-[#091426]">{row.actual}</td>
                     <td className={`px-8 py-5 font-black ${row.var.startsWith('+') ? 'text-red-500' : 'text-emerald-500'}`}>
                       {row.var}
                     </td>
                     <td className="px-8 py-5">
                       <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                         row.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                         row.status === 'IN-PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                         'bg-slate-50 text-slate-400 border-slate-100'
                       }`}>
                         {row.status}
                       </span>
                     </td>
                     <td className="px-8 py-5 text-right">
                       <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Review</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           <div className="p-8 bg-slate-50 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Showing 1 to 3 of 18 records</span>
              <div className="flex gap-2">
                <button className="p-2 border border-slate-100 rounded-lg bg-white"><ChevronLeft size={14} /></button>
                <button className="w-8 h-8 rounded-lg bg-[#091426] text-white">1</button>
                <button className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400">2</button>
                <button className="p-2 border border-slate-100 rounded-lg bg-white"><ChevronRight size={14} /></button>
              </div>
           </div>
        </div>

        {/* History Chronology Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
           <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
              <History size={20} className="text-[#091426]" /> 
              <h3 className="text-xl font-black text-[#091426] uppercase tracking-tight">Audit Spend Chronology</h3>
           </div>
           <div className="relative pl-6 space-y-12 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
             {[
               { time: '2024-10-24 14:22:01 UTC', tag: 'BUDGET_OVERRIDE', user: 'Admin_User_01', desc: 'Internal resource allocation adjusted for EMEA region audit.', meta: 'PREV_VALUE: $140,000 | NEW_VALUE: $165,000', color: 'blue' },
               { time: '2024-10-23 09:15:44 UTC', tag: 'INVOICE_PROCESSED', user: 'KPMG Consulting', desc: 'Third-party vendor fee ($12,400) approved and cleared.', color: 'slate' },
               { time: '2024-10-22 18:02:12 UTC', tag: 'SYSTEM_AUTO_LOG', user: 'Ledger Engine', desc: 'Automatic travel expense sync completed for 14 active auditors.', color: 'slate' },
             ].map((log, i) => (
               <div key={i} className="relative group">
                 <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-${log.color === 'blue' ? 'blue-600' : 'slate-200'} z-10`} />
                 <div className="flex items-center gap-4 mb-2">
                   <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                   <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-slate-100">{log.tag}</span>
                 </div>
                 <p className="text-sm font-black text-[#091426] uppercase tracking-tight leading-snug">
                   <span className="text-blue-600">{log.user}</span>: {log.desc}
                 </p>
                 {log.meta && (
                   <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                     {log.meta} <span className="text-blue-400 ml-4 font-black">SIGNATURE: 0x4f22...ea81</span>
                   </div>
                 )}
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalysis;
