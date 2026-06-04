import React, { useState, useEffect } from "react";
import { Device, SystemLog } from "../types";
import { ClipboardList, AlertCircle, ArrowRight, Activity, Users, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface SanteConnectV2Props {
  devices: Device[];
  logs: SystemLog[];
  onSelectDevice?: (device: Device) => void;
  onClearAlert?: (logId: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

// Custom Premium Telemetry Wave Shield Logo exactly matching the fine aqua outline elements
const SovereignNodeLogo: React.FC = () => (
  <svg className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clean shield/node outline */}
    <path 
      d="M12 2L4 5V11C4 16.5 12 21 12 21C12 21 20 16.5 20 11V5L12 2Z" 
      stroke="#22d3ee" 
      strokeWidth="2" 
      strokeLinejoin="round" 
    />
    {/* Centered frequency pulse trace traversing the shield */}
    <path 
      d="M5.5 11H8.5L9.5 7.5L11 15L12 9.5L12.5 11H18.5" 
      stroke="#22d3ee" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export const SanteConnectV2: React.FC<SanteConnectV2Props> = ({
  devices,
  logs,
  onSelectDevice,
  onClearAlert,
  onNavigateToTab
}) => {
  // Let the user toggle simulated edge network loads versus linking directly to active server node data
  const [dataSource, setDataSource] = useState<"simulation" | "node_direct">("simulation");

  const [simulatedLoad, setSimulatedLoad] = useState(92);
  const [simulatedChannels, setSimulatedChannels] = useState(14);
  const [simulatedActiveAgents, setSimulatedActiveAgents] = useState(86);

  // Fluctuations for system load simulator to give it a realistic, dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedLoad(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 88 && next <= 95 ? next : prev;
      });
      setSimulatedActiveAgents(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 83 && next <= 89 ? next : prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Compute alternative dynamic bindings from real live active system nodes
  const totalHostNodes = devices.length || 1;
  const onlineCount = devices.filter(d => d.status === "online").length;
  const warningCount = devices.filter(d => d.status === "warning").length;
  const offlineCount = devices.filter(d => d.status === "offline").length;

  const realNodeCompliantPercent = Math.round(
    (devices.filter(d => d.status === "online").length / totalHostNodes) * 100
  );

  // Choose display statistics based on active data-source toggle
  const currentFluxLoad = dataSource === "simulation" ? simulatedLoad : realNodeCompliantPercent;
  const currentChannels = dataSource === "simulation" ? simulatedChannels : (offlineCount + warningCount || 7);
  const currentActiveAgents = dataSource === "simulation" ? simulatedActiveAgents : (onlineCount * 12 + 6);

  // Status labels based on current parameters
  const getFluxStatus = (val: number) => {
    if (val >= 90) return "OPTIMUM";
    if (val >= 75) return "HIGH CAP";
    return "STABLE";
  };

  const getChannelsStatus = (val: number) => {
    if (val < 15) return "TENSION";
    return "AVAILABLE";
  };

  return (
    <div className="space-y-6" id="sante-connect-v2-container">
      
      {/* Dynamic toggle switch that allows switching datasets seamlessly */}
      <div className="flex items-center justify-between p-2.5 bg-indigo-950/40 rounded-2xl border border-purple-500/10 backdrop-blur-sm" id="sante-toggle-bar">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-200">
            AESTHETIC DECK VIEW CONTROLLER
          </span>
        </div>
        <div className="flex gap-1.5 p-0.5 bg-black/30 rounded-lg border border-indigo-950">
          <button
            id="btn-toggle-sim"
            onClick={() => setDataSource("simulation")}
            className={`px-3 py-1 text-[9px] font-bold font-mono tracking-widest uppercase rounded-md transition-all cursor-pointer ${
              dataSource === "simulation" 
                ? "bg-purple-900/60 text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.15)]" 
                : "text-purple-400 hover:text-white"
            }`}
          >
            📡 MODEL SIMULATION (SPEC STATIC)
          </button>
          <button
            id="btn-toggle-live"
            onClick={() => setDataSource("node_direct")}
            className={`px-3 py-1 text-[9px] font-bold font-mono tracking-widest uppercase rounded-md transition-all cursor-pointer ${
              dataSource === "node_direct" 
                ? "bg-purple-900/60 text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.15)]" 
                : "text-purple-400 hover:text-white"
            }`}
          >
            🛡️ LIVE AIRGAP INTEGRATION
          </button>
        </div>
      </div>

      {/* Main Coordinated Command Dashboard Panel */}
      <div className="rounded-[2.5rem] bg-[#1a0e41]/90 p-8 border border-purple-500/10 shadow-[0_15px_40px_rgba(76,29,149,0.35)] backdrop-blur-md relative overflow-hidden text-white font-sans" id="sovereign-control-card">
        
        {/* Background ambient glowing core */}
        <div className="absolute right-0 top-0 w-[200px] h-[200px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-[150px] h-[150px] bg-purple-500/15 rounded-full blur-[70px] pointer-events-none" />

        {/* 1. HEADER SECTION */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Elegant glowing glass rounded square with Custom Wave logo */}
            <div className="w-14 h-14 bg-indigo-900/40 border border-[#22d3ee]/25 shadow-[0_0_20px_rgba(34,211,238,0.15)] flex items-center justify-center rounded-[1.25rem] shrink-0">
              <SovereignNodeLogo />
            </div>
            
            <div>
              <h2 className="text-white text-[1.3rem] font-sans font-black italic tracking-wider uppercase select-none leading-none">
                SOVEREIGN CONNECT V2
              </h2>
              <span className="text-[#7c6bb5] text-xs font-bold font-mono tracking-widest uppercase mt-2.5 block">
                CENTRAL SOVEREIGN CONTROL BASIN
              </span>
            </div>
          </div>

          {/* Double status indicators on the right */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-950 border border-indigo-700"></span>
          </div>
        </div>

        {/* 2. GRADIENT DIVIDER LINE fading at edges */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#3b2382]/60 to-transparent my-6" />

        {/* 3. CORE METRIC CONTAINER ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1: NETWORK SYSTEM LOAD */}
          <div className="bg-[#24175e]/45 rounded-3xl p-6 border border-purple-500/5 hover:border-purple-500/15 transition-all duration-350 flex flex-col justify-between min-h-[145px] shadow-lg group">
            <span className="text-[#7c6bb5] text-[10px] font-sans font-bold tracking-widest uppercase mb-1 block">
              NETWORK SYSTEM LOAD
            </span>
            <span className="text-white text-[2.75rem] font-sans font-black italic tracking-wide my-1 select-none leading-none group-hover:scale-105 duration-300 transform origin-left">
              {currentFluxLoad}%
            </span>
            <span className="text-[#00e1ff] text-[10px] font-sans font-black tracking-widest uppercase mt-1 block">
              {getFluxStatus(currentFluxLoad)}
            </span>
          </div>

          {/* Box 2: AVAILABLE CHANNELS */}
          <div className="bg-[#24175e]/45 rounded-3xl p-6 border border-purple-500/5 hover:border-purple-500/15 transition-all duration-350 flex flex-col justify-between min-h-[145px] shadow-lg group">
            <span className="text-[#7c6bb5] text-[10px] font-sans font-bold tracking-widest uppercase mb-1 block">
              AVAILABLE CHANNELS
            </span>
            <span className="text-white text-[2.75rem] font-sans font-black italic tracking-wide my-1 select-none leading-none group-hover:scale-105 duration-300 transform origin-left">
              {currentChannels}
            </span>
            <span className="text-[#ff5c00] text-[10px] font-sans font-black tracking-widest uppercase mt-1 block">
              {getChannelsStatus(currentChannels)}
            </span>
          </div>

          {/* Box 3: ACTIVE PROCESS AGENTS */}
          <div className="bg-[#24175e]/45 rounded-3xl p-6 border border-purple-500/5 hover:border-purple-500/15 transition-all duration-350 flex flex-col justify-between min-h-[145px] shadow-lg group">
            <span className="text-[#7c6bb5] text-[10px] font-sans font-bold tracking-widest uppercase mb-1 block">
              ACTIVE PROCESS AGENTS
            </span>
            <span className="text-white text-[2.75rem] font-sans font-black italic tracking-wide my-1 select-none leading-none group-hover:scale-105 duration-300 transform origin-left">
              {currentActiveAgents}
            </span>
            <span className="text-[#10b981] text-[10px] font-sans font-black tracking-widest uppercase mt-1 block">
              STABLE
            </span>
          </div>

        </div>

        {/* 4. REAL-TIME ALERTS SECTION */}
        <div className="flex items-center justify-between text-[#7c6bb5] font-sans font-bold text-xs uppercase tracking-widest mt-8 mb-4">
          <span>ALERTES TEMPS RÉEL</span>
          <button className="text-[#7c6bb5] hover:text-white transition-all text-sm font-black tracking-[0.2em] cursor-pointer">
            •••
          </button>
        </div>

        {/* Dynamic Alerts Queue styled strictly into the signature left-curved brackets design */}
        <div className="space-y-3.5" id="alerts-matrix-queue">
          
          {/* Primary Mock Alarm showing Coordinated system activity */}
          <div className="relative bg-[#1f124c]/90 rounded-[1.8rem] p-5 border border-purple-500/5 flex items-center justify-between gap-4 shadow-[#130737]/45 shadow-sm group hover:scale-[1.01] transition-all duration-300">
            
            {/* Smooth left crescent parenthesis custom SVG curve with glowing border-pulsation */}
            <div className="absolute left-1.5 top-0 bottom-0 w-3 flex items-center justify-center">
              <svg className="h-16 w-3 text-[#ff5c00] overflow-visible" viewBox="0 0 10 80">
                <path 
                  d="M8,4 C2,22 2,58 8,76" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  className="drop-shadow-[0_0_8px_rgba(255,92,0,0.8)]" 
                />
              </svg>
            </div>

            <div className="flex items-center gap-4 pl-4">
              {/* Caution warning diamond icon */}
              <div className="w-11 h-11 bg-orange-500/10 border border-[#ff5c00]/30 rounded-2xl text-[#ff5c00] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,92,0,0.12)]">
                <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div>
                <span className="text-white font-sans font-extrabold text-[12px] tracking-widest block uppercase">
                  ALERT LEVEL: ENHANCED
                </span>
                <span className="text-[#7c6bb5] text-[10px] tracking-wide mt-1 block uppercase font-medium">
                  REMOTE EDGE CONNECTION #402 INBOUND
                </span>
              </div>
            </div>

            <div className="text-white/60 text-[11px] font-sans font-bold tracking-widest uppercase shrink-0">
              2m
            </div>
          </div>

          {/* Append newly caught critical security alerts from real system logs into this gorgeous format */}
          {logs.filter(log => log.level === "critical").slice(0, 2).map((alert, idx) => {
            const assocDevice = devices.find(d => d.id === alert.deviceId);
            return (
              <div 
                key={alert.id} 
                className="relative bg-[#1f124c]/90 rounded-[1.8rem] p-5 border border-purple-500/5 flex items-center justify-between gap-4 shadow-[#130737]/45 shadow-sm hover:scale-[1.01] transition-all duration-300"
              >
                {/* Visual left crescent arc */}
                <div className="absolute left-1.5 top-0 bottom-0 w-3 flex items-center justify-center">
                  <svg className="h-16 w-3 text-[#ff5c00] overflow-visible" viewBox="0 0 10 80">
                    <path 
                      d="M8,4 C2,22 2,58 8,76" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      className="drop-shadow-[0_0_8px_rgba(255,92,0,0.8)]" 
                    />
                  </svg>
                </div>

                <div className="flex items-center gap-4 pl-4">
                  {/* Warning emblem */}
                  <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.12)]">
                    <ShieldAlert className="w-5 h-5 text-amber-505" />
                  </div>

                  <div>
                    <span className="text-white font-sans font-extrabold text-[12px] tracking-widest block uppercase">
                      VULNÉRABILITÉ SÉCURITÉ DÉTECTÉE
                    </span>
                    <span className="text-[#7c6bb5] text-[10px] tracking-wide mt-1 block uppercase font-medium">
                      {alert.source}: {alert.message.slice(0, 50)}...
                    </span>
                    {assocDevice && onSelectDevice && (
                      <button 
                        onClick={() => onSelectDevice(assocDevice)}
                        className="text-[9px] text-[#22d3ee] mt-1 hover:underline cursor-pointer block font-mono text-left bg-transparent border-none out-none"
                      >
                        Tracer l'appareil cible ({assocDevice.name}) →
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-white/60 text-[11px] font-sans font-bold tracking-widest uppercase shrink-0">
                  {alert.timestamp || "maintenant"}
                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* Quick Access panel back to other system sections to maintain flow usability */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4" id="quick-links-panel">
        {[
          { label: "🖥️ CORE COCKPIT", tabId: "overview_system" },
          { label: "🗺️ GLOBAL MATRIX MAP", tabId: "global-map" },
          { label: "⚡ DATA FLOW ENGINE", tabId: "data-flow" },
          { label: "📫 SOVEREIGN MAIL", tabId: "gmail" }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (item.tabId === "overview_system") {
                // To display system overview cockpit
                if (onNavigateToTab) onNavigateToTab("dashboard");
              } else if (onNavigateToTab) {
                onNavigateToTab(item.tabId);
              }
            }}
            className="p-3 bg-indigo-950/25 border border-[#3e2389]/20 hover:border-cyan-400/30 rounded-xl text-center text-[10px] font-mono font-bold tracking-widest text-indigo-200 hover:text-cyan-400 cursor-pointer duration-300 transition-all select-none uppercase hover:shadow-[0_0_10px_rgba(34,211,238,0.1)]"
          >
            {item.label}
          </button>
        ))}
      </div>

    </div>
  );
};
