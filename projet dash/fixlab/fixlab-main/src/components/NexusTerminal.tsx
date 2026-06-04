import React, { useState } from "react";
import { Send, MapPin, Mail, Satellite, RefreshCw, Terminal as TermIcon, CheckSquare, Compass, Radio } from "lucide-react";

interface Transmission {
  id: string;
  vector: string;
  bytes: number;
  time: string;
}

interface TerminalProps {
  isLightMode: boolean;
  onNavigate: (tabId: string) => void;
  showToast: (msg: string) => void;
  // State from parent
  terminalText: string;
  setTerminalText: (val: string) => void;
  contactVector: string;
  setContactVector: (val: string) => void;
  transmissionProgress: number;
  handleInitiateTransmission: () => void;
  recentTransmissions: Transmission[];
}

export function NexusTerminal({
  isLightMode,
  onNavigate,
  showToast,
  terminalText,
  setTerminalText,
  contactVector,
  setContactVector,
  transmissionProgress,
  handleInitiateTransmission,
  recentTransmissions
}: TerminalProps) {
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [subjectTitle, setSubjectTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [cliCommand, setCliCommand] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress || !messageBody) {
      showToast("Veuillez remplir les champs obligatoires du formulaire.");
      return;
    }
    showToast(`Transmission de message établie pour Expert Team.`);
    // Reset contact fields
    setFullName("");
    setEmailAddress("");
    setSubjectTitle("");
    setMessageBody("");
  };

  const handleRunCliCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliCommand.trim()) return;

    if (cliCommand.toLowerCase() === "help") {
      setTerminalText("Sovereign Uplink v4.5 // Available commands: status, ping, route, clear.");
    } else if (cliCommand.toLowerCase() === "status") {
      setTerminalText("SYSTEM STATUS: OK // COMPLIANCE COUVERTURE 100% // ALL LINKS OPERATIVE.");
    } else if (cliCommand.toLowerCase() === "ping") {
      setTerminalText("PING SENSOR_CLUSTER... REPLY FROM SATELLITE_A5 IN 1.28ms // Jitter 0.05ms.");
    } else if (cliCommand.toLowerCase() === "clear") {
      setTerminalText("Uplink terminal cleared. Ready for instructions.");
    } else {
      setTerminalText(`Command '${cliCommand}' unrecognized. Type 'help' for suggestions.`);
    }
    setCliCommand("");
  };

  return (
    <div className="space-y-8 relative z-10 animate-fade-in text-left">
      
      {/* 1. TWO COLUMN LAYOUT: Contact Us Expert Section (Image 5) AND Uplink Satellite CLI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Contact Expert Team + Street Location Map */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          <div className="p-6 rounded-[2.2rem] bg-neutral-950/70 border border-neutral-900 flex-1 flex flex-col justify-between">
            <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
              <div>
                <span className="text-[8px] font-mono text-[#ff5a00] font-black uppercase block tracking-widest mb-1">[ EXPERT ENQUIRIES ]</span>
                <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#ff5a00]" /> Contact Our Expert Team
                </h3>
              </div>

              <div>
                <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#ff5a00] focus:ring-[rgba(255,90,0,0.15)] transition-all"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jean.dupont@secure.local"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#ff5a00] focus:ring-[rgba(255,90,0,0.15)] transition-all"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Inquiry or issue..."
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#ff5a00] focus:ring-[rgba(255,90,0,0.15)] transition-all"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">Message Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain your project scope or security vulnerabilities..."
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#ff5a00] focus:ring-[rgba(255,90,0,0.15)] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#ff7e00] to-[#ff5a00] text-white py-3.5 rounded-xl transition-all hover:bg-orange-600"
              >
                Talk to an Expert
              </button>
            </form>
          </div>

          {/* Interactive Geometric Street Location Map drawing from Image 5 */}
          <div className="p-5 rounded-[2rem] bg-neutral-950/70 border border-neutral-900 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#ff5a00] animate-bounce" />
              <div className="text-left font-mono text-[9px]">
                <span className="text-white block uppercase font-bold">Tech City Headquarters</span>
                <span className="text-zinc-500">Suite 1024, Grid Coordinate 45-Omega</span>
              </div>
            </div>

            {/* SVG Interactive Road Tracer Map with Neon locator pins */}
            <div className="relative rounded-2xl h-36 bg-[#0a0520] border border-neutral-900 overflow-hidden">
              <svg className="w-full h-full text-stone-500" viewBox="0 0 400 150" fill="none">
                <rect width="100%" height="100%" fill="#0a0515" />
                {/* Coordinate mesh roads */}
                <path d="M 0 35 H 400 M 0 85 H 400 M 0 120 H 400" stroke="rgba(255, 90, 0, 0.08)" strokeWidth="1.5" />
                <path d="M 60 0 V 150 M 180 0 V 150 M 290 0 V 150 M 350 0 V 150" stroke="rgba(255, 90, 0, 0.08)" strokeWidth="1.5" />
                <path d="M 10 10 L 390 140" stroke="rgba(255, 90, 0, 0.05)" strokeWidth="1" />
                
                {/* Active Neon pulse indicator locator pointer pin */}
                <g class="animate-pulse" transform="translate(180, 85)">
                  <circle r="12" fill="none" stroke="#ff5a00" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: "0 0" }} />
                  <circle r="6" fill="#ff5a00" />
                  <circle r="1.5" fill="white" />
                </g>
              </svg>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: HIGH TECH SATELLITE COMMAND TERMINAL AND TRANSMISSIONS HISTORY (Image 5 right + original functional terminal uplink) */}
        <div className="lg:col-span-7 p-6 rounded-[2.2rem] bg-[#0c0a1a]/80 border border-neutral-900 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex justify-between items-center border-b border-rose-950/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Satellite className="w-5 h-5 text-cyan-400 animate-spin-reverse" />
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  Satellite Uplink Controller
                </h3>
              </div>
              <span className="font-mono text-[8.5px] text-[#ff5a00] font-bold">[ SECURE UPLINK PORT_3000 ]</span>
            </div>

            <p className="text-stone-500 text-[11.5px] mb-4 text-left leading-relaxed">
              Consignez des commandes d'interrogation satellite direc sur la console. Modélisez les taux de rebonds et chargez les rapports de liaison matériel.
            </p>

            {/* Simulated interactive message dispatch logger */}
            <div className="bg-black/90 rounded-2xl p-4 min-h-[140px] border border-neutral-900 text-left font-mono text-[10.5px] leading-relaxed space-y-1 overflow-y-auto">
              <div className="text-zinc-650">// INKED LOG TERMINAL ACTIF //</div>
              <div className="text-cyan-400">LAST OPERATION RETRIEVAL: OK</div>
              <p className="text-emerald-400 font-bold whitespace-pre-wrap">{terminalText}</p>
            </div>

            {/* Form for custom instruction commands input */}
            <form onSubmit={handleRunCliCommand} className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Ex prime commands:help, status, ping, clear..."
                value={cliCommand}
                onChange={(e) => setCliCommand(e.target.value)}
                className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-[#ff5a00]/50"
              />
              <button
                type="submit"
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 p-3 rounded-xl transition-all cursor-pointer text-cyan-400"
              >
                <TermIcon className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Interactive Transmission trigger execution panel with progress indicator */}
          <div className="bg-[#090812] border border-neutral-900 p-5 rounded-2xl space-y-4">
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-white font-mono font-bold uppercase block">Vecteur d'Antenne Rebond</span>
                <span className="text-[8px] text-zinc-500 font-mono block">COMMUNICATIONS ORBITALES SOUVERAINES</span>
              </div>
              
              <select
                value={contactVector}
                onChange={(e) => setContactVector(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-cyan-400 focus:outline-none font-mono"
              >
                <option value="SATELLITE-ALFA">SATELLITE-ALFA-5X</option>
                <option value="ORB-WEST-2">ORBIT_COV_WEST2</option>
                <option value="DOMAINE-RESID">DOMAINE_RESID_COOP</option>
              </select>
            </div>

            {/* Dynamic loading progress bar from Image 5 uplink actions */}
            {transmissionProgress > 0 && (
              <div className="space-y-1.5 text-left animate-pulse">
                <div className="flex justify-between items-center text-[9.5px] font-mono text-cyan-400">
                  <span>EXPÉDITION DE PAQUETS EN COURS...</span>
                  <span className="font-bold">{transmissionProgress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-950 rounded-full border border-neutral-900 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff7e00] to-cyan-400 transition-all duration-300" style={{ width: `${transmissionProgress}%` }} />
                </div>
              </div>
            )}

            <button
              onClick={handleInitiateTransmission}
              disabled={transmissionProgress > 0}
              className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-cyan-950/25 text-cyan-300 border border-cyan-500/20 py-4 rounded-xl hover:bg-cyan-950/50 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> AMORCER ACCÈS INTÉGRATION SATELLITE
            </button>
          </div>

          {/* History ledger transmissions list underneath */}
          <div className="space-y-2 text-left">
            <span className="text-[8px] font-mono text-stone-500 tracking-wider block uppercase">HISTORIQUE COMPTABLE RÉCENT</span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {recentTransmissions.map((trans, i) => (
                <div key={i} className="p-3 bg-black/40 rounded-xl border border-neutral-900 flex justify-between items-center text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-stone-300 font-bold">{trans.id}</span>
                  </div>
                  <span className="text-zinc-500">{trans.vector}</span>
                  <span className="text-[#ff5a00] font-bold">{trans.bytes} Octets</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
