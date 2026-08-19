const prisma = require('../config/database');

exports.getEnergyData = async (req, res) => {
  try {
    const data = await prisma.energyConsumption.findMany();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
