import React, { useState, useEffect } from "react";
import { 
  Shield, Activity, BarChart3, ArrowRight, Lock, Server, Cpu, Globe, 
  Satellite, Radio, Sliders, CheckCircle, Info, Sparkles, Send, Zap, 
  ArrowLeft, CreditCard, Layers, ExternalLink, HelpCircle, HardDrive, RefreshCw, Key, Users
} from "lucide-react";

interface AtriumProps {
  isLightMode: boolean;
  onNavigate: (tabId: string) => void;
  showToast: (msg: string) => void;
  isLoggedIn: boolean;
  activeBadgeName: string;
}

export function NexusAtrium({ isLightMode, onNavigate, showToast, isLoggedIn, activeBadgeName }: AtriumProps) {
  // Navigation within the landing page for 'Solutions', 'Pricing', and 'Architecture'
  const [activeSubView, setActiveSubView] = useState<"hub" | "solutions" | "pricing" | "architecture">("hub");
  
  // Hovered state for isometric SVG nodes to show real-time live overlays
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);

  // States for interactive solutions demo
  const [bandwidthValue, setBandwidthValue] = useState<number>(75);
  const [quantumEntropy, setQuantumEntropy] = useState<number>(92);
  const [activeConnections, setActiveConnections] = useState<number>(14);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "Sovereign Core online.",
    "Quantum Entropy tap set to 92%.",
    "Node Handshake: SATELLITE_A1 synced successfully."
  ]);
  const [simulationStatus, setSimulationStatus] = useState<"IDLE" | "TESTING" | "SECURED">("IDLE");

  // States for interactive pricing tab
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<string | null>(null);

  // States for active architecture node helper
  const [selectedArchNode, setSelectedArchNode] = useState<string>("core");

  // Dynamic status update simulate
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeSubView === "solutions" && simulationStatus === "TESTING") {
        return; // handle sequence
      }
      // Add subtle noise to connections count
      setActiveConnections(prev => {
        const offset = Math.random() > 0.5 ? 1 : -1;
        const next = prev + offset;
        return next > 25 ? 20 : next < 5 ? 8 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [activeSubView, simulationStatus]);

  // Handle high security handshake simulation
  const handleTriggerSecurityHandshake = () => {
    setSimulationStatus("TESTING");
    showToast("Launching Cryptosignature challenge across sovereign nodes...");
    
    setSimulationLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Handshake Sequence Triggered by ${activeBadgeName}...`,
      ...prev
    ]);

    setTimeout(() => {
      setSimulationLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Authenticating Satellite Node Orbital-4 with Elliptic-Curve DSA...`,
        ...prev
      ]);
    }, 800);

    setTimeout(() => {
      setSimulationLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Verifying biometric credentials with clearance level... OK`,
        ...prev
      ]);
    }, 1600);

    setTimeout(() => {
      setSimulationStatus("SECURED");
      setSimulationLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ✔ INTEGRITY CHECK PASSED: FixLab environment fully sealed.`,
        ...prev
      ]);
      showToast("Handshake complete: System verified completely secure.");
    }, 2500);
  };

  const resetSimulator = () => {
    setSimulationStatus("IDLE");
    setSimulationLogs([
      "System reset. Monitoring re-initialized.",
      "Quantum Entropy tap set to 92%."
    ]);
  };

  return (
    <div className="space-y-12 relative z-10 animate-fade-in text-left">
      
      {/* Dynamic Sub-header Navigation representing the Image 9 header design */}
      <div className={`flex flex-wrap md:flex-nowrap justify-between items-center gap-4 p-4 rounded-3xl border backdrop-blur-md transition-all duration-300 ${
        isLightMode 
          ? "bg-white/80 border-stone-200/90 shadow-sm" 
          : "bg-[#0c0a1a]/60 border-neutral-900/80 shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
      }`}>
        <div 
          onClick={() => {
            setActiveSubView("hub");
            showToast("Returned to welcoming console.");
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Glowing Orange Cloud icon/logo from Image */}
          <div className="p-2.5 bg-gradient-to-tr from-[#ff3c00] to-[#ff8d00] rounded-xl border border-[#ff5a00]/30 shadow-[0_0_15px_rgba(255,90,0,0.25)] group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <span className="font-mono text-[9px] text-[#ff7e00] block tracking-[0.18em] font-black uppercase">[ FIXLAB ]</span>
            <span className={`text-sm font-sans font-black uppercase tracking-wider transition-colors ${
              isLightMode ? "text-stone-900" : "text-white"
            }`}>FixLab</span>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 md:gap-6">
          <button 
            onClick={() => { 
              setActiveSubView("solutions"); 
              showToast("Integrity Solution Console loaded."); 
            }}
            className={`text-[10px] uppercase tracking-widest font-mono font-black transition-colors px-2 py-1.5 rounded-lg ${
              activeSubView === "solutions"
                ? "text-[#ff5a00] bg-[#ff5a00]/5 border border-[#ff5a00]/10"
                : isLightMode ? "text-stone-600 hover:text-[#ff5a00]" : "text-zinc-400 hover:text-[#ff5a00]"
            }`}
          >
            Solutions
          </button>
          
          <button 
            onClick={() => { 
              setActiveSubView("pricing"); 
              showToast("Sovereign subscription matrix loaded."); 
            }}
            className={`text-[10px] uppercase tracking-widest font-mono font-black transition-colors px-2 py-1.5 rounded-lg ${
              activeSubView === "pricing"
                ? "text-[#ff5a00] bg-[#ff5a00]/5 border border-[#ff5a00]/10"
                : isLightMode ? "text-stone-600 hover:text-[#ff5a00]" : "text-zinc-400 hover:text-[#ff5a00]"
            }`}
          >
            Pricing
          </button>
          
          <button 
            onClick={() => { 
              setActiveSubView("architecture"); 
              showToast("Security architecture scheme loaded."); 
            }}
            className={`text-[10px] uppercase tracking-widest font-mono font-black transition-colors px-2 py-1.5 rounded-lg ${
              activeSubView === "architecture"
                ? "text-[#ff5a00] bg-[#ff5a00]/5 border border-[#ff5a00]/10"
                : isLightMode ? "text-stone-600 hover:text-[#ff5a00]" : "text-zinc-400 hover:text-[#ff5a00]"
            }`}
          >
            Architecture
          </button>

          <div className="flex items-center gap-2 pl-4 border-l border-neutral-800/40">
            <button 
              onClick={() => {
                onNavigate("security"); 
                showToast("Redirecting to identity security gateway.");
              }} 
              className={`text-[10px] uppercase font-mono font-bold px-4 py-2 rounded-xl transition-all border ${
                isLightMode 
                  ? "bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200" 
                  : "bg-neutral-900/60 text-zinc-300 hover:text-white hover:bg-neutral-800/80 border-neutral-800"
              }`}
            >
              Login
            </button>
            
            <button 
              onClick={() => { 
                onNavigate("security"); 
                showToast("Launching service activation wizard."); 
              }}
              className="text-[10px] font-mono font-black bg-gradient-to-r from-[#ff8d00] to-[#ff3c00] text-white px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(255,90,0,0.45)] transition-all uppercase tracking-wider"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MAIN SYSTEM HUB VIEW                                                   */}
      {/* ========================================================================= */}
      {activeSubView === "hub" && (
        <>
          {/* Main Hero Container with custom desktop outline styling matching reference */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 rounded-[2.5rem] border transition-all duration-300 relative ${
            isLightMode 
              ? "bg-[#FAF8F5] border-stone-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.03)]" 
              : "bg-gradient-to-br from-[#120f26]/90 via-[#0a0817]/95 to-[#05040a]/100 border-[#ff5a00]/10 shadow-[0_25px_60px_rgba(0,0,0,0.4)]"
          }`}>
            
            {/* Background absolute glowing point */}
            <div className="absolute right-1/4 top-1/4 w-[350px] h-[350px] bg-[#ff5a00]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute left-10 bottom-10 w-[200px] h-[200px] bg-purple-600/5 blur-[90px] rounded-full pointer-events-none" />

            {/* Left Side: Dynamic Text Controls & Badge */}
            <div className="lg:col-span-6 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#ff5a00]/10 px-4 py-1.5 rounded-full border border-[#ff5a00]/25">
                <span className="w-2 h-2 rounded-full bg-[#ff5a00] animate-ping" />
                <span className="font-mono text-[9px] uppercase text-[#ff5a00] font-black tracking-widest">
                  {isLoggedIn ? `OPERATOR IDENTIFIED: ${activeBadgeName}` : "SOVEREIGN SYSTEM PROTOCOL"}
                </span>
              </div>

              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black font-sans tracking-tight leading-[1.1] ${
                isLightMode ? "text-stone-900" : "text-white"
              }`}>
                Fix<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8d00] to-[#ff3c00] drop-shadow-[0_2px_15px_rgba(255,90,0,0.2)]">
                  Lab
                </span>
              </h2>

              <p className={`text-sm leading-relaxed max-w-md font-medium ${
                isLightMode ? "text-stone-600" : "text-zinc-400"
              }`}>
                Secure. Manage. Connect. Your FixLab Device Ecosystem.
                Establish end-to-end cryptographic tunnels, protect critical physical infrastructure nodes, and harness AI-driven real-time vector security monitoring.
              </p>

              {/* Dynamic Interactive Quick Status Board for Hub */}
              <div className={`p-4 rounded-2xl border flex flex-wrap gap-4 justify-between items-center ${
                isLightMode ? "bg-white/65 border-stone-200" : "bg-neutral-950/40 border-neutral-900"
              }`}>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Uplink Status</span>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    NOMINAL // CRYPTO-LINKED
                  </div>
                </div>
                <div className="border-l border-neutral-800/20 pl-4">
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Active Entities</span>
                  <span className={`text-xs font-bold ${isLightMode ? "text-stone-800" : "text-white"}`}>
                    {activeConnections} Sovereign Nodes
                  </span>
                </div>
                <div className="border-l border-neutral-800/20 pl-4">
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Entropy Index</span>
                  <span className="text-xs font-bold text-cyan-400">99.98% SEALED</span>
                </div>
              </div>

              {/* CTA Action Buttons styled identically to the reference screenshot */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    onNavigate("security");
                    showToast("Initializing secure framework...");
                  }}
                  className="bg-gradient-to-r from-[#ff8a00] to-[#ff3a00] hover:from-[#ff9f1a] hover:to-[#ff521a] text-white px-7 py-4 rounded-2xl text-[11px] font-mono font-black uppercase tracking-widest shadow-[0_5px_22px_rgba(255,90,0,0.3)] hover:shadow-[0_5px_30px_rgba(255,90,0,0.5)] transition-all cursor-pointer flex items-center gap-2 group border border-orange-500/10"
                >
                  Get Started 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => {
                    setActiveSubView("solutions");
                    showToast("Redirecting to security tutorials...");
                  }}
                  className={`border hover:bg-[#ff5a00]/5 px-7 py-4 rounded-2xl text-[11px] font-mono font-black uppercase tracking-widest transition-all cursor-pointer ${
                    isLightMode 
                      ? "border-stone-300 hover:border-[#ff5a00] text-[#ff5a00]" 
                      : "border-[#ff5a00]/30 hover:border-[#ff5a00]/65 text-[#ff5a00]"
                  }`}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Side: MASTERPIECE HIGH-FIDELITY ISOMETRIC SVG NETWORK CLUSTER MAP */}
            <div className="lg:col-span-6 relative flex items-center justify-center p-2 mt-6 lg:mt-0">
              
              {/* Radial gradient backing glow */}
              <div className="absolute inset-0 bg-radial-gradient from-[#ff5a00]/8 via-transparent to-transparent pointer-events-none" />

              {/* ISOMETRIC HUD BOARD BACKGROUND */}
              <div className={`p-4 rounded-3xl w-full flex flex-col items-center relative ${
                isLightMode ? "bg-white/40 border border-stone-200/50" : "bg-[#0b091c]/20 border border-neutral-900/40"
              }`}>
                
                {/* Embedded Active Node Overlay read-out (Bottom-Left Style equivalent) */}
                <div className="absolute top-4 left-4 bg-neutral-950/80 border border-neutral-900/60 px-3.5 py-2 rounded-xl text-[9px] font-mono text-zinc-400 space-y-1 backdrop-blur-md z-30 shadow-md">
                  <div className="flex items-center gap-1.5 text-[#ff7e00] font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                    SYS_GRID: TELEMETRY ACTIVE
                  </div>
                  <div>TUNNEL ENTROPY: 0.9992 bits</div>
                  <div className="text-cyan-400 font-bold">HOVER ANY NODE TO INSPECT</div>
                </div>

                {/* Main Isometric SVG */}
                <svg className="w-full h-[400px] md:h-[450px]" viewBox="0 0 540 450" fill="none">
                  <defs>
                    {/* Isometric Grid Matrix */}
                    <pattern id="isometric-matrix" width="26" height="26" patternUnits="userSpaceOnUse">
                      <path d="M 26 0 L 0 0 0 26" fill="none" stroke={isLightMode ? "rgba(100,100,100,0.03)" : "rgba(255, 90, 0, 0.04)"} strokeWidth="0.5" />
                    </pattern>
                    
                    {/* Dynamic linear color paths */}
                    <linearGradient id="laserGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff5a00" stopOpacity="0.85"/>
                      <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9"/>
                    </linearGradient>

                    <linearGradient id="serverRackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2e1a47" />
                      <stop offset="100%" stopColor="#0a0518" />
                    </linearGradient>
                  </defs>

                  {/* Draw Matrix Plane */}
                  <rect width="100%" height="100%" fill="url(#isometric-matrix)" rx="24" />

                  {/* ========================================== */}
                  {/* CENTRAL SHIELDED LAYER & RADIAL ORBIT LINES */}
                  {/* ========================================== */}
                  <ellipse cx="270" cy="220" rx="160" ry="85" stroke="rgba(255, 90, 0, 0.06)" strokeWidth="1" strokeDasharray="5,10" />
                  <ellipse cx="270" cy="220" rx="110" ry="60" stroke="rgba(255, 90, 0, 0.12)" strokeWidth="1" />
                  <ellipse cx="270" cy="220" rx="70" ry="38" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1.5" strokeDasharray="3,3" />

                  {/* ========================================== */}
                  {/* ORANGE HIGH-SPEED FIBER LINK TRACES         */}
                  {/* ========================================== */}
                  {/* Top-Left Router to Servers */}
                  <path d="M 120 140 L 270 200" stroke="url(#laserGlow)" strokeWidth="2" strokeLinecap="round" />
                  {/* Top-Right Orbital Satellite Base to Servers */}
                  <path d="M 420 140 L 270 200" stroke="url(#laserGlow)" strokeWidth="2" strokeLinecap="round" />
                  {/* Bottom-Left Dev Console Laptop to Servers */}
                  <path d="M 140 310 L 270 240" stroke="url(#laserGlow)" strokeWidth="2" strokeLinecap="round" />
                  {/* Bottom-Right Secure Node laptop to Servers */}
                  <path d="M 400 310 L 270 240" stroke="url(#laserGlow)" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Animated packets floating along links */}
                  <circle r="4" fill="#ff5e00" className="animate-pulse">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 120 140 L 270 200" />
                  </circle>
                  <circle r="3" fill="#06b6d4">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path="M 420 140 L 270 200" />
                  </circle>
                  <circle r="3.5" fill="#a855f7">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 140 310 L 270 240" />
                  </circle>
                  <circle r="4" fill="#ffa100" className="animate-spin">
                    <animateMotion dur="3.5s" repeatCount="indefinite" path="M 400 310 L 270 240" />
                  </circle>

                  {/* ========================================== */}
                  {/* NODE COMPONENT GROUPS (ISOMETRIC DRAW)     */}
                  {/* ========================================== */}

                  {/* 1. CENTRAL DOUBLE SERVER RACKS (Coordinates base CX: 270, CY: 210) */}
                  <g 
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveHoverNode("core")}
                    onMouseLeave={() => setActiveHoverNode(null)}
                  >
                    {/* Shadow underlay */}
                    <ellipse cx="270" cy="245" rx="45" ry="20" fill="rgba(255, 90, 0, 0.18)" className="blur-md animate-pulse" />
                    
                    {/* Glowing Platform Disc */}
                    <polygon points="220,230 270,255 320,230 270,205" fill="#130b2e" stroke="#ff5a00" strokeWidth="2" className="group-hover/node:stroke-rose-500 transition-colors" />
                    <polygon points="220,234 270,259 320,234 270,209" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.6" />

                    {/* Server Cabinet Left */}
                    <g transform="translate(245, 150)">
                      {/* Left Wall */}
                      <polygon points="0,50 20,60 20,10 0,0" fill="#1b1236" stroke="#581c87" strokeWidth="0.8" />
                      {/* Right Wall / Front */}
                      <polygon points="20,60 45,48 45,-2 20,10" fill="#0c071d" stroke="#ff5a00" strokeWidth="1.2" />
                      {/* Roof Face */}
                      <polygon points="0,0 20,10 45,-2 25,-12" fill="#321e5d" stroke="#581c87" strokeWidth="0.8" />
                      {/* LED Dashboard Indicators on face */}
                      <circle cx="28" cy="18" r="1.5" fill="#ff5a00" className="animate-ping" />
                      <circle cx="28" cy="18" r="1.5" fill="#ff5e00" />
                      <circle cx="34" cy="15" r="1.2" fill="#00ffff" />
                      <circle cx="28" cy="28" r="1.5" fill="#22c55e" />
                      <circle cx="34" cy="25" r="1.2" fill="#22c55e" />
                      <circle cx="28" cy="38" r="1.5" fill="#ff5a00" />
                      <circle cx="34" cy="35" r="1.2" fill="#00ffff" />
                    </g>

                    {/* Server Cabinet Right */}
                    <g transform="translate(275, 165)">
                      {/* Left Wall */}
                      <polygon points="0,50 20,60 20,10 0,0" fill="#1e133c" stroke="#581c87" strokeWidth="0.8" />
                      {/* Right Wall / Front */}
                      <polygon points="20,60 45,48 45,-2 20,10" fill="#0a0518" stroke="#ff5a00" strokeWidth="1.2" />
                      {/* Roof Face */}
                      <polygon points="0,0 20,10 45,-2 25,-12" fill="#361f63" stroke="#581c87" strokeWidth="0.8" />
                      {/* LED Dashboard Indicators on face */}
                      <circle cx="28" cy="18" r="1.5" fill="#00ffff" className="animate-pulse" />
                      <circle cx="34" cy="15" r="1.2" fill="#ff5e00" />
                      <circle cx="28" cy="28" r="1.5" fill="#22c55e" />
                      <circle cx="34" cy="25" r="1.2" fill="#22c55e" />
                      <circle cx="28" cy="38" r="1.5" fill="#ff5e00" />
                      <circle cx="34" cy="35" r="1.2" fill="#00ffff" />
                    </g>
                  </g>

                  {/* 2. TOP-LEFT ROUTER NODE (Base CX: 120, CY: 140) */}
                  <g 
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveHoverNode("router")}
                    onMouseLeave={() => setActiveHoverNode(null)}
                    transform="translate(120, 140)"
                  >
                    <ellipse cx="0" cy="5" rx="28" ry="14" fill="rgba(0, 219, 233, 0.15)" className="blur-xs" />
                    <ellipse cx="0" cy="0" rx="24" ry="12" fill="#0d0a21" stroke="#ff5a00" strokeWidth="1.5" />
                    
                    {/* Isometric Router Top Dome & Wireless Arc */}
                    <path d="M-8 -6 C-3 -15 3 -15 8 -6" stroke="#00ffff" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />
                    <path d="M-14 -10 C-5 -23 5 -23 14 -10" stroke="#00ffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                    <circle cx="0" cy="-3" r="3" fill="#ff5a00" />
                    
                    {/* Mini Antenna Indicator */}
                    <line x1="0" y1="-3" x2="0" y2="-12" stroke="#ff5a00" strokeWidth="1.5" />
                    <circle cx="0" cy="-12" r="2" fill="#ff0055" />
                  </g>

                  {/* 3. TOP-RIGHT SATELLITE DISH & ORBITING PROBE (Base CX: 420, CY: 140) */}
                  <g 
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveHoverNode("satellite")}
                    onMouseLeave={() => setActiveHoverNode(null)}
                    transform="translate(420, 140)"
                  >
                    {/* Base circle */}
                    <ellipse cx="0" cy="10" rx="30" ry="15" fill="rgba(168, 85, 247, 0.12)" />
                    <ellipse cx="0" cy="5" rx="24" ry="12" fill="#0a0518" stroke="#ff5a00" strokeWidth="1.5" />
                    
                    {/* Satellite Dish structure */}
                    <path d="M-10 -4 L0 12 L10 -4" stroke="#ff5a00" strokeWidth="1" />
                    <ellipse cx="0" cy="-8" rx="14" ry="7" fill="#140b2e" stroke="#00ffff" strokeWidth="1.5" />
                    
                    {/* Center spike receiver */}
                    <line x1="0" y1="-8" x2="0" y2="-18" stroke="#00ffff" strokeWidth="1.5" />
                    <circle cx="0" cy="-18" r="2" fill="#ff5e00" className="animate-ping" />

                    {/* Orbiting Satellite Floating probe above dish (CX: 10, CY: -45) */}
                    <g transform="translate(15, -45)" className="animate-bounce" style={{ animationDuration: '4s' }}>
                      {/* Solar panel left */}
                      <rect x="-18" y="-4" width="10" height="6" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="0.8" />
                      {/* Solar panel right */}
                      <rect x="8" y="-4" width="10" height="6" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="0.8" />
                      {/* Satellite Core Box */}
                      <rect x="-8" y="-6" width="16" height="10" rx="2" fill="#1f2937" stroke="#ff5a00" strokeWidth="1" />
                      <circle cx="0" cy="-1" r="1.5" fill="#10b981" />
                    </g>
                  </g>

                  {/* 4. BOTTOM-LEFT QUANTUM DEVELOPER CONSOLE LAPTOP (Base CX: 140, CY: 310) */}
                  <g 
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveHoverNode("laptop1")}
                    onMouseLeave={() => setActiveHoverNode(null)}
                    transform="translate(140, 310)"
                  >
                    <ellipse cx="0" cy="18" rx="35" ry="18" fill="rgba(255, 90, 0, 0.15)" className="blur-xs" />
                    
                    {/* Isometric Laptop Base Plate */}
                    <polygon points="-24,12 24,12 36,22 -12,22" fill="#130f2c" stroke="#ff5a00" strokeWidth="1.8" />
                    {/* Isometric Laptop Keyboard grid layout */}
                    <polygon points="-10,16 18,16 26,20 -2,20" fill="#0d041c" stroke="#00ffff" strokeWidth="0.8" />
                    
                    {/* Isometric Laptop Screen standing vertical */}
                    <polygon points="-24,12 24,12 18,-15 -20,-15" fill="#02010a" stroke="#ff5a00" strokeWidth="1.8" />
                    
                    {/* Glowing LED display */}
                    <polygon points="-21,9 21,9 16,-12 -17,-12" fill="#0e0423" />
                    
                    {/* Display Graphic - lines resembling graphs */}
                    <path d="M-12 5 L-5 -5 L2 2 L9 -8 L14 1" stroke="#00ffff" strokeWidth="1.2" fill="none" opacity="0.8" />
                    <circle cx="9" cy="-8" r="1.5" fill="#ff5a00" />
                  </g>

                  {/* 5. BOTTOM-RIGHT SECURE WORKSTATION LOCK LAPTOP (Base CX: 400, CY: 310) */}
                  <g 
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveHoverNode("laptop2")}
                    onMouseLeave={() => setActiveHoverNode(null)}
                    transform="translate(400, 310)"
                  >
                    <ellipse cx="0" cy="18" rx="35" ry="18" fill="rgba(88, 28, 135, 0.18)" className="blur-xs" />
                    
                    {/* Isometric Laptop Base Plate */}
                    <polygon points="-24,12 24,12 36,22 -12,22" fill="#130f2c" stroke="#ff5a00" strokeWidth="1.8" />
                    {/* Key board face */}
                    <polygon points="-10,16 18,16 26,20 -2,20" fill="#0d041c" stroke="#a855f7" strokeWidth="0.8" />
                    
                    {/* Isometric Laptop Screen */}
                    <polygon points="-24,12 24,12 18,-15 -20,-15" fill="#02010a" stroke="#ff5a00" strokeWidth="1.8" />
                    
                    {/* Glowing LED Display screen */}
                    <polygon points="-21,9 21,9 16,-12 -17,-12" fill="#02000d" />
                    
                    {/* Secure Shield graphics inside laptop display */}
                    <path d="M-3 -6 L3 -6 L5 -2 C5 2 -1 6 -3 8 C-5 6 -11 2 -11 -2 Z" fill="none" stroke="#ff5a00" strokeWidth="1.5" transform="translate(5, 1)" />
                    <circle cx="4" cy="-2" r="1.5" fill="#00ffff" />
                  </g>
                </svg>

                {/* DYNAMIC TELEMETRY POP PANEL BASED ON HOVER STATE */}
                <div className={`mt-2 p-3 w-xs rounded-xl border text-xs font-mono transition-all duration-300 ${
                  activeHoverNode 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-80 translate-y-2 scale-98"
                } ${
                  isLightMode 
                    ? "bg-white/95 border-stone-200 text-stone-800 shadow-sm" 
                    : "bg-[#0c091f]/95 border-[#ff5a00]/30 text-[#ff5e00] shadow-[0_0_20px_rgba(255,90,0,0.15)]"
                }`}>
                  {activeHoverNode === "core" && (
                    <div className="space-y-1 text-left">
                      <div className="font-bold flex items-center justify-between text-white">
                        <span>⚡ MASTER CORE CABINETS</span>
                        <span className="text-emerald-400">ACTIVE</span>
                      </div>
                      <p className="text-[10px] text-zinc-400">Two unified cluster towers administering deep package cryptographic inspection. Latency: 0.12ms.</p>
                    </div>
                  )}
                  {activeHoverNode === "router" && (
                    <div className="space-y-1 text-left">
                      <div className="font-bold flex items-center justify-between text-cyan-400">
                        <span>📡 EDGE ROUTER NODE-2</span>
                        <span className="text-cyan-400">TX_BEAMING</span>
                      </div>
                      <p className="text-[10px] text-zinc-400">Relaying local LAN subnet mesh addresses into the quantum key tap environment. Power level: 100%.</p>
                    </div>
                  )}
                  {activeHoverNode === "satellite" && (
                    <div className="space-y-1 text-left">
                      <div className="font-bold flex items-center justify-between text-yellow-400">
                        <span>🛰️ ORBIT RELAY SAT-04</span>
                        <span className="text-emerald-400">ALIGNED</span>
                      </div>
                      <p className="text-[10px] text-zinc-400">Secure high-bandwidth telemetry alignment complete. Altitude: 350km geosynchronous orbit.</p>
                    </div>
                  )}
                  {activeHoverNode === "laptop1" && (
                    <div className="space-y-1 text-left">
                      <div className="font-bold flex items-center justify-between text-[#ff5a00]">
                        <span>💻 DEV CONSOLE WRITER</span>
                        <span className="text-purple-400">CRYPTO-OK</span>
                      </div>
                      <p className="text-[10px] text-zinc-400">Active development CLI logged into port 3000. Listening to system logs streams.</p>
                    </div>
                  )}
                  {activeHoverNode === "laptop2" && (
                    <div className="space-y-1 text-left">
                      <div className="font-bold flex items-center justify-between text-white">
                        <span>🛡️ SECURITY MONITOR A</span>
                        <span className="text-emerald-400">SAFE</span>
                      </div>
                      <p className="text-[10px] text-zinc-400">Threat monitoring dashboard showing 0 alerts flag. System integrity level standard.</p>
                    </div>
                  )}
                  {!activeHoverNode && (
                    <div className="text-center text-[11px] text-zinc-400 py-1 py-1.5 font-bold flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>Hover over infrastructure nodes inside workspace</span>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* Grid of 3 Custom-styled Glass Benefit Cards replicating the bottom section of screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* Card 1: Secure Device Identity */}
            <div 
              onClick={() => {
                onNavigate("security"); 
                showToast("Accessing sovereign identity configuration matrix.");
              }}
              className={`p-6 rounded-[2rem] border transition-all duration-350 cursor-pointer shadow-[0_12px_24px_rgba(0,0,0,0.15)] text-left group hover:-translate-y-1 select-none relative overflow-hidden ${
                isLightMode 
                  ? "bg-white border-stone-200/90 hover:border-[#ff5a00]/70 hover:shadow-md" 
                  : "bg-gradient-to-b from-[#140b2a]/70 to-[#070513]/90 border-neutral-800/80 hover:border-[#ff5a00]/40"
              }`}
            >
              {/* Highlight bar base */}
              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#ff5a00] to-transparent opacity-80" />
              
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff5a00]/10 to-[#ffa100]/20 border border-[#ff5a00]/25 flex items-center justify-center text-[#ff5a00] mb-5 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,90,0,0.1)]">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className={`text-base font-black font-sans uppercase tracking-wider transition-colors ${
                isLightMode ? "text-stone-800 group-hover:text-[#ff5a00]" : "text-white group-hover:text-[#ff5a00]"
              }`}>
                Secure Device Identity
              </h4>
              <p className={`text-[12.5px] leading-relaxed mt-2.5 transition-colors ${
                isLightMode ? "text-stone-600" : "text-zinc-400"
              }`}>
                Secure device Identity to secure authority and protect them across tech apps. Endorse physical keys using elliptic-curve cryptographic tokens.
              </p>
            </div>

            {/* Card 2: Real-time Monitoring */}
            <div 
              onClick={() => {
                setActiveSubView("solutions");
                showToast("Launching real-time oscilloscope feed.");
              }}
              className={`p-6 rounded-[2rem] border transition-all duration-350 cursor-pointer shadow-[0_12px_24px_rgba(0,0,0,0.15)] text-left group hover:-translate-y-1 select-none relative overflow-hidden ${
                isLightMode 
                  ? "bg-white border-stone-200/90 hover:border-[#ff5a00]/70 hover:shadow-md" 
                  : "bg-gradient-to-b from-[#140b2a]/70 to-[#070513]/90 border-neutral-800/80 hover:border-[#e1005a]/40"
              }`}
            >
              {/* Highlight bar base */}
              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80" />

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/20 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <h4 className={`text-base font-black font-sans uppercase tracking-wider transition-colors ${
                isLightMode ? "text-stone-800 group-hover:text-purple-400" : "text-white group-hover:text-purple-400"
              }`}>
                Real-time Monitoring
              </h4>
              <p className={`text-[12.5px] leading-relaxed mt-2.5 transition-colors ${
                isLightMode ? "text-stone-600" : "text-zinc-400"
              }`}>
                Real-time monitoring to enhance your sovereign device ecosystem. Inspect packet transmission waveforms at microsecond granularity.
              </p>
            </div>

            {/* Card 3: Advanced Analytics */}
            <div 
              onClick={() => {
                setActiveSubView("architecture");
                showToast("Navigating to algorithmic analytics module.");
              }}
              className={`p-6 rounded-[2rem] border transition-all duration-350 cursor-pointer shadow-[0_12px_24px_rgba(0,0,0,0.15)] text-left group hover:-translate-y-1 select-none relative overflow-hidden ${
                isLightMode 
                  ? "bg-white border-stone-200/90 hover:border-[#ff5a00]/70 hover:shadow-md" 
                  : "bg-gradient-to-b from-[#140b2a]/70 to-[#070513]/90 border-neutral-800/80 hover:border-cyan-400/40"
              }`}
            >
              {/* Highlight bar base */}
              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent opacity-80" />

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#06b6d4]/10 to-[#3b82f6]/20 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className={`text-base font-black font-sans uppercase tracking-wider transition-colors ${
                isLightMode ? "text-stone-800 group-hover:text-cyan-400" : "text-white group-hover:text-cyan-400"
              }`}>
                Advanced Analytics
              </h4>
              <p className={`text-[12.5px] leading-relaxed mt-2.5 transition-colors ${
                isLightMode ? "text-stone-600" : "text-zinc-400"
              }`}>
                Advanced analytics to secure: determine these compliant data and analytics. Correlate historic intrusion matrices using localized AI nodes.
              </p>
            </div>

          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. SOLUTIONS HUB SIMULATOR / INTERACTIVE TOUR                              */}
      {/* ========================================================================= */}
      {activeSubView === "solutions" && (
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative text-left ${
          isLightMode 
            ? "bg-white border-stone-200 shadow-md" 
            : "bg-[#0b091f]/90 border-[#ff5a00]/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        }`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-neutral-800/20">
            <div>
              <button 
                onClick={() => setActiveSubView("hub")}
                className="flex items-center gap-2 text-xs font-mono text-[#ff7e00] hover:underline mb-2 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to System Hub
              </button>
              <h3 className={`text-2xl font-black font-sans uppercase tracking-tight ${
                isLightMode ? "text-stone-900" : "text-white"
              }`}>
                Solutions Playground & Simulator
              </h3>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">
                Active testbed representing real-time telemetry pipelines
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetSimulator}
                className="px-4 py-2 border border-neutral-800 text-zinc-400 bg-transparent hover:text-white rounded-xl font-mono text-xs uppercase"
              >
                Reset Simulator
              </button>
              
              <button
                onClick={handleTriggerSecurityHandshake}
                disabled={simulationStatus === "TESTING"}
                className="px-5 py-2.5 bg-[#ff5a00] hover:bg-[#ff7a00] text-white rounded-xl font-mono text-xs uppercase font-bold shadow-[0_0_15px_rgba(255,90,0,0.3)] disabled:opacity-50"
              >
                {simulationStatus === "TESTING" ? "Processing..." : "Trigger Security Verification"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Interactive sliders control panel */}
            <div className="lg:col-span-4 space-y-6">
              <h4 className="text-sm font-black font-mono uppercase tracking-wider text-cyan-400">
                Adjust Variables
              </h4>

              {/* Bandwidth Selector Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className={isLightMode ? "text-stone-600" : "text-zinc-400"}>SATELLITE BANDWIDTH TIER</span>
                  <span className="text-[#ff5e00] font-bold">{bandwidthValue} GiB/s</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="150" 
                  value={bandwidthValue} 
                  onChange={(e) => {
                    setBandwidthValue(Number(e.target.value));
                    setSimulationLogs(prev => [
                      `[${new Date().toLocaleTimeString()}] Bandwidth scale tweaked to ${e.target.value} GiB/s`,
                      ...prev
                    ]);
                  }}
                  className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-[#ff5a00]"
                />
                <p className="text-[10px] text-zinc-500">Limits flow spikes to avoid hardware buffer overload.</p>
              </div>

              {/* Entropy Tap */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className={isLightMode ? "text-stone-600" : "text-zinc-400"}>QUANTUM ENTROPY STRENGTH</span>
                  <span className="text-[#ff5e00] font-bold">{quantumEntropy}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={quantumEntropy} 
                  onChange={(e) => {
                    setQuantumEntropy(Number(e.target.value));
                    setSimulationLogs(prev => [
                      `[${new Date().toLocaleTimeString()}] Quantum core adjusted. Entropy strength flag: ${e.target.value}%`,
                      ...prev
                    ]);
                  }}
                  className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-[#ff5a00]"
                />
                <p className="text-[10px] text-zinc-500">Sets difficulty margin of polynomial challenge-response authenticators.</p>
              </div>

              {/* Technical indicators readout */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                isLightMode ? "bg-stone-50 border-stone-200" : "bg-neutral-950/60 border-neutral-800"
              }`}>
                <h5 className="text-[11px] font-mono font-bold text-white uppercase">Operational Readout</h5>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2 border border-neutral-900 rounded-lg">
                    <span className="text-zinc-500 block">ENCRYPTION MODE</span>
                    <span className="text-white font-bold">AES-GCM-256</span>
                  </div>
                  <div className="p-2 border border-neutral-900 rounded-lg">
                    <span className="text-zinc-500 block">HANDSHAKE KEY</span>
                    <span className="text-white font-bold">X25519-NEXUS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Central simulation graphical display and logs */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Waveform / Visual box simulation */}
              <div className={`h-[180px] rounded-2xl border relative flex items-center justify-center overflow-hidden ${
                isLightMode ? "bg-stone-100 border-stone-200" : "bg-neutral-950 border-neutral-900/60"
              }`}>
                {/* Visual state indicators */}
                {simulationStatus === "IDLE" && (
                  <div className="text-center space-y-2 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                      <Zap className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="font-mono text-xs uppercase font-extrabold text-cyan-400 tracking-wider">System Standing By ... Ready for integrity test</span>
                  </div>
                )}

                {simulationStatus === "TESTING" && (
                  <div className="text-center space-y-2 relative z-10 max-w-sm">
                    <div className="w-12 h-12 rounded-full border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400 animate-spin">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs uppercase font-black text-orange-400 tracking-widest block">CHALLENGE TRANSMITTING ...</span>
                    <p className="text-[10px] text-zinc-500">Injecting dummy intrusion pattern to verify response routing matrix.</p>
                  </div>
                )}

                {simulationStatus === "SECURED" && (
                  <div className="text-center space-y-2 relative z-10 bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/20 max-w-sm animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <span className="font-mono text-sm uppercase font-extrabold text-emerald-400 tracking-wider block">✔ GRID INTEGRITY SEALED</span>
                    <p className="text-[10px] text-zinc-400 font-mono">0 vulnerabilities spotted. Verification signature hash match. Security clearance authentic.</p>
                  </div>
                )}

                {/* Simulated grid animated backdrop */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff5a00_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              </div>

              {/* Simulated Terminal Log box */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Historical Logs Stream</span>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 h-[170px] overflow-y-auto font-mono text-[11px] text-zinc-400 space-y-2 text-left">
                  {simulationLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`pb-1 border-b border-neutral-900/40 last:border-0 ${
                        log.includes("✔") ? "text-emerald-400 font-bold" : log.includes("Handshake") ? "text-cyan-400" : ""
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PREMIUM SOLUTIONS PRICING PLANNER DECK                                 */}
      {/* ========================================================================= */}
      {activeSubView === "pricing" && (
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative text-left ${
          isLightMode 
            ? "bg-white border-stone-200 shadow-md" 
            : "bg-[#0c0a23]/90 border-purple-950/50 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        }`}>
          {/* Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
            <button 
              onClick={() => setActiveSubView("hub")}
              className="flex items-center gap-2 text-xs font-mono text-[#ff7e00] hover:underline mb-1 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to System Hub
            </button>
            <h3 className={`text-3xl font-black font-sans uppercase tracking-tight ${
              isLightMode ? "text-stone-900" : "text-white"
            }`}>
              Transparent, Scalable Sovereign Security Plans
            </h3>
            <p className={`text-sm ${isLightMode ? "text-stone-600" : "text-zinc-400"}`}>
              Secure unlimited devices, deploy cloud-hosted key registers, and integrate advanced monitoring. Switch billing intervals for discount points.
            </p>

            {/* Billing toggler */}
            <div className="bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800 flex items-center gap-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-1.5 rounded-xl font-mono text-[10px] uppercase font-bold transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-[#ff5a00] text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingPeriod("annually")}
                className={`px-4 py-1.5 rounded-xl font-mono text-[10px] uppercase font-bold transition-all flex items-center gap-1.5 ${
                  billingPeriod === "annually"
                    ? "bg-[#ff5a00] text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Annually (Save 20%)
                <span className="bg-cyan-500/10 text-cyan-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full">BEST</span>
              </button>
            </div>
          </div>

          {/* Pricing cards wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
            
            {/* Core / Base tier */}
            <div className={`p-6 rounded-[2rem] border relative flex flex-col justify-between ${
              isLightMode ? "bg-stone-50 border-stone-200" : "bg-[#080516] border-neutral-900"
            }`}>
              <div className="space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block">STANDARD LEVEL</span>
                <h4 className="text-xl font-sans font-black text-white uppercase">Sovereign Personal</h4>
                <p className="text-xs text-zinc-400">Suitable for single-node development playgrounds or basic hobbyists.</p>
                
                <div className="pt-4 pb-2">
                  <span className="text-3xl font-black font-mono text-white">$0</span>
                  <span className="text-[10px] font-mono text-zinc-500"> / perpetual license</span>
                </div>

                <div className="border-t border-neutral-900 pt-4 space-y-3 font-mono text-[11px] text-zinc-300">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Secure 2 Device identities</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Basic RSA key encryption</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Weekly static system audits</div>
                  <div className="flex items-center gap-2 text-zinc-600 line-through"><Info className="w-4 h-4" /> Real-time active stream alert</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedPlanDetails("personal");
                  showToast("Personal basic tier selected.");
                }}
                className="w-full mt-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 rounded-xl font-mono text-xs uppercase tracking-wider transition-all font-bold"
              >
                Register Free
              </button>
            </div>

            {/* Pro / Image focused design tier */}
            <div className={`p-6 rounded-[2.2rem] border-2 relative flex flex-col justify-between transition-transform transform hover:scale-101 border-[#ff5a00]/80 ${
              isLightMode ? "bg-white" : "bg-gradient-to-b from-[#1b1035] to-[#090615] shadow-[0_0_25px_rgba(255,90,0,0.15)]"
            }`}>
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ff8d00] to-[#ff3c00] text-white text-[8px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
                RECOMMENDED
              </div>

              <div className="space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#ff5e00] font-black block">PROFESSIONAL LEVEL</span>
                <h4 className="text-xl font-sans font-black text-white uppercase">Device Nexus Pro</h4>
                <p className="text-xs text-zinc-400">Perfect fit to orchestrate medium systems, small networks, or custom IoT suites.</p>
                
                <div className="pt-4 pb-2">
                  <span className="text-3xl font-black font-mono text-white">
                    {billingPeriod === "monthly" ? "$49" : "$39"}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500"> / month billed {billingPeriod}</span>
                </div>

                <div className="border-t border-neutral-900 pt-4 space-y-3 font-mono text-[11px] text-zinc-300">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Secure up to 25 hardware nodes</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Advanced Elliptic-Curve (ECC) keys</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Continuous active stream alert</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Dynamic AI threat predictive model</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Support access within 2 hours</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedPlanDetails("pro");
                  showToast("Proceeding with Device Nexus Pro checkout simulation!");
                }}
                className="w-full mt-8 py-4 bg-gradient-to-r from-[#ff8d00] to-[#ff3c00] text-white hover:opacity-90 rounded-xl font-mono text-xs uppercase tracking-widest transition-all font-black shadow-[0_0_15px_rgba(255,90,0,0.3)]"
              >
                Provision Pro Plan
              </button>
            </div>

            {/* Enterprise custom tier */}
            <div className={`p-6 rounded-[2rem] border relative flex flex-col justify-between ${
              isLightMode ? "bg-stone-50 border-stone-200" : "bg-[#080516] border-neutral-900"
            }`}>
              <div className="space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#a855f7] font-bold block">ENTERPRISE SCALE</span>
                <h4 className="text-xl font-sans font-black text-white uppercase">Sovereign Suite</h4>
                <p className="text-xs text-zinc-400">Engineered for large aerospace relays, defense, or high-value critical industrial plants.</p>
                
                <div className="pt-4 pb-2">
                  <span className="text-3xl font-black font-mono text-white">$299</span>
                  <span className="text-[10px] font-mono text-zinc-500"> / month billed flat</span>
                </div>

                <div className="border-t border-neutral-900 pt-4 space-y-3 font-mono text-[11px] text-zinc-300">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Secure UNLIMITED devices</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Proprietary customized key algorithms</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Direct satellite uplink routing priority</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#ff5a00]" /> Dedicated cyber-warfare response personnel</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedPlanDetails("enterprise");
                  showToast("Enterprise tier custom application requested!");
                }}
                className="w-full mt-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-purple-400 rounded-xl font-mono text-xs uppercase tracking-wider transition-all font-bold border border-purple-500/10"
              >
                Contact Enterprise Sec
              </button>
            </div>

          </div>

          {/* Checkout Simulator Modal Popover overlay */}
          {selectedPlanDetails && (
            <div className="mt-8 p-6 bg-neutral-950 border border-neutral-900 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-[#ff5a00]">
                  <CreditCard className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">PROVISIONING SIMULATION PREVIEW</h5>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Ready to assign plan: <strong className="text-cyan-400 font-mono text-xs uppercase">{selectedPlanDetails}</strong>. Real backend database schema sync will bind your profile badge with this licensing level.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedPlanDetails(null)}
                  className="px-4 py-2 border border-neutral-900 text-xs text-zinc-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    showToast(`Success: Certificate provisioned to active badge profile! Clearance elevated.`);
                    setSelectedPlanDetails(null);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all font-mono uppercase"
                >
                  Simulate Safe Payment
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ARCHITECTURE GRAPH EXPLAINER TAB                                       */}
      {/* ========================================================================= */}
      {activeSubView === "architecture" && (
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative text-left ${
          isLightMode 
            ? "bg-white border-stone-200 shadow-md" 
            : "bg-[#0b091f]/90 border-purple-950/40 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        }`}>
          {/* Header */}
          <div className="space-y-2 pb-6 border-b border-neutral-800/10">
            <button 
              onClick={() => setActiveSubView("hub")}
              className="flex items-center gap-2 text-xs font-mono text-[#ff7e00] hover:underline mb-1 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to System Hub
            </button>
            <h3 className={`text-2xl font-black font-sans uppercase tracking-tight ${
              isLightMode ? "text-stone-900" : "text-white"
            }`}>
              Interactive Structural Architecture Explorer
            </h3>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Review how Device Nexus constructs dynamic tunnel interfaces. Click nodes on the flow diagram inside to audit parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Visual Node Diagram Left */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Architecture network Flow chart */}
              <div className="grid grid-cols-3 gap-4 relative">
                
                {/* Horizontal line indicators */}
                <div className="absolute inset-x-8 top-[48%] h-[2px] bg-neutral-900 pointer-events-none" />
                <div className="absolute left-[30%] right-[30%] top-[48%] h-[2px] bg-gradient-to-r from-[#ff5a00] to-[#00ffff] pointer-events-none animate-pulse" />

                {/* Node 1: Edge sensor */}
                <div 
                  onClick={() => {
                    setSelectedArchNode("sensor");
                    showToast("Edge Node variables selected.");
                  }}
                  className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                    selectedArchNode === "sensor"
                      ? "border-[#ff5e00] bg-[#ff5e00]/5 scale-103"
                      : "border-neutral-900 bg-[#080514]/40 hover:border-neutral-700 hover:bg-[#0c0922]/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto mb-3">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <h5 className="font-mono text-xs font-bold text-white uppercase">Physical Edge</h5>
                  <span className="text-[9px] font-mono text-emerald-400 block mt-1">Uplink 100% OK</span>
                </div>

                {/* Node 2: Nexus Core Encrypter */}
                <div 
                  onClick={() => {
                    setSelectedArchNode("core");
                    showToast("Gateway Central orchestrator variables selected.");
                  }}
                  className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                    selectedArchNode === "core"
                      ? "border-[#ff5e00] bg-[#ff5e00]/5 scale-103"
                      : "border-neutral-900 bg-[#080514]/40 hover:border-neutral-700 hover:bg-[#0c0922]/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h5 className="font-mono text-xs font-bold text-white uppercase">Sovereign Link</h5>
                  <span className="text-[9px] font-mono text-cyan-400 block mt-1">Challenge Active</span>
                </div>

                {/* Node 3: Storage Vault */}
                <div 
                  onClick={() => {
                    setSelectedArchNode("vault");
                    showToast("Storage Vault variables selected.");
                  }}
                  className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                    selectedArchNode === "vault"
                      ? "border-[#ff5e00] bg-[#ff5e00]/5 scale-103"
                      : "border-neutral-900 bg-[#080514]/40 hover:border-neutral-700 hover:bg-[#0c0922]/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto mb-3">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <h5 className="font-mono text-xs font-bold text-white uppercase">Intrusion Vault</h5>
                  <span className="text-[9px] font-mono text-purple-400 block mt-1">Data Encrypted</span>
                </div>

              </div>

              {/* Schematic explaining diagram overlay */}
              <div className="mt-8 text-center text-xs font-mono text-zinc-500 border border-neutral-950 p-4 rounded-2xl bg-neutral-950/20">
                ⭐ <strong className="text-white">Dynamic Handshake Process</strong>: The Physical Edge submits packages stamped with localized biometric cryptokeys. The Sovereign Link central gateway validates against elliptic DSA registers before passing to the intrusion Vault for permanent cloud storage.
              </div>

            </div>

            {/* Explanation / details Right */}
            <div className="lg:col-span-5">
              <div className={`p-6 rounded-2xl border ${
                isLightMode ? "bg-stone-50 border-stone-200" : "bg-neutral-950/60 border-neutral-900"
              }`}>
                <h4 className="text-sm font-black font-mono uppercase tracking-wider text-[#ff5a00] mb-4">
                  Audit Configuration variables
                </h4>

                {selectedArchNode === "sensor" && (
                  <div className="space-y-4">
                    <h5 className="text-white font-bold font-sans uppercase text-xs">Node Detail: Physical Edge</h5>
                    <p className="text-xs text-zinc-400">
                      Edge controllers running micro-firmware directly adjacent to sensors (GPS coordinates, smart valves, satellite nodes, thermal meters).
                    </p>
                    <div className="space-y-2 border-t border-neutral-900 pt-3 text-[11px] font-mono text-zinc-400">
                      <div><strong className="text-white">Protocol</strong>: CoAP over DTLS</div>
                      <div><strong className="text-white">Hardware Module</strong>: ARM Cortex-M4 secure enclave</div>
                      <div><strong className="text-white">Vibe Checklist</strong>: Anti-tamper trigger circuit active</div>
                    </div>
                  </div>
                )}

                {selectedArchNode === "core" && (
                  <div className="space-y-4">
                    <h5 className="text-white font-bold font-sans uppercase text-xs">Node Detail: Sovereign Link Gateway</h5>
                    <p className="text-xs text-zinc-400">
                      The core orchestrator (this application dashboard!) routing and decrypting flows in atomic sandboxes. Does not retain unencrypted payload keys.
                    </p>
                    <div className="space-y-2 border-t border-neutral-900 pt-3 text-[11px] font-mono text-zinc-400">
                      <div><strong className="text-white">System Service</strong>: Express v4 container proxy</div>
                      <div><strong className="text-white">Decryption Key</strong>: Curve25519 DH Diffie-Hellman</div>
                      <div><strong className="text-white">API grounding</strong>: Gemini smart classification engine</div>
                    </div>
                  </div>
                )}

                {selectedArchNode === "vault" && (
                  <div className="space-y-4">
                    <h5 className="text-white font-bold font-sans uppercase text-xs">Node Detail: Intrusion Vault</h5>
                    <p className="text-xs text-zinc-400">
                      Firebase/Firestore cluster securing historic logging tracks, metadata registries, and diagnostic telemetry securely locked with strict security rules.
                    </p>
                    <div className="space-y-2 border-t border-neutral-900 pt-3 text-[11px] font-mono text-zinc-400">
                      <div><strong className="text-white">Database</strong>: Google Cloud Firestore</div>
                      <div><strong className="text-white">Compliance Standard</strong>: SOC2 Type II, HIPAA, GDPR compliant</div>
                      <div><strong className="text-white">Data Retention</strong>: Custom variable duration (up to 7 years)</div>
                    </div>
                  </div>
                )}

                <div className="pt-6 mt-6 border-t border-neutral-900 flex justify-end">
                  <button 
                    onClick={() => setActiveSubView("hub")}
                    className="text-xs font-mono font-bold bg-[#ff5a00]/15 hover:bg-[#ff5a00]/30 text-[#ff5e00] px-4 py-2 rounded-xl transition-all"
                  >
                    Return to Hub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
