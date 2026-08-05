import request from 'supertest';
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
        .set('Authorization', `Bearer ${token}`);

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
});