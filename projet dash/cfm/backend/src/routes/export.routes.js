const router = require('express').Router();
const ctrl = require('../controllers/export.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/summary', ctrl.getDashboardSummary);
router.get('/work-orders', ctrl.exportWorkOrders);
router.get('/assets', ctrl.exportAssets);
router.get('/maintenance', ctrl.exportMaintenanceSchedules);

module.exports = router;
