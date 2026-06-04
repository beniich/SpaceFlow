import React, { useState, useEffect } from "react";
import { Activity, Play, RefreshCw, Layers, Database, ArrowRight, Server } from "lucide-react";
import { GlassCard } from "./GlassUI";

interface DataVisualizationFlowProps {}

export const DataVisualizationFlow: React.FC<DataVisualizationFlowProps> = () => {
  const [pulseDegree, setPulseDegree] = useState(0);

  // Maintain smooth animations for neon particle paths
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseDegree(prev => (prev + 1) % 100);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sparklineData = "M 0,15 Q 15,3 30,15 T 60,15 T 90,12 T 120,15 L 120,30 L 0,30 Z";

  return (
    <div className="min-h-full bg-[#050912] text-slate-200 p-6 md:p-8 rounded-3xl border border-teal-500/10 shadow-2xl relative font-mono select-none overflow-hidden">
      
      {/* Background radial atmosphere */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-[20%] bottom-10 w-96 h-96 bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header bar matching Image 7 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-950 pb-4 mb-6 gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-[#f8fafc] flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400 animate-pulse" />
            <span>DATA VISUALIZATION FLOW</span>
          </h2>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">
            FixLab - Live Connection Signals
          </p>
        </div>
        <div>
          <span className="text-[9px] text-teal-400 bg-teal-500/5 border border-teal-500/20 uppercase font-black px-3 py-1.5 rounded-lg font-mono">
            Variant 3 of 10
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-stretch">
        
        {/* LEFT METRICS COLUMN (3 COLS) */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
          <GlassCard className="p-5 flex-1 flex flex-col justify-between bg-[#080e1a]/85 border border-zinc-800">
            <h3 className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4 border-b border-zinc-950 pb-2">
              Real-Time Metrics
            </h3>

            <div className="space-y-4">
              
              {/* Metric 1: Connection Status */}
              <div>
                <div className="flex justify-between items-baseline text-[10.5px]">
                  <span className="text-zinc-500 uppercase font-bold">Connection Status</span>
                  <span className="text-teal-400 font-extrabold font-sans">Active (24/24)</span>
                </div>
                {/* Waved mini spark chart */}
                <svg className="w-full h-8 text-teal-500/30 fill-teal-500/5 mt-1.5 border border-zinc-900 rounded-lg bg-black/25">
                  <path d={sparklineData} stroke="currentColor" strokeWidth="1" fill="currentColor" />
                </svg>
              </div>

              {/* Metric 2: Data Rate */}
              <div>
                <div className="flex justify-between items-baseline text-[10.5px]">
                  <span className="text-zinc-505 uppercase font-bold">Data Rate</span>
                  <span className="text-teal-400 font-extrabold font-sans">1.45 GB/s</span>
                </div>
                <svg className="w-full h-8 text-teal-500/30 fill-teal-500/5 mt-1.5 border border-zinc-900 rounded-lg bg-black/25">
                  <path d="M 0,10 Q 20,20 40,5 T 80,25 T 120,10 L 120,30 L 0,30 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" />
                </svg>
              </div>

              {/* Metric 3: Latency */}
              <div>
                <div className="flex justify-between items-baseline text-[10.5px]">
                  <span className="text-zinc-505 uppercase font-bold">Latency</span>
                  <span className="text-teal-400 font-extrabold font-sans">&lt; 10ms</span>
                </div>
                <svg className="w-full h-8 text-teal-400/20 fill-teal-500/5 mt-1.5 border border-zinc-900 rounded-lg bg-black/25">
                  <path d="M 0,25 L 30,5 L 60,25 L 90,20 L 120,28 L 120,30 L 0,30 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" />
                </svg>
              </div>

            </div>

            {/* Extra status parameters matching exactly design */}
            <div className="pt-3 border-t border-zinc-950 mt-4 text-[9px] text-zinc-550 space-y-1 font-bold">
              <div className="flex justify-between">
                <span>ACTIVE STREAM SOCKETS:</span>
                <span className="text-zinc-300 font-sans">342 Core</span>
              </div>
              <div className="flex justify-between">
                <span>LAST TELEMETRY EVENT:</span>
                <span className="text-zinc-400 font-sans">0.2s ago</span>
              </div>
            </div>
          </GlassCard>
        </div>


        {/* CENTER FLOW CANVAS: ELITE BEZIER WAVE PATHS AND CONNECTED AGENTS (6 COLS) */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center bg-black/45 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden min-h-[360px]">
          
          {/* Wave connections projection inside real Responsive SVG */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center p-2">
            <svg viewBox="0 0 400 240" className="w-full h-full text-teal-400">
              
              <defs>
                {/* Glow filter filter definition */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Curvy pathway 1: Agent 01 path (Top left wave) */}
              <path 
                d="M 60,60 Q 130,10 200,120" 
                fill="none" 
                stroke="rgba(20, 184, 166, 0.25)" 
                strokeWidth="1.8" 
              />
              <path 
                d="M 60,60 Q 130,10 200,120" 
                fill="none" 
                stroke="#14b8a6" 
                strokeWidth="1.2" 
                strokeDasharray="6,45" 
                strokeDashoffset={pulseDegree * 2.5} 
                filter="url(#glow)"
              />

              {/* Curvy pathway 2: Agent 02 path (Bottom left wave) */}
              <path 
                d="M 120,180 Q 140,160 200,120" 
                fill="none" 
                stroke="rgba(20, 184, 166, 0.25)" 
                strokeWidth="1.8" 
              />
              <path 
                d="M 120,180 Q 140,160 200,120" 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="1.2" 
                strokeDasharray="6,30" 
                strokeDashoffset={-pulseDegree * 2} 
                filter="url(#glow)"
              />

              {/* Curvy pathway 3: Server Hub to Agent 03 path (Right wave bundle) */}
              <path 
                d="M 200,120 C 260,120 280,10 340,120" 
                fill="none" 
                stroke="rgba(20, 184, 166, 0.25)" 
                strokeWidth="1.8" 
              />
              <path 
                d="M 200,120 C 260,120 280,10 340,120" 
                fill="none" 
                stroke="#14b8a6" 
                strokeWidth="1" 
                strokeDasharray="8,50" 
                strokeDashoffset={pulseDegree * 3} 
                filter="url(#glow)"
              />

              <path 
                d="M 200,120 C 260,125 280,210 340,120" 
                fill="none" 
                stroke="rgba(6, 182, 212, 0.25)" 
                strokeWidth="1.5" 
              />
              <path 
                d="M 200,120 C 260,125 280,210 340,120" 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="1" 
                strokeDasharray="8,40" 
                strokeDashoffset={-pulseDegree * 2.2} 
              />


              {/* LAYOUT OVERLAY NODE MARKS */}

              {/* Agent 01 Node */}
              <g transform="translate(60,60)">
                <circle r="7" fill="#070d19" stroke="#14b8a6" strokeWidth="1.8" />
                <circle r="3.5" fill="#14b8a6" className="animate-pulse" />
                <text y="-11" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">Agent 01</text>
              </g>

              {/* Agent 02 Node */}
              <g transform="translate(120,180)">
                <circle r="7" fill="#070d19" stroke="#22d3ee" strokeWidth="1.8" />
                <circle r="3.5" fill="#22d3ee" />
                <text y="16" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">Agent 02</text>
              </g>

              {/* SERVER HUB concentric ring center node */}
              <g transform="translate(200,120)">
                <circle r="15" fill="none" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="1" />
                <circle r="11" fill="#070d19" stroke="#14b8a6" strokeWidth="1.5" />
                <circle r="5" fill="#14b8a6" className="animate-ping" style={{ animationDuration: "3.5s" }} />
                <circle r="5" fill="#14b8a6" />
                <text y="24" textAnchor="middle" fill="#f1f5f9" fontSize="9" fontWeight="black" letterSpacing="0.05em">Server Hub</text>
              </g>

              {/* Agent 03 Node */}
              <g transform="translate(340,120)">
                <circle r="7" fill="#070d19" stroke="#14b8a6" strokeWidth="1.8" />
                <circle r="3" fill="#14b8a6" />
                <text y="-11" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">Agent 03</text>
              </g>

            </svg>
          </div>

        </div>


        {/* RIGHT LEDGER LIST: ACTIVE AGENTS DUMP ACTIVITY (3 COLS) */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
          <GlassCard className="p-5 flex-1 flex flex-col justify-between bg-[#080e1a]/85 border border-zinc-800">
            <div>
              <h3 className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4 border-b border-zinc-950 pb-2">
                Agent Activity
              </h3>
              
              <div className="space-y-3.5 text-[9.5px] leading-relaxed">
                
                {/* Log item 1 */}
                <div className="p-2 bg-black/30 border border-zinc-900 rounded-lg">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold uppercase font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Agent 02 OK
                  </div>
                  <p className="text-zinc-400 mt-1">Handshake Complete - 10:45:32 AM</p>
                </div>

                {/* Log item 2 */}
                <div className="p-2 bg-black/30 border border-zinc-900 rounded-lg">
                  <div className="flex items-center gap-1.5 text-teal-400 font-extrabold uppercase font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    Agent 01 OK
                  </div>
                  <p className="text-zinc-400 mt-1">Data Burst Stream - 10:45:30 AM</p>
                </div>

                {/* Log item 3 */}
                <div className="p-2 bg-black/30 border border-zinc-900 rounded-lg">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold uppercase font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-405" />
                    Agent 03 OK
                  </div>
                  <p className="text-zinc-400 mt-1">Telemetry Sync - 10:45:28 AM</p>
                </div>

              </div>
            </div>

            <div className="pt-2">
              <span className="text-[9px] text-[#22d3ee] font-sans font-semibold italic flex items-center justify-center gap-1 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                SYSTEM LIVE HEALTHY
              </span>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

