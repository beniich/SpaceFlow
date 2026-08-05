import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { subDays, addDays, addHours } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo data...');

  await prisma.booking.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.accessLog.deleteMany();
  await prisma.member.deleteMany();
  await prisma.space.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: {
      name: 'Coworking Paris Bastille',
      slug: 'coworking-paris-bastille',
      type: 'OPERATOR',
      email: 'demo@spaceflow.com',
      address: '15 rue de la Roquette',
      city: 'Paris',
      postalCode: '75011',
      country: 'FR',
      plan: 'PRO',
      maxSpaces: 10,
      maxMembers: 500
    }
  });

  const hashedPassword = await bcrypt.hash('demo123!', 12);
  await prisma.user.create({
    data: {
      email: 'demo@spaceflow.com',
      password: hashedPassword,
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'ORG_OWNER',
      organizationId: org.id
    }
  });

  await prisma.subscription.create({
    data: {
      organizationId: org.id,
      plan: 'PRO',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: addDays(new Date(), 20)
    }
  });

  const spaces = await Promise.all([
    prisma.space.create({
      data: {
        organizationId: org.id,
        name: 'Open Space Principal',
        code: 'OPEN-01',
        type: 'COWORKING',
        status: 'AVAILABLE',
        address: '15 rue de la Roquette',
        city: 'Paris',
        postalCode: '75011',
        capacity: 30,
        surface: 120,
        hourlyRateCents: 500,
        dailyRateCents: 2500,
        monthlyRateCents: 29000,
        openingTime: '08:00',
        closingTime: '20:00',
        availableDays: [1, 2, 3, 4, 5],
        amenities: ['wifi', 'coffee', 'printer', 'phone_booth'],
        description: 'Grand espace ouvert avec lumière naturelle.'
      }
    }),
    prisma.space.create({
      data: {
        organizationId: org.id,
        name: 'Salle Réunion Atlas',
        code: 'MEET-A',
        type: 'MEETING_ROOM',
        status: 'AVAILABLE',
        capacity: 8,
        surface: 25,
        hourlyRateCents: 1200,
        openingTime: '08:00',
        closingTime: '20:00',
        amenities: ['wifi', 'screen', 'whiteboard'],
        description: 'Salle équipée écran 4K.'
      }
    })
  ]);

  const members = await Promise.all([
    prisma.member.create({
      data: {
        organizationId: org.id,
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean.martin@example.com',
        phone: '+33612345678',
        jobTitle: 'CEO',
        companyName: 'Startup.io',
        status: 'ACTIVE',
        isVip: true,
        totalBookings: 12,
        totalSpentCents: 145000
      }
    }),
    prisma.member.create({
      data: {
        organizationId: org.id,
        firstName: 'Sophie',
        lastName: 'Dubois',
        email: 'sophie.dubois@example.com',
        phone: '+33623456789',
        jobTitle: 'Designer',
        companyName: 'Acme Corp',
        status: 'ACTIVE',
        totalBookings: 8,
        totalSpentCents: 96000
      }
    })
  ]);

  const today = new Date();
  const bookings = [];
  
  for (let i = 0; i < 15; i++) {
    const dayOffset = Math.floor(Math.random() * 14) - 7;
    const startTime = new Date(today);
    startTime.setDate(startTime.getDate() + dayOffset);
    startTime.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
    
    const endTime = addHours(startTime, 2 + Math.floor(Math.random() * 4));
    const space = spaces[Math.floor(Math.random() * spaces.length)];
    const member = members[Math.floor(Math.random() * members.length)];
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const totalCents = Math.round((space.hourlyRateCents || 500) * hours);

    bookings.push({
      organizationId: org.id,
      reference: `BK-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
      memberId: member.id,
      spaceId: space.id,
      type: space.type === 'MEETING_ROOM' ? 'MEETING_ROOM' : 'HOT_DESK',
      status: dayOffset < 0 ? 'COMPLETED' : 'CONFIRMED',
      startTime,
      endTime,
      hours,
      hourlyRateCents: space.hourlyRateCents,
      subtotalCents: totalCents,
      totalCents,
      attendees: 1
    });
  }

  await prisma.booking.createMany({ data: bookings });

  for (let i = 0; i < 5; i++) {
    const member = members[i % members.length];
    const subtotalCents = 29000 + Math.floor(Math.random() * 50000);
    const taxCents = Math.round(subtotalCents * 0.2);
    const totalCents = subtotalCents + taxCents;
    const status = i === 0 ? 'open' : i === 1 ? 'paid' : 'open';
    
    await prisma.invoice.create({
      data: {
        organizationId: org.id,
        number: `INV-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`,
        memberId: member.id,
        status,
        type: 'BOOKING',
        currency: 'eur',
        dueDate: i === 0 ? addDays(today, 5) : subDays(today, 5),
        issueDate: subDays(today, 6),
        periodStart: subDays(today, 30),
        periodEnd: subDays(today, 1),
        
        subtotalCents,
        taxCents,
        totalCents,
        amountDueCents: status === 'paid' ? 0 : totalCents,
        amountPaidCents: status === 'paid' ? totalCents : 0,
        
        amount: subtotalCents,
        amountDue: status === 'paid' ? 0 : subtotalCents,
        amountPaid: status === 'paid' ? subtotalCents : 0,
        
        items: {
          create: [{
            description: 'Réservation espace coworking',
            quantity: 1,
            unitPriceCents: subtotalCents,
            taxRate: 20,
            amountCents: subtotalCents,
            order: 0
          }]
        }
      }
    });
  }

  console.log('✅ Demo data seeded!');
  console.log(`   Organization: ${org.name}`);
  console.log(`   Email: demo@spaceflow.com / demo123!`);
  console.log(`   Spaces: ${spaces.length}`);
  console.log(`   Members: ${members.length}`);
  console.log(`   Bookings: ${bookings.length}`);
  console.log(`   Invoices: 5`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
