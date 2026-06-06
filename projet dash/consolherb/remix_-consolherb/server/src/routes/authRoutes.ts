import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getProfile, getAllUsers } from '../controllers/authController';

const router = Router();

/**
 * GET /api/auth/me
 * Returns the authenticated user's profile (auto-creates on first call).
 */
router.get('/me', authMiddleware, getProfile);

/**
 * GET /api/auth/users
 * Admin-only: list all users.
 */
router.get('/users', authMiddleware, getAllUsers);

export default router;
