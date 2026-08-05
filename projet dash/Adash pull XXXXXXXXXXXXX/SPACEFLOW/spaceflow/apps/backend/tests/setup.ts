import { prisma } from '../src/config/database';

beforeEach(async () => {
  // Nettoyer la DB avant chaque test
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});