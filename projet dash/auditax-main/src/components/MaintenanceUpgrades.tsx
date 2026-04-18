import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as Schedule, 
  ShieldCheck as Verified, 
  Gauge as Speed, 
  Hammer as Build, 
  RefreshCw as Update,
  Terminal,
  ArrowRight as ArrowForward
} from 'lucide-react';

const MaintenanceUpgrades: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default text-slate-900">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-8">
           <div>
              <div className="flex items-center gap-3 mb-3">
                 <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-widest">System Stable</span>
                 <span className="text-slate-400 font-mono text-[10px] font-bold">v4.22.0-LTS</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">System Maintenance & Upgrade</h1>
              <p className="text-slate-500 font-medium">Manage core kernel versioning, scheduled downtime, and infrastructure integrity.</p>
           </div>
           <div className="flex gap-4">
              <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 rounded transition-all shadow-sm">
                 Run Diagnostics
              </button>
              <button className="px-5 py-2.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 rounded transition-all flex items-center gap-2 shadow-sm shadow-blue-600/20">
                 <Schedule size={16} /> Schedule Downtime
              </button>
           </div>
        </div>

        {/* Dashboard Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
           
           {/* Kernel Health Card */}
           <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AuditMaster Kernel Status</h3>
                 <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded">UPTIME: 142d 12h 04m</span>
              </div>
              <div className="grid grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Active Version</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">4.22.0<span className="text-lg opacity-50">-LTS</span></p>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                       <Verified size={14} className="fill-emerald-100" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Hash Verified</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Memory Utilization</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">42.8<span className="text-lg opacity-50">%</span></p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                       <div className="bg-blue-600 h-full w-[42.8%]" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">I/O Performance</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">Optimal</p>
                    <div className="flex items-center gap-1.5 text-slate-500">
                       <Speed size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">1.2ms Latency</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Next Scheduled Maintenance */}
           <div className="col-span-12 lg:col-span-4 bg-[#091426] text-white rounded-xl p-8 relative overflow-hidden shadow-xl shadow-slate-300 flex flex-col justify-between border border-slate-900">
              <div className="relative z-10">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6">Upcoming Window</h3>
                 <div className="space-y-6">
                    <div>
                       <p className="text-3xl font-black tracking-tight mb-1">Oct 24, 2023</p>
                       <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">02:00 AM - 04:00 AM EST</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                       <Build size={18} className="text-blue-400" />
                       <p className="text-[11px] font-mono font-bold tracking-tight text-white">Kernel Patch: Security Update KB-9021</p>
                    </div>
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5">
                 <Update size={180} />
              </div>
           </div>

           {/* Historical Patch Log */}
           <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Historical Patch Logs</h3>
                 <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline">Export Full CSV</button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="px-6 py-4">Version</th>
                          <th className="px-6 py-4">Deployment Date</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4 text-right">Integrity</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                       <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                          <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">v4.21.9</td>
                          <td className="px-6 py-4 text-slate-500">2023-09-12 14:00</td>
                          <td className="px-6 py-4">
                             <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">STABILITY</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                <Verified size={12} className="fill-emerald-200" /> 0x3F2A...
                             </div>
                          </td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                          <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">v4.21.8</td>
                          <td className="px-6 py-4 text-slate-500">2023-08-25 01:20</td>
                          <td className="px-6 py-4">
                             <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest">SECURITY</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                <Verified size={12} className="fill-emerald-200" /> 0x9B11...
                             </div>
                          </td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                          <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">v4.21.0</td>
                          <td className="px-6 py-4 text-slate-500">2023-07-01 00:00</td>
                          <td className="px-6 py-4">
                             <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest">MINOR</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                <Verified size={12} className="fill-emerald-200" /> 0xEE04...
                             </div>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Audit Trail Sidebar */}
           <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8 border-b border-slate-100 pb-4">Recent Admin Actions</h3>
              <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[5px] before:w-[2px] before:bg-slate-100">
                 
                 <div className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">Downtime Scheduled</p>
                          <p className="text-[10px] font-mono font-bold text-slate-400">Admin: john.doe@auditmaster.io</p>
                       </div>
                       <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">14m ago</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[10px] font-bold text-slate-600 leading-relaxed shadow-sm">
                       Target: US-EAST-1 Cluster
                       <br/>Window: 2023-10-24T02:00:00Z
                    </div>
                 </div>

                 <div className="relative opacity-60 hover:opacity-100 transition-opacity">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white shadow-sm" />
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">Diagnostic Report Generated</p>
                          <p className="text-[10px] font-mono font-bold text-slate-400">System: Auto-Health Monitor</p>
                       </div>
                       <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">2h ago</span>
                    </div>
                 </div>

                 <div className="relative opacity-60 hover:opacity-100 transition-opacity">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white shadow-sm" />
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">Kernel Config Update</p>
                          <p className="text-[10px] font-mono font-bold text-slate-400">Admin: sarah.smith@auditmaster.io</p>
                       </div>
                       <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">5h ago</span>
                    </div>
                 </div>

              </div>
           </div>

           {/* Infrastructure Map/Visual */}
           <div className="col-span-12 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row h-80">
              <div className="flex-1 p-8 space-y-8 flex flex-col justify-center">
                 <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Global Distribution</h3>
                    <p className="text-slate-900 font-bold text-xl tracking-tight">Active Kernel Instances Across Regions</p>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="border-l-4 border-emerald-500 pl-4">
                       <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">24</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Running Healthy</p>
                    </div>
                    <div className="border-l-4 border-amber-400 pl-4">
                       <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">02</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">In Migration</p>
                    </div>
                 </div>
                 <button className="flex items-center gap-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:gap-3 transition-all mt-4 w-fit">
                    View Node Infrastructure <ArrowForward size={14} />
                 </button>
              </div>
              <div className="w-full md:w-[60%] relative bg-[#091426] overflow-hidden">
                 <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLrYOH0jbAvnGEzVF-FYBjqfHqTojMDTOZHgIpZEo5i2jzKXI6EqQGL6EmN3qE7vHGEwIGUb4xugJhp4opJikH8Nf_jBYFIID1ppKIolurHZtCDTu_Orgte8Z6Rt2TOVDku1Kdrri49ta7671fdrkxikEAe52MYz48R0j0JK63EpLvYzt-PgjjHcLX5yqYxjmGbGnlTAMuPcx1evheSXNWGdgqNZgXeBmJHO90pshugRfKPuLNYs0usf_CZIKQtTF3j76-VNIgW6M" 
                    alt="Infrastructure Visualization" 
                    className="w-full h-full object-cover grayscale opacity-30 mix-blend-screen"
                 />
                 <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#091426]" />
                 <div className="absolute top-6 right-6 flex gap-2">
                    <span className="bg-white/10 border border-white/20 backdrop-blur text-white px-3 py-1 rounded text-[10px] font-mono font-bold tracking-widest shadow-xl">LIVE: US-WEST-1</span>
                    <span className="bg-white/10 border border-white/20 backdrop-blur text-white px-3 py-1 rounded text-[10px] font-mono font-bold tracking-widest shadow-xl">LIVE: EU-CENTRAL-1</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
      
      {/* Contextual FAB */}
      <button className="fixed bottom-10 right-10 w-14 h-14 bg-[#091426] text-white outline outline-4 outline-slate-200 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 hover:bg-slate-900 transition-all z-50">
         <Terminal size={24} />
      </button>
    </div>
  );
};

export default MaintenanceUpgrades;
