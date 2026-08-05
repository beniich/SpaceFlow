import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { requireTenant } from '../middleware/tenant.middleware';
import { getKPIs, getRevenueChart, getTopSpaces, getActivityFeed } from '../controllers/stats.controller';

const router = Router();

router.use(authenticate, requireTenant);

router.get('/kpis', asyncHandler(getKPIs));
router.get('/overview', asyncHandler(getKPIs));
router.get('/revenue-chart', asyncHandler(getRevenueChart));
router.get('/revenue', asyncHandler(getRevenueChart));
router.get('/top-spaces', asyncHandler(getTopSpaces));
router.get('/activity', asyncHandler(getActivityFeed));

export default router;
