const router = require('express').Router();
const ctrl = require('../controllers/bim.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const { upload } = require('../config/upload');

router.use(authMiddleware);

router.post('/upload', upload.single('file'), ctrl.uploadModel);
router.get('/building/:buildingId', ctrl.getBuildingModels);
router.get('/model/:id', ctrl.getModelDetails);
router.post('/link', ctrl.linkAsset);

module.exports = router;
