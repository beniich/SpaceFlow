const router = require('express').Router();
const ctrl = require('../controllers/erp.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/connections', requireRole('ADMIN'), ctrl.getConnections);
router.post('/connections', requireRole('ADMIN'), ctrl.createConnection);
router.post('/connections/:id/test', requireRole('ADMIN', 'MANAGER'), ctrl.testConnection);
router.post('/connections/:id/sync', requireRole('ADMIN', 'MANAGER'), ctrl.syncConnection);
router.get('/logs', requireRole('ADMIN', 'MANAGER'), ctrl.getSyncLogs);

module.exports = router;
