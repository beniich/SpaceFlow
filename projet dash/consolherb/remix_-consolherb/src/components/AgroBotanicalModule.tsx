import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Sun, 
  Thermometer, 
  Droplet, 
  AlertTriangle, 
  Calendar, 
  Sparkles, 
  Zap, 
  Check, 
  RefreshCw,
  Award
} from 'lucide-react';

interface AgroBotanicalModuleProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

interface CropSpecies {
  id: string;
  name: string;
  icon: string;
  ph: number;
  phStatus: string;
  light: number;
  lightStatus: string;
  nutrients: number; // percentage NPK
  nutrientStatus: string;
  readyDays: number;
  readinessPct: number;
  harvestDate: string;
  requiresMonitoring: boolean;
  notes: string;
}

export default function AgroBotanicalModule({ onAddLog }: AgroBotanicalModuleProps) {
  // Crop data sets for interactive selection
  const cropData: CropSpecies[] = [
    {
      id: 'lavender',
      name: 'Lavender',
      icon: '🪻',
      ph: 6.5,
      phStatus: 'Optimal',
      light: 1450,
      lightStatus: 'High Consistent',
      nutrients: 88,
      nutrientStatus: 'Balanced',
      readyDays: 12,
      readinessPct: 95,
      harvestDate: 'Oct 20',
      requiresMonitoring: false,
      notes: 'Soil moisture is stable at 45% (Mediterranean dry preference).'
    },
    {
      id: 'ginseng',
      name: 'Ginseng',
      icon: '🪵',
      ph: 5.8,
      phStatus: 'Slightly Acidic',
      light: 980,
      lightStatus: 'Optimal Shade',
      nutrients: 72,
      nutrientStatus: 'Sufficient',
      readyDays: 45,
      readinessPct: 80,
      harvestDate: 'Nov 22',
      requiresMonitoring: false,
      notes: 'Root density expanding optimally under shade filter panels.'
    },
    {
      id: 'rare_herbs',
      name: 'Rare Herbs',
      icon: '🌿',
      ph: 7.2,
      phStatus: 'Alkaline Focus',
      light: 1600,
      lightStatus: 'Maximum Intake',
      nutrients: 94,
      nutrientStatus: 'Heavily Charged',
      readyDays: 60,
      readinessPct: 65,
      harvestDate: 'Dec 10',
      requiresMonitoring: true,
      notes: 'Nitrogen density levels require constant telemetry logs.'
    },
    {
      id: 'mint_thyme',
      name: 'Mint & Thyme',
      icon: '🌱',
      ph: 6.2,
      phStatus: 'Stable Average',
      light: 1200,
      lightStatus: 'Standard Flow',
      nutrients: 80,
      nutrientStatus: 'Balanced',
      readyDays: 5,
      readinessPct: 98,
      harvestDate: 'Jun 10',
      requiresMonitoring: false,
      notes: 'Harvest rotation scheduled automatically. Perfect canopy index.'
    }
  ];

  const [selectedCropId, setSelectedCropId] = useState<string>('lavender');
  const activeCrop = cropData.find(c => c.id === selectedCropId) || cropData[0];

  const handleCropSelect = (crop: CropSpecies) => {
    setSelectedCropId(crop.id);
    onAddLog('success', `BOTANICAL: Espèce sélectionnée [${crop.name}] - Chargement des calibrages solénoïdes.`);
  };

  const handleHarvestRequest = (cropName: string) => {
    onAddLog('success', `BOTANICAL: Ordre de récolte planifié pour l'espèce [${cropName}] le ${activeCrop.harvestDate}.`);
  };

  // Convert stats to gauge needle rotation degrees
  const getRotationPh = (ph: number) => {
    // scale pH 0 to 14. Let's map pH [0 to 10] into -90 to 90 degrees
    const percentage = ph / 10;
    return (percentage * 180) - 90;
  };

  const getRotationLight = (light: number) => {
    // scale light 0 to 2000. Let's map [0 to 1800] to -90 to 90 degrees
    const percentage = Math.min(1800, light) / 1800;
    return (percentage * 180) - 90;
  };

  const getRotationNutrients = (nutrients: number) => {
    // scale nutrients 0 to 100 percentage. Map to -90 to 90 degrees
    const percentage = nutrients / 100;
    return (percentage * 180) - 90;
  };

  return (
    <div className="bg-[#FAF9F5] text-[#2D3A20] rounded-[28px] p-6 border border-[#e1d5c1] font-sans shadow-md relative overflow-hidden" id="agro-botanical-module">
      
      {/* Absolute Decorative Leaf in Background */}
      <div className="absolute top-0 left-0 w-80 h-80 opacity-10 pointer-events-none select-none rotate-90 scale-y-[-1]">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#4E6138] w-full h-full">
          <path d="M70,10 C50,30 45,55 55,75 C65,65 80,40 90,10 Q95,5 90,10 Z" />
        </svg>
      </div>

      {/* Center Top Header matching exactly Image 1 / Image 7 */}
      <header className="text-center mb-8 border-b border-[#E1DEC9] pb-4">
        <span className="text-xs font-mono text-[#6e5845] uppercase tracking-widest font-bold">AgroMaître (Herboferme)</span>
        <h1 className="text-3xl font-serif font-bold text-[#BA5834] tracking-tight mt-0.5">
          Botanical & Herbal Excellence Module
        </h1>
        <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mt-1">
          IMAGE 7: PRECISION SPECIES CALIBRATION & RECONCILIATION CORES
        </p>
      </header>

      {/* Main Grid matching exact 3-column layout in Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
        
        {/* COLUMN 1: SPECIES MANAGEMENT SIDEBAR (col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-center text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2">
            Species Management
          </h3>

          <div className="space-y-3">
            {cropData.map((crop) => {
              const isSelected = crop.id === selectedCropId;
              return (
                <button
                  key={crop.id}
                  onClick={() => handleCropSelect(crop)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition duration-250 cursor-pointer select-none relative overflow-hidden ${
                    isSelected 
                      ? 'bg-amber-100/50 border-[#BA5834] text-[#451e09] shadow-sm font-bold' 
                      : 'bg-white border-[#e1d5c1] text-stone-700 hover:bg-amber-50/40 hover:border-amber-200'
                  }`}
                >
                  <span className="text-2xl shrink-0">{crop.icon}</span>
                  <div>
                    <span className="text-sm font-serif block">{crop.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Ready: {crop.readyDays} Days
                    </span>
                  </div>

                  {/* Active background glow for selected species tag */}
                  {isSelected && (
                    <div className="absolute right-3 w-1.5 h-1.5 bg-[#BA5834] rounded-full animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Crop Notes */}
          <div className="bg-[#FAF9F5] border border-[#e1d5c1]/60 p-4 rounded-2xl text-xs font-mono leading-relaxed mt-4">
            <span className="font-bold text-[#BA5834] block uppercase">Crop Specifics:</span>
            <p className="text-stone-500 mt-1">"{activeCrop.notes}"</p>
          </div>
        </div>

        {/* COLUMN 2: BOTANICAL GROWTH ANALYTICS (col-span-6) */}
        <div className="lg:col-span-6 bg-white border border-[#e1d5c1] rounded-[38px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-center text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-6">
              Botanical Growth Analytics
            </h3>

            {/* Circular Instruments Gauge Panel - Matching exactly */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
              
              {/* Gauge 1: Soil pH */}
              <div className="space-y-2 p-2">
                <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-tight">SOIL pH</p>
                <div className="relative w-24 h-16 mx-auto flex items-end justify-center overflow-hidden">
                  
                  {/* Arc Path representing instrument boundaries */}
                  <svg className="w-full h-full transform" viewBox="0 0 100 50">
                    <path 
                      className="text-stone-100" 
                      fill="none" 
                      strokeWidth="5" 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      d="M 12 50 A 38 38 0 0 1 88 50" 
                    />
                    <path 
                      className="text-[#BA5834]" 
                      fill="none" 
                      strokeWidth="5" 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      d="M 12 50 A 38 38 0 0 1 50 12" 
                    />
                  </svg>

                  {/* Mechanical Pointer Needle */}
                  <motion.div 
                    animate={{ rotate: getRotationPh(activeCrop.ph) }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                    className="absolute bottom-0 w-1.5 h-12 bg-[#BA5834] origin-bottom rounded-t-full mb-px"
                  />
                  
                  {/* Digital readouts underneath the hub */}
                  <div className="absolute top-8 text-center">
                    <span className="text-[9px] font-mono text-stone-400">0</span>
                    <span className="text-[9.5px] font-mono font-bold text-stone-700 mx-5">{activeCrop.ph}</span>
                    <span className="text-[9px] font-mono text-stone-400">10</span>
                  </div>
                </div>

                <p className="text-base font-bold text-stone-800 font-mono mt-1 text-center">{activeCrop.ph}</p>
                <p className="text-[10.5px] text-emerald-600 font-mono font-bold uppercase tracking-tight">
                  ({activeCrop.phStatus})
                </p>
              </div>

              {/* Gauge 2: Light Intensity */}
              <div className="space-y-2 p-2">
                <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-tight">LIGHT INTENSITY</p>
                <div className="relative w-24 h-16 mx-auto flex items-end justify-center overflow-hidden">
                  
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    <path 
                      className="text-stone-100" 
                      fill="none" 
                      strokeWidth="5" 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      d="M 12 50 A 38 38 0 0 1 88 50" 
                    />
                    <path 
                      className="text-[#BA5834]" 
                      fill="none" 
                      strokeWidth="5" 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      d="M 12 50 A 38 38 0 0 1 76 18" 
                    />
                  </svg>

                  <motion.div 
                    animate={{ rotate: getRotationLight(activeCrop.light) }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                    className="absolute bottom-0 w-1.5 h-12 bg-amber-500 origin-bottom rounded-t-full mb-px"
                  />

                  {/* Instrument Dial limits */}
                  <div className="absolute top-8 text-center text-[9px] font-mono text-stone-400 w-full flex justify-between px-2">
                    <span>0</span>
                    <div className="text-[#BA5834]">
                      <Sun className="w-3.5 h-3.5 fill-amber-100 text-[#BA5834] inline" />
                    </div>
                    <span>1.8k</span>
                  </div>
                </div>

                <p className="text-base font-bold text-stone-800 font-mono mt-1 text-center">
                  {activeCrop.light} <span className="text-[9.5px] font-mono text-stone-400">μmol/s²</span>
                </p>
                <p className="text-[10.5px] text-[#BA5834] font-mono font-bold uppercase tracking-tight">
                  {activeCrop.lightStatus}
                </p>
              </div>

              {/* Gauge 3: Nutrient Levels (NPK) */}
              <div className="space-y-2 p-2">
                <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-tight">NUTRIENT LEVELS</p>
                <div className="relative w-24 h-16 mx-auto flex items-end justify-center overflow-hidden">
                  
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    <path 
                      className="text-stone-100" 
                      fill="none" 
                      strokeWidth="5" 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      d="M 12 50 A 38 38 0 0 1 88 50" 
                    />
                    <path 
                      className="text-[#BA5834]" 
                      fill="none" 
                      strokeWidth="5" 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      d="M 12 50 A 38 38 0 0 1 65 22" 
                    />
                  </svg>

                  <motion.div 
                    animate={{ rotate: getRotationNutrients(activeCrop.nutrients) }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                    className="absolute bottom-0 w-1.5 h-12 bg-emerald-600 origin-bottom rounded-t-full mb-px"
                  />

                  <div className="absolute top-8 text-center text-[9px] font-mono text-stone-400 w-full flex justify-between px-2">
                    <span>0%</span>
                    <div className="text-emerald-600">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600 inline" />
                    </div>
                    <span>100%</span>
                  </div>
                </div>

                <p className="text-base font-bold text-stone-800 font-mono mt-1 text-center">
                  {activeCrop.nutrients}%
                </p>
                <p className="text-[10.5px] text-emerald-600 font-mono font-bold uppercase tracking-tight">
                  NPK: {activeCrop.nutrientStatus}
                </p>
              </div>

            </div>
          </div>

          {/* Bottom Historical Analytics Charts Matching layout in Image 1 */}
          <div className="grid grid-cols-3 gap-4 items-end h-32 border-t border-stone-100 pt-4">
            
            {/* Stable pH Column panel */}
            <div className="text-center h-full flex flex-col justify-between">
              {/* Spline trace SVG */}
              <div className="h-16 w-full flex items-end justify-center bg-[#FAF9F5]/40 rounded-lg p-1">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  {/* Shaded Area spline and polyline */}
                  <path d="M0,28 Q15,18 35,22 T70,12 T100,5 L100,30 L0,30 Z" fill="#BA5834" opacity="0.1" />
                  <path 
                    d="M0,28 Q15,18 35,22 T70,12 T100,5" 
                    fill="none" 
                    stroke="url(#ph-gradient)" 
                    strokeWidth="2.5" 
                  />
                  <defs>
                    <linearGradient id="ph-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#E1DEC9' }} />
                      <stop offset="100%" style={{ stopColor: '#BA5834' }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <p className="text-[10.5px] font-bold text-stone-800 tracking-tight leading-none">6.0 - 7.5 pH</p>
                <p className="text-[9.5px] font-mono text-stone-400 uppercase mt-1">Stable Trace</p>
              </div>
            </div>

            {/* High Consistent Light daily chart */}
            <div className="text-center h-full flex flex-col justify-between">
              
              {/* Daily bars trace */}
              <div className="h-16 flex items-end gap-1.5 justify-center bg-[#FAF9F5]/40 rounded-lg p-1.5">
                <div className="w-2 bg-orange-200 h-8 rounded-t-xs"></div>
                <div className="w-2 bg-orange-300 h-11 rounded-t-xs"></div>
                <div className="w-2 bg-[#BA5834] h-14 rounded-t-xs"></div>
                <div className="w-2 bg-orange-200 h-9 rounded-t-xs"></div>
                <div className="w-2 bg-amber-400 h-12 rounded-t-xs"></div>
              </div>

              <div>
                <p className="text-[10.5px] font-bold text-stone-800 tracking-tight leading-none">1450 lux</p>
                <p className="text-[9.5px] font-mono text-stone-400 uppercase mt-1">Consistent High</p>
              </div>
            </div>

            {/* Excellent nutrients representation */}
            <div className="text-center h-full flex flex-col justify-between">
              
              {/* Three dynamic blocks representing N, P and K */}
              <div className="h-16 flex items-end gap-2.5 justify-center bg-[#FAF9F5]/40 rounded-lg p-1.5">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-3 bg-emerald-600 h-10 rounded-t-xs text-[7px] text-white font-mono flex items-center justify-center font-bold">N</div>
                  <span className="text-[8px] font-mono mt-0.5 text-stone-500">88%</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-3 bg-emerald-500 h-12 rounded-t-xs text-[7px] text-white font-mono flex items-center justify-center font-bold">P</div>
                  <span className="text-[8px] font-mono mt-0.5 text-stone-500">85%</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-3 bg-emerald-400 h-14 rounded-t-xs text-[7px] text-white font-mono flex items-center justify-center font-bold">K</div>
                  <span className="text-[8px] font-mono mt-0.5 text-stone-500">92%</span>
                </div>
              </div>

              <div>
                <p className="text-[10.5px] font-bold text-stone-800 tracking-tight leading-none">Excellent</p>
                <p className="text-[9.5px] font-mono text-stone-400 uppercase mt-1">Balanced NPK</p>
              </div>
            </div>

          </div>

        </div>

        {/* COLUMN 3: HARVEST READINESS PREDICTION (col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          <h3 className="text-center text-xs font-mono font-bold text-stone-400 uppercase tracking-wider">
            Harvest Readiness Prediction
          </h3>

          {/* Species 1: Lavender (Active selected highlight option) */}
          <div className={`bg-white p-5 rounded-[28px] shadow-xs relative border transition ${
            activeCrop.id === 'lavender' ? 'border-[#BA5834] ring-1 ring-orange-200' : 'border-[#e1d5c1]'
          }`} id="harvest-lavender">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-serif font-bold text-base text-stone-800">Lavender Field A</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Ready in {activeCrop.id === 'lavender' ? activeCrop.readyDays : 12} Days. 95% Readiness.
                </p>
              </div>
              <div className="bg-[#BA5834]/10 text-[#BA5834] text-center p-2 rounded-xl min-w-[50px] border border-orange-200">
                <p className="text-[10px] uppercase font-mono font-bold leading-none">Oct</p>
                <p className="text-lg font-bold font-mono leading-tight mt-0.5">20</p>
              </div>
            </div>

            {/* Lavender Harvest Button */}
            <button 
              onClick={() => handleHarvestRequest('Lavender')}
              className="w-full py-2 bg-[#BA5834] text-white rounded-xl text-xs font-mono font-bold uppercase hover:bg-orange-850 active:scale-95 transition cursor-pointer"
            >
              ✓ Schedule Harvest (Oct 20)
            </button>
          </div>

          {/* Species 2: Ginseng (With Progress bar representing growth state) */}
          <div className={`bg-white p-5 rounded-[28px] shadow-xs relative border transition ${
            activeCrop.id === 'ginseng' ? 'border-[#BA5834] ring-1 ring-orange-200' : 'border-[#e1d5c1]'
          }`} id="harvest-ginseng">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-serif font-bold text-base text-stone-800">Ginseng Root Shard</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Ready in {activeCrop.id === 'ginseng' ? activeCrop.readyDays : 45} Days. 80% Readiness.
                </p>
              </div>
              <div className="bg-amber-50 text-[#BA5834] border border-orange-200 text-center p-2 rounded-xl min-w-[50px]">
                <p className="text-[10px] uppercase font-mono font-bold leading-none">Nov</p>
                <p className="text-lg font-bold font-mono leading-tight mt-0.5">22</p>
              </div>
            </div>

            {/* Ginseng progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-stone-400">
                <span>Vegetative cycle</span>
                <span className="font-bold">80% complete</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200/50">
                <div className="bg-[#BA5834] h-full rounded-full transition-all duration-500" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

          {/* Species 3: Rare Herbs (Requires Monitoring alert highlighted card) */}
          <div className={`bg-white p-5 rounded-[28px] shadow-xs relative border transition ${
            activeCrop.id === 'rare_herbs' ? 'border-[#BA5834] ring-1 ring-orange-200' : 'border-[#e1d5c1]'
          }`} id="harvest-rare-herbs">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-base text-stone-800">Rare Herbs Zone 4</h4>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Ready in {activeCrop.id === 'rare_herbs' ? activeCrop.readyDays : 60} Days. 65% Readiness.
                </p>
              </div>
              <div className="bg-neutral-50 text-stone-500 border border-neutral-200 text-center p-2 rounded-xl min-w-[50px]">
                <p className="text-[10px] uppercase font-mono font-bold leading-none">Dec</p>
                <p className="text-lg font-bold font-mono leading-tight mt-0.5">10</p>
              </div>
            </div>

            {/* Warning Callout exactly mimicking design in Image 1 */}
            <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-[10.5px] font-mono mb-3 uppercase font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
              <span>Requires daily monitoring logs</span>
            </div>

            {/* Rare Herbs progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-stone-400">
                <span>Vegetative cycle</span>
                <span className="font-bold">65% complete</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200/50">
                <div className="bg-[#BA5834] h-full rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
