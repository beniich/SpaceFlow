const router = require('express').Router();
const ctrl = require('../controllers/crm.analytics.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/kpis', ctrl.getKpis);
router.get('/funnel', ctrl.getFunnel);

module.exports = router;
