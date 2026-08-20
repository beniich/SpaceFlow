#!/bin/bash
cat << 'AUTH' > backend/src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, role: role || 'VIEWER' },
      select: { id: true, email: true, firstName: true, lastName: true, role: true }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Identifiants invalides' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id, email: user.email, firstName: user.firstName,
        lastName: user.lastName, role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, department: true, avatar: true, createdAt: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
AUTH

cat << 'ASSET' > backend/src/controllers/asset.controller.js
const prisma = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { search, status, category, buildingId } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status) where.status = status;
    if (category) where.category = category;
    if (buildingId) where.buildingId = buildingId;

    const assets = await prisma.asset.findMany({
      where,
      include: {
        building: { select: { name: true } },
        manager: { select: { firstName: true, lastName: true } },
        sensors: true,
        _count: { select: { workOrders: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
      include: {
        building: true,
        manager: { select: { firstName: true, lastName: true, email: true } },
        sensors: { include: { readings: { orderBy: { timestamp: 'desc' }, take: 50 } } },
        workOrders: { orderBy: { createdAt: 'desc' }, take: 10 },
        maintenanceLogs: { orderBy: { performedAt: 'desc' }, take: 20 }
      }
    });
    if (!asset) return res.status(404).json({ error: 'Actif non trouvé' });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const asset = await prisma.asset.create({
      data: req.body
    });
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const asset = await prisma.asset.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(asset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await prisma.asset.delete({ where: { id: req.params.id } });
    res.json({ message: 'Actif supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [total, operational, maintenance, breakdown, byCategory] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'OPERATIONAL' } }),
      prisma.asset.count({ where: { status: 'MAINTENANCE' } }),
      prisma.asset.count({ where: { status: 'BREAKDOWN' } }),
      prisma.asset.groupBy({
        by: ['category'],
        _count: { category: true },
        _avg: { healthScore: true, purchasePrice: true }
      })
    ]);
    res.json({
      total,
      operational,
      maintenance,
      breakdown,
      byCategory,
      averageHealth: await prisma.asset.aggregate({ _avg: { healthScore: true } })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
ASSET

cat << 'WO' > backend/src/controllers/workorder.controller.js
const prisma = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { status, priority, assignedToId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedToId) where.assignedToId = assignedToId;

    const workOrders = await prisma.workOrder.findMany({
      where,
      include: {
        asset: { select: { name: true, category: true, location: true } },
        assignedTo: { select: { firstName: true, lastName: true, email: true } },
        createdBy: { select: { firstName: true, lastName: true } }
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
    if (req.body.status === 'COMPLETED') {
      await prisma.maintenanceLog.create({
        data: {
          description: workOrder.title,
          cost: workOrder.actualCost || 0,
          performedAt: new Date(),
          performedBy: workOrder.assignedToId || 'unknown',
          assetId: workOrder.assetId
        }
      });
      // Mettre à jour l'actif
      await prisma.asset.update({
        where: { id: workOrder.assetId },
        data: {
          status: 'OPERATIONAL',
          lastMaintenance: new Date(),
          healthScore: 100
        }
      });
    }
    
    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
WO

cat << 'DASH' > backend/src/controllers/dashboard.controller.js
const prisma = require('../config/database');

exports.getKPIs = async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const [
      totalAssets,
      operationalAssets,
      pendingWorkOrders,
      criticalWorkOrders,
      activeLeases,
      totalSpaces,
      occupiedSpaces,
      totalMaintenanceCost,
      recentWorkOrders,
      upcomingMaintenance
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'OPERATIONAL' } }),
      prisma.workOrder.count({ where: { status: 'PENDING' } }),
      prisma.workOrder.count({ where: { priority: 'CRITICAL', status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
      prisma.lease.count({ where: { status: 'active' } }),
      prisma.space.count(),
      prisma.space.count({ where: { status: 'occupied' } }),
      prisma.maintenanceLog.aggregate({ _sum: { cost: true } }),
      prisma.workOrder.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { asset: { select: { name: true } } }
      }),
      prisma.asset.findMany({
        where: { nextMaintenance: { lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) } },
        take: 5,
        orderBy: { nextMaintenance: 'asc' },
        select: { id: true, name: true, nextMaintenance: true, healthScore: true }
      })
    ]);

    // Calcul du taux d'occupation
    const occupancyRate = totalSpaces > 0 ? (occupiedSpaces / totalSpaces) * 100 : 0;
    
    // Coût mensuel moyen
    const monthlyMaintenanceCost = await prisma.maintenanceLog.aggregate({
      where: { performedAt: { gte: lastMonth } },
      _sum: { cost: true }
    });

    // Tendance des work orders (7 derniers jours)
    const woTrend = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const count = await prisma.workOrder.count({
        where: { createdAt: { gte: day, lt: nextDay } }
      });
      woTrend.push({ date: day.toISOString().split('T')[0], count });
    }

    res.json({
      kpis: {
        totalAssets,
        operationalAssets,
        assetAvailability: totalAssets > 0 ? (operationalAssets / totalAssets) * 100 : 0,
        pendingWorkOrders,
        criticalWorkOrders,
        activeLeases,
        occupancyRate: Math.round(occupancyRate * 10) / 10,
        totalMaintenanceCost: totalMaintenanceCost._sum.cost || 0,
        monthlyMaintenanceCost: monthlyMaintenanceCost._sum.cost || 0
      },
      recentWorkOrders,
      upcomingMaintenance,
      woTrend
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
DASH

