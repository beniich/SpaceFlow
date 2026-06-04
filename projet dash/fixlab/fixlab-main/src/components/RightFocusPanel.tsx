/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, HardDrive, Cpu, Database, ShieldAlert, Folder, File, ChevronRight, Play, AlertTriangle, ShieldCheck, Terminal, Laptop, Lock, Unlock, Eye, EyeOff, Keyboard, Sun, RefreshCw, Send, Monitor } from "lucide-react";
import { Device, SystemLog } from "../types";
import { generateTelemetryHistory } from "../mockData";

interface FocusPanelProps {
  device: Device | null;
  onClose: () => void;
  onActionTriggered: (actionName: string, deviceId: string, level: "info" | "warning" | "critical" | "success") => void;
}

// Simulated file structure for the File Explorer tab (Image 19 spec)
interface FileNode {
  name: string;
  type: "dir" | "file";
  size?: string;
  permissions?: string;
  children?: FileNode[];
}

const mockFileStructures: Record<string, FileNode[]> = {
  SovereignOS: [
    {
      name: "etc",
      type: "dir",
      children: [
        { name: "sovos.conf", type: "file", size: "1.2 KB", permissions: "r--r--r--" },
        { name: "firewall.rules", type: "file", size: "4.8 KB", permissions: "rw-r-----" },
        { name: "usb_whitelist.dat", type: "file", size: "124 B", permissions: "rw-------" }
      ]
    },
    {
      name: "sys",
      type: "dir",
      children: [
        { name: "kernel_auth", type: "dir", children: [
          { name: "trusted_keys.pem", type: "file", size: "2.4 KB", permissions: "r--------" },
          { name: "revoked_fingerprints.bin", type: "file", size: "512 B", permissions: "rw-------" }
        ]},
        { name: "power_state", type: "file", size: "24 B", permissions: "rw-r--r--" },
        { name: "thermal_limit", type: "file", size: "12 B", permissions: "rw-r--r--" }
      ]
    },
    {
      name: "var",
      type: "dir",
      children: [
        { name: "log", type: "dir", children: [
          { name: "sysaudit.log", type: "file", size: "1.8 MB", permissions: "r--------" },
          { name: "intrusion_failures.txt", type: "file", size: "44 KB", permissions: "r--------" }
        ]}
      ]
    }
  ],
  Linux: [
    {
      name: "etc",
      type: "dir",
      children: [
        { name: "hosts", type: "file", size: "324 B", permissions: "rw-r--r--" },
        { name: "resolv.conf", type: "file", size: "89 B", permissions: "rw-r--r--" },
        { name: "pam.d", type: "dir", children: [
          { name: "common-auth", type: "file", size: "1.1 KB", permissions: "rw-r--r--" }
        ]}
      ]
    },
    {
      name: "var",
      type: "dir",
      children: [
        { name: "log", type: "dir", children: [
          { name: "auth.log", type: "file", size: "412 KB", permissions: "r--------" },
          { name: "syslog", type: "file", size: "2.4 MB", permissions: "r--------" }
        ]}
      ]
    }
  ],
  Windows: [
    {
      name: "Windows",
      type: "dir",
      children: [
        { name: "System32", type: "dir", children: [
          { name: "drivers", type: "dir", children: [
            { name: "etc", type: "dir", children: [
              { name: "services", type: "file", size: "11 KB", permissions: "r--r--r--" }
            ]}
          ]},
          { name: "cmd.exe", type: "file", size: "280 KB", permissions: "r-xr-xr-x" },
          { name: "kernel32.dll", type: "file", size: "4.1 MB", permissions: "r-xr-xr-x" }
        ]}
      ]
    },
    {
      name: "Program Files",
      type: "dir",
      children: [
        { name: "SovereignAgent", type: "dir", children: [
          { name: "sov_agent.exe", type: "file", size: "12.4 MB", permissions: "r-xr-xr-x" },
          { name: "agent_config.json", type: "file", size: "2.1 KB", permissions: "rw-r--r--" }
        ]}
      ]
    }
  ],
  macOS: [
    {
      name: "Applications",
      type: "dir",
      children: [
        { name: "SovereignShield.app", type: "file", size: "48 MB", permissions: "rwxr-xr-x" }
      ]
    },
    {
      name: "Library",
      type: "dir",
      children: [
        { name: "LaunchDaemons", type: "dir", children: [
          { name: "com.sov.daemon.plist", type: "file", size: "824 B", permissions: "rw-r--r--" }
        ]}
      ]
    }
  ]
};

