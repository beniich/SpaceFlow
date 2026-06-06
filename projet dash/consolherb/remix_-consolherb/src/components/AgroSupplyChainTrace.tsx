import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Truck, 
  CheckCircle, 
  Clock, 
  Database,
  ArrowRight,
  Shield,
  Activity,
  ChevronRight,
  Sparkles,
  Search,
  Check
} from 'lucide-react';

interface TraceStep {
  id: string;
  name: string;
  desc: string;
  status: 'completed' | 'active' | 'pending';
  timestamp: string;
  operator: string;
}

interface ShipCargo {
  id: string;
  item: string;
  destination: string;
  eta: string;
  temp: string;
  humidity: string;
  blockchainHash: string;
  steps: TraceStep[];
}

interface AgroSupplyChainTraceProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroSupplyChainTrace({ onAddLog }: AgroSupplyChainTraceProps) {
  const [activeCargoId, setActiveCargoId] = useState<string>('c1');
  const [shippingCargos, setShippingCargos] = useState<ShipCargo[]>([
    {
      id: 'c1',
      item: 'Sweet Basil Seedlings Plugs',
      destination: 'Marseille Wholesale Hub',
      eta: '3 hrs 45 mins',
      temp: '4.8°C',
      humidity: '62%',
      blockchainHash: '0x3be415f9ad28cb5b',
      steps: [
        { id: 's1', name: 'Harvesting', desc: 'Handpicked organic sweet basil stems plug-ins', status: 'completed', timestamp: '08:15 AM', operator: 'Jean Dupont' },
        { id: 's2', name: 'Cold Washing', desc: 'Pre-cooled at 4°C to lock volatile botanical oils', status: 'completed', timestamp: '09:30 AM', operator: 'Jeanine Dupont' },
        { id: 's3', name: 'Sorting & QA', desc: 'Machine-vision color sort & pathogen validation test', status: 'completed', timestamp: '11:15 AM', operator: 'Michel Lemaire' },
        { id: 's4', name: 'Labelling', desc: 'Hashed QR labels attached with smart-contract binding', status: 'active', timestamp: '02:30 PM', operator: 'System Auto' },
        { id: 's5', name: 'Cold Shipping', desc: 'Dispatched in refrigerated Transit-Tractor 12B', status: 'pending', timestamp: 'Pending', operator: 'Robert Claveau' }
      ]
    },
    {
      id: 'c2',
      name: 'Peppermint Extract Oils',
      item: 'Pure Mentha Extract Oils Ref: M2',
      destination: 'Lyon Bio-Pharma Lab',
      eta: '1 Day 4 Hours',
      temp: '14.2°C',
      humidity: '45%',
      blockchainHash: '0x99fe51dfd24ce10e',
      steps: [
        { id: 's1', name: 'Harvesting', desc: 'Mentha piperita leaf pruning', status: 'completed', timestamp: 'Yesterday 02:15 PM', operator: 'Jean Dupont' },
        { id: 's2', name: 'Cold Washing', desc: 'Drying and vacuum extraction validation', status: 'completed', timestamp: 'Yesterday 04:30 PM', operator: 'Michel Lemaire' },
        { id: 's3', name: 'Sorting & QA', desc: 'Density & GC-MS purity validation complete', status: 'active', timestamp: 'Today 10:15 AM', operator: 'System Auto' },
        { id: 's4', name: 'Labelling', desc: 'QR security barcode verification pending', status: 'pending', timestamp: 'Pending', operator: 'Pending' },
        { id: 's5', name: 'Cold Shipping', desc: 'Courier dispatch preparation', status: 'pending', timestamp: 'Pending', operator: 'Pending' }
      ]
    }
  ]);

  const activeCargo = shippingCargos.find(c => c.id === activeCargoId) || shippingCargos[0];

  const handleAdvanceStep = (cargoId: string) => {
    setShippingCargos(prev => {
      return prev.map(c => {
        if (c.id === cargoId) {
          const nextPendingIndex = c.steps.findIndex(s => s.status === 'pending');
          const activeIndex = c.steps.findIndex(s => s.status === 'active');

          if (activeIndex !== -1) {
            const updatedSteps = [...c.steps];
            updatedSteps[activeIndex] = {
              ...updatedSteps[activeIndex],
              status: 'completed',
              timestamp: new Date().toLocaleTimeString().substring(0, 5)
            };
            if (nextPendingIndex !== -1) {
              updatedSteps[nextPendingIndex] = {
                ...updatedSteps[nextPendingIndex],
                status: 'active'
              };
              onAddLog('success', `TRACEABILITY: Passage de "${c.item}" à l'étape [${updatedSteps[nextPendingIndex].name}] initié !`);
            } else {
              onAddLog('success', `TRACEABILITY: Cargaison "${c.item}" entièrement livrée et vérifiée !`);
            }
            return { ...c, steps: updatedSteps };
          }
        }
        return c;
      });
    });
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-supply-chain-traceability">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#1c2e46] to-[#0f141d] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            <Truck className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#111c24]">Supply Chain & Traceability Tracker</span>
              <span className="text-[9px] bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">Image 4 New</span>
            </div>
            <p className="text-xs text-stone-500 font-mono uppercase">Full Ledger Tracking, QR Code Labelling & Refrigerant Sensor Auditing</p>
          </div>
        </div>

        {/* Cargo Selector switchers */}
        <div className="flex gap-1.5">
          {shippingCargos.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveCargoId(item.id);
                onAddLog('info', `TRACEABILITY: Visualisation de la cargaison [${item.item.split(' ')[0]}]`);
              }}
              className={`text-[9.5px] font-mono px-3 py-1.5 rounded-xl border transition ${
                activeCargoId === item.id 
                  ? 'bg-stone-900 text-white border-stone-900' 
                  : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-600'
              }`}
            >
              Carg: #{item.id.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Main interactive grid representing Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side (col-span-8): Horizontal interactive path visualiser */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-6 shadow-xs relative overflow-hidden">
            
