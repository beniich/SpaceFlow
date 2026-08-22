-- Migration compatible avec les donnees existantes
-- Preserve existing rows while adding required columns

-- Create default tenant for existing data
INSERT INTO "Tenant" (id, name, slug, status, "createdAt", "updatedAt")
VALUES ('00000000-0000-0000-0000-000000000001', 'Default', 'default', 'ACTIVE', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============ USER TABLE ============
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;
UPDATE "User" SET "passwordHash" = 'PLACEHOLDER_NEEDS_RESET' WHERE "passwordHash" IS NULL;
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "User" SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
ALTER TABLE "User" ALTER COLUMN "tenantId" SET NOT NULL;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);
UPDATE "User" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;

-- ============ ASSET TABLE ============
ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "Asset" SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
ALTER TABLE "Asset" ALTER COLUMN "tenantId" SET NOT NULL;

ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "code" TEXT;
UPDATE "Asset" SET "code" = CONCAT('AST-', SUBSTRING(id, 1, 8)) WHERE "code" IS NULL;
ALTER TABLE "Asset" ALTER COLUMN "code" SET NOT NULL;

ALTER TABLE "Asset" ADD COLUMN IF NOT EXISTS "type" TEXT;
UPDATE "Asset" SET "type" = 'EQUIPMENT' WHERE "type" IS NULL;
ALTER TABLE "Asset" ALTER COLUMN "type" SET NOT NULL;

-- ============ BUILDING TABLE ============
ALTER TABLE "Building" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "Building" SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
ALTER TABLE "Building" ALTER COLUMN "tenantId" SET NOT NULL;

ALTER TABLE "Building" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);
UPDATE "Building" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
ALTER TABLE "Building" ALTER COLUMN "updatedAt" SET NOT NULL;

-- ============ SENSOR TABLE ============
ALTER TABLE "Sensor" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "Sensor" SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
ALTER TABLE "Sensor" ALTER COLUMN "tenantId" SET NOT NULL;

ALTER TABLE "Sensor" ADD COLUMN IF NOT EXISTS "code" TEXT;
UPDATE "Sensor" SET "code" = CONCAT('SEN-', SUBSTRING(id, 1, 8)) WHERE "code" IS NULL;
ALTER TABLE "Sensor" ALTER COLUMN "code" SET NOT NULL;

ALTER TABLE "Sensor" ADD COLUMN IF NOT EXISTS "name" TEXT;
UPDATE "Sensor" SET "name" = CONCAT('Sensor-', SUBSTRING(id, 1, 8)) WHERE "name" IS NULL;
ALTER TABLE "Sensor" ALTER COLUMN "name" SET NOT NULL;

ALTER TABLE "Sensor" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);
UPDATE "Sensor" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
ALTER TABLE "Sensor" ALTER COLUMN "updatedAt" SET NOT NULL;

-- ============ LEASE TABLE ============
ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "Lease" SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
ALTER TABLE "Lease" ALTER COLUMN "tenantId" SET NOT NULL;

ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS "rentAmount" DECIMAL(10,2);
UPDATE "Lease" SET "rentAmount" = 0 WHERE "rentAmount" IS NULL;
ALTER TABLE "Lease" ALTER COLUMN "rentAmount" SET NOT NULL;

ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);
UPDATE "Lease" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
ALTER TABLE "Lease" ALTER COLUMN "updatedAt" SET NOT NULL;

-- ============ WORKORDER TABLE ============
ALTER TABLE "WorkOrder" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "WorkOrder" SET "tenantId" = '00000000-0000-0000-0000-000000000001' WHERE "tenantId" IS NULL;
ALTER TABLE "WorkOrder" ALTER COLUMN "tenantId" SET NOT NULL;
