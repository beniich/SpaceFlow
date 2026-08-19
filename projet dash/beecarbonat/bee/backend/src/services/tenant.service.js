const prisma = require('../config/database');

class TenantService {
  async getTenant(id) {
    return prisma.tenant.findUnique({
      where: { id },
      include: {
        tenantConfigs: true,
        tenantDomains: true,
        _count: {
          select: {
            users: true,
            buildings: true,
            assets: true,
            parts: true
          }
        }
      }
    });
  }

  async getAllTenants() {
    return prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            buildings: true,
            assets: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createTenant(data) {
    const { name, slug, plan, logo } = data;
    return prisma.tenant.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        plan: plan || 'ENTERPRISE',
        logo
      }
    });
  }

  async updateTenant(id, data) {
    return prisma.tenant.update({
      where: { id },
      data
    });
  }

  async setConfig(tenantId, key, value) {
    return prisma.tenantConfig.upsert({
      where: { tenantId_key: { tenantId, key } },
      update: { value },
      create: { tenantId, key, value }
    });
  }

  async addDomain(tenantId, domain) {
    return prisma.tenantDomain.create({
      data: { tenantId, domain }
    });
  }
}

module.exports = new TenantService();
