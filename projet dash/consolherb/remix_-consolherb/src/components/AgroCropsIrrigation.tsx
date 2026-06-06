import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sun, 
  CloudRain, 
  CloudLightning,
  Droplets, 
  HelpCircle,
  Thermometer,
  Wind,
  Plus
} from 'lucide-react';

interface Valve {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

interface AgroCropsIrrigationProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroCropsIrrigation({ onAddLog }: AgroCropsIrrigationProps) {
  // Weather Forecast Data representing exactly Image 1
  const weatherForecast = [
    { day: 'Today', icon: '☀️', weather: 'Sunny', tempMax: 25, tempMin: 15, rainChance: 0, active: true },
    { day: 'Tomorrow', icon: '⛅', weather: 'Partly Cloudy', tempMax: 24, tempMin: 14, rainChance: 10, active: false },
    { day: 'Wed', icon: '🌧️', weather: 'Light Rain', tempMax: 22, tempMin: 13, rainChance: 40, active: false },
    { day: 'Thu', icon: '🌦️', weather: 'Showers', tempMax: 20, tempMin: 12, rainChance: 60, active: false },
    { day: 'Fri', icon: '☀️', weather: 'Sunny', tempMax: 23, tempMin: 14, rainChance: 5, active: false },
  ];

  // 9 Valve sectors corresponding exactly to Image 1's schematic flow
  const [valves, setValves] = useState<Valve[]>([
    { id: 'v1', name: 'Zone 1: North Orchard', code: 'V-01', active: true },
    { id: 'v2', name: 'Zone 1: Vineyard', code: 'V-02', active: true },
    { id: 'v3', name: 'Zone 1: Vineyard', code: 'V-04', active: false },
    { id: 'v4', name: 'Zone 2: Vineyard', code: 'V-02', active: true },
    { id: 'v5', name: 'Zone 1: Vineyard', code: 'V-03', active: false },
    { id: 'v6', name: 'Zone 1: Norten Field', code: 'V-02', active: false },
    { id: 'v7', name: 'Zone 3: South Field', code: 'V-03', active: false },
    { id: 'v8', name: 'Zone 3: South Field', code: 'V-04', active: true },
    { id: 'v9', name: 'Zone 1: Shinkield', code: 'V-05', active: false },
  ]);

  // Overall interactive metrics
  const [evapotranspiration, setEvapotranspiration] = useState(4.2);
  const [soilMoisture, setSoilMoisture] = useState(45);
  const [waterDeficit, setWaterDeficit] = useState(-1.5);

  const toggleValve = (id: string, name: string, code: string, currentStatus: boolean) => {
    setValves(prev => prev.map(v => {
      if (v.id === id) {
        const nextStatus = !currentStatus;
        
        // Dynamically update the metrics as user interacts with valves to look alive
        if (nextStatus) {
          setSoilMoisture(sm => Math.min(100, sm + 2));
          setWaterDeficit(wd => parseFloat((wd + 0.2).toFixed(1)));
        } else {
          setSoilMoisture(sm => Math.max(10, sm - 2));
          setWaterDeficit(wd => parseFloat((wd - 0.2).toFixed(1)));
        }

        onAddLog(
          nextStatus ? 'success' : 'warn',
          `CROPS_IRRIG: Clapet ${code} de l'émetteur [${name}] configuré sur ${nextStatus ? 'ACTIF (Ecoulement de l\'eau)' : 'ARRÊT'}.`
        );
        return { ...v, active: nextStatus };
      }
      return v;
    }));
  };

