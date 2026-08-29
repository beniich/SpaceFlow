const router = require('express').Router();
const ctrl = require('../controllers/workorder.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.put('/:id/status', ctrl.updateStatus);

module.exports = router;
