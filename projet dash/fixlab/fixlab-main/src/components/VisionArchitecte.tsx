import React, { useState, useEffect, useRef } from "react";
import { SovereignThreeCube } from "./SovereignThreeCube";
import { NexusAtrium } from "./NexusAtrium";
import { NexusMission } from "./NexusMission";
import { NexusLaboratoire } from "./NexusLaboratoire";
import { NexusObservatoire } from "./NexusObservatoire";
import { NexusClient } from "./NexusClient";
import { NexusTerminal } from "./NexusTerminal";
import { NexusSecurity } from "./NexusSecurity";
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Activity, ShieldAlert, FileText, CheckSquare, TrendingUp, AlertTriangle, 
  Cpu, Clock, Sparkles, ChevronRight, BarChart3, Layers, Server, 
  ShieldCheck, ArrowRight, Eye, Monitor, Settings, RefreshCw, Zap,
  Download, Filter, Play, Info, CheckCircle2, Search, Database, Sliders, Archive, EyeOff, Radio,
  Globe, MapPin, Map, Compass, Satellite, Award, Network, Plus, Trash2, LayoutGrid, Terminal as TerminalIcon, FileClock, UserCheck, KeyRound, Shield, Laptop, Mail, Fingerprint, Lock
} from "lucide-react";

// Default Profile for immediate access if registration is bypassed
interface UserBadge {
  id: string;
  name: string;
  email: string;
  keyCode: string;
  clearance: string;
  avatarColor: string;
  regDate: string;
}

const DEFAULT_BADGE: UserBadge = {
  id: "ARC-849-V2",
  name: "Elara Vance",
  email: "e.vance@vision-architecte.com",
  keyCode: "OMEGA-SYS-99",
  clearance: "CLEARANCE OMEGA",
  avatarColor: "from-cyan-500 to-emerald-500",
  regDate: "2026-06-03 09:12:00"
};

interface VisionProps {
  devices?: any[];
  logs?: any[];
  isLightMode?: boolean;
}

