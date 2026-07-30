const router = require('express').Router();
const ctrl = require('../controllers/cmms.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/parts', ctrl.getParts);
router.post('/parts', ctrl.createPart);
router.put('/parts/:id', ctrl.updatePart);
router.post('/parts/movement', ctrl.recordMovement);
router.get('/movements', ctrl.getMovements);
router.get('/procedures', ctrl.getProcedures);
router.post('/procedures', ctrl.createProcedure);
router.get('/failures/analysis', ctrl.getFailureAnalysis);

module.exports = router;
