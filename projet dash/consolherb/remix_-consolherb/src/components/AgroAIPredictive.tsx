import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Check, 
  HelpCircle, 
  Database, 
  Sliders,
  Sparkles,
  RefreshCw,
  Bug,
  Droplet,
  ShieldCheck
} from 'lucide-react';

interface RiskFactor {
  id: string;
  title: string;
  level: 'High' | 'Moderate' | 'Low';
  desc: string;
  impact: number;
  action: string;
  solved: boolean;
  icon: string;
}

interface AgroAIPredictiveProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroAIPredictive({ onAddLog }: AgroAIPredictiveProps) {
  // Scenario simulation state variables
  const [waterRate, setWaterRate] = useState(25);
  const [fertilizerLevel, setFertilizerLevel] = useState(80);
  const [simulatedYield, setSimulatedYield] = useState(18500);

  // Active risk factors from Image 3
  const [risks, setRisks] = useState<RiskFactor[]>([
    {
      id: 'r1',
      title: 'Pest Alert (Locusts)',
      level: 'High',
      desc: 'Southeast Region',
      impact: 5,
      action: 'Deploy bio-control agents',
      solved: false,
      icon: '🦗'
    },
    {
      id: 'r2',
      title: 'Drought Risk',
      level: 'Moderate',
      desc: 'West Fields',
      impact: 8,
      action: 'Adjust irrigation schedule',
      solved: false,
      icon: '☀️'
    },
    {
      id: 'r3',
      title: 'Disease Forecast (Rust)',
      level: 'Low',
      desc: 'All Zones',
      impact: 2,
      action: 'Preventative fungicide application',
      solved: false,
      icon: '🍄'
    }
  ]);

  // Recalculate projected harvest dynamically
  useEffect(() => {
    // Under optimal soil & fertilisation ratios, yield rises
    const baseHarvest = 16000;
    const waterBonus = Math.sin((waterRate / 50) * Math.PI) * 2000;
    const fertBonus = (fertilizerLevel / 150) * 1500;
    
    // Penalize harvest based on unsolved risk impacts
    const riskPenalty = risks
      .filter(r => !r.solved)
      .reduce((sum, r) => sum + (r.impact / 100) * 12000, 0);

    const calculatedResult = Math.round(baseHarvest + waterBonus + fertBonus - riskPenalty);
    setSimulatedYield(Math.max(4000, calculatedResult));
  }, [waterRate, fertilizerLevel, risks]);

  const handleSolveRisk = (id: string, title: string, action: string) => {
    setRisks(prev => prev.map(r => {
      if (r.id === id) {
        onAddLog('success', `AI_PREDICTIVE: Action "${action}" complétée avec succès. Menace [${title}] neutralisée.`);
        return { ...r, solved: true };
      }
      return r;
    }));
  };

  const handleResetRisks = () => {
    setRisks(prev => prev.map(r => ({ ...r, solved: false })));
    setWaterRate(25);
    setFertilizerLevel(80);
    onAddLog('info', 'AI_PREDICTIVE: Réinitialisation des simulations et réactivation des épidémies saisonnières.');
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-ai-predictions-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#BA5834] to-[#f26b4f] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451e09]">AgroMaître AI Predictions Hub</span>
              <span className="text-[9px] bg-red-50 text-[#BA5834] border border-orange-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">Image 3: Yield Simulator</span>
            </div>
            <p className="text-xs text-stone-500 font-mono uppercase">Neural Growth Models & Crop Variation Indexes</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleResetRisks}
            className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 px-3 py-1.5 rounded-full font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Scenario</span>
          </button>
        </div>
      </header>

      {/* Main Title Banner */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-[#451e09] tracking-tight">Projected Yield vs. Historical Data</h1>
        <p className="text-xs text-[#6e5845] font-mono uppercase mt-0.5">Automated yield forecast model calibrated across historical seasonal vectors</p>
      </div>

      {/* Big Chart Panel mimicking Image 3 precisely */}
      <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-6 shadow-xs mb-8">
        
        {/* Upper metadata row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 select-none">
          <span className="text-xs font-mono text-stone-400 font-bold uppercase tracking-widest">Yield (Tons)</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
            <span className="font-serif font-bold text-base text-[#BA5834]">
              Projected Harvest: {simulatedYield.toLocaleString()} Tons (Oct 2024)
            </span>
          </div>
        </div>

        {/* Beautiful curved spline graph vector representation */}
        <div className="h-56 w-full bg-[#FCFBF8] border border-[#e1d5c1]/40 rounded-2xl relative p-4 flex flex-col justify-end">
          
          <div className="absolute inset-x-4 top-4 bottom-12 select-none pointer-events-none">
            {/* Guide markers */}
            <div className="absolute inset-x-0 h-px border-t border-dashed border-stone-100 top-1/4" />
            <div className="absolute inset-x-0 h-px border-t border-dashed border-stone-100 top-2/4" />
            <div className="absolute inset-x-0 h-px border-t border-dashed border-stone-100 top-3/4" />

            <div className="absolute right-12 top-6 font-mono text-[9px] bg-orange-50 text-[#BA5834] px-2 py-0.5 border border-orange-100 rounded-md">
              Target: 18,500T
            </div>
          </div>

          {/* Curved spline route representing history and prediction */}
          <svg className="w-full h-full absolute inset-0 rounded-2xl overflow-hidden p-1.5" viewBox="0 0 1000 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="yieldCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f26b4f" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f26b4f" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area under spline */}
            <path 
              d={`M 10 180 
                  C 200 130, 300 170, 480 140 
                  C 550 120, 680 ${140 - (simulatedYield / 150)}, 850 ${120 - (simulatedYield / 150)} 
                  C 920 ${80 - (simulatedYield / 120)}, 960 ${100 - (simulatedYield / 100)}, 980 ${130 - (simulatedYield / 90)} 
                  L 980 220 L 10 220 Z`}
              fill="url(#yieldCurveGrad)"
            />

            {/* Curved graph boundary line */}
            <path 
              d={`M 10 180 
                  C 200 130, 300 170, 480 140 
                  C 550 120, 680 ${140 - (simulatedYield / 150)}, 850 ${120 - (simulatedYield / 150)} 
                  C 920 ${80 - (simulatedYield / 120)}, 960 ${100 - (simulatedYield / 100)}, 980 ${130 - (simulatedYield / 90)}`}
              fill="none"
              stroke="#BA5834"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Shard Points markers */}
            <circle cx="10" cy="180" r="4.5" fill="#e3612d" />
            <circle cx="210" cy="140" r="4.5" fill="#e3612d" />
            <circle cx="485" cy="140" r="4.5" fill="#e3612d" />
            <circle cx="730" cy="90" r="4.5" fill="#e3612d" />
            {/* Pulsing indicator at peak */}
            <circle cx="980" cy={130 - (simulatedYield / 90)} r="7" fill="#f26b4f" className="animate-ping opacity-60" />
            <circle cx="980" cy={130 - (simulatedYield / 90)} r="4.5" fill="#BA5834" />
          </svg>

