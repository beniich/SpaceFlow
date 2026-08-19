/**
 * Service d'import/export COBie Lite
 * 
 * COBie (Construction Operations Building Information Exchange) est un standard
 * qui structure les données de facility management (assets, espaces, contacts).
 * 
 * Ce service supporte :
 * - Export COBie Lite → CSV (colonnes essentielles)
 * - Parsing COBie CSV → import dans Prisma
 * 
 * Colonnes COBie minimales implémentées :
 * Facility, Floor, Space, Component (= Asset), Type
 */
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const prisma = require('../config/database');

/**
 * Exporte les assets d'un bâtiment au format COBie Lite CSV
 * @param {string} buildingId
 * @returns {string} CSV content
 */
async function exportCOBie(buildingId) {
  const building = await prisma.building.findUnique({
    where: { id: buildingId },
    include: {
      floors: {
        include: {
          spaces: {
            include: { assets: true }
          }
        }
      },
      assets: {
        where: { spaceId: null, floorId: null } // Assets sans localisation précise
      }
    }
  });
  if (!building) throw new Error('Bâtiment introuvable');

  const rows = [];
  
  // En-tête COBie Component (asset)
  const header = [
    'Name', 'CreatedBy', 'CreatedOn', 'TypeName', 'Space', 'Description',
    'TagNumber', 'SerialNumber', 'InstallationDate', 'WarrantyStartDate',
    'WarrantyEndDate', 'ExternalIdentifier', 'ExternalSystem'
  ];
  rows.push(header);

  // Émettre les assets par espace
  for (const floor of building.floors || []) {
    for (const space of floor.spaces || []) {
      for (const asset of space.assets || []) {
        rows.push([
          asset.name,
          'beecarbonit_cafm',
          asset.createdAt?.toISOString() || new Date().toISOString(),
          asset.category,
          space.name,
          asset.model || '',
          asset.tagNumber || '',
          asset.serialNumber || '',
          asset.installDate?.toISOString()?.split('T')[0] || '',
          asset.purchaseDate?.toISOString()?.split('T')[0] || '',
          asset.warrantyEnd?.toISOString()?.split('T')[0] || '',
          asset.cobieExternalId || asset.id,
          'beecarbonit'
        ]);
      }
    }
  }

  return stringify(rows);
}

/**
 * Importe un CSV COBie Lite et crée/met à jour les assets dans Prisma
 * @param {string} csvContent - Contenu du fichier CSV
 * @param {string} buildingId - Bâtiment de destination
 * @param {string} tenantId
 * @returns {object} Résumé de l'import
 */
async function importCOBie(csvContent, buildingId, tenantId) {
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  
  let created = 0;
  let updated = 0;
  let errors = [];

  for (const row of records) {
    try {
      const externalId = row['ExternalIdentifier'] || null;
      const existing = externalId 
        ? await prisma.asset.findFirst({ where: { cobieExternalId: externalId } })
        : null;

      const data = {
        name: row['Name'] || 'Unnamed Asset',
        category: mapCOBieCategory(row['TypeName']),
        serialNumber: row['SerialNumber'] || null,
        tagNumber: row['TagNumber'] || null,
        purchaseDate: row['WarrantyStartDate'] ? new Date(row['WarrantyStartDate']) : null,
        warrantyEnd: row['WarrantyEndDate'] ? new Date(row['WarrantyEndDate']) : null,
        installDate: row['InstallationDate'] ? new Date(row['InstallationDate']) : null,
        cobieExternalId: externalId,
        buildingId,
        tenantId
      };

      if (existing) {
        await prisma.asset.update({ where: { id: existing.id }, data });
        updated++;
      } else {
        await prisma.asset.create({ data });
        created++;
      }
    } catch (err) {
      errors.push({ row: row['Name'], error: err.message });
    }
  }

  return { created, updated, errors, total: records.length };
}

/**
 * Correspondance catégorie COBie → enum AssetCategory Prisma
 */
function mapCOBieCategory(cobie = '') {
  const map = {
    'HVAC': 'HVAC', 'Heating': 'HVAC', 'Cooling': 'HVAC', 'Ventilation': 'HVAC',
    'Electrical': 'ELECTRICAL', 'Lighting': 'ELECTRICAL', 'Power': 'ELECTRICAL',
    'Plumbing': 'PLUMBING', 'Sanitary': 'PLUMBING',
    'Fire': 'FIRE_SAFETY', 'Sprinkler': 'FIRE_SAFETY',
    'IT': 'IT', 'Telecom': 'IT', 'Network': 'IT',
    'Security': 'SECURITY', 'CCTV': 'SECURITY', 'Access': 'SECURITY',
    'Elevator': 'ELEVATOR', 'Lift': 'ELEVATOR',
    'Furniture': 'FURNITURE',
    'Structure': 'STRUCTURE', 'Wall': 'STRUCTURE', 'Roof': 'STRUCTURE'
  };
  for (const [key, val] of Object.entries(map)) {
    if (cobie.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return 'OTHER';
}

module.exports = { exportCOBie, importCOBie };
