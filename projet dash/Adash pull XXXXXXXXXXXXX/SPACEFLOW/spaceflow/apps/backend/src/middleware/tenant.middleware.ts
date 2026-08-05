import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export const tenantMiddleware = async (
  req: any, 
  res: Response, 
  next: NextFunction
) => {
  if (!req.user?.organizationId) {
    return res.status(401).json({ error: 'No organization context' });
  }

  // Vérifier que l'org existe et est active
  const org = await prisma.organization.findUnique({
    where: { id: req.user.organizationId },
    select: { id: true, isActive: true, plan: true, planExpiresAt: true }
  });

  if (!org || !org.isActive) {
    return res.status(403).json({ error: 'Organization inactive' });
  }

  // Vérifier expiration du plan
  if (org.planExpiresAt && new Date() > org.planExpiresAt && org.plan !== 'FREE') {
    // TODO: downgrader vers FREE automatiquement
    logger.warn(`Organization ${org.id} plan expired`);
  }

  req.organization = org;
  next();
};