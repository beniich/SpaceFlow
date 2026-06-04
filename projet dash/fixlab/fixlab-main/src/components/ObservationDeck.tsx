import React, { useState, useEffect } from "react";
import { 
  Monitor, Lock, RefreshCw, Play, Cpu, Layers, Grid, Video, 
  Power, Terminal, Settings, Activity, CheckCircle, AlertTriangle, 
  Eye, Wifi, Keyboard, EyeOff, Sparkles, Sliders, Server
} from "lucide-react";
import { Device } from "../types";

interface ObservationDeckProps {
  devices: Device[];
  currentRole: string;
}

export const ObservationDeck: React.FC<ObservationDeckProps> = ({ devices, currentRole }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [vncQuality, setVncQuality] = useState<"4K" | "1080p" | "720p">("1080p");
  const [vncFps, setVncFps] = useState<"60 FPS" | "30 FPS" | "15 FPS">("60 FPS");
  const [activeTab, setActiveTab] = useState<"grid" | "focus">("grid");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [simulationText, setSimulationText] = useState<string>("");
  const [aiOcrAnalysis, setAiOcrAnalysis] = useState<string>("");
  const [connectedTime, setConnectedTime] = useState<number>(0);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  // Filter out devices to represent different screens we can visualize
  const visibleDevices = devices.filter(d => d.os === "SovereignOS" || d.os === "Linux");

  // Dynamic status-based OCR and description generation
  useEffect(() => {
    if (!selectedDevice) return;

    const timer = setInterval(() => {
      setConnectedTime(prev => prev + 1);
    }, 1000);

    // Dynamic AI screen analysis content
    let analysis = "";
    if (selectedDevice.status === "warning") {
      analysis = `[!] ALERT TRIGGER: High computational load on host system Core binary execution blocks.
[OCR TEXT DETECTION]:
- Terminal Window 1: "ALERT - SIGTERM ignored on parent loop"
- Resource Guard: "CPU spikes detected in docker-proxy daemon (91% utilization)"
- Configuration File: "sysctl.conf (editing state)"
[AI INSIGHTS]: Host IP ${selectedDevice.ip} holds a SCADA operational loop experiencing friction. Remediation via process termination is highly recommended.`;
    } else {
      analysis = `[*] NORMAL TELEMETRY LEVEL: Host operating system under standard policy compliance bounds.
[OCR TEXT DETECTION]:
- Console Thread: "systemd init sequence fully completed in 2.1s"
- Local Service: "Apache Guacamole v1.5 Tunnel active"
- Network socket: "ESTABLISHED secure TLS node proxy link"
[AI INSIGHTS]: Zero compliance anomalies detected. Host system successfully locked under continuous Sovereign JIT rules.`;
    }
    setAiOcrAnalysis(analysis);

    return () => {
      clearInterval(timer);
      setConnectedTime(0);
    };
  }, [selectedDevice]);

  const dispatchVncAction = async (action: "lock-screen" | "force-reboot" | "kill-process" | "patch-kernel") => {
    if (!selectedDevice) return;
    if (currentRole === "auditor") {
      alert("Write permissions are structurally frozen during Auditor session.");
      return;
    }

    try {
      setActionLoading(action);
      const res = await fetch("/api/observation-deck/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: selectedDevice.id,
          action,
          remoteUser: `Sovereign Operator (${currentRole})`
        })
      });

      if (res.ok) {
        // Create a visual trigger representation on the screen simulation
        setSimulationText(`Action [${action.toUpperCase()}] successfully broadcast! Telemetry renegotiation dispatched to ${selectedDevice.name}...`);
        setTimeout(() => setSimulationText(""), 4000);
      }
    } catch (err) {
      console.error("VNC action trigger failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "online" || status === "active") return "text-emerald-400 border-emerald-500/20";
    if (status === "warning") return "text-amber-400 border-amber-500/20";
    return "text-rose-400 border-rose-500/20";
  };

  return (
    <div id="observation-deck-hub" className="space-y-6">
      
      {/* Header Deck Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/10 pb-4">
        <div>
          <h2 className="text-sm font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            OBSERVATION DECK (VNC/RDP STREAMER)
          </h2>
          <p className="text-[10px] text-stone-400 font-mono mt-1">
            Real-time visual hypervisor powered by Apache Guacamole and JumpServer PAM proxies
          </p>
        </div>

        {/* View Switches */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab("grid");
              setSelectedDevice(null);
            }}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all flex items-center gap-1.5 ${
              activeTab === "grid" && !selectedDevice
                ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300"
                : "border-purple-500/10 hover:border-purple-500/30 text-stone-400 hover:text-stone-300"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            WALL OF SCREENS (GRID)
          </button>
          
          {selectedDevice && (
            <button
              onClick={() => setActiveTab("focus")}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all flex items-center gap-1.5 ${
                activeTab === "focus"
                  ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300"
                  : "border-purple-500/10 hover:border-purple-500/30 text-stone-400 hover:text-stone-300"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              FOCUS: {selectedDevice.name}
            </button>
          )}

          <div className="px-3 py-1.5 bg-black/40 border border-purple-500/10 rounded-lg text-[9px] font-mono text-stone-400 flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
            ACTIVE FEEDS: {visibleDevices.length} STREAMS
          </div>
        </div>
      </div>

      {/* Main viewport Container */}
      {!selectedDevice || activeTab === "grid" ? (
        
        /* WALL OF SCREENS / GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibleDevices.map((device) => {
            const warningState = device.status === "warning" || device.status === "critical";
            return (
              <div
                key={device.id}
                onClick={() => {
                  setSelectedDevice(device);
                  setActiveTab("focus");
                }}
                className={`group cursor-pointer bg-stone-950/20 hover:bg-stone-950/40 border rounded-2xl p-5 transition-all flex flex-col justify-between h-[250px] relative overflow-hidden ${
                  warningState 
                    ? "border-amber-500/30 hover:border-amber-500/50 shadow-sm shadow-amber-500/5" 
                    : "border-purple-500/10 hover:border-cyan-500/20 hover:shadow-cyan-500/5"
                }`}
              >
                {/* Visual simulator of screen content */}
                <div className="absolute inset-x-2 top-11 bottom-16 bg-[#040813] border border-stone-900 rounded-lg overflow-hidden flex flex-col justify-between p-2 select-none">
                  {/* Top terminal-style bar */}
                  <div className="flex items-center justify-between border-b border-stone-900/50 pb-1 text-[7px] font-mono text-[#5b6478]">
                    <span>GUACAMOLE DISPLAY PROTOCOL: RDP</span>
                    <span>1080p @ 60 FPS</span>
                  </div>

                  {/* Body Simulation Screen */}
                  <div className="flex-1 flex flex-col justify-center items-center font-mono space-y-1">
                    {warningState ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />
                        <span className="text-[7.5px] text-amber-400 font-bold tracking-tight">HIGH LOAD DISPARITY</span>
                        <span className="text-[7px] text-stone-500">Syslog spike logged recently</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-5 h-5 text-[#2cb5ff] opacity-40 shrink-0" />
                        <span className="text-[8px] text-[#2cb5ff] font-bold">SOV_OS VERIFIED RUNTIME</span>
                        <span className="text-[7px] text-stone-500">All rules sealed</span>
                      </>
                    )}
                  </div>

                  {/* Micro sparkline usage bar */}
                  <div className="h-2 flex items-center justify-between gap-1 text-[7px] font-mono">
                    <div className="flex-1 bg-stone-900 h-1 rounded overflow-hidden">
                      <div className={`h-full ${warningState ? "bg-amber-400" : "bg-[#2cb5ff]"}`} style={{ width: `${device.cpu}%` }} />
                    </div>
                    <span className="text-[7px] text-stone-500 font-bold shrink-0">CPU: {device.cpu}%</span>
                  </div>
                </div>

                {/* Overlaid Title Bar */}
                <div className="flex items-start justify-between font-mono z-10">
                  <div>
                    <h3 className="text-xs font-bold text-stone-100 group-hover:text-cyan-400 transition-colors uppercase">
                      {device.name}
                    </h3>
                    <code className="text-[9px] text-[#7c6bb5] font-semibold">{device.ip}</code>
                  </div>
                  <span className={`w-2 h-2 rounded-full ring-2 ring-black ${
                    warningState ? "bg-amber-400" : "bg-emerald-400"
                  } animate-pulse`} />
                </div>

                {/* Foot Technical Meta */}
                <div className="flex items-center justify-between font-mono text-[9px] text-stone-500 border-t border-purple-500/5 pt-2 z-10- mt-auto">
                  <span>OS: <code className="text-white text-[8px]">{device.os}</code></span>
                  <span>Uptime: <code className="text-white text-[8px]">{device.uptime}</code></span>
                </div>
              </div>
            );
          })}
        </div>

      ) : (

        /* FOCUS CONTROL OPERATIVE LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT RAIL CONTROLLER (4 COLS) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Stream Settings & Signal Info */}
            <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-5 font-mono space-y-4">
              <span className="text-[9px] font-bold tracking-widest text-[#7c6bb5] block uppercase">
                TUNNEL RESOLUTION & FRAME
              </span>

              {/* Quality Settings */}
              <div className="space-y-1.5">
                <label className="text-[9px] text-stone-400">Display Layout Quality</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["4K", "1080p", "720p"] as const).map(quality => (
                    <button
                      key={quality}
                      onClick={() => setVncQuality(quality)}
                      className={`py-1 text-[9px] border rounded transition-all ${
                        vncQuality === quality
                          ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300 font-bold"
                          : "border-purple-500/5 hover:border-purple-500/10 text-stone-500 hover:text-stone-300"
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Framerate Settings */}
              <div className="space-y-1.5">
                <label className="text-[9px] text-stone-400">Stream Framerate Refresh</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["60 FPS", "30 FPS", "15 FPS"] as const).map(fps => (
                    <button
                      key={fps}
                      onClick={() => setVncFps(fps)}
                      className={`py-1 text-[9px] border rounded transition-all ${
                        vncFps === fps
                          ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300 font-bold"
                          : "border-purple-500/5 hover:border-purple-500/10 text-stone-500 hover:text-stone-300"
                      }`}
                    >
                      {fps}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-purple-500/5 pt-3.5 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-stone-400">Session Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    CONNECTED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-stone-400">Duration Elapsed:</span>
                  <span className="text-stone-200 font-bold">{connectedTime} seconds</span>
                </div>
                {/* Protocol Selector Display */}
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-stone-400">Bastion Connection:</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    Guacamole Server RDP
                  </span>
                </div>
              </div>
            </div>

            {/* Terminal Remoting Operations Cards */}
            <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-5 font-mono space-y-3">
              <span className="text-[9px] font-bold tracking-widest text-[#7c6bb5] block uppercase">
                REMOTE PAM OVERRIDES
              </span>

              <div className="space-y-2">
                {/* Force Reboot */}
                <button
                  onClick={() => dispatchVncAction("force-reboot")}
                  disabled={actionLoading !== null}
                  className="w-full py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-[10px] text-rose-300 rounded-lg transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <Power className="w-3.5 h-3.5" />
                  {actionLoading === "force-reboot" ? "DISPATCHING POWER..." : "FORCE ACPI REBOOT"}
                </button>

                {/* Kill High-load process */}
                <button
                  onClick={() => dispatchVncAction("kill-process")}
                  disabled={actionLoading !== null}
                  className="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-[10px] text-amber-300 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Power className="w-3.5 h-3.5 rotate-90" />
                  {actionLoading === "kill-process" ? "KILLING PID..." : "KILL RESOURCE HOG (SIGKILL)"}
                </button>

                {/* Apply Kernel Patch */}
                <button
                  onClick={() => dispatchVncAction("patch-kernel")}
                  disabled={actionLoading !== null}
                  className="w-full py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-[10px] text-emerald-300 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {actionLoading === "patch-kernel" ? "APPLYING COMPLIANCE..." : "JUMPSERVER LIVEPATCH"}
                </button>

                {/* Lock Node Screen */}
                <button
                  onClick={() => dispatchVncAction("lock-screen")}
                  disabled={actionLoading !== null}
                  className="w-full py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 text-[10px] text-purple-300 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {actionLoading === "lock-screen" ? "STREAMING LOCKS..." : "LOCK SCREEN (LOCK-SCREEN)"}
                </button>
              </div>

              <div className="pt-2 border-t border-purple-500/5">
                <button
                  onClick={() => setIsReadOnly(prev => !prev)}
                  className={`w-full py-1 border text-[9px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    isReadOnly 
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300 font-bold" 
                      : "border-purple-500/10 text-stone-400 hover:text-stone-300"
                  }`}
                >
                  {isReadOnly ? <EyeOff className="w-3 h-3 text-rose-300" /> : <Eye className="w-3 h-3 text-stone-400" />}
                  {isReadOnly ? "READ-ONLY LOCK ACTIVE" : "INTERACTIVE VNC ENGAGED"}
                </button>
              </div>
            </div>

          </div>

          {/* CENTER: THE VISUAL MIRROR VIEWPORT (6 COLS) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* The Screen Mirror Frame */}
            <div className="relative aspect-video bg-[#040813] border border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all">
              
              {/* Top Bar overlay */}
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 border-b border-stone-900/40 text-[10px] font-mono text-stone-300 flex items-center justify-between select-none z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold tracking-wider text-cyan-400">GUACAMOLE ENCRYPTED STREAM</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{vncQuality} | {vncFps}</span>
                  <span className="text-[9px] text-[#7c6bb5]">60Hz Sync</span>
                </div>
              </div>

              {/* Simulator Screen Center */}
              <div className="flex-1 flex flex-col justify-center items-center p-6 text-center select-none relative bg-gradient-to-b from-[#0e1630] to-[#040813]">
                
                {/* Background network coordinate layout lines for Elite styling */}
                <div className="absolute inset-0 opacity-5 pointer-events-none select-none bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />

                {actionLoading ? (
                  <div className="space-y-3 font-mono">
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                    <p className="text-xs text-cyan-300 font-bold tracking-wide">
                      RENEGOTIATING HYPERVISOR VNC GRAPHICS PROTOCOL...
                    </p>
                    <span className="text-[9px] text-stone-500 block">
                      Syncing guest video frame buffers on port 3000
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4 font-mono max-w-md">
                    {/* Simulated OS Screen Layout */}
                    <div className="space-y-2 text-left bg-black/60 border border-stone-800 rounded-xl p-4 shadow-xl">
                      <div className="flex justify-between items-center border-b border-stone-900 pb-1.5 text-[8.5px] text-stone-500 font-mono">
                        <span>User Session: System Administrator (Chen)</span>
                        <span>Terminal PID: 4425-S</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 space-y-1 font-mono selection:bg-emerald-500/20">
                        <p className="">$ sovereignctl --verify-compliance-metrics</p>
                        <p className="text-stone-400">[info] Connecting to PAM Boundary JumpServer proxy...</p>
                        <p className="text-[#a855f7]">[auth] JIT verification validated successfully for local workspace</p>
                        <p className="text-emerald-500">[done] System state matches continuous compliance threshold matrices.</p>
                      </div>
                    </div>
                    {/* Simulated terminal notify info */}
                    {simulationText ? (
                      <p className="text-[10px] text-amber-300 bg-amber-950/20 border border-amber-500/20 p-2 rounded-lg font-mono">
                        {simulationText}
                      </p>
                    ) : (
                      <p className="text-[10px] text-stone-400">
                        Use the controllers on the left rail to dispatch direct signals. Remote system inputs are isolated.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Interactive Control Input */}
              <div className="bg-black/60 backdrop-blur-md px-4 py-3 border-t border-stone-900/40 text-[10px] font-mono text-stone-400 flex items-center justify-between select-none z-10 gap-3">
                <div className="flex items-center gap-1.5 text-stone-300">
                  <Keyboard className="w-3.5 h-3.5 text-stone-400" />
                  <span>Interactive Console Override Input:</span>
                </div>
                <input
                  type="text"
                  placeholder={isReadOnly ? "Interactive keys locked" : "Type terminal commands for remote executor..."}
                  disabled={isReadOnly || actionLoading !== null}
                  className="flex-1 bg-black/45 border border-purple-500/10 focus:border-cyan-500/40 rounded-lg px-2.5 py-1 text-[10.5px] text-stone-200 placeholder-stone-600 focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      setSimulationText(`Submitted: "${e.currentTarget.value}" via VNC virtual keyboard. Dispatching...`);
                      e.currentTarget.value = "";
                      setTimeout(() => setSimulationText(""), 4500);
                    }
                  }}
                />
              </div>

            </div>

            {/* Micro Details info footer */}
            <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-4 font-mono grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="block text-[8px] text-stone-500 uppercase font-bold">CPU Usage</span>
                <span className="text-xs font-bold text-white">{selectedDevice.cpu}%</span>
              </div>
              <div>
                <span className="block text-[8px] text-stone-500 uppercase font-bold">RAM Usage</span>
                <span className="text-xs font-bold text-white">{selectedDevice.ram}%</span>
              </div>
              <div>
                <span className="block text-[8px] text-stone-500 uppercase font-bold">IP Address</span>
                <code className="text-[10px] font-bold text-cyan-300">{selectedDevice.ip}</code>
              </div>
              <div>
                <span className="block text-[8px] text-stone-500 uppercase font-bold">Kernel Target</span>
                <span className="text-[10px] text-stone-300 font-bold max-w-[120px] truncate block mx-auto">
                  {selectedDevice.kernelVersion || "Linux Kernel v5"}
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT RAIL: NEURAL AI BEHAVIORAL DECK ANALYSIS (3 COLS) */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="bg-stone-950/20 border border-[#b45309]/10 rounded-2xl p-5 font-mono space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <Sparkles className="w-24 h-24 text-amber-500" />
              </div>

              <div className="flex items-center gap-2 border-b border-purple-500/10 pb-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  AI OCR & BEHAVIOR LOGS
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  The FixLab continuous AI analyzer scans guest-side viewport frames using Optical Character Recognition (OCR).
                </p>

                {/* Simulated Real OCR content display */}
                <div className="bg-black/35 hover:bg-black/55 border border-[#b45309]/10 rounded-xl p-3 text-[10px] leading-relaxed max-h-[250px] overflow-y-auto font-mono text-stone-300 transition-all">
                  <pre className="whitespace-pre-wrap select-text selection:bg-amber-500/20 selection:text-white">
                    {aiOcrAnalysis ? aiOcrAnalysis : "Analyzing active graphic pipeline..."}
                  </pre>
                </div>

                <div className="bg-[#b45309]/5 border border-[#b45309]/10 p-3 rounded-lg text-[9px] text-amber-400/90 leading-relaxed flex items-start gap-1.5 font-mono">
                  <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Any unapproved privilege escalation behavior captured inside screens triggers systemic quarantines immediately.
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Device List to fast swap */}
            <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-4 font-mono space-y-3.5">
              <span className="text-[9px] font-bold tracking-widest text-[#7c6bb5] block uppercase">
                FAST TARGET SELECTION
              </span>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {visibleDevices.map(d => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDevice(d)}
                    className={`p-2 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer transition-all ${
                      selectedDevice.id === d.id
                        ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold"
                        : "bg-black/25 border-transparent text-stone-400 hover:text-stone-300 hover:bg-black/45"
                    }`}
                  >
                    <span className="truncate">{d.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      d.status === "warning" ? "bg-amber-400 animate-ping" : "bg-emerald-400"
                    }`} />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

