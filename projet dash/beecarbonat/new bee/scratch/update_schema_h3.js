const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Update Tenant with H3 relations
schema = schema.replace(
  '  bimAnnotations    BIMAnnotation[]\n  apiKeys           APIKey[]\n  webhooks          Webhook[]',
  '  bimAnnotations    BIMAnnotation[]\n  apiKeys           APIKey[]\n  webhooks          Webhook[]\n  aiSessions        AISession[]\n  assetDocuments    AssetDocument[]\n  iotConnectors     IoTConnector[]\n  extensions        ExtensionInstall[]'
);

// Update Asset with H3 relations
schema = schema.replace(
  '  bimAnnotations   BIMAnnotation[]',
  '  bimAnnotations   BIMAnnotation[]\n  documents        AssetDocument[]\n  iotReadings      IoTReading[]'
);

// Append H3 models
const h3Models = `
// ============== IA GÉNÉRATIVE - RAG ==============
model AISession {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userId      String?
  context     String   @default("GENERAL") // GENERAL, WO_SUMMARY, ASSET_DIAG, ESG
  messages    Json     // Array of {role, content, timestamp}
  tokenCount  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AssetDocument {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  assetId     String?
  asset       Asset?   @relation(fields: [assetId], references: [id])
  title       String
  content     String   // Texte extrait (chunked)
  chunkIndex  Int      @default(0)
  source      String   // MANUAL, WO_HISTORY, TECHNICAL_DOC, MAINTENANCE_LOG
  fileUrl     String?
  // Note: embedding vector stocké dans pgvector via extension PostgreSQL
  // ALTER TABLE "AssetDocument" ADD COLUMN embedding vector(1536);
  embeddingModel String? // ex: text-embedding-3-small
  embeddingAt    DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ============== IOT CONNECTORS ==============
model IoTConnector {
  id          String     @id @default(uuid())
  tenantId    String
  tenant      Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  protocol    String     // MQTT, BACNET, LORAWAN, MODBUS, OPC_UA
  status      String     @default("INACTIVE") // ACTIVE, INACTIVE, ERROR
  config      Json       // broker URL, port, credentials, topic patterns
  lastSeenAt  DateTime?
  readings    IoTReading[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model IoTReading {
  id           String      @id @default(uuid())
  connectorId  String
  connector    IoTConnector @relation(fields: [connectorId], references: [id], onDelete: Cascade)
  assetId      String?
  asset        Asset?      @relation(fields: [assetId], references: [id])
  topic        String      // MQTT topic ou BACnet object ref
  metric       String      // temperature, humidity, energy_kwh, co2_ppm, occupancy
  value        Float
  unit         String
  quality      String      @default("GOOD") // GOOD, UNCERTAIN, BAD
  readAt       DateTime
  createdAt    DateTime    @default(now())

  @@index([assetId, metric, readAt])
  @@index([connectorId, readAt])
}

// ============== MARKETPLACE ==============
model MarketplaceExtension {
  id           String   @id @default(uuid())
  name         String
  slug         String   @unique
  description  String
  category     String   // ERP_CONNECTOR, IOT_SENSOR, GED, BI_TOOL, SECTOR_TEMPLATE
  version      String
  authorName   String
  authorEmail  String
  pricing      String   @default("FREE") // FREE, PAID
  price        Float?
  currency     String   @default("EUR")
  logoUrl      String?
  repoUrl      String?
  docsUrl      String?
  sandboxPassed Boolean @default(false)
  signatureHash String? // SHA-256 du bundle
  rating       Float?
  reviewCount  Int      @default(0)
  installCount Int      @default(0)
  status       String   @default("PENDING") // PENDING, APPROVED, REJECTED, DEPRECATED
  installs     ExtensionInstall[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ExtensionInstall {
  id           String              @id @default(uuid())
  tenantId     String
  tenant       Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  extensionId  String
  extension    MarketplaceExtension @relation(fields: [extensionId], references: [id])
  config       Json?               // Config spécifique au tenant
  active       Boolean             @default(true)
  installedAt  DateTime            @default(now())
  updatedAt    DateTime            @updatedAt

  @@unique([tenantId, extensionId])
}
`;

schema += h3Models;

fs.writeFileSync(schemaPath, schema);
console.log("Schema updated for Horizon 3 (AI RAG + IoT + Marketplace)!");
