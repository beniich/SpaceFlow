const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Update Tenant model - add supplier/contract relations
schema = schema.replace(
  '  erpConnections    ERPConnection[]\n  bimModels         BIMModel[]',
  '  erpConnections    ERPConnection[]\n  bimModels         BIMModel[]\n  suppliers         Supplier[]\n  contracts         MaintenanceContract[]'
);

// 2. Update Asset model - add contracts relation
schema = schema.replace(
  '  erpAssetMappings ERPAssetMapping[]\n  planAnnotations  PlanAnnotation[]',
  '  erpAssetMappings ERPAssetMapping[]\n  planAnnotations  PlanAnnotation[]\n  contracts        MaintenanceContract[] @relation("AssetContracts")'
);

// 3. Update WorkOrder model - add contract relation
schema = schema.replace(
  '  comments      Comment[]\n  orderParts    WorkOrderPart[]',
  '  contractId    String?\n  contract      MaintenanceContract? @relation(fields: [contractId], references: [id])\n\n  comments      Comment[]\n  orderParts    WorkOrderPart[]'
);

// 4. Append new models
const newModels = `
// ============== CONTRATS & FOURNISSEURS ==============
model Supplier {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  code        String?
  type        String   @default("MAINTENANCE") // MAINTENANCE, PARTS, SERVICES, UTILITIES
  email       String?
  phone       String?
  address     String?
  city        String?
  country     String?
  website     String?
  vatNumber   String?
  rating      Int?     // 1-5
  status      String   @default("ACTIVE") // ACTIVE, INACTIVE, BLACKLISTED
  notes       String?
  contracts   MaintenanceContract[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model MaintenanceContract {
  id              String    @id @default(uuid())
  tenantId        String
  tenant          Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplierId      String
  supplier        Supplier  @relation(fields: [supplierId], references: [id])
  name            String
  type            String    // MAINTENANCE, WARRANTY, SLA, INSURANCE, LEASE
  reference       String?
  status          String    @default("ACTIVE") // ACTIVE, EXPIRED, PENDING, TERMINATED
  startDate       DateTime
  endDate         DateTime
  value           Float?
  currency        String    @default("EUR")
  renewalAlert    Int       @default(30) // days before end to alert
  autoRenewal     Boolean   @default(false)
  slaResponseTime Int?      // hours
  slaResolutionTime Int?    // hours
  terms           String?
  attachments     Json?
  assets          Asset[]   @relation("AssetContracts")
  workOrders      WorkOrder[]
  alerts          ContractAlert[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ContractAlert {
  id          String              @id @default(uuid())
  contractId  String
  contract    MaintenanceContract @relation(fields: [contractId], references: [id], onDelete: Cascade)
  type        String              // EXPIRY, RENEWAL, PAYMENT
  alertDate   DateTime
  sent        Boolean             @default(false)
  sentAt      DateTime?
  createdAt   DateTime            @default(now())
}
`;

schema += newModels;

fs.writeFileSync(schemaPath, schema);
console.log("Schema updated for M5-M6!");
