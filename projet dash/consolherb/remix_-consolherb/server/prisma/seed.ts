import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MOCK_CROP_DATA = [
  { name: 'Lavender', phMin: 6.5, phMax: 7.5, tempMin: 15, tempMax: 25, water: 'Low', companions: ['Rosemary', 'Sage'], desc: 'Plante méditerranéenne aimant les sols calcaires.' },
  { name: 'Tomato', phMin: 6.0, phMax: 6.8, tempMin: 18, tempMax: 30, water: 'High', companions: ['Basil', 'Marigold'], desc: 'Nécessite un apport régulier en eau et potassium.' },
  { name: 'Ginseng', phMin: 5.5, phMax: 6.5, tempMin: 10, tempMax: 20, water: 'Medium', companions: ['Ferns'], desc: "Plante d'ombre demandant un sol riche en humus." },
];

const MOCK_PEST_DATA = [
  { name: 'Aphids', crops: ['Tomato', 'Lavender'], symptoms: 'Feuilles recroquevillées, présence de miellat', organic: 'Introduction de coccinelles ou savon noir', severity: 'Medium' },
  { name: 'Late Blight', crops: ['Tomato'], symptoms: 'Taches brunes sur feuilles et tiges', organic: 'Suppression des feuilles touchées, cuivre', severity: 'High' },
];

async function main() {
  // eslint-disable-next-line no-console
  console.log('🌱 Initialisation du système expert agricole...');

  for (const crop of MOCK_CROP_DATA) {
    await prisma.cropKnowledge.upsert({
      where: { name: crop.name },
      update: {}, // On ne change rien si ça existe déjà
      create: {
        name: crop.name,
        idealPhMin: crop.phMin,
        idealPhMax: crop.phMax,
        idealTempMin: crop.tempMin,
        idealTempMax: crop.tempMax,
        waterNeed: crop.water,
        companionPlants: crop.companions,
        description: crop.desc,
      },
    });
  }

  for (const pest of MOCK_PEST_DATA) {
    await prisma.pestKnowledge.upsert({
      where: { pestName: pest.name },
      update: {},
      create: {
        pestName: pest.name,
        targetCrops: pest.crops,
        symptoms: pest.symptoms,
        organicTreatment: pest.organic,
        severity: pest.severity,
      },
    });
  }
}

main()
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log('✅ Base de connaissance synchronisée.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error('❌ Erreur lors du seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
