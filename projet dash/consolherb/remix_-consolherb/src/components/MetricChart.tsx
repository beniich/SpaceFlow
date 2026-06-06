import { useEffect, useState } from 'react';
import { AreaChart, TrendingUp, RefreshCw, Zap } from 'lucide-react';

interface MetricChartProps {
  isDdosActive: boolean;
  isMalwareActive: boolean;
}

export default function MetricChart({ isDdosActive, isMalwareActive }: MetricChartProps) {
  // Use state to generate live-pulsing bars that make the dashboard feel active and responsive!
  const [bars, setBars] = useState<number[]>([40, 30, 50, 42, 38, 40, 60, 45, 35, 48, 40, 50]);

  useEffect(() => {
    // Continuous drift simulator to give real-time telemetry feeling
    const interval = setInterval(() => {
      setBars((prev) => {
        const next = [...prev];
        next.shift(); // remove the oldest
        // Determine the next target amplitude
        let baseHeight = 35 + Math.random() * 25; // Normal healthy range
        if (isDdosActive) {
          baseHeight = 82 + Math.random() * 15; // DDoS spike range
        } else if (isMalwareActive) {
          baseHeight = 65 + Math.random() * 25; // Erratic spikes
        }
        next.push(Math.min(98, Math.max(12, Math.round(baseHeight))));
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isDdosActive, isMalwareActive]);

  return (
    <div className="bg-[#122131] border border-[#334155] rounded-[4px] p-6 shadow-md" id="traffic-metrics-chart">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              Real-time Traffic Analysis
            </h2>
            {isDdosActive && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded animate-pulse">
                <Zap className="w-2.5 h-2.5" /> DDOS HIGH WAVE
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-[#c5c6cd] mt-0.5">
            MONITORING_FEED: GLOBAL_INFRA_V4 // PORT: UDP_3000 // PACKETS/S: {isDdosActive ? '2,482,109 (MAX)' : '41,502'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 bg-[#4de082] rounded-full border border-[#4de082]/35 shadow-sm"></span>
            <span className="text-gray-300">Healthy</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className={`w-2.5 h-2.5 rounded-full border shadow-sm ${isDdosActive ? 'bg-red-500 animate-ping' : 'bg-red-500/80 border-red-500/35'}`}></span>
            <span className="text-gray-300">Spikes</span>
          </div>
        </div>
      </div>

      {/* Grid container with beautiful high tech grid overlay background */}
      <div className="h-48 w-full flex items-end gap-1.5 border-l border-b border-[#334155] pb-2 pl-2 relative overflow-hidden bg-[#0d1a29]/80 rounded-br-sm">
        {/* Dynamic Scan Line Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(#334155 1.5px, transparent 1.5px), linear-gradient(90deg, #334155 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Custom Neon Scan Sweep line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-[#4de082]/30 shadow-[0_0_8px_#4de082] animate-pulse-slow pointer-events-none right-[40%]"></div>

        {/* Dynamic rendering of bars */}
        {bars.map((heightValue, index) => {
          // Check if this bar qualifies as a spike bar
          const isSpike = heightValue > 65 || (isDdosActive && index > 4) || (isMalwareActive && index % 3 === 0);
          
          let barBgColor = 'bg-[#4de082]/20 border-[#4de082] hover:border-white';
          if (isSpike) {
            barBgColor = 'bg-red-500/20 border-red-500 hover:border-[#ffb3b0]';
          } else if (heightValue > 50 && heightValue <= 65) {
            barBgColor = 'bg-[#38BDF8]/20 border-[#38BDF8] hover:border-white';
          }

          return (
            <div
              key={index}
              className={`flex-1 min-w-[12px] border-t-2 rounded-t-[2px] transition-all duration-700 relative group cursor-crosshair ${barBgColor}`}
              style={{ height: `${heightValue}%` }}
              id={`metric-bar-${index}`}
            >
              {/* Telemetry Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-[#071322] border border-slate-700 text-[9px] font-mono text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                VAL: {heightValue}% {isSpike && '⚠️'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-3 text-[10px] font-mono text-[#8f9097]">
        <span>TIME INTERVAL: T-60s</span>
        <span className="flex items-center gap-1">
          <RefreshCw className="w-3 h-3 text-[#4de082] animate-spin" style={{ animationDuration: '4s' }} />
          <span>AUTOSCROLL FEED</span>
        </span>
        <span>TIME INTERVAL: NOW</span>
      </div>
    </div>
  );
}
