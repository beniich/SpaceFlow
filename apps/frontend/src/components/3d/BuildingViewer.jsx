import { useState } from 'react';
import { Layers, Activity, AlertTriangle, ShieldCheck, Thermometer, Eye, Wind, Users2 } from 'lucide-react';

export default function BuildingViewer({ buildingName, floors = [], selectedFloor, onSelectFloor }) {
  const currentFloorData = floors.find(f => f.number === selectedFloor) || floors[0];
  const [hoveredSpace, setHoveredSpace] = useState(null);

  return (
    <div className="bg-zinc-900 border border-zinc-800 font-mono text-xs overflow-hidden rounded-xl">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
        <h3 className="font-bold font-display uppercase tracking-wider text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-cyan animate-pulse" /> Digital Twin Floor Viewer - {buildingName} (Floor {selectedFloor})
        </h3>
        <div className="flex gap-1.5">
          {floors.map(f => (
            <button
              key={f.number}
              onClick={() => onSelectFloor(f.number)}
              className={`w-8 h-8 text-xs font-bold transition rounded ${
                selectedFloor === f.number
                  ? 'bg-brand-cyan text-zinc-950 font-bold shadow-[0_0_8px_rgba(0,219,231,0.4)]'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              L{f.number}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[440px] bg-[#050b14] p-6 flex items-center justify-center overflow-hidden">
        {/* Grid pattern background to look like a draft blueprint */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #00dbe7 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        <svg viewBox="0 0 800 400" className="w-full h-full z-10 select-none">
          {/* Blueprint Border */}
          <rect x="20" y="20" width="760" height="360" fill="none" stroke="#00dbe7" strokeWidth="1" strokeDasharray="5 5" opacity="0.2" />
          
          {/* External Walls */}
          <rect x="40" y="40" width="720" height="320" fill="none" stroke="#1e293b" strokeWidth="4" opacity="0.8" />
          
          {/* Main corridor line */}
          <line x1="40" y1="200" x2="760" y2="200" stroke="#00dbe7" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
          <text x="400" y="205" textAnchor="middle" fill="#00dbe7" opacity="0.4" fontSize="9" fontWeight="bold" letterSpacing="0.1em">
            CENTRAL CORRIDOR / ESCAPE ROUTE - L{selectedFloor}
          </text>

          {/* Salles / Espaces */}
          {currentFloorData?.spaces?.map((space, i) => {
            const cols = 4;
            const w = 150;
            const h = 110;
            const gapX = 30;
            const gapY = 60;
            
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            const x = 60 + col * (w + gapX);
            const y = row === 0 ? 50 : 230;
            
            const isOccupied = space.status === 'occupied';
            const isHovered = hoveredSpace?.id === space.id;
            
            // Custom room color based on simulated CO2/Temp
            const fillCol = isOccupied ? 'rgba(243, 128, 32, 0.08)' : 'rgba(0, 219, 231, 0.05)';
            const borderCol = isOccupied ? '#f38020' : '#00dbe7';
            
            return (
              <g 
                key={space.id || i}
                onMouseEnter={() => setHoveredSpace({
                  ...space,
                  co2: 400 + Math.floor(Math.random() * 450),
                  humidity: 45 + Math.floor(Math.random() * 15),
                  damper: isOccupied ? '75% Open' : '15% Eco'
                })}
                onMouseLeave={() => setHoveredSpace(null)}
                className="cursor-pointer"
              >
                {/* Background Room Shape */}
                <rect
                  x={x} y={y}
                  width={w} height={h}
                  fill={isHovered ? 'rgba(0, 219, 231, 0.12)' : fillCol}
                  stroke={borderCol}
                  strokeWidth={isHovered ? 2 : 1.5}
                  rx="6"
                  className="transition-all duration-200"
                />
                
                {/* Internal room guidelines to look like architectural schema */}
                <path d={`M ${x} ${y + 20} L ${x + 20} ${y} M ${x + w - 20} ${y} L ${x + w} ${y + 20}`} stroke={borderCol} strokeWidth="1" opacity="0.3" />

                <text x={x + 12} y={y + 30} fontSize="11" fontWeight="bold" fill="#f4f4f5" className="font-mono">
                  {space.name}
                </text>
                
                <text x={x + 12} y={y + 50} fontSize="9" fill={isOccupied ? '#fbbf24' : '#a1a1aa'} className="font-mono uppercase opacity-85">
                  {space.type || 'Office Space'}
                </text>

                {/* Live temperature badge within room */}
                <g transform={`translate(${x + 12}, ${y + 70})`}>
                  <rect width="55" height="18" rx="3" fill="#090d16" stroke={borderCol} strokeWidth="0.5" opacity="0.8" />
                  <text x="27.5" y="12" textAnchor="middle" fontSize="9" fontWeight="bold" fill={isOccupied ? '#fbbf24' : '#00dbe7'} className="font-mono">
                    {space.temperature ? space.temperature.toFixed(1) : '21.5'}°C
                  </text>
                </g>

                {/* Occupancy Indicator Dot */}
                <circle cx={x + w - 20} cy={y + 25} r="4" fill={isOccupied ? '#f38020' : '#10b981'} className="animate-pulse" />
              </g>
            );
          })}

          {/* Sourced Assets overlay */}
          {currentFloorData?.assets?.map((asset, i) => {
            const xPos = 140 + i * 220;
            return (
              <g key={asset.id || i} transform={`translate(${xPos}, 190)`}>
                <rect x="-40" y="-10" width="80" height="20" rx="4" fill="#050b14" stroke="#e4e4e7" strokeWidth="0.5" opacity="0.8" />
                <circle cx="-30" cy="0" r="3" fill={asset.health > 70 ? '#10b981' : '#f59e0b'} className="animate-ping" />
                <circle cx="-30" cy="0" r="3" fill={asset.health > 70 ? '#10b981' : '#f59e0b'} />
                <text x="5" y="4" fontSize="8" fontWeight="bold" fill="#e4e4e7" className="font-mono">{asset.name}</text>
              </g>
            );
          })}
        </svg>

        {/* Real-time floating HUD Panel at the side matching Image 4 */}
        <div className="absolute top-4 right-4 bg-[#09121f]/95 border border-cyan-500/30 rounded-xl p-4 w-64 shadow-[0_0_15px_rgba(0,219,231,0.15)] backdrop-blur-md z-20 transition-all duration-300">
          <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2 mb-2.5">
            <Activity className="w-4 h-4 text-brand-cyan" />
            <span className="font-bold text-zinc-100 uppercase tracking-wider text-[10px]">ROOM TELEMETRY HUD</span>
          </div>
          
          {hoveredSpace ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Location:</span>
                <span className="font-bold text-zinc-100">{hoveredSpace.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Zone Type:</span>
                <span className="text-brand-cyan uppercase font-bold">{hoveredSpace.type || 'Office'}</span>
              </div>
              
              <div className="h-[1px] bg-zinc-800/80 my-1.5" />

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Thermometer className="w-3.5 h-3.5 text-orange-400" /> Temp:
                </span>
                <span className="font-bold text-zinc-200">{hoveredSpace.temperature?.toFixed(1) || '21.4'}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Wind className="w-3.5 h-3.5 text-brand-cyan" /> CO2 Load:
                </span>
                <span className="font-bold text-zinc-200">{hoveredSpace.co2 || '412'} ppm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> Humidity:
                </span>
                <span className="font-bold text-zinc-200">{hoveredSpace.humidity || '48'}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Users2 className="w-3.5 h-3.5 text-purple-400" /> Damper:
                </span>
                <span className="font-bold text-zinc-200">{hoveredSpace.damper || '65% Open'}</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-500 font-mono text-[10px] uppercase">
              <p className="animate-pulse">Hover room rect</p>
              <p className="text-[8px] mt-1 text-zinc-600">to stream live sensors</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2 font-mono">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 bg-brand-cyan rounded-full" /> Normal load
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 bg-brand-orange rounded-full" /> High occupancy load
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 bg-brand-cyan rounded-full animate-ping" /> Active Sensor Node
          </span>
        </div>
        <div className="flex items-center gap-1 text-zinc-500 font-mono text-[10px]">
          <ShieldCheck className="w-4 h-4 text-brand-cyan" /> REAL-TIME MQTT WEB SOCKETS STABLE
        </div>
      </div>
    </div>
  );
}

