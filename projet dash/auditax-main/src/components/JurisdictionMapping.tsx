import React from 'react';
import { motion } from 'motion/react';
import { 
  Gavel, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MoreHorizontal, 
  Download, 
  Filter, 
  ChevronRight, 
  Globe, 
  Lock, 
  Scale, 
  BookOpen, 
  CheckCircle, 
  Info,
  ArrowRight,
  TrendingUp,
  History
} from 'lucide-react';

const JurisdictionMapping: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header & Filter Bar */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-slate-900 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Legal Core
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                Regulatory Engine v4.2
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase">Legal & Jurisdictional Mapping</h1>
            <p className="text-slate-500 max-w-2xl mt-2 text-sm leading-relaxed font-medium">
              Cross-reference internal controls against global regulatory frameworks and regional statutes. Securely anchored to the Event Store.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="w-56">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">Jurisdiction Scope</label>
              <div className="relative">
                <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-[#091426] appearance-none focus:ring-2 focus:ring-blue-600/20 outline-none">
                  <option>All Regions (Global)</option>
                  <option>North America (CCPA/NYDFS)</option>
                  <option>European Union (GDPR/DORA)</option>
                </select>
                <ChevronRight size={14} className="absolute right-3 top-2.5 text-slate-400 rotate-90" />
              </div>
            </div>
            <div className="w-56">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">Framework Basis</label>
              <div className="relative">
                <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-[#091426] appearance-none focus:ring-2 focus:ring-blue-600/20 outline-none">
                  <option>Combined View</option>
                  <option>GDPR Article 32</option>
                  <option>ISO 27001:2022</option>
                </select>
                <ChevronRight size={14} className="absolute right-3 top-2.5 text-slate-400 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Section */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Compliance Matrix Table */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-[#091426] uppercase tracking-tight">Global Compliance Matrix</h3>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 font-black text-[9px] uppercase tracking-widest">
                <ShieldCheck size={12} fill="currentColor" fillOpacity={0.1} /> Verified 24h ago
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] border-b border-slate-50">
                    <th className="py-4 font-normal">Control ID</th>
                    <th className="py-4 font-normal">Internal Control Name</th>
                    <th className="py-4 font-normal text-center">GDPR</th>
                    <th className="py-4 font-normal text-center">CCPA</th>
                    <th className="py-4 font-normal text-center">BASEL III</th>
                    <th className="py-4 font-normal text-center">SOC2</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  {[
                    { id: 'CTRL-882', name: 'Data Encryption at Rest (AES-256)', gdpr: true, ccpa: true, basel: 'pending', soc2: true },
                    { id: 'CTRL-104', name: 'Identity Access Management (IAM)', gdpr: true, ccpa: false, basel: true, soc2: true },
                    { id: 'CTRL-921', name: 'Cross-Border Data Transfer Logs', gdpr: false, ccpa: 'none', basel: 'none', soc2: true },
                    { id: 'CTRL-443', name: 'Automated Audit Log Rotation', gdpr: true, ccpa: true, basel: true, soc2: true },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 border-b border-slate-50 text-blue-600 font-black">{row.id}</td>
                      <td className="py-5 border-b border-slate-50 text-[#091426] font-bold uppercase tracking-tighter text-[10px]">{row.name}</td>
                      <td className="py-5 border-b border-slate-50 text-center">
                        {row.gdpr === true ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <XCircle size={16} className="text-red-500 mx-auto" />}
                      </td>
                      <td className="py-5 border-b border-slate-50 text-center">
                        {row.ccpa === true ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : 
                         row.ccpa === false ? <XCircle size={16} className="text-red-500 mx-auto" /> : 
                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mx-auto" />}
                      </td>
                      <td className="py-5 border-b border-slate-50 text-center">
                        {row.basel === true ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : 
                         row.basel === 'pending' ? <History size={16} className="text-amber-500 mx-auto" /> : 
                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mx-auto" />}
                      </td>
                      <td className="py-5 border-b border-slate-50 text-center">
                        {row.soc2 === true ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <XCircle size={16} className="text-red-500 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar - Analytics & Logs */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Risk Exposure Breakdown */}
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Risk Exposure by Jurisdiction</h4>
              <div className="space-y-8">
                {[
                  { region: 'European Union (GDPR)', value: 92, color: 'bg-blue-600', textColor: 'text-blue-600' },
                  { region: 'United States (CCPA/SEC)', value: 64, color: 'bg-amber-500', textColor: 'text-amber-600' },
                  { region: 'Switzerland (FINMA)', value: 100, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2.5">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-[#091426] uppercase tracking-tight">{item.region}</span>
                      <span className={`font-mono text-xs font-black ${item.textColor}`}>{item.value}% COMPLIANT</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={`${item.color} h-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Change History Card */}
            <div className="bg-[#091426] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full" />
               <div>
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <History size={14} /> Recent Mapping Updates
                  </h4>
                  <div className="relative pl-6 space-y-8 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                    {[
                      { time: '14:02:11 TODAY', user: 'J. MILLER', desc: 'Updated GDPR Art. 32 mapping for CTRL-882.', color: 'bg-blue-600 shadow-blue-500/50' },
                      { time: 'YESTERDAY', user: 'SYS_ENGINE', desc: 'Basel III Pillar 2 requirements refreshed via API.', color: 'bg-slate-700' },
                      { time: 'OCT 18', user: 'LEGAL_DESK', desc: 'New jurisdiction added: India (DPDP Act).', color: 'bg-slate-700' },
                    ].map((log, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-[#091426] border-2 border-current flex items-center justify-center ${log.color.includes('blue') ? 'text-blue-600' : 'text-slate-600'}`}>
                          <div className={`w-1 h-1 rounded-full ${log.color.split(' ')[0]}`} />
                        </div>
                        <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">{log.time}</p>
                        <p className="text-xs font-bold text-slate-100 leading-snug">
                          <span className="text-blue-400">{log.user}: </span> {log.desc}
                        </p>
                      </div>
                    ))}
                  </div>
               </div>
               <button className="mt-10 w-full py-3 bg-white/5 text-white/40 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Load Audit Ledger
               </button>
            </div>
          </div>
        </div>

        {/* Legal Framework Cards Section */}
        <div className="grid grid-cols-3 gap-8">
          {[
            { tag: 'Framework', title: 'EU General Data Protection Regulation', desc: 'Article-by-article cross-mapping against NIST 800-53 and internal data privacy controls.', icon: <Scale size={24} /> },
            { tag: 'Global', title: 'Basel III Capital Accords', desc: 'Risk-weighted asset calculations and reporting requirements mapped to global treasury ops.', icon: <Globe size={24} /> },
            { tag: 'Regional', title: 'California Consumer Privacy Act', desc: 'State-specific data residency and consumer right-to-forget mapping for North American nodes.', icon: <BookOpen size={24} /> },
          ].map((card, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm group hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-blue-50 text-blue-700 font-black text-[9px] uppercase tracking-widest border border-blue-100 px-3 py-1 rounded-full">
                    {card.tag}
                  </span>
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                    {card.icon}
                  </div>
                </div>
                <h5 className="text-lg font-black text-[#091426] uppercase tracking-tight leading-6 mb-3">{card.title}</h5>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{card.desc}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                  View Cross-Reference <ArrowRight size={14} />
                </span>
                <Info size={14} className="text-slate-200 group-hover:text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Attestation */}
      <footer className="fixed bottom-0 right-0 p-8">
        <div className="bg-white/80 backdrop-blur border border-white/40 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200" />
            <span className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em]">Legal Engine Operational</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <p className="text-[9px] font-mono font-bold text-slate-400 tracking-tighter uppercase whitespace-nowrap">Node 0x82 :: SHA-256 Verified</p>
        </div>
      </footer>
    </div>
  );
};

export default JurisdictionMapping;
