const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Change provider
schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');

// 2. Replace String JSONs with Json
schema = schema.replace(/String\s*\/\/\s*JSON string.*/g, 'Json');
schema = schema.replace(/String\?\s*\/\/\s*JSON string.*/g, 'Json?');
schema = schema.replace(/String\s*\/\/\s*Stored as JSON string.*/g, 'Json');
schema = schema.replace(/String\?\s*\/\/\s*Stored as JSON string.*/g, 'Json?');
schema = schema.replace(/String\s*\/\/\s*JSON array string.*/g, 'Json');
schema = schema.replace(/String\?\s*\/\/\s*JSON array string.*/g, 'Json?');
schema = schema.replace(/String\s*\/\/\s*Array of .* as JSON string/g, 'Json');

// Replace specific fields if regex missed them
schema = schema.replace(/details   String\?\s*\/\/\s*JSON string/g, 'details   Json?');
schema = schema.replace(/data      String\?\s*\/\/\s*JSON string/g, 'data      Json?');
schema = schema.replace(/metadata    String\s*\/\/\s*JSON string/g, 'metadata    Json');
schema = schema.replace(/position    String\?\s*\/\/\s*JSON string \{x, y, z\}/g, 'position    Json?');
schema = schema.replace(/data      String\s*\/\/\s*JSON string \{.*?\}/g, 'data      Json');
schema = schema.replace(/parameters String\s*\/\/\s*JSON string/g, 'parameters Json');
schema = schema.replace(/results    String\s*\/\/\s*JSON string/g, 'results    Json');
schema = schema.replace(/entityMapping  String\s*\/\/\s*Mapping champs CAFM   ERP \(JSON string\)/g, 'entityMapping  Json');
schema = schema.replace(/errors           String\?\s*\/\/\s*JSON string/g, 'errors           Json?');
schema = schema.replace(/attachments   String\?\s*\/\/\s*JSON string/g, 'attachments   Json?');


// 3. Update Asset model
const oldAssetModel = `model Asset {
  id              String      @id @default(uuid())
  name            String
  category        String      // HVAC, electrical, furniture, IT, security
  model           String?
  serialNumber    String      @unique
  manufacturer    String?
  purchaseDate    DateTime
  purchasePrice   Float
  warrantyEnd     DateTime?
  location        String
  status          String      @default("OPERATIONAL")
  healthScore     Int         @default(100) // 0-100
  lastMaintenance DateTime?
  nextMaintenance DateTime?
  buildingId      String
  building        Building    @relation(fields: [buildingId], references: [id])
  managerId       String?
  manager         User?       @relation(fields: [managerId], references: [id])
  tenantId        String?
  tenant          Tenant?     @relation(fields: [tenantId], references: [id])

  workOrders      WorkOrder[]
  sensors         Sensor[]
  maintenanceLogs MaintenanceLog[]
  procedures      Procedure[]
  digitalTwins    DigitalTwin[]
  bimElements     BIMElement[]
  erpAssetMappings ERPAssetMapping[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}`;

const newAssetModel = `model Asset {
  id              String      @id @default(uuid())
  tenantId        String      // ← RLS enforced (required)
  tenant          Tenant      @relation(fields: [tenantId], references: [id])
  parentId        String?
  parent          Asset?      @relation("AssetHierarchy", fields: [parentId], references: [id])
  children        Asset[]     @relation("AssetHierarchy")
  type            String      // e.g. BUILDING, FLOOR, ROOM, EQUIPMENT
  code            String
  name            String
  category        String      // HVAC, electrical, furniture, IT, security
  model           String?
  serialNumber    String      @unique
  manufacturer    String?
  purchaseDate    DateTime?
  purchasePrice   Float?
  warrantyEnd     DateTime?
  location        Unsupported("geography(Point, 4326)")? // PostGIS
  geometry        Json?       // bounding box minimal
  bimRef          String?     // GUID IFC externe
  status          String      @default("OPERATIONAL")
  healthScore     Int         @default(100) // 0-100
  lastMaintenance DateTime?
  nextMaintenance DateTime?
  buildingId      String?
  building        Building?   @relation(fields: [buildingId], references: [id])
  managerId       String?
  manager         User?       @relation(fields: [managerId], references: [id])

  workOrders      WorkOrder[]
  sensors         Sensor[]
  maintenanceLogs MaintenanceLog[]
  procedures      Procedure[]
  digitalTwins    DigitalTwin[]
  bimElements     BIMElement[]
  erpAssetMappings ERPAssetMapping[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}`;

schema = schema.replace(oldAssetModel, newAssetModel);

fs.writeFileSync(schemaPath, schema);
console.log("Schema updated!");
