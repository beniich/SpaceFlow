const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const prisma = require('../config/database');

// Facteurs d'émission par défaut (ADEME 2024, kg CO2e / unité)
const EMISSION_FACTORS = {
  ELECTRICITY: 0.0571, // kgCO2e/kWh (mix FR 2024)
  GAS: 0.2270,         // kgCO2e/kWh PCI
  WATER: 0.000344,     // kgCO2e/L
  FUEL_OIL: 0.2860,    // kgCO2e/kWh
  STEAM: 0.0750        // kgCO2e/kWh
};

router.use(authMiddleware);

// GET /api/energy/counters
router.get('/counters', async (req, res) => {
  try {
    const { buildingId } = req.query;
    const counters = await prisma.energyCounter.findMany({
      where: buildingId ? { buildingId } : undefined,
      include: {
        building: { select: { id: true, name: true } },
        _count: { select: { readings: true } }
      }
    });
    res.json(counters);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/energy/counters
router.post('/counters', async (req, res) => {
  try {
    const counter = await prisma.energyCounter.create({ data: req.body });
    res.status(201).json(counter);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/energy/readings — Enregistrer une relève + calcul CO2e automatique
router.post('/readings', async (req, res) => {
  try {
    const { counterId, value, periodStart, periodEnd, cost, invoiceRef, scope } = req.body;

    const counter = await prisma.energyCounter.findUnique({ where: { id: counterId } });
    if (!counter) return res.status(404).json({ error: 'Compteur introuvable' });

    const factor = EMISSION_FACTORS[counter.type] ?? null;
    const co2eKg = factor ? value * factor : null;

    const reading = await prisma.energyReading.create({
      data: {
        counterId,
        value: parseFloat(value),
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        cost: cost ? parseFloat(cost) : null,
        invoiceRef: invoiceRef || null,
        scope: scope ? parseInt(scope) : (counter.type === 'ELECTRICITY' ? 2 : 1),
        co2eKg,
        emissionFactor: factor
      }
    });
    res.status(201).json(reading);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/energy/readings?counterId=xxx&from=&to=
router.get('/readings', async (req, res) => {
  try {
    const { counterId, from, to } = req.query;
    const readings = await prisma.energyReading.findMany({
      where: {
        ...(counterId && { counterId }),
        ...(from && { periodStart: { gte: new Date(from) } }),
        ...(to && { periodEnd: { lte: new Date(to) } })
      },
      orderBy: { periodStart: 'asc' },
      include: { counter: { select: { type: true, unit: true, name: true } } }
    });
    res.json(readings);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/energy/summary?buildingId=xxx&year=2024
// Agrégation Scope 1/2/3 pour le dashboard ESG
router.get('/summary', async (req, res) => {
  try {
    const { buildingId, year } = req.query;
    const from = year ? new Date(`${year}-01-01`) : new Date(new Date().getFullYear(), 0, 1);
    const to = year ? new Date(`${year}-12-31`) : new Date();

    // Récupérer tous les compteurs du bâtiment
    const counters = await prisma.energyCounter.findMany({
      where: buildingId ? { buildingId } : undefined,
      select: { id: true }
    });
    const counterIds = counters.map(c => c.id);

    const readings = await prisma.energyReading.findMany({
      where: {
        counterId: { in: counterIds },
        periodStart: { gte: from },
        periodEnd: { lte: to }
      },
      include: { counter: { select: { type: true, unit: true } } }
    });

    // Agréger par type et scope
    const summary = readings.reduce((acc, r) => {
      const type = r.counter.type;
      if (!acc.byType[type]) acc.byType[type] = { energy: 0, cost: 0, co2eKg: 0 };
      acc.byType[type].energy += r.value;
      acc.byType[type].cost += r.cost || 0;
      acc.byType[type].co2eKg += r.co2eKg || 0;

      const scopeKey = `scope${r.scope || 2}`;
      acc.byScope[scopeKey] = (acc.byScope[scopeKey] || 0) + (r.co2eKg || 0);

      acc.totalCO2eKg += r.co2eKg || 0;
      acc.totalCost += r.cost || 0;
      return acc;
    }, { byType: {}, byScope: {}, totalCO2eKg: 0, totalCost: 0 });

    res.json({ period: { from, to }, ...summary, readingsCount: readings.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/energy/seed — Générer de fausses données (POC)
router.post('/seed', async (req, res) => {
  try {
    const { buildingId } = req.body;
    
    // Obtenir ou créer un bâtiment pour le seed
    let building = await prisma.building.findUnique({ where: { id: buildingId || '' } });
    if (!building) {
      building = await prisma.building.findFirst();
    }
    if (!building) return res.status(404).json({ error: 'Aucun bâtiment trouvé' });

    // Créer des compteurs s'ils n'existent pas
    let elecCounter = await prisma.energyCounter.findFirst({ where: { buildingId: building.id, type: 'ELECTRICITY' } });
    if (!elecCounter) {
      elecCounter = await prisma.energyCounter.create({
        data: { buildingId: building.id, type: 'ELECTRICITY', unit: 'kWh', name: 'Compteur Général Elec' }
      });
    }

    let gasCounter = await prisma.energyCounter.findFirst({ where: { buildingId: building.id, type: 'GAS' } });
    if (!gasCounter) {
      gasCounter = await prisma.energyCounter.create({
        data: { buildingId: building.id, type: 'GAS', unit: 'kWh', name: 'Compteur Général Gaz' }
      });
    }

    // Générer 12 mois de données
    const now = new Date();
    const readings = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      // Elec
      const elecVal = 10000 + Math.random() * 5000;
      readings.push({
        counterId: elecCounter.id,
        value: elecVal,
        periodStart: monthStart,
        periodEnd: monthEnd,
        cost: elecVal * 0.15,
        scope: 2,
        co2eKg: elecVal * EMISSION_FACTORS.ELECTRICITY,
        emissionFactor: EMISSION_FACTORS.ELECTRICITY
      });

      // Gas
      const gasVal = 5000 + Math.random() * 3000;
      readings.push({
        counterId: gasCounter.id,
        value: gasVal,
        periodStart: monthStart,
        periodEnd: monthEnd,
        cost: gasVal * 0.08,
        scope: 1,
        co2eKg: gasVal * EMISSION_FACTORS.GAS,
        emissionFactor: EMISSION_FACTORS.GAS
      });
    }

    await prisma.energyReading.createMany({ data: readings });

    res.json({ success: true, message: 'Données générées avec succès' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
