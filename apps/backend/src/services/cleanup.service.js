const { prisma } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Nettoie les événements de webhooks traités depuis plus de 60 jours.
 * À appeler via une tâche Cron ou planificateur.
 */
exports.purgeOldWebhookEvents = async (days = 60) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await prisma.processedWebhookEvent.deleteMany({
      where: {
        processedAt: {
          lt: cutoffDate,
        },
      },
    });

    logger.info({ 
      deletedCount: result.count,
      cutoffDate: cutoffDate.toISOString() 
    }, '🧹 Nettoyage des anciens webhooks réussi');
    
    return result.count;
  } catch (error) {
    logger.error({ error: error.message }, '❌ Échec du nettoyage des webhooks');
    throw error;
  }
};
