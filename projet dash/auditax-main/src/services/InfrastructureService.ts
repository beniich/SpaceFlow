import { api } from '../lib/api';

export interface NetworkNode {
  id: string;
  name: string;
  region: string;
  type: 'VIRTUAL_MACHINE' | 'DATABASE' | 'KUBERNETES_CLUSTER' | 'API_GATEWAY' | 'FIREWALL';
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'MAINTENANCE';
  ipAddress?: string;
  lastSync?: string;
}

export interface NodeStats {
  total: number;
  healthy: number;
  degraded: number;
  down: number;
}

export const InfrastructureService = {
  getNodes: () => api.get<NetworkNode[]>('/infrastructure/nodes'),
  getStats: () => api.get<NodeStats>('/infrastructure/stats'),
  registerNode: (data: Partial<NetworkNode>) => api.post<NetworkNode>('/infrastructure/nodes', data),
  updateNodeStatus: (nodeId: string, status: string) => api.patch<NetworkNode>(`/infrastructure/nodes/${nodeId}`, { status }),
};
