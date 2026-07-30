const router = require('express').Router();
const ctrl = require('../controllers/deal.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', ctrl.create);
router.get('/pipeline', ctrl.getPipeline);
router.patch('/:id/stage', ctrl.updateStage);

module.exports = router;
