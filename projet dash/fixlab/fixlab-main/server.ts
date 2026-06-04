import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Interfaces mirroring the client-side types
interface Device {
  id: string;
  name: string;
  ip: string;
  os: "Linux" | "Windows" | "macOS" | "SovereignOS";
  status: "online" | "warning" | "offline";
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  uptime: string;
  lastActive: string;
  group: string;
  location: string;
  policyCompliance: number;
  serialNumber: string;
  kernelVersion: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  source: string;
  level: "info" | "warning" | "critical" | "success";
  message: string;
  deviceId?: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  category: "Access" | "Network" | "Storage" | "Authentication";
  description: string;
  enabled: boolean;
  severity: "low" | "medium" | "high" | "critical";
  lastEnforced: string;
}

interface SoftwarePackage {
  id: string;
  name: string;
  version: string;
  latestVersion: string;
  status: "up_to_date" | "update_available" | "vulnerable" | "unsupported";
  installedOn: number;
  severity?: "low" | "medium" | "high" | "critical";
  cveId?: string;
}

interface PredictiveFailure {
  id: string;
  deviceId: string;
  deviceName: string;
  component: "Cooling Fan" | "Solid State Drive" | "Primary RAM Node" | "CPU Thermal Junction" | "Battery Cell Pack";
  currentTemp: number;
  probability: number;
  timeToFailure: string;
  urgency: "low" | "medium" | "high" | "critical";
  riskDescription: string;
}

interface DNSRecord {
  id: string;
  domain: string;
  type: "A" | "AAAA" | "CNAME" | "TXT" | "MX";
  value: string;
  ttl: number;
  status: "active" | "inactive" | "intercepted";
  systemManaged?: boolean;
}

interface DNSQueryLog {
  id: string;
  timestamp: string;
  domain: string;
  clientIp: string;
  clientName: string;
  type: string;
  status: "resolved" | "blocked" | "forwarded";
  resolvedValue: string;
}

interface SovereignSettings {
  coreIdentity: number;
  cognitiveLoad: number;
  hapticResonance: number;
  energyProfile: number;
  dataSynthesis: string;
}

interface GatewayLog {
  id: string;
  timestamp: string;
  method: "POST" | "GET" | "WS_EMIT" | "SSH_EXEC";
  route: string;
  adapter: "JumpServer PAM" | "gRPC Fleet Agency" | "LLM Neural Intel" | "Prometheus Node Exporter";
  status: number;
  delay: string;
  payload: string;
}

interface ComplianceControl {
  id: string;
  standard: "SOC2" | "ISO27001";
  code: string;
  name: string;
  description: string;
  status: "verified" | "drift" | "broken";
  lastChecked: string;
  evidenceType: "JumpServer Logs" | "Access Policy" | "Network Whitelist" | "Software Vulnerability Scan" | "TLS DNS Setup" | "Prometheus SLA Metrics" | "Storage Regulation";
  evidenceSnapshot: string;
  linkedPolicyId?: string;
}

interface ComplianceDomain {
  id: string;
  name: string;
  score: number;
  status: "optimal" | "warning" | "critical";
  controlsCount: number;
  verifiedCount: number;
}


interface ApplianceConfig {
  bastionEnabled: boolean;
  bastionPort: number;
  encryptedProtocolMode: "TLS_v1.3" | "SSH_v2" | "IPSec_VPN";
  telemetryInterval: "realtime" | "standard" | "eco";
  autoIsolateOnOverheat: boolean;
  mfaEnforced: boolean;
  ipWhitelist: string;
  installedPlugins: {
    pfBlockerNG: boolean;
    suricataIDS: boolean;
    soc2Auditor: boolean;
    vncStreamer: boolean;
  };
}

interface VisionTransmission {
  id: string;
  timestamp: string;
  vector: string;
  data: string;
  status: string;
}

interface VisionJournal {
  id: string;
  title: string;
  category: string;
  author: string;
  timestamp: string;
  content: string;
}

interface UserBadge {
  id: string;
  name: string;
  email: string;
  keyCode: string;
  clearance: string;
  avatarColor: string;
  regDate: string;
}

let visionTransmissions: VisionTransmission[] = [
  { id: "TX-4402", timestamp: "08:14:00", vector: "Secure Satellite", data: "Nexus primary foundations alignment complete.", status: "DELIVERED" },
  { id: "TX-4401", timestamp: "07:30:11", vector: "Quantum Wire", data: "Solar deflection arrays telemetry normal.", status: "DELIVERED" }
];

let visionJournals: VisionJournal[] = [
  {
    id: "J-04",
    title: "La Synthèse de Verre Réfractif",
    category: "Optique",
    author: "Elara Vance",
    timestamp: "2026-06-03 10:45",
    content: "L'Atrium intègre désormais les nouvelles dalles de silice carbonée à taux élevé de réfraction lumineus. Les tests d'atténuation aux ultra-violets révèlent un filtrage passif à 99.4%, tout en maintenant une diffusion diffuse du spectre visible à 82%."
  },
  {
    id: "J-03",
    title: "Dynamique des Fluides en Façades Doubles",
    category: "Structure",
    author: "Marcus Aurelius",
    timestamp: "2026-06-02 14:12",
    content: "L'analyse des contraintes dynamiques sur l'enveloppe du Terminal Alpha indique une dispersion optimale des turbulences. Notre modèle de déviation par lames paraboliques réduit la friction de surface de près de 18.5%."
  },
  {
    id: "J-02",
    title: "Béton Translucide Autonettoyant",
    category: "Matériaux",
    author: "Diana Prince",
    timestamp: "2026-06-01 09:30",
    content: "Des dalles prototypes de béton cellulaire renforcé aux micro-fibres transmettant la lumière ont été soumises à un ancrage sismique d'essai. La structure micro-cristalline prévient la fissuration capillaire."
  }
];

let visionBadge: UserBadge = {
  id: "ARC-849-V2",
  name: "Elara Vance",
  email: "e.vance@vision-architecte.com",
  keyCode: "OMEGA-SYS-99",
  clearance: "CLEARANCE OMEGA",
  avatarColor: "from-cyan-500 to-emerald-500",
  regDate: "2026-06-03 09:12:00"
};

// Global In-Memory Database State
let sovereignSettings: SovereignSettings = {
  coreIdentity: 45,
  cognitiveLoad: 60,
  hapticResonance: 30,
  energyProfile: 75,
  dataSynthesis: "Low-Latency"
};

let applianceConfig: ApplianceConfig = {
  bastionEnabled: true,
  bastionPort: 443,
  encryptedProtocolMode: "TLS_v1.3",
  telemetryInterval: "realtime",
  autoIsolateOnOverheat: true,
  mfaEnforced: true,
  ipWhitelist: "10.240.11.1, 10.240.12.*, 127.0.0.1",
  installedPlugins: {
    pfBlockerNG: true,
    suricataIDS: false,
    soc2Auditor: true,
    vncStreamer: true
  }
};

interface EnrollmentRequest {
  id: string;
  designation: string;
  sector: string;
  ip: string;
  os: "Linux" | "Windows" | "macOS" | "SovereignOS";
  clearanceLevel: number;
  rootAccess: boolean;
  signerOperator: string;
  status: "pending" | "approved" | "rejected" | "enrolled";
  token?: string;
  createdTime: string;
  enrolledTime?: string;
}

let staticEnrollmentRequests: EnrollmentRequest[] = [
  {
    id: "REQ-3301",
    designation: "SIGINT-RECEIVER-4",
    sector: "Périmètre Externe (Edge)",
    ip: "10.240.11.45",
    os: "Linux",
    clearanceLevel: 3,
    rootAccess: false,
    signerOperator: "Lieutenant Vance",
    status: "pending",
    createdTime: "2026-06-02 08:30:11"
  },
  {
    id: "REQ-3302",
    designation: "ALPHA-COMMAND-VAULT",
    sector: "Secteur Nord (Commandement)",
    ip: "10.240.12.8",
    os: "SovereignOS",
    clearanceLevel: 5,
    rootAccess: true,
    signerOperator: "Major General Carter",
    status: "approved",
    token: "SOV-77926-XDF89",
    createdTime: "2026-06-02 10:14:45"
  }
];

interface VolatileSession {
  id: string;
  subscriberName: string;
  token: string;
  status: "active" | "expired";
  ramPath: string;
  ipAddress: string;
  roleAssigned: string;
  establishedTime: string;
  timeRemainingSeconds: number;
  totalTtlSeconds: number;
}

