import React, { useState, useRef, useEffect } from "react";
import { 
  Terminal as TermIcon, Cpu, Play, Search, ShieldCheck, ChevronRight, 
  Monitor, Activity, Settings, RefreshCw, Layers, Compass, 
  Laptop, ShieldAlert, Wifi, Battery, BatteryCharging, Sun, 
  Eye, EyeOff, Lock, Unlock, Keyboard, Send, CheckCircle, AlertTriangle
} from "lucide-react";
import { Device, SystemLog } from "../types";
import { GlassCard, NeonButton } from "./GlassUI";

interface RemoteTerminalProps {
  devices: Device[];
  onAddLog?: (log: SystemLog) => void;
}

export const RemoteTerminal: React.FC<RemoteTerminalProps> = ({ 
  devices,
  onAddLog
}) => {
  // Pre-select "laptops" as the active node filter to match the user's primary focus instantly!
  const [nodeFilter, setNodeFilter] = useState<"all" | "laptops" | "servers" | "network">("laptops");
  
  // Filtered devices list based on selection
  const filteredDevices = devices.filter(d => {
    if (nodeFilter === "laptops") {
      return d.name.toLowerCase().includes("laptop") || d.os === "macOS" || d.id === "DEV-049" || d.id === "DEV-050" || d.id === "DEV-051";
    }
    if (nodeFilter === "servers") {
      return d.id.includes("DEV-001") || d.id.includes("DEV-005") || d.id.includes("DEV-010") || d.os === "SovereignOS";
    }
    if (nodeFilter === "network") {
      return d.id.includes("DEV-008") || d.id.includes("DEV-009") || d.ip.startsWith("10.0.9");
    }
    return true; // "all"
  });

  // Current active mode inside the remote deck manager
  const [activeDeckMode, setActiveDeckMode] = useState<"cli" | "vnc" | "node_exporter">("vnc");
  
  // Selected device index within the current filtered scope
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0);
  
  // Resolve current active target device safely
  const currentDevice = filteredDevices[selectedDeviceIndex] || filteredDevices[0] || devices[0] || { 
    id: "DEV-049", 
    name: "LAPTOP-MACBOOK-PRO-01", 
    os: "macOS", 
    status: "online", 
    ip: "10.240.20.10", 
    cpu: 35, 
    ram: 50, 
    policyCompliance: 98,
    serialNumber: "SN-LP-MAC-775",
    kernelVersion: "Darwin 22.4.0 (macOS Ventura)"
  };

  // Hardware configuration States simulating physical control loops on the laptop
  const [screenBrightness, setScreenBrightness] = useState<number>(85);
  const [backlightOn, setBacklightOn] = useState<boolean>(true);
  const [fanSpeedBoost, setFanSpeedBoost] = useState<number>(45);
  const [shutterOpen, setShutterOpen] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [keystrokeText, setKeystrokeText] = useState<string>("");
  const [isDeployingScript, setIsDeployingScript] = useState<string | null>(null);

  // Trackpad VNC interactive coordinates state
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number }>({ x: 320, y: 180 });
  const [isDraggingTrackpad, setIsDraggingTrackpad] = useState<boolean>(false);
  const trackpadRef = useRef<HTMLDivElement>(null);

  // Terminal CLI history states
  const [history, setHistory] = useState<Array<{ cmd: string; res: string; timestamp: string }>>([
    { 
      cmd: "sys-link --device=" + currentDevice.name, 
      res: `[SUCCESS] Established Secure Remote Control session with clinical node ${currentDevice.name}.\nProtocol: Zero-Trust WebSocket over SSL\nResolution: 1920x1080@60Hz`,
      timestamp: "12:50:11"
    },
    { 
      cmd: "audit-hardware-compliance", 
      res: `[AUDIT] Model: ${currentDevice.name}\nSerial: ${currentDevice.serialNumber || "SN-UNKNOWN"}\nKernel Payload: ${currentDevice.kernelVersion || "Standard Core"}\nPolicy Alignment: ${currentDevice.policyCompliance}% optimal.`,
      timestamp: "12:51:24"
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Live frame streaming tick
  const [streamFrameCount, setStreamFrameCount] = useState(0);

  // Auto scroll CLI to bottom
  useEffect(() => {
    if (activeDeckMode === "cli") {
      consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, activeDeckMode]);

  // Simulate remote video frames update incrementer
  useEffect(() => {
    const timer = setInterval(() => {
      setStreamFrameCount(prev => (prev + 1) % 1000);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Update console logs automatically when selected target shifts
  useEffect(() => {
    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    setHistory(prev => [
      ...prev,
      {
        cmd: `connect-session --host=${currentDevice.name}`,
        res: `[TUNNEL] Rerouted secure point-to-point interface.\nAddress: ${currentDevice.ip}\nOS Environment detected: ${currentDevice.os}\nStatus: ${currentDevice.status.toUpperCase()}`,
        timestamp: time
      }
    ]);
  }, [currentDevice.id]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    let response = "";

    if (trimmed === "help" || trimmed === "?") {
      response = "Sovereign Laptop Command Instructions:\n" +
        "  help | ?                Prints this unified Laptop instruction index\n" +
        "  status                  Returns local socket, OS and remote agent status\n" +
        "  lock | unlock           Secures or unlocks the laptop physical screen\n" +
        "  backlight [on/off]      Toggles host laptop keyboard backlight arrays\n" +
        "  keysend [text]          Simulates hardware keystroke injection on host\n" +
        "  clear                   Purges command console history list";
    } else if (trimmed === "status") {
      response = `[DAEMON] Host Name: ${currentDevice.name}\n[DAEMON] Port Bindings: Host Loopback 3000 -> Active SSL Interface\n[DAEMON] Compliance: ${currentDevice.policyCompliance}% Alignment\n[DAEMON] Latency Segment: ${(Math.random() * 2 + 1.2).toFixed(2)}ms`;
    } else if (trimmed === "clear") {
      setHistory([]);
      return;
    } else if (trimmed === "lock") {
      setIsLocked(true);
      response = `[SECURITY] Screen lock activated on clinical laptop: ${currentDevice.name}\nActive Session State changed to Secured Screen Locker.`;
      triggerHostAction("Lockout Mode", "Locking display console");
    } else if (trimmed === "unlock") {
      setIsLocked(false);
      response = `[SECURITY] Access credentials dispatched. Screen lock disabled on clinical laptop: ${currentDevice.name}`;
      triggerHostAction("Session Auth", "Re-granting desktop supervisor level");
    } else if (trimmed.startsWith("backlight ")) {
      const mode = trimmed.substring(10).trim();
      if (mode === "on") {
        setBacklightOn(true);
        response = "[HARDWARE] Keyboard layout backlights set to 100% luminous flow.";
      } else if (mode === "off") {
        setBacklightOn(false);
        response = "[HARDWARE] Keyboard layout backlights disabled.";
      } else {
        response = "Syntax Error. Use: backlight [on/off]";
      }
    } else if (trimmed.startsWith("keysend ")) {
      const payload = cmdStr.substring(8).trim();
      response = `[KEYSTROKE] Virtual hardware string injected: "${payload}"\nDispatched sequence successfully to system active focus window.`;
      triggerHostAction("Keystroke Injected", `Dispatched sequence: "${payload}"`);
    } else {
      response = `Instruction unrecognized: '${trimmed}'. Type 'help' to review integrated commands index.`;
    }

    setHistory(prev => [...prev, { cmd: cmdStr, res: response, timestamp: time }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  const triggerHostAction = (actionName: string, detailString: string) => {
    const timestamp = new Date().toLocaleTimeString("en-GB", { hour12: false });
    
    // Add VNC interactive clicks trigger responses directly to terminal logs
    setHistory(prev => [...prev, { 
      cmd: `remote-trigger --event="${actionName}"`, 
      res: `[EXECUTION] Micro-agent triggered action event successfully:\nDetails: ${detailString}\nTarget Laptop Node: ${currentDevice.name}`,
      timestamp
    }]);

    if (onAddLog) {
      onAddLog({
        id: `LOG-LAPTOP-CMD-${Date.now()}`,
        timestamp,
        source: "Unified Controller",
        level: "info",
        message: `Laptop Remote Action [${actionName}]: ${detailString} executed on target client: [${currentDevice.name}]`
      });
    }
  };

  // Drag simulation handler for virtual trackpad
  const handleTrackpadPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackpadRef.current) return;
    const rect = trackpadRef.current.getBoundingClientRect();
    const xRelative = e.clientX - rect.left;
    const yRelative = e.clientY - rect.top;
    
    // Convert relative click into simulated display resolution coordinates (e.g. 1920x1080)
    const xSimulated = Math.round((xRelative / rect.width) * 1920);
    const ySimulated = Math.round((yRelative / rect.height) * 1080);
    
    setMouseCoords({ x: xSimulated, y: ySimulated });
  };

  const handleTrackpadMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingTrackpad(true);
    handleTrackpadPointer(e);
  };

  const handleTrackpadMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingTrackpad) return;
    handleTrackpadPointer(e);
  };

  const handleTrackpadMouseUp = () => {
    if (isDraggingTrackpad) {
      setIsDraggingTrackpad(false);
      triggerHostAction("Trackpad Click", `Cursor vector clicked at: ${mouseCoords.x}x, ${mouseCoords.y}y`);
    }
  };

  const handleSendKeystrokes = () => {
    if (!keystrokeText.trim()) return;
    executeCommand(`keysend ${keystrokeText}`);
    setKeystrokeText("");
  };

  // Run quick unified clinical scripts
  const handleRunScript = (scriptName: string, cmdAction: string) => {
    setIsDeployingScript(scriptName);
    triggerHostAction("Script Rollout", `Deploying shell profile [${scriptName}] in silent network subchannel`);
    
    setTimeout(() => {
      setIsDeployingScript(null);
      const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
      setHistory(prev => [
        ...prev,
        {
          cmd: `./bin/${scriptName}`,
          res: `[SHELL EXECUTION COMPLETE]\nScript: /opt/sante/bin/${scriptName}\nExit Code: 0 (SUCCESS)\nOutput:\n-- Active security state audited.\n-- Safe configuration layers forcefully synchronized.\n-- Clinical database links certified encrypted.`,
          timestamp: time
        }
      ]);
    }, 1800);
  };

  return (
    <div className="min-h-full bg-[#150a36]/95 text-white p-5 md:p-8 flex flex-col xl:flex-row gap-6 font-sans border border-purple-500/10 rounded-[2.5rem] shadow-[0_15px_45px_rgba(76,29,149,0.30)] relative select-none overflow-hidden backdrop-blur-md">
      
      {/* Absolute Ambient glows matching professional workspace aesthetic */}
      <div className="absolute right-[-10%] top-[-15%] w-[380px] h-[380px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute left-[20%] bottom-[-15%] w-[420px] h-[320px] bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Center workspace containing VNC screen / Console and Controls */}
      <div className="flex-1 flex flex-col relative z-20 bg-[#11072c]/40 border border-purple-500/10 rounded-[2rem] p-4 md:p-6 min-w-0">
        
        {/* Workspace custom telemetry headers */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-950 pb-5 mb-5 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <span className="text-[10px] font-mono font-black text-[#22d3ee] tracking-widest uppercase">
                UNIFIED LAPTOP ACCESS WORKSPACE
              </span>
            </div>
            <h3 className="text-lg font-black italic tracking-wide text-white uppercase leading-none">
              💻 Sovereign Remote Control Deck
            </h3>
          </div>

          {/* Core Interactive Deck Toggles */}
          <div className="flex bg-[#0c0523]/80 p-1 rounded-xl border border-purple-900/50">
            <button
              onClick={() => setActiveDeckMode("vnc")}
              className={`flex items-center gap-2 px-3.5 py-2 text-[9.5px] font-black font-mono tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                activeDeckMode === "vnc"
                  ? "bg-[#25175d] text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                  : "text-[#7c6bb5] hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop VNC
            </button>
            <button
              onClick={() => setActiveDeckMode("cli")}
              className={`flex items-center gap-2 px-3.5 py-2 text-[9.5px] font-black font-mono tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                activeDeckMode === "cli"
                  ? "bg-[#25175d] text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                  : "text-[#7c6bb5] hover:text-white"
              }`}
            >
              <TermIcon className="w-3.5 h-3.5" /> Direct Shell
            </button>
            <button
              onClick={() => setActiveDeckMode("node_exporter")}
              className={`flex items-center gap-2 px-3.5 py-2 text-[9.5px] font-black font-mono tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                activeDeckMode === "node_exporter"
                  ? "bg-[#25175d] text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                  : "text-[#7c6bb5] hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Exporter State
            </button>
          </div>
        </div>

        {/* 1. LAYER ONE: VISUAL DESKTOP CONTROL LOOP WITHIN PHYSICAL MOCKUP FRAMES */}
        {activeDeckMode === "vnc" && (
          <div className="space-y-6 flex-1 flex flex-col justify-between min-h-0">
            {/* Displaying target laptop as a beautiful 3D-styled physical device mockup */}
            <div className="flex-1 flex items-center justify-center p-2 min-h-[300px]">
              <div className="w-full max-w-2xl relative">
                
                {/* A. RENDER MACOS METICULOUS ALUMINUM CHASSIS (Macbook Pro 01) */}
                {currentDevice.os === "macOS" && (
                  <div className="w-full transition-all duration-500">
                    {/* Screen Outer Aluminum frame bezel */}
                    <div className="relative aspect-video rounded-[1.8rem] bg-black border-[12px] border-[#2d2e30] p-1 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_20px_rgba(34,211,238,0.05)] overflow-hidden">
                      
                      {/* Top Notch Area */}
                      <div className="absolute top-0 inset-x-0 h-4 flex justify-center z-40">
                        <div className="bg-[#2d2e30] w-28 h-4 rounded-b-xl flex items-center justify-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#151515]" />
                          <div className={`w-1 h-1 rounded-full ${shutterOpen ? "bg-emerald-500 shadow-[0_0_4px_#10b981]" : "bg-black"}`} />
                        </div>
                      </div>

                      {/* Screen content glass overlay with brightness filter */}
                      <div 
                        style={{ filter: `brightness(${screenBrightness}%)` }}
                        className="w-full h-full bg-[#0d0725] rounded-xl overflow-hidden relative flex flex-col justify-between p-4 font-sans select-none"
                      >
                        {/* Static scanline background grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                        
                        {/* Status bar top */}
                        <div className="flex justify-between items-center text-[8.5px] font-mono text-purple-200/50 uppercase z-20">
                          <div className="flex items-center gap-1 bg-[#1c1145]/80 px-2 py-1 rounded">
                            <Laptop size={10} className="text-[#22d3ee]" /> <span>MAC-TARGET: {currentDevice.id}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-[#1c1145]/80 px-2 py-1 rounded">
                            <Wifi size={10} className="text-cyan-400" />
                            <span>LAT: 2.15ms</span>
                            <span className="text-white">●</span>
                            <span>VPN-PORT: 3000</span>
                          </div>
                        </div>

                        {/* Lock Screen overlay override */}
                        {isLocked ? (
                          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-6 z-30 animate-fade-in">
                            <Lock size={32} className="text-[#ff5c00] mb-3 animate-bounce" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#ff5c00]">REMOTE TERMINAL SECURED LOCK</h4>
                            <p className="text-[10px] text-purple-400 font-mono mt-1.5 uppercase max-w-xs leading-relaxed">System administrator credentials required to release console keyboard inputs.</p>
                          </div>
                        ) : (
                          // Virtualized interactive desktop UI
                          <div className="flex-1 flex flex-col justify-between mt-3 text-cyan-400 relative z-10">
                            
                            {/* Fake macOS active app frame */}
                            <div className="bg-[#1b0d45]/80 border border-purple-500/20 rounded-xl p-3 shadow-xl backdrop-blur-sm">
                              <div className="flex items-center justify-between border-b border-purple-950/60 pb-1.5 mb-2.5">
                                <span className="text-[8px] font-black text-[#22d3ee] uppercase tracking-widest flex items-center gap-1">
                                  <ShieldCheck size={11} /> MAC CACHE BUFFER ENFORCING
                                </span>
                                <span className="text-[8px] text-purple-400 font-mono">
                                  UID: {currentDevice.serialNumber}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono leading-relaxed text-purple-200">
                                <div>CPU Core Temp: <span className="text-white font-bold">42°C (Optimal)</span></div>
                                <div>Memory Cache: <span className="text-[#22d3ee] font-bold">{currentDevice.ram}% Used</span></div>
                              </div>
                            </div>

                            {/* Center interactive pointer cursor location */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                              <div 
                                style={{ transform: `translate(${(mouseCoords.x - 960)/4}px, ${(mouseCoords.y - 540)/4}px)` }}
                                className="w-5 h-5 border border-cyan-400 rounded-full flex items-center justify-center bg-cyan-900/40 relative transition-all duration-150 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                <span className="absolute left-6 text-[8px] bg-black/80 px-1 py-0.5 rounded text-white font-mono whitespace-nowrap">
                                  {mouseCoords.x}, {mouseCoords.y}
                                </span>
                              </div>
                            </div>

                            {/* bottom doc bar */}
                            <div className="flex justify-center mt-auto">
                              <div className="bg-[#120732]/95 border border-purple-500/10 px-4 py-1.5 rounded-2xl flex gap-3 shadow-lg">
                                <div className="w-5 h-5 rounded bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[10px]">🍎</div>
                                <div className="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-[10px]">🛠️</div>
                                <div className="w-5 h-5 rounded bg-purple-500/20 border border-[#7c6bb5]/30 flex items-center justify-center text-[10px]">📈</div>
                                <div className="w-5 h-5 rounded bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-[10px]">🔐</div>
                              </div>
                            </div>

                          </div>
                        )}

                        {/* Wallpaper sovereign footer watermark */}
                        <div className="absolute inset-x-0 bottom-1 text-center text-[7.5px] text-[#7c6bb5]/25 font-black tracking-widest uppercase pointer-events-none">
                          SOVEREIGN ACCESS PRIVILEGE AGENT • FRAME-{streamFrameCount}
                        </div>
                      </div>
                    </div>
                    {/* Aluminum keyboard hinge bar */}
                    <div className="h-2 bg-[#2d2e30] w-2/3 mx-auto rounded-b" />
                  </div>
                )}

                {/* B. RENDER WIN-THINKPAD MATTE CHASSIS AND CLASSIC DESIGN */}
                {currentDevice.os === "Windows" && (
                  <div className="w-full transition-all duration-500">
                    <div className="relative aspect-video rounded-xl bg-black border-[14px] border-[#18191b] p-0.5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden">
                      
                      {/* Industrial rectangular bezels and safety webcam shutter */}
                      <div className="absolute top-1 inset-x-0 flex justify-center z-40">
                        <div className="bg-[#18191b] px-4 py-1.5 rounded-b flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${shutterOpen ? "bg-cyan-500 shadow-[0_0_4px_#06b6d4]" : "bg-zinc-800"}`} />
                          <span className="text-[7px] text-zinc-500/80 font-mono scale-90 uppercase">HD Cam</span>
                        </div>
                      </div>

                      {/* Screen canvas */}
                      <div 
                        style={{ filter: `brightness(${screenBrightness}%)` }}
                        className="w-full h-full bg-[#110c1f] rounded overflow-hidden relative flex flex-col justify-between p-4 selection:bg-orange-500"
                      >
                        <div className="absolute inset-0 bg-[#000000]/15 pointer-events-none" />

                        <div className="flex justify-between items-center text-[8px] font-mono text-purple-200/50 uppercase">
                          <span className="bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-700/30">THINKPAD-CLIENT: {currentDevice.id}</span>
                          <span className="bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-700/30">BATTERY: 84% • COOLDOWN</span>
                        </div>

                        {/* Locker screen overlay */}
                        {isLocked ? (
                          <div className="absolute inset-0 bg-[#0a0f1d]/98 flex flex-col items-center justify-center text-center p-6 z-30 animate-fade-in">
                            <Lock size={32} className="text-[#ff5c00] mb-3 animate-bounce" />
                            <h4 className="text-xs font-black font-sans uppercase tracking-widest text-orange-400">THINKLOCK ACTIVE PERIMETER</h4>
                            <p className="text-[10px] text-zinc-400 font-mono mt-1 uppercase max-w-xs leading-relaxed">Authorized security token required. Access block verified local on device.</p>
                          </div>
                        ) : (
                          // Windows-like Desktop GUI
                          <div className="flex-1 flex flex-col justify-between mt-3 text-cyan-400 relative z-10 font-mono">
                            <div className="bg-zinc-950/90 border border-zinc-800 p-3.5 rounded-lg max-w-sm mt-2">
                              <div className="flex justify-between mb-1 text-[8.5px] border-b border-zinc-800 pb-1 text-white">
                                <span>🔒 THINKPAD ENDPOINT CONTROL</span>
                                <span>ALIVE</span>
                              </div>
                              <p className="text-purple-300 text-[8.5px] leading-relaxed">System model: Lenovo ThinkPad X1 extreme. Hardware backlights dynamically verified {backlightOn ? "ON" : "OFF"}.</p>
                            </div>

                            {/* Center interactive pointer location */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                              <div 
                                style={{ transform: `translate(${(mouseCoords.x - 960)/4}px, ${(mouseCoords.y - 540)/4}px)` }}
                                className="w-5 h-5 border border-amber-400 rounded-full flex items-center justify-center bg-amber-950/45 relative transition-all duration-150 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span className="absolute left-6 text-[8px] bg-black/85 px-1 py-0.5 rounded text-white font-mono whitespace-nowrap">
                                  {mouseCoords.x}, {mouseCoords.y}
                                </span>
                              </div>
                            </div>

                            {/* Windows dock-like start bar */}
                            <div className="h-6 mt-auto w-full bg-[#18191b]/95 border-t border-zinc-800 flex items-center justify-between px-2 rounded">
                              <div className="flex items-center gap-1.5">
                                <div className="w-3.5 h-3.5 bg-cyan-400 flex items-center justify-center text-[7px] text-zinc-950 font-black">W</div>
                                <span className="text-[8px] text-purple-200 uppercase">SYS_INDEX</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[7.5px] text-[#ff5c00]">CPU: {currentDevice.cpu}%</span>
                                <span className="text-[7.5px] text-[#22d3ee]">UP: {currentDevice.uptime}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-8 text-center text-[7px] text-zinc-500/20 font-black tracking-widest uppercase pointer-events-none">
                          REMOTE CLIENT DRIVER v2.10 • FRAME-{streamFrameCount}
                        </div>
                      </div>
                    </div>
                    {/* ThinkPad iconic physical bezel block */}
                    <div className="h-2 bg-[#18191b] w-1/3 mx-auto rounded-b flex justify-center gap-1">
                      <div className="w-1.5 h-1 rounded-full bg-red-600 self-center" />
                    </div>
                  </div>
                )}

                {/* C. RENDER DELL-XPS INFINITY LINUX (Ubuntu Gnome visual mockup) */}
                {currentDevice.os === "Linux" && (
                  <div className="w-full transition-all duration-500">
                    <div className="relative aspect-video rounded-3xl bg-black border-[8px] border-zinc-300 p-0.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                      
                      {/* Ultra narrow infinity border styling */}
                      <div className="absolute top-0 inset-x-0 h-2 flex justify-center z-40">
                        <div className="w-1 h-1 rounded-full bg-cyan-400 scale-90" />
                      </div>

                      {/* Screen content canvas wrapper */}
                      <div 
                        style={{ filter: `brightness(${screenBrightness}%)` }}
                        className="w-full h-full bg-[#190924] rounded-2xl overflow-hidden relative flex flex-col justify-between p-4 font-sans select-none"
                      >
                        {/* Static system layout details */}
                        <div className="flex justify-between items-center text-[8.5px] font-mono text-indigo-200/50 uppercase z-20">
                          <span className="bg-purple-950/80 px-2.5 py-1 rounded">XPS-GNOME-TUNNEL: {currentDevice.id}</span>
                          <span className="bg-purple-950/80 px-2.5 py-1 rounded">DELL PLATINUM CHASSIS</span>
                        </div>

                        {/* Locker screen overlay */}
                        {isLocked ? (
                          <div className="absolute inset-0 bg-[#0A0512]/98 flex flex-col items-center justify-center text-center p-6 z-30 animate-fade-in">
                            <Lock size={32} className="text-[#ff5c00] mb-3 animate-bounce" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#ff5c00]">XPS LOCK SHIELD ACTIVE</h4>
                            <p className="text-[10px] text-purple-400 font-mono mt-1 uppercase max-w-xs leading-relaxed">PAM validation required. Remote keystroke control is restricted.</p>
                          </div>
                        ) : (
                          // Ubuntu VNC Screen panel layout
                          <div className="flex-1 flex justify-between mt-3 text-cyan-400 relative z-10">
                            
                            {/* Ubuntu top shelf or shell menu bar */}
                            <div className="w-full max-w-xs absolute left-0 top-0 bg-[#2d0922]/90 border border-purple-800/20 p-3 rounded-xl shadow-lg">
                              <h4 className="text-[8.5px] font-black text-white uppercase mb-1">🐧 Sovereign Ubuntu Client</h4>
                              <p className="text-[8.5px] text-purple-200 font-mono">Kernel Release: linux-rt-v6.2.0-generic</p>
                            </div>

                            {/* Pointer cursor marker coordinate index tracker */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                              <div 
                                style={{ transform: `translate(${(mouseCoords.x - 960)/4}px, ${(mouseCoords.y - 540)/4}px)` }}
                                className="w-5 h-5 border border-emerald-400 rounded-full flex items-center justify-center bg-emerald-900/40 relative transition-all duration-150 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="absolute left-6 text-[8px] bg-black/95 px-1 py-0.5 rounded text-white font-mono whitespace-nowrap">
                                  {mouseCoords.x}, {mouseCoords.y}
                                </span>
                              </div>
                            </div>

                            {/* Ubuntu Side icon shelf simulated Dock */}
                            <div className="w-6 bg-[#0c0316]/95 border-r border-[#2d0922] flex flex-col items-center gap-2 py-3 mt-1.5 rounded">
                              <div className="w-3.5 h-3.5 bg-orange-600 rounded flex items-center justify-center text-[7px] text-white">U</div>
                              <div className="w-3.5 h-3.5 bg-gray-600 rounded flex items-center justify-center text-[7px] text-white">⚙️</div>
                              <div className="w-3.5 h-3.5 bg-blue-600 rounded flex items-center justify-center text-[7px] text-white">📂</div>
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-1 text-center text-[7.5px] text-purple-300/20 font-black tracking-widest uppercase pointer-events-none">
                          LINUX SYSTEM AGENT LOADER • FRAME-{streamFrameCount}
                        </div>
                      </div>
                    </div>
                    {/* Metal premium structural bezel hinge block */}
                    <div className="h-1.5 bg-zinc-300 w-full rounded-b" />
                  </div>
                )}

              </div>
            </div>

            {/* Quick tactile hardware micro-actions block */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#140b33] p-4.5 rounded-[2rem] border border-purple-500/10 shadow-inner shrink-0 scale-95 md:scale-100">
              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">VNC LAYER VIEW</span>
                <select 
                  className="bg-[#24175e] border border-purple-500/20 text-[#22d3ee] font-mono text-[9.5px] font-black rounded-xl p-2.5 outline-none tracking-widest uppercase cursor-pointer"
                  onChange={(e) => executeCommand(e.target.value)}
                >
                  <option value="status">🖥️ Host Desktop Feed</option>
                  <option value="lock">🔒 Safety Screen Lock</option>
                  <option value="unlock">🔓 Grant Supervisor Key</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">SCREEN SHUTTER</span>
                <button 
                  onClick={() => {
                    setShutterOpen(!shutterOpen);
                    triggerHostAction("Privacy Guard", `${shutterOpen ? "Closed" : "Opened"} hardware safety lens shutter dynamically`);
                  }}
                  className={`w-full py-2.5 border rounded-xl transition-all duration-350 font-mono text-xs font-bold tracking-wider uppercase cursor-pointer outline-none flex items-center justify-center gap-1.5 ${
                    shutterOpen 
                      ? "bg-purple-900/10 border-[#7c6bb5]/35 text-[#7c6bb5] hover:bg-purple-950/40" 
                      : "bg-emerald-950/30 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/55"
                  }`}
                >
                  {shutterOpen ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{shutterOpen ? "Active Lens" : "Shutter Closed"}</span>
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">KEY BOARD BACKLIGHT</span>
                <button 
                  onClick={() => {
                    setBacklightOn(!backlightOn);
                    triggerHostAction("Key backlit trigger", `Keyboard luminous matrix set to ${backlightOn ? "0% (OFF)" : "100% (ON)"}`);
                  }}
                  className={`w-full py-2.5 border rounded-xl transition-all duration-350 font-mono text-xs font-bold tracking-wider uppercase cursor-pointer outline-none flex items-center justify-center gap-1.5 ${
                    backlightOn 
                      ? "bg-cyan-950/30 border-cyan-400/45 text-[#22d3ee] hover:bg-cyan-950/50" 
                      : "bg-purple-900/10 border-purple-500/20 text-[#7c6bb5] hover:bg-purple-950/40"
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5 animate-pulse" />
                  <span>{backlightOn ? "Backlight ON" : "Backlight OFF"}</span>
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">CORE OVERCLOCK PROMPT</span>
                <NeonButton 
                  onClick={() => {
                    setFanSpeedBoost(95);
                    triggerHostAction("Thermodynamics", "Issued forced hyper-cooling fans sequence (95% throttle output)");
                  }}
                  variant="primary" 
                  className="!py-2.5 text-[9px]"
                >
                  Boost Core Fan
                </NeonButton>
              </div>
            </div>

          </div>
        )}

        {/* 2. LAYER TWO: CLI TERMINAL SHELL INJECTION MODE */}
        {activeDeckMode === "cli" && (
          <div className="flex-1 flex flex-col bg-[#0c0523]/80 border border-purple-500/10 rounded-2xl p-4 md:p-5 relative z-10 animate-fade-in min-h-[360px] justify-between">
            
            {/* Scrollable CLI Terminal logs list */}
            <div className="flex-1 overflow-y-auto max-h-[300px] space-y-4 pr-1 scrollbar-thin">
              <p className="text-[10px] text-purple-400/80 leading-relaxed italic border-b border-purple-950 pb-2 flex justify-between">
                <span>Session started over secure WebSocket gateway tunnel.</span>
                <span className="text-[#22d3ee]">Type 'help' to review instruction parameters</span>
              </p>
              
              {history.length === 0 ? (
                <p className="text-[11px] text-purple-500 italic">No connection log sequences recorded in buffer.</p>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="space-y-1 my-2 leading-relaxed text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-[#ff5c00] font-black">
                      <span className="text-purple-400 text-[9px] scale-90">[{item.timestamp}]</span>
                      <span>operator@sante-fleet:~#</span>
                      <span className="text-[#22d3ee] font-bold">{item.cmd}</span>
                    </div>
                    <div className="text-purple-200 whitespace-pre-wrap pl-4 border-l border-cyan-400/25 py-1 font-mono leading-relaxed bg-[#150a36]/40 p-2.5 rounded-lg border border-purple-500/5">
                      {item.res}
                    </div>
                  </div>
                ))
              )}

              {/* Blinking block prompt */}
              <div ref={consoleEndRef} />
            </div>

            {/* Input Form at bottom of CLI container */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-3 border-t border-purple-950/60 text-[11px] font-mono shrink-0">
              <span className="text-[#ff5c00] font-black">operator@sante-fleet:~#</span>
              <input 
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Insert remote terminal command... (type 'help' for ideas)"
                className="flex-1 bg-transparent border-none outline-none text-[#22d3ee] font-mono caret-cyan-400 p-0 text-[11px]"
                autoFocus
              />
              <div className="w-1.5 h-4 bg-[#22d3ee] animate-pulse shadow-[0_0_8px_#22d3ee]" />
            </form>

          </div>
        )}

        {/* 3. LAYER THREE: RAW PROMETHEUS NODE EXPORTER STATE */}
        {activeDeckMode === "node_exporter" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in flex-1">
            
            {/* RAW ARCHITECTURAL SENSOR EXPORT DATA */}
            <div className="bg-[#0c0523] border border-purple-500/10 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest border-b border-purple-950 pb-2 mb-4 flex justify-between">
                  <span>PROMETHEUS LIVE NODE SENSORS</span>
                  <span className="text-emerald-400">STATE_ALIVE</span>
                </h4>
                <div className="space-y-3 font-mono text-[10.5px] text-purple-300 leading-relaxed">
                  <div className="flex justify-between border-b border-purple-950/45 pb-1">
                    <span>node_up_integrity:</span>
                    <span className="text-emerald-400 font-extrabold">{currentDevice.status === "online" ? "1.00 (NOMINAL)" : "0.00 (WARNING)"}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-950/45 pb-1">
                    <span>node_metrics_ip_address:</span>
                    <span className="text-white font-extrabold font-mono">{currentDevice.ip}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-950/45 pb-1">
                    <span>node_cpu_utilization_ratio:</span>
                    <span className="text-white font-extrabold">{(currentDevice.cpu).toFixed(2)} %</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-950/45 pb-1">
                    <span>node_ram_usage_bytes:</span>
                    <span className="text-white font-extrabold">{((currentDevice.ram * 160000000) / 100).toFixed(0)} B</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-950/45 pb-1">
                    <span>node_network_throughput_mbs:</span>
                    <span className="text-cyan-400 font-extrabold font-mono">{(currentDevice.bandwidth).toFixed(2)} MB/s</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-950/45 pb-1">
                    <span>node_hw_serial_signature:</span>
                    <span className="text-purple-400 font-mono scale-95">{currentDevice.serialNumber || "SN-STANDARD-832"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#150a36]/50 p-3.5 border border-purple-900 rounded-xl text-[9px] text-[#7c6bb5] leading-relaxed font-semibold mt-4">
                Prometheus micro-daemon automatically streams data matches to central reverse proxy loop on secure ingress gateway index.
              </div>
            </div>

            {/* HARDWARE EXPORTER CALIBRATION */}
            <div className="bg-[#150a36]/40 border border-purple-500/10 p-5 rounded-[2rem] flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-cyan-400" /> DAEMON ENVELOPE CALIBRATION
                </h4>
                <p className="text-[10px] text-[#7c6bb5] mb-5 leading-relaxed font-semibold">
                  Manually tweak physical parameters such as remote system thermostat threshold buffers and fan curves.
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-mono uppercase font-black">
                    <span className="text-[#7c6bb5]">Lume Brightness Slider</span>
                    <span className="text-cyan-400">{screenBrightness}% Offset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun size={14} className="text-amber-400" />
                    <input 
                      type="range" 
                      min="20" 
                      max="100" 
                      value={screenBrightness}
                      onChange={(e) => {
                        setScreenBrightness(Number(e.target.value));
                        triggerHostAction("Backlight Tweak", `Screen brightness level updated remotely to ${e.target.value}%`);
                      }}
                      className="w-full h-1.5 bg-[#0c0523] rounded-lg appearance-none cursor-pointer border border-purple-900"
                    />
                  </div>
                </div>

                <div className="space-y-4 mt-5">
                  <div className="flex justify-between text-[10px] font-mono uppercase font-black">
                    <span className="text-[#7c6bb5]">Cooling Fan Throttle Profile</span>
                    <span className="text-emerald-400">{fanSpeedBoost}% Target</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw size={14} className="text-emerald-400" />
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={fanSpeedBoost}
                      onChange={(e) => {
                        setFanSpeedBoost(Number(e.target.value));
                        triggerHostAction("Fan speed calibration", `Micro cooling fan speed targeted at ${e.target.value}% capacity`);
                      }}
                      className="w-full h-1.5 bg-[#0c0523] rounded-lg appearance-none cursor-pointer border border-purple-900"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#0f0426] border border-purple-950 p-3.5 rounded-2xl text-center text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-black">
                ● TUNNEL SECURITY ENCRYPTION SYNCED (AES-GCM)
              </div>
            </div>

          </div>
        )}

      </div>

      {/* TACTILE CONTROL DECK ON THE RIGHT */}
      <div className="w-full xl:w-[22rem] shrink-0 flex flex-col gap-6 relative z-20">
        
        {/* PHYSICAL ASSET LIST SELECTION MATRIX */}
        <div className="bg-[#11072c]/50 p-5 rounded-[2rem] border border-purple-500/10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-purple-950 pb-2.5">
              <span className="text-[10px] text-[#7c6bb5] font-black uppercase tracking-widest">
                REMOTE SYSTEM LEDGER
              </span>
              <span className="text-[8.5px] font-mono font-bold text-teal-400 bg-teal-950/45 px-2 py-0.5 rounded border border-teal-500/15">
                {nodeFilter.toUpperCase()} NODE DIRECTORY
              </span>
            </div>

            {/* Quick Filter Select Buttons to shift context instantly */}
            <div className="grid grid-cols-4 gap-1 bg-[#0c0523]/80 p-0.5 rounded-xl border border-purple-950 mb-4 scale-95">
              <button 
                onClick={() => { setNodeFilter("laptops"); setSelectedDeviceIndex(0); }}
                className={`py-1 rounded text-[8.5px] font-black uppercase tracking-wider cursor-pointer ${nodeFilter === "laptops" ? "bg-[#25175d] text-[#22d3ee] font-extrabold border border-cyan-500/10 scale-105" : "text-[#7c6bb5] hover:text-white"}`}
              >
                Laptops
              </button>
              <button 
                onClick={() => { setNodeFilter("servers"); setSelectedDeviceIndex(0); }}
                className={`py-1 rounded text-[8.5px] font-black uppercase tracking-wider cursor-pointer ${nodeFilter === "servers" ? "bg-[#25175d] text-[#22d3ee] font-extrabold border border-cyan-500/10 scale-105" : "text-[#7c6bb5] hover:text-white"}`}
              >
                Servers
              </button>
              <button 
                onClick={() => { setNodeFilter("network"); setSelectedDeviceIndex(0); }}
                className={`py-1 rounded text-[8.5px] font-black uppercase tracking-wider cursor-pointer ${nodeFilter === "network" ? "bg-[#25175d] text-[#22d3ee] font-extrabold border border-cyan-500/10 scale-105" : "text-[#7c6bb5] hover:text-white"}`}
              >
                Network
              </button>
              <button 
                onClick={() => { setNodeFilter("all"); setSelectedDeviceIndex(0); }}
                className={`py-1 rounded text-[8.5px] font-black uppercase tracking-wider cursor-pointer ${nodeFilter === "all" ? "bg-[#25175d] text-[#22d3ee] font-extrabold border border-cyan-500/10 scale-105" : "text-[#7c6bb5] hover:text-white"}`}
              >
                All
              </button>
            </div>

            {/* Device list selector */}
            <div className="space-y-3.5 max-h-[178px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredDevices.map((device, i) => {
                const isSelected = currentDevice.id === device.id;
                const isOnline = device.status === "online";
                return (
                  <div 
                    key={device.id}
                    onClick={() => setSelectedDeviceIndex(i)}
                    className={`p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? "bg-[#25175e] border-cyan-400/35 shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-102" 
                        : "bg-[#1f124c]/30 border-purple-500/5 hover:bg-[#1a0e41]/60"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-orange-500"}`} />
                        {device.id} (IP: {device.ip})
                      </span>
                      <span className="text-[8.5px] font-mono text-purple-400/80 font-bold bg-[#140b33] px-1.5 py-0.5 rounded border border-purple-900">
                        {device.os} • {device.policyCompliance}% Compliance
                      </span>
                    </div>

                    <div className="text-[11.5px] text-white font-extrabold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Laptop size={12} className={isSelected ? "text-cyan-400" : "text-purple-400"} />
                        {device.name}
                      </span>
                      <ChevronRight size={13} className={`transition-all ${isSelected ? "text-cyan-400 translate-x-1" : "text-transparent"}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INTERACTIVE TRACKPAD AND REMOTE KEYPAD WRAPPERS */}
        <div className="bg-[#11072c]/50 p-5 rounded-[2rem] border border-purple-500/10 flex flex-col gap-4">
          
          {/* Tracking trackpad pad boundary */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">
                Virtual Device Trackpad
              </span>
              <span className="text-[7.5px] text-cyan-400 font-mono scale-90">
                DRAG CURSOR / TAPE FOR ACTION
              </span>
            </div>
            
            <div 
              ref={trackpadRef}
              onMouseDown={handleTrackpadMouseDown}
              onMouseMove={handleTrackpadMouseMove}
              onMouseUp={handleTrackpadMouseUp}
              onMouseLeave={handleTrackpadMouseUp}
              className="h-28 bg-[#0c0523]/90 rounded-2xl border border-purple-950 flex flex-col items-center justify-center relative cursor-crosshair overflow-hidden group shadow-inner"
            >
              <div className="absolute inset-0 bg-[#22d3ee]/3 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Central grid scroll bar divider line */}
              <div className="absolute inset-x-0 top-1/2 h-[0.5px] bg-[#22d3ee]/10" />
              <div className="absolute inset-y-0 left-1/2 w-[0.5px] bg-[#22d3ee]/10" />

              {/* Glowing cursor visual track indicator */}
              <div 
                style={{ 
                  left: `${trackpadRef.current ? (mouseCoords.x/1920) * trackpadRef.current.clientWidth - 8 : 110}px`,
                  top: `${trackpadRef.current ? (mouseCoords.y/1080) * trackpadRef.current.clientHeight - 8 : 45}px`
                }}
                className="absolute w-4.5 h-4.5 rounded-full bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center pointer-events-none transition-all duration-75 shadow-[0_0_10px_#22d3ee]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>

              <span className="text-[8px] font-mono text-[#7c6bb5] bg-black/50 px-2.5 py-1 rounded border border-purple-950/40 relative z-10 block pointer-events-none uppercase tracking-widest leading-none">
                TRACKPAD INTERACTIVE ZONE
              </span>
            </div>
          </div>

          {/* Virtual text string key keyboard injector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">
              Automated Virtual Keystrokes
            </span>
            <div className="flex gap-2">
              <input 
                type="text"
                value={keystrokeText}
                onChange={(e) => setKeystrokeText(e.target.value)}
                placeholder="Type remote keystroke string..."
                className="flex-1 bg-[#0c0523]/90 border border-purple-900 rounded-xl px-3 py-2 text-xs font-mono text-[#22d3ee] outline-none placeholder:text-purple-400/45 focus:border-[#22d3ee] transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendKeystrokes();
                }}
              />
              <button 
                onClick={handleSendKeystrokes}
                className="bg-[#24175e] border border-cyan-400/30 text-[#22d3ee] hover:bg-[#2e1d7a] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* ONE-CLICK SHIELD AND ADMINISTRATIVE CLINICAL BATCH FILES */}
        <div className="bg-[#11072c]/50 p-5 rounded-[2rem] border border-purple-500/10 flex flex-col gap-3.5">
          <span className="text-[10px] text-[#7c6bb5] font-black uppercase tracking-widest border-b border-purple-950 pb-2 flex items-center justify-between">
            <span>DISPATCH CLINICAL WORKFLOWS</span>
            <span className="text-cyan-400 animate-pulse">● READY</span>
          </span>

          <div className="space-y-2.5">
            <button 
              disabled={isDeployingScript !== null}
              onClick={() => handleRunScript("patch_vulnerabilities.sh", "Patching operating system patches")}
              className="w-full bg-[#1c1145]/85 hover:bg-[#25175d] border border-[#22d3ee]/20 hover:border-[#22d3ee]/60 py-3 px-4 rounded-2xl text-[10.5px] font-bold font-mono text-left tracking-wide flex justify-between items-center transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-cyan-400 group-hover:animate-bounce" />
                <span>SHELL: deploy_security_patch.sh</span>
              </span>
              <span className="text-[8.5px] font-bold text-cyan-400 font-mono uppercase bg-[#140b33] border border-purple-900 px-2 py-0.5 rounded">
                {isDeployingScript === "patch_vulnerabilities.sh" ? "DEPLOYS..." : "RUN"}
              </span>
            </button>

            <button 
              disabled={isDeployingScript !== null}
              onClick={() => handleRunScript("wipe_temporary_caches.sh", "Flushing intermediate device cash SWAP buffers")}
              className="w-full bg-[#1c1145]/85 hover:bg-[#25175d] border border-amber-400/20 hover:border-amber-400/50 py-3 px-4 rounded-2xl text-[10.5px] font-bold font-mono text-left tracking-wide flex justify-between items-center transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <span className="flex items-center gap-2">
                <BatteryCharging size={14} className="text-amber-400 group-hover:scale-110 duration-200" />
                <span>SHELL: purge_memory_caches.bash</span>
              </span>
              <span className="text-[8.5px] font-bold text-amber-400 font-mono uppercase bg-[#140b33] border border-purple-900 px-2 py-0.5 rounded">
                {isDeployingScript === "wipe_temporary_caches.sh" ? "RUNNING..." : "RUN"}
              </span>
            </button>

            <button 
              disabled={isDeployingScript !== null}
              onClick={() => handleRunScript("isolate_network_traffic.sh", "Isolating network router streams and logs")}
              className="w-full bg-[#1c1145]/85 hover:bg-[#25175d] border border-rose-500/25 hover:border-rose-400/50 py-3 px-4 rounded-2xl text-[10.5px] font-bold font-mono text-left tracking-wide flex justify-between items-center transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <span className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-[#ff5c00] group-hover:animate-ping" />
                <span>SHELL: enforce_zero_trust.sh</span>
              </span>
              <span className="text-[8.5px] font-bold text-[#ff5c00] font-mono uppercase bg-[#140b33] border border-purple-900 px-2 py-0.5 rounded">
                {isDeployingScript === "isolate_network_traffic.sh" ? "DEPLOYS..." : "RUN"}
              </span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
