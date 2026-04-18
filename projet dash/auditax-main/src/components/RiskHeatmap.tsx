import React from 'react';
import { Globe, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';

export const RiskHeatmap = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe size={20} className="text-blue-600" />
            Global Risk Heatmap
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Predictive Threat Map V4.2</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> LOW
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> MED
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> HIGH
          </div>
        </div>
      </div>
      
      <div className="relative h-[400px] bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* World Map Mockup Background */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none grayscale">
           <svg viewBox="0 0 1000 500" className="w-full h-full">
              <path d="M150,200 Q200,100 300,150 T450,120 T600,180 T750,140 T900,200" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="200" cy="150" r="5" fill="currentColor" />
              <circle cx="500" cy="180" r="5" fill="currentColor" />
              <circle cx="800" cy="160" r="5" fill="currentColor" />
           </svg>
        </div>

        {/* Pulsing Risk Markers */}
        <div className="absolute top-[30%] left-[25%] group cursor-pointer">
           <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute opacity-75"></div>
           <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white relative"></div>
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl z-50">
              <span className="font-bold text-red-400">EMEA Breach Risk: 94.2%</span>
              <br/>Drift detected in Cloud Ingress
           </div>
        </div>

        <div className="absolute top-[50%] left-[60%] group cursor-pointer">
           <div className="w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl z-50">
              <span className="font-bold text-amber-400">APAC Operational: 62%</span>
              <br/>Latency Threshold Warning
           </div>
        </div>

        <div className="absolute top-[20%] left-[75%] group cursor-pointer">
           <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Floating Metrics Overlay */}
        <div className="absolute bottom-6 left-6 right-6 grid grid-cols-4 gap-4">
           {[
             { label: 'Integrity Score', value: '98.5%', icon: ShieldCheck, color: 'text-emerald-500' },
             { label: 'Active Alerts', value: '12', icon: AlertTriangle, color: 'text-amber-500' },
             { label: 'Drift Velocity', value: '+1.2%', icon: TrendingUp, color: 'text-blue-500' },
             { label: 'Sites Covered', value: '24', icon: Globe, color: 'text-slate-400' }
           ].map((m, i) => (
             <div key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                   <m.icon size={14} className={m.color} />
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{m.label}</span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">{m.value}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