let volatileSessions: VolatileSession[] = [
  {
    id: "VOL-X92",
    subscriberName: "NEXUS-RE-04",
    token: "LNK-7C6BB5-X92",
    status: "active",
    ramPath: "/dev/shm/nexus_session_VOL-X92.key",
    ipAddress: "10.240.11.19",
    roleAssigned: "Tactical Sensor Operator",
    establishedTime: "2026-06-02 11:30:22",
    timeRemainingSeconds: 2450,
    totalTtlSeconds: 3600
  },
  {
    id: "VOL-A44",
    subscriberName: "DRONE-TACTICAL-8",
    token: "LNK-FF5C00-P95",
    status: "expired",
    ramPath: "/dev/shm/nexus_session_VOL-A44.key",
    ipAddress: "10.240.11.7",
    roleAssigned: "Telemetry Auditor",
    establishedTime: "2026-06-02 09:12:00",
    timeRemainingSeconds: 0,
    totalTtlSeconds: 3600
  }
];

let gatewayLogs: GatewayLog[] = [
  {
    id: "REQ-001",
    timestamp: "21:09:12",
    method: "GET",
    route: "/api/gateway/prom/nodes/load",
    adapter: "Prometheus Node Exporter",
    status: 200,
    delay: "1.24ms",
    payload: "{ nodesTotal: 1250, activeRate: 0.945 }"
  },
  {
    id: "REQ-002",
    timestamp: "21:09:15",
    method: "POST",
    route: "/api/gateway/pam/replicate-session",
    adapter: "JumpServer PAM",
    status: 200,
    delay: "4.85ms",
    payload: "{ sessionId: 'SSID-7489', auditActive: true }"
  },
  {
    id: "REQ-003",
    method: "WS_EMIT",
    route: "fleet:reboot_target",
    adapter: "gRPC Fleet Agency",
    status: 101,
    delay: "2.12ms",
    payload: "{ targetNode: 'Sovereign-A1', code: '0x39' }",
    timestamp: "21:09:18"
  }
];

let gatewayRequestsCount = 14502;
let averageDelay = 2.32;
let gatewayReqCounter = 104;

let dnsRecords: DNSRecord[] = [
  { id: "DNS-001", domain: "gateway.sovereign.local", type: "A", value: "10.240.11.14", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-002", domain: "centrifuge.sovereign.local", type: "A", value: "10.240.12.89", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-003", domain: "scada.sovereign.local", type: "A", value: "10.240.14.22", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-004", domain: "valve.sovereign.local", type: "A", value: "10.240.15.112", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-005", domain: "crystal.sovereign.local", type: "A", value: "10.240.15.201", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-006", domain: "database.hq.private", type: "CNAME", value: "gateway.sovereign.local", ttl: 1800, status: "active" },
  { id: "DNS-007", domain: "mail.hq.private", type: "MX", value: "10 mail-relay.sovereign.local", ttl: 1800, status: "active" },
  { id: "DNS-008", domain: "clandestine-tracker.net", type: "A", value: "0.0.0.0", ttl: 300, status: "intercepted" },
  { id: "DNS-009", domain: "reverse-shell.telemetry-node.ru", type: "A", value: "0.0.0.0", ttl: 300, status: "intercepted" }
];

let dnsQueryLogs: DNSQueryLog[] = [
  { id: "DQL-001", timestamp: "14:05:22", domain: "gateway.sovereign.local", clientIp: "10.240.12.89", clientName: "CENTRIFUGE-MATRIX-42", type: "A", status: "resolved", resolvedValue: "10.240.11.14" },
  { id: "DQL-002", timestamp: "14:04:15", domain: "reverse-shell.telemetry-node.ru", clientIp: "10.240.15.201", clientName: "CRYSTAL-ANALYZER-SEC", type: "A", status: "blocked", resolvedValue: "0.0.0.0 (Sovereign Sinkhole)" },
  { id: "DQL-003", timestamp: "14:02:50", domain: "time.nist.gov", clientIp: "10.240.11.14", clientName: "SOV-CORE-GATEWAY-1A", type: "A", status: "forwarded", resolvedValue: "192.168.1.1 (Encrypted Upstream Proxy)" },
  { id: "DQL-004", timestamp: "13:58:11", domain: "scada.sovereign.local", clientIp: "10.240.15.112", clientName: "VALVE-CONTROLLER-01", type: "A", status: "resolved", resolvedValue: "10.240.14.22" }
];

let devices: Device[] = [
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
  }
];

let policies: SecurityPolicy[] = [
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

let logs: SystemLog[] = [
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

let software: SoftwarePackage[] = [
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

let failures: PredictiveFailure[] = [
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

// Active SSE client sockets connection pool
let sseClients: any[] = [];

// Helper to broadcast changes to all SSE clients
function broadcast(eventType: string, data: any) {
  sseClients.forEach(client => {
    client.res.write(`event: ${eventType}\n`);
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// Get standard 24h digital format timestamp
function getTimestamp() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

// System logging generator
function appendLog(message: string, level: "info" | "warning" | "critical" | "success", source = "Sovereign Orchestrator", deviceId?: string) {
  const newLog: SystemLog = {
    id: `LOG-SRV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: getTimestamp(),
    source,
    level,
    message,
    deviceId
  };
  logs = [newLog, ...logs].slice(0, 100); // Limit logs store to last 100
  broadcast("logs_update", logs);
  return newLog;
}

// Gateway logging generator
function addGatewayLog(
  method: "POST" | "GET" | "WS_EMIT" | "SSH_EXEC",
  route: string,
  adapter: GatewayLog["adapter"],
  status: number,
  delayMs: number,
  payload: string
) {
  const newLog: GatewayLog = {
    id: `REQ-${gatewayReqCounter++}`,
    timestamp: getTimestamp(),
    method,
    route,
    adapter,
    status,
    delay: `${delayMs.toFixed(2)}ms`,
    payload
  };
  gatewayLogs = [newLog, ...gatewayLogs].slice(0, 50);
  gatewayRequestsCount++;
  averageDelay = Number((averageDelay * 0.95 + delayMs * 0.05).toFixed(2));
  broadcast("gateway_logs_update", { gatewayLogs, gatewayRequestsCount, averageDelay });
  return newLog;
}

// Sovereign Continuous Compliance Engine State Builder
function getComplianceState() {
  const usbEnabled = policies.find(p => p.id === "POL-001")?.enabled ?? true;
  const timeoutEnabled = policies.find(p => p.id === "POL-002")?.enabled ?? true;
  const mfaEnabled = policies.find(p => p.id === "POL-003")?.enabled ?? true;
  const whitelistEnabled = policies.find(p => p.id === "POL-004")?.enabled ?? true;

  const list: ComplianceControl[] = [
    {
      id: "CTRL-001",
      standard: "SOC2" as const,
      code: "CC6.1",
      name: "Logical Access Controls / Privilege JIT Authorization",
      description: "Enforces distinct user privilege pathways securely. Links to JumpServer bastion recording session logs.",
      status: mfaEnabled ? (timeoutEnabled ? "verified" : "drift") : "broken",
      lastChecked: "Just now",
      evidenceType: "JumpServer Logs" as const,
      evidenceSnapshot: JSON.stringify({ authorizationMode: "JIT", activeMFA: mfaEnabled, timeoutLimitEnforced: timeoutEnabled, pamVersion: "v3.10.4-s9" }),
      linkedPolicyId: "POL-003"
    },
    {
      id: "CTRL-002",
      standard: "ISO27001" as const,
      code: "A.9.2.2",
      name: "Allocation of Privilege Access Rights",
      description: "Requires explicit MFA-backed credential checks and roles mapped in a Centralized Directory schema.",
      status: mfaEnabled ? "verified" : "broken",
      lastChecked: mfaEnabled ? "Just now" : "Failed 3 mins ago",
      evidenceType: "Access Policy" as const,
      evidenceSnapshot: JSON.stringify({ roleEnforced: "Platform Strategist", mfaEnforced: mfaEnabled, hashType: "SHA-512-argon2" }),
      linkedPolicyId: "POL-003"
    },
    {
      id: "CTRL-003",
      standard: "SOC2" as const,
      code: "CC6.3",
      name: "Network Boundary Safeguards",
      description: "Ensures network access whitelist definitions block all unaligned port scan sweeps.",
      status: whitelistEnabled ? "verified" : "drift",
      lastChecked: "Just now",
      evidenceType: "Network Whitelist" as const,
      evidenceSnapshot: JSON.stringify({ portRestricted: whitelistEnabled, boundIPs: ["10.240.11.0/24", "10.240.12.0/24"], activeGatewayRules: 14 }),
      linkedPolicyId: "POL-004"
    },
    {
      id: "CTRL-004",
      standard: "ISO27001" as const,
      code: "A.12.6.1",
      name: "Technical Vulnerability Management",
      description: "Performs continuous scans of all running OS kernels and local node packages for CVE targets.",
      status: "verified",
      lastChecked: "4 mins ago",
      evidenceType: "Software Vulnerability Scan" as const,
      evidenceSnapshot: JSON.stringify({ scannerEngine: "Nexus-Aegis", scansRun: 42, activeCVEsDetected: 0, highestRisk: "None" })
    },
    {
      id: "CTRL-005",
      standard: "SOC2" as const,
      code: "CC6.6",
      name: "Device and Removable Media Control",
      description: "Restricts flash drives or foreign storage components from escalating local kernel privileges.",
      status: usbEnabled ? "verified" : "broken",
      lastChecked: "Just now",
      evidenceType: "Storage Regulation" as const,
      evidenceSnapshot: JSON.stringify({ blockUSB: usbEnabled, dynamicKernelIntercept: true, whitelistUdevRules: 3 }),
      linkedPolicyId: "POL-001"
    },
    {
      id: "CTRL-006",
      standard: "ISO27001" as const,
      code: "A.12.4.1",
      name: "Security Event Logging & Monitoring",
      description: "Guarantees unalterable logging of admin actions, terminal commands, and system alert cascades.",
      status: "verified",
      lastChecked: "Just now",
      evidenceType: "Prometheus SLA Metrics" as const,
      evidenceSnapshot: JSON.stringify({ activeAuditsCount: gatewayLogs.length, loggingStorage: "Unalterable RingBuffer", telemetryLossRate: "0.00%" })
    }
  ];

  const verifiedCount = list.filter(c => c.status === "verified").length;
  const driftCount = list.filter(c => c.status === "drift").length;
  const brokenCount = list.filter(c => c.status === "broken").length;

  const scorePct = Math.round(((verifiedCount * 1.0 + driftCount * 0.5) / list.length) * 100);

  const domains: ComplianceDomain[] = [
    {
      id: "security",
      name: "Logical Access & Security Perimeter",
      score: Math.round(((list.filter(c => c.standard === "SOC2" && c.status === "verified").length) / list.filter(c => c.standard === "SOC2").length) * 100),
      status: list.some(c => c.standard === "SOC2" && c.status === "broken") ? "critical" : (list.some(c => c.standard === "SOC2" && c.status === "drift") ? "warning" : "optimal"),
      controlsCount: list.filter(c => c.standard === "SOC2").length,
      verifiedCount: list.filter(c => c.standard === "SOC2" && c.status === "verified").length
    },
    {
      id: "operations",
      name: "Operations & Vulnerability Management",
      score: Math.round(((list.filter(c => c.standard === "ISO27001" && c.status === "verified").length) / list.filter(c => c.standard === "ISO27001").length) * 100),
      status: list.some(c => c.standard === "ISO27001" && c.status === "broken") ? "critical" : "optimal",
      controlsCount: list.filter(c => c.standard === "ISO27001").length,
      verifiedCount: list.filter(c => c.standard === "ISO27001" && c.status === "verified").length
    }
  ];

  return {
    score: scorePct,
    controls: list,
    domains,
    summary: {
      verifiedCount,
      driftCount,
      brokenCount,
      totalCount: list.length
    }
  };
}

// Start Server Setup

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 0. Server-Side Gemini API Route for structural generation
  app.post("/api/gemini/generate-structure", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined");
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Tu es un assistant architectural expert pour le système 'Vision Architecte'. Voici la demande de l'utilisateur : ${prompt}. Fournis une analyse structurelle condensée, suggère des matériaux éco-dynamiques (comme le béton de graphène ou la silice translucide), estime l'efficacité solaire et le comportement sismique. Formate ton retour sur 4-5 lignes maximum, de manière technique et futuriste. Ne mets pas de blabla d'introduction ou de conclusion.`,
      });

      const text = response.text || "Erreur de génération textuelle.";
      res.json({ result: text });
    } catch (err: any) {
      console.warn("Gemini API call warning, fallback to static structure templates", err.message);
      res.status(500).json({ error: "Gemini server fallback invoked." });
    }
  });

  // 1. SSE Real-Time Stream route
  app.get("/api/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const clientId = Date.now();
    sseClients.push({ id: clientId, res });

    // Stream initial database snapshot
    res.write(`event: sync_all\n`);
    res.write(`data: ${JSON.stringify({ devices, policies, logs, software, failures, dnsRecords, dnsQueryLogs, sovereignSettings, applianceConfig, enrollmentRequests: staticEnrollmentRequests, volatileSessions, gatewayLogs, gatewayRequestsCount, averageDelay, compliance: getComplianceState() })}\n\n`);

    req.on("close", () => {
      sseClients = sseClients.filter(c => c.id !== clientId);
    });
  });

  // 2. Fetch full static datasets
  app.get("/api/devices", (req, res) => res.json(devices));
  app.get("/api/policies", (req, res) => res.json(policies));
  app.get("/api/logs", (req, res) => res.json(logs));
  app.get("/api/software", (req, res) => res.json(software));
  app.get("/api/failures", (req, res) => res.json(failures));
  app.get("/api/dns/records", (req, res) => res.json(dnsRecords));
  app.get("/api/dns/logs", (req, res) => res.json(dnsQueryLogs));
  app.get("/api/settings", (req, res) => res.json(sovereignSettings));

  // --- VISION ARCHITECTE PERSISTENCE ENDPOINTS ---
  app.get("/api/vision-architecte/journals", (req, res) => {
    res.json(visionJournals);
  });

  app.post("/api/vision-architecte/journals", (req, res) => {
    const { title, category, author, timestamp, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const newJ: VisionJournal = {
      id: `J-${Math.floor(10 + Math.random() * 90)}`,
      title,
      category: category || "Matériaux",
      author: author || "Elara Vance",
      timestamp: timestamp || new Date().toISOString().replace("T", " ").substring(0, 16),
      content
    };
    visionJournals = [newJ, ...visionJournals];
    appendLog(`Nouvelle observation enregistrée : ${title} par ${author}`, "info", "Observatoire Spatial");
    res.status(201).json(newJ);
  });

  app.get("/api/vision-architecte/transmissions", (req, res) => {
    res.json(visionTransmissions);
  });

  app.post("/api/vision-architecte/transmissions", (req, res) => {
    const { id, timestamp, vector, data, status } = req.body;
    if (!data) {
      return res.status(400).json({ error: "Transmission data is required" });
    }
    const newTx: VisionTransmission = {
      id: id || `TX-${Math.floor(4400 + Math.random() * 1000)}`,
      timestamp: timestamp || new Date().toLocaleTimeString("en-GB", { hour12: false }),
      vector: vector || "Satellite Secure-B",
      data,
      status: status || "DELIVERED"
    };
    visionTransmissions = [newTx, ...visionTransmissions].slice(0, 50);
    appendLog(`Uplink satellite souverain : ${data.substring(0, 50)}...`, "success", "Satellite Ground Terminal");
    res.status(201).json(newTx);
  });

  app.get("/api/vision-architecte/badge", (req, res) => {
    res.json(visionBadge);
  });

  app.post("/api/vision-architecte/badge", (req, res) => {
    const { name, email, keyCode, clearance, avatarColor, regDate } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    visionBadge = {
      id: req.body.id || `ARC-${Math.floor(100 + Math.random() * 900)}-V${Math.floor(1 + Math.random() * 9)}`,
      name,
      email,
      keyCode: keyCode || "VA-KEY-LUCK33",
      clearance: clearance || "CLEARANCE OXYGENE",
      avatarColor: avatarColor || "from-cyan-500 to-emerald-500",
      regDate: regDate || new Date().toISOString().replace("T", " ").substring(0, 19)
    };
    appendLog(`Opérateur de liaison enregistré : ${name} (${clearance})`, "success", "Sécurité Centrale");
    res.json(visionBadge);
  });

  // --- SOVEREIGN AUDIT CONTINUOUS COMPLIANCE ENDPOINTS ---
  app.get("/api/compliance", (req, res) => {
    res.json(getComplianceState());
  });

  app.post("/api/compliance/evidence/:controlId", (req, res) => {
    const { controlId } = req.params;
    const { auditorSigned } = req.body;
    const currentState = getComplianceState();
    const control = currentState.controls.find(c => c.id === controlId);
    if (!control) {
      return res.status(404).json({ error: "Compliance control reference not found." });
    }

    const timestamp = new Date().toISOString();
    const hashSeed = `${control.id}-${control.status}-${timestamp}-${JSON.stringify(control.evidenceSnapshot)}`;
    let hash = 0;
    for (let i = 0; i < hashSeed.length; i++) {
      hash = (hash << 5) - hash + hashSeed.charCodeAt(i);
      hash |= 0;
    }
    const signature = `SHA256SEC-${Math.abs(hash).toString(16).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const evidenceSeal = {
      controlId: control.id,
      code: control.code,
      name: control.name,
      standard: control.standard,
      status: control.status,
      evidenceType: control.evidenceType,
      evidenceSnapshot: JSON.parse(control.evidenceSnapshot),
      sealTimestamp: timestamp,
      integritySignature: signature,
      verificationAuthority: "Sovereign Nexus Compliance Engine v4.2",
      sealedBy: auditorSigned ? "Guest Auditor (Sealed Token Session)" : "Sovereign Bastion Automated Daemon"
    };

    appendLog(`Compliance evidence sealed for ${control.code}: Signature ${signature}`, "success", "Continuous Compliance Module");
    broadcast("compliance_update", currentState);
    res.json(evidenceSeal);
  });

  app.post("/api/compliance/generate-report", (req, res) => {
    const currentState = getComplianceState();
    const activePolicies = policies.filter(p => p.enabled);
    const brokenControls = currentState.controls.filter(c => c.status === "broken");
    const driftControls = currentState.controls.filter(c => c.status === "drift");

    const reportMarkdown = `
# SOVEREIGN NEXUS CONTINUOUS COMPLIANCE AUDIT
**Standard Reference Framework:** SOC 2 Type II & ISO 27001 Annex A
**Generated on (UTC):** ${new Date().toISOString().replace('T', ' ').substring(0, 19)}
**Overall Placement Score:** ${currentState.score}% Compliance Alignment

---

## 🛡️ EXEC SUMMARY
The compliance engine has executed a dynamic automated evaluation across all interconnected airgapped PC target fleet units (the "Fleet Control") routing through the **JumpServer PAM Bastion**. 

- **Compliance Rating:** **${currentState.score}%** Real-Time Alignment
- **Verified Controls:** ${currentState.summary.verifiedCount} / ${currentState.summary.totalCount} active checks
- **Minor Drift Discovered:** ${currentState.summary.driftCount} checks
- **Breached/Failed Checks:** ${currentState.summary.brokenCount} checks

---

## 📁 COMPLIANCE DOMAIN SUB-SCORES

${currentState.domains.map(dom => `
### • ${dom.name} (${dom.score}% Alignment)
- Status: **${dom.status.toUpperCase()}**
- Total Mapped Controls: ${dom.controlsCount}
- Active Verified Safeguards: ${dom.verifiedCount}
`).join("\n")}

---

## 📊 CRITICAL ANOMALIES & ASSESSMENTS
${brokenControls.length === 0 && driftControls.length === 0 ? `
🟢 **ALL SYSTEMS IN CONTINUOUS COMPLIANCE:** All active nodes are whitelisting requests and enforcing credential policies correctly according to zero-trust standards.
` : `
${brokenControls.map(ctrl => `
🔴 **BREACH (FAIL)** - **[${ctrl.standard} ${ctrl.code}] ${ctrl.name}**
- Description: ${ctrl.description}
- Remediation Plan: Enable the corresponding security policies immediately within the System Essence dashboard.
`).join("\n")}

${driftControls.map(ctrl => `
🟡 **DRIFT (WARNING)** - **[${ctrl.standard} ${ctrl.code}] ${ctrl.name}**
- Description: ${ctrl.description}
- Remediation Plan: Review the JIT dynamic access boundaries or update node telemetry status.
`).join("\n")}
`}

---

## 🔒 CRYPTOGRAPHIC ASSURANCE
This report has been automatically signed and compiled using state-verification primitives.
**Sealed Fingerprint SHA-256:**
\`\`\`text
SHA256-RPT-${Math.floor(Math.random() * 900000 + 100000)}-NEXUS-COMPLIANCE-SEALED
\`\`\`
`;

    appendLog("Continuous compliance report synthesized by AI Neural engine.", "success", "Nexus Compliance AI");
    res.json({ report: reportMarkdown });
  });

  // --- OBSERVATION DECK VNC/RDP ACTION ENDPOINT ---
  app.post("/api/observation-deck/action", (req, res) => {
    const { deviceId, action, remoteUser } = req.body;
    const dev = devices.find(d => d.id === deviceId);
    if (!dev) {
      return res.status(404).json({ error: "Assigned target host not found." });
    }

    if (action === "lock-screen") {
      appendLog(`VNC lock instruction streamed to ${dev.name} by user '${remoteUser || "Sovereign Operator"}' via JumpServer tunnel.`, "info", "Apache Guacamole Gateway", dev.id);
    } else if (action === "force-reboot") {
      dev.status = "online";
      dev.cpu = 5;
      dev.ram = 18;
      dev.lastActive = "Just now";
      dev.uptime = "0d 00h";
      appendLog(`Guacamole command dispatch: Hard ACPI power cycle triggered on ${dev.name}.`, "warning", "Apache Guacamole Gateway", dev.id);
    } else if (action === "kill-process") {
      dev.cpu = Math.max(10, dev.cpu - 35);
      dev.ram = Math.max(15, dev.ram - 20);
      appendLog(`Sent SIGKILL instruction to high-load process tree on host ${dev.name}.`, "success", "Apache Guacamole Gateway", dev.id);
    } else if (action === "patch-kernel") {
      dev.policyCompliance = 100;
      appendLog(`JumpServer LivePatch: Security hotfixes applied to Host ${dev.name} successfully.`, "success", "Apache Guacamole Gateway", dev.id);
    }

    broadcast("devices_update", devices);
    broadcast("logs_update", logs);
    broadcast("compliance_update", getComplianceState());
    res.json({ success: true, device: dev });
  });

  // Settings Apply POST endpoint
  app.post("/api/settings", (req, res) => {
    const updated = req.body;
    sovereignSettings = {
      coreIdentity: Number(updated.coreIdentity ?? sovereignSettings.coreIdentity),
      cognitiveLoad: Number(updated.cognitiveLoad ?? sovereignSettings.cognitiveLoad),
      hapticResonance: Number(updated.hapticResonance ?? sovereignSettings.hapticResonance),
      energyProfile: Number(updated.energyProfile ?? sovereignSettings.energyProfile),
      dataSynthesis: String(updated.dataSynthesis ?? sovereignSettings.dataSynthesis)
    };
    appendLog(`Sovereign essence parameters recalibrated: Identity=${sovereignSettings.coreIdentity}%, Cognitive=${sovereignSettings.cognitiveLoad}%, Resonance=${sovereignSettings.hapticResonance}Hz, Energy=${sovereignSettings.energyProfile}%, Sync=${sovereignSettings.dataSynthesis}`, "success", "Central Recalibration Daemon");
    broadcast("settings_update", sovereignSettings);
    res.json({ success: true, sovereignSettings });
  });

  // --- SOVEREIGN APPLIANCE ENDPOINTS (PFSENSE-STYLE) ---
  app.get("/api/appliance/config", (req, res) => {
    res.json(applianceConfig);
  });

  app.post("/api/appliance/apply", (req, res) => {
    const updated = req.body;
    
    // Bind target configuration fields
    applianceConfig = {
      bastionEnabled: !!updated.bastionEnabled,
      bastionPort: Number(updated.bastionPort ?? applianceConfig.bastionPort),
      encryptedProtocolMode: updated.encryptedProtocolMode ?? applianceConfig.encryptedProtocolMode,
      telemetryInterval: updated.telemetryInterval ?? applianceConfig.telemetryInterval,
      autoIsolateOnOverheat: !!updated.autoIsolateOnOverheat,
      mfaEnforced: !!updated.mfaEnforced,
      ipWhitelist: String(updated.ipWhitelist ?? applianceConfig.ipWhitelist),
      installedPlugins: {
        pfBlockerNG: !!updated.installedPlugins?.pfBlockerNG,
        suricataIDS: !!updated.installedPlugins?.suricataIDS,
        soc2Auditor: !!updated.installedPlugins?.soc2Auditor,
        vncStreamer: !!updated.installedPlugins?.vncStreamer,
      }
    };

    try {
      // Direct file IO simulation representing pfSense system core behavior
      const fs = require("fs");
      const path = require("path");
      fs.writeFileSync(path.join(process.cwd(), "system_config.json"), JSON.stringify(applianceConfig, null, 2));
    } catch (err) {
      console.warn("Could not write config.xml/json file to physical disk. Running in disk-emulated memory mode:", err);
    }

    // Direct sequential orchestration daemon logging
    appendLog("Orchestrator config rewrite launched. Overwriting /etc/sovereign-nexus/system_config.json.", "info", "Sovereign Appliance Core");
    
    setTimeout(() => {
      appendLog(`Daemon check: ${applianceConfig.bastionEnabled ? "Launching" : "Terminating"} JumpServer Docker proxy on Port: ${applianceConfig.bastionPort} (${applianceConfig.encryptedProtocolMode}).`, "info", "Sovereign Appliance Core");
    }, 400);

    setTimeout(() => {
      appendLog(`Vulnerability & Metrics scraper calibrated to frequency interval: '${applianceConfig.telemetryInterval}'.`, "success", "Sovereign Appliance Core");
    }, 800);

    setTimeout(() => {
      // Dynamic device compliance penalty if MFA is unapproved or plug-ins are broken
      if (!applianceConfig.mfaEnforced) {
        devices.forEach(d => {
          d.policyCompliance = Math.max(30, d.policyCompliance - 25);
        });
        appendLog("SECURITY RISK: MFA Enforcement disabled. Global JIT target policies demoted.", "warning", "Sovereign Appliance Core");
      } else {
        devices.forEach(d => {
          d.policyCompliance = Math.min(100, d.policyCompliance + 10);
        });
        appendLog("Security Rules: Active MFA enforcement confirmed. Target policies promoted.", "success", "Sovereign Appliance Core");
      }
      broadcast("devices_update", devices);
    }, 1200);

    setTimeout(() => {
      appendLog(`Appliance OS firewall updated. Allow IP white-range matches: [${applianceConfig.ipWhitelist}].`, "success", "Sovereign Appliance Core");
    }, 1600);

    setTimeout(() => {
      appendLog(`Loaded core plugins index: ${Object.keys(applianceConfig.installedPlugins).filter(k => applianceConfig.installedPlugins[k as keyof typeof applianceConfig.installedPlugins]).join(", ") || "none"}.`, "info", "Sovereign Appliance Core");
    }, 2000);

    setTimeout(() => {
      appendLog("pfSense Core System successfully rebooted in Single Image sandbox. Node status: OPTIMAL.", "success", "Sovereign Appliance Core");
    }, 2400);

    broadcast("appliance_config_update", applianceConfig);
    res.json({ success: true, applianceConfig });
  });

  // --- SOVEREIGN MILITARY ASSET ENROLLMENT ENDPOINTS ---
  app.get("/api/appliance/enroll/list", (req, res) => {
    res.json(staticEnrollmentRequests);
  });

  app.post("/api/appliance/enroll/request", (req, res) => {
    const { designation, sector, ip, os, clearanceLevel, rootAccess, signerOperator } = req.body;
    
    if (!designation || !ip) {
      return res.status(400).json({ error: "Designation and Static IP address are required." });
    }

    const newRequest: EnrollmentRequest = {
      id: `REQ-${Math.floor(3300 + staticEnrollmentRequests.length + 1)}`,
      designation: String(designation).toUpperCase().trim(),
      sector: String(sector ?? "External"),
      ip: String(ip).trim(),
      os: os || "Linux",
      clearanceLevel: Number(clearanceLevel ?? 3),
      rootAccess: !!rootAccess,
      signerOperator: String(signerOperator || "Officer Cadet").trim(),
      status: "pending",
      createdTime: new Date().toISOString().replace("T", " ").substring(0, 19)
    };

    staticEnrollmentRequests.push(newRequest);
    appendLog(`Asset Request filed for tactical unit: ${newRequest.designation} (${newRequest.os}) at IP: ${newRequest.ip}. Clearance level requested: ${newRequest.clearanceLevel}.`, "info", "Appliance Onboarding");
    
    broadcast("enrollment_requests_update", staticEnrollmentRequests);
    broadcast("logs_update", logs);
    res.json({ success: true, request: newRequest });
  });

  app.post("/api/appliance/enroll/approve", (req, res) => {
    const { requestId } = req.body;
    const request = staticEnrollmentRequests.find(r => r.id === requestId);
    
    if (!request) {
      return res.status(404).json({ error: "Access Enrollment request reference not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request is already processed." });
    }

    const generatedToken = `SOV-${Math.floor(10000 + Math.random() * 90000)}-${Math.random().toString(36).substring(3, 8).toUpperCase()}`;
    request.status = "approved";
    request.token = generatedToken;

    appendLog(`Access Request APPROVED for ${request.designation} by Sovereign Command. Single-use JIT activation token registered: ${generatedToken}`, "success", "Appliance Onboarding");
    
    broadcast("enrollment_requests_update", staticEnrollmentRequests);
    broadcast("logs_update", logs);
    res.json({ success: true, request });
  });

  app.post("/api/appliance/enroll/handshake", (req, res) => {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: "Activation token key is required for handshaking." });
    }

    const request = staticEnrollmentRequests.find(r => r.token === token && r.status === "approved");
    
    if (!request) {
      return res.status(404).json({ error: "Invalid, expired, or already-used activation token." });
    }

    // Mark as enrolled
    request.status = "enrolled";
    request.enrolledTime = new Date().toISOString().replace("T", " ").substring(0, 19);

    // Add device to main database array, dynamically expanding capabilities!
    const newDevice: Device = {
      id: request.designation.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: request.designation,
      ip: request.ip,
      os: request.os,
      status: "online",
      cpu: 14,
      ram: 28,
      storage: 18,
      bandwidth: 3.4,
      uptime: "0d 00h",
      lastActive: "Just now",
      group: request.sector.replace("Secteur ", "").replace("Périmètre ", ""),
      location: "Tactical Perimeter Gateway",
      policyCompliance: 100,
      serialNumber: `SN-MIL-${Math.floor(100000 + Math.random() * 900000)}`,
      kernelVersion: request.os === "SovereignOS" ? "SovereignOS-RTOS v2.4" : "Linux-Grsec 5.15.0-98-generic"
    };

    devices.push(newDevice);

    appendLog(`Cryptographic Handshake COMPLETED: Active tactical asset ${request.designation} (${request.ip}) safely synchronized. Token retired.`, "success", "Appliance Onboarding", newDevice.id);
    
    broadcast("devices_update", devices);
    broadcast("logs_update", logs);
    broadcast("compliance_update", getComplianceState());
    broadcast("enrollment_requests_update", staticEnrollmentRequests);

    res.json({ success: true, device: newDevice, request });
  });

  // --- SOVEREIGN VOLATILE EPHEMERAL LINK ENDPOINTS ---
  app.get("/api/appliance/volatile/list", (req, res) => {
    res.json(volatileSessions);
  });

  app.post("/api/appliance/volatile/generate", (req, res) => {
    const { subscriberName, ipAddress, roleAssigned, durationSeconds } = req.body;
    if (!subscriberName || !ipAddress) {
      return res.status(400).json({ error: "Subscriber name and static IP targets are required." });
    }

    const sessionId = `VOL-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const token = `LNK-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${sessionId}`;
    const ttl = Number(durationSeconds || 120); // default to 120 seconds in simulation for reactive demonstration!

    const newSession: VolatileSession = {
      id: sessionId,
      subscriberName: String(subscriberName).toUpperCase().trim(),
      token,
      status: "active",
      ramPath: `/dev/shm/nexus_session_${sessionId}.key`,
      ipAddress: String(ipAddress).trim(),
      roleAssigned: roleAssigned || "Guest Terminal Operator",
      establishedTime: new Date().toISOString().replace("T", " ").substring(0, 19),
      timeRemainingSeconds: ttl,
      totalTtlSeconds: ttl
    };

    volatileSessions.push(newSession);

    appendLog(`Provisioned short-lived Volatile Configuration Link for ${newSession.subscriberName}. RAM storage binding: ${newSession.ramPath}. Single-Use token: ${token} (expires in ${ttl} seconds)`, "info", "Volatile Link");

    broadcast("volatile_sessions_update", volatileSessions);
    broadcast("logs_update", logs);

    res.json({ success: true, session: newSession });
  });

  app.post("/api/appliance/volatile/claim", (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "RAM cryptographic token is required for registration." });
    }

    const session = volatileSessions.find(s => s.token === token);
    if (!session) {
      return res.status(404).json({ error: "Cryptographic link token is invalid or expired." });
    }

    if (session.status === "expired" || session.timeRemainingSeconds <= 0) {
      return res.status(400).json({ error: "The requested volatile session has expired or its RAM storage was cleared." });
    }

    appendLog(`Handshake completed over volatile memory partition: CLIENT ${session.subscriberName} on IP ${session.ipAddress} synchronized. Single-use token claimed.`, "success", "Volatile Link");

    // Add device to active network
    const existingNode = devices.find(d => d.ip === session.ipAddress);
    if (!existingNode) {
      const dev: Device = {
        id: `volatile-${session.id.toLowerCase()}`,
        name: session.subscriberName,
        ip: session.ipAddress,
        os: "SovereignOS",
        status: "online",
        cpu: 8,
        ram: 11,
        storage: 0, // 0 for memory-disk
        bandwidth: 1.5,
        uptime: "0h 01m",
        lastActive: "Just now",
        group: "Volatile Guest Link",
        location: "/dev/shm [RAM DISK]",
        policyCompliance: 100,
        serialNumber: `SN-VOL-${session.id}`,
        kernelVersion: "SovereignOS-Transient v0.9 (Ephemeral)"
      };
      devices.push(dev);
    } else {
      existingNode.status = "online";
    }

    broadcast("volatile_sessions_update", volatileSessions);
    broadcast("devices_update", devices);
    broadcast("logs_update", logs);

    res.json({ success: true, session });
  });

  app.post("/api/appliance/volatile/reboot", (req, res) => {
    const { sessionId } = req.body;
    const session = volatileSessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({ error: "Volatile session target reference not discovered." });
    }

    session.status = "expired";
    session.timeRemainingSeconds = 0;

    // Simulate complete RAM loss: knock the device offline!
    const dev = devices.find(d => d.ip === session.ipAddress || d.id === `volatile-${session.id.toLowerCase()}`);
    if (dev) {
      dev.status = "offline";
      dev.lastActive = "RAM Wiped (Reboot)";
    }

    appendLog(`PHYSICAL REBOOT TRIGGERED on client device ${session.subscriberName} (${session.ipAddress}). Volatile credential key at ${session.ramPath} is completely wiped from physical RAM cells. Asset isolated.`, "critical", "Volatile Link");

    broadcast("volatile_sessions_update", volatileSessions);
    broadcast("devices_update", devices);
    broadcast("logs_update", logs);

    res.json({ success: true, session });
  });

  // 3. Post Command Override action (Reboot, Isolate, Direct triggers)
  app.post("/api/devices/command", (req, res) => {
    const { deviceId, action, params } = req.body;
    const dev = devices.find(d => d.id === deviceId);

    if (!dev) {
      return res.status(404).json({ error: "Device registry not found." });
    }

    if (action === "reboot" || action === "Reboot Host") {
      dev.status = "online";
      dev.cpu = 15;
      dev.ram = 25;
      dev.lastActive = "Just now";
      dev.uptime = "0d 00h";
      appendLog(`Emergency power cycle dispatched to ${dev.name}. Bios registers re-negotiating.`, "success", `Terminal Daemon [${dev.name}]`, dev.id);
    } else if (action === "isolate" || action === "Isolate Network") {
      dev.status = "warning";
      dev.lastActive = "Just now";
      appendLog(`Hardware network isolation protocol triggered. Ports blocked on ${dev.name}.`, "critical", "Sovereign Airgap Daemon", dev.id);
    } else if (action === "clear-alarms" || action === "Clear Alerts") {
      // Find logs of this device and demote them
      logs = logs.filter(l => l.deviceId !== dev.id || l.level !== "critical");
      if (dev.status === "warning") {
        dev.status = "online";
      }
      appendLog(`Reset alert relays on host telemetry matrix for ${dev.name}.`, "info", "Orchestrator Health Engine", dev.id);
    }

    broadcast("devices_update", devices);
    broadcast("logs_update", logs);
    res.json({ success: true, device: dev });
  });

  // 4. Modify policy status (Desired State Configuration logic)
  app.post("/api/policies/toggle", (req, res) => {
    const { policyId } = req.body;
    const policy = policies.find(p => p.id === policyId);

    if (!policy) {
      return res.status(404).json({ error: "Configuration policy not resolved." });
    }

    policy.enabled = !policy.enabled;
    policy.lastEnforced = "Just now";

    appendLog(
      `Sovereign compliance target changed: '${policy.name}' set to ${policy.enabled ? "ACTIVE" : "BYPASSED"}.`,
      policy.enabled ? "success" : "warning",
      "Policy Orchestration Daemon"
    );

    // Apply Desired State configuration adjustments automatically on compliance metric ratings!
    const activeWeight = policies.filter(p => p.enabled).length;
    const globalComplianceRating = Math.round((activeWeight / policies.length) * 100);

    devices = devices.map(d => {
      if (d.status === "offline") return d;
      const calculatedRating = Math.min(100, Math.max(30, globalComplianceRating + (d.id.charCodeAt(5) % 15)));
      return { ...d, policyCompliance: calculatedRating };
    });

    broadcast("policies_update", policies);
    broadcast("devices_update", devices);
    broadcast("compliance_update", getComplianceState());
    res.json({ success: true, policies, devices });
  });

  // 5. Mass Enforce policies
  app.post("/api/policies/deploy", (req, res) => {
    policies = policies.map(p => ({ ...p, enabled: true, lastEnforced: "Just now" }));
    
    devices = devices.map(d => {
      if (d.status === "offline") return d;
      return { ...d, policyCompliance: 100 };
    });

    appendLog("Global MDM policy rollout completed. 100% target compliance reached over airgapped relays.", "success", "Central Enforcement Manager");

    broadcast("policies_update", policies);
    broadcast("devices_update", devices);
    broadcast("compliance_update", getComplianceState());
    res.json({ success: true, policies, devices });
  });

  // 6. Flash Software Upgrade
  app.post("/api/software/update", (req, res) => {
    const { pkgId } = req.body;
    const pkg = software.find(s => s.id === pkgId);

    if (!pkg) {
      return res.status(404).json({ error: "Package identifier not found." });
    }

    pkg.version = pkg.latestVersion.split(" ")[0];
    pkg.status = "up_to_date";

    appendLog(`Flashed kernel safe asset binaries: ${pkg.name} upgraded successfully.`, "success", "Sovereign Package Registry");

    broadcast("software_update", software);
    res.json({ success: true, software });
  });

  // 7. MITIGATE ML Failures
  app.post("/api/failures/mitigate", (req, res) => {
    const { failureId } = req.body;
    const fail = failures.find(f => f.id === failureId);

    if (!fail) {
      return res.status(404).json({ error: "Failure prediction tracker not found." });
    }

    const linkedDevice = devices.find(d => d.id === fail.deviceId);
    if (linkedDevice) {
      linkedDevice.status = "online";
      linkedDevice.cpu = Math.max(10, linkedDevice.cpu - 25);
      linkedDevice.ram = Math.max(20, linkedDevice.ram - 15);
    }

    appendLog(`Pre-emptive mitigation logic injected for component '${fail.component}' on ${fail.deviceName}. Heat loads stabilized.`, "success", "ML Auto-Healer Daemon", fail.deviceId);

    failures = failures.filter(f => f.id !== failureId);

    broadcast("failures_update", failures);
    broadcast("devices_update", devices);
    res.json({ success: true, failures, devices });
  });

  // --- SOVEREIGN LOCAL DNS ENDPOINTS ---
  app.post("/api/dns/records", (req, res) => {
    const { domain, type, value, ttl } = req.body;
    if (!domain || !type || !value) {
      return res.status(400).json({ error: "Missing required parameters (domain, type, value)" });
    }
    const newRecord: DNSRecord = {
      id: `DNS-${Date.now()}`,
      domain: domain.trim(),
      type: type,
      value: value.trim(),
      ttl: Number(ttl) || 3600,
      status: "active",
      systemManaged: false
    };
    dnsRecords.push(newRecord);
    appendLog(`Created local authoritative zone mapping: [${type}] ${domain} -> ${value}`, "success", "DNS Server Daemon");
    broadcast("dns_records_update", dnsRecords);
    res.json({ success: true, record: newRecord, dnsRecords });
  });

  app.post("/api/dns/records/toggle", (req, res) => {
    const { recordId } = req.body;
    const record = dnsRecords.find(r => r.id === recordId);
    if (!record) {
      return res.status(404).json({ error: "DNS Record mapping not found." });
    }
    if (record.status === "active") {
      record.status = "intercepted";
      record.value = "0.0.0.0"; // Sinkhole redirect
      appendLog(`Enforced sinkhole intercept routing on domain: ${record.domain}`, "warning", "DNS Protection Daemon");
    } else {
      record.status = "active";
      if (record.value === "0.0.0.0") {
        record.value = "10.240.11.14"; // Default gateway recovery
      }
      appendLog(`Released sinkhole intercept on domain: ${record.domain}`, "success", "DNS Protection Daemon");
    }
    broadcast("dns_records_update", dnsRecords);
    res.json({ success: true, record, dnsRecords });
  });

  app.post("/api/dns/records/delete", (req, res) => {
    const { recordId } = req.body;
    const rec = dnsRecords.find(r => r.id === recordId);
    if (!rec) {
      return res.status(404).json({ error: "Record not found." });
    }
    dnsRecords = dnsRecords.filter(r => r.id !== recordId);
    appendLog(`Purged authoritative mapping zone: ${rec.domain} [${rec.type}]`, "warning", "DNS Server Daemon");
    broadcast("dns_records_update", dnsRecords);
    res.json({ success: true, dnsRecords });
  });

  app.post("/api/dns/query", (req, res) => {
    const { domain, deviceId } = req.body;
    const dev = devices.find(d => d.id === deviceId) || devices[0];
    const rec = dnsRecords.find(r => r.domain.toLowerCase() === (domain || "").toLowerCase().trim());
    
    let queryStatus: "resolved" | "blocked" | "forwarded" = "forwarded";
    let queryVal = "8.8.8.8 (External Default Loopback)";
    let recordType = "A";

    if (rec) {
      recordType = rec.type;
      if (rec.status === "intercepted") {
        queryStatus = "blocked";
        queryVal = "0.0.0.0 (Sovereign Sinkhole)";
      } else if (rec.status === "active") {
        queryStatus = "resolved";
        queryVal = rec.value;
      } else {
        queryStatus = "blocked";
        queryVal = "0.0.0.0 (Admin Lockout)";
      }
    } else {
      queryVal = "192.168.1.1 (Upstream Secure DNS)";
    }

    const newQueryLog: DNSQueryLog = {
      id: `DQL-${Date.now()}`,
      timestamp: getTimestamp(),
      domain: (domain || "unknown-lookup.hq").trim(),
      clientIp: dev ? dev.ip : "10.240.11.14",
      clientName: dev ? dev.name : "SOV-CORE-GATEWAY-1A",
      type: recordType,
      status: queryStatus,
      resolvedValue: queryVal
    };

    dnsQueryLogs = [newQueryLog, ...dnsQueryLogs].slice(0, 100);
    broadcast("dns_logs_update", dnsQueryLogs);
    res.json({ success: true, queryLog: newQueryLog });
  });

  // 8. Console Interactive Shell query terminal route
  app.post("/api/shell/exec", (req, res) => {
    const { commandInput } = req.body;
    const cmdTrimmed = (commandInput || "").trim();

    if (!cmdTrimmed) {
      return res.json({ text: "", type: "output" });
    }

    const args = cmdTrimmed.toLowerCase().split(" ");
    const primaryCommand = args[0];
    const targetArg = args[1];

    let outputType: "output" | "error" | "success" | "warning" = "output";
    let outputText = "";

    switch (primaryCommand) {
      case "help":
        outputText = `Operational Cmdlets:
  help                Display instructions list.
  devices             Show host terminals and telemetry heartbeats.
  policies            List strict security policy modules.
  scan                Run kernel vulnerability checks (CVE audit).
  predict             ML predictive wear and temperature failure analysis.
  ping <ip>           Ping host node dynamically.
  reboot <device-id>  Cycle power relay on selected machine.
  isolate <device-id> Instantly cut all network link routes.
  clear               Wipe output interface.`;
        break;

      case "devices":
        outputText = "ACTIVE HOST REGISTRY (LIVE FROM SERVER-SIDE STATE):\n" + devices.map(d =>
          `  [${d.id}] ${d.name.padEnd(26)} | IP: ${d.ip.padEnd(14)} | ${d.status.toUpperCase().padEnd(8)} | CPU: ${d.cpu}% | Compliance: ${d.policyCompliance}%`
        ).join("\n");
        break;

      case "policies":
        outputText = "SOVEREIGN CONFIGURATION POLICIES:\n" + policies.map(p =>
          `  [${p.id}] ${p.name.padEnd(38)} | Cat: ${p.category.padEnd(14)} | Active: ${p.enabled ? "YES" : "NO"}`
        ).join("\n");
        break;

      case "scan":
        outputType = "warning";
        outputText = `Initiating global vulnerability scanner...
[VULN AUDIT] Compiled with ${software.filter(s => s.status !== "up_to_date").length} vulnerable libraries flagged on hosts.
  - SW-02: OpenSSL Cryptography Engine 1.1.1t (VULNERABLE) -> CVE-2023-0286
  - SW-04: Docker Engine Containerized Wrapper 20.10.12 (UNSUPPORTED)
Execution trace completed. Core system integrity at ${Math.round(devices.reduce((acc, d) => acc + d.policyCompliance, 0) / devices.length)}% score.`;
        break;

      case "predict":
        outputType = "warning";
        if (failures.length === 0) {
          outputText = "No pre-failure thermal indexes or hardware degradations recognized by the ML model.";
          outputType = "success";
        } else {
          outputText = "ML COMPONENT AGING AND FAILURE PREDICTION PROFILE:\n" + failures.map(f =>
            `  - ${f.deviceName} (${f.deviceId}): ${f.component} warning. Heat: ${f.currentTemp}°C. Failure Probability: ${f.probability}%. RUL: ${f.timeToFailure}.`
          ).join("\n");
        }
        break;

      case "ping":
        if (!targetArg) {
          outputText = "Error: Target host IP argument required. Usage: ping <ip_address>";
          outputType = "error";
        } else {
          const deviceMatch = devices.find(d => d.ip === targetArg);
          if (deviceMatch) {
            outputText = `Pinging host [${deviceMatch.name}] at ${targetArg}...
64 bytes from ${targetArg}: icmp_seq=1 ttl=64 time=14.2 ms
64 bytes from ${targetArg}: icmp_seq=2 ttl=64 time=14.8 ms
64 bytes from ${targetArg}: icmp_seq=3 ttl=64 time=13.9 ms
--- Latency profile: Nominal. Heartbeat active. ---`;
            outputType = "success";
          } else {
            outputText = `Pinging ${targetArg}...
Request timeout for icmp_seq 1 (No direct airgap router link).
Request timeout for icmp_seq 2 (Unreachable target IP boundary).
--- Network trace complete: Host UNREACHABLE. ---`;
            outputType = "error";
          }
        }
        break;

      case "reboot":
        if (!targetArg) {
          outputText = "Error: System device-id code required. Usage: reboot <DEV-XXX>";
          outputType = "error";
        } else {
          const uID = targetArg.toUpperCase();
          const dev = devices.find(d => d.id === uID);
          if (dev) {
            dev.status = "online";
            dev.cpu = 10;
            dev.ram = 20;
            appendLog(`Reboot instruction invoked on device ${dev.name} by remote terminal command.`, "success", "Console Interactive", dev.id);
            broadcast("devices_update", devices);
            outputType = "success";
            outputText = `[REBOOT CMD APPROVED] Sequence dispatched to power relay ${dev.name} (${dev.id}). Device rebooting.`;
          } else {
            outputText = `Error: Cannot resolve device code '${uID}' in active registration tables.`;
            outputType = "error";
          }
        }
        break;

      case "isolate":
        if (!targetArg) {
          outputText = "Error: System device-id code required. Usage: isolate <DEV-XXX>";
          outputType = "error";
        } else {
          const uID = targetArg.toUpperCase();
          const dev = devices.find(d => d.id === uID);
          if (dev) {
            dev.status = "warning";
            appendLog(`Emergency isolation directive triggered for device ${dev.name} via terminal operator.`, "critical", "Console Interactive", dev.id);
            broadcast("devices_update", devices);
            outputType = "warning";
            outputText = `[ISOLATION PROTOCOL ENGAGED] Network adapters blocked for ${dev.name} (${dev.id}). Host is airgapped.`;
          } else {
            outputText = `Error: System device registry code '${uID}' not found.`;
            outputType = "error";
          }
        }
        break;

      default:
        outputText = `Error: Unknown shell instruction sequence '${primaryCommand}'. Type 'help' to review supported operational sets.`;
        outputType = "error";
    }

    appendLog(`Operator shell command processed: '${cmdTrimmed}'`, "info", "Console Terminal Engine");
    res.json({ text: outputText, type: outputType });
  });

  // 9. Continuous Server Telemetry Tick Simulation (True Multi-User Server Telemetry Engine)
  setInterval(() => {
    let changed = false;

    devices = devices.map(dev => {
      if (dev.status === "offline") return dev;

      // Slowly mutate performance statistics over time (sine fluctuations + random noise)
      const baseCpuFlux = Math.ceil(Math.sin(Date.now() / 15000) * 12);
      const valCpuNoise = Math.floor(Math.random() * 5) - 2;
      let targetCpu = dev.cpu + baseCpuFlux + valCpuNoise;
      targetCpu = Math.max(10, Math.min(98, targetCpu));

      const valRamNoise = Math.floor(Math.random() * 3) - 1;
      let targetRam = dev.ram + valRamNoise;
      targetRam = Math.max(15, Math.min(95, targetRam));

      const targetBand = Math.max(0.1, Number((dev.bandwidth + (Math.sin(Date.now() / 8000) * 0.8)).toFixed(1)));

      if (targetCpu !== dev.cpu || targetRam !== dev.ram || targetBand !== dev.bandwidth) {
        changed = true;
        return {
          ...dev,
          cpu: targetCpu,
          ram: targetRam,
          bandwidth: targetBand,
          lastActive: "Just now"
        };
      }
      return dev;
    });

    if (changed) {
      broadcast("devices_update", devices);
    }
  }, 4000);

  // 10. Continuous DNS Logs Query Telemetry Simulator
  setInterval(() => {
    const activeDevices = devices.filter(d => d.status !== "offline");
    if (activeDevices.length === 0) return;
    const randomDevice = activeDevices[Math.floor(Math.random() * activeDevices.length)];

    const testDomains = [
      "gateway.sovereign.local",
      "centrifuge.sovereign.local",
      "scada.sovereign.local",
      "valve.sovereign.local",
      "clandestine-tracker.net",
      "reverse-shell.telemetry-node.ru",
      "firmware.update-server.org",
      "time.cloudflare.com",
      "telemetry.hq.private",
      "internal-wiki.hq.private"
    ];

    const targetDomain = testDomains[Math.floor(Math.random() * testDomains.length)];
    const rec = dnsRecords.find(r => r.domain === targetDomain);

    let statusVal: "resolved" | "blocked" | "forwarded" = "forwarded";
    let resolvedVal = "8.8.4.4 (Upstream Secure Resolver)";
    let reqType = "A";

    if (rec) {
      reqType = rec.type;
      if (rec.status === "intercepted") {
        statusVal = "blocked";
        resolvedVal = "0.0.0.0 (Sovereign Sinkhole)";
      } else if (rec.status === "active") {
        statusVal = "resolved";
        resolvedVal = rec.value;
      }
    } else {
      if (targetDomain.endsWith(".private") || targetDomain.endsWith(".local")) {
        statusVal = "blocked";
        resolvedVal = "NXDOMAIN (Non-Authorized Private Zone)";
      } else {
        statusVal = "forwarded";
        resolvedVal = "1.1.1.1 (Upstream Cloudflare DNS)";
      }
    }

    const newSimLog: DNSQueryLog = {
      id: `DQL-SIM-${Date.now()}`,
      timestamp: getTimestamp(),
      domain: targetDomain,
      clientIp: randomDevice.ip,
      clientName: randomDevice.name,
      type: reqType,
      status: statusVal,
      resolvedValue: resolvedVal
    };

    dnsQueryLogs = [newSimLog, ...dnsQueryLogs].slice(0, 100);
    broadcast("dns_logs_update", dnsQueryLogs);
  }, 5000);

  // --- UNIFIED API BLEND GATEWAY ENDPOINTS ---
  app.get("/api/gateway/logs", (req, res) => {
    res.json({
      gatewayLogs,
      gatewayRequestsCount,
      averageDelay
    });
  });

  app.get("/api/gateway/prom/nodes/load", (req, res) => {
    const delay = Math.random() * 2 + 0.5;
    addGatewayLog("GET", "/api/gateway/prom/nodes/load", "Prometheus Node Exporter", 200, delay, "{ nodesTotal: 1250, activeRate: 0.945 }");
    res.json({ nodesTotal: 1250, activeRate: 0.945 });
  });

  app.post("/api/gateway/pam/replicate-session", (req, res) => {
    const delay = Math.random() * 4 + 2;
    addGatewayLog("POST", "/api/gateway/pam/replicate-session", "JumpServer PAM", 200, delay, "{ sessionId: 'SSID-7489', auditActive: true }");
    res.json({ sessionId: 'SSID-7489', auditActive: true });
  });

  app.get("/api/gateway/prom/metrics", (req, res) => {
    const delay = Math.random() * 1.5 + 0.5;
    addGatewayLog("GET", "/api/gateway/prom/metrics", "Prometheus Node Exporter", 200, delay, "{ memoryUsage: '4.2GB', swap: '0.1GB' }");
    res.json({ memoryUsage: '4.2GB', swap: '0.1GB' });
  });

  app.get("/api/gateway/pam/audit-report", (req, res) => {
    const delay = Math.random() * 3 + 1;
    addGatewayLog("GET", "/api/gateway/pam/audit-report", "JumpServer PAM", 200, delay, "{ roleEnforced: 'Strategist', logsCaptured: 12 }");
    res.json({ roleEnforced: 'Strategist', logsCaptured: 12 });
  });

  app.get("/api/gateway/ai/context_synthesis", (req, res) => {
    const delay = Math.random() * 5 + 3;
    addGatewayLog("GET", "/api/gateway/ai/context_synthesis", "LLM Neural Intel", 200, delay, "{ activeContextTokens: 1450, outputGrounded: true }");
    res.json({ activeContextTokens: 1450, outputGrounded: true });
  });

  app.post("/api/gateway/bastion/root-bypass-attempt", (req, res) => {
    const delay = Math.random() * 0.5 + 0.1;
    addGatewayLog("POST", "/api/gateway/bastion/root-bypass-attempt", "JumpServer PAM", 403, delay, "{ message: 'THREAT DETECTED: UNALIGNED IP BLOCKED INDEPENDENTLY BY BASTION SHIELD' }");
    res.status(403).json({ message: 'THREAT DETECTED: UNALIGNED IP BLOCKED INDEPENDENTLY BY BASTION SHIELD' });
  });

  app.post("/api/gateway/stress-test", (req, res) => {
    const timestamp = getTimestamp();
    const rogueLog = {
      id: `REQ-${gatewayReqCounter++}`,
      timestamp,
      method: "SSH_EXEC" as const,
      route: "/api/gateway/bastion/root-bypass-attempt",
      adapter: "JumpServer PAM" as const,
      status: 403,
      delay: "0.25ms",
      payload: "{ message: 'THREAT DETECTED: UNALIGNED IP BLOCKED INDEPENDENTLY BY BASTION SHIELD' }"
    };
    gatewayLogs = [rogueLog, ...gatewayLogs];
    gatewayRequestsCount += 1;

    appendLog("API Gateway registered unauthorized client request on /api/gateway/bastion. Rate Limiting Engaged.", "critical", "API Gateway Firewall");
    broadcast("gateway_logs_update", { gatewayLogs, gatewayRequestsCount, averageDelay });
    res.json({ success: true, gatewayLogs, gatewayRequestsCount });
  });

  // Ticker for API Gateway simulation logs
  setInterval(() => {
    const methods: Array<"POST" | "GET" | "WS_EMIT" | "SSH_EXEC"> = ["GET", "POST", "WS_EMIT", "SSH_EXEC"];
    const routers = [
      { route: "/api/gateway/prom/metrics", adapter: "Prometheus Node Exporter", payload: "{ memoryUsage: '4.2GB', swap: '0.1GB' }" },
      { route: "/api/gateway/pam/audit-report", adapter: "JumpServer PAM", payload: "{ roleEnforced: 'Strategist', logsCaptured: 12 }" },
      { route: "fleet:micro_overclock_offset", adapter: "gRPC Fleet Agency", payload: "{ overclocks: '85%', fans: '3450RPM' }" },
      { route: "/api/gateway/ai/context_synthesis", adapter: "LLM Neural Intel", payload: "{ activeContextTokens: 1450, outputGrounded: true }" }
    ];

    const selectedRoute = routers[Math.floor(Math.random() * routers.length)];
    const randomMethod = methods[Math.floor(Math.random() * methods.length)];
    const delayMs = Math.random() * 3.5 + 0.8;
    const isOk = Math.random() > 0.02 ? 200 : (randomMethod === "WS_EMIT" ? 101 : 500);

    addGatewayLog(randomMethod, selectedRoute.route, selectedRoute.adapter as any, isOk, delayMs, selectedRoute.payload);
  }, 4000);

  // Ticker for Volatile Link session expiration countdown (ticking every 2 seconds for performance & reactivity)
  setInterval(() => {
    let changed = false;
    volatileSessions.forEach(session => {
      if (session.status === "active") {
        if (session.timeRemainingSeconds > 0) {
          session.timeRemainingSeconds = Math.max(0, session.timeRemainingSeconds - 2);
          changed = true;
        } else {
          session.status = "expired";
          changed = true;
          appendLog(`Volatile session ${session.id} for subscriber ${session.subscriberName} expired. Memory key at ${session.ramPath} physically wiped.`, "warning", "Volatile Link");
          
          // Set device to offline
          const dev = devices.find(d => d.id === `volatile-${session.id.toLowerCase()}`);
          if (dev) {
            dev.status = "offline";
            dev.lastActive = "Key expired (RAM reset)";
          }
        }
      }
    });

    if (changed) {
      broadcast("volatile_sessions_update", volatileSessions);
      broadcast("devices_update", devices);
      broadcast("logs_update", logs);
    }
  }, 2000);

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🛡️ FixLab — running full-stack at http://localhost:${PORT}`);
  });
}

startServer();
