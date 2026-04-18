import { prisma } from '../../lib/prisma';

export class ComplianceService {
  /**
   * List all policies (ISO-27001, SOC2, etc.) for an organization.
   */
  static async getPolicies(organizationId: string) {
    return await prisma.policy.findMany({
      where: { organizationId },
      include: {
        controls: true
      }
    });
  }

  /**
   * Create a new compliance policy.
   */
  static async createPolicy(data: {
    organizationId: string;
    title: string;
    framework: string;
    content: string;
  }) {
    return await prisma.policy.create({
      data: {
        ...data,
        active: true
      }
    });
  }

  /**
   * Add a specific control to a policy.
   */
  static async addControl(policyId: string, data: {
    name: string;
    description: string;
    frequency: string;
  }) {
    return await prisma.control.create({
      data: {
        policyId,
        ...data,
        status: 'NOT_TESTED'
      }
    });
  }

  /**
   * Update control status (e.g., after an audit confirms compliance).
   */
  static async updateControlStatus(controlId: string, status: 'COMPLIANT' | 'NON_COMPLIANT' | 'NOT_TESTED') {
    return await prisma.control.update({
      where: { id: controlId },
      data: { status }
    });
  }

  /**
   * Record a regional risk assessment.
   */
  static async recordRiskAssessment(data: {
    jurisdiction: string;
    riskScore: number;
    category: string;
    details: string;
  }) {
    return await prisma.riskAssessment.create({
      data
    });
  }
}
