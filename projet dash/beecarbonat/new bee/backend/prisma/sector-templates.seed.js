/**
 * sector-templates.seed.js — Données initiales pour les référentiels sectoriels
 * Horizon 4 beecarbonit
 *
 * 5 verticals : Retail, Santé, Education, Industrie, Public
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TEMPLATES = [
  {
    name: 'Retail Pro',
    slug: 'retail-pro',
    vertical: 'RETAIL',
    description: 'Gestion des magasins et enseignes — audits qualité, turn-over, contrats enseigne',
    pricing: 'CORE',
    features: [
      'Gestion des équipements de caisse et affichage',
      'Audits qualité périodiques avec checklist ISO 9001',
      'Gestion des contrats enseignes et franchisés',
      'Alertes renouvellement des équipements POS',
    ],
    checklistTemplates: [
      { name: 'Audit qualité mensuel', type: 'REGULATORY', items: ['Propreté vitrine', 'Fonctionnement éclairage', 'Test TPE', 'Vérification alarme'] },
      { name: 'Ouverture magasin', type: 'PREVENTIVE', items: ['Vérification alarme', 'Test climatisation', 'Contrôle éclairage', 'Vérification caisses'] },
    ],
    reportTemplates: [{ name: 'Rapport audit enseigne', format: 'PDF' }],
  },
  {
    name: 'Santé Conformité',
    slug: 'sante-conformite',
    vertical: 'SANTE',
    description: 'Habilitations personnel, stérilisation équipements, conformité ARS et CSSCT',
    pricing: 'PREMIUM',
    price: 8000,
    features: [
      'Suivi habilitations et certifications du personnel',
      'Cycles de stérilisation équipements médicaux',
      'Conformité ARS — traçabilité complète',
      'Plans de maintenance préventive DASRI',
      'Gestion des équipements biomédicaux',
    ],
    checklistTemplates: [
      { name: 'Stérilisation équipement', type: 'PREVENTIVE', items: ['Contrôle autoclave', 'Test indicateur chimique', 'Traçabilité lot', 'Validation température'] },
      { name: 'Inspection mensuelle ARS', type: 'REGULATORY', items: ['Vérification extincteurs', 'Contrôle évacuation', 'Test alarme incendie', 'Registre sécurité à jour'] },
    ],
    reportTemplates: [{ name: 'Rapport conformité ARS', format: 'PDF' }, { name: 'Rapport CSSCT', format: 'XLSX' }],
  },
  {
    name: 'Éducation Sécurité',
    slug: 'education-securite',
    vertical: 'EDUCATION',
    description: 'Calendrier scolaire, sécurité incendie ERP, accessibilité PMR',
    pricing: 'CORE',
    features: [
      'Planification des WO selon le calendrier scolaire',
      'Exercices évacuation incendie ERP type R',
      'Accessibilité PMR — suivi des travaux et conformité',
      'Gestion des équipements sportifs et laboratoires',
      'Registre public de sécurité numérique',
    ],
    checklistTemplates: [
      { name: 'Exercice évacuation ERP', type: 'REGULATORY', items: ['Déclenchement alarme', 'Chronométrage évacuation', 'Contrôle points de rassemblement', 'Rapport chef de file'] },
      { name: 'Vérification accessibilité PMR', type: 'REGULATORY', items: ['Rampes accès', 'Ascenseurs', 'Parkings PMR', 'Signalétique Braille'] },
    ],
    reportTemplates: [{ name: 'Registre public de sécurité', format: 'PDF' }],
  },
  {
    name: 'Industrie ATEX',
    slug: 'industrie-atex',
    vertical: 'INDUSTRIE',
    description: 'ATEX, criticité maintenance, gestion arrêts programmés et AMDEC',
    pricing: 'PREMIUM',
    price: 15000,
    features: [
      'Classification ATEX zones et équipements',
      'Analyse de criticité RCM / AMDEC',
      'Planification des arrêts programmés (TAR)',
      'Gestion des permis de travail (PDT)',
      'Suivi des pièces critiques et délai réapprovisionnement',
    ],
    checklistTemplates: [
      { name: 'Inspection ATEX mensuelle', type: 'REGULATORY', items: ['Vérification classification zones', 'Contrôle matériel certifié Ex', 'Test détecteurs gaz', 'Registre ATEX à jour'] },
      { name: 'Permis de feu', type: 'CORRECTIVE', items: ['Zone dégagée inflammables', 'Extincteur à proximité', 'Surveillance post-travaux 1h', 'Validation chef sécurité'] },
    ],
    reportTemplates: [{ name: 'Rapport ATEX annuel', format: 'PDF' }, { name: 'Tableau de bord criticité', format: 'XLSX' }],
  },
  {
    name: 'Secteur Public DCE',
    slug: 'secteur-public-dce',
    vertical: 'PUBLIC',
    description: 'Marchés publics DCE, accessibilité PMR, performance énergétique DPE',
    pricing: 'CORE',
    features: [
      'Gestion des marchés publics et DCE',
      'Suivi des prestataires agréés et habilitations',
      'Performance énergétique — DPE et audit obligatoire',
      'Accessibilité ERP publics Ad\'AP',
      'Traçabilité pour contrôles de légalité',
    ],
    checklistTemplates: [
      { name: 'Audit DPE bâtiment', type: 'REGULATORY', items: ['Relevé compteurs énergétiques', 'Inspection isolation', 'Contrôle systèmes chauffage', 'Calcul ratio kWh/m²/an'] },
      { name: 'Contrôle prestataire marché public', type: 'CORRECTIVE', items: ['Vérification certificats Kbis', 'Attestation fiscale', 'Assurance RC Pro', 'URSSAF à jour'] },
    ],
    reportTemplates: [{ name: 'Rapport DPE', format: 'PDF' }, { name: 'Tableau de bord marchés', format: 'XLSX' }],
  },
];

async function seedSectorTemplates() {
  console.log('Seeding sector templates...');

  for (const template of TEMPLATES) {
    await prisma.sectorTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
    console.log(`  ✓ ${template.name} (${template.vertical})`);
  }

  console.log(`\nDone — ${TEMPLATES.length} sector templates seeded.`);
}

seedSectorTemplates()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
