const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', ctrl.getNotifications);
router.put('/:id/read', ctrl.markAsRead);
router.put('/all/read', ctrl.markAllAsRead);
router.post('/test', ctrl.sendTest);
router.post('/broadcast', ctrl.broadcast);

module.exports = router;
