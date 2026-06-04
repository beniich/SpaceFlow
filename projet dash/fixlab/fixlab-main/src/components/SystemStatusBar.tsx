/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Activity, Circle, Server, ShieldCheck, Wifi } from "lucide-react";
import { SystemLog } from "../types";

interface StatusBarProps {
  logs: SystemLog[];
  isConnected: boolean;
  isLightMode?: boolean;
}

export const SystemStatusBar: React.FC<StatusBarProps> = ({ logs, isConnected, isLightMode = false }) => {
  const [timeStr, setTimeStr] = useState<string>("");
  const [tickerLog, setTickerLog] = useState<string>("");

  useEffect(() => {
    // Synchronize to the User's local session context (May 2026 UTC, or actual ticks)
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-GB", { hour12: false }) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      // Rotate the newest log inside the bottom status ticker
      const newestLog = logs[0];
      setTickerLog(`[${newestLog.timestamp}] ${newestLog.source}: ${newestLog.message}`);
    }
  }, [logs]);

  return (
    <footer id="system-status-bar" className={`h-10 border-t px-4 flex items-center justify-between text-[11px] font-mono select-none transition-all duration-300 ${
      isLightMode 
        ? "bg-[#EAE6DF] border-stone-300 text-stone-600" 
        : "bg-[#07090f] border-emerald-500/20 text-zinc-400"
    }`}>
      {/* Left Segment: System state */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Activity className={`w-3.5 h-3.5 animate-pulse ${isLightMode ? "text-emerald-700" : "text-emerald-400"}`} />
          <span className={`tracking-wider font-semibold ${isLightMode ? "text-emerald-800" : "text-emerald-400"}`}>SOVEREIGN CORE</span>
        </div>
        <div className={`h-3.5 w-px ${isLightMode ? "bg-stone-300" : "bg-zinc-800"}`} />
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Circle className={`w-2.5 h-2.5 ${isLightMode ? "fill-emerald-600 text-emerald-600" : "fill-emerald-500 text-emerald-500"}`} />
          <span className={isLightMode ? "text-stone-700" : "text-zinc-400"}>SYS STATUS: NOMINAL</span>
        </div>
        <div className={`h-3.5 w-px ${isLightMode ? "bg-stone-300" : "bg-zinc-800"} hidden md:block`} />
        {/* Ticker for latest system incident */}
        <div className={`hidden md:flex items-center gap-2 max-w-sm lg:max-w-md xl:max-w-lg truncate ${
          isLightMode ? "text-stone-800" : "text-emerald-500/85"
        }`}>
          <span className={`text-[10px] border px-1 py-0.5 rounded uppercase font-bold tracking-tight inline-block ${
            isLightMode 
              ? "bg-emerald-100 text-emerald-850 border-emerald-300" 
              : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
          }`}>LIVE TICKER</span>
          <span className="truncate">{tickerLog || "Continuous sovereignty auditing engine online..."}</span>
        </div>
      </div>

      {/* Right Segment: Connection indicators */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded text-[10px] ${
          isLightMode 
            ? "bg-stone-100/80 border-stone-300 text-stone-600" 
            : "bg-zinc-900/40 border border-zinc-800 text-zinc-400"
        }`}>
          <Server className="w-3 h-3 text-zinc-500" />
          <span>REF-GATEWAY: 10.240.1.1</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi className={`w-3 h-3 ${isConnected ? (isLightMode ? "text-emerald-700" : "text-emerald-400") : "text-rose-400"}`} />
          <span className={isLightMode ? "text-stone-700" : ""}>PING: 14ms</span>
        </div>
        <div className={`h-3.5 w-px ${isLightMode ? "bg-stone-300" : "bg-zinc-800"}`} />
        <div className={`flex items-center gap-1.5 font-medium px-2 py-0.5 border rounded text-[10px] ${
          isLightMode 
            ? "text-emerald-850 bg-emerald-50/50 border-emerald-250" 
            : "text-emerald-400/90 bg-emerald-950/20 border border-emerald-500/10"
        }`}>
          <ShieldCheck className={`w-3 h-3 ${isLightMode ? "text-emerald-700" : "text-emerald-400"}`} />
          <span>TLS 1.3 SECURE STATE</span>
        </div>
        <div className={`h-3.5 w-px ${isLightMode ? "bg-stone-300" : "bg-zinc-800"}`} />
        <div className={`font-bold tracking-widest ${isLightMode ? "text-stone-800" : "text-zinc-300"}`}>{timeStr || "13:56:19 UTC"}</div>
      </div>
    </footer>
  );
};
