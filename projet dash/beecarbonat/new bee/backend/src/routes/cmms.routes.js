const router = require('express').Router();
const ctrl = require('../controllers/cmms.controller');
const woCtrl = require('../controllers/workorder.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Pièces détachées
router.get('/parts', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), ctrl.getParts);
router.post('/parts', requireRole('ADMIN', 'MANAGER'), ctrl.createPart);
router.put('/parts/:id', requireRole('ADMIN', 'MANAGER'), ctrl.updatePart);
router.post('/parts/movement', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), ctrl.recordMovement);
router.get('/movements', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), ctrl.getMovements);

// Procédures
router.get('/procedures', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), ctrl.getProcedures);
router.post('/procedures', requireRole('ADMIN', 'MANAGER'), ctrl.createProcedure);

// Analyse des défaillances
router.get('/failures/analysis', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), ctrl.getFailureAnalysis);

// Work orders / Interventions (alias CMMS)
router.get('/work-orders', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), woCtrl.getAll);
router.post('/work-orders', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), woCtrl.create);
router.put('/work-orders/:id', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), woCtrl.update);
router.patch('/work-orders/:id', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), woCtrl.update);

module.exports = router;