  const handleRecalculateMoisture = () => {
    // Generate slight random adjustments to show they are live
    setEvapotranspiration(parseFloat((4.2 + (Math.random() * 0.4 - 0.2)).toFixed(1)));
    setSoilMoisture(prev => Math.min(95, Math.max(20, prev + Math.floor(Math.random() * 6 - 3))));
    onAddLog('info', 'CROPS_IRRIG: Lecture directe synchronisée des tensiomètres de sol sans fil.');
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-irrigation-weather-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#f26b4f] to-[#e65a3d] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            🌦️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451e09]">AgroMaître (Herboferme)</span>
              <span className="text-[9px] bg-orange-50 text-[#f26b4f] border border-orange-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">IMAGE 1: IRRIGATION GATE</span>
            </div>
            <p className="text-xs text-stone-500 font-mono">Precision Moisture & Wireless Evapotranspiration Array</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRecalculateMoisture}
            className="text-[10px] bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Poll Solenoids</span>
          </button>
        </div>
      </header>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#451e09] tracking-tight">Irrigation Control & Weather Center</h1>
        <p className="text-xs text-[#6e5845] font-mono uppercase mt-0.5">Hydrologic network mapping, weather stations & active valve controls</p>
      </div>

      {/* Section 1: Weather Grid (Replicates Image 1 Today-Fri layout) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {weatherForecast.map((f, idx) => {
          return (
            <div 
              key={f.day} 
              className={`rounded-[22px] p-4 text-center transition duration-200 ${
                f.active 
                  ? 'bg-white border-2 border-[#f26b4f]/60 shadow-md' 
                  : 'bg-white/60 border border-[#e1d5c1]/60 opacity-80'
              }`}
            >
              <div className="text-3xl mb-1 select-none">{f.icon}</div>
              <h3 className="font-serif font-bold text-sm text-stone-800">{f.day}</h3>
              <p className="text-[10px] text-stone-500 leading-normal">{f.weather}</p>
              <div className="text-base font-bold font-mono text-[#451e09] mt-1.5">{f.tempMax}°C <span className="text-xs text-stone-400 font-normal">/ {f.tempMin}°C</span></div>
              <div className="text-[9.5px] text-[#f26b4f] font-semibold font-mono mt-0.5">{f.rainChance}% Rain</div>
            </div>
          );
        })}
      </div>

      {/* Section 2: Gauges Cluster (Replicates evapotranspiration, moisture, and water deficit from Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Gauge 1: Evapotranspiration */}
        <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-6 flex flex-col items-center">
          <div className="relative w-44 h-28 flex justify-center overflow-hidden">
            <svg className="w-40 h-40 transform translate-y-4" viewBox="0 0 100 100">
              {/* Arc background */}
              <path
                d="M 15,80 A 40,40 0 1,1 85,80"
                fill="none"
                stroke="#eee"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Arc value */}
              <path
                d="M 15,80 A 40,40 0 1,1 85,80"
                fill="none"
                stroke="url(#evGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="130, 220" // Replicates partial evapotranspiration state
              />
              {/* Needle pointer based on level */}
              <g transform="translate(50,80)">
                <line x1="0" y1="0" x2="-28" y2="-12" stroke="#BA5834" strokeWidth="3" strokeLinecap="round" />
                <circle cx="0" cy="0" r="4.5" fill="#451e09" />
              </g>
              <defs>
                <linearGradient id="evGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Legend scale labels inside gauge */}
            <div className="absolute inset-x-0 bottom-4 text-center mt-2">
              <span className="text-[10px] text-stone-400 font-mono left-5 absolute bottom-1">Low</span>
              <span className="text-[10px] text-stone-400 font-mono right-5 absolute bottom-1">High</span>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-tight block">Medium</span>
            </div>
          </div>
          <div className="text-center -mt-2">
            <span className="text-2xl font-bold text-[#451e09] font-mono">{evapotranspiration}</span>
            <span className="text-xs text-stone-500 font-mono ml-1">mm/day</span>
            <p className="text-xs text-stone-600 font-serif font-bold mt-1 uppercase tracking-tight">Current Evapotranspiration (ETo)</p>
          </div>
        </div>

