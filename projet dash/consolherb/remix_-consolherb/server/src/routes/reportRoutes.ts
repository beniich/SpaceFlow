import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  getAllReports,
  getReportById,
  createReport,
  deleteReport,
} from '../controllers/reportController';

const router = Router();

// ── All report routes require authentication ──────────────────────────────────

/**
 * GET /api/reports
 * List all reports, newest first.
 */
router.get('/', authMiddleware, getAllReports);

/**
 * POST /api/reports
 * Create a new report.
 * Body: { title, type, content }
 */
router.post('/', authMiddleware, createReport);

/**
 * GET /api/reports/:id
 * Get a single report by id.
 */
router.get('/:id', authMiddleware, getReportById);

/**
 * DELETE /api/reports/:id
 * Delete a report (admin only — enforced inside the controller).
 */
router.delete('/:id', authMiddleware, deleteReport);

export default router;
