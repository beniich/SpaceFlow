const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { verifyFirebaseToken } = require('../services/firebase-admin.service');
const {
  createCheckoutSession,
  createBillingPortalSession,
  constructWebhookEvent,
  getSubscription,
  PLANS
} = require('../services/stripe.service');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cafm-crm-secret';

// ─── Middleware Auth CRM ───────────────────────────────────────────────────────
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requis' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// ─── PLANS INFO ───────────────────────────────────────────────────────────────
/**
 * GET /api/crm/billing/plans
 * Liste des plans disponibles
 */
router.get('/plans', (req, res) => {
  res.json({ plans: PLANS });
});

// ─── CHECKOUT SESSION ─────────────────────────────────────────────────────────
/**
 * POST /api/crm/billing/create-checkout
 * Body: { planKey: 'STARTER' | 'PRO' | 'ENTERPRISE' }
 */
router.post('/create-checkout', authMiddleware, async (req, res) => {
  try {
    const { planKey } = req.body;
    if (!planKey || !PLANS[planKey]) {
      return res.status(400).json({ message: 'planKey invalide' });
    }

    const user = await prisma.cRMUser.findUnique({
      where: { id: req.user.userId },
      include: { organization: true }
    });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const result = await createCheckoutSession({ user, planKey });

    // Sauvegarder stripeCustomerId si nouveau
    if (!user.stripeCustomerId) {
      await prisma.cRMUser.update({
        where: { id: user.id },
        data: { stripeCustomerId: result.customerId }
      });
    }

    res.json({ url: result.url, sessionId: result.sessionId });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── BILLING PORTAL ───────────────────────────────────────────────────────────
/**
 * POST /api/crm/billing/portal
 * Redirige vers le portail Stripe pour gérer l'abonnement
 */
router.post('/portal', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.cRMUser.findUnique({ where: { id: req.user.userId } });
    if (!user?.stripeCustomerId) {
      return res.status(400).json({ message: 'Aucun abonnement actif' });
    }

    const url = await createBillingPortalSession(user.stripeCustomerId);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── STRIPE WEBHOOK ───────────────────────────────────────────────────────────
/**
 * POST /api/crm/billing/webhook
 * Stripe envoie les événements ici (paiement confirmé, annulation…)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = constructWebhookEvent(req.body, signature);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ message: 'Webhook invalide' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { crmUserId, planKey } = session.metadata || {};

        if (crmUserId && planKey) {
          const plan = PLANS[planKey];
          await prisma.cRMUser.update({
            where: { id: crmUserId },
            data: {
              plan: planKey,
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              subscriptionStatus: 'ACTIVE'
            }
          });

          // Mettre à jour les limites de l'organisation
          const user = await prisma.cRMUser.findUnique({ where: { id: crmUserId } });
          if (user && plan) {
            await prisma.cRMOrganization.update({
              where: { id: user.organizationId },
              data: {
                plan: planKey,
                maxUsers: plan.maxUsers === -1 ? 9999 : plan.maxUsers,
                maxContacts: plan.maxContacts === -1 ? 999999 : plan.maxContacts
              }
            });
          }
          console.log(`✅ Plan upgrade: ${crmUserId} → ${planKey}`);
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.paused': {
        const sub = event.data.object;
        await prisma.cRMUser.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            plan: 'FREE',
            subscriptionStatus: event.type === 'customer.subscription.deleted' ? 'CANCELED' : 'PAUSED'
          }
        });
        console.log(`⚠️ Subscription ${event.type}: ${sub.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await prisma.cRMUser.updateMany({
          where: { stripeCustomerId: invoice.customer },
          data: { subscriptionStatus: 'PAST_DUE' }
        });
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

module.exports = router;
