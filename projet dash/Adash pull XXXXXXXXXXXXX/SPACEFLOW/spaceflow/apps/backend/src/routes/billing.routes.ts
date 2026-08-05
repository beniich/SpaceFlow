import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireTenant } from '../middleware/tenant.middleware';
import stripeService from '../services/stripe.service';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { AppError } from '../middleware/error.middleware';
import { stripe } from '../config/stripe';

const router = Router();

router.use(authenticate);
router.use(requireTenant);

/**
 * GET /api/billing/plans
 * Liste des plans disponibles (public)
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = await stripeService.getPlans();
    res.json({ plans });
  } catch (err) {
    logger.error('Get plans error:', err);
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

/**
 * POST /api/billing/checkout
 * Créer une session Stripe Checkout
 */
router.post('/checkout', async (req: any, res) => {
  try {
    const { plan, billingInterval = 'month' } = req.body;
    
    if (!['STARTER', 'PRO', 'ENTERPRISE'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const result = await stripeService.createCheckoutSession({
      organizationId: req.user.organizationId,
      plan,
      billingInterval,
      successUrl: `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.APP_URL}/billing?canceled=1`
    });

    res.json(result);
  } catch (err: any) {
    logger.error('Checkout error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/billing/subscription
 * Récupérer l'abonnement actuel
 */
router.get('/subscription', async (req: any, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: req.user.organizationId }
    });
    res.json({ subscription });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

/**
 * POST /api/billing/portal
 * Ouvrir le billing portal Stripe
 */
router.post('/portal', async (req: any, res) => {
  try {
    const result = await stripeService.createBillingPortalSession(
      req.user.organizationId,
      `${process.env.APP_URL}/settings/billing`
    );
    res.json(result);
  } catch (err: any) {
    logger.error('Portal error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/billing/invoices
 * Liste des factures
 */
router.get('/invoices', async (req: any, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json({ invoices });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get invoices' });
  }
});

/**
 * POST /api/billing/cancel
 * Annuler l'abonnement (à la fin de la période)
 */
router.post('/cancel', async (req: any, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: req.user.organizationId }
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new AppError('No active subscription', 400);
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ success: true, message: 'Subscription will cancel at period end' });
  } catch (err: any) {
    logger.error('Cancel error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
