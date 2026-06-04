import React, { useState, useEffect } from "react";
import { ShieldCheck, Flame, RefreshCw, AlertTriangle, AlertOctagon, Sparkles, Server } from "lucide-react";
import { Device } from "../types";
import { GlassCard } from "./GlassUI";

interface HealthMatrixProps {
  devices: Device[];
  onSelectDevice?: (device: Device) => void;
  onModifyDeviceStatus?: (id: string, status: "online" | "warning" | "offline") => void;
}

export const HealthMatrix: React.FC<HealthMatrixProps> = ({ 
  devices,
  onSelectDevice,
  onModifyDeviceStatus
}) => {
  // Let's create gorgeous interactive waveforms reflecting system loads
  const [waveSeed, setWaveSeed] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWaveSeed(prev => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Map devices to grid data
  const gridNodes = [
    { id: "Sovereign-A1", type: "Nexus Router", baseStatus: "HEALTHY", color: "text-cyan-400 font-black", border: "border-cyan-500/25", bg: "bg-cyan-500/5", ringGlow: "shadow-[0_0_15px_rgba(34,211,238,0.25)] border-cyan-400" },
    { id: "Sovereign-B2", type: "Edge Gateway", baseStatus: "HEALTHY", color: "text-cyan-400 font-black", border: "border-cyan-500/25", bg: "bg-cyan-500/5", ringGlow: "shadow-[0_0_15px_rgba(34,211,238,0.25)] border-cyan-400" },
    { id: "Sovereign-C3", type: "Sensor Hub", baseStatus: "WARNING", color: "text-yellow-400 font-black", border: "border-yellow-500/20", bg: "bg-yellow-500/5", ringGlow: "shadow-[0_0_15px_rgba(234,179,8,0.25)] border-yellow-400" },
    { id: "Sovereign-D4", type: "Core Server", baseStatus: "CRITICAL", color: "text-rose-400 font-black", border: "border-rose-500/20", bg: "bg-rose-500/5", ringGlow: "shadow-[0_0_15px_rgba(244,63,94,0.25)] border-rose-400" },
    { id: "Sovereign-E5", type: "Backup Power", baseStatus: "HEALTHY", color: "text-cyan-400 font-black", border: "border-cyan-500/25", bg: "bg-cyan-500/5", ringGlow: "shadow-[0_0_15px_rgba(34,211,238,0.25)] border-cyan-400" },
    { id: "Sovereign-F6", type: "Secure Storage", baseStatus: "HEALTHY", color: "text-cyan-400 font-black", border: "border-cyan-500/25", bg: "bg-cyan-500/5", ringGlow: "shadow-[0_0_15px_rgba(34,211,238,0.25)] border-cyan-400" },
    { id: "Sovereign-G7", type: "Field Unit", baseStatus: "WARNING", color: "text-yellow-400 font-black", border: "border-yellow-500/20", bg: "bg-yellow-500/5", ringGlow: "shadow-[0_0_15px_rgba(234,179,8,0.25)] border-yellow-400" },
    { id: "Sovereign-H8", type: "Communication Node", baseStatus: "CRITICAL", color: "text-rose-400 font-black", border: "border-rose-500/20", bg: "bg-rose-500/5", ringGlow: "shadow-[0_0_15px_rgba(244,63,94,0.25)] border-rose-400" },
  ];

  const handleDeviceAction = (nodeId: string, baseStatus: string) => {
    // Find matching device in actual state database
    const matching = devices.find(d => d.name.toLowerCase().includes(nodeId.split("-")[1].toLowerCase()) || d.id === nodeId);
    if (matching && onSelectDevice) {
      onSelectDevice(matching);
    }
  };

  const getWaveData = (index: number, status: string) => {
    // Return custom list of 18 numbers representing high-fidelity SVG waveform heights
    const amplitude = status === "CRITICAL" ? 40 : status === "WARNING" ? 28 : 16;
    const baseVal = status === "CRITICAL" ? 50 : status === "WARNING" ? 30 : 15;
    
    return Array.from({ length: 22 }, (_, i) => {
      const offset = (waveSeed + i + index * 5) % 22;
      const waveHeight = baseVal + Math.sin(offset * 0.4) * amplitude + Math.cos(offset) * 5;
      return Math.max(8, Math.min(100, Math.round(waveHeight)));
    });
  };

  return (
    <div className="min-h-full bg-[#050913] text-white p-6 md:p-8 overflow-y-auto font-mono select-none border border-cyan-500/10 rounded-3xl shadow-2xl relative">
      <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute left-10 bottom-10 w-80 h-80 bg-purple-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Title Container */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-zinc-950 gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2.5">
            <Server className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>Fleet Health Matrix</span>
          </h1>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider">
            FixLab telemetry cluster matrix
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-zinc-450 bg-[#0c1426] border border-cyan-500/15 uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg">
            Variant 2 of 10
          </span>
        </div>
      </div>

      {/* Grid Matrix Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {gridNodes.map((node, index) => {
          // Resolve current realtime stats for nodes
          const devMatch = devices[index % devices.length];
          const dynamicStatus = node.baseStatus;

          const loadPercent = dynamicStatus === "CRITICAL" ? 95 : dynamicStatus === "WARNING" ? 64 : 15;
          const statusWave = getWaveData(index, dynamicStatus);

          return (
            <GlassCard 
              key={node.id} 
              onClick={() => handleDeviceAction(node.id, dynamicStatus)}
              className={`p-5 transition-all duration-300 border border-zinc-800 hover:border-cyan-500/35 cursor-pointer bg-[#0c1527]/55`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-zinc-100 font-extrabold text-[13px] tracking-wide uppercase">{node.id}</h3>
                  <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-tight">({node.type})</p>
                </div>

                {/* Styled Circular Status Ring Indicator */}
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-black tracking-wide ${node.color}`}>
                    {dynamicStatus}
                  </span>
                  <div className={`w-3.5 h-3.5 rounded-full border border-black/40 flex items-center justify-center ${node.ringGlow}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      dynamicStatus === "CRITICAL" ? "bg-rose-450" : dynamicStatus === "WARNING" ? "bg-yellow-400" : "bg-cyan-400"
                    }`} />
                  </div>
                </div>
              </div>
              
              {/* Custom SVG Waveform visualizer */}
              <div className="h-14 w-full flex items-end gap-[2px] mb-5 p-1 bg-black/35 rounded-lg border border-zinc-900/60 overflow-hidden">
                {statusWave.map((h, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-500 ease-out ${
                      dynamicStatus === "CRITICAL" ? "bg-rose-500/60 brightness-90 shadow-[0_0_6px_rgba(244,63,94,0.3)]" : dynamicStatus === "WARNING" ? "bg-yellow-500/50" : "bg-cyan-500/50"
                    }`} 
                    style={{ height: `${h}%` }} 
                  />
                ))}
              </div>

              {/* Status details labels */}
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between text-zinc-400">
                  <span className="uppercase font-bold tracking-tight">CPU TEMPERATURE</span>
                  <span className="font-extrabold text-zinc-250 font-sans">{dynamicStatus === "CRITICAL" ? "92°C" : dynamicStatus === "WARNING" ? "71°C" : "45°C"}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="uppercase font-bold tracking-tight">NETWORK TRAFFIC</span>
                  <span className="font-extrabold text-zinc-250 font-sans">{dynamicStatus === "CRITICAL" ? "9.8 GB/s" : dynamicStatus === "WARNING" ? "4.2 GB/s" : "2.1 GB/s"}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="uppercase font-bold tracking-tight">BATTERY STATUS</span>
                  <span className="font-extrabold text-zinc-250 font-sans">{dynamicStatus === "CRITICAL" ? "21%" : dynamicStatus === "WARNING" ? "61%" : "98%"}</span>
                </div>
              </div>

              {/* Loader bottom bar */}
              <div className="mt-4 pt-3.5 border-t border-zinc-900/80 flex flex-col gap-1.5">
                <div className="flex justify-between text-[8px] font-black tracking-widest text-zinc-500">
                  <span>SYSTEM RESOURCE LOAD</span>
                  <span className={dynamicStatus === "CRITICAL" ? "text-rose-450" : "text-cyan-400"}>{loadPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      dynamicStatus === "CRITICAL" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : dynamicStatus === "WARNING" ? "bg-yellow-500" : "bg-cyan-500"
                    }`}
                    style={{ width: `${loadPercent}%` }}
                  />
                </div>
              </div>

            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};

