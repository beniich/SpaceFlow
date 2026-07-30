const prisma = require('../config/database');

/**
 * Service de simulation jumeau numérique
 * Basé sur les modèles Location + Asset + TelemetryData existants
 */
class TwinService {
  /**
   * Vue d'ensemble d'un bâtiment (basé sur Location hiérarchique)
   */
  async getBuildingOverview(locationId) {
    const building = await prisma.location.findUnique({
      where: { id: locationId },
      include: {
        children: {
          include: {
            children: true, // sous-zones/salles
            assets: { select: { id: true, name: true, status: true, healthScore: true, category: true } }
          }
        },
        assets: { select: { id: true, name: true, status: true, healthScore: true, category: true } }
      }
    });

    if (!building) throw new Error('Bâtiment non trouvé');

    // Agréger tous les actifs (bâtiment + étages + salles)
    const allAssets = [
      ...building.assets,
      ...building.children.flatMap((c) => [...c.assets, ...c.children.flatMap((cc) => cc.assets || [])])
    ];

    const stats = {
      totalAssets: allAssets.length,
      operationalAssets: allAssets.filter((a) => a.status === 'OPERATIONAL').length,
      maintenanceAssets: allAssets.filter((a) => a.status === 'MAINTENANCE').length,
      breakdownAssets: allAssets.filter((a) => a.status === 'BREAKDOWN').length,
      avgHealth:
        allAssets.length > 0
          ? Math.round(allAssets.reduce((s, a) => s + a.healthScore, 0) / allAssets.length)
          : 0,
      totalFloors: building.children.length,
      totalArea: building.area || 0
    };

    // Heatmap basée sur les assets
    const heatmap = allAssets.map((a, i) => ({
      x: 10 + (i % 10) * 8,
      y: 10 + Math.floor(i / 10) * 8,
      value: a.healthScore,
      label: a.name,
      status: a.status
    }));

    // Étages simulés
    const floors = building.children.map((floor, i) => ({
      id: floor.id,
      number: i + 1,
      name: floor.name,
      assets: floor.assets,
      subSpaces: floor.children,
      area: floor.area || 0,
      occupancyRate: Math.floor(60 + Math.random() * 35)
    }));

    return { building, stats, floors, heatmap };
  }

  /**
   * Exécute une simulation et retourne les résultats
   */
  async runSimulation(locationId, scenario, parameters = {}) {
    const location = await prisma.location.findUnique({ where: { id: locationId } });

    const results = this.computeScenario(scenario, parameters, location);

    return {
      scenario,
      locationId,
      locationName: location?.name || 'Bâtiment',
      parameters,
      results,
      computedAt: new Date().toISOString()
    };
  }

  computeScenario(scenario, params, location) {
    switch (scenario) {
      case 'fire':
        return {
          evacuationTime: parseFloat((8 + Math.random() * 5).toFixed(1)),
          peopleAtRisk: params.occupancy || Math.floor(80 + Math.random() * 70),
          affectedZones: ['Zone A', 'Zone B', 'Couloir Nord'].slice(0, 2 + Math.floor(Math.random() * 2)),
          safeExits: 4,
          responseTime: 3.5,
          recommendations: [
            'Activer alarme sonore immédiatement',
            'Débloquer sorties de secours B et C',
            'Mobiliser équipe intervention zone A',
            'Couper alimentation électrique sous-station 2'
          ]
        };

      case 'evacuation':
        return {
          totalEvacuees: params.occupancy || 150,
          timeToClear: parseFloat((5 + Math.random() * 4).toFixed(1)),
          bottleneck: 'Escalier principal (surcharge 40%)',
          optimalPaths: ['Sortie Nord → Parking', 'Sortie Sud → Rue'],
          recommendations: [
            'Ouvrir sortie de secours Ouest',
            'Déployer agents aux points de convergence'
          ]
        };

      case 'energy_optim':
        return {
          currentConsumption: 8500,
          optimizedConsumption: 6760,
          savingsPercent: 20.5,
          co2ReductionTonnes: 1.4,
          paybackMonths: 8,
          recommendations: [
            'Réduire HVAC zones inoccupées 18h–6h (−15%)',
            'Baisser éclairage couloirs 30% (−8%)',
            'Mode éco ascenseurs heures creuses (−5%)',
            'Optimiser consigne chauffage +1°C nuit (−7%)'
          ]
        };

      case 'maintenance':
        return {
          plannedDowntime: params.duration || 4,
          affectedAssets: Math.floor(8 + Math.random() * 6),
          estimatedCostImpact: Math.floor(3000 + Math.random() * 3000),
          optimalWindow: 'Samedi 22h00 – Dimanche 06h00',
          productivityLoss: parseFloat((6 + Math.random() * 5).toFixed(1)),
          recommendations: [
            'Planifier intervention week-end pour réduire impact',
            'Prévenir équipes en avance',
            'Précommander pièces détachées'
          ]
        };

      default:
        return { error: 'Scénario inconnu', availableScenarios: ['fire', 'evacuation', 'energy_optim', 'maintenance'] };
    }
  }

  /**
   * Capture l'état actuel du jumeau via TelemetryData
   */
  async captureSnapshot(locationId) {
    const telemetry = await prisma.telemetryData.findMany({
      where: {
        asset: { locationId }
      },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    const byType = {};
    telemetry.forEach((t) => {
      if (!byType[t.sensorType]) byType[t.sensorType] = [];
      byType[t.sensorType].push(t.value);
    });

    const metrics = {};
    Object.entries(byType).forEach(([type, values]) => {
      metrics[type] = {
        current: values[0],
        average: parseFloat((values.reduce((s, v) => s + v, 0) / values.length).toFixed(2)),
        min: parseFloat(Math.min(...values).toFixed(2)),
        max: parseFloat(Math.max(...values).toFixed(2))
      };
    });

    return {
      locationId,
      capturedAt: new Date().toISOString(),
      sensorCount: telemetry.length,
      metrics
    };
  }
}

module.exports = new TwinService();
