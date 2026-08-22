import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Wind, Flame, Sun, Activity, RefreshCw, 
  Layers, Download, Filter, Sparkles, CheckCircle2, 
  TrendingDown, Globe, Gauge, Shield, ArrowUpRight, BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, BarChart, Bar 
} from 'recharts';

const hourlyEmissions = [
  { time: '00:00', reel: 140, optimise: 95, delta: -45 },
  { time: '03:00', reel: 120, optimise: 80, delta: -40 },
  { time: '06:00', reel: 210, optimise: 130, delta: -80 },
  { time: '09:00', reel: 480, optimise: 280, delta: -200 },
  { time: '12:00', reel: 520, optimise: 260, delta: -260 },
  { time: '15:00', reel: 490, optimise: 270, delta: -220 },
  { time: '18:00', reel: 380, optimise: 210, delta: -170 },
  { time: '21:00', reel: 220, optimise: 140, delta: -80 },
];

export default function CarbonVisualizer() {
  const [solarCapacity, setSolarCapacity] = useState(2.4); // MWc
  const [heatPumpBoost, setHeatPumpBoost] = useState(75); // %
  const [aiHvacModulation, setAiHvacModulation] = useState(90); // %
  const [activeZone, setActiveZone] = useState('ALL');

  // Simulated dynamic calculations based on sliders
  const baseTons = 12450;
  const calculatedReduction = Math.round(baseTons + (solarCapacity * 420) + (heatPumpBoost * 18) + (aiHvacModulation * 24));
  const calculatedEfficiency = Math.min(99, Math.round(82 + (solarCapacity * 2) + (heatPumpBoost * 0.08) + (aiHvacModulation * 0.08)));

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10 font-sans relative overflow-hidden">
      {/* Background radial and grid effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-orange/20 via-black to-black" />
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex-grid" width="40" height="69.282" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
              <path d="M40 17.32l-20 11.547L0 17.32V-5.774l20-11.547L40-5.774V17.32zm0 46.188l-20 11.548-20-11.548V40.414L20 28.867l20 11.547v23.094z" fill="none" stroke="#f38020" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-grid)" />
        </svg>
      </div>

      {/* Header section */}
      <div className="relative z-10 max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>HIGH-PRECISION CARBON PULSE HUD</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Visualisation Haute-Fidélité de l'Empreinte Carbone
            </h1>
            <p className="text-zinc-400 mt-2 max-w-2xl text-sm lg:text-base">
              Cartographie dynamique des flux de gaz à effet de serre, simulateur prédictif et monitoring télémétrique en temps réel des Scopes 1, 2 et 3.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('Export du rapport GHG Protocol & CSRD en cours...')}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono uppercase text-zinc-300 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-brand-cyan" />
              Export Données CSRD
            </button>
            <button className="px-4 py-2 bg-brand-orange hover:bg-white text-black font-bold text-xs font-mono uppercase rounded-lg shadow-[0_0_15px_rgba(243,128,32,0.3)] transition-colors">
              Synchroniser Télémétrie
            </button>
          </div>
        </div>
      </div>

      {/* Central Visualizer + Live HUD */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Visualizer Hero Area */}
        <div className="relative w-full min-h-[480px] lg:min-h-[540px] rounded-3xl bg-zinc-950/80 border border-zinc-800/80 overflow-hidden flex items-center justify-center p-6 backdrop-blur-xl shadow-2xl">
          {/* Glowing Animated Ambient SVG Rings */}
          <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
            {/* Pulsing Concentric Circles */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4 rounded-full border border-dashed border-brand-orange/30"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-16 rounded-full border border-brand-cyan/20"
            />

            {/* Center Glowing Core */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 rounded-full bg-black/80 border border-brand-orange/50 shadow-[0_0_60px_rgba(243,128,32,0.25)]">
              <Sparkles className="w-8 h-8 text-brand-orange animate-pulse mb-2" />
              <div className="text-4xl lg:text-5xl font-mono font-black text-white tracking-tighter">
                {calculatedReduction.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-brand-cyan uppercase tracking-widest mt-1">
                tCO2e Évitées / An
              </div>
              <div className="mt-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                Flux Live Nominal · 100% Calibré
              </div>
            </div>

            {/* Orbiting Tech Nodes */}
            <div className="absolute top-10 left-16 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-xl border border-zinc-700 backdrop-blur-md">
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono text-zinc-300">Solaire: +{(solarCapacity * 420).toFixed(0)} tCO2</span>
            </div>

            <div className="absolute bottom-12 left-20 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-xl border border-zinc-700 backdrop-blur-md">
              <Wind className="w-4 h-4 text-brand-cyan" />
              <span className="text-xs font-mono text-zinc-300">CVC Opti: +{(aiHvacModulation * 24).toFixed(0)} tCO2</span>
            </div>

            <div className="absolute top-16 right-16 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-xl border border-zinc-700 backdrop-blur-md">
              <Flame className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-mono text-zinc-300">PAC: +{(heatPumpBoost * 18).toFixed(0)} tCO2</span>
            </div>
          </div>

          {/* HUD Top Left: Total Reduction Card */}
          <div className="absolute top-6 left-6 z-20 hidden md:block w-64 bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono text-brand-cyan mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                Live Carbon Scope
              </span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">Scope 1 & 2</div>
            <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Bâtiment Zéro Émission Directe</div>
          </div>

          {/* HUD Bottom Right: Efficiency Score Card */}
          <div className="absolute bottom-6 right-6 z-20 hidden md:block w-64 bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono text-brand-orange mb-2">
              <span>Score Sobriété Global</span>
              <Gauge className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-mono font-black text-white">{calculatedEfficiency}%</div>
              <div className="text-[11px] text-emerald-400 font-mono">
                Statut : <span className="font-bold uppercase">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Scenario Simulator Sliders */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 lg:p-8 rounded-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-orange" />
                Simulateur Prédictif d'Impact & Leviers Décarbonation
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">Ajustez les leviers pour observer l'impact direct sur les émissions et le ROI</p>
            </div>
            <span className="text-xs font-mono text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/30 px-3 py-1 rounded-full">
              Modèle d'Inférence IA v3.2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Slider 1: Photovoltaic */}
            <div className="p-4 bg-black/50 border border-zinc-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-300">Puissance Solaire PV</span>
                <span className="text-sm font-mono font-bold text-amber-400">{solarCapacity} MWc</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.2"
                value={solarCapacity}
                onChange={(e) => setSolarCapacity(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>0 MWc</span>
                <span>5 MWc</span>
                <span>10 MWc</span>
              </div>
            </div>

            {/* Slider 2: Heat pump */}
            <div className="p-4 bg-black/50 border border-zinc-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-300">Rétrofit Pompes à Chaleur</span>
                <span className="text-sm font-mono font-bold text-brand-orange">{heatPumpBoost}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={heatPumpBoost}
                onChange={(e) => setHeatPumpBoost(parseInt(e.target.value))}
                className="w-full accent-brand-orange cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>0% Gaz</span>
                <span>50% Hybride</span>
                <span>100% Full PAC</span>
              </div>
            </div>

            {/* Slider 3: AI HVAC */}
            <div className="p-4 bg-black/50 border border-zinc-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-300">Modulation Prédictive CVC</span>
                <span className="text-sm font-mono font-bold text-brand-cyan">{aiHvacModulation}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={aiHvacModulation}
                onChange={(e) => setAiHvacModulation(parseInt(e.target.value))}
                className="w-full accent-brand-cyan cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>Désactivé</span>
                <span>Standard</span>
                <span>Autonomie 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 24-Hour Emissions Chart Comparison */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-cyan" />
                Courbe de Charge Carbone sur 24h (kg CO2e / heure)
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">Scénario de référence (Non piloté) vs Scénario Optimisé BEECARBONAT</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                Non piloté
              </span>
              <span className="flex items-center gap-1.5 text-brand-cyan">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
                Optimisé IA
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyEmissions}>
                <defs>
                  <linearGradient id="gradReel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#71717a" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradOpti" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f1fe" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00f1fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                <YAxis stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} unit=" kg" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="reel" stroke="#71717a" fillOpacity={1} fill="url(#gradReel)" name="Consommation Initiale" />
                <Area type="monotone" dataKey="optimise" stroke="#00f1fe" fillOpacity={1} fill="url(#gradOpti)" name="Pilotage BEECARBONAT" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
