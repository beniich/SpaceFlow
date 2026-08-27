import React, { useState } from 'react';
import { Recycle, AlertOctagon, CheckCircle2, Play, Activity, Layers, Zap, Sliders, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WasteManagement() {
  const [selectedHub, setSelectedHub] = useState('Sorting Hub');
  const [simulationRunning, setSimulationRunning] = useState(false);

  const handleSimulate = () => {
    setSimulationRunning(true);
    toast.loading("Calcul de la simulation du flux futur en cours...", { id: 'sim' });
    setTimeout(() => {
      setSimulationRunning(false);
      toast.success("Simulation terminée : Taux de recyclage optimisé à 97.2% (+2.7%)", { id: 'sim' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b10] text-foreground p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00dbe7]/20 border border-[#00dbe7]/40 flex items-center justify-center text-[#00dbe7]">
            <Recycle className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              BeeCarbonat <span className="text-muted-foreground font-normal">Waste - Circular Flow</span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Gestion circulaire des déchets & valorisation énergétique des matières
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> OPERATOR 34B ACTIVE
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Mini Sidebar Controls */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-[#00dbe7] border-b border-border pb-2">
            Facility Overview
          </div>

          <div className="space-y-1 text-xs font-mono">
            {['Facility Overview', 'Flow Controls', 'Sensor Network', 'Energy Monitor', 'Alerts', 'Live Feed'].map((item) => (
              <button
                key={item}
                className="w-full text-left px-3 py-2 rounded-lg text-muted hover:bg-surface-alt/80 hover:text-foreground transition flex items-center justify-between"
              >
                <span>{item}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={handleSimulate}
              disabled={simulationRunning}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f38020] to-orange-600 hover:opacity-90 text-xs font-bold text-foreground transition font-mono flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Play className="w-4 h-4 fill-white" />
              {simulationRunning ? 'Calcul en cours...' : 'Simulate Future Flow'}
            </button>
          </div>
        </div>

        {/* Central Isometric 3D Sorting Conveyor Network */}
        <div className="lg:col-span-6 relative min-h-[440px] rounded-2xl bg-background border border-border p-6 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,219,231,0.1)_0,transparent_70%)] pointer-events-none" />

          {/* Conveyor Grid SVG Graphic */}
          <div className="relative w-full h-72 flex items-center justify-center">
            <svg viewBox="0 0 600 400" className="w-full h-full drop-shadow-[0_0_30px_rgba(0,219,231,0.3)]">
              {/* Isometric Conveyor Belts (Cyan) */}
              <path d="M100 200 L250 120 L400 200 L250 280 Z" stroke="#00dbe7" strokeWidth="2" fill="rgba(0,219,231,0.05)" />
              <path d="M250 280 L400 350" stroke="#00dbe7" strokeWidth="6" strokeLinecap="round" />
              <path d="M400 200 L500 150" stroke="#00dbe7" strokeWidth="6" strokeLinecap="round" />
              <path d="M100 200 L50 250" stroke="#00dbe7" strokeWidth="6" strokeLinecap="round" />

              {/* Sorting Nodes */}
              <g className="cursor-pointer" onClick={() => setSelectedHub('Collection')}>
                <rect x="80" y="180" width="40" height="40" rx="8" fill="#1e293b" stroke="#00dbe7" strokeWidth="2" />
                <text x="100" y="205" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Collection</text>
              </g>

              <g className="cursor-pointer" onClick={() => setSelectedHub('Sorting Hub')}>
                <rect x="230" y="100" width="50" height="40" rx="8" fill="#1e293b" stroke="#f38020" strokeWidth="2" />
                <text x="255" y="125" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Sorting</text>
              </g>

              <g className="cursor-pointer" onClick={() => setSelectedHub('Plastics Refinery')}>
                <rect x="380" y="180" width="50" height="40" rx="8" fill="#1e293b" stroke="#00dbe7" strokeWidth="2" />
                <text x="405" y="205" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Plastics</text>
              </g>

              <g className="cursor-pointer" onClick={() => setSelectedHub('Organics Processor')}>
                <rect x="380" y="330" width="50" height="40" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                <text x="405" y="355" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Organics</text>
              </g>
            </svg>

            <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground bg-surface/80 px-3 py-1 rounded-lg border border-border">
              Station sélectionnée: <span className="text-[#00dbe7] font-bold">{selectedHub}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Efficiency Stats & High Priority Maintenance */}
        <div className="lg:col-span-3 space-y-4">
          {/* Efficiency Stats */}
          <div className="p-5 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl space-y-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">EFFICIENCY STATS</span>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-muted">
                  <span>Material Recovery Rate:</span>
                  <span className="text-emerald-400 font-bold">94.5% (↑1.2%)</span>
                </div>
                <div className="w-full bg-surface-alt h-1.5 rounded-full mt-1">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '94.5%' }} />
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-muted">
                  <span>Carbon Offset:</span>
                  <span className="text-[#00dbe7] font-bold">1,240 Tons/M</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-muted">
                  <span>Self-Sufficiency:</span>
                  <span className="text-[#f38020] font-bold">88%</span>
                </div>
              </div>
            </div>
          </div>

          {/* High-Priority Maintenance */}
          <div className="p-5 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl space-y-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> HIGH-PRIORITY MAINTENANCE
            </span>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
                <div className="font-bold flex justify-between">
                  <span>Plastic Sorter 3A</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">Critical</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Conveyor Belt Jam</div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <div className="font-bold flex justify-between">
                  <span>Bio-Digester 2B</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Warning</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Temp Fluctuation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
