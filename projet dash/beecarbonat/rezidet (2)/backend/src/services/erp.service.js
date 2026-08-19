const prisma = require('../config/database');

class ERPService {
  async triggerSync(connectionId, userId) {
    const conn = await prisma.eRPConnection.findUnique({ where: { id: connectionId } });
    if (!conn) throw new Error('Connexion ERP introuvable');

    const startTime = new Date();

    // Créer un log de début
    const log = await prisma.eRPSyncLog.create({
      data: {
        connectionId,
        type: 'MANUAL_SYNC',
        status: 'RUNNING',
        startedAt: startTime,
        triggeredBy: userId,
        duration: 0
      }
    });

    try {
      // MOCK : Simulation de l'appel à une API ERP (Odoo/SAP)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAssetsFromERP = [
        { erpId: 'ERP-A-101', name: 'Chaudière Principale', category: 'HVAC' },
        { erpId: 'ERP-A-102', name: 'Groupe Électrogène', category: 'ELECTRICAL' }
      ];

      let created = 0;
      let updated = 0;

      // Traitement des données mockées
      for (const item of mockAssetsFromERP) {
        const mapping = await prisma.eRPAssetMapping.findFirst({
          where: { connectionId, erpAssetId: item.erpId }
        });

        if (mapping) {
          // Mise à jour (simplifié)
          await prisma.asset.update({
            where: { id: mapping.cafmAssetId },
            data: { name: item.name }
          });
          updated++;
        } else {
          // Création (on rattache au premier building/floor dispo pour l'exemple)
          const space = await prisma.space.findFirst();
          if (space) {
            const asset = await prisma.asset.create({
              data: {
                name: item.name,
                category: item.category,
                status: 'OPERATIONAL',
                spaceId: space.id,
                tenantId: conn.tenantId
              }
            });
            await prisma.eRPAssetMapping.create({
              data: {
                connectionId,
                cafmAssetId: asset.id,
                erpAssetId: item.erpId,
                erpAssetType: 'EQUIPMENT'
              }
            });
            created++;
          }
        }
      }

      const endTime = new Date();
      const duration = Math.floor((endTime - startTime) / 1000);

      await prisma.eRPSyncLog.update({
        where: { id: log.id },
        data: {
          status: 'SUCCESS',
          completedAt: endTime,
          duration,
          recordsProcessed: mockAssetsFromERP.length,
          recordsCreated: created,
          recordsUpdated: updated
        }
      });

      return { success: true, created, updated, duration };
    } catch (err) {
      const endTime = new Date();
      await prisma.eRPSyncLog.update({
        where: { id: log.id },
        data: {
          status: 'FAILED',
          completedAt: endTime,
          duration: Math.floor((endTime - startTime) / 1000),
          errors: JSON.stringify({ message: err.message })
        }
      });
      throw err;
    }
  }
}

module.exports = new ERPService();
