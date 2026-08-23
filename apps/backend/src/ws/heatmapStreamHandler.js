const { logger } = require("../lib/logger.js");
const { wsManager } = require("./websocketServer.js");
const { metrics } = require("../monitoring/metrics.js");

const VALID_TYPES = ["request_snapshot", "subscribe_changes", "set_quality"];

const heatmapStreamHandler = {
  async handleClientMessage(ws, message, modelId) {
    const { type } = message;
    
    if (!VALID_TYPES.includes(type)) {
      wsManager.send(ws, { type: "error", message: `Unknown heatmap action: ${type}` });
      return;
    }

    switch (type) {
      case "request_snapshot":
        await this.sendSnapshot(ws, modelId, message);
        break;
      case "subscribe_changes":
        ws.metadata = { ...ws.metadata, watchingChanges: true };
        wsManager.send(ws, { type: "subscribed_changes", modelId });
        break;
      case "set_quality":
        await this.setQuality(ws, message, modelId);
        break;
    }
  },

  async sendSnapshot(ws, modelId, message) {
    const { guid } = message;
    const { getCurrentHeatmap } = require("../services/iot/heatmap.service.js"); // Mock
    const data = await getCurrentHeatmap(ws.user.orgId, modelId);

    wsManager.send(ws, {
      type: "heatmap_snapshot",
      modelId,
      guid,
      value: data.values?.[guid] ?? null,
      meta: data.meta,
      thresholds: data.thresholds,
      generatedAt: data.generatedAt,
    });
  },

  async setQuality(ws, message, modelId) {
    const { quality, refreshRate } = message;
    
    // Valider la qualité
    if (!["low", "normal", "high"].includes(quality)) {
      wsManager.send(ws, { type: "error", message: "Invalid quality" });
      return;
    }

    ws.metadata = {
      ...ws.metadata,
      quality: quality,
      refreshRate: Math.min(Math.max(parseInt(refreshRate) || 30, 5), 300),
    };

    wsManager.send(ws, { 
      type: "quality_updated", 
      quality, 
      refreshRate: ws.metadata.refreshRate,
    });

    metrics.heatmapQuality.inc({ quality });
  },
};

module.exports = { heatmapStreamHandler };
