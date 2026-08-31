const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { prisma } = require('../config/database');
const { verifyFirebaseToken } = require('../services/firebase-admin.service');

describe('Auth Middleware Security Tests', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  test('should return 401 if Authorization header is missing', async () => {
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should block demo bypass token when ALLOW_DEMO_BYPASS is false', async () => {
    process.env.ALLOW_DEMO_BYPASS = 'false';
    req.headers.authorization = 'Bearer jwt-demo-token';

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'BYPASS_DISABLED'
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should authenticate valid user via Firebase token and Prisma DB lookup', async () => {
    req.headers.authorization = 'Bearer valid-firebase-token';
    verifyFirebaseToken.mockResolvedValueOnce({ email: 'user@example.com' });
    
    prisma.user.findUnique.mockResolvedValueOnce({
      id: 'usr-123',
      email: 'user@example.com',
      role: 'ADMIN',
      tenantId: 'tenant-123'
    });

    await authMiddleware(req, res, next);

    expect(verifyFirebaseToken).toHaveBeenCalledWith('valid-firebase-token');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
      select: { id: true, role: true, email: true, tenantId: true }
    });
    expect(req.user).toEqual({
      id: 'usr-123',
      email: 'user@example.com',
      role: 'ADMIN',
      tenantId: 'tenant-123'
    });
    expect(next).toHaveBeenCalled();
  });

  describe('RBAC requireRole middleware', () => {
    test('should allow user with authorized role', () => {
      req.user = { id: 'usr-1', role: 'ADMIN' };
      const guard = requireRole('ADMIN', 'SUPERADMIN');
      guard(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('should reject user with unauthorized role', () => {
      req.user = { id: 'usr-1', role: 'USER' };
      const guard = requireRole('ADMIN', 'SUPERADMIN');
      guard(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Accès refusé pour ce rôle' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
