const router = require('express').Router();
const ctrl = require('../controllers/tenant.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/stats', ctrl.getStats);
router.get('/users', ctrl.getUsers);
router.put('/users/:userId/role', ctrl.updateUserRole);
router.get('/activity', ctrl.getActivityLog);

module.exports = router;
