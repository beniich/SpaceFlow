let Stripe = null;
try {
  Stripe = require('stripe');
} catch (e) {
  // Stripe optional
}

let stripeInstance = null;

const getStripe = () => {
  if (!stripeInstance) {
    if (!Stripe) {
      throw new Error('Le package Stripe n\'est pas installé');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2024-06-20'
    });
  }
  return stripeInstance;
};

// Plans CRM mappés aux Stripe Price IDs
const PLANS = {
  STARTER: {
    name: 'Starter',
    priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter_placeholder',
    price: 29,
    maxContacts: 500,
    maxUsers: 3
  },
  PRO: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder',
    price: 79,
    maxContacts: 5000,
    maxUsers: 10
  },
  ENTERPRISE: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_placeholder',
    price: 199,
    maxContacts: -1,   // illimité
    maxUsers: -1
  }
};

/**
 * Créer ou récupérer un customer Stripe pour un user CRM
 */
const getOrCreateCustomer = async (user) => {
  const stripe = getStripe();
  if (user.stripeCustomerId) {
    return stripe.customers.retrieve(user.stripeCustomerId);
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    metadata: {
      crmUserId: user.id,
      organizationId: user.organizationId
    }
  });

  return customer;
};

const createCheckoutSession = async ({ user, planKey, successUrl, cancelUrl }) => {
  const plan = PLANS[planKey];
  if (!plan) throw new Error(`Plan inconnu: ${planKey}`);

  // Fallback dev mode
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    console.info(`[Stripe] Fallback mode active — planKey: ${planKey}`);
    const simulatedUrl = `${successUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/crm/dashboard`}?simulated=true&plan=${planKey}`;
    return { sessionId: 'sess_simulated', url: simulatedUrl, customerId: 'cus_simulated' };
  }

  const stripe = getStripe();
  const customer = await getOrCreateCustomer(user);

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/crm/dashboard?upgraded=true`,
    cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/crm/dashboard`,
    metadata: {
      crmUserId: user.id,
      organizationId: user.organizationId,
      planKey
    },
    subscription_data: {
      trial_period_days: 0,
      metadata: { crmUserId: user.id, planKey }
    },
    allow_promotion_codes: true
  });

  return { sessionId: session.id, url: session.url, customerId: customer.id };
};

/**
 * Créer un lien vers le portail client Stripe (gestion abonnement)
 */
const createBillingPortalSession = async (stripeCustomerId, returnUrl) => {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    return returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/crm/dashboard`;
  }
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/crm/dashboard`
  });
  return session.url;
};

/**
 * Vérifier la signature d'un webhook Stripe
 */
const constructWebhookEvent = (payload, signature) => {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
  );
};

/**
 * Récupérer les détails d'un abonnement
 */
const getSubscription = (subscriptionId) => {
  const stripe = getStripe();
  return stripe.subscriptions.retrieve(subscriptionId);
};

module.exports = {
  getStripe,
  PLANS,
  getOrCreateCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  constructWebhookEvent,
  getSubscription
};
