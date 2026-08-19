const authController = require('../../controllers/auth.controller');
const prisma = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockReq = (body = {}, user = null) => ({
  body,
  user,
  headers: {},
});
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  describe('login()', () => {
    it('retourne 200 + token si credentials valides', async () => {
      const user = {
        id: 'uuid-1',
        email: 'admin@cafm.com',
        password: '$2b$12$hashedpwd',
        firstName: 'Admin',
        lastName: 'Test',
        role: 'ADMIN',
        isActive: true,
        organization: { id: 'org-1', name: 'CAFM Inc' },
      };

      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-jwt-token');

      const req = mockReq({ email: 'admin@cafm.com', password: 'admin123' });
      const res = mockRes();

      await authController.login(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { email: 'admin@cafm.com' } })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'mock-jwt-token' })
      );
    });

    it('retourne 401 si user introuvable', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const req = mockReq({ email: 'ghost@test.com', password: 'wrong' });
      const res = mockRes();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });

    it('retourne 401 si mot de passe incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        email: 'admin@cafm.com',
        password: '$2b$12$hashedpwd',
        isActive: true,
      });
      bcrypt.compare.mockResolvedValue(false);

      const req = mockReq({ email: 'admin@cafm.com', password: 'wrongpass' });
      const res = mockRes();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('retourne 401 si compte inactif', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        email: 'admin@cafm.com',
        password: '$2b$12$hashedpwd',
        isActive: false,
      });
      bcrypt.compare.mockResolvedValue(true);

      const req = mockReq({ email: 'admin@cafm.com', password: 'admin123' });
      const res = mockRes();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  // ─── REGISTER ─────────────────────────────────────────────────────────────
  describe('register()', () => {
    it('retourne 201 si inscription réussie', async () => {
      const newUser = {
        id: 'uuid-new',
        email: 'new@cafm.com',
        firstName: 'New',
        lastName: 'User',
        role: 'VIEWER',
      };

      prisma.user.findUnique.mockResolvedValue(null); // aucun user existant
      prisma.user.create.mockResolvedValue(newUser);
      bcrypt.hash.mockResolvedValue('$2b$12$hashednew');
      jwt.sign.mockReturnValue('new-jwt-token');

      const req = mockReq({
        email: 'new@cafm.com',
        password: 'Password123!',
        firstName: 'New',
        lastName: 'User',
      });
      const res = mockRes();

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'new-jwt-token' })
      );
    });

    it('retourne 400 si email déjà utilisé', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing', email: 'existing@cafm.com' });

      const req = mockReq({
        email: 'existing@cafm.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      });
      const res = mockRes();

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ─── GET PROFILE ─────────────────────────────────────────────────────────
  describe('getProfile()', () => {
    it('retourne le profil de l\'utilisateur connecté', async () => {
      const user = {
        id: 'uuid-1',
        email: 'admin@cafm.com',
        firstName: 'Admin',
        lastName: 'Test',
        role: 'ADMIN',
        organization: { id: 'org-1', name: 'CAFM Inc' },
      };
      prisma.user.findUnique.mockResolvedValue(user);

      const req = mockReq({}, { id: 'uuid-1' });
      const res = mockRes();

      await authController.getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ email: 'admin@cafm.com' }));
    });
  });
});
