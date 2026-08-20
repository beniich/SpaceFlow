const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Update Tenant with bimImportJobs relation
schema = schema.replace(
  '  energyMeters      EnergyMeter[]\n  emissionFactors   EmissionFactor[]\n  esgReports        ESGReport[]',
  '  energyMeters      EnergyMeter[]\n  emissionFactors   EmissionFactor[]\n  esgReports        ESGReport[]\n  bimImportJobs     BIMImportJob[]'
);

// Append BIMImportJob model
const bimJobModel = `
// ============== BIM IMPORT JOBS ==============
model BIMImportJob {
  id              String    @id @default(uuid())
  tenantId        String
  tenant          Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  buildingId      String?
  fileName        String
  fileSize        Int?      // bytes
  fileUrl         String?
  status          String    @default("PENDING") // PENDING, PROCESSING, DONE, FAILED
  progress        Int       @default(0)         // 0-100
  totalElements   Int       @default(0)
  parsedElements  Int       @default(0)
  errors          Json?
  modelId         String?   // Link to BIMModel once created
  startedAt       DateTime?
  completedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
`;

schema += bimJobModel;
fs.writeFileSync(schemaPath, schema);
console.log("Schema updated: BIMImportJob added!");
