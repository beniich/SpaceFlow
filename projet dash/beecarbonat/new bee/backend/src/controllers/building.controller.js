const prisma = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const data = await prisma.building.findMany();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
