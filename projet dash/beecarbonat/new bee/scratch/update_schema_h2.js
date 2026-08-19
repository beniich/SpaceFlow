const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Add BIMAnnotation and APIKey to Tenant
schema = schema.replace(
  '  bimImportJobs     BIMImportJob[]',
  '  bimImportJobs     BIMImportJob[]\n  bimAnnotations    BIMAnnotation[]\n  apiKeys           APIKey[]\n  webhooks          Webhook[]'
);

// Add BIMAnnotations relation to Asset
schema = schema.replace(
  '  energyMeters     EnergyMeter[]',
  '  energyMeters     EnergyMeter[]\n  bimAnnotations   BIMAnnotation[]'
);

// Add BIMAnnotations relation to User
schema = schema.replace(
  '  planAnnotations    PlanAnnotation[]',
  '  planAnnotations    PlanAnnotation[]\n  bimAnnotations     BIMAnnotation[]'
);

// Append new models
const h2Models = `
// ============== BIM OPS - ANNOTATIONS PERSISTANTES ==============
model BIMAnnotation {
  id          String    @id @default(uuid())
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  modelId     String
  model       BIMModel  @relation(fields: [modelId], references: [id], onDelete: Cascade)
  elementId   String?   // GUID IFC de l'élément annoté
  assetId     String?
  asset       Asset?    @relation(fields: [assetId], references: [id])
  type        String    @default("NOTE") // NOTE, DEFECT, INSPECTION, MEASUREMENT
  title       String
  body        String?
  attachments Json?
  position    Json      // {x, y, z} dans l'espace 3D
  resolved    Boolean   @default(false)
  resolvedAt  DateTime?
  createdById String
  createdBy   User      @relation(fields: [createdById], references: [id])
  history     BIMAnnotationHistory[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model BIMAnnotationHistory {
  id           String        @id @default(uuid())
  annotationId String
  annotation   BIMAnnotation @relation(fields: [annotationId], references: [id], onDelete: Cascade)
  change       String        // CREATED, UPDATED, RESOLVED
  before       Json?
  after        Json?
  changedById  String
  createdAt    DateTime      @default(now())
}

// ============== API PUBLIQUE V1 ==============
model APIKey {
  id          String    @id @default(uuid())
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  keyHash     String    @unique  // SHA-256 de la clé réelle
  prefix      String             // 8 premiers chars affichés
  tier        String    @default("PUBLIC_READ") // PUBLIC_READ, PUBLIC_WRITE, PARTNER
  rateLimit   Int       @default(60)            // req/min
  scopes      Json                              // ["assets:read", "wo:write", ...]
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  active      Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Webhook {
  id          String    @id @default(uuid())
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  url         String
  secret      String    // HMAC secret (chiffré)
  events      Json      // ["wo.created", "asset.updated", ...]
  active      Boolean   @default(true)
  lastCalledAt DateTime?
  lastStatus  Int?      // HTTP status du dernier appel
  failCount   Int       @default(0)
  deliveries  WebhookDelivery[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model WebhookDelivery {
  id          String   @id @default(uuid())
  webhookId   String
  webhook     Webhook  @relation(fields: [webhookId], references: [id], onDelete: Cascade)
  event       String
  payload     Json
  status      Int?     // HTTP status reçu
  response    String?
  duration    Int?     // ms
  success     Boolean  @default(false)
  deliveredAt DateTime @default(now())
}
`;

schema += h2Models;

// Add relation to BIMModel
schema = schema.replace(
  '  elements    BIMElement[]\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n}\n\nmodel BIMElement {',
  '  elements    BIMElement[]\n  annotations BIMAnnotation[]\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n}\n\nmodel BIMElement {'
);

fs.writeFileSync(schemaPath, schema);
console.log("Schema updated for Horizon 2 (BIM Ops + API publique)!");
