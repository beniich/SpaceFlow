require('dotenv').config();
require('./config/opentelemetry'); // Initialisation OpenTelemetry AVANT require express
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const prisma = require('./config/database');
const swaggerRoutes = require('./routes/swagger.routes');
const { sanitizeInput, apiLimiter } = require('./middleware/security.middleware');
const { initSentry, Sentry } = require('./config/sentry');

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], credentials: true }
});

// Redis Adapter pour Socket.io
const { createAdapter } = require('@socket.io/redis-adapter');
const { connection } = require('./config/redis');
const pubClient = connection;
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

// Initialize Sentry early
initSentry(app);

// Sentry request handler if available
if (Sentry && Sentry.Handlers && typeof Sentry.Handlers.requestHandler === 'function') {
  app.use(Sentry.Handlers.requestHandler());
}
if (Sentry && Sentry.Handlers && typeof Sentry.Handlers.tracingHandler === 'function') {
  app.use(Sentry.Handlers.tracingHandler());
}

const authRoutes = require('./routes/auth.routes');
const assetRoutes = require('./routes/asset.routes');
const spaceRoutes = require('./routes/space.routes');
const workOrderRoutes = require('./routes/workorder.routes');
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
const floorRoutes = require('./routes/floor.routes');
const contractRoutes = require('./routes/contract.routes');
const energyRoutes = require('./routes/energy.routes');
const crmAuthRoutes = require('./routes/crm.auth.routes');
const crmContactRoutes = require('./routes/crm.contact.routes');
const crmDealRoutes = require('./routes/crm.deal.routes');
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
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", process.env.CORS_ORIGIN || "http://localhost:5173"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

// ============== SÉCURITÉ GLOBALE ==============
app.use(sanitizeInput);
app.use('/api/', apiLimiter);

// ============== DOCUMENTATION ==============
app.use('/', swaggerRoutes);

// Health check pour la production
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '2.1.0',
    uptime: process.uptime()
  });
});

// Inject Socket.io into requests
app.set('io', io);

// Routes CAFM
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/workorders', workOrderRoutes);
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
app.use('/api/floors', floorRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/energy', energyRoutes);

// Routes CRM SaaS
app.use('/api/crm/auth', crmAuthRoutes);
app.use('/api/crm/contacts', crmContactRoutes);
app.use('/api/crm/deals', crmDealRoutes);
app.use('/api/crm/analytics', require('./routes/crm.analytics.routes'));

// SSE Events
const eventsRoutes = require('./routes/events.routes');
app.use('/api/crm', eventsRoutes);
global.broadcastSSE = eventsRoutes.broadcast;

// Billing Stripe (webhook)
const billingRoutes = require('./routes/billing.routes');
app.use('/api/crm/billing', billingRoutes);

// Sentry error handler if available
if (Sentry && Sentry.Handlers && typeof Sentry.Handlers.errorHandler === 'function') {
  app.use(Sentry.Handlers.errorHandler());
}

// Error handling (Global)
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// WebSocket - Namespaces par Tenant
const tenantNamespaces = io.of(/^\/tenant-[a-zA-Z0-9-]+$/);
tenantNamespaces.on('connection', (socket) => {
  const tenantId = socket.nsp.name.replace('/tenant-', '');
  console.log(`Client connecté au tenant ${tenantId}:`, socket.id);
  
  // Rejoindre des rooms spécifiques si nécessaire (ex: notifications, IoT)
  socket.on('subscribe', (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} (tenant ${tenantId}) a rejoint la room: ${room}`);
  });

  socket.on('disconnect', () => console.log(`Client déconnecté (tenant ${tenantId}):`, socket.id));
});

// Fallback / root (legacy ou global)
io.on('connection', (socket) => {
  console.log('Client connecté (global):', socket.id);
  socket.on('disconnect', () => console.log('Client déconnecté (global):', socket.id));
});

// Start IoT simulation (capteurs en temps réel)
startIoTSimulation(io);

const PORT = process.env.BACKEND_PORT || 8081;

if (process.env.NODE_ENV !== 'production' || require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 Serveur CAFM démarré sur le port ${PORT}`);
  });
}

// Export de l'application pour les environnements Serverless (ex: Vercel)
module.exports = app;
