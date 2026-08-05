import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SpaceFlow database...');

  // Nettoyer
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Organisation de démo
  const org = await prisma.organization.create({
    data: {
      name: 'SpaceFlow Demo',
      slug: 'spaceflow-demo',
      type: 'OPERATOR',
      email: 'demo@spaceflow.com',
      phone: '+33123456789',
      address: '15 rue de la Innovation',
      city: 'Paris',
      postalCode: '75002',
      country: 'FR',
      plan: 'PRO',
      maxSpaces: 10,
      maxMembers: 500,
      maxUsers: 10,
      description: 'Espace de coworking moderne au cœur de Paris'
    }
  });

  // User admin
  const hashedPassword = await bcrypt.hash('demo123!', 12);
  const user = await prisma.user.create({
    data: {
      email: 'demo@spaceflow.com',
      password: hashedPassword,
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'ORG_OWNER',
      organizationId: org.id,
      emailVerified: true
    }
  });

  // Quelques spaces de démo
  await prisma.space.createMany({
    data: [
      {
        organizationId: org.id,
        name: 'Espace Open Space',
        code: 'OPEN-01',
        type: 'COWORKING',
        status: 'AVAILABLE',
        address: '15 rue de la Innovation',
        city: 'Paris',
        capacity: 20,
        surface: 80.5,
        hourlyRateCents: 500,  // 5€/h
        dailyRateCents: 2500,  // 25€/jour
        monthlyRateCents: 29000, // 290€/mois
        openingTime: '08:00',
        closingTime: '20:00',
        availableDays: [1, 2, 3, 4, 5],
        amenities: ['wifi', 'coffee', 'printer', 'phone_booth'],
        description: 'Grand espace ouvert avec lumière naturelle'
      },
      {
        organizationId: org.id,
        name: 'Salle Réunion Atlas',
        code: 'MEET-A',
        type: 'MEETING_ROOM',
        status: 'AVAILABLE',
        capacity: 8,
        surface: 25,
        hourlyRateCents: 1200, // 12€/h
        dailyRateCents: 5000,
        openingTime: '08:00',
        closingTime: '20:00',
        amenities: ['wifi', 'screen', 'whiteboard'],
        description: 'Salle de réunion équipée écran 4K'
      },
      {
        organizationId: org.id,
        name: 'Bureau Privé Da Vinci',
        code: 'OFFICE-01',
        type: 'PRIVATE_OFFICE',
        status: 'AVAILABLE',
        capacity: 4,
        surface: 18,
        monthlyRateCents: 120000, // 1200€/mois
        amenities: ['wifi', 'desk', 'chair', 'locker'],
        description: 'Bureau fermé pour 4 personnes'
      }
    ]
  });

  // Quelques members de démo
  await prisma.member.createMany({
    data: [
      {
        organizationId: org.id,
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean.martin@example.com',
        company: 'Startup.io',
        jobTitle: 'CEO',
        totalBookings: 12,
        totalSpentCents: 35000
      },
      {
        organizationId: org.id,
        companyName: 'Acme Corp',
        email: 'contact@acme.com',
        jobTitle: 'Team Lead',
        totalBookings: 25,
        totalSpentCents: 89000
      }
    ]
  });

  console.log('✅ Seed completed');
  console.log(`   Organization: ${org.name}`);
  console.log(`   Admin: ${user.email} / demo123!`);
  console.log(`   3 spaces, 2 members created`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());