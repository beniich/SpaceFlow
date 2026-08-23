/**
 * Tests de sécurité — Auth Controller (sans importer server.js)
 * Teste les fonctions directement pour éviter les dépendances ESM indirectes
 */

// Mock toutes les dépendances avant l'import du contrôleur
// NOTE: prisma est mocké globalement par setup.js — ne pas le re-mocker ici
jest.mock('../../lib/jwt', () => ({
  generateTokens: jest.fn().mockResolvedValue({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  }),
}));
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

const { prisma } = require('../../config/database');
const ctrl = require('../../controllers/auth.controller');

// Helper mock req/res/next
const mockReq = (body = {}) => ({ body, user: null });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const next = jest.fn();

describe('Auth Controller — Sécurité P0', () => {

  beforeEach(() => jest.clearAllMocks());

  // ─── Étape 1 : Rôle par défaut ───────────────────────────────
  describe('signup — rôle par défaut', () => {
    it('doit créer un ADMIN quand pas d\'invitation (1er user du tenant)', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(null);
      prisma.tenant.create.mockResolvedValueOnce({ id: 'tenant-123' });
      prisma.user.create.mockResolvedValueOnce({
        id: 'u-1', email: 'test@beecarbonat.com', fullName: 'Test', role: 'ADMIN', tenantId: 'tenant-123'
      });

      const req = mockReq({ email: 'test@beecarbonat.com', password: 'StrongPassword123!', fullName: 'Test' });
      const res = mockRes();
      await ctrl.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ role: 'ADMIN' }) })
      );
    });

    it('doit créer un VIEWER quand invitation fournie', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(null);
      prisma.invitation.findUnique.mockResolvedValueOnce({
        id: 'inv-1',
        role: 'VIEWER',
        tenantId: 'tenant-existing',
        expiresAt: new Date(Date.now() + 86400000),
        usedAt: null,
        tenant: { id: 'tenant-existing' }
      });
      prisma.invitation.update.mockResolvedValueOnce({});
      prisma.user.create.mockResolvedValueOnce({
        id: 'u-2', email: 'invited@beecarbonat.com', fullName: 'Invited', role: 'VIEWER', tenantId: 'tenant-existing'
      });

      const req = mockReq({
        email: 'invited@beecarbonat.com',
        password: 'StrongPassword123!',
        fullName: 'Invited',
        invitationToken: 'valid-invite-token'
      });
      const res = mockRes();
      await ctrl.signup(req, res);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ role: 'VIEWER' }) })
      );
    });

    it('doit retourner 409 si l\'email existe déjà', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 'existing' });

      const req = mockReq({ email: 'exists@beecarbonat.com', password: 'StrongPassword123!', fullName: 'X' });
      const res = mockRes();
      await ctrl.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('doit rejeter une invitation expirée (400)', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(null);
      prisma.invitation.findUnique.mockResolvedValueOnce({
        id: 'inv-expired',
        role: 'VIEWER',
        tenantId: 'tenant-1',
        expiresAt: new Date(Date.now() - 1000), // expiré
        usedAt: null,
        tenant: {}
      });

      const req = mockReq({
        email: 'new@beecarbonat.com',
        password: 'StrongPassword123!',
        fullName: 'New User',
        invitationToken: 'expired-token'
      });
      const res = mockRes();
      await ctrl.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ─── Étape 2 : Demo bypass ────────────────────────────────────
  describe('demoLogin — sécurité du mode demo', () => {
    const origEnv = { ...process.env };
    afterEach(() => { process.env = { ...origEnv }; });

    it('doit retourner 404 si ALLOW_DEMO_BYPASS=false', async () => {
      process.env.ALLOW_DEMO_BYPASS = 'false';
      process.env.NODE_ENV = 'development';

      const req = mockReq();
      const res = mockRes();
      await ctrl.demoLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('doit retourner 404 si NODE_ENV=production (même avec bypass=true)', async () => {
      process.env.ALLOW_DEMO_BYPASS = 'true';
      process.env.NODE_ENV = 'production';

      const req = mockReq();
      const res = mockRes();
      await ctrl.demoLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ─── Étape 3 : Refresh tokens ─────────────────────────────────
  describe('refresh — rotation des tokens', () => {
    it('doit retourner 400 si refreshToken manquant', async () => {
      const req = mockReq({});
      const res = mockRes();
      await ctrl.refresh(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('doit retourner 401 si le token n\'existe pas en DB', async () => {
      prisma.refreshToken.findUnique.mockResolvedValueOnce(null);
      const req = mockReq({ refreshToken: 'unknown-token' });
      const res = mockRes();
      await ctrl.refresh(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('doit retourner 401 si token révoqué', async () => {
      prisma.refreshToken.findUnique.mockResolvedValueOnce({
        id: 'rt-1', token: 'tok', revokedAt: new Date(), expiresAt: new Date(Date.now() + 9999),
        user: { id: 'u1', email: 'x@x.com', role: 'VIEWER', tenantId: 't1' }
      });
      const req = mockReq({ refreshToken: 'tok' });
      const res = mockRes();
      await ctrl.refresh(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('doit émettre une nouvelle paire si token valide (rotation)', async () => {
      prisma.refreshToken.findUnique.mockResolvedValueOnce({
        id: 'rt-1', token: 'valid-tok', revokedAt: null, expiresAt: new Date(Date.now() + 86400000),
        user: { id: 'u1', email: 'x@x.com', role: 'VIEWER', tenantId: 't1' }
      });
      prisma.refreshToken.delete.mockResolvedValueOnce({});

      const req = mockReq({ refreshToken: 'valid-tok' });
      const res = mockRes();
      await ctrl.refresh(req, res);

      expect(prisma.refreshToken.delete).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }));
    });
  });
});
