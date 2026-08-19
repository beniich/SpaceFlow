const router = require('express').Router();
const ctrl = require('../controllers/analytics.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/energy', ctrl.getEnergyData);

module.exports = router;
