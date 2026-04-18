import { prisma } from '../../lib/prisma';

export class IncidentService {
  /**
   * List all incidents for an organization.
   */
  static async getIncidents(organizationId: string) {
    return await prisma.incident.findMany({
      where: { organizationId },
      include: {
        node: true,
        tasks: {
          include: {
            assignee: true
          }
        }
      },
      orderBy: { detectedAt: 'desc' }
    });
  }

  /**
   * Create a new incident and automatically trigger an audit event if needed.
   */
  static async createIncident(data: {
    organizationId: string;
    title: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    nodeId?: string;
  }) {
    return await prisma.incident.create({
      data: {
        organizationId: data.organizationId,
        title: data.title,
        severity: data.severity,
        nodeId: data.nodeId,
        status: 'OPEN'
      }
    });
  }

  /**
   * Add a CAPA (Corrective and Preventive Action) task to an incident.
   */
  static async addTask(incidentId: string, data: {
    title: string;
    description: string;
    assigneeId?: string;
    dueDate?: Date;
  }) {
    return await prisma.cAPATask.create({
      data: {
        incidentId,
        title: data.title,
        description: data.description,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate,
        status: 'TODO'
      }
    });
  }

  /**
   * Update task status (Workflow transition).
   */
  static async updateTaskStatus(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE') {
    return await prisma.cAPATask.update({
      where: { id: taskId },
      data: { status }
    });
  }

  /**
   * Resolve an incident when all tasks are complete or manually closed.
   */
  static async resolveIncident(incidentId: string) {
    return await prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date()
      }
    });
  }
}
