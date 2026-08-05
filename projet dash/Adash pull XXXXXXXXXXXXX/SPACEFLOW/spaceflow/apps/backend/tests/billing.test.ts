import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../config/database';

const app = createApp();

describe('Billing API', () => {
  let token: string;

  beforeEach(async () => {
    await prisma.subscription.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@spaceflow.com',
        password: 'Test1234!',
        firstName: 'Test',
        lastName: 'User',
        organizationName: 'Test Space'
      });
    token = res.body.token;
  });

  describe('GET /api/billing/plans', () => {
    it('should return all plans', async () => {
      const res = await request(app).get('/api/billing/plans');
      
      expect(res.status).toBe(200);
      expect(res.body.plans).toBeInstanceOf(Array);
      expect(res.body.plans.length).toBeGreaterThan(0);
      expect(res.body.plans[0]).toHaveProperty('id');
      expect(res.body.plans[0]).toHaveProperty('price');
    });
  });

  describe('GET /api/billing/subscription', () => {
    it('should return current subscription', async () => {
      const res = await request(app)
        .get('/api/billing/subscription')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.subscription).toHaveProperty('plan');
    });

    it('should require auth', async () => {
      const res = await request(app).get('/api/billing/subscription');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/billing/checkout', () => {
    it('should require plan', async () => {
      const res = await request(app)
        .post('/api/billing/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      
      expect(res.status).toBe(400);
    });

    it('should reject invalid plan', async () => {
      const res = await request(app)
        .post('/api/billing/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({ plan: 'INVALID' });
      
      expect(res.status).toBe(400);
    });
  });
});
