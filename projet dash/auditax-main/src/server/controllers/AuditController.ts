import { Request, Response } from 'express';
import { AuditService } from '../services/AuditService';

export class AuditController {
  static async getTemplates(req: Request, res: Response) {
    try {
      const templates = await AuditService.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error('getTemplates error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getAudits(req: Request, res: Response) {
    try {
      // Temporarily bypass organization to fetch everything or use a mock organization ID
      // Later: extract from req.user
      const orgId = 'global-org-placeholder'; 
      // Actually we have the db state, if we want all, we can just alter AuditService. 
      // But let's use a dummy for now.
      const audits = await AuditService.getAuditsByOrganization(orgId);
      res.json(audits);
    } catch (error) {
      console.error('getAudits error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async verifyAudit(req: Request, res: Response) {
    try {
      const result = await AuditService.verifyAudit(req.params.id);
      res.json(result);
    } catch (error) {
      console.error('verifyAudit error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async addEvent(req: Request, res: Response) {
    try {
      // Any properly typed express app normally places user info in req.auth (Clerk)
      const userId = (req as any).auth?.userId || 'anonymous-auditor';
      const eventObj = await AuditService.createEvent(
        req.params.id, 
        userId, 
        req.body.type, 
        req.body.payload
      );
      res.status(201).json(eventObj);
    } catch (error) {
      console.error('addEvent error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
