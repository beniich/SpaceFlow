import React from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  Search, 
  Map, 
  Globe, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  Layers, 
  ShieldAlert, 
  Zap, 
  Terminal, 
  Filter, 
  Download, 
  MoreHorizontal,
  Info,
  ChevronRight,
  Cpu,
  Radar
} from 'lucide-react';

const RiskPrediction: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Module Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Cpu size={12} className="fill-current" /> ML Model v.4.2 Live
              </span>
              <span className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                // Last inference: 2m ago
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase">AI Risk Prediction Engine</h1>
            <p className="text-slate-500 max-w-2xl mt-1 text-sm leading-relaxed font-medium">
              Forecasting compliance integrity across global jurisdictions using forensic machine learning and heuristic anomaly scoring.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-[#091426] rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
              <Filter size={14} /> Filter Signals
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#091426] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
              <Download size={14} /> Export Prediction Set
            </button>
          </div>
        </div>

        {/* Global Heatmap Section */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-xl font-black text-[#091426] uppercase tracking-tight flex items-center gap-3">
                <Radar size={22} className="text-blue-600" /> Global Risk Heatmap
              </h3>
              <div className="flex gap-4">
                {[
                  { label: 'Low', color: 'bg-emerald-500' },
                  { label: 'Med', color: 'bg-amber-500' },
                  { label: 'High', color: 'bg-red-500' },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-1.5 font-black text-[9px] text-slate-400 uppercase tracking-widest">
                    <div className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-[460px] bg-slate-50 rounded-3xl relative overflow-hidden border border-slate-100 shadow-inner">
               {/* Simplified UI Map Representation */}
               <div className="absolute inset-0 opacity-20 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8swofJppCyerj8L-znPzjfonAXqoYgJWDgIPl68orESjvVRbeN_Be5dErNwp4V-UEit3J0p5IAjxdE179Aa-cBVzLpkwtqzeTTpq2PQXQS3W20nvvYPYztmZcofv27m7aIqS-7EHGllrxSVVLddOWIt57sPqJFPEp2zSBHGyCJ4_fB5445pCl0vagHA55Ptr2sBOutipEtub-nXTXwcnxK2PtsqjQBG-0lMsFXYY1H5-fRb20xpOECikgHlXEA4m9wkWmLSc8wRM')] bg-cover bg-center mix-blend-multiply" />
               <div className="absolute inset-0 bg-blue-900/5 backdrop-blur-[1px]" />
               
               {/* Hotspots */}
               <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }} className="absolute top-[30%] left-[25%]">
                  <div className="w-5 h-5 bg-red-600 rounded-full border-4 border-white shadow-xl shadow-red-200" />
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#091426] text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl">
                    NA Regional Breach: 89% Risk
                  </div>
               </motion.div>
               <div className="absolute top-[45%] left-[55%]">
                  <div className="w-4 h-4 bg-amber-500 rounded-full border-3 border-white shadow-lg" />
               </div>
               <div className="absolute top-[60%] left-[75%]">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-xl opacity-80" />
               </div>
            </div>
          </div>

          <div className="col-span-4 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-black text-[#091426] uppercase tracking-tight">Predicted Failure Points</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Top 5 Analytics Alerts</p>
            </div>
            
            <div className="flex-1 space-y-4">
              {[
                { label: 'CRITICAL THREAT', title: 'AML Protocol Drift', prob: '94.2%', color: 'red' },
                { label: 'HIGH PROBABILITY', title: 'KYC Latency Threshold', prob: '81.5%', color: 'amber' },
                { label: 'ELEVATED', title: 'Cross-Border Reporting', prob: '67.0%', color: 'blue' },
                { label: 'ELEVATED', title: 'Sanctions Auto-Scan', prob: '59.8%', color: 'blue' },
                { label: 'MODERATE', title: 'Data Residency Sync', prob: '44.2%', color: 'slate' },
              ].map((alert, i) => (
                <div key={i} className="p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50/50 transition-all group">
                   <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={`text-[8px] font-black tracking-widest uppercase mb-1 block ${
                            alert.color === 'red' ? 'text-red-600' : alert.color === 'amber' ? 'text-amber-600' : alert.color === 'blue' ? 'text-blue-600' : 'text-slate-400'
                        }`}>{alert.label}</span>
                        <p className="text-xs font-black text-[#091426] uppercase tracking-tight">{alert.title}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono text-xs font-black ${
                            alert.color === 'red' ? 'text-red-600' : alert.color === 'amber' ? 'text-amber-600' : 'text-[#091426]'
                        }`}>{alert.prob}</p>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Conf.</span>
                      </div>
                   </div>
                   <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-50">
                     <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: alert.prob }} 
                        className={`h-full ${
                           alert.color === 'red' ? 'bg-red-600' : alert.color === 'amber' ? 'bg-amber-500' : alert.color === 'blue' ? 'bg-blue-600' : 'bg-slate-300'
                        }`} 
                     />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trajectory Prediction */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
           <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-xl font-black text-[#091426] uppercase tracking-tight">6-Month Risk Trajectory</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Aggregated forecast vectors :: Q4 2024 - Q1 2025</p>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Integrity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compliance Liability</span>
                </div>
              </div>
           </div>
           
           <div className="h-[280px] w-full flex items-end gap-2 px-10">
              {[
                { m: 'OCT 24', integrity: 60, liability: 40, opacity: 0.2 },
                { m: 'NOV 24', integrity: 65, liability: 42, opacity: 0.4 },
                { m: 'DEC 24', integrity: 72, liability: 48, current: true },
                { m: 'JAN 25*', integrity: 68, liability: 55, predicted: true, opacity: 0.6 },
                { m: 'FEB 25*', integrity: 62, liability: 65, predicted: true, opacity: 0.4 },
                { m: 'MAR 25*', integrity: 58, liability: 78, predicted: true, opacity: 0.2 },
              ].map((m, i) => (
                <div key={i} className={`flex-1 flex flex-col items-center gap-6 relative ${m.current ? 'bg-slate-50/50 rounded-3xl p-4 -mx-4 border border-slate-100' : ''}`}>
                  <div className="w-full flex gap-2 items-end h-56">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: m.integrity + '%' }} 
                      className={`flex-1 bg-blue-600 rounded-t-xl shadow-lg ${m.predicted ? 'border-t-4 border-dashed border-blue-400 opacity-50' : ''}`}
                      style={{ opacity: m.current ? 1 : m.opacity }}
                    />
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: m.liability + '%' }} 
                      className={`flex-1 bg-red-600 rounded-t-xl shadow-lg ${m.predicted ? 'border-t-4 border-dashed border-red-400 opacity-50' : ''}`}
                      style={{ opacity: m.current ? 1 : m.opacity }}
                    />
                  </div>
                  <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${m.current ? 'text-[#091426]' : 'text-slate-400'}`}>
                    {m.m}
                  </span>
                </div>
              ))}
           </div>
        </div>

        {/* Real-time Ledger */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />
          <h3 className="text-xl font-black text-[#091426] uppercase tracking-tight mb-10 pb-6 border-b border-slate-50">Real-Time Risk Ledger</h3>
          <div className="space-y-8 relative pl-6 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
            {[
              { type: 'SYSTEM_UPDATE', meta: 'ENGINE_CALIBRATED', time: '14:22:10 UTC', desc: 'New training weights applied to [LATAM-HUB-04]. Risk sensitivity +12.4% for tax compliance vectors.', color: 'blue' },
              { type: 'ALERT', meta: 'PREDICTED_DRIFT', time: '13:05:44 UTC', desc: 'Heuristic check detected 0.85 variance in crypto-asset valuations vs. regulatory expectations.', color: 'red' },
              { type: 'USER_ACTION', meta: 'REPORT_GENERATED', time: '11:59:02 UTC', desc: 'Executive summary for Q1 2025 Prediction Set generated by Admin-402.', color: 'slate' },
            ].map((log, i) => (
              <div key={i} className="relative group">
                 <div className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-white border-3 border-${log.color === 'red' ? 'red-600' : log.color === 'blue' ? 'blue-600' : 'slate-300'} z-10`} />
                 <div className={`p-6 rounded-3xl transition-all ${
                   log.color === 'red' ? 'bg-red-50 border border-red-100' : 'bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100'
                 }`}>
                   <div className="flex justify-between items-center mb-2">
                     <div className="flex items-center gap-3">
                       <span className={`text-[9px] font-black uppercase tracking-widest ${log.color === 'red' ? 'text-red-700' : 'text-[#091426]'}`}>{rowIcon(log.type)} {log.type}</span>
                       <span className="text-[8px] font-black text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100 uppercase tracking-widest">{log.meta}</span>
                     </div>
                     <span className="font-mono text-[10px] font-black text-slate-400 uppercase">{log.time}</span>
                   </div>
                   <p className={`text-xs font-bold uppercase tracking-tight leading-relaxed ${log.color === 'red' ? 'text-red-900' : 'text-slate-600'}`}>
                     {log.desc}
                   </p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const rowIcon = (type: string) => {
    switch(type) {
        case 'ALERT': return <ShieldAlert size={12} />;
        case 'SYSTEM_UPDATE': return <Zap size={12} />;
        default: return <History size={12} />;
    }
}

export default RiskPrediction;
