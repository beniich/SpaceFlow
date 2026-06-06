import { Router } from 'express';
import authRoutes from './authRoutes';
import sensorRoutes from './sensorRoutes';
import reportRoutes from './reportRoutes';
import knowledgeRoutes from './knowledgeRoutes';
import aiRoutes from './aiRoutes';
import financeRoutes from './financeRoutes';
import blockchainRoutes from './blockchainRoutes';

/**
 * Central API router.
 * All sub-routers are mounted here and then attached to /api in index.ts.
 */
const apiRouter = Router();

// ── Sub-routes ────────────────────────────────────────────────────────────────
apiRouter.use('/auth', authRoutes);
apiRouter.use('/sensors', sensorRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/knowledge', knowledgeRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/finance', financeRoutes);
apiRouter.use('/traceability', blockchainRoutes);

export default apiRouter;
