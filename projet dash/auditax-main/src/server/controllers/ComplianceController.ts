import { Request, Response } from 'express';
import { ComplianceService } from '../services/ComplianceService';

export class ComplianceController {
  static async listPolicies(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const policies = await ComplianceService.getPolicies(orgId);
      res.json(policies);
    } catch (error) {
      console.error('ComplianceController.listPolicies error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async createPolicy(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const policy = await ComplianceService.createPolicy({
        organizationId: orgId,
        ...req.body
      });
      res.status(201).json(policy);
    } catch (error) {
      console.error('ComplianceController.createPolicy error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async addControl(req: Request, res: Response) {
    try {
      const control = await ComplianceService.addControl(req.params.id, req.body);
      res.status(201).json(control);
    } catch (error) {
       console.error('ComplianceController.addControl error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateControlStatus(req: Request, res: Response) {
    try {
      const control = await ComplianceService.updateControlStatus(req.params.controlId, req.body.status);
      res.json(control);
    } catch (error) {
       console.error('ComplianceController.updateControlStatus error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
