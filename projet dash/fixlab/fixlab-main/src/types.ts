/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Device {
  id: string;
  name: string;
  ip: string;
  os: "Linux" | "Windows" | "macOS" | "SovereignOS";
  status: "online" | "warning" | "offline";
  cpu: number; // percentage
  ram: number; // percentage
  storage: number; // percentage
  bandwidth: number; // MB/s
  uptime: string;
  lastActive: string;
  group: string;
  location: string;
  policyCompliance: number; // percentage
  serialNumber: string;
  kernelVersion: string;
}

export interface MetricPoint {
  time: string;
  cpu: number;
  ram: number;
  bandwidth: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  source: string;
  level: "info" | "warning" | "critical" | "success";
  message: string;
  deviceId?: string;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  category: "Access" | "Network" | "Storage" | "Authentication";
  description: string;
  enabled: boolean;
  severity: "low" | "medium" | "high" | "critical";
  lastEnforced: string;
}

export interface GroupFolder {
  id: string;
  name: string;
  deviceCount: number;
  healthScore: number; // 0-100%
  activeThreats: number;
  category: "Production" | "Core Infrastructure" | "Edge Relays" | "Testing Operations";
}

export interface SoftwarePackage {
  id: string;
  name: string;
  version: string;
  latestVersion: string;
  status: "up_to_date" | "update_available" | "vulnerable" | "unsupported";
  installedOn: number; // count
  severity?: "low" | "medium" | "high" | "critical";
  cveId?: string;
}

export interface PredictiveFailure {
  id: string;
  deviceId: string;
  deviceName: string;
  component: "Cooling Fan" | "Solid State Drive" | "Primary RAM Node" | "CPU Thermal Junction" | "Battery Cell Pack";
  currentTemp: number;
  probability: number; // 0-100%
  timeToFailure: string; // duration estimate (e.g. "48 hours")
  urgency: "low" | "medium" | "high" | "critical";
  riskDescription: string;
}

export interface AutoNode {
  id: string;
  type: "trigger" | "condition" | "action";
  label: string;
  config: string;
  x: number;
  y: number;
}

export interface AutoEdge {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface DNSRecord {
  id: string;
  domain: string;
  type: "A" | "AAAA" | "CNAME" | "TXT" | "MX";
  value: string;
  ttl: number;
  status: "active" | "inactive" | "intercepted";
  systemManaged?: boolean;
}

export interface DNSQueryLog {
  id: string;
  timestamp: string;
  domain: string;
  clientIp: string;
  clientName: string;
  type: string;
  status: "resolved" | "blocked" | "forwarded";
  resolvedValue: string;
}

export interface SovereignSettings {
  coreIdentity: number;
  cognitiveLoad: number;
  hapticResonance: number;
  energyProfile: number;
  dataSynthesis: string;
}

export interface GatewayLog {
  id: string;
  timestamp: string;
  method: "POST" | "GET" | "WS_EMIT" | "SSH_EXEC";
  route: string;
  adapter: "JumpServer PAM" | "gRPC Fleet Agency" | "LLM Neural Intel" | "Prometheus Node Exporter";
  status: number;
  delay: string;
  payload: string;
}

export interface ComplianceControl {
  id: string;
  standard: "SOC2" | "ISO27001";
  code: string;
  name: string;
  description: string;
  status: "verified" | "drift" | "broken";
  lastChecked: string;
  evidenceType: "JumpServer Logs" | "Access Policy" | "Network Whitelist" | "Software Vulnerability Scan" | "TLS DNS Setup" | "Prometheus SLA Metrics";
  evidenceSnapshot: string;
  linkedPolicyId?: string;
}

export interface ComplianceDomain {
  id: string;
  name: string;
  score: number;
  status: "optimal" | "warning" | "critical";
  controlsCount: number;
  verifiedCount: number;
}

export interface ApplianceConfig {
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

export interface EnrollmentRequest {
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

export interface VolatileSession {
  id: string;
  subscriberName: string;
  token: string;
  status: "active" | "expired";
  ramPath: string; // e.g. /dev/shm/nexus_session_X.key
  ipAddress: string;
  roleAssigned: string;
  establishedTime: string;
  timeRemainingSeconds: number; // TTL representation
  totalTtlSeconds: number;
}

export interface GoogleAdminProfile {
  email: string;
  name: string;
  avatarUrl: string;
  isAuthenticated: boolean;
  tokenJwt?: string;
}



