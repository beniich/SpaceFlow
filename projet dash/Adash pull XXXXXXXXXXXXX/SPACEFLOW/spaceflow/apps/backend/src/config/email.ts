import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn('⚠️  RESEND_API_KEY not configured - emails disabled');
}

export const resend = apiKey ? new Resend(apiKey) : null;
export const FROM_EMAIL = process.env.FROM_EMAIL || 'SpaceFlow <noreply@spaceflow.com>';
export const FROM_NAME = process.env.FROM_NAME || 'SpaceFlow';
