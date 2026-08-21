const { prisma } = require('../config/database');

/**
 * Génère une référence lisible unique ex: TKT-2026-00042
 */
async function generateReference() {
  const year = new Date().getFullYear();
  const count = await prisma.$queryRaw`SELECT nextval('ticket_reference_seq') as seq`;
  const seq = String(count[0].seq).padStart(5, '0');
  return `TKT-${year}-${seq}`;
}

/**
 * Calcule la date d'échéance SLA (en minutes depuis maintenant).
 * Gère uniquement les heures calendaires pour l'instant.
 */
function computeSLADueDate(minutes) {
  if (!minutes) return null;
  return new Date(Date.now() + minutes * 60 * 1000);
}

// Mapping sévérité → durée SLA par défaut (en minutes)
const DEFAULT_SLA = {
  EMERGENCY: { responseTimeMinutes: 30,   resolutionTimeMinutes: 120 },
  CRITICAL:  { responseTimeMinutes: 60,   resolutionTimeMinutes: 480 },
  HIGH:      { responseTimeMinutes: 240,  resolutionTimeMinutes: 1440 },
  MEDIUM:    { responseTimeMinutes: 480,  resolutionTimeMinutes: 2880 },
  LOW:       { responseTimeMinutes: 1440, resolutionTimeMinutes: 10080 },
};

// ============================================================
// GET /api/tickets
// ============================================================
exports.getAll = async (req, res) => {
  try {
    const { status, severity, category, assignedToId, buildingId, page = 1, limit = 50 } = req.query;
    const tenantId = req.tenantId || 'default';

    const where = {
      tenantId,
      deletedAt: null,
      ...(status     && { status }),
      ...(severity   && { severity }),
      ...(category   && { category }),
      ...(assignedToId && { assignedToId }),
      ...(buildingId && { buildingId }),
    };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          building:  { select: { id: true, name: true } },
          assignedTo: { select: { id: true, fullName: true, email: true } },
          submittedBy: { select: { id: true, fullName: true } },
          slaPolicy: true,
          _count: { select: { comments: true, attachments: true, events: true } }
        },
        orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.ticket.count({ where }),
    ]);

    res.json({ data: tickets, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('[Ticket.getAll]', err);
    res.status(500).json({ error: err.message });
  }
};

