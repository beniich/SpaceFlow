/**
 * paypal.routes.js
 * Routes PayPal Subscriptions — Backend sécurisé.
 *
 * Endpoints:
 *   GET  /api/paypal/plans                  — Retourne les plan IDs (public, client-safe)
 *   POST /api/paypal/verify-subscription    — Vérifie & sync un abonnement PayPal (auth requis)
 *   POST /api/paypal/webhook                — Reçoit les événements PayPal Webhook
 */

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  PAYPAL_PLANS,
  verifyPayPalWebhookSignature,
  verifyAndSyncPayPalSubscription,
  handlePayPalWebhookEvent,
} = require('../services/paypal.service');
const logger = require('../utils/logger');

// ─── 1. Plans disponibles (public) ────────────────────────────────────────────
/**
 * GET /api/paypal/plans
 * Retourne les Plan IDs PayPal configurés (sans secrets).
 */
router.get('/plans', (req, res) => {
  const clientSafePlans = Object.entries(PAYPAL_PLANS).reduce((acc, [key, plan]) => {
    acc[key] = {
      key,
      planId: plan.planId,
      label: plan.label,
      price: plan.price,
      description: plan.description,
    };
    return acc;
  }, {});

  res.json({
    plans: clientSafePlans,
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  });
});

// ─── 2. Vérification d'abonnement après paiement ──────────────────────────────
/**
 * POST /api/paypal/verify-subscription
 * Body: { subscriptionId: string }
 * Auth: JWT requis — permet de lier l'abonnement au tenant de l'utilisateur.
 */
router.post('/verify-subscription', authMiddleware, async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId || typeof subscriptionId !== 'string') {
      return res.status(400).json({ error: 'subscriptionId manquant ou invalide' });
    }

    // Valider le format d'un subscription ID PayPal (I-XXXXXXXXXXXXXX)
    if (!/^I-[A-Z0-9]{13}$/.test(subscriptionId)) {
      return res.status(400).json({ error: 'Format subscriptionId invalide' });
    }

    const tenantId = req.user?.tenantId;
    const subscription = await verifyAndSyncPayPalSubscription(subscriptionId, tenantId);

    if (subscription.status === 'ACTIVE') {
      logger.info(
        { subscriptionId, tenantId, userId: req.user?.id },
        '✅ Abonnement PayPal vérifié et activé'
      );
      return res.json({
        success: true,
        status: 'ACTIVE',
        planId: subscription.plan_id,
        nextBillingTime: subscription.billing_info?.next_billing_time,
      });
    }

    return res.status(400).json({
      success: false,
      status: subscription.status,
      message: `Abonnement non actif (statut: ${subscription.status})`,
    });
  } catch (err) {
    logger.error({ err: err.message }, '❌ Erreur vérification abonnement PayPal');
    res.status(500).json({ error: 'Impossible de vérifier l\'abonnement PayPal' });
  }
});

// ─── 3. Webhook PayPal ────────────────────────────────────────────────────────
/**
 * POST /api/paypal/webhook  (dev/internal)
 * POST /pay                  (production — https://beecarbonat.ricecloud.net/pay)
 * Webhook ID: 8LR39165RU9417152
 * Reçoit et traite les événements de facturation PayPal avec vérification de signature.
 */
const webhookHandler = async (req, res) => {
  let rawBody;
  let event;

  try {
    // Supporte raw body (express.raw) ou parsed (express.json fallback)
    rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(JSON.stringify(req.body));
    event = JSON.parse(rawBody.toString('utf-8'));
  } catch (err) {
    logger.error({ err: err.message }, 'PayPal Webhook: impossible de parser le body');
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  if (!event.event_type) {
    return res.status(400).json({ error: 'event_type manquant' });
  }

  // ── Vérification de signature (production uniquement) ──────────────────────
  const signatureValid = await verifyPayPalWebhookSignature({
    headers: req.headers,
    rawBody,
  });

  if (!signatureValid) {
    logger.warn(
      { eventType: event.event_type, ip: req.ip },
      '🚫 PayPal webhook rejeté — signature invalide'
    );
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  logger.info(
    { eventType: event.event_type, eventId: event.id },
    '📬 Événement PayPal Webhook reçu et vérifié'
  );

  try {
    await handlePayPalWebhookEvent(event);
    res.status(200).json({ received: true });
  } catch (err) {
    logger.error({ err: err.message, eventType: event.event_type }, '❌ Erreur traitement Webhook PayPal');
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Route interne : /api/paypal/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

module.exports = { router, webhookHandler };
