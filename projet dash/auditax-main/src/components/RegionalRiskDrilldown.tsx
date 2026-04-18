import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  Plus, 
  Minus, 
  Locate, 
  ListFilter
} from 'lucide-react';

const RegionalRiskDrilldown: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default text-slate-900">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header & Breadcrumbs */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-8">
           <div>
              <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 gap-2 mb-3">
                 <span>Global Risk</span>
                 <ChevronRight size={14} />
                 <span className="text-blue-600">Jurisdictional View</span>
              </nav>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Western Europe Risk Heatmap</h1>
           </div>
           <div className="flex gap-4">
              <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                 <button className="px-5 py-2 text-[10px] uppercase font-bold tracking-widest bg-blue-600 text-white rounded shadow-sm">MAP VIEW</button>
                 <button className="px-5 py-2 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:bg-slate-50 transition-colors rounded">GRID VIEW</button>
              </div>
           </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
           
           {/* Map Drilldown Section */}
           <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden relative group shadow-sm h-[600px] flex flex-col">
              
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
                 <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-1.5 rounded-lg shadow-lg flex flex-col gap-1">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600 transition-colors"><Plus size={18} /></button>
                    <div className="h-px bg-slate-200 mx-1" />
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600 transition-colors"><Minus size={18} /></button>
                 </div>
                 <button className="bg-white/95 backdrop-blur-md border border-slate-200 w-11 h-11 rounded-lg shadow-lg flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors">
                    <Locate size={18} />
                 </button>
              </div>

              <div className="absolute bottom-6 right-6 z-10 bg-white/95 backdrop-blur-md border border-slate-200 p-5 rounded-xl shadow-lg">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 text-center border-b border-slate-100 pb-2">RISK LEVEL KEY</p>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                       <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                       <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">Med</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" />
                       <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm" />
                       <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">Critical</span>
                    </div>
                 </div>
              </div>

              {/* Map Canvas */}
              <div className="flex-1 bg-slate-50 relative overflow-hidden bg-[#0a192f]">
                 <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3VF3TfSwSvg5clsfM_ZPAzvsTfbgYNoX_qngzaX7LAY4eo0IEO8sXxjxfqIE6iiKbg8DjRIEfgUPrIafRyX6xnLF-cammUbr2ivu8I5H6oh7p_RX1F1Xj-fQae8Qn0LdHJ4XIDdFTZxwGK1pOuJKm8xgTyfVWj-lXg5pK9W5fT12QQR7zFJ-EIGKGFmnj1oQ_rk8x6Lg1KhlfU13oQ6kF22VkNIqV7nFyQte58cZOvV7qx4M-LJruwtVEVWHXdaty7HRhJOiONrQ" 
                    alt="Western Europe Map" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                 />
                 
                 {/* Interactive Markers */}
                 
                 {/* Frankfurt - Critical */}
                 <div className="absolute top-[40%] left-[45%] group/marker z-20">
                    <div className="relative flex items-center justify-center">
                       <div className="absolute w-16 h-16 bg-red-600/30 rounded-full animate-ping" />
                       <div className="w-5 h-5 bg-red-600 rounded-full border-[3px] border-white shadow-[0_0_15px_rgba(220,38,38,0.8)] cursor-pointer hover:scale-125 transition-transform" />
                       
                       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 opacity-0 group-hover/marker:opacity-100 transition-all pointer-events-none translate-y-2 group-hover/marker:translate-y-0">
                          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
                             <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-900">FRANKFURT DE-7</span>
                                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-mono font-bold tracking-widest shadow-sm">9.4 CRIT</span>
                             </div>
                             <div className="p-4 bg-white">
                                <p className="text-xs font-mono text-slate-600 leading-relaxed">Security breach in sector 4. Latency spikes detected.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Paris - Medium */}
                 <div className="absolute top-[55%] left-[38%] group/marker z-10">
                    <div className="relative flex items-center justify-center">
                       <div className="w-5 h-5 bg-amber-400 rounded-full border-[3px] border-white shadow-lg cursor-pointer hover:scale-125 transition-transform" />
                       
                       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 opacity-0 group-hover/marker:opacity-100 transition-all pointer-events-none translate-y-2 group-hover/marker:translate-y-0">
                          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
                             <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-900">PARIS FR-2</span>
                                <span className="bg-amber-400 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold tracking-widest shadow-sm">4.2 MED</span>
                             </div>
                             <div className="p-4 bg-white">
                                <p className="text-xs font-mono text-slate-600 leading-relaxed">Regulatory update pending. Minor compliance drift.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* London - Low */}
                 <div className="absolute top-[35%] left-[30%] group/marker z-10">
                    <div className="relative flex items-center justify-center">
                       <div className="w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white shadow-lg cursor-pointer hover:scale-125 transition-transform" />
                    </div>
                 </div>

                 {/* Madrid - High */}
                 <div className="absolute top-[75%] left-[20%] group/marker z-10">
                    <div className="relative flex items-center justify-center">
                       <div className="absolute w-12 h-12 bg-orange-500/20 rounded-full animate-pulse" />
                       <div className="w-5 h-5 bg-orange-500 rounded-full border-[3px] border-white shadow-[0_0_10px_rgba(249,115,22,0.6)] cursor-pointer hover:scale-125 transition-transform" />
                    </div>
                 </div>

              </div>
           </div>

           {/* Side Intelligence Panel */}
           <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              
              {/* Metrics Card */}
              <div className="bg-[#091426] text-white border border-slate-800 rounded-xl p-8 shadow-xl">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6">Active Jurisdiction Metrics</h3>
                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-mono text-slate-400 uppercase mb-2">Total Risk Score</p>
                          <p className="text-5xl font-black tracking-tighter">68.4 <span className="text-xl text-slate-500 font-medium">/ 100</span></p>
                       </div>
                       <div className="w-20 h-20 rounded-full border-[6px] border-slate-800 flex items-center justify-center" style={{ borderTopColor: '#fbbf24', borderRightColor: '#fbbf24' }}>
                          <span className="text-sm font-mono font-bold text-amber-400">68%</span>
                       </div>
                    </div>
                    
                    <div className="h-px bg-slate-800" />
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Operational</p>
                          <p className="text-3xl font-black text-emerald-400">82%</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Compliance</p>
                          <p className="text-3xl font-black text-red-500">34%</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Regional Breakdown */}
              <div className="bg-white border border-slate-200 rounded-xl flex flex-col flex-1 shadow-sm overflow-hidden h-full max-h-[300px]">
                 <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">City-Level Breakdown</h3>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors"><ListFilter size={18} /></button>
                 </div>
                 <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 backdrop-blur-md bg-slate-50/90 z-10">
                          <tr>
                             <th className="px-6 py-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">City</th>
                             <th className="px-6 py-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Nodes</th>
                             <th className="px-6 py-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Risk</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 font-mono text-sm text-slate-700">
                          <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                             <td className="px-6 py-3.5 group-hover:text-blue-600 font-bold">London, UK</td>
                             <td className="px-6 py-3.5">42</td>
                             <td className="px-6 py-3.5">
                                <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-100 w-16">2.1 LOW</span>
                             </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                             <td className="px-6 py-3.5 group-hover:text-blue-600 font-bold">Berlin, DE</td>
                             <td className="px-6 py-3.5">18</td>
                             <td className="px-6 py-3.5">
                                <span className="inline-flex items-center justify-center bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-100 w-16">5.4 MED</span>
                             </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                             <td className="px-6 py-3.5 group-hover:text-blue-600 font-bold">Zurich, CH</td>
                             <td className="px-6 py-3.5">12</td>
                             <td className="px-6 py-3.5">
                                <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-100 w-16">1.8 LOW</span>
                             </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                             <td className="px-6 py-3.5 group-hover:text-blue-600 font-bold">Paris, FR</td>
                             <td className="px-6 py-3.5">31</td>
                             <td className="px-6 py-3.5">
                                <span className="inline-flex items-center justify-center bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-100 w-16">4.2 MED</span>
                             </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                             <td className="px-6 py-3.5 group-hover:text-blue-600 font-bold">Madrid, ES</td>
                             <td className="px-6 py-3.5">22</td>
                             <td className="px-6 py-3.5">
                                <span className="inline-flex items-center justify-center bg-orange-50 text-orange-700 text-[10px] px-2 py-0.5 rounded font-bold border border-orange-100 w-16">6.9 HIGH</span>
                             </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                             <td className="px-6 py-3.5 group-hover:text-blue-600 font-bold">Brussels, BE</td>
                             <td className="px-6 py-3.5">09</td>
                             <td className="px-6 py-3.5">
                                <span className="inline-flex items-center justify-center bg-red-50 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold border border-red-100 w-16">8.1 CRIT</span>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
                 <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <button className="w-full py-2.5 bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-100 transition-all rounded shadow-sm">DOWNLOAD REPORT</button>
                 </div>
              </div>

           </div>

           {/* Bottom Insight Panel - Timeline */}
           <div className="col-span-12 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Regional Risk Audit Trail</h3>
                 <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest">Live Monitoring Active</span>
                 </div>
              </div>
              
              <div className="relative pl-3 space-y-8 before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                 
                 <div className="relative flex gap-6 group">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-600 border-[3px] border-white shadow-sm z-10 absolute -left-[7px] top-1 group-hover:scale-125 transition-transform" />
                    <div className="flex-grow pl-6">
                       <div className="flex justify-between items-start mb-2">
                          <p className="font-mono text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">Critical Breach Detected - Frankfurt Node DE-7</p>
                          <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">14:22:01 UTC</span>
                       </div>
                       <p className="text-xs font-mono text-slate-600 leading-relaxed max-w-4xl bg-red-50/50 p-3 rounded-lg border border-red-100/50">
                          Unauthorized access attempt flagged by biometric firewall. Jurisdictional risk score adjusted +4.2 points.
                       </p>
                    </div>
                 </div>

                 <div className="relative flex gap-6 group opacity-70 hover:opacity-100 transition-opacity">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-[3px] border-white shadow-sm z-10 absolute -left-[7px] top-1 group-hover:scale-125 transition-transform" />
                    <div className="flex-grow pl-6">
                       <div className="flex justify-between items-start mb-2">
                          <p className="font-mono text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Compliance Scan Completed - Paris Sector FR-2</p>
                          <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">13:10:45 UTC</span>
                       </div>
                       <p className="text-xs font-mono text-slate-600 leading-relaxed max-w-4xl bg-slate-50 p-3 rounded-lg border border-slate-100">
                          Scheduled GDPR alignment check performed. 98.4% consistency recorded.
                       </p>
                    </div>
                 </div>

                 <div className="relative flex gap-6 group opacity-70 hover:opacity-100 transition-opacity">
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border-[3px] border-white shadow-sm z-10 absolute -left-[7px] top-1 group-hover:scale-125 transition-transform" />
                    <div className="flex-grow pl-6">
                       <div className="flex justify-between items-start mb-2">
                          <p className="font-mono text-sm font-bold text-slate-900 group-hover:text-amber-500 transition-colors">Regulatory Alert - London Region UK-0</p>
                          <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">11:05:12 UTC</span>
                       </div>
                       <p className="text-xs font-mono text-slate-600 leading-relaxed max-w-4xl bg-slate-50 p-3 rounded-lg border border-slate-100">
                          New legislative amendment proposed for data residency. Potential impact: Medium.
                       </p>
                    </div>
                 </div>

              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default RegionalRiskDrilldown;