          {/* Time axis text */}
          <div className="flex justify-between text-[10px] font-mono text-stone-400 font-bold px-2 relative z-10 border-t border-stone-100 pt-2 select-none">
            <span>Jan 2023</span>
            <span>Jul 2023</span>
            <span>Jan 2024</span>
            <span>Jul 2024</span>
            <span>Oct 2024 (Harvest)</span>
          </div>
        </div>

        {/* Below summary figures */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-stone-100">
          {/* Custom Interactive Sliders to let user test predictions */}
          <div className="flex flex-col sm:flex-row gap-6 flex-1 w-full sm:w-auto">
            
            {/* Water Simulator */}
            <div className="flex-1">
              <div className="flex justify-between text-[10.5px] font-mono font-bold text-stone-500 mb-1 uppercase select-none">
                <span>Simulate Water Irrig:</span>
                <span className="text-[#BA5834]">{waterRate} L/m²</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={waterRate}
                onChange={(e) => setWaterRate(parseInt(e.target.value))}
                className="w-full accent-[#BA5834] bg-stone-150 h-1 rounded-sm cursor-pointer"
              />
            </div>

            {/* Fertilizer input */}
            <div className="flex-1">
              <div className="flex justify-between text-[10.5px] font-mono font-bold text-stone-500 mb-1 uppercase select-none">
                <span>NPK Distribution:</span>
                <span className="text-[#BA5834]">{fertilizerLevel} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={fertilizerLevel}
                onChange={(e) => setFertilizerLevel(parseInt(e.target.value))}
                className="w-full accent-[#BA5834] bg-stone-150 h-1 rounded-sm cursor-pointer"
              />
            </div>

          </div>

          <div className="shrink-0 font-serif font-bold text-[#451e09] text-sm bg-orange-50 px-3.5 py-1.5 border border-orange-100 rounded-xl select-none">
            Yield Variation: +15% vs Last Year
          </div>
        </div>

      </div>

      {/* Section 2: AI Risk Factors underneath layout (Replicates Image 3) */}
      <div className="mb-4">
        <h3 className="font-mono text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
          AI ALERT RISK FACTORS & ENVIRONMENTAL THREATS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {risks.map((risk) => {
            const dangerColor = 
              risk.level === 'High' 
                ? 'bg-red-50 text-red-600 border-red-100' 
                : risk.level === 'Moderate' 
                  ? 'bg-orange-50 text-orange-600 border-orange-100' 
                  : 'bg-stone-50 text-stone-500 border-stone-200';

            return (
              <div 
                key={risk.id}
                className={`bg-white border rounded-[22px] p-5.5 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  risk.solved ? 'border-green-200 bg-green-50/10 shadow-xs' : 'border-[#e1d5c1] hover:scale-101'
                }`}
              >
                <div>
                  {/* Glowing Icon state reproducing the warm orange shadow glows */}
                  <div className="flex justify-between items-start mb-3.5 select-none">
                    <span className="text-3xl p-1 bg-amber-50 rounded-xl leading-none">{risk.icon}</span>
                    
                    <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border uppercase ${
                      risk.solved ? 'bg-green-100 text-green-700 border-green-200' : dangerColor
                    }`}>
                      {risk.solved ? '✓ RESOLVED' : `${risk.level} Risk`}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-stone-800">{risk.title}</h4>
                  
                  <div className="space-y-1 mt-2 text-xs text-stone-500 leading-relaxed font-mono">
                    <div>Range: <strong>{risk.desc}</strong></div>
                    <div>YTD Impact: <strong className={risk.solved ? 'text-green-600 line-through' : 'text-red-500'}>-{risk.impact}% Yield</strong></div>
                  </div>
                </div>

                {/* Clickable mitigation solving buttons */}
                <div className="mt-5.5 pt-3 border-t border-stone-100">
                  {risk.solved ? (
                    <div className="text-center font-mono text-[10.5px] font-bold text-green-600 flex items-center justify-center gap-1 bg-green-50/50 py-2 rounded-xl">
                      <Check className="w-3.5 h-3.5" />
                      <span>Mitigated Securised</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSolveRisk(risk.id, risk.title, risk.action)}
                      className="w-full py-2 bg-[#FAF9F5] hover:bg-[#BA5834] border border-[#BA5834]/30 text-[#BA5834] hover:text-white transition duration-200 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Trigger: {risk.action}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
