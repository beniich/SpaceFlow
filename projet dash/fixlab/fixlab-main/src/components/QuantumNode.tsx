import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Cpu, Activity, Zap, Server, RefreshCw, KeyRound, 
  Check, ChevronLeft, ChevronRight, Laptop, Monitor, Sparkles, AlertTriangle
} from "lucide-react";
import { Device } from "../types";

interface QuantumNodeProps {
  devices?: Device[];
}

export const QuantumNode: React.FC<QuantumNodeProps> = ({ devices = [] }) => {
  // Use provided devices, or fall back to high quality mocks if running standalone
  const defaultDevices: Device[] = [
    { id: "DEV-001", name: "Quantum Node Z-1", os: "SovereignOS", status: "online", ip: "10.0.8.101", cpu: 84, ram: 79, storage: 45, bandwidth: 120, uptime: "45d 12h", lastActive: "Just now", group: "Core", location: "Sector Alpha-7", policyCompliance: 98, serialNumber: "SN-9812-A", kernelVersion: "v7.1" },
    { id: "DEV-002", name: "Alpha Gateway SCADA", os: "SovereignOS", status: "online", ip: "10.0.8.102", cpu: 42, ram: 55, storage: 32, bandwidth: 45, uptime: "12d 4h", lastActive: "Just now", group: "Gateways", location: "Sector Beta-1", policyCompliance: 94, serialNumber: "SN-4410-B", kernelVersion: "v7.1" },
    { id: "DEV-003", name: "Refinery-01 Thermostat", os: "Linux", status: "online", ip: "10.0.9.11", cpu: 12, ram: 34, storage: 8, bandwidth: 2, uptime: "180d 1h", lastActive: "Just now", group: "IoT", location: "Refinery Central", policyCompliance: 90, serialNumber: "SN-2019-T", kernelVersion: "EmbeddedRTOS" },
    { id: "DEV-004", name: "Cleanroom Analyzer Node", os: "Linux", status: "warning", ip: "10.0.9.12", cpu: 91, ram: 96, storage: 88, bandwidth: 18, uptime: "9d 18h", lastActive: "Just now", group: "Cleanroom", location: "Cleanroom Alpha", policyCompliance: 85, serialNumber: "SN-3021-A", kernelVersion: "Linux SolidState" },
    { id: "DEV-005", name: "Tactical Vault Guard Link", os: "SovereignOS", status: "online", ip: "10.0.8.210", cpu: 18, ram: 44, storage: 12, bandwidth: 250, uptime: "201d 8h", lastActive: "Just now", group: "Security", location: "Command Core", policyCompliance: 100, serialNumber: "SN-0051-V", kernelVersion: "v7.2" },
    { id: "DEV-006", name: "Hydro Substructure Telemetry", os: "Linux", status: "offline", ip: "10.0.10.4", cpu: 0, ram: 0, storage: 15, bandwidth: 0, uptime: "0s", lastActive: "15m ago", group: "IoT", location: "Hydro Grid B", policyCompliance: 76, serialNumber: "SN-1024-H", kernelVersion: "EmbeddedRTOS" },
    { id: "DEV-007", name: "Quantum Node Z-7", os: "SovereignOS", status: "online", ip: "10.0.8.107", cpu: 98.5, ram: 94, storage: 62, bandwidth: 780, uptime: "14d 21h", lastActive: "Just now", group: "Core", location: "Sector Zenith Base", policyCompliance: 100, serialNumber: "SN-7777-Z", kernelVersion: "v7.4-Zenith" },
    { id: "DEV-008", name: "Singapore Delta Fiber Node", os: "Linux", status: "online", ip: "10.0.9.50", cpu: 67, ram: 71, storage: 21, bandwidth: 1200, uptime: "300d", lastActive: "Just now", group: "Edge", location: "Singapore Delta Hub", policyCompliance: 92, serialNumber: "SN-9050-D", kernelVersion: "BSD Nano" },
    { id: "DEV-009", name: "Syndicate Tokyo Router", os: "SovereignOS", status: "online", ip: "10.0.9.99", cpu: 55, ram: 60, storage: 40, bandwidth: 950, uptime: "84d 2h", lastActive: "Just now", group: "Edge", location: "Tokyo Node Main", policyCompliance: 95, serialNumber: "SN-4099-R", kernelVersion: "v7.0" },
    { id: "DEV-010", name: "Sovereign Core Controller", os: "SovereignOS", status: "online", ip: "10.0.8.254", cpu: 74, ram: 82, storage: 54, bandwidth: 1500, uptime: "1040d", lastActive: "Just now", group: "Core", location: "Sovereign Skybase", policyCompliance: 99, serialNumber: "SN-1000-C", kernelVersion: "v7.5" }
  ];

  const activeDeviceList = devices.length > 0 ? devices : defaultDevices;
  
  // Set default initial device state matching "Variant 7 of 10" (Z-7 is index 6, or fall back dynamically)
  const defaultIndex = activeDeviceList.findIndex(d => d.name.includes("Z-7") || d.id === "DEV-007");
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex !== -1 ? defaultIndex : 0);

  const selectedDevice = useMemo(() => {
    return activeDeviceList[activeIndex % activeDeviceList.length] || activeDeviceList[0];
  }, [activeDeviceList, activeIndex]);

  // Live dynamic telemetry fluctuations
  const [liveCpu, setLiveCpu] = useState<number>(selectedDevice.cpu);
  const [liveRam, setLiveRam] = useState<number>(selectedDevice.ram);
  const [sparkline, setSparkline] = useState<number[]>([40, 52, 45, 60, 55, 78, 70, 92, 85, selectedDevice.cpu]);

  // Handle active device changes to sync values correctly
  useEffect(() => {
    if (!selectedDevice) return;
    setLiveCpu(selectedDevice.cpu);
    setLiveRam(selectedDevice.ram);
    setSparkline(prev => {
      const generated = Array.from({ length: 11 }, (_, i) => {
        if (i === 10) return selectedDevice.cpu;
        const offset = Math.sin(i * 1.5) * 15 + 40;
        return Number(Math.max(10, Math.min(100, offset + (Math.random() - 0.5) * 10)).toFixed(0));
      });
      return generated;
    });
  }, [selectedDevice]);

  // Fluate the processing power dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedDevice.status === "offline") {
        setLiveCpu(0);
        setLiveRam(0);
        return;
      }
      setLiveCpu(prev => {
        const delta = (Math.random() - 0.5) * 2;
        const next = Math.max(5, Math.min(100, prev + delta));
        return Number(next.toFixed(1));
      });
      setLiveRam(prev => {
        const delta = (Math.random() - 0.5) * 1;
        const next = Math.max(10, Math.min(100, prev + delta));
        return Number(next.toFixed(1));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedDevice]);

  // Dynamic binary matrix background effect state
  const [matrixLines, setMatrixLines] = useState<string[]>([]);
  useEffect(() => {
    const generateMatrix = () => {
      const lines = Array.from({ length: 6 }, () => {
        return Array.from({ length: 18 }, () => Math.random() > 0.5 ? "1" : "0").join(" ");
      });
      setMatrixLines(lines);
    };
    generateMatrix();
    const int = setInterval(generateMatrix, 3000);
    return () => clearInterval(int);
  }, []);

  const handleNextVariant = () => {
    setActiveIndex(prev => (prev + 1) % activeDeviceList.length);
  };

  const handlePrevVariant = () => {
    setActiveIndex(prev => (prev - 1 + activeDeviceList.length) % activeDeviceList.length);
  };

  // SVG representation for the Sparkline chart
  const sparklinePath = useMemo(() => {
    const width = 120;
    const height = 45;
    const maxVal = 100;
    const pointsCount = sparkline.length;
    
    return sparkline.map((val, idx) => {
      const x = (idx / (pointsCount - 1)) * width;
      const y = height - (val / maxVal) * (height * 0.7) - 4;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  }, [sparkline]);

  const sparklineAreaPath = useMemo(() => {
    if (!sparklinePath) return "";
    return `${sparklinePath} L 120 45 L 0 45 Z`;
  }, [sparklinePath]);

  return (
    <div className="min-h-full bg-[#050b18] text-slate-300 p-6 md:p-10 rounded-3xl border border-white/5 relative font-sans select-none overflow-hidden shadow-3xl">
      
      {/* Immersive visual overlay decoration grids */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#38bdf8_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-5" />
      <div className="absolute right-[-10%] top-[-10%] w-[550px] h-[550px] bg-sky-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-[-5%] bottom-[-5%] w-[450px] h-[450px] bg-indigo-950/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Internal Navigation Header Simulator precisely corresponding to Dashboard mock screenshot */}
      <div className="flex justify-between items-center pb-5 mb-8 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(56,189,248,0.45)]">
            S
          </div>
          <span className="text-sm font-bold tracking-tight text-white uppercase font-mono">Sovereign Device Nexus</span>
        </div>
        <div className="hidden md:flex gap-8 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          <span className="text-white border-b border-sky-400 pb-1 cursor-pointer">Dashboard</span>
          <span className="hover:text-white transition cursor-pointer">Devices</span>
          <span className="hover:text-white transition cursor-pointer">Analytics</span>
          <span className="hover:text-white transition cursor-pointer">Settings</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Operator Console</span>
        </div>
      </div>

      {/* Main Structural Layout: 12 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: GORGEOUS 3D ISOMETRIC CYBER-HARDWARE BLUE SCHEMATIC (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#070e1b]/80 border border-white/5 p-8 rounded-2xl shadow-[inset_0_4px_30px_rgba(56,189,248,0.03)] min-h-[460px] relative overflow-hidden group">
          
          {/* Animated Matrix Vertical Scanning bars backdrop */}
          <div className="absolute right-4 top-10 flex flex-col text-[8px] font-mono text-sky-500/25 gap-1 select-none leading-none opacity-40">
            {matrixLines.map((line, idx) => (
              <div key={idx} className="tracking-wide">{line}</div>
            ))}
          </div>

          <div className="absolute left-4 bottom-10 flex flex-col text-[8px] font-mono text-indigo-400/20 gap-1 leading-none select-none">
            <div>S_KERNEL: ONWARD</div>
            <div>COMP_LEVEL: 100%</div>
            <div>STATUS: UNRESTRICTED</div>
          </div>

          {/* Animated holographic circular alignment ring beneath chassis */}
          <div className="absolute w-72 h-72 rounded-full border border-sky-500/5 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.02),transparent)] -translate-y-6 pointer-events-none" />

          {/* Holographic Glowing Server Chassis isometric drawing */}
          <div className="w-64 h-64 relative flex items-center justify-center">
            
            {/* Pulsing Backlit Aura illumination */}
            <div className="absolute w-44 h-44 rounded-full bg-sky-500/10 blur-[40px] opacity-60 animate-pulse group-hover:scale-110 transition-transform duration-700" />

            {/* Glowing isometric SVG server */}
            <svg viewBox="0 0 120 120" className="w-full h-full text-sky-400 filter drop-shadow-[0_0_18px_rgba(56,189,248,0.6)]">
              {/* Core Isometric Front Left Panel */}
              <polygon 
                points="25,45 60,30 60,85 25,100" 
                fill="#070d1a" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinejoin="round" 
                className="opacity-95"
              />
              
              {/* Isometric Top Panel */}
              <polygon 
                points="25,45 60,30 95,45 60,60" 
                fill="#091428" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeLinejoin="round" 
              />

              {/* Isometric Front Right Panel with High-Tech Slots */}
              <polygon 
                points="60,60 95,45 95,100 60,115" 
                fill="#050a14" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinejoin="round" 
              />

              {/* Inner detailed microchip grids (Hologram Laser Projection) */}
              {/* Lines on Front Left Face */}
              <line x1="32" y1="52" x2="53" y2="43" stroke="currentColor" strokeWidth="0.8" className="stroke-indigo-400/80" />
              <line x1="32" y1="65" x2="53" y2="56" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="32" cy="78" r="1.5" fill="#34d399" className="animate-ping" />
              <circle cx="32" cy="78" r="1" fill="#10b981" />
              <circle cx="48" cy="71" r="1" fill="currentColor" />

              {/* Server Vent Slots on Front Right Face */}
              <g className="text-sky-300">
                <polygon points="65,65 90,54 90,62 65,73" fill="rgba(56,189,248,0.15)" stroke="currentColor" strokeWidth="0.6" />
                <polygon points="65,77 90,66 90,74 65,85" fill="rgba(56,189,248,0.15)" stroke="currentColor" strokeWidth="0.6" />
                <polygon points="65,89 90,78 90,86 65,97" fill="rgba(56,189,248,0.15)" stroke="currentColor" strokeWidth="0.6" />
              </g>

              {/* Diagonal Neon alignment strips on top lid */}
              <line x1="40" y1="42" x2="60" y2="51" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="50" y1="37" x2="70" y2="46" stroke="#c084fc" strokeWidth="1" />

              {/* Floating laser scanner axis tracking line */}
              <motion.line 
                x1="25" y1="45" x2="95" y2="45" 
                stroke="#67e8f9" 
                strokeWidth="1" 
                animate={{ y: [0, 50, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="opacity-85 shadow-lg"
              />
            </svg>

            {/* Glowing network nodes connection circles */}
            <div className="absolute top-[37%] left-[21%] w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <div className="absolute top-[48%] left-[78%] w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            <div className="absolute top-[82%] left-[49%] w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#a855f7]" />
          </div>

          {/* Node Metadata block directly reflecting chosen variant */}
          <div className="text-center mt-6 z-10">
            <h2 className="text-2xl font-black text-white tracking-tight font-mono italic uppercase">
              {selectedDevice.name}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <span className="text-[10px] text-sky-400 font-mono tracking-widest font-bold uppercase">
                {selectedDevice.os}
              </span>
              <span className="text-slate-600">|</span>
              <span className={`text-[10px] font-bold uppercase font-mono tracking-widest ${selectedDevice.status === "online" ? "text-emerald-400 animate-pulse" : selectedDevice.status === "warning" ? "text-amber-400" : "text-rose-400"}`}>
                {selectedDevice.status}
              </span>
            </div>
            <p className="text-[9.5px] text-slate-500 font-mono mt-1 font-bold">
              IP: {selectedDevice.ip} • Loc: {selectedDevice.location}
            </p>
          </div>

        </div>

        {/* INTERMEDIATE GRACEFUL CONNECTING CABLE SVG LAYER - DYNAMIC DECORATIVE CABLE LINES (2 COLS HIDDEN ON SMALL SCREENS) */}
        <div className="hidden xl:block lg:col-span-1 h-full relative self-stretch -mx-4">
          <svg className="absolute inset-0 w-full h-full text-slate-700/40" viewBox="0 0 100 460">
            {/* Line 1 -> Card 1 Processing Power */}
            <motion.path 
              d="M 5,100 Q 50,100 50,60 T 95,60" 
              fill="none" 
              stroke="rgba(56, 189, 248, 0.4)" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            {/* Line 2 -> Card 2 Encryption Status */}
            <motion.path 
              d="M 5,200 Q 50,200 50,165 T 95,165" 
              fill="none" 
              stroke="rgba(56, 189, 248, 0.3)" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />
            {/* Line 3 -> Card 3 System Health */}
            <motion.path 
              d="M 5,300 Q 50,300 50,270 T 95,270" 
              fill="none" 
              stroke="rgba(168, 85, 247, 0.3)" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
            />
            {/* Line 4 -> Card 4 Parameter Index */}
            <motion.path 
              d="M 5,400 Q 50,400 50,380 T 95,380" 
              fill="none" 
              stroke="rgba(56, 189, 248, 0.35)" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            {/* Micro shooting light particles traversing down the cable paths */}
            <motion.circle 
              r="2" 
              fill="#38bdf8" 
              animate={{ offsetDistance: ["0%", "100%"] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{
                motionPath: "path('M 5,100 Q 50,100 50,60 T 95,60')"
              }}
            />
            <motion.circle 
              r="2.5" 
              fill="#c084fc" 
              animate={{ offsetDistance: ["0%", "100%"] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
              style={{
                motionPath: "path('M 5,300 Q 50,300 50,270 T 95,270')"
              }}
            />
          </svg>
        </div>

        {/* RIGHT COLUMN: CYBERPUNK DEEP DIVE DIAGNOSTIC PANEL STACK (7 COLS / 6 COLS WITH CABLES) */}
        <div className="lg:col-span-7 xl:col-span-6 space-y-4">
          
          {/* Card 1: Processing Power */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl overflow-hidden hover:border-[#38bdf8]/50 transition-colors backdrop-blur-md shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Processing Power</p>
                <h3 className="text-3xl font-black text-white tracking-tight mt-1 font-mono">{liveCpu}%</h3>
                <p className="text-slate-500 text-[10.5px] italic mt-0.5">Core Utilization: Peak load tracking</p>
              </div>
              <div className="p-2 sm:p-2.5 bg-sky-500/10 border border-sky-500/20 text-[#38bdf8] rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
            </div>

            {/* Render Sparkline Grid and line matching screenshot */}
            <div className="mt-4 h-12 w-full relative flex items-end">
              <svg className="w-full h-full text-sky-400 overflow-visible" viewBox="0 0 120 45">
                <defs>
                  <linearGradient id="gPowerArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference marker bounds lines */}
                <line x1="0" y1="10" x2="120" y2="10" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 3" />
                <line x1="0" y1="35" x2="120" y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 3" />
                
                {/* Visual filled gradient area chart */}
                <path d={sparklineAreaPath} fill="url(#gPowerArea)" />
                {/* Stroke line path */}
                <path d={sparklinePath} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Pulse node dot blinking on the last current item coordinate */}
                <motion.circle
                  cx="120"
                  cy={45 - (liveCpu / 100) * (45 * 0.7) - 4}
                  r="3.5"
                  className="fill-sky-400 stroke-black stroke-[1.5]"
                  animate={{ r: [3.5, 6, 3.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </svg>
            </div>
          </motion.div>

          {/* Card 2: Encryption Status */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl overflow-hidden hover:border-[#38bdf8]/50 transition-colors backdrop-blur-md shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Encryption Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-5 h-5 text-sky-400" />
                  <h3 className="text-xl font-bold text-sky-300 tracking-tight">Quantum-Resistant</h3>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] bg-sky-500/10 px-2 py-0.5 border border-sky-500/15 text-sky-400 rounded-sm font-mono uppercase">
                    ACTIVE KEY LINK
                  </span>
                  <span className="text-slate-650 text-[10px] font-mono">• Intrusion Attempts: 0</span>
                </div>
              </div>
              <div className="p-2 sm:p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-[#c084fc] rounded-xl flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: System Health */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl overflow-hidden hover:border-[#10b981]/50 transition-colors backdrop-blur-md shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">System Health</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <h3 className="text-xl font-extrabold text-white tracking-tight">Optimal</h3>
                </div>
                <p className="text-slate-500 text-[10.5px] italic mt-1.5 font-mono">
                  Temp: {selectedDevice.status === "offline" ? "0°C" : "34.5°C"} • Energy Efficiency: {selectedDevice.policyCompliance}%
                </p>
              </div>

              {/* Heartbeat EKG live monitoring visual */}
              <div className="w-24 h-10 overflow-hidden">
                <svg viewBox="0 0 100 40" className="w-full h-full text-emerald-400">
                  <motion.path 
                    d="M 0,20 L 25,20 L 30,12 L 35,28 L 40,20 L 55,20 L 60,5 L 65,35 L 70,20 L 100,20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    animate={{ pathLength: [0, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Interactive Parameter Switcher / Variant Selector */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="group relative bg-[#070e1b]/95 border border-sky-500/20 p-5 rounded-2xl backdrop-blur-lg shadow-[0_0_25px_rgba(56,189,248,0.06)]"
          >
            <div className="flex justify-between items-center text-[10.5px] text-slate-400 font-black tracking-widest uppercase mb-3">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: "6s" }} />
                <span>Variant {activeIndex + 1} of {activeDeviceList.length}</span>
              </span>
              <span className="text-sky-300 font-mono">Zenith Configuration</span>
            </div>

            {/* Custom Range Slider Simulator track */}
            <div className="h-2.5 w-full bg-slate-950 border border-white/5 rounded-full overflow-hidden flex relative items-center mb-5.5">
              <motion.div 
                className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500"
                initial={{ width: "0%" }}
                animate={{ width: `${((activeIndex + 1) / activeDeviceList.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>

            {/* Operator tactile Variant switching actions row */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevVariant}
                  className="p-2 rounded-lg bg-white/5 hover:bg-sky-500/10 hover:text-white border border-white/10 transition flex items-center justify-center cursor-pointer active:scale-95"
                  title="PREV VARIANT"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNextVariant}
                  className="p-2 rounded-lg bg-white/5 hover:bg-sky-500/10 hover:text-white border border-white/10 transition flex items-center justify-center cursor-pointer active:scale-95"
                  title="NEXT VARIANT"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                NODE SELECTED: <span className="text-white font-black">{selectedDevice.id}</span>
              </div>
            </div>

          </motion.div>

        </div>

      </div>

      {/* Persistent Outer Translucent controller bottom status bar */}
      <div className="flex justify-center mt-12 relative z-10">
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-3 bg-[#030610]/90 border border-sky-500/15 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.1)] text-[10.5px] font-bold text-slate-300 font-mono tracking-widest uppercase backdrop-blur-md"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>Live Status:</span>
          <span className="text-emerald-400">Connected</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">Last Sync: 10s ago</span>
        </motion.div>
      </div>

    </div>
  );
};
