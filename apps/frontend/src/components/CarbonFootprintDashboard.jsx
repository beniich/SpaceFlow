import React, { useEffect, useState } from "react";

function StatCardCO2() {
  return (
    <div 
      className="absolute top-8 left-8 w-64 rounded-xl border border-cyan-500/30 bg-slate-950/45 backdrop-blur-md p-4 shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300 hover:border-cyan-400/50"
      style={{
        transform: "perspective(1000px) rotateX(12deg) rotateY(18deg)",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="text-cyan-400/80 text-xs font-mono tracking-wider uppercase">Total CO₂ Reduced:</div>
      <div className="text-orange-400 text-4xl font-bold leading-none mt-1 select-none font-mono drop-shadow-[0_0_10px_rgba(251,146,60,0.3)]">
        12,450
      </div>
      <div className="text-cyan-100/60 text-[10px] uppercase font-mono tracking-wider mt-1">Metric Tons</div>
      
      {/* Mini Chart */}
      <div className="flex items-end justify-between mt-4 pt-2 border-t border-zinc-800/40">
        <div className="flex items-end gap-1.5 h-8">
          {[6, 12, 9, 16, 11, 20, 15].map((h, i) => (
            <div 
              key={i} 
              className="w-1.5 bg-orange-500/80 rounded-t-sm" 
              style={{ height: `${h * 1.2}px` }}
            />
          ))}
        </div>
        <svg width="60" height="26" viewBox="0 0 60 26" className="overflow-visible">
          <path 
            d="M0 20 L10 10 L20 15 L30 5 L40 12 L50 2" 
            stroke="#22d3ee" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]"
          />
        </svg>
      </div>
    </div>
  );
}

function EfficiencyGauge({ value = 92 }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 200);
    return () => clearTimeout(t);
  }, [value]);

  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (animated / 100) * c;

  return (
    <div 
      className="absolute bottom-8 right-8 w-64 rounded-xl border border-cyan-500/30 bg-slate-950/45 backdrop-blur-md p-4 shadow-[0_0_30px_rgba(34,211,238,0.15)] flex items-center justify-between transition-all duration-300 hover:border-cyan-400/50"
      style={{
        transform: "perspective(1000px) rotateX(12deg) rotateY(-18deg)",
        transformStyle: "preserve-3d",
      }}
    >
      <div>
        <div className="text-cyan-400/80 text-xs font-mono tracking-wider uppercase">Efficiency Score:</div>
        <div className="text-cyan-300 text-4xl font-bold leading-none mt-1 font-mono drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
          {value}%
        </div>
      </div>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r={r} stroke="#0e7490" strokeWidth="5" fill="none" opacity={0.25} />
          <circle
            cx="32"
            cy="32"
            r={r}
            stroke="#22d3ee"
            strokeWidth="5"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ 
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: "drop-shadow(0 0 4px rgba(34,211,238,0.6))"
            }}
          />
        </svg>
      </div>
    </div>
  );
}

function WindTurbine({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#22d3ee" strokeWidth="1.2" fill="none" opacity={0.95}>
      {/* Tower */}
      <line x1="0" y1="0" x2="0" y2="-45" stroke="#22d3ee" strokeWidth="1.8" />
      <line x1="-3" y1="0" x2="3" y2="0" stroke="#22d3ee" strokeWidth="1.5" />
      
      {/* Rotator Blades */}
      <g transform="translate(0 -45)">
        <g className="animate-spin-slow" style={{ transformOrigin: "0px 0px" }}>
          <line x1="0" y1="0" x2="0" y2="-20" stroke="#e0f2fe" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="17.3" y2="10" stroke="#e0f2fe" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="-17.3" y2="10" stroke="#e0f2fe" strokeWidth="1.5" />
        </g>
        <circle cx="0" cy="0" r="2.5" fill="#facc15" stroke="#22d3ee" strokeWidth="1" />
      </g>
    </g>
  );
}

