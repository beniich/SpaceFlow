import React, { useState } from 'react';
import { 
  Maximize2, Users, Thermometer, Mic, Map, Layers, ChevronRight, 
  X, Compass, Eye, ShieldAlert, Cpu, Sparkles, CheckCircle2, 
  Radio, Sliders, ExternalLink, Box, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useSiteConfig } from '../context/SiteConfigContext';

const floorData = {
  L4: [
    { 
      id: 'SP-L4-01', 
      name: 'Tech Lab B', 
      status: 'Occupied', 
      temp: 23.4, 
      noise: 45, 
      occ: 12, 
      cap: 15, 
      area: 120, 
      category: 'R&D',
      cad: { ifcGuid: '3aB89x_L4_TLB', x: 14.5, y: 32.8, z: 12.0, bounds: '12m x 10m x 3.5m' },
      sensors: [
        { name: 'Air Temp Node #1', value: '23.4 °C', status: 'optimal' },
        { name: 'CO2 Monitor', value: '540 ppm', status: 'optimal' },
        { name: 'Occupancy PIR', value: '12 detected', status: 'active' },
      ]
    },
    { 
      id: 'SP-L4-02', 
      name: 'Server Room 1', 
      status: 'Available', 
      temp: 19.2, 
      noise: 65, 
      occ: 0, 
      cap: 2, 
      area: 45, 
      category: 'Data Infrastructure',
      cad: { ifcGuid: '1xK99z_L4_SR1', x: 28.0, y: 12.4, z: 12.0, bounds: '7.5m x 6m x 3.2m' },
      sensors: [
        { name: 'Precision CRAC #1', value: '19.2 °C', status: 'optimal' },
        { name: 'Humidity Matrix', value: '45% RH', status: 'optimal' },
        { name: 'Water Leak Loop', value: 'Dry / Nominal', status: 'optimal' },
      ]
    },
    { 
      id: 'SP-L4-03', 
      name: 'HVAC Control Node', 
      status: 'Occupied', 
      temp: 25.8, 
      noise: 72, 
      occ: 1, 
      cap: 2, 
      area: 28, 
      category: 'Mechanical / MEP',
      cad: { ifcGuid: '9pP42m_L4_HVAC', x: 4.2, y: 45.1, z: 12.0, bounds: '6m x 4.5m x 4m' },
      sensors: [
        { name: 'Vibration Transducer', value: '1.2 mm/s', status: 'optimal' },
        { name: 'Duct Pressure', value: '240 Pa', status: 'optimal' },
        { name: 'Intake Airflow', value: '820 m³/h', status: 'optimal' },
      ]
    },
    { 
      id: 'SP-L4-04', 
      name: 'Open Space 4A', 
      status: 'Occupied', 
      temp: 22.1, 
      noise: 52, 
      occ: 28, 
      cap: 30, 
      area: 240, 
      category: 'Workstation Zone',
      cad: { ifcGuid: '4dF71q_L4_OS4A', x: 40.2, y: 22.0, z: 12.0, bounds: '20m x 12m x 3.2m' },
      sensors: [
        { name: 'Zone Temp Sensor', value: '22.1 °C', status: 'optimal' },
        { name: 'Ambient Lux', value: '480 Lux', status: 'optimal' },
        { name: 'Acoustic Sound Level', value: '52 dB', status: 'optimal' },
      ]
    },
    { 
      id: 'SP-L4-05', 
      name: 'Cleanroom Alpha', 
      status: 'Available', 
      temp: 20.0, 
      noise: 38, 
      occ: 0, 
      cap: 6, 
      area: 85, 
      category: 'ISO 6 Cleanroom',
      cad: { ifcGuid: '7yH11b_L4_CRA', x: 18.0, y: 55.4, z: 12.0, bounds: '10m x 8.5m x 3.5m' },
      sensors: [
        { name: 'HEPA Differential', value: '120 Pa', status: 'optimal' },
        { name: 'Particle Counter', value: '< 100/m³', status: 'optimal' },
        { name: 'Air Exchange Rate', value: '45 ACH', status: 'optimal' },
      ]
    },
    { 
      id: 'SP-L4-06', 
      name: 'BMS Telemetry Hub', 
      status: 'Available', 
      temp: 21.5, 
      noise: 32, 
      occ: 0, 
      cap: 4, 
      area: 35, 
      category: 'Operations',
      cad: { ifcGuid: '2wQ88k_L4_BMS', x: 32.5, y: 6.0, z: 12.0, bounds: '7m x 5m x 3m' },
      sensors: [
        { name: 'Rack Gateway Core', value: 'Online', status: 'optimal' },
        { name: 'UPS Battery Health', value: '99%', status: 'optimal' },
        { name: 'Power Bus Line', value: '230V / 50Hz', status: 'optimal' },
      ]
    },
  ],
  L1: [
    { id: 'SP-L1-01', name: 'Main Lobby & Reception', status: 'Occupied', temp: 21.8, noise: 58, occ: 18, cap: 50, area: 350, category: 'Common Area', cad: { ifcGuid: 'L1_LOBBY_01', x: 0, y: 0, z: 0, bounds: '25m x 14m x 5m' }, sensors: [] },
    { id: 'SP-L1-02', name: 'Security Control Room', status: 'Occupied', temp: 22.0, noise: 40, occ: 3, cap: 4, area: 40, category: 'Security', cad: { ifcGuid: 'L1_SEC_02', x: 10, y: 5, z: 0, bounds: '8m x 5m x 3m' }, sensors: [] },
    { id: 'SP-L1-03', name: 'Auditorium Alpha', status: 'Available', temp: 20.5, noise: 25, occ: 0, cap: 120, area: 280, category: 'Event Hall', cad: { ifcGuid: 'L1_AUD_03', x: 20, y: 15, z: 0, bounds: '20m x 14m x 6m' }, sensors: [] },
  ],
  L2: [
    { id: 'SP-L2-01', name: 'Finance Open Space', status: 'Occupied', temp: 22.4, noise: 48, occ: 22, cap: 25, area: 180, category: 'Offices', cad: { ifcGuid: 'L2_FIN_01', x: 10, y: 10, z: 4, bounds: '15m x 12m x 3.2m' }, sensors: [] },
    { id: 'SP-L2-02', name: 'Boardroom 2A', status: 'Available', temp: 21.0, noise: 22, occ: 0, cap: 16, area: 65, category: 'Meeting', cad: { ifcGuid: 'L2_BRD_02', x: 25, y: 10, z: 4, bounds: '10m x 6.5m x 3.2m' }, sensors: [] },
  ],
  L3: [
    { id: 'SP-L3-01', name: 'Engineering Core', status: 'Occupied', temp: 22.8, noise: 50, occ: 34, cap: 40, area: 260, category: 'Offices', cad: { ifcGuid: 'L3_ENG_01', x: 5, y: 5, z: 8, bounds: '20m x 13m x 3.2m' }, sensors: [] },
    { id: 'SP-L3-02', name: 'Hardware Prototyping', status: 'Occupied', temp: 23.1, noise: 60, occ: 8, cap: 10, area: 90, category: 'Workshop', cad: { ifcGuid: 'L3_PRT_02', x: 30, y: 15, z: 8, bounds: '10m x 9m x 3.5m' }, sensors: [] },
  ],
  L5: [
    { id: 'SP-L5-01', name: 'Executive Suite 5A', status: 'Available', temp: 21.5, noise: 25, occ: 0, cap: 8, area: 95, category: 'Executive', cad: { ifcGuid: 'L5_EXEC_01', x: 15, y: 10, z: 16, bounds: '12m x 8m x 3.5m' }, sensors: [] },
    { id: 'SP-L5-02', name: 'Rooftop Solar & HVAC', status: 'Occupied', temp: 26.2, noise: 76, occ: 2, cap: 4, area: 450, category: 'Technical Roof', cad: { ifcGuid: 'L5_ROOF_02', x: 0, y: 0, z: 16, bounds: '30m x 15m x 4m' }, sensors: [] },
  ],
};

