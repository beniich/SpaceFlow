import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, Settings2, Server, Activity, ChevronRight, 
  ShieldAlert, ShieldCheck, Layers, ArrowRight, Sparkles,
  Globe, BrainCircuit, Workflow, Zap, Sliders, RefreshCw, 
  Database, Info, AlertTriangle, CheckCircle2, SlidersHorizontal, Eye, Radio, Clock, Sun, Moon
} from "lucide-react";
import { motion } from "motion/react";
import { Device, SystemLog } from "../types";
import { GlassCard, NeonButton } from "./GlassUI";

// Import modular pages to seamlessly nest them within the cockpit dashboard
import { GlobalHorizonMap } from "./GlobalHorizonMap";
import { QuantumNode } from "./QuantumNode";
import { DataVisualizationFlow } from "./DataVisualizationFlow";
import { SecurityPerimeter } from "./SecurityPerimeter";
import { SanteConnectV2 } from "./SanteConnectV2";

interface FluidBlobProps {
  health: number;
  warningCount: number;
  criticalCount: number;
  isLightMode?: boolean;
}

export const FluidBlobCanvas: React.FC<FluidBlobProps> = ({ 
  health, 
  warningCount, 
  criticalCount,
  isLightMode = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{ radius: number; angle: number; speed: number; spin: number; size: number; alpha: number }>>([]);

  useEffect(() => {
    // Generate particle positions once
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: 32 }, () => ({
        radius: 15 + Math.random() * 70,
        angle: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.7,
        spin: (Math.random() - 0.5) * 0.012,
        size: 1.2 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6
      }));
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let time = 0;

    const render = () => {
      time += 1;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Transition layouts/colors dynamically with network parameters and light mode selection
      let colors = {
        backFill: isLightMode ? "rgba(10, 110, 189, 0.02)" : "rgba(16, 185, 129, 0.03)",
        backStroke: isLightMode ? "rgba(15, 76, 129, 0.12)" : "rgba(16, 185, 129, 0.12)",
        midFill: isLightMode ? "rgba(15, 76, 129, 0.05)" : "rgba(6, 182, 212, 0.07)",
        midStroke: isLightMode ? "rgba(15, 76, 129, 0.22)" : "rgba(6, 182, 212, 0.22)",
        frontFill: isLightMode ? "rgba(15, 76, 129, 0.08)" : "rgba(14, 165, 233, 0.13)",
        frontStroke: isLightMode ? "rgba(15, 76, 129, 0.55)" : "rgba(14, 165, 233, 0.5)",
        particle: isLightMode ? "#0f4c81" : "#22d3ee",
        glow: isLightMode ? "rgba(15, 76, 129, 0.15)" : "rgba(6, 182, 212, 0.25)"
      };

      if (criticalCount > 1 || warningCount > 1) {
        colors = {
          backFill: isLightMode ? "rgba(220, 38, 38, 0.02)" : "rgba(239, 68, 68, 0.03)",
          backStroke: isLightMode ? "rgba(220, 38, 38, 0.12)" : "rgba(239, 68, 68, 0.12)",
          midFill: isLightMode ? "rgba(220, 38, 38, 0.06)" : "rgba(244, 63, 94, 0.07)",
          midStroke: isLightMode ? "rgba(220, 38, 38, 0.22)" : "rgba(244, 63, 94, 0.22)",
          frontFill: isLightMode ? "rgba(220, 38, 38, 0.1)" : "rgba(225, 29, 72, 0.13)",
          frontStroke: isLightMode ? "rgba(220, 38, 38, 0.6)" : "rgba(225, 29, 72, 0.5)",
          particle: isLightMode ? "#dc2626" : "#f43f5e",
          glow: isLightMode ? "rgba(220, 38, 38, 0.15)" : "rgba(225, 29, 72, 0.25)"
        };
      } else if (warningCount > 0 || criticalCount > 0) {
        colors = {
          backFill: isLightMode ? "rgba(217, 119, 6, 0.02)" : "rgba(245, 158, 11, 0.03)",
          backStroke: isLightMode ? "rgba(217, 119, 6, 0.12)" : "rgba(245, 158, 11, 0.12)",
          midFill: isLightMode ? "rgba(217, 119, 6, 0.06)" : "rgba(245, 158, 11, 0.07)",
          midStroke: isLightMode ? "rgba(217, 119, 6, 0.22)" : "rgba(245, 158, 11, 0.22)",
          frontFill: isLightMode ? "rgba(217, 119, 6, 0.1)" : "rgba(217, 119, 6, 0.13)",
          frontStroke: isLightMode ? "rgba(217, 119, 6, 0.6)" : "rgba(217, 119, 6, 0.55)",
          particle: isLightMode ? "#d97706" : "#fb923c",
          glow: isLightMode ? "rgba(217, 119, 6, 0.15)" : "rgba(217, 119, 6, 0.25)"
        };
      }

      // Draw global diffuse backlight
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 78, 0, Math.PI * 2);
      ctx.fillStyle = colors.backFill;
      ctx.shadowBlur = 40;
      ctx.shadowColor = colors.glow;
      ctx.fill();
      ctx.restore();

      // Spline shape generator
      const drawLayer = (baseRadius: number, scale: number, fill: string, stroke: string, offset: number) => {
        ctx.beginPath();
        const pointsCount = 8;
        const pts: Array<{ x: number; y: number }> = [];

        for (let i = 0; i < pointsCount; i++) {
          const angle = (i * Math.PI * 2) / pointsCount;
          const wave = Math.sin(angle * 3.2 + time * 0.022 + offset) * 11 + 
                       Math.cos(angle * 1.8 - time * 0.016 + offset * 1.3) * 7;
          const r = baseRadius * scale + wave;
          pts.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r
          });
        }

        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < pointsCount; i++) {
          const curr = pts[i];
          const next = pts[(i + 1) % pointsCount];
          const mx = (curr.x + next.x) / 2;
          const my = (curr.y + next.y) / 2;
          ctx.quadraticCurveTo(curr.x, curr.y, mx, my);
        }
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };

      // Draw 3 nested blending fluid layers
      drawLayer(85, 1.25, colors.backFill, colors.backStroke, 0);
      drawLayer(85, 1.0, colors.midFill, colors.midStroke, Math.PI / 3);
      
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.frontStroke;
      drawLayer(85, 0.82, colors.frontFill, colors.frontStroke, Math.PI);
      ctx.restore();

      // Particles emission
      ctx.save();
      particlesRef.current.forEach(p => {
        p.radius += p.speed;
        p.angle += p.spin;

        const limit = 140;
        const visibility = Math.max(0, 1 - (p.radius / limit));
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(px, py, p.size * visibility, 0, Math.PI * 2);
        ctx.fillStyle = colors.particle;
        ctx.globalAlpha = p.alpha * visibility;
        ctx.shadowBlur = 5;
        ctx.shadowColor = colors.particle;
        ctx.fill();

        if (p.radius > limit) {
          p.radius = 12 + Math.random() * 12;
          p.angle = Math.random() * Math.PI * 2;
          p.alpha = 0.25 + Math.random() * 0.65;
        }
      });
      ctx.restore();

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [health, warningCount, criticalCount, isLightMode]);

  return (
    <canvas 
      ref={canvasRef} 
      width={320} 
      height={320} 
      className="w-full h-full object-contain pointer-events-none relative z-0" 
    />
  );
};

