import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, ShieldCheck, Terminal as TermIcon, FileText, Key, Download, 
  UserCheck, PlusCircle, Check, Loader2, Copy, Play, AlertTriangle, 
  Lock, Calendar, HelpCircle, HardDrive, Cpu, Wifi, RefreshCw,
  QrCode, LogIn, LogOut, Power, Shield, Layers, HelpCircle as HelpIcon, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EnrollmentRequest, Device, VolatileSession, GoogleAdminProfile } from "../types";
import { GlassCard, NeonButton } from "./GlassUI";

interface AssetEnrollmentProps {
  currentRole: string;
  devices: Device[];
  onAddLog?: (message: string, level: "info" | "warning" | "success" | "critical", source: string) => void;
}

export const AssetEnrollment: React.FC<AssetEnrollmentProps> = ({ currentRole, devices, onAddLog }) => {
  // Navigation
  const [provisionType, setProvisionType] = useState<"standard" | "volatile">("volatile");
  const [activeTab, setActiveTab] = useState<"form" | "registry" | "terminal">("form");
  const [volatileTab, setVolatileTab] = useState<"auth" | "generate" | "monitor">("generate");

  // Standard Form State
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [designation, setDesignation] = useState("");
  const [sector, setSector] = useState("Secteur Nord (Commandement)");
  const [ipAddress, setIpAddress] = useState("");
  const [osType, setOsType] = useState<"Linux" | "Windows" | "macOS" | "SovereignOS">("SovereignOS");
  const [clearanceLevel, setClearanceLevel] = useState(3);
  const [rootAccess, setRootAccess] = useState(false);
  const [readonlyAccess, setReadonlyAccess] = useState(false);
  const [operatorSignature, setOperatorSignature] = useState("");
  
  // Standard UI indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bashTokenInput, setBashTokenInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SOVEREIGN-NEXUS SYSTEM ONBOARDING SHELL v2.4",
    "Ready for tactile node key injection..."
  ]);
  const [isExecutingScript, setIsExecutingScript] = useState(false);
  
  // --- VOLATILE Link States ---
  const [volatileSessions, setVolatileSessions] = useState<VolatileSession[]>([]);
  const [googleProfile, setGoogleProfile] = useState<GoogleAdminProfile>({
    email: "adambeniich7@gmail.com",
    name: "Commanding Officer",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    isAuthenticated: true,
    tokenJwt: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFkYTcy...MIL-COMMAND-TOKEN-773819-NEXUS"
  });

  // Client Host RAM simulation terminal logs
  const [ramTerminalLogs, setRamTerminalLogs] = useState<string[]>([
    "Welcome to Guest Node Volatile Storage console.",
    "Checking swap partitions... NONE (forced disabled safety policy).",
    "Allocating 128MB RAM disk at file route `/dev/shm`... [OK]"
  ]);

  // Link Generateur state
  const [subName, setSubName] = useState("PATROL-VEHICLE-03");
  const [subIp, setSubIp] = useState("10.240.11.16");
  const [subRole, setSubRole] = useState("Strategic Sensor Node");
  const [subTtl, setSubTtl] = useState(120); // default short TTL for quick testing!
  const [generatedSession, setGeneratedSession] = useState<VolatileSession | null>(null);
  const [isGeneratingVolatile, setIsGeneratingVolatile] = useState(false);

  // Claim simulation
  const [claimTokenInput, setClaimTokenInput] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);

  // Fetch lists
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/appliance/enroll/list");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Error fetching enrollment requests:", err);
    }
  };

  const fetchVolatileSessions = async () => {
    try {
      const res = await fetch("/api/appliance/volatile/list");
      if (res.ok) {
        const data = await res.json();
        setVolatileSessions(data);
      }
    } catch (err) {
      console.error("Error fetching volatile sessions:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchVolatileSessions();
    
    // Listen for SSE updates
    const handleSseSync = () => {
      fetchRequests();
      fetchVolatileSessions();
    };

    window.addEventListener("sse_sync_all", handleSseSync);
    window.addEventListener("sse_enrollment_requests_update", handleSseSync);
    
    // Listen to custom SSE events for volatile
    const handleSseVolatile = () => {
      fetchVolatileSessions();
    };
    window.addEventListener("sse_volatile_sessions_update", handleSseVolatile);

    // Dynamic countdown visual on the client tick
    const timer = setInterval(() => {
      setVolatileSessions(prev => 
        prev.map(sess => {
          if (sess.status === "active" && sess.timeRemainingSeconds > 0) {
            return {
              ...sess,
              timeRemainingSeconds: Math.max(0, sess.timeRemainingSeconds - 1)
            };
          }
          return sess;
        })
      );
    }, 1000);

    return () => {
      window.removeEventListener("sse_sync_all", handleSseSync);
      window.removeEventListener("sse_enrollment_requests_update", handleSseSync);
      window.removeEventListener("sse_volatile_sessions_update", handleSseVolatile);
      clearInterval(timer);
    };
  }, []);

  // Standard Military Request Submission
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!designation || !ipAddress) {
      alert("ERREUR FILING REQ: Designation and IP specifications are required.");
      return;
    }

    if (!operatorSignature) {
      alert("SIGNATURE REQUIS: You must sign below to warrant physical asset ownership.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/appliance/enroll/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designation,
          sector,
          ip: ipAddress,
          os: osType,
          clearanceLevel,
          rootAccess,
          signerOperator: operatorSignature
        })
      });

      if (res.ok) {
        setDesignation("");
        setIpAddress("");
        setOperatorSignature("");
        setRootAccess(false);
        setReadonlyAccess(false);
        await fetchRequests();
        setActiveTab("registry");
        if (onAddLog) {
          onAddLog(`Military enrollment requested launched for unit: ${designation.toUpperCase()}`, "info", "Onboarding Portal");
        }
      } else {
        const err = await res.json();
        alert(`Request failed: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (currentRole === "auditor" || currentRole === "spectator") {
      alert("🔒 INSUFFICIENT RIGHTS: Only an Administrator or Senior Officer can approve new assets.");
      return;
    }

    try {
      const res = await fetch("/api/appliance/enroll/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId })
      });

      if (res.ok) {
        await fetchRequests();
      }
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleTriggerHandshake = async (tokenKey: string) => {
    try {
      const res = await fetch("/api/appliance/enroll/handshake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenKey })
      });

      if (res.ok) {
        const payload = await res.json();
        await fetchRequests();
        if (onAddLog) {
          onAddLog(`Tactical Asset ${payload.device.name} successfully deployed and bound to network with IP ${payload.device.ip}`, "success", "Cryptographic Handshake");
        }
      } else {
        const errorMsg = await res.json();
        return errorMsg.error;
      }
    } catch (err) {
      console.error(err);
      return "Network or system error communicating with cryptoserver.";
    }
  };

  // Run simulated script execution on the integrated Bash console
  const runSimulatorTerminal = async () => {
    if (!bashTokenInput) {
      setTerminalLogs(prev => [...prev, ">> ERROR: Enrollment Token required."]);
      return;
    }

    setIsExecutingScript(true);
    setTerminalLogs([
      `[root@nexus-client]# ./enroll-agent.sh --token ${bashTokenInput}`,
      "--- INITIALIZING FixLab ENROLLMENT ---",
      "[system] Authenticating execution scope... kernel-mode established.",
      "[probe] IP Check: Validating network route to Sovereignty Gateway..."
    ]);

    const logsList = [
      "[probe] CPU Thermals: 38.5°C | Memory bounds: 16254MB AVAILABLE.",
      `[handshake] Dispatching cryptographic token validation: ${bashTokenInput}`,
      "[auth-client] Negotiating ephemeral TLS handshake keys...",
      "[auth-client] Exchanging military payload signatures (RSA-4096 / Ed25519)...",
    ];

    let step = 0;
    const timer = setInterval(async () => {
      if (step < logsList.length) {
        setTerminalLogs(prev => [...prev, logsList[step]]);
        step++;
      } else {
        clearInterval(timer);
        const errMsg = await handleTriggerHandshake(bashTokenInput);
        if (!errMsg) {
          setTerminalLogs(prev => [
            ...prev,
            "----------------------------------------------------------------",
            "[SUCCESS] JWT TOKEN RETIRED. CRYPTOGRAPHIC KEY LIAISON CONFIRMED.",
            "[agent-daemon] Downloading client binary: nexus-agent-linux-amd64... [OK]",
            "[agent-daemon] Installing local systemd supervisor daemon...",
            "[systemctl] Initializing core service: systemctl start nexus-agent",
            "SOVEREIGNTY ESTABLISHED. This tactical asset is now SYNCHRONIZED under defense command."
          ]);
        } else {
          setTerminalLogs(prev => [
            ...prev,
            `[FAILURE] SELECTOR STOPPED: ${errMsg || "Authentication Refused."}`,
            "Please verify your approval permissions or the token's validity."
          ]);
        }
        setIsExecutingScript(false);
      }
    }, 800);
  };

  // --- VOLATILE Links Methods ---

  // Google Login Simulateur
  const toggleGoogleAuth = () => {
    if (googleProfile.isAuthenticated) {
      setGoogleProfile({
        email: "",
        name: "",
        avatarUrl: "",
        isAuthenticated: false
      });
      if (onAddLog) {
        onAddLog("Google Admin Session closed independently.", "info", "Google IAM");
      }
    } else {
      setGoogleProfile({
        email: "adambeniich7@gmail.com",
        name: "Commanding Officer",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
        isAuthenticated: true,
        tokenJwt: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFkYTcy...CLAIM-TOKEN-SIGNED-NEXUSID"
      });
      if (onAddLog) {
        onAddLog("Google Admin Session validated dynamically: adambeniich7@gmail.com", "success", "Google IAM");
      }
    }
  };

  // Generate QR Volatile Config
  const handleGenerateVolatile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleProfile.isAuthenticated) {
      alert("🔒 COMBAT ACCESS DENIED: You must verify your identity via Google Authentication before issuing tokens.");
      return;
    }

    if (!subName || !subIp) {
      alert("Specification of subscriber and target host address is required.");
      return;
    }

    setIsGeneratingVolatile(true);

    try {
      const res = await fetch("/api/appliance/volatile/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberName: subName,
          ipAddress: subIp,
          roleAssigned: subRole,
          durationSeconds: subTtl
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedSession(data.session);
        setClaimTokenInput(data.session.token);
        await fetchVolatileSessions();
        if (onAddLog) {
          onAddLog(`Temporary Volatile Lock configuration registered for subscriber ${subName.toUpperCase()}`, "info", "Volatile Link");
        }
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingVolatile(false);
    }
  };

  // Handshake claim (Liaison cryptographique)
  const handleClaimLink = async () => {
    if (!claimTokenInput) {
      alert("Please provide the volatile connection token first.");
      return;
    }

    setIsClaiming(true);
    setRamTerminalLogs(prev => [
      ...prev,
      `[user@client]# ./volatile-link.sh --claim ${claimTokenInput}`,
      "[status] Initiating ephemeral linkage to Sovereign Gate server...",
      `[status] Contacting server with single-use Token: ${claimTokenInput}`
    ]);

    setTimeout(async () => {
      try {
        const res = await fetch("/api/appliance/volatile/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: claimTokenInput })
        });

        if (res.ok) {
          const data = await res.json();
          await fetchVolatileSessions();
          setRamTerminalLogs(prev => [
            ...prev,
            "[crypto] Server validation: ACCEPTED.",
            "[ramfs] Writing session certification block directly to RAM...",
            `[ramfs] Key stored successfully in RAM disk: \`/dev/shm/nexus_session_${data.session.id}.key\``,
            "----------------------------------------------------------------",
            "🛡️ ephemerality state active. Active controls established.",
            "WARNING: Key is preserved solely in physical RAM nodes. A system shutdown / reboot immediately wipes `/dev/shm`, breaking connectivity."
          ]);
          setGeneratedSession(null); // Clear generator preview on success
        } else {
          const err = await res.json();
          setRamTerminalLogs(prev => [
            ...prev,
            `❌ [ERROR] HANDSHAKE REFUSED BY GATEWAY: ${err.error || "Unknown token configuration."}`
          ]);
        }
      } catch (err) {
        setRamTerminalLogs(prev => [...prev, "❌ Network connection fault to central Bastion."]);
      } finally {
        setIsClaiming(false);
      }
    }, 1500);
  };

  // Extreme test: Simulate physical reboot on a volatile node
  const handleSimulateReboot = async (sessionId: string) => {
    const session = volatileSessions.find(s => s.id === sessionId);
    if (!session) return;

    try {
      const res = await fetch("/api/appliance/volatile/reboot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });

      if (res.ok) {
        await fetchVolatileSessions();
        setRamTerminalLogs([
          "!!! SYSTEM RESET INCIDENT DETECTED !!!",
          "[kernel] Hard Reset signal received (reboot triggers).",
          "[kernel] Wiping CPU caches...",
          "[kernel] Power loss detected. Flushing microelectronic nodes...",
          "[ramfs] CLEARED: All files on `/dev/shm` have been physically destroyed.",
          "[system] Reboot complete. System rebooted cleanly.",
          "----------------------------------------------------------------",
          "❌ MISSING CERTIFICATION: The authorization key vanished upon reboot!",
          "Asset Status: REMOVED AND ISOLATED FROM THE NEXUS."
        ]);
        if (onAddLog) {
          onAddLog(`PHYSICAL REBOOT executed on host: ${session.subscriberName}. RAM storage for ${session.id} cleared. Link disconnected.`, "critical", "Volatile Link");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pre-fill fields for Standard Demo ease
  const fillDemoData = () => {
    setDesignation(`TA-GATEWAY-${Math.floor(10 + Math.random() * 90)}`);
    setIpAddress(`10.240.11.${Math.floor(2 + Math.random() * 253)}`);
    setOperatorSignature("Lt. Colonel Bertrand");
    setClearanceLevel(4);
  };

  const getStatusLabelText = (status: string) => {
    switch (status) {
      case "pending": return "EN ATTENTE";
      case "approved": return "APPROUVÉ";
      case "rejected": return "REJETÉ";
      case "enrolled": return "SOUVERAIN & ACTIF";
      default: return status;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Draw procedural high-fidelity SVG matrix pattern representing a cryptographic QR payload
  const renderProceduralQR = (tokenStr: string) => {
    // Generate a simple deterministic pseudo-hash matrix based on the token
    const grid: boolean[][] = [];
    const hash = tokenStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 12345);
    
    for (let r = 0; r < 15; r++) {
      grid[r] = [];
      for (let c = 0; c < 15; c++) {
        // Force traditional QR coordinates markers (top-left, top-right, bottom-left)
        const isFinderPattern = 
          (r < 5 && c < 5) || 
          (r < 5 && c >= 10) || 
          (r >= 10 && c < 5);
          
        if (isFinderPattern) {
          // outer border or inner core of finder patterns
          const isCore = (r === 2 && c === 2) || (r === 2 && c === 12) || (r === 12 && c === 2);
          const isBorder = r === 0 || r === 4 || c === 0 || c === 4 || (r === 0 && c >= 10) || (r === 4 && c >= 10) || (c === 10 && r < 5) || (c === 14 && r < 5) || (r === 10 && c < 5) || (r === 14 && c < 5) || (c === 0 && r >= 10) || (c === 4 && r >= 10);
          grid[r][c] = isBorder || isCore;
        } else {
          // Dynamic noise from hash
          grid[r][c] = ((hash * (r + 1) * (c + 3)) % 7) > 3;
        }
      }
    }

    return (
      <div className="relative border-4 border-stone-800 p-2.5 bg-black rounded-lg inline-block shadow-[0_0_20px_rgba(124,107,181,0.15)]">
        {/* Animated green scanner beam */}
        <div className="absolute top-0 left-0 w-full h-[2.5px] bg-[#2cb5ff]/80 shadow-[0_0_10px_rgba(44,181,255,0.7)] animate-bounce" />
        
        <div className="grid grid-cols-15 gap-0.5 w-[140px] h-[140px]">
          {grid.flatMap((row, r) => 
            row.map((active, c) => (
              <div 
                key={`${r}-${c}`} 
                className={`w-full aspect-square transition-all duration-300 ${active ? "bg-white" : "bg-zinc-950/20"}`}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div id="asset-enrollment-portal" className="space-y-6">
      
      {/* HEADER CONTROLS SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/40 border border-purple-500/10 p-5 rounded-2xl">
        <div className="font-mono space-y-1">
          <span className="text-[9px] font-extrabold tracking-widest text-[#7c6bb5] uppercase block">
            Provisioning & Onboarding Domain
          </span>
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5 text-[#ff5c00]" />
            Asset Provisioning / Asset Security Protocol
          </h2>
          <p className="text-[10px] text-stone-400">
            Integrate new infrastructure elements into the FixLab on a permanent or volatile basis.
          </p>
        </div>

        {/* PROVISIONING TYPE CHOOSER */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-stone-800 font-mono text-[10px]">
          <button
            onClick={() => { setProvisionType("volatile"); }}
            className={`px-4 py-2 rounded-lg font-black uppercase transition-all tracking-wider flex items-center gap-1.5 ${provisionType === "volatile" ? "bg-orange-500 text-stone-950 font-black shadow-lg shadow-orange-500/25" : "text-stone-400 hover:text-stone-200"}`}
          >
            <QrCode className="w-3.5 h-3.5" />
            🔗 EPHEMERAL PROVISIONING (Volatile RAM)
          </button>
          
          <button
            onClick={() => { setProvisionType("standard"); }}
            className={`px-4 py-2 rounded-lg font-black uppercase transition-all tracking-wider flex items-center gap-1.5 ${provisionType === "standard" ? "bg-[#7c6bb5] text-white shadow-lg" : "text-stone-400 hover:text-stone-200"}`}
          >
            <Shield className="w-3.5 h-3.5" />
            🛡️ TACTICAL ENROLLMENT (Permanent mTLS)
          </button>
        </div>
      </div>

      {/* SUB-HEADER CONDITIONAL CONTROLS */}
      {provisionType === "standard" ? (
        <div className="flex flex-wrap items-center gap-2 bg-stone-950/80 border border-stone-900 p-2 rounded-xl font-mono text-[9.5px]">
          <span className="text-stone-500 px-2 uppercase font-black tracking-wider text-[8px] border-r border-stone-800 shrink-0">STAGES</span>
          <button
            onClick={() => setActiveTab("form")}
            className={`px-3 py-1.5 rounded-lg font-extrabold uppercase transition-all ${activeTab === "form" ? "bg-[#7c6bb5]/10 text-[#7c6bb5] border border-[#7c6bb5]/30" : "text-stone-400 hover:text-stone-200"}`}
          >
            I. Enrollment Request
          </button>
          <button
            onClick={() => setActiveTab("registry")}
            className={`px-3 py-1.5 rounded-lg font-extrabold uppercase transition-all flex items-center gap-1.5 ${activeTab === "registry" ? "bg-[#7c6bb5]/10 text-[#7c6bb5] border border-[#7c6bb5]/30" : "text-stone-400 hover:text-stone-200"}`}
          >
            II. Command Approvals Desk
            {requests.filter(r => r.status === "pending").length > 0 && (
              <span className="w-3 h-3 rounded-full bg-orange-500 text-[7.5px] text-white flex items-center justify-center font-black animate-pulse">
                {requests.filter(r => r.status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`px-3 py-1.5 rounded-lg font-extrabold uppercase transition-all ${activeTab === "terminal" ? "bg-[#7c6bb5]/10 text-[#7c6bb5] border border-[#7c6bb5]/30" : "text-stone-400 hover:text-stone-200"}`}
          >
            III. Target Host Linux Shell
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950/80 border border-stone-900 p-2.5 rounded-xl font-mono text-[9.5px]">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 px-2 uppercase font-black tracking-wider text-[8px] border-r border-stone-850 shrink-0">VOLATILE STEPS</span>
            <button
              onClick={() => setVolatileTab("generate")}
              className={`px-3 py-1.5 rounded-lg font-extrabold uppercase transition-all ${volatileTab === "generate" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-stone-400 hover:text-stone-200"}`}
            >
              I. QR Link Generator
            </button>
            <button
              onClick={() => setVolatileTab("monitor")}
              className={`px-3 py-1.5 rounded-lg font-extrabold uppercase transition-all flex items-center gap-1.5 ${volatileTab === "monitor" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-stone-400 hover:text-stone-200"}`}
            >
              II. Subscriber RAM Handshake
              {volatileSessions.filter(s => s.status === "active").length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
              )}
            </button>
          </div>

          {/* User Sign-In block */}
          <div className="flex items-center gap-3 border-l border-stone-850 pl-4">
            <div className="text-right">
              <span className="text-[7.5px] text-stone-500 block uppercase font-black tracking-widest leading-none">SYSTEM ADMINISTRATOR</span>
              <span className="text-[10px] text-stone-300 block font-bold leading-normal">
                {googleProfile.isAuthenticated ? googleProfile.email : "GUEST INTERR_MODE"}
              </span>
            </div>
            <button
              onClick={toggleGoogleAuth}
              className={`px-2.5 py-1.5 rounded-md font-black uppercase text-[8.5px] tracking-wide flex items-center gap-1 transition-all ${
                googleProfile.isAuthenticated 
                  ? "bg-stone-900 border border-red-950 hover:bg-red-950/30 text-rose-400" 
                  : "bg-orange-500 text-stone-950 font-black"
              }`}
            >
              {googleProfile.isAuthenticated ? (
                <>
                  <LogOut className="w-3 h-3" />
                  SIGN OUT GOOGLE
                </>
              ) : (
                <>
                  <LogIn className="w-3 h-3" />
                  SIGN IN GOOGLE
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PRIMARY WORK COMPONENT */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* ======================================= */}
            {/* MODE A: VOLATILE PROVISIONING (EPHEMERAL) */}
            {/* ======================================= */}
            {provisionType === "volatile" && (
              <motion.div
                key="volatile-zone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                
                {/* SUBTAB 1: GENERATE EPHEMERAL LINK WITH QR CODE */}
                {volatileTab === "generate" && (
                  <div className="bg-stone-950 p-6 text-stone-100 font-mono border-4 border-double border-stone-800 rounded-3xl shadow-2xl relative space-y-6">
                    {/* TOP SECRET Warning Stamps */}
                    <div className="absolute right-6 top-6 border-2 border-orange-500/40 px-3 py-1 text-orange-400/50 uppercase text-[9px] font-black rotate-12 tracking-widest select-none bg-black/60 pointer-events-none">
                      VOLATILE SESSION PREVIEW
                    </div>

                    <div className="text-center border-b border-stone-900 pb-5">
                      <h1 className="text-sm font-black uppercase tracking-[0.5em] text-[#ff8000]">Sovereign Volatile Link</h1>
                      <p className="text-[9px] font-bold text-stone-500 mt-1 uppercase tracking-tight">Ephemeral Provisioning System (RAM Allocation - tmpfs without physical persistence)</p>
                    </div>

                    {!googleProfile.isAuthenticated ? (
                      <div className="p-10 border border-stone-900 rounded-2xl bg-black/40 text-center space-y-4">
                        <Lock className="w-8 h-8 text-rose-500 mx-auto animate-pulse" />
                        <h3 className="text-xs font-black uppercase text-rose-400 font-mono">⚠️ SECURE ACCESS REQUIRED (OAUTH 2.0)</h3>
                        <p className="text-[10px] text-stone-500 max-w-sm mx-auto leading-relaxed">
                          Generating ephemeral prints for new subscribers requires command credentials of a certified administrator. Activate Google Authentication in the top right.
                        </p>
                        <button
                          onClick={toggleGoogleAuth}
                          className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-[9px] tracking-widest uppercase rounded shadow-[0_0_15px_rgba(239,104,18,0.2)]"
                        >
                          Simulate Google Admin Authentication
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Interactive generation Form */}
                        <form onSubmit={handleGenerateVolatile} className="space-y-4.5">
                          <h2 className="bg-stone-900/60 p-2 text-[10px] font-extrabold uppercase border-l-4 border-orange-500 tracking-wider flex items-center justify-between">
                            <span>I. Subscriber Parameters</span>
                            <span className="text-[8px] text-orange-400">RAM_DISK_PARAM</span>
                          </h2>

                          <div className="space-y-3 pt-1 text-[10px]">
                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] text-stone-500 uppercase font-black">Subscriber Client ID / Designation</label>
                              <input
                                value={subName}
                                onChange={(e) => setSubName(e.target.value.toUpperCase())}
                                required
                                className="bg-black border border-stone-850 p-2 rounded text-xs text-stone-200 outline-none focus:border-orange-500/40 uppercase font-mono"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] text-stone-500 uppercase font-black">Assigned Static IP Address</label>
                              <input
                                value={subIp}
                                onChange={(e) => setSubIp(e.target.value)}
                                required
                                className="bg-black border border-stone-850 p-2 rounded text-xs text-stone-200 outline-none focus:border-orange-500/40 font-mono"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] text-stone-500 uppercase font-black">Role / Authorization Granted</label>
                              <select
                                value={subRole}
                                onChange={(e) => setSubRole(e.target.value)}
                                className="bg-black border border-stone-850 p-2 rounded text-xs text-stone-300 font-mono outline-none"
                              >
                                <option value="Strategic Sensor Node">Strategic Sensor Node (Telemetry only)</option>
                                <option value="Telemetry Auditor">Telemetry Auditor (Audit records)</option>
                                <option value="Sector Intelligence Dispatcher">Sector Intelligence Dispatcher (Field relay)</option>
                                <option value="Field Support Specialist">Field Support Specialist (Auxiliary host)</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] text-stone-500 uppercase font-black">Volatile Expiration Session TTL: {subTtl} seconds</label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min="45"
                                  max="600"
                                  step="15"
                                  value={subTtl}
                                  onChange={(e) => setSubTtl(Number(e.target.value))}
                                  className="flex-1 accent-orange-500 h-1 bg-stone-900 rounded-full"
                                />
                                <span className="text-orange-400 font-bold font-mono bg-stone-900 px-2 py-0.5 rounded border border-stone-850">
                                  {subTtl}s
                                </span>
                              </div>
                              <span className="text-[7.5px] text-stone-500 leading-normal uppercase">
                                Note: A short TTL of around 120s is optimal for observing real-time end-of-life synchronization.
                              </span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={isGeneratingVolatile}
                              className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                            >
                              {isGeneratingVolatile ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  GENERATING VAULT CREDENTIALS...
                                </>
                              ) : (
                                "ACTIVATE & SYNCHRONIZE DISKLESS"
                              )}
                            </button>
                          </div>
                        </form>

                        {/* Interactive QR Vector display */}
                        <div className="border border-stone-900 bg-black/40 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                          <h3 className="text-[10px] font-black uppercase text-stone-400 font-mono tracking-widest">
                            {generatedSession ? "⚡ QR CODE D'ENRÔLEMENT VOLATILE" : "ATTENTE PARAMÈTRES"}
                          </h3>

                          {generatedSession ? (
                            <>
                              {renderProceduralQR(generatedSession.token)}
                              
                              <div className="space-y-2 w-full text-left font-mono bg-stone-950 p-3 rounded-lg border border-stone-900 text-[10px]">
                                <div className="flex justify-between border-b border-stone-900 pb-1">
                                  <span className="text-stone-500 text-[8px] uppercase">TOKEN ID :</span>
                                  <span className="text-orange-400 font-bold select-all">{generatedSession.token}</span>
                                </div>
                                <div className="flex justify-between border-b border-stone-900 pb-1">
                                  <span className="text-stone-500 text-[8px] uppercase">EXPIRES AT :</span>
                                  <span className="text-amber-500">{generatedSession.timeRemainingSeconds}s Dynamic TTL</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-stone-500 text-[8px] uppercase">RAM_PATH LOCK :</span>
                                  <span className="text-stone-300 font-mono text-[9px]">{generatedSession.ramPath}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setVolatileTab("monitor");
                                  setClaimTokenInput(generatedSession.token);
                                }}
                                className="text-[9px] text-[#2cb5ff] hover:underline flex items-center gap-1 font-bold"
                              >
                                Inject to Client Simulator →
                              </button>
                            </>
                          ) : (
                            <div className="text-center p-6 space-y-2">
                              <QrCode className="w-14 h-14 text-stone-850 mx-auto animate-pulse" />
                              <p className="text-stone-500 text-[9.5px] max-w-[200px] mx-auto leading-normal">
                                Define target asset coordinates on the left and submit to generate the volatile QR enrollment link.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUBTAB 2: SUBSCRIBER RAM MONITOR & CLIENT REBOOT */}
                {volatileTab === "monitor" && (
                  <div className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Interactive Token Claim Shell Simulation on client */}
                      <GlassCard className="p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-900 pb-2.5">
                          <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                            <TermIcon className="w-4 h-4" />
                            Client Host Memory Loader (/dev/shm)
                          </h3>
                          <span className="text-[8px] border border-orange-500/20 text-orange-400 bg-orange-950/20 px-2 py-0.5 rounded font-black tracking-widest">TRANSIENT AGENT</span>
                        </div>

                        <p className="text-stone-500 leading-normal text-[9.5px]">
                          Verify the agent connection. The client logs the encrypted session ID exclusively to RAM memory storage (`/dev/shm`).
                        </p>

                        <div className="space-y-3.5">
                          <div className="flex gap-2.5">
                            <input
                              value={claimTokenInput}
                              onChange={(e) => setClaimTokenInput(e.target.value.toUpperCase())}
                              placeholder="Volatile Liaison Key (e.g., LNK-XXXX-XXXX)"
                              className="flex-1 bg-black text-orange-400 font-bold tracking-widest p-2 border border-stone-800 text-xs rounded outline-none w-full"
                            />
                            
                            <button
                              onClick={handleClaimLink}
                              disabled={isClaiming || !claimTokenInput}
                              className="px-4 bg-[#7c6bb5] hover:bg-[#8d7dc5] text-white font-black uppercase text-[9.5px] tracking-wider rounded transition-all cursor-pointer disabled:opacity-35"
                            >
                              {isClaiming ? "CONNECTING..." : "Bind Agent"}
                            </button>
                          </div>

                          {/* Client Terminal logs */}
                          <div className="bg-black/90 rounded-xl p-3.5 border border-stone-850 h-[190px] overflow-y-auto font-mono text-[8.5px] text-stone-400 space-y-1">
                            {ramTerminalLogs.map((log, lIdx) => {
                              let cl = "text-stone-400";
                              if (log.startsWith("[status]")) cl = "text-[#ff8000]";
                              if (log.startsWith("[crypto]") || log.startsWith("🛡️") || log.startsWith("[Success]")) cl = "text-emerald-400 font-bold";
                              if (log.startsWith("❌") || log.startsWith("!!!") || log.startsWith("Incident")) cl = "text-rose-400 font-bold";
                              return (
                                <div key={lIdx} className={`leading-relaxed ${cl}`}>
                                  {log}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </GlassCard>

                      {/* Active Volatile Registry */}
                      <GlassCard className="p-5 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-stone-900 pb-2.5">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                              <Cpu className="w-4 h-4 text-orange-400" />
                              Volatile Session Registry
                            </h3>
                            <span className="text-[8px] text-stone-500 font-black">{volatileSessions.length} TRACKED</span>
                          </div>

                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                            {volatileSessions.length === 0 ? (
                              <div className="p-10 text-center text-stone-600 uppercase font-bold text-[9.5px]">
                                No active sessions listed in the volatile allocation table.
                              </div>
                            ) : (
                              volatileSessions.map((sess) => (
                                <div key={sess.id} className={`p-3 rounded-xl border relative font-mono text-[10px] bg-black/45 ${
                                  sess.status === "active" ? "border-orange-500/20" : "border-stone-900 opacity-40"
                                }`}>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-zinc-200">{sess.subscriberName}</span>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                                      sess.status === "active" ? "bg-orange-500/10 text-orange-400 animate-pulse" : "bg-stone-900 text-stone-500"
                                    }`}>
                                      {sess.status === "active" ? "ACTIVE / RAM-ONLY" : "EXPIRED / RAM-CLEARED"}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 mt-2 text-[9px] text-stone-500">
                                    <div>IP: <span className="text-stone-300 font-bold">{sess.ipAddress}</span></div>
                                    <div>TTL: <span className="text-orange-400 font-black">{sess.timeRemainingSeconds}s remaining</span></div>
                                    <div className="col-span-2">Mount Path: <span className="text-stone-400 text-[8.5px]">{sess.ramPath}</span></div>
                                  </div>

                                  {sess.status === "active" && (
                                    <button
                                      onClick={() => handleSimulateReboot(sess.id)}
                                      className="mt-3.5 w-full py-1.5 bg-rose-950/40 hover:bg-rose-950 text-rose-300 hover:text-white text-[8px] font-black uppercase tracking-widest border border-rose-900/40 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <Power className="w-3 h-3 text-rose-400 animate-spin" />
                                      💣 BOOT REBOOT (Flushes RAM)
                                    </button>
                                  )}

                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="text-[8px] text-stone-500 uppercase flex items-center gap-1 pt-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-500 border border-transparent shrink-0" />
                          <span>The cookies and local hard drives of these subscriber machines store NO files or keys for military classification reasons.</span>
                        </div>
                      </GlassCard>

                    </div>

                  </div>
                )}

              </motion.div>
            )}

            {/* ======================================= */}
            {/* MODE B: STANDARD MILITARY ENROLLMENT     */}
            {/* ======================================= */}
            {provisionType === "standard" && (
              <motion.div
                key="standard-zone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                
                {/* TAB 1: FORMULAIRE */}
                {activeTab === "form" && (
                  <div className="bg-stone-950 p-6 text-stone-100 font-mono border-4 border-double border-stone-800 rounded-3xl shadow-2xl relative space-y-6">
                    <div className="absolute right-6 top-6 border-2 border-red-800/40 px-3 py-1 text-red-500/50 uppercase text-[9px] font-black rotate-12 tracking-widest select-none bg-black/60 pointer-events-none">
                      RESTRICTED // CLASSIFIED
                    </div>

                    <div className="text-center border-b border-stone-800 pb-5">
                      <h1 className="text-sm font-black uppercase tracking-[0.5em] text-white">FixLab Command</h1>
                      <p className="text-[9px] font-bold text-stone-500 mt-1 uppercase tracking-tight">Tactical Asset Enrollment Form - Clearance Level 4</p>
                      <button
                        type="button"
                        onClick={fillDemoData}
                        className="mt-3 px-3 py-1 bg-stone-900 border border-stone-800 hover:bg-[#7c6bb5]/10 hover:border-[#7c6bb5]/50 text-stone-400 hover:text-[#7c6bb5] text-[8px] rounded-md transition-all font-mono tracking-widest uppercase"
                      >
                        ⚡ [ Fill with tactical examples ]
                      </button>
                    </div>

                    <form onSubmit={handleCreateRequest} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Section I */}
                        <div className="space-y-4">
                          <h2 className="bg-stone-900/60 p-2 text-[10.5px] font-extrabold uppercase border-l-4 border-cyan-500 tracking-wider flex items-center justify-between">
                            <span>I. Asset Identification</span>
                            <span className="text-[8px] text-cyan-400">UNIT_RECORDS</span>
                          </h2>

                          <div className="space-y-3 pt-1">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-stone-400 uppercase font-bold tracking-tight">Unit Designation (Unique ID)</label>
                              <input 
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value.toUpperCase())}
                                required
                                placeholder="ex: ALPHA-01, SIGINT-NODE-A" 
                                className="bg-black border border-stone-800 focus:border-cyan-500/50 outline-none p-2 rounded text-xs text-stone-200 placeholder-stone-700 uppercase"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-stone-400 uppercase font-bold tracking-tight">Deployment Sector</label>
                              <select 
                                value={sector}
                                onChange={(e) => setSector(e.target.value)}
                                className="bg-black border border-stone-800 outline-none p-2 rounded text-xs text-stone-300 font-mono"
                              >
                                <option value="Secteur Nord (Commandement)">Northern Sector (Command)</option>
                                <option value="Secteur Sud (Logistique)">Southern Sector (Logistics)</option>
                                <option value="Périmètre Externe (Edge)">External Perimeter (Edge)</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-stone-400 uppercase font-bold tracking-tight">Target Static IP Address</label>
                              <input 
                                value={ipAddress}
                                onChange={(e) => setIpAddress(e.target.value)}
                                required
                                placeholder="ex: 10.240.11.45" 
                                className="bg-black border border-stone-800 focus:border-cyan-500/50 outline-none p-2 rounded text-xs font-mono text-zinc-100"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-stone-400 uppercase font-bold tracking-tight">Asset Operating System</label>
                              <div className="grid grid-cols-2 gap-2 mt-0.5">
                                {(["SovereignOS", "Linux", "Windows", "macOS"] as const).map((os) => (
                                  <button
                                    key={os}
                                    type="button"
                                    onClick={() => setOsType(os)}
                                    className={`p-2 border rounded text-[9.5px] font-bold text-left uppercase transition-all flex items-center justify-between ${osType === os ? "border-cyan-500/60 bg-cyan-950/25 text-cyan-400" : "border-stone-800 bg-black/40 hover:border-stone-700 text-stone-400"}`}
                                  >
                                    {os}
                                    {osType === os && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section II */}
                        <div className="space-y-4">
                          <h2 className="bg-stone-900/60 p-2 text-[10.5px] font-extrabold uppercase border-l-4 border-amber-500 tracking-wider flex items-center justify-between">
                            <span>II. Clearances & Credentials</span>
                            <span className="text-[8px] text-amber-500">PRIVILEGE_MATRIX</span>
                          </h2>

                          <div className="space-y-3 pt-1">
                            
                            <button
                              type="button"
                              onClick={() => setRootAccess(!rootAccess)}
                              className={`w-full p-2 border rounded flex items-center gap-3 text-left transition-all bg-black/40 ${rootAccess ? "border-amber-500/60 text-amber-400" : "border-stone-800 text-stone-500"}`}
                            >
                              <input 
                                type="checkbox" 
                                checked={rootAccess} 
                                onChange={() => {}}
                                className="accent-amber-500 cursor-pointer pointer-events-none" 
                              />
                              <div className="flex flex-col">
                                <span className="text-[9.5px] uppercase font-black">Root / Administrator Access</span>
                                <span className="text-[8px] text-stone-500">Allows complete command orchestrations.</span>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setReadonlyAccess(!readonlyAccess)}
                              className={`w-full p-2 border rounded flex items-center gap-3 text-left transition-all bg-black/40 ${readonlyAccess ? "border-amber-500/60 text-amber-400" : "border-stone-800 text-stone-500"}`}
                            >
                              <input 
                                type="checkbox" 
                                checked={readonlyAccess} 
                                onChange={() => {}}
                                className="accent-amber-500 cursor-pointer pointer-events-none" 
                              />
                              <div className="flex flex-col">
                                <span className="text-[9.5px] uppercase font-black">Read Only (Auditor)</span>
                                <span className="text-[8px] text-stone-500">Freezes all actions. Stream analytics.</span>
                              </div>
                            </button>

                            <div className="flex flex-col gap-1.5 pt-1">
                              <label className="text-[9px] text-stone-400 uppercase font-bold tracking-tight">Required Clearance Level (0 - 5)</label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="range"
                                  min="0"
                                  max="5"
                                  value={clearanceLevel}
                                  onChange={(e) => setClearanceLevel(Number(e.target.value))}
                                  className="flex-1 accent-[#7c6bb5] h-1.5 rounded-full bg-stone-800 cursor-pointer"
                                />
                                <span className="font-extrabold text-[#7c6bb5] text-xs px-2.5 py-1 bg-stone-900 border border-stone-800 rounded min-w-[32px] text-center">
                                  0{clearanceLevel}
                                </span>
                              </div>
                              <span className="text-[8px] text-stone-500 uppercase mt-1 leading-normal">
                                Note: A level higher than 3 requires an enrolled MFA key.
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Signatures Field */}
                      <div className="mt-6 pt-5 border-t border-stone-900 grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px]">
                        <div className="text-center space-y-2">
                          <div className="flex justify-center border-b border-stone-800 h-11 relative">
                            <input
                              value={operatorSignature}
                              onChange={(e) => setOperatorSignature(e.target.value)}
                              required
                              placeholder="EX: LT. COOPER"
                              className="bg-transparent text-center text-xs font-bold font-mono outline-none w-full text-[#7c6bb5] tracking-widest placeholder-stone-700 uppercase"
                            />
                          </div>
                          <p className="text-[8px] uppercase tracking-wider text-stone-500 font-bold">Signature of enrolling Operator</p>
                        </div>

                        <div className="text-center space-y-2 select-none opacity-45">
                          <div className="border-b border-stone-800 h-11 flex items-end justify-center pb-1">
                            <span className="text-[10px] text-stone-700 italic font-mono tracking-widest">AWAITING LEGISLATURE</span>
                          </div>
                          <p className="text-[8px] uppercase tracking-wider text-stone-500 font-bold">Command Approval (Sovereign Admin)</p>
                        </div>
                      </div>

                      {/* Submit buttons */}
                      <div className="pt-4 flex justify-center">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-[#2cb5ff] hover:bg-cyan-500 text-slate-950 font-black px-10 py-3 uppercase tracking-widest text-xs transition-all rounded shadow-[0_0_15px_rgba(44,181,255,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-40"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4.5 h-4.5 animate-spin" />
                              SOUMISSION EN COURS...
                            </>
                          ) : (
                            "SOUMETTRE LA REQUÊTE D'ENRÔLEMENT"
                          )}
                        </button>
                      </div>

                    </form>
                  </div>
                )}

                {/* TAB 2: REGISTRY approvals */}
                {activeTab === "registry" && (
                  <div className="space-y-4">
                    <div className="bg-stone-900/30 border border-purple-500/10 rounded-2xl p-4 flex items-center justify-between">
                      <div className="font-mono text-xs">
                        <p className="font-bold text-zinc-100 uppercase">OFFICER'S COMMAND BOARD</p>
                        <p className="text-[9px] text-stone-500">Examine registered operator files, sign and broadcast cryptographically signed active OTPs.</p>
                      </div>
                      <button 
                        onClick={fetchRequests}
                        className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-200 transition-all font-bold"
                        title="Recheck definitions"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    {requests.length === 0 ? (
                      <GlassCard className="p-12 text-center space-y-3 font-mono">
                        <FileText className="w-10 h-10 text-stone-600 mx-auto animate-pulse" />
                        <p className="text-xs text-stone-400 uppercase font-bold">AUCUN DOSSIER D'ENRÔLEMENT</p>
                      </GlassCard>
                    ) : (
                      <div className="space-y-3">
                        {requests.map((req) => (
                          <GlassCard 
                            key={req.id}
                            className={`p-5 font-mono border-l-4 transition-all ${
                              req.status === "enrolled" ? "border-l-emerald-500 bg-emerald-950/5" :
                              req.status === "approved" ? "border-l-cyan-400 bg-cyan-950/5" :
                              "border-l-orange-500"
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-[11px] font-black text-white tracking-widest">{req.id}</span>
                                  <span className="text-[9px] opacity-40">// Filed: {req.createdTime}</span>
                                  <span className={`text-[8.5px] font-black px-2 py-0.5 rounded ${
                                    req.status === "enrolled" ? "bg-emerald-500/10 text-emerald-400" :
                                    req.status === "approved" ? "bg-cyan-500/10 text-cyan-400" :
                                    "bg-orange-500/10 text-orange-400"
                                  } uppercase`}>
                                    {getStatusLabelText(req.status)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-1 pt-1 text-[10.5px]">
                                  <div>
                                    <span className="text-[8px] text-stone-500 uppercase block">DESIG:</span>
                                    <span className="font-extrabold text-zinc-300">{req.designation}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-stone-500 uppercase block">IP:</span>
                                    <span className="font-extrabold text-[#7c6bb5]">{req.ip}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-stone-500 uppercase block">SECTOR:</span>
                                    <span className="text-stone-400 font-bold">{req.sector}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-stone-500 uppercase block">OPERATOR:</span>
                                    <span className="text-zinc-300 tracking-wide">{req.signerOperator}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center md:justify-end gap-3.5 border-t border-purple-500/5 md:border-transparent pt-3.5 md:pt-0">
                                {req.status === "pending" && (
                                  <button
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-stone-950 text-[10.5px] font-black uppercase rounded tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    APPROUVER & COMP_TOKEN
                                  </button>
                                )}

                                {req.status === "approved" && req.token && (
                                  <div className="flex items-center gap-2 bg-black border border-cyan-500/30 px-3.5 py-2 rounded">
                                    <Key className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                                    <div className="text-left font-bold text-cyan-300 tracking-wider text-[11px] select-all">
                                      {req.token}
                                    </div>
                                    <button
                                      onClick={() => {
                                        copyToClipboard(req.token || "");
                                        setBashTokenInput(req.token || "");
                                        alert("OTP Key copied. Paste the token into the 'Host shell' module!");
                                      }}
                                      className="text-stone-500 hover:text-cyan-400 p-1 shrink-0"
                                      title="Copy key"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}

                                {req.status === "enrolled" && (
                                  <div className="text-right text-[10px] text-stone-400 space-y-0.5">
                                    <p className="font-extrabold text-emerald-400 uppercase tracking-widest flex items-center justify-end gap-1">
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      ACTIVE
                                    </p>
                                    <p className="text-[8.5px] text-stone-500 leading-none">Bound: {req.enrolledTime}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </GlassCard>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: TARGET BASH */}
                {activeTab === "terminal" && (
                  <div className="bg-stone-950 p-5 rounded-3xl border border-zinc-800 shadow-2xl font-mono text-xs text-stone-100 flex flex-col h-[480px]">
                    <div className="flex items-center justify-between border-b border-stone-900 pb-3 font-bold select-none text-stone-500">
                      <span className="text-cyan-400 animate-pulse font-mono tracking-tight text-[11px] flex items-center gap-1.5">
                        <TermIcon className="w-4 h-4 text-cyan-400" />
                        SECURE TARGET COMPUTER Linux SHELL (mTLS REGISTRATION)
                      </span>
                      <span className="text-[9px] bg-red-950/30 border border-red-500/20 text-red-500 px-2 py-0.5 rounded font-black tracking-widest">DEVICE_SHELL</span>
                    </div>

                    <div className="my-4 p-4.5 bg-stone-900 border border-stone-800 rounded-xl space-y-4">
                      <p className="text-[10px] leading-relaxed text-stone-400 font-sans">
                        Simulate the execution of the onboarding script on the destination machine. Obtain the JIT token of an approved request (tab 2), paste it below, then initiate the cryptographic signature to register the node.
                      </p>

                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 flex gap-2">
                          <div className="bg-black text-[10.5px] px-3.5 py-2 border border-stone-800 text-stone-500 flex items-center font-black select-none uppercase shrink-0">
                            OTP_TOKEN:
                          </div>
                          <input
                            type="text"
                            value={bashTokenInput}
                            onChange={(e) => setBashTokenInput(e.target.value.toUpperCase())}
                            placeholder="Enter the validated Token (e.g., SOV-XXXXX-XXXX)"
                            className="flex-1 bg-black text-cyan-300 font-bold tracking-widest p-2 border border-stone-800 focus:border-cyan-500/40 rounded outline-none w-full text-xs"
                          />
                        </div>
                        
                        <button
                          onClick={runSimulatorTerminal}
                          disabled={isExecutingScript}
                          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-black uppercase text-[10px] tracking-widest rounded flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 shrink-0 cursor-pointer"
                        >
                          {isExecutingScript ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              DEPLOYING INTEGRATED CLIENT AGENT...
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 shrink-0" />
                              PROVISION AGENT
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 bg-black rounded-lg p-4 font-mono text-[10.5px] text-stone-400 overflow-y-auto space-y-1 outline-none relative selection:bg-cyan-500/20 select-all border border-stone-900 text-left">
                      {terminalLogs.map((log, i) => {
                        let style = "text-stone-400";
                        if (log.startsWith("[SUCCESS]") || log.startsWith("[OK]") || log.startsWith("SOUVERAINETÉ")) {
                          style = "text-emerald-400 font-bold";
                        } else if (log.startsWith("[FAILURE]") || log.startsWith(">> ERREUR")) {
                          style = "text-rose-400 font-bold";
                        } else if (log.startsWith("[root@")) {
                          style = "text-stone-100 font-black";
                        } else if (log.startsWith("---") || log.startsWith("Welcome")) {
                          style = "text-purple-400 font-medium";
                        } else if (log.startsWith("[handshake]")) {
                          style = "text-cyan-400";
                        }

                        return (
                          <div key={i} className={`font-mono leading-relaxed ${style}`}>
                            {log}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: REQUISITE ARCHITECTURE EXPLANATORY / GUIDES (4 COLS) */}
        <div className="lg:col-span-4 space-y-6 font-mono text-[9px]">
          
          {/* Volatile and Standard specifications card */}
          {provisionType === "volatile" ? (
            <GlassCard className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-orange-400" />
                Volatile Provisioning Details
              </h3>
              
              <p className="text-stone-500 leading-normal">
                To ensure that sensitive information does not persist on flash memory (preventing physical hardware compromise), the <strong>Sovereign Volatile Link</strong> implements strict defensive protocols:
              </p>

              <div className="space-y-3 pt-1 text-[9.5px]">
                <div className="flex gap-2">
                  <span className="w-4 h-4 rounded bg-orange-950 text-orange-400 font-bold shrink-0 flex items-center justify-center text-[8.5px]">A</span>
                  <div>
                    <p className="font-bold text-zinc-300 uppercase">Google Auth Authentication</p>
                    <p className="text-stone-500 text-[8px] mt-0.5 leading-normal">Only authorized administrators validated by a Google Workspace ID Token can manage the volatile session table.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="w-4 h-4 rounded bg-orange-950 text-orange-400 font-bold shrink-0 flex items-center justify-center text-[8.5px]">B</span>
                  <div>
                    <p className="font-bold text-zinc-300 uppercase">Exclusive RAM Storage (tmpfs)</p>
                    <p className="text-stone-500 text-[8px] mt-0.5 leading-normal">The session RSA/mTLS alliance key is located strictly at the logical path <code>/dev/shm/nexus_session_*.key</code>.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="w-4 h-4 rounded bg-orange-950 text-orange-400 font-bold shrink-0 flex items-center justify-center text-[8.5px]">C</span>
                  <div>
                    <p className="font-bold text-zinc-300 uppercase">Natural Session Void</p>
                    <p className="text-stone-500 text-[8px] mt-0.5 leading-normal">Each physical reboot or power loss immediately de-energizes the RAM transistors, instantly isolating the node.</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-1.55">
                <HardDrive className="w-4 h-4 text-[#7c6bb5]" />
                Tactical Enrollment Guide
              </h3>
              
              <p className="text-stone-500 leading-normal">
                Follow the tactical command procedure to permanently enroll the computer into the defensive perimeter:
              </p>

              <div className="space-y-3.5 pt-1 text-[9.5px]">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/30 text-cyan-400 font-black shrink-0 flex items-center justify-center text-[9px]">1</span>
                  <div>
                    <p className="font-bold text-zinc-300 uppercase">Submit Request</p>
                    <p className="text-stone-500 text-[8.5px] mt-0.5 leading-snug">Deliver the formal enrollment form specifying the tactical unit designation and static IPV4.</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/30 text-cyan-400 font-black shrink-0 flex items-center justify-center text-[9px]">2</span>
                  <div>
                    <p className="font-bold text-zinc-300 uppercase">Approval & OTP Grant</p>
                    <p className="text-stone-500 text-[8.5px] mt-0.5 leading-snug">The hierarchy reviews the request, approves it, and generates a single-use JIT token.</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/30 text-cyan-400 font-black shrink-0 flex items-center justify-center text-[9px]">3</span>
                  <div>
                    <p className="font-bold text-zinc-300 uppercase">Cryptographic Coupling</p>
                    <p className="text-stone-500 text-[8.5px] mt-0.5 leading-snug">The onboarding script executes locally and installs the background mTLS supervisor daemon.</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Connected Network Nodes status */}
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-1.5All">
              <Wifi className="w-4 h-4 text-cyan-400" />
              Sovereignty Active Fleet ({devices.length})
            </h3>

            <p className="text-stone-500 leading-normal">
              Completed and currently active communication nodes are listed below:
            </p>

            <div className="space-y-2 pt-1 font-mono text-[9px] max-h-[170px] overflow-y-auto">
              {devices.map((dev) => (
                <div key={dev.id} className="bg-black/45 p-2 rounded border border-stone-850 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-stone-200 block">{dev.name}</span>
                    <span className="text-stone-500 block">IP: {dev.ip} // OS: {dev.os}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider ${
                      dev.status === "online" ? "bg-emerald-500/10 text-emerald-400" : "bg-stone-900 text-stone-500"
                    }`}>
                      {dev.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick-look at the Bash file system storage checker */}
          <GlassCard className="p-5 space-y-2 text-[8px] leading-normal uppercase">
            <span className="block font-black text-orange-400 tracking-wider text-[8px]">
              MEMORY PARTITION INTEGRITY CHECK (tmpfs)
            </span>
            <code className="bg-black p-2 rounded border border-stone-900 block text-[7px] text-orange-300 font-mono text-left lowercase">
              {`$ df -h /dev/shm
Filesystem      Size  Used Avail Use% Mounted on
tmpfs            16G   12M   16G   1% /dev/shm
$ ls -la /dev/shm/*
-r-------- 1 root root 256 Jun 2 11:45 nexus_session_VOL-X92.key`}
            </code>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

