const prisma = require('../config/database');

// ============== ANALYSE DES DÉFAILLANCES (basé sur WorkOrder + Asset existants) ==============
exports.getFailureAnalysis = async (req, res) => {
  try {
    const workOrders = await prisma.workOrder.findMany({
      where: { status: 'COMPLETED' },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
      take: 200
    });

    // Pareto par catégorie d'actif
    const byCategory = {};
    workOrders.forEach((wo) => {
      if (wo.asset) {
        const cat = wo.asset.category;
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      }
    });

    // MTTR — temps moyen de résolution (heures)
    const completedWOs = workOrders.filter((wo) => wo.completedAt);
    const mttr =
      completedWOs.length > 0
        ? completedWOs.reduce((sum, wo) => {
            return (
              sum +
              (new Date(wo.completedAt) - new Date(wo.createdAt)) /
                (1000 * 60 * 60)
            );
          }, 0) / completedWOs.length
        : 0;

    // Actifs les plus défaillants
    const assetFailures = {};
    workOrders.forEach((wo) => {
      if (wo.asset) {
        if (!assetFailures[wo.assetId]) {
          assetFailures[wo.assetId] = {
            id: wo.asset.id,
            name: wo.asset.name,
            category: wo.asset.category,
            healthScore: wo.asset.healthScore,
            count: 0
          };
        }
        assetFailures[wo.assetId].count += 1;
      }
    });

    const topFailureAssets = Object.values(assetFailures)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      byCategory: Object.entries(byCategory)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count),
      mttr: Math.round(mttr * 10) / 10,
      totalFailures: workOrders.length,
      topFailureAssets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============== INVENTAIRE PIÈCES (simulé, basé sur TelemetryData comme proxy) ==============
// En prod, un modèle Part serait ajouté. Ici on simule avec des données statiques enrichies.
const MOCK_PARTS = [
  { id: '1', partNumber: 'FLT-001', name: 'Filtre HVAC G4', category: 'Filtration', unit: 'unit', unitCost: 12.5, quantity: 45, minQuantity: 10, maxQuantity: 100, location: 'Magasin A', supplier: 'AirTech' },
  { id: '2', partNumber: 'CRT-012', name: 'Courroie ventilateur', category: 'Transmission', unit: 'unit', unitCost: 28.0, quantity: 8, minQuantity: 10, maxQuantity: 50, location: 'Magasin A', supplier: 'MecaPro' },
  { id: '3', partNumber: 'LMP-045', name: 'Ampoule LED 40W', category: 'Éclairage', unit: 'unit', unitCost: 6.5, quantity: 0, minQuantity: 20, maxQuantity: 200, location: 'Magasin B', supplier: 'LightCo' },
  { id: '4', partNumber: 'PMP-007', name: 'Joint pompe eau glacée', category: 'Plomberie', unit: 'unit', unitCost: 4.2, quantity: 32, minQuantity: 5, maxQuantity: 50, location: 'Magasin B', supplier: 'AquaFix' },
  { id: '5', partNumber: 'ELC-023', name: 'Disjoncteur 20A', category: 'Électrique', unit: 'unit', unitCost: 18.9, quantity: 7, minQuantity: 10, maxQuantity: 30, location: 'Magasin C', supplier: 'ElecPlus' },
  { id: '6', partNumber: 'LBR-011', name: 'Huile lubrifiante 5L', category: 'Lubrification', unit: 'litre', unitCost: 15.0, quantity: 22, minQuantity: 10, maxQuantity: 50, location: 'Magasin A', supplier: 'LubTech' }
];

const MOCK_MOVEMENTS = [];

exports.getParts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let parts = [...MOCK_PARTS];

    if (search) {
      const q = search.toLowerCase();
      parts = parts.filter(
        (p) => p.name.toLowerCase().includes(q) || p.partNumber.toLowerCase().includes(q)
      );
    }
    if (category) parts = parts.filter((p) => p.category === category);

    const lowStockCount = parts.filter((p) => p.quantity > 0 && p.quantity <= p.minQuantity).length;
    const outOfStock = parts.filter((p) => p.quantity === 0).length;
    const totalValue = parts.reduce((sum, p) => sum + p.quantity * p.unitCost, 0);

    res.json({
      parts,
      stats: { lowStockCount, outOfStock, totalValue, totalParts: parts.length }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPart = async (req, res) => {
  const part = {
    id: String(Date.now()),
    partNumber: req.body.partNumber || `PRT-${Date.now()}`,
    ...req.body,
    quantity: req.body.quantity || 0
  };
  MOCK_PARTS.push(part);
  res.status(201).json(part);
};

exports.updatePart = async (req, res) => {
  const idx = MOCK_PARTS.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Pièce non trouvée' });
  MOCK_PARTS[idx] = { ...MOCK_PARTS[idx], ...req.body };
  res.json(MOCK_PARTS[idx]);
};

exports.recordMovement = async (req, res) => {
  try {
    const { partId, type, quantity, reason, reference } = req.body;
    const part = MOCK_PARTS.find((p) => p.id === partId);
    if (!part) return res.status(404).json({ error: 'Pièce non trouvée' });

    if (type === 'IN') part.quantity += quantity;
    else if (type === 'OUT') {
      if (part.quantity < quantity) return res.status(400).json({ error: 'Stock insuffisant' });
      part.quantity -= quantity;
    } else if (type === 'ADJUSTMENT') {
      part.quantity = quantity;
    }

    const movement = { id: String(Date.now()), type, quantity, reason, reference, partId, createdAt: new Date() };
    MOCK_MOVEMENTS.unshift(movement);
    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMovements = async (req, res) => {
  res.json(MOCK_MOVEMENTS.slice(0, 100));
};

// ============== PROCÉDURES DE MAINTENANCE ==============
const MOCK_PROCEDURES = [
  {
    id: '1',
    title: 'Remplacement filtre HVAC',
    category: 'Préventif',
    estimatedTime: 30,
    steps: [
      { order: 1, action: 'Couper alimentation unité', duration: 2, tools: ['Clé plate'] },
      { order: 2, action: 'Retirer le filtre usagé', duration: 5, tools: ['Gants'] },
      { order: 3, action: 'Nettoyer compartiment', duration: 10, tools: ['Aspirateur', 'Chiffon'] },
      { order: 4, action: 'Insérer nouveau filtre', duration: 5, tools: [] },
      { order: 5, action: 'Vérifier étanchéité', duration: 5, tools: [] },
      { order: 6, action: 'Remettre sous tension et tester', duration: 3, tools: [] }
    ],
    safetyNotes: 'Port de masque obligatoire. Couper alimentation électrique avant intervention.'
  },
  {
    id: '2',
    title: 'Inspection extincteurs',
    category: 'Sécurité',
    estimatedTime: 15,
    steps: [
      { order: 1, action: 'Vérifier pression manomètre', duration: 2, tools: [] },
      { order: 2, action: 'Contrôler état du corps', duration: 3, tools: [] },
      { order: 3, action: 'Vérifier dégoupillage', duration: 2, tools: [] },
      { order: 4, action: 'Apposer étiquette de contrôle', duration: 3, tools: ['Stylo'] }
    ],
    safetyNotes: 'Signaler immédiatement tout extincteur défectueux.'
  }
];

exports.getProcedures = async (req, res) => {
  res.json(MOCK_PROCEDURES);
};

exports.createProcedure = async (req, res) => {
  const proc = { id: String(Date.now()), ...req.body, steps: req.body.steps || [] };
  MOCK_PROCEDURES.push(proc);
  res.status(201).json(proc);
};
