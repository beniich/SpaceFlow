const router = require('express').Router();
const ctrl = require('../controllers/contact.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', ctrl.create);
router.get('/', ctrl.getAll);
router.get('/export', ctrl.exportCSV);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.deleteContact);

module.exports = router;
