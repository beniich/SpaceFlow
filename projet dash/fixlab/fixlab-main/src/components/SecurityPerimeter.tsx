import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, Cpu, Heart, CheckCircle, Clock } from "lucide-react";
import { GlassCard } from "./GlassUI";

interface SecurityPerimeterProps {}

export const SecurityPerimeter: React.FC<SecurityPerimeterProps> = () => {
  const [pulseSeed, setPulseSeed] = useState(0);

  // Animate the red threat map ping rings smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseSeed(prev => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const alertsList = [
    { time: "10:45 AM", type: "Malware Block", source: "Device ID-8842", status: "Resolved", color: "text-emerald-400" },
    { time: "10:42 AM", type: "Firewall Packet Filter", source: "Device ID-1105", status: "Resolved", color: "text-emerald-400" },
    { time: "10:29 AM", type: "Intrusion Block", source: "Device ID-0043", status: "Resolved", color: "text-emerald-400" },
    { time: "10:14 AM", type: "Port Scan Rejected", source: "Device ID-2292", status: "Resolved", color: "text-emerald-400" }
  ];

  return (
    <div className="min-h-full bg-gradient-to-b from-[#090e1a] to-[#04060d] text-slate-100 p-6 md:p-8 rounded-3xl border border-rose-500/10 shadow-2xl relative font-sans select-none overflow-hidden">
      
      {/* Background Soft Red light glows */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Menu Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-4 mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-[#f8fafc] flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            SECURITY PERIMETER HUB
          </h2>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">
            FixLab - High-end Fleet Defense Overview
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <span className="text-[9px] text-rose-400 bg-rose-500/5 px-2.5 py-1 rounded border border-rose-500/15 font-mono uppercase font-black tracking-wider">
            VARIANT 6 OF 10
          </span>
        </div>
      </div>

      {/* Main Grid Layout containing central circular radar threat map and flanking status boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* LEFT STATUS MODULES (3 COLS) */}
        <div className="lg:col-span-3 space-y-4">
          <GlassCard className="p-5 space-y-2 bg-[#0c1326]/35 border-l-4 border-l-emerald-500">
            <span className="text-[9px] text-zinc-500 block font-bold uppercase tracking-wide">Fleet Defense Status</span>
            <h3 className="text-2xl font-black text-emerald-400 font-mono">98.5% <span className="text-xs font-sans text-zinc-400 font-normal">Secure</span></h3>
            <p className="text-[9.5px] text-zinc-450 uppercase font-bold">ALL SECURITY SHIELDS ACTIVE</p>
          </GlassCard>

          <GlassCard className="p-5 space-y-2 bg-[#0c1326]/35">
            <span className="text-[9px] text-zinc-550 block font-bold uppercase tracking-wide">Global Monitoring</span>
            <h3 className="text-2xl font-black text-blue-400 font-mono">36 <span className="text-xs font-sans text-zinc-400 font-normal">Nodes Secure</span></h3>
            <p className="text-[9.5px] text-zinc-450 uppercase font-bold">ACTIVE DIAGNOSTIC ENLACE</p>
          </GlassCard>
        </div>

        {/* RADAR COCKPIT THREAT MAP VIEWPORT (6 COLS) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative rounded-full p-4 h-[380px] lg:h-[400px]">
          
          {/* Glowing Red Radar border lines */}
          <div className="absolute inset-0 border border-rose-500/10 rounded-full animate-pulse pointer-events-none" />
          <div className="absolute inset-10 border border-rose-500/5 rounded-full pointer-events-none" />
          <div className="absolute inset-24 border border-rose-500/5 rounded-full pointer-events-none" />

          {/* Centralized world threat map wireframe */}
          <div className="w-full max-w-[440px] h-60 relative flex items-center justify-center opacity-85 z-10 text-rose-500">
            
            {/* World schematic render inside SVG */}
            <svg viewBox="0 0 100 50" className="w-full h-full text-slate-800/20 fill-current">
              {/* Fake outline of simplified world geographic land masses */}
              <path d="M 12 15 Q 16 12 24 14 Q 28 8 36 12 Q 40 18 36 24 C 30 28 20 25 15 26 L 12 15 Z" />
              <path d="M 45 10 Q 52 8 62 12 Q 72 16 78 26 C 72 32 60 38 48 30 Z" />
              <path d="M 18 35 Q 24 38 28 45 L 20 48 Q 15 42 18 35 Z" />
              <path d="M 68 34 Q 72 38 85 40 L 80 44 L 62 42 Z" />
            </svg>

            {/* Glowing red ping threat pips (Eastern Europe target, North America target, Asia Pacific target) */}
            
            {/* Pip 1: North America */}
            <div className="absolute left-[24%] top-[34%]">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-450 border border-white" />
              <span className="absolute left-4 -top-2 bg-black/90 text-white text-[7.5px] border border-rose-500/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest whitespace-nowrap leading-none font-bold">
                Firewall Stress - North America
              </span>
            </div>

            {/* Pip 2: Eastern Europe/India Area */}
            <div className="absolute left-[52%] top-[24%]">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-450 border border-white" />
              <span className="absolute left-4 -top-2 bg-black/90 text-white text-[7.5px] border border-rose-500/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest whitespace-nowrap leading-none font-bold">
                Intrusion Attempt
              </span>
            </div>

            {/* Pip 3: Asia Pacific Area */}
            <div className="absolute left-[70%] top-[54%]">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75 animate-ping" strokeWidth="0.5" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-450 border border-white" />
              <span className="absolute left-4 -top-2 bg-black/90 text-white text-[7.5px] border border-rose-500/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest whitespace-nowrap leading-none font-bold">
                Anomaly Detected
              </span>
            </div>

          </div>

          {/* Central Title */}
          <div className="text-center absolute bottom-1 mt-4 z-10 bg-black/45 border border-zinc-900 px-4 py-1.5 rounded-full">
            <span className="text-[9px] uppercase font-mono text-rose-400 tracking-[0.2em] font-black">Threat Map</span>
          </div>

        </div>

        {/* RIGHT STATUS MODULES (3 COLS) */}
        <div className="lg:col-span-3 space-y-4">
          <GlassCard className="p-5 space-y-2 bg-[#0c1326]/35 border-r-4 border-r-rose-500">
            <span className="text-[9px] text-zinc-500 block font-bold uppercase tracking-wide">Active Threats Blocked</span>
            <h3 className="text-2xl font-black text-rose-400 font-mono">1,245 <span className="text-xs font-sans text-zinc-400 font-normal">Today</span></h3>
            <p className="text-[9.5px] text-zinc-450 uppercase font-bold">CYBER INTRUSIONS NEUTRALIZED</p>
          </GlassCard>

          <GlassCard className="p-5 space-y-2 bg-[#0c1326]/35">
            <span className="text-[9px] text-zinc-550 block font-bold uppercase tracking-wide">System Integrity</span>
            <h3 className="text-2xl font-black text-emerald-400 font-mono">ALL <span className="text-xs font-sans text-zinc-400 font-normal">Systems Safe</span></h3>
            <p className="text-[9.5px] text-zinc-450 uppercase font-bold">INTEGRITY MATRIX VERIFIED</p>
          </GlassCard>
        </div>

      </div>

      {/* LOWER TABULAR EVENT LOG OVERLAY TABLE */}
      <div className="mt-8 bg-[#070b13]/85 rounded-2xl border border-zinc-800 p-5 relative z-10">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3.5">
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Recent Security Events</span>
          <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
            <Clock size={11} className="text-rose-400" />
            ACTIVE SIGNAL STREAM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono text-zinc-400 uppercase leading-normal">
            <thead>
              <tr className="border-b border-zinc-900 font-bold text-zinc-500">
                <th className="py-2.5 text-left">Time</th>
                <th className="py-2.5 text-left">Event Type</th>
                <th className="py-2.5 text-left">Source</th>
                <th className="py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60 font-medium">
              {alertsList.map((item, i) => (
                <tr key={i} className="hover:bg-rose-500/5 transition-colors">
                  <td className="py-2.5 text-zinc-350">{item.time}</td>
                  <td className="py-2.5 text-zinc-100 font-bold">{item.type}</td>
                  <td className="py-2.5 text-zinc-450">{item.source}</td>
                  <td className={`py-2.5 text-right font-black ${item.color}`}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

