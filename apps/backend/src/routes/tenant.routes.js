const router = require('express').Router();
const ctrl = require('../controllers/tenant.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', ctrl.getTenants);
router.get('/:id', ctrl.getTenantById);
router.post('/', requireRole('ADMIN'), ctrl.createTenant);
router.put('/:id', requireRole('ADMIN'), ctrl.updateTenant);
router.post('/:id/config', requireRole('ADMIN'), ctrl.setConfig);
router.post('/:id/domains', requireRole('ADMIN'), ctrl.addDomain);

module.exports = router;
