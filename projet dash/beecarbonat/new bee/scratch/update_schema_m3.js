const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Update Tenant
schema = schema.replace(
  'procedures        Procedure[]',
  'procedures        Procedure[]\n  workOrders        WorkOrder[]\n  workOrderTemplates WorkOrderTemplate[]\n  floorPlans        FloorPlan[]'
);

// Update Building
schema = schema.replace(
  'spaces       Space[]',
  'spaces       Space[]\n  floorPlans   FloorPlan[]'
);

// Update Space
schema = schema.replace(
  'reservations Reservation[]',
  'reservations Reservation[]\n  floorPlans   FloorPlan[]'
);

// Update User
schema = schema.replace(
  'inventoryMovements InventoryMovement[]',
  'inventoryMovements InventoryMovement[]\n  planAnnotations    PlanAnnotation[]'
);

// Update Asset
schema = schema.replace(
  'erpAssetMappings ERPAssetMapping[]',
  'erpAssetMappings ERPAssetMapping[]\n  planAnnotations  PlanAnnotation[]'
);

// Update WorkOrder model
const oldWorkOrderModel = `model WorkOrder {
  id            String    @id @default(uuid())
  title         String
  description   String
  type          String
  priority      String    @default("MEDIUM")
  status        String    @default("PENDING")
  estimatedCost Float?
  actualCost    Float?
  scheduledAt   DateTime
  completedAt   DateTime?

  assetId       String
  asset         Asset     @relation(fields: [assetId], references: [id])

  assignedToId  String?
  assignedTo    User?     @relation("AssignedTo", fields: [assignedToId], references: [id])

  createdById   String
  createdBy     User      @relation("CreatedBy", fields: [createdById], references: [id])

  comments      Comment[]
  orderParts    WorkOrderPart[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}`;

const newWorkOrderModel = `model WorkOrder {
  id            String    @id @default(uuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  title         String
  description   String
  type          String
  priority      String    @default("MEDIUM")
  status        String    @default("PENDING")
  estimatedCost Float?
  actualCost    Float?
  scheduledAt   DateTime
  completedAt   DateTime?
  signatureUrl  String?
  attachments   Json?
  checklist     Json?

  templateId    String?
  template      WorkOrderTemplate? @relation(fields: [templateId], references: [id])

  assetId       String
  asset         Asset     @relation(fields: [assetId], references: [id])

  assignedToId  String?
  assignedTo    User?     @relation("AssignedTo", fields: [assignedToId], references: [id])

  createdById   String
  createdBy     User      @relation("CreatedBy", fields: [createdById], references: [id])

  comments      Comment[]
  orderParts    WorkOrderPart[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}`;

schema = schema.replace(oldWorkOrderModel, newWorkOrderModel);

// Append new models at the end of the file
const newModels = `
// ============== PLANS 2D & WO TEMPLATES ==============
model WorkOrderTemplate {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  type        String   // PREVENTIVE, CORRECTIVE, REGULATORY
  description String?
  checklist   Json?    // Default tasks
  priority    String   @default("MEDIUM")
  workOrders  WorkOrder[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model FloorPlan {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  fileUrl     String   // PDF or image URL
  buildingId  String?
  building    Building? @relation(fields: [buildingId], references: [id])
  spaceId     String?
  space       Space?    @relation(fields: [spaceId], references: [id])
  annotations PlanAnnotation[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model PlanAnnotation {
  id          String    @id @default(uuid())
  planId      String
  plan        FloorPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  assetId     String?
  asset       Asset?    @relation(fields: [assetId], references: [id])
  geometry    Json      // Coordinates/layer data for the annotation
  markup      Json?     // SVG path, text, styling, etc.
  createdById String
  createdBy   User      @relation(fields: [createdById], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
`;

schema = schema + newModels;

fs.writeFileSync(schemaPath, schema);
console.log("Schema updated for M3-M4!");
