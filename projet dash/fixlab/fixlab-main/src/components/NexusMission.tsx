import React, { useState } from "react";
import { Server, Globe, Shield, Sparkles, Sliders, ArrowRight, Activity, HelpCircle } from "lucide-react";

interface MissionProps {
  isLightMode: boolean;
  onNavigate: (tabId: string) => void;
  showToast: (msg: string) => void;
}

export function NexusMission({ isLightMode, onNavigate, showToast }: MissionProps) {
  const [showDetailApproach, setShowDetailApproach] = useState(false);

  return (
    <div className="space-y-8 relative z-10 animate-fade-in text-left">
      
      {/* Server Rack Simulation Panels Header with Curved Waves from Image 2 */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0c0a1a] border border-neutral-900 shadow-2xl h-[240px] flex flex-col justify-end p-8">
        {/* Abstract Background server chassis grids using HTML/CSS */}
        <div className="absolute inset-0 grid grid-cols-12 gap-2 opacity-20 p-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded flex items-center justify-around p-1">
              <span className={`w-1 h-1 rounded-full ${i % 3 === 0 ? "bg-emerald-500 animate-pulse" : i % 5 === 0 ? "bg-[#ff5a00]" : "bg-neutral-700"}`} />
              <span className={`w-1 h-3 rounded-sm ${i % 4 === 0 ? "bg-blue-400" : "bg-neutral-800"}`} />
            </div>
          ))}
        </div>

        {/* Diagonal glowing laser lines */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-tr from-[#ff5a00]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Master Curved Wave Divider (SVG-drawn waves) inside the rack container */}
        <div className="absolute bottom-0 inset-x-0">
          <svg className="w-full text-[#08090b] h-12 preserve-aspect-ratio-none" viewBox="0 0 1440 120" fill="currentColor">
            <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"></path>
          </svg>
        </div>

        {/* Header Hero texts */}
        <div className="relative z-10 space-y-2 mb-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#ff5a00] font-black">[ MISSION & VISION GENERALE ]</span>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white leading-none">
            Our Mission and Vision
          </h2>
          <p className="text-stone-400 text-xs tracking-wide">
            Securing the Future of Connected Devices
          </p>
        </div>
      </div>

      {/* Two-column layout: Left (Pioneering Sovereign Security) / Right (The Challenge of Hyper-Connectivity with globe) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
        
        {/* Left Column: pioneering details */}
        <div className="lg:col-span-7 p-8 rounded-[2rem] bg-[#0c0a1a]/60 border border-neutral-900/60 flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-[#ff5a00] font-mono text-[10px] uppercase font-bold">
              <Server className="w-4 h-4" /> Pioneering Sovereign Security
            </div>
            <p className="text-stone-300 text-sm leading-relaxed font-sans">
              At FixLab, our mission is to empower organizations with absolute control over their device ecosystems. In an increasingly interconnected world, we believe that data sovereignty and robust security are the cornerstones of a trusted digital future. 
            </p>
            <p className="text-stone-400 text-xs leading-relaxed font-sans mt-2">
              We build the foundations of a self-managed network where each hardware controller becomes a hermetic anchor, immune to signature spoofing attempts.
            </p>

            {showDetailApproach && (
              <div className="p-4 bg-black/40 border border-neutral-900 rounded-2xl text-[11.5px] text-stone-500 space-y-2 leading-relaxed animate-fade-in font-mono">
                <div>[ SPATIAL SEC METHOD_A5 ]</div>
                <div>✓ Hardware encryption via local elliptical token injection.</div>
                <div>✓ Decentralized validation of physical control transactions.</div>
                <div>✓ Automatic neutralization of indeterminate transponders.</div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setShowDetailApproach(!showDetailApproach);
              showToast(showDetailApproach ? "Protocols closed." : "Isolation model displayed.");
            }}
            className="w-full md:w-auto font-mono text-[9px] font-black uppercase tracking-widest bg-[#ff5a00]/10 hover:bg-[#ff5a00]/25 text-[#ff5a00] border border-[#ff5a00]/20 py-3 px-6 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-[#ff5a00]" />
            {showDetailApproach ? "Hide Details" : "Learn more about our approach"}
          </button>
        </div>

        {/* Right Column: Challenge of hypery-connectivity with dynamic 3D globe visualization in SVG */}
        <div className="lg:col-span-5 p-8 rounded-[2rem] bg-[#0c0a1a]/60 border border-neutral-950/80 flex flex-col justify-between space-y-6 text-left relative overflow-hidden">
          
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 text-rose-500 font-mono text-[10px] uppercase font-bold">
              <Globe className="w-4 h-4" /> The Challenge of Hyper-Connectivity
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              The proliferation of devices creates complex security landscapes. We address this by providing a unified, intelligent platform that simplifies management and ensures compliance, turning potential vulnerabilities into strengths.
            </p>
          </div>

          {/* Orbiting SVG Globe illustration (Image 2 mesh globe asset) styled with CSS */}
          <div className="relative w-full h-[180px] flex items-center justify-center pointer-events-none mt-2">
            <svg className="w-[150px] h-[150px]" viewBox="0 0 100 100">
              {/* Spinning keyframes are preconfigured in index.css inside .node-3d-core-animation */}
              <g className="node-3d-core-animation" style={{ transformOrigin: "50px 50px" }}>
                {/* Globe boundaries */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 90, 0, 0.08)" strokeWidth="1" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 90, 0, 0.15)" strokeWidth="0.5" strokeDasharray="3,3" />
                
                {/* Latitudinal Ellipses */}
                <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="rgba(255, 90, 0, 0.25)" strokeWidth="0.75" />
                <ellipse cx="50" cy="50" rx="45" ry="30" fill="none" stroke="rgba(255, 90, 0, 0.15)" strokeWidth="0.7" strokeDasharray="1,2" />
                <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="rgba(255, 90, 0, 0.25)" strokeWidth="0.75" />
                <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke="rgba(255, 90, 0, 0.15)" strokeWidth="0.7" strokeDasharray="1,2" />

                {/* Pulsing Interconnected core sensors */}
                <circle cx="50" cy="50" r="4" fill="#ff5a00" className="animate-pulse" />
                <circle cx="50" cy="10" r="3" fill="#ff5a00" />
                <circle cx="50" cy="90" r="3" fill="#e1005a" />
                <circle cx="5" fill="#00ffff" cy="50" r="2.5" />
                <circle cx="95" fill="#00ffff" cy="50" r="2.5" />
                
                {/* Connection links */}
                <path d="M 50 10 L 50 50 M 50 90 L 50 50 M 5 50 L 50 50 M 95 50 L 50 50" stroke="rgba(255, 90, 0, 0.15)" strokeWidth="0.5" />
              </g>
            </svg>
            
            {/* Ambient shadow ring */}
            <div className="absolute w-[180px] h-3 bg-[#ff5a00]/5 hover:bg-[#ff5a00]/10 rounded-full blur-sm bottom-0 transition-colors" />
          </div>

          <div className="bg-black/35 py-2.5 px-4 rounded-xl border border-neutral-900 text-center font-mono text-[8px] text-[#ff5a00] uppercase font-bold tracking-widest">
            GLOBAL NEXUS MESH : SECURED
          </div>

        </div>

      </div>

      {/* Our Core Values Section (Image 2, bottom element) */}
      <div className="space-y-4 pt-6">
        <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest block text-center">// Our Core Values //</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Integrity */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#090812]/50 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-black text-sm text-white uppercase tracking-wider">Integrity</h4>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Unwavering commitment to data privacy and trust. Your connection secrets never leave your local sovereign space.
            </p>
          </div>

          {/* Innovation */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#090812]/50 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#e1005a]/10 border border-[#e1005a]/20 flex items-center justify-center text-[#e1005a]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-black text-sm text-white uppercase tracking-wider">Innovation</h4>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Constantly pushing the boundaries of security technology. Passive AI integration to predict interferences.
            </p>
          </div>

          {/* Control */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#090812]/50 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ffff]/10 border border-[#00ffff]/20 flex items-center justify-center text-[#00ffff]">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-black text-sm text-white uppercase tracking-wider">Control</h4>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Giving you the tools to govern your infrastructure with confidence. Selective isolation controls for your zones.
            </p>
          </div>

        </div>
      </div>

      {/* CTA Orange Container at the bottom from Image 2 */}
      <div className="rounded-[2rem] bg-gradient-to-r from-[#ff7e00] to-[#ff5a00] p-8 text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_40px_rgba(255,90,0,0.2)]">
        <div className="space-y-2">
          <h4 className="text-xl md:text-2xl font-sans font-black text-white uppercase tracking-tight">
            Join the Sovereign Future
          </h4>
          <p className="text-white/80 text-xs font-sans max-w-xl">
            Experience the power of the FixLab platform and secure your infrastructure today.
          </p>
        </div>

        <button
          onClick={() => {
            onNavigate("laboratoire");
            showToast("Navigation vers les solutions du laboratoire.");
          }}
          className="shrink-0 bg-white hover:bg-neutral-100 text-[#ff5a00] px-6 py-3.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest shadow-lg hover:translate-x-1 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          Explorer la plateforme
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