export const RightFocusPanel: React.FC<FocusPanelProps> = ({ device, onClose, onActionTriggered }) => {
  const [activeTab, setActiveTab] = useState<"telemetry" | "explorer" | "actions">("telemetry");
  const [telemetry, setTelemetry] = useState<{ time: string; cpu: number; ram: number; bandwidth: number }[]>([]);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  // Hardware states for live overrides
  const [localScreenLock, setLocalScreenLock] = useState<boolean>(false);
  const [localShutterOpen, setLocalShutterOpen] = useState<boolean>(true);
  const [localBacklightOn, setLocalBacklightOn] = useState<boolean>(true);
  const [localBrightness, setLocalBrightness] = useState<number>(85);
  const [localKeystroke, setLocalKeystroke] = useState<string>("");
  const [keystrokeLogs, setKeystrokeLogs] = useState<string[]>([]);

  // File explorer active root state
  const [currentDirectories, setCurrentDirectories] = useState<FileNode[]>([]);

  useEffect(() => {
    if (device) {
      setTelemetry(generateTelemetryHistory(device.id));
      setCurrentDirectories(mockFileStructures[device.os] || mockFileStructures["Linux"]);
      setOpenFolders({});
      setLocalScreenLock(false);
      setLocalShutterOpen(true);
      setLocalBacklightOn(true);
      setLocalBrightness(85);
      setLocalKeystroke("");
      setKeystrokeLogs([]);
    }
  }, [device]);

  if (!device) return null;

  // Render helpers for sparkline SVG SVG
  const getSvgPath = (key: "cpu" | "ram" | "bandwidth", color: string) => {
    if (telemetry.length === 0) return "";
    const width = 360;
    const height = 70;
    const padding = 5;
    const points = telemetry.map((pt, index) => {
      const x = (index / (telemetry.length - 1)) * (width - padding * 2) + padding;
      let val = pt[key];
      if (key === "bandwidth") {
        val = (val / 30) * 100; // normalize bandwith around 30 max
      }
      const y = height - (val / 100) * (height - padding * 2) - padding;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  const getSvgAreaPath = (key: "cpu" | "ram" | "bandwidth") => {
    if (telemetry.length === 0) return "";
    const width = 360;
    const height = 70;
    const padding = 5;
    const points = telemetry.map((pt, index) => {
      const x = (index / (telemetry.length - 1)) * (width - padding * 2) + padding;
      let val = pt[key];
      if (key === "bandwidth") {
        val = (val / 30) * 100;
      }
      const y = height - (val / 100) * (height - padding * 2) - padding;
      return `${x},${y}`;
    });
    return `M ${padding},${height} L ${points.join(" L ")} L ${width - padding},${height} Z`;
  };

  const toggleFolder = (path: string) => {
    setOpenFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderFileTree = (nodes: FileNode[], parentPath = "") => {
    return (
      <div className="pl-4 font-mono text-[12px] space-y-1.5 text-zinc-300">
        {nodes.map((node) => {
          const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
          const isDir = node.type === "dir";
          const isOpen = openFolders[currentPath];

          return (
            <div key={currentPath}>
              <button
                onClick={() => isDir && toggleFolder(currentPath)}
                className={`flex items-center gap-1.5 py-0.5 px-1 rounded transition-colors text-left w-full hover:bg-zinc-800/40 ${isDir ? "cursor-pointer font-semibold text-zinc-200" : "text-zinc-400"}`}
              >
                {isDir ? (
                  <>
                    <ChevronRight className={`w-3.5 h-3.5 text-yellow-500/80 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    <Folder className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/10" />
                    <span className="truncate">{node.name}/</span>
                  </>
                ) : (
                  <>
                    <div className="w-3.5" />
                    <File className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="truncate">{node.name}</span>
                    <span className="ml-auto text-[10px] text-zinc-600 font-normal">{node.size || "0 B"}</span>
                  </>
                )}
              </button>
              {isDir && isOpen && node.children && (
                <div className="border-l border-zinc-800/80 ml-2 mt-1">
                  {renderFileTree(node.children, currentPath)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <aside id="right-focus-panel" className="w-[410px] bg-[#07090f]/95 border-l border-emerald-500/20 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex flex-col h-full z-10 select-none">
      {/* Header Info */}
      <div className="p-4 border-b border-emerald-500/15 flex items-center justify-between bg-zinc-950/40">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${device.status === "online" ? "bg-emerald-500 shadow-[0_0_6px_#10b981]" : device.status === "warning" ? "bg-amber-500 shadow-[0_0_6px_#f59e0b]" : "bg-neutral-600"}`} />
            <h3 className="font-mono text-sm uppercase font-bold text-zinc-100 tracking-wider truncate">{device.name}</h3>
          </div>
          <span className="font-mono text-xs text-emerald-500/80 font-semibold">{device.id} • {device.ip}</span>
        </div>
        <button id="close-focus-panel" onClick={onClose} className="p-1 hover:bg-zinc-800/40 rounded transition-colors text-zinc-400 hover:text-zinc-100">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="grid grid-cols-3 border-b border-zinc-900 bg-zinc-950/80 text-xs font-mono">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`py-3 text-center transition-colors border-b ${activeTab === "telemetry" ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 font-semibold" : "border-transparent text-zinc-400 hover:bg-zinc-900/40"}`}
        >
          TELEMETRY
        </button>
        <button
          onClick={() => setActiveTab("explorer")}
          className={`py-3 text-center transition-colors border-b ${activeTab === "explorer" ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 font-semibold" : "border-transparent text-zinc-400 hover:bg-zinc-900/40"}`}
        >
          EXPLORER
        </button>
        <button
          onClick={() => setActiveTab("actions")}
          className={`py-3 text-center transition-colors border-b ${activeTab === "actions" ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 font-semibold" : "border-transparent text-zinc-400 hover:bg-zinc-900/40"}`}
        >
          SOV ACTIONS
        </button>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "telemetry" && (
          <div className="space-y-4">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-900 text-center">
                <span className="font-mono text-[9px] text-zinc-500 block">CPU USAGE</span>
                <span className="font-mono text-base font-bold text-zinc-100">{device.cpu}%</span>
              </div>
              <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-900 text-center">
                <span className="font-mono text-[9px] text-zinc-500 block">RAM UTILS</span>
                <span className="font-mono text-base font-bold text-zinc-100">{device.ram}%</span>
              </div>
              <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-900 text-center">
                <span className="font-mono text-[9px] text-zinc-500 block">STORAGE</span>
                <span className="font-mono text-base font-bold text-zinc-100">{device.storage}%</span>
              </div>
            </div>

            {/* Sparkline CPU Graph */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded p-3 relative overflow-hidden">
              <div className="flex justify-between items-center mb-1 bg-zinc-900/20">
                <span className="font-mono text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-emerald-400" /> CPU TELEMETRY HISTORY
                </span>
                <span className="font-mono text-[9px] text-slate-500">Live feed</span>
              </div>
              <svg className="w-full h-[70px] mt-2 overflow-visible" viewBox="0 0 360 70">
                <defs>
                  <linearGradient id="cpu-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={getSvgAreaPath("cpu")} fill="url(#cpu-grad)" />
                <path d={getSvgPath("cpu", "#10b981")} fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Sparkline RAM Graph */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded p-3 relative overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                  <Database className="w-3 h-3 text-cyan-400" /> RAM CAPTURE WAVEFORM
                </span>
                <span className="font-mono text-[9px] text-slate-500">Active map</span>
              </div>
              <svg className="w-full h-[70px] mt-2 overflow-visible" viewBox="0 0 360 70">
                <defs>
                  <linearGradient id="ram-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={getSvgAreaPath("ram")} fill="url(#ram-grad)" />
                <path d={getSvgPath("ram", "#22d3ee")} fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Sparkline Network Bandwidth */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded p-3 relative overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-emerald-500/80" /> DATA TRANSFER STREAM (MB/s)
                </span>
                <span className="font-mono text-[9px] text-slate-500">Simulated buffer</span>
              </div>
              <svg className="w-full h-[70px] mt-2 overflow-visible" viewBox="0 0 360 70">
                <defs>
                  <linearGradient id="band-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={getSvgAreaPath("bandwidth")} fill="url(#band-grad)" />
                <path d={getSvgPath("bandwidth", "#059669")} fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
            </div>

            {/* Detailed Metadata Deck */}
            <div className="bg-zinc-950/40 p-3 rounded border border-zinc-900 text-xs font-mono space-y-2.5">
              <span className="text-[10px] text-zinc-500 block uppercase border-b border-zinc-900 pb-1.5 font-bold tracking-wider">HOST SPECIFICATIONS</span>
              <div className="flex justify-between">
                <span className="text-zinc-500">Node Identifier:</span>
                <span className="text-zinc-300 font-medium">{device.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Active Kernel:</span>
                <span className="text-emerald-400/90 truncate max-w-[200px] text-right">{device.kernelVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Policy Sovereignty rating:</span>
                <span className={`font-semibold ${device.policyCompliance === 100 ? "text-emerald-400" : device.policyCompliance >= 70 ? "text-amber-400" : "text-rose-400"}`}>{device.policyCompliance}% compliant</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Device Location Zone:</span>
                <span className="text-zinc-300">{device.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Uptime Metric:</span>
                <span className="text-zinc-300">{device.uptime}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "explorer" && (
          <div className="space-y-4">
            <div className="bg-zinc-950/80 p-3 rounded border border-zinc-900">
              <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
                <span className="font-mono text-[10px] text-zinc-400 font-bold tracking-wider flex items-center gap-1.5 uppercase">
                  <HardDrive className="w-4 h-4 text-emerald-400" /> REMOTE SYSTEM ROOT ({device.os})
                </span>
                <span className="text-[10px] text-emerald-500/80 font-mono bg-emerald-950/30 px-1.5 py-0.5 border border-emerald-500/10 rounded">MOUNTED</span>
              </div>
              <div className="space-y-1">
                {renderFileTree(currentDirectories)}
              </div>
            </div>
            <div className="bg-zinc-900/20 p-3 rounded border border-zinc-900 text-[11px] font-mono text-zinc-500 leading-snug">
              ⚠️ Direct system storage is fully sandboxed in compliance modes. Modification of kernel modules at this level enforces instant biometric security lockouts.
            </div>
          </div>
        )}

        {activeTab === "actions" && (() => {
          const isLaptop = device.name.toLowerCase().includes("laptop") || device.os === "macOS" || device.id.startsWith("DEV-049") || device.id.startsWith("DEV-050") || device.id.startsWith("DEV-051");
          return (
            <div className="space-y-4 font-mono text-xs">
              
              {/* INTERACTIVE CONTROLLER DECK LAUNCHER */}
              <div className="bg-cyan-950/20 border border-cyan-500/30 p-4 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">LIVE WEBSOCKET CONTROLLER GATE</span>
                </div>
                <h4 className="text-[11px] font-black text-white uppercase mb-1.5">Sovereign VNC Desktop & Shell</h4>
                <p className="text-[10px] text-zinc-400 leading-normal mb-3">Tether to this machine to take full visual mouse control, view frame updates, and run clinical node scripts.</p>
                <button
                  onClick={() => onActionTriggered("OPEN_REMOTE_TERMINAL", device.id, "success")}
                  className="w-full py-2.5 bg-[#24175e] hover:bg-[#2e1d75] border border-cyan-400/20 text-cyan-400 hover:text-white rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-[11px] cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(34,211,238,0.05)] hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  <Monitor className="w-3.5 h-3.5" /> Launch Live Remote Deck
                </button>
              </div>

              {/* DYNAMIC LAPTOP PHYSICAL CONTROLS SUB-PANEL */}
              {isLaptop && (
                <div className="bg-purple-950/20 border border-purple-500/10 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest block border-b border-purple-950 pb-1.5 mb-1">💻 CLIENT HARDWARE DRIVER MODIFIERS</span>
                  
                  {/* Screen Lock Twi-State Card */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-300">Screen Lock Lockout:</span>
                    <button
                      onClick={() => {
                        const nextLock = !localScreenLock;
                        setLocalScreenLock(nextLock);
                        onActionTriggered(nextLock ? "Physical Screen Lockout Activated" : "Local Display Unlocked", device.id, "warning");
                      }}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition-all ${
                        localScreenLock 
                          ? "bg-rose-950/30 border-rose-500/40 text-rose-400" 
                          : "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                      }`}
                    >
                      {localScreenLock ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{localScreenLock ? "Secured Map" : "Released"}</span>
                    </button>
                  </div>

                  {/* Lens safety Shutter */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-300">Lens Safety Shutter:</span>
                    <button
                      onClick={() => {
                        const nextShutter = !localShutterOpen;
                        setLocalShutterOpen(nextShutter);
                        onActionTriggered(nextShutter ? "Privacy camera shutter opened" : "Camera privacy armor closed", device.id, "info");
                      }}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition-all ${
                        localShutterOpen 
                          ? "bg-emerald-950/10 border-emerald-500/30 text-emerald-400" 
                          : "bg-zinc-900 border-zinc-805 text-zinc-500"
                      }`}
                    >
                      {localShutterOpen ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{localShutterOpen ? "Active Lens" : "Shining Off"}</span>
                    </button>
                  </div>

                  {/* Keyboard backlight toggle */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-300">Keyboard LEDs Backlight:</span>
                    <button
                      onClick={() => {
                        const nextBacklight = !localBacklightOn;
                        setLocalBacklightOn(nextBacklight);
                        onActionTriggered(nextBacklight ? "Keyboard backlights at 100%" : "Keyboard backlights at 0%", device.id, "info");
                      }}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition-all ${
                        localBacklightOn 
                          ? "bg-cyan-950/20 border-cyan-400/35 text-cyan-400" 
                          : "bg-zinc-900 border-zinc-805 text-zinc-500"
                      }`}
                    >
                      <Keyboard className="w-3 h-3" />
                      <span>{localBacklightOn ? "Matrix ON" : "Matrix OFF"}</span>
                    </button>
                  </div>

                  {/* Slider for light brightness */}
                  <div className="space-y-1 pt-1.5">
                    <div className="flex justify-between text-[10px] text-purple-300">
                      <span>Live Brightness Level:</span>
                      <span className="text-cyan-400 font-bold">{localBrightness}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun size={12} className="text-amber-400" />
                      <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        value={localBrightness}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setLocalBrightness(val);
                          onActionTriggered(`Screen brightness slider: ${val}%`, device.id, "info");
                        }}
                        className="w-full h-1 bg-[#120732] rounded-lg appearance-none cursor-pointer border border-purple-900"
                      />
                    </div>
                  </div>

                  {/* Direct Keystroke Injector Form */}
                  <div className="pt-2 border-t border-purple-950/50 space-y-2">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">Hardware Keystroke Injector:</span>
                    <div className="flex gap-1.5">
                      <input 
                        type="text"
                        value={localKeystroke}
                        onChange={(e) => setLocalKeystroke(e.target.value)}
                        placeholder="Type hardware sweep keyseq..."
                        className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded px-2.5 py-1.5 text-[10px] text-cyan-400 font-mono outline-none focus:border-cyan-400/40"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && localKeystroke.trim()) {
                            const val = localKeystroke.trim();
                            const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
                            setKeystrokeLogs(prev => [`[${time}] dis: "${val}"`, ...prev].slice(0, 3));
                            onActionTriggered(`Manual keyboard inject string: "${val}"`, device.id, "success");
                            setLocalKeystroke("");
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (!localKeystroke.trim()) return;
                          const val = localKeystroke.trim();
                          const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
                          setKeystrokeLogs(prev => [`[${time}] dis: "${val}"`, ...prev].slice(0, 3));
                          onActionTriggered(`Manual keyboard inject string: "${val}"`, device.id, "success");
                          setLocalKeystroke("");
                        }}
                        className="p-1.5 bg-cyan-900/30 hover:bg-cyan-950/60 text-cyan-400 border border-cyan-400/30 rounded cursor-pointer flex items-center justify-center transition-colors"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Mini inline keystroke buffer log */}
                    {keystrokeLogs.length > 0 && (
                      <div className="bg-[#0b051c] p-2 rounded border border-purple-950 space-y-1">
                        {keystrokeLogs.map((logStr, lIdx) => (
                          <div key={lIdx} className="text-[8.5px] font-mono text-[#a855f7] leading-tight truncate">
                            {logStr}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider mb-1 pt-2">SECURE CONSOLE ACTUATION OVERRIDES</span>

              {/* ACTION 1: REBOOT SYSTEM */}
              <button
                onClick={() => onActionTriggered("Manual Hard Reboot Requested", device.id, "warning")}
                className="w-full flex items-center justify-between p-3 rounded border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors text-left group cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <span className="text-amber-400 font-semibold flex items-center gap-1.5 mb-1 text-sm">
                    <Play className="w-3.5 h-3.5 fill-amber-500/20 text-danger" /> FORCE CYCLE POWER
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-normal">Safely drains motherboard buffers and reboots root OS using cold hardware relays.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* ACTION 2: ISOLATE NODE */}
              <button
                onClick={() => onActionTriggered("Cyber-Security Isolation Triggered", device.id, "critical")}
                className="w-full flex items-center justify-between p-3 rounded border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 transition-colors text-left group cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <span className="text-rose-400 font-semibold flex items-center gap-1.5 mb-1 text-sm">
                    <AlertTriangle className="w-3.5 h-3.5" /> ISOLATE INSTANT LOCK
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-normal">Instantly cuts network routing to block outbound packets. Device enters airgap lockdown mode.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* ACTION 3: DEPLOY RE-ENCRYPT */}
              <button
                onClick={() => onActionTriggered("Cryptographic Policy Force Enforced", device.id, "success")}
                className="w-full flex items-center justify-between p-3 rounded border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors text-left group cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mb-1 text-sm">
                    <ShieldCheck className="w-3.5 h-3.5" /> ENFORCE FULL COMPLIANCE
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-normal">Forces active verification on all non-compliant policies. Disables USB mounts dynamically.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* ACTION 4: REMOTE DIAGNOSTIC SHELL */}
              <button
                onClick={() => onActionTriggered("Diagnostic Port Stream Synced", device.id, "info")}
                className="w-full flex items-center justify-between p-3 rounded border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10 transition-colors text-left group cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <span className="text-teal-400 font-semibold flex items-center gap-1.5 mb-1 text-sm">
                    <Terminal className="w-3.5 h-3.5" /> REMOTE TERMINAL TETHER
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-normal">Establish a secure, authenticated SSH shell session in active foreground container environment.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-teal-400 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })()}
      </div>
    </aside>
  );
};
