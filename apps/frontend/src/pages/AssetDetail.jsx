import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Settings, Activity, QrCode, PenTool, Box, AlertCircle, 
  Clock, CheckCircle, ArrowLeft, ShieldCheck, Cpu, Zap, Printer, X, 
  ExternalLink, FileText, CheckCircle2, Wrench, Thermometer
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const Gauge = ({ value, label, unit, color, max = 100, alert = false }) => {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percent = (normalizedValue / max) * 100;
  const data = [
    { name: 'value', value: percent },
    { name: 'empty', value: 100 - percent }
  ];
  
  return (
    <div className="flex flex-col items-center justify-center relative h-32 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={36}
            outerRadius={48}
            startAngle={180}
            endAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={alert ? '#ef4444' : color} />
            <Cell fill="#27272a" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-5">
        <span className={clsx("font-mono font-bold text-xl leading-none", alert ? "text-red-400 animate-pulse" : "text-white")}>
          {value}
        </span>
        <span className="font-mono text-[9px] text-zinc-500 uppercase mt-0.5">{unit}</span>
      </div>
      <span className="font-sans text-[10px] font-medium text-zinc-400 mt-[-14px] uppercase tracking-wider text-center">
        {label}
      </span>
    </div>
  );
};

export default function AssetDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('Contrôle préventif vibrations');
  const [ticketPriority, setTicketPriority] = useState('HIGH');
  
  // Live telemetry stream state
  const [telemetry, setTelemetry] = useState({
    vibration: 4.2,
    pressure: 85.4,
    flowRate: 78.1,
    tempOut: 12.8,
    tempIn: 7.2
  });

  // Tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        vibration: parseFloat((4.2 + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        pressure: parseFloat((85.4 + (Math.random() * 2 - 1)).toFixed(1)),
        flowRate: parseFloat((78.1 + (Math.random() * 1.5 - 0.75)).toFixed(1)),
        tempOut: parseFloat((12.8 + (Math.random() * 0.3 - 0.15)).toFixed(1)),
        tempIn: parseFloat((7.2 + (Math.random() * 0.2 - 0.1)).toFixed(1)),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    setShowTicketModal(false);
    toast.success(`Ordre de travail créé pour CHLR-02 (${ticketPriority}) !`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#08080A] text-zinc-100 p-4 sm:p-6 font-sans flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-6 flex-1">
        
        {/* Header Section */}
        <header className="flex flex-col gap-4 bg-[#131313]/90 backdrop-blur-md border border-[#00F0FF]/30 p-5 rounded-2xl shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
              <Link to="/assets" className="hover:text-[#00F0FF] transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Retour Équipements
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">Bâtiment Alpha</span>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-zinc-400">Étage L4</span>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-zinc-400">Tech Lab B</span>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-[#00F0FF] font-bold">HVAC Systems</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]" />
              <span>IoT Gateway: <strong className="text-white">GTB-BACnet/IP Connected</strong></span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
                  Chiller Unit CHLR-02
                </h1>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                  Opérationnel
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                SN: 8492-AXQ-9012 • GUID: <span className="text-zinc-300">1b6oB0a$12Sg6s_N1R$q7D</span> • Mise en service: 12/11/2023
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setShowQRModal(true)}
                className="px-3.5 py-2 rounded-lg border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-mono text-xs uppercase font-bold transition-all flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-[#00F0FF]" />
                <span>Tag QR Code</span>
              </button>

              <Link 
                to="/bim"
                className="px-3.5 py-2 rounded-lg border border-[#00F0FF]/40 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] font-mono text-xs uppercase font-bold transition-all flex items-center gap-2"
              >
                <Box className="w-4 h-4" />
                <span>Voir en 3D BIM</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Grid (3 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          {/* Col 1: Tech Specs */}
          <div className="bg-[#131313]/90 backdrop-blur-md border border-[#00F0FF]/20 rounded-2xl p-5 flex flex-col gap-5 shadow-lg">
            <h2 className="text-sm font-sans font-bold text-white flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#00F0FF]" />
                Spécifications Techniques
              </span>
              <span className="text-[10px] font-mono text-zinc-500">IFC-4 / COBie</span>
            </h2>
            
            <div className="flex items-center justify-between p-4 bg-[#08080A] rounded-xl border border-zinc-800/80">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Score de Santé Actif</span>
                <span className="text-xs text-zinc-500 font-mono">Calculé par IA prédictive</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold font-mono text-[#00F0FF]">89<span className="text-sm text-zinc-500">/100</span></span>
                <span className="text-[10px] font-mono text-[#10B981] block">Condition Excellente</span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500 uppercase">Constructeur</span>
                <span className="text-zinc-200 font-bold">Trane Technologies</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500 uppercase">Modèle / Série</span>
                <span className="text-zinc-200">CGAM-060 Scroll Chiller</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500 uppercase">Fluide Frigorigène</span>
                <span className="text-[#00F0FF]">R-454B (Low GWP)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500 uppercase">Puissance Frigorifique</span>
                <span className="text-zinc-200">210 kW (60 TR)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500 uppercase">Durée de Vie Est.</span>
                <span className="text-zinc-200">15 Ans (9.5 ans restants)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500 uppercase">Garantie Constructeur</span>
                <span className="text-[#10B981] font-bold">Jusqu'au 12 Nov 2028</span>
              </div>
            </div>
          </div>

          {/* Col 2: Real-time Telemetry */}
          <div className="bg-[#131313]/90 backdrop-blur-md border border-[#00F0FF]/20 rounded-2xl p-5 flex flex-col gap-5 relative overflow-hidden group shadow-lg">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00F0FF]/10 transition-colors"></div>
            
            <h2 className="text-sm font-sans font-bold text-white flex items-center justify-between border-b border-zinc-800/80 pb-3 relative z-10">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00F0FF]" />
                Télémétrie Capteurs Live (IoT)
              </span>
              <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                500ms Stream
              </span>
            </h2>
            
            <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">
              <div className="flex items-center justify-center bg-[#08080A] rounded-xl border border-zinc-800/80 p-2">
                <Gauge value={telemetry.vibration} label="Vibration" unit="mm/s" color="#10B981" max={10} />
              </div>
              <div className="flex items-center justify-center bg-[#08080A] rounded-xl border border-zinc-800/80 p-2">
                <Gauge value={telemetry.pressure} label="Pression Circuit" unit="PSI" color="#F38020" max={120} />
              </div>
              <div className="flex items-center justify-center bg-[#08080A] rounded-xl border border-zinc-800/80 p-2">
                <Gauge value={telemetry.flowRate} label="Débit Pompe" unit="L/min" color="#00F0FF" max={100} />
              </div>
              <div className="flex items-center justify-center bg-[#08080A] rounded-xl border border-zinc-800/80 p-2">
                <Gauge value={telemetry.tempIn} label="Temp. Entrée" unit="°C" color="#10B981" max={25} />
              </div>
            </div>

            {/* Sensor Status Summary */}
            <div className="bg-[#08080A] rounded-xl p-3 border border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-[#00F0FF]" />
                <span>Delta T: <strong>{(telemetry.tempOut - telemetry.tempIn).toFixed(1)} °C</strong></span>
              </div>
              <span className="text-[#10B981] flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Nominal
              </span>
            </div>
          </div>

          {/* Col 3: Maintenance Timeline & Signatures */}
          <div className="bg-[#131313]/90 backdrop-blur-md border border-[#00F0FF]/20 rounded-2xl p-5 flex flex-col gap-5 shadow-lg">
            <h2 className="text-sm font-sans font-bold text-white flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00F0FF]" />
                Historique &amp; Interventions
              </span>
              <span className="text-[10px] font-mono text-zinc-500">GMAO Synced</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-5 relative custom-scrollbar max-h-[380px]">
              <div className="absolute top-2 bottom-0 left-[11px] w-px bg-zinc-800 -z-10" />
              
              {/* Upcoming */}
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#131313] border-2 border-[#F38020] flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-[#F38020] rounded-full animate-ping" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#F38020] uppercase font-bold tracking-wider">Planifié (Sous 7 Jours)</div>
                  <h4 className="text-xs font-sans font-bold text-white mt-0.5">Remplacement Filtres &amp; Analyse Huile</h4>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">Échéance: 28 Août 2026 • Réf: WO-2026-089</p>
                </div>
              </div>

              {/* Past 1 */}
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#131313] border-2 border-[#10B981] flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">Clôturé avec Succès</div>
                  <h4 className="text-xs font-sans font-bold text-white mt-0.5">Équilibrage Rotor &amp; Recalibrage</h4>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5 mb-1.5">15 Mai 2026 • WO-2026-042</p>
                  <div className="p-2.5 rounded-lg bg-[#08080A] border border-zinc-800/80 text-[10px] font-mono text-zinc-400 space-y-1">
                    <span className="text-zinc-300 block">Tolérances ajustées à 0.02mm. Remplacement joint torique effectué.</span>
                    <div className="flex items-center justify-between text-zinc-500 pt-1 border-t border-zinc-800/50">
                      <span>Signé par: <strong>Jean Tardieu (Tech N3)</strong></span>
                      <span className="text-[#10B981] flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Certifié</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Past 2 */}
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#131313] border-2 border-[#10B981] flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">Mise en Service Initiale</div>
                  <h4 className="text-xs font-sans font-bold text-white mt-0.5">Installation &amp; Raccordement GTB</h4>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">12 Nov 2023 • Trane Certified Engineer</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-[#131313]/90 backdrop-blur-md border border-[#00F0FF]/30 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Cpu className="w-4 h-4 text-[#00F0FF]" />
            <span>Connecté à la GTB Bâtiment Alpha • Protocole Modbus RTU / BACnet</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <Link 
              to="/bim"
              className="px-4 py-2.5 rounded-xl border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/10 font-mono text-xs uppercase font-bold transition-all flex items-center justify-center gap-2"
            >
              <Box className="w-4 h-4" /> Explorer dans le BIM 3D
            </Link>
            
            <button 
              onClick={() => setShowQRModal(true)}
              className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 font-mono text-xs uppercase font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-zinc-400" /> Imprimer Étiquette QR
            </button>
            
            <button 
              onClick={() => setShowTicketModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#00dbe7] text-black shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] font-mono text-xs uppercase font-bold transition-all flex items-center justify-center gap-2"
            >
              <PenTool className="w-4 h-4" /> Déclencher un Ordre de Travail
            </button>
          </div>
        </div>

      </div>

      {/* QR Code Tag Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-[#00F0FF]/40 rounded-2xl max-w-sm w-full p-6 relative shadow-2xl flex flex-col items-center text-center">
            <button 
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mb-3">
              <QrCode className="w-6 h-6 text-[#00F0FF]" />
            </div>

            <h3 className="font-sans font-bold text-white text-lg">Étiquette QR Code CAFM</h3>
            <p className="font-mono text-xs text-zinc-400 mt-1">Chiller Unit CHLR-02 (HVAC-L4)</p>

            {/* QR Visual */}
            <div className="my-5 p-4 bg-white rounded-xl shadow-inner flex flex-col items-center">
              <svg viewBox="0 0 100 100" className="w-44 h-44 text-black">
                {/* SVG mock stylized QR code matrix */}
                <rect width="100" height="100" fill="white" />
                <path d="M10,10 h25 v25 h-25 z M15,15 h15 v15 h-15 z M19,19 h7 v7 h-7 z" fill="black" />
                <path d="M65,10 h25 v25 h-25 z M70,15 h15 v15 h-15 z M74,19 h7 v7 h-7 z" fill="black" />
                <path d="M10,65 h25 v25 h-25 z M15,70 h15 v15 h-15 z M19,74 h7 v7 h-7 z" fill="black" />
                <rect x="45" y="15" width="10" height="10" fill="black" />
                <rect x="40" y="30" width="8" height="20" fill="black" />
                <rect x="52" y="40" width="18" height="8" fill="black" />
                <rect x="75" y="45" width="15" height="10" fill="black" />
                <rect x="40" y="65" width="20" height="10" fill="black" />
                <rect x="65" y="65" width="12" height="25" fill="black" />
                <rect x="80" y="80" width="10" height="10" fill="black" />
              </svg>
              <span className="font-mono text-[9px] text-zinc-800 mt-1 uppercase font-bold">GUID: 1b6oB0a$12Sg6s</span>
            </div>

            <div className="w-full flex gap-3">
              <button 
                onClick={() => {
                  toast.success('Étiquette envoyée à l’imprimante Zebra thermique !');
                  setShowQRModal(false);
                }}
                className="flex-1 py-2.5 bg-[#00F0FF] text-black font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#00dbe7] transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Imprimer
              </button>
              <button 
                onClick={() => setShowQRModal(false)}
                className="py-2.5 px-4 bg-zinc-800 text-zinc-300 font-mono text-xs uppercase rounded-xl hover:bg-zinc-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Create Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-[#00F0FF]/40 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-sans font-bold text-white text-lg flex items-center gap-2 mb-1">
              <Wrench className="w-5 h-5 text-[#00F0FF]" />
              Nouvel Ordre de Travail (GMAO)
            </h3>
            <p className="font-mono text-xs text-zinc-400 mb-4">Équipement cible : Chiller CHLR-02</p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Intitulé de l'intervention</label>
                <input 
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full bg-[#08080A] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-[#00F0FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Priorité</label>
                  <select 
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full bg-[#08080A] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="CRITICAL">Critique (P1)</option>
                    <option value="HIGH">Haute (P2)</option>
                    <option value="MEDIUM">Normale (P3)</option>
                    <option value="LOW">Basse (P4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Affectation</label>
                  <select className="w-full bg-[#08080A] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00F0FF]">
                    <option>Équipe HVAC N2</option>
                    <option>Jean Tardieu (N3)</option>
                    <option>Prestataire Trane</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#00F0FF] hover:bg-[#00dbe7] text-black font-mono font-bold text-xs uppercase rounded-xl shadow-lg transition-all"
                >
                  Confirmer et Dispatcher
                </button>
                <button 
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="py-3 px-4 bg-zinc-800 text-zinc-300 font-mono text-xs uppercase rounded-xl hover:bg-zinc-700"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
