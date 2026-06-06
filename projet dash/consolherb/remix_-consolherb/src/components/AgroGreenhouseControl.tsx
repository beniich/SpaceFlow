import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  Flame, 
  Droplets, 
  AlertTriangle, 
  Check, 
  RefreshCw,
  Sun,
  Activity,
  Zap,
  Gauge
} from 'lucide-react';

interface EventLog {
  time: string;
  category: 'VENT' | 'HEAT' | 'MIST' | 'SYS';
  message: string;
  status: 'info' | 'success' | 'warn';
}

interface AgroGreenhouseControlProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroGreenhouseControl({ onAddLog }: AgroGreenhouseControlProps) {
  // Greenhouse Sliders control parameters
  const [ventSpeed, setVentSpeed] = useState(75);
  const [heaterOutput, setHeaterOutput] = useState(40);
  const [mistInterval, setMistInterval] = useState(15); // minutes

  // Active Environmental Values
  const [temperature, setTemperature] = useState(24.5);
  const [co2Levels, setCo2Levels] = useState(780);
  const [humidity, setHumidity] = useState(62);
  const [lightIntensity, setLightIntensity] = useState(1200);

  // States to track toggle overrides from hotspots
  const [isFanSpinning, setIsFanSpinning] = useState(true);
  const [isHeaterGlowing, setIsHeaterGlowing] = useState(true);
  const [isMistingActive, setIsMistingActive] = useState(false);

  // Live recent events list mimicking Image 5
  const [events, setEvents] = useState<EventLog[]>([
    { time: '12:30 PM', category: 'TEMP', message: 'Target temperature reached (24.5°C)', status: 'success' },
    { time: '12:15 PM', category: 'CO2', message: 'CO2 injection cycle activated standard flow', status: 'info' },
    { time: '11:45 AM', category: 'MIST', message: 'Mist sprinkler cycle completed in Zone B', status: 'success' },
    { time: '11:00 AM', category: 'SYS', message: 'Ventilation fans adjusted to 75% flow-velocity', status: 'info' }
  ]);

  // Adjust live metrics dynamically following slider interactions
  useEffect(() => {
    // Air flow reduces temp & humidity slightly, and balances CO2
    const baseTemp = 28 - (ventSpeed / 25) + (heaterOutput / 20);
    setTemperature(parseFloat(baseTemp.toFixed(1)));

    const baseHum = 75 - (ventSpeed / 5) + (mistInterval / 3);
    setHumidity(Math.max(10, Math.min(100, Math.round(baseHum))));

    setCo2Levels(Math.max(400, Math.min(1200, 900 - Math.round(ventSpeed * 2))));
  }, [ventSpeed, heaterOutput, mistInterval]);

  const handleSliderChange = (type: 'vent' | 'heat' | 'mist', val: number) => {
    if (type === 'vent') {
      setVentSpeed(val);
      setIsFanSpinning(val > 0);
      onAddLog('info', `GREENHOUSE: Ventilation ajustée à ${val}% de sa puissance nominale.`);
    } else if (type === 'heat') {
      setHeaterOutput(val);
      setIsHeaterGlowing(val > 0);
      onAddLog('info', `GREENHOUSE: Chauffage radiant réglé sur ${val}%.`);
    } else {
      setMistInterval(val);
      onAddLog('info', `GREENHOUSE: Fréquence de brumisation configurée à toutes les ${val} minutes.`);
    }

    // Append to live greenhouse logs
    const newEv: EventLog = {
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      category: type.toUpperCase() as any,
      message: `${type === 'vent' ? 'Fans speed' : type === 'heat' ? 'Heater output' : 'Sprinklers frequency'} changed to ${val}${type === 'mist' ? 'm' : '%'}`,
      status: 'info'
    };
    setEvents(prev => [newEv, ...prev.slice(0, 3)]);
  };

