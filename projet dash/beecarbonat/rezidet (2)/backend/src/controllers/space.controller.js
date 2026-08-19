const prisma = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const spaces = await prisma.space.findMany({
      include: {
        building: { select: { name: true } }
      }
    });
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
