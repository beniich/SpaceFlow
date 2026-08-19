const router = require('express').Router();
const ctrl = require('../controllers/crm.analytics.controller');
const { requireCrmAuth } = require('../middleware/auth.middleware');

router.use(requireCrmAuth);

router.get('/kpis', ctrl.getKpis);
router.get('/funnel', ctrl.getFunnel);

module.exports = router;
