import React, { useState } from 'react';
import { ArrowDown, Cpu, Leaf, Sparkles, ShieldCheck, Zap, Globe, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const [activeTab, setActiveTab] = useState('philosophy');

  return (
    <div className="min-h-screen bg-surface text-foreground p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Tech Mesh Circuit Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,219,231,0.08)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f38020]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00dbe7]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00dbe7] mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" /> Mission Control / Digital Roots
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="text-[#f38020]">BeeCarbonat</span> About - <span className="text-foreground">Digital Roots</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Where digital innovation meets ecological sustainability. Trace every byte, optimize every joule, and power a carbon-neutral infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/impact"
            className="px-4 py-2 rounded-xl bg-surface-alt hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-2 border border-border"
          >
            <Leaf className="w-4 h-4 text-emerald-400" /> Impact Report
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f38020] to-orange-600 hover:opacity-90 text-xs font-bold text-foreground transition shadow-lg shadow-orange-500/20"
          >
            Dashboard Exec
          </Link>
        </div>
      </div>

      {/* Main Interactive Digital Tree Visualizer Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column - Digital Tree Graphic & Cards */}
        <div className="lg:col-span-7 relative min-h-[500px] flex items-center justify-center p-6 rounded-2xl bg-surface/40 border border-border/80 backdrop-blur-xl">
          {/* Futuristic Circuit Tree Canvas Artwork */}
          <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
            {/* SVG Glowing Tree Roots */}
            <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[0_0_25px_rgba(0,219,231,0.3)]">
              <defs>
                <linearGradient id="treeGradOrange" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#f38020" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffaa40" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="treeGradCyan" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#00dbe7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#66f3ff" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Trunk */}
              <path d="M250 450 C250 350 240 280 250 200" stroke="url(#treeGradOrange)" strokeWidth="12" fill="none" strokeLinecap="round" />
              <path d="M250 450 C260 350 270 280 250 200" stroke="url(#treeGradCyan)" strokeWidth="8" fill="none" strokeLinecap="round" />

              {/* Branches (Orange Side) */}
              <path d="M250 300 C210 270 170 240 130 220" stroke="url(#treeGradOrange)" strokeWidth="6" fill="none" />
              <path d="M250 250 C200 210 150 170 100 130" stroke="url(#treeGradOrange)" strokeWidth="5" fill="none" />
              <path d="M250 220 C220 160 180 110 140 70" stroke="url(#treeGradOrange)" strokeWidth="4" fill="none" />

              {/* Branches (Cyan Side) */}
              <path d="M250 300 C290 270 330 240 370 220" stroke="url(#treeGradCyan)" strokeWidth="6" fill="none" />
              <path d="M250 250 C300 210 350 170 400 130" stroke="url(#treeGradCyan)" strokeWidth="5" fill="none" />
              <path d="M250 220 C280 160 320 110 360 70" stroke="url(#treeGradCyan)" strokeWidth="4" fill="none" />

              {/* Roots Bottom */}
              <path d="M250 450 C210 470 160 480 110 490" stroke="#f38020" strokeWidth="6" fill="none" />
              <path d="M250 450 C290 470 340 480 390 490" stroke="#00dbe7" strokeWidth="6" fill="none" />

              {/* Nodes */}
              <circle cx="130" cy="220" r="6" fill="#f38020" className="animate-ping" />
              <circle cx="100" cy="130" r="6" fill="#f38020" />
              <circle cx="140" cy="70" r="5" fill="#f38020" />
              <circle cx="370" cy="220" r="6" fill="#00dbe7" className="animate-ping" />
              <circle cx="400" cy="130" r="6" fill="#00dbe7" />
              <circle cx="360" cy="70" r="5" fill="#00dbe7" />
            </svg>

            {/* Glowing Core Pulse */}
            <div className="absolute w-24 h-24 bg-gradient-to-br from-[#f38020] to-[#00dbe7] rounded-full blur-xl opacity-40 animate-pulse" />
          </div>
        </div>

        {/* Right Column - Philosophy & Digital Roots Glass Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: The Carbonit Philosophy */}
          <div
            onClick={() => setActiveTab('philosophy')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
              activeTab === 'philosophy'
                ? 'bg-surface/80 border-[#f38020]/60 shadow-[0_0_30px_rgba(243,128,32,0.15)] scale-[1.02]'
                : 'bg-surface/40 border-border hover:border-border'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#f38020]/15 border border-[#f38020]/30 flex items-center justify-center text-[#f38020]">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#f38020]">Core Mission</span>
                <h3 className="text-lg font-bold text-foreground tracking-wide">THE CARBONIT PHILOSOPHY.</h3>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed font-light">
              Our mission at <span className="text-[#f38020] font-medium">BeeCarbonat</span> is to intertwine digital innovation with ecological sustainability, creating a carbon-neutral future through smart facility management and AI-driven telemetry.
            </p>
          </div>

          {/* Card 2: Digital Roots */}
          <div
            onClick={() => setActiveTab('roots')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
              activeTab === 'roots'
                ? 'bg-surface/80 border-[#00dbe7]/60 shadow-[0_0_30px_rgba(0,219,231,0.15)] scale-[1.02]'
                : 'bg-surface/40 border-border hover:border-border'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#00dbe7]/15 border border-[#00dbe7]/30 flex items-center justify-center text-[#00dbe7]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#00dbe7]">Infrastructure</span>
                <h3 className="text-lg font-bold text-foreground tracking-wide">DIGITAL ROOTS.</h3>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed font-light">
              We trace every byte and every joule, optimizing energy flows to nurture a greener planet, just as roots nourish a tree. Real-time IoT sensors synchronize building assets with zero carbon latency.
            </p>
          </div>

          {/* Card 3: Quantum Security & Sustainability */}
          <div className="p-6 rounded-2xl bg-surface/40 border border-border backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Security Layer: Quantum-Safe</span>
              <span className="text-[#00dbe7]">100% Uptime</span>
            </div>
            <div className="w-full bg-surface-alt h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#f38020] to-[#00dbe7] h-full w-[94%]" />
            </div>
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Energy Efficiency Index</span>
              <span className="font-mono text-foreground font-semibold">98.4 / 100</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Floating Scroll Indicator */}
      <div className="mt-12 text-center relative z-10">
        <Link
          to="/case-studies"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
        >
          <span>Explore Success Stories</span>
          <ArrowDown className="w-4 h-4 text-[#f38020] animate-bounce" />
        </Link>
      </div>
    </div>
  );
}
