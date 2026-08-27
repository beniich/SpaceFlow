import React, { useState } from 'react';
import { Droplet, AlertTriangle, ShieldCheck, Gauge, Wrench, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WaterHydroSync() {
  const [selectedSector, setSelectedSector] = useState('Sector 4');
  const [leakAlert, setLeakAlert] = useState(true);

  return (
    <div className="min-h-screen bg-surface text-foreground p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00dbe7]/20 border border-[#00dbe7]/40 flex items-center justify-center text-[#00dbe7]">
            <Droplet className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              BeeCarbonat <span className="text-muted-foreground font-normal">Water - Hydro Sync</span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Surveillance télémétrique en temps réel des réseaux hydrauliques et détection de fuites
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[#00dbe7] text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00dbe7] animate-ping" /> LIVE TELEMETRY ACTIVE
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 3D Wireframe Pipeline Visualizer */}
        <div className="lg:col-span-8 relative min-h-[480px] rounded-2xl bg-background border border-border p-6 flex items-center justify-center overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Isometric Pipeline Wireframe SVG Graphic */}
          <div className="relative w-full max-w-xl aspect-video flex items-center justify-center">
            <svg viewBox="0 0 600 400" className="w-full h-full drop-shadow-[0_0_30px_rgba(0,219,231,0.4)]">
              {/* Wireframe City Grid Lines */}
              <path d="M50 350 L300 200 L550 350" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <path d="M100 300 L300 180 L500 300" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" fill="none" />

              {/* Glowing Water Pipes (Cyan Hydro Network) */}
              <path d="M50 100 L250 220 L350 160 L500 250" stroke="#00dbe7" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M250 220 L250 320 L400 380" stroke="#00dbe7" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Leak Alarm Points */}
              <g className="animate-pulse cursor-pointer" onClick={() => setSelectedSector('Sector 4')}>
                <polygon points="350,140 365,170 335,170" fill="#f38020" />
                <text x="350" y="165" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">!</text>
              </g>

              <g className="animate-pulse cursor-pointer" onClick={() => setSelectedSector('Sector 2')}>
                <polygon points="250,290 265,320 235,320" fill="#f38020" />
                <text x="250" y="315" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">!</text>
              </g>
            </svg>

            {/* Simulated Stats Banner Overlay */}
            <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground bg-surface/80 px-3 py-1.5 rounded-lg border border-border">
              FPS: 60 | Triangles: 2.4M | Shader: PBR-Thermal
            </div>
          </div>
        </div>

        {/* Right Column: Water System Inspector Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl space-y-5">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">PROPERTIES INSPECTOR</span>
                <h3 className="text-xl font-bold text-foreground mt-1 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-[#00dbe7]" />
                  Water System Inspector
                </h3>
              </div>
            </div>

            {/* Purification & Flow Circular Gauges */}
            <div className="grid grid-cols-2 gap-4">
              {/* Gauge 1: Purification Level */}
              <div className="p-4 rounded-xl bg-background border border-border text-center space-y-2">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                    <circle cx="40" cy="40" r="32" stroke="#10b981" strokeWidth="6" fill="transparent" strokeDasharray="200" strokeDashoffset="10" />
                  </svg>
                  <span className="absolute text-base font-extrabold text-foreground font-mono">98%</span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">Purification Level</div>
              </div>

              {/* Gauge 2: Flow Rate */}
              <div className="p-4 rounded-xl bg-background border border-border text-center space-y-2">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                    <circle cx="40" cy="40" r="32" stroke="#00dbe7" strokeWidth="6" fill="transparent" strokeDasharray="200" strokeDashoffset="40" />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-foreground font-mono">120 <span className="text-[9px]">L/s</span></span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">Flow Rate</div>
              </div>
            </div>

            {/* Alert Box */}
            {leakAlert && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>LEAK DETECTED: Sector 4</span>
                </div>
                <button
                  onClick={() => {
                    setLeakAlert(false);
                    toast.success("Alerte fuite acquittée.");
                  }}
                  className="text-[10px] text-muted underline hover:text-foreground"
                >
                  Acquitter
                </button>
              </div>
            )}

            {/* Pipe Dimensions & Specs */}
            <div className="space-y-2.5 text-xs font-mono text-muted border-t border-border pt-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">DIMENSIONS & SPECS</div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pipe Diameter:</span>
                <span className="text-foreground font-semibold">450 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pressure Rating:</span>
                <span className="text-[#00dbe7] font-semibold">10 bar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Material:</span>
                <span className="text-foreground font-semibold">Reinforced PVC</span>
              </div>
            </div>

            {/* Metadata & GUID */}
            <div className="space-y-2 text-xs font-mono border-t border-border pt-3">
              <div className="text-[10px] text-muted-foreground uppercase">METADATA</div>
              <div className="p-2 bg-background rounded border border-border text-[11px] text-muted">
                water-sys-89xy-99ab-16zz
              </div>
              <div className="flex justify-between text-muted-foreground text-[11px] pt-1">
                <span>Installation: Nov 12, 2023</span>
                <span>Cycle: Tous les 3 mois</span>
              </div>
            </div>

            <button
              onClick={() => toast.success("Ordre d'intervention hydraulique émis avec succès")}
              className="w-full py-2.5 rounded-xl bg-[#00dbe7] hover:bg-cyan-400 text-xs font-bold text-slate-950 transition tracking-wider uppercase font-mono shadow-lg shadow-cyan-500/20"
            >
              Create Work Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
