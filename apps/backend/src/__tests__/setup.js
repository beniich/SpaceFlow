// Global test setup
process.env.JWT_SECRET = 'test-secret-32-chars-minimum-required-yes';
process.env.NODE_ENV = 'test';
process.env.ALLOW_DEMO_BYPASS = 'false';

jest.setTimeout(15000);

// Mock Prisma globally
jest.mock('../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    asset: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    workOrder: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    contact: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    deal: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    notification: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    building: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    tenant: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    subscriptionInvoice: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    processedWebhookEvent: {
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    invitation: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    ticket: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    auditEvent: {
      create: jest.fn(),
    },
    $transaction: jest.fn((fn) => fn({
      user: { findUnique: jest.fn(), create: jest.fn() },
    })),
  }
}));

// Mock Sentry (v10 API)
jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setupExpressErrorHandler: jest.fn(),
  httpIntegration: jest.fn(() => ({})),
  expressIntegration: jest.fn(() => ({})),
}));

// Mock Firebase Admin Service
jest.mock('../services/firebase-admin.service', () => ({
  verifyFirebaseToken: jest.fn().mockResolvedValue({
    email: 'admin@cafm.com',
    name: 'Admin User',
    uid: 'firebase-uid-admin-1',
  }),
}));