interface CommandCenterProps {
  devices: Device[];
  logs: SystemLog[];
  onSelectDevice: (device: Device) => void;
  onClearAlert: (logId: string) => void;
  onNavigateToTab?: (tabId: string) => void;
  isLightMode?: boolean;
  onToggleLightMode?: () => void;
}

export const CommandCenterPage: React.FC<CommandCenterProps> = ({ 
  devices, 
  logs, 
  onSelectDevice, 
  onClearAlert,
  onNavigateToTab,
  isLightMode: externalIsLightMode,
  onToggleLightMode
}) => {
  // Current active viewport switcher right in the central cockpit deck
  const [activeSubTab, setActiveSubTab] = useState<"sante_connect" | "overview" | "globe" | "quantum" | "dataflow" | "perimeter">("sante_connect");
  
  // Custom Local Light Mode Toggle with global priority
  const [localIsLightMode, setLocalIsLightMode] = useState<boolean>(true);
  const isLightMode = externalIsLightMode !== undefined ? externalIsLightMode : localIsLightMode;
  const toggleLightMode = onToggleLightMode || (() => setLocalIsLightMode(!localIsLightMode));

  // States for interactive simulations within bento blocks
  const [isLoadTesting, setIsLoadTesting] = useState<boolean>(false);
  const [simulatedCpuLoad, setSimulatedCpuLoad] = useState<number | null>(null);
  const [resonanceFrequency, setResonanceFrequency] = useState<number>(45);
  const [isQuarantineScanning, setIsQuarantineScanning] = useState<boolean>(false);
  const [quarantineProgress, setQuarantineProgress] = useState<number>(0);
  const [activeDefrag, setActiveDefrag] = useState<boolean>(false);
  const [defragProgress, setDefragProgress] = useState<number>(100);

  const totalCount = devices.length || 1;
  const onlineCount = devices.filter(d => d.status === "online").length;
  const warningCount = devices.filter(d => d.status === "warning").length;
  const offlineCount = devices.filter(d => d.status === "offline").length;

  const activeCriticalIncidents = logs.filter(
    log => log.level === "critical" || log.level === "warning"
  );
  const activeCriticalCount = activeCriticalIncidents.length;

  const totalCompliantPercent = Math.round(
    devices.reduce((acc, d) => acc + d.policyCompliance, 0) / totalCount
  );

  const meanCpu = simulatedCpuLoad !== null ? simulatedCpuLoad : Math.round(
    devices.filter(d => d.status !== "offline").reduce((acc, d) => acc + d.cpu, 0) /
    (devices.filter(d => d.status !== "offline").length || 1)
  );

  const meanRam = Math.round(
    devices.filter(d => d.status !== "offline").reduce((acc, d) => acc + d.ram, 0) /
    (devices.filter(d => d.status !== "offline").length || 1)
  );

  // Dynamic simulation effects
  useEffect(() => {
    let timer: any;
    if (isLoadTesting) {
      setSimulatedCpuLoad(85);
      timer = setTimeout(() => {
        setIsLoadTesting(false);
        setSimulatedCpuLoad(null);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [isLoadTesting]);

  useEffect(() => {
    let interval: any;
    if (isQuarantineScanning) {
      interval = setInterval(() => {
        setQuarantineProgress(prev => {
          if (prev >= 100) {
            setIsQuarantineScanning(false);
            return 0;
          }
          return prev + 10;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isQuarantineScanning]);

  useEffect(() => {
    let interval: any;
    if (activeDefrag) {
      interval = setInterval(() => {
        setDefragProgress(prev => {
          if (prev <= 10) {
            setActiveDefrag(false);
            return 100;
          }
          return prev - 15;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [activeDefrag]);

  // Determine overall fleet status
  let fleetStatus = "Optimal";
  let fleetColor = "text-[#10b981]";
  let labelBg = "bg-emerald-500/10 text-emerald-500 border border-emerald-400/20";
  
  if (activeCriticalCount > 1 || warningCount > 1) {
    fleetStatus = "Degraded";
    fleetColor = "text-[#f43f5e]";
    labelBg = "bg-rose-500/10 text-rose-500 border border-rose-400/20";
  } else if (warningCount > 0 || activeCriticalCount > 0) {
    fleetStatus = "Sec Alert";
    fleetColor = "text-[#f59e0b]";
    labelBg = "bg-amber-500/10 text-amber-500 border border-amber-400/20";
  }

  return (
    <div 
      className={`relative p-6 lg:p-8 rounded-[2.5rem] border transition-all duration-300 min-h-full font-sans overflow-hidden ${
        isLightMode 
          ? "bg-[#FAF9F5] text-stone-900 border-stone-200/90 shadow-[0_15px_45px_rgba(0,0,0,0.06)]"
          : "bg-[#0b0c10] text-slate-100 border-slate-900 shadow-[0_20px_55px_rgba(0,0,0,0.45)]"
      }`}
    >
      {/* Absolute Ambient grids for professional architect paper vibe */}
      <div className={`absolute inset-0 pointer-events-none opacity-40 z-0 ${
        isLightMode 
          ? "bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]" 
          : "bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:20px_20px]"
      }`} />

      {/* Floating Ambient Orb Glow */}
      <div className={`absolute left-1/3 top-1/4 w-[350px] h-[350px] rounded-full blur-[110px] pointer-events-none transition-colors duration-1000 ${
        isLightMode ? "bg-stone-200/40" : "bg-cyan-500/5"
      }`} />

      {/* ELITE ARCHITECT TONAL HEADER BLOCK */}
      <div className={`flex flex-col xl:flex-row xl:items-center justify-between gap-5 border-b pb-5 mb-6 relative z-10 text-left ${
        isLightMode ? "border-stone-200" : "border-slate-800"
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isLightMode ? "bg-[#0f4c81]" : "bg-cyan-400"} animate-pulse`} />
            <span className={`text-[9px] font-mono font-bold tracking-widest uppercase ${
              isLightMode ? "text-[#0f4c81]" : "text-cyan-400"
            }`}>
              SYSTEM INTEGRITY CONTROL • CLINICAL ARCHITECTURE
            </span>
          </div>
          <h1 className={`text-xl font-black tracking-tight uppercase leading-none ${
            isLightMode ? "text-stone-900" : "text-white"
          }`}>
            ATELIER COCKPIT • PORTAL PRINCIPAL
          </h1>
          <p className={`text-[9.5px] mt-1 font-mono uppercase tracking-wider ${
            isLightMode ? "text-stone-500" : "text-slate-400"
          }`}>
            Sovereign Health Node & Cybernetic Command Matrix
          </p>
        </div>

        {/* Global theme preset toggle button and metadata */}
        <div className="flex flex-wrap items-center gap-3 relative z-20">
          <button
            onClick={toggleLightMode}
            className={`px-3 py-1.5 border rounded-xl font-mono text-[9px] uppercase tracking-widest font-black transition-all flex items-center gap-2 cursor-pointer ${
              isLightMode 
                ? "bg-stone-900 border-stone-800 text-stone-100 hover:bg-stone-800" 
                : "bg-stone-100 border-stone-200 text-stone-900 hover:bg-zinc-200"
            }`}
          >
            {isLightMode ? (
              <>
                <Moon className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Obsidian Deep Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Atelier Alabaster</span>
              </>
            )}
          </button>

          <div className="hidden xl:flex flex-col text-right font-mono text-[8px] uppercase leading-none select-none text-stone-400">
            <span>[TÊTE DE RÉSEAU: SEC-OS_X3]</span>
            <span className="mt-0.5">[TEMPS DE CYCLE: REAL-TIME]</span>
          </div>
        </div>
      </div>

      {/* BLOCK 1: STATUS PERIMETER - COMPACT ARCHITECTURAL CONTROL PERIMETER */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border rounded-3xl mb-6 relative z-10 text-left select-none ${
        isLightMode 
          ? "bg-stone-50 border-stone-200/80" 
          : "bg-slate-950/40 border-slate-800"
      }`}>
        {/* Metric 1: Core Alignment Factor */}
        <div className="space-y-1.5 p-2 rounded-xl transition-all">
          <span className={`text-[8.5px] font-mono block font-black uppercase tracking-wider ${
            isLightMode ? "text-[#0f4c81]" : "text-cyan-400"
          }`}>
            01 • Alignment Factor
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-xl font-sans font-black ${isLightMode ? "text-stone-900" : "text-white"}`}>
              {totalCompliantPercent}%
            </h2>
            <span className={`text-[8.5px] font-mono font-bold leading-none uppercase ${fleetColor}`}>
              ({fleetStatus})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              fleetStatus === "Optimal" ? "bg-emerald-500" : fleetStatus === "Degraded" ? "bg-rose-500" : "bg-amber-500"
            } animate-pulse`} />
            <span className="text-[9px] text-stone-400 uppercase font-mono tracking-tight font-black">
              System Alignment nominal
            </span>
          </div>
        </div>

        {/* Metric 2: Clinical Connectivity */}
        <div className="space-y-1.5 p-2 rounded-xl border-l pl-4 border-dashed transition-all border-stone-200 dark:border-slate-800">
          <span className="text-[8.5px] font-mono block text-stone-400 font-black uppercase tracking-wider">
            02 • Sensor Nodes
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-xl font-sans font-black ${isLightMode ? "text-stone-900" : "text-white"}`}>
              {onlineCount} <span className="text-xs text-stone-400">/ {devices.length}</span>
            </h2>
            <span className="text-[8.5px] text-emerald-500 font-mono font-bold">LIVE ON</span>
          </div>
          <p className="text-[9.5px] text-stone-400 font-mono leading-none">
            Attn: <strong className="text-amber-500">{warningCount}</strong> · Standby: <strong className="text-stone-400">{offlineCount}</strong>
          </p>
        </div>

        {/* Metric 3: Hypervisor Load */}
        <div className="space-y-1.5 p-2 rounded-xl border-l pl-4 border-dashed transition-all border-stone-200 dark:border-slate-800">
          <span className="text-[8.5px] font-mono block text-stone-400 font-black uppercase tracking-wider">
            03 • Hardware Load
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-xl font-sans font-black ${isLightMode ? "text-stone-900" : "text-white"}`}>
              {meanCpu}% <span className="text-xs text-stone-400">CPU</span>
            </h2>
            <span className="text-[9px] text-[#22d3ee] dark:text-cyan-400 font-mono">Stable</span>
          </div>
          <div className="w-full h-1 bg-stone-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isLoadTesting ? "bg-amber-500 animate-pulse" : "bg-cyan-505 bg-[#0a6eb3] dark:bg-cyan-400"}`} 
              style={{ width: `${meanCpu}%` }} 
            />
          </div>
        </div>

        {/* Metric 4: Alert Sonar sentries */}
        <div className="space-y-1.5 p-2 rounded-xl border-l pl-4 border-dashed transition-all border-stone-200 dark:border-slate-800">
          <span className="text-[8.5px] font-mono block text-stone-400 font-black uppercase tracking-wider">
            04 • Cyber sentries
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-xl font-sans font-black ${
              activeCriticalCount > 0 ? "text-rose-500 animate-pulse" : isLightMode ? "text-stone-900" : "text-white"
            }`}>
              {activeCriticalCount} ALARM{activeCriticalCount !== 1 ? "S" : ""}
            </h2>
          </div>
          <p className="text-[9.5px] text-stone-400 font-mono leading-none">
            Status: <span className={activeCriticalCount > 0 ? "text-rose-500 font-bold" : "text-emerald-500 font-bold"}>
              {activeCriticalCount > 0 ? "ATTACK ALERT" : "ZERO THREAT"}
            </span>
          </p>
        </div>

        {/* Metric 5: Operation Optimizer Index */}
        <div className="space-y-1.5 p-2 rounded-xl border-l pl-4 border-dashed transition-all border-stone-200 dark:border-slate-800">
          <span className="text-[8.5px] font-mono block text-stone-400 font-black uppercase tracking-wider">
            05 • Efficiency Optimizer
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-xl font-sans font-black ${isLightMode ? "text-stone-900" : "text-white"}`}>
              99.5%
            </h2>
            <span className="text-[8.5px] text-stone-400 font-mono font-bold">EFF RATE</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[9px] text-stone-400">
            <Database className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span>Throughput: 1.84 TB/s</span>
          </div>
        </div>
      </div>

      {/* COCKPIT SUBTAB SELECTOR DECK - Swaps visual interfaces seamlessly */}
      <div className={`flex flex-wrap justify-between items-center gap-3 p-1.5 border rounded-2xl mb-6 relative z-10 shadow-sm ${
        isLightMode ? "bg-stone-100/60 border-stone-200/90" : "bg-[#150a36]/90 border-slate-800"
      }`}>
        <div className="flex flex-wrap gap-1">
          {[
            { id: "sante_connect", label: "🏥 01 • Santé Connect V2", icon: Activity },
            { id: "overview", label: "02 • Overview Cockpit Matrix", icon: Server },
            { id: "globe", label: "03 • Global 3D World Grid", icon: Globe },
            { id: "quantum", label: "04 • Quantum Core Hardware", icon: BrainCircuit },
            { id: "dataflow", label: "05 • Connection Flow Signals", icon: Workflow },
            { id: "perimeter", label: "06 • Security Threat Sonar", icon: ShieldCheck }
          ].map(sub => {
            const SubIcon = sub.icon;
            const isActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[10.5px] uppercase tracking-wider transition-all duration-205 cursor-pointer ${
                  isActive 
                    ? isLightMode
                      ? "bg-white border-stone-300 text-stone-900 font-extrabold shadow-[0_3px_12px_rgba(0,0,0,0.04)]"
                      : "bg-slate-950 border-cyan-400/30 text-cyan-400 font-black shadow-[0_0_12px_rgba(34,211,238,0.2)]" 
                    : isLightMode
                      ? "bg-transparent border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-200/40"
                      : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-900/30"
                }`}
              >
                <SubIcon className={`w-3.5 h-3.5 ${isActive ? (isLightMode ? "text-[#0f4c81]" : "text-[#22d3ee] drop-shadow-[0_0_4px_#22d3ee]") : (isLightMode ? "text-stone-400" : "text-slate-500")}`} />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC Inner Cockpit content rendering depending on selection */}
      <div className="transition-all duration-300 relative z-10">
        
        {/* TAB 1: SANTE CONNECT V2 */}
        {activeSubTab === "sante_connect" && (
          <SanteConnectV2 
            devices={devices} 
            logs={logs} 
            onSelectDevice={onSelectDevice}
            onClearAlert={onClearAlert}
            onNavigateToTab={(tabId) => {
              if (tabId === "overview_system") {
                setActiveSubTab("overview");
              } else if (onNavigateToTab) {
                onNavigateToTab(tabId);
              }
            }}
          />
        )}

        {/* TAB 2: OVERVIEW COCKPIT - COMPLETELY CONVERTED TO BENTO ARCHITECTURAL GRID */}
        {activeSubTab === "overview" && (
          <div className="space-y-6">
            <div className={`border-l-2 pl-4 py-1 mb-4 text-left ${isLightMode ? "border-stone-400" : "border-cyan-400"}`}>
              <p className="font-mono text-[9px] text-stone-400 uppercase tracking-widest leading-none">[SOVEREIGN OVERVIEW CLUSTER]</p>
              <h2 className={`text-base font-bold uppercase tracking-tight ${isLightMode ? "text-stone-950" : "text-white"}`}>
                Tactical Hypervisor Analytics
              </h2>
              <p className="text-stone-400 text-[11px] mt-0.5 max-w-2xl font-sans">
                Real-time bento nodes representing aggregated diagnostic and physical metrics. Each card presents dynamic triggers for simulation and manual override.
              </p>
            </div>

            {/* BENTO ARCHITECTURAL GRID STRUCTURE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-auto items-stretch">
              
              {/* BENTO BOX 1: SENSOR TELEMETRY CONFIG (Col span: 4) */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between text-left transition-all hover:scale-[1.015] duration-300 lg:col-span-4 ${
                isLightMode 
                  ? "bg-white border-stone-200/90 shadow-[0_5px_15px_rgba(0,0,0,0.02)]" 
                  : "bg-slate-950/45 border-slate-800 hover:border-slate-700/80"
              }`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[8.5px] font-mono font-bold tracking-widest text-stone-400 block uppercase">
                      [CELL-A / HUB NODES]
                    </span>
                    <Server className={`w-4 h-4 ${isLightMode ? "text-[#0f4c81]" : "text-cyan-400"}`} />
                  </div>
                  <h3 className={`text-xs font-black uppercase tracking-wider mb-2 ${isLightMode ? "text-stone-900" : "text-white"}`}>
                    Active Host Relays Matrix
                  </h3>
                  <p className="text-[11px] text-stone-400 leading-normal mb-4 font-sans">
                    Sub-systems matched for clinical tasks. Double path tethering is enforced to lock down private medical records.
                  </p>

                  <div className="space-y-2 font-mono text-[10.5px]">
                    <div className="flex justify-between border-b pb-1 border-stone-200/60 dark:border-slate-850">
                      <span className="text-stone-400">Total Host Relays:</span>
                      <span className={`font-bold ${isLightMode ? "text-stone-900" : "text-white"}`}>{devices.length}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-stone-200/60 dark:border-slate-850">
                      <span className="text-stone-400">Online Controllers:</span>
                      <span className="text-emerald-500 font-bold">{onlineCount}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-stone-200/60 dark:border-slate-850">
                      <span className="text-stone-400">Physical Sideload:</span>
                      <span className="text-amber-500 font-bold">{warningCount} Devices</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Airgapped/Standby:</span>
                      <span className="text-stone-400 font-bold">{offlineCount}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      if (onNavigateToTab) {
                        onNavigateToTab("health-matrix");
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isLightMode 
                        ? "bg-stone-900 hover:bg-stone-800 text-stone-100" 
                        : "bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span>View Node Health Matrix</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* BENTO BOX 2: COOPERATIVE PHYSICAL PRESSURE (Col span: 4) */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between text-left transition-all hover:scale-[1.015] duration-300 lg:col-span-4 ${
                isLightMode 
                  ? "bg-white border-stone-200/90 shadow-[0_5px_15px_rgba(0,0,0,0.02)]" 
                  : "bg-slate-950/45 border-slate-800 hover:border-slate-700/80"
              }`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[8.5px] font-mono font-bold tracking-widest text-[#0f4c81] dark:text-cyan-400 block uppercase">
                      [CELL-B / STRESS FLOW]
                    </span>
                    <Activity className={`w-4 h-4 ${isLoadTesting ? "animate-pulse text-rose-500" : "text-stone-450"}`} />
                  </div>
                  <h3 className={`text-xs font-black uppercase tracking-wider mb-2 ${isLightMode ? "text-stone-900" : "text-white"}`}>
                    Dynamic Hardware Intake
                  </h3>
                  <p className="text-[11px] text-stone-400 leading-normal mb-4 font-sans">
                    Physical intake metrics representing CPU cycle calculations and buffer memory loads. Trigger a simulated load step-adjustment.
                  </p>

                  <div className="space-y-4">
                    {/* CPU Progress */}
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-stone-400 mb-1">
                        <span>AVERAGE SYSTEM CPU:</span>
                        <span className={`font-bold ${isLoadTesting ? "text-amber-500 animate-pulse" : "text-stone-800 dark:text-white"}`}>
                          {meanCpu}% {isLoadTesting ? "[HIGH STRESS]" : "[STABLE]"}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-stone-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${isLoadTesting ? "bg-amber-500 animate-pulse" : "bg-[#0b6eb0] dark:bg-cyan-400"}`} 
                          style={{ width: `${meanCpu}%` }}
                        />
                      </div>
                    </div>

                    {/* RAM Progress */}
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-stone-400 mb-1">
                        <span>RAM ALLOCATION BUFFER:</span>
                        <span className="font-bold text-stone-880 dark:text-white">{meanRam}%</span>
                      </div>
                      <div className="h-2 w-full bg-stone-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500" 
                          style={{ width: `${meanRam}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-slate-800">
                  <button
                    onClick={() => setIsLoadTesting(!isLoadTesting)}
                    className={`w-full py-2 border rounded-xl font-mono text-[9px] uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isLoadTesting 
                        ? "bg-rose-600 text-white animate-pulse border-rose-500" 
                        : isLightMode
                          ? "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200"
                          : "bg-slate-900 hover:bg-slate-850 text-stone-300 border border-slate-800"
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${isLoadTesting ? "text-white animate-spin" : "text-amber-500"}`} />
                    <span>{isLoadTesting ? "Release stress simulation" : "Run physical stress test"}</span>
                  </button>
                </div>
              </div>

              {/* BENTO BOX 3: PERFORMANCE OPTIMIZER INDEX (Col span: 4) */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between text-left transition-all hover:scale-[1.015] duration-300 lg:col-span-4 ${
                isLightMode 
                  ? "bg-white border-stone-200/90 shadow-[0_5px_15px_rgba(0,0,0,0.02)]" 
                  : "bg-slate-950/45 border-slate-800 hover:border-slate-700/80"
              }`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[8.5px] font-mono font-bold tracking-widest text-stone-400 block uppercase">
                      [CELL-C / ENGINE DEFRAG]
                    </span>
                    <Settings2 className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className={`text-xs font-black uppercase tracking-wider mb-2 ${isLightMode ? "text-stone-900" : "text-white"}`}>
                    System Optimization Engine
                  </h3>
                  <p className="text-[11px] text-stone-400 leading-normal mb-4 font-sans">
                    Aggregated tuning coefficients ensuring low-latency communication. Initiate defragmentation of telemetry caches.
                  </p>

                  <div className="space-y-2 font-mono text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Defrag Index:</span>
                      <span className="font-bold text-[#0a6ea1] dark:text-cyan-400">
                        {activeDefrag ? `DEFRAGGING ${defragProgress}%` : "100.0% OPTIMAL"}
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-200" 
                        style={{ width: `${activeDefrag ? defragProgress : 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between pt-1 text-stone-400">
                      <span>Response Coefficient:</span>
                      <span className="font-bold text-emerald-500">1.02 ms (Avg)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setActiveDefrag(true);
                      setDefragProgress(100);
                    }}
                    disabled={activeDefrag}
                    className="w-full py-2 px-3 bg-[#0f4c81]/10 hover:bg-[#0f4c81]/15 text-[#0f4c81] border border-[#0f4c81]/20 rounded-xl font-mono text-[9px] uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${activeDefrag ? "animate-spin" : ""}`} />
                    <span>Defragment Caches</span>
                  </button>
                </div>
              </div>

              {/* BENTO BOX 4: SOVEREIGN RE-RESONANCE ORB (Col span: 8, Row span: 2 CENTERPIECE) */}
              <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center gap-6 text-left transition-all duration-300 lg:col-span-8 ${
                isLightMode 
                  ? "bg-white border-stone-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.03)]" 
                  : "bg-slate-950/40 border-slate-800"
              }`}>
                {/* Visual Orb rendering column */}
                <div className="relative flex items-center justify-center w-60 h-60 shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <FluidBlobCanvas 
                      health={totalCompliantPercent} 
                      warningCount={warningCount} 
                      criticalCount={activeCriticalCount} 
                      isLightMode={isLightMode}
                    />
                  </div>

                  {/* Outer dynamic orbiting dashed ring */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-stone-300 dark:border-cyan-500/10 flex items-center justify-center p-4">
                    <div className="w-full h-full rounded-full border border-double border-stone-200 dark:border-cyan-500/5" />
                  </div>

                  {/* Core Text Info Panel */}
                  <div className={`relative text-center z-20 w-36 h-36 rounded-full border flex flex-col items-center justify-center backdrop-blur-md shadow-md ${
                    isLightMode 
                      ? "bg-[#FCFCFA]/90 border-stone-200/90" 
                      : "bg-[#060a11]/90 border-cyan-500/20"
                  }`}>
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-extrabold block leading-none">Fleet Health</span>
                    <h1 className={`text-2xl font-black font-sans tracking-tight mt-1 transition-all duration-1000 ${fleetColor}`}>
                      {fleetStatus}
                    </h1>
                    <span className={`text-[8.5px] font-extrabold uppercase mt-1 px-2 py-0.5 rounded border ${labelBg}`}>
                      {totalCompliantPercent}% SEC
                    </span>
                  </div>
                </div>

                {/* Controls and sliders for Resonance and physical details */}
                <div className="flex-1 flex flex-col justify-between h-full py-1">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 bg-[#0f4c81]/10 text-[#0f4c81] dark:bg-cyan-500/10 dark:text-cyan-400 px-2.5 py-0.5 rounded-lg border border-[#0f4c81]/15 dark:border-cyan-500/15 w-fit">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span className="text-[8px] font-mono uppercase tracking-widest font-bold">
                        SOVEREIGN HARMONIC AXIS
                      </span>
                    </div>
                    <h3 className={`text-base font-black tracking-tight uppercase ${isLightMode ? "text-stone-900" : "text-white"}`}>
                      Integrated Resonance Core
                    </h3>
                    <p className="text-[11px] text-stone-400 leading-relaxed font-sans mt-2">
                      This organic fluid controller represents overall network compliance parameters. Adjust physical resonance frequencies to synchronize heartbeat frequencies.
                    </p>

                    {/* Resonance Slider Control */}
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between items-center text-[10.5px] font-mono text-stone-400">
                        <span className="flex items-center gap-1">
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          Resonance Frequency Tuning:
                        </span>
                        <span className={`font-bold ${isLightMode ? "text-[#0f4c81]" : "text-cyan-400"}`}>
                          {resonanceFrequency} Hz
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="20"
                        max="120"
                        value={resonanceFrequency}
                        onChange={(e) => setResonanceFrequency(Number(e.target.value))}
                        className="w-full accent-cyan-405 accent-[#0b6ea0]"
                      />
                      <span className="text-[9px] block text-stone-400 font-mono leading-none">
                        Re-polarizes localized telemetry signals (Simulated overlay).
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-stone-100 dark:border-slate-800 pt-3 flex flex-wrap gap-2">
                    <span className="text-[9px] font-mono leading-none tracking-wider text-slate-400 block uppercase font-bold self-center">
                      NODE STREAM LINK: Verified Secure (HSE-V2)
                    </span>
                  </div>
                </div>
              </div>

              {/* BENTO BOX 5: ACTIVE SECURITY SENTINEL SONAR (Col span: 4) */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between text-left transition-all hover:scale-[1.015] duration-300 lg:col-span-4 ${
                isLightMode 
                  ? "bg-white border-stone-200/90 shadow-[0_5px_15px_rgba(0,0,0,0.02)]" 
                  : "bg-slate-950/45 border-slate-800 hover:border-slate-700/80"
              }`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[8.5px] font-mono font-bold tracking-widest text-[#dc2626] dark:text-rose-500 block uppercase">
                      [CELL-D / RISK RADAR]
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h3 className={`text-xs font-black uppercase tracking-wider mb-2 ${isLightMode ? "text-stone-900" : "text-white"}`}>
                    Clinical Threat Sentinel
                  </h3>
                  <p className="text-[11px] text-stone-400 leading-normal mb-4 font-sans">
                    Anti-threat sentinels actively tracking rogue firmware intrusions. Trigger a diagnostic security sentry scan.
                  </p>

                  <div className="space-y-3 font-mono text-[10.5px]">
                    <div className="flex justify-between border-b pb-1 border-stone-200/60 dark:border-slate-850">
                      <span className="text-stone-400">Quarantine Status:</span>
                      <span className={`font-bold ${activeCriticalCount > 0 ? "text-rose-500 animate-pulse" : "text-emerald-500"}`}>
                        {activeCriticalCount > 0 ? "ALERTE ACTIVE" : "SECURE"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Intrusion Sentry logs:</span>
                      <span className="font-bold text-stone-700 dark:text-slate-300">
                        {isQuarantineScanning ? `Scanning ${quarantineProgress}%` : "0 Unresolved"}
                      </span>
                    </div>
                    {isQuarantineScanning && (
                      <div className="w-full bg-[#faefe5] dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: `${quarantineProgress}%` }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsQuarantineScanning(true);
                      setQuarantineProgress(0);
                    }}
                    disabled={isQuarantineScanning}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-xl font-mono text-[9px] uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{isQuarantineScanning ? "Scanning Matrix..." : "Sentry Deep Scan"}</span>
                  </button>
                </div>
              </div>

              {/* BENTO BOX 6: ACTIONABLE CYBER INCIDENTS RELAYS (Col span: 6) */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between text-left transition-all hover:scale-[1.01] duration-300 lg:col-span-6 ${
                isLightMode 
                  ? "bg-[#FAF7F0] border-stone-200/90 shadow-[0_5px_15px_rgba(0,0,0,0.015)]" 
                  : "bg-[#080d14]/75 border-slate-800/80"
              }`}>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 mb-4 gap-2 border-stone-200/60 dark:border-slate-800">
                    <div>
                      <span className="text-[8.5px] text-stone-400 block font-mono font-black uppercase tracking-wider">
                        [CELL-E / DIRECT RELAYS CHECKLIST]
                      </span>
                      <h3 className={`font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs ${isLightMode ? "text-stone-900" : "text-white"}`}>
                        <ShieldAlert className="w-4 h-4 text-rose-500" /> 
                        Actionable Cyber Alarm Incidents
                      </h3>
                    </div>
                    <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 border border-rose-500/10 px-2 py-1 rounded-md uppercase tracking-wider shrink-0 font-mono">
                      {activeCriticalCount} ACTIVE INCIDENTS
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                    {activeCriticalCount === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center font-mono">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2 animate-pulse" />
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                          Matrix Integrity Gated
                        </span>
                        <p className="text-[10px] text-stone-500 mt-1 max-w-[280px] leading-relaxed">
                          All controllers airgapped and active. Zero threat parameters recorded.
                        </p>
                      </div>
                    ) : (
                      activeCriticalIncidents.map((log) => {
                        const assocDevice = devices.find(d => d.id === log.deviceId);
                        return (
                          <div 
                            key={log.id} 
                            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 ${
                              log.level === "critical" 
                                ? "bg-rose-50/50 border-rose-200/80 dark:bg-rose-950/10 dark:border-rose-500/20" 
                                : "bg-amber-50/50 border-amber-200/80 dark:bg-amber-950/10 dark:border-amber-500/20"
                            }`}
                          >
                            <div className="min-w-0 flex-1 text-left">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`w-1.5 h-1.5 rounded-full ${log.level === "critical" ? "bg-rose-500" : "bg-amber-500"}`} />
                                <span className="font-mono text-[9px] font-black text-stone-700 dark:text-zinc-250 uppercase">
                                  {log.source}
                                </span>
                                <span className="font-mono text-[8px] text-stone-400 bg-black/10 dark:bg-black/30 px-1 py-0.5 rounded">
                                  {log.timestamp}
                                </span>
                              </div>
                              <p className={`font-mono text-[10.5px] leading-normal font-medium ${isLightMode ? "text-stone-800" : "text-zinc-300"}`}>
                                {log.message}
                              </p>
                              
                              {assocDevice && (
                                <button
                                  onClick={() => onSelectDevice(assocDevice)}
                                  className="mt-1 text-cyan-500 hover:text-cyan-700 hover:underline flex items-center gap-1 text-[9.5px] font-bold uppercase transition-all tracking-wide text-left"
                                >
                                  Trace host target ({assocDevice.name}) <ArrowRight className="w-3.5 h-3.5 text-cyan-500" />
                                </button>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                onClearAlert(log.id);
                              }}
                              className="text-[8.5px] font-mono tracking-wider bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-extrabold uppercase shrink-0"
                            >
                              Dismiss
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* BENTO BOX 7: CHRONOLOGICAL HEARTBEAT LEDGER LOGS (Col span: 6) */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between text-left transition-all hover:scale-[1.01] duration-300 lg:col-span-6 ${
                isLightMode 
                  ? "bg-[#FAF7F0] border-stone-200/90 shadow-[0_5px_15px_rgba(0,0,0,0.015)]" 
                  : "bg-[#080d14]/75 border-slate-800/80"
              }`}>
                <div>
                  <div className="flex items-center justify-between border-b pb-3 mb-4 border-stone-200/60 dark:border-slate-800">
                    <div>
                      <span className="text-[8.5px] text-stone-400 block font-mono font-black uppercase tracking-wider">
                        [CELL-F / HEARTBEAT CHRONICLE]
                      </span>
                      <h3 className={`font-extrabold flex items-center gap-2 uppercase tracking-wide text-xs ${isLightMode ? "text-stone-900" : "text-white"}`}>
                        <Layers className="w-4 h-4 text-cyan-400 animate-pulse" /> 
                        Continuous Stream Ledger
                      </h3>
                    </div>
                    <span className="text-[8px] font-bold text-stone-500 border border-stone-200 dark:border-slate-800 px-2 py-1 rounded bg-black/5 dark:bg-black/20 uppercase tracking-widest shrink-0 font-mono">
                      SOCKET STREAM OK
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                    {logs.map((log) => {
                      const badgeColors = {
                        success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/10",
                        info: "text-sky-500 bg-sky-500/10 border-sky-500/10",
                        warning: "text-amber-500 bg-amber-500/10 border-amber-500/10",
                        critical: "text-rose-500 bg-rose-500/10 border-rose-500/10"
                      };
                      return (
                        <div key={log.id} className={`flex gap-3 text-[10px] font-mono p-2 rounded-xl border bg-black/5 dark:bg-[#060a12]/50 hover:bg-black/10 dark:hover:bg-[#0c1424]/40 transition-colors duration-150 ${
                          isLightMode ? "border-stone-100" : "border-slate-900/50"
                        }`}>
                          <span className="text-stone-400 shrink-0 font-bold pt-1">{log.timestamp}</span>
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 border rounded uppercase ${badgeColors[log.status || log.level]}`}>
                                {log.level}
                              </span>
                              <span className={`font-bold tracking-tight uppercase ${isLightMode ? "text-stone-700" : "text-zinc-400"}`}>
                                {log.source}
                              </span>
                            </div>
                            <p className={`leading-normal font-medium ${isLightMode ? "text-stone-800" : "text-zinc-300"}`}>
                              {log.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: ROTATING WORLD GLOBE IN COCKPIT DECK */}
        {activeSubTab === "globe" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlobalHorizonMap devices={devices} />
          </motion.div>
        )}

        {/* TAB 4: QUANTUM NODE WIREFRAME BLUEPRINT IN COCKPIT DECK */}
        {activeSubTab === "quantum" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <QuantumNode devices={devices} />
          </motion.div>
        )}

        {/* TAB 5: CONNECTION FLOW STREAM DESIGN VIEWER IN COCKPIT DECK */}
        {activeSubTab === "dataflow" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <DataVisualizationFlow />
          </motion.div>
        )}

        {/* TAB 6: SONAR THREAT RADAR MAPS IN COCKPIT DECK */}
        {activeSubTab === "perimeter" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <SecurityPerimeter />
          </motion.div>
        )}
      </div>

    </div>
  );
};
