import React, { useState, useEffect } from "react";
import { 
  Monitor, ShieldCheck, Activity, BrainCircuit, AlertTriangle, 
  Settings, Power, Server, Terminal, Key, ShieldAlert, Cpu, 
  CheckCircle, RefreshCw, Send, Lock, HelpCircle, HardDrive, Wifi, 
  Clock, Award, ChevronRight, User, Fingerprint, RefreshCcw, Eye, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Device, SystemLog } from "../types";
import { GlassCard, NeonButton } from "./GlassUI";
import { SovereignThreeCube } from "./SovereignThreeCube";

interface ClientDashboardProps {
  devices: Device[];
  logs: SystemLog[];
  onAddLog: (newLog: SystemLog) => void;
  isLightMode: boolean;
  onModifyDeviceStatus: (deviceId: string, status: "online" | "warning" | "offline") => void;
  onActionTriggered: (actionName: string, deviceId: string, level: "info" | "warning" | "critical" | "success") => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  devices,
  logs,
  onAddLog,
  isLightMode,
  onModifyDeviceStatus,
  onActionTriggered
}) => {
  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"sanctuary" | "transparency" | "request-center" | "credentials">("sanctuary");
  
  // Identify the target personal subscriber devices
  const clientDevices = devices.filter(d => 
    d.group === "Volatile Guest Link" || 
    d.name.includes("RE-") || 
    d.name.includes("CLIENT") || 
    d.name.includes("LAPTOP")
  );
  
  const defaultDevice = clientDevices[0] || devices[0];
  const [selectedClientDeviceId, setSelectedClientDeviceId] = useState<string>(defaultDevice?.id || "");
  
  const activeDevice = devices.find(d => d.id === selectedClientDeviceId) || defaultDevice;

  // State for Privilege Boost requests
  const [privilegeDuration, setPrivilegeDuration] = useState("1h");
  const [privilegeJustification, setPrivilegeJustification] = useState("");
  const [privilegeStatus, setPrivilegeStatus] = useState<"idle" | "submitting" | "pending" | "approved">("idle");
  const [activePrivilegeLogs, setActivePrivilegeLogs] = useState<Array<{id: string, time: string, action: string, status: string}>>([
    { id: "REQ-409", time: "Hier, 15:40", action: "Installation de Docker Engine", status: "APPROUVÉ" },
    { id: "REQ-382", time: "28 Mai, 09:12", action: "Ouverture du port 8080 pour debug", status: "EXPIRÉ" }
  ]);

  // Support Request form states
  const [supportCategory, setSupportCategory] = useState("Incident Réseau");
  const [supportMsg, setSupportMsg] = useState("");
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [supportResponse, setSupportResponse] = useState<string | null>(null);

  // Shell terminal simulation for local host debugging
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[*] Connecting to Sovereign Hub bastion gateway...",
    "[+] Dynamic Ed25519 key authentication completed.",
    "[+] Active mTLS handshakes verified. Status: NOMINAL"
  ]);
  const [commandInput, setCommandInput] = useState("");
  const [isExecutingCmd, setIsExecutingCmd] = useState(false);

  // Rotation / visual engagement metrics
  const [activePingCount, setActivePingCount] = useState(0);
  const [isPinging, setIsPinging] = useState(false);
  const [lastSelfPingTime, setLastSelfPingTime] = useState<string>("Non testé");

  // Real-time military threat interception stream data (Dynamic "Proof of Vigilance" logs)
  const [intercepts, setIntercepts] = useState<Array<{time: string, service: string, msg: string, status: "BLOCKED" | "DROPPED" | "VERIFIED" | "NEUTRALIZED" | "OK"}>>([
    { time: "12:02:01", service: "SCAN_RECON", msg: "Port 80 TCP probe mapping attempt blocked", status: "BLOCKED" },
    { time: "12:05:22", service: "NEURAL_SENTRY", msg: "Anomalous inbound traffic flow vector dropped", status: "DROPPED" },
    { time: "12:12:45", service: "KEY_EXCHANGE", msg: "mTLS Handshake verified & stored locally", status: "VERIFIED" },
    { time: "12:20:11", service: "IDS_SHIELD", msg: "SSH Brute-Force threshold limit reached", status: "NEUTRALIZED" },
    { time: "12:35:00", service: "CORE_HV", msg: "Sandbox hypervisor heartbeat active", status: "OK" }
  ]);

  // Command Red-Line emergency response state
  const [redLineStatus, setRedLineStatus] = useState<"idle" | "requesting" | "dispatched">("idle");
  const [redLineCountdown, setRedLineCountdown] = useState<number>(300);

  // Interval timer adding dynamic background cyber defense logs continuously
  useEffect(() => {
    const services = ["SENTRY_NODE", "QUANTUM_FIREWALL", "IDS_DETECTION", "mTLS_TUNNEL", "RAM_GUARD", "HEURISTIC_ANA"];
    const descriptions = [
      "Interrupted automated port scanning signature",
      "Suppressed unaligned TLS client handshake probe",
      "Dynamic iptables rule updated for host protection",
      "Scrubbed memory cells for obsolete kernel sessions",
      "Sanitized volatile diskless staging filesystem",
      "ICMP telemetry heartbeat successfully echoed",
      "Filtered anomalous boundary routing attempt"
    ];
    const statuses: Array<"BLOCKED" | "DROPPED" | "VERIFIED" | "NEUTRALIZED" | "OK"> = ["BLOCKED", "DROPPED", "VERIFIED", "NEUTRALIZED", "OK"];

    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const service = services[Math.floor(Math.random() * services.length)];
      const msg = descriptions[Math.floor(Math.random() * descriptions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      setIntercepts(prev => {
        const next = [...prev, { time: timeStr, service, msg, status }];
        if (next.length > 25) {
          return next.slice(next.length - 25);
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Timer loop for Emergency protocol countdowns
  useEffect(() => {
    if (redLineStatus !== "dispatched") return;
    const timer = setInterval(() => {
      setRedLineCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [redLineStatus]);

  const handleTriggerRedLine = () => {
    if (redLineStatus !== "idle") return;
    setRedLineStatus("requesting");
    
    const redLineLog: SystemLog = {
        id: `LOG-RED-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        source: activeDevice?.name || "Client Portal",
        level: "critical",
        message: `🚨 RED-LINE EMERGENCY PROTOCOL ENGAGED BY SUBSCRIBER ON ${activeDevice?.name || "NODE"}`
      };
      onAddLog(redLineLog);
      onActionTriggered("Red-Line Emergency Dispatched", activeDevice?.id || "", "critical");

      setTimeout(() => {
        setRedLineStatus("dispatched");
        setRedLineCountdown(300);
      }, 1500);
  };

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}m ${remainingSecs.toString().padStart(2, "0")}s`;
  };

  const getSovereigntyHash = () => {
    const hour = new Date().getHours();
    return `0x8F2${hour.toString(16).toUpperCase()}9B${hour * 7 + 1}C1A`;
  };

  // Reset/update local terminal whenever the selected client device shifts
  useEffect(() => {
    if (activeDevice) {
      setTerminalLogs([
        `[*] Initializing client local diagnostics for host: ${activeDevice.name}`,
        `[+] OS version detected: ${activeDevice.os} (Kernel: ${activeDevice.kernelVersion})`,
        `[+] Static target internal route: ${activeDevice.ip}`,
        `[+] Current location: ${activeDevice.location}`,
        `[*] Listening on secure RAM key mount... OK.`,
        `[*] System health: ${activeDevice.status.toUpperCase()} (${activeDevice.policyCompliance}% Compliance)`
      ]);
    }
  }, [selectedClientDeviceId]);

  // Handle local diagnostics shell submission
  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    setCommandInput("");
    setIsExecutingCmd(true);

    setTerminalLogs(prev => [...prev, `[client@${activeDevice?.name || "desktop"}]# ${cmd}`]);

    setTimeout(() => {
      let result = `Unknown local command: '${cmd}'. Available: help, info, status, secrets-audit`;
      const formatted = cmd.toLowerCase();

      if (formatted === "help") {
        result = "Available Local Diagnostic Comands:\n - help: List available shell utilities\n - info: Output physical host kernel descriptors\n - status: Retrieve immediate hardware sensor metrics\n - secrets-audit: Audit volatile keys mounted on /dev/shm";
      } else if (formatted === "info") {
        result = `SYSTEM HARDWARE DIAGNOSTICS:\n - Host Name: ${activeDevice?.name}\n - IP: ${activeDevice?.ip}\n - Kernel Release: ${activeDevice?.kernelVersion}\n - Uptime Duration: ${activeDevice?.uptime}`;
      } else if (formatted === "status") {
        result = `METRICS FEED:\n - CPU Usage: ${activeDevice?.cpu ?? 12}%\n - RAM Utilization: ${activeDevice?.ram ?? 28}%\n - Dynamic Network Bandwidth: ${activeDevice?.bandwidth ?? 4.8} MB/s`;
      } else if (formatted === "secrets-audit") {
        result = `VOLATILE RAM DECRYPT DECODING:\n -> Mounted directory: /dev/shm/\n -> Key: /dev/shm/nexus_session_key (ACTIVE)\n -> Storage footprint: 32 bytes (HEURISTIC ENTROPY EXCELLENCE)\n -> Security Notice: Hard power disruption completely clears the memory cells!`;
      }

      setTerminalLogs(prev => [...prev, ...result.split("\n")]);
      setIsExecutingCmd(false);
    }, 450);
  };

  // Trigger self hardware ping check
  const handleTriggerSelfPing = () => {
    if (isPinging) return;
    setIsPinging(true);
    setTerminalLogs(prev => [...prev, `[*] Dispatched dynamic echo ICMP request to central-command...`]);

    setTimeout(() => {
      const pingMs = Math.floor(12 + Math.random() * 20);
      setIsPinging(false);
      setActivePingCount(p => p + 1);
      const timeStr = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastSelfPingTime(`${pingMs}ms (${timeStr})`);
      setTerminalLogs(prev => [
        ...prev,
        `[+] Hub response received in ${pingMs}ms. Routing route complete.`,
        `[+] Jitter variance: 0.2ms | Handshake status: SECURE`
      ]);
      
      onActionTriggered("Client Self Ping Executed", activeDevice.id, "success");
    }, 1000);
  };

  // Submit privilege boost request
  const handleRequestPrivilegeBoost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privilegeJustification.trim()) return;

    setPrivilegeStatus("submitting");

    // Push action log
    const requestLogId = `REQ-${Math.floor(500 + Math.random() * 500)}`;
    const newRequestItem = {
      id: requestLogId,
      time: "À l'instant",
      action: privilegeJustification.trim(),
      status: "SUPPORT REÇU - ANALYSE..."
    };

    setTimeout(() => {
      setPrivilegeStatus("pending");
      setActivePrivilegeLogs(prev => [newRequestItem, ...prev]);

      // Add to global logs so the admins see it
      const systemLog: SystemLog = {
        id: `LOG-BOOST-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        source: activeDevice?.name || "Client Console",
        level: "warning",
        message: `PRIVILEGE ELEVATION REQUEST FILED: user requested permission boost (${privilegeDuration}) for: "${privilegeJustification}"`
      };
      onAddLog(systemLog);

      // Auto approve after 4 seconds to simulate dynamic automated admin heuristics!
      setTimeout(() => {
        setPrivilegeStatus("approved");
        setActivePrivilegeLogs(prev => 
          prev.map(item => item.id === requestLogId ? { ...item, status: "APPROUVÉ EN DIRECT" } : item)
        );

        const approvalLog: SystemLog = {
          id: `LOG-APPROVE-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
          source: "Sovereign AI Gateway",
          level: "success",
          message: `AUTOMATED COMPLIANCE ENGINE APPROVED PRIVILEGE ELEVATION: ${requestLogId} granted for ${privilegeDuration} (${activeDevice?.name})`
        };
        onAddLog(approvalLog);
        
        setPrivilegeJustification("");
      }, 4000);

    }, 1200);
  };

  // Submit Support incident
  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;

    setIsSubmittingSupport(true);
    setSupportResponse(null);

    setTimeout(() => {
      const ticketId = `TKT-${Math.floor(100 + Math.random() * 899)}`;
      setIsSubmittingSupport(false);
      setSupportResponse(`Incident sauvegardé au centre de commandement. Ticket ID : ${ticketId}`);
      
      const newLog: SystemLog = {
        id: `LOG-TKT-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        source: activeDevice?.name || "Client Support Desk",
        level: "info",
        message: `Support incident ticket ${ticketId} created. Category: ${supportCategory}. Context: "${supportMsg}"`
      };
      onAddLog(newLog);
      
      setSupportMsg("");
    }, 1400);
  };

  // Hard reboot client trigger
  const handleClientSelfReboot = () => {
    if (!activeDevice) return;
    
    onModifyDeviceStatus(activeDevice.id, "offline");
    onActionTriggered("Critical Hardware Reboot Triggered by Subscriber", activeDevice.id, "critical");

    const sysLog: SystemLog = {
      id: `LOG-REBOOT-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      source: activeDevice.name,
      level: "critical",
      message: `EMERGENCY DISKLESS RAM RESET: subscriber triggered physical cell purge. Host offline.`
    };
    onAddLog(sysLog);

    setTerminalLogs(prev => [
      ...prev,
      "❌ !!! DISPATCHING MEMORY SYSTEM PURGE !!!",
      "[*] Erasing cryptographic keys in /dev/shm...",
      "[*] Flushing temporary system state caches...",
      "[-] Offlining node network routes...",
      "[-] STATUS: OFFLINE"
    ]);
  };

  return (
    <div id="sovereign-sanctuary" className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER SIMPLIFIÉ & BANDEAU COMPTE CLIENT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/50 p-4 rounded-2xl border border-stone-800/10">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#7c6bb5]/30 bg-[#7c6bb5]/10 text-[#a855f7] rounded-xl">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black tracking-widest text-[#7c6bb5] uppercase font-mono">Sovereign Client Sanctuary</span>
              <span className="bg-gradient-to-r from-[#a855f7] to-[#7c6bb5] text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase">SUBSCRIBER PORTAL</span>
            </div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <span>Hôte Surveillé :</span>
              <span className="text-cyan-400 font-mono text-xs">{activeDevice?.name || "Chargement..."}</span>
            </h1>
          </div>
        </div>

        {/* Change client device simulator */}
        <div className="flex items-center gap-2 font-mono text-[9px]">
          <span className="text-stone-500 uppercase font-black">SIMULATEUR DE COMPTE CLIENT :</span>
          <select 
            value={selectedClientDeviceId} 
            onChange={(e) => setSelectedClientDeviceId(e.target.value)}
            className="bg-black/95 border border-stone-800 text-stone-300 text-xs py-1 px-2.5 rounded-lg font-mono outline-none focus:border-[#7c6bb5]/50"
          >
            {devices.map(d => (
              <option key={d.id} value={d.id}>
                👤 {d.name} ({d.ip})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DISCORD-STYLE TAB NAVIGATION AND LAYOUT SWITCHES */}
      <div className="flex flex-wrap items-center gap-2 bg-stone-950/80 border border-stone-900/50 p-2 rounded-2xl font-mono text-[9.5px]">
        <button
          onClick={() => setActiveTab("sanctuary")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black uppercase transition-all ${
            activeTab === "sanctuary" 
              ? "bg-[#7c6bb5] text-white shadow-lg shadow-purple-500/15" 
              : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/40"
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          🔮 SITREP CENTER (Operational Status)
        </button>

        <button
          onClick={() => setActiveTab("transparency")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black uppercase transition-all ${
            activeTab === "transparency" 
              ? "bg-[#7c6bb5] text-white shadow-lg shadow-purple-500/15" 
              : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/40"
          }`}
        >
          <Eye className="w-4 h-4" />
          ✨ SENTRY ACTIONS (Transparency Log)
        </button>

        <button
          onClick={() => setActiveTab("request-center")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black uppercase transition-all ${
            activeTab === "request-center" 
              ? "bg-[#7c6bb5] text-white shadow-lg shadow-purple-500/15" 
              : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/40"
          }`}
        >
          <Key className="w-4 h-4" />
          🚪 PRIVILEGE ESCALATION (Boost Host)
        </button>

        <button
          onClick={() => setActiveTab("credentials")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black uppercase transition-all ${
            activeTab === "credentials" 
              ? "bg-[#7c6bb5] text-white shadow-lg shadow-purple-500/15" 
              : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/40"
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          🛰️ CRISIS SIGNATURES (mTLS Credentials)
        </button>
      </div>

      {/* DETAILED CONTENT VIEWS */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: TACTICAL READY SITREP VIEWS WITH 3D CORE & AUTOPLAY LOGS */}
        {activeTab === "sanctuary" && (
          <motion.div
            key="sandbox-sanctuary"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-mono"
          >
            {/* COLUMN 1: THE READINESS CHECKLIST & SOVEREIGNTY SEAL & RED LINE */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
              
              {/* Part A: Readiness Checklist */}
              <GlassCard className="p-5 space-y-4 bg-stone-900/40 relative overflow-hidden flex-1">
                <div className="border-b border-stone-850 pb-2.5 flex justify-between items-center z-10 relative">
                  <h3 className="text-xs font-black text-emerald-450 font-mono uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Readiness Checklist
                  </h3>
                  <span className="text-[7.5px] bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-black">NOMINAL</span>
                </div>

                <div className="space-y-3 font-mono text-[10.5px] z-10 relative">
                  {[
                    { label: "Perimeter Firewall", status: "ACTIVE", detail: "Exclusion filters fully deployed" },
                    { label: "Quantum Encryption", status: "ENGAGED", detail: "Active Ed25519 rotational cipher" },
                    { label: "Neural Link Status", status: "STABLE", detail: "Continuous telemetry compliance" },
                    { label: "mTLS Handshake Link", status: "VERIFIED", detail: "Active key bounds cached in RAM" }
                  ].map((chk, i) => (
                    <div key={i} className="flex flex-col gap-0.5 border-b border-stone-900/20 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-extrabold text-xs">✓</span>
                          <span className="text-stone-300 font-black uppercase tracking-tight">{chk.label}</span>
                        </div>
                        <span className="text-emerald-450 font-black text-[8.5px] bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                          {chk.status}
                        </span>
                      </div>
                      <span className="text-[8px] text-stone-500 italic pl-4 font-mono">{chk.detail}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Part B: Sovereignty Seal */}
              <GlassCard className="p-5 font-mono bg-stone-950/20 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <Award className="w-16 h-16 text-[#7c6bb5]" />
                </div>
                
                <h4 className="text-[10px] font-black text-[#a855f7] uppercase tracking-widest flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Sovereignty Seal
                </h4>

                <div className="bg-black/40 p-3 rounded-lg border border-stone-900 text-[9px] text-stone-300 space-y-1.5 leading-relaxed">
                  <div className="text-[#a855f7] font-black text-[8px] tracking-widest uppercase">INTEGRITY BLOCK MARK</div>
                  <p className="text-stone-400 text-justify">
                    Sovereign cyber shield verified automatically at {new Date().getHours()}:00 UTC. Digitally enforced & signed by Sovereign-Command-01.
                  </p>
                  <p className="text-stone-500 break-all select-all text-[8px] bg-stone-900/80 p-1.5 rounded border border-stone-850/45">
                    SIGN: {getSovereigntyHash()}//ENCRYPTED_MTLS
                  </p>
                </div>
              </GlassCard>

              {/* Part C: Emergency Command "Red-Line" response */}
              <GlassCard className="p-5 border border-red-500/10 bg-rose-950/5 space-y-3">
                <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest font-mono flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 animate-pulse text-red-550" />
                  SITREP Emergency Red-Line
                </h4>
                
                <p className="text-[9px] text-stone-400 font-mono leading-relaxed text-left">
                  Request immediate sentinel human triage on security status, on-site backup pipelines, and physical host lockups.
                </p>

                {redLineStatus === "idle" && (
                  <button
                    onClick={handleTriggerRedLine}
                    className="w-full py-3 bg-red-955/20 hover:bg-red-950 border border-red-900 hover:border-red-600 text-red-300 hover:text-white rounded-xl font-mono text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer animate-pulse text-center"
                  >
                    🚨 REQUEST IMMEDIATE INTERVENTION
                  </button>
                )}

                {redLineStatus === "requesting" && (
                  <div className="w-full py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest text-amber-550 text-center flex items-center justify-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    DISPATCHING CRISIS SIGNAL TO HUB...
                  </div>
                )}

                {redLineStatus === "dispatched" && (
                  <div className="space-y-2 bg-red-950/20 border border-red-550/30 p-3 rounded-xl font-mono">
                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest text-center animate-pulse flex items-center justify-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      Sovereign Guard Inbound
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono border-t border-stone-900 pt-1.5 text-stone-500 uppercase font-black">
                      <span>Response deadline:</span>
                      <span className="text-white font-black font-mono">{formatCountdown(redLineCountdown)}</span>
                    </div>
                  </div>
                )}
              </GlassCard>

            </div>

            {/* COLUMN 2: THE ASSET MIRROR (3D CUBE IN THE CENTER) */}
            <GlassCard className="lg:col-span-5 p-6 flex flex-col justify-between items-center text-center relative overflow-hidden h-full min-h-[520px]">
              
              {/* Blurs for premium styling */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/10 pointer-events-none z-10" />
              <div className="absolute top-1/4 left-1/4 w-52 h-52 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

              {/* Status Header */}
              <div className="w-full flex justify-between items-center z-20 font-mono text-left">
                <div>
                  <span className="text-[8px] text-[#7c6bb5] font-black uppercase block">REAL-TIME TRUST MONITORING</span>
                  <span className="text-xs text-white font-extrabold uppercase tracking-tight">{activeDevice?.name || "RE-NEXUS-01"}</span>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[8.5px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono">
                    🛡️ GUARANTEE: NOMINAL
                  </span>
                </div>
              </div>

              {/* Interactive 3D Model Core with Three Cube */}
              <div className="relative w-full h-[260px] flex items-center justify-center pointer-events-auto z-10 my-4 cursor-grab active:cursor-grabbing">
                <SovereignThreeCube isLightMode={isLightMode} />
                
                {/* Micro instructions overlay */}
                <div className="absolute bottom-1 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-850/70 text-[8px] text-stone-400 font-mono flex items-center gap-1.5 uppercase pointer-events-none z-20 shadow-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>3D QUANTUM ASSET MIRROR (ROTATABLE)</span>
                </div>
              </div>

              {/* System Compliance Progress Stat */}
              <div className="w-full z-20 space-y-4">
                <div className="text-center">
                  <div className="text-[9px] text-stone-500 font-mono uppercase tracking-widest mb-1 font-black">Current Integrity state compliance</div>
                  <div className="text-4xl font-black text-white italic tracking-tighter font-mono flex items-center justify-center gap-1">
                    <span>99.98%</span>
                    <span className="text-xs text-emerald-400 font-bold tracking-normal not-italic ml-1">MAX VALUE</span>
                  </div>
                </div>

                {/* Foot controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-stone-900/60 pt-4 text-xs font-mono">
                  <div className="text-left">
                    <p className="text-[8.5px] text-[#7c6bb5] uppercase font-black text-stone-500">Dynamic Target Route</p>
                    <p className="text-stone-300 font-bold text-[11px]">{activeDevice?.ip}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleTriggerSelfPing}
                      disabled={isPinging}
                      className="px-3 py-1.5 bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-500/30 font-mono text-[9px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <RefreshCcw className={`w-3 h-3 ${isPinging ? "animate-spin" : ""}`} />
                      Trigger echo Ping
                    </button>
                  </div>
                </div>
              </div>

            </GlassCard>

            {/* COLUMN 3: THE INTERCEPTION STREAM LOGS (THE "PROOF-OF-WORK") */}
            <GlassCard className="lg:col-span-3 p-5 flex flex-col justify-between bg-black/40 h-full min-h-[520px] relative overflow-hidden font-mono border-r-4 border-cyan-500/85">
              
              <div className="flex justify-between items-center border-b border-stone-900 pb-2.5 mb-3.5">
                <h3 className="text-xs font-black text-cyan-455 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Threat Interception Stream
                </h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              </div>

              {/* Dynamic autoscrolling message console stream */}
              <div className="flex-grow space-y-3.5 overflow-y-auto pr-1 text-[9.5px] leading-relaxed select-none h-[385px] max-h-[385px] font-mono p-1 rounded">
                {intercepts.map((logItem, idx) => (
                  <div key={idx} className="border-b border-stone-900/20 pb-1.5 last:border-0">
                    <div className="flex items-center justify-between font-mono text-[8px] text-stone-500 mb-0.5">
                      <span>[{logItem.time}] {logItem.service}</span>
                      <span className={`font-black uppercase px-1 py-0.2 rounded-sm text-[7.5px] ${
                        logItem.status === "BLOCKED" ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/20" :
                        logItem.status === "DROPPED" ? "bg-amber-950/50 text-amber-500 border border-amber-500/20" :
                        logItem.status === "VERIFIED" ? "bg-emerald-950/50 text-emerald-450 border border-emerald-500/20" :
                        logItem.status === "NEUTRALIZED" ? "bg-red-950/50 text-rose-500 border border-red-500/20" :
                        "bg-stone-900 text-stone-400"
                      }`}>
                        {logItem.status}
                      </span>
                    </div>

                    <p className="text-stone-300 font-mono tracking-tight lowercase">
                      → {logItem.msg}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-stone-900 flex justify-between items-center text-[7.5px] text-stone-500 uppercase tracking-widest">
                <span>Vigilance continuous</span>
                <span className="font-semibold text-stone-400">SIG: NXS_{getSovereigntyHash().substring(4, 9)}</span>
              </div>

            </GlassCard>

          </motion.div>
        )}

        {/* VIEW 2: JOURNAL DE TRANSPARENCE (Show when admins operate) */}
        {activeTab === "transparency" && (
          <motion.div
            key="sandbox-transparency"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <GlassCard className="p-6 space-y-5">
              <div className="border-b border-stone-900/60 pb-3">
                <h3 className="text-xs font-black text-cyan-400 font-mono uppercase tracking-widest flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Journal de Transparence Audit (Activities feed)
                </h3>
                <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                  Visualisation continue de toutes les interventions de sécurité effectuées par l'équipe d'administration centrale sur votre machine.
                </p>
              </div>

              {/* Simulated timeline events showcasing high confidence */}
              <div className="font-mono text-xs space-y-3">
                {[
                  {
                    time: "Il y a 3 heures",
                    author: "Central AI Agent",
                    title: "Mise à jour dynamique de la clé éphémère de RAM",
                    desc: "La clé de liaison Ed25519 hébergée dans /dev/shm a été renouvelée après expiration de sa durée de vie (TTL). Ancien registre éliminé des cellules.",
                    type: "routine"
                  },
                  {
                    time: "Hier, 21:30",
                    author: "Sovereign Compliance Bot",
                    title: "Scan de conformité de vulnérabilités Heuristique",
                    desc: "Reconnaissance automatisée des ports virtuels et de l'état système. Analyse terminée avec zéro anomalie détectée.",
                    type: "success"
                  },
                  {
                    time: "Hier, 10:15",
                    author: "Sovereign Auditor (Clément Aud.)",
                    title: "Rapport SOC2 - Signature électronique de légitimité",
                    desc: "L'auditeur légal a signé le journal de conformité de sécurité de votre groupe. Habilitation revalidée.",
                    type: "audit"
                  },
                  {
                    time: "30 Mai, 14:02",
                    author: "Super-Admin Operator",
                    title: "Mise à jour des règles d'exclusion réseau",
                    desc: "L'administrateur a configuré une exclusion mTLS dynamique de liaison pour contourner les inspections d'interception réseau non approuvées.",
                    type: "admin"
                  }
                ].map((act, idx) => (
                  <div key={idx} className="p-4 bg-black/45 border border-stone-900 rounded-xl space-y-2 relative">
                    {/* Tiny type tag */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          act.type === "routine" ? "bg-cyan-455" :
                          act.type === "success" ? "bg-emerald-400" :
                          act.type === "audit" ? "bg-amber-400" : "bg-[#a855f7]"
                        }`} />
                        <span className="text-[10px] text-stone-300 font-extrabold uppercase">{act.title}</span>
                      </div>
                      <span className="text-[8.5px] text-stone-500 uppercase">{act.time}</span>
                    </div>

                    <p className="text-[10px] text-stone-400 leading-relaxed text-justify">
                      {act.desc}
                    </p>

                    <div className="flex justify-between border-t border-stone-900/60 pt-2 text-[8px] text-stone-500 uppercase">
                      <span>Intervenant : <strong>{act.author}</strong></span>
                      <span className="text-emerald-400 font-bold">● VÉRIFIÉ PAR PROTOCOLE</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-stone-900/40 p-4 border border-stone-850 rounded-xl text-[9px] text-stone-500 uppercase leading-relaxed text-justify font-mono">
                🛡️ <strong>Note sur la Souveraineté de Données :</strong> Ce journal d'activité est ancré directement dans la console d'audit générale. Il s'agit d'une transparence absolue : aucun administrateur ne peut effectuer de tâche sur votre terminal à votre insu.
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* VIEW 3: CENTRE DE REQUÊTES (Boost elevation and help tickets) */}
        {activeTab === "request-center" && (
          <motion.div
            key="sandbox-request"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
          >
            
            {/* Request Privilege boost form */}
            <GlassCard className="md:col-span-7 p-6 space-y-5">
              <div className="border-b border-stone-900/60 pb-3">
                <h3 className="text-xs font-black text-cyan-400 font-mono uppercase tracking-widest flex items-center gap-1.5 font-sans">
                  <Key className="w-4.5 h-4.5" />
                  Request temporaire Privilege Boost
                </h3>
                <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                  Demander une élévation de sécurité temporaire pour effectuer des configurations locales (ex: installer un paquet, changer d'environnement docker).
                </p>
              </div>

              <form onSubmit={handleRequestPrivilegeBoost} className="space-y-4 font-mono text-[10px]">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8.5px] text-stone-500 uppercase font-black">Durée de l'élévation souhaitée</label>
                  <select
                    value={privilegeDuration}
                    onChange={(e) => setPrivilegeDuration(e.target.value)}
                    disabled={privilegeStatus === "submitting" || privilegeStatus === "pending"}
                    className="bg-black text-stone-300 border border-stone-850 p-2 rounded text-xs outline-none focus:border-cyan-500/50 cursor-pointer"
                  >
                    <option value="1h">1 Heure (Standard Dev task)</option>
                    <option value="4h">4 Heures (Extended setup session)</option>
                    <option value="24h">24 Heures (System refactoring window)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[8.5px] text-stone-500 uppercase font-black">Justification de la requête</label>
                  <input
                    value={privilegeJustification}
                    onChange={(e) => setPrivilegeJustification(e.target.value)}
                    disabled={privilegeStatus === "submitting" || privilegeStatus === "pending"}
                    placeholder="Saisissez la raison de l'élévation (ex : Test d'un daemon d'écoute local)..."
                    className="bg-black text-stone-300 text-xs border border-stone-850 p-2 rounded outline-none focus:border-cyan-500/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={privilegeStatus === "submitting" || privilegeStatus === "pending" || !privilegeJustification.trim()}
                  className="w-full py-2.5 bg-[#7c6bb5] hover:bg-[#a855f7] text-white font-black uppercase tracking-wider rounded transition-all cursor-pointer disabled:opacity-45 text-[9px]"
                >
                  {privilegeStatus === "submitting" ? "Analyse Heuristique en cours..." :
                   privilegeStatus === "pending" ? "Soumission transmise au Central..." :
                   "Envoyer la demande d'Élévation"}
                </button>

                {/* Animated progress checks */}
                <AnimatePresence>
                  {privilegeStatus === "pending" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-stone-900 border border-stone-805 text-[9px] uppercase font-bold text-amber-500 rounded-lg space-y-1"
                    >
                      <p className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3 animate-spin" /> Analyse d'approbation automatique à la volée...</p>
                      <p className="text-[8px] text-stone-500 font-normal">L'IA de sécurité de Sovereign Nexus inspecte la légitimité de votre justification...</p>
                    </motion.div>
                  )}
                  
                  {privilegeStatus === "approved" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-[9.5px] uppercase font-black text-emerald-400 rounded-lg text-center"
                    >
                      🏆 REQUÊTE CONFIGURÉE AVEC SUCCÈS - ACCÈS À L'HÔTE ÉLEVÉ EN DIRECT POUR {privilegeDuration.toUpperCase()} !
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>

              {/* History list inside request center */}
              <div className="space-y-3 pt-3 border-t border-stone-900/60">
                <h4 className="text-[9px] font-black text-stone-500 uppercase tracking-widest font-mono">Historique des demandes</h4>
                
                <div className="space-y-2 font-mono text-[9px]">
                  {activePrivilegeLogs.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-black/30 p-2.5 rounded border border-stone-900">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-300 font-bold">{item.action}</span>
                          <span className="text-[7.5px] text-stone-500">({item.id})</span>
                        </div>
                        <span className="text-[8px] text-stone-500 block mt-0.5">{item.time}</span>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded font-black text-[8px] ${
                        item.status.includes("APPROUVÉ") ? "bg-emerald-500/15 text-emerald-400" :
                        item.status.includes("EXPIRÉ") ? "bg-stone-850 text-stone-500" : "bg-amber-500/10 text-amber-500 animate-pulse"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Quick Support Incident log / and emergency red buttons */}
            <div className="md:col-span-5 space-y-6">
              
              {/* Send support ticket form */}
              <GlassCard className="p-6 space-y-4">
                <div className="border-b border-stone-900/60 pb-3">
                  <h3 className="text-xs font-black text-white font-mono uppercase tracking-widest flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    Contacter l'administrateur
                  </h3>
                </div>

                <form onSubmit={handleSendSupport} className="space-y-3 font-mono text-[9px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-stone-500 uppercase font-bold">Sujet de l'anomalie</span>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value)}
                      className="bg-black text-stone-300 border border-stone-850 p-1.5 rounded outline-none focus:border-cyan-500/50"
                    >
                      <option value="Incident Réseau">Liaison latence / Perte de ping symétrique</option>
                      <option value="Exclusion IP">Exclusion IP intempestive d'une passerelle</option>
                      <option value="Autre Anomalie">Autre Anomalie cryptographique</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-stone-500 uppercase font-bold">Détails de l'incident</span>
                    <textarea
                      rows={3}
                      value={supportMsg}
                      onChange={(e) => setSupportMsg(e.target.value)}
                      placeholder="Indiquez vos remarques ici..."
                      className="bg-black text-stone-300 border border-stone-850 p-1.5 rounded outline-none focus:border-cyan-500/50 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingSupport || !supportMsg.trim()}
                    className="w-full py-1.5 bg-stone-900 border border-stone-800 text-stone-300 text-[9px] font-black uppercase tracking-wider rounded hover:bg-cyan-950/40 hover:text-cyan-400 hover:border-cyan-500/30 cursor-pointer disabled:opacity-40"
                  >
                    {isSubmittingSupport ? "Envoi instantané..." : "Envoyer l'Alerte"}
                  </button>

                  {supportResponse && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-bold uppercase rounded mt-2 animate-bounce">
                      {supportResponse}
                    </div>
                  )}
                </form>
              </GlassCard>

              {/* Hard physical restart button */}
              <GlassCard className="p-6 space-y-4 border border-rose-500/10 bg-rose-950/5">
                <div className="border-b border-rose-500/10 pb-3">
                  <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Power className="w-4 h-4 text-rose-500" />
                    Bouton Rouge : RAM Clearance Purge
                  </h3>
                </div>

                <p className="text-[10px] text-stone-500 font-mono leading-relaxed text-justify">
                  Par mesure de souveraineté maximale, vous conservez l’autorité absolue de rompre unilatéralement la liaison. Cliquer ici simule un **Hard Reboot physique** qui purge l’intégralité de la RAM disk et détruit vos clés de liaison.
                </p>

                <button
                  onClick={handleClientSelfReboot}
                  className="w-full py-3 bg-red-950/20 hover:bg-red-950 border border-red-900/40 hover:border-red-650 text-red-300 hover:text-white rounded-xl font-mono text-[9.5px] font-black uppercase tracking-widest transition-all cursor-pointer animate-pulse"
                >
                  💣 EMERGENCY RAM SELF-DESTRUCT
                </button>
              </GlassCard>

            </div>

          </motion.div>
        )}

        {/* VIEW 4: HABILITATION & CERTIFICATE INFORMATION */}
        {activeTab === "credentials" && (
          <motion.div
            key="sandbox-credentials"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="max-w-2xl mx-auto"
          >
            <GlassCard className="p-8 space-y-6">
              <div className="text-center border-b border-stone-900/60 pb-5">
                <div className="w-14 h-14 bg-gradient-to-tr from-[#7c6bb5] to-cyan-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/15">
                  <Fingerprint className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mt-3">Certificat Cryptographique de Sécurité</h3>
                <p className="text-[9px] font-mono text-stone-500 uppercase">Habilitations mTLS Sovereign Link Client</p>
              </div>

              <div className="space-y-4 font-mono text-[10.5px]">
                <div className="grid grid-cols-3 gap-2 border-b border-stone-900/60 pb-2">
                  <span className="text-stone-500 uppercase font-black">Nom d'abonné :</span>
                  <span className="col-span-2 text-stone-200 font-bold">{activeDevice?.name}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-stone-900/60 pb-2">
                  <span className="text-stone-500 uppercase font-black">Niveau de Clearance :</span>
                  <span className="col-span-2 text-cyan-400 font-black">CLIENT PRIVILEGED (Niveau {activeDevice?.policyCompliance > 80 ? "4" : "3"})</span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-stone-900/60 pb-2">
                  <span className="text-stone-500 uppercase font-black">Adresse IP Cible :</span>
                  <span className="col-span-2 text-stone-300 font-bold">{activeDevice?.ip}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-stone-900/60 pb-2">
                  <span className="text-stone-500 uppercase font-black">Empreinte Ed25519 :</span>
                  <span className="col-span-2 text-amber-500 text-[8.5px] select-all break-all leading-normal">
                    SHA256:49:BF:AA:EE:C9:81:49:EE:BA:D1:6C:31:AA:FF:88:C4:B9:9F:EE:31:00:22:A4:91
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-stone-500 uppercase font-black">Dossier RAM (Tmpfs) :</span>
                  <span className="col-span-2 text-stone-300 select-all font-bold">
                    /dev/shm/nexus_session_{activeDevice?.id.substring(activeDevice.id.indexOf("-") + 1).toUpperCase() || "X9"}.key
                  </span>
                </div>
              </div>

              <div className="border border-[#7c6bb5]/10 bg-[#7c6bb5]/5 p-4 rounded-xl text-[9px] text-[#7c6bb5] uppercase leading-relaxed text-center font-mono">
                🏆 Cette session d’abonnement certifiée par mTLS munit l'hôte d'une connexion robuste isolée et souveraine avec le Command Panel.
              </div>
            </GlassCard>
          </motion.div>
        )}

      </AnimatePresence>
      
    </div>
  );
};
