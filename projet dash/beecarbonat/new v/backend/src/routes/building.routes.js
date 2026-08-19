const router = require('express').Router();
const ctrl = require('../controllers/building.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', ctrl.getAll);

module.exports = router;
