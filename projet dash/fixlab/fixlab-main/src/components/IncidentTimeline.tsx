import React from "react";
import { Shield, ShieldAlert, ShieldCheck, Tag, Info, AlertTriangle, ArrowRight } from "lucide-react";
import { GlassCard } from "./GlassUI";
import { SystemLog, Device } from "../types";

interface IncidentTimelineProps {
  logs: SystemLog[];
  devices: Device[];
  onSelectDevice?: (device: Device) => void;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ 
  logs, 
  devices,
  onSelectDevice
}) => {
  // Base incidents - fallback or mix with logs
  const staticIncidents = [
    { 
      timestamp: "Today, 10:45 AM", 
      title: "Critical Security Breach Attempt", 
      status: "Closed", 
      priority: "High", 
      level: "critical", 
      source: "Security Shield",
      desc: "Multiple unauthorized access attempts detected on Nexus Core 03. Firewall protocols engaged, threat neutralized." 
    },
    { 
      timestamp: "Yesterday, 04:30 PM", 
      title: "Network Anomaly Detected", 
      status: "In Progress", 
      priority: "Medium", 
      level: "warning", 
      source: "Network Guard",
      desc: "Unusual traffic pattern observed on external gateway. Investigation initiated by AI sentinel." 
    },
    { 
      timestamp: "Oct 25, 09:15 AM", 
      title: "System Integrity Check Passed", 
      status: "Verified", 
      priority: "Low", 
      level: "success", 
      source: "System Core",
      desc: "Routine diagnostic scan completed on all sovereign devices with zero anomalies." 
    },
    { 
      timestamp: "Oct 24, 03:00 PM", 
      title: "Encrypted Data Sync Failure", 
      status: "Retrying", 
      priority: "Low", 
      level: "info", 
      source: "Data Storage Hub",
      desc: "Synchronization error with secure off-site storage. Retry scheduled." 
    }
  ];

  // Merge dynamic critical/warning logs with our timeline items for maximum interactive realism
  const filteredCriticalLogs = logs
    .filter(l => l.level === "critical" || l.level === "warning")
    .map(log => ({
      timestamp: "Sync Alert (" + log.timestamp + ")",
      title: log.message.split(".")[0],
      status: "Active",
      priority: log.level === "critical" ? "High" : "Medium",
      level: log.level,
      source: log.source,
      desc: log.message,
      deviceId: log.deviceId
    }));

  const allIncidents = [...filteredCriticalLogs, ...staticIncidents];

  return (
    <div className="min-h-full bg-gradient-to-b from-[#fdfcf9] to-[#f5f2eb] text-zinc-800 p-6 md:p-12 overflow-y-auto font-sans rounded-3xl border border-zinc-200/50 shadow-2xl relative select-none">
      
      {/* Visual background lights for prestige look */}
      <div className="absolute right-10 top-10 w-96 h-96 bg-amber-200/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-10 bottom-10 w-96 h-96 bg-cyan-100/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="text-center mb-12 relative z-10">
        <span className="font-mono text-amber-600/70 text-[9px] uppercase tracking-[0.2em] font-black block mb-1">
          FixLab
        </span>
        <h1 className="text-4xl font-light text-zinc-900 tracking-tight font-sans">
          Refined Incident Timeline
        </h1>
        <p className="text-xs text-zinc-400 mt-2 font-mono uppercase tracking-widest">
          Variant 8 of 10
        </p>
      </div>

      {/* Sub menu simulator */}
      <div className="flex justify-center mb-12 relative z-10">
        <div className="flex bg-zinc-200/50 p-1 rounded-xl border border-zinc-300/30 gap-1">
          {["Dashboard", "Incident Feed", "Analysis", "Reports", "Settings"].map((t) => (
            <span 
              key={t}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono cursor-pointer transition-colors duration-200 ${
                t === "Incident Feed" ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto pl-4 md:pl-0">
        {/* Central timeline connector line in absolute alignment */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-4 transform -translate-x-1/2 w-[2px] bg-gradient-to-b from-amber-400 via-amber-300 to-zinc-200 shadow-sm" />

        <div className="space-y-10 relative z-10">
          {allIncidents.map((inc, i) => {
            const levelColor = inc.level === "critical" 
              ? "bg-rose-550 border-rose-600/20 text-rose-700" 
              : inc.level === "warning" 
              ? "bg-amber-450 border-amber-600/20 text-amber-800"
              : "bg-emerald-550 border-emerald-600/25 text-emerald-700";

            const tagColor = inc.level === "critical"
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : inc.level === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-600"
              : "bg-emerald-50 border-emerald-200 text-emerald-600";

            const associatedDev = inc.deviceId ? devices.find(d => d.id === inc.deviceId) : null;

            return (
              <div key={i} className="flex flex-col md:flex-row md:items-start justify-between w-full gap-4 md:gap-0">
                
                {/* Timestamp Left side (or Top on mobile) */}
                <div className="w-full md:w-[45%] md:text-right pr-4 md:pr-10 text-xl font-light text-zinc-500 font-sans md:pt-4 flex items-center md:justify-end gap-2.5">
                  <span className="font-sans font-light">{inc.timestamp}</span>
                </div>
                
                {/* Dynamic timeline node on the axis line */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 mt-6 md:mt-5">
                  <div className="w-4 h-4 bg-white border-[3px] border-amber-400 rounded-full shadow-md flex items-center justify-center animate-pulse" />
                </div>

                {/* Card block Right side */}
                <div className="w-full md:w-[45%] pl-8 md:pl-10">
                  <div className="bg-white/85 hover:bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-md shadow-zinc-200/40 hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
                    
                    {/* Top Accent Strip based on Level */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                      inc.level === "critical" 
                        ? "from-rose-400 to-rose-500" 
                        : inc.level === "warning"
                        ? "from-amber-450 to-amber-500"
                        : "from-emerald-450 to-emerald-500"
                    }`} />

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-black">
                        {inc.source}
                      </span>
                      <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full border ${tagColor}`}>
                        {inc.priority} Priority
                      </span>
                    </div>

                    <h3 className="font-bold text-zinc-900 text-base leading-snug tracking-tight group-hover:text-amber-600 transition-colors duration-200">
                      {inc.title}
                    </h3>
                    
                    <p className="text-xs text-zinc-500 leading-relaxed mt-2">
                      {inc.desc}
                    </p>

                    {/* Tags Badge row */}
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      <span className={`text-[9px] px-2 py-0.5 border rounded font-mono font-bold ${
                        inc.level === "critical" ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-zinc-50 text-zinc-500 border-zinc-100"
                      }`}>
                        {inc.status}
                      </span>
                      {associatedDev && (
                        <span className="text-[9px] px-2 py-0.5 border rounded bg-cyan-50/50 text-cyan-600 border-cyan-100 font-mono">
                          Host: {associatedDev.name}
                        </span>
                      )}
                    </div>

                    {/* Diagnostics tracer callback */}
                    {associatedDev && onSelectDevice && (
                      <button 
                        onClick={() => onSelectDevice(associatedDev)}
                        className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-amber-600 hover:text-amber-700 font-black text-left cursor-pointer transition-all w-full"
                      >
                        Inspect Device Trace Matrix
                        <ArrowRight className="w-3 h-3 text-amber-500 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

