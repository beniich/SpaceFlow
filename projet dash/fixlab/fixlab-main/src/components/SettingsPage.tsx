import React, { useState, useEffect } from "react";
import { Cpu, Activity, Zap, Shield, Database, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SovereignSettings } from "../types";
import { GlassCard, NeonButton } from "./GlassUI";

interface SettingsPageProps {
  onApplySettings?: (settings: SovereignSettings) => Promise<void>;
  initialSettings?: SovereignSettings;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  onApplySettings,
  initialSettings = {
    coreIdentity: 45,
    cognitiveLoad: 60,
    hapticResonance: 30,
    energyProfile: 75,
    dataSynthesis: "Low-Latency"
  }
}) => {
  const [settings, setSettings] = useState<SovereignSettings>(initialSettings);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [applying, setApplying] = useState<boolean>(false);

  // Sync state if initialSettings changes
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleSliderChange = (key: keyof SovereignSettings, val: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSelectChange = (val: string) => {
    setSettings(prev => ({
      ...prev,
      dataSynthesis: val
    }));
  };

  const handleApply = async (variant: "primary" | "gold") => {
    setApplying(true);
    setSuccessMessage(null);
    try {
      if (onApplySettings) {
        await onApplySettings(settings);
      }
      setTimeout(() => {
        setApplying(false);
        setSuccessMessage(`Core parameters recalibrated successfully as: ${variant.toUpperCase()}_PROFILE`);
        setTimeout(() => setSuccessMessage(null), 4000);
      }, 7000);
    } catch (err) {
      setApplying(false);
    }
  };

  const options = [
    { 
      key: "coreIdentity" as keyof SovereignSettings, 
      title: "Core Identity Tuning", 
      desc: "Identify your neore identity, as snames, relizemes and neural signatures", 
      icon: Cpu,
      lowText: "Stable",
      highText: "Enhanced"
    },
    { 
      key: "cognitiveLoad" as keyof SovereignSettings, 
      title: "Cognitive Load Management", 
      desc: "Manage cognitive load limits, visual latency offsets, and response comfort", 
      icon: Activity,
      lowText: "Standard",
      highText: "Overclocked"
    },
    { 
      key: "hapticResonance" as keyof SovereignSettings, 
      title: "Haptic Resonance Filters", 
      desc: "Manage timeline micro-intervals, sound cascades, and somatic feedback loops", 
      icon: Zap,
      lowText: "Dampened",
      highText: "Resonant"
    },
    { 
      key: "energyProfile" as keyof SovereignSettings, 
      title: "Energy Radiation Profile", 
      desc: "Shield energy profiles, manage thermal signatures and reserve airgap link margins", 
      icon: Shield,
      lowText: "Eco",
      highText: "Maximum Charge"
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full text-white font-mono text-xs select-none">
      
      {/* LEFT COLUMN: 5 parameters rows */}
      <div className="flex-1 space-y-4">
        
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-light text-zinc-100 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span>System Essence Configuration</span>
            </h1>
            <p className="text-[10px] text-zinc-550 mt-1 uppercase font-bold tracking-wider">
              Recalibrate bio-electrical, energetic and computing nexus core values
            </p>
          </div>
        </div>

        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-emerald-950/25 border border-emerald-500/25 rounded-xl flex items-center gap-2.5 text-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 animate-bounce" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {options.map((item) => {
          const Icon = item.icon;
          const currentVal = settings[item.key] as number;
          return (
            <GlassCard key={item.key} className="p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all duration-300">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 w-fit shrink-0">
                <Icon className="text-cyan-400 animate-pulse" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-zinc-100 uppercase tracking-wider">{item.title}</h3>
                <p className="text-[10px] text-zinc-550 leading-relaxed mt-0.5">{item.desc}</p>
              </div>

              {/* SLIDER CONTROLLER */}
              <div className="flex items-center gap-3 w-full md:w-56 shrink-0 pt-2 md:pt-0">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight w-12 text-right">{item.lowText}</span>
                <input 
                  type="range" 
                  min="0"
                  max="100"
                  value={currentVal}
                  onChange={(e) => handleSliderChange(item.key, Number(e.target.value))}
                  className="flex-1 h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none border border-zinc-900 focus:border-cyan-500/40" 
                />
                <span className="text-[9px] text-zinc-400 font-black w-10 text-left bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">
                  {currentVal}%
                </span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight w-16 text-left truncate">{item.highText}</span>
              </div>
            </GlassCard>
          );
        })}

        {/* 5th Parameter: Data Synthesis Dropdown Type */}
        <GlassCard className="p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 w-fit shrink-0">
            <Database className="text-cyan-400 animate-pulse" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-100 uppercase tracking-wider">Quantum Data Synthesis Engine</h3>
            <p className="text-[10px] text-zinc-550 leading-relaxed mt-0.5">
              Select dynamic aggregation and synchronization resolution for device telemetry mapping streams
            </p>
          </div>
          <div className="shrink-0 w-full md:w-56">
            <select 
              value={settings.dataSynthesis}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="w-full bg-zinc-950 border border-cyan-500/10 hover:border-cyan-500/30 text-cyan-300 font-mono text-[10px] rounded-lg px-3 py-2.5 outline-none tracking-wider uppercase font-bold focus:border-cyan-500"
            >
              <option value="Low-Latency">Low-Latency Fast Sync</option>
              <option value="Ultra-Resolution">Ultra-Resolution Matrix</option>
              <option value="Stealth-Airgapped">Stealth Airgapped Queue</option>
              <option value="ML-Heuristic">ML Heuristic Aggregation</option>
            </select>
          </div>
        </GlassCard>

      </div>

      {/* RIGHT COLUMN: Overview & Apply Controls */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        
        {/* Status Dashboard Component */}
        <GlassCard className="p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Overview & Status
            </h2>
            <p className="text-[9px] text-zinc-550 font-bold tracking-tight uppercase">Real-time parameters snapshot</p>
          </div>

          <div className="space-y-3.5 pt-2 text-zinc-300 border-t border-zinc-950">
            <div className="flex justify-between items-center bg-zinc-950/20 p-2.5 rounded-lg border border-zinc-900/60">
              <span className="text-zinc-450 uppercase font-bold text-[9px]">Identity Level:</span> 
              <span className="text-cyan-300 font-extrabold">{settings.coreIdentity}%</span>
            </div>
            
            <div className="flex justify-between items-center bg-zinc-950/20 p-2.5 rounded-lg border border-zinc-900/60">
              <span className="text-zinc-450 uppercase font-bold text-[9px]">Cognitive Buffer:</span> 
              <span className="text-cyan-300 font-extrabold">{settings.cognitiveLoad}%</span>
            </div>
            
            <div className="flex justify-between items-center bg-zinc-950/20 p-2.5 rounded-lg border border-zinc-900/60">
              <span className="text-zinc-450 uppercase font-bold text-[9px]">Resonator Phase:</span> 
              <span className="text-cyan-300 font-extrabold">{settings.hapticResonance} Hz</span>
            </div>

            <div className="flex justify-between items-center bg-zinc-950/20 p-2.5 rounded-lg border border-zinc-900/60">
              <span className="text-zinc-450 uppercase font-bold text-[9px]">Energy Matrix:</span> 
              <span className="text-cyan-300 font-extrabold">{settings.energyProfile}% load</span>
            </div>

            <div className="flex justify-between items-center bg-zinc-950/20 p-2.5 rounded-lg border border-zinc-900/60">
              <span className="text-zinc-450 uppercase font-bold text-[9px]">Telemetry Mode:</span> 
              <span className="text-cyan-400 font-black uppercase tracking-wider">{settings.dataSynthesis}</span>
            </div>
          </div>

          <div className="pt-2">
            <NeonButton 
              onClick={() => handleApply("primary")}
              disabled={applying}
              className="w-full h-11"
              variant="primary"
            >
              {applying ? "Recalibrating..." : "Apply Essence Configuration"}
            </NeonButton>
          </div>
        </GlassCard>

        {/* Emergency Gold/Yellow Calibration Overclock Trigger */}
        <GlassCard className="p-5 space-y-3.5 border-yellow-500/10">
          <div className="space-y-1">
            <h3 className="font-black text-yellow-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              EMERGENCY NEURAL OVERDRIVE
            </h3>
            <p className="text-[9px] text-zinc-550 leading-relaxed font-bold">
              Instantly enforce safe haptic overdrive settings on all operational modules.
            </p>
          </div>
          
          <NeonButton 
            disabled={applying}
            onClick={() => {
              setSettings(prev => ({
                ...prev,
                cognitiveLoad: 95,
                hapticResonance: 85,
                energyProfile: 100
              }));
              handleApply("gold");
            }}
            variant="gold" 
            className="w-full h-11"
          >
            {applying ? "PROG_SYNCING..." : "ACTIVATE OVERDRIVE ZONE"}
          </NeonButton>
        </GlassCard>

      </div>

    </div>
  );
};
