import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { tenantMiddleware } from '../middleware/tenant.middleware';
import { authLimiter, registerLimiter } from '../middleware/rate-limit.middleware';
import * as authCtrl from '../controllers/auth.controller';

const router = Router();

// Routes publiques
router.post('/register', registerLimiter, authCtrl.register);
router.post('/login', authLimiter, authCtrl.login);
router.post('/firebase', authLimiter, authCtrl.firebaseLogin);
router.post('/refresh', authCtrl.refresh);
router.post('/forgot-password', authCtrl.forgotPassword);

// Routes protégées
router.get('/me', authMiddleware, tenantMiddleware, authCtrl.getMe);
router.post('/logout', authMiddleware, authCtrl.logout);

export default router;