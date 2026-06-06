import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bug, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  HelpCircle,
  Wind,
  Droplet,
  Thermometer,
  Compass,
  Play,
  RotateCcw
} from 'lucide-react';

interface PestAlert {
  id: string;
  name: string;
  type: 'Fungal' | 'Insect' | 'Viral' | 'Bacterial';
  pathogen: string;
  urgency: 'Critical' | 'Warning' | 'Low';
  zone: string;
  details: string;
  status: 'active' | 'mitigating' | 'eradicated';
  agent: string;
}

interface AgroPestWarningProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroPestWarning({ onAddLog }: AgroPestWarningProps) {
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [activeAlerts, setActiveAlerts] = useState<PestAlert[]>([
    {
      id: 'a1',
      name: 'Late Blight',
      type: 'Fungal',
      pathogen: 'Phytophthora infestans',
      urgency: 'Critical',
      zone: 'Zone A (Southwest)',
      details: 'High spore concentration detected following morning dampness. Rapid foliar lesions observed.',
      status: 'active',
      agent: 'Trifloxystrobin bio-spray'
    },
    {
      id: 'a2',
      name: 'Aphid Swarm',
      type: 'Insect',
      pathogen: 'Myzus persicae',
      urgency: 'Warning',
      zone: 'Zone C (West Ridge)',
      details: 'Visual drone scanners identify high insect aggregation. Potential virus vectors active.',
      status: 'active',
      agent: 'Coccinella septempunctata predators'
    },
    {
      id: 'a3',
      name: 'Powdery Mildew',
      type: 'Fungal',
      pathogen: 'Podosphaera xanthii',
      urgency: 'Low',
      zone: 'Zone B (East Greenhouse)',
      details: 'Minor white powdery residue on base leaves. Spreading slowly.',
      status: 'active',
      agent: 'Bacillus subtilis powder'
    }
  ]);

  // Heatmap interactive vector simulation representing Zone Risk Levels
  const zonesList = [
    { id: 'A', name: 'Zone A (Southwest)', risk: 'Critical', score: 92, temp: '21°C', hum: '88%', color: 'bg-red-500' },
    { id: 'B', name: 'Zone B (East Greenhouse)', risk: 'Low', score: 28, temp: '26°C', hum: '54%', color: 'bg-emerald-500' },
    { id: 'C', name: 'Zone C (West Ridge)', risk: 'Warning', score: 68, temp: '19°C', hum: '72%', color: 'bg-orange-500' },
    { id: 'D', name: 'Zone D (North Meadow)', risk: 'Low', score: 14, temp: '22°C', hum: '45%', color: 'bg-emerald-500' }
  ];

