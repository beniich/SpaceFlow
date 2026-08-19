const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { verifyFirebaseToken } = require('../services/firebase-admin.service');

const JWT_SECRET = process.env.JWT_SECRET || 'cafm-crm-secret-key-2026';

/**
 * POST /api/crm/auth/firebase
 * Échange un idToken Firebase (Google OAuth) contre un JWT CRM
 * Crée le compte si premier login
 */
exports.firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken requis' });

    const decoded = await verifyFirebaseToken(idToken);
    const { uid, email, name, picture } = decoded;

    if (!email) return res.status(400).json({ error: 'Email Firebase manquant' });

    // Chercher ou créer le user CRM
    let user = await prisma.cRMUser.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user) {
      // Premier login Google → créer org + user
      const nameParts = (name || email.split('@')[0]).split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || 'Firebase';
      const companyName = `${firstName}'s Company`;
      const baseSlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const slug = `${baseSlug}-${Date.now().toString(36)}`;
      const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

      const result = await prisma.$transaction(async (tx) => {
        const org = await tx.cRMOrganization.create({
          data: { name: companyName, slug, plan: 'FREE', maxUsers: 3, maxContacts: 100, trialEndsAt }
        });
        return tx.cRMUser.create({
          data: {
            email, firstName, lastName, companyName,
            password: await bcrypt.hash(uid, 10), // uid Firebase comme password fictif
            role: 'OWNER', plan: 'FREE', organizationId: org.id,
            trialEndsAt, emailVerified: true,
            avatar: picture || null
          },
          include: { organization: true }
        });
      });
      user = result;
    }

    if (!user.isActive) return res.status(401).json({ error: 'Compte désactivé' });

    await prisma.cRMUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    res.json({
      token: idToken,
      user: {
        id: user.id, email: user.email,
        firstName: user.firstName, lastName: user.lastName,
        role: user.role, plan: user.plan,
        avatar: user.avatar, trialEndsAt: user.trialEndsAt,
        organization: user.organization
      }
    });
  } catch (err) {
    console.error('Firebase login error:', err);
    res.status(401).json({ error: 'Token Firebase invalide ou expiré' });
  }
};

exports.signup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('companyName').trim().notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password, firstName, lastName, companyName } = req.body;

      const existing = await prisma.cRMUser.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ error: 'Email deja utilise' });

      const result = await prisma.$transaction(async (tx) => {
        const baseSlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const slug = `${baseSlug}-${Date.now().toString(36)}`;
        const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        const org = await tx.cRMOrganization.create({
          data: { name: companyName, slug, plan: 'FREE', maxUsers: 3, maxContacts: 100, trialEndsAt }
        });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await tx.cRMUser.create({
          data: {
            email, password: hashedPassword, firstName, lastName,
            companyName, role: 'OWNER', plan: 'FREE',
            organizationId: org.id, trialEndsAt
          },
          select: {
            id: true, email: true, firstName: true, lastName: true,
            role: true, plan: true, organizationId: true, trialEndsAt: true,
            organization: { select: { id: true, name: true, slug: true, plan: true, trialEndsAt: true } }
          }
        });

        return user;
      });

      const token = jwt.sign(
        { userId: result.id, organizationId: result.organizationId, role: result.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({ user: result, token });
    } catch (error) {
      console.error('CRM Signup error:', error);
      res.status(500).json({ error: error.message });
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
      const user = await prisma.cRMUser.findUnique({
        where: { email },
        include: { organization: true }
      });

      if (!user || !user.isActive) return res.status(401).json({ error: 'Identifiants invalides' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Identifiants invalides' });

      if (
        user.organization.plan === 'FREE' &&
        user.organization.trialEndsAt &&
        new Date(user.organization.trialEndsAt) < new Date()
      ) {
        return res.status(402).json({ error: 'Essai expire', code: 'TRIAL_EXPIRED' });
      }

      await prisma.cRMUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

      const token = jwt.sign(
        { userId: user.id, organizationId: user.organizationId, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        user: {
          id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
          role: user.role, plan: user.plan, trialEndsAt: user.trialEndsAt,
          organization: user.organization
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

exports.getDashboard = async (req, res) => {
  try {
    const orgId = req.crm.organizationId;
    const [userCount, contactCount, dealCount, recentLogs] = await Promise.all([
      prisma.cRMUser.count({ where: { organizationId: orgId } }),
      prisma.cRMContact.count({ where: { organizationId: orgId } }),
      prisma.cRMDeal.count({ where: { organizationId: orgId } }),
      prisma.cRMActivityLog.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { user: { select: { firstName: true, lastName: true } } }
      })
    ]);

    const org = await prisma.cRMOrganization.findUnique({ where: { id: orgId } });

    res.json({
      stats: { users: userCount, contacts: contactCount, deals: dealCount },
      recentActivity: recentLogs,
      organization: org
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await prisma.cRMUser.findUnique({
      where: { id: req.crm.userId },
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true, plan: true,
        trialEndsAt: true, organizationId: true,
        organization: { select: { id: true, name: true, slug: true, plan: true, maxContacts: true, trialEndsAt: true } }
      }
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
