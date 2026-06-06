export type NodeStatus = 'optimal' | 'updating' | 'critical' | 'secure' | 'locked';

export interface AuditNode {
  id: string;
  name: string;
  type: string;
  status: NodeStatus;
  percentage: number; // For circular gauge (e.g. Uptime, Health, Integrity)
  percentageLabel: string;
  progress: number; // For progress bar (e.g. Audit progression, patch level)
  progressLabel: string;
  active: boolean;
  icon: string; // Lucide icon name or emoji
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export interface CyberMetric {
  timestamp: string;
  healthy: number;
  spikes: number;
}
