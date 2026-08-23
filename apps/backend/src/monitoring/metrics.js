/**
 * Wrapper Prometheus-compatible pour métriques custom
 * Utilise prom-client en interne (compatible Grafana)
 */
const client = require("prom-client");
const { logger } = require("../lib/logger.js");

const register = new client.Registry();

client.collectDefaultMetrics({ 
  register,
  prefix: "beecarbonit_",
});

// ===== WebSocket Metrics =====
const wsActiveConnections = new client.Gauge({
  name: "beecarbonit_ws_active_connections",
  help: "Active WebSocket connections per tenant",
  labelNames: ["tenant_id"],
  registers: [register],
});

const wsConnectionsTotal = new client.Counter({
  name: "beecarbonit_ws_connections_total",
  help: "Total WebSocket connections since start",
  registers: [register],
});

const wsDisconnects = new client.Counter({
  name: "beecarbonit_ws_disconnects_total",
  help: "Total WebSocket disconnects",
  registers: [register],
});

const wsBroadcasts = new client.Counter({
  name: "beecarbonit_ws_broadcasts_total",
  help: "Total broadcast messages sent",
  labelNames: ["channel"],
  registers: [register],
});

const wsAuthFailures = new client.Counter({
  name: "beecarbonit_ws_auth_failures_total",
  help: "WS authentication failures",
  registers: [register],
});

const wsRejected = new client.Counter({
  name: "beecarbonit_ws_rejected_total",
  help: "WS rejected connections by reason",
  labelNames: ["reason"],
  registers: [register],
});

const wsSubscriptions = new client.Counter({
  name: "beecarbonit_ws_subscriptions_total",
  help: "WS channel subscriptions",
  registers: [register],
});

// ===== BIM/Heatmap Metrics =====
const bimExtractionDuration = new client.Histogram({
  name: "beecarbonit_bim_extraction_duration_seconds",
  help: "IFC extraction duration",
  buckets: [1, 5, 10, 30, 60, 120, 300, 600],
  labelNames: ["model_type"],
  registers: [register],
});

const bimElementsExtracted = new client.Counter({
  name: "beecarbonit_bim_elements_extracted_total",
  help: "Total IFC elements extracted",
  registers: [register],
});

const heatmapRequests = new client.Counter({
  name: "beecarbonit_heatmap_requests_total",
  help: "Heatmap computation requests",
  registers: [register],
});

const heatmapCacheHits = new client.Counter({
  name: "beecarbonit_heatmap_cache_hits_total",
  help: "Heatmap cache hits",
  registers: [register],
});

const heatmapQuality = new client.Counter({
  name: "beecarbonit_heatmap_quality_total",
  help: "Heatmap quality requests",
  labelNames: ["quality"],
  registers: [register],
});

// ===== Alerts Metrics =====
const alertsEmitted = new client.Counter({
  name: "beecarbonit_alerts_emitted_total",
  help: "Alerts emitted by severity",
  labelNames: ["severity"],
  registers: [register],
});

const alertThresholdsSet = new client.Counter({
  name: "beecarbonit_alert_thresholds_set_total",
  help: "Alert thresholds updated",
  registers: [register],
});

// ===== Demo Anonymization Metrics =====
const demoAccess = new client.Counter({
  name: "beecarbonit_demo_access_total",
  help: "Demo access events (RGPD audit)",
  labelNames: ["tenant_id"],
  registers: [register],
});

const gdprAnonymizations = new client.Counter({
  name: "beecarbonit_gdpr_anonymizations_total",
  help: "Total anonymizations performed",
  registers: [register],
});

// ===== API globale =====
async function getMetrics(req, res) {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
}

const metrics = {
  wsActiveConnections,
  wsConnectionsTotal,
  wsDisconnects,
  wsBroadcasts,
  wsAuthFailures,
  wsRejected,
  wsSubscriptions,
  bimExtractionDuration,
  bimElementsExtracted,
  heatmapRequests,
  heatmapCacheHits,
  heatmapQuality,
  alertsEmitted,
  alertThresholdsSet,
  demoAccess,
  gdprAnonymizations,
};

// Health check
async function getHealth() {
  const checks = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    metrics: {
      registered: register.getMetricsAsArray().length,
    },
  };
  return checks;
}

logger.info(`Metrics registered: ${register.getMetricsAsArray().length} collectors`);

module.exports = { getMetrics, metrics, register, getHealth };
