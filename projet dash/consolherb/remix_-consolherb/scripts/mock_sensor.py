#!/usr/bin/env python3
"""
mock_sensor.py — AgroMaître ESP32 Sensor Simulator
────────────────────────────────────────────────────
Simulates an ESP32 board publishing sensor readings over MQTT.
Useful for testing the MQTT pipeline without real hardware.

Install:  pip install paho-mqtt
Run:      python scripts/mock_sensor.py
"""

import json
import time
import random
import argparse
import paho.mqtt.client as mqtt

# ─── Configuration ─────────────────────────────────────────────────────────
BROKER  = "localhost"
PORT    = 1883
ZONE    = "zoneA"          # change to zoneB, greenhouse1, etc.
INTERVAL = 5               # seconds between readings

# Sensor definitions: (metric, unit, min, max)
SENSORS = [
    ("temperature",   "°C",  12.0, 38.0),
    ("humidity",      "%",   30.0, 95.0),
    ("soil_ph",       "pH",   4.5,  8.5),
    ("soil_moisture", "%",   10.0, 90.0),
    ("luminosity",    "lux",  0.0, 100000.0),
]

# ─── MQTT callbacks ─────────────────────────────────────────────────────────
def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"✅  Connected to Mosquitto broker at {BROKER}:{PORT}")
    else:
        print(f"❌  Connection failed with code {rc}")

def on_publish(client, userdata, mid, reason_codes=None, properties=None):
    pass  # silent on success

# ─── Main loop ──────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="AgroMaître mock MQTT sensor")
    parser.add_argument("--broker",   default=BROKER,   help="MQTT broker host")
    parser.add_argument("--port",     default=PORT,     type=int)
    parser.add_argument("--zone",     default=ZONE,     help="Zone name  e.g. zoneA")
    parser.add_argument("--interval", default=INTERVAL, type=float, help="Publish interval (s)")
    args = parser.parse_args()

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_publish  = on_publish

    try:
        client.connect(args.broker, args.port, 60)
    except ConnectionRefusedError:
        print(f"💥  Cannot connect to {args.broker}:{args.port} — is Mosquitto running?")
        return

    client.loop_start()
    print(f"🌱  Publishing sensor data for zone '{args.zone}' every {args.interval}s …")
    print("    Press Ctrl+C to stop.\n")

    try:
        cycle = 0
        while True:
            cycle += 1
            for metric, unit, low, high in SENSORS:
                value = round(random.uniform(low, high), 2)
                topic = f"agromaitre/{args.zone}/{metric}"
                payload = json.dumps({
                    "value": value,
                    "unit": unit,
                    "sensorId": f"{args.zone}-{metric}",
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                })
                client.publish(topic, payload, qos=1)
                print(f"  [{cycle:04d}] {topic:<45}  {value:>10.2f} {unit}")

            print()  # blank line between cycles
            time.sleep(args.interval)

    except KeyboardInterrupt:
        print("\n🛑  Stopped.")
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()