        {/* Gauge 2: Soil Moisture (Avg) */}
        <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-6 flex flex-col items-center">
          <div className="relative w-44 h-28 flex justify-center overflow-hidden">
            <svg className="w-40 h-40 transform translate-y-4" viewBox="0 0 100 100">
              <path d="M 15,80 A 40,40 0 1,1 85,80" fill="none" stroke="#eee" strokeWidth="10" strokeLinecap="round" />
              {/* Fill Arc representing 45% moisture */}
              <path
                d="M 15,80 A 40,40 0 1,1 85,80"
                fill="none"
                stroke="url(#moistGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="100, 220"
              />
              {/* Centered Pointer Needle */}
              <g transform="translate(50,80)">
                <line x1="0" y1="0" x2="0" y2="-32" stroke="#f26b4f" strokeWidth="3" strokeLinecap="round" />
                <circle cx="0" cy="0" r="4.5" fill="#451e09" />
              </g>
              <defs>
                <linearGradient id="moistGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-x-0 bottom-4 text-center mt-2">
              <span className="text-[10px] text-stone-400 font-mono left-5 absolute bottom-1">Dry</span>
              <span className="text-[10px] text-stone-400 font-mono right-5 absolute bottom-1">Wet</span>
              <span className="text-[10px] text-stone-550 font-bold uppercase tracking-tight block">Optimal</span>
            </div>
          </div>
          <div className="text-center -mt-2">
            <span className="text-2xl font-bold text-[#451e09] font-mono">{soilMoisture}%</span>
            <p className="text-xs text-stone-600 font-serif font-bold mt-1 uppercase tracking-tight">Soil Moisture (Avg)</p>
          </div>
        </div>

        {/* Gauge 3: Water Deficit */}
        <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-6 flex flex-col items-center">
          <div className="relative w-44 h-28 flex justify-center overflow-hidden">
            <svg className="w-40 h-40 transform translate-y-4" viewBox="0 0 100 100">
              <path d="M 15,80 A 40,40 0 1,1 85,80" fill="none" stroke="#eee" strokeWidth="10" strokeLinecap="round" />
              <path
                d="M 15,80 A 40,40 0 1,1 85,80"
                fill="none"
                stroke="url(#defGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="60, 220"
              />
              {/* Leaning right needle pointer */}
              <g transform="translate(50,80)">
                <line x1="0" y1="0" x2="-26" y2="-17" stroke="#BA5834" strokeWidth="3" strokeLinecap="round" />
                <circle cx="0" cy="0" r="4.5" fill="#451e09" />
              </g>
              <defs>
                <linearGradient id="defGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-x-0 bottom-4 text-center mt-2">
              <span className="text-[10px] text-stone-400 font-mono left-5 absolute bottom-1">Surplus</span>
              <span className="text-[10px] text-stone-400 font-mono right-5 absolute bottom-1">Deficit</span>
              <span className="text-[10px] text-stone-550 font-bold uppercase tracking-tight block">Surplus</span>
            </div>
          </div>
          <div className="text-center -mt-2">
            <span className="text-2xl font-bold text-[#451e09] font-mono">{waterDeficit}</span>
            <span className="text-xs text-stone-500 font-mono ml-1">mm</span>
            <p className="text-xs text-stone-600 font-serif font-bold mt-1 uppercase tracking-tight">Water Deficit</p>
          </div>
        </div>

      </div>

      {/* Section 3: High Fidelity pipeline Schematic Flow map (Representing the graphic on Image 1) */}
      <div className="bg-[#FFF9F4] border border-[#e1d5c1] rounded-[24px] p-6 relative overflow-hidden shadow-xs">
        <h3 className="font-serif text-sm font-bold text-[#451e09] mb-4 border-b border-orange-100 pb-2">
          💧 Interactive Pipe Network Schematic
        </h3>

        {/* 3D pipe grid represented inside cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          {/* Section A: Orchard area */}
          <div className="bg-white/70 backdrop-blur-xs border border-[#e1d5c1] rounded-2xl p-4.5 space-y-3">
            <h4 className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider">Orchard Sectors</h4>
            
