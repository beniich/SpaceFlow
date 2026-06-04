import React, { useState } from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, ShieldAlert, FileText, CheckSquare, TrendingUp, AlertTriangle, Cpu, Clock, Sparkles, ChevronRight, BarChart3 } from "lucide-react";
import { GlassCard, NeonButton } from "./GlassUI";
import { initialPredictiveFailures } from "../mockData";
import { PredictiveFailure } from "../types";

interface ExecutiveInsightsProps {}

export const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = () => {
  // Navigation between general operational metrics and predictive failure view
  const [currentTab, setCurrentTab] = useState<"fleet" | "predictive">("predictive");
  
  // Interactive state for focusing on a specific critical hardware prediction or viewing the global overlap
  const [focusedFailureId, setFocusedFailureId] = useState<string>("all");

  // Polish dataset matching original fleet view but with gorgeous clinical colors
  const mainChartData = [
    { name: "Jan", perf: 22, opt: 15 },
    { name: "Feb", perf: 58, opt: 48 },
    { name: "Mar", perf: 85, opt: 68 },
    { name: "Apr", perf: 52, opt: 46 },
    { name: "May", perf: 98, opt: 80 },
    { name: "Jun", perf: 72, opt: 58 },
    { name: "Jul", perf: 110, opt: 90 },
    { name: "Aug", perf: 138, opt: 115 }
  ];

  const secondaryChartData = [
    { name: "Jan", val: 20 },
    { name: "Mar", val: 56 },
    { name: "May", val: 32 },
    { name: "Jul", val: 86 },
    { name: "Sep", val: 45 },
    { name: "Nov", val: 98 }
  ];

  // Helper sparkline data
  const miniSparkData = [
    { name: "1", v: 20 },
    { name: "2", v: 38 },
    { name: "3", v: 24 },
    { name: "4", v: 48 },
    { name: "5", v: 40 },
    { name: "6", v: 75 },
    { name: "7", v: 62 },
    { name: "8", v: 94.5 }
  ];

  // Generate dynamic trending failure curves dynamically from mockData array to support future integrations
  const timeSteps = ["Day -6", "Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Today", "Day +1 (Forecast)"];
  
  const predictiveTrendData = timeSteps.map((step, idx) => {
    const point: any = { name: step };
    initialPredictiveFailures.forEach(f => {
      // Use device name & component to build a neat key
      const key = `${f.deviceName} (${f.component})`;
      const prob = f.probability;
      
      // Calculate realistic regression curves ending at the current probability on 'Today'
      let value = 0;
      if (idx === 7) {
        // Future Forecast point
        value = Math.min(100, Math.round(prob + (100 - prob) * 0.35));
      } else {
        const fraction = (idx + 1) / 7;
        value = Math.round(prob * (0.15 + 0.85 * fraction * fraction));
      }
      point[key] = value;
    });
    return point;
  });

  return (
    <div className="min-h-full bg-[#1a0e41]/95 text-white p-6 md:p-10 font-sans border border-purple-500/10 rounded-[2.5rem] shadow-[0_15px_40px_rgba(76,29,149,0.3)] relative overflow-hidden backdrop-blur-md select-none">
      
      {/* Background Soft Ambient Glows */}
      <div className="absolute right-[-10%] top-[-10%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute left-[20%] bottom-0 w-[450px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Tab Controller - High Fidelity Segments */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-950/50 relative z-10 animate-fade-in">
        <div>
          <h1 className="text-2xl font-black italic tracking-wide text-white uppercase leading-none">
            🏥 Executive Insights
          </h1>
          <p className="text-[10px] text-purple-300 mt-2 font-mono uppercase tracking-widest leading-none">
            M.L. Clinical Predictive Analytics & Sensor Telemetry
          </p>
        </div>

        {/* Elegant Toggle Switch bar */}
        <div className="flex bg-[#120732] p-1.5 rounded-2xl border border-purple-950 shadow-inner">
          <button
            onClick={() => setCurrentTab("fleet")}
            className={`flex items-center gap-2 px-4 py-2.5 text-[9.5px] font-black font-mono tracking-widest uppercase rounded-xl transition-all duration-300 cursor-pointer ${
              currentTab === "fleet"
                ? "bg-[#25175d] text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                : "text-purple-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Fleet Data
          </button>
          <button
            onClick={() => setCurrentTab("predictive")}
            className={`flex items-center gap-2 px-4 py-2.5 text-[9.5px] font-black font-mono tracking-widest uppercase rounded-xl transition-all duration-300 cursor-pointer ${
              currentTab === "predictive"
                ? "bg-[#25175d] text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                : "text-purple-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#ff5c00" }} /> Predictive ML
          </button>
        </div>
      </div>

      {currentTab === "fleet" ? (
        <div className="space-y-6 relative z-10 transition-all">
          
          {/* TOP COMPONENT: QUARTERLY PERFORMANCE AREA CHART (FULL WIDTH) */}
          <div className="bg-[#1f124c]/90 border border-purple-500/5 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                  Quarterly Fleet Performance & Optimization (Last 12 Months)
                </h3>
                <p className="text-[10px] text-purple-400 mt-1 font-mono uppercase tracking-wider">SECURE SENSOR CALIBRATION DEPLOYED</p>
              </div>
              
              <select className="bg-[#150a36] border border-[#2e1d7a] hover:border-[#22d3ee]/50 text-cyan-400 font-mono text-[9px] rounded-xl px-3 py-2 outline-none tracking-widest uppercase font-bold cursor-pointer transition-all">
                <option>Last 12 Months</option>
                <option>Last 6 Months</option>
                <option>Real-time Matrix</option>
              </select>
            </div>

            <div className="h-60 w-full font-mono text-[9px] text-[#7c6bb5]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mainChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(124, 107, 181, 0.15)" />
                  <XAxis dataKey="name" stroke="#7c6bb5" tickLine={false} />
                  <YAxis stroke="#7c6bb5" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#150a36", borderColor: "rgba(168, 85, 247, 0.2)", borderRadius: "12px", color: "white" }} />
                  <Area 
                    type="monotone" 
                    dataKey="perf" 
                    stroke="#a855f7" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#perfGrad)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="opt" 
                    stroke="#22d3ee" 
                    strokeWidth={1.8}
                    fillOpacity={1} 
                    fill="url(#optGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BOTTOM SECTION: 4 BENTO ANALYTICAL CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Bento box 1: Total Fleet Efficiency */}
            <div className="bg-[#1f124c]/90 border border-purple-500/5 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[165px] group hover:border-[#22d3ee]/20 transition-all duration-300">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#7c6bb5] font-bold uppercase tracking-widest block">Total Fleet Efficiency</span>
                <h2 className="text-3xl font-black italic text-white tracking-tight mt-1">94.5%</h2>
              </div>
              
              {/* Sparkline */}
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniSparkData}>
                    <Area type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={1.5} fill="rgba(34, 211, 238, 0.1)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bento box 2: Active Vehicles */}
            <div className="bg-[#1f124c]/90 border border-purple-500/5 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[165px] group hover:border-[#22d3ee]/20 transition-all duration-300">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#7c6bb5] font-bold uppercase tracking-widest block">Active Devices</span>
                <h2 className="text-3xl font-black italic text-white tracking-tight mt-1">1,250</h2>
                <span className="text-[9px] text-[#10b981] font-black uppercase font-mono block mt-1">▲ 94.5% Online</span>
              </div>

              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniSparkData}>
                    <Area type="monotone" dataKey="v" stroke="#a855f7" strokeWidth={1.5} fill="rgba(168, 85, 247, 0.1)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bento box 3: Operational Costs & Carbon Footprint */}
            <div className="flex flex-col gap-3 justify-between h-[165px]">
              <div className="bg-[#1f124c]/90 border border-purple-500/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[8.5px] text-[#7c6bb5] font-bold uppercase tracking-widest block">Operational Costs</span>
                  <span className="text-lg font-black text-white italic">$2.4M</span>
                  <span className="text-[8px] font-bold text-green-400 block uppercase font-mono mt-0.5">
                    (-5% Reduction)
                  </span>
                </div>
                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/15 font-mono font-bold">
                  -5%
                </span>
              </div>

              <div className="bg-[#1f124c]/90 border border-purple-500/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[8.5px] text-[#7c6bb5] font-bold uppercase tracking-widest block">Carbon Footprint</span>
                  <span className="text-lg font-black text-white italic">8,500 Tons</span>
                  <span className="text-[8.5px] font-black text-[#22d3ee] font-sans block mt-0.5">▲ 8.92% Eco</span>
                </div>
              </div>
            </div>

            {/* Bento box 4: Regional Utilization Heatmap AreaChart */}
            <div className="bg-[#1f124c]/90 border border-purple-500/5 rounded-3xl p-6 shadow-sm h-[165px] flex flex-col justify-between group hover:border-[#22d3ee]/20 transition-all duration-300">
              <div className="flex justify-between items-center border-b border-purple-950 pb-2">
                <span className="text-[8.5px] text-[#7c6bb5] font-black tracking-widest uppercase">Utilization Core</span>
                <span className="text-[7.5px] text-cyan-400 bg-[#120732] px-2 py-0.5 rounded-lg border border-purple-950 font-mono font-bold uppercase">Predicts ▾</span>
              </div>

              <div className="h-16 w-full font-mono text-[7px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={secondaryChartData}>
                    <defs>
                      <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff5c00" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ff5c00" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#ff5c00" strokeWidth={1.5} fill="url(#orangeGrad)" fillOpacity={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* NEW HIGH-FIDELITY PREDICTIVE ANALYTICS SECTION USING RECHARTS */
        <div className="space-y-6 relative z-10 transition-all">
          
          <div className="bg-[#1f124c]/95 border border-purple-500/10 rounded-3xl p-6 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <TrendingUp className="w-4 h-4 text-[#ff5c00] animate-pulse drop-shadow-[0_0_5px_rgba(255,92,0,0.6)]" /> ML Failure Probability Gradient Trends
                </h3>
                <p className="text-[10px] text-purple-400 mt-2 font-mono uppercase tracking-wider leading-none">
                  Slower mechanical degradation & threshold wear trajectory lines
                </p>
              </div>

              {/* Filtering mechanism allowing focused or comparative viewing */}
              <div className="flex flex-wrap gap-1 bg-[#120732] p-1.5 rounded-xl border border-purple-950 font-mono text-[9px]">
                <button
                  onClick={() => setFocusedFailureId("all")}
                  className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    focusedFailureId === "all" 
                      ? "bg-[#25175e] text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-black" 
                      : "text-purple-400 hover:text-white"
                  }`}
                >
                  🌐 Compare All
                </button>
                {initialPredictiveFailures.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFocusedFailureId(f.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      focusedFailureId === f.id 
                        ? "bg-[#25175e] text-[#ff5c00] border border-orange-500/25 shadow-[0_0_10px_rgba(255,92,0,0.2)] font-black" 
                        : "text-purple-400 hover:text-white"
                    }`}
                  >
                    🚀 {f.component}
                  </button>
                ))}
              </div>
            </div>

            {/* Failure probability trend chart */}
            <div className="h-72 w-full font-mono text-[9px] text-[#7c6bb5] relative mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictiveTrendData} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(124, 107, 181, 0.12)" />
                  <XAxis dataKey="name" stroke="#7c6bb5" tickLine={false} />
                  <YAxis stroke="#7c6bb5" tickLine={false} domain={[0, 100]} unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#150a36", borderRadius: "16px", border: "1px solid rgba(168, 85, 247, 0.2)", color: "#f8fafc" }}
                    labelStyle={{ fontFamily: "monospace", fontSize: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "4px", marginBottom: "4px" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "15px", fontSize: "9px", fontFamily: "monospace" }}
                  />

                  {/* Render Lines depending on interactive selector state */}
                  {initialPredictiveFailures.map((f, idx) => {
                    const key = `${f.deviceName} (${f.component})`;
                    
                    // Assign beautifully paired customized color palette matching clinic specs
                    const colors = [
                      "#ff5c00", // trademark warning orange
                      "#22d3ee", // healthy turquoise
                      "#9333ea"  // clinic purple
                    ];
                    
                    const strokeColor = colors[idx % colors.length];
                    const isFocused = focusedFailureId === "all" || focusedFailureId === f.id;

                    return (
                      <Line
                        key={f.id}
                        type="monotone"
                        dataKey={key}
                        stroke={strokeColor}
                        strokeWidth={isFocused ? 2.5 : 0.8}
                        strokeDasharray={idx === 1 ? "4 4" : undefined}
                        dot={isFocused ? { r: 5, strokeWidth: 1.5, fill: "#150a36" } : false}
                        activeDot={isFocused ? { r: 7 } : false}
                        opacity={isFocused ? 1.0 : 0.15}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DYNAMIC BENTO CARDS DESCRIBING INDIVIDUAL HARWARE THREAT LEVEL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialPredictiveFailures.map((f, idx) => {
              const colors = [
                { text: "text-[#ff5c00]", bg: "bg-[#2c1538] border-orange-500/20", glow: "shadow-[rgba(255,92,0,0.1)]" },
                { text: "text-[#22d3ee]", bg: "bg-[#18234c] border-cyan-500/20", glow: "shadow-[rgba(34,211,238,0.1)]" },
                { text: "text-purple-400", bg: "bg-[#1d1144] border-purple-500/20", glow: "shadow-[rgba(168,85,247,0.1)]" }
              ];
              const theme = colors[idx % colors.length];
              const isFocused = focusedFailureId === "all" || focusedFailureId === f.id;

              return (
                <div
                  key={f.id}
                  onClick={() => setFocusedFailureId(f.id)}
                  className={`bg-[#1f124c]/90 border rounded-[2rem] p-6 shadow-lg hover:border-[#22d3ee]/30 transition-all duration-350 cursor-pointer flex flex-col justify-between min-h-[190px] relative overflow-hidden ${
                    isFocused ? "ring-2 ring-cyan-400 border-cyan-400/40 shadow-2xl scale-[1.01]" : "opacity-60 border-purple-500/5"
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[8.5px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide flex items-center gap-1.5 ${theme.bg} ${theme.text}`}>
                        <Cpu className="w-3.5 h-3.5" /> {f.component}
                      </span>
                      <span className="text-[9.5px] font-bold text-purple-400 font-mono tracking-widest">
                        {f.id}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white uppercase tracking-wider line-clamp-1 italic leading-none">{f.deviceName}</h4>
                    <p className="text-purple-305 text-[10.5px] font-mono mt-3 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#7c6bb5]" /> RUL EST: <span className="text-white font-extrabold">{f.timeToFailure}</span>
                    </p>

                    <p className="text-[11px] text-[#7c6bb5] leading-normal italic mt-3 line-clamp-2 leading-relaxed">
                      "{f.riskDescription}"
                    </p>
                  </div>

                  {/* Urgency probability footer */}
                  <div className="flex items-center justify-between border-t border-purple-950 pt-3.5 mt-4">
                    <span className="text-[9px] text-[#7c6bb5] font-bold uppercase tracking-widest">
                      PROBABILITY RISK
                    </span>
                    <span className={`text-base font-black italic font-mono ${theme.text}`}>
                      {f.probability}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Informational Guide Segment */}
          <div className="bg-[#150a36]/80 border border-purple-500/10 rounded-[2rem] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-[#ff5c00] shrink-0 mt-0.5 shadow-[0_0_15px_rgba(255,92,0,0.15)]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-black text-white text-xs uppercase tracking-widest leading-none">AUTONOMOUS FAIL-SAFE PROTOCOLS DEPLOYED</span>
                <p className="text-[#7c6bb5] text-[10.5px] mt-2.5 leading-relaxed font-semibold">
                  Machine learning predictive models sync with the Sovereign network dynamically to request Coolant cycle, RAM defragmentations, and bad block boot cell isolations during real-time degradation detections.
                </p>
              </div>
            </div>
            
            <span className="text-[9px] text-[#22d3ee] bg-[#24175e] border border-cyan-400/20 px-3.5 py-2.5 rounded-xl font-mono font-black tracking-widest uppercase shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.1)]">
              ● Live Model Status: Nominal
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
