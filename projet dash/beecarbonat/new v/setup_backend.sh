#!/bin/bash
mkdir -p backend/src/config backend/src/middleware backend/src/controllers backend/src/routes backend/src/services backend/prisma

cat << 'JSON' > backend/package.json
{
  "name": "cafm-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "seed": "node prisma/seed.js"
  },
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2",
    "socket.io": "^4.7.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.3",
    "prisma": "^5.10.0"
  }
}
JSON

cat << 'ENV' > backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/cafm_db?schema=public"
JWT_SECRET="votre_cle_secrete_cafm_2024"
PORT=5000
NODE_ENV=development
ENV

cat << 'PRISMA' > backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  MANAGER
  TECHNICIAN
  VIEWER
}

enum AssetStatus {
  OPERATIONAL
  MAINTENANCE
  BREAKDOWN
  RETIRED
}

enum WorkOrderStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum WorkOrderPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum MaintenanceType {
  PREVENTIVE
  PREDICTIVE
  CORRECTIVE
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  password     String
  firstName    String
  lastName     String
  role         UserRole @default(VIEWER)
  department   String?
  avatar       String?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  workOrders   WorkOrder[] @relation("AssignedTo")
  createdWOs   WorkOrder[] @relation("CreatedBy")
  assets       Asset[]
  comments     Comment[]
}

model Building {
  id          String   @id @default(uuid())
  name        String
  address     String
  city        String
  country     String
  totalArea   Float
  floors      Int
  yearBuilt   Int
  imageUrl    String?
  createdAt   DateTime @default(now())
  
  spaces      Space[]
  assets      Asset[]
  leases      Lease[]
}

model Space {
  id           String   @id @default(uuid())
  name         String
  type         String   // office, meeting-room, common-area, storage
  floor        Int
  area         Float
  capacity     Int
  occupancy    Int      @default(0)
  status       String   @default("available") // available, occupied, maintenance
  price        Float?
  buildingId   String
  building     Building @relation(fields: [buildingId], references: [id])
  
  reservations Reservation[]
}

model Asset {
  id              String      @id @default(uuid())
  name            String
  category        String      // HVAC, electrical, furniture, IT, security
  model           String?
  serialNumber    String      @unique
  manufacturer    String?
  purchaseDate    DateTime
  purchasePrice   Float
  warrantyEnd     DateTime?
  location        String
  status          AssetStatus @default(OPERATIONAL)
  healthScore     Int         @default(100) // 0-100
  lastMaintenance DateTime?
  nextMaintenance DateTime?
  buildingId      String
  building        Building    @relation(fields: [buildingId], references: [id])
  managerId       String?
  manager         User?       @relation(fields: [managerId], references: [id])
  
  workOrders      WorkOrder[]
  sensors         Sensor[]
  maintenanceLogs MaintenanceLog[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model Sensor {
  id        String   @id @default(uuid())
  type      String   // temperature, humidity, energy, vibration
  value     Float
  unit      String
  status    String   @default("active")
  assetId   String
  asset     Asset    @relation(fields: [assetId], references: [id], onDelete: Cascade)
  readings  SensorReading[]
  createdAt DateTime @default(now())
}

model SensorReading {
  id        String   @id @default(uuid())
  value     Float
  timestamp DateTime @default(now())
  sensorId  String
  sensor    Sensor   @relation(fields: [sensorId], references: [id], onDelete: Cascade)
}

model WorkOrder {
  id          String           @id @default(uuid())
  title       String
  description String
  type        MaintenanceType
  priority    WorkOrderPriority @default(MEDIUM)
  status      WorkOrderStatus  @default(PENDING)
  estimatedCost Float?
  actualCost    Float?
  scheduledAt DateTime
  completedAt DateTime?
  
  assetId     String
  asset       Asset   @relation(fields: [assetId], references: [id])
  
  assignedToId String?
  assignedTo   User?  @relation("AssignedTo", fields: [assignedToId], references: [id])
  
  createdById  String
  createdBy    User   @relation("CreatedBy", fields: [createdById], references: [id])
  
  comments     Comment[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Comment {
  id          String    @id @default(uuid())
  content     String
  workOrderId String
  workOrder   WorkOrder @relation(fields: [workOrderId], references: [id], onDelete: Cascade)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
}

model MaintenanceLog {
  id          String   @id @default(uuid())
  description String
  cost        Float
  performedAt DateTime
  performedBy String
  assetId     String
  asset       Asset    @relation(fields: [assetId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
}

model Lease {
  id          String   @id @default(uuid())
  tenant      String
  startDate   DateTime
  endDate     DateTime
  monthlyRent Float
  deposit     Float
  status      String   @default("active")
  buildingId  String
  building    Building @relation(fields: [buildingId], references: [id])
  createdAt   DateTime @default(now())
}

model Reservation {
  id        String   @id @default(uuid())
  startTime DateTime
  endTime   DateTime
  purpose   String
  userId    String?
  spaceId   String
  space     Space    @relation(fields: [spaceId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model EnergyConsumption {
  id         String   @id @default(uuid())
  buildingId String
  type       String   // electricity, gas, water
  value      Float
  unit       String
  cost       Float
  period     DateTime
  createdAt  DateTime @default(now())
}
PRISMA

cat << 'DB' > backend/src/config/database.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});
module.exports = prisma;
DB

cat << 'MID' > backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
MID
