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

// ─── SaaS / Subscription types ────────────────────────────────────────────────

export type SubscriptionPlan = 'free' | 'pro' | 'elite';

export type UserRole = 'owner' | 'admin' | 'manager' | 'viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'invited' | 'inactive';
}

export interface TokenUsage {
  used: number;
  limit: number;
  resetDate: string; // ISO string of next reset (1st of next month)
}

export interface SubscriptionState {
  plan: SubscriptionPlan;
  tokensUsed: number;
  tokensLimit: number;
  apiCallsUsed: number;
  apiCallsLimit: number;
  trialDaysLeft: number;
  renewalDate: string;
  weeklyReportEnabled: boolean;
  reportRecipients: string[];
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  plan: SubscriptionPlan;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'failed';
}