export default function Spaces() {
  const navigate = useNavigate();
  const { sites } = useSiteConfig();
  const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || '');
  const [selectedFloor, setSelectedFloor] = useState('L4');
  const [activeCadDrawer, setActiveCadDrawer] = useState(null); // holds selected space object

  const currentSite = sites.find(s => s.id === selectedSiteId) || sites[0] || {
    name: 'Paris HQ - Bâtiment Alpha',
    streetAddress: '124 Boulevard Haussmann',
    city: 'Paris',
    postalCode: '75008',
    phone: '+33 1 42 68 50 00',
    accessInstructions: 'Badge et signature au registre PC Sécurité.'
  };

  const floors = ['L1', 'L2', 'L3', 'L4', 'L5'];
  const spaces = floorData[selectedFloor] || floorData['L4'];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#08080A] text-zinc-100 p-4 sm:p-6 font-sans relative">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Stepper Selector */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
          <div className="bg-[#131313]/90 backdrop-blur-md border border-zinc-800/80 p-5 rounded-xl shadow-lg">
            <h2 className="text-xs font-mono font-bold text-[#00F0FF] uppercase mb-4 tracking-wider flex items-center gap-2">
              <Map className="w-4 h-4" />
              Zonation &amp; Levels
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] text-zinc-500 font-mono uppercase">Site Actif &amp; Adresse</label>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="w-full mt-1.5 bg-[#08080A] border border-zinc-800 text-xs font-mono text-zinc-300 p-2.5 rounded-lg focus:border-[#00F0FF] focus:outline-none transition-colors font-bold"
                >
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                {/* Address Card from Superadmin */}
                <div className="mt-2.5 p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 text-brand-orange font-bold text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                    <span>{currentSite.streetAddress}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 pl-5">{currentSite.postalCode} {currentSite.city}, {currentSite.country || 'France'}</p>
                  {currentSite.phone && (
                    <p className="text-[10px] text-cyan-400 pl-5">Tél: {currentSite.phone}</p>
                  )}
                  {currentSite.accessInstructions && (
                    <div className="mt-2 text-[10px] text-zinc-400 bg-zinc-900/80 p-2 rounded border border-zinc-800/60 leading-relaxed">
                      <span className="font-bold text-zinc-300 block mb-0.5">Consigne d'accès :</span>
                      {currentSite.accessInstructions}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Niveaux / Étages</label>
                  <span className="text-[9px] font-mono text-zinc-400">Total 5 Niveaux</span>
                </div>
                
                {/* Vertical Stepper */}
                <div className="flex flex-col gap-2 relative pl-2">
                  <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-zinc-800/80 -z-0" />
                  {floors.map((floor) => {
                    const isSelected = selectedFloor === floor;
                    const floorSpaces = floorData[floor] || [];
                    const occCount = floorSpaces.reduce((acc, s) => acc + (s.status === 'Occupied' ? 1 : 0), 0);
                    return (
                      <button
                        key={floor}
                        onClick={() => setSelectedFloor(floor)}
                        className={clsx(
                          "relative z-10 flex items-center justify-between p-2.5 rounded-lg transition-all text-left font-mono text-xs group",
                          isSelected 
                            ? "bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                            : "hover:bg-white/5 border border-transparent text-zinc-400"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            "w-3 h-3 rounded-full ring-4 ring-[#08080A] transition-all",
                            isSelected ? "bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" : "bg-zinc-700 group-hover:bg-zinc-500"
                          )} />
                          <span className="font-bold tracking-wide">Niveau {floor}</span>
                        </div>
                        <span className={clsx(
                          "text-[10px] px-1.5 py-0.5 rounded",
                          isSelected ? "bg-[#00F0FF]/20 text-[#00F0FF]" : "text-zinc-600 group-hover:text-zinc-400"
                        )}>
                          {floorSpaces.length} espaces ({occCount} occ.)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Floor Level Info */}
              <div className="border-t border-zinc-800/80 pt-4 text-[10px] font-mono text-zinc-400 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Classification:</span>
                  <span className="text-zinc-200">
                    {selectedFloor === 'L4' ? 'HVAC & Server Floor' : selectedFloor === 'L5' ? 'Penthouse & Roof MEP' : 'Office & Operations'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Area:</span>
                  <span className="text-zinc-200 font-bold">
                    {spaces.reduce((a, b) => a + (b.area || 0), 0)} m²
                  </span>
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* Main Area: Space Grid */}
        <div className="flex-1 flex flex-col gap-6">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <h1 className="text-2xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
                Space Management &amp; Real-time Occupancy
              </h1>
              <div className="text-xs font-mono text-zinc-400 mt-1 flex items-center gap-2">
                <span>{currentSite.name}</span>
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span className="text-[#00F0FF] font-bold">Niveau {selectedFloor}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{spaces.length} Espaces supervisés</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-[#131313] border border-zinc-800/80 rounded-lg px-3 py-1.5 flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" /> 
                  Available
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#F38020] shadow-[0_0_6px_#F38020]" /> 
                  Occupied
                </span>
              </div>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {spaces.map((space) => {
              const isOccupied = space.status === 'Occupied';
              return (
                <div 
                  key={space.id} 
                  className={clsx(
                    "bg-[#131313]/90 backdrop-blur-md border rounded-xl p-5 flex flex-col justify-between transition-all group hover:scale-[1.01] shadow-lg",
                    isOccupied 
                      ? "border-[#F38020]/30 hover:border-[#F38020]/70 hover:shadow-[0_0_20px_rgba(243,128,32,0.15)]" 
                      : "border-[#10B981]/30 hover:border-[#10B981]/70 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  )}
                >
                  <div>
                    {/* Top Row: Name & Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-white text-base tracking-tight">{space.name}</h3>
                        <div className="text-[10px] font-mono text-zinc-500 mt-0.5 uppercase tracking-wider flex items-center gap-2">
                          <span>{space.id}</span>
                          {space.category && (
                            <>
                              <span>•</span>
                              <span className="text-zinc-400">{space.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className={clsx(
                        "px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 border shadow-sm",
                        isOccupied 
                          ? "bg-[#F38020]/15 text-[#F38020] border-[#F38020]/40 shadow-[0_0_8px_rgba(243,128,32,0.2)]" 
                          : "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                      )}>
                        <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", isOccupied ? "bg-[#F38020]" : "bg-[#10B981]")} />
                        {space.status}
                      </div>
                    </div>

                    {/* Sensor Metrics */}
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      <div className="bg-[#08080A] p-2.5 rounded-lg border border-zinc-800 flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                          <Thermometer className="w-3.5 h-3.5 text-[#00F0FF]" /> Temp
                        </span>
                        <span className="font-mono text-xs font-bold text-white">{space.temp} °C</span>
                      </div>
                      
                      <div className="bg-[#08080A] p-2.5 rounded-lg border border-zinc-800 flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-[#F38020]" /> Noise
                        </span>
                        <span className="font-mono text-xs font-bold text-white">{space.noise} dB</span>
                      </div>
                      
                      <div className="col-span-2 bg-[#08080A] p-2.5 rounded-lg border border-zinc-800 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#10B981]" /> Occupants vs Cap.
                        </span>
                        <span className="font-mono text-xs font-bold text-white">
                          <span className={isOccupied ? "text-[#F38020]" : "text-[#10B981]"}>{space.occ}</span>
                          <span className="text-zinc-500"> / {space.cap}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Area & Trigger 2D CAD */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-zinc-500" /> {space.area} m²
                    </span>
                    <button 
                      onClick={() => setActiveCadDrawer(space)}
                      className="text-[11px] font-mono text-[#00F0FF] hover:text-white px-2.5 py-1 rounded bg-[#00F0FF]/10 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/30 transition-all flex items-center gap-1.5 font-bold shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                    >
                      <Layers className="w-3.5 h-3.5" /> View 2D CAD
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2D CAD / IFC COORDINATES SIDE DRAWER / MODAL OVERLAY */}
      {/* ========================================================================= */}
      {activeCadDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl h-full bg-[#0D0E12] border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto custom-scrollbar">
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#00F0FF]/20 text-[#00F0FF] font-mono text-[10px] font-bold border border-[#00F0FF]/30">
                      IFC 4.3 CAD SCHEMA
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">{activeCadDrawer.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">{activeCadDrawer.name}</h2>
                </div>
                <button 
                  onClick={() => setActiveCadDrawer(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2D CAD Schematic Canvas Simulation */}
              <div className="bg-[#040405] border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 font-mono">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1.5 text-[#00F0FF]">
                    <Compass className="w-3.5 h-3.5" /> 2D Vector Schematic Floor Plan
                  </span>
                  <span>Scale: 1:50</span>
                </div>

                {/* SVG CAD Blueprint Visualizer */}
                <div className="h-56 bg-[#08080A] rounded-lg border border-zinc-800/80 relative overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full p-4" viewBox="0 0 300 180">
                    <defs>
                      <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#cadGrid)" />
                    
                    {/* Architectural Room Bounds */}
                    <rect x="40" y="30" width="220" height="120" fill="#00F0FF" fillOpacity="0.05" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />
                    
                    {/* Doorway */}
                    <path d="M 40 70 A 30 30 0 0 1 70 100" fill="none" stroke="#F38020" strokeWidth="1.5" />
                    <line x1="40" y1="100" x2="70" y2="100" stroke="#F38020" strokeWidth="1.5" />
                    
                    {/* Sensor Nodes */}
                    <circle cx="100" cy="80" r="5" fill="#10B981" />
                    <text x="110" y="84" fill="#10B981" fontSize="9" fontFamily="monospace">Temp Node</text>

                    <circle cx="200" cy="80" r="5" fill="#F38020" />
                    <text x="210" y="84" fill="#F38020" fontSize="9" fontFamily="monospace">PIR Node</text>

                    <circle cx="150" cy="120" r="5" fill="#00F0FF" />
                    <text x="160" y="124" fill="#00F0FF" fontSize="9" fontFamily="monospace">HVAC Vent</text>

                    {/* Coordinates Crosshair */}
                    <line x1="150" y1="20" x2="150" y2="160" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="20" y1="90" x2="280" y2="90" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
                  </svg>

                  {/* Corner Coordinates Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded border border-zinc-800 text-[9px] text-[#00F0FF]">
                    X: {activeCadDrawer.cad?.x || '14.5'}m | Y: {activeCadDrawer.cad?.y || '32.8'}m | Z: {activeCadDrawer.cad?.z || '12.0'}m
                  </div>
                </div>
              </div>

              {/* IFC Spatial Metadata */}
              <div className="bg-[#131313] border border-zinc-800/80 rounded-xl p-4 space-y-3 font-mono text-xs">
                <h4 className="text-zinc-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-[#00F0FF]" /> IFC Structural Properties
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-[#08080A] p-2.5 rounded border border-zinc-800/60">
                    <span className="text-zinc-500 block text-[9px] uppercase">IFC GUID</span>
                    <span className="text-zinc-200 font-bold break-all">{activeCadDrawer.cad?.ifcGuid || '3aB89x_L4_TLB'}</span>
                  </div>
                  <div className="bg-[#08080A] p-2.5 rounded border border-zinc-800/60">
                    <span className="text-zinc-500 block text-[9px] uppercase">Spatial Volume</span>
                    <span className="text-zinc-200 font-bold">{activeCadDrawer.cad?.bounds || '12m x 10m x 3.5m'}</span>
                  </div>
                  <div className="bg-[#08080A] p-2.5 rounded border border-zinc-800/60">
                    <span className="text-zinc-500 block text-[9px] uppercase">Floor Level</span>
                    <span className="text-[#00F0FF] font-bold">Niveau {selectedFloor}</span>
                  </div>
                  <div className="bg-[#08080A] p-2.5 rounded border border-zinc-800/60">
                    <span className="text-zinc-500 block text-[9px] uppercase">Thermal Subzone</span>
                    <span className="text-zinc-200 font-bold">Zone #{selectedFloor}-M</span>
                  </div>
                </div>
              </div>

              {/* Active Sensor Nodes */}
              {activeCadDrawer.sensors && activeCadDrawer.sensors.length > 0 && (
                <div className="bg-[#131313] border border-zinc-800/80 rounded-xl p-4 space-y-3 font-mono text-xs">
                  <h4 className="text-zinc-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#10B981]" /> Connected Telemetry Nodes
                  </h4>
                  <div className="space-y-2">
                    {activeCadDrawer.sensors.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#08080A] border border-zinc-800/60">
                        <span className="text-zinc-300">{s.name}</span>
                        <span className="text-[#00F0FF] font-bold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-zinc-800 flex gap-3">
              <button 
                onClick={() => {
                  setActiveCadDrawer(null);
                  navigate('/digital-twin');
                }}
                className="flex-1 py-2.5 bg-[#00F0FF] hover:bg-[#00dbe7] text-black font-mono font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Open in 3D BIM Viewer
              </button>
              <button 
                onClick={() => setActiveCadDrawer(null)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

