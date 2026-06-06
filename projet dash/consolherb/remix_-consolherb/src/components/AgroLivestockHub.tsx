import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  AlertCircle, 
  Calendar, 
  CheckCircle,
  Clock, 
  Search, 
  Sliders, 
  Plus, 
  ChevronDown, 
  ShieldAlert,
  SlidersHorizontal,
  Workflow,
  Sparkles,
  Award
} from 'lucide-react';

interface AgroLivestockHubProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroLivestockHub({ onAddLog }: AgroLivestockHubProps) {
  // Chart selection and simulation states
  const [selectedRange, setSelectedRange] = useState<'Last week' | 'This week' | 'May 2026'>('Last week');
  const [eggCount, setEggCount] = useState(2450);
  const [healthIndex, setHealthIndex] = useState(94);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Veterinary feed pagination
  const [activeAlertPage, setActiveAlertPage] = useState(0);

  // Dispensers timer and status simulation
  const [dispenserCattleTime, setDispenserCattleTime] = useState(30); // minutes left
  const [dispensersStatus, setDispensersStatus] = useState({
    poultry: 'Active',
    cattle: 'In Progress',
    sheep: 'Scheduled (6:00 PM)',
    water: 'Operational'
  });

  // Hotspot pin mapping
  const [activeZoneFilter, setActiveZoneFilter] = useState<'ALL' | 'ZONE_A' | 'ZONE_B'>('ALL');
  const [animalPins, setAnimalPins] = useState([
    { id: 'cow1', name: 'Cow #452B', type: 'Cattle', zone: 'ZONE_A', x: 28, y: 48, health: 'Optimal', details: 'Grazing Standard feed' },
    { id: 'cow2', name: 'Cow #109A', type: 'Cattle', zone: 'ZONE_A', x: 42, y: 35, health: 'Requires Checkup', details: 'Isolated near tree line' },
    { id: 'sheep1', name: 'Sheep #32C', type: 'Sheep', zone: 'ZONE_B', x: 74, y: 56, health: 'Optimal', details: 'With flock B' },
    { id: 'sheep2', name: 'Sheep #88G', type: 'Sheep', zone: 'ZONE_B', x: 62, y: 68, health: 'Optimal', details: 'Grazing Zone B' },
    { id: 'chicken1', name: 'Broilers Pen 4', type: 'Poultry', zone: 'ZONE_A', x: 81, y: 28, health: 'Monitoring', details: 'Respiratory sign signs' },
  ]);

  const [selectedPin, setSelectedPin] = useState<any>(null);

