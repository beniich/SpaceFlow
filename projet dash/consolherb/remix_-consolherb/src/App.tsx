import { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Database, 
  AlertTriangle, 
  Key, 
  RefreshCw, 
  Sliders, 
  Settings, 
  Activity, 
  Globe, 
  Award, 
  Lock, 
  Unlock, 
  Search, 
  CheckCircle, 
  Info, 
  Trash2, 
  Cpu, 
  HardDrive, 
  Layers, 
  Download,
  Terminal as TerminalIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { AuditNode, TerminalLog } from './types';
import NodeCard from './components/NodeCard';
import CyberTerminal from './components/CyberTerminal';
import MetricChart from './components/MetricChart';
import AttackSimulator from './components/AttackSimulator';
import SocCertificateModal from './components/SocCertificateModal';
import OperationsMatrix from './components/OperationsMatrix';
import AgroMaitreSuite from './components/AgroMaitreSuite';

export default function App() {
  // 1. Monitored Nodes State
  const [nodes, setNodes] = useState<AuditNode[]>([
    {
      id: 'Node-A1',
      name: 'Firewall',
      type: 'optimal',
      status: 'optimal',
      percentage: 78,
      percentageLabel: 'Integrity',
      progress: 85,
      progressLabel: 'Audit Progress',
      active: true,
      icon: 'shield'
    },
    {
      id: 'Node-B2',
      name: 'Database',
      type: 'updating',
      status: 'updating',
      percentage: 62,
      percentageLabel: 'Uptime',
      progress: 50,
      progressLabel: 'Patch Level',
      active: false,
      icon: 'database'
    },
    {
      id: 'Node-C3',
      name: 'API Gateway',
      type: 'critical',
      status: 'critical',
      percentage: 71,
      percentageLabel: 'Latency',
      progress: 70,
      progressLabel: 'Risk Factor',
      active: true,
      icon: 'alert'
    },
    {
      id: 'Node-D4',
      name: 'Auth-Server',
      type: 'secure',
      status: 'secure',
      percentage: 80,
      percentageLabel: 'Health',
      progress: 15,
      progressLabel: 'Validation',
      active: false,
      icon: 'key'
    }
  ]);

  // 2. Terminal logs State
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 4000).toLocaleTimeString(),
      level: 'info',
      message: 'Initialisation du noyau Cyber-Compliance Arch Securitised Kernel...'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 2800).toLocaleTimeString(),
      level: 'success',
      message: 'Signature SOC 2 vérifiée active. Modules de transport chiffrés.'
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 1200).toLocaleTimeString(),
      level: 'warn',
      message: 'Node-B2 PostgreSQL signale des dérives mineures de synchronisation.'
    },
    {
      id: 'log-4',
      timestamp: new Date().toLocaleTimeString(),
      level: 'error',
      message: 'Node-C3 [API Gateway] : Pic d\'attaques par déni de service externe identifié (DDoS).'
    }
  ]);

  // 3. Command center configuration and view tabs states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'infrastructure' | 'audit_logs' | 'settings' | 'ops' | 'agromaitre'>('agromaitre');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSocModalOpen, setIsSocModalOpen] = useState(false);
  const [isProcessingNodeId, setIsProcessingNodeId] = useState<string | null>(null);
  
  // Simulated attack flags
  const [isDdosActive, setIsDdosActive] = useState(true);
  const [isMalwareActive, setIsMalwareActive] = useState(false);
  
  // Settings States
  const [securityStandard, setSecurityStandard] = useState<'soc2' | 'pci' | 'iso'>('soc2');
  const [alertThreshold, setAlertThreshold] = useState<number>(65);
  const [cryptoToken, setCryptoToken] = useState<string>('AES-256GCM-FIPS-140-3-ACTIVE');

  // Helper: Append log to terminal history
  const addLog = useCallback((level: 'info' | 'success' | 'warn' | 'error', message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        message
      }
    ]);
  }, []);

  // 4. Background log generator to represent real security streaming
  useEffect(() => {
    const streamFeed = [
      { lvl: 'info', msg: 'Analyse périodique des ports de données réseau... [RAS]' },
      { lvl: 'success', msg: 'Contrôles HMAC rattachés au nœud d\'authentification validés.' },
      { lvl: 'info', msg: 'Kernel: Nettoyage automatisé de la mémoire cache.' },
      { lvl: 'warn', msg: 'Paquet TLS suspect intercepté au niveau du port 443.' },
      { lvl: 'info', msg: 'Statistiques de latence globales stabilisées à 18ms.' }
    ];

    const interval = setInterval(() => {
      // Don't flood too fast, generate a logs block every 6-7 seconds
      const randomIndex = Math.floor(Math.random() * streamFeed.length);
      const chosen = streamFeed[randomIndex];
      
      // Inject some dynamic elements to make log look extremely realistic
      let message = chosen.msg;
      if (chosen.lvl === 'warn') {
        const randIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        message = `Intrusion suspecte bloquée depuis l'hôte distant ${randIp}`;
      }
      addLog(chosen.lvl as any, message);
    }, 7000);

    return () => clearInterval(interval);
  }, [addLog]);

  // 5. Node click actions workflow handler
  const handleNodeAction = (nodeId: string) => {
    setIsProcessingNodeId(nodeId);
    addLog('info', `Démarrage de la commande manuelle sur le module ${nodeId}...`);

    setTimeout(() => {
      setNodes((prevNodes) => 
        prevNodes.map((n) => {
          if (n.id === nodeId) {
            if (n.status === 'optimal') {
              addLog('success', `Synchronisation terminée pour ${nodeId}. Les règles de pare-feu sont alignées.`);
              return { ...n, percentage: 100, progress: 100 };
            } else if (n.status === 'updating') {
              addLog('success', `Base de données ${nodeId} mise à niveau avec succès vers la dernière version.`);
              return { ...n, status: 'optimal', percentage: 98, progress: 95, active: true };
            } else if (n.status === 'critical') {
              addLog('success', `Alerte maîtrisée ! ${nodeId} isolé avec succès du réseau public.`);
              return { ...n, status: 'locked', percentage: 100, progress: 0 };
            } else if (n.status === 'locked') {
              addLog('warn', `Déverrouillage de ${nodeId}. Rétablissement de l'accès général.`);
              return { ...n, status: 'critical', percentage: 71, progress: 70 };
            } else if (n.status === 'secure') {
              addLog('success', `Contrôle de validation cryptographique concluant pour ${nodeId}. Certificat intact.`);
              return { ...n, status: 'optimal', percentage: 100, progress: 100, active: true };
            }
          }
          return n;
        })
      );
      setIsProcessingNodeId(null);
    }, 1500);
  };

  // 6. Interactive Command Line parser callback
  const handleTerminalCommand = (rawCommand: string) => {
    const command = rawCommand.toLowerCase().trim();
    
    // Command logs
    addLog('info', `shell@cc-core:~$ ${rawCommand}`);

    if (command === 'help' || command === '?') {
      addLog('info', '--- CYBER COMMANDS DISPONIBLES (CLI) ---');
      addLog('info', '  status    : Analyse rapide et diagnostic de tous les nœuds de conformité.');
      addLog('info', '  lockdown  : Déclenche l\'isolement d\'urgence immédiat sur le module Node-C3.');
      addLog('info', '  unlock    : Déverrouille et libère le module Node-C3.');
      addLog('info', '  verify    : Lance un audit cryptographique manuel d\'autorisation globale.');
      addLog('info', '  ping      : Teste l\'état de réponse ICMP des serveurs hôtes.');
      addLog('info', '  attack    : Force une simulation d\'attaque DDoS externe.');
      addLog('info', '  clear     : Efface l\'historique d\'affichage console.');
      addLog('info', '  crypt     : Affiche l\'identifiant de chiffrement matériel configuré.');
    } else if (command === 'status') {
      addLog('info', 'Exécution de la télémétrie complète du système...');
      nodes.forEach(n => {
        const lvl = n.status === 'critical' ? 'error' : n.status === 'updating' ? 'warn' : 'success';
        addLog(lvl, `  ${n.id} [${n.name}] -> État: ${n.status.toUpperCase()} | Intégrité: ${n.percentage}%`);
      });
    } else if (command === 'lockdown') {
      setNodes(prev => prev.map(n => n.id === 'Node-C3' ? { ...n, status: 'locked', percentage: 100, progress: 0 } : n));
      addLog('error', 'SIMULATION: Ordre de verrouillage d\'urgence reçu ! Node-C3 Gateway isolé.');
    } else if (command === 'unlock') {
      setNodes(prev => prev.map(n => n.id === 'Node-C3' ? { ...n, status: 'critical', percentage: 71, progress: 70 } : n));
      addLog('warn', 'RETOUR: Node-C3 Gateway restauré à son accès public. Statut de risque élevé réactivé.');
    } else if (command === 'verify') {
      addLog('success', 'Démarrage de l\'analyse de validation de conformité...');
      setTimeout(() => {
        addLog('success', '  - Signature d\'intégrité matérielle ... [PASS]');
        addLog('success', '  - Certificat SSL de transport ... [PASS]');
        addLog('success', '  - Clés d\'accès rotation de jetons ... [OK]');
        addLog('success', 'Audit terminé : Le système est certifié SOC 2 !');
      }, 300);
    } else if (command === 'ping') {
      addLog('info', 'Émission d\'une requête ping vers tous les nœuds d\'infrastructure...');
      addLog('success', '  PING node-a1.firewall (10.0.1.5): rtt=12ms ok');
      addLog('success', '  PING node-b2.database (10.0.1.8): rtt=24ms ok');
      addLog('error', '  PING node-c3.api-gateway (10.0.2.1): PERTES DE PAQUETS 85% (Attaque active)');
      addLog('success', '  PING node-d4.auth-server (10.0.4.4): rtt=4ms ok');
    } else if (command === 'attack') {
      triggerDDoS();
    } else if (command === 'clear') {
      setLogs([]);
    } else if (command === 'crypt') {
      addLog('success', `CRYPT_LAYER: standard de chiffrement de bout en bout: ${cryptoToken}`);
    } else {
      addLog('error', `Erreur: commande inconnue: "${rawCommand}". Entrez "help" pour afficher l'aide.`);
    }
  };

  // 7. Simulation trigger methods
  const triggerDDoS = () => {
    setIsDdosActive(true);
    setNodes(prev => prev.map(n => n.id === 'Node-C3' ? { ...n, status: 'critical', percentage: 41, progress: 95 } : n));
    addLog('error', 'ATTENTION: Débordement de trafic DDoS injecté avec succès sur Node-C3 API Gateway ! Latence critique.');
  };

  const triggerMalware = () => {
    setIsMalwareActive(true);
    setNodes(prev => prev.map(n => n.id === 'Node-B2' ? { ...n, status: 'updating', percentage: 15, progress: 85 } : n));
    addLog('error', 'ALERTE: Signature suspecte d\'un script d\'injection SQL repérée sur le nœud de base de données !');
  };

  const triggerPatch = () => {
    setNodes(prev => prev.map(n => n.id === 'Node-B2' ? { ...n, status: 'optimal', percentage: 95, progress: 100, active: true } : n));
    setIsMalwareActive(false);
    addLog('success', 'Restauration: Correctif de sécurité appliqué sur le serveur de base de données. Vulnérabilités résolues !');
  };

  const triggerScanState = () => {
    addLog('info', 'Initialisation d\'un balayage complet des nœuds pour certification SOC 2...');
    let delay = 300;
    nodes.forEach(n => {
      setTimeout(() => {
        addLog('success', `Vérification du module ${n.id} [${n.name}] -> OK`);
      }, delay);
      delay += 300;
    });
  };

  const restoreAllSystems = () => {
    setIsDdosActive(false);
    setIsMalwareActive(false);
    setNodes([
      {
        id: 'Node-A1',
        name: 'Firewall',
        type: 'optimal',
        status: 'optimal',
        percentage: 78,
        percentageLabel: 'Integrity',
        progress: 85,
        progressLabel: 'Audit Progress',
        active: true,
        icon: 'shield'
      },
      {
        id: 'Node-B2',
        name: 'Database',
        type: 'updating',
        status: 'updating',
        percentage: 62,
        percentageLabel: 'Uptime',
        progress: 50,
        progressLabel: 'Patch Level',
        active: false,
        icon: 'database'
      },
      {
        id: 'Node-C3',
        name: 'API Gateway',
        type: 'critical',
        status: 'critical',
        percentage: 71,
        percentageLabel: 'Latency',
        progress: 70,
        progressLabel: 'Risk Factor',
        active: true,
        icon: 'alert'
      },
      {
        id: 'Node-D4',
        name: 'Auth-Server',
        type: 'secure',
        status: 'secure',
        percentage: 80,
        percentageLabel: 'Health',
        progress: 15,
        progressLabel: 'Validation',
        active: false,
        icon: 'key'
      }
    ]);
    addLog('success', 'RÉINITIALISATION: Toutes les configurations d\'usine et les niveaux de risque ont été réinitialisés.');
  };

  // Log filter selector
  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.level.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.timestamp.includes(searchQuery)
  );

  return (
    <div className="min-h-screen text-[#d4e4fa] bg-[#051424] overflow-x-hidden selection:bg-[#38BDF8] selection:text-black">
      {/* Dynamic scanline effect overlay */}
      <div className="fixed inset-0 grid-overlay opacity-[0.03] pointer-events-none z-50"></div>
      
      {/* Decorative cyber backdrop grid lights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 pt-2 sm:pt-3 lg:pt-4 relative">
        
        {/* NAVIGATION BAR - MINIMIZED TO LE PETIT POSSIBLE */}
        <nav className="flex flex-row justify-between items-center mb-6 border-b border-slate-800 pb-2 gap-2 text-[10px]" id="main-nav">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-5 h-5 bg-[#4de082] rounded-xs flex items-center justify-center text-[#003919] font-bold font-mono text-[9px] tracking-tight shadow-sm select-none">
              CC
            </div>
            <span className="text-[11px] font-bold tracking-tight uppercase font-mono hidden xs:inline text-white">
              Cyber-Compliance <span className="text-[#4de082]">Arch</span>
            </span>
          </div>
          
          {/* Navigation Links - Ultra Compact Single Line */}
          <div className="flex flex-wrap items-center justify-center gap-1 text-[9.5px] font-semibold uppercase font-mono bg-[#0c1825]/80 border border-slate-800/80 p-0.5 rounded-xs shrink-1 max-w-full">
            <button
              onClick={() => setActiveTab('agromaitre')}
              className={`px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer flex items-center gap-0.5 ${
                activeTab === 'agromaitre'
                  ? 'bg-[#122131] border border-[#4de082]/50 text-[#4de082] shadow-xs font-bold'
                  : 'text-[#4de082] hover:text-[#7bf0a6]'
              }`}
              id="nav-lnk-agromaitre"
            >
              <span>🌾</span> Portails
            </button>
            <button
              onClick={() => setActiveTab('ops')}
              className={`px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${
                activeTab === 'ops'
                  ? 'bg-[#122131] border border-slate-700 text-[#4de082] font-bold'
                  : 'text-[#c5c6cd] hover:text-white'
              }`}
              id="nav-lnk-ops"
            >
              Modules
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#122131] border border-slate-700 text-white font-bold'
                  : 'text-[#c5c6cd] hover:text-white'
              }`}
              id="nav-lnk-dashboard"
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('infrastructure')}
              className={`px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${
                activeTab === 'infrastructure'
                  ? 'bg-[#122131] border border-slate-700 text-white font-bold'
                  : 'text-[#c5c6cd] hover:text-white'
              }`}
              id="nav-lnk-infra"
            >
              Infra
            </button>
            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${
                activeTab === 'audit_logs'
                  ? 'bg-[#122131] border border-slate-700 text-white font-bold'
                  : 'text-[#c5c6cd] hover:text-white'
              }`}
              id="nav-lnk-logs"
            >
              Logs
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#122131] border border-slate-700 text-white font-bold'
                  : 'text-[#c5c6cd] hover:text-white'
              }`}
              id="nav-lnk-settings"
            >
              Settings
            </button>
          </div>
 
          <div className="flex items-center gap-1 shrink-0">
            {/* Interactive Certificate Badge - Smaller */}
            <button
              onClick={() => setIsSocModalOpen(true)}
              className="text-[8.5px] font-mono bg-[#0a192f] px-1.5 py-0.5 border border-[#334155] text-[#4de082] rounded-xs hover:border-[#4de082] transition active:scale-95 cursor-pointer flex items-center gap-0.5"
              id="soc-compliance-badge"
            >
              <Award className="w-2.5 h-2.5 text-[#4de082]" />
              <span className="hidden sm:inline">SOC 2 CERTIFIED</span>
              <span className="sm:hidden text-[7.5px]">SOC 2</span>
            </button>
            
            {/* Admin Avatar Identity and Email Indicator - Smaller */}
            <div 
              className="w-5 h-5 rounded-full bg-[#1c2b3c] border border-slate-700 flex items-center justify-center font-mono text-[9px] text-white uppercase font-bold select-none cursor-help"
              title="Identity: Security Administrator // adambeniich7@gmail.com"
              id="admin-avatar"
            >
              AB
            </div>
          </div>
        </nav>

        {/* HEADER SECTION */}
        <header className="mb-8" id="dashboard-header">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#d4e4fa] tracking-tight leading-none">
                {activeTab === 'agromaitre' && 'Console Applicative AgroMaître'}
                {activeTab === 'ops' && 'Industrial Control Center'}
                {activeTab === 'dashboard' && 'Security Posture Monitor'}
                {activeTab === 'infrastructure' && 'Infrastructure Topology'}
                {activeTab === 'audit_logs' && 'Central Compliance Audit Registry'}
                {activeTab === 'settings' && 'Systems Settings & Threshold Decouplers'}
              </h1>
              <p className="text-[#c5c6cd] text-xs font-mono mt-2 uppercase tracking-wide">
                SYS_STATUS:{' '}
                <span className={isDdosActive || isMalwareActive ? 'text-red-400 font-bold animate-pulse' : 'text-[#4de082]'}>
                  {isDdosActive || isMalwareActive ? 'INTRUSION_DETECTED' : 'ACTIVE_SECURED'}
                </span>{' '}
                // ENCRYPTION: AES-256 // NODES: 04/04 // STANDARD: {securityStandard.toUpperCase()}
              </p>
            </div>

            {/* Live UTC indicator */}
            <div className="p-3 bg-[#0d1c2d] border border-slate-700/60 rounded-[3px] text-right font-mono text-xs text-emerald-400">
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider mb-0.5">CURRENT TIMELINES (GMT)</span>
              <div>2026-06-05 18:54:40 // ACTIVE</div>
            </div>
          </div>
        </header>

        {/* VIEW CONDITIONAL RENDERING */}
        <AnimatePresence mode="wait">
          {activeTab === 'agromaitre' && (
            <motion.div
              key="view-agromaitre"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              id="view-container-agromaitre"
            >
              <AgroMaitreSuite 
                onAddLog={addLog}
              />
            </motion.div>
          )}

          {activeTab === 'ops' && (
            <motion.div
              key="view-ops"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              id="view-container-ops"
            >
              <OperationsMatrix 
                onAddLog={addLog}
                mainLogs={logs}
              />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="view-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              id="view-container-dashboard"
            >
              {/* ALERT BANNER IF APPLICABLE */}
              {(isDdosActive || isMalwareActive) && (
                <div className="bg-red-950/40 border border-red-500/40 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 glow-red">
                  <div className="flex items-start sm:items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-400 mt-1 sm:mt-0 animate-pulse shrink-0" />
                    <div>
                      <h4 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
                        ALERTE DE SÉCURITÉ CRITIQUE EXPÉDIÉE !
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5 font-mono">
                        {isDdosActive && isMalwareActive 
                          ? 'DDoS volumétrique en cours sur API Gateway & Attaque d\'injection SQL identifiée sur le serveur de base de données.' 
                          : isDdosActive 
                            ? 'Pic de latence anormal de 71% repéré sur API Gateway (Infiltration DDoS suspectée).' 
                            : 'Script malveillant repéré essayant de contourner le module relationnel PostgreSQL Node-B2.'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleNodeAction('Node-C3')}
                      className="bg-red-500 text-white text-[10px] font-bold font-mono uppercase px-3 py-1.5 rounded-sm hover:bg-white hover:text-black transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Lockdown Gateway</span>
                    </button>
                    <button
                      onClick={restoreAllSystems}
                      className="border border-[#38BDF8] text-[#38BDF8] text-[10px] bg-slate-900/40 font-bold font-mono uppercase px-3 py-1.5 rounded-sm hover:bg-[#38BDF8] hover:text-white transition cursor-pointer"
                    >
                      Ignorer la Menace
                    </button>
                  </div>
                </div>
              )}

              {/* MAIN NODE CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {nodes.map((node) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    onActionClick={handleNodeAction}
                    isProcessing={isProcessingNodeId === node.id}
                  />
                ))}
              </div>

              {/* INTEGRATED THREATS SIMULATOR MODULE */}
              <AttackSimulator
                onSimulateDDoS={triggerDDoS}
                onSimulateMalware={triggerMalware}
                onSimulatePatch={triggerPatch}
                onSimulateScan={triggerScanState}
                onRestoreAll={restoreAllSystems}
                isAttacking={isDdosActive || isMalwareActive}
              />

              {/* TRAFFIC ANALYSIS GRAPH & SHELL TERMINAL GIGANTIC GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MetricChart 
                  isDdosActive={isDdosActive} 
                  isMalwareActive={isMalwareActive} 
                />
                
                <CyberTerminal
                  logs={logs}
                  onAddLog={addLog}
                  onClearLogs={() => setLogs([])}
                  onTriggerCommand={handleTerminalCommand}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'infrastructure' && (
            <motion.div
              key="view-infra"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              id="view-container-infra"
            >
              {/* Topological Table */}
              <div className="bg-[#122131] border border-[#334155] rounded-[4px] p-6 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      RÉSEAU TOPOLOGIQUE DES MONITEURS CC_ARCH
                    </h2>
                    <p className="text-xs text-[#c5c6cd] mt-0.5">
                      Vue microscopique des hôtes et performances de serveurs locaux à double sens.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 bg-[#0a192f] border border-slate-700 text-teal-400">
                    AES-256-GCM SÉCURISÉ
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#334155] text-slate-400 font-mono text-[10px] uppercase">
                        <th className="pb-3 pr-2">Nœud d'infrastructure</th>
                        <th className="pb-3 px-2">Espace IP</th>
                        <th className="pb-3 px-2">Ports Autorisés</th>
                        <th className="pb-3 px-2">Système d'exploitation</th>
                        <th className="pb-3 px-2">Charge CPU</th>
                        <th className="pb-3 px-2">Uptime Actuel</th>
                        <th className="pb-3 px-2 text-right">Contrôle Réseau</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155]/60">
                      {nodes.map((node, index) => {
                        const randomCpuLoad = node.status === 'optimal' 
                          ? 12 + index * 4 
                          : node.status === 'critical' 
                            ? 88 
                            : node.status === 'locked' 
                              ? 1 
                              : 45;

                        return (
                          <tr key={node.id} className="hover:bg-slate-800/20">
                            <td className="py-4 pr-2 font-mono font-bold text-white flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${node.status === 'critical' ? 'bg-red-500 animate-ping' : node.status === 'locked' ? 'bg-[#38BDF8]' : 'bg-[#4de082]'}`}></span>
                              <span>{node.id} ({node.name})</span>
                            </td>
                            <td className="py-4 px-2 font-mono text-slate-300">
                              10.0.{index + 1}.{Math.floor(12 + index * 10)}
                            </td>
                            <td className="py-4 px-2 font-mono text-slate-400">
                              {node.icon === 'shield' && '80, 443, 8080'}
                              {node.icon === 'database' && '5432, 5433'}
                              {node.icon === 'alert' && '110, 995, 3000'}
                              {node.icon === 'key' && '22, 1022, 4443'}
                            </td>
                            <td className="py-4 px-2 text-[#c5c6cd] font-mono">
                              {node.id === 'Node-A1' ? 'Alpine OS 3.19' : 'RedHat Linux 9.4'}
                            </td>
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-2 w-28">
                                <div className="flex-1 bg-[#0d1c2d] h-2 rounded-xs overflow-hidden border border-slate-800">
                                  <div 
                                    className={`h-full ${randomCpuLoad > 80 ? 'bg-red-500' : 'bg-[#4de082]'}`}
                                    style={{ width: `${randomCpuLoad}%` }}
                                  />
                                </div>
                                <span className="font-mono text-[10px] text-slate-300 w-8 text-right">{randomCpuLoad}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-2 font-mono text-[#4de082]">{node.status === 'critical' ? '2.4 Hrs' : '294 Days'}</td>
                            <td className="py-4 px-2 text-right">
                              <button 
                                onClick={() => handleNodeAction(node.id)}
                                className={`text-[10px] font-mono font-bold border border-slate-700 hover:border-[#38BDF8] hover:text-white px-2 py-1 rounded-sm uppercase tracking-wide cursor-pointer text-slate-400`}
                              >
                                {node.status === 'locked' ? 'Débloquer' : 'Actionner'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hardware Telemetry Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#122131] border border-[#334155] p-5 rounded-[4px] flex items-center gap-4">
                  <div className="p-3 bg-[#0a192f] border border-slate-700/60 text-[#4de082] rounded-sm">
                    <Cpu className="w-6 h-6 animate-pulse-slow" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8f9097] uppercase">ALLOCATION MICROPROCESSEUR</span>
                    <h4 className="text-lg font-mono font-bold text-white mt-1">24 CORES ACTIVE</h4>
                    <p className="text-xs text-emerald-400 font-mono mt-0.5">Performance optimalized</p>
                  </div>
                </div>

                <div className="bg-[#122131] border border-[#334155] p-5 rounded-[4px] flex items-center gap-4">
                  <div className="p-3 bg-[#0a192f] border border-slate-700/60 text-[#38BDF8] rounded-sm">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8f9097] uppercase">STOCKAGE CLOUD EN RELAIS</span>
                    <h4 className="text-lg font-mono font-bold text-white mt-1">1.8 TB / 2.0 TB</h4>
                    <p className="text-xs text-sky-400 font-mono mt-0.5">85% compression AES-XTS</p>
                  </div>
                </div>

                <div className="bg-[#122131] border border-[#334155] p-5 rounded-[4px] flex items-center gap-4">
                  <div className="p-3 bg-[#0a192f] border border-slate-700/60 text-emerald-400 rounded-sm">
                    <Globe className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8f9097] uppercase">RELAIS ZONE DE SÉCURITÉ</span>
                    <h4 className="text-lg font-mono font-bold text-white mt-1">EU-WEST (LONDRES)</h4>
                    <p className="text-xs text-[#4de082] font-mono mt-0.5">Transit via SSL Proxy (Active)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'audit_logs' && (
            <motion.div
              key="view-logs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              id="view-container-audit"
            >
              <div className="bg-[#122131] border border-[#334155] rounded-[4px] p-6 shadow-md">
                
                {/* Search Bar filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      RÉGISTRE CENTRALISÉ DES ÉVÉNEMENTS & INCIDENTS
                    </h2>
                    <p className="text-xs text-[#c5c6cd] mt-0.5">
                      Journal de conformité inaltérable retraçant toutes les actions materielles.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c5c6cd]">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      className="w-full bg-[#07111c] border border-[#334155] focus:border-[#38BDF8] text-xs py-2 pl-9 pr-4 rounded-sm outline-none text-white font-mono placeholder:text-gray-500"
                      placeholder="Filtrer les journaux (ex: ddos, warn, success)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      id="search-audit-log"
                    />
                  </div>
                </div>

                {/* Audit Timeline */}
                <div className="space-y-3 font-mono text-xs max-h-96 overflow-y-auto pr-2">
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 italic">
                      Aucun message d'audit ne correspond à la requête "{searchQuery}".
                    </div>
                  ) : (
                    filteredLogs.map((log) => {
                      let levelColor = 'bg-slate-800 text-slate-300 border-slate-700';
                      if (log.level === 'success') levelColor = 'bg-emerald-950 text-emerald-300 border-emerald-500/30';
                      if (log.level === 'warn') levelColor = 'bg-sky-950 text-sky-300 border-sky-500/30';
                      if (log.level === 'error') levelColor = 'bg-red-950 text-red-300 border-red-500/40 animate-pulse';

                      return (
                        <div key={log.id} className="p-3 bg-[#0a192f] border border-slate-800 rounded flex justify-between items-center gap-4">
                          <div className="flex items-start gap-3">
                            <span className="text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                            <span className={`text-[10px] px-1.5 py-0.5 border rounded uppercase ${levelColor}`}>
                              {log.level}
                            </span>
                            <span className="text-slate-200">{log.message}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 hidden sm:-block">SECURED_BY_SHA256</span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#334155] flex justify-between items-center text-xs">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLogs([])}
                      className="flex items-center gap-1.5 text-[#ffb3b0] hover:text-white hover:bg-red-950/20 px-3 py-1.5 border border-red-500/20 rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Vider la console</span>
                    </button>
                    <button
                      onClick={() => {
                        addLog('info', 'Rejeu des audits de sécurité de conformité...');
                        nodes.forEach((n) => addLog('success', `Nœud vérifié : ${n.name} (100% stable)`));
                      }}
                      className="bg-slate-900 border border-slate-700 hover:border-[#38BDF8] text-slate-300 hover:text-white px-3 py-1.5 rounded transition cursor-pointer"
                    >
                      Regénérer logs factices
                    </button>
                  </div>

                  <span className="text-slate-400 font-mono text-[10px]">
                    Affichage de {filteredLogs.length} / {logs.length} événements
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="view-settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              id="view-container-settings"
            >
              {/* Compliance standard and Threshold config */}
              <div className="bg-[#122131] border border-[#334155] rounded-[4px] p-6 shadow-md md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                    SÉLECTION DU RÉGISTRE DE CONFORMITÉ
                  </h2>
                  <p className="text-xs text-[#c5c6cd] mt-0.5">
                    Modifiez le type de audit d'intégrité imposé matériellement.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setSecurityStandard('soc2');
                      addLog('success', 'Régistre de sécurité modifié : SOC 2 TYPE II [ACTIVÉ]');
                    }}
                    className={`p-4 border font-mono rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                      securityStandard === 'soc2'
                        ? 'bg-emerald-950/40 border-[#4de082] text-white shadow-sm'
                        : 'bg-[#0a192f] border-[#334155] text-[#c5c6cd] hover:border-slate-500'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                    <span className="text-[11px] font-bold">SOC 2 Type II</span>
                  </button>

                  <button
                    onClick={() => {
                      setSecurityStandard('pci');
                      addLog('success', 'Régistre de sécurité modifié : PCI-DSS v4.0 [ACTIVÉ]');
                    }}
                    className={`p-4 border font-mono rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                      securityStandard === 'pci'
                        ? 'bg-sky-950/40 border-[#38BDF8] text-white shadow-sm'
                        : 'bg-[#0a192f] border-[#334155] text-[#c5c6cd] hover:border-slate-500'
                    }`}
                  >
                    <Sliders className="w-5 h-5" />
                    <span className="text-[11px] font-bold">PCI-DSS 4.0</span>
                  </button>

                  <button
                    onClick={() => {
                      setSecurityStandard('iso');
                      addLog('success', 'Régistre de sécurité modifié : ISO 27001 [ACTIVÉ]');
                    }}
                    className={`p-4 border font-mono rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                      securityStandard === 'iso'
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm'
                        : 'bg-[#0a192f] border-[#334155] text-[#c5c6cd] hover:border-slate-500'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-[11px] font-bold">ISO 27001</span>
                  </button>
                </div>

                {/* Range alerts threshold level */}
                <div className="space-y-4 pt-4 border-t border-[#334155]/60">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-white">
                        Seuil de latence critique
                      </h3>
                      <p className="text-xs text-[#c5c6cd] mt-0.5">
                        Déclenche l'alerte d'intrusion si la latence dépasse ce niveau.
                      </p>
                    </div>
                    <span className="text-sm font-mono font-bold text-[#38BDF8]">{alertThreshold} ms</span>
                  </div>
                  
                  <input
                    type="range"
                    min="30"
                    max="150"
                    value={alertThreshold}
                    onChange={(e) => {
                      setAlertThreshold(Number(e.target.value));
                    }}
                    className="w-full h-1 bg-[#0a192f] rounded-lg cursor-pointer accent-[#38BDF8]"
                    id="latency-threshold-slider"
                  />
                </div>

                {/* Token administration */}
                <div className="space-y-3 pt-4 border-t border-[#334155]/60">
                  <label className="block text-xs font-mono font-bold uppercase text-white">
                    Clé de chiffrement administrative (FIPS 140-3)
                  </label>
                  <input
                    type="text"
                    value={cryptoToken}
                    onChange={(e) => setCryptoToken(e.target.value)}
                    className="w-full bg-[#07111c] border border-[#334155] focus:border-[#38BDF8] rounded-sm text-xs py-2 px-3 outline-none text-slate-200 font-mono"
                    id="fips-cipher-token"
                  />
                  <p className="text-[10px] text-[#8f9097] font-mono">
                    Les modules d'infrastructure réencryptent automatiquement par HMAC avec cette clé à la volée.
                  </p>
                </div>
              </div>

              {/* Security policy checklists */}
              <div className="bg-[#122131] border border-[#334155] rounded-[4px] p-6 shadow-md space-y-6">
                <div>
                  <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                    CONTRÔLE DE SÉCURITÉ SOC 2
                  </h2>
                  <p className="text-xs text-[#c5c6cd] mt-0.5">
                    Règles obligatoires imposées à nos serveurs d'Arch-Compliance.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#4de082] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white block font-bold">SYS-AES: TLS Actif v1.3</span>
                      <span className="text-gray-400 text-[10px]">Trafic HTTP forcé sur le protocole chiffré.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#4de082] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white block font-bold">AUTH-MFA: Double Facteur</span>
                      <span className="text-gray-400 text-[10px]">Protection de l'accès kernel requis pour l'administrateur.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#4de082] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white block font-bold">SQL-ENC: Relationnel chiffré</span>
                      <span className="text-gray-400 text-[10px]">La base PostgreSQL Node-B2 applique le chiffrement crypt.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="text-[#8f9097] block font-bold">NET-WAF: Pare-feu restrictif</span>
                      <span className="text-gray-400 text-[10px]">Vérification continue des connexions.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#334155] text-center">
                  <button
                    onClick={() => setIsSocModalOpen(true)}
                    className="w-full bg-[#4de082] hover:bg-white text-[#003919] hover:text-black font-bold font-mono text-xs py-2 rounded-sm uppercase tracking-wide cursor-pointer transition"
                  >
                    Voir Certificat SOC 2
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMPLIANCE SOC 2 CERTIFICATE MODAL */}
        <SocCertificateModal
          isOpen={isSocModalOpen}
          onClose={() => setIsSocModalOpen(false)}
          auditNodesLength={nodes.length}
        />

        {/* FOOTER BAR */}
        <footer className="mt-12 pt-6 border-t border-[#334155] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#8f9097]" id="main-footer">
          <div>
            &copy; 2026 CYBER-COMPLIANCE COMMAND CENTER. TOUS DROITS RÉSERVÉS.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#4de082] rounded-full animate-ping"></span>
              <span>LIAISON SEC SOC-A1 SECURED</span>
            </span>
            <span>AES-256-GCM CBC</span>
            <span>v4.11-STABLE</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
