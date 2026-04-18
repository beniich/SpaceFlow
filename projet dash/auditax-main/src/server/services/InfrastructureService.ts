import { prisma } from '../../lib/prisma';

export class InfrastructureService {
  /**
   * Fetch all managed infrastructure nodes.
   */
  static async getNodes(organizationId: string) {
    return await prisma.networkNode.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Register a new node (VM, DB, Cluster, etc.)
   */
  static async registerNode(data: {
    organizationId: string;
    name: string;
    region: string;
    type: 'VIRTUAL_MACHINE' | 'DATABASE' | 'KUBERNETES_CLUSTER' | 'API_GATEWAY' | 'FIREWALL';
    ipAddress?: string;
  }) {
    return await prisma.networkNode.create({
      data: {
        ...data,
        status: 'HEALTHY'
      }
    });
  }

  /**
   * Heartbeat / Status update for a node.
   */
  static async updateNodeStatus(nodeId: string, status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'MAINTENANCE') {
    return await prisma.networkNode.update({
      where: { id: nodeId },
      data: {
        status,
        lastSync: new Date()
      }
    });
  }

  /**
   * Get basic topology stats for dashboards.
   */
  static async getStats(organizationId: string) {
    const nodes = await prisma.networkNode.findMany({
      where: { organizationId }
    });

    return {
      total: nodes.length,
      healthy: nodes.filter(n => n.status === 'HEALTHY').length,
      degraded: nodes.filter(n => n.status === 'DEGRADED').length,
      down: nodes.filter(n => n.status === 'DOWN').length
    };
  }
}
