/**
 * mqttClient.ts
 * ─────────────
 * Optional MQTT integration for AgroMaître.
 * Activated only when MQTT_BROKER_URL is set in the environment.
 *
 * Topic pattern:  agromaitre/{zone}/{metric}
 * Payload (JSON): { value: number, unit: string, sensorId?: string, timestamp?: string }
 *
 * On receiving a message the client:
 *   1. Finds or creates the Sensor row in PostgreSQL
 *   2. Persists a SensorLog entry
 *   3. Runs the DSS analysis (analyzeSensorData)
 *   4. Broadcasts SMART_ADVICE via SSE if advice is generated
 */

import mqtt, { MqttClient } from 'mqtt';
import { prisma } from './prisma';
import { broadcastEvent } from './iotSimulator';
import { analyzeSensorData } from '../services/adviceService';
import { SensorPayload } from './mqttTopics';

// ─── Module-level client instance ────────────────────────────────────────────
let client: MqttClient | null = null;

// ─── Map metric name → Prisma SensorType enum ────────────────────────────────
const METRIC_TO_TYPE: Record<string, string> = {
  temperature: 'TEMPERATURE',
  humidity: 'HUMIDITY',
  soil_ph: 'SOIL',
  soil_moisture: 'SOIL',
  luminosity: 'LUMINOSITY',
};

/**
 * Connect to the MQTT broker and begin listening.
 * Call once after the server is ready.
 */
export function connectMQTT(): void {
  const brokerUrl = process.env.MQTT_BROKER_URL ?? 'mqtt://localhost:1883';

  // eslint-disable-next-line no-console
  console.log(`📡 MQTT: connecting to ${brokerUrl}…`);

  client = mqtt.connect(brokerUrl, {
    clientId: `agromaitre-backend-${Date.now()}`,
    clean: true,
    reconnectPeriod: 5000, // retry every 5 s on disconnect
  });

  client.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('✅ MQTT: connected — subscribing to agromaitre/#');
    client!.subscribe('agromaitre/#', { qos: 1 }, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('❌ MQTT: subscription error:', err.message);
      }
    });
  });

  client.on('message', (topic: string, rawPayload: Buffer) => {
    void handleMessage(topic, rawPayload);
  });

  client.on('error', (err: Error) => {
    // eslint-disable-next-line no-console
    console.error('⚠️  MQTT error:', err.message);
  });

  client.on('reconnect', () => {
    // eslint-disable-next-line no-console
    console.log('🔄 MQTT: reconnecting…');
  });
}

/**
 * Gracefully close the MQTT connection.
 */
export function disconnectMQTT(): void {
  if (client) {
    client.end(true);
    client = null;
    // eslint-disable-next-line no-console
    console.log('🔌 MQTT: disconnected');
  }
}

/**
 * Publish an actuator command to a device.
 * Topic: agromaitre/cmd/{zone}/{actuator}
 */
export function publishCommand(topic: string, payload: object): void {
  if (!client?.connected) {
    // eslint-disable-next-line no-console
    console.warn('⚠️  MQTT: cannot publish — not connected');
    return;
  }
  client.publish(topic, JSON.stringify(payload), { qos: 1 });
}

// ─── Internal message handler ─────────────────────────────────────────────────

async function handleMessage(topic: string, rawPayload: Buffer): Promise<void> {
  // Skip command topics (agromaitre/cmd/...)
  if (topic.startsWith('agromaitre/cmd/')) return;

  // Parse topic → zone + metric
  // Expected: agromaitre/{zone}/{metric}
  const parts = topic.split('/');
  if (parts.length !== 3) return; // ignore malformed topics
  const [, zone, metric] = parts;

  // Parse JSON payload
  let payload: SensorPayload;
  try {
    payload = JSON.parse(rawPayload.toString()) as SensorPayload;
  } catch {
    // eslint-disable-next-line no-console
    console.warn(`⚠️  MQTT: invalid JSON on topic ${topic}`);
    return;
  }

  const { value, unit, sensorId, timestamp } = payload;
  const sensorType = (METRIC_TO_TYPE[metric] ?? 'SOIL') as
    | 'TEMPERATURE'
    | 'HUMIDITY'
    | 'SOIL'
    | 'LUMINOSITY';

  try {
    // ── 1. Find or create the Sensor row ──────────────────────────────────────
    const deviceId = sensorId ?? `${zone}-${metric}`;
    let sensor = await prisma.sensor.findFirst({
      where: { name: deviceId },
    });

    if (!sensor) {
      // Lazy-create zone if it doesn't exist yet
      let zoneRow = await prisma.zone.findFirst({ where: { name: zone } });
      if (!zoneRow) {
        zoneRow = await prisma.zone.create({
          data: { name: zone, type: 'FIELD' },
        });
      }
      sensor = await prisma.sensor.create({
        data: {
          name: deviceId,
          type: sensorType,
          zoneId: zoneRow.id,
          isActive: true,
        },
      });
    }

    // ── 2. Persist sensor log ─────────────────────────────────────────────────
    await prisma.sensorLog.create({
      data: {
        sensorId: sensor.id,
        value,
        unit,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    // ── 3. Run DSS analysis ───────────────────────────────────────────────────
    // Map MQTT metric names to adviceService sensorType
    const sensorTypeMap: Record<string, 'pH' | 'temp'> = {
      soil_ph:     'pH',
      temperature: 'temp',
    };
    const adviceSensorType = sensorTypeMap[metric];

    // Try each known crop — advice fires when any crop constraint is violated
    let advice = null;
    if (adviceSensorType) {
      const crops = await prisma.cropKnowledge.findMany({ take: 10 });
      for (const crop of crops) {
        const result = await analyzeSensorData(crop.name, adviceSensorType, value);
        if (result) { advice = result; break; }
      }
    }


    // ── 4. Broadcast via SSE ──────────────────────────────────────────────────
    // Always broadcast the raw reading so the dashboard updates
    broadcastEvent('SENSOR_READING', {
      zone,
      metric,
      value,
      unit,
      sensorId: sensor.id,
      timestamp: new Date().toISOString(),
    });

    if (advice) {
      broadcastEvent('SMART_ADVICE', {
        zone,
        metric,
        value,
        unit,
        ...advice,
        source: 'mqtt',
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ MQTT handler error:', (err as Error).message);
  }
}
