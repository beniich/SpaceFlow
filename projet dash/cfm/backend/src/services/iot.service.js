/**
 * Service de simulation IoT
 * Génère des lectures de capteurs fictives et les émet via Socket.io
 * Compatible avec le schéma SQLite actuel (sans modèle Sensor dédié)
 */

const SENSOR_TYPES = [
  { id: 's-temp-01', type: 'temperature', unit: '°C', base: 21, delta: 4 },
  { id: 's-temp-02', type: 'temperature', unit: '°C', base: 19, delta: 3 },
  { id: 's-hum-01', type: 'humidity', unit: '%', base: 55, delta: 15 },
  { id: 's-energy-01', type: 'energy', unit: 'kW', base: 25, delta: 20 },
  { id: 's-energy-02', type: 'energy', unit: 'kW', base: 40, delta: 25 },
  { id: 's-vibration-01', type: 'vibration', unit: 'mm/s', base: 2, delta: 3 },
  { id: 's-co2-01', type: 'co2', unit: 'ppm', base: 400, delta: 200 },
  { id: 's-pressure-01', type: 'pressure', unit: 'bar', base: 1.5, delta: 0.5 },
];

// Valeurs courantes en mémoire (state interne)
const sensorState = {};
SENSOR_TYPES.forEach(s => { sensorState[s.id] = s.base; });

const startIoTSimulation = (io) => {
  setInterval(() => {
    try {
      // Sélectionner 3 capteurs aléatoires par cycle (pas tous à la fois)
      const sample = SENSOR_TYPES
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      for (const sensor of sample) {
        // Variation réaliste : marche aléatoire bornée
        const variation = (Math.random() - 0.5) * sensor.delta * 0.3;
        let newValue = sensorState[sensor.id] + variation;

        // Borner la valeur dans la plage réaliste
        newValue = Math.max(sensor.base - sensor.delta, Math.min(sensor.base + sensor.delta, newValue));
        newValue = Math.round(newValue * 100) / 100;
        sensorState[sensor.id] = newValue;

        const payload = {
          sensorId: sensor.id,
          type: sensor.type,
          value: newValue,
          unit: sensor.unit,
          timestamp: new Date().toISOString()
        };

        // Émission temps réel vers les clients WebSocket
        io.emit('sensor:reading', payload);
        io.emit('dashboard:update', { type: 'sensor', data: payload });
      }
    } catch (error) {
      console.error('[IoT] Erreur simulation:', error.message);
    }
  }, 5000);

  console.log('[IoT] Simulation démarrée — 8 capteurs virtuels actifs');
};

module.exports = { startIoTSimulation };
