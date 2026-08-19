const prisma = require('../config/database');

class AIService {
  async analyzeAssetHealth(assetId) {
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        sensors: { include: { readings: { take: 20, orderBy: { timestamp: 'desc' } } } },
        workOrders: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!asset) throw new Error('Équipement introuvable');

    // MOCK: Simulation d'un appel à un modèle d'IA de maintenance prédictive
    // Dans la réalité, on enverrait les readings à un modèle ML pour détecter des anomalies.
    
    let score = 100;
    const anomalies = [];
    const recommendations = [];

    // Logique simplifiée
    const tempSensor = asset.sensors?.find(s => s.type === 'temperature');
    if (tempSensor && tempSensor.readings.length > 0) {
      const avgTemp = tempSensor.readings.reduce((sum, r) => sum + r.value, 0) / tempSensor.readings.length;
      if (avgTemp > 75) {
        score -= 20;
        anomalies.push({ type: 'temperature', severity: 'HIGH', message: 'Surchauffe détectée' });
        recommendations.push('Vérifier le système de refroidissement');
      }
    }

    const vibSensor = asset.sensors?.find(s => s.type === 'vibration');
    if (vibSensor && vibSensor.readings.length > 0) {
      const recentVib = vibSensor.readings[0].value;
      if (recentVib > 10) {
        score -= 30;
        anomalies.push({ type: 'vibration', severity: 'CRITICAL', message: 'Vibrations anormales' });
        recommendations.push('Remplacer les roulements principaux');
      }
    }

    if (asset.workOrders?.length > 2) {
      score -= 10;
      anomalies.push({ type: 'history', severity: 'MEDIUM', message: 'Défaillances répétées récentes' });
    }

    score = Math.max(0, score);

    // Mettre à jour le Health Score de l'Asset s'il a un champ
    // (Non présent par défaut, on met juste dans les logs)

    return {
      assetId,
      score,
      anomalies,
      recommendations,
      predictedFailure: score < 50 ? 'Dans les 7 jours' : 'Stable'
    };
  }

  async generatePreventiveWorkOrder(assetId, recommendation) {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new Error('Asset introuvable');

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

    const wo = await prisma.workOrder.create({
      data: {
        title: 'Maintenance Prédictive (IA)',
        description: `Action recommandée par l'IA : ${recommendation}`,
        type: 'PREVENTIVE',
        priority: 'HIGH',
        status: 'PENDING',
        assetId: assetId,
        createdById: admin?.id || 'system',
        scheduledAt: new Date(Date.now() + 86400000 * 2) // Dans 2 jours
      }
    });

    return wo;
  }
}

module.exports = new AIService();
