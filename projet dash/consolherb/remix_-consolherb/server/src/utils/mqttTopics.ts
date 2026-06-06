// ─── MQTT Topic Helpers ───────────────────────────────────────────────────────
// Topics follow the pattern: agromaitre/{zone}/{metric}
// Examples:
//   agromaitre/zoneA/temperature
//   agromaitre/greenhouse1/soil_ph

export const TOPICS = {
  /** Subscribe to ALL AgroMaître messages */
  ALL: 'agromaitre/#',
  /** Subscribe to all metrics for a specific zone */
  ZONE: (zone: string) => `agromaitre/${zone}/#`,
  /** Publish / subscribe to one specific metric */
  METRIC: (zone: string, metric: string) => `agromaitre/${zone}/${metric}`,
  /** Commands sent FROM the server TO actuators on the device */
  COMMAND: (zone: string, actuator: string) => `agromaitre/cmd/${zone}/${actuator}`,
};

// ─── Metric types (matches Prisma SensorType enum where applicable) ───────────
export type MetricType =
  | 'temperature'   // °C
  | 'humidity'      // % relative humidity (air)
  | 'soil_ph'       // pH 0-14
  | 'soil_moisture' // % volumetric water content
  | 'luminosity';   // lux

// ─── Payload published by a sensor (ESP32 / mock_sensor.py) ──────────────────
export interface SensorPayload {
  /** Numeric reading */
  value: number;
  /** Unit string  e.g. "°C", "pH", "%" */
  unit: string;
  /** Optional stable device identifier — used to correlate with DB Sensor row */
  sensorId?: string;
  /** ISO-8601 timestamp; server uses Date.now() as fallback */
  timestamp?: string;
}

// ─── Actuator command published by the server ─────────────────────────────────
export interface ActuatorCommand {
  action: 'ON' | 'OFF' | 'TOGGLE';
  durationMs?: number; // optional: auto-off after N ms
}