  // Live timer tick for dispensers simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDispenserCattleTime(prev => {
        if (prev <= 1) {
          onAddLog('success', 'FEED_DISPENSER: Chariot d\'alimentation bovin automatique cycle achevé.');
          setDispensersStatus(d => ({ ...d, cattle: 'Completed' }));
          return 60;
        }
        return prev - 1;
      });
    }, 30000); // simulate minutes faster
    return () => clearInterval(interval);
  }, [onAddLog]);

  // Handle dispenser toggles
  const triggerDispenserManual = (dispenser: 'poultry' | 'cattle' | 'sheep') => {
    onAddLog('success', `FEED_DISPENSER: Commande forcée manuelle envoyée au distributeur [${dispenser.toUpperCase()}]`);
    if (dispenser === 'poultry') {
      setDispensersStatus(prev => ({
        ...prev,
        poultry: prev.poultry === 'Active' ? 'Suspended' : 'Active'
      }));
    } else if (dispenser === 'cattle') {
      setDispensersStatus(prev => ({
        ...prev,
        cattle: 'In Progress'
      }));
      setDispenserCattleTime(45);
    } else {
      setDispensersStatus(prev => ({
        ...prev,
        sheep: 'Active Now'
      }));
    }
  };

  // Add customized veterinary report simulation
  const addNewVetAlert = () => {
    onAddLog('warn', "VET_CENTER: Enregistrement d'un nouveau signalement d'anomalie de comportement avicole.");
    setSelectedPin({
      id: 'custom-alert',
      name: 'Poultry Coop B3',
      type: 'Poultry',
      zone: 'ZONE_A',
      health: 'Anomalie',
      details: 'Cycle d\'abreuvoirs encombré'
    });
  };

  // Dynamic spline points matching selectable range
  const getSplinePath = () => {
    if (selectedRange === 'This week') {
      return "M0,90 Q50,60 100,80 T200,50 T300,70 T400,35";
    } else if (selectedRange === 'May 2026') {
      return "M0,75 Q50,45 100,70 T200,60 T300,45 T400,15";
    }
    // Default matching exact trajectory in image 0
    return "M0,80 Q50,70 100,50 T200,40 T300,30 T400,20";
  };

  // Filter animals pins by search query or zone filter
  const filteredPins = animalPins.filter(pin => {
    const matchesSearch = pin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pin.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pin.health.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = activeZoneFilter === 'ALL' || pin.zone === activeZoneFilter;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="bg-[#FAF9F5] text-[#2D3A20] rounded-[28px] p-6 border border-[#e1d5c1] font-sans shadow-md relative overflow-hidden" id="agro-livestock-hub">
      
      {/* Absolute Decorative Leaves in Background mimicking premium botanical asset */}
      <div className="absolute top-0 right-0 w-72 h-72 opacity-10 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#4E6138] w-full h-full">
          <path d="M70,10 C50,30 45,55 55,75 C65,65 80,40 90,10 Q95,5 90,10 Z" />
          <path d="M50,32 C40,48 30,60 45,85 C55,75 58,55 55,42" />
        </svg>
      </div>

      {/* Top Section / Title Tagline */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E1DEC9] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase font-mono tracking-widest text-[#BA5834]">IMAGE 6: LIVESTOCK MODULE</span>
            <span className="text-[10px] bg-[#E1DEC9] text-[#556345] font-mono px-2 py-0.5 rounded-full font-bold">SOLENOID TELEMETRY ACTIVE</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#451e09] mt-1">Poultry & Livestock Management Hub</h1>
          <p className="text-sm text-[#6e5845] font-mono uppercase tracking-wide">Integrated Command Center for Herboferme</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={addNewVetAlert}
            className="text-[11px] bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-full font-mono font-bold uppercase transition active:scale-95 cursor-pointer"
          >
            🚨 Report Vet Incident
          </button>
          
          <span className="text-[10px] bg-neutral-100 text-stone-600 border border-neutral-200 px-2.5 py-1.5 rounded-full font-mono font-bold flex items-center gap-1.5 shadow-xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>HERD INDEX 100% SECURE</span>
          </span>
        </div>
      </header>

      {/* THREE COLUMN GRID - Identical to Image 6 and the CSS framework guideline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* COLUMN 1: AVIAN HEALTH & EGG PRODUCTION */}
        <div className="bg-white border border-[#e1d5c1] p-6 rounded-[28px] shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between" id="poultry-card">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-bold text-base text-[#451e09] flex items-center gap-2">
                <span className="text-[#C25A3D] text-lg">🐔</span>
                <span>Avian Health & Egg Production</span>
              </h3>
              
              {/* Dropdown range filter */}
              <div className="relative inline-block text-left">
                <button 
                  onClick={() => {
                    const nextList: ('Last week' | 'This week' | 'May 2026')[] = ['Last week', 'This week', 'May 2026'];
                    const currIdx = nextList.indexOf(selectedRange);
                    const nextVal = nextList[(currIdx + 1) % nextList.length];
                    setSelectedRange(nextVal);
                    if (nextVal === 'This week') {
                      setEggCount(2890);
                      setHealthIndex(96);
                    } else if (nextVal === 'May 2026') {
                      setEggCount(9810);
                      setHealthIndex(93);
                    } else {
                      setEggCount(2450);
                      setHealthIndex(94);
                    }
                    onAddLog('info', `LIVESTOCK: Plage temporelle statistique basculée sur [${nextVal}]`);
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-sm hover:bg-stone-100 transition active:scale-95 cursor-pointer"
                >
                  <span>{selectedRange}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-[11px] font-mono text-stone-400 block uppercase font-bold tracking-tight">Daily Egg Yield</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-stone-800 font-mono tracking-tight">
                  {eggCount.toLocaleString()}
                </span>
                <span className="text-emerald-500 text-sm font-bold flex items-center gap-0.5">
                  ↑ +12.4%
                </span>
              </div>
            </div>

            {/* Custom SVG Spline Graph exactly matching Image 6 layout */}
            <div className="h-32 w-full relative mb-4 overflow-hidden border-b border-dashed border-stone-100 rounded-xs bg-slate-50/20 p-1">
              <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                {/* Dotted Grid lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#f1ece6" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="#f1ece6" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#f1ece6" strokeWidth="1" strokeDasharray="3,3" />

                {/* Shaded Area */}
                <path 
                  d={`${getSplinePath()} L400,100 L0,100 Z`}
                  fill="url(#amber-grad-area)" 
                  opacity="0.12" 
                />

                {/* Background crossing spline line */}
                <path 
                  d="M0,90 Q80,40 180,68 T320,50 T400,15" 
                  fill="none" 
                  stroke="#E1DEC9" 
                  strokeWidth="1.5" 
                />

                {/* Foreground custom orange spline line */}
                <path 
                  d={getSplinePath()} 
                  fill="none" 
                  stroke="#c25a3d" 
                  strokeWidth="2.8" 
                  strokeLinecap="round"
                />

                {/* Point markers */}
                <circle cx="100" cy="50" r="3.5" fill="#fcfaf8" stroke="#c25a3d" strokeWidth="2.5" />
                <circle cx="200" cy="40" r="3.5" fill="#fcfaf8" stroke="#c25a3d" strokeWidth="2.5" />
                <circle cx="400" cy="20" r="4.5" fill="#c25a3d" />

                {/* Gradients */}
                <defs>
                  <linearGradient id="amber-grad-area" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#c25a3d', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#c25a3d', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Spline timeline labels */}
              <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-1 px-1">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>
            </div>
          </div>

          {/* Flock Health Index Card */}
          <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-2xl">
            <div className="bg-[#C25A3D]/10 p-2 rounded-xl text-[#C25A3D]">
              <Heart className="w-5 h-5 fill-current animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold font-mono tracking-wider">Flock Health Index</p>
              <p className="text-sm font-bold text-stone-800">
                {healthIndex}% <span className="text-emerald-600 font-serif font-normal italic">(Optimal State)</span>
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 2: VETERINARY ALERT FEED (Terracotta Gradient Card) */}
        <div className="bg-gradient-to-b from-[#BA5834] to-[#973f21] text-white p-6 rounded-[28px] shadow-sm relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition duration-200" id="vet-card">
          
          {/* Audio vector waves ornament resembling Image 6 */}
          <div className="absolute top-2 right-4 w-28 h-12 opacity-15 pointer-events-none select-none">
            <svg viewBox="0 0 100 30" width="100%" height="100%" stroke="currentColor" fill="none" strokeWidth="2">
              <line x1="5" y1="15" x2="5" y2="25" />
              <line x1="12" y1="10" x2="12" y2="28" />
              <line x1="19" y1="5" x2="19" y2="30" />
              <line x1="26" y1="12" x2="26" y2="26" />
              <line x1="33" y1="15" x2="33" y2="22" />
              <line x1="40" y1="8" x2="40" y2="29" />
              <line x1="47" y1="14" x2="47" y2="26" />
              <line x1="54" y1="5" x2="54" y2="30" />
            </svg>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-serif font-bold text-base flex items-center gap-2">
                <span className="text-white text-lg">🩺</span>
                <span>Veterinary Alert Feed</span>
              </h3>
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
            </div>

            <p className="text-[11px] font-mono text-orange-200 uppercase tracking-wide mb-4">
              Recent Health Checks <br />
              <span className="text-white font-bold text-xs">Today Priority, 10:15 AM</span>
            </p>

            {/* Simulated Pages */}
            <AnimatePresence mode="wait">
              {activeAlertPage === 0 && (
                <motion.div 
                  key="alert-p1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-2.5"
                >
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 cursor-help"
                    onClick={() => onAddLog('info', 'VET_FEED: Consultation du rapport complet pour l\'incident respiratoire Clos 4')}
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span className="text-amber-300">⚠️</span>
                      <p>Urgent: Pen 4 Broilers - Respiratory Signs</p>
                    </div>
                    <div className="flex justify-between text-[10px] text-orange-200 font-mono mt-1.5 pl-5.5">
                      <span>(Dr. Lee, 10:15 AM)</span>
                      <span className="underline hover:text-white">Review report</span>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition"
                    onClick={() => onAddLog('info', 'VET_FEED: Visite programmée vaches laitières stable.')}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-sky-300">📅</span>
                      <p>Scheduled: Dairy Cows - Routine Checkup</p>
                    </div>
                    <p className="text-[10px] text-orange-200/80 font-mono mt-1 pl-5.5">(Dr. Patel, 2:00 PM)</p>
                  </div>
                </motion.div>
              )}

              {activeAlertPage === 1 && (
                <motion.div 
                  key="alert-p2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-2.5"
                >
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span className="text-yellow-400">🚨</span>
                      <p>Alert: Sheep Flock B - Parasite Screening</p>
                    </div>
                    <p className="text-[10px] text-orange-200 font-mono mt-1 pl-5.5">(Dr. Davis, 4:30 PM)</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-emerald-300">✓</span>
                      <p>Completed: Quarantined Calves cleared</p>
                    </div>
                    <p className="text-[10px] text-orange-200/80 font-mono mt-1 pl-5.5">(Dr. Lee, Yesterday)</p>
                  </div>
                </motion.div>
              )}

              {activeAlertPage === 2 && (
                <motion.div 
                  key="alert-p3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-2.5 text-center py-4 bg-white/5 rounded-2xl border border-white/5"
                >
                  <p className="text-xs font-mono text-orange-100 italic">No additional alarms pending resolution.</p>
                  <button 
                    onClick={() => {
                      setActiveAlertPage(0);
                      onAddLog('success', 'VET_FEED: Liste d\'alertes restaurée au début.');
                    }}
                    className="mt-2 text-[10px] font-mono px-3 py-1 bg-white/10 rounded-full hover:bg-white/20"
                  >
                    Return to page 1
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dot controllers mimicking the bottom layout */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((dot) => (
              <button
                key={dot}
                onClick={() => {
                  setActiveAlertPage(dot);
                  onAddLog('info', `VET_FEED: Navigation carrousel vers l'onglet [Page ${dot + 1}]`);
                }}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-150 ${
                  activeAlertPage === dot ? 'bg-amber-400 w-4' : 'bg-white/30 hover:bg-white/50'
                }`}
                title={`Page ${dot + 1}`}
              />
            ))}
          </div>

        </div>

        {/* COLUMN 3: CATTLE & SHEEP TRACEABILITY (Satelite GPS simulator) */}
        <div className="bg-white border border-[#e1d5c1] p-6 rounded-[28px] shadow-xs flex flex-col justify-between" id="traceability-card">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-bold text-base text-[#451e09] flex items-center gap-2">
                <span className="text-[#C25A3D] text-lg">🐄</span>
                <span>Cattle & Sheep Traceability</span>
              </h3>
              
              {/* Reset view filters or settings */}
              <button 
                onClick={() => {
                  setActiveZoneFilter('ALL');
                  setSearchQuery('');
                  setSelectedPin(null);
                  onAddLog('success', 'GPS_MAP : Réinitialisation globale de la carte satellite.');
                }}
                className="text-[11px] font-bold font-mono text-stone-400 hover:text-[#C25A3D]"
              >
                Reset map
              </button>
            </div>

            {/* Total counts readout */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-stone-500 mb-4 border-b border-stone-100 pb-3">
              <div>
                <p>Total Cattle: <span className="font-bold text-stone-800">320 units</span></p>
                <p>Total Sheep: <span className="font-bold text-stone-800">450 units</span></p>
              </div>
              <div className="text-right border-l border-stone-100 pl-3">
                <p>Active Tags: <span className="font-bold text-stone-800">770 count</span></p>
                <p>GPS Coverage: <span className="font-bold text-emerald-600">100% Online</span></p>
              </div>
            </div>

            {/* Map Simulator with orange visual aesthetic exactly mimicking Image 6 */}
            <div className="relative w-full h-32 bg-[#FDFBF7] border border-[#e8dfcf] rounded-2xl overflow-hidden mb-4 shadow-inner flex items-center justify-center">
              
              {/* World outline vector ornament styling using dashed paths */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C25A3D_1px,transparent_1px)]" style={{ backgroundSize: '12px 12px' }} />
              
              {/* Static decorative continents lines mimicking world overlay in design */}
              <div className="absolute w-52 h-20 border border-[#c25a3d]/20 rounded-full blur-xs pointer-events-none" />
              
              {/* Blinking ping zones */}
              <div className="absolute top-8 left-16 w-14 h-14 bg-orange-100/35 border border-[#c25a3d]/10 rounded-full animate-pulse flex items-center justify-center">
                <span className="w-2 h-2 bg-[#BA5834] rounded-full" />
              </div>
              <div className="absolute bottom-6 right-20 w-16 h-16 bg-amber-100/35 border border-amber-400/10 rounded-full animate-pulse flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
              </div>

              {/* Dynamic GPS Pins rendering with active filters */}
              {filteredPins.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => {
                    setSelectedPin(pin);
                    onAddLog('info', `GPS_TAG: Focus sur ${pin.name} (${pin.type}) - Zone: ${pin.zone}`);
                  }}
                  className={`absolute p-1 rounded-full border transition transform hover:scale-125 z-10 active:scale-95 cursor-pointer group-hover:brightness-95 ${
                    selectedPin?.id === pin.id 
                      ? 'bg-red-500 text-white border-red-300 shadow-md ring-2 ring-red-200' 
                      : pin.type === 'Cattle' 
                        ? 'bg-[#C25A3D]/90 text-white border-orange-200' 
                        : 'bg-amber-500 text-white border-amber-200'
                  }`}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  title={`${pin.name} (${pin.health})`}
                >
                  <span className="text-[10px] block leading-none select-none">
                    {pin.type === 'Cattle' ? '🐄' : pin.type === 'Sheep' ? '🐑' : '🐔'}
                  </span>
                </button>
              ))}

              {/* Inline zone toggles representing elements overlays */}
              <div className="absolute bottom-2 left-2 flex gap-1.5 select-none z-10">
                <button 
                  onClick={() => {
                    setActiveZoneFilter(activeZoneFilter === 'ZONE_A' ? 'ALL' : 'ZONE_A');
                    onAddLog('info', `GPS_MAP : Filtrage cartographique [Grazing Zone A]`);
                  }}
                  className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border text-stone-700 cursor-pointer ${
                    activeZoneFilter === 'ZONE_A' ? 'bg-[#c25a3d] text-white border-[#BA5834]' : 'bg-white/90 border-stone-200'
                  }`}
                >
                  Grazing Zone A (120 Cattle)
                </button>
                <button 
                  onClick={() => {
                    setActiveZoneFilter(activeZoneFilter === 'ZONE_B' ? 'ALL' : 'ZONE_B');
                    onAddLog('info', `GPS_MAP : Filtrage cartographique [Grazing Zone B]`);
                  }}
                  className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border text-stone-700 cursor-pointer ${
                    activeZoneFilter === 'ZONE_B' ? 'bg-[#c25a3d] text-white border-[#BA5834]' : 'bg-white/90 border-stone-200'
                  }`}
                >
                  Grazing Zone B (200 Sheep)
                </button>
              </div>

              {/* Selected pin small details feedback */}
              <AnimatePresence>
                {selectedPin && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-x-0 bottom-0 bg-[#451e09] text-white p-2 text-[10px] font-mono flex justify-between items-center z-20 shadow-lg border-t border-orange-850/50"
                  >
                    <div>
                      <span className="font-bold text-orange-300">{selectedPin.name}</span>
                      <span className="ml-1.5 opacity-75">[{selectedPin.health}] - {selectedPin.details}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedPin(null)}
                      className="text-red-300 font-bold hover:text-white scale-110 ml-2"
                    >
                      ×
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Search bar tag search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search for animal tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-[#C25A3D]/40 text-stone-800 font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-stone-400 hover:text-stone-700 font-mono text-xs"
              >
                clear
              </button>
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: FEEDING SCHEDULE SECTION MAPPING IMAGE 6 */}
      <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5.5 shadow-xs" id="feeding-schedule-row">
        
        <div className="flex justify-between items-center mb-4.5 border-b border-dashed border-stone-100 pb-2">
          <h3 className="font-serif font-bold text-sm text-[#451e09] uppercase tracking-wide">
            Water dispenser & Feeding scheduling channels
          </h3>
          <span className="text-[9.5px] text-stone-400 font-mono">
            UPDATED: Realtime // click cards to dispense rations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Poultry layer feed */}
          <div 
            onClick={() => triggerDispenserManual('poultry')}
            className={`p-3.5 border rounded-2xl flex items-center gap-3.5 transition hover:shadow-xs cursor-pointer ${
              dispensersStatus.poultry === 'Active' 
                ? 'bg-amber-50/50 border-amber-200 text-amber-900' 
                : 'bg-stone-50 border-stone-200 text-stone-500'
            }`}
          >
            <div className={`p-2.5 rounded-xl text-xl ${dispensersStatus.poultry === 'Active' ? 'bg-[#C25A3D]/10 text-[#C25A3D]' : 'bg-stone-200 text-stone-400'}`}>
              🐔
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate leading-tight text-stone-800">Poultry Feed (Layer Mash)</span>
              <span className={`text-[10px] font-mono block mt-1 ${dispensersStatus.poultry === 'Active' ? 'text-emerald-600 font-semibold' : 'text-stone-400'}`}>
                Dispenser 1: {dispensersStatus.poultry}
              </span>
            </div>
          </div>

          {/* Cattle silage mix */}
          <div 
            onClick={() => triggerDispenserManual('cattle')}
            className={`p-3.5 border rounded-2xl flex items-center gap-3.5 transition hover:shadow-xs cursor-pointer ${
              dispensersStatus.cattle === 'In Progress' 
                ? 'bg-orange-50/45 border-orange-200 text-orange-950' 
                : 'bg-stone-50 border-stone-200 text-stone-500'
            }`}
          >
            <div className={`p-2.5 rounded-xl text-xl ${dispensersStatus.cattle === 'In Progress' ? 'bg-[#C25A3D]/10 text-[#C25A3D]' : 'bg-stone-200 text-stone-400'}`}>
              🐄
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate leading-tight text-stone-800 text-stone-800">Cattle Feed (Silage Mix)</span>
              <span className="text-[10px] text-orange-600 font-mono block mt-1 font-semibold">
                Dispenser 2: {dispensersStatus.cattle} ({dispenserCattleTime}m left)
              </span>
            </div>
          </div>

          {/* Sheep pellets */}
          <div 
            onClick={() => triggerDispenserManual('sheep')}
            className={`p-3.5 border rounded-2xl flex items-center gap-3.5 transition hover:shadow-xs cursor-pointer ${
              dispensersStatus.sheep === 'Active Now' 
                ? 'bg-amber-50/50 border-amber-200 text-amber-900' 
                : 'bg-stone-50 border-stone-200 text-stone-500'
            }`}
          >
            <div className={`p-2.5 rounded-xl text-xl ${dispensersStatus.sheep === 'Active Now' ? 'bg-[#C25A3D]/10 text-[#C25A3D]' : 'bg-stone-200 text-stone-400'}`}>
              🐑
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate leading-tight text-stone-800">Sheep Feed (Pellets)</span>
              <span className={`text-[10px] font-mono block mt-1 ${dispensersStatus.sheep === 'Active Now' ? 'text-emerald-600 font-semibold' : 'text-stone-400'}`}>
                Dispenser 3: {dispensersStatus.sheep}
              </span>
            </div>
          </div>

          {/* Water dispensaries */}
          <div 
            onClick={() => {
              onAddLog('info', 'FEED_DISPENSER: Rinçage et check-up des clapets d\'alimentation d\'eau (Toutes Zones : Opérationnelles)');
            }}
            className="p-3.5 bg-emerald-50/30 border border-emerald-100 rounded-2xl flex items-center gap-3.5 transition hover:shadow-xs cursor-pointer text-emerald-900"
          >
            <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600 text-xl">
              💧
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate leading-tight text-stone-800">Water Systems</span>
              <span className="text-[10px] text-emerald-600 font-mono block mt-1 font-semibold">
                All Dispensers: Operational
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
