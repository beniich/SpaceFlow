const router = require('express').Router();
const ctrl = require('../controllers/crm.contact.controller');
const { crmAuthMiddleware } = require('../middleware/crm.auth.middleware');
const { auditMiddleware } = require('../middleware/audit.middleware');

router.use(crmAuthMiddleware);
router.use(auditMiddleware('CRM_CONTACT'));

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.post('/import', ctrl.importContacts);
router.get('/export', ctrl.exportCSV);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
