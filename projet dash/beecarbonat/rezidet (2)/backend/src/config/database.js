const { PrismaClient } = require('@prisma/client');
const tenantStorage = require('./tenantStorage');

const basePrisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const tenantId = tenantStorage.getStore();
        
        const globalModels = ['Tenant', 'User', 'AuditLog', 'NotificationPreference', 'TenantConfig', 'TenantDomain'];
        
        if (tenantId && !globalModels.includes(model)) {
          if (!args) args = {};
          args.where = { ...args.where, tenantId };
        }
        return query(args);
      }
    }
  }
});

module.exports = prisma;
