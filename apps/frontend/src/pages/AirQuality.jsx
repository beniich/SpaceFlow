import React, { useState } from 'react';
import { Wind, Flame, Activity, PieChart as PieChartIcon, FileText, Filter, Eye, ZoomIn, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const mockAqiHistory = [
  { day: 'Sun', aqi: 42 },
  { day: 'Mon', aqi: 35 },
  { day: 'Tue', aqi: 28 },
  { day: 'Wed', aqi: 38 },
  { day: 'Thu', aqi: 32 },
  { day: 'Fri', aqi: 30 },
  { day: 'Sat', aqi: 35 },
];

const sourceData = [
  { name: 'Vehicles', value: 35, color: '#f38020' },
  { name: 'Industry', value: 45, color: '#00dbe7' },
  { name: 'Natural', value: 20, color: '#10b981' },
];

export default function AirQuality() {
  const [activeOverlay, setActiveOverlay] = useState('Air Flow');

  return (
    <div className="min-h-screen bg-surface text-foreground p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f38020]/20 to-[#00dbe7]/20 border border-[#00dbe7]/40 flex items-center justify-center text-[#00dbe7]">
            <Wind className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              BeeCarbonat <span className="text-muted-foreground font-normal">Air Quality & AQI Stats</span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Analyse prédictive de la qualité de l'air urbain et capture d'émissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> OXYGEN LEVEL OPTIMAL
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 3D Swirling Fluid City Visualizer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative min-h-[460px] rounded-2xl bg-background border border-border p-6 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,128,32,0.12)_0,transparent_70%)] pointer-events-none" />

            {/* Simulated 3D Fluid Atmosphere Graphics */}
            <div className="relative w-full h-72 flex items-center justify-center">
              {/* O2 Central Flame Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#f38020] to-[#ff9900] shadow-[0_0_60px_rgba(243,128,32,0.6)] flex items-center justify-center text-slate-950 font-black text-3xl tracking-tighter animate-pulse">
                  <Flame className="w-12 h-12 text-foreground mr-1 inline" />
                  O₂
                </div>
              </div>

              {/* Swirling Flow Rings */}
              <div className="absolute w-72 h-72 rounded-full border border-dashed border-[#00dbe7]/40 animate-[spin_25s_linear_infinite]" />
              <div className="absolute w-96 h-96 rounded-full border border-dashed border-[#f38020]/30 animate-[spin_18s_linear_infinite_reverse]" />
            </div>

            {/* Floating Live Telemetry Badge Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              <div className="p-3 rounded-xl bg-surface/80 border border-border backdrop-blur-md">
                <div className="text-[10px] font-mono text-muted-foreground">PM2.5</div>
                <div className="text-base font-extrabold text-[#00dbe7] font-mono">8 µg/m³</div>
              </div>
              <div className="p-3 rounded-xl bg-surface/80 border border-border backdrop-blur-md">
                <div className="text-[10px] font-mono text-muted-foreground">CO2</div>
                <div className="text-base font-extrabold text-[#f38020] font-mono">420 ppm</div>
              </div>
              <div className="p-3 rounded-xl bg-surface/80 border border-border backdrop-blur-md">
                <div className="text-[10px] font-mono text-muted-foreground">O3</div>
                <div className="text-base font-extrabold text-emerald-400 font-mono">25 ppb</div>
              </div>
              <div className="p-3 rounded-xl bg-surface/80 border border-border backdrop-blur-md">
                <div className="text-[10px] font-mono text-muted-foreground">VOCs</div>
                <div className="text-base font-extrabold text-foreground font-mono">0.1 ppm</div>
              </div>
            </div>

            {/* Bottom View Modes Toggles */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/80 relative z-10">
              {['Air Flow', 'Heat Map', 'Zoom', 'Filter', 'Analysis'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveOverlay(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                    activeOverlay === mode
                      ? 'bg-[#00dbe7] text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-surface text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AQI Stats & Analysis */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-surface/60 border border-border backdrop-blur-xl space-y-5">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">CITYWIDE OVERVIEW</span>
                <h3 className="text-xl font-bold text-foreground mt-1">AQI Stats & Analysis</h3>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono">
                35 (Good)
              </div>
            </div>

            {/* Recharts AQI Trend */}
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAqiHistory}>
                  <XAxis dataKey="day" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} domain={[0, 60]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="aqi" stroke="#00dbe7" strokeWidth={2.5} dot={{ fill: '#f38020', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Source Analysis Pie Chart */}
            <div className="space-y-2 border-t border-border pt-3">
              <span className="text-xs font-mono text-muted-foreground uppercase">Analyse des Sources</span>
              <div className="h-28 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} innerRadius={25} outerRadius={40} paddingAngle={4} dataKey="value">
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around text-[10px] font-mono">
                <span className="text-[#f38020]">● Vehicles (35%)</span>
                <span className="text-[#00dbe7]">● Industry (45%)</span>
                <span className="text-emerald-400">● Natural (20%)</span>
              </div>
            </div>

            {/* Predictions */}
            <div className="border-t border-border pt-3 space-y-2 text-xs font-mono">
              <div className="text-[10px] text-muted-foreground uppercase">PRÉDICTION 24H</div>
              <div className="flex justify-between text-muted">
                <span>Next 24h:</span>
                <span className="text-emerald-400 font-bold">25 ppm (Très Pur)</span>
              </div>
            </div>

            <button
              onClick={() => toast.success("Rapport complet sur la qualité de l'air généré (PDF)")}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f38020] to-orange-600 hover:opacity-90 text-xs font-bold text-foreground transition tracking-wider uppercase font-mono shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Create Air Quality Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
