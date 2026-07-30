const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// /kpis est public — bypass auth pour accès direct au dashboard
router.get('/kpis', ctrl.getKPIs);

// /live reste protégé
router.get('/live', authMiddleware, ctrl.getLiveStats);

module.exports = router;
