const router = require('express').Router();
const ctrl = require('../controllers/ai.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/query', ctrl.queryAI);
router.post('/create-workorder', ctrl.createWorkOrderFromAI);
router.get('/health/:id', ctrl.analyzeAssetHealth);

module.exports = router;
