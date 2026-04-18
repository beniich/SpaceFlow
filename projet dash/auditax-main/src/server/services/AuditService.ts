import { prisma } from '../../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { computeEventHash, verifyEventChain } from '../../lib/cryptoIntegrity';
import { projectAudit } from '../../lib/auditProjection';

export class AuditService {
  /**
   * Retrieves all available audit templates from the database.
   */
  static async getTemplates() {
    const templates = await prisma.auditTemplate.findMany();
    return templates.map(t => ({
      ...t,
      sections: t.content
    }));
  }

  /**
   * Constructs all audits by organization via event sourcing projection.
   */
  static async getAuditsByOrganization(organizationId: string) {
    const dbEvents = await prisma.auditEvent.findMany({
      where: { audit: { organizationId } },
      orderBy: { timestamp: 'asc' }
    });
    
    const auditsRaw = dbEvents.reduce((acc: any, ev: any) => {
      if (!acc[ev.auditId]) acc[ev.auditId] = [];
      acc[ev.auditId].push({ ...ev, payload: ev.payload });
      return acc;
    }, {});

    return Object.values(auditsRaw)
      .map((events: any) => projectAudit(events))
      .filter(a => a !== null);
  }

  /**
   * Start a new audit
   */
  static async startAudit(templateId: string, organizationId: string, userId: string) {
    const auditId = uuidv4();
    
    // First create the audit record
    await prisma.audit.create({
      data: {
        id: auditId,
        templateId,
        organizationId,
        status: 'IN_PROGRESS'
      }
    });

    // Then trigger START event
    await this.createEvent(auditId, userId, 'AUDIT_STARTED', { templateId });
    return auditId;
  }

  /**
   * Append a new event to the audit event sourcing ledger.
   * Calculates the cryptographically secure hash to prevent tampering.
   */
  static async createEvent(auditId: string, userId: string, type: string, payload: any) {
    const previousEvent = await prisma.auditEvent.findFirst({
      where: { auditId },
      orderBy: { timestamp: 'desc' },
      select: { sha256Hash: true }
    });
    
    const previousHash = previousEvent ? previousEvent.sha256Hash : '0'.repeat(64);
    
    const eventObj = {
      id: uuidv4(),
      auditId,
      timestamp: new Date().toISOString(),
      userId,
      type,
      payload
    };

    const hash = computeEventHash(eventObj as any, previousHash);
    
    return await prisma.auditEvent.create({
      data: {
        id: eventObj.id,
        auditId: eventObj.auditId,
        type: eventObj.type,
        timestamp: new Date(eventObj.timestamp),
        userId: eventObj.userId,
        payload: eventObj.payload as any,
        sha256Hash: hash,
        previousHash
      }
    });
  }

  /**
   * Validate the cryptographic integrity of an audit block by block.
   */
  static async verifyAudit(auditId: string) {
    const dbEvents = await prisma.auditEvent.findMany({
      where: { auditId },
      orderBy: { timestamp: 'asc' }
    });
    const events = dbEvents.map((e: any) => ({
      ...e,
      sha256_hash: e.sha256Hash
    }));
    
    const result = verifyEventChain(events as any);
    return {
      auditId,
      eventCount: events.length,
      valid: result.valid,
      compromisedAt: result.compromisedAt,
      verifiedAt: new Date().toISOString()
    };
  }
}
