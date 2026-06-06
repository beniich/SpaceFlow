import { useState, useEffect } from 'react';
import { 
  Database, 
  Cpu, 
  Coins, 
  Package, 
  Terminal as TerminalIcon, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Thermometer, 
  Eye, 
  RefreshCw, 
  Download, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalLog } from '../types';

interface OperationsMatrixProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
  mainLogs: TerminalLog[];
}

export default function OperationsMatrix({ onAddLog, mainLogs }: OperationsMatrixProps) {
  // Tabs: 'it' | 'ai' | 'fin' | 'inv'
  const [activeSubTab, setActiveSubTab] = useState<'it' | 'ai' | 'fin' | 'inv'>('it');

  // ===========================================================================
  // SUB-TAB 1: IT INFRASTRUCTURE OPS STATES & LOGS
  // ===========================================================================
  const [itTerminalLogs, setItTerminalLogs] = useState<string[]>([
    '[SYSTEM_LOG] Infrastructure Console Active...',
    '[18:32] INFO: Redis cache cleared successfully.',
    '[19:15] WARN: High CPU usage on worker-node-03.',
    '[20:01] OK: API health check passed (15ms).',
    '[20:38] ERROR: Failed to connect to payment gateway.',
  ]);

  const [tickets, setTickets] = useState([
    { id: '#4501', subject: 'DB_CONNECTION_FAILURE', status: 'OPEN', assigned: 'Tech_A', critical: true },
    { id: '#4498', subject: 'NEW_REPORT_REQUEST', status: 'IN_PROGRESS', assigned: 'Dev_B', critical: false },
    { id: '#4472', subject: 'REDIS_MEMORY_SPIKE', status: 'CLOSED', assigned: 'Tech_C', critical: false },
    { id: '#4461', subject: 'SENSOR_B12_LATENCY_MAX', status: 'OPEN', assigned: 'Tech_A', critical: true },
  ]);

  const addItLog = (msg: string) => {
    const time = new Date().toLocaleTimeString().substring(0, 5);
    setItTerminalLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  const handleResolveTicket = (id: string, subject: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'CLOSED' } : t));
    addItLog(`OK: Ticket ${id} (${subject}) resolved manually.`);
    onAddLog('success', `IT_OPS: Ticket d'incident ${id} [${subject}] marqué résolu avec succès.`);
  };

  // Waveform noise offsets for dynamic rendering
  const [waveformWave, setWaveformWave] = useState([4, 8, 2, 12, 6, 4, 10, 2, 8, 5]);
  useEffect(() => {
    if (activeSubTab !== 'it') return;
    const interval = setInterval(() => {
      setWaveformWave(prev => prev.map(() => Math.floor(Math.random() * 11) + 2));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSubTab]);

  // ===========================================================================
  // SUB-TAB 2: AI NEURAL CORE STATES
  // ===========================================================================
  const [neuralCoreStatus, setNeuralCoreStatus] = useState<'IDLE' | 'ANALYZING' | 'OPTIMIZED'>('OPTIMIZED');
  const [aiSignals, setAiSignals] = useState([
    { id: 'sig-1', type: 'error', label: 'CRITICAL: Sector B-12', detail: 'Nutrient Deficiency Detected', status: 'ACTIVE' },
    { id: 'sig-2', type: 'info', label: 'OPTIMIZATION: Water', detail: 'Usage Report Ready', status: 'ACTIVE' },
    { id: 'sig-3', type: 'success', label: 'ANALYSIS: Pest Risk', detail: 'Risk Level: LOW', status: 'STABLE' },
  ]);
  const [aiCounters, setAiCounters] = useState({
    active: 24,
    idle: 0,
    failed: 1,
    completed: 4567
  });

  const triggerNeuralAudit = () => {
    setNeuralCoreStatus('ANALYZING');
    onAddLog('info', 'NEURAL_CORE: Lancement d\'une passe d\'optimisation prédictive d\'arrosage & engrais...');
    
    setTimeout(() => {
      setAiCounters(prev => ({
        ...prev,
        completed: prev.completed + 1,
        active: prev.active + 2
      }));
      setAiSignals(prev => [
        { id: `sig-${Date.now()}`, type: 'success', label: 'PREDICTION: Sector C-04', detail: 'Harvest Window Peak: June 12-14', status: 'STABLE' },
        ...prev
      ]);
      setNeuralCoreStatus('OPTIMIZED');
      onAddLog('success', 'NEURAL_CORE: Optimisation sectorielle achevée. Taux de rendement synthétique mis à jour à +72%.');
    }, 1800);
  };

  const handleFixSignal = (id: string, label: string) => {
    setAiSignals(prev => prev.filter(s => s.id !== id));
    onAddLog('success', `AI_CORE: Signal de remédiation "${label}" traité par injection ciblée.`);
  };

  // ===========================================================================
  // SUB-TAB 3: FINANCE & LEDGER STATES
  // ===========================================================================
  const [isProActive, setIsProActive] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<'P_A' | 'P_B' | 'P_C' | 'P_D'>('P_C');
  const [invoices, setInvoices] = useState([
    { date: '2026-06-01', id: 'INV-2026-06-001', amount: '$499.00', status: 'PAID_STRIPE' },
    { date: '2026-05-01', id: 'INV-2026-05-001', amount: '$499.00', status: 'PAID_STRIPE' },
    { date: '2026-04-01', id: 'INV-2026-04-001', amount: '$499.00', status: 'PAID_STRIPE' },
  ]);

  const handleTogglePlan = () => {
    const newState = !isProActive;
    setIsProActive(newState);
    onAddLog('warn', `BILLING: Statut de l'abonnement modifié. Plan PRO: ${newState ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    onAddLog('success', `LEDGER: Téléchargement certifié SOC-2 de la facture ${invoiceId}...`);
    alert(`[Simulated Secure Download]\nInvoice: ${invoiceId}\nCertified: SHA-256 Checksum Verified`);
  };

  // ===========================================================================
  // SUB-TAB 4: SUPPLY CHAIN MATRIX STATES
  // ===========================================================================
  const [capacitors, setCapacitors] = useState({
    seeds: 20,
    pesticides: 40,
    tools: 15
  });
  const [isReordering, setIsReordering] = useState(false);

  const [shipments, setShipments] = useState([
    { id: 'SHIP_ID_01', type: 'Seeds Cargo', status: 'IN_TRANSIT', eta: '14 Hours' },
    { id: 'SHIP_ID_02', type: 'Drip Tubes', status: 'DELIVERED', eta: 'Arrived' },
    { id: 'SHIP_ID_03', type: 'Phosphates Delivery', status: 'IN_TRANSIT', eta: '2 Days' },
  ]);

  const triggerReorder = () => {
    if (isReordering) return;
    setIsReordering(true);
    onAddLog('info', 'SUPPLY_CHAIN: Protocole d\'approvisionnement d\'urgence déclenché ! Commande signée cryptographiquement.');
    
    // Simulate gradual re-charge of resource capacitors
    const interval = setInterval(() => {
      setCapacitors(prev => {
        const nextSeeds = Math.min(100, prev.seeds + 20);
        const nextPesticides = Math.min(100, prev.pesticides + 15);
        const nextTools = Math.min(100, prev.tools + 25);
        
        if (nextSeeds === 100 && nextPesticides === 100 && nextTools === 100) {
          clearInterval(interval);
          setIsReordering(false);
          onAddLog('success', 'SUPPLY_CHAIN: Toutes les citernes de stockage (Capaciteurs de ressources) sont pleines (100%).');
        }
        return {
          seeds: nextSeeds,
          pesticides: nextPesticides,
          tools: nextTools
        };
      });
    }, 600);
    
    setShipments(prev => [
      { id: `SHIP_ID_${Math.floor(Math.random() * 900) + 100}`, type: 'Emergency Reorder', status: 'IN_TRANSIT', eta: '5 Mins' },
      ...prev
    ]);
  };

  // Dynamic shipment update simulation log
  useEffect(() => {
    if (activeSubTab !== 'inv') return;
    const interval = setTimeout(() => {
      setShipments(prev => prev.map((s, index) => {
        if (index === 0 && s.status === 'IN_TRANSIT') {
          return { ...s, eta: 'Approaching Dock' };
        }
        return s;
      }));
    }, 5000);
    return () => clearTimeout(interval);
  }, [activeSubTab]);

  return (
    <div className="space-y-6" id="ops-matrix-root">
      
      {/* MODULE NAVIGATION (Tabs pour basculer entre les vues) */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#334155]/60">
        <button 
          onClick={() => {
            setActiveSubTab('it');
            onAddLog('info', 'NAVIGATOR: Chargement de Operational Infrastructure Control (it)...');
          }} 
          className={`tab-btn px-4 py-2 text-xs font-mono uppercase tracking-tighter transition-all cursor-pointer border ${
            activeSubTab === 'it' 
              ? 'bg-[#1c2b3c] border-[#4de082] text-[#4de082] shadow-[0_0_10px_rgba(77,224,130,0.15)] font-bold' 
              : 'bg-[#0a192f] border-[#334155] text-[#8f9097] hover:border-slate-500 hover:text-white'
          }`}
          id="tab-btn-it"
        >
          _Infrastructure_Ops
        </button>
        <button 
          onClick={() => {
            setActiveSubTab('ai');
            onAddLog('info', 'NAVIGATOR: Connexion au canal décisionnel Neural Core Predictor (ai)...');
          }} 
          className={`tab-btn px-4 py-2 text-xs font-mono uppercase tracking-tighter transition-all cursor-pointer border ${
            activeSubTab === 'ai' 
              ? 'bg-[#1c2b3c] border-[#38BDF8] text-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.15)] font-bold' 
              : 'bg-[#0a192f] border-[#334155] text-[#8f9097] hover:border-slate-500 hover:text-white'
          }`}
          id="tab-btn-ai"
        >
          _AI_Neural_Core
        </button>
        <button 
          onClick={() => {
            setActiveSubTab('fin');
            onAddLog('info', 'NAVIGATOR: Interrogation des flux comptables sécurisés SOC-2 (fin)...');
          }} 
          className={`tab-btn px-4 py-2 text-xs font-mono uppercase tracking-tighter transition-all cursor-pointer border ${
            activeSubTab === 'fin' 
              ? 'bg-[#1c2b3c] border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)] font-bold' 
              : 'bg-[#0a192f] border-[#334155] text-[#8f9097] hover:border-slate-500 hover:text-white'
          }`}
          id="tab-btn-fin"
        >
          _Finance_Ledger
        </button>
        <button 
          onClick={() => {
            setActiveSubTab('inv');
            onAddLog('info', 'NAVIGATOR: Chargement de Supply Chain Capacitance Matrix (inv)...');
          }} 
          className={`tab-btn px-4 py-2 text-xs font-mono uppercase tracking-tighter transition-all cursor-pointer border ${
            activeSubTab === 'inv' 
              ? 'bg-[#1c2b3c] border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)] font-bold' 
              : 'bg-[#0a192f] border-[#334155] text-[#8f9097] hover:border-slate-500 hover:text-white'
          }`}
          id="tab-btn-inv"
        >
          _Supply_Chain_Matrix
        </button>
      </div>

      {/* ============================================================================= */}
      {/* VIEW 1: IT INFRASTRUCTURE */}
      {/* ============================================================================= */}
      {activeSubTab === 'it' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
          id="view-it"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Health Telemetry Row */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: MongoDB Cluster */}
              <div 
                className="bg-[#122131] border border-[#334155] p-5 rounded-xs relative overflow-hidden transition hover:border-[#4de082]/60 select-none cursor-pointer group"
                onClick={() => {
                  addItLog('INFO: MongoDB query optimization check running...');
                  onAddLog('info', 'IT_TELEMETRY: Diagnostic MongoDB Cluster - 5 nœuds actifs, réplication à chaud fluide.');
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[10px] text-[#8f9097] flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-[#4de082] group-hover:animate-bounce" /> 
                    MONGODB_CLUSTER
                  </span>
                  <span className="text-[10px] text-[#4de082] font-mono font-bold tracking-tight bg-[#0c3120] border border-[#1b5e3c]/40 px-1.5 py-0.5 rounded-sm">
                    HEALTHY // OK
                  </span>
                </div>
                
                {/* Dynamically simulated oscillo bars */}
                <div className="h-12 flex items-end gap-1 mb-2 bg-[#061220]/75 p-2 border border-slate-900 rounded-sm">
                  {waveformWave.map((h, i) => (
                    <motion.div 
                      key={i} 
                      className={`w-full bg-[#4de082]/80 hover:bg-[#4de082]`}
                      style={{ height: `${h * 8}%` }}
                      transition={{ type: 'spring', damping: 10 }}
                    />
                  ))}
                  <div className="w-full bg-[#4de082]/80 h-2"></div>
                </div>
                
                <div className="grid grid-cols-2 text-[10px] font-mono text-[#8f9097] pt-2 border-t border-[#334155]/30">
                  <span>NODES: 5 / 5</span>
                  <span className="text-right">LATENCY: 12ms</span>
                </div>
              </div>

              {/* Card 2: Redis Cache */}
              <div 
                className="bg-[#122131] border border-[#334155] p-5 rounded-xs relative overflow-hidden transition hover:border-[#4de082]/60 select-none cursor-pointer group"
                onClick={() => {
                  addItLog('INFO: Evaporating expired Redis keys cache...');
                  onAddLog('success', 'IT_TELEMETRY: Taux d\'accès au cache Redis (98.2%) supérieur aux normes minimales.');
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[10px] text-[#8f9097] flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-[#4de082]" />
                    REDIS_CACHE
                  </span>
                  <span className="text-[10px] text-[#4de082] font-mono font-bold tracking-tight bg-[#0c3120] border border-[#1b5e3c]/40 px-1.5 py-0.5 rounded-sm">
                    HEALTHY // UP
                  </span>
                </div>
                
                {/* Waveform 2 */}
                <div className="h-12 flex items-end gap-1 mb-2 bg-[#061220]/75 p-2 border border-slate-900 rounded-sm">
                  {waveformWave.slice(3, 10).map((h, i) => (
                    <motion.div 
                      key={i} 
                      className="w-full bg-cyan-500/80 hover:bg-cyan-400"
                      style={{ height: `${(h + 2) * 7}%` }}
                      transition={{ type: 'spring', damping: 12 }}
                    />
                  ))}
                  <div className="w-[10px] bg-cyan-500/80 h-6"></div>
                </div>

                <div className="grid grid-cols-2 text-[10px] font-mono text-[#8f9097] pt-2 border-t border-[#334155]/30">
                  <span>MEMORY: 85% CAP</span>
                  <span className="text-right">HITS RATIO: 98%</span>
                </div>
              </div>

              {/* Card 3: API Gateway */}
              <div 
                className="bg-[#122131] border border-[#334155] p-5 rounded-xs relative overflow-hidden transition hover:border-orange-500/60 select-none cursor-pointer group"
                onClick={() => {
                  addItLog('WARNING: Gateway trace load simulation requested...');
                  onAddLog('warn', 'IT_TELEMETRY: API Gateway sous surveillance (450 requêtes concurrentes/sec).');
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[10px] text-[#8f9097] flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-cyan-400" />
                    API_SAAS_GATEWAY
                  </span>
                  <span className="text-[10px] text-[#4de082] font-mono font-bold tracking-tight bg-[#0c3120] border border-[#1b5e3c]/40 px-1.5 py-0.5 rounded-sm">
                    HEALTHY // FLUID
                  </span>
                </div>
                
                {/* Waveform 3 */}
                <div className="h-12 flex items-end gap-1 mb-2 bg-[#061220]/75 p-2 border border-slate-900 rounded-sm">
                  {waveformWave.slice(0, 7).map((h, i) => (
                    <motion.div 
                      key={i} 
                      className="w-full bg-[#4de082]/80 hover:bg-[#4de082]"
                      style={{ height: `${h * 9}%` }}
                    />
                  ))}
                  <div className="w-[15px] bg-[#4de082]/80 h-10"></div>
                </div>

                <div className="grid grid-cols-2 text-[10px] font-mono text-[#8f9097] pt-2 border-t border-[#334155]/30">
                  <span>REQ/S: 450 concurrent</span>
                  <span className="text-right text-red-400">ERR RATE: 0.01%</span>
                </div>
              </div>

            </div>

            {/* Critical Support Tickets [GLPI] */}
            <div className="lg:col-span-2 bg-[#122131] border border-[#334155] p-6 rounded-xs shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-mono text-xs text-[#b9c7e4] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#38BDF8] rounded-full animate-ping"></span>
                  Critical Support Tickets [GLPI Network]
                </h3>
                <span className="text-[9px] font-mono text-[#8f9097] bg-[#0a192f] border border-slate-700 px-2 py-0.5 rounded-sm">
                  API STREAM SYNCHRONIZED
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="text-[#8f9097] border-b border-[#334155] bg-[#0a192f]/50">
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">SUBJECT MATTER</th>
                      <th className="p-2">SEVERITY</th>
                      <th className="p-2">ASSIGNED OS</th>
                      <th className="p-2 text-right">ACTION COMMAND</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#c5c6cd]">
                    {tickets.map((t) => (
                      <tr key={t.id} className="border-b border-[#334155]/60 hover:bg-[#1a2c3f]/50 transition-colors">
                        <td className="p-2 text-[#4de082] font-semibold">{t.id}</td>
                        <td className="p-2 truncate max-w-[180px]">{t.subject}</td>
                        <td className="p-2">
                          {t.status === 'CLOSED' ? (
                            <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700/55 rounded-sm">RESOLVED</span>
                          ) : t.critical ? (
                            <span className="text-[9px] px-1.5 py-0.5 bg-red-950/60 text-red-400 border border-red-500/30 rounded-sm animate-pulse">CRITICAL</span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.5 bg-amber-950/60 text-amber-400 border border-amber-500/30 rounded-sm">MEDIUM</span>
                          )}
                        </td>
                        <td className="p-2 text-[#8f9097]">{t.assigned}</td>
                        <td className="p-2 text-right">
                          {t.status === 'CLOSED' ? (
                            <span className="text-zinc-500 text-[10px] select-none">[ARCHIVED]</span>
                          ) : (
                            <div className="flex justify-end gap-2 text-[10px]">
                              <button 
                                onClick={() => handleResolveTicket(t.id, t.subject)}
                                className="text-[#38BDF8] hover:text-white hover:bg-sky-950/40 border border-[#38BDF8]/40 hover:border-[#38BDF8] px-2 py-0.5 rounded-sm transition cursor-pointer"
                              >
                                [RESOLVE]
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Local IT Support Terminal Panel */}
            <div className="bg-[#0a192f] border border-[#334155] p-5 rounded-xs flex flex-col h-64">
              <div className="flex justify-between items-center pb-2 border-b border-[#334155]/40 mb-3">
                <span className="font-mono text-[10px] text-[#4de082] flex items-center gap-1.5 uppercase font-bold">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#4de082]" />
                  Internal_Telemetry_Console
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-[9px] text-[#4de082] space-y-1 pr-1">
                {itTerminalLogs.map((log, index) => {
                  let colorClass = 'text-[#4de082]';
                  if (log.includes('WARN')) colorClass = 'text-amber-400';
                  if (log.includes('ERROR')) colorClass = 'text-red-400';
                  if (log.includes('OK') || log.includes('SUCCESS')) colorClass = 'text-emerald-400 font-bold';
                  return <div key={index} className={colorClass}>{log}</div>;
                })}
                <div className="animate-pulse inline-block text-white">_</div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#334155]/40 flex gap-1.5 justify-start">
                <button 
                  onClick={() => {
                    addItLog('SUCCESS: Telemetry ping checks sent out to GLPI Node-A1 / Node-B2.');
                    onAddLog('success', 'IT_CLI: Ping de contrôle envoyé aux terminaux d\'administration.');
                  }}
                  className="bg-slate-900 border border-slate-700 hover:border-[#38BDF8] text-[9px] text-slate-300 hover:text-white px-2 py-1 rounded-xs transition font-mono cursor-pointer"
                >
                  [PING STATS]
                </button>
                <button 
                  onClick={() => setItTerminalLogs(['[CONSOLE RESET] Waiting for incoming frames...'])}
                  className="bg-slate-900 border border-slate-700 hover:border-red-500 text-[9px] text-slate-300 hover:text-red-400 px-2 py-1 rounded-xs transition font-mono cursor-pointer"
                >
                  [CLEAR]
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* ============================================================================= */}
      {/* VIEW 2: AI NEURAL CORE */}
      {/* ============================================================================= */}
      {activeSubTab === 'ai' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          id="view-ai"
        >
          {/* Signal Feed Left */}
          <div className="lg:col-span-3 bg-[#122131] border border-[#334155] p-5 rounded-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-[10px] text-[#8f9097] uppercase tracking-widest font-bold">
                Intelligence Signal Feed
              </h3>
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {aiSignals.map((sig) => {
                  let barColor = 'border-blue-500';
                  let textColor = 'text-blue-400';
                  if (sig.type === 'error') {
                    barColor = 'border-red-500 animate-pulse';
                    textColor = 'text-red-400';
                  } else if (sig.type === 'success') {
                    barColor = 'border-emerald-500';
                    textColor = 'text-[#4de082]';
                  }

                  return (
                    <motion.div 
                      layout
                      key={sig.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="p-3 bg-[#0a192f]/70 border-l-2 border-slate-700 border-r border-t border-b rounded-xs relative group hover:bg-[#122131]/65"
                      style={{ borderLeftColor: sig.type === 'error' ? '#ef4444' : sig.type === 'success' ? '#10b981' : '#06b6d4' }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-mono font-bold ${textColor}`}>{sig.label}</span>
                        <span className="text-[8px] font-mono text-gray-500 uppercase">[{sig.status}]</span>
                      </div>
                      <div className="text-[10px] text-[#8f9097] font-mono leading-tight">{sig.detail}</div>
                      
                      {/* Interactive remediation trigger */}
                      <button 
                        onClick={() => handleFixSignal(sig.id, sig.label)}
                        className="mt-2 text-[9px] font-mono text-[#38BDF8] hover:text-white cursor-pointer select-none bg-[#0c1825] px-1.5 py-0.5 border border-[#38BDF8]/40 hover:border-[#38BDF8] rounded-xs block transition"
                      >
                        [EXECUTE RE-CALIBRATE]
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* AI Neural Core Middle */}
          <div className="lg:col-span-6 bg-[#122131] border border-[#334155] rounded-xs p-6 relative flex flex-col items-center justify-between min-h-[380px]">
            <div className="absolute top-4 left-4 font-mono text-[9px] text-[#8f9097] flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
              NEURAL_CORE_V4.1 // CALC_ENGINE
            </div>

            <div className="absolute top-4 right-4 text-[9px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-sm uppercase">
              STATUS: {neuralCoreStatus}
            </div>

            {/* Neural core rotating mesh visualizer */}
            <div className="relative w-48 h-48 flex items-center justify-center my-4 group cursor-pointer" onClick={triggerNeuralAudit}>
              {/* Outer rotating ring */}
              <div 
                className="absolute inset-0 border-2 border-dashed border-cyan-500/30 rounded-full animate-spin"
                style={{ animationDuration: neuralCoreStatus === 'ANALYZING' ? '3s' : '12s' }}
              />
              {/* Secondary inverse ring */}
              <div 
                className="absolute inset-4 border border-teal-500/40 rounded-full"
                style={{ 
                  animation: 'spin 12s linear infinite reverse',
                  animationDuration: neuralCoreStatus === 'ANALYZING' ? '2s' : '8s',
                  borderStyle: 'double'
                }}
              />
              {/* Central Core glow ball */}
              <div className={`absolute inset-12 rounded-full duration-1000 blur-xl ${
                neuralCoreStatus === 'ANALYZING' ? 'bg-cyan-400/40 animate-pulse' : 'bg-cyan-500/20 group-hover:bg-cyan-400/30'
              }`} />
              
              <div className="z-10 text-center font-mono select-none">
                <span className="text-cyan-400 text-xs font-bold block tracking-widest group-hover:scale-105 transition-all">
                  {neuralCoreStatus === 'ANALYZING' ? 'PROCESSING...' : 'NEURAL_ACTIVE'}
                </span>
                <span className="text-[8px] text-cyan-500/80 block mt-1">CLICK TO RUN AUDIT</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="grid grid-cols-4 gap-3 w-full">
                <div className="text-center p-2.5 bg-[#0a192f] border border-[#334155] rounded-xs">
                  <div className="text-[8px] text-[#8f9097] font-mono uppercase tracking-tight">Active Nodes</div>
                  <div className="text-xs font-bold text-white mt-1">{aiCounters.active}</div>
                </div>
                <div className="text-center p-2.5 bg-[#0a192f] border border-[#334155] rounded-xs">
                  <div className="text-[8px] text-[#8f9097] font-mono uppercase tracking-tight">Idle Cores</div>
                  <div className="text-xs font-bold text-[#8f9097] mt-1">{aiCounters.idle}</div>
                </div>
                <div className="text-center p-2.5 bg-[#0a192f] border border-red-500/40 rounded-xs">
                  <div className="text-[8px] text-red-400 font-mono uppercase tracking-tight">Failed Pkts</div>
                  <div className="text-xs font-bold text-red-400 mt-1">{aiCounters.failed}</div>
                </div>
                <div className="text-center p-2.5 bg-[#0a192f] border border-emerald-500/40 rounded-xs">
                  <div className="text-[8px] text-emerald-400 font-mono uppercase tracking-tight">Optimized</div>
                  <div className="text-xs font-bold text-[#4de082] mt-1">{aiCounters.completed}</div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={triggerNeuralAudit}
                disabled={neuralCoreStatus === 'ANALYZING'}
                className="w-full bg-[#38BDF8] hover:bg-white text-[#00171f] hover:text-black font-mono font-bold text-xs py-2 px-4 rounded-sm uppercase tracking-wide cursor-pointer transition disabled:opacity-50 select-none flex items-center justify-center gap-2"
              >
                {neuralCoreStatus === 'ANALYZING' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Lancement des calculs matriciels...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Calculer prédictions culturales [Audit]</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analytics Graphs Right Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Wheat Yield Projection */}
            <div className="bg-[#122131] border border-[#334155] p-5 rounded-xs">
              <div className="flex justify-between items-center text-[10px] font-mono mb-3">
                <span className="text-[#8f9097] uppercase">WHEAT_YIELD_PROJ</span>
                <span className="text-green-400 flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3 h-3" /> +70%
                </span>
              </div>
              
              {/* Graphic Plot using custom SVG */}
              <div className="h-20 w-full bg-[#0a192f] border-b border-l border-[#334155] relative overflow-hidden p-1">
                {/* Horizontal reference grid lines */}
                <div className="absolute inset-y-1/2 left-0 right-0 border-t border-[#334155]/30"></div>
                <div className="absolute inset-y-1/4 left-0 right-0 border-t border-[#334155]/15"></div>
                <div className="absolute inset-y-3/4 left-0 right-0 border-t border-[#334155]/15"></div>
                
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="yieldGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4de082" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4de082" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area mask under curve */}
                  <polygon 
                    points="0,80 15,75 35,62 55,59 75,32 100,12 100,80" 
                    fill="url(#yieldGlow)" 
                  />
                  {/* Line plots */}
                  <polyline 
                    fill="none" 
                    stroke="#4de082" 
                    strokeWidth="2.5" 
                    points="0,78 15,75 35,62 55,59 75,32 100,12" 
                    strokeLinecap="round"
                  />
                  {/* Glowing end point */}
                  <circle cx="100" cy="12" r="3.5" fill="#4de082" className="animate-ping" style={{ transformOrigin: '100px 12px' }} />
                  <circle cx="100" cy="12" r="2" fill="#fff" />
                </svg>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-[#8f9097] mt-2">
                <span>PH_A (START)</span>
                <span>PH_D (CURR)</span>
                <span>TARGET (+70%)</span>
              </div>
            </div>

            {/* Soil Moisture Trend */}
            <div className="bg-[#122131] border border-[#334155] p-5 rounded-xs">
              <div className="flex justify-between items-center text-[10px] font-mono mb-3">
                <span className="text-[#8f9097] uppercase">SOIL_MOISTURE_TREND</span>
                <span className="text-cyan-400 font-bold">61.3% SAT</span>
              </div>
              
              {/* Soil graphic plot custom SVG */}
              <div className="h-20 w-full bg-[#0a192f] border-b border-l border-[#334155] relative overflow-hidden p-1">
                <div className="absolute inset-y-1/2 left-0 right-0 border-t border-[#334155]/30"></div>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="moistureGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon 
                    points="0,48 20,41 40,58 60,32 80,45 100,28 100,80" 
                    fill="url(#moistureGlow)" 
                  />
                  <polyline 
                    fill="none" 
                    stroke="#38BDF8" 
                    strokeWidth="2.5" 
                    points="0,48 20,41 40,58 60,32 80,45 100,28" 
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="28" r="2" fill="#38BDF8" />
                </svg>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-[#8f9097] mt-2">
                <span>24H AGO</span>
                <span>61.3% [OK]</span>
                <span>TARGET STATUS</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* ============================================================================= */}
      {/* VIEW 3: FINANCE & BILLING */}
      {/* ============================================================================= */}
      {activeSubTab === 'fin' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
          id="view-fin"
        >
          <div className="bg-[#122131] border border-[#334155] p-6 rounded-xs shadow-md">
            
            {/* Sub-Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  Financial Ledger & Subscription Overview
                </h2>
                <p className="text-[10px] font-mono text-[#8f9097] mt-0.5 tracking-wider">
                  SECURE CRYPTOGRAPHICALLY TRUSTED BILLING NETWORK (SOC 2 DESIGN)
                </p>
              </div>
              
              {/* Billing Switch/Plan */}
              <div className="flex items-center gap-3 bg-[#0a192f] p-2.5 border border-[#334155] rounded-sm shadow-sm select-none">
                <span className="text-[9px] font-mono text-[#8f9097]">CURRENT PLAN ACCESS:</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border rounded-sm ${
                  isProActive 
                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20' 
                    : 'text-rose-400 bg-rose-950/40 border-rose-500/20'
                }`}>
                  {isProActive ? 'PRO_PLAN_ACTIVE' : 'LOCKED_TO_STARTER'}
                </span>
                
                {/* Visual slider toggler */}
                <button 
                  onClick={handleTogglePlan}
                  className="w-10 h-5 bg-zinc-800 rounded-full relative border border-slate-700 transition cursor-pointer"
                >
                  <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full duration-200 shadow ${
                    isProActive ? 'right-0.5 bg-emerald-500' : 'left-0.5 bg-rose-500'
                  }`} />
                </button>
              </div>
            </div>

            {/* Graphs row: YTD profitability & profit trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              {/* Chart A: Profitability bar */}
              <div className="bg-[#0a192f] border border-[#334155] p-5 rounded-xs">
                <div className="flex justify-between items-center text-[10px] font-mono mb-4">
                  <span className="text-slate-400 tracking-wider">PARCEL_PROFITABILITY_YTD (M$)</span>
                  <span className="text-[#38BDF8] hover:underline cursor-pointer flex items-center gap-1 text-[9px]">
                    [FULL_REPORT_DOWNLOAD]
                  </span>
                </div>
                
                {/* Custom Profitability Bars */}
                <div className="flex items-end gap-6 h-36 border-b border-[#334155] px-4 pb-1">
                  
                  {[
                    { key: 'P_A', label: 'Parcel A', profit: 'a60', color: 'bg-emerald-500', heightClass: 'h-[60%]' },
                    { key: 'P_B', label: 'Parcel B', profit: 'b30', color: 'bg-amber-500', heightClass: 'h-[30%]' },
                    { key: 'P_C', label: 'Parcel C', profit: 'c80', color: 'bg-emerald-400', heightClass: 'h-[80%]' },
                    { key: 'P_D', label: 'Parcel D', profit: 'd40', color: 'bg-indigo-500', heightClass: 'h-[40%]' },
                  ].map((x) => (
                    <div 
                      key={x.key}
                      onClick={() => {
                        setSelectedParcel(x.key as any);
                        onAddLog('info', `LEDGER: Sélection de la parcelle ${x.key} - Rentabilité YTD à ${x.heightClass.replace('h-[', '').replace('%]', '')}% du potentiel.`);
                      }}
                      className="w-full flex flex-col items-center gap-1 group cursor-pointer relative"
                    >
                      {/* Interactive hover values */}
                      <div className="absolute -top-6 text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 bg-slate-900 px-1 border border-slate-700 rounded-sm py-0.5 transition-all duration-150">
                        {x.heightClass.replace('h-[', '').replace('%]', '')}%
                      </div>
                      
                      <div className={`w-full ${x.color}/30 border-t-2 border-${x.color} ${x.heightClass} rounded-t-sm transition-all duration-300 group-hover:brightness-125`} style={{
                        borderColor: x.key === selectedParcel ? '#fff' : '',
                        backgroundColor: x.key === selectedParcel ? 'rgba(255,255,255,0.1)' : ''
                      }} />
                      <span className={`text-[9px] font-mono ${x.key === selectedParcel ? 'text-white font-bold' : 'text-[#8f9097]'}`}>{x.key}</span>
                    </div>
                  ))}

                </div>
                <div className="text-[9px] font-mono text-[#8f9097] mt-3 italic text-center">
                  *cliquez sur une colonne pour zoomer sur la rentabilité thermique locale de la parcelle.
                </div>
              </div>

              {/* Chart B: Monthly Profit Trend */}
              <div className="bg-[#0a192f] border border-[#334155] p-5 rounded-xs">
                <div className="flex justify-between items-center text-[10px] font-mono mb-4">
                  <span className="text-slate-400 tracking-wider">MONTHLY_PROFIT_TREND</span>
                  <span className="text-amber-500 font-bold bg-amber-950/20 px-1.5 py-0.5 border border-amber-500/20 text-[9px]">
                    YTD POSITIVE
                  </span>
                </div>
                
                {/* SVG trend line with dots */}
                <div className="h-36 w-full relative border-b border-l border-[#334155] overflow-clip p-2">
                  <div className="absolute inset-y-1/2 left-0 right-0 border-t border-[#334155]/20"></div>
                  <div className="absolute inset-y-[20%] left-0 right-0 border-t border-[#334155]/10"></div>
                  <div className="absolute inset-y-[80%] left-0 right-0 border-t border-[#334155]/10"></div>
                  
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
                    <polyline 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="2.5" 
                      points="0,70 20,55 40,42 60,40 80,28 100,15" 
                    />
                    <circle cx="0" cy="70" r="1.5" fill="#f59e0b" />
                    <circle cx="20" cy="55" r="1.5" fill="#f59e0b" />
                    <circle cx="40" cy="42" r="1.5" fill="#f59e0b" />
                    <circle cx="60" cy="40" r="1.5" fill="#f59e0b" />
                    <circle cx="80" cy="28" r="1.5" fill="#f59e0b" />
                    <circle cx="100" cy="15" r="2.5" fill="#fff" className="animate-pulse" />
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] font-mono text-[#8f9097] mt-3">
                  <span>JANUARY 2026</span>
                  <span>MARCH</span>
                  <span>JUNE (CURRENT)</span>
                </div>
              </div>

            </div>

            {/* Invoices List Board */}
            <div className="bg-[#0a192f] border border-[#334155] rounded-xs overflow-hidden">
              <div className="p-3 bg-[#1c2b3c] border-b border-[#334155] flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-white tracking-wide uppercase">
                  Arch-Certified billing system entries [Stripe Network SEC-SOC]
                </span>
                <span className="text-[9px] font-mono text-emerald-400">SOC 2 TYPE II COMPLIANT</span>
              </div>
              <table className="w-full text-left text-[11px] font-mono border-collapse">
                <thead className="text-[#8f9097] bg-[#0c1a2c] border-b border-[#334155]">
                  <tr>
                    <th className="p-3">ISSUED_DATE</th>
                    <th className="p-3">INVOICE_REGISTRY_ID</th>
                    <th className="p-3">CRYPTO_AMOUNT</th>
                    <th className="p-3">SETTLED_GATEWAY</th>
                    <th className="p-3 text-right">SECURED_ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/60">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 whitespace-nowrap">{inv.date}</td>
                      <td className="p-3 text-[#38BDF8] font-bold">{inv.id}</td>
                      <td className="p-3 text-white">{inv.amount}</td>
                      <td className="p-3">
                        <span className="text-[9px] bg-emerald-950 text-[#4de082] px-2 py-0.5 border border-emerald-800/40 rounded-xs uppercase">
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDownloadInvoice(inv.id)}
                          className="text-[#38BDF8] hover:text-white hover:underline cursor-pointer flex items-center gap-1 justify-end ml-auto text-[10px]"
                        >
                          <Download className="w-3 h-3 text-[#38BDF8]" />
                          <span>[PDF]</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </motion.div>
      )}

      {/* ============================================================================= */}
      {/* VIEW 4: INVENTORY & SUPPLY */}
      {/* ============================================================================= */}
      {activeSubTab === 'inv' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          id="view-inv"
        >
          {/* Inventory Capacitors (Replacing Test Tubes) */}
          <div className="lg:col-span-4 bg-[#122131] border border-[#334155] p-5 rounded-xs flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-xs text-[#b9c7e4] uppercase mb-1 tracking-wider">
                Industrial Resource Capacitors
              </h3>
              <p className="text-[9px] font-mono text-[#8f9097] mb-6 block uppercase border-b border-[#334155]/40 pb-2">
                Real-time storage sensors (Hydration & Nutrient Fluids)
              </p>
              
              <div className="flex justify-around items-end h-64 bg-[#0a192f] p-4 border border-[#334155]/40 rounded-sm">
                
                {/* Seeds Capacitor */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-44 bg-[#07111c] border-2 border-[#334155] relative rounded-b-md overflow-hidden group select-none cursor-pointer">
                    {/* Glowing fluid fill */}
                    <div 
                      className="absolute bottom-0 w-full duration-500 bg-gradient-to-t from-amber-600/60 to-amber-500 flex items-center justify-center font-mono text-[9px] font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      style={{ height: `${capacitors.seeds}%` }}
                    >
                      {capacitors.seeds > 14 && `${capacitors.seeds}%`}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-amber-500">_SEEDS_CAP</span>
                </div>

                {/* Pesticides Capacitor */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-44 bg-[#07111c] border-2 border-[#334155] relative rounded-b-md overflow-hidden select-none">
                    <div 
                      className="absolute bottom-0 w-full duration-500 bg-gradient-to-t from-indigo-600/60 to-indigo-500 flex items-center justify-center font-mono text-[9px] font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                      style={{ height: `${capacitors.pesticides}%` }}
                    >
                      {capacitors.pesticides > 14 && `${capacitors.pesticides}%`}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-indigo-400">_PEST_CHEM</span>
                </div>

                {/* Tools Capacitor */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-44 bg-[#07111c] border-2 border-[#334155] relative rounded-b-md overflow-hidden select-none">
                    <div 
                      className="absolute bottom-0 w-full duration-500 bg-gradient-to-t from-purple-700/60 to-purple-500 flex items-center justify-center font-mono text-[9px] font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                      style={{ height: `${capacitors.tools}%` }}
                    >
                      {capacitors.tools > 14 && `${capacitors.tools}%`}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-purple-400">_TOOLS_MAT</span>
                </div>

              </div>
            </div>

            <div className="mt-4">
              <button 
                onClick={triggerReorder}
                disabled={isReordering}
                className="w-full bg-[#ef4444] hover:bg-white text-white hover:text-black border border-red-500 text-[10px] font-mono font-bold py-2 uppercase tracking-wider cursor-pointer transition select-none disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReordering ? 'animate-spin' : ''}`} />
                <span>{isReordering ? 'CHARGEMENT DES CAPACITEURS...' : 'Trigger Reorder Protocol'}</span>
              </button>
            </div>
          </div>

          {/* Warehouse Thermal Scan */}
          <div className="lg:col-span-4 bg-[#122131] border border-[#334155] p-5 rounded-xs flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-xs text-[#b9c7e4] uppercase mb-1 tracking-wider">
                Thermal Matrix & Security Scan
              </h3>
              <p className="text-[9px] font-mono text-[#8f9097] mb-4 uppercase pb-2 border-b border-[#334155]/40 block">
                Infrared climate monitoring of sector grids
              </p>
              
              <div className="relative w-full h-48 bg-[#0a192f] border border-[#334155] overflow-clip rounded-sm shadow-inner group">
                
                {/* Simulated dynamic Thermal gradients */}
                <div className="absolute top-4 left-6 w-24 h-24 bg-red-600/20 blur-2xl group-hover:bg-red-500/30 transition-all duration-1000 animate-pulse"></div>
                <div className="absolute bottom-6 right-8 w-28 h-28 bg-blue-600/20 blur-3xl group-hover:bg-blue-500/35 transition-all duration-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-amber-500/15 blur-2xl"></div>

                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                
                {/* Scope target elements */}
                <div className="absolute top-3 left-4 text-[8px] font-mono text-slate-400 bg-black/70 px-1 py-0.5 border border-slate-700/40 rounded-xs select-none">
                  SEC_01 // IRRIG_FLOW: +25°C
                </div>

                <div className="absolute bottom-3 right-4 text-[8px] font-mono text-red-400 bg-black/80 px-1 py-0.5 border border-red-500/40 rounded-xs select-none animate-pulse">
                  SEC_03 // CLIM_VARIANCE: +22.8°C [ALERT]
                </div>

                <div className="absolute inset-x-0 bottom-1/2 border-t border-cyan-500/10 pointer-events-none"></div>
                <div className="absolute inset-y-0 left-1/2 border-l border-cyan-500/10 pointer-events-none"></div>

                {/* Laser crosshair */}
                <div className="absolute top-12 left-1/4 w-3 h-3 border-l-2 border-t-2 border-cyan-400 animate-pulse"></div>
                <div className="absolute bottom-16 right-1/4 w-3 h-3 border-r-2 border-b-2 border-cyan-400 animate-pulse"></div>
              </div>
            </div>

            <div className="mt-4 space-y-2 pt-2">
              <div className="flex justify-between items-center text-[10px] font-mono p-1 rounded-sm hover:bg-slate-900 transition-colors">
                <span className="text-[#8f9097] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Zone A: Drip Irrigation Line
                </span>
                <span className="text-green-400 font-bold uppercase select-none">[STABLE_ACTIVE]</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono p-1 rounded-sm hover:bg-slate-900 transition-colors">
                <span className="text-[#8f9097] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 animate-ping rounded-full"></span> Zone C: Climatic Hothouse
                </span>
                <span className="text-red-400 font-bold uppercase select-none">[VARIANCE_ALERT]</span>
              </div>
            </div>
          </div>

          {/* Logistics Matrix Right Panel */}
          <div className="lg:col-span-4 bg-[#122131] border border-[#334155] p-5 rounded-xs flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-xs text-[#b9c7e4] uppercase mb-1 tracking-wider">
                Supply Logistics Matrix
              </h3>
              <p className="text-[9px] font-mono text-[#8f9097] mb-4 uppercase pb-2 border-b border-[#334155]/40 block">
                Secure tracking of seed vessels and chemicals
              </p>
              
              <div className="space-y-2">
                {shipments.map((ship, index) => (
                  <div 
                    key={ship.id} 
                    onClick={() => {
                      onAddLog('info', `LOGISTICS: Interrogating ship ${ship.id} (${ship.type}) status: ${ship.status}. ETA remaining: ${ship.eta}`);
                    }}
                    className="flex justify-between items-center p-2.5 bg-[#0a192f] border border-[#334155] text-[10px] font-mono hover:bg-[#1a2c3f]/50 transition duration-150 cursor-pointer rounded-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <div>
                        <span className="text-white block font-bold">{ship.id}</span>
                        <span className="text-gray-400 text-[8px] uppercase">{ship.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-bold block ${
                        ship.status === 'DELIVERED' ? 'text-green-400' : 'text-amber-400 animate-pulse'
                      }`}>
                        {ship.status}
                      </span>
                      <span className="text-[#8f9097] text-[8px]">{ship.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sparkline trend plot */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-2">
                <span>DELIVERY_EFFICIENCY_RATIO</span>
                <span className="text-cyan-400 font-bold">94.8% SLA</span>
              </div>
              <div className="h-16 w-full bg-[#0a192f] border border-[#334155] relative overflow-hidden rounded-sm p-1">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
                  <polyline 
                    fill="none" 
                    stroke="#0284c7" 
                    strokeWidth="2" 
                    points="0,65 15,48 30,55 45,32 60,38 75,18 90,29 100,10" 
                  />
                  <circle cx="100" cy="10" r="1.5" fill="#38BDF8" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
