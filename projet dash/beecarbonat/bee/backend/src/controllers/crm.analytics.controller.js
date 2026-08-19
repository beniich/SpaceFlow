const prisma = require('../config/database');
const { DEAL_STAGES } = require('./crm.deal.controller');

exports.getKpis = async (req, res) => {
  try {
    const orgId = req.crm.organizationId;
    
    // Valeur du pipeline en cours (non gagné/perdu)
    const pipelineDeals = await prisma.cRMDeal.findMany({
      where: {
        organizationId: orgId,
        status: { notIn: ['WON', 'LOST'] }
      }
    });

    const pipelineTotalValue = pipelineDeals.reduce((sum, deal) => sum + deal.amount, 0);
    // Pipeline pondéré : Somme des (Montant * Probabilité)
    const pipelineWeightedValue = pipelineDeals.reduce((sum, deal) => {
      const prob = deal.probability || 0;
      return sum + (deal.amount * (prob / 100));
    }, 0);

    // CA Gagné
    const wonAggregate = await prisma.cRMDeal.aggregate({
      where: { organizationId: orgId, status: 'WON' },
      _sum: { amount: true },
      _count: true
    });
    const wonTotalValue = wonAggregate._sum.amount || 0;
    const wonCount = wonAggregate._count || 0;

    // Perdu
    const lostCount = await prisma.cRMDeal.count({
      where: { organizationId: orgId, status: 'LOST' }
    });

    // Nouveaux Leads sur les 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newLeads = await prisma.cRMContact.count({
      where: {
        organizationId: orgId,
        type: 'LEAD',
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    // Taux de conversion global
    const closedCount = wonCount + lostCount;
    const conversionRate = closedCount > 0 ? ((wonCount / closedCount) * 100).toFixed(1) : 0;

    res.json({
      pipelineTotalValue,
      pipelineWeightedValue,
      wonTotalValue,
      wonCount,
      lostCount,
      conversionRate: parseFloat(conversionRate),
      newLeads30d: newLeads
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFunnel = async (req, res) => {
  try {
    const orgId = req.crm.organizationId;
    const deals = await prisma.cRMDeal.groupBy({
      by: ['status'],
      where: { organizationId: orgId },
      _count: { id: true },
      _sum: { amount: true }
    });

    const funnel = Object.entries(DEAL_STAGES).map(([stageKey, stageInfo]) => {
      const dealStats = deals.find(d => d.status === stageKey);
      return {
        stage: stageKey,
        label: stageInfo.label,
        count: dealStats?._count.id || 0,
        value: dealStats?._sum.amount || 0,
        color: stageInfo.color
      };
    });

    res.json(funnel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
