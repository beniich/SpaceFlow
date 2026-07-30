const prisma = require('../config/database');

/**
 * Module multi-tenant simplifié
 * Isolation par rôle utilisateur (pas de tenantId en BDD)
 * En prod: ajouter tenantId à User + autres modèles via migration Prisma
 */

exports.getStats = async (req, res) => {
  try {
    const [users, assets, workOrders, leases, schedules] = await Promise.all([
      prisma.user.count(),
      prisma.asset.count(),
      prisma.workOrder.count(),
      prisma.lease.count(),
      prisma.maintenanceSchedule.count()
    ]);

    const [pendingWO, criticalWO, completedWO] = await Promise.all([
      prisma.workOrder.count({ where: { status: 'PENDING' } }),
      prisma.workOrder.count({ where: { priority: 'CRITICAL', status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
      prisma.workOrder.count({ where: { status: 'COMPLETED' } })
    ]);

    res.json({
      tenant: {
        id: 'default',
        name: 'Organisation principale',
        plan: 'ENTERPRISE',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      },
      stats: {
        users,
        assets,
        workOrders,
        pendingWO,
        criticalWO,
        completedWO,
        leases,
        schedules
      },
      limits: {
        maxUsers: 50,
        maxAssets: 10000,
        maxBuildings: 100,
        currentUsers: users,
        currentAssets: assets
      },
      features: [
        { name: 'CMMS / GMAO', enabled: true },
        { name: 'Jumeau numérique', enabled: true },
        { name: 'Notifications temps réel', enabled: true },
        { name: 'Export CSV/PDF', enabled: true },
        { name: 'IoT / Capteurs', enabled: true },
        { name: 'Analytiques avancées', enabled: true },
        { name: 'Multi-site', enabled: true },
        { name: 'API externe', enabled: true }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            workOrders: true,
            createdWorkOrders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès refusé — ADMIN requis' });
    }
    const { role } = req.body;
    const allowed = ['ADMIN', 'MANAGER', 'TECH', 'USER'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ error: `Rôle invalide. Valeurs acceptées : ${allowed.join(', ')}` });
    }

    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getActivityLog = async (req, res) => {
  try {
    // Activité simulée basée sur les WorkOrders
    const recentWO = await prisma.workOrder.findMany({
      take: 20,
      orderBy: { updatedAt: 'desc' },
      include: {
        createdBy: { select: { firstName: true, lastName: true } },
        asset: { select: { name: true } }
      }
    });

    const activity = recentWO.map((wo) => ({
      id: wo.id,
      action: wo.status === 'COMPLETED' ? 'WORK_ORDER_COMPLETED' : wo.status === 'IN_PROGRESS' ? 'WORK_ORDER_STARTED' : 'WORK_ORDER_CREATED',
      description: `"${wo.title}" — ${wo.asset?.name || 'Sans actif'}`,
      user: `${wo.createdBy.firstName} ${wo.createdBy.lastName}`,
      timestamp: wo.updatedAt
    }));

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
