#!/bin/bash
cat << 'IOT' > backend/src/services/iot.service.js
const prisma = require('../config/database');

/**
 * Simule les capteurs IoT en générant des données en temps réel
 * pour la température, humidité, énergie, vibration
 */
const startIoTSimulation = (io) => {
  setInterval(async () => {
    try {
      const sensors = await prisma.sensor.findMany({ take: 20 });
      
      for (const sensor of sensors) {
        // Génération de valeurs réalistes selon le type
        let newValue = sensor.value;
        switch (sensor.type) {
          case 'temperature':
            newValue = 18 + Math.random() * 8; // 18-26°C
            break;
          case 'humidity':
            newValue = 40 + Math.random() * 20; // 40-60%
            break;
          case 'energy':
            newValue = Math.random() * 50; // 0-50 kWh
            break;
          case 'vibration':
            newValue = Math.random() * 10; // 0-10 mm/s
            break;
          default:
            newValue = sensor.value + (Math.random() - 0.5) * 2;
        }

        // Sauvegarder la lecture
        await prisma.sensorReading.create({
          data: { value: newValue, sensorId: sensor.id }
        });

        // Mettre à jour la valeur du capteur
        await prisma.sensor.update({
          where: { id: sensor.id },
          data: { value: newValue }
        });

        // Émettre l'événement en temps réel
        io.emit('sensor:reading', {
          sensorId: sensor.id,
          type: sensor.type,
          value: Math.round(newValue * 100) / 100,
          unit: sensor.unit,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erreur simulation IoT:', error.message);
    }
  }, 5000); // Toutes les 5 secondes
};

module.exports = { startIoTSimulation };
IOT

cat << 'RA' > backend/src/routes/auth.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authMiddleware, ctrl.getProfile);

module.exports = router;
RA

cat << 'RASS' > backend/src/routes/asset.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/asset.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/stats', ctrl.getStats);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
RASS

cat << 'RWO' > backend/src/routes/workorder.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/workorder.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);

module.exports = router;
RWO

cat << 'RDASH' > backend/src/routes/dashboard.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/kpis', ctrl.getKPIs);

module.exports = router;
RDASH

cat << 'RSTUB' > backend/src/routes/space.routes.js
const router = require('express').Router();
module.exports = router;
RSTUB

cat << 'RSTUB2' > backend/src/routes/building.routes.js
const router = require('express').Router();
module.exports = router;
RSTUB2

cat << 'RSTUB3' > backend/src/routes/maintenance.routes.js
const router = require('express').Router();
module.exports = router;
RSTUB3

cat << 'RSTUB4' > backend/src/routes/analytics.routes.js
const router = require('express').Router();
module.exports = router;
RSTUB4

cat << 'SERVER' > backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const prisma = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const assetRoutes = require('./routes/asset.routes');
const spaceRoutes = require('./routes/space.routes');
const workOrderRoutes = require('./routes/workorder.routes');
const buildingRoutes = require('./routes/building.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const { startIoTSimulation } = require('./services/iot.service');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true }
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Inject Socket.io into requests
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/workorders', workOrderRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  socket.on('disconnect', () => console.log('Client déconnecté:', socket.id));
});

