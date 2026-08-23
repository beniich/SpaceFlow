require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const { Server } = require('socket.io');
const { prisma } = require('./config/database');
const logger = require('./utils/logger');
const swaggerRoutes = require('./routes/swagger.routes');
const { sanitizeInput, apiLimiter, securityHeaders } = require('./middleware/security.middleware');
const Sentry = require('@sentry/node');

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], credentials: true }
});

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    integrations: [
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
  });
}

const authRoutes = require('./routes/auth.routes');
const assetRoutes = require('./routes/asset.routes');
const spaceRoutes = require('./routes/space.routes');
const workOrderRoutes = require('./routes/workorder.routes');
const ticketRoutes    = require('./routes/ticket.routes');
const buildingRoutes = require('./routes/building.routes');
const leaseRoutes = require('./routes/lease.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const cmmsRoutes = require('./routes/cmms.routes');
const digitalTwinRoutes = require('./routes/digitaltwin.routes');
const notificationRoutes = require('./routes/notification.routes');
const tenantRoutes = require('./routes/tenant.routes');
const exportRoutes = require('./routes/export.routes');
const erpRoutes = require('./routes/erp.routes');
const bimRoutes = require('./routes/bim.routes');
const aiRoutes = require('./routes/ai.routes');
const apiKeysRoutes = require('./routes/api-keys.routes');
const crmAuthRoutes = require('./routes/crm.auth.routes');
const crmContactRoutes = require('./routes/crm.contact.routes');
const crmDealRoutes = require('./routes/crm.deal.routes');
const uploadRoutes = require('./routes/upload.routes');
const workflowRoutes = require('./routes/workflow.routes');
const marketplaceRoutes = require('./routes/marketplace.routes');
const { startIoTSimulation } = require('./services/iot.service');

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : []) 
  : [process.env.CORS_ORIGIN || 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === 'production') {
      if (!origin || allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS Policy: Access Denied'), false);
      }
    }
    // In dev allow anything, or the allowedOrigins
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(compression());
app.use(express.json());

// ============== SÉCURITÉ GLOBALE ==============
app.use(securityHeaders);
app.use(sanitizeInput);
app.use('/api/', apiLimiter);

// ============== TENANT CONTEXT ==============
const { tenantMiddleware } = require('./middleware/tenant.middleware');
app.use(tenantMiddleware);

// ============== CSRF PROTECTION ==============
// Actif uniquement en production — les SPA peuvent utiliser le mode cookie-to-header
const { doubleCsrfProtection, generateToken } = require('./middleware/csrf.middleware');
if (process.env.NODE_ENV === 'production') {
  app.use(doubleCsrfProtection);
}
// Route pour distribuer le token CSRF au frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: generateToken(req, res) });
});

// ============== DOCUMENTATION ==============
app.use('/', swaggerRoutes);

// ============== MONITORING & METRICS ==============
const { mountBullBoard } = require('./monitoring/bullMonitor');
const { getMetrics, getHealth } = require('./monitoring/metrics');

// Metrics Endpoint (Prometheus)
app.get('/metrics', getMetrics);

// BullMQ Dashboard
mountBullBoard(app);

// Health check pour la production
app.get('/api/health', async (req, res) => {
  res.json(await getHealth());
});

// Inject Socket.io into requests
app.set('io', io);

// Routes CAFM
app.use('/api/auth', authRoutes);
app.use('/api/auth/mfa', require('./routes/mfa.routes'));
app.use('/api/assets', assetRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/workorders', workOrderRoutes);
app.use('/api/tickets',    ticketRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cmms', cmmsRoutes);
app.use('/api/digitaltwin', digitalTwinRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/erp', erpRoutes);
app.use('/api/bim', bimRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Routes CRM SaaS
app.use('/api/crm/auth', crmAuthRoutes);
app.use('/api/crm/contacts', crmContactRoutes);
app.use('/api/crm/deals', crmDealRoutes);

// SSE Events
const eventsRoutes = require('./routes/events.routes');
app.use('/api/crm', eventsRoutes);
global.broadcastSSE = eventsRoutes.broadcast;

// Billing Stripe (webhook)
const billingRoutes = require('./routes/billing.routes');
app.use('/api/crm/billing', billingRoutes);

// Sentry error handler
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

const { errorMiddleware } = require('./middleware/error.middleware');

// Error handling (Global)
app.use(errorMiddleware);

// WebSocket
io.on('connection', (socket) => {
  logger.info({ socketId: socket.id }, 'Client WebSocket connecté');
  socket.on('disconnect', () => logger.info({ socketId: socket.id }, 'Client WebSocket déconnecté'));
});

// Start IoT simulation (capteurs en temps réel)
startIoTSimulation(io);

// === NOUVEAU: BIM WebSocket Server ===
const { initializeWebSocket } = require('./ws/websocketServer');
initializeWebSocket(server).catch(err => {
  logger.error({ err }, 'Erreur initialisation WebSocket BIM');
});
// =====================================

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || require.main === module) {
  server.listen(PORT, () => {
    logger.info({ port: PORT, env: process.env.NODE_ENV }, '🚀 BeeCarbonat backend démarré');
  });
}

// Export de l'application pour les environnements Serverless (ex: Vercel)
module.exports = app;

