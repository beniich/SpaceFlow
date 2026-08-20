const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');

// Required for Node.js runtime (Vercel Functions)
let ws;
try {
  ws = require('ws');
  neonConfig.webSocketConstructor = ws;
} catch {
  // In Edge Runtime, WebSocket is native — no polyfill needed
}

/**
 * Creates a Prisma client adapted for Neon serverless with multi-tenant RLS.
 * Uses a singleton pattern to avoid connection exhaustion in serverless environments.
 */
function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);

  const { AsyncLocalStorage } = require('async_hooks');
  const tenantContext = new AsyncLocalStorage();

  const basePrisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  const prisma = basePrisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query, model, operation }) {
          const tenantId = tenantContext.getStore();
          const modelsWithoutTenantId = ['Tenant', 'TenantDomain'];

          if (tenantId && !modelsWithoutTenantId.includes(model)) {
            if (operation === 'create' || operation === 'createMany') {
              if (args.data) {
                if (Array.isArray(args.data)) {
                  args.data = args.data.map(d => ({ ...d, tenantId }));
                } else {
                  args.data.tenantId = tenantId;
                }
              }
            } else if (
              ['findUnique', 'findFirst', 'findMany', 'update', 'updateMany', 'delete', 'deleteMany', 'count'].includes(operation)
            ) {
              args.where = { ...args.where, tenantId };
            }
          }

          return query(args);
        },
      },
    },
  });

  return { prisma, tenantContext };
}

// Singleton for serverless (avoid exhausting connections)
const globalForPrisma = globalThis;
if (!globalForPrisma._dbClient) {
  globalForPrisma._dbClient = createPrismaClient();
}

const { prisma, tenantContext } = globalForPrisma._dbClient;

module.exports = { prisma, tenantContext };
