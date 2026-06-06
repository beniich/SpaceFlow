import { create } from 'zustand';
import { AuditNode, TerminalLog } from '../types';

// ─── Toast Notification type ─────────────────────────────────────────────────
export interface ToastNotif {
  id: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

interface AppStore {
  logs: TerminalLog[];
  addLog: (level: TerminalLog['level'], message: string) => void;
  clearLogs: () => void;
  nodes: AuditNode[]
  setNodes: (nodes: AuditNode[]) => void;
  updateNode: (id: string, patch: Partial<AuditNode>) => void;
  // Toast notifications
  toasts: ToastNotif[];
  addToast: (toast: ToastNotif) => void;
  removeToast: (id: string) => void;
}

const initialNodes: AuditNode[] = [
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
    icon: 'shield',
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
    icon: 'database',
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
    icon: 'alert',
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
    icon: 'key',
  },
];

const initialLogs: TerminalLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 4000).toLocaleTimeString(),
    level: 'info',
    message: 'Initialisation du noyau Cyber-Compliance Arch Securitised Kernel...',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 2800).toLocaleTimeString(),
    level: 'success',
    message: 'Signature SOC 2 vérifiée active. Modules de transport chiffrés.',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1200).toLocaleTimeString(),
    level: 'warn',
    message: 'Node-B2 PostgreSQL signale des dérives mineures de synchronisation.',
  },
  {
    id: 'log-4',
    timestamp: new Date().toLocaleTimeString(),
    level: 'error',
    message: "Node-C3 [API Gateway] : Pic d'attaques par déni de service externe identifié (DDoS).",
  },
];

export const useStore = create<AppStore>((set) => ({
  logs: initialLogs,
  addLog: (level, message) =>
    set((s) => ({
      logs: [
        ...s.logs.slice(-99), // keep last 100 logs max
        {
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          level,
          message,
        },
      ],
    })),
  clearLogs: () => set({ logs: [] }),
  nodes: initialNodes,
  setNodes: (nodes) => set({ nodes }),
  updateNode: (id, patch) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })),
  // Toast notifications
  toasts: [],
  addToast: (toast) =>
    set((s) => ({
      // deduplicate & cap at 5 toasts max
      toasts: [toast, ...s.toasts.filter((t) => t.id !== toast.id)].slice(0, 5),
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
