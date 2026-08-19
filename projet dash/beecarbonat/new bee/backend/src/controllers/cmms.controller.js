const prisma = require('../config/database');

// ============== GESTION DES PIÈCES DÉTACHÉES ==============
exports.getParts = async (req, res) => {
  try {
    const { search, category, lowStock } = req.query;
    const where = {};
    if (req.user?.tenantId) where.tenantId = req.user.tenantId;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { partNumber: { contains: search } }
      ];
    }
    if (category) where.category = category;

    const parts = await prisma.part.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    let filteredParts = parts;
    if (lowStock === 'true') {
      filteredParts = parts.filter(p => p.quantity <= p.minQuantity);
    }

    const lowStockCount = parts.filter(p => p.quantity <= p.minQuantity).length;
    const outOfStock = parts.filter(p => p.quantity === 0).length;
    const totalValue = parts.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);

    res.json({
      parts: filteredParts,
      stats: { lowStockCount, outOfStock, totalValue, totalParts: parts.length }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPart = async (req, res) => {
  try {
    const part = await prisma.part.create({
      data: { ...req.body, tenantId: req.user?.tenantId || null }
    });
    res.status(201).json(part);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePart = async (req, res) => {
  try {
    const part = await prisma.part.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(part);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.recordMovement = async (req, res) => {
  try {
    const { partId, type, quantity, reason, reference } = req.body;

    const movement = await prisma.$transaction(async (tx) => {
      const part = await tx.part.findUnique({ where: { id: partId } });
      if (!part) throw new Error('Pièce non trouvée');

      let newQuantity = part.quantity;
      if (type === 'IN') newQuantity += quantity;
      else if (type === 'OUT') {
        if (part.quantity < quantity) throw new Error('Stock insuffisant');
        newQuantity -= quantity;
      } else if (type === 'ADJUSTMENT') newQuantity = quantity;

      await tx.part.update({
        where: { id: partId },
        data: { quantity: newQuantity }
      });

      return tx.inventoryMovement.create({
        data: {
          type,
          quantity,
          reason: reason || 'Mouvement stock',
          reference,
          partId,
          userId: req.user?.id || 'mock-123'
        }
      });
    });

    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMovements = async (req, res) => {
  try {
    const where = {};
    if (req.user?.tenantId) {
      where.part = { tenantId: req.user.tenantId };
    }
    const movements = await prisma.inventoryMovement.findMany({
      where,
      include: {
        part: true,
        user: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============== PROCÉDURES DE MAINTENANCE ==============
exports.getProcedures = async (req, res) => {
  try {
    const where = {};
    if (req.user?.tenantId) where.tenantId = req.user.tenantId;

    const procedures = await prisma.procedure.findMany({
      where,
      include: { asset: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(procedures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProcedure = async (req, res) => {
  try {
    const { steps, ...rest } = req.body;
    const procedure = await prisma.procedure.create({
      data: {
        ...rest,
        steps: typeof steps === 'object' ? JSON.stringify(steps) : (steps || '[]'),
        tenantId: req.user?.tenantId || null
      }
    });
    res.status(201).json(procedure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ============== CODES DE DÉFAILLANCE (PARETO) ==============
exports.getFailureAnalysis = async (req, res) => {
  try {
    const whereWO = { type: 'CORRECTIVE' };
    if (req.user?.tenantId) {
      whereWO.asset = { tenantId: req.user.tenantId };
    }

    const workOrders = await prisma.workOrder.findMany({
      where: whereWO,
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
      take: 200
    });

    const byCategory = {};
    workOrders.forEach(wo => {
      const cat = wo.asset?.category || 'Général';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    const completedWOs = workOrders.filter(wo => wo.completedAt);
    const mttr = completedWOs.length > 0
      ? completedWOs.reduce((sum, wo) => {
          return sum + (new Date(wo.completedAt) - new Date(wo.createdAt)) / (1000 * 60 * 60);
        }, 0) / completedWOs.length
      : 2.5;

    const topFailureAssets = await prisma.asset.findMany({
      where: req.user?.tenantId ? { tenantId: req.user.tenantId } : {},
      include: {
        _count: {
          select: { workOrders: true }
        }
      },
      orderBy: { healthScore: 'asc' },
      take: 10
    });

    res.json({
      byCategory: Object.entries(byCategory).map(([category, count]) => ({ category, count })),
      mttr: Math.round(mttr * 10) / 10,
      totalFailures: workOrders.length,
      topFailureAssets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