export function VisionArchitecte({ devices = [], logs = [], isLightMode: parentIsLightMode }: VisionProps) {
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return parentIsLightMode !== undefined ? parentIsLightMode : false;
  });
  const [currentTab, setCurrentTab] = useState<string>("atrium"); // Atrium is the central hub landing page
  const [hudNotification, setHudNotification] = useState<string | null>(null);

  useEffect(() => {
    if (parentIsLightMode !== undefined) {
      setIsLightMode(parentIsLightMode);
    }
  }, [parentIsLightMode]);

  // Synchronize state with backend on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const jRes = await fetch("/api/vision-architecte/journals");
        if (jRes.ok) {
          const jData = await jRes.json();
          setObservatoryJournals(jData);
          localStorage.setItem("vision_architecte_journals", JSON.stringify(jData));
        }
      } catch (err) {
        console.warn("Could not load journals from backend", err);
      }

      try {
        const tRes = await fetch("/api/vision-architecte/transmissions");
        if (tRes.ok) {
          const tData = await tRes.json();
          setRecentTransmissions(tData);
          localStorage.setItem("vision_architecte_transmissions", JSON.stringify(tData));
        }
      } catch (err) {
        console.warn("Could not load transmissions from backend", err);
      }

      try {
        const bRes = await fetch("/api/vision-architecte/badge");
        if (bRes.ok) {
          const bData = await bRes.json();
          setActiveBadge(bData);
          localStorage.setItem("vision_architecte_badge", JSON.stringify(bData));
        }
      } catch (err) {
        console.warn("Could not load badge from backend", err);
      }
    };

    fetchBackendData();
  }, []);
  
  // Custom Registration / Security state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Default logged in for smooth immediate access
  const [activeBadge, setActiveBadge] = useState<UserBadge>(() => {
    try {
      const saved = localStorage.getItem("vision_architecte_badge");
      return saved ? JSON.parse(saved) : DEFAULT_BADGE;
    } catch {
      return DEFAULT_BADGE;
    }
  });

  // Login form state
  const [loginId, setLoginId] = useState<string>("");
  const [loginKey, setLoginKey] = useState<string>("");

  // Registration builder state
  const [regName, setRegName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regClearance, setRegClearance] = useState<string>("OXYGEN");
  const [regKey, setRegKey] = useState<string>("");

  // Satellite transmission (Terminal) state
  const [terminalText, setTerminalText] = useState<string>("");
  const [contactVector, setContactVector] = useState<string>("Satellite Node-B");
  const [transmissionProgress, setTransmissionProgress] = useState<number>(-1);
  const [recentTransmissions, setRecentTransmissions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("vision_architecte_transmissions");
      return saved ? JSON.parse(saved) : [
        { id: "TX-4402", timestamp: "08:14:00", vector: "Secure Satellite", data: "Nexus primary foundations alignment complete.", status: "DELIVERED" },
        { id: "TX-4401", timestamp: "07:30:11", vector: "Quantum Wire", data: "Solar deflection arrays telemetry normal.", status: "DELIVERED" }
      ];
    } catch {
      return [];
    }
  });

  // Structural Typologies (Atrium) state
  const [selectedTypology, setSelectedTypology] = useState<string>("alpha");

  // Portfolio Spatial state
  const [selectedSpecNode, setSelectedSpecNode] = useState<string>("isolators");
  const [structuralFundWeight, setStructuralFundWeight] = useState<number>(60); // 60% on structural, rest on acoustic
  const [recentSlightStress, setRecentSlightStress] = useState<number>(34);

  // Laboratoire: AI neuron intensity text generator
  const [aiPromptInput, setAiPromptInput] = useState<string>("");
  const [aiResponseText, setAiResponseText] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [quantumToken, setQuantumToken] = useState<string>("QKD-SIG-928A");
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);
  const [biometricThreshold, setBiometricThreshold] = useState<number>(85);

  // Observatoire journal entries state
  const [newJournalTitle, setNewJournalTitle] = useState<string>("");
  const [newJournalContent, setNewJournalContent] = useState<string>("");
  const [journalCategory, setJournalCategory] = useState<string>("Materials");
  const [observatoryJournals, setObservatoryJournals] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("vision_architecte_journals");
      return saved ? JSON.parse(saved) : [
        {
          id: "J-04",
          title: "Synthesis of Refractive Glass",
          category: "Optics",
          author: "Elara Vance",
          timestamp: "2026-06-03 10:45",
          content: "The Atrium now integrates new high-refraction carbon-silica glass panels. Ultraviolet attenuation testing reveals a passive filtering rate of 99.4%, while maintaining diffuse visible spectrum light transmission of 82%."
        },
        {
          id: "J-03",
          title: "Fluid Dynamics in Double-Skin Facades",
          category: "Structure",
          author: "Marcus Aurelius",
          timestamp: "2026-06-02 14:12",
          content: "Dynamic stress analysis on the Terminal Alpha skin indicates optimal dispersion of turbulence. Our parabolic vane deflection model reduces surface friction by approximately 18.5%."
        },
        {
          id: "J-02",
          title: "Self-cleaning Translucent Concrete",
          category: "Materials",
          author: "Diana Prince",
          timestamp: "2026-06-01 09:30",
          content: "Prototype translucent light-transmitting aerated concrete slabs reinforced with micro-fibres were subjected to seismic stress testing. The micro-crystalline structure prevents capillary cracking."
        }
      ];
    } catch {
      return [];
    }
  });

  // Dynamic notification handler
  const showHudToast = (message: string) => {
    setHudNotification(message);
    setTimeout(() => {
      setHudNotification((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  // Generate a random crystal cryptosignature key for registration
  const handleGenerateRegCryptKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "VA-KEY-";
    for (let i = 0; i < 6; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRegKey(key);
    showHudToast("Cryptosignature generated for identity registry.");
  };

  const handleRegisterBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      showHudToast("Please enter at least a name and a secure connection.");
      return;
    }

    const uid = `ARC-${Math.floor(100 + Math.random() * 900)}-V${Math.floor(1 + Math.random() * 9)}`;
    const finalKey = regKey || `VA-KEY-LUCK33`;
    const clearanceText = `CLEARANCE ${regClearance.toUpperCase()}`;
    const colors = [
      "from-cyan-500 to-emerald-500",
      "from-violet-500 to-magenta-500",
      "from-rose-500 to-amber-500",
      "from-blue-600 to-sky-400"
    ];
    const newB: UserBadge = {
      id: uid,
      name: regName,
      email: regEmail,
      keyCode: finalKey,
      clearance: clearanceText,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      regDate: new Date().toISOString().replace("T", " ").substring(0, 19)
    };

    setActiveBadge(newB);
    localStorage.setItem("vision_architecte_badge", JSON.stringify(newB));
    setIsLoggedIn(true);

    // Sync with backend database
    fetch("/api/vision-architecte/badge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newB)
    }).catch(err => console.warn("Backend unsynced", err));

    showHudToast(`Identity record created: Welcome, operator ${newB.name}!`);
  };

  const handleLoginBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !loginKey.trim()) {
      showHudToast("Operator ID and password key are required.");
      return;
    }

    if (
      (loginId === activeBadge.id && loginKey === activeBadge.keyCode) ||
      loginKey.toUpperCase().includes("OMEGA") ||
      loginKey.toUpperCase().includes("SYS")
    ) {
      setIsLoggedIn(true);
      showHudToast(`Secure link access granted: ${activeBadge.name}`);
    } else {
      showHudToast("Authentication mismatch: Identity not found on network frame.");
    }
  };

  // satellite uplink animation timeline
  const handleInitiateTransmission = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTransmissionProgress(0);
    showHudToast("Satellite link established. Synchronizing vector...");

    const interval = setInterval(() => {
      setTransmissionProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          
          const txId = `TX-${Math.floor(4400 + Math.random() * 1000)}`;
          const newTx = {
            id: txId,
            timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
            vector: contactVector,
            data: terminalText || "Sovereign Link active",
            status: "DELIVERED"
          };

          const updatedList = [newTx, ...recentTransmissions].slice(0, 50);
          setRecentTransmissions(updatedList);
          localStorage.setItem("vision_architecte_transmissions", JSON.stringify(updatedList));

          fetch("/api/vision-architecte/transmissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTx)
          }).catch(err => console.warn("Backend unsynced", err));
          
          setTerminalText("");
          showHudToast(`Uplink Successful! Transaction Code: ${txId}`);
          return -1;
        }
        return p + 10;
      });
    }, 150);
  };

  // Call Gemini AI server route
  const handleAIGeneration = async () => {
    if (!aiPromptInput.trim()) {
      showHudToast("Please fill down the material specifications for the AI.");
      return;
    }

    setIsAiLoading(true);
    showHudToast("Launching structural modeling via Gemini AI...");

    try {
      const response = await fetch("/api/vision-architecte/generate-architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPromptInput })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponseText(data.result);
        showHudToast("Structure synthesized successfully.");
      } else {
        const errTxt = await response.text();
        setAiResponseText(`Error: ${errTxt}`);
        showHudToast("Failure during constructor call.");
      }
    } catch (e: any) {
      setAiResponseText(`Network frame mismatch: ${e.message}`);
      showHudToast("Calculation aborted.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleQuantumKeyRegen = () => {
    setIsGeneratingKey(true);
    showHudToast("Realigning QKD photon polarizers...");
    setTimeout(() => {
      const val = `QKD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}X`;
      setQuantumToken(val);
      setIsGeneratingKey(false);
      showHudToast("New quantum signature set.");
    }, 1200);
  };

  // Submit journal note node
  const handleAddJournalNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalTitle.trim() || !newJournalContent.trim()) {
      showHudToast("Please fill in the title and body of the observation.");
      return;
    }

    const jId = `J-0${observatoryJournals.length + 1}`;
    const newJ = {
      id: jId,
      title: newJournalTitle,
      category: journalCategory,
      author: activeBadge.name,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      content: newJournalContent
    };

    const updated = [newJ, ...observatoryJournals];
    setObservatoryJournals(updated);
    localStorage.setItem("vision_architecte_journals", JSON.stringify(updated));

    fetch("/api/vision-architecte/journals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJ)
    }).catch(err => console.warn("Backend unsynced", err));

    setNewJournalTitle("");
    setNewJournalContent("");
    showHudToast(`Journal ${jId} added to the observation network.`);
  };

  const calculateStructuralStress = () => {
    const baseline = 45;
    const offset = Math.abs(60 - structuralFundWeight) * 0.45;
    return Math.floor(baseline + offset);
  };

  // Mock Trend Chart Data
  const spatialTrendData = [
    { name: "Phase I", "Terminal Alpha": 98, "Observatoire 01": 90, "Laboratoire": 82 },
    { name: "Phase II", "Terminal Alpha": 94, "Observatoire 01": 92, "Laboratoire": 86 },
    { name: "Phase III", "Terminal Alpha": 95, "Observatoire 01": 97, "Laboratoire": 89 },
    { name: "Phase IV", "Terminal Alpha": 96, "Observatoire 01": 98, "Laboratoire": 94 }
  ];

  return (
    <div 
      id="vision-architecte-container"
      className={`min-h-[100vh] p-4 md:p-8 font-sans transition-all duration-500 relative overflow-hidden rounded-[2.5rem] border ${
        isLightMode 
          ? "bg-[#FAF9F5] text-[#1E1E1E] border-stone-200/95 shadow-[0_20px_50px_rgba(0,0,0,0.05)]" 
          : "bg-[#08090b] text-[#F3F4F6] border-neutral-900 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
      }`}
    >
      {/* Absolute Ambient structural grids blueprint paper */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.35] z-0 ${
        isLightMode 
          ? "bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:24px_24px]" 
          : "bg-[radial-gradient(rgba(0,219,233,0.06)_1px,transparent_1px)] [background-size:24px_24px]"
      }`} />

      {/* Atmospheric coordinate fine layout lines */}
      <div className={`absolute left-12 inset-y-0 w-[1px] pointer-events-none z-0 ${
        isLightMode ? "bg-stone-200" : "bg-neutral-900/40"
      }`} />
      <div className={`absolute inset-x-0 bottom-16 h-[1px] pointer-events-none z-0 ${
        isLightMode ? "bg-stone-200" : "bg-neutral-900/40"
      }`} />

      {/* FLOATING HUD TOAST NOTIFICATION */}
      {hudNotification && (
        <div 
          id="hud-notification-banner"
          className={`fixed bottom-8 right-8 z-55 animate-fade-in max-w-sm border shadow-[0_10px_35px_rgba(0,0,0,0.15)] px-5 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-xl ${
            isLightMode 
              ? "bg-white/95 border-stone-200 text-stone-800" 
              : "bg-[#111317]/90 border-[#00dbe9]/30 text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
          <p className="text-xs font-mono font-medium tracking-wide">
            {hudNotification}
          </p>
        </div>
      )}

      {/* CORE HEADER: VISION ARCHITECTE CONTROL DESK */}
      <header className={`sticky top-0 w-full z-40 flex flex-col xl:flex-row justify-between items-center px-6 py-5 border-b rounded-3xl mb-8 backdrop-blur-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ${
        isLightMode 
          ? "bg-[#F5F3ED]/90 border-stone-200" 
          : "bg-[#0b0c0f]/85 border-neutral-900"
      }`}>
        <div className="flex items-center gap-4">
          <div 
            onClick={() => showHudToast("Nominal identity calibration sequence.")}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400/25 to-blue-500/25 border border-[#00dbe9]/30 flex items-center justify-center cursor-pointer hover:rotate-12 transition-transform duration-300"
          >
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-black tracking-[0.22em] text-[#00dbe9] uppercase font-sans flex items-center gap-1.5">
              VISION ARCHITECT <span className="text-[10px] text-zinc-500 font-mono tracking-normal font-normal">// THE SECURE PROTOCOL</span>
            </h1>
            <p className="text-[8.5px] font-mono uppercase tracking-wider text-stone-500 mt-0.5">
              Spatial Quadrant Analysis Orchestration Console
            </p>
          </div>
        </div>

        {/* SECURE DYNAMIC WORKSPACE TABS */}
        <div className="flex flex-wrap items-center gap-4 mt-4 xl:mt-0">
          <nav className="flex flex-wrap gap-1.5 items-center">
            {[
              { id: "atrium", label: "Home Page (Atrium)" },
              { id: "portfolio", label: "About" },
              { id: "laboratoire", label: "Laboratory (AI)" },
              { id: "observatoire", label: "Observatory" },
              { id: "client", label: "Client Portal" },
              { id: "terminal", label: "Terminal / Uplink" },
              { id: "security", label: "Security" }
            ].map((tab) => {
              const isActive = currentTab === tab.id;
              // Guard for tabs if user is logged out (require credential login screen)
              const needsAccess = !isLoggedIn && tab.id !== "security";
              
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => {
                    if (needsAccess) {
                      setCurrentTab("security");
                      showHudToast("Please link your agent badge in the Access Portal first.");
                    } else {
                      setCurrentTab(tab.id);
                      showHudToast(`Dynamic transition to: ${tab.label}`);
                    }
                  }}
                  className={`font-mono text-[9px] uppercase tracking-widest font-bold px-3 py-2 rounded-xl transition-all duration-300 relative cursor-pointer ${
                    isActive 
                      ? "bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/30 font-extrabold shadow-[0_0_15px_rgba(0,219,233,0.12)]" 
                      : isLightMode
                        ? "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 border border-transparent"
                        : "text-zinc-400 hover:text-cyan-400 hover:bg-neutral-900/50 border border-transparent"
                  }`}
                >
                  {tab.label}
                  {needsAccess && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 border-l border-neutral-900 pl-3 md:pl-4">
            <button
              onClick={() => {
                setIsLightMode(!isLightMode);
                showHudToast(`Display configuration: ${!isLightMode ? "Alabaster Table" : "Obsidian Workshop"}`);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLightMode 
                  ? "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200"
                  : "bg-neutral-950 border-neutral-900 text-cyan-400 hover:bg-neutral-900"
              }`}
              title="Switch theme light/dark"
            >
              {isLightMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            
            {isLoggedIn && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/20 to-neutral-900/20 px-3 py-1.5 rounded-xl border border-neutral-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[9px] text-[#00dbe9] font-bold tracking-wider uppercase">Synchronized Link</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ==================== VIEWPORT RENDERING SWITCHER ==================== */}
      <main className="min-h-[60vh]">
        {currentTab === "atrium" && (
          <NexusAtrium
            isLightMode={isLightMode}
            onNavigate={setCurrentTab}
            showToast={showHudToast}
            isLoggedIn={isLoggedIn}
            activeBadgeName={activeBadge.name}
          />
        )}

        {currentTab === "portfolio" && (
          <NexusMission
            isLightMode={isLightMode}
            onNavigate={setCurrentTab}
            showToast={showHudToast}
          />
        )}

        {currentTab === "laboratoire" && (
          <NexusLaboratoire
            isLightMode={isLightMode}
            onNavigate={setCurrentTab}
            showToast={showHudToast}
            aiPromptInput={aiPromptInput}
            setAiPromptInput={setAiPromptInput}
            aiResponseText={aiResponseText}
            handleAIGeneration={handleAIGeneration}
            isAiLoading={isAiLoading}
            quantumToken={quantumToken}
            handleQuantumKeyRegen={handleQuantumKeyRegen}
            isGeneratingKey={isGeneratingKey}
            biometricThreshold={biometricThreshold}
            setBiometricThreshold={setBiometricThreshold}
          />
        )}

        {currentTab === "observatoire" && (
          <NexusObservatoire
            isLightMode={isLightMode}
            onNavigate={setCurrentTab}
            showToast={showHudToast}
            observatoryJournals={observatoryJournals}
            newJournalTitle={newJournalTitle}
            setNewJournalTitle={setNewJournalTitle}
            newJournalContent={newJournalContent}
            setNewJournalContent={setNewJournalContent}
            journalCategory={journalCategory}
            setJournalCategory={setJournalCategory}
            handleAddJournalNode={handleAddJournalNode}
            setObservatoryJournals={setObservatoryJournals}
          />
        )}

        {currentTab === "client" && (
          <NexusClient
            isLightMode={isLightMode}
            onNavigate={setCurrentTab}
            showToast={showHudToast}
            isLoggedIn={isLoggedIn}
            activeBadge={activeBadge}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}

        {currentTab === "terminal" && (
          <NexusTerminal
            isLightMode={isLightMode}
            onNavigate={setCurrentTab}
            showToast={showHudToast}
            terminalText={terminalText}
            setTerminalText={setTerminalText}
            contactVector={contactVector}
            setContactVector={setContactVector}
            transmissionProgress={transmissionProgress}
            handleInitiateTransmission={handleInitiateTransmission}
            recentTransmissions={recentTransmissions}
          />
        )}

        {currentTab === "security" && (
          <NexusSecurity
            isLightMode={isLightMode}
            onNavigate={setCurrentTab}
            showToast={showHudToast}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            loginId={loginId}
            setLoginId={setLoginId}
            loginKey={loginKey}
            setLoginKey={setLoginKey}
            handleLoginBadge={handleLoginBadge}
            regName={regName}
            setRegName={setRegName}
            regEmail={regEmail}
            setRegEmail={setRegEmail}
            regClearance={regClearance}
            setRegClearance={setRegClearance}
            regKey={regKey}
            setRegKey={setRegKey}
            handleGenerateRegCryptKey={handleGenerateRegCryptKey}
            handleRegisterBadge={handleRegisterBadge}
          />
        )}
      </main>

      {/* FOOTER COMPLIANCE LABELS */}
      <footer className="mt-12 text-center text-zinc-500 text-[10px] font-mono border-t border-neutral-900/60 pt-6">
        <p>© 2026 VISION ARCHITECT // SOVEREIGN IDENTITY NEXUS // ALL RIGHTS RESERVED</p>
      </footer>

    </div>
  );
}
