const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const prisma = require('../config/database');

router.use(authMiddleware);

// GET /api/floors?buildingId=xxx
router.get('/', async (req, res) => {
  try {
    const { buildingId } = req.query;
    const floors = await prisma.floor.findMany({
      where: buildingId ? { buildingId } : undefined,
      orderBy: { level: 'asc' },
      include: {
        _count: { select: { spaces: true, assets: true } }
      }
    });
    res.json(floors);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/floors/:id
router.get('/:id', async (req, res) => {
  try {
    const floor = await prisma.floor.findUnique({
      where: { id: req.params.id },
      include: {
        building: { select: { id: true, name: true } },
        spaces: true,
        assets: true
      }
    });
    if (!floor) return res.status(404).json({ error: 'Étage non trouvé' });
    res.json(floor);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/floors
router.post('/', async (req, res) => {
  try {
    const floor = await prisma.floor.create({ data: req.body });
    res.status(201).json(floor);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/floors/:id
router.put('/:id', async (req, res) => {
  try {
    const floor = await prisma.floor.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(floor);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/floors/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.floor.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
