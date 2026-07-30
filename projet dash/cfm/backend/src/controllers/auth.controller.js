const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');

exports.register = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('8 caractères minimum'),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('companyName').trim().notEmpty(),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, firstName, lastName, companyName } = req.body;
      
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }

      // Création transactionnelle : Organization + User
      const result = await prisma.$transaction(async (tx) => {
        const slug = companyName.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        const organization = await tx.organization.create({
          data: {
            name: companyName,
            slug: `${slug}-${Date.now().toString(36)}`,
            plan: 'FREE',
            maxUsers: 3,
            maxContacts: 100
          }
        });

        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Trial period of 14 days
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 14);

        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            companyName,
            role: 'OWNER',
            plan: 'FREE',
            organizationId: organization.id,
            trialEndsAt: trialEndsAt
          },
          select: {
            id: true, email: true, firstName: true, lastName: true,
            role: true, plan: true, organizationId: true,
            organization: { select: { id: true, name: true, slug: true } }
          }
        });

        return user;
      });

      const token = jwt.sign(
        { id: result.id, email: result.email, role: result.role, organizationId: result.organizationId },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30d' }
      );

      res.status(201).json({ user: result, token });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
  }
];

exports.login = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Identifiants invalides' });

      // Vérifier l'abonnement
      if (user.plan === 'FREE' && user.trialEndsAt && user.trialEndsAt < new Date()) {
        return res.status(402).json({ error: 'Essai expiré', code: 'TRIAL_EXPIRED' });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30d' }
      );

      res.json({
        user: {
          id: user.id, email: user.email, firstName: user.firstName,
          lastName: user.lastName, role: user.role, plan: user.plan,
          organization: user.organization
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur de connexion' });
    }
  }
];

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, avatar: true, createdAt: true, organization: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const orgId = req.user.organizationId;
    if (!orgId) return res.status(403).json({ error: "Aucune organisation associée" });

    const [userCount, contactCount, dealCount, recentActivity] = await Promise.all([
      prisma.user.count({ where: { organizationId: orgId } }),
      prisma.contact.count({ where: { organizationId: orgId } }),
      prisma.deal.count({ where: { organizationId: orgId } }),
      prisma.activityLog.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { firstName: true, lastName: true } } }
      })
    ]);

    const org = await prisma.organization.findUnique({ where: { id: orgId } });

    res.json({
      stats: { users: userCount, contacts: contactCount, deals: dealCount },
      recentActivity,
      organization: org
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
