const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const prisma = require('../config/database');

router.use(authMiddleware);

// GET /api/contracts
router.get('/', async (req, res) => {
  try {
    const { status, type, expiringDays } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (expiringDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + parseInt(expiringDays));
      where.endDate = { lte: cutoff };
      where.status = 'ACTIVE';
    }
    const contracts = await prisma.contract.findMany({
      where,
      orderBy: { endDate: 'asc' }
    });
    res.json(contracts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/contracts/:id
router.get('/:id', async (req, res) => {
  try {
    const contract = await prisma.contract.findUnique({ where: { id: req.params.id } });
    if (!contract) return res.status(404).json({ error: 'Contrat non trouvé' });
    res.json(contract);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/contracts
router.post('/', async (req, res) => {
  try {
    const contract = await prisma.contract.create({ data: req.body });
    res.status(201).json(contract);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/contracts/:id
router.put('/:id', async (req, res) => {
  try {
    const contract = await prisma.contract.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(contract);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/contracts/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.contract.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
