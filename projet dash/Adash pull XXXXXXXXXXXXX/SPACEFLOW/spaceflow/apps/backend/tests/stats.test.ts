import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/database';

const app = createApp();

describe('Stats API', () => {
  let token: string;
  let orgId: string;

  beforeEach(async () => {
    await prisma.accessLog.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.member.deleteMany();
    await prisma.space.deleteMany();
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
    orgId = res.body.user.organization.id;
  });

  describe('GET /api/stats/kpis', () => {
    it('should return KPIs', async () => {
      const res = await request(app)
        .get('/api/stats/kpis')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('spaces');
      expect(res.body).toHaveProperty('members');
      expect(res.body).toHaveProperty('bookings');
      expect(res.body).toHaveProperty('revenue');
    });
  });

  describe('GET /api/stats/revenue-chart', () => {
    it('should return chart data', async () => {
      const res = await request(app)
        .get('/api/stats/revenue-chart?months=6')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(6);
    });
  });
});
