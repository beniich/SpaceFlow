const prisma = require('../config/database');

class TwinService {
  async captureSnapshot(twinId) {
    const twin = await prisma.digitalTwin.findUnique({
      where: { id: twinId },
      include: {
        building: {
          include: {
            assets: { include: { sensors: { include: { readings: { take: 5, orderBy: { timestamp: 'desc' } } } } } }
          }
        },
        asset: { include: { sensors: { include: { readings: { take: 10, orderBy: { timestamp: 'desc' } } } } } }
      }
    });

    if (!twin) throw new Error('Jumeau non trouvé');

    const dataObj = {
      timestamp: new Date().toISOString(),
      sensors: [],
      metrics: {}
    };

    const sensors = twin.building?.assets?.flatMap(a => a.sensors) || twin.asset?.sensors || [];
    sensors.forEach(s => {
      if (s.readings && s.readings.length > 0) {
        const avg = s.readings.reduce((sum, r) => sum + r.value, 0) / s.readings.length;
        dataObj.sensors.push({
          id: s.id,
          type: s.type,
          current: s.value,
          average: Math.round(avg * 100) / 100,
          unit: s.unit
        });
      }
    });

    const tempSensors = dataObj.sensors.filter(s => s.type === 'temperature');
    if (tempSensors.length > 0) {
      dataObj.metrics.avgTemperature = tempSensors.reduce((s, x) => s + x.current, 0) / tempSensors.length;
    }

    const energySensors = dataObj.sensors.filter(s => s.type === 'energy');
    if (energySensors.length > 0) {
      dataObj.metrics.totalEnergy = energySensors.reduce((s, x) => s + x.current, 0);
    }

    const snapshot = await prisma.twinSnapshot.create({
      data: {
        twinId,
        data: JSON.stringify(dataObj),
        thumbnail: this.generateThumbnail(dataObj)
      }
    });

    return snapshot;
  }

  async runSimulation(twinId, scenario, parameters) {
    const twin = await prisma.digitalTwin.findUnique({ where: { id: twinId } });
    if (!twin) throw new Error('Jumeau non trouvé');

    let results = {};
    let duration = 60;

    switch (scenario) {
      case 'fire':
        results = {
          evacuationTime: 8 + Math.random() * 5,
          peopleAtRisk: Math.floor(50 + Math.random() * 100),
          affectedZones: ['A1', 'A2', 'B1'].slice(0, Math.floor(Math.random() * 3) + 1),
          safeExits: 4,
          responseTime: 3.5,
          recommendations: [
            'Activer alarme sonore immédiatement',
            'Débloquer sorties de secours B et C',
            'Mobiliser équipe intervention zone A'
          ]
        };
        duration = 30;
        break;

      case 'evacuation':
        results = {
          totalEvacuees: parameters?.occupancy || 150,
          bottleneck: 'Escalier principal',
          timeToClear: 6.5,
          optimalPath: ['Sortie Nord', 'Sortie Sud', 'Sortie Est']
        };
        duration = 15;
        break;

      case 'energy_optim':
        results = {
          currentConsumption: 8500,
          optimizedConsumption: 6800,
          savingsPercent: 20,
          recommendations: [
            'Réduire HVAC zones inoccupées de 18h à 6h',
            'Baisser éclairage 30% dans couloirs',
            'Activer mode éco ascenseurs heures creuses'
          ],
          co2Reduction: 1.2
        };
        duration = 1440;
        break;

      case 'maintenance':
        results = {
          downtime: parameters?.duration || 4,
          affectedAssets: 12,
          costImpact: 4500,
          alternativeSchedule: 'Week-end 22h-6h recommandé',
          productivityLoss: 8.5
        };
        duration = parameters?.duration || 240;
        break;

      default:
        results = { error: 'Scénario inconnu' };
    }

    const simulation = await prisma.twinSimulation.create({
      data: {
        twinId,
        scenario,
        parameters: JSON.stringify(parameters || {}),
        results: JSON.stringify(results),
        duration
      }
    });

    return simulation;
  }

  generateThumbnail(data) {
    return `thumb_${Date.now()}_${Math.floor(data.metrics?.avgTemperature || 20)}`;
  }

  async getBuildingOverview(buildingId) {
    const [building, assets, spaces, sensors] = await Promise.all([
      prisma.building.findUnique({ where: { id: buildingId } }),
      prisma.asset.findMany({ where: { buildingId } }),
      prisma.space.findMany({ where: { buildingId } }),
      prisma.sensor.findMany({
        where: { asset: { buildingId } },
        include: { asset: true, readings: { take: 1, orderBy: { timestamp: 'desc' } } }
      })
    ]);

    if (!building) {
      return {
        building: { name: 'Bâtiment Principal', floors: 5, totalArea: 5000 },
        stats: { totalAssets: 0, operationalAssets: 0, totalSpaces: 0, occupiedSpaces: 0, totalSensors: 0, avgHealth: 100 },
        floors: [],
        heatmap: []
      };
    }

    const avgHealth = assets.length > 0
      ? assets.reduce((s, a) => s + (a.healthScore || 100), 0) / assets.length
      : 100;

    return {
      building,
      stats: {
        totalAssets: assets.length,
        operationalAssets: assets.filter(a => a.status === 'OPERATIONAL').length,
        totalSpaces: spaces.length,
        occupiedSpaces: spaces.filter(s => s.status === 'occupied').length,
        totalSensors: sensors.length,
        avgHealth
      },
      floors: Array.from({ length: building.floors || 1 }, (_, i) => ({
        number: i + 1,
        spaces: spaces.filter(s => s.floor === i + 1),
        assets: assets.filter(a => parseInt(a.location?.match(/\d+/)?.[0] || '1') === i + 1)
      })),
      heatmap: this.generateHeatmap(assets, spaces)
    };
  }

  generateHeatmap(assets, spaces) {
    return assets.map(a => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      value: a.healthScore,
      label: a.name
    }));
  }
}

module.exports = new TwinService();
