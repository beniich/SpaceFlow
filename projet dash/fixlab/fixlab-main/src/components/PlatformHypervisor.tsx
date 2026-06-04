import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Landmark, Sparkles, Database, Users, KeyRound, 
  HelpCircle, CheckCircle2, AlertTriangle, Play, RefreshCw, Send,
  Cpu, Activity, Lock, Layers, Eye
} from "lucide-react";
import { GlassCard, NeonButton } from "./GlassUI";

export interface PlatformHypervisorProps {
  currentRole: "super-admin" | "strategist" | "tactician" | "auditor" | "client";
  onChangeRole: (newRole: "super-admin" | "strategist" | "tactician" | "auditor" | "client") => void;
  currentPlan: "tactical" | "sovereign" | "imperial";
  onChangePlan: (newPlan: "tactical" | "sovereign" | "imperial") => void;
  onAddLog?: (log: any) => void;
}

let reqCounter = 104;

export const PlatformHypervisor: React.FC<PlatformHypervisorProps> = ({
  currentRole,
  onChangeRole,
  currentPlan,
  onChangePlan,
  onAddLog
}) => {
  const [licKey, setLicKey] = useState("");
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [activationError, setActivationError] = useState<string | null>(null);

  // Simulated live API Gateway log requests
  const [gatewayLogs, setGatewayLogs] = useState<Array<{
    id: string;
    timestamp: string;
    method: "POST" | "GET" | "WS_EMIT" | "SSH_EXEC";
    route: string;
    adapter: "JumpServer PAM" | "gRPC Fleet Agency" | "LLM Neural Intel" | "Prometheus Node Exporter";
    status: number;
    delay: string;
    payload: string;
  }>>([
    {
      id: "REQ-001",
      timestamp: "21:09:12",
      method: "GET",
      route: "/api/gateway/prom/nodes/load",
      adapter: "Prometheus Node Exporter",
      status: 200,
      delay: "1.24ms",
      payload: "{ nodesTotal: 1250, activeRate: 0.945 }"
    },
    {
      id: "REQ-002",
      timestamp: "21:09:15",
      method: "POST",
      route: "/api/gateway/pam/replicate-session",
      adapter: "JumpServer PAM",
      status: 200,
      delay: "4.85ms",
      payload: "{ sessionId: 'SSID-7489', auditActive: true }"
    },
    {
      id: "REQ-003",
      timestamp: "21:09:18",
      method: "WS_EMIT",
      route: "fleet:reboot_target",
      adapter: "gRPC Fleet Agency",
      status: 101,
      delay: "2.12ms",
      payload: "{ targetNode: 'Sovereign-A1', code: '0x39' }"
    }
  ]);

  // Dynamic status/rate stats for API Gateway Blend Layer
  const [gatewayRequestsCount, setGatewayRequestsCount] = useState(14502);
  const [averageDelay, setAverageDelay] = useState(2.32);
  const [stressTesting, setStressTesting] = useState(false);

  const fetchGatewayLogs = async () => {
    try {
      const res = await fetch("/api/gateway/logs");
      if (res.ok) {
        const data = await res.json();
        if (data.gatewayLogs) setGatewayLogs(data.gatewayLogs);
        if (data.gatewayRequestsCount !== undefined) setGatewayRequestsCount(data.gatewayRequestsCount);
        if (data.averageDelay !== undefined) setAverageDelay(data.averageDelay);
      }
    } catch (err) {
      console.warn("Could not fetch gateway logs from server:", err);
    }
  };

  // Live Gateway routing requests tick simulations
  useEffect(() => {
    fetchGatewayLogs();
    const interval = setInterval(() => {
      fetchGatewayLogs();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Handle license unlock interactive input
  const handleActivateLicense = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessInfo(null);
    setActivationError(null);

    const key = licKey.trim().toUpperCase();
    if (key === "IMP-NEXUS-777" || key === "IMPERIAL") {
      onChangePlan("imperial");
      setSuccessInfo("IMPERIAL TIER DOCKED: All fleet infrastructure limitations unlocked. Host self-hosting authorized.");
      if (onAddLog) {
        onAddLog({
          id: `PLAT-LIC-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
          source: "SaaS Engine",
          level: "success",
          message: "Licensed Key Verified: IMPERIAL tier unlocked. Sovereign-level features granted."
        });
      }
      setLicKey("");
    } else if (key === "SOV-CORE-101" || key === "SOVEREIGN") {
      onChangePlan("sovereign");
      setSuccessInfo("SOVEREIGN LICENSING ACTIVE: Advanced PAM access and infinite API metrics verified.");
      if (onAddLog) {
        onAddLog({
          id: `PLAT-LIC-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
          source: "SaaS Engine",
          level: "success",
          message: "Licensed Key Verified: SOVEREIGN tier status active."
        });
      }
      setLicKey("");
    } else {
      setActivationError("INVALID LICENSING ALIGNMENT: Unrecognized authority token signature.");
    }
  };

  const triggerSecurityStressTest = async () => {
    if (stressTesting) return;
    setStressTesting(true);

    try {
      const res = await fetch("/api/gateway/stress-test", {
        method: "POST"
      });
      if (res.ok) {
        await fetchGatewayLogs();
      }
    } catch (err) {
      console.error("Stress execution failed:", err);
    } finally {
      setTimeout(() => {
        setStressTesting(false);
      }, 4000);
    }
  };

  const plans = [
    {
      id: "tactical",
      name: "Tactical Fleet",
      price: "$149",
      period: "per admin / mo",
      desc: "For small isolated infrastructures, private offices, or edge terminal testing environments.",
      caps: ["1 Admin Operator", "Max 5 Managed PC Nodes", "Standard Node Exporter telemetry", "Local key-value storage persistence"],
      glowColor: "border-purple-500/10 text-purple-400"
    },
    {
      id: "sovereign",
      name: "Sovereign Enterprise",
      price: "$599",
      period: "per cluster / mo",
      desc: "For full-scale distributed edges, server clusters, and sovereign control centers needing continuous oversight.",
      caps: ["5 Admin Operators", "64 Managed PC Nodes", "Full PAM secure tunnel access", "Integrative ML Predictive Analytics curves", "Continuous threat log matrix", "1s telemetry scraper pings"],
      best: true,
      glowColor: "border-cyan-400/40 text-[#22d3ee] shadow-[0_0_20px_rgba(34,211,238,0.15)] bg-[#1f124c]/90"
    },
    {
      id: "imperial",
      name: "Imperial Sovereignty",
      price: "Custom",
      period: "enquire / annually",
      desc: "Maximum security, airgapped command rooms, government critical networks, and on-premise hypervisors.",
      caps: ["Infinite Admin Operators", "Infinite PC Node agent tracking", "Pure Airgapped offline proxy deployment", "Custom gRPC Adapter modifications", "24/7 dedicated operational assistance"],
      glowColor: "border-amber-400/35 text-amber-300"
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-white font-mono text-xs select-none">
      
      {/* LEFT PORTAL DECK CONTAINER: SaaS Plans & Role Switchers */}
      <div className="flex-1 space-y-6">
        
        {/* Header telemetry brief */}
        <div className="flex items-center justify-between bg-[#150a36]/60 p-5 rounded-3xl border border-purple-500/10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-400/10 rounded-2xl border border-cyan-500/20 text-[#22d3ee] animate-pulse">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest leading-none">Sovereign Platform Operator</h1>
              <p className="text-[9px] text-purple-305 uppercase font-bold mt-1">Gating capabilities, Multi-Client RBAC accounts & Unified Gateway blend adapters</p>
            </div>
          </div>
          <span className="text-[8.5px] bg-[#24175e] border border-cyan-500/20 text-[#22d3ee] px-3 py-1.5 rounded-xl uppercase font-black tracking-widest">
            SaaS PLATFORM ACTIVE
          </span>
        </div>

        {/* SECTION 1: SUBSCRIPTION TIERING */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pl-1">
            <span className="text-[10px] text-[#7c6bb5] font-extrabold uppercase tracking-widest">01 • THEME & LICENSING PLANS ENGINE</span>
            <span className="text-[9.5px] font-bold text-cyan-405">ACTIVE PLAN: <strong className="text-white bg-cyan-950/40 px-2 py-0.5 border border-cyan-400/20 rounded uppercase">{currentPlan}</strong></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((p) => {
              const isSelected = currentPlan === p.id;
              return (
                <div 
                  key={p.id}
                  className={`border rounded-[1.8rem] p-5 flex flex-col justify-between transition-all duration-300 ${
                    isSelected 
                      ? "bg-[#25175e]/90 border-cyan-400 ring-2 ring-cyan-400/30 scale-[1.01] shadow-xl" 
                      : "bg-[#1f124c]/40 border-purple-500/5 hover:border-[#3e2389]/40 hover:bg-[#1f124c]/70"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-wider">{p.name}</h3>
                        <p className="text-[8.5px] text-[#7c6bb5] mt-1 line-clamp-2 leading-normal">{p.desc}</p>
                      </div>
                      {p.best && (
                        <span className="text-[7.5px] bg-cyan-400/15 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest font-black">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div>
                      <span className="text-2xl font-black italic tracking-tight text-white">{p.price}</span>
                      <span className="text-[7.5px] text-purple-400 ml-1 uppercase font-bold">/ {p.period}</span>
                    </div>

                    {/* Caps checklist */}
                    <ul className="space-y-2 pt-2 border-t border-purple-950/40">
                      {p.caps.map((cap, index) => (
                        <li key={index} className="flex items-center gap-2 text-[9px] text-purple-200">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Activate button */}
                  <div className="pt-5 mt-4 border-t border-purple-950/40">
                    <button
                      onClick={() => {
                        onChangePlan(p.id as any);
                        if (onAddLog) {
                          onAddLog({
                            id: `PLAT-UPGRADE-${Date.now()}`,
                            timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
                            source: "SaaS Gateway",
                            level: "info",
                            message: `Transitioned sovereign platform cluster tier layout to: [${p.name}]`
                          });
                        }
                      }}
                      className={`w-full py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? "bg-cyan-400 border-cyan-400 text-indigo-950 shadow-[0_0_15px_#22d3ee] font-black" 
                          : "bg-purple-950/40 border-purple-800/10 text-[#7c6bb5] hover:text-white hover:bg-purple-900/35"
                      }`}
                    >
                      {isSelected ? "● CURRENTLY DOCKED" : "DOCK TIER PLAN"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secure credentials Key Input Form */}
          <GlassCard className="p-5 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <KeyRound className="w-4 h-4 text-cyan-400" /> Unlock Premium Authority Key
              </h4>
              <p className="text-[9px] text-[#7c6bb5] uppercase font-bold">Submit cryptographic string to bypass licensing gating layers immediately</p>
            </div>

            <form onSubmit={handleActivateLicense} className="flex gap-2 w-full md:w-fit shrink-0">
              <input
                type="text"
                placeholder="e.g. IMP-NEXUS-777"
                value={licKey}
                onChange={(e) => setLicKey(e.target.value)}
                className="bg-[#120732] border border-purple-500/15 rounded-xl px-4 py-2 text-xs font-bold text-cyan-400 placeholder-purple-650 tracking-widest uppercase outline-none focus:border-cyan-400/30"
              />
              <NeonButton type="submit" variant="primary" className="!py-2 !px-4 text-[9.5px]">
                UNLOCK
              </NeonButton>
            </form>
          </GlassCard>

          {successInfo && (
            <div className="p-3 bg-emerald-950/25 border border-emerald-500/25 rounded-2xl flex items-center gap-2.5 text-emerald-400 font-bold uppercase text-[9.5px] animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 animate-bounce" />
              <span>{successInfo}</span>
            </div>
          )}

          {activationError && (
            <div className="p-3 bg-rose-950/25 border border-rose-500/25 rounded-2xl flex items-center gap-2.5 text-[#ff5c00] font-bold uppercase text-[9.5px] animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#ff5c00]" />
              <span>{activationError}</span>
            </div>
          )}
        </div>

        {/* INTEGRATED ACTIVE SUBSCRIPTION ENROLLMENT GATE */}
        <div className="bg-gradient-to-r from-purple-950/25 via-[#150a36]/50 to-transparent p-5 rounded-[2rem] border border-[#3e2389]/40 space-y-3.5" id="active-subscription-gate">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#22d3ee]">
              Subscription & Fast Enrollment Gateway (Active Gate)
            </h3>
          </div>
          <p className="text-[10px] text-[#7c6bb5] leading-relaxed">
            Subscribe or switch your credential status in one click below to efficiently control your remote nodes and terminals. Network privileges will be reconfigured in real time in your database profile.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            
            {/* Option A: Admin Access */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              currentRole === "super-admin"
                ? "bg-[#25175d]/80 border-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                : "bg-[#1f124c]/20 border-purple-500/5 hover:border-[#3e2389]/40 hover:bg-[#1f124c]/40"
            }`}>
              {currentRole === "super-admin" && (
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-purple-500 text-black text-[7px] font-black uppercase tracking-wider rounded-bl-lg">
                  ACTIVE
                </div>
              )}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  👑 Administrator Clearance Status
                </h4>
                <p className="text-[9px] text-[#7c6bb5] leading-normal uppercase font-semibold">
                  Sovereign Executive — Full Terminal Control and SOC2 Stream auditing.
                </p>
              </div>
              <button
                id="btn-sub-admin"
                onClick={() => {
                  onChangeRole("super-admin");
                  onChangePlan("sovereign");
                  if (onAddLog) {
                    onAddLog({
                      id: `SUB-ADMIN-${Date.now()}`,
                      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
                      source: "Billing Gateway",
                      level: "success",
                      message: "User subscribed and elevated profile to Administrator level"
                    });
                  }
                  alert("Administrator subscription validated! Complete sovereign access assigned in Firebase.");
                }}
                className={`w-full mt-4 py-2.5 rounded-xl text-[8.5px] font-extrabold uppercase tracking-widest transition-all ${
                  currentRole === "super-admin"
                    ? "bg-purple-500 text-black shadow-[0_0_10px_rgba(168,85,247,0.3)] cursor-default font-black border-none"
                    : "bg-purple-950/40 text-purple-300 border border-purple-500/20 hover:bg-purple-900/40 hover:text-white cursor-pointer"
                }`}
              >
                {currentRole === "super-admin" ? "✓ Subscribed (Sovereign Executive)" : "Subscribe as Admin (Sovereign)"}
              </button>
            </div>

            {/* Option B: Client Access */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              currentRole === "client"
                ? "bg-[#25175d]/85 border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                : "bg-[#1f124c]/20 border-purple-500/5 hover:border-[#3e2389]/40 hover:bg-[#1f124c]/40"
            }`}>
              {currentRole === "client" && (
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500 text-black text-[7px] font-black uppercase tracking-wider rounded-bl-lg">
                  ACTIVE
                </div>
              )}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  ⚡ Member Client Status
                </h4>
                <p className="text-[9px] text-[#7c6bb5] leading-normal uppercase font-semibold">
                  Subscriber Node — Courtesy access, core metrics reader & device sync.
                </p>
              </div>
              <button
                id="btn-sub-client"
                onClick={() => {
                  onChangeRole("client");
                  onChangePlan("tactical");
                  if (onAddLog) {
                    onAddLog({
                      id: `SUB-CLIENT-${Date.now()}`,
                      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
                      source: "Billing Gateway",
                      level: "success",
                      message: "User subscribed and toggled profile to Subscriber Client node"
                    });
                  }
                  alert("Client subscription activated! Client / Subscriber Node role configured in Firebase.");
                }}
                className={`w-full mt-4 py-2.5 rounded-xl text-[8.5px] font-extrabold uppercase tracking-widest transition-all ${
                  currentRole === "client"
                    ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)] cursor-default font-black border-none"
                    : "bg-purple-950/40 text-emerald-400 border border-emerald-500/20 hover:bg-[#10b981]/20 hover:text-white cursor-pointer"
                }`}
              >
                {currentRole === "client" ? "✓ Subscribed (Subscriber Node)" : "Subscribe as Client (Tactical)"}
              </button>
            </div>

          </div>
        </div>

        {/* SECTION 2: ACCESS CONTROL ROLES MATRIX */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pl-1">
            <span className="text-[10px] text-[#7c6bb5] font-extrabold uppercase tracking-widest">02 • RBAC CLEARANCE PROTOCOLS MATRIX</span>
            <span className="text-[9.5px] font-bold text-cyan-405">CLEARANCE PROFILE: <strong className="text-white bg-cyan-955 px-2 py-0.5 border border-purple-500/20 rounded uppercase">{currentRole}</strong></span>
          </div>

          {/* Quick Active user Profile Switches */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { id: "super-admin", name: "Sovereign Executive", title: "Super-Admin", color: "text-cyan-400 border-cyan-400/20", glow: "shadow-[0_0_15px_rgba(34,211,238,0.1)]" },
              { id: "strategist", name: "Strategist Leader", title: "Manager / Director", color: "text-purple-400 border-purple-500/10", glow: "" },
              { id: "tactician", name: "Tactician Operator", title: "System Operator", color: "text-amber-400 border-amber-500/10", glow: "" },
              { id: "auditor", name: "Compliance Observer", title: "Reviewer / Auditor", color: "text-rose-400 border-rose-500/10", glow: "" },
              { id: "client", name: "Subscriber Node", title: "Client Account", color: "text-orange-400 border-orange-500/10", glow: "shadow-[0_0_15px_rgba(249,115,22,0.1)]" }
            ].map((r) => {
              const works = currentRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    onChangeRole(r.id as any);
                    if (onAddLog) {
                      onAddLog({
                        id: `PLAT-ROLE-${Date.now()}`,
                        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
                        source: "RBAC Module",
                        level: "warning",
                        message: `Substituted active profile clearance role context to: [${r.name}]`
                      });
                    }
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                    works 
                      ? "bg-[#25175e] border-[#22d3ee]/40 text-[#22d3ee] shadow-lg " + r.glow 
                      : "bg-[#1f124c]/40 border-purple-500/5 hover:bg-[#1f124c]/85 text-[#7c6bb5] hover:text-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#7c6bb5]">SECURITY CORE</span>
                    {works && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </div>
                  <h4 className="text-[11px] font-black mt-2 uppercase">{r.name}</h4>
                  <span className="text-[8.5px] font-mono mt-1 block tracking-wider uppercase opacity-80">{r.title}</span>
                </div>
              );
            })}
          </div>

          {/* Detailed structured permissions matrix ledger table */}
          <div className="bg-[#1f124c]/50 rounded-[2rem] border border-[#3e2389]/45 p-5 pr-6 overflow-hidden">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 border-b border-purple-950 pb-2.5 flex items-center gap-1.5 leading-none">
              <Users className="w-4 h-4 text-cyan-400" /> Granular Access Clearance Permissions Ledger
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px] leading-relaxed">
                <thead>
                  <tr className="border-b border-purple-950 text-purple-400 font-bold uppercase tracking-wider">
                    <th className="pb-2.5">Platform Module</th>
                    <th className="pb-2.5">Super-Admin</th>
                    <th className="pb-2.5">Strategist</th>
                    <th className="pb-2.5">Tactician</th>
                    <th className="pb-2.5">Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-950/45 text-purple-200">
                  <tr>
                    <td className="py-2.5 font-bold text-white">⚙️ Core Parameters (Essence)</td>
                    <td className="py-2.5 text-emerald-400 font-extrabold flex items-center gap-1">✔ Read / Write</td>
                    <td className="py-2.5 text-rose-500 font-bold">✖ Blocked</td>
                    <td className="py-2.5 text-[#ff5c00] font-bold">◌ Read Only</td>
                    <td className="py-2.5 text-rose-500 font-bold">✖ Blocked</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-white">🏥 Sante Connect Controls</td>
                    <td className="py-2.5 text-emerald-400 font-extrabold">✔ Read / Write</td>
                    <td className="py-2.5 text-emerald-400 font-extrabold">✔ Read / Write</td>
                    <td className="py-2.5 text-emerald-400 font-extrabold">✔ Read / Write</td>
                    <td className="py-2.5 text-[#ff5c00] font-bold">◌ Read Only</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-white">🔌 PC Terminal (reboot, overclock)</td>
                    <td className="py-2.5 text-emerald-400 font-extrabold">✔ Read / Write</td>
                    <td className="py-2.5 text-[#ff5c00] font-bold">◌ Read Only</td>
                    <td className="py-2.5 text-emerald-400 font-extrabold">✔ Read / Write</td>
                    <td className="py-2.5 text-rose-500 font-bold">✖ Blocked</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-white">🪙 Platform Gating (Billing, SaaS)</td>
                    <td className="py-2.5 text-emerald-400 font-extrabold">✔ Read / Write</td>
                    <td className="py-2.5 text-[#ff5c00] font-bold">◌ Read Only</td>
                    <td className="py-2.5 text-rose-500 font-bold">✖ Blocked</td>
                    <td className="py-2.5 text-rose-500 font-bold">✖ Blocked</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#120732] border border-purple-950 p-3.5 rounded-xl flex items-start gap-2.5 mt-4 text-[9px] text-[#7c6bb5] leading-normal font-semibold">
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Role actions are locked dynamically at client boundary level utilizing RBAC matrix schemas. Interacting on actions restricted by active profile triggers access compliance warnings instantly.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN PORTAL DECK CONTAINER: API Gateway "Blend Block" Orchestrator */}
      <div className="w-full lg:w-[380px] shrink-0 space-y-6">
        
        {/* API GATEWAY BLENDED LAYER OVERVIEW */}
        <div className="bg-[#120732]/95 border border-purple-500/10 p-6 rounded-[2rem] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-purple-950 pb-3.5 mb-4">
              <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 leading-none">
                <Database className="text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} size={16} /> 
                Unified API "Blend" Gateway
              </h2>
              <span className="text-[7.5px] bg-cyan-950/45 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-lg font-mono font-black uppercase">
                PORT 3000
              </span>
            </div>

            <p className="text-[#7c6bb5] text-[10px] leading-relaxed mb-6 font-semibold">
              Bypass individual database credentials and credentials from Prometheus or JumpServer behind a secure API Middleware.
            </p>

            {/* Micro-service Adapters Diagram Map */}
            <div className="space-y-3 relative">
              
              {/* Vertical connecting line */}
              <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#22d3ee] to-purple-600 opacity-30 z-0" />

              <div className="flex items-center gap-3.5 relative z-10 transition-all">
                <div className="w-7 h-7 rounded-lg bg-[#24175e] border border-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.15)]">
                  <span className="text-[10px] font-black">GW</span>
                </div>
                <div className="flex-1 bg-[#1a0e41]/80 border border-[#3e2389]/50 p-3 rounded-2xl flex items-center justify-between">
                  <span className="text-[9.5px] font-black text-white uppercase tracking-wide">Sovereign API Entry</span>
                  <span className="text-[8px] font-bold text-emerald-400 uppercase font-mono">PROXY ENGAGED</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 relative z-10 pl-6">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                <div className="flex-1 bg-[#1a0e41]/40 border border-purple-500/5 p-2 px-3 rounded-xl flex justify-between text-[9px] text-purple-305">
                  <span>gRPC Fleet Adapter</span>
                  <span className="text-cyan-400 font-bold">1.42ms</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 relative z-10 pl-6">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
                <div className="flex-1 bg-[#1a0e41]/40 border border-purple-500/5 p-2 px-3 rounded-xl flex justify-between text-[9px] text-purple-305">
                  <span>JumpServer PAM Adapter</span>
                  <span className="text-cyan-400 font-bold">2.12ms</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 relative z-10 pl-6">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
                <div className="flex-1 bg-[#1a0e41]/40 border border-purple-500/5 p-2 px-3 rounded-xl flex justify-between text-[9px] text-purple-305">
                  <span>Prometheus Adapter</span>
                  <span className="text-cyan-400 font-bold">0.86ms</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 relative z-10 pl-6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5c00] shrink-0" />
                <div className="flex-1 bg-[#1a0e41]/40 border border-purple-500/5 p-2 px-3 rounded-xl flex justify-between text-[9px] text-purple-305">
                  <span>LLM AI Neural Adapter</span>
                  <span className="text-cyan-400 font-bold">4.85ms</span>
                </div>
              </div>

            </div>

            {/* Quick metrics indicators */}
            <div className="grid grid-cols-2 gap-3 mt-6 border-t border-purple-950 pt-5">
              <div className="bg-[#150a36] p-4 rounded-2xl border border-purple-500/10 text-center">
                <span className="text-[8px] text-[#7c6bb5] block font-bold uppercase tracking-wider mb-1">TOTAL ROUTED API REQS</span>
                <strong className="text-lg font-black font-sans text-white">{gatewayRequestsCount.toLocaleString()}</strong>
              </div>
              <div className="bg-[#150a36] p-4 rounded-2xl border border-purple-500/10 text-center">
                <span className="text-[8px] text-[#7c6bb5] block font-bold uppercase tracking-wider mb-1">AVG BRIDGE LATENCY</span>
                <strong className="text-lg font-black font-sans text-cyan-400">{averageDelay} ms</strong>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <NeonButton 
              onClick={triggerSecurityStressTest}
              variant="red" 
              className="w-full text-center"
              disabled={stressTesting}
            >
              {stressTesting ? "🚨 SIMULATING THREAT..." : "SIMULATE GATEWAY THREAT"}
            </NeonButton>
          </div>
        </div>

        {/* LIVE STREAMING ENCRYPTION DECK COMPANION */}
        <div className="bg-[#1a0e41]/85 border border-[#3e2389]/45 p-6 rounded-[2rem] shadow-md flex-1 flex flex-col overflow-hidden max-h-[380px]">
          <div className="border-b border-purple-950 pb-3.5 mb-4 flex items-center justify-between shrink-0">
            <span className="text-xs font-black text-white uppercase tracking-widest block leading-none">
              📡 API Gateway Request Log Matrix
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_#10b981]" />
          </div>

          {/* Log events stack */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[300px]">
            {gatewayLogs.map((log) => {
              const methodColors = {
                GET: "bg-[#25175d] text-cyan-400",
                POST: "bg-purple-950 text-purple-300",
                WS_EMIT: "bg-amber-950 text-amber-300",
                SSH_EXEC: "bg-rose-950 text-[#ff5c00]"
              };
              const isErr = log.status === 403 || log.status === 500;

              return (
                <div 
                  key={log.id}
                  className={`p-3.5 rounded-xl border transition-all duration-300 text-[9.5px] leading-relaxed relative overflow-hidden ${
                    isErr 
                      ? "bg-rose-950/20 border-rose-500/30 animate-pulse text-[#ff5c00]" 
                      : "bg-[#120732]/70 border-purple-505/10 text-purple-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 bg-[#150a36] px-2 py-1 rounded">
                    <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase font-mono ${methodColors[log.method]}`}>
                      {log.method}
                    </span>
                    <span className="text-[#a855f7] font-bold font-mono text-[8px]">{log.adapter}</span>
                    <span className={`font-black ${isErr ? "text-[#ff5c00]" : "text-[#22d3ee]"}`}>{log.status}</span>
                  </div>

                  <div className="font-bold truncate text-white border-b border-purple-950/20 pb-1 mb-1 mt-1.5 font-mono">
                    {log.route}
                  </div>

                  <p className="opacity-75 font-mono truncate text-[#7c6bb5]">
                    PAYLOAD: {log.payload}
                  </p>

                  <div className="flex justify-between items-center text-[8px] mt-1.5 pt-1 border-t border-purple-950/20 text-[#7c6bb5] opacity-80">
                    <span>{log.id}</span>
                    <span>{log.delay}</span>
                    <span className="font-bold">{log.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
