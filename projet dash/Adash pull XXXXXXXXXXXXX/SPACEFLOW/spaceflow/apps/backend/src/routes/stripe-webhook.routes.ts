import { Router } from 'express';
import { stripe, STRIPE_WEBHOOK_SECRET } from '../config/stripe';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

const router = Router();

/**
 * IMPORTANT: Doit être enregistré AVANT express.json() dans server.ts
 * Utilise express.raw() pour garder le body brut pour vérification signature
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    logger.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  logger.info(`Stripe webhook: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        logger.debug(`Unhandled event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    logger.error('Webhook processing error:', err);
    res.status(500).json({ error: err.message });
  }
});

async function handleCheckoutCompleted(session: any) {
  const { organizationId, plan } = session.metadata;
  
  if (!organizationId) return;

  const stripeSubscription = await stripe.subscriptions.retrieve(
    session.subscription
  );

  await prisma.subscription.upsert({
    where: { organizationId },
    update: {
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      plan: plan || 'PRO',
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
    },
    create: {
      organizationId,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      plan: plan || 'PRO',
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
    }
  });

  // Apply plan limits
  const limits = {
    FREE: { maxSpaces: 1, maxMembers: 20 },
    STARTER: { maxSpaces: 3, maxMembers: 100 },
    PRO: { maxSpaces: 10, maxMembers: 500 },
    ENTERPRISE: { maxSpaces: -1, maxMembers: -1 }
  }[plan as string] || { maxSpaces: 1, maxMembers: 20 };

  await prisma.organization.update({
    where: { id: organizationId },
    data: { plan, maxSpaces: limits.maxSpaces, maxMembers: limits.maxMembers }
  });

  logger.info(`✅ Subscription activated for org ${organizationId}: ${plan}`);
}

async function handleSubscriptionUpdated(sub: any) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: {
      status: sub.status,
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null
    }
  });
}

async function handleSubscriptionDeleted(sub: any) {
  const subRecord = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: sub.id }
  });
  
  if (subRecord) {
    await prisma.subscription.update({
      where: { organizationId: subRecord.organizationId },
      data: { status: 'canceled', canceledAt: new Date() }
    });
    
    // Downgrade to FREE
    await prisma.organization.update({
      where: { id: subRecord.organizationId },
      data: { plan: 'FREE', maxSpaces: 1, maxMembers: 20 }
    });
  }
}

async function handleInvoicePaid(stripeInvoice: any) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: stripeInvoice.customer }
  });

  if (!sub) return;

  const existing = await prisma.invoice.findUnique({
    where: { stripeInvoiceId: stripeInvoice.id }
  });

  if (existing) {
    await prisma.invoice.update({
      where: { id: existing.id },
      data: {
        status: 'paid',
        amountPaid: stripeInvoice.amount_paid,
        paidAt: new Date()
      }
    });
  } else {
    await prisma.invoice.create({
      data: {
        organizationId: sub.organizationId,
        stripeInvoiceId: stripeInvoice.id,
        invoiceNumber: stripeInvoice.number || `INV-${Date.now()}`,
        number: stripeInvoice.number || `INV-${Date.now()}`,
        customerId: stripeInvoice.customer as string,
        status: 'paid',
        amount: stripeInvoice.amount_paid,
        amountDue: 0,
        amountPaid: stripeInvoice.amount_paid,
        currency: stripeInvoice.currency,
        periodStart: new Date(stripeInvoice.period_start * 1000),
        periodEnd: new Date(stripeInvoice.period_end * 1000),
        dueDate: new Date(stripeInvoice.due_date * 1000),
        paidAt: new Date(),
        invoicePdfUrl: stripeInvoice.invoice_pdf,
        hostedInvoiceUrl: stripeInvoice.hosted_invoice_url
      }
    });
  }
}

async function handlePaymentFailed(stripeInvoice: any) {
  logger.warn(`Payment failed for invoice: ${stripeInvoice.id}`);
  // TODO: send notification email
}

export default router;
