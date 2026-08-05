import { stripe } from '../config/stripe';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

const PLAN_PRICE_IDS: Record<string, { monthly: string; yearly: string }> = {
  STARTER: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY || ''
  },
  PRO: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || ''
  },
  ENTERPRISE: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || ''
  }
};

const PLAN_LIMITS: Record<string, { maxSpaces: number; maxMembers: number; maxBookings: number }> = {
  FREE: { maxSpaces: 1, maxMembers: 20, maxBookings: 50 },
  STARTER: { maxSpaces: 3, maxMembers: 100, maxBookings: 500 },
  PRO: { maxSpaces: 10, maxMembers: 500, maxBookings: -1 },
  ENTERPRISE: { maxSpaces: -1, maxMembers: -1, maxBookings: -1 }
};

class StripeService {
  
  /**
   * Créer ou récupérer un customer Stripe
   */
  async getOrCreateCustomer(organizationId: string): Promise<string> {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!org) throw new Error('Organization not found');

    let subscription = await prisma.subscription.findUnique({
      where: { organizationId }
    });

    if (subscription?.stripeCustomerId) {
      return subscription.stripeCustomerId;
    }

    const customer = await stripe.customers.create({
      email: org.email,
      name: org.name,
      metadata: {
        organizationId: org.id,
        slug: org.slug
      }
    });

    if (subscription) {
      await prisma.subscription.update({
        where: { organizationId },
        data: { stripeCustomerId: customer.id }
      });
    } else {
      await prisma.subscription.create({
        data: {
          organizationId,
          stripeCustomerId: customer.id,
          plan: 'FREE',
          status: 'active'
        }
      });
    }

    return customer.id;
  }

  /**
   * Créer une session de checkout
   */
  async createCheckoutSession(options: {
    organizationId: string;
    plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
    billingInterval: 'month' | 'year';
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ url: string }> {
    const customerId = await this.getOrCreateCustomer(options.organizationId);
    
    const priceId = PLAN_PRICE_IDS[options.plan]?.[options.billingInterval];
    
    if (!priceId) {
      throw new Error(`Price ID not configured for ${options.plan} ${options.billingInterval}`);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      metadata: {
        organizationId: options.organizationId,
        plan: options.plan,
        billingInterval: options.billingInterval
      },
      subscription_data: {
        metadata: {
          organizationId: options.organizationId,
          plan: options.plan
        }
      },
      allow_promotion_codes: true
    });

    return { url: session.url! };
  }

  /**
   * Créer une session pour le billing portal
   */
  async createBillingPortalSession(
    organizationId: string,
    returnUrl: string
  ): Promise<{ url: string }> {
    const customerId = await this.getOrCreateCustomer(organizationId);
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });

    return { url: session.url };
  }

  /**
   * Récupérer les plans disponibles
   */
  async getPlans() {
    return [
      {
        id: 'FREE',
        name: 'Free',
        price: 0,
        features: [
          '1 espace',
          '20 members',
          '50 réservations/mois',
          'Support communautaire'
        ]
      },
      {
        id: 'STARTER',
        name: 'Starter',
        price: 29,
        interval: 'month',
        features: [
          '3 espaces',
          '100 members',
          'Réservations illimitées',
          'Facturation Stripe',
          'Support email'
        ]
      },
      {
        id: 'PRO',
        name: 'Pro',
        price: 79,
        interval: 'month',
        popular: true,
        features: [
          '10 espaces',
          '500 members',
          'API + Webhooks',
          'Multi-utilisateurs',
          'IA prédictive',
          'Support prioritaire'
        ]
      },
      {
        id: 'ENTERPRISE',
        name: 'Enterprise',
        price: 299,
        interval: 'month',
        features: [
          'Espaces illimités',
          'Members illimités',
          'SSO / SAML',
          'Account manager dédié',
          'SLA 99.99%',
          'White label'
        ]
      }
    ];
  }

  /**
   * Mettre à jour les limites selon le plan
   */
  async applyPlanToOrganization(organizationId: string, plan: string) {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        plan,
        maxSpaces: limits.maxSpaces,
        maxMembers: limits.maxMembers
      }
    });
  }
}

export default new StripeService();
