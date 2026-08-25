const { PLANS, getOrCreateTenantCustomer, createCheckoutSession } = require('../services/stripe.service');
const { requireFeature, checkQuota } = require('../middleware/billing.middleware');
const { prisma } = require('../config/database');

describe('Stripe Service & Billing Multi-Tenant', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PLANS configuration', () => {
    it('should define all 5 tiers correctly', () => {
      expect(PLANS.FREE).toBeDefined();
      expect(PLANS.STARTER).toBeDefined();
      expect(PLANS.PRO).toBeDefined();
      expect(PLANS.BUSINESS).toBeDefined();
      expect(PLANS.ENTERPRISE).toBeDefined();
    });

    it('should have correct quotas for FREE tier', () => {
      expect(PLANS.FREE.quotas.maxUsers).toBe(3);
      expect(PLANS.FREE.quotas.maxAssets).toBe(10);
      expect(PLANS.FREE.quotas.maxTicketsPerMonth).toBe(50);
      expect(PLANS.FREE.features.bim).toBe(false);
    });

    it('should have correct features for PRO tier', () => {
      expect(PLANS.PRO.features.bim).toBe(true);
      expect(PLANS.PRO.features.apiKeys).toBe(true);
      expect(PLANS.PRO.features.multiSite).toBe(true);
    });
  });

  describe('createCheckoutSession (Simulation / Fallback Mode)', () => {
    it('should create simulated checkout for valid plan', async () => {
      const mockTenant = { id: 'tenant-123', name: 'Acme Corp', slug: 'acme' };
      const mockUser = { id: 'user-1', email: 'admin@acme.com' };

      const result = await createCheckoutSession({
        tenant: mockTenant,
        user: mockUser,
        planKey: 'PRO',
        interval: 'MONTHLY'
      });

      expect(result).toHaveProperty('sessionId');
      expect(result).toHaveProperty('url');
      expect(result.url).toContain('plan=PRO');
    });

    it('should throw error for unknown plan', async () => {
      const mockTenant = { id: 'tenant-123' };
      await expect(
        createCheckoutSession({ tenant: mockTenant, planKey: 'UNKNOWN' })
      ).rejects.toThrow('Plan inconnu: UNKNOWN');
    });
  });

  describe('Billing Middleware - requireFeature', () => {
    it('should block access if feature is not in tenant plan', async () => {
      const req = {
        user: { tenantId: 'tenant-free' },
        headers: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      prisma.tenant.findUnique.mockResolvedValueOnce({
        id: 'tenant-free',
        plan: 'FREE',
        features: { bim: false }
      });

      const middleware = requireFeature('bim');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'FEATURE_NOT_AVAILABLE' })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow access if feature is enabled in tenant plan', async () => {
      const req = {
        user: { tenantId: 'tenant-pro' },
        headers: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      prisma.tenant.findUnique.mockResolvedValueOnce({
        id: 'tenant-pro',
        plan: 'PRO',
        features: { bim: true }
      });

      const middleware = requireFeature('bim');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Billing Middleware - checkQuota', () => {
    it('should block resource creation if maxUsers quota exceeded', async () => {
      const req = {
        user: { tenantId: 'tenant-free' },
        headers: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      prisma.tenant.findUnique.mockResolvedValueOnce({
        id: 'tenant-free',
        plan: 'FREE',
        maxUsers: 3
      });
      prisma.user.count.mockResolvedValueOnce(3);

      const middleware = checkQuota('users');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'QUOTA_EXCEEDED', quota: 'users' })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow resource creation if quota not reached', async () => {
      const req = {
        user: { tenantId: 'tenant-free' },
        headers: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      prisma.tenant.findUnique.mockResolvedValueOnce({
        id: 'tenant-free',
        plan: 'FREE',
        maxUsers: 3
      });
      prisma.user.count.mockResolvedValueOnce(1);

      const middleware = checkQuota('users');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
