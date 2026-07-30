require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const prisma = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const assetRoutes = require('./routes/asset.routes');
const spaceRoutes = require('./routes/space.routes');
const workOrderRoutes = require('./routes/workorder.routes');
const buildingRoutes = require('./routes/building.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const cmmsRoutes = require('./routes/cmms.routes');
const digitalTwinRoutes = require('./routes/digitaltwin.routes');
const notificationRoutes = require('./routes/notification.routes');
const exportRoutes = require('./routes/export.routes');
const tenantRoutes = require('./routes/tenant.routes');
const contactRoutes = require('./routes/contact.routes');
const dealRoutes = require('./routes/deal.routes');

const { startIoTSimulation } = require('./services/iot.service');
const pushService = require('./services/push.service');

const app = express();
const server = http.createServer(app);

// ============================
// CORS — ISO 27001: A.13.1.1
// ============================
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map(o => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, mobile)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ============================
// Socket.io avec Auth WS
// ISO 27001: A.9.1.2
// ============================
const io = new Server(server, { cors: corsOptions });

// Middleware d'auth WebSocket
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
  if (!token) return next(new Error('WS Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    return next();
  } catch {
    return next(new Error('WS Invalid token'));
  }
});

// ============================
// Security Middlewares
// SOC2: CC6, CC9 / ISO 27001: A.13.1.1
// ============================
app.use(cors(corsOptions));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "ws://localhost:5001", "wss://localhost:5001"],
    }
  }
}));

// HTTP request logging — SOC2: CC7 / ISO 27001: A.12.4.1
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :remote-addr'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================
// Rate Limiting — Anti Brute-Force
// SOC2: CC6 / ISO 27001: A.9.4.2
// ============================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 tentatives / 15 min
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 300, // 300 req/min
  message: { error: 'Trop de requêtes. Ralentissez.' },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/', apiLimiter);

// Inject Socket.io into requests
app.set('io', io);

// Initialiser le service de notifications
pushService.init(io);

// ============================
// Routes
// ============================
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/workorders', workOrderRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cmms', cmmsRoutes);
app.use('/api/digitaltwin', digitalTwinRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/deals', dealRoutes);

const path = require('path');

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ============================
// Error Handler Global
// SOC2: CC7 — Évite la fuite d'info (stack traces)
// ISO 27001: A.12.4.1
// ============================
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  console.error(`[ERROR] ${err.message}`, { path: req.path, method: req.method, user: req.user?.id });

  // Ne jamais retourner les stack traces en production
  const message = process.env.NODE_ENV === 'production'
    ? 'Une erreur interne est survenue.'
    : err.message;

  res.status(statusCode).json({ error: message });
});

// ============================
// WebSocket
// ============================
io.on('connection', (socket) => {
  console.log(`[WS] Client connecté: ${socket.id} | User: ${socket.user?.id || 'anon'}`);
  socket.on('disconnect', () => console.log(`[WS] Client déconnecté: ${socket.id}`));
});

// Start IoT simulation
startIoTSimulation(io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`\n🚀 Serveur CAFM démarré sur le port ${PORT}`);
  console.log(`🛡️  Sécurité : helmet ✅ | rate-limit ✅ | CORS restrictif ✅ | WS Auth ✅`);
  console.log(`📋 Audit SOC2/ISO27001 : voir audit_soc2_iso27001.md\n`);
});
