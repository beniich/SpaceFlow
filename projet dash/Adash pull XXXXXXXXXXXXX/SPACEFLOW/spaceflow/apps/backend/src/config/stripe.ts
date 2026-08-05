import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY;

if (!apiKey) {
  console.warn('⚠️  STRIPE_SECRET_KEY not configured');
}

export const stripe = new Stripe(apiKey || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
  typescript: true
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
