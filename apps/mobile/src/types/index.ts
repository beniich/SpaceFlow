export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'VIEWER';
  tenantId: string;
  twoFactorEnabled: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: keyof typeof import('../utils/constants').STATUS_COLORS;
  priority: keyof typeof import('../utils/constants').PRIORITY_COLORS;
  createdAt: string;
  updatedAt: string;
  assignedTo?: User;
  createdBy: User;
  asset?: Asset;
  attachments?: string[];
  location?: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: 'TO_DO' | 'SCHEDULED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  asset: Asset;
  assignedTo: User[];
  tasks: Task[];
  estimatedDuration: number; // minutes
  dueDate: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: User;
}

export interface Asset {
  id: string;
  name: string;
  qrCode: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN' | 'MAINTENANCE';
  healthScore: number; // 0-100
  location: string;
  type: string;
}

export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  code?: string;
}

export interface QueuedAction {
  id: string;
  type: 'CREATE_TICKET' | 'UPDATE_WO' | 'ADD_COMMENT';
  payload: any;
  createdAt: number;
  retries: number;
}
