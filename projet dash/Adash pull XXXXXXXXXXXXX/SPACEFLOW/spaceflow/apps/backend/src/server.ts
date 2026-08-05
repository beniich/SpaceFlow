import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { createApp } from './app';
import { initializeSocket } from './realtime/socket.server';
import { logger } from './config/logger';
import { prisma } from './config/database';
import { redis } from './config/redis';
import stripeWebhookRoutes from './routes/stripe-webhook.routes';
import billingJobs from './jobs/billing-jobs';
import dunningService from './services/dunning.service';
import cron from 'node-cron';

const PORT = parseInt(process.env.PORT || '4000', 10);

// ============== VALIDATION PRODUCTION ==============
if (process.env.NODE_ENV === 'production') {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'APP_URL'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// ============== STARTUP ==============
async function startServer() {
  try {
    const app = createApp();
    const httpServer = createServer(app);

    initializeSocket(httpServer);

    // Test DB connection
    await prisma.$connect();
    logger.info('✅ Database connected');

    // Test Redis
    await redis.ping();
    logger.info('✅ Redis connected');

    // Start cron jobs
    billingJobs.start();

    // Dunning cron (tous les jours à 11h)
    cron.schedule('0 11 * * *', () => {
      dunningService.process().catch(err => 
        logger.error('Dunning process failed:', err)
      );
    });

    // Start server
    httpServer.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 SpaceFlow API on port ${PORT}`);
      logger.info(`📍 Health: http://localhost:${PORT}/api/health`);
      logger.info(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
      logger.info(`📡 WebSocket: ws://localhost:${PORT}/socket.io`);
      logger.info(`🌍 Env: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    logger.error('❌ Startup failed:', err);
    process.exit(1);
  }
}

startServer();