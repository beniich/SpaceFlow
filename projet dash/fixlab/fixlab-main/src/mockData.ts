/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Device, SystemLog, SecurityPolicy, GroupFolder, SoftwarePackage, PredictiveFailure, AutoNode, AutoEdge } from "./types";

export const initialDevices: Device[] = [
  {
    id: "DEV-041",
    name: "SOV-CORE-GATEWAY-1A",
    ip: "10.240.11.14",
    os: "SovereignOS",
    status: "online",
    cpu: 34,
    ram: 58,
    storage: 42,
    bandwidth: 12.8,
    uptime: "214d 18h",
    lastActive: "Just now",
    group: "Core Infrastructure",
    location: "Silo Node Alpha",
    policyCompliance: 100,
    serialNumber: "SN-998A-324-X",
    kernelVersion: "SovOS Core v4.11.9-rt"
  },
  {
    id: "DEV-042",
    name: "CENTRIFUGE-MATRIX-42",
    ip: "10.240.12.89",
    os: "Linux",
    status: "online",
    cpu: 78,
    ram: 84,
    storage: 67,
    bandwidth: 4.2,
    uptime: "45d 06h",
    lastActive: "Just now",
    group: "Production",
    location: "Refinery-B Wing 3",
    policyCompliance: 85,
    serialNumber: "SN-1025-CFG-M",
    kernelVersion: "Linux 5.15.0-88-generic"
  },
  {
    id: "DEV-043",
    name: "SCADA-GATEWAY-DIST-9",
    ip: "10.240.14.22",
    os: "SovereignOS",
    status: "warning",
    cpu: 91,
    ram: 92,
    storage: 89,
    bandwidth: 24.1,
    uptime: "12d 23h",
    lastActive: "2 min ago",
    group: "Core Infrastructure",
    location: "Silo Node Beta",
    policyCompliance: 60,
    serialNumber: "SN-5582-SCD-G",
    kernelVersion: "SovOS Core v4.11.9-rt"
  },
  {
    id: "DEV-044",
    name: "VALVE-CONTROLLER-01",
    ip: "10.240.15.112",
    os: "Linux",
    status: "online",
    cpu: 18,
    ram: 31,
    storage: 22,
    bandwidth: 0.1,
    uptime: "144d 12h",
    lastActive: "1 min ago",
    group: "Edge Relays",
    location: "Substation Delta",
    policyCompliance: 100,
    serialNumber: "SN-2210-VLV-C",
    kernelVersion: "Linux 4.19.120-rt-custom"
  },
  {
    id: "DEV-045",
    name: "CRYSTAL-ANALYZER-SEC",
    ip: "10.240.15.201",
    os: "Windows",
    status: "warning",
    cpu: 64,
    ram: 79,
    storage: 94,
    bandwidth: 2.3,
    uptime: "3d 11h",
    lastActive: "Just now",
    group: "Production",
    location: "Cleanroom Lab-4",
    policyCompliance: 40,
    serialNumber: "SN-8822-CRY-A",
    kernelVersion: "Windows IoT Enterprise LTSC"
  },
  {
    id: "DEV-046",
    name: "THERMAL-SINK-CONTROLLER",
    ip: "10.240.11.8",
    os: "Linux",
    status: "offline",
    cpu: 0,
    ram: 0,
    storage: 50,
    bandwidth: 0,
    uptime: "0d 0h",
    lastActive: "24 min ago",
    group: "Core Infrastructure",
    location: "Substructure Level -3",
    policyCompliance: 90,
    serialNumber: "SN-4431-THM-S",
    kernelVersion: "Linux 5.4.0-112-generic"
  },
  {
    id: "DEV-047",
    name: "HIND-ROTATION-MONITOR",
    ip: "10.240.18.52",
    os: "macOS",
    status: "online",
    cpu: 45,
    ram: 62,
    storage: 48,
    bandwidth: 1.5,
    uptime: "8d 04h",
    lastActive: "4 min ago",
    group: "Testing Operations",
    location: "Testing Flight Deck",
    policyCompliance: 95,
    serialNumber: "SN-0092-HND-R",
    kernelVersion: "Darwin 21.6.0"
  },
  {
    id: "DEV-048",
    name: "O2-REGENERATION-VALVE",
    ip: "10.240.18.99",
    os: "SovereignOS",
    status: "online",
    cpu: 28,
    ram: 45,
    storage: 30,
    bandwidth: 0.5,
    uptime: "230d 21h",
    lastActive: "Just now",
    group: "Edge Relays",
    location: "Silo Node Alpha",
    policyCompliance: 100,
    serialNumber: "SN-7733-O2R-V",
    kernelVersion: "SovOS Core v4.11.9-rt"
  },
  {
    id: "DEV-049",
    name: "LAPTOP-MACBOOK-PRO-01",
    ip: "10.240.20.10",
    os: "macOS",
    status: "online",
    cpu: 35,
    ram: 50,
    storage: 44,
    bandwidth: 12.5,
    uptime: "4d 10h",
    lastActive: "Just now",
    group: "Testing Operations",
    location: "Medical Control Desk A",
    policyCompliance: 98,
    serialNumber: "SN-LP-MAC-775",
    kernelVersion: "Darwin 22.4.0 (macOS Ventura)"
  },
  {
    id: "DEV-050",
    name: "LAPTOP-THINKPAD-X1",
    ip: "10.240.20.11",
    os: "Windows",
    status: "online",
    cpu: 15,
    ram: 38,
    storage: 29,
    bandwidth: 8.4,
    uptime: "1d 2h",
    lastActive: "Just now",
    group: "Testing Operations",
    location: "Emergency Ward Admin",
    policyCompliance: 92,
    serialNumber: "SN-LP-WIN-204",
    kernelVersion: "Windows 11 Professional (Build 22621)"
  },
  {
    id: "DEV-051",
    name: "LAPTOP-DELL-XPS-SUPERV",
    ip: "10.240.20.12",
    os: "Linux",
    status: "warning",
    cpu: 72,
    ram: 81,
    storage: 75,
    bandwidth: 18.2,
    uptime: "12d 15h",
    lastActive: "1 min ago",
    group: "Testing Operations",
    location: "Central Command Room",
    policyCompliance: 80,
    serialNumber: "SN-LP-LIN-991",
    kernelVersion: "Linux 6.2.0-35-generic (Ubuntu)"
  }
];

export const initialGroups: GroupFolder[] = [
  {
    id: "GRP-01",
    name: "Core Infrastructure",
    deviceCount: 3,
    healthScore: 78,
    activeThreats: 1,
    category: "Core Infrastructure"
  },
  {
    id: "GRP-02",
    name: "Production Centrifuges",
    deviceCount: 2,
    healthScore: 62,
    activeThreats: 2,
    category: "Production"
  },
  {
    id: "GRP-03",
    name: "Substation Edge Relays",
    deviceCount: 2,
    healthScore: 100,
    activeThreats: 0,
    category: "Edge Relays"
  },
  {
    id: "GRP-04",
    name: "R&D Simulator Racks",
    deviceCount: 1,
    healthScore: 95,
    activeThreats: 0,
    category: "Testing Operations"
  }
];

export const initialPolicies: SecurityPolicy[] = [
  {
    id: "POL-001",
    name: "Exclusion of Non-Authorized USB Media",
    category: "Storage",
    description: "Blocks external flash drives and non-whitelisted mass storage devices directly at host kernel registry level.",
    enabled: true,
    severity: "critical",
    lastEnforced: "Just now"
  },
  {
    id: "POL-002",
    name: "Interactive Session Timeout Limit",
    category: "Access",
    description: "Enforces a strict 300-second maximum idle counter before initiating user session lock and token invalidation.",
    enabled: true,
    severity: "medium",
    lastEnforced: "12 min ago"
  },
  {
    id: "POL-003",
    name: "Enhanced Entropy Password Matrix",
    category: "Authentication",
    description: "Requires multi-factor elements, minimum 16 alphanumeric symbols, and rotating dictionary exclusion check.",
    enabled: true,
    severity: "high",
    lastEnforced: "1 hour ago"
  },
  {
    id: "POL-004",
    name: "Restricted Port-Bound Whitelist Protection",
    category: "Network",
    description: "Strict outbound firewall table. Restricts high-performance relay nodes strictly to designated remote gateway proxies.",
    enabled: false,
    severity: "critical",
    lastEnforced: "Never"
  },
  {
    id: "POL-005",
    name: "Rotational Kernel Audit Log Integrity",
    category: "Access",
    description: "Stream core kernel event records continuously into our cryptographically signed, immutable ledger storage structure.",
    enabled: true,
    severity: "high",
    lastEnforced: "Just now"
  }
];

export const initialLogs: SystemLog[] = [
  {
    id: "LOG-1001",
    timestamp: "13:54:12",
    source: "SOV-CORE-GATEWAY-1A",
    level: "info",
    message: "Cryptographic handshakes validated for all secure local relays.",
    deviceId: "DEV-041"
  },
  {
    id: "LOG-1002",
    timestamp: "13:52:05",
    source: "SCADA-GATEWAY-DIST-9",
    level: "warning",
    message: "CPU Temp spiking above 85°C. System cooling fan underperforming.",
    deviceId: "DEV-043"
  },
  {
    id: "LOG-1003",
    timestamp: "13:51:33",
    source: "CRYSTAL-ANALYZER-SEC",
    level: "critical",
    message: "Policy Violation: Unauthorized mass USB flash drive connected to USB-3 Port.",
    deviceId: "DEV-045"
  },
  {
    id: "LOG-1004",
    timestamp: "13:48:10",
    source: "Security Policy Engine",
    level: "success",
    message: "USB auto-isolation policy enforced on CRYSTAL-ANALYZER-SEC.",
    deviceId: "DEV-045"
  },
  {
    id: "LOG-1005",
    timestamp: "13:45:00",
    source: "THERMAL-SINK-CONTROLLER",
    level: "warning",
    message: "Telemetry stream failure. Setting host status to UNREACHABLE.",
    deviceId: "DEV-046"
  }
];

export const initialSoftware: SoftwarePackage[] = [
  {
    id: "SW-01",
    name: "Kernel Security Patch",
    version: "v4.11.9-rt",
    latestVersion: "v4.11.9-rt",
    status: "up_to_date",
    installedOn: 3
  },
  {
    id: "SW-02",
    name: "OpenSSL Cryptography Engine",
    version: "1.1.1t",
    latestVersion: "3.1.0 (Critical Upgrade Needed)",
    status: "vulnerable",
    installedOn: 5,
    severity: "critical",
    cveId: "CVE-2023-0286"
  },
  {
    id: "SW-03",
    name: "OS Security Log Forwarder",
    version: "v2.12.0",
    latestVersion: "v2.14.2",
    status: "update_available",
    installedOn: 6
  },
  {
    id: "SW-04",
    name: "Docker Engine Containerized Wrapper",
    version: "20.10.12",
    latestVersion: "24.0.5",
    status: "unsupported",
    installedOn: 2,
    severity: "high"
  },
  {
    id: "SW-05",
    name: "Local Firewall Packet Analyzer",
    version: "v3.1.2",
    latestVersion: "v3.1.2",
    status: "up_to_date",
    installedOn: 8
  }
];

export const initialPredictiveFailures: PredictiveFailure[] = [
  {
    id: "PF-01",
    deviceId: "DEV-043",
    deviceName: "SCADA-GATEWAY-DIST-9",
    component: "Cooling Fan",
    currentTemp: 87,
    probability: 88,
    timeToFailure: "14.5 hours",
    urgency: "critical",
    riskDescription: "Bearing resistance spike detected. Continuous RPM friction indicates structural degradation. Thermal overload imminent."
  },
  {
    id: "PF-02",
    deviceId: "DEV-042",
    deviceName: "CENTRIFUGE-MATRIX-42",
    component: "Solid State Drive",
    currentTemp: 44,
    probability: 62,
    timeToFailure: "4.2 days",
    urgency: "medium",
    riskDescription: "S.M.A.R.T wearout index dropped past threshold on primary boot block write cycles. Impending bad block cluster propagation."
  },
  {
    id: "PF-03",
    deviceId: "DEV-045",
    deviceName: "CRYSTAL-ANALYZER-SEC",
    component: "Battery Cell Pack",
    currentTemp: 39,
    probability: 45,
    timeToFailure: "18.2 days",
    urgency: "low",
    riskDescription: "Voltage discharge rate mismatch within standard UPS backup cells. Potential sub-module disruption during direct line cuts."
  }
];

export const initialNodes: AutoNode[] = [
  { id: "node-1", type: "trigger", label: "CPU Performance Limit Spiked", config: "Threshold > 90%", x: 50, y: 80 },
  { id: "node-2", type: "condition", label: "Device OS Verification", config: "OS === 'SovereignOS'", x: 300, y: 80 },
  { id: "node-3", type: "action", label: "Trigger Cooling Cycle Inject", config: "Target: Thermal Vent Node", x: 560, y: 50 },
  { id: "node-4", type: "action", label: "Isolate Device Port Whitelist", config: "Dynamic Port Purge", x: 560, y: 160 },
  { id: "node-5", type: "trigger", label: "Unauthorized USB Connection", config: "Port Scope: ALL", x: 50, y: 280 },
  { id: "node-6", type: "action", label: "Enforce USB Block & Alarm", config: "Lock Screen immediately", x: 400, y: 280 }
];

export const initialEdges: AutoEdge[] = [
  { id: "edge-1", sourceId: "node-1", targetId: "node-2" },
  { id: "edge-2", sourceId: "node-2", targetId: "node-3" },
  { id: "edge-3", sourceId: "node-2", targetId: "node-4" },
  { id: "edge-4", sourceId: "node-5", targetId: "node-6" }
];

// Helper to simulate telemetry points for a device over the past few intervals
export function generateTelemetryHistory(seed: string): { time: string; cpu: number; ram: number; bandwidth: number }[] {
  const points = [];
  const baseCpu = seed.charCodeAt(0) % 50 + 20;
  const baseRam = seed.charCodeAt(1) % 40 + 40;
  for (let i = 15; i >= 0; i--) {
    const time = `${(13 - Math.floor(i / 4)).toString().padStart(2, "0")}:${((i * 4) % 60).toString().padStart(2, "0")}`;
    const rand = Math.sin(i * 1.5) * 8 + Math.cos(i * 0.7) * 4;
    points.push({
      time,
      cpu: Math.min(100, Math.max(5, Math.round(baseCpu + rand))),
      ram: Math.min(100, Math.max(5, Math.round(baseRam + (Math.sin(i) * 3)))),
      bandwidth: Math.max(0.1, Number((2.5 + Math.cos(i * 0.5) * 1.8).toFixed(1)))
    });
  }
  return points;
}