  const handleHotspotClick = (node: 'fan' | 'heater' | 'mist') => {
    if (node === 'fan') {
      const next = !isFanSpinning;
      setIsFanSpinning(next);
      setVentSpeed(next ? 75 : 0);
      onAddLog('warn', `GREENHOUSE: Commande forcée sur ventilateur: ${next ? 'MARCHE (75%)' : 'ARRÊT complet'}.`);
    } else if (node === 'heater') {
      const next = !isHeaterGlowing;
      setIsHeaterGlowing(next);
      setHeaterOutput(next ? 40 : 0);
      onAddLog('warn', `GREENHOUSE: Commande forcée d'inertie de chauffage: ${next ? 'DÉMARRAGE (40%)' : 'EXTINCTION'}.`);
    } else {
      const next = !isMistingActive;
      setIsMistingActive(next);
      onAddLog('success', `GREENHOUSE: Cycle d'humidification instantané manuel enclenché (${next ? 'ACTIF' : 'ARRÊT'}).`);
    }
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-greenhouse-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#BA5834] to-[#f26b4f] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            🏠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451e09]">AgroMaître (Herboferme)</span>
              <span className="text-[9px] bg-red-50 text-[#BA5834] border border-orange-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">Image 5: Glasshouse Shard</span>
            </div>
            <p className="text-xs text-stone-500 font-mono uppercase">Decentralized Climate Actuators & Solenoid Control</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-green-200 px-2.5 py-1 rounded-full font-mono font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600" />
            <span>SOLENOIDS ONLINE // SECURE</span>
          </span>
        </div>
      </header>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#451e09] tracking-tight">Smart Greenhouse Control</h1>
        <p className="text-xs text-[#6e5845] font-mono uppercase mt-0.5">Automated sensor loopback, heating arrays & mist valve calibrations</p>
      </div>

      {/* Grid Layout mimicking Image 5: Left dials/sliders, Center wireframe building vector, Right events status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN 1: SENSOR DIALS & SYSTEM CONTROLS (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Temp Circular Progress Dial */}
          <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5 flex items-center gap-4 shadow-xs">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 animate-pulse" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.8" fill="none" stroke="#fefefe" strokeWidth="2.8" />
                <circle 
                  cx="18" cy="18" r="15.8" fill="none" 
                  stroke="#BA5834" strokeWidth="2.8" 
                  strokeDasharray="68, 100" // Represents temp bounds
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute font-mono text-xs font-bold text-stone-800">{temperature}°C</div>
            </div>
            <div>
              <span className="text-[11.5px] font-mono text-stone-500 block uppercase font-bold">Temperature Ambient</span>
              <span className="text-xs text-stone-400 font-mono">Goal: 25°C // Avg: 23.8°C</span>
            </div>
          </div>

          {/* Card 2: CO2 Circular progress Dial */}
          <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5 flex items-center gap-4 shadow-xs">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.8" fill="none" stroke="#fefefe" strokeWidth="2.8" />
                <circle 
                  cx="18" cy="18" r="15.8" fill="none" 
                  stroke="#f26b4f" strokeWidth="2.8" 
                  strokeDasharray={`${(co2Levels / 1200) * 100}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute font-mono text-[10.5px] font-bold text-stone-800">{co2Levels}ppm</div>
            </div>
            <div>
              <span className="text-[11.5px] font-mono text-stone-500 block uppercase font-bold">CO2 Density levels</span>
              <span className="text-xs text-stone-400 font-mono">Input: Normal // Max limit: 1k</span>
            </div>
          </div>

          {/* Card 3: Controllers Sliders with Amber Handles */}
          <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5.5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-xs text-stone-700 uppercase tracking-wide border-b border-stone-100 pb-2">
              Climate Actuators Manual Drivers
            </h3>

            {/* Slider 1: Ventilation Speed */}
            <div>
              <div className="flex justify-between text-[11px] font-mono font-bold text-stone-500 uppercase mb-1">
                <span>Ventilation Fans:</span>
                <span className="text-[#BA5834]">{ventSpeed}% speed</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={ventSpeed}
                onChange={(e) => handleSliderChange('vent', parseInt(e.target.value))}
                className="w-full accent-[#BA5834] bg-stone-150 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Heater Output */}
            <div>
              <div className="flex justify-between text-[11px] font-mono font-bold text-stone-500 uppercase mb-1">
                <span>Heating System:</span>
                <span className="text-[#BA5834]">{heaterOutput}% power</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={heaterOutput}
                onChange={(e) => handleSliderChange('heat', parseInt(e.target.value))}
                className="w-full accent-[#BA5834] bg-stone-150 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Mist喷 Durations */}
            <div>
              <div className="flex justify-between text-[11px] font-mono font-bold text-stone-500 uppercase mb-1">
                <span>Mist Interval:</span>
                <span className="text-[#BA5834]">Every {mistInterval}m</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="60" 
                value={mistInterval}
                onChange={(e) => handleSliderChange('mist', parseInt(e.target.value))}
                className="w-full accent-[#BA5834] bg-stone-150 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

          </div>

        </div>

        {/* COLUMN 2: BEAUTIFUL CENTRAL GLASS WIREFRAME DIAGRAM WITH GLASS HOTSPOTS (col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-[#e1d5c1] rounded-[24px] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          
          <div className="select-none text-center">
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider">SECURED SHARD INTERACTIVE DIAGRAM</span>
            <div className="h-4 w-px bg-stone-200 mx-auto mt-1" />
          </div>

          {/* Interactive wireframe structure layout */}
          <div className="relative py-8 flex items-center justify-center">
            
            {/* The isometric greenhouse base shaped using beautiful vector styling */}
            <div className="w-68 h-52 bg-gradient-to-t from-orange-50/20 to-white border-2 border-dashed border-stone-200/80 rounded-2xl relative flex items-center justify-center">
              
              {/* Internal abstract plants lines */}
              <div className="absolute inset-x-6 bottom-4 h-12 flex justify-around opacity-35 select-none pointer-events-none">
                <span className="text-2xl">🌱</span>
                <span className="text-2xl">🌿</span>
                <span className="text-2xl">🌱</span>
                <span className="text-2xl">🌿</span>
              </div>

              {/* HOTSPOT NODE 1: VENTILATION FANS */}
              <button 
                onClick={() => handleHotspotClick('fan')}
                className={`absolute top-6 left-1/4 -translate-y-1/2 p-2 rounded-xl border flex flex-col items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer ${
                  isFanSpinning 
                    ? 'bg-amber-50 border-orange-200 text-[#BA5834]' 
                    : 'bg-stone-50 border-stone-150 text-stone-400'
                }`}
              >
                <div className="bg-orange-600/10 p-2 rounded-lg">
                  <Wind className={`w-5 h-5 ${isFanSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                </div>
                <span className="text-[9.5px] font-mono font-bold leading-none">Ventilation ({ventSpeed}%)</span>
              </button>

              {/* HOTSPOT NODE 2: HEATING COIL ENVELOPE */}
              <button 
                onClick={() => handleHotspotClick('heater')}
                className={`absolute bottom-16 right-1/4 translate-y-1/2 p-2 rounded-xl border flex flex-col items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer ${
                  isHeaterGlowing 
                    ? 'bg-amber-50 border-orange-200 text-[#f26b4f]' 
                    : 'bg-stone-50 border-stone-150 text-stone-400'
                }`}
              >
                <div className="bg-orange-600/10 p-2 rounded-lg">
                  <Flame className={`w-5 h-5 ${isHeaterGlowing ? 'animate-pulse' : ''}`} />
                </div>
                <span className="text-[9.5px] font-mono font-bold leading-none">Heating ({isHeaterGlowing ? 'Active' : 'Offline'})</span>
              </button>

              {/* HOTSPOT NODE 3: WATER SPRAYERS */}
              <button 
                onClick={() => handleHotspotClick('mist')}
                className={`absolute top-22 right-8 p-2 rounded-xl border flex flex-col items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer ${
                  isMistingActive 
                    ? 'bg-emerald-50 border-green-200 text-emerald-600' 
                    : 'bg-stone-50 border-stone-150 text-stone-400'
                }`}
              >
                <div className="bg-emerald-600/10 p-2 rounded-lg relative">
                  <Droplets className="w-5 h-5" />
                  {isMistingActive && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" 
                    />
                  )}
                </div>
                <span className="text-[9.5px] font-mono font-bold leading-none">Misting (Active: 15m)</span>
              </button>

            </div>

          </div>

          <div className="text-center font-mono text-[9px] text-[#6e5845] border-t border-stone-100 pt-3 select-none">
            Interact with hotspots to enforce quick override solenoids.
          </div>
        </div>

        {/* COLUMN 3: REAL-TIME FEED STATISTICS & LOG EVENTS SUMMARY (col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Card 1: Feed tables metrics */}
          <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5 shadow-xs">
            <h3 className="font-serif font-bold text-xs text-stone-700 uppercase tracking-wide border-b border-stone-100 pb-2 mb-3">
              Direct Solenoid Feeds
            </h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-stone-50 pb-1.5 text-stone-500">
                <span>Rel Humidity:</span>
                <span className="font-bold text-stone-850">{humidity}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-50 pb-1.5 text-stone-500">
                <span>Lux Lumination:</span>
                <span className="font-bold text-stone-850">{lightIntensity} µmol/m²</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-50 pb-1.5 text-stone-500">
                <span>Soil Acid pH:</span>
                <span className="font-bold text-stone-850">6.2 pH (Stable)</span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span>Vapor Press Def:</span>
                <span className="font-bold text-stone-850">0.8 kPa</span>
              </div>
            </div>
          </div>

          {/* Card 2: Recent Events logger */}
          <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5.5 shadow-xs">
            <h3 className="font-serif font-bold text-xs text-stone-750 uppercase tracking-wide border-b border-stone-100 pb-2 mb-3">
              Recent Climate Events
            </h3>

            <div className="space-y-3 font-mono text-[10px] leading-relaxed">
              {events.map((ev, index) => {
                const badgeColor = 
                  ev.status === 'success' 
                    ? 'bg-green-55 border-green-150 text-green-700' 
                    : 'bg-amber-50 border-amber-150 text-amber-700';

                return (
                  <div key={index} className="border-b border-stone-100 pb-2 last:border-b-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#BA5834] font-semibold">{ev.category} SHARD</span>
                      <span className="text-[8.5px] text-stone-400">{ev.time}</span>
                    </div>
                    <p className="text-stone-600 font-serif leading-normal italic text-[11px]">"{ev.message}"</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
