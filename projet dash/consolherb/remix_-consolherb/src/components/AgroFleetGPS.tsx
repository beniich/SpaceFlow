import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Navigation, 
  Compass, 
  MapPin, 
  Video, 
  Info, 
  AlertTriangle, 
  Maximize2, 
  Sliders, 
  Activity, 
  Plus, 
  Minus,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

interface AgroFleetGPSProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroFleetGPS({ onAddLog }: AgroFleetGPSProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedDriverId, setSelectedDriverId] = useState<number>(0);
  const [mapCoordinates, setMapCoordinates] = useState({ lat: '45.123', lng: '-12.456' });

  const drivers = [
    { id: 0, name: 'John D.', role: 'Tractor 01 Operator', speed: 15, fuel: 85, status: 'In Field', lat: '45.124', lng: '-12.458', type: 'Tractor' },
    { id: 1, name: 'Jases E.', role: 'Harvester 03 Operator', speed: 12, fuel: 74, status: 'In Field', lat: '45.129', lng: '-12.449', type: 'Harvester' },
    { id: 2, name: 'Marcus L.', role: 'Tractor 04 Operator', speed: 15, fuel: 90, status: 'Replenishing', lat: '45.118', lng: '-12.462', type: 'Tractor' },
    { id: 3, name: 'Sarah K.', role: 'Tractor 07 Operator', speed: 0, fuel: 42, status: 'Standby', lat: '45.121', lng: '-12.451', type: 'Tractor' },
    { id: 4, name: 'David P.', role: 'Tractor 02 Operator', speed: 18, fuel: 65, status: 'In Field', lat: '45.132', lng: '-12.470', type: 'Tractor' }
  ];

  const handleSelectDriver = (id: number, name: string) => {
    setSelectedDriverId(id);
    const dr = drivers.find(d => d.id === id);
    if (dr) {
      setMapCoordinates({ lat: dr.lat, lng: dr.lng });
      onAddLog('info', `FLEET: Suivi GPS axé sur [${name}] (${dr.role}). Vitesse: ${dr.speed} km/h.`);
    }
  };

  const adjustZoom = (amount: number) => {
    setZoomLevel(prev => Math.max(1, Math.min(5, prev + amount)));
    onAddLog('success', `FLEET: Niveau de zoom tactique ajusté à x${zoomLevel}.`);
  };

  return (
    <div className="bg-[#FAF9F5] text-[#2c1a04] p-4 sm:p-6 border border-[#e1d5c1] rounded-sm font-sans shadow-md" id="fleet-gps-command">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#BC542B] rounded-sm flex items-center justify-center text-white font-bold text-lg select-none">
            🚜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-serif font-bold text-[#451e09] lg:text-base">AgroMaître (Herboferme)</span>
              <span className="text-[10px] text-stone-500 font-mono hidden sm:inline">|</span>
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-[#BC542B]">Fleet Real-time GPS Command</span>
            </div>
            <p className="text-xs text-[#6e5845] font-mono uppercase">IMAGE 5: Live Satellite Telemetry & Asset Dispatch HUD</p>
          </div>
        </div>

        {/* Header navigation options */}
        <div className="flex items-center gap-4 text-xs font-mono font-bold text-stone-500 shrink-0 select-none">
          <span className="hover:text-black cursor-pointer">Dashboard</span>
          <span className="text-[#BC542B] border-b border-[#BC542B] pb-1 cursor-pointer flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Fleet GPS</span>
          </span>
          <span className="hover:text-black cursor-pointer">Analytics</span>
          <span className="hover:text-black cursor-pointer">Settings</span>
          <div className="w-6 h-6 rounded-full bg-[#BC542B] text-white flex items-center justify-center text-[9px]">U</div>
        </div>
      </header>

      {/* Map Cockpit Grid layout representing Image 5 split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN (col-span-4) - Live Fleet Status list */}
        <div className="xl:col-span-4 bg-white border border-[#e1d5c1] rounded-sm p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-2.5 border-b border-stone-200 mb-4 text-[#451e09]">
              <h2 className="text-xs font-mono font-bold uppercase tracking-tight">Live Fleet Status</h2>
              <span className="text-[9px] bg-amber-50 text-[#BC542B] px-1.5 py-0.5 rounded-sm font-mono uppercase border border-amber-200">
                ACTIVE
              </span>
            </div>

            {/* List drivers with custom graphical indicators */}
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {drivers.map((drv) => {
                const isSelected = selectedDriverId === drv.id;
                return (
                  <div 
                    key={drv.id}
                    onClick={() => handleSelectDriver(drv.id, drv.name)}
                    className={`p-3 border rounded-xs select-none transition cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-[#BC542B] bg-orange-50/20 shadow-xs' 
                        : 'border-stone-200 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">🚜</span>
                        <div>
                          <h4 className="text-xs font-bold font-mono text-stone-850">Driver: {drv.name}</h4>
                          <p className="text-[10px] text-stone-500 font-sans mt-0.5">{drv.role}</p>
                        </div>
                      </div>
                      <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                        drv.status === 'In Field' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/30' 
                          : 'bg-stone-50 text-stone-500 border border-stone-200'
                      }`}>
                        {drv.status}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-stone-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Speed:</span>
                        <strong className="text-black">{drv.speed} km/h</strong>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span>Fuel:</span>
                        <div className="grow bg-stone-100 h-1.5 rounded-full overflow-hidden max-w-[120px]">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              drv.fuel < 50 ? 'bg-amber-500' : 'bg-[#BC542B]'
                            }`}
                            style={{ width: `${drv.fuel}%` }}
                          />
                        </div>
                        <strong className="text-black">{drv.fuel}%</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 mt-2.5 flex justify-between items-center">
                      <span className="text-[9px] font-mono text-gray-400">GPS: {drv.lat}, {drv.lng}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDriver(drv.id, drv.name);
                        }}
                        className="text-[9px] font-mono font-bold text-[#BC542B] hover:underline"
                      >
                        [View Details]
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-sm flex items-center justify-between text-xs font-mono text-stone-600">
            <span>Active assets: <strong>5 Units</strong></span>
            <span className="text-emerald-700 font-bold">ALL NOMINAL</span>
          </div>
        </div>

        {/* RIGHT COLUMN (col-span-8) - Tactical GPS Satellite Map Overlay */}
        <div className="xl:col-span-8 bg-[#0a1412] text-white rounded-sm border border-stone-800 p-4 relative flex flex-col justify-between overflow-hidden min-h-[460px]">
          
          {/* Custom satellite visual field design overlay */}
          <div className="absolute inset-0 bg-cover bg-center select-none pointer-events-none opacity-40 mix-blend-screen" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80')"
          }} />

          {/* Graphical vector roads and plots */}
          <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
            {/* Field boundaries */}
            <rect x="20" y="30" width="120" height="80" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,3" />
            <rect x="180" y="20" width="160" height="90" fill="none" stroke="#22c55e" strokeWidth="1" />
            <rect x="40" y="160" width="140" height="110" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="5,5" />
            <rect x="220" y="150" width="150" height="120" fill="none" stroke="#22c55e" strokeWidth="1" />

            {/* Simulated farm roads */}
            <path d="M 0 130 H 400" fill="none" stroke="#475569" strokeWidth="4" />
            <path d="M 160 0 V 300" fill="none" stroke="#475569" strokeWidth="4" />
            <path d="M 0 220 Q 160 220 220 180 T 400 240" fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="4,4" />
          </svg>

          {/* Coordinates Top Header overlay */}
          <div className="relative flex justify-between items-center bg-[#070b0a]/90 backdrop-blur-md px-3 py-2 border border-stone-800 rounded-xs z-10">
            <div>
              <span className="text-[10px] font-mono text-gray-400">TELEMETRY STREAM // ACTIVE LOCATOR_COCKPIT</span>
              <h3 className="text-xs font-mono font-bold text-[#4DE082] uppercase mt-0.5">
                FIELD WORKERS ACTIVE DISPATCH MATRIX
              </h3>
            </div>
            
            <div className="text-[10px] font-mono text-stone-500 bg-[#0c100e] border border-stone-800 px-2 py-0.5 rounded-sm">
              LAT: {mapCoordinates.lat} // LNG: {mapCoordinates.lng}
            </div>
          </div>

          {/* Active tactical maps markers */}
          <div className="relative grow z-10 flex items-center justify-center min-h-[280px]">
            
            {/* Tractor 01 Locator card on map */}
            <div 
              className={`absolute transition-all duration-700 p-2 bg-[#0d141e]/90 text-white border rounded-xs shadow-lg max-w-[140px] ${
                selectedDriverId === 0 ? 'border-[#BC542B] scale-110 ring-2 ring-[#BC542B]/40 z-20' : 'border-stone-800 opacity-80'
              }`}
              style={{ top: '15%', left: '25%' }}
              onClick={() => handleSelectDriver(0, 'John D.')}
            >
              <div className="flex justify-between items-center gap-1.5">
                <span className="text-[8px] font-mono font-bold text-gray-400 uppercase">Tractor 01</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <p className="text-[10px] font-bold mt-1">John D.</p>
              <p className="text-[9px] font-mono text-stone-400 mt-0.5">Speed: 15 km/h</p>
            </div>

            {/* Harvester 03 Locator card */}
            <div 
              className={`absolute transition-all duration-705 p-2 bg-[#0d141e]/95 text-white border rounded-xs shadow-lg max-w-[140px] ${
                selectedDriverId === 1 ? 'border-[#BC542B] scale-110 ring-2 ring-[#BC542B]/40 z-20' : 'border-stone-800 opacity-80'
              }`}
              style={{ top: '22%', right: '28%' }}
              onClick={() => handleSelectDriver(1, 'Jases E.')}
            >
              <div className="flex justify-between items-center gap-1.5">
                <span className="text-[8px] font-mono font-bold text-gray-400 uppercase">Harvester 03</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <p className="text-[10px] font-bold mt-1">Jases E.</p>
              <p className="text-[9px] font-mono text-stone-400 mt-0.5">Speed: 12 km/h</p>
            </div>

            {/* Tractor 04 locator */}
            <div 
              className={`absolute transition-all duration-700 p-2 bg-[#0d141e]/90 text-white border rounded-xs shadow-lg max-w-[140px] ${
                selectedDriverId === 2 ? 'border-[#BC542B] scale-110 ring-2 ring-[#BC542B]/40 z-20' : 'border-stone-800 opacity-80'
              }`}
              style={{ bottom: '25%', right: '15%' }}
              onClick={() => handleSelectDriver(2, 'Marcus L.')}
            >
              <div className="flex justify-between items-center gap-1.5">
                <span className="text-[8px] font-mono font-bold text-gray-400 uppercase">Tractor 04</span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              </div>
              <p className="text-[10px] font-bold mt-1">Marcus L.</p>
              <p className="text-[9px] font-mono text-stone-400 mt-0.5">Replenishing</p>
            </div>

            {/* Small decorative tractors pointers across map layout */}
            <div className="absolute top-[48%] left-[44%] p-1.5 bg-stone-900/90 text-[10px] font-mono rounded-xs border border-stone-800 opacity-60 pointer-events-none select-none">
              Tractor 07 (15 km/h)
            </div>
            <div className="absolute top-[68%] left-[22%] p-1.5 bg-stone-900/90 text-[10px] font-mono rounded-xs border border-stone-800 opacity-60 pointer-events-none select-none">
              Tractor 09 (15 km/h)
            </div>
            <div className="absolute bottom-[15%] left-[55%] p-1.5 bg-stone-900/90 text-[10px] font-mono rounded-xs border border-stone-800 opacity-60 pointer-events-none select-none">
              Tractor 03 (12 km/h)
            </div>

          </div>

          {/* Zoom controls & details on map */}
          <div className="relative flex justify-between items-center border-t border-stone-800 pt-3 z-10">
            
            <div className="text-[10px] font-mono text-[#4DE082] select-none bg-stone-950 px-2 py-0.5 rounded-sm border border-stone-850">
              COORD: 45.123, -12.456 // ZOOM: 1:1000 — x{zoomLevel}
            </div>

            {/* Custom styled scale zoom selector bar */}
            <div className="flex items-center gap-2.5 bg-stone-950 p-1 rounded-sm border border-stone-850 text-stone-400">
              <button 
                onClick={() => adjustZoom(-1)}
                className="hover:text-white p-1 hover:bg-stone-800 rounded-xs cursor-pointer select-none"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              <div className="w-24 bg-stone-800 h-1 rounded-full relative overflow-hidden select-none">
                <div 
                  className="bg-[#BC542B] h-full transition-all" 
                  style={{ width: `${(zoomLevel / 5) * 100}%` }}
                />
              </div>

              <button 
                onClick={() => adjustZoom(1)}
                className="hover:text-white p-1 hover:bg-stone-800 rounded-xs cursor-pointer select-none"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
