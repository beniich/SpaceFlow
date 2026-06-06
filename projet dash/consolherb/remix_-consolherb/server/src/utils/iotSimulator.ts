import { prisma } from './prisma';
import { analyzeSensorData } from '../services/adviceService';

// ─── Types ──────────────────────────────────────────────────────────────────
type NodeStatus = 'optimal' | 'updating' | 'critical' | 'secure' | 'locked';

interface NodeState {
  id: string;
  name: string;
  icon: string;
  status: NodeStatus;
  percentage: number;
  percentageLabel: string;
  progress: number;
  progressLabel: string;
  active: boolean;
  cpuLoad: number;
}

interface SimLog {
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

// ─── SSE Clients Registry ────────────────────────────────────────────────────
type SSEClient = (data: object) => void;
const sseClients: Set<SSEClient> = new Set();

export function addSSEClient(send: SSEClient) {
  sseClients.add(send);
}

export function removeSSEClient(send: SSEClient) {
  sseClients.delete(send);
}

export function broadcastEvent(event: string, data: object) {
  sseClients.forEach((send) => send({ event, data }));
}

// Internal alias kept for use within this file
function broadcast(event: string, data: object) {
  broadcastEvent(event, data);
}


// ─── Initial Node Definitions ────────────────────────────────────────────────
const nodes: NodeState[] = [
  {
    id: 'Node-A1',
    name: 'Firewall',
    icon: 'shield',
    status: 'optimal',
    percentage: 78,
    percentageLabel: 'Integrity',
    progress: 85,
    progressLabel: 'Audit Progress',
    active: true,
    cpuLoad: 12,
  },
  {
    id: 'Node-B2',
    name: 'Database',
    icon: 'database',
    status: 'updating',
    percentage: 62,
    percentageLabel: 'Uptime',
    progress: 50,
    progressLabel: 'Patch Level',
    active: false,
    cpuLoad: 45,
  },
  {
    id: 'Node-C3',
    name: 'API Gateway',
    icon: 'alert',
    status: 'critical',
    percentage: 71,
    percentageLabel: 'Latency',
    progress: 70,
    progressLabel: 'Risk Factor',
    active: true,
    cpuLoad: 88,
  },
  {
    id: 'Node-D4',
    name: 'Auth-Server',
    icon: 'key',
    status: 'secure',
    percentage: 80,
    percentageLabel: 'Health',
    progress: 15,
    progressLabel: 'Validation',
    active: false,
    cpuLoad: 16,
  },
];

// ─── Realistic log messages by level ─────────────────────────────────────────
const logTemplates: SimLog[] = [
  { level: 'info', message: 'Vérification de l\'intégrité des certificats TLS en cours...' },
  { level: 'info', message: 'Synchronisation des clés HMAC entre les modules d\'infrastructure.' },
  { level: 'info', message: 'Balayage de réseau topologique initié depuis Node-A1.' },
  { level: 'info', message: 'Connexion SSH établie depuis IP 10.0.1.5 → Audit autorisé.' },
  { level: 'success', message: 'Signature SOC 2 validée. Conformité vérifiée avec succès.' },
  { level: 'success', message: 'Patch de sécurité #4729 appliqué sur Node-B2 PostgreSQL.' },
  { level: 'success', message: 'Heartbeat réseau OK — tous les nœuds répondent nominalement.' },
  { level: 'success', message: 'Certificat FIPS-140-3 renouvelé. Durée de vie : 365j.' },
  { level: 'warn', message: 'Dérive de synchronisation détectée sur Node-B2 (Δt = +12ms).' },
  { level: 'warn', message: 'Pic de latence réseau observé : 82ms > seuil configuré (65ms).' },
  { level: 'warn', message: 'Tentative de connexion suspecte bloquée par le pare-feu Node-A1.' },
  { level: 'warn', message: 'Capacité disque Node-B2 à 78%. Rotation des logs activée.' },
  { level: 'error', message: 'ALERTE: Signature d\'injection SQL détectée sur Node-B2 Database !' },
  { level: 'error', message: 'Node-C3 API Gateway : Taux d\'erreur 5xx dépasse 12% des requêtes.' },
  { level: 'error', message: 'Pic DDoS volumétrique détecté — 14,200 req/s sur le port 443.' },
  { level: 'error', message: 'Échec de vérification MFA sur 3 tentatives. Compte temporairement verrouillé.' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Persist a log to PostgreSQL ─────────────────────────────────────────────
async function persistLog(log: SimLog) {
  try {
    await prisma.report.create({
      data: {
        title: `[SIM] ${log.level.toUpperCase()}`,
        type: 'SIMULATOR',
        content: { level: log.level, message: log.message, timestamp: new Date().toISOString() },
        // createdById is optional for system-generated logs
        createdById: undefined,
      },
    });
  } catch {
    // DB may not be connected in dev — silently ignore
  }
}

// ─── Smart Advice Generator (DSS Bridge) ─────────────────────────────────────
async function tickAdvice() {
  try {
    // Randomly select a crop to simulate a zone reading
    const crops = await prisma.cropKnowledge.findMany();
    if (crops.length === 0) return;
    
    const crop = pickRandom(crops);
    const sensorType = Math.random() > 0.5 ? 'pH' : 'temp';
    let currentValue = 0;
    
    if (sensorType === 'pH') {
      currentValue = Number((crop.idealPhMin + randomBetween(-2, 2)).toFixed(1));
    } else {
      currentValue = crop.idealTempMin + randomBetween(-10, 10);
    }
    
    const advice = await analyzeSensorData(crop.name, sensorType, currentValue);
    if (advice) {
      broadcast('SMART_ADVICE', advice);
    }
  } catch (error) {
    // DB unavailable
  }
}

// ─── Tick: mutate node states with realistic variation ────────────────────────
function tickNodes() {
  nodes.forEach((node) => {
    // Small random drift on percentage & CPU
    const drift = randomBetween(-5, 5);
    node.percentage = clamp(node.percentage + drift, 15, 99);
    node.cpuLoad = clamp(node.cpuLoad + randomBetween(-8, 8), 2, 99);
    node.progress = clamp(node.progress + randomBetween(-3, 3), 5, 100);

    // Probabilistic status changes
    const roll = Math.random();
    if (node.status === 'critical' && roll > 0.7) {
      node.status = 'updating'; // starts recovering
      node.percentage = clamp(node.percentage + 10, 15, 99);
    } else if (node.status === 'optimal' && roll > 0.92) {
      node.status = 'updating'; // scheduled maintenance
    } else if (node.status === 'updating' && roll > 0.8) {
      node.status = roll > 0.9 ? 'critical' : 'optimal';
    } else if (node.status === 'secure' && roll > 0.95) {
      node.status = 'optimal';
    }
  });
}

// ─── Tick: pick and emit a random log ────────────────────────────────────────
async function tickLog() {
  const log = pickRandom(logTemplates);
  await persistLog(log);
  broadcast('log', {
    id: `log-sim-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString('fr-FR'),
    level: log.level,
    message: log.message,
  });
}

// ─── Tick: emit updated node states ──────────────────────────────────────────
function tickNodeBroadcast() {
  tickNodes();
  broadcast('nodes', nodes.map((n) => ({ ...n })));
}

// ─── Main export: start the IoT simulator ────────────────────────────────────
export function startIotSimulator() {
  // eslint-disable-next-line no-console
  console.log('🌡️  IoT Simulator started — broadcasting live data to SSE clients');

  // Emit nodes every 3 seconds
  setInterval(tickNodeBroadcast, 3000);

  // Emit logs every 5 seconds (offset by 2s to stagger)
  setTimeout(() => {
    setInterval(tickLog, 5000);
  }, 2000);

  // Emit smart advice every 8 seconds
  setTimeout(() => {
    setInterval(tickAdvice, 8000);
  }, 4000);
}
