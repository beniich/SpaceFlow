import { useState, useCallback, useEffect } from 'react';
import { AlertTriangle, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import NodeCard from '../components/NodeCard';
import CyberTerminal from '../components/CyberTerminal';
import MetricChart from '../components/MetricChart';
import AttackSimulator from '../components/AttackSimulator';
import { useStore } from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';
import { usePlan } from '../hooks/usePlan';
import FreeDashboard from './FreeDashboard';

export default function DashboardPage() {
  const { isFree } = usePlan();
  const logs = useStore((s) => s.logs);
  const addLog = useStore((s) => s.addLog);
  const clearLogs = useStore((s) => s.clearLogs);
  const nodes = useStore((s) => s.nodes);
  const setNodes = useStore((s) => s.setNodes);

  // Enforce free tier minimalist dashboard
  if (isFree) {
    return <FreeDashboard />;
  }


  const [isProcessingNodeId, setIsProcessingNodeId] = useState<string | null>(null);
  const [isDdosActive, setIsDdosActive] = useState(true);
  const [isMalwareActive, setIsMalwareActive] = useState(false);

  const { notifyAttack } = useNotifications();

  const initialNodes = useStore.getState().nodes;

  const handleNodeAction = useCallback(
    (nodeId: string) => {
      setIsProcessingNodeId(nodeId);
      addLog('info', `Démarrage de la commande manuelle sur le module ${nodeId}...`);

      setTimeout(() => {
        setNodes(
          useStore.getState().nodes.map((n) => {
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
    },
    [addLog, setNodes]
  );

  const triggerDDoS = useCallback(() => {
    setIsDdosActive(true);
    setNodes(nodes.map((n) => (n.id === 'Node-C3' ? { ...n, status: 'critical', percentage: 41, progress: 95 } : n)));
    notifyAttack('ATTENTION: Débordement de trafic DDoS injecté avec succès sur Node-C3 API Gateway ! Latence critique.');
  }, [nodes, setNodes, notifyAttack]);

  const triggerMalware = useCallback(() => {
    setIsMalwareActive(true);
    setNodes(nodes.map((n) => (n.id === 'Node-B2' ? { ...n, status: 'updating', percentage: 15, progress: 85 } : n)));
    notifyAttack("ALERTE: Signature suspecte d'un script d'injection SQL repérée sur le nœud de base de données !");
  }, [nodes, setNodes, notifyAttack]);

  const triggerPatch = useCallback(() => {
    setNodes(nodes.map((n) => (n.id === 'Node-B2' ? { ...n, status: 'optimal', percentage: 95, progress: 100, active: true } : n)));
    setIsMalwareActive(false);
    addLog('success', 'Restauration: Correctif de sécurité appliqué sur le serveur de base de données. Vulnérabilités résolues !');
  }, [nodes, setNodes, addLog]);

  const triggerScanState = useCallback(() => {
    addLog('info', "Initialisation d'un balayage complet des nœuds pour certification SOC 2...");
    let delay = 300;
    nodes.forEach((n) => {
      setTimeout(() => {
        addLog('success', `Vérification du module ${n.id} [${n.name}] -> OK`);
      }, delay);
      delay += 300;
    });
  }, [nodes, addLog]);

  const restoreAllSystems = useCallback(() => {
    setIsDdosActive(false);
    setIsMalwareActive(false);
    setNodes(useStore.getState().nodes.map(() => null).filter(Boolean) as any[]);
    // Reset to store initial nodes
    useStore.setState({ nodes: initialNodes });
    addLog('success', "RÉINITIALISATION: Toutes les configurations d'usine et les niveaux de risque ont été réinitialisés.");
  }, [addLog, initialNodes]);

  const handleTerminalCommand = useCallback(
    (rawCommand: string) => {
      const command = rawCommand.toLowerCase().trim();
      addLog('info', `shell@cc-core:~$ ${rawCommand}`);

      if (command === 'help' || command === '?') {
        addLog('info', '--- CYBER COMMANDS DISPONIBLES (CLI) ---');
        addLog('info', '  status    : Analyse rapide et diagnostic de tous les nœuds de conformité.');
        addLog('info', "  lockdown  : Déclenche l'isolement d'urgence immédiat sur le module Node-C3.");
        addLog('info', '  unlock    : Déverrouille et libère le module Node-C3.');
        addLog('info', "  verify    : Lance un audit cryptographique manuel d'autorisation globale.");
        addLog('info', "  ping      : Teste l'état de réponse ICMP des serveurs hôtes.");
        addLog('info', "  attack    : Force une simulation d'attaque DDoS externe.");
        addLog('info', "  clear     : Efface l'historique d'affichage console.");
        addLog('info', "  crypt     : Affiche l'identifiant de chiffrement matériel configuré.");
      } else if (command === 'status') {
        addLog('info', 'Exécution de la télémétrie complète du système...');
        nodes.forEach((n) => {
          const lvl = n.status === 'critical' ? 'error' : n.status === 'updating' ? 'warn' : 'success';
          addLog(lvl, `  ${n.id} [${n.name}] -> État: ${n.status.toUpperCase()} | Intégrité: ${n.percentage}%`);
        });
      } else if (command === 'lockdown') {
        setNodes(nodes.map((n) => (n.id === 'Node-C3' ? { ...n, status: 'locked', percentage: 100, progress: 0 } : n)));
        addLog('error', "SIMULATION: Ordre de verrouillage d'urgence reçu ! Node-C3 Gateway isolé.");
      } else if (command === 'unlock') {
        setNodes(nodes.map((n) => (n.id === 'Node-C3' ? { ...n, status: 'critical', percentage: 71, progress: 70 } : n)));
        addLog('warn', 'RETOUR: Node-C3 Gateway restauré à son accès public. Statut de risque élevé réactivé.');
      } else if (command === 'verify') {
        addLog('success', "Démarrage de l'analyse de validation de conformité...");
        setTimeout(() => {
          addLog('success', '  - Signature d\'intégrité matérielle ... [PASS]');
          addLog('success', '  - Certificat SSL de transport ... [PASS]');
          addLog('success', '  - Clés d\'accès rotation de jetons ... [OK]');
          addLog('success', 'Audit terminé : Le système est certifié SOC 2 !');
        }, 300);
      } else if (command === 'ping') {
        addLog('info', "Émission d'une requête ping vers tous les nœuds d'infrastructure...");
        addLog('success', '  PING node-a1.firewall (10.0.1.5): rtt=12ms ok');
        addLog('success', '  PING node-b2.database (10.0.1.8): rtt=24ms ok');
        addLog('error', '  PING node-c3.api-gateway (10.0.2.1): PERTES DE PAQUETS 85% (Attaque active)');
        addLog('success', '  PING node-d4.auth-server (10.0.4.4): rtt=4ms ok');
      } else if (command === 'attack') {
        triggerDDoS();
      } else if (command === 'clear') {
        clearLogs();
      } else {
        addLog('error', `Erreur: commande inconnue: "${rawCommand}". Entrez "help" pour afficher l'aide.`);
      }
    },
    [nodes, setNodes, addLog, clearLogs, triggerDDoS]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Security alert banner */}
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
                  ? "DDoS volumétrique en cours sur API Gateway & Attaque d'injection SQL identifiée sur le serveur de base de données."
                  : isDdosActive
                  ? "Pic de latence anormal de 71% repéré sur API Gateway (Infiltration DDoS suspectée)."
                  : 'Script malveillant repéré essayant de contourner le module relationnel PostgreSQL Node-B2.'}
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

      {/* Node cards grid with staggered entry animation */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
            }}
          >
            <NodeCard
              node={node}
              onActionClick={handleNodeAction}
              isProcessing={isProcessingNodeId === node.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Attack simulator */}
      <AttackSimulator
        onSimulateDDoS={triggerDDoS}
        onSimulateMalware={triggerMalware}
        onSimulatePatch={triggerPatch}
        onSimulateScan={triggerScanState}
        onRestoreAll={restoreAllSystems}
        isAttacking={isDdosActive || isMalwareActive}
      />

      {/* Traffic chart + terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricChart isDdosActive={isDdosActive} isMalwareActive={isMalwareActive} />
        <CyberTerminal
          logs={logs}
          onAddLog={addLog}
          onClearLogs={clearLogs}
          onTriggerCommand={handleTerminalCommand}
        />
      </div>
    </motion.div>
  );
}
