-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- BIM Models
CREATE TYPE "BIMStatus" AS ENUM ('UPLOADING', 'PROCESSING', 'READY', 'ERROR', 'ARCHIVED');
CREATE TYPE "BIMElementType" AS ENUM ('SITE', 'BUILDING', 'FLOOR', 'SPACE', 'ZONE', 'ASSET', 'STRUCTURE', 'OTHER');

CREATE TABLE "BIMModel" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "originalFilename" TEXT,
    "storageKey" TEXT NOT NULL,
    "fileSize" BIGINT,
    "fileHash" TEXT,
    "status" "BIMStatus" NOT NULL DEFAULT 'PROCESSING',
    "elementCount" INTEGER NOT NULL DEFAULT 0,
    "buildingId" TEXT,
    "coordinateSystem" TEXT,
    "units" TEXT,
    "extractionDurationMs" INTEGER,
    "errorMessage" TEXT,
    "errorAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "lastViewedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "BIMModel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BIMModel_tenantId_fileHash_key" ON "BIMModel"("tenantId", "fileHash");
CREATE INDEX "BIMModel_tenantId_status_idx" ON "BIMModel"("tenantId", "status");
CREATE INDEX "BIMModel_buildingId_idx" ON "BIMModel"("buildingId");
CREATE INDEX "BIMModel_deletedAt_idx" ON "BIMModel"("deletedAt");

-- BIM Elements
CREATE TABLE "BIMElement" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "expressID" INTEGER NOT NULL,
    "ifcGlobalId" TEXT NOT NULL,
    "ifcType" TEXT NOT NULL,
    "elementType" "BIMElementType" NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "level" TEXT,
    "parentExpressID" INTEGER,
    "geometry" JSONB,
    "properties" JSONB,
    "boundingBox" JSONB,
    "metadata" JSONB,
    "assetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "BIMElement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BIMElement_modelId_expressID_key" ON "BIMElement"("modelId", "expressID");
CREATE INDEX "BIMElement_tenantId_idx" ON "BIMElement"("tenantId");
CREATE INDEX "BIMElement_modelId_idx" ON "BIMElement"("modelId");
CREATE INDEX "BIMElement_ifcGlobalId_idx" ON "BIMElement"("ifcGlobalId");
CREATE INDEX "BIMElement_assetId_idx" ON "BIMElement"("assetId");
CREATE INDEX "BIMElement_elementType_idx" ON "BIMElement"("elementType");
CREATE INDEX "BIMElement_parentExpressID_idx" ON "BIMElement"("parentExpressID");
CREATE INDEX "BIMElement_deletedAt_idx" ON "BIMElement"("deletedAt");

-- Sensors & Readings
CREATE TYPE "SensorType" AS ENUM (
    'TEMPERATURE', 'HUMIDITY', 'PRESSURE', 'VIBRATION', 'ENERGY',
    'FLOW', 'CO2', 'AIR_QUALITY', 'LEVEL', 'CURRENT', 'VOLTAGE', 'CUSTOM'
);
CREATE TYPE "SensorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'FAULTY', 'CALIBRATING', 'RETIRED');
CREATE TYPE "DataQuality" AS ENUM ('GOOD', 'DEGRADED', 'BAD', 'OUTLIER');

CREATE TABLE "Sensor" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SensorType" NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "SensorStatus" NOT NULL DEFAULT 'ACTIVE',
    "protocol" TEXT,
    "position" JSONB,
    "metadata" JSONB,
    "lastReadingAt" TIMESTAMP(3),
    "lastReadingValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Sensor_tenantId_code_key" ON "Sensor"("tenantId", "code");
CREATE INDEX "Sensor_tenantId_assetId_idx" ON "Sensor"("tenantId", "assetId");
CREATE INDEX "Sensor_type_idx" ON "Sensor"("type");
CREATE INDEX "Sensor_status_idx" ON "Sensor"("status");
CREATE INDEX "Sensor_lastReadingAt_idx" ON "Sensor"("lastReadingAt");

CREATE TABLE "sensor_readings" (
    "id" BIGSERIAL NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "quality" "DataQuality" NOT NULL DEFAULT 'GOOD',
    "rawValue" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "sensor_readings_sensorId_timestamp_idx" ON "sensor_readings"("sensorId", "timestamp" DESC);
CREATE INDEX "sensor_readings_tenantId_timestamp_idx" ON "sensor_readings"("tenantId", "timestamp" DESC);

CREATE TABLE "SensorThreshold" (
    "id" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "minCritical" DOUBLE PRECISION,
    "maxCritical" DOUBLE PRECISION,
    "hysteresis" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "setBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SensorThreshold_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SensorThreshold_sensorId_key" ON "SensorThreshold"("sensorId");

-- Alerts
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL', 'EMERGENCY');

CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "modelId" TEXT,
    "sensorId" TEXT,
    "assetId" TEXT,
    "severity" "AlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "value" DOUBLE PRECISION,
    "threshold" DOUBLE PRECISION,
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedById" TEXT,
    "dismissedAt" TIMESTAMP(3),
    "dismissedById" TEXT,
    "dismissedReason" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Alert_tenantId_createdAt_idx" ON "Alert"("tenantId", "createdAt" DESC);
CREATE INDEX "Alert_tenantId_severity_idx" ON "Alert"("tenantId", "severity");
CREATE INDEX "Alert_modelId_idx" ON "Alert"("modelId");
CREATE INDEX "Alert_sensorId_idx" ON "Alert"("sensorId");
CREATE INDEX "Alert_acknowledgedAt_idx" ON "Alert"("acknowledgedAt");

-- Session management tables
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER', 'DEMO');
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'TRIAL', 'CANCELLED');

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- Audit events
CREATE TABLE "AuditEvent" (
    "id" BIGSERIAL NOT NULL,
    "tenantId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditEvent_tenantId_timestamp_idx" ON "AuditEvent"("tenantId", "timestamp" DESC);
CREATE INDEX "AuditEvent_resource_resourceId_idx" ON "AuditEvent"("resource", "resourceId");
CREATE INDEX "AuditEvent_userId_idx" ON "AuditEvent"("userId");

-- Demo sessions (RGPD tracking)
CREATE TABLE "DemoSession" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "actionsCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    CONSTRAINT "DemoSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DemoSession_ipAddress_startedAt_idx" ON "DemoSession"("ipAddress", "startedAt");
CREATE INDEX "DemoSession_expiresAt_idx" ON "DemoSession"("expiresAt");
