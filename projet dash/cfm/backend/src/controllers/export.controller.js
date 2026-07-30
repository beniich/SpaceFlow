const prisma = require('../config/database');

/**
 * Export CSV natif — sans dépendance externe
 */

function toCSV(rows, columns) {
  const header = columns.map((c) => `"${c.label}"`).join(',');
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const val = c.accessor(row);
        const str = val === null || val === undefined ? '' : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  return [header, ...lines].join('\n');
}

exports.exportWorkOrders = async (req, res) => {
  try {
    const { status, priority, from, to } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const workOrders = await prisma.workOrder.findMany({
      where,
      include: {
        asset: { select: { name: true, category: true } },
        assignedTo: { select: { firstName: true, lastName: true } },
        createdBy: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const columns = [
      { label: 'ID', accessor: (r) => r.id },
      { label: 'Titre', accessor: (r) => r.title },
      { label: 'Statut', accessor: (r) => r.status },
      { label: 'Priorité', accessor: (r) => r.priority },
      { label: 'Actif', accessor: (r) => r.asset?.name || '' },
      { label: 'Catégorie', accessor: (r) => r.asset?.category || '' },
      { label: 'Assigné à', accessor: (r) => r.assignedTo ? `${r.assignedTo.firstName} ${r.assignedTo.lastName}` : '' },
      { label: 'Créé par', accessor: (r) => `${r.createdBy.firstName} ${r.createdBy.lastName}` },
      { label: 'Coût (€)', accessor: (r) => r.cost || '' },
      { label: 'Date création', accessor: (r) => new Date(r.createdAt).toLocaleDateString('fr-FR') },
      { label: 'Date complétion', accessor: (r) => r.completedAt ? new Date(r.completedAt).toLocaleDateString('fr-FR') : '' }
    ];

    const csv = toCSV(workOrders, columns);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="ordres-travail-${Date.now()}.csv"`);
    res.send('\uFEFF' + csv); // BOM UTF-8 pour Excel
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportAssets = async (req, res) => {
  try {
    const { status, category } = req.query;
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const assets = await prisma.asset.findMany({
      where,
      include: { location: { select: { name: true } } },
      orderBy: { name: 'asc' }
    });

    const columns = [
      { label: 'ID', accessor: (r) => r.id },
      { label: 'Nom', accessor: (r) => r.name },
      { label: 'Catégorie', accessor: (r) => r.category },
      { label: 'Statut', accessor: (r) => r.status },
      { label: 'Emplacement', accessor: (r) => r.location?.name || '' },
      { label: 'N° Série', accessor: (r) => r.serialNumber || '' },
      { label: 'Score santé', accessor: (r) => r.healthScore },
      { label: 'Date achat', accessor: (r) => r.purchaseDate ? new Date(r.purchaseDate).toLocaleDateString('fr-FR') : '' },
      { label: 'Fin garantie', accessor: (r) => r.warrantyEnd ? new Date(r.warrantyEnd).toLocaleDateString('fr-FR') : '' }
    ];

    const csv = toCSV(assets, columns);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="actifs-${Date.now()}.csv"`);
    res.send('\uFEFF' + csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportMaintenanceSchedules = async (req, res) => {
  try {
    const schedules = await prisma.maintenanceSchedule.findMany({
      include: { asset: { select: { name: true, category: true } } },
      orderBy: { nextMaintenance: 'asc' }
    });

    const columns = [
      { label: 'ID', accessor: (r) => r.id },
      { label: 'Nom', accessor: (r) => r.name },
      { label: 'Actif', accessor: (r) => r.asset.name },
      { label: 'Catégorie actif', accessor: (r) => r.asset.category },
      { label: 'Fréquence', accessor: (r) => r.frequency },
      { label: 'Prochaine maintenance', accessor: (r) => new Date(r.nextMaintenance).toLocaleDateString('fr-FR') },
      { label: 'Dernière maintenance', accessor: (r) => r.lastMaintenance ? new Date(r.lastMaintenance).toLocaleDateString('fr-FR') : '' },
      { label: 'Coût estimé (€)', accessor: (r) => r.estimatedCost || '' },
      { label: 'Actif', accessor: (r) => r.isActive ? 'Oui' : 'Non' }
    ];

    const csv = toCSV(schedules, columns);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="maintenances-${Date.now()}.csv"`);
    res.send('\uFEFF' + csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const [totalAssets, totalWO, pendingWO, completedWO, leases, schedules] = await Promise.all([
      prisma.asset.count(),
      prisma.workOrder.count(),
      prisma.workOrder.count({ where: { status: 'PENDING' } }),
      prisma.workOrder.count({ where: { status: 'COMPLETED' } }),
      prisma.lease.count(),
      prisma.maintenanceSchedule.count({ where: { isActive: true } })
    ]);

    res.json({
      summary: {
        totalAssets, totalWO, pendingWO, completedWO, leases, schedules
      },
      generatedAt: new Date().toISOString(),
      exports: [
        { type: 'work-orders', label: 'Ordres de travail', count: totalWO, endpoint: '/api/export/work-orders' },
        { type: 'assets', label: 'Actifs', count: totalAssets, endpoint: '/api/export/assets' },
        { type: 'maintenance', label: 'Plannings maintenance', count: schedules, endpoint: '/api/export/maintenance' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