            <div className="flex justify-between items-center mb-6 border-b border-stone-50 pb-3">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#111c24]">{activeCargo.item}</h3>
                <p className="text-[10px] font-mono text-stone-400 mt-0.5">Cryptographic Hash ID: {activeCargo.blockchainHash}</p>
              </div>
              <button
                onClick={() => handleAdvanceStep(activeCargo.id)}
                className="px-3.5 py-1.5 bg-[#FAF9F5] hover:bg-stone-900 border border-stone-800 text-stone-900 hover:text-white rounded-xl text-[10px] font-mono font-bold uppercase transition active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>Advance Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Progress Path timeline block */}
            <div className="overflow-x-auto pb-4 pt-2">
              <div className="flex items-center justify-between min-w-[700px] px-2 select-none relative">
                
                {activeCargo.steps.map((st, index) => {
                  const isCompleted = st.status === 'completed';
                  const isActive = st.status === 'active';
                  
                  return (
                    <div key={st.id} className="flex-1 flex flex-col items-center text-center relative group">
                      
                      {/* Inner connector lines */}
                      {index < activeCargo.steps.length - 1 && (
                        <div className={`absolute top-4 left-1/2 w-full h-[3px] z-0 ${
                          isCompleted ? 'bg-sky-500' : 'bg-stone-100'
                        }`} />
                      )}

                      {/* Dot icon indicator */}
                      <div className={`w-8 h-8 rounded-full z-10 flex items-center justify-center border-2 transition-all duration-300 relative ${
                        isCompleted 
                          ? 'bg-sky-500 border-sky-400 text-white shadow-xs' 
                          : isActive 
                            ? 'bg-white border-sky-500 text-sky-500 scale-110 shadow-md' 
                            : 'bg-stone-50 border-stone-200 text-stone-300'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-[10.5px] font-mono font-bold">{index + 1}</span>
                        )}

                        {isActive && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-500 rounded-full animate-ping" />
                        )}
                      </div>

                      <div className="mt-4 px-2">
                        <h4 className={`text-[11px] font-serif font-bold ${
                          isActive ? 'text-sky-600 font-extrabold' : 'text-stone-800'
                        }`}>
                          {st.name}
                        </h4>
                        <div className="text-[8.5px] font-mono text-stone-400 mt-0.5">{st.timestamp}</div>
                        <div className="text-[8.5px] font-mono text-stone-400 mt-1 truncate max-w-[120px]">{st.operator}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Truck details description card */}
            <div className="mt-6 border-t border-stone-100 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-50 border border-sky-100/50 rounded-xl flex items-center justify-center p-2 text-sky-500 scale-95 leading-none shrink-0">
                  🚚
                </div>
                <div>
                  <div className="text-[9px] font-mono text-stone-400 uppercase font-bold leading-none mb-1">Cold Chain Logistics Fleet Carrier</div>
                  <h4 className="text-xs font-serif font-bold text-stone-900">Carrier Transit-Tractor Truck 12B</h4>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">Route: AgroMaitre Base Center ➔ {activeCargo.destination}</div>
                </div>
              </div>

              <div className="shrink-0 font-mono text-[9px] text-[#2c537d] bg-[#f1f7fd] border border-[#d6e7f8]/50 px-3 py-1.5 rounded-xl uppercase font-bold text-center">
                Verified Blockchain Sealed Ledger
              </div>
            </div>

          </div>

        </div>

        {/* Right Side (col-span-4): Temperature telemetry and sensor parameters */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider select-none">
            IoT Cargo Climates Logs
          </h3>

          <div className="bg-white border border-[#e1d5c1] rounded-2xl p-5 shadow-xs space-y-5">
            <div>
              <div className="flex justify-between items-center text-[10.5px] font-mono mb-2">
                <span className="text-stone-500 font-bold uppercase">REFRIGERANT TEMPERATURE</span>
                <span className="text-sky-600 font-bold">{activeCargo.temp}</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                <div className="h-full bg-sky-500 rounded-full animate-progress" style={{ width: '45%' }} />
              </div>
              <div className="text-[8px] text-stone-400 font-mono text-right mt-1">Bound Level: +2°C to +8°C Standard</div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10.5px] font-mono mb-2">
                <span className="text-stone-500 font-bold uppercase">RELATIVE MOISTURE HUMIDITY</span>
                <span className="text-blue-600 font-bold">{activeCargo.humidity}</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                <div className="h-full bg-blue-500 rounded-full animate-progress" style={{ width: '62%' }} />
              </div>
              <div className="text-[8px] text-stone-400 font-mono text-right mt-1">Bound Level: 55% to 65% Humidity target</div>
            </div>

            {/* Quick summary and ETA counter */}
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2 font-mono text-[11px] leading-relaxed">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-400 font-bold">ETA Countdown:</span>
                <span className="text-slate-800 font-bold">{activeCargo.eta}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-400 font-bold">Ledger Block:</span>
                <span className="text-slate-800 font-bold text-right truncate max-w-[130px]">{activeCargo.blockchainHash}</span>
              </div>
            </div>

            {/* GPS Signal locator */}
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-center rounded-xl font-sans text-xs">
              <div className="text-emerald-800 font-bold flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
                <span>GPS Carrier Signal Lock: Active</span>
              </div>
              <p className="text-[9px] text-emerald-600 mt-1 font-mono uppercase">Position: 43.2964° N, 5.3698° E (En Route)</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
