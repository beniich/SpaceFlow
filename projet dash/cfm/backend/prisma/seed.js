const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cafm.com' },
    update: {},
    create: {
      email: 'admin@cafm.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'CAFM',
      role: 'ADMIN'
    }
  });

  // Technicien
  await prisma.user.upsert({
    where: { email: 'tech@cafm.com' },
    update: {},
    create: {
      email: 'tech@cafm.com',
      password: await bcrypt.hash('tech123', 12),
      firstName: 'Jean',
      lastName: 'Technicien',
      role: 'TECHNICIAN'
    }
  });

  console.log('✅ Base de données initialisée avec succès');
  console.log('👤 Admin: admin@cafm.com / admin123');
  console.log('🔧 Technicien: tech@cafm.com / tech123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
