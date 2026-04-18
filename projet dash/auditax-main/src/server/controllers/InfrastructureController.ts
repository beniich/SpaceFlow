import { Request, Response } from 'express';
import { InfrastructureService } from '../services/InfrastructureService';
import { WSManager } from '../lib/ws';

export class InfrastructureController {
  static async list(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const nodes = await InfrastructureService.getNodes(orgId);
      res.json(nodes);
    } catch (error) {
      console.error('InfrastructureController.list error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const node = await InfrastructureService.registerNode({
        organizationId: orgId,
        ...req.body
      });
      res.status(201).json(node);
    } catch (error) {
      console.error('InfrastructureController.register error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const node = await InfrastructureService.updateNodeStatus(req.params.id, req.body.status);
      WSManager.broadcast('NODE_UPDATED', node);
      res.json(node);
    } catch (error) {
       console.error('InfrastructureController.updateStatus error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const stats = await InfrastructureService.getStats(orgId);
      res.json(stats);
    } catch (error) {
       console.error('InfrastructureController.getStats error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