  const handleMitigate = (id: string, name: string, agent: string) => {
    onAddLog('info', `PESTS: Lancement de l'agent biologique "${agent}" contre "${name}"...`);
    setActiveAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: 'mitigating' };
      }
      return a;
    }));

    setTimeout(() => {
      setActiveAlerts(prev => prev.map(a => {
        if (a.id === id) {
          onAddLog('success', `PESTS: "${name}" éradiqué avec succès dans son secteur de propagation !`);
          return { ...a, status: 'eradicated' };
        }
        return a;
      }));
    }, 2800);
  };

  const handleResetPests = () => {
    setActiveAlerts(prev => prev.map(a => ({ ...a, status: 'active' })));
    onAddLog('info', 'PESTS: Simulation d\'attaques fongiques et d\'infestations d\'insectes réinitialisée.');
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-pest-warning-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#c25a3d] to-[#d97c5f] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#1a0e08]">Pest & Disease Early Warning System</span>
              <span className="text-[9px] bg-amber-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">Active Warning</span>
            </div>
            <p className="text-xs text-stone-500 font-mono uppercase">Early Spore Filtration, Drone Thermal Imaging & Eco-Insect Controls</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleResetPests}
            className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 px-3 py-1.5 rounded-full font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Warnings</span>
          </button>
        </div>
      </header>

      {/* Main interactive grid representing Screen 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side (col-span-8): Dynamic Map with Thermal Heatmap Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4 select-none">
              <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider">
                Thermal Spore Hotspots & Zone Heatmap Overlay
              </h3>
              <div className="flex gap-1">
                {['All', 'Critical', 'Warning', 'Low'].map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedZone(f)}
                    className={`text-[8.5px] font-mono font-bold px-2 py-1 rounded-md border transition ${
                      selectedZone === f 
                        ? 'bg-[#c25a3d] text-white border-[#c25a3d]' 
                        : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Interactive Grid Map */}
            <div className="h-64 bg-[#e8eeea] border border-[#cbd9d1] rounded-2xl relative p-4 overflow-hidden flex items-center justify-center select-none">
              {/* Topographical contours mock lines */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <path d="M 10 10 Q 50 80, 100 20 T 200 40 T 300 10 T 400 30" fill="none" stroke="#223b20" strokeWidth="1" />
                  <path d="M 10 60 Q 120 180, 200 80 T 350 120 T 400 70" fill="none" stroke="#223b20" strokeWidth="1" />
                  <path d="M 40 140 Q 180 40, 280 160 T 400 130" fill="none" stroke="#223b20" strokeWidth="1" strokeDasharray="3,3" />
                </svg>
              </div>

              {/* Pulsing Heatmap zones overlay */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/25 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-orange-500/20 rounded-full blur-lg" />
              <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />

              {/* Live clickable Hotspot Pin triggers */}
              <div className="absolute grid grid-cols-2 gap-8 w-full max-w-sm px-6">
                {zonesList.map(z => {
                  const matchesFilter = selectedZone === 'All' || z.risk === selectedZone;
                  if (!matchesFilter) return null;

                  return (
                    <motion.div
                      key={z.id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-white/90 backdrop-blur-xs border border-stone-200 p-3 rounded-xl shadow-md cursor-pointer relative"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-serif font-bold text-[#1a0e08] text-[11px]">{z.name}</span>
                        <span className={`w-2 h-2 rounded-full ${z.color} animate-pulse`} />
                      </div>
                      <div className="text-[9px] font-mono text-stone-500">
                        Risk Rank: <strong className={z.risk === 'Critical' ? 'text-red-500' : 'text-stone-700'}>{z.risk}</strong> • {z.score}%
                      </div>
                      <div className="flex gap-2 text-[8px] font-mono text-stone-400 mt-1 border-t border-stone-100 pt-1">
                        <span>🌡️ {z.temp}</span>
                        <span>💧 {z.hum}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Environmental correlation log parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <div className="text-left font-mono">
                  <span className="text-[8.5px] uppercase text-stone-400 block font-bold leading-none">Spore Spread Trigger Temp:</span>
                  <strong className="text-xs text-stone-850">Above 18°C Required</strong>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <Droplet className="w-5 h-5 text-blue-500 animate-pulse" />
                <div className="text-left font-mono">
                  <span className="text-[8.5px] uppercase text-stone-400 block font-bold leading-none">Optimal Relative Humidity:</span>
                  <strong className="text-xs text-stone-850">&gt;85% for Powdery Sprout</strong>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <Wind className="w-5 h-5 text-emerald-500" />
                <div className="text-left font-mono">
                  <span className="text-[8.5px] uppercase text-stone-400 block font-bold leading-none">Sect_East Vector Swarm Direction:</span>
                  <strong className="text-xs text-stone-850">SE Winds 4.5m/s (Worsening CC)</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side (col-span-4): Urgent alerts & mitigations sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2 select-none">
            Pathological Alarms & Biocomitments
          </h3>

          <div className="space-y-4">
            {activeAlerts.map(alert => {
              const urgencyColor = 
                alert.urgency === 'Critical' 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : alert.urgency === 'Warning' 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-stone-50 text-stone-500 border-stone-200';

              return (
                <div 
                  key={alert.id}
                  className={`bg-white border rounded-[22px] p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    alert.status === 'eradicated' 
                      ? 'border-green-200 bg-green-50/10 shadow-inner' 
                      : 'border-[#e1d5c1] hover:shadow-xs'
                  }`}
                >
                  {/* Glowing background stripe for alert status */}
                  {alert.status === 'mitigating' && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-sky-500 animate-pulse" />
                  )}

                  <div>
                    <div className="flex justify-between items-start mb-2 select-none">
                      <span className={`text-[9px] font-mono font-bold border rounded-full px-2 py-0.5 uppercase tracking-wide shrink-0 ${
                        alert.status === 'eradicated' ? 'bg-green-100 text-green-700 border-green-200' : urgencyColor
                      }`}>
                        {alert.status === 'eradicated' ? 'Eradicated' : alert.urgency}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 text-right">{alert.zone}</span>
                    </div>

                    <h4 className="text-xs font-serif font-bold text-stone-900 leading-none">{alert.name}</h4>
                    <p className="text-[10px] text-stone-400 italic font-mono mt-0.5">{alert.pathogen}</p>
                    <p className="text-[11px] text-stone-500 mt-2 font-serif leading-relaxed">{alert.details}</p>
                  </div>

                  {/* Mitigation Control Footer */}
                  <div className="border-t border-stone-100 pt-3 mt-4">
                    {alert.status === 'eradicated' ? (
                      <div className="flex items-center justify-center gap-1.5 text-green-600 font-mono text-[10px] font-bold bg-green-50/40 py-1.5 rounded-lg border border-green-200/50">
                        <Check className="w-3.5 h-3.5" />
                        <span>ECO_SAFE ERADICATED</span>
                      </div>
                    ) : alert.status === 'mitigating' ? (
                      <div className="flex items-center justify-center gap-1.5 text-sky-600 font-mono text-[9.5px] font-bold bg-sky-50/40 py-1.5 rounded-lg border border-sky-200/40">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                          className="w-3 h-3 border-t border-b border-sky-600 rounded-full"
                        />
                        <span>MIGRATING AGENT APPLIED...</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMitigate(alert.id, alert.name, alert.agent)}
                        className="w-full py-1.5 bg-[#FAF9F5] hover:bg-[#c25a3d] border border-[#c25a3d]/30 hover:border-[#c25a3d] text-[#c25a3d] hover:text-white rounded-lg text-[9.5px] font-mono font-bold uppercase tracking-wide transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <ShieldAlert className="w-3 h-3" />
                        <span>Deploy: {alert.agent.split(' ')[0]}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
