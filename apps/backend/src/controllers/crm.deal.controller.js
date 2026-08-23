const { body, validationResult } = require('express-validator');
const { prisma } = require('../config/database');

const DEAL_STAGES = {
  PIPELINE:    { label: 'Pipeline',     probability: 10,  color: 'slate' },
  QUALIFIED:   { label: 'Qualifie',     probability: 25,  color: 'blue' },
  PROPOSAL:    { label: 'Proposition',  probability: 50,  color: 'yellow' },
  NEGOTIATION: { label: 'Negociation',  probability: 75,  color: 'orange' },
  WON:         { label: 'Gagne',        probability: 100, color: 'green' },
  LOST:        { label: 'Perdu',        probability: 0,   color: 'red' }
};

exports.DEAL_STAGES = DEAL_STAGES;

exports.create = [
  body('name').trim().notEmpty(),
  body('contactId').notEmpty(),
  body('amount').isFloat({ min: 0 }),
  body('expectedCloseDate').isISO8601(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { tags, ...rest } = req.body;
      const stageInfo = DEAL_STAGES[req.body.status] || DEAL_STAGES['PIPELINE'];

      const deal = await prisma.cRMDeal.create({
        data: {
          ...rest,
          tags: tags ? JSON.stringify(tags) : null,
          organizationId: req.crm.organizationId,
          ownerId: req.crm.userId,
          stage: stageInfo.label,
          probability: stageInfo.probability
        },
        include: {
          contact: { select: { firstName: true, lastName: true, company: true } },
          owner: { select: { firstName: true, lastName: true } }
        }
      });

      await prisma.cRMActivityLog.create({
        data: {
          organizationId: req.crm.organizationId,
          userId: req.crm.userId,
          action: 'CREATE',
          entity: 'deal',
          entityId: deal.id
        }
      });

      res.status(201).json(deal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

exports.getPipeline = async (req, res) => {
  try {
    const orgId = req.crm.organizationId;
    const deals = await prisma.cRMDeal.findMany({
      where: {
        organizationId: orgId,
        status: { notIn: ['WON', 'LOST'] }
      },
      include: {
        contact: { select: { firstName: true, lastName: true, company: true } },
        owner: { select: { firstName: true, lastName: true, avatar: true } }
      },
      orderBy: { expectedCloseDate: 'asc' }
    });

    const pipeline = Object.entries(DEAL_STAGES)
      .filter(([s]) => s !== 'WON' && s !== 'LOST')
      .map(([stage, info]) => ({
        stage, label: info.label, color: info.color,
        deals: deals.filter(d => d.status === stage),
        total: deals.filter(d => d.status === stage).reduce((s, d) => s + d.amount, 0)
      }));

    // Stats supplementaires
    const [won, lost] = await Promise.all([
      prisma.cRMDeal.aggregate({
        where: { organizationId: orgId, status: 'WON' },
        _sum: { amount: true }, _count: true
      }),
      prisma.cRMDeal.count({ where: { organizationId: orgId, status: 'LOST' } })
    ]);

    res.json({
      pipeline,
      stages: DEAL_STAGES,
      summary: {
        wonTotal: won._sum.amount || 0,
        wonCount: won._count || 0,
        lostCount: lost,
        pipelineValue: deals.reduce((s, d) => s + d.amount * (d.probability / 100), 0)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { status, page = 1, limit = 25 } = req.query;
    const orgId = req.crm.organizationId;
    const where = { organizationId: orgId };
    if (status) where.status = status;

    const [deals, total] = await Promise.all([
      prisma.cRMDeal.findMany({
        where,
        include: {
          contact: { select: { firstName: true, lastName: true, company: true } },
          owner: { select: { firstName: true, lastName: true } }
        },
        orderBy: { expectedCloseDate: 'asc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.cRMDeal.count({ where })
    ]);

    res.json({
      deals,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStage = async (req, res) => {
  try {
    const { stage } = req.body;
    if (!DEAL_STAGES[stage]) return res.status(400).json({ error: 'Stage invalide' });

    const existing = await prisma.cRMDeal.findFirst({
      where: { id: req.params.id, organizationId: req.crm.organizationId }
    });
    if (!existing) return res.status(404).json({ error: 'Deal introuvable' });

    const stageInfo = DEAL_STAGES[stage];
    const deal = await prisma.cRMDeal.update({
      where: { id: req.params.id },
      data: {
        status: stage,
        stage: stageInfo.label,
        probability: stageInfo.probability,
        closedAt: ['WON', 'LOST'].includes(stage) ? new Date() : null
      }
    });

    if (stage === 'WON') {
      await prisma.cRMContact.update({
        where: { id: deal.contactId },
        data: { type: 'CUSTOMER', lastContactedAt: new Date() }
      });
    }

    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    
    const existing = await prisma.cRMDeal.findFirst({
      where: { id: req.params.id, organizationId: req.crm.organizationId }
    });
    if (!existing) return res.status(404).json({ error: 'Deal introuvable' });

    const deal = await prisma.cRMDeal.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        tags: tags !== undefined ? JSON.stringify(tags) : undefined
      }
    });
    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const existing = await prisma.cRMDeal.findFirst({
      where: { id: req.params.id, organizationId: req.crm.organizationId }
    });
    if (!existing) return res.status(404).json({ error: 'Deal introuvable' });

    await prisma.cRMDeal.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bulkUpdate = async (req, res) => {
  try {
    const { ids, action, data } = req.body;
    const orgId = req.crm.organizationId;

    if (action === 'delete') {
      await prisma.cRMDeal.deleteMany({ where: { id: { in: ids }, organizationId: orgId } });
    } else if (action === 'update_status') {
      const stageInfo = DEAL_STAGES[data.status] || {};
      await prisma.cRMDeal.updateMany({
        where: { id: { in: ids }, organizationId: orgId },
        data: { status: data.status, stage: stageInfo.label, probability: stageInfo.probability }
      });
    } else if (action === 'assign') {
      await prisma.cRMDeal.updateMany({
        where: { id: { in: ids }, organizationId: orgId },
        data: { ownerId: data.ownerId }
      });
    }

    res.json({ updated: ids.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
