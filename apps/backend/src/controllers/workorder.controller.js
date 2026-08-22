/**
 * @swagger
 * /api/workorders:
 *   get:
 *     tags: [Work Orders]
 *     summary: Liste des ordres de travail
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *     responses:
 *       200:
 *         description: Liste des WO
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkOrder'
 *
 *   post:
 *     tags: [Work Orders]
 *     summary: Créer un ordre de travail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkOrderInput'
 *     responses:
 *       201:
 *         description: WO créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkOrder'
 */
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

exports.create = async (req, res) => {
  try {
    const workOrder = await prisma.workOrder.create({
      data: { ...req.body, createdById: req.user.id }
    });
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const workOrder = await prisma.workOrder.update({
      where: { id: req.params.id },
      data: req.body
    });
    
    // Si complété, créer un log de maintenance
    if (req.body.status === 'COMPLETED' && workOrder.assetId) {
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
          notes: workOrder.title,
          laborHours: workOrder.actualDuration ? workOrder.actualDuration / 60 : null,
          totalCost: workOrder.totalCost || null,
        }
      });
      // Mettre à jour l'actif
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
