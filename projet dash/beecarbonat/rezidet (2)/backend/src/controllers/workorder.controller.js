const prisma = require('../config/database');

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/workorders — Filtres avancés + pagination
// ──────────────────────────────────────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const {
      status, priority, type, assignedToId,
      assetId, buildingId, search,
      from, to,
      page = 1, limit = 50,
      sortBy = 'scheduledAt', sortOrder = 'asc'
    } = req.query;

    const where = {};
    if (status) where.status = { in: status.split(',') };
    if (priority) where.priority = { in: priority.split(',') };
    if (type) where.type = type;
    if (assignedToId) where.assignedToId = assignedToId;
    if (assetId) where.assetId = assetId;
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
    if (from || to) {
      where.scheduledAt = {};
      if (from) where.scheduledAt.gte = new Date(from);
      if (to) where.scheduledAt.lte = new Date(to);
    }
    // Filtre par bâtiment via asset
    if (buildingId) {
      where.asset = { buildingId };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [workOrders, total] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        include: {
          asset: {
            select: {
              id: true, name: true, category: true, location: true,
              buildingId: true,
              building: { select: { name: true } },
              floor: { select: { name: true, level: true } }
            }
          },
          assignedTo: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
          createdBy: { select: { firstName: true, lastName: true } },
          _count: { select: { comments: true, orderParts: true } }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: parseInt(limit)
      }),
      prisma.workOrder.count({ where })
    ]);

    res.json({
      data: workOrders,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/workorders/stats — Dashboard WO
// ──────────────────────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [byStatus, byPriority, byType, overdue] = await Promise.all([
      prisma.workOrder.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.workOrder.groupBy({ by: ['priority'], _count: { id: true } }),
      prisma.workOrder.groupBy({ by: ['type'], _count: { id: true } }),
      prisma.workOrder.count({
        where: {
          status: { in: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] },
          scheduledAt: { lt: new Date() }
        }
      })
    ]);
    res.json({ byStatus, byPriority, byType, overdue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/workorders/:id
// ──────────────────────────────────────────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const wo = await prisma.workOrder.findUnique({
      where: { id: req.params.id },
      include: {
        asset: {
          include: {
            building: { select: { id: true, name: true, address: true } },
            floor: { select: { name: true, level: true } },
            space: { select: { name: true, type: true } },
            sensors: { where: { status: 'active' } }
          }
        },
        assignedTo: true,
        createdBy: { select: { firstName: true, lastName: true } },
        comments: {
          include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'asc' }
        },
        orderParts: { include: { part: true } }
      }
    });
    if (!wo) return res.status(404).json({ error: 'Work Order introuvable' });
    res.json(wo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/workorders — Création (depuis formulaire ou template)
// ──────────────────────────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { templateId, ...body } = req.body;

    let data = { ...body, createdById: req.user.id };

    // Si création depuis un template
    if (templateId) {
      const template = await prisma.wOTemplate.findUnique({ where: { id: templateId } });
      if (template) {
        data = {
          title: template.title,
          description: template.description,
          type: template.type,
          priority: template.priority,
          estimatedCost: template.estimatedCost,
          ...body, // body override
          createdById: req.user.id
        };
      }
    }

    const workOrder = await prisma.workOrder.create({
      data,
      include: {
        asset: { select: { name: true, category: true } },
        assignedTo: { select: { firstName: true, lastName: true } }
      }
    });

    // Notification temps réel
    const io = req.app.get('io');
    if (io && workOrder.assignedToId) {
      io.to(`user-${workOrder.assignedToId}`).emit('wo:assigned', {
        id: workOrder.id,
        title: workOrder.title,
        priority: workOrder.priority
      });
    }

    res.status(201).json(workOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// PUT /api/workorders/:id — Mise à jour générale
// ──────────────────────────────────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: req.body
    });

    if (req.body.status === 'COMPLETED') {
      await prisma.maintenanceLog.create({
        data: {
          description: workOrder.title,
          cost: workOrder.actualCost || 0,
          performedAt: new Date(),
          performedBy: workOrder.assignedToId || req.user.id,
          assetId: workOrder.assetId
        }
      });
      await prisma.asset.update({
        where: { id: workOrder.assetId },
        data: { status: 'OPERATIONAL', lastMaintenance: new Date(), healthScore: 100 }
      });
    }

    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/workorders/:id/close — Clôture terrain (signature + photos + rapport)
// ──────────────────────────────────────────────────────────────────────────────
exports.close = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, signatureDataUrl, photoUrls, laborHours, actualCost } = req.body;

    const closureReport = JSON.stringify({
      notes: notes || '',
      signature: signatureDataUrl || null,
      photos: photoUrls || [],
      closedAt: new Date().toISOString(),
      closedBy: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim()
    });

    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        closureReport,
        closedByTech: req.user.id,
        laborHours: laborHours ? parseFloat(laborHours) : null,
        actualCost: actualCost ? parseFloat(actualCost) : null
      }
    });

    // Log maintenance
    await prisma.maintenanceLog.create({
      data: {
        description: `[CLOTURE] ${workOrder.title} — ${notes || 'Aucune note'}`,
        cost: workOrder.actualCost || 0,
        performedAt: new Date(),
        performedBy: req.user.id,
        assetId: workOrder.assetId
      }
    });

    // Mise à jour santé asset
    await prisma.asset.update({
      where: { id: workOrder.assetId },
      data: { status: 'OPERATIONAL', lastMaintenance: new Date() }
    });

    // Notification temps réel
    const io = req.app.get('io');
    if (io) {
      io.emit('wo:closed', { id: workOrder.id, title: workOrder.title });
    }

    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/workorders/templates — Modèles de WO
// ──────────────────────────────────────────────────────────────────────────────
exports.getTemplates = async (req, res) => {
  try {
    const { type, category } = req.query;
    const templates = await prisma.wOTemplate.findMany({
      where: {
        ...(type && { type }),
        ...(category && { assetCategory: category })
      },
      orderBy: { name: 'asc' }
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/workorders/templates
// ──────────────────────────────────────────────────────────────────────────────
exports.createTemplate = async (req, res) => {
  try {
    const template = await prisma.wOTemplate.create({ data: req.body });
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
