const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Update Tenant - add ESG relations
schema = schema.replace(
  '  suppliers         Supplier[]\n  contracts         MaintenanceContract[]',
  '  suppliers         Supplier[]\n  contracts         MaintenanceContract[]\n  energyMeters      EnergyMeter[]\n  emissionFactors   EmissionFactor[]\n  esgReports        ESGReport[]'
);

// 2. Update Building - add meters relation
schema = schema.replace(
  '  spaces       Space[]\n  floorPlans   FloorPlan[]',
  '  spaces       Space[]\n  floorPlans   FloorPlan[]\n  energyMeters EnergyMeter[]'
);

// 3. Update Asset - add meters relation
schema = schema.replace(
  '  planAnnotations  PlanAnnotation[]\n  contracts        MaintenanceContract[] @relation("AssetContracts")',
  '  planAnnotations  PlanAnnotation[]\n  contracts        MaintenanceContract[] @relation("AssetContracts")\n  energyMeters     EnergyMeter[]'
);

// 4. Append ESG models
const esgModels = `
// ============== ESG - DONNÉES ENVIRONNEMENTALES ==============
model EnergyMeter {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  buildingId  String?
  building    Building? @relation(fields: [buildingId], references: [id])
  assetId     String?
  asset       Asset?   @relation(fields: [assetId], references: [id])
  name        String
  type        String   // ELECTRICITY, GAS, WATER, HEAT, COOLING
  unit        String   // kWh, m3, l, MWh
  externalRef String?  // ID du compteur physique / PDL / PRM
  active      Boolean  @default(true)
  readings    MeterReading[]
  invoices    EnergyInvoice[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model MeterReading {
  id        String      @id @default(uuid())
  meterId   String
  meter     EnergyMeter @relation(fields: [meterId], references: [id], onDelete: Cascade)
  value     Float       // Index ou consommation sur la période
  unit      String
  readAt    DateTime
  source    String      @default("MANUAL") // MANUAL, IOT, IMPORT
  createdAt DateTime    @default(now())
}

model EnergyInvoice {
  id           String      @id @default(uuid())
  meterId      String
  meter        EnergyMeter @relation(fields: [meterId], references: [id], onDelete: Cascade)
  reference    String?
  periodStart  DateTime
  periodEnd    DateTime
  consumption  Float       // kWh / m3
  unit         String
  amount       Float
  currency     String      @default("EUR")
  scope1       Float?      // tCO2e (combustion directe)
  scope2       Float?      // tCO2e (énergie achetée)
  scope3       Float?      // tCO2e (cat 13 downstream)
  rawText      String?     // Texte brut extrait du PDF
  fileUrl      String?     // URL du PDF
  parsedAt     DateTime?   // Date de parsing automatique
  factorId     String?
  factor       EmissionFactor? @relation(fields: [factorId], references: [id])
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

model EmissionFactor {
  id          String   @id @default(uuid())
  tenantId    String?
  tenant      Tenant?  @relation(fields: [tenantId], references: [id])
  source      String   // ADEME, DEFRA, IEA
  type        String   // ELECTRICITY, GAS, WATER, etc.
  region      String   // FR, UK, EU, GLOBAL
  year        Int
  value       Float    // kgCO2e / kWh ou kgCO2e / m3
  unit        String   @default("kgCO2e/kWh")
  invoices    EnergyInvoice[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([source, type, region, year])
}

model ESGReport {
  id              String   @id @default(uuid())
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name            String
  periodStart     DateTime
  periodEnd       DateTime
  status          String   @default("DRAFT") // DRAFT, GENERATED, SIGNED, SUBMITTED
  scope1Total     Float?   // tCO2e
  scope2Location  Float?   // tCO2e (location-based)
  scope2Market    Float?   // tCO2e (market-based)
  scope3Cat13     Float?   // tCO2e (aval)
  energyIntensity Float?   // kWh/m²/an
  breakdown       Json?    // Détail par énergie / bâtiment
  confidence      Json?    // { high, medium, low } en %
  methodology     String?
  fileUrl         String?  // URL du PDF généré
  signatureHash   String?  // SHA-256 du contenu
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
`;

schema += esgModels;

fs.writeFileSync(schemaPath, schema);
console.log("Schema updated for ESG M4-M10!");
