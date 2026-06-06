import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  getAllSensors,
  getSensorById,
  createSensor,
  getLatestLogs,
  createLog,
} from '../controllers/sensorController';

const router = Router();

// ── All sensor routes require authentication ──────────────────────────────────

/**
 * GET /api/sensors
 * List all sensors with their zone info.
 */
router.get('/', authMiddleware, getAllSensors);

/**
 * POST /api/sensors
 * Create a new sensor.
 * Body: { name, type, zoneId }
 */
router.post('/', authMiddleware, createSensor);

/**
 * GET /api/sensors/:id
 * Get a single sensor with its recent logs.
 */
router.get('/:id', authMiddleware, getSensorById);

/**
 * GET /api/sensors/:id/logs
 * Get the latest 50 log entries for a sensor.
 */
router.get('/:id/logs', authMiddleware, getLatestLogs);

/**
 * POST /api/sensors/:id/logs
 * Append a new log entry for a sensor.
 * Body: { value, unit }
 */
router.post('/:id/logs', authMiddleware, createLog);

export default router;
