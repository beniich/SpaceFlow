import React, { useState, useEffect } from "react";
import { 
  Server, Sliders, ShieldAlert, CheckCircle2, RotateCw, Play, PlayCircle, 
  Cpu, Thermometer, Terminal, Lock, Grid, RefreshCw, AlertTriangle, 
  Settings, Key, Globe, Layers, ListFilter, Activity, Power, Wifi
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ApplianceConfig, Device } from "../types";
import { GlassCard, NeonButton } from "./GlassUI";

interface ApplianceCoreProps {
  currentRole: string;
  devices: Device[];
}

export const ApplianceCore: React.FC<ApplianceCoreProps> = ({ currentRole, devices }) => {
  // In-memory local state representing active vs pending changes
  const [config, setConfig] = useState<ApplianceConfig>({
    bastionEnabled: true,
    bastionPort: 443,
    encryptedProtocolMode: "TLS_v1.3",
    telemetryInterval: "realtime",
    autoIsolateOnOverheat: true,
    mfaEnforced: true,
    ipWhitelist: "10.240.11.1, 10.240.12.*, 127.0.0.1",
    installedPlugins: {
      pfBlockerNG: true,
      suricataIDS: false,
      soc2Auditor: true,
      vncStreamer: true
    }
  });

  const [committedConfig, setCommittedConfig] = useState<ApplianceConfig>({ ...config });
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Stats Counters
  const [temp, setTemp] = useState<number>(41);
  const [cpuUsage, setCpuUsage] = useState<number>(18);
  const [liveTraffic, setLiveTraffic] = useState<{ rx: number; tx: number }>({ rx: 14.5, tx: 8.2 });

  // Simulate Appliance Hardware Thermals and CPU jitter
  useEffect(() => {
    const timer = setInterval(() => {
      setTemp(prev => {
        const base = config.telemetryInterval === "realtime" ? 44 : config.telemetryInterval === "standard" ? 40 : 36;
        const offset = Math.sin(Date.now() / 15000) * 1.5;
        return Math.round(base + offset);
      });
      setCpuUsage(prev => {
        const base = config.telemetryInterval === "realtime" ? 22 : config.telemetryInterval === "standard" ? 14 : 7;
        const multiplier = config.installedPlugins.suricataIDS ? 1.4 : 1.0;
        const offset = Math.floor(Math.random() * 4) - 2;
        return Math.max(2, Math.min(99, Math.round(base * multiplier) + offset));
      });
      setLiveTraffic(prev => ({
        rx: Math.max(0.1, Number((prev.rx + (Math.random() * 2 - 1)).toFixed(1))),
        tx: Math.max(0.1, Number((prev.tx + (Math.random() * 1.2 - 0.6)).toFixed(1)))
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, [config]);

  // Fetch initial configuration from the server
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/appliance/config");
        if (res.ok) {
          const fetched = await res.json();
          setConfig(fetched);
          setCommittedConfig(fetched);
        }
      } catch (err) {
        console.warn("Could not fetch server-side appliance configuration:", err);
      }
    };
    fetchConfig();
  }, []);

  const handleUpdate = (path: string, value: any) => {
    setHasChanges(true);
    if (path.startsWith("installedPlugins.")) {
      const pluginKey = path.split(".")[1];
      setConfig(prev => ({
        ...prev,
        installedPlugins: {
          ...prev.installedPlugins,
          [pluginKey]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [path]: value
      }));
    }
  };

  const applyChanges = async () => {
    if (currentRole === "auditor") {
      alert("🔒 WRITE ACCESS ARRESTED: Security Policies and Appliance states are structurally frozen under live Auditor sessions.");
      return;
    }

    setIsApplying(true);
    setCurrentProgress(0);
    setConsoleLogs([]);

    // Step-by-step CLI simulation logs to display on rewrite
    const commandsList = [
      `[core-os] Initiating system state differential checks...`,
      `[core-os] Target: /etc/sovereign-nexus/system_config.json`,
      `[config-writer] Serializing configuration structure... [OK]`,
      `[config-writer] Core config binary written to system_config.json disk interface.`,
      `[docker-compose] Verifying docker daemon daemon environment...`,
      config.bastionEnabled 
        ? `[docker-compose] Spawning Apache Guacamole gateway proxy on Port: ${config.bastionPort}...`
        : `[docker-compose] Stopping and isolating JumpServer container layers on Port: ${config.bastionPort}...`,
      `[sys-network] Configuring firewall iptables rules for: [${config.ipWhitelist}]`,
      `[prom-exporter] Reconfiguring Prometheus service matrix. Refresh rate set to: ${config.telemetryInterval}...`,
      config.mfaEnforced 
        ? `[auth-guard] MFA configuration enforced down to all secure terminal nodes.`
        : `[auth-guard] WARNING: Multi-Factor Authentication disabled. Strict boundary audit logs enabled.`,
      `[plugin-aggregator] Installed plugins synchronizer initialized...`,
      `[plugin-aggregator] Active plugin indices: ${Object.keys(config.installedPlugins)
        .filter(k => config.installedPlugins[k as keyof typeof config.installedPlugins])
        .join(", ") || "none"}`,
      `[systemctl] Rebooting system services: systemctl restart sovereignctl-daemon...`,
      `[core-os] Single Image sandbox verified successfully! Continuous compliance state restored.`
    ];

    // Typist simulator for the terminal logs
    let chunkIndex = 0;
    const typingTimer = setInterval(() => {
      if (chunkIndex < commandsList.length) {
        setConsoleLogs(prev => [...prev, commandsList[chunkIndex]]);
        setCurrentProgress(Math.floor(((chunkIndex + 1) / commandsList.length) * 100));
        chunkIndex++;
      } else {
        clearInterval(typingTimer);
        finalizeApply();
      }
    }, 380);
  };

  const finalizeApply = async () => {
    try {
      const res = await fetch("/api/appliance/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const payload = await res.json();
        setCommittedConfig(payload.applianceConfig);
        setHasChanges(false);
        setSuccessToast("Appliance configuration applied successfully!");
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      console.error("Failed applying configuration through server API:", err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleResetPending = () => {
    setConfig({ ...committedConfig });
    setHasChanges(false);
  };

  return (
    <div id="sovereign-appliance-hub" className="space-y-6">

      {/* TOP PENDING CHANGES WARNING HEADER BANNER */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-amber-500 text-black px-6 py-3.5 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono font-bold text-xs"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-black shrink-0 animate-bounce" />
              <div>
                <p className="tracking-wide">UNSAVED APPLIANCE CONFIGURATION CHANGES</p>
                <p className="text-[10px] font-normal text-amber-950 mt-0.5">
                  Write lock is active. You must write settings to system disk and restart services for rules to trigger.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetPending}
                className="px-4 py-2 bg-transparent hover:bg-amber-600/20 text-stone-800 border border-amber-950/20 rounded-xl transition-all"
              >
                DISCARD CHANGES
              </button>
              <button
                onClick={applyChanges}
                className="px-4 py-2 bg-black hover:bg-zinc-900 text-amber-400 rounded-xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.25)] flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                APPLY CHANGES
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REASSURING ACTION TOAL */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 p-4 bg-emerald-950/90 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-3.5 z-50 font-mono text-xs shadow-2xl"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold uppercase tracking-wider">APPLIANCE SECTOR REBOOTED</p>
              <p className="text-[10px] opacity-80 mt-0.5">{successToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* APPLIANCE STATUS GENERAL HEADER CARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Box core OS metadata */}
        <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-5 font-mono space-y-2.5">
          <span className="block text-[8px] text-[#7c6bb5] uppercase font-extrabold tracking-widest">
            Appliance OS Core
          </span>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400 shrink-0" />
            <h4 className="text-[11px] font-black text-white uppercase tracking-tight">Sovereign-OS v2.4</h4>
          </div>
          <p className="text-[9px] text-stone-500 leading-normal">
            FreeBSD 14.0-RELEASE under JIT hypervisor virtualization shielding. Single Image package.
          </p>
        </div>

        {/* Operating Thermals */}
        <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-5 font-mono space-y-2.5">
          <span className="block text-[8px] text-[#7c6bb5] uppercase font-extrabold tracking-widest">
            Appliance Temperature
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-amber-400 shrink-0" />
              <h4 className="text-xl font-bold text-white tracking-widest">{temp} °C</h4>
            </div>
            <span className="text-[10px] text-stone-400 underline decoration-stone-700">3150 RPM Fan</span>
          </div>
          <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${temp > 43 ? "bg-amber-400" : "bg-cyan-400"}`} 
              style={{ width: `${(temp / 80) * 100}%` }} 
            />
          </div>
        </div>

        {/* Local processor load */}
        <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-5 font-mono space-y-2.5">
          <span className="block text-[8px] text-[#7c6bb5] uppercase font-extrabold tracking-widest">
            Appliance CPU utilization
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
              <h4 className="text-xl font-bold text-white tracking-widest">{cpuUsage}%</h4>
            </div>
            <span className="text-[9px] text-stone-400 uppercase font-bold">INTERVAL: {config.telemetryInterval}</span>
          </div>
          <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
            <div className="h-full bg-[#7c6bb5] transition-all duration-300" style={{ width: `${cpuUsage}%` }} />
          </div>
        </div>

        {/* Network bandwidth statistics */}
        <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-5 font-mono space-y-2.5">
          <span className="block text-[8px] text-[#7c6bb5] uppercase font-extrabold tracking-widest">
            Gateway live traffic load
          </span>
          <div className="flex items-center justify-between gap-2 pt-1.5">
            <div className="text-[10px]">
              <span className="block text-[8px] text-stone-500">RX PACKETS SPEED</span>
              <span className="font-extrabold text-[#2cb5ff]">{liveTraffic.rx} MB/s</span>
            </div>
            <div className="text-[10px]">
              <span className="block text-[8px] text-stone-500">TX PACKETS SPEED</span>
              <span className="font-extrabold text-purple-400">{liveTraffic.tx} MB/s</span>
            </div>
            <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <span className="block text-[7.5px] text-stone-500 font-bold uppercase tracking-tight leading-normal">
            Secure IP rules checking active
          </span>
        </div>

      </div>

      {/* CONFIGURATION SECTIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COMPILER BLOCK (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Bastion tunneling (JumpServer) */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-purple-500/10 pb-3">
              <div className="p-2 bg-cyan-500/10 border border-cyan-400/20 rounded-xl">
                <Sliders className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  BASTION GATEWAY TUNNEL (JUMPSERVER MANAGER)
                </h3>
                <p className="text-[9px] text-stone-400">
                  Configure integrated JumpServer and Apache Guacamole VNC proxy tunnels for fleet remoting
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              {/* Toggle switch for bastion */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-black/45 p-3 rounded-xl border border-purple-500/5">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-200 uppercase tracking-tight block">
                      Activate Bastion Proxy
                    </label>
                    <span className="text-[8.5px] text-stone-500 mt-1 block">
                      Enable JumpServer user portal rules
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.bastionEnabled}
                    onChange={(e) => handleUpdate("bastionEnabled", e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-400 accent-cyan-400 bg-stone-950 border-stone-800 outline-none focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Number port selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-stone-400">
                  Orchestrated Proxy Port
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={config.bastionPort}
                    disabled={!config.bastionEnabled}
                    onChange={(e) => handleUpdate("bastionPort", Number(e.target.value))}
                    className="flex-1 bg-black border border-purple-500/10 focus:border-cyan-500/40 rounded-lg px-3 py-2 text-[11px] text-stone-200 outline-none transition-all disabled:opacity-40"
                    placeholder="443"
                  />
                  <div className="px-3 bg-[#110931]/60 border border-purple-500/10 rounded-lg text-[9px] text-[#2cb5ff] flex items-center justify-center tracking-widest font-black uppercase">
                    SOCKET_PORT
                  </div>
                </div>
              </div>

              {/* Cryptographic stream mode dropdown */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-stone-400 block">
                  Encrypted Tunnel protocol mode
                </label>
                <select
                  value={config.encryptedProtocolMode}
                  disabled={!config.bastionEnabled}
                  onChange={(e) => handleUpdate("encryptedProtocolMode", e.target.value)}
                  className="w-full bg-black border border-purple-500/10 focus:border-cyan-500/40 rounded-lg px-3 py-2.5 text-[11px] text-cyan-300 font-bold outline-none uppercase transition-all disabled:opacity-40 select-none cursor-pointer"
                >
                  <option value="TLS_v1.3">TLS v1.3 Secure Bastion SSL Handshake (Recommended)</option>
                  <option value="SSH_v2">SSH v2 Multi-channel Secure Loop Tunnel</option>
                  <option value="IPSec_VPN">IPSec VPN Direct hardware-to-hardware Cryptographic Tunnel</option>
                </select>
              </div>

            </div>
          </GlassCard>

          {/* Section 2: Telemetry scraper parameters */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-purple-500/10 pb-3">
              <div className="p-2 bg-[#7c6bb5]/10 border border-[#7c6bb5]/20 rounded-xl">
                <Activity className="w-4 h-4 text-[#7c6bb5]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  TELEMETRY CORES EXPORTER (PROMETHEUS ENGINE)
                </h3>
                <p className="text-[9px] text-stone-400">
                  Calibrate active fleet scraping intervals, memory registers and automated airgaps overrides
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              
              {/* Exporter interval dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-stone-400 block">
                  Prometheus metrics scraping frequency
                </label>
                <select
                  value={config.telemetryInterval}
                  onChange={(e) => handleUpdate("telemetryInterval", e.target.value)}
                  className="w-full bg-black border border-purple-500/10 focus:border-cyan-500/40 rounded-lg px-3 py-2.5 text-[11px] text-[#2cb5ff] font-bold outline-none uppercase"
                >
                  <option value="realtime">Real-Time Scraping (1s loops) - Aggressive utilization</option>
                  <option value="standard">Standard scraping (30s loops) - Optimal network metrics</option>
                  <option value="eco">Eco monitoring (5m loops) - Conserves bandwidth registers</option>
                </select>
              </div>

              {/* Checkbox item for thermal isolation trigger */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-black/45 p-3 rounded-xl border border-purple-500/5 h-[48px]">
                  <div>
                    <label className="text-[10.5px] font-bold text-zinc-200 uppercase tracking-tight block">
                      CPU Auto thermal lockdown
                    </label>
                    <span className="text-[8px] text-stone-500 block">
                      Isolate node ports if thermals cross 95°C
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.autoIsolateOnOverheat}
                    onChange={(e) => handleUpdate("autoIsolateOnOverheat", e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-400 accent-cyan-400 bg-stone-950 border-stone-800 outline-none focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

            </div>
          </GlassCard>

          {/* Section 3: Threat security rules and Whitelists */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-purple-500/10 pb-3">
              <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <Key className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  SECURITY POLICY & NETWORK IP ARRESTS
                </h3>
                <p className="text-[9px] text-stone-400">
                  Enforce strict credential controls and configure custom system firewall Whitelists
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              
              {/* MFA Toggle */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-black/45 p-4 rounded-xl border border-purple-500/5">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-200 uppercase tracking-tight block">
                      Enforce MFA Whitelinking
                    </label>
                    <span className="text-[8.5px] text-stone-500 mt-1 block">
                      Require hardware-based Multi-Factor Authentication
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.mfaEnforced}
                    onChange={(e) => handleUpdate("mfaEnforced", e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-400 accent-cyan-400 bg-stone-950 border-stone-800 outline-none focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* IP Whitelist Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-stone-400 block">
                  Firewall IP Whitelist Subnets
                </label>
                <input
                  type="text"
                  value={config.ipWhitelist}
                  onChange={(e) => handleUpdate("ipWhitelist", e.target.value)}
                  className="w-full bg-black border border-purple-500/10 focus:border-cyan-500/40 rounded-lg px-3 py-2.5 text-[11px] text-stone-200 outline-none transition-all placeholder-stone-600 focus:outline-none"
                  placeholder="e.g. 10.240.11.1, 127.0.0.1"
                />
                <span className="text-[8.5px] text-stone-500 block leading-normal mt-1">
                  Format: comma-separated IPv4 parameters. Asterisk wildcard characters are parsed.
                </span>
              </div>

            </div>
          </GlassCard>

        </div>

        {/* RIGHT DECK: PLUGINS / CHANNELS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* pfSense Custom Active Packages Registry */}
          <GlassCard className="p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Appliance Plugins
              </h3>
              <p className="text-[9px] text-[#7c6bb5] font-bold uppercase tracking-tight">pfSense Package Manager</p>
            </div>

            <p className="text-[9px] font-mono leading-relaxed text-stone-500 border-t border-purple-500/5 pt-3">
              Enable advanced capabilities on this Appliance Core. Toggling packages immediately updates available options and restarts modular orchestrators.
            </p>

            <div className="space-y-3.5 pt-1.5 font-mono text-xs">
              
              {/* Plugin 1 */}
              <div className="bg-black/35 hover:bg-black/55 p-3 rounded-xl border border-purple-500/5 flex items-center justify-between transition-all">
                <div className="space-y-1 max-w-[70%]">
                  <span className="block text-[10.5px] font-bold text-zinc-100">pfBlockerNG-Sovereign</span>
                  <span className="block text-[8px] text-stone-500 leading-snug">
                    Dynamic sinkhole tracker. Diverts malicious domains to 0.0.0.0 null interface.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.installedPlugins.pfBlockerNG}
                  onChange={(e) => handleUpdate("installedPlugins.pfBlockerNG", e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400 accent-cyan-400 bg-stone-950 border-stone-800 outline-none cursor-pointer"
                />
              </div>

              {/* Plugin 2 */}
              <div className="bg-black/35 hover:bg-black/55 p-3 rounded-xl border border-purple-500/5 flex items-center justify-between transition-all">
                <div className="space-y-1 max-w-[70%]">
                  <span className="block text-[10.5px] font-bold text-zinc-100">Suricata-IDS Engine</span>
                  <span className="block text-[8px] text-stone-500 leading-snug">
                    Deep kernel-level Intrusion Detection. Runs real-time packet inspections.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.installedPlugins.suricataIDS}
                  onChange={(e) => handleUpdate("installedPlugins.suricataIDS", e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400 accent-cyan-400 bg-stone-950 border-stone-800 outline-none cursor-pointer"
                />
              </div>

              {/* Plugin 3 */}
              <div className="bg-black/35 hover:bg-black/55 p-3 rounded-xl border border-purple-500/5 flex items-center justify-between transition-all">
                <div className="space-y-1 max-w-[70%]">
                  <span className="block text-[10.5px] font-bold text-zinc-100">SOC2 Auditor continuous</span>
                  <span className="block text-[8px] text-stone-500 leading-snug">
                    Validates sovereign system metrics drift dynamically for automated evidence logs.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.installedPlugins.soc2Auditor}
                  onChange={(e) => handleUpdate("installedPlugins.soc2Auditor", e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400 accent-cyan-400 bg-stone-950 border-stone-800 outline-none cursor-pointer"
                />
              </div>

              {/* Plugin 4 */}
              <div className="bg-black/35 hover:bg-black/55 p-3 rounded-xl border border-purple-500/5 flex items-center justify-between transition-all">
                <div className="space-y-1 max-w-[70%]">
                  <span className="block text-[10.5px] font-bold text-zinc-100">Guacamole-WS-Streamer</span>
                  <span className="block text-[8px] text-stone-500 leading-snug">
                    VNC Neural Mirror visual pipeline stream provider.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.installedPlugins.vncStreamer}
                  onChange={(e) => handleUpdate("installedPlugins.vncStreamer", e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400 accent-cyan-400 bg-stone-950 border-stone-800 outline-none cursor-pointer"
                />
              </div>

            </div>
          </GlassCard>

          {/* Quick instructions / manual box */}
          <GlassCard className="p-5 font-mono text-[9.5px] leading-relaxed text-stone-400 space-y-2.5">
            <span className="block font-black text-[#7c6bb5] uppercase tracking-wider text-[8px]">
              OPERATIONS ADVISORY
            </span>
            <p>
              Under active military/commercial audits, modification commands executed from this cockpit go through pre-commit testing against existing sandbox state boundaries.
            </p>
            <p className="text-stone-300 font-bold bg-pink-950/20 border border-pink-500/10 p-2.5 rounded-lg flex items-start gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#ff5c00] shrink-0 mt-0.5" />
              <span>
                WARNING: Terminating JumpServer Bastion will isolate active RDP sessions immediate. Use caution.
              </span>
            </p>
          </GlassCard>

        </div>

      </div>

      {/* REWRITING ORCHESTRATION TERMINAL SCREEN OVERLAY DURING WORK */}
      <AnimatePresence>
        {isApplying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6 select-none"
          >
            <div className="bg-stone-950 border border-cyan-500/35 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative font-mono text-xs text-stone-100 flex flex-col justify-between h-[450px]">
              
              {/* Title bar */}
              <div className="flex items-center justify-between border-b border-stone-900 pb-3 font-bold select-none text-stone-400">
                <span className="text-cyan-400 animate-pulse font-mono tracking-tight text-[11px] flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-cyan-400 animate-spin" />
                  REWRITING SYSTEM_CONFIG.XML TO KERNEL APPLIANCE...
                </span>
                <span>{currentProgress}%</span>
              </div>

              {/* Progress Bar indicator */}
              <div className="h-1.5 w-full bg-stone-900 rounded-full overflow-hidden mt-3 shrink-0">
                <div 
                  className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                  style={{ width: `${currentProgress}%` }}
                />
              </div>

              {/* Terminal Logs panel */}
              <div className="flex-1 bg-black/80 rounded-xl my-4 p-4 border border-zinc-900/40 font-mono text-[10.5px] overflow-y-auto space-y-1.5 text-left select-text selection:bg-cyan-500/20">
                {consoleLogs.map((log, index) => {
                  let logColor = "text-stone-400";
                  if (log.includes("[error]")) logColor = "text-rose-400";
                  else if (log.includes("[auth]") || log.includes("[auth-guard]")) logColor = "text-purple-400";
                  else if (log.includes("[done]") || log.includes("[OK]") || log.endsWith("OPTIMAL.")) logColor = "text-emerald-400 font-bold";
                  else if (log.includes("WARNING:")) logColor = "text-amber-400 font-bold";
                  else if (log.includes("[config-writer]")) logColor = "text-cyan-400";

                  return (
                    <div key={index} className={`font-mono leading-relaxed ${logColor}`}>
                      {log}
                    </div>
                  );
                })}
                <div className="h-0.5" />
              </div>

              {/* Footer loader animation */}
              <div className="border-t border-stone-900 pt-3 flex justify-between items-center text-[10px] text-stone-500 select-none">
                <span>Bastion socket tunnels rebuilding dynamically...</span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>CORE ACTIVE</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
