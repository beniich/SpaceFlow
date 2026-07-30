const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');

const DEAL_STAGES = {
  PIPELINE: { label: 'Pipeline', probability: 10, color: 'slate' },
  QUALIFIED: { label: 'Qualifié', probability: 25, color: 'blue' },
  PROPOSAL: { label: 'Proposition', probability: 50, color: 'yellow' },
  NEGOTIATION: { label: 'Négociation', probability: 75, color: 'orange' },
  WON: { label: 'Gagné', probability: 100, color: 'green' },
  LOST: { label: 'Perdu', probability: 0, color: 'red' }
};

exports.create = [
  body('name').trim().notEmpty(),
  body('contactId').notEmpty(),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, contactId, amount, expectedCloseDate, status } = req.body;
      
      const deal = await prisma.deal.create({
        data: {
          name,
          contactId,
          amount: parseFloat(amount) || 0,
          expectedCloseDate: new Date(expectedCloseDate || Date.now()),
          status: status || 'PIPELINE',
          organizationId: req.user.organizationId,
          ownerId: req.user.id,
          stage: DEAL_STAGES[status]?.label || 'Pipeline',
          probability: DEAL_STAGES[status]?.probability || 10
        },
        include: { contact: true, owner: { select: { firstName: true, lastName: true } } }
      });

      await prisma.activityLog.create({
        data: {
          organizationId: req.user.organizationId,
          userId: req.user.id,
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
    const deals = await prisma.deal.findMany({
      where: { 
        organizationId: req.user.organizationId,
        status: { notIn: ['WON', 'LOST'] }
      },
      include: {
        contact: { select: { firstName: true, lastName: true, company: true } },
        owner: { select: { firstName: true, lastName: true, avatar: true } }
      },
      orderBy: { expectedCloseDate: 'asc' }
    });

    const pipeline = Object.keys(DEAL_STAGES)
      .filter(s => s !== 'WON' && s !== 'LOST')
      .map(stage => ({
        stage,
        label: DEAL_STAGES[stage].label,
        color: DEAL_STAGES[stage].color,
        deals: deals.filter(d => d.status === stage),
        total: deals.filter(d => d.status === stage).reduce((s, d) => s + d.amount, 0)
      }));

    res.json({ pipeline, stages: DEAL_STAGES });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStage = async (req, res) => {
  try {
    const { status } = req.body;
    const deal = await prisma.deal.update({
      where: { id: req.params.id },
      data: {
        status: status,
        stage: DEAL_STAGES[status]?.label,
        probability: DEAL_STAGES[status]?.probability,
        closedAt: ['WON', 'LOST'].includes(status) ? new Date() : null
      }
    });

    // Transformer le contact en client si WON
    if (status === 'WON') {
      await prisma.contact.update({
        where: { id: deal.contactId },
        data: { type: 'CUSTOMER', lastContactedAt: new Date() }
      });
    }

    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
