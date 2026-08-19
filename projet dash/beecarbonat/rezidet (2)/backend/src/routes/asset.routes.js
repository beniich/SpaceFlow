const router = require('express').Router();
const ctrl = require('../controllers/asset.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Routes spécifiques AVANT les routes paramétrées (:id) pour éviter les conflits
router.get('/stats', ctrl.getStats);
router.get('/by-ifc-guid/:guid', ctrl.getByIfcGuid);
router.get('/hierarchy/:buildingId', ctrl.getHierarchy);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
