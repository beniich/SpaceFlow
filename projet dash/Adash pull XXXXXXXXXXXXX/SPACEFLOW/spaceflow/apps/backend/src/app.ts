import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { errorHandler, notFound } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rate-limit.middleware';
import { logger } from './config/logger';
import authRoutes from './routes/auth.routes';
import bookingRoutes from './routes/booking.routes';
import statsRoutes from './routes/stats.routes';
import pushRoutes from './routes/push.routes';
import stripeWebhookRoutes from './routes/stripe-webhook.routes';
import billingRoutes from './routes/billing.routes';
import invoiceRoutes from './routes/invoice.routes';
import pdfRoutes from './routes/pdf.routes';
import './config/firebase'; // Init Firebase

export const createApp = (): Application => {
  const app = express();

  // Security
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.stripe.com', 'wss:']
      }
    } : false
  }));
  
  app.use(cors(corsOptions));
  
  // Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) }
    }));
  }

  // Rate limiting global
  app.use('/api/', generalLimiter);

  // Webhooks DOIVENT être avant express.json()
  // Stripe utilise un express.raw() interne ou a besoin du raw body
  app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhookRoutes);

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Trust proxy (si derrière nginx)
  app.set('trust proxy', 1);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      env: process.env.NODE_ENV,
      uptime: process.uptime()
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/push', pushRoutes);
  app.use('/api/billing', billingRoutes);
  app.use('/api/invoices', invoiceRoutes);
  app.use('/api/pdf', pdfRoutes);

  // 404
  app.use(notFound);

  // Error handler (DOIT être en dernier)
  app.use(errorHandler);

  return app;
};