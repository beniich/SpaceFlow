const { query, validationResult } = require('express-validator');
const prisma = require('../config/database');

exports.create = async (req, res) => {
  try {
    // Vérifier limite plan
    const org = await prisma.organization.findUnique({
      where: { id: req.user.organizationId }
    });
    const count = await prisma.contact.count({
      where: { organizationId: req.user.organizationId }
    });
    
    if (org.plan === 'FREE' && count >= org.maxContacts) {
      return res.status(402).json({ 
        error: `Limite atteinte (${org.maxContacts} contacts). Passez au plan supérieur.` 
      });
    }

    const contact = await prisma.contact.create({
      data: {
        ...req.body,
        organizationId: req.user.organizationId,
        ownerId: req.user.id
      }
    });

    // Log activité
    await prisma.activityLog.create({
      data: {
        organizationId: req.user.organizationId,
        userId: req.user.id,
        action: 'CREATE',
        entity: 'contact',
        entityId: contact.id
      }
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { search, type, status, page = 1, limit = 25 } = req.query;
    const skip = (page - 1) * limit;
    
    const where = { organizationId: req.user.organizationId };
    if (search) {
      where.OR = [
        { firstName: { contains: search } }, // SQLite contains is generally case-insensitive or we use lowercase
        { lastName: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } }
      ];
    }
    if (type) where.type = type;
    if (status) where.status = status;

    const [contacts, total, typeGroups] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          owner: { select: { firstName: true, lastName: true } },
          _count: { select: { deals: true, activities: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.contact.count({ where }),
      prisma.contact.groupBy({
        by: ['type'],
        where: { organizationId: req.user.organizationId },
        _count: { type: true }
      })
    ]);

    const byType = typeGroups.reduce((acc, t) => {
      acc[t.type] = t._count.type;
      return acc;
    }, {});

    res.json({
      contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      stats: { total, byType }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { organizationId: req.user.organizationId },
      include: { owner: { select: { firstName: true, lastName: true } } }
    });

    // Génération manuelle du CSV sans json2csv
    const columns = [
      { label: 'Prénom', accessor: r => r.firstName },
      { label: 'Nom', accessor: r => r.lastName },
      { label: 'Email', accessor: r => r.email || '' },
      { label: 'Téléphone', accessor: r => r.phone || '' },
      { label: 'Entreprise', accessor: r => r.company || '' },
      { label: 'Type', accessor: r => r.type },
      { label: 'Propriétaire', accessor: r => `${r.owner.firstName} ${r.owner.lastName}` }
    ];

    const header = columns.map(c => `"${c.label}"`).join(',');
    const lines = contacts.map(row => 
      columns.map(c => `"${String(c.accessor(row)).replace(/"/g, '""')}"`).join(',')
    );
    const csv = [header, ...lines].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=contacts-${Date.now()}.csv`);
    res.send('\uFEFF' + csv); // BOM
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await prisma.contact.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
