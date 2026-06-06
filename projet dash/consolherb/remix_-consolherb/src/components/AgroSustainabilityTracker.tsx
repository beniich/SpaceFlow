import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Droplets, Check, Plus, ShieldCheck, HelpCircle } from 'lucide-react';

interface AgroSustainabilityTrackerProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroSustainabilityTracker({ onAddLog }: AgroSustainabilityTrackerProps) {
  // Ecological activities list state
  const [activities, setActivities] = useState([
    { id: 1, text: 'Cover cropping implemented - Field B', active: true },
    { id: 2, text: 'Reforestation project started - Zone 4', active: true },
    { id: 3, text: 'Irrigation system upgraded', active: true }
  ]);
  const [newActivity, setNewActivity] = useState('');

  // Offset recommendations expansion states
  const [expandedRec, setExpandedRec] = useState<string | null>('reforestation');

  // Stats interactive levels
  const [biodiversity, setBiodiversity] = useState(85);
  const [soilHealth, setSoilHealth] = useState(92);
  const [renewableEnergy, setRenewableEnergy] = useState(60);

  // Water savings indicator toggle (Simulate monthly baseline comparison)
  const [waterSaved, setWaterSaved] = useState(1250000);
  const [carbonSequestered, setCarbonSequestered] = useState(450);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;
    const item = {
      id: Date.now(),
      text: newActivity.trim(),
      active: true
    };
    setActivities(prev => [...prev, item]);
    onAddLog('success', `ECOLOGY: Activité ajoutée: "${newActivity}"`);
    setNewActivity('');
  };

  const handleExploreCredit = () => {
    onAddLog('info', 'ECOLOGY: Simulation de l\'investissement carbone - Consultation des crédits de reboisement.');
    setCarbonSequestered(prev => Math.min(500, prev + 15));
    setBiodiversity(prev => Math.min(100, prev + 1));
  };

  const handleSoilProject = () => {
    onAddLog('info', 'ECOLOGY: Évaluation du projet carbone pour les sols. Index amendement amendé.');
    setSoilHealth(prev => Math.min(100, prev + 2));
  };

  const handleEnergyPlan = () => {
    onAddLog('info', 'ECOLOGY: Audit énergétique. Optimisation hybride éolien/solaire enclenchée.');
    setRenewableEnergy(prev => Math.min(100, prev + 5));
    setWaterSaved(prev => prev + 15000);
  };

  return (
    <div className="bg-[#fdfbf9] text-[#4a4a4a] p-6 rounded-[28px] border border-stone-200/60 font-sans shadow-lg select-none" id="ecology-tracker-module">
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-orange-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#f26b4f] to-[#e65a3d] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">AgroMaître <span className="text-xs font-normal text-gray-400">(Herboferme)</span></span>
              <span className="text-[9px] bg-orange-50 text-[#f26b4f] border border-orange-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">ECO_LOGISTICS</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">Image 3: Sustainability, Water Flow & Organic Carbon Index</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-sans font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            ECOLOGICALLY STABLE
          </span>
        </div>
      </header>

      {/* Main Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Sustainability & Ecological Impact Tracker</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitoring Your Farm's Environmental Footprint in Real-Time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left card: Water Savings */}
        <div className="bg-white rounded-[24px] border border-stone-100 p-6 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:shadow-md transition duration-300">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 shadow-inner">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 leading-none">Water Savings</h3>
                  <p className="text-xs text-gray-400 mt-1">Compared to Baseline</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-gray-800 font-mono">{waterSaved.toLocaleString()} Liters</div>
                <div className="text-[11px] font-semibold text-green-500">↑ Trend positive +4.2%</div>
              </div>
            </div>
          </div>

          {/* Area Chart Container - SVG Wave */}
          <div className="h-32 w-full bg-gradient-to-b from-sky-50/20 to-sky-100/10 rounded-2xl relative overflow-hidden border border-sky-100/40">
            <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {/* Path representing the wave */}
              <path d="M0 40 Q 15 28, 30 32 T 60 22 T 85 28 T 100 18 V 40 H 0 Z" fill="url(#waterGrad)" />
              <path d="M0 40 Q 15 28, 30 32 T 60 22 T 85 28 T 100 18" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
            </svg>
            <div className="absolute inset-x-4 top-2 flex justify-between text-[10px] font-mono text-sky-600/80">
              <span>WTR_AGRO_OPTIMIZED_FLOW</span>
              <span>100% REGULATED</span>
            </div>
          </div>
        </div>

        {/* Right card: Carbon Sequestration */}
        <div className="bg-white rounded-[24px] border border-stone-100 p-6 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:shadow-md transition duration-300">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shadow-inner">
                  <Leaf className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 leading-none">Carbon Sequestration</h3>
                  <p className="text-xs text-gray-400 mt-1">Total Sequestered</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-gray-800个人 font-mono">{carbonSequestered} Tons CO₂e</div>
                <div className="text-[11px] text-gray-400">Target: 500 Tons</div>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-32 w-full bg-orange-50/10 rounded-2xl relative overflow-hidden border border-orange-100/40 p-4 flex items-end justify-between gap-3">
            <div className="absolute inset-x-4 top-2 flex justify-between text-[10px] font-mono text-orange-600/80">
              <span>CO2_EMISSIONS_CAP_INDEX</span>
              <span>FOREST_REGENERATION</span>
            </div>

            {/* 5 Organic Bars representing development progress */}
            {[
              { label: 'Jun', value: 30 },
              { label: 'Jul', value: 45 },
              { label: 'Aug', value: 60 },
              { label: 'Sep', value: 80 },
              { label: 'Oct', value: 95 }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 z-10">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.value}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="w-full bg-gradient-to-t from-[#e65a3d] to-[#f26b4f] hover:brightness-110 rounded-t-md transition shadow-xs"
                />
                <span className="text-[9px] font-mono text-gray-400 select-none">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row with butterfly Index, soil health index, renewable usage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-stone-100 p-5 rounded-[20px] flex items-center gap-4 hover:border-orange-200 transition">
          <div className="text-3xl filter drop-shadow-sm select-none">🦋</div>
          <div>
            <div className="text-xs text-gray-400 uppercase font-mono font-bold tracking-wider">Biodiversity Score</div>
            <div className="text-xl font-bold text-gray-800 mt-0.5">
              {biodiversity}/100 <span className="text-[11px] font-medium text-green-500 ml-1">High</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-100 p-5 rounded-[20px] flex items-center gap-4 hover:border-orange-200 transition">
          <div className="text-3xl filter drop-shadow-sm select-none">🌱</div>
          <div>
            <div className="text-xs text-gray-400 uppercase font-mono font-bold tracking-wider">Soil Health Index</div>
            <div className="text-xl font-bold text-gray-800 mt-0.5">
              {soilHealth}% <span className="text-[11px] font-medium text-green-500 ml-1">Optimal</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-100 p-5 rounded-[20px] flex items-center gap-4 hover:border-orange-200 transition">
          <div className="text-3xl filter drop-shadow-sm select-none">☀️</div>
          <div>
            <div className="text-xs text-gray-400 uppercase font-mono font-bold tracking-wider">Renewable Energy</div>
            <div className="text-xl font-bold text-gray-800 mt-0.5">
              {renewableEnergy}% <span className="text-[11px] font-medium text-green-500 ml-1">Growing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: Recent Ecological Activities list */}
        <div className="bg-white rounded-[24px] border border-stone-100 p-6 shadow-xs">
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="p-1 bg-[#fff5f2] rounded-lg">📋</span> Recent Ecological Activities
          </h2>

          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-center gap-3 p-3 bg-stone-50/50 rounded-xl border border-stone-100 text-sm">
                <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xs text-white">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-gray-700 font-medium">{act.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddActivity} className="flex gap-2 mt-4">
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              placeholder="Add agronomic activity..."
              className="flex-grow px-4 py-2 border border-gray-200 focus:border-[#f26b4f] rounded-xl text-xs outline-none bg-stone-50/30"
              maxLength={40}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] hover:opacity-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Right side: Offset Recommendations interactive options */}
        <div className="bg-white rounded-[24px] border border-stone-100 p-6 shadow-xs">
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="p-1 bg-[#fff5f2] rounded-lg">💡</span> Offset Recommendations
          </h2>

          <div className="space-y-3">
            {/* Item 1 */}
            <div className="border border-stone-100 rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setExpandedRec(expandedRec === 'reforestation' ? null : 'reforestation')}
                className="w-full text-left p-3.5 bg-gradient-to-r from-[#fefefe] to-[#faf9f6] flex justify-between items-center text-xs font-semibold text-gray-700"
              >
                <span>Explore Reforestation Credits</span>
                <span className="text-gray-400">{expandedRec === 'reforestation' ? '▼' : '▶'}</span>
              </button>
              <AnimatePresence>
                {expandedRec === 'reforestation' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-stone-50/50"
                  >
                    <div className="p-3.5 text-[11px] text-gray-500 leading-relaxed border-t border-stone-100">
                      Invest in certified forestry initiatives to compensate for crop operations greenhouse emissions. Clicking below simulates securing 15 units of Carbon Credit.
                      <button
                        type="button"
                        onClick={handleExploreCredit}
                        className="mt-2.5 w-full py-1.5 bg-[#f26b4f]/10 text-[#f26b4f] font-bold rounded-lg border border-[#f26b4f]/20 hover:bg-[#f26b4f]/20 transition text-[10px]"
                      >
                        Acquire Forestry Credit +15 CO₂e
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Item 2 */}
            <div className="border border-stone-100 rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setExpandedRec(expandedRec === 'soil_carbon' ? null : 'soil_carbon')}
                className="w-full text-left p-3.5 bg-gradient-to-r from-[#fefefe] to-[#faf9f6] flex justify-between items-center text-xs font-semibold text-gray-700"
              >
                <span>Invest in Soil Carbon Projects</span>
                <span className="text-gray-400">{expandedRec === 'soil_carbon' ? '▼' : '▶'}</span>
              </button>
              <AnimatePresence>
                {expandedRec === 'soil_carbon' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-stone-50/50"
                  >
                    <div className="p-3.5 text-[11px] text-gray-500 leading-relaxed border-t border-stone-100">
                      Ameliorate microbiological soil structures utilizing organic cover compost blocks.
                      <button
                        type="button"
                        onClick={handleSoilProject}
                        className="mt-2.5 w-full py-1.5 bg-[#f26b4f]/10 text-[#f26b4f] font-bold rounded-lg border border-[#f26b4f]/20 hover:bg-[#f26b4f]/20 transition text-[10px]"
                      >
                        Launch Direct Compost Amendment
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Item 3 */}
            <div className="border border-stone-100 rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setExpandedRec(expandedRec === 'energy_audit' ? null : 'energy_audit')}
                className="w-full text-left p-3.5 bg-gradient-to-r from-[#fefefe] to-[#faf9f6] flex justify-between items-center text-xs font-semibold text-gray-700"
              >
                <span>Review Energy Efficiency Plan</span>
                <span className="text-gray-400">{expandedRec === 'energy_audit' ? '▼' : '▶'}</span>
              </button>
              <AnimatePresence>
                {expandedRec === 'energy_audit' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-stone-50/50"
                  >
                    <div className="p-3.5 text-[11px] text-gray-500 leading-relaxed border-t border-stone-100">
                      Audit all greenhouse HVAC parameters to deploy wind-solaire backup batteries.
                      <button
                        type="button"
                        onClick={handleEnergyPlan}
                        className="mt-2.5 w-full py-1.5 bg-[#f26b4f]/10 text-[#f26b4f] font-bold rounded-lg border border-[#f26b4f]/20 hover:bg-[#f26b4f]/20 transition text-[10px]"
                      >
                        Optimize Energy Throttling Ratios
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
