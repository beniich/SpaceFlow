const prisma = require('../config/database');
const twinService = require('../services/twin.service');

exports.getBuildings = async (req, res) => {
  try {
    const buildings = await prisma.location.findMany({
      where: { type: 'BUILDING' },
      include: {
        _count: { select: { assets: true, children: true } }
      }
    });
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBuildingOverview = async (req, res) => {
  try {
    const overview = await twinService.getBuildingOverview(req.params.locationId);
    res.json(overview);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.runSimulation = async (req, res) => {
  try {
    const { scenario, parameters } = req.body;
    if (!scenario) return res.status(400).json({ error: 'Scénario requis' });

    const simulation = await twinService.runSimulation(
      req.params.locationId,
      scenario,
      parameters || {}
    );

    const io = req.app.get('io');
    io.emit('twin:simulation', simulation);

    res.status(201).json(simulation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.captureSnapshot = async (req, res) => {
  try {
    const snapshot = await twinService.captureSnapshot(req.params.locationId);
    res.status(201).json(snapshot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
