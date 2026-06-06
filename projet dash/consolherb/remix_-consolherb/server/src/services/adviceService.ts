import { prisma } from '../utils/prisma';

export interface SmartAdvice {
  type: 'ADVICE';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  action: string;
}

export async function analyzeSensorData(
  cropName: string,
  sensorType: 'pH' | 'temp',
  value: number
): Promise<SmartAdvice | null> {
  try {
    const knowledge = await prisma.cropKnowledge.findUnique({
      where: { name: cropName },
    });

    if (!knowledge) return null;

    if (sensorType === 'pH') {
      if (value < knowledge.idealPhMin) {
        return {
          type: 'ADVICE',
          severity: 'warning',
          title: `pH Trop Bas - ${cropName}`,
          message: `Le pH actuel est de ${value}, mais ${cropName} préfère ${knowledge.idealPhMin}-${knowledge.idealPhMax}.`,
          action: 'Suggéré : Ajouter de la chaux agricole pour remonter le pH.',
        };
      }
      if (value > knowledge.idealPhMax) {
        return {
          type: 'ADVICE',
          severity: 'warning',
          title: `pH Trop Haut - ${cropName}`,
          message: `Le pH actuel est de ${value}, mais ${cropName} préfère ${knowledge.idealPhMin}-${knowledge.idealPhMax}.`,
          action: 'Suggéré : Apporter du soufre ou de la tourbe pour acidifier le sol.',
        };
      }
    }

    if (sensorType === 'temp') {
      if (value > knowledge.idealTempMax) {
        return {
          type: 'ADVICE',
          severity: 'critical',
          title: `Stress Thermique - ${cropName}`,
          message: `Température critique : ${value}°C. Le maximum recommandé est ${knowledge.idealTempMax}°C.`,
          action: "Suggéré : Activer le système de brumisation ou l'ombrage.",
        };
      }
      if (value < knowledge.idealTempMin) {
        return {
          type: 'ADVICE',
          severity: 'warning',
          title: `Risque de Gel - ${cropName}`,
          message: `Température trop basse : ${value}°C. Le minimum recommandé est ${knowledge.idealTempMin}°C.`,
          action: "Suggéré : Déployer des voiles d'hivernage.",
        };
      }
    }
  } catch (error) {
    // DB error / unavailable
  }

  return null;
}
