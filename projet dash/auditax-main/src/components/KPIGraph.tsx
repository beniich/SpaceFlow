import React from 'react';

export const KPIGraph = ({ data }: { data: number[] }) => {
  if (!data || data.length < 2) {
    return (
      <div className="h-32 w-full bg-slate-50 border border-brand-border rounded-xl flex flex-col items-center justify-center overflow-hidden">
         <h3 className="text-[11px] font-bold text-brand-text-muted uppercase tracking-[0.1em] mb-2">Tendance Conformité</h3>
         <span className="text-[10px] text-brand-text-muted uppercase tracking-widest">Données insuffisantes</span>
      </div>
    );
  }

  const max = 100;
  const min = Math.max(0, Math.min(...data) - 20); // Zoomer sur la variance
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 400;
    const y = 120 - ((val - min) / ((max - min) || 1)) * 120;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,120 ${points} 400,120`;

  return (
    <div className="relative h-32 w-full bg-white border border-brand-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-end">
        <svg viewBox="0 0 400 120" className="absolute bottom-0 w-full h-full preserve-3d" preserveAspectRatio="none">
          <polygon
            fill="url(#gradient)"
            points={areaPoints}
            className="opacity-20"
          />
          <polyline
            fill="none"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="1" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute top-4 left-4">
          <h3 className="text-[11px] font-bold text-brand-text-muted uppercase tracking-[0.1em]">Tendance Conformité Globale</h3>
        </div>
    </div>
  );
};
