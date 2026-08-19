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
      role: 'ADMIN',
      department: 'IT'
    }
  });

  // User Tarik Benaich
  await prisma.user.upsert({
    where: { email: 'tarikbenaich@gmail.com' },
    update: {
      password: await bcrypt.hash('0000_-tr', 12),
      isActive: true,
      role: 'ADMIN'
    },
    create: {
      email: 'tarikbenaich@gmail.com',
      password: await bcrypt.hash('0000_-tr', 12),
      firstName: 'Tarik',
      lastName: 'Benaich',
      role: 'ADMIN',
      department: 'Facility & Executive Direction'
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
      role: 'TECHNICIAN',
      department: 'Maintenance'
    }
  });

  // Bâtiments
  const building1 = await prisma.building.create({
    data: {
      name: 'Tour Horizon',
      address: '123 Avenue des Champs',
      city: 'Paris',
      country: 'France',
      totalArea: 15000,
      floors: 12,
      yearBuilt: 2018
    }
  });

  const building2 = await prisma.building.create({
    data: {
      name: 'Centre Innovation',
      address: '45 Rue de la Tech',
      city: 'Lyon',
      country: 'France',
      totalArea: 8500,
      floors: 6,
      yearBuilt: 2020
    }
  });

  // Espaces
  const spaces = [];
  for (let f = 1; f <= 5; f++) {
    for (let i = 1; i <= 8; i++) {
      spaces.push({
        name: `Bureau ${f}.${i.toString().padStart(2, '0')}`,
        type: i <= 2 ? 'meeting-room' : 'office',
        floor: f,
        area: i <= 2 ? 35 : 18,
        capacity: i <= 2 ? 10 : 2,
        occupancy: Math.floor(Math.random() * (i <= 2 ? 10 : 2)),
        status: Math.random() > 0.3 ? 'occupied' : 'available',
        buildingId: building1.id
      });
    }
  }
  await prisma.space.createMany({ data: spaces });

  // Actifs
  const categories = ['HVAC', 'Electrical', 'Furniture', 'IT', 'Security'];
  const assets = [];
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const purchaseDate = new Date(2019 + Math.random() * 5, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
    const nextMaint = new Date();
    nextMaint.setDate(nextMaint.getDate() + Math.floor(Math.random() * 60));
    
    assets.push({
      name: `${category} #${i + 1}`,
      category,
      model: `Model-${Math.floor(Math.random() * 1000)}`,
      serialNumber: `SN${Date.now()}${i}`,
      manufacturer: ['Siemens', 'Schneider', 'Bosch', 'Honeywell'][Math.floor(Math.random() * 4)],
      purchaseDate,
      purchasePrice: 1000 + Math.random() * 50000,
      warrantyEnd: new Date(purchaseDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000),
      location: `Étage ${Math.ceil(Math.random() * 12)}`,
      status: Math.random() > 0.85 ? 'MAINTENANCE' : 'OPERATIONAL',
      healthScore: 50 + Math.floor(Math.random() * 50),
      nextMaintenance: nextMaint,
      buildingId: Math.random() > 0.5 ? building1.id : building2.id,
      managerId: admin.id
    });
  }
  const createdAssets = await prisma.asset.createMany({ data: assets });
  
  // Capteurs pour quelques actifs
  const allAssets = await prisma.asset.findMany();
  for (let i = 0; i < 15; i++) {
    const asset = allAssets[i];
    const types = ['temperature', 'humidity', 'energy', 'vibration'];
    const type = types[Math.floor(Math.random() * types.length)];
    const units = { temperature: '°C', humidity: '%', energy: 'kWh', vibration: 'mm/s' };
    const values = { temperature: 22, humidity: 50, energy: 25, vibration: 5 };
    
    await prisma.sensor.create({
      data: {
        type,
        unit: units[type],
        value: values[type],
        assetId: asset.id
      }
    });
  }

  // Baux
  await prisma.lease.createMany({
    data: [
      {
        tenant: 'Société ABC',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2026-12-31'),
        monthlyRent: 15000,
        deposit: 45000,
        buildingId: building1.id
      },
      {
        tenant: 'Startup XYZ',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2027-02-28'),
        monthlyRent: 8500,
        deposit: 25500,
        buildingId: building2.id
      }
    ]
  });

  // Ordres de travail
  const technicians = await prisma.user.findMany({ where: { role: 'TECHNICIAN' } });
  for (let i = 0; i < 20; i++) {
    const asset = allAssets[Math.floor(Math.random() * allAssets.length)];
    const types = ['PREVENTIVE', 'PREDICTIVE', 'CORRECTIVE'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    
    await prisma.workOrder.create({
      data: {
        title: `Maintenance ${types[Math.floor(Math.random() * 3)]} - ${asset.name}`,
        description: 'Vérification complète et remplacement si nécessaire',
        type: types[Math.floor(Math.random() * 3)],
        priority: priorities[Math.floor(Math.random() * 4)],
        status: statuses[Math.floor(Math.random() * 3)],
        estimatedCost: 200 + Math.random() * 2000,
        scheduledAt: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        assetId: asset.id,
        assignedToId: technicians[0]?.id,
        createdById: admin.id
      }
    });
  }

  // Consommation énergétique (12 derniers mois)
  const energyData = [];
  for (let m = 0; m < 12; m++) {
    const period = new Date();
    period.setMonth(period.getMonth() - m);
    energyData.push({
      buildingId: building1.id,
      type: 'electricity',
      value: 8000 + Math.random() * 4000,
      unit: 'kWh',
      cost: 1200 + Math.random() * 600,
      period
    });
    energyData.push({
      buildingId: building1.id,
      type: 'water',
      value: 200 + Math.random() * 100,
      unit: 'm³',
      cost: 300 + Math.random() * 150,
      period
    });
  }
  await prisma.energyConsumption.createMany({ data: energyData });

  // Pièces détachées CMMS
  const partsData = [
    { partNumber: 'FILT-HVAC-01', name: 'Filtre à air HVAC HEPA G4', category: 'HVAC', quantity: 12, minQuantity: 5, maxQuantity: 50, unitCost: 45.0, unit: 'unité' },
    { partNumber: 'POMP-EAU-02', name: 'Pompe centrifuge 2.5 kW', category: 'Plomberie', quantity: 2, minQuantity: 3, maxQuantity: 10, unitCost: 680.0, unit: 'unité' },
    { partNumber: 'CAP-TEMP-03', name: 'Capteur Température Zigbee', category: 'IoT', quantity: 0, minQuantity: 5, maxQuantity: 30, unitCost: 29.90, unit: 'unité' },
    { partNumber: 'DISJ-ELEC-04', name: 'Disjoncteur Différentiel 32A', category: 'Électricité', quantity: 18, minQuantity: 10, maxQuantity: 100, unitCost: 38.50, unit: 'unité' },
    { partNumber: 'COURR-VENT-05', name: 'Courroie de Transmission V-Belt', category: 'HVAC', quantity: 4, minQuantity: 6, maxQuantity: 20, unitCost: 18.20, unit: 'unité' }
  ];
  for (const p of partsData) {
    await prisma.part.upsert({
      where: { partNumber: p.partNumber },
      update: {},
      create: p
    });
  }

  // Procédures CMMS
  const proceduresCount = await prisma.procedure.count();
  if (proceduresCount === 0) {
    await prisma.procedure.createMany({
      data: [
        {
          title: 'Inspection Trimestrielle CTA / HVAC',
          category: 'HVAC',
          estimatedTime: 120,
          safetyNotes: 'Port des EPI obligatoire (Gants, Casque, Lunettes)',
          steps: JSON.stringify([
            'Consigner l\'installation électrique',
            'Inspecter la tension des courroies',
            'Remplacer les filtres si colmatés',
            'Nettoyer le bac à condensats',
            'Relancer et mesurer la température de soufflage'
          ])
        },
        {
          title: 'Contrôle Réglementaire Armoire Électrique',
          category: 'Électricité',
          estimatedTime: 90,
          safetyNotes: 'Habilitation électrique BR/BC requise',
          steps: JSON.stringify([
            'Inspecter les borniers par caméra thermique IR',
            'Vérifier le déclenchement des différentiels 30mA',
            'Resserrer au couple les bornes principales',
            'Rédiger le rapport de conformité'
          ])
        }
      ]
    });
  }

  console.log('✅ Base de données initialisée avec succès');

  console.log('👤 Admin: admin@cafm.com / admin123');
  console.log('🔧 Technicien: tech@cafm.com / tech123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