function SolarPanels({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Support Stand */}
      <line x1="0" y1="0" x2="0" y2="-8" stroke="#475569" strokeWidth="2" />
      <line x1="-8" y1="0" x2="8" y2="0" stroke="#475569" strokeWidth="1.5" />
      
      {/* Isometric Panels Slabs */}
      <g transform="translate(0 -8)">
        <polygon points="-18,-12 18,-12 12,-2 -12,-2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
        {/* Cells Grid */}
        <line x1="-6" y1="-12" x2="-4" y2="-2" stroke="#0284c7" strokeWidth="0.8" />
        <line x1="6" y1="-12" x2="4" y2="-2" stroke="#0284c7" strokeWidth="0.8" />
        <line x1="0" y1="-12" x2="0" y2="-2" stroke="#0284c7" strokeWidth="0.8" />
        <line x1="-15" y1="-7" x2="15" y2="-7" stroke="#0284c7" strokeWidth="0.8" />
      </g>
    </g>
  );
}

function FactoryStacks({ x, y, scale = 1, color = "#22d3ee" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Building base blocks (isometric) */}
      <polygon points="-16,0 0,-8 0,-18 -16,-10" fill="#0f172a" stroke={color} strokeWidth="1.2" />
      <polygon points="0,0 16,-8 16,-18 0,-10" fill="#1e293b" stroke={color} strokeWidth="1.2" />
      <polygon points="-16,-10 0,-18 16,-18 0,-10" fill="#334155" stroke={color} strokeWidth="1.2" />
      
      {/* Chimney Stacks */}
      <g transform="translate(-6, -13)">
        <rect x="-2" y="-14" width="4.5" height="14" fill="#1e293b" stroke={color} strokeWidth="1" />
        <line x1="-2" y1="-10" x2="2.5" y2="-10" stroke={color} strokeWidth="0.8" />
        <circle cx="0.25" cy="-17" r="2.5" fill={color} opacity="0.8" className="animate-pulse" />
      </g>
      <g transform="translate(6, -9)">
        <rect x="-2" y="-12" width="4.5" height="12" fill="#0f172a" stroke={color} strokeWidth="1" />
        <line x1="-2" y1="-8" x2="2.5" y2="-8" stroke={color} strokeWidth="0.8" />
        <circle cx="0.25" cy="-15" r="2" fill={color} opacity="0.6" />
      </g>
    </g>
  );
}

function PylonTower({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#64748b" strokeWidth="1" fill="none" opacity={0.85}>
      {/* Lattice Structure legs */}
      <line x1="-10" y1="0" x2="-3" y2="-36" />
      <line x1="10" y1="0" x2="3" y2="-36" />
      <line x1="-3" y1="-36" x2="3" y2="-36" />
      
      {/* Diagonal supports */}
      <line x1="-10" y1="0" x2="6.5" y2="-18" />
      <line x1="10" y1="0" x2="-6.5" y2="-18" />
      <line x1="-6.5" y1="-18" x2="3" y2="-36" />
      <line x1="6.5" y1="-18" x2="-3" y2="-36" />
      
      {/* Crossarms */}
      <line x1="-16" y1="-24" x2="16" y2="-24" stroke="#475569" strokeWidth="1.2" />
      <line x1="-12" y1="-32" x2="12" y2="-32" stroke="#475569" strokeWidth="1.2" />
      
      {/* Insulator cups */}
      <circle cx="-16" cy="-21" r="1.5" fill="#38bdf8" />
      <circle cx="16" cy="-21" r="1.5" fill="#38bdf8" />
      <circle cx="-12" cy="-29" r="1.5" fill="#38bdf8" />
      <circle cx="12" cy="-29" r="1.5" fill="#38bdf8" />
    </g>
  );
}

function FloatingPlatform({ x, y, scale = 1, children }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Glowing base under platform */}
      <ellipse cx="0" cy="12" rx="36" ry="15" fill="none" stroke="#f97316" strokeWidth="3" filter="url(#glow)" opacity={0.6} />
      {/* Solid platform body */}
      <ellipse cx="0" cy="4" rx="34" ry="14" fill="#040d1a" stroke="#22d3ee" strokeWidth="1.8" />
      <ellipse cx="0" cy="0" rx="34" ry="14" fill="#071524" stroke="#1e293b" strokeWidth="1" />
      {children}
    </g>
  );
}

function SmallHouse({ x = 0, y = -6, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Isometric tiny house */}
      <polygon points="-10,0 0,-6 10,0 10,10 0,16 -10,10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
      <polygon points="0,-6 10,0 10,10 0,4" fill="#334155" stroke="#38bdf8" strokeWidth="1" />
      {/* Roof */}
      <polygon points="-10,0 0,-6 0,-14 -10,-8" fill="#f97316" stroke="#fdba74" strokeWidth="1" />
      <polygon points="0,-6 10,0 10,-8 0,-14" fill="#c2410c" stroke="#fdba74" strokeWidth="1" />
    </g>
  );
}

