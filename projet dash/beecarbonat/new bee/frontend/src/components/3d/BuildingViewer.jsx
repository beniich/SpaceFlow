import { useState } from 'react';
import { Layers, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function BuildingViewer({ buildingName, floors = [], selectedFloor, onSelectFloor }) {
  const currentFloorData = floors.find(f => f.number === selectedFloor) || floors[0];

  return (
    <div className="bg-zinc-900 border border-zinc-800 font-mono text-xs overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
        <h3 className="font-bold font-display uppercase tracking-wider text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" /> Plan dynamique 3D/2D - {buildingName} (Étage {selectedFloor})
        </h3>
        <div className="flex gap-1">
          {floors.map(f => (
            <button
              key={f.number}
              onClick={() => onSelectFloor(f.number)}
              className={`w-8 h-8 text-xs font-bold transition ${
                selectedFloor === f.number
                  ? 'bg-cyan-500 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              {f.number}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-96 bg-zinc-950 p-6 flex items-center justify-center">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Fond bâtiment */}
          <rect x="40" y="40" width="720" height="320" fill="#09090b" stroke="#27272a" strokeWidth="2" rx="4" />
          
          {/* Couloir central */}
          <rect x="40" y="180" width="720" height="40" fill="#18181b" stroke="#27272a" />
          <text x="400" y="205" textAnchor="middle" fill="#a1a1aa" fontSize="11" fontWeight="bold" fontFamily="monospace">
            COULLOIR PRINCIPAL - ÉTAGE {selectedFloor}
          </text>

          {/* Salles / Espaces */}
          {currentFloorData?.spaces?.map((space, i) => {
            const x = 50 + (i % 5) * 140;
            const y = i < 5 ? 50 : 230;
            const isOccupied = space.status === 'occupied';
            return (
              <g key={space.id || i}>
                <rect
                  x={x} y={y}
                  width="125" height="120"
                  fill={isOccupied ? '#451a03' : '#022c22'}
                  stroke={isOccupied ? '#f59e0b' : '#10b981'}
                  strokeWidth="1.5"
                  rx="4"
                  className="cursor-pointer hover:opacity-90 transition"
                />
                <text x={x + 62} y={y + 40} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#f4f4f5" fontFamily="monospace">
                  {space.name}
                </text>
                <text x={x + 62} y={y + 65} textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="monospace">
                  {space.type || 'Bureau'}
                </text>
                <text x={x + 62} y={y + 90} textAnchor="middle" fontSize="10" fill={isOccupied ? '#fef3c7' : '#a7f3d0'} fontFamily="monospace">
                  {isOccupied ? 'Occupé' : 'Libre'} • {space.temperature ? space.temperature.toFixed(1) : '21.5'}°C
                </text>
              </g>
            );
          })}

          {/* Équipements / Capteurs IoT */}
          {currentFloorData?.assets?.map((asset, i) => (
            <g key={asset.id || i}>
              <circle
                cx={120 + i * 160} cy={200}
                r="8"
                fill={asset.health > 70 ? '#10b981' : asset.health > 40 ? '#f59e0b' : '#ef4444'}
                className="animate-pulse"
              />
              <text x={120 + i * 160} y={180} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f4f4f5" fontFamily="monospace">
                {asset.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2 font-mono">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 bg-emerald-500" /> Espaces Libres
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 bg-amber-500" /> Espaces Occupés
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" /> Capteurs IoT Actifs
          </span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Synchro temps réel WebSocket
        </div>
      </div>
    </div>
  );
}