            {/* Valve 1 */}
            {valves.slice(0, 3).map(v => (
              <div key={v.id} className="flex justify-between items-center bg-[#FAF9F5]/40 border border-stone-200/50 p-2.5 rounded-xl">
                <div>
                  <div className="text-[11px] font-bold text-stone-800 leading-none">{v.name}</div>
                  <span className="text-[9.5px] font-mono text-stone-400 mt-1 block font-bold">{v.code}</span>
                </div>
                
                {/* Custom Toggle switch matching Screenshot precisely */}
                <button
                  onClick={() => toggleValve(v.id, v.name, v.code, v.active)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer duration-200 ${
                    v.active ? 'bg-orange-600' : 'bg-stone-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                    v.active ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>

          {/* Section B: Vineyard area */}
          <div className="bg-white/70 backdrop-blur-xs border border-[#e1d5c1] rounded-2xl p-4.5 space-y-3">
            <h4 className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider">Vineyard Sectors</h4>
            
            {valves.slice(3, 6).map(v => (
              <div key={v.id} className="flex justify-between items-center bg-[#FAF9F5]/40 border border-stone-200/50 p-2.5 rounded-xl">
                <div>
                  <div className="text-[11px] font-bold text-stone-800 leading-none">{v.name}</div>
                  <span className="text-[9.5px] font-mono text-stone-400 mt-1 block font-bold">{v.code}</span>
                </div>
                
                <button
                  onClick={() => toggleValve(v.id, v.name, v.code, v.active)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer duration-200 ${
                    v.active ? 'bg-orange-600' : 'bg-stone-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                    v.active ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>

          {/* Section C: Field zones */}
          <div className="bg-white/70 backdrop-blur-xs border border-[#e1d5c1] rounded-2xl p-4.5 space-y-3">
            <h4 className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider">Southern Fields</h4>
            
            {valves.slice(6, 9).map(v => (
              <div key={v.id} className="flex justify-between items-center bg-[#FAF9F5]/40 border border-stone-200/50 p-2.5 rounded-xl">
                <div>
                  <div className="text-[11px] font-bold text-stone-800 leading-none">{v.name}</div>
                  <span className="text-[9.5px] font-mono text-stone-400 mt-1 block font-bold">{v.code}</span>
                </div>
                
                <button
                  onClick={() => toggleValve(v.id, v.name, v.code, v.active)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer duration-200 ${
                    v.active ? 'bg-orange-600' : 'bg-stone-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                    v.active ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Isometric SVG Lines mimicking pipeline flows underneath with motion flow pulses */}
        <div className="mt-8 pt-4 border-t border-orange-100">
          <div className="text-[10px] font-mono text-stone-400 uppercase text-center tracking-widest mb-2 select-none">
            Active Solenoid Pressures / Flow Velocity indicator
          </div>
          <div className="h-20 bg-stone-100/60 border border-[#e1d5c1]/30 rounded-xl relative flex items-center justify-center">
            
            <svg className="w-full h-full absolute inset-0 opacity-40" viewBox="0 0 600 80" preserveAspectRatio="none">
              {/* Pipe shapes */}
              <line x1="20" y1="40" x2="580" y2="40" stroke="#b1c8e8" strokeWidth="8" strokeLinecap="round" />
              <line x1="200" y1="20" x2="200" y2="60" stroke="#b1c8e8" strokeWidth="6" />
              <line x1="400" y1="20" x2="400" y2="60" stroke="#b1c8e8" strokeWidth="6" />

              {/* Water streams glowing overlay */}
              <motion.line 
                x1="20" y1="40" x2="580" y2="40" 
                stroke="#3b82f6" 
                strokeWidth="4" 
                strokeDasharray="20, 10"
                animate={{ strokeDashoffset: [-60, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              />
            </svg>

            <div className="relative z-10 flex gap-6 text-[11px] font-mono font-bold text-blue-700 uppercase bg-blue-50/50 px-4 py-2 border border-blue-200 rounded-full animate-pulse">
              <span>● FLOWING STABLE: 4.8 L/S</span>
              <span className="text-stone-400">|</span>
              <span>PRESSURE: 3.2 BAR (OK)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
