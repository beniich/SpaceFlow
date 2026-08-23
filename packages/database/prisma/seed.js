const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...');

  // 1. Tenant par défaut
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Default Tenant',
      slug: 'default',
      status: 'ACTIVE'
    }
  });
  console.log(`✅ Tenant créé: ${tenant.name}`);

  // 2. Utilisateurs
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email_tenantId: { email: 'admin@cafm.com', tenantId: tenant.id } },
    update: { passwordHash: hashedPassword },
    create: {
      email: 'admin@cafm.com',
      passwordHash: hashedPassword,
      fullName: 'Admin CAFM',
      role: 'ADMIN',
      tenantId: tenant.id
    }
  });

  const techPassword = await bcrypt.hash('tech123', 12);
  const tech = await prisma.user.upsert({
    where: { email_tenantId: { email: 'tech@cafm.com', tenantId: tenant.id } },
    update: { passwordHash: techPassword },
    create: {
      email: 'tech@cafm.com',
      passwordHash: techPassword,
      fullName: 'Jean Technicien',
      role: 'MEMBER',
      tenantId: tenant.id
    }
  });
  console.log(`✅ Utilisateurs créés (admin, tech)`);

  // 3. Bâtiments (Buildings)
  const building = await prisma.building.create({
    data: {
      tenantId: tenant.id,
      name: 'Tour Horizon',
      address: '123 Avenue des Champs',
      city: 'Paris',
      country: 'France'
    }
  });
  console.log(`✅ Bâtiment créé: ${building.name}`);

  // 4. Actifs (Assets) - avec les champs requis type et code
  const hvacAsset = await prisma.asset.create({
    data: {
      tenantId: tenant.id,
      name: 'CTA Principale Toit',
      code: 'HVAC-001',
      type: 'EQUIPMENT',
      buildingId: building.id,
      status: 'OPERATIONAL',
      healthScore: 85,
    }
  });

  const spaceAsset = await prisma.asset.create({
    data: {
      tenantId: tenant.id,
      name: 'Open Space 4ème',
      code: 'SPC-401',
      type: 'SPACE',
      buildingId: building.id,
      status: 'OPERATIONAL',
      healthScore: 100,
    }
  });
  console.log(`✅ Actifs créés (HVAC, Space)`);

  // 5. WorkOrder
  await prisma.workOrder.create({
    data: {
      tenantId: tenant.id,
      title: 'Maintenance Préventive Trimestrielle',
      description: 'Vérification complète de la CTA',
      type: 'PREVENTIVE',
      priority: 'NORMAL',
      status: 'OPEN',
      assetId: hvacAsset.id,
      assigneeId: tech.id,
      createdById: admin.id
    }
  });
  console.log(`✅ Ordre de travail créé`);

  // 6. Ticket
  await prisma.ticket.create({
    data: {
      tenantId: tenant.id,
      reference: 'TKT-2026-00001',
      title: 'Fuite d\'eau signalée',
      description: 'Goutte à goutte près du distributeur',
      category: 'PLUMBING',
      severity: 'MEDIUM',
      status: 'SUBMITTED',
      buildingId: building.id,
      submittedById: admin.id
    }
  });
  console.log(`✅ Ticket de test créé`);

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
