import React from 'react';
import { Leaf, Award, Users, Bus, Sparkles, TrendingUp, Download, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImpactReport() {
  return (
    <div className="min-h-screen bg-[#070b10] text-foreground p-4 sm:p-6 lg:p-12 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[radial-gradient(circle_at_center,rgba(0,219,231,0.15)_0,transparent_70%)] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00dbe7] uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" /> Environmental Impact Report
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            BeeCarbonat <span className="text-[#f38020]">Sustainability Ledger</span>
          </h1>
        </div>

        <button
          onClick={() => toast.success("Téléchargement du rapport d'impact ESG complet (PDF)")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f38020] to-orange-600 hover:opacity-90 text-xs font-bold text-foreground transition flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Download className="w-4 h-4" /> Exporter Rapport ESG (PDF)
        </button>
      </div>

      {/* Hero Impact Stat */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4 relative z-10">
        <div className="text-5xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00dbe7] via-cyan-300 to-[#00dbe7] drop-shadow-[0_0_35px_rgba(0,219,231,0.5)]">
          4,200+
        </div>
        <div className="text-lg sm:text-xl font-bold tracking-wide text-slate-200 uppercase font-mono">
          Metric Tons CO2e Reduced
        </div>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Calculé en temps réel via le réseau de capteurs IoT BeeCarbonat & la télémétrie énergétique certifiée.
        </p>
      </div>

      {/* Environmental Metrics Grid */}
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#00dbe7] mb-6 flex items-center gap-2">
            <Leaf className="w-4 h-4" /> ENVIRONMENTAL METRICS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1: CO2 Reduction Goal */}
            <div className="p-6 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl text-center space-y-3">
              <span className="text-xs font-mono text-muted-foreground uppercase">CO2 REDUCTION GOAL</span>
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="44" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                  <circle cx="56" cy="56" r="44" stroke="#00dbe7" strokeWidth="8" fill="transparent" strokeDasharray="280" strokeDashoffset="42" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-foreground font-mono">85%</span>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-center">
                    <ArrowUpRight className="w-3 h-3" /> +12%
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono">Objectif 2026 en passe d'être atteint</p>
            </div>

            {/* Metric 2: Total Carbon Offset */}
            <div className="p-6 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl text-center space-y-3">
              <span className="text-xs font-mono text-muted-foreground uppercase">TOTAL CARBON OFFSET</span>
              <div className="text-3xl font-black text-[#00dbe7] font-mono my-4">
                1,500+ <span className="text-xs text-muted-foreground font-normal">TONNES</span>
              </div>
              <p className="text-xs text-emerald-400 font-mono bg-emerald-500/10 py-1.5 px-3 rounded-lg border border-emerald-500/20">
                Équivalent à 30 000 arbres plantés
              </p>
            </div>

            {/* Metric 3: Energy Efficiency Score */}
            <div className="p-6 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl text-center space-y-3">
              <span className="text-xs font-mono text-muted-foreground uppercase">ENERGY EFFICIENCY SCORE</span>
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="44" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                  <circle cx="56" cy="56" r="44" stroke="#f38020" strokeWidth="8" fill="transparent" strokeDasharray="280" strokeDashoffset="25" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-[#f38020] font-mono">A+</span>
                  <div className="text-[10px] text-muted font-mono">92%</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono">Building consumption optimized</p>
            </div>
          </div>
        </div>

        {/* Community Engagement & Sustainability */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#f38020] mb-6 flex items-center gap-2">
            <Users className="w-4 h-4" /> COMMUNITY ENGAGEMENT & SUSTAINABILITY
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Residents Trained */}
            <div className="p-6 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl flex items-center justify-between gap-6">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Leaf className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <div className="text-3xl font-black text-foreground font-mono">600+</div>
                <div className="text-sm font-semibold text-muted mt-1">Local Residents Trained</div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">Sensibilisation à l'éco-gestion & à l'agriculture urbaine</p>
              </div>
            </div>

            {/* Card 2: Zero Emission Trips */}
            <div className="p-6 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl flex items-center justify-between gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#00dbe7]/10 border border-[#00dbe7]/30 flex items-center justify-center shrink-0">
                <Bus className="w-10 h-10 text-[#00dbe7]" />
              </div>
              <div>
                <div className="text-3xl font-black text-foreground font-mono">2,000+</div>
                <div className="text-sm font-semibold text-muted mt-1">Zero-Emission Trips</div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">Trajets en navettes autonomes électriques sur site</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Flame Glow */}
      <div className="mt-20 border-t border-border pt-8 text-center text-xs font-mono text-muted-foreground">
        © 2026 BeeCarbonat. All rights reserved. Carbon-Neutral Infrastructure Protocol.
      </div>
    </div>
  );
}
