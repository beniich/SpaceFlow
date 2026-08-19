const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Update Tenant with H4 relations
schema = schema.replace(
  '  extensions        ExtensionInstall[]',
  '  extensions        ExtensionInstall[]\n  workflows         WorkflowDefinition[]\n  sectorInstalls    SectorTemplateInstall[]'
);

// Append H4 models
const h4Models = `
// ============== WORKFLOW ENGINE NO-CODE ==============
model WorkflowDefinition {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  description String?
  active      Boolean  @default(true)
  // Trigger: event qui déclenche le workflow
  triggerType String   // WO_CREATED, WO_COMPLETED, ASSET_ALERT, ESG_THRESHOLD, SCHEDULE, CONTRACT_EXPIRY
  triggerConfig Json   // { eventType, filters, schedule (cron) }
  // Conditions: logique booléenne sur attributs métier
  conditions  Json?    // Array of { field, operator, value, logic (AND|OR) }
  // Actions: liste ordonnée d'actions à exécuter
  actions     Json     // Array of { type, config, order }
  // Actions types: NOTIFY, CREATE_WO, UPDATE_STATUS, CALL_API, UPDATE_ASSET, SEND_EMAIL
  rateLimit   Int?     // max executions/hour (protection)
  versions    WorkflowVersion[]
  executions  WorkflowExecution[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model WorkflowVersion {
  id           String             @id @default(uuid())
  workflowId   String
  workflow     WorkflowDefinition @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  version      Int
  snapshot     Json               // Snapshot complet du workflow à cette version
  changedById  String?
  changeNote   String?
  createdAt    DateTime           @default(now())

  @@unique([workflowId, version])
}

model WorkflowExecution {
  id           String             @id @default(uuid())
  workflowId   String
  workflow     WorkflowDefinition @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  triggeredBy  String             // SYSTEM, USER, SCHEDULE, WEBHOOK
  triggerData  Json?              // Données de l'événement déclencheur
  status       String             @default("PENDING") // PENDING, RUNNING, SUCCESS, FAILED, SKIPPED
  startedAt    DateTime?
  completedAt  DateTime?
  duration     Int?               // ms
  steps        WorkflowStep[]
  error        String?
  createdAt    DateTime           @default(now())
}

model WorkflowStep {
  id           String            @id @default(uuid())
  executionId  String
  execution    WorkflowExecution @relation(fields: [executionId], references: [id], onDelete: Cascade)
  actionType   String
  actionConfig Json
  order        Int
  status       String            @default("PENDING") // PENDING, SUCCESS, FAILED, SKIPPED
  output       Json?
  error        String?
  executedAt   DateTime?
  duration     Int?              // ms
}

// ============== RÉFÉRENTIELS SECTORIELS ==============
model SectorTemplate {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  vertical    String   // RETAIL, SANTE, EDUCATION, INDUSTRIE, PUBLIC
  description String
  features    Json     // Liste des fonctionnalités incluses
  workflows   Json?    // Workflows pré-configurés
  checklistTemplates Json? // Templates de checklists WO sectoriels
  reportTemplates    Json? // Templates de rapports réglementaires
  pricing     String   @default("CORE") // CORE (inclus), PREMIUM
  price       Float?
  currency    String   @default("EUR")
  active      Boolean  @default(true)
  installs    SectorTemplateInstall[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SectorTemplateInstall {
  id         String         @id @default(uuid())
  tenantId   String
  tenant     Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  templateId String
  template   SectorTemplate @relation(fields: [templateId], references: [id])
  config     Json?          // Personnalisation tenant-specific
  active     Boolean        @default(true)
  installedAt DateTime      @default(now())
  updatedAt  DateTime       @updatedAt

  @@unique([tenantId, templateId])
}
`;

schema += h4Models;
fs.writeFileSync(schemaPath, schema);
console.log("Schema updated for Horizon 4 (Workflow Engine + Référentiels Sectoriels)!");
