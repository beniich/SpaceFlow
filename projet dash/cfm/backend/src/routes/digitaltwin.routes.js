const router = require('express').Router();
const ctrl = require('../controllers/digitaltwin.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/buildings', ctrl.getBuildings);
router.get('/overview/:locationId', ctrl.getBuildingOverview);
router.post('/simulate/:locationId', ctrl.runSimulation);
router.post('/snapshot/:locationId', ctrl.captureSnapshot);

module.exports = router;