// Start IoT simulation (capteurs en temps réel)
// startIoTSimulation(io); // Optional: disable it if you want to avoid log spam, but let's keep it

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(\`🚀 Serveur CAFM démarré sur le port \${PORT}\`);
});
SERVER

cat << 'SEED' > backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cafm.com' },
    update: {},
    create: {
      email: 'admin@cafm.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'CAFM',
      role: 'ADMIN',
      department: 'IT'
    }
  });

  // Technicien
  await prisma.user.upsert({
    where: { email: 'tech@cafm.com' },
    update: {},
    create: {
      email: 'tech@cafm.com',
      password: await bcrypt.hash('tech123', 12),
      firstName: 'Jean',
      lastName: 'Technicien',
      role: 'TECHNICIAN',
      department: 'Maintenance'
    }
  });

  // Bâtiments
  const building1 = await prisma.building.create({
    data: {
      name: 'Tour Horizon',
      address: '123 Avenue des Champs',
      city: 'Paris',
      country: 'France',
      totalArea: 15000,
      floors: 12,
      yearBuilt: 2018
    }
  });

  const building2 = await prisma.building.create({
    data: {
      name: 'Centre Innovation',
      address: '45 Rue de la Tech',
      city: 'Lyon',
      country: 'France',
      totalArea: 8500,
      floors: 6,
      yearBuilt: 2020
    }
  });

  // Espaces
  const spaces = [];
  for (let f = 1; f <= 5; f++) {
    for (let i = 1; i <= 8; i++) {
      spaces.push({
        name: \`Bureau \${f}.\${i.toString().padStart(2, '0')}\`,
        type: i <= 2 ? 'meeting-room' : 'office',
        floor: f,
        area: i <= 2 ? 35 : 18,
        capacity: i <= 2 ? 10 : 2,
        occupancy: Math.floor(Math.random() * (i <= 2 ? 10 : 2)),
        status: Math.random() > 0.3 ? 'occupied' : 'available',
        buildingId: building1.id
      });
    }
  }
  await prisma.space.createMany({ data: spaces });

  // Actifs
  const categories = ['HVAC', 'Electrical', 'Furniture', 'IT', 'Security'];
  const assets = [];
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const purchaseDate = new Date(2019 + Math.random() * 5, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
    const nextMaint = new Date();
    nextMaint.setDate(nextMaint.getDate() + Math.floor(Math.random() * 60));
    
    assets.push({
      name: \`\${category} #\${i + 1}\`,
      category,
      model: \`Model-\${Math.floor(Math.random() * 1000)}\`,
      serialNumber: \`SN\${Date.now()}\${i}\`,
      manufacturer: ['Siemens', 'Schneider', 'Bosch', 'Honeywell'][Math.floor(Math.random() * 4)],
      purchaseDate,
      purchasePrice: 1000 + Math.random() * 50000,
      warrantyEnd: new Date(purchaseDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000),
      location: \`Étage \${Math.ceil(Math.random() * 12)}\`,
      status: Math.random() > 0.85 ? 'MAINTENANCE' : 'OPERATIONAL',
      healthScore: 50 + Math.floor(Math.random() * 50),
      nextMaintenance: nextMaint,
      buildingId: Math.random() > 0.5 ? building1.id : building2.id,
      managerId: admin.id
    });
  }
  const createdAssets = await prisma.asset.createMany({ data: assets, returning: true });
  
  // Capteurs pour quelques actifs
  const allAssets = await prisma.asset.findMany();
  for (let i = 0; i < 15; i++) {
    const asset = allAssets[i];
    const types = ['temperature', 'humidity', 'energy', 'vibration'];
    const type = types[Math.floor(Math.random() * types.length)];
    const units = { temperature: '°C', humidity: '%', energy: 'kWh', vibration: 'mm/s' };
    const values = { temperature: 22, humidity: 50, energy: 25, vibration: 5 };
    
    await prisma.sensor.create({
      data: {
        type,
        unit: units[type],
        value: values[type],
        assetId: asset.id
      }
    });
  }

  // Baux
  await prisma.lease.createMany({
    data: [
      {
        tenant: 'Société ABC',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2026-12-31'),
        monthlyRent: 15000,
        deposit: 45000,
        buildingId: building1.id
      },
      {
        tenant: 'Startup XYZ',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2027-02-28'),
        monthlyRent: 8500,
        deposit: 25500,
        buildingId: building2.id
      }
    ]
  });

  // Ordres de travail
  const technicians = await prisma.user.findMany({ where: { role: 'TECHNICIAN' } });
  for (let i = 0; i < 20; i++) {
    const asset = allAssets[Math.floor(Math.random() * allAssets.length)];
    const types = ['PREVENTIVE', 'PREDICTIVE', 'CORRECTIVE'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    
    await prisma.workOrder.create({
      data: {
        title: \`Maintenance \${types[Math.floor(Math.random() * 3)]} - \${asset.name}\`,
        description: 'Vérification complète et remplacement si nécessaire',
        type: types[Math.floor(Math.random() * 3)],
        priority: priorities[Math.floor(Math.random() * 4)],
        status: statuses[Math.floor(Math.random() * 3)],
        estimatedCost: 200 + Math.random() * 2000,
        scheduledAt: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        assetId: asset.id,
        assignedToId: technicians[0]?.id,
        createdById: admin.id
      }
    });
  }

  // Consommation énergétique (12 derniers mois)
  const energyData = [];
  for (let m = 0; m < 12; m++) {
    const period = new Date();
    period.setMonth(period.getMonth() - m);
    energyData.push({
      buildingId: building1.id,
      type: 'electricity',
      value: 8000 + Math.random() * 4000,
      unit: 'kWh',
      cost: 1200 + Math.random() * 600,
      period
    });
    energyData.push({
      buildingId: building1.id,
      type: 'water',
      value: 200 + Math.random() * 100,
      unit: 'm³',
      cost: 300 + Math.random() * 150,
      period
    });
  }
  await prisma.energyConsumption.createMany({ data: energyData });

  console.log('✅ Base de données initialisée avec succès');
  console.log('👤 Admin: admin@cafm.com / admin123');
  console.log('🔧 Technicien: tech@cafm.com / tech123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
SEED

