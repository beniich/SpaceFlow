const fs = require('fs');
const path = require('path');

const files = {
  'package.json': `{
  "name": "spaceflow-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:backend": "npm run dev --workspace=apps/backend",
    "build:backend": "npm run build --workspace=apps/backend",
    "test": "npm test --workspaces",
    "lint": "eslint ."
  },
  "engines": {
    "node": ">=20.0.0"
  }
}`,
  'docker-compose.yml': `version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: spaceflow-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: spaceflow
      POSTGRES_PASSWORD: spaceflow_dev_pwd
      POSTGRES_DB: spaceflow_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U spaceflow"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: spaceflow-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  postgres_data:
  redis_data:`,
  '.gitignore': `node_modules
dist
.env
.env.local
.env.*.local
*.log
coverage
.nyc_output
.DS_Store
.vscode
.idea
prisma/migrations/migration_lock.toml
uploads/`,
  'apps/backend/package.json': `{
  "name": "@spaceflow/backend",
  "version": "1.0.0",
  "private": true,
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon --watch src --ext ts,js src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "firebase-admin": "^12.1.0",
    "helmet": "^7.1.0",
    "ioredis": "^5.3.2",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "pino": "^8.17.2",
    "pino-pretty": "^10.3.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.11.5",
    "@types/supertest": "^6.0.2",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "nodemon": "^3.0.3",
    "prisma": "^5.10.0",
    "supertest": "^6.3.4",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}`,
  'apps/backend/tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false
  },
  "include": ["src/**/*", "prisma/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}`,
  'apps/backend/.env.example': `# Application
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:5173
API_URL=http://localhost:4000/api

# Database
DATABASE_URL=postgresql://spaceflow:spaceflow_dev_pwd@localhost:5432/spaceflow_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=CHANGEZ_CELA_PAR_UNE_CLE_ALEATOIRE_64_CARACTERES_MIN
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Firebase Admin (optionnel en dev)
# Pour dev, vous pouvez générer ces valeurs via la console Firebase
FIREBASE_PROJECT_ID=spaceflow-dev
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@spaceflow-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQ...\\n-----END PRIVATE KEY-----\\n"

# Stripe (Phase 3)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Logging
LOG_LEVEL=debug
LOG_FORMAT=pretty

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=1000`,
  'apps/backend/.gitignore': `node_modules
dist
.env
.env.local
.env.*.local
*.log
coverage
.nyc_output
.DS_Store
.vscode
.idea
prisma/migrations/migration_lock.toml
uploads/`,
  'apps/backend/prisma/schema.prisma': `// Generator & Datasource
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============== ENUMS ==============
enum UserRole {
  SUPER_ADMIN
  ORG_OWNER
  ORG_ADMIN
  MANAGER
  RECEPTIONIST
  MEMBER
  VIEWER
}

enum OrgPlan {
  FREE
  STARTER
  PRO
  ENTERPRISE
}

enum SpaceType {
  COWORKING
  PRIVATE_OFFICE
  MEETING_ROOM
  EVENT_SPACE
  STUDIO
  WORKSHOP
  PHONE_BOOTH
  COMMUNAL
}

enum SpaceStatus {
  AVAILABLE
  MAINTENANCE
  CLOSED
  COMING_SOON
}

enum AccessType {
  KEY
  KEYCARD
  QR_CODE
  BIOMETRIC
  PIN
  NFC
}

// ============== MODELS ==============

model Organization {
  id              String   @id @default(uuid())
  name            String
  slug            String   @unique
  type            String   @default("OPERATOR") // OPERATOR, NETWORK, INDEPENDENT
  
  // Contact
  email           String
  phone           String?
  website         String?
  
  // Address
  address         String?
  city            String?
  postalCode      String?
  country         String   @default("FR")
  timezone        String   @default("Europe/Paris")
  
  // Branding
  logoUrl         String?
  coverUrl        String?
  primaryColor    String   @default("#6366f1")
  description     String?  @db.Text
  
  // Subscription
  plan            OrgPlan  @default(FREE)
  planExpiresAt   DateTime?
  stripeCustomerId String?  @unique
  
  // Limits
  maxSpaces       Int      @default(1)
  maxMembers      Int      @default(50)
  maxUsers        Int      @default(3)
  features        String[]
  
  // Settings
  currency        String   @default("EUR")
  language        String   @default("fr")
  taxRate         Float    @default(20)
  invoicePrefix   String   @default("INV")
  
  // Status
  isActive        Boolean  @default(true)
  isVerified      Boolean  @default(false)
  
  // Relations
  users           User[]
  spaces          Space[]
  members         Member[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([slug])
  @@index([plan])
}

model User {
  id              String   @id @default(uuid())
  email           String   @unique
  password        String?
  firebaseUid     String?  @unique
  
  firstName       String
  lastName        String
  avatar          String?
  phone           String?
  
  role            UserRole @default(MEMBER)
  isActive        Boolean  @default(true)
  emailVerified   Boolean  @default(false)
  lastLoginAt     DateTime?
  
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Auth
  twoFactorEnabled Boolean  @default(false)
  twoFactorSecret  String?
  
  // Préférences notif
  emailNotifications Boolean @default(true)
  pushNotifications  Boolean @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([email])
  @@index([organizationId])
}

model Space {
  id              String   @id @default(uuid())
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Identification
  name            String
  code            String?
  description     String?  @db.Text
  type            SpaceType
  status          SpaceStatus @default(AVAILABLE)
  
  // Adresse
  address         String?
  city            String?
  postalCode      String?
  floor            Int?
  
  // Caractéristiques
  capacity        Int      // nb personnes
  surface         Float?
  amenities       String[]
  
  // Tarification (en cents pour éviter les floats)
  hourlyRateCents      Int?
  dailyRateCents       Int?
  halfDayRateCents     Int?
  weeklyRateCents      Int?
  monthlyRateCents    Int?
  cleaningFeeCents     Int     @default(0)
  
  // Horaires
  openingTime     String?  // "08:00"
  closingTime     String?  // "20:00"
  availableDays   Int[]    @default([1,2,3,4,5])
  
  // Photos
  coverPhoto      String?
  
  // Accès
  accessType      AccessType @default(KEY)
  accessCode      String?  @unique
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
  @@index([type])
  @@index([status])
}

model Member {
  id              String   @id @default(uuid())
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Identity
  firstName       String?
  lastName        String?
  companyName     String?
  
  // Contact
  email           String   @unique
  phone           String?
  
  // Profile
  avatar          String?
  jobTitle        String?
  company         String?
  
  // Status
  status          String   @default("ACTIVE")
  rating          Int      @default(5)
  isVip            Boolean  @default(false)
  
  // Marketing
  referralCode    String   @unique
  
  // Stats
  totalBookings   Int      @default(0)
  totalSpentCents  Int     @default(0)
  
  // Relations
  user            User?    // Si aussi user de l'app
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([organizationId])
  @@index([email])
  @@index([referralCode])
}`,
  'apps/backend/prisma/seed.ts': `import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SpaceFlow database...');

  // Nettoyer
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Organisation de démo
  const org = await prisma.organization.create({
    data: {
      name: 'SpaceFlow Demo',
      slug: 'spaceflow-demo',
      type: 'OPERATOR',
      email: 'demo@spaceflow.com',
      phone: '+33123456789',
      address: '15 rue de la Innovation',
      city: 'Paris',
      postalCode: '75002',
      country: 'FR',
      plan: 'PRO',
      maxSpaces: 10,
      maxMembers: 500,
      maxUsers: 10,
      description: 'Espace de coworking moderne au cœur de Paris'
    }
  });

  // User admin
  const hashedPassword = await bcrypt.hash('demo123!', 12);
  const user = await prisma.user.create({
    data: {
      email: 'demo@spaceflow.com',
      password: hashedPassword,
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'ORG_OWNER',
      organizationId: org.id,
      emailVerified: true
    }
  });

  // Quelques spaces de démo
  await prisma.space.createMany({
    data: [
      {
        organizationId: org.id,
        name: 'Espace Open Space',
        code: 'OPEN-01',
        type: 'COWORKING',
        status: 'AVAILABLE',
        address: '15 rue de la Innovation',
        city: 'Paris',
        capacity: 20,
        surface: 80.5,
        hourlyRateCents: 500,  // 5€/h
        dailyRateCents: 2500,  // 25€/jour
        monthlyRateCents: 29000, // 290€/mois
        openingTime: '08:00',
        closingTime: '20:00',
        availableDays: [1, 2, 3, 4, 5],
        amenities: ['wifi', 'coffee', 'printer', 'phone_booth'],
        description: 'Grand espace ouvert avec lumière naturelle'
      },
      {
        organizationId: org.id,
        name: 'Salle Réunion Atlas',
        code: 'MEET-A',
        type: 'MEETING_ROOM',
        status: 'AVAILABLE',
        capacity: 8,
        surface: 25,
        hourlyRateCents: 1200, // 12€/h
        dailyRateCents: 5000,
        openingTime: '08:00',
        closingTime: '20:00',
        amenities: ['wifi', 'screen', 'whiteboard'],
        description: 'Salle de réunion équipée écran 4K'
      },
      {
        organizationId: org.id,
        name: 'Bureau Privé Da Vinci',
        code: 'OFFICE-01',
        type: 'PRIVATE_OFFICE',
        status: 'AVAILABLE',
        capacity: 4,
        surface: 18,
        monthlyRateCents: 120000, // 1200€/mois
        amenities: ['wifi', 'desk', 'chair', 'locker'],
        description: 'Bureau fermé pour 4 personnes'
      }
    ]
  });

  // Quelques members de démo
  await prisma.member.createMany({
    data: [
      {
        organizationId: org.id,
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean.martin@example.com',
        company: 'Startup.io',
        jobTitle: 'CEO',
        totalBookings: 12,
        totalSpentCents: 35000
      },
      {
        organizationId: org.id,
        companyName: 'Acme Corp',
        email: 'contact@acme.com',
        jobTitle: 'Team Lead',
        totalBookings: 25,
        totalSpentCents: 89000
      }
    ]
  });

  console.log('✅ Seed completed');
  console.log(\`   Organization: \${org.name}\`);
  console.log(\`   Admin: \${user.email} / demo123!\`);
  console.log(\`   3 spaces, 2 members created\`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());`,
  'apps/backend/src/config/database.ts': `import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { prisma };`,
  'apps/backend/src/config/redis.ts': `import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});`,
  'apps/backend/src/config/logger.ts': `import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'production' 
    ? undefined 
    : { 
        target: 'pino-pretty', 
        options: { 
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname' 
        } 
      },
  base: { service: 'spaceflow-backend' },
  timestamp: pino.stdTimeFunctions.isoTime,
});`,
  'apps/backend/src/config/firebase.ts': `import admin from 'firebase-admin';
import { logger } from './logger';

let initialized = false;

function initializeFirebase() {
  if (initialized) return admin;

  if (!process.env.FIREBASE_PROJECT_ID || 
      !process.env.FIREBASE_CLIENT_EMAIL || 
      !process.env.FIREBASE_PRIVATE_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('❌ Firebase credentials required in production');
    }
    logger.warn('⚠️  Firebase not configured - auth will not work');
    return null;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\\\n/g, '\\n'),
      }),
    });
    initialized = true;
    logger.info('✅ Firebase Admin initialized');
    return admin;
  } catch (err) {
    logger.error('❌ Firebase init error:', err);
    throw err;
  }
}

initializeFirebase();

export { admin as firebaseAdmin };`,
  'apps/backend/src/config/cors.ts': `export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = (process.env.APP_URL || 'http://localhost:5173')
      .split(',')
      .map(o => o.trim());
      
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.warn(\`⚠️  CORS blocked: \${origin}\`);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400,
};`,
  'apps/backend/src/middleware/auth.middleware.ts': `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Vérifier que l'user existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { organization: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
    
    next();
  } catch (error) {
    logger.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};`,
  'apps/backend/src/middleware/tenant.middleware.ts': `import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export const tenantMiddleware = async (
  req: any, 
  res: Response, 
  next: NextFunction
) => {
  if (!req.user?.organizationId) {
    return res.status(401).json({ error: 'No organization context' });
  }

  // Vérifier que l'org existe et est active
  const org = await prisma.organization.findUnique({
    where: { id: req.user.organizationId },
    select: { id: true, isActive: true, plan: true, planExpiresAt: true }
  });

  if (!org || !org.isActive) {
    return res.status(403).json({ error: 'Organization inactive' });
  }

  // Vérifier expiration du plan
  if (org.planExpiresAt && new Date() > org.planExpiresAt && org.plan !== 'FREE') {
    // TODO: downgrader vers FREE automatiquement
    logger.warn(\`Organization \${org.id} plan expired\`);
  }

  req.organization = org;
  next();
};`,
  'apps/backend/src/middleware/rate-limit.middleware.ts': `import rateLimit from 'express-rate-limit';
import { redis } from '../config/redis';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes' }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Trop de tentatives de connexion' }
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 3,
  message: { error: 'Limite d\\'inscription atteinte' }
});`,
  'apps/backend/src/middleware/error.middleware.ts': `import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}

export const errorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log l'erreur
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode
  });

  // Réponse
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } else {
    // Erreur inconnue - ne pas leak les détails
    logger.error('💥 UNKNOWN ERROR:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: \`Route not found: \${req.originalUrl}\` });
};`,
  'apps/backend/src/utils/jwt.ts': `import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';

export interface JWTPayload {
  userId: string;
  organizationId: string;
  role: string;
  email: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch (err) {
    logger.error('JWT verify error:', err);
    throw new Error('Invalid token');
  }
};`,
  'apps/backend/src/controllers/auth.controller.ts': `import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { firebaseAdmin } from '../config/firebase';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// ============== SCHEMAS ==============
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organizationName: z.string().min(1),
  organizationType: z.enum(['OPERATOR', 'NETWORK', 'INDEPENDENT']).default('OPERATOR')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const firebaseLoginSchema = z.object({
  idToken: z.string(),
  organizationName: z.string().optional()
});

const refreshSchema = z.object({
  refreshToken: z.string()
});

// ============== HELPERS ==============
const generateUniqueSlug = (name: string): string => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 40);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return \`\${baseSlug}-\${randomSuffix}\`;
};

// ============== CONTROLLERS ==============

/**
 * POST /api/auth/register
 * Inscription classique email/password
 */
export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    // Vérifier si email existe déjà
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (existing) {
      throw new AppError('Email already registered', 400);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Créer org + user en transaction
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug: generateUniqueSlug(data.organizationName),
          type: data.organizationType,
          email: data.email,
          plan: 'FREE',
          maxSpaces: 1,
          maxMembers: 50,
          maxUsers: 3
        }
      });

      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'ORG_OWNER',
          organizationId: organization.id
        }
      });

      return { organization, user };
    });

    // Générer tokens
    const tokenPayload = {
      userId: result.user.id,
      organizationId: result.organization.id,
      role: result.user.role,
      email: result.user.email
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    logger.info(\`✅ New user registered: \${data.email}\`);

    res.status(201).json({
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        organization: {
          id: result.organization.id,
          name: result.organization.name,
          slug: result.organization.slug
        }
      },
      token,
      refreshToken
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: err.errors 
      });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    logger.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * POST /api/auth/login
 * Connexion email/password
 */
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { organization: true }
    });

    if (!user || !user.password) {
      throw new AppError('Invalid credentials', 401);
    }

    // Vérifier password
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account disabled', 403);
    }

    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Tokens
    const tokenPayload = {
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      email: user.email
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    logger.info(\`✅ User logged in: \${user.email}\`);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
          plan: user.organization.plan
        }
      },
      token,
      refreshToken
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    logger.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * POST /api/auth/firebase
 * Login via Firebase (Google, Apple, etc.)
 */
export const firebaseLogin = async (req: Request, res: Response) => {
  try {
    if (!firebaseAdmin) {
      throw new AppError('Firebase not configured', 500);
    }

    const { idToken, organizationName } = firebaseLoginSchema.parse(req.body);

    // Vérifier le token Firebase
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { email, name, uid, picture } = decoded;

    if (!email) {
      throw new AppError('Email required from Firebase', 400);
    }

    // Chercher ou créer user
    let user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user) {
      // Créer nouvel user + organization
      const [firstName, ...lastNameParts] = (name || email.split('@')[0]).split(' ');
      const lastName = lastNameParts.join(' ') || 'User';

      const orgName = organizationName || \`\${firstName}'s Workspace\`;

      const result = await prisma.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            name: orgName,
            slug: generateUniqueSlug(orgName),
            type: 'OPERATOR',
            email,
            plan: 'FREE',
            maxSpaces: 1,
            maxMembers: 50,
            maxUsers: 3
          }
        });

        const newUser = await tx.user.create({
          data: {
            email,
            firebaseUid: uid,
            firstName,
            lastName,
            avatar: picture,
            role: 'ORG_OWNER',
            emailVerified: true,
            organizationId: org.id
          }
        });

        return { user: newUser, organization: org };
      });

      user = await prisma.user.findUnique({
        where: { id: result.user.id },
        include: { organization: true }
      });

      logger.info(\`✅ New Firebase user: \${email}\`);
    } else {
      logger.info(\`✅ Firebase user login: \${email}\`);
    }

    if (!user) {
      throw new AppError('User creation failed', 500);
    }

    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Tokens
    const tokenPayload = {
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      email: user.email
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
          plan: user.organization.plan
        }
      },
      token,
      refreshToken
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    logger.error('Firebase login error:', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * POST /api/auth/refresh
 * Rafraîchir le token
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const decoded = verifyToken(refreshToken);

    // Vérifier que l'user existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid user', 401);
    }

    const tokenPayload = {
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      email: user.email
    };

    const newToken = generateToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

/**
 * GET /api/auth/me
 * Récupérer l'utilisateur courant
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            logoUrl: true,
            primaryColor: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization
      }
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to get user' });
  }
};

/**
 * POST /api/auth/logout
 * Logout (côté client principalement)
 */
export const logout = async (req: AuthRequest, res: Response) => {
  // En JWT, le logout se fait côté client (suppression du token)
  // On peut logger l'action
  if (req.user) {
    logger.info(\`User logged out: \${req.user.email}\`);
  }
  res.json({ message: 'Logged out' });
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // TODO: Envoyer email de reset
    // Pour l'instant, juste logger
    logger.info(\`Password reset requested for: \${email}\`);

    // Toujours retourner 200 (sécurité)
    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process request' });
  }
};`,
  'apps/backend/src/routes/auth.routes.ts': `import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { tenantMiddleware } from '../middleware/tenant.middleware';
import { authLimiter, registerLimiter } from '../middleware/rate-limit.middleware';
import * as authCtrl from '../controllers/auth.controller';

const router = Router();

// Routes publiques
router.post('/register', registerLimiter, authCtrl.register);
router.post('/login', authLimiter, authCtrl.login);
router.post('/firebase', authLimiter, authCtrl.firebaseLogin);
router.post('/refresh', authCtrl.refresh);
router.post('/forgot-password', authCtrl.forgotPassword);

// Routes protégées
router.get('/me', authMiddleware, tenantMiddleware, authCtrl.getMe);
router.post('/logout', authMiddleware, authCtrl.logout);

export default router;`,
  'apps/backend/src/app.ts': `import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { errorHandler, notFound } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rate-limit.middleware';
import { logger } from './config/logger';
import authRoutes from './routes/auth.routes';
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
  
  // TODO Phase suivante :
  // app.use('/api/spaces', spaceRoutes);
  // app.use('/api/members', memberRoutes);

  // 404
  app.use(notFound);

  // Error handler (DOIT être en dernier)
  app.use(errorHandler);

  return app;
};`,
  'apps/backend/src/server.ts': `import { createApp } from './app';
import { logger } from './config/logger';
import { prisma } from './config/database';
import { redis } from './config/redis';

const PORT = parseInt(process.env.PORT || '4000', 10);
const app = createApp();

// ============== VALIDATION PRODUCTION ==============
if (process.env.NODE_ENV === 'production') {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'APP_URL'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    logger.error(\`❌ Missing required env vars: \${missing.join(', ')}\`);
    process.exit(1);
  }
}

// ============== STARTUP ==============
async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    logger.info('✅ Database connected');

    // Test Redis
    await redis.ping();
    logger.info('✅ Redis connected');

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(\`🚀 SpaceFlow API running on http://localhost:\${PORT}\`);
      logger.info(\`📍 Health: http://localhost:\${PORT}/api/health\`);
      logger.info(\`🔐 Auth: http://localhost:\${PORT}/api/auth/login\`);
      logger.info(\`🌍 Env: \${process.env.NODE_ENV}\`);
    });
  } catch (err) {
    logger.error('❌ Startup failed:', err);
    process.exit(1);
  }
}

startServer();

// ============== GRACEFUL SHUTDOWN ==============
const shutdown = async (signal: string) => {
  logger.info(\`\\n⚠️  \${signal} received, shutting down...\`);
  
  try {
    await prisma.$disconnect();
    logger.info('✅ Database disconnected');
    await redis.quit();
    logger.info('✅ Redis disconnected');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Shutdown error:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Uncaught errors
process.on('unhandledRejection', (err) => {
  logger.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  logger.error('❌ Uncaught Exception:', err);
  process.exit(1);
});`,
  'apps/backend/jest.config.js': `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/config/firebase.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 30000,
  setupFilesAfterEach: ['./tests/setup.ts']
};`,
  'apps/backend/tests/setup.ts': `import { prisma } from '../src/config/database';

beforeEach(async () => {
  // Nettoyer la DB avant chaque test
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});`,
  'apps/backend/tests/auth.test.ts': `import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/database';

const app = createApp();

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@spaceflow.com',
          password: 'Test1234!',
          firstName: 'Test',
          lastName: 'User',
          organizationName: 'Test Coworking',
          organizationType: 'OPERATOR'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body.user.email).toBe('test@spaceflow.com');
      expect(res.body.user.organization.name).toBe('Test Coworking');
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'dup@spaceflow.com',
        password: 'Test1234!',
        firstName: 'Dup',
        lastName: 'Test',
        organizationName: 'Dup Test'
      };

      await request(app).post('/api/auth/register').send(userData);
      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email already registered');
    });

    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test1234!',
          firstName: 'Test',
          lastName: 'User',
          organizationName: 'Test'
        });

      expect(res.status).toBe(400);
    });

    it('should require password min 8 chars', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'short@spaceflow.com',
          password: '123',
          firstName: 'Test',
          lastName: 'User',
          organizationName: 'Test'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@spaceflow.com',
          password: 'Test1234!',
          firstName: 'Login',
          lastName: 'Test',
          organizationName: 'Login Test'
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@spaceflow.com',
          password: 'Test1234!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@spaceflow.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should reject unknown user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@spaceflow.com',
          password: 'Test1234!'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'me@spaceflow.com',
          password: 'Test1234!',
          firstName: 'Me',
          lastName: 'Test',
          organizationName: 'Me Test'
        });
      token = res.body.token;
    });

    it('should return current user', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', \`Bearer \${token}\`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('me@spaceflow.com');
    });

    it('should reject without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(res.status).toBe(401);
    });
  });
});`
};

const rootDir = process.argv[2] || process.cwd();

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(rootDir, relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log(\`Created \${fullPath}\`);
}