// ============================================================
// GET /api/tickets/:id
// ============================================================
exports.getOne = async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: {
        building:   { select: { id: true, name: true } },
        assignedTo: { select: { id: true, fullName: true, email: true } },
        submittedBy: { select: { id: true, fullName: true } },
        validatedBy: { select: { id: true, fullName: true } },
        closedBy:   { select: { id: true, fullName: true } },
        slaPolicy:  true,
        events:     { orderBy: { createdAt: 'desc' } },
        comments:   { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        attachments: true,
        qaReviews:  true,
      },
    });

    if (!ticket) return res.status(404).json({ error: 'Ticket introuvable' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================================
// POST /api/tickets
// ============================================================
exports.create = async (req, res) => {
  try {
    const tenantId = req.tenantId || 'default';
    const userId = req.user?.id;

    const {
      title, description, category, subcategory, severity = 'MEDIUM',
      buildingId, floor, zone, locationDetails, geoLocation, assetId,
      submittedByName, submittedByContact, submissionSource = 'WEB', tags = []
    } = req.body;

    const reference = await generateReference();
    const sla = DEFAULT_SLA[severity] || DEFAULT_SLA.MEDIUM;

    const ticket = await prisma.ticket.create({
      data: {
        tenantId,
        reference,
        title,
        description,
        category,
        subcategory,
        severity,
        status: 'SUBMITTED',
        buildingId:          buildingId || null,
        floor,
        zone,
        locationDetails,
        geoLocation:         geoLocation || undefined,
        assetId:             assetId || null,
        submittedById:       userId || null,
        submittedByName,
        submittedByContact,
        submissionSource,
        slaResponseDueAt:    computeSLADueDate(sla.responseTimeMinutes),
        slaResolutionDueAt:  computeSLADueDate(sla.resolutionTimeMinutes),
        tags,
      },
    });

    // Créer l'événement CREATED
    await prisma.ticketEvent.create({
      data: {
        tenantId,
        ticketId: ticket.id,
        type:     'CREATED',
        actorId:  userId || null,
        toStatus: 'SUBMITTED',
        comment: `Ticket créé par ${submittedByName || req.user?.fullName || 'anonyme'}`,
      },
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error('[Ticket.create]', err);
    res.status(400).json({ error: err.message });
  }
};

// ============================================================
// PUT /api/tickets/:id
// ============================================================
exports.update = async (req, res) => {
  try {
    const tenantId = req.tenantId || 'default';
    const userId   = req.user?.id;
    const { id }   = req.params;

    const current = await prisma.ticket.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'Ticket introuvable' });

    const {
      status, severity, assignedToId, closureReason,
      validatedById, title, description, category, ...rest
    } = req.body;

    const updateData = {
      ...(title         && { title }),
      ...(description   && { description }),
      ...(category      && { category }),
      ...(status        && { status }),
      ...(severity      && { severity }),
      ...(assignedToId  && { assignedToId, assignedAt: new Date() }),
      ...(closureReason && { closureReason }),
    };

    // Gestion validateur
    if (status === 'TRIAGED' && userId) {
      updateData.validatedById = userId;
      updateData.validatedAt   = new Date();
    }

    // Gestion clôture
    if ((status === 'CLOSED' || status === 'CANCELLED') && userId) {
      updateData.closedById = userId;
      updateData.closedAt   = new Date();
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data:  updateData,
    });

    // Créer un TicketEvent si le statut change
    if (status && status !== current.status) {
      await prisma.ticketEvent.create({
        data: {
          tenantId,
          ticketId:   id,
          type:       'STATUS_CHANGED',
          actorId:    userId || null,
          fromStatus: current.status,
          toStatus:   status,
        },
      });
    }

    res.json(ticket);
  } catch (err) {
    console.error('[Ticket.update]', err);
    res.status(400).json({ error: err.message });
  }
};

// ============================================================
// POST /api/tickets/:id/qa  — Soumettre un rapport QA
// ============================================================
exports.submitQA = async (req, res) => {
  try {
    const tenantId  = req.tenantId || 'default';
    const userId    = req.user?.id;
    const { id }    = req.params;

    const {
      passed, comments, totalScore, criteriaScores = {}, rejectionReasons = [],
    } = req.body;

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) return res.status(404).json({ error: 'Ticket introuvable' });

    // Créer la revue QA
    const qaReview = await prisma.qAReview.create({
      data: {
        tenantId,
        ticketId:        id,
        reviewerId:      userId || 'anonymous',
        criteriaScores,
        totalScore:      totalScore || (passed ? 5 : 2),
        passed:          Boolean(passed),
        rejectionReasons,
        comments,
      },
    });

    // Mettre à jour le statut du ticket selon le résultat QA
    const newStatus = passed ? 'QAP_PASSED' : 'QAP_REJECTED';
    await prisma.ticket.update({
      where: { id },
      data:  { status: newStatus },
    });

    // Créer l'événement correspondant
    await prisma.ticketEvent.create({
      data: {
        tenantId,
        ticketId:   id,
        type:       passed ? 'QA_APPROVED' : 'QA_REJECTED',
        actorId:    userId || null,
        fromStatus: ticket.status,
        toStatus:   newStatus,
        comment:    comments,
      },
    });

    res.status(201).json({ qaReview, newStatus });
  } catch (err) {
    console.error('[Ticket.submitQA]', err);
    res.status(400).json({ error: err.message });
  }
};

// ============================================================
// POST /api/tickets/:id/comments
// ============================================================
exports.addComment = async (req, res) => {
  try {
    const tenantId = req.tenantId || 'default';
    const userId   = req.user?.id;
    const { id }   = req.params;
    const { content, isInternal = false, visibility = 'ALL' } = req.body;

    const comment = await prisma.ticketComment.create({
      data: {
        tenantId,
        ticketId:   id,
        authorId:   userId || null,
        authorName: req.user?.fullName || 'Anonyme',
        isInternal,
        visibility,
        content,
      },
    });

    await prisma.ticketEvent.create({
      data: {
        tenantId,
        ticketId:   id,
        type:       'COMMENT_ADDED',
        actorId:    userId || null,
        comment:    content.slice(0, 100),
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ============================================================
// GET /api/tickets/stats  — Tableau de bord SLA
// ============================================================
exports.getStats = async (req, res) => {
  try {
    const tenantId = req.tenantId || 'default';
    const where    = { tenantId, deletedAt: null };

    const [total, byStatus, breached, critical] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.groupBy({ by: ['status'],   where, _count: true }),
      prisma.ticket.count({ where: { ...where, slaBreached: true, status: { notIn: ['CLOSED', 'CANCELLED'] } } }),
      prisma.ticket.count({ where: { ...where, severity: { in: ['CRITICAL', 'EMERGENCY'] }, status: { notIn: ['CLOSED', 'CANCELLED'] } } }),
    ]);

    res.json({
      total,
      byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count])),
      slaBreached: breached,
      criticalOpen: critical,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
