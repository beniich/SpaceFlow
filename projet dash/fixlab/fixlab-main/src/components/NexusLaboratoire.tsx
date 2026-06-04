import React, { useState } from "react";
import { Cpu, Server, BarChart3, ArrowRight, ShieldCheck, Zap, Sliders, RefreshCw, KeyRound, Fingerprint, Activity, Layers, Play, CheckSquare } from "lucide-react";

interface LaboratoireProps {
  isLightMode: boolean;
  onNavigate: (tabId: string) => void;
  showToast: (msg: string) => void;
  // State variables from master component
  aiPromptInput: string;
  setAiPromptInput: (val: string) => void;
  aiResponseText: string;
  handleAIGeneration: () => void;
  isAiLoading: boolean;
  quantumToken: string;
  handleQuantumKeyRegen: () => void;
  isGeneratingKey: boolean;
  biometricThreshold: number;
  setBiometricThreshold: (val: number) => void;
}

export function NexusLaboratoire({
  isLightMode,
  onNavigate,
  showToast,
  aiPromptInput,
  setAiPromptInput,
  aiResponseText,
  handleAIGeneration,
  isAiLoading,
  quantumToken,
  handleQuantumKeyRegen,
  isGeneratingKey,
  biometricThreshold,
  setBiometricThreshold
}: LaboratoireProps) {
  const [activeSchemaFlow, setActiveSchemaFlow] = useState<"none" | "agent" | "server" | "dashboard">("none");
  const [showSandbox, setShowSandbox] = useState(false);

  return (
    <div className="space-y-8 relative z-10 animate-fade-in text-left">
      
      {/* 1. SYSTEM ARCHITECTURE TECHNICAL VIEW (Image 6) */}
      <div className="p-8 rounded-[2.5rem] bg-[#0c0a1a] border border-neutral-900 shadow-2xl relative text-center">
        
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="font-mono text-[9px] text-[#ff5a00] block tracking-widest uppercase font-black">// ARCHITECTURE TECHNIQUE INTERACTIVE //</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            SYSTEM ARCHITECTURE TECHNICAL VIEW
          </h2>
          <p className="text-stone-500 text-xs">
            FixLab - Technical System Architecture and Real-Time Flows. Click on circles to trigger simulation.
          </p>
        </div>

        {/* The Interconnected Neon Circles Diagram in Full HTML/Tailwind/SVG */}
        <div className="relative w-full max-w-3xl mx-auto py-6">
          {/* Circuit background traces drawing */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 700 200">
              {/* Complex trace paths */}
              <path d="M 50 100 L 650 100 M 150 50 L 550 50 M 150 150 L 550 150" stroke="#ff5a00" strokeWidth="1" strokeDasharray="5,5" />
              <path d="M 120 100 L 150 50 L 250 50" stroke="#ff5a00" strokeWidth="1" />
              <path d="M 450 150 L 550 150 L 580 100" stroke="#ff5a00" strokeWidth="1" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
            
            {/* Circle 1: AGENT */}
            <div 
              onClick={() => {
                setActiveSchemaFlow("agent");
                showToast("Simulated Local Agent calibrated.");
              }}
              className={`p-6 rounded-full w-48 h-48 mx-auto flex flex-col items-center justify-center border-3 transition-all duration-300 cursor-pointer ${
                activeSchemaFlow === "agent" 
                  ? "border-[#ff5a00] bg-[#ff5a00]/10 shadow-[0_0_25px_rgba(255,90,0,0.3)] scale-105" 
                  : "border-neutral-800 bg-neutral-950/80 hover:border-[#ff5a00]/50"
              }`}
            >
              <Cpu className={`w-8 h-8 mb-2 ${activeSchemaFlow === "agent" ? "text-[#ff5a00] animate-spin" : "text-zinc-500"}`} />
              <h4 className="text-base font-black text-white font-sans uppercase tracking-tight">Agent</h4>
              <div className="text-[10px] text-stone-500 font-mono uppercase mt-1 space-y-0.5 leading-none">
                <div>Local Processing</div>
                <div>Data Encryption</div>
                <div>Secure Trans</div>
              </div>
            </div>

            {/* Circle 2: SERVER */}
            <div 
              onClick={() => {
                setActiveSchemaFlow("server");
                showToast("Secure server repository requested.");
              }}
              className={`p-6 rounded-full w-48 h-48 mx-auto flex flex-col items-center justify-center border-3 transition-all duration-300 cursor-pointer ${
                activeSchemaFlow === "server" 
                  ? "border-[#ff5a00] bg-[#ff5a00]/10 shadow-[0_0_25px_rgba(255,90,0,0.3)] scale-105" 
                  : "border-neutral-800 bg-neutral-950/80 hover:border-[#ff5a00]/50"
              }`}
            >
              <Server className="w-8 h-8 text-zinc-500 mb-2" />
              <h4 className="text-base font-black text-white font-sans uppercase tracking-tight">Server</h4>
              <div className="text-[10px] text-stone-500 font-mono uppercase mt-1 space-y-0.5 leading-none">
                <div>Secure Storage</div>
                <div>AI/ML Engine</div>
                <div>Access Control</div>
              </div>
            </div>

            {/* Circle 3: DASHBOARD */}
            <div 
              onClick={() => {
                setActiveSchemaFlow("dashboard");
                showToast("Alert control interface connected.");
              }}
              className={`p-6 rounded-full w-48 h-48 mx-auto flex flex-col items-center justify-center border-3 transition-all duration-300 cursor-pointer ${
                activeSchemaFlow === "dashboard" 
                  ? "border-[#ff5a00] bg-[#ff5a00]/10 shadow-[0_0_25px_rgba(255,90,0,0.3)] scale-105" 
                  : "border-neutral-800 bg-neutral-950/80 hover:border-[#ff5a00]/50"
              }`}
            >
              <BarChart3 className="w-8 h-8 text-zinc-500 mb-2" />
              <h4 className="text-base font-black text-white font-sans uppercase tracking-tight">Dashboard</h4>
              <div className="text-[10px] text-stone-500 font-mono uppercase mt-1 space-y-0.5 leading-none">
                <div>Real-time Mon</div>
                <div>Analytics & Rep</div>
                <div>Alert System</div>
              </div>
            </div>

          </div>

          {/* Symmetrical arrows connecting circles showing simulation progress */}
          <div className="hidden md:flex justify-around absolute top-[110px] inset-x-8 pointer-events-none z-0">
            {/* Arrow 1 (Agent -> Server) */}
            <div className="w-1/3 flex justify-center">
              <div className="relative w-full h-1 bg-neutral-800 flex items-center">
                <div className={`absolute left-0 h-1 bg-[#ff5a00] transition-all duration-1000 ${
                  activeSchemaFlow === "agent" ? "w-full animate-pulse" : "w-0"
                }`} />
                <div className="absolute right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff5a00] rotate-45" />
              </div>
            </div>
            {/* Arrow 2 (Server -> Dashboard) */}
            <div className="w-1/3 flex justify-center">
              <div className="relative w-full h-1 bg-neutral-800 flex items-center">
                <div className={`absolute left-0 h-1 bg-[#ff5a00] transition-all duration-1000 ${
                  activeSchemaFlow === "server" ? "w-full animate-pulse" : "w-0"
                }`} />
                <div className="absolute right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff5a00] rotate-45" />
              </div>
            </div>
          </div>

        </div>

        {/* Output explanation for dynamic schema selection */}
        <div className="mt-4 p-4 bg-black/60 rounded-2xl border border-neutral-900 inline-block font-mono text-[10.5px] max-w-lg mx-auto text-stone-400">
          {activeSchemaFlow === "none" && "💡 CLICK ON AN ARCHITECTURE COMPONENT TO SHAPE THE SIGNAL PATH."}
          {activeSchemaFlow === "agent" && "⚡ AGENT EMITS: Local microchips inject QKD signatures before transmitting encrypted reports."}
          {activeSchemaFlow === "server" && "🔐 SERVER ROUTING: The pool federates multi-point validation, stores history, and deploys predictive inference."}
          {activeSchemaFlow === "dashboard" && "📊 DASHBOARD READOUTS: The core displays fleet health status and triggers instantaneous countermeasures."}
        </div>
      </div>

      {/* 2. SOLUTIONS & FEATURES OVERVIEW CATALOG (Image 8) */}
      <div className="space-y-6 pt-4">
        
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold uppercase text-white font-sans tracking-tight">
            SOLUTIONS & FEATURES OVERVIEW
          </h3>
          <p className="text-xs text-stone-500">
            Explore the technical benefits of our device management and security platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Real-time Monitoring */}
          <div className="p-6 rounded-[2rem] bg-[#0c0a1a]/60 border border-neutral-900/60 hover:bg-neutral-950/80 hover:border-[#ff5a00]/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#ff5a00]/10 border border-[#ff5a00]/20 flex items-center justify-center text-[#ff5a00] mb-4">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-sans">Real-Time Monitoring</h4>
            <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
              Gain instant visibility into device performance, status, and telemetry across your global fleet. Proactively detect anomalies and ensure optimal uptime with sub-second data refresh rates.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-900/65">
              <span className="text-[9px] font-mono text-[#ff5a00] block uppercase font-bold">Key Benefits:</span>
              <p className="text-[9.5px] text-stone-400 mt-1">Live Fleet Telemetry, Health Checks, Instant Alerts.</p>
            </div>
          </div>

          {/* Card 2: Secure Device Identity */}
          <div className="p-6 rounded-[2rem] bg-[#0c0a1a]/60 border border-neutral-900/60 hover:bg-neutral-950/80 hover:border-[#ff5a00]/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#e1005a]/10 border border-[#e1005a]/20 flex items-center justify-center text-[#e1005a] mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-sans">Secure Device Identity</h4>
            <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
              Establish trust with cryptographically verifiable device identities using advanced PKI and zero-trust principles. Prevent unauthorized access and spoofing at the edge.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-900/65">
              <span className="text-[9px] font-mono text-[#e1005a] block uppercase font-bold">Key Benefits:</span>
              <p className="text-[9.5px] text-stone-400 mt-1">Certificate Management, Zero Trust, Tamper-Proof.</p>
            </div>
          </div>

          {/* Card 3: Advanced Analytics & AI */}
          <div className="p-6 rounded-[2rem] bg-[#0c0a1a]/60 border border-neutral-900/60 hover:bg-neutral-950/80 hover:border-[#ff5a00]/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-sans">Advanced Analytics & AI</h4>
            <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
              Leverage machine learning models to predict failures, optimize resource allocation, and uncover hidden patterns in device data for strategic decision-making. (Fédéré par Gemini)
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-900/65">
              <span className="text-[9px] font-mono text-purple-400 block uppercase font-bold">Key Benefits:</span>
              <p className="text-[9.5px] text-stone-400 mt-1">Predictive Maintenance, Resource Optimization, Anomalies.</p>
            </div>
          </div>

          {/* Card 4: Global Compliance */}
          <div className="p-6 rounded-[2rem] bg-[#0c0a1a]/60 border border-neutral-900/60 hover:bg-neutral-950/80 hover:border-[#ff5a00]/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#00ffff]/10 border border-[#00ffff]/20 flex items-center justify-center text-[#00ffff] mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-sans">Global Compliance</h4>
            <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
              Ensure adherence to regional data privacy regulations (GDPR, CCPA) and industry standards with built-in compliance tools, automated reporting, and comprehensive auditing.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-900/65">
              <span className="text-[9px] font-mono text-[#00ffff] block uppercase font-bold">Key Benefits:</span>
              <p className="text-[9.5px] text-stone-400 mt-1">Data Sovereignty, Automated Auditing, Reports.</p>
            </div>
          </div>

        </div>

        {/* Feature Bottom CTA Card from Image 8 */}
        <div className="p-8 rounded-[2rem] bg-[#070513]/40 border border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6 mt-6">
          <div className="text-left space-y-1.5">
            <h4 className="text-sm font-sans font-black text-[#ff5a00] uppercase tracking-wider">
              READY TO SECURE AND OPTIMIZE YOUR DEVICE FLEET?
            </h4>
            <p className="text-stone-400 text-xs mt-1">
              Start your journey with FixLab today.
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate("client");
              showToast("Viewing subscription matrix.");
            }}
            className="shrink-0 bg-gradient-to-r from-[#ff7e00] to-[#ff5a00] hover:from-[#ff8c16] hover:to-[#ff6107] text-white font-mono text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg hover:shadow-[0_4px_25px_rgba(255,90,0,0.3)] transition-all cursor-pointer flex items-center gap-2 group"
          >
            EXPLORE ALL SOLUTIONS
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* 3. ADVANCED LABS COLLAPSIBLE DRAWER PANEL (Original AI Concept, QKD Key & Biometrics UI) */}
      <div className="pt-6 border-t border-neutral-900">
        <button
          onClick={() => {
            setShowSandbox(!showSandbox);
            showToast(showSandbox ? "Sandbox closed." : "Advanced simulation console connected.");
          }}
          className="w-full font-mono text-[10px] font-black uppercase tracking-widest text-[#ff5a00] bg-neutral-900/30 border border-[#ff5a00]/20 hover:bg-neutral-900/50 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
        >
          {showSandbox ? "[-] HIDE ADVANCED LAB CONSOLE" : "[+] OPEN ADVANCED LAB CONSOLE (AI CONCEPT, QUANTUM FORGE & BIOMETRICS)"}
        </button>

        {showSandbox && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch pt-6 animate-fade-in">
            
            {/* COLUMN 1: INTENSITE NEURONALE (AI ASSISTANT GENERATION) */}
            <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/80 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono text-[#ff5a00] font-extrabold uppercase tracking-wider block mb-2">[ AI MATERIAL ANALYSIS ]</span>
                <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#ff5a00]" /> NEURONAL INTENSITY (GEMINI)
                </h3>
                <p className="text-stone-500 text-[11px] mt-2 leading-relaxed">
                  Consult our Gemini generative intelligence engine to synthesize a structural report or custom material recommendations.
                </p>

                <div className="mt-4 space-y-3">
                  <div className="text-left">
                    <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">Formal structural guide / Architectural style</label>
                    <textarea
                      placeholder="E.g. brutalist translucent concrete dome with passive thermal insulation..."
                      rows={3}
                      value={aiPromptInput}
                      onChange={(e) => setAiPromptInput(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-[#ff5a00]/50"
                    />
                  </div>

                  <button
                    onClick={handleAIGeneration}
                    disabled={isAiLoading}
                    className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-[#ff5a00] text-white py-3 rounded-xl hover:bg-[#ff7e00] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> SYNTHESIZING...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> GENERATE CONCEPT WITH GEMINI
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generative schematic AI output panel */}
              {aiResponseText && (
                <div className="mt-4 bg-black border border-neutral-900 rounded-2xl p-4 text-left">
                  <div className="flex justify-between items-center border-b border-rose-950/20 pb-2 mb-2">
                    <span className="text-[8px] font-mono text-[#ff8c00] uppercase">GENERATED SOVEREIGN REPORT</span>
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[10px] font-mono leading-relaxed text-slate-300 whitespace-pre-line">
                    {aiResponseText}
                  </p>
                </div>
              )}
            </div>

            {/* COLUMN 2: CHIFFREMENT QUANTIQUE */}
            <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/80 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono text-purple-400 font-extrabold uppercase tracking-wider block mb-2">[ CHANNEL SECUREGUARD ]</span>
                <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-400" /> QKD QUANTUM FORGE
                </h3>
                <p className="text-stone-500 text-[11px] mt-2 leading-relaxed">
                  Generate cryptocrystalline cryptosignature tokens on the frame to reinforce spatial readings exchanges.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="relative h-24 w-full bg-[#08090b] rounded-2xl border border-neutral-900 flex flex-col justify-center items-center overflow-hidden">
                    <span className="text-[8px] font-mono text-purple-400 block tracking-widest uppercase">SUPERPOSITION ACTOR_CORE</span>
                    <span className="text-sm font-mono font-black text-white tracking-widest mt-1 block animate-pulse">
                      {quantumToken}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    The cryptographic link leverages atomic orbitography inequalities to invalidate passive interception on the satellite link.
                  </p>
                </div>
              </div>

              <button
                onClick={handleQuantumKeyRegen}
                disabled={isGeneratingKey}
                className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-purple-900/15 text-purple-300 border border-purple-500/20 py-3 rounded-xl hover:bg-purple-950/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isGeneratingKey ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> ORBITAL ALIGNMENT...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-3.5 h-3.5" /> FORGE QUANTUM SIGNATURE
                  </>
                )}
              </button>
            </div>

            {/* COLUMN 3: BIOMETRIC SIMULATION CONTROL */}
            <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/80 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold uppercase tracking-wider block mb-2">[ BIO-CELLULAR INTEGRATION ]</span>
                <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> BIOMETRIC THRESHOLD
                </h3>
                <p className="text-stone-500 text-[11px] mt-2 leading-relaxed">
                  Monitor biological and cellular indices of physical anchor integration on the residential dome.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-1">
                      <span>CONDUIT SECURITY THRESHOLD</span>
                      <span className="font-bold text-emerald-400">{biometricThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={biometricThreshold}
                      onChange={(e) => {
                        setBiometricThreshold(Number(e.target.value));
                        if(Number(e.target.value) < 70) {
                          showToast("Alert: Critical biometric link index under the domes.");
                        }
                      }}
                      className="w-full accent-[#ff5a00] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="p-3 bg-black/50 rounded-xl border border-neutral-900 flex justify-between items-center">
                      <span className="text-[9px] font-mono text-stone-400">RESIDENTIAL O2 SENSOR 01</span>
                      <span className="text-[9px] font-mono text-emerald-500 font-bold">NOMINAL ({biometricThreshold}%)</span>
                    </div>
                    <div className="p-3 bg-black/50 rounded-xl border border-neutral-900 flex justify-between items-center">
                      <span className="text-[9px] font-mono text-stone-400">BIO_LAB CO2 SENSOR</span>
                      <span className="text-[9px] font-mono text-cyan-400 font-bold">NOMINAL (100%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 p-3 rounded-xl border border-neutral-900 mt-6 text-center">
                <span className="text-[8px] font-mono text-[#00ffff] block uppercase font-bold">NOMINAL QUANTUM SYSTEMS</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

