const { prisma } = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { status, priority, assignedToId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedToId) where.assigneeId = assignedToId;

    const workOrders = await prisma.workOrder.findMany({
      where,
      include: {
        asset: { select: { name: true, type: true, zone: true, floor: true } },
        assignee: { select: { fullName: true, email: true } },
        createdBy: { select: { fullName: true } }
      },
      orderBy: [{ priority: 'desc' }, { scheduledAt: 'asc' }]
    });
    res.json(workOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: req.params.id },
      include: {
        asset: true,
        assignee: true,
        createdBy: true,
        tickets: true
      }
    });
    if (!workOrder) return res.status(404).json({ error: 'Ordre de travail non trouvé' });
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const initialAuditLog = [{
      timestamp: new Date().toISOString(),
      user: req.user?.fullName || 'Système',
      action: 'CRÉATION',
      details: 'Création de l\'ordre de travail'
    }];
    
    const data = { 
      ...req.body, 
      createdById: req.user.id,
      auditLog: initialAuditLog
    };
    
    const workOrder = await prisma.workOrder.create({ data });
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existingWO = await prisma.workOrder.findUnique({ where: { id: req.params.id } });
    if (!existingWO) return res.status(404).json({ error: 'WO non trouvé' });

    let auditLog = existingWO.auditLog ? (typeof existingWO.auditLog === 'string' ? JSON.parse(existingWO.auditLog) : existingWO.auditLog) : [];
    auditLog.push({
      timestamp: new Date().toISOString(),
      user: req.user?.fullName || 'Système',
      action: 'MISE_A_JOUR',
      details: 'Mise à jour des informations générales'
    });

    const data = { ...req.body, auditLog };

    const workOrder = await prisma.workOrder.update({
      where: { id: req.params.id },
      data
    });
    
    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, rootCause, resolutionNotes, actualDuration, completedBy } = req.body;
    
    const existingWO = await prisma.workOrder.findUnique({ where: { id: req.params.id } });
    if (!existingWO) return res.status(404).json({ error: 'WO non trouvé' });

    let auditLog = existingWO.auditLog ? (typeof existingWO.auditLog === 'string' ? JSON.parse(existingWO.auditLog) : existingWO.auditLog) : [];
    auditLog.push({
      timestamp: new Date().toISOString(),
      user: req.user?.fullName || 'Système',
      action: 'CHANGEMENT_STATUT',
      details: `Statut passé de ${existingWO.status} à ${status}`
    });

    const data = { 
      status, 
      auditLog,
      ...(rootCause && { rootCause }),
      ...(resolutionNotes && { resolutionNotes }),
      ...(actualDuration && { actualDuration })
    };

    if (status === 'COMPLETED') {
      data.completedAt = new Date();
      data.completedBy = completedBy || req.user?.id;
    }

    const workOrder = await prisma.workOrder.update({
      where: { id: req.params.id },
      data
    });

    if (status === 'COMPLETED' && workOrder.assetId) {
      await prisma.maintenanceLog.create({
        data: {
          tenantId: workOrder.tenantId,
          assetId: workOrder.assetId,
          workOrderId: workOrder.id,
          type: workOrder.type || 'CORRECTIVE',
          performedAt: new Date(),
          completedAt: new Date(),
          technicianId: workOrder.assigneeId || req.user?.id || 'system',
          technicianName: req.user?.fullName || 'Système',
          notes: resolutionNotes || workOrder.title,
          laborHours: actualDuration ? actualDuration / 60 : null,
          totalCost: workOrder.totalCost || null,
        }
      });
      await prisma.asset.update({
        where: { id: workOrder.assetId },
        data: {
          status: 'OPERATIONAL',
          lastMaintenanceAt: new Date(),
          healthScore: 100
        }
      });
    }

    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