export default function CarbonFootprintDashboard() {
  // Footprint outline path coordinates
  const footprintPath =
    "M 210 430 " +
    "C 150 430, 110 380, 120 320 " +
    "C 128 270, 175 250, 200 210 " +
    "C 225 170, 210 120, 250 90 " +
    "C 290 60, 350 65, 375 100 " +
    "C 400 135, 385 175, 410 205 " +
    "C 440 240, 500 235, 540 210 " +
    "C 580 185, 610 145, 650 140 " +
    "C 690 135, 720 165, 715 200 " +
    "C 710 235, 670 250, 660 285 " +
    "C 650 320, 680 350, 660 385 " +
    "C 635 425, 570 420, 520 400 " +
    "C 460 375, 420 400, 370 415 " +
    "C 310 432, 260 430, 210 430 Z";

  const circuitLines = [
    "M 180 380 L 260 380 L 300 340 L 380 340",
    "M 260 380 L 260 300 L 320 260",
    "M 380 340 L 440 340 L 480 300",
    "M 320 260 L 400 220 L 400 160",
    "M 480 300 L 560 300 L 600 260",
    "M 400 160 L 460 130",
    "M 600 260 L 660 260 L 690 220",
    "M 220 300 L 180 260 L 180 200",
    "M 480 300 L 520 340 L 600 360",
  ];

  // Helper projection function from 2D flat coordinates to Isometric screen coordinates
  // tx = 380, ty = 30
  const project = (x, y, zOffset = 0) => {
    const screenX = 0.866 * x - 0.866 * y + 380;
    const screenY = 0.5 * x + 0.5 * y + 30 - zOffset;
    return { x: screenX, y: screenY };
  };

  return (
    <div className="relative w-full aspect-square max-w-4xl mx-auto bg-black rounded-2xl overflow-hidden border border-zinc-800/80 shadow-[0_0_80px_rgba(6,182,212,0.05)] select-none">
      {/* Styles for rotating blades */}
      <style>
        {`
          @keyframes spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-cw 10s linear infinite;
          }
        `}
      </style>

      {/* Futuristic glow background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          background: "radial-gradient(circle at 50% 50%, rgba(8,47,73,0.3) 0%, rgba(2,6,23,0.85) 60%, rgba(0,0,0,1) 100%)" 
        }} 
      />

      <svg viewBox="0 0 1000 700" className="relative w-full h-full">
        <defs>
          {/* Neon Glow Filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ================= 3D PLATFORM EXTRUSION ================= */}
        {/* Bottom edge shadow / thickness */}
        <g transform="translate(0, 24) matrix(0.866 0.5 -0.866 0.5 380 30)" opacity={0.6}>
          <path d={footprintPath} fill="#180c05" stroke="#f97316" strokeWidth="8" filter="url(#glow)" />
        </g>
        <g transform="translate(0, 16) matrix(0.866 0.5 -0.866 0.5 380 30)" opacity={0.8}>
          <path d={footprintPath} fill="#051524" stroke="#22d3ee" strokeWidth="4" />
        </g>
        <g transform="translate(0, 8) matrix(0.866 0.5 -0.866 0.5 380 30)" opacity={0.9}>
          <path d={footprintPath} fill="#030f1d" stroke="#1e293b" strokeWidth="2" />
        </g>

        {/* Top Footprint Platform Surface */}
        <g transform="matrix(0.866 0.5 -0.866 0.5 380 30)">
          {/* Main platform face */}
          <path d={footprintPath} fill="#040c16" stroke="#22d3ee" strokeWidth="2.5" />
          {/* Inner neon border */}
          <path d={footprintPath} fill="none" stroke="#f97316" strokeWidth="1" opacity={0.5} />

          {/* Circuit board traces */}
          <g filter="url(#glow)">
            {circuitLines.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={i % 2 === 0 ? "#22d3ee" : "#f97316"}
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity={0.8}
              />
            ))}
          </g>

          {/* Glowing node junctions */}
          {[
            [260, 380], [300, 340], [380, 340], [320, 260], [400, 220],
            [480, 300], [600, 260], [180, 260], [660, 260], [400, 160],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={3.5} fill="#facc15" filter="url(#glow)" />
          ))}

          {/* Flat projected Chip socket */}
          <g transform="translate(370, 200)">
            <rect x="-4" y="-4" width="48" height="48" rx="4" fill="none" stroke="#f97316" strokeWidth="1.5" filter="url(#glow)" opacity={0.5} />
            <rect x="0" y="0" width="40" height="40" rx="3" fill="#020617" stroke="#22d3ee" strokeWidth="2" />
            <rect x="10" y="10" width="20" height="20" rx="2" fill="#22d3ee" filter="url(#glow)" opacity={0.7} className="animate-pulse" />
          </g>
        </g>

        {/* ================= CONNECTIVE GLOW LINES TO SATELLITE DISCS ================= */}
        <g stroke="#22d3ee" strokeWidth="2" fill="none" opacity={0.65} filter="url(#glow)" strokeLinecap="round">
          {/* From footprint edge to platforms */}
          <path d={`M ${project(500, 205).x} ${project(500, 205).y} C ${project(520, 180).x} ${project(520, 180).y}, ${project(540, 160).x} ${project(540, 160).y}, 650 200`} />
          <path d={`M 650 200 C 700 230, 720 250, 780 260`} />
          <path d={`M 780 260 C 810 270, 840 280, 890 320`} />
        </g>

        {/* ================= SATELLITE FLOATING PLATFORMS ================= */}
        <FloatingPlatform x={650} y={200} scale={0.9}>
          <FactoryStacks x={0} y={0} scale={0.8} />
        </FloatingPlatform>
        <FloatingPlatform x={780} y={260} scale={0.78}>
          <PylonTower x={0} y={4} scale={0.65} />
        </FloatingPlatform>
        <FloatingPlatform x={890} y={320} scale={0.68}>
          <SmallHouse scale={0.85} />
        </FloatingPlatform>

        {/* ================= BILLBOARD STANDING STRUCTURES (UPRIGHT) ================= */}
        {/* Wind Turbines */}
        <WindTurbine x={project(285, 135).x} y={project(285, 135).y} scale={1.4} />
        <WindTurbine x={project(325, 125).x} y={project(325, 125).y} scale={1.15} />

        {/* Solar Panels */}
        <SolarPanels x={project(370, 160).x} y={project(370, 160).y} scale={1.4} />

        {/* Factory Stacks */}
        <FactoryStacks x={project(470, 140).x} y={project(470, 140).y} scale={1.15} />
        <FactoryStacks x={project(220, 370).x} y={project(220, 370).y} scale={1.25} color="#86efac" />
        <FactoryStacks x={project(560, 330).x} y={project(560, 330).y} scale={1.05} />

        {/* Pylon / Transmission Towers */}
        <PylonTower x={project(330, 220).x} y={project(330, 220).y} scale={1.05} />
        <PylonTower x={project(430, 260).x} y={project(430, 260).y} scale={0.95} />
        <PylonTower x={project(610, 230).x} y={project(610, 230).y} scale={0.9} />

        {/* Orbiting rings hud graphic */}
        <g transform="translate(140, 240)" stroke="#67e8f9" strokeWidth="1" fill="none" opacity={0.4} filter="url(#glow)">
          <circle r="12" />
          <circle r="12" cx="22" />
          <circle r="12" cx="11" cy="19" />
        </g>

        {/* HUD hex decors */}
        <g transform="translate(850 110)" stroke="#67e8f9" strokeWidth="1" fill="none" opacity={0.5} filter="url(#glow)">
          <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" />
        </g>
        <g fill="#22d3ee" opacity={0.25}>
          {[0, 1, 2, 3, 4].map((row) => (
            <rect key={row} x="822" y={140 + row * 6} width={28 + (row % 2) * 8} height="2.2" />
          ))}
        </g>
        <g fill="#22d3ee" opacity={0.25}>
          {[0, 1, 2, 3].map((row) => (
            <rect key={row} x="90" y={380 + row * 6} width={34 + (row % 3) * 6} height="2.2" />
          ))}
        </g>
      </svg>

      {/* Floating 3D HUD stats cards */}
      <StatCardCO2 />
      <EfficiencyGauge value={92} />
    </div>
  );
}
