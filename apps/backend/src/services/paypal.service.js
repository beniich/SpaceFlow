/**
 * paypal.service.js
 * Service PayPal côté serveur — secrets jamais exposés au client.
 * Gère: token OAuth2, vérification d'abonnement, sync Prisma.
 */

const { prisma } = require('../config/database');
const logger = require('../utils/logger');

const PAYPAL_API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// Webhook URL de production enregistré dans le Dashboard PayPal
const PAYPAL_WEBHOOK_URL = 'https://beecarbonat.ricecloud.net/pay';

// ─── Plan IDs configurés via .env ─────────────────────────────────────────────
const PAYPAL_PLANS = {
  PRO: {
    planId: process.env.PAYPAL_PLAN_ID_PRO || 'P-PLACEHOLDER_PRO',
    label: 'Plan Pro',
    price: '49€/mois',
    description: 'Bilan Scopes 1-2-3 + IA Prédictive Gemini',
  },
  ENTERPRISE: {
    planId: process.env.PAYPAL_PLAN_ID_ENTERPRISE || 'P-PLACEHOLDER_ENTERPRISE',
    label: 'Enterprise',
    price: '199€/mois',
    description: 'Cockpit CAFM illimité + Intégrations BACnet',
  },
};

// ─── 1. Token OAuth2 PayPal (server-side uniquement) ──────────────────────────
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    throw new Error(`PayPal OAuth2 error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// ─── 2. Vérification de signature webhook PayPal ──────────────────────────────
/**
 * Valide la signature d'un webhook PayPal via l'API REST.
 * Webhook ID: 8LR39165RU9417152 (beecarbonat.ricecloud.net/pay)
 * @returns {boolean} true si la signature est valide
 */
async function verifyPayPalWebhookSignature({ headers, rawBody }) {
  // En développement, skip la vérification de signature
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('PayPal webhook signature: SKIPPED (dev mode)');
    return true;
  }

  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    logger.warn('PAYPAL_WEBHOOK_ID non configuré — signature non vérifiée');
    return true; // Permissif si pas configuré
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const body = Buffer.isBuffer(rawBody) ? rawBody.toString('utf-8') : rawBody;

    const verifyPayload = {
      auth_algo:        headers['paypal-auth-algo'],
      cert_url:         headers['paypal-cert-url'],
      transmission_id:  headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    };

    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyPayload),
      }
    );

    const result = await response.json();
    const isValid = result.verification_status === 'SUCCESS';

    if (!isValid) {
      logger.warn({ verificationStatus: result.verification_status }, '⚠️ PayPal webhook signature invalide');
    }

    return isValid;
  } catch (err) {
    logger.error({ err: err.message }, '❌ Erreur vérification signature PayPal');
    return false;
  }
}

// ─── 3. Vérification et sync d'un abonnement PayPal ──────────────────────────

async function verifyAndSyncPayPalSubscription(subscriptionId, tenantId) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`PayPal Subscription fetch error: ${response.status}`);
  }

  const subscription = await response.json();

  if (subscription.status === 'ACTIVE' && tenantId) {
    // Déterminer le plan depuis l'ID du plan PayPal
    const planKey = Object.entries(PAYPAL_PLANS).find(
      ([, p]) => p.planId === subscription.plan_id
    )?.[0] || 'PRO';

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        paypalSubscriptionId: subscriptionId,
        paypalPlanKey: planKey,
        subscriptionStatus: 'ACTIVE',
        // Met à jour le plan Prisma enum si les plans PayPal correspondent
        plan: planKey === 'ENTERPRISE' ? 'ENTERPRISE' : 'PRO',
        currentPeriodStart: subscription.billing_info?.last_payment?.time
          ? new Date(subscription.billing_info.last_payment.time)
          : new Date(),
        currentPeriodEnd: subscription.billing_info?.next_billing_time
          ? new Date(subscription.billing_info.next_billing_time)
          : null,
      },
    });

    logger.info({ subscriptionId, tenantId, planKey }, '✅ PayPal subscription synced to Tenant');
  }

  return subscription;
}

// ─── 3. Gestion des événements webhook ────────────────────────────────────────
async function handlePayPalWebhookEvent(event) {
  const { event_type, resource } = event;

  switch (event_type) {
    case 'BILLING.SUBSCRIPTION.ACTIVATED': {
      logger.info({ subscriptionId: resource.id }, '🟢 PayPal: Abonnement activé');
      // La sync est déjà faite via verify-subscription au retour du SDK
      break;
    }

    case 'BILLING.SUBSCRIPTION.CANCELLED': {
      logger.info({ subscriptionId: resource.id }, '🔴 PayPal: Abonnement annulé');
      await prisma.tenant.updateMany({
        where: { paypalSubscriptionId: resource.id },
        data: {
          subscriptionStatus: 'CANCELED',
          plan: 'FREE',
          paypalSubscriptionId: null,
          paypalPlanKey: null,
        },
      });
      break;
    }

    case 'BILLING.SUBSCRIPTION.SUSPENDED': {
      logger.warn({ subscriptionId: resource.id }, '⚠️ PayPal: Abonnement suspendu');
      await prisma.tenant.updateMany({
        where: { paypalSubscriptionId: resource.id },
        data: { subscriptionStatus: 'PAST_DUE' },
      });
      break;
    }

    case 'PAYMENT.SALE.COMPLETED': {
      logger.info(
        { saleId: resource.id, amount: resource.amount?.total },
        '💰 PayPal: Paiement récurrent reçu'
      );
      break;
    }

    case 'PAYMENT.SALE.DENIED': {
      logger.warn({ saleId: resource.id }, '❌ PayPal: Paiement refusé');
      break;
    }

    default:
      logger.debug({ event_type }, 'PayPal webhook event non traité');
  }
}

module.exports = {
  PAYPAL_PLANS,
  PAYPAL_WEBHOOK_URL,
  getPayPalAccessToken,
  verifyPayPalWebhookSignature,
  verifyAndSyncPayPalSubscription,
  handlePayPalWebhookEvent,
};
