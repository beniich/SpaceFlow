-- Migration manuelle : M1-M2 Modèle de Données Maître
-- À appliquer après `prisma migrate dev` sur PostgreSQL

-- ============================================================
-- ROW LEVEL SECURITY (RLS) pour isolation multi-tenant
-- ============================================================

-- Activer RLS sur les tables critiques
ALTER TABLE "Asset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Building" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Floor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Space" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Contract" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EnergyCounter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EnergyReading" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ESGReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BIMModel" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Part" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Procedure" ENABLE ROW LEVEL SECURITY;

-- Créer le rôle applicatif (utilisé par Prisma)
DO $$ BEGIN
  CREATE ROLE cafm_app_role;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Fonction helper pour récupérer le tenantId depuis app.current_tenant_id
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true);
END;
$$ LANGUAGE plpgsql STABLE;

-- Politique RLS Asset : lecture/écriture limitées au tenant courant (ou SUPER_ADMIN)
CREATE POLICY asset_tenant_isolation ON "Asset"
  USING (
    "tenantId" = current_tenant_id()
    OR current_setting('app.user_role', true) = 'SUPER_ADMIN'
  );

CREATE POLICY building_tenant_isolation ON "Building"
  USING (
    "tenantId" = current_tenant_id()
    OR current_setting('app.user_role', true) = 'SUPER_ADMIN'
  );

CREATE POLICY floor_tenant_isolation ON "Floor"
  USING (
    "tenantId" = current_tenant_id()
    OR current_setting('app.user_role', true) = 'SUPER_ADMIN'
  );

CREATE POLICY contract_tenant_isolation ON "Contract"
  USING (
    "tenantId" = current_tenant_id()
    OR current_setting('app.user_role', true) = 'SUPER_ADMIN'
  );

CREATE POLICY energy_counter_isolation ON "EnergyCounter"
  USING (
    "tenantId" = current_tenant_id()
    OR current_setting('app.user_role', true) = 'SUPER_ADMIN'
  );

CREATE POLICY esg_report_isolation ON "ESGReport"
  USING (
    "tenantId" = current_tenant_id()
    OR current_setting('app.user_role', true) = 'SUPER_ADMIN'
  );

CREATE POLICY bim_model_isolation ON "BIMModel"
  USING (
    "tenantId" = current_tenant_id()
    OR current_setting('app.user_role', true) = 'SUPER_ADMIN'
  );

-- ============================================================
-- INDEXES PERFORMANCE
-- ============================================================

-- Assets par tenant + statut (requêtes dashboard)
CREATE INDEX IF NOT EXISTS idx_asset_tenant_status ON "Asset" ("tenantId", "status");

-- Assets par bâtiment (carte des assets)
CREATE INDEX IF NOT EXISTS idx_asset_building ON "Asset" ("buildingId");
CREATE INDEX IF NOT EXISTS idx_asset_floor ON "Asset" ("floorId");
CREATE INDEX IF NOT EXISTS idx_asset_space ON "Asset" ("spaceId");

-- IFC GUID pour couplage BIM→Asset ultra-rapide
CREATE INDEX IF NOT EXISTS idx_asset_ifc_guid ON "Asset" ("ifcGuid") WHERE "ifcGuid" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bim_element_guid ON "BIMElement" ("ifcGuid");

-- EnergyReadings par période
CREATE INDEX IF NOT EXISTS idx_energy_reading_period ON "EnergyReading" ("counterId", "periodStart", "periodEnd");

-- WorkOrders par statut et assigné (liste techniciens)
CREATE INDEX IF NOT EXISTS idx_workorder_assigned_status ON "WorkOrder" ("assignedToId", "status");

-- Contrats expirant prochainement
CREATE INDEX IF NOT EXISTS idx_contract_expiry ON "Contract" ("endDate", "status") WHERE "status" = 'ACTIVE';

-- ============================================================
-- COMMENTAIRES COBie (documentation métadonnée)
-- ============================================================
COMMENT ON COLUMN "Asset"."cobieExternalId" IS 'COBie Lite: Asset.ExternalIdentifier';
COMMENT ON COLUMN "Asset"."cobieCategory" IS 'COBie Lite: Asset.Category (OmniClass)';
COMMENT ON COLUMN "Asset"."cobieTypeId" IS 'COBie Lite: Type.Name référencé';
COMMENT ON COLUMN "Asset"."tagNumber" IS 'COBie Lite: Asset.Tag - étiquette physique';
COMMENT ON COLUMN "Asset"."ifcGuid" IS 'IFC GlobalId pour couplage BIM <-> Asset';
COMMENT ON COLUMN "Building"."cobieExternalId" IS 'COBie Lite: Facility.ExternalIdentifier';
COMMENT ON COLUMN "Space"."cobieExternalId" IS 'COBie Lite: Space.ExternalIdentifier';
COMMENT ON COLUMN "Space"."cobieCategory" IS 'COBie Lite: Space.Category (OmniClass)';
COMMENT ON COLUMN "Space"."ifcSpaceId" IS 'IFC GlobalId de l espace (IfcSpace)';
