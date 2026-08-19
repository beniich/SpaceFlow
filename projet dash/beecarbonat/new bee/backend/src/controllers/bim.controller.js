const prisma = require('../config/database');
const bimService = require('../integrations/bim/bim.service');

exports.uploadModel = async (req, res) => {
  try {
    const { buildingId } = req.body;
    if (!buildingId) return res.status(400).json({ error: 'buildingId requis' });

    const tenantId = req.user?.tenantId || null;
    const fileName = req.file?.originalname || 'maquette_horizon.ifc';
    const buffer = req.file?.buffer || Buffer.from('mock-ifc-content');

    const model = await bimService.importIFCModel(buildingId, tenantId, buffer, fileName);
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBuildingModels = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const models = await bimService.getModelsByBuilding(buildingId);
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getModelDetails = async (req, res) => {
  try {
    const model = await bimService.getModelDetails(req.params.id);
    if (!model) return res.status(404).json({ error: 'Modèle non trouvé' });
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.linkAsset = async (req, res) => {
  try {
    const { elementId, assetId } = req.body;
    if (!elementId || !assetId) {
      return res.status(400).json({ error: 'elementId et assetId requis' });
    }
    const element = await bimService.linkElementToAsset(elementId, assetId);
    res.json(element);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
