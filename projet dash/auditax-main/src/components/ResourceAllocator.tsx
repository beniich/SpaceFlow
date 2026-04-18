import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Plane, 
  Calendar, 
  Search, 
  Bell, 
  History, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Filter, 
  MoreHorizontal,
  ChevronRight,
  Globe,
  Briefcase,
  ExternalLink,
  DollarSign,
  Info
} from 'lucide-react';

const ResourceAllocator: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Human Capital
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                Forensic Capacity v2.4
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase">Audit Resource Allocator</h1>
            <p className="text-slate-500 max-w-2xl mt-2 text-sm leading-relaxed font-medium">
              Optimize workload balancing across jurisdictions while tracking travel compliance and budget integrity for global auditor deployment.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-[11px] font-black text-[#091426] uppercase tracking-widest">Period: Q3 2024</span>
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-[#091426] rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
              <Filter size={14} /> Filter View
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Global Utilization', value: '84.2%', sub: 'Optimal Range', icon: <Users className="text-blue-600" size={20} />, status: 'OPTIMAL', statusColor: 'emerald' },
            { label: 'Available Buffer', value: '12', sub: 'Auditors off-project', icon: <Briefcase className="text-slate-400" size={20} />, status: 'READY', statusColor: 'blue' },
            { label: 'Travel Burn Rate', value: '$42.8k', sub: '+12% vs Forecast', icon: <DollarSign className="text-red-500" size={20} />, status: 'OVER_FC', statusColor: 'red' },
            { label: 'Visa Risk Level', value: 'High', sub: '4 Expired/Pending', icon: <AlertTriangle className="text-amber-500" size={20} />, status: 'ACTION_REQ', statusColor: 'amber' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-blue-100 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                {stat.icon}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-[#091426] tracking-tighter">{stat.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{stat.sub}</p>
                </div>
                <span className={`bg-${stat.statusColor}-50 text-${stat.statusColor}-700 border border-${stat.statusColor}-100 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase`}>
                  {stat.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Gantt / Scheduler Section */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[520px]">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <div className="w-80 border-r border-slate-100 p-5 flex items-center justify-between">
              <span className="text-[10px] font-black text-[#091426] uppercase tracking-widest">Auditor Registry</span>
              <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreHorizontal size={14} /></button>
            </div>
            <div className="flex-1 overflow-x-auto flex items-center font-mono text-[10px] font-black text-slate-400 divide-x divide-slate-100 uppercase tracking-widest">
              {['Jul 01', 'Jul 08', 'Jul 15', 'Jul 22', 'Jul 29', 'Aug 05', 'Aug 12', 'Aug 19'].map((date, i) => (
                <div key={i} className="min-w-[120px] text-center py-5">{date}</div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {[
              { name: 'Dr. Alisa Cheng', region: 'APAC / Senior', util: '80%', color: 'blue', project: 'Hong Kong Compliance Audit', duration: '250px', left: '50px' },
              { name: 'Marcus Thorne', region: 'EMEA / Lead', util: '110%', color: 'slate-900', project: 'London - ESG Framework', duration: '400px', left: '0px', alert: 'OVERLOAD' },
              { name: 'Elara Vance', region: 'AMER / Associate', util: '20%', color: 'blue-100', project: 'NY - Banking Logs', duration: '150px', left: '400px', visa: 'EXPIRED' },
              { name: 'Samir Khan', region: 'APAC / Staff', util: '95%', color: 'blue', project: 'Singapore - Crypto Asset Phase 2', duration: '600px', left: '100px' },
            ].map((auditor, i) => (
              <div key={i} className="flex group hover:bg-slate-50/50 transition-colors">
                <div className="w-80 border-r border-slate-50 p-5 flex items-center gap-4 bg-white group-hover:bg-slate-50/50">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-[#091426] uppercase tracking-tight">{auditor.name}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <Globe size={10} /> {auditor.region}
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${auditor.util === '110%' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {auditor.util}
                  </div>
                </div>
                <div className="flex-1 relative h-20 min-w-[960px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60">
                  <div 
                    className={`absolute top-6 h-8 rounded-lg shadow-sm px-4 flex items-center text-[9px] font-black uppercase tracking-widest text-white cursor-pointer group-hover:brightness-110 transition-all ${
                      auditor.color === 'blue' ? 'bg-blue-600' : auditor.color === 'blue-100' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-[#091426]'
                    }`}
                    style={{ left: auditor.left, width: auditor.duration }}
                  >
                    {auditor.project}
                    {auditor.alert && <span className="ml-auto text-red-400">●</span>}
                  </div>
                  {auditor.visa && (
                    <div className="absolute top-6 left-[560px] flex items-center gap-1 text-red-600 font-black text-[9px] uppercase tracking-widest">
                      <AlertTriangle size={12} /> Visa Expired (Brazil)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="h-10 bg-[#091426] text-white flex items-center justify-between px-8 text-[9px] font-mono font-bold uppercase tracking-[0.1em]">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Active Project</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Capacity Alert</div>
              <div className="h-4 w-px bg-slate-700 mx-2" />
              <span>System Ready: All logs synchronized</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Last Sync: 14:02:44 UTC</span>
              <span className="text-blue-400">v2.4.1-STABLE</span>
            </div>
          </div>
        </div>

        {/* Lower Grid: Budget & Logistics */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-2">
                <DollarSign size={18} className="text-blue-600" /> Regional Travel Expenditure
              </h3>
              <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">View Full Ledger</button>
            </div>
            <div className="space-y-8">
              {[
                { region: 'APAC', value: '$128,400', progress: 72, color: 'bg-blue-600' },
                { region: 'EMEA', value: '$82,150', progress: 45, color: 'bg-blue-400' },
                { region: 'AMER', value: '$164,000', progress: 94, color: 'bg-red-600', alert: true },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-[#091426] uppercase tracking-tight">{item.region}</span>
                    <span className={`font-mono text-xs font-black ${item.alert ? 'text-red-600' : 'text-[#091426]'}`}>{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className={`${item.color} h-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Warning Box */}
            <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                <Info size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-[#091426] uppercase tracking-tight">AMER Budget threshold exceeded</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
                  Audit density in NYC and São Paulo has triggered secondary reserve funding protocols. Approvals required for new flight bookings.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" /> Compliance Triggers
            </h3>
            <div className="space-y-6">
              {[
                { type: 'Visa Expiry Alert', time: '48H', desc: "Elara Vance's Work Visa (Brazil) expires in 48 hours. Project re-assignment req.", color: 'red' },
                { type: 'Policy Warning', time: 'LOW', desc: "3 Auditors exceeded 14 consecutive days of field work. Rest period approaching.", color: 'amber' },
                { type: 'Verification Log', time: 'OK', desc: "All APAC auditors have valid cryptographic travel clearance signatures.", color: 'emerald' },
              ].map((trigger, i) => (
                <div key={i} className={`p-4 border-l-4 border-${trigger.color}-500 bg-${trigger.color}-50 rounded-r-xl`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-black text-${trigger.color}-700 uppercase tracking-widest`}>{trigger.type}</span>
                    <span className={`font-mono text-[10px] font-black text-${trigger.color}-700`}>{trigger.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">{trigger.desc}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-3 bg-[#091426] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
              Trigger Contingency
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocator;
