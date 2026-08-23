const { WebSocketServer } = require("ws");
const { createServer } = require("node:http");
const { Redis } = require("@upstash/redis");
const { verifyToken } = require("../lib/jwt.js"); // Assurez-vous que lib/jwt.js exporte verifyToken
const { logger } = require("../lib/logger.js");
const Sentry = require("@sentry/node");
const { bimAlertHandler } = require("./bimAlertHandler.js");
const { heatmapStreamHandler } = require("./heatmapStreamHandler.js");
const { metrics } = require("../monitoring/metrics.js");

const HEARTBEAT_INTERVAL = 30_000; // 30s
const HEARTBEAT_TIMEOUT = 60_000; // 2x heartbeat
const MAX_CONNECTIONS_PER_TENANT = 500;

class WebSocketManager {
  constructor() {
    this.wss = null;
    this.redis = null;
    this.httpServer = null;
    this.subscriptions = new Map(); // tenantId:modelId -> Set<WS>
    this.tenantConnections = new Map(); // tenantId -> Set<WS>
    this.heartbeatInterval = null;
    this.channelHandlers = new Map();
  }

  async initialize(httpServer) {
    this.httpServer = httpServer || createServer();
    this.wss = new WebSocketServer({ 
      noServer: true,
      maxPayload: 1024 * 64, // 64KB max par message
    });

    // Connexion Redis Upstash
    this.redis = await this.initRedis();

    // Gestion des upgrades HTTP -> WS
    this.httpServer.on("upgrade", this.handleUpgrade.bind(this));

    // Handlers par channel
    this.registerHandlers();

    // Heartbeat pour détecter connexions mortes
    this.startHeartbeat();

    logger.info("WebSocket server initialized");
    return this;
  }

  async initRedis() {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      logger.warn("No Redis URL, WS running in standalone mode");
      return null;
    }
    
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  handleUpgrade(request, socket, head) {
    const { pathname, searchParams } = new URL(request.url, "http://localhost");
    const token = searchParams.get("token") || 
                  request.headers["sec-websocket-protocol"]?.replace("Bearer.", "") ||
                  this.extractCookie(request);

    // Vérification auth
    const user = verifyToken(token);
    if (!user) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      metrics.wsAuthFailures.inc();
      return;
    }

    this.wss.handleUpgrade(request, socket, head, (ws) => {
      ws.user = user;
      ws.alive = true;
      ws.id = `${user.sub}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
      ws.subscribedChannels = new Set();
      
      this.wss.emit("connection", ws, request, pathname);
    });
  }

  extractCookie(request) {
    const cookies = request.headers.cookie || "";
    const match = cookies.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
  }

  registerHandlers() {
    this.wss.on("connection", (ws, request, pathname) => {
      this.handleConnection(ws, request, pathname);
    });

    // Channel handlers par pattern d'URL
    this.channelHandlers.set("alerts", bimAlertHandler);
    this.channelHandlers.set("heatmap", heatmapStreamHandler);
  }

  handleConnection(ws, request, pathname) {
    const tenantId = ws.user.orgId;
    
    // Limitation connexions par tenant
    const tenantConns = this.tenantConnections.get(tenantId) || new Set();
    if (tenantConns.size >= MAX_CONNECTIONS_PER_TENANT) {
      ws.close(1013, "Tenant connection limit reached");
      metrics.wsRejected.inc({ reason: "limit" });
      return;
    }

    tenantConns.add(ws);
    this.tenantConnections.set(tenantId, tenantConns);
    metrics.wsActiveConnections.set(tenantConns.size);

    // Routing par pathname
    const pathMatch = pathname.match(/^\/ws\/bim\/([^/]+)\/([^/]+)\/?$/);
    if (!pathMatch) {
      // Channel générique (ex: /ws/bim/alerts?modelId=xxx)
      const genericMatch = pathname.match(/^\/ws\/bim\/([^/]+)\/?$/);
      if (!genericMatch) {
        ws.close(1008, "Invalid path");
        return;
      }
    }

    const [, modelId, channelType] = pathMatch || [null, genericMatch?.[1], "generic"];
    
    if (!modelId) {
      ws.close(1008, "Missing modelId");
      return;
    }

    // Vérifier accès tenant au modèle (async mais ne pas bloquer)
    this.verifyModelAccess(ws.user.orgId, modelId)
      .then((hasAccess) => {
        if (!hasAccess) {
          ws.close(1008, "Model access denied");
          metrics.wsRejected.inc({ reason: "access" });
          return;
        }

        this.subscribe(ws, modelId, channelType);
        this.setupMessageHandlers(ws, modelId, channelType);
        this.setupLifecycle(ws);
        
        // Confirmer connexion
        this.send(ws, {
          type: "connected",
          modelId,
          channel: channelType,
          user: { 
            id: ws.user.sub, 
            role: ws.user.role,
            orgId: ws.user.orgId,
          },
          serverTime: new Date().toISOString(),
        });
      })
      .catch((err) => {
        logger.error("Model access check failed", { error: err.message });
        ws.close(1011, "Internal error");
      });
  }

  async verifyModelAccess(tenantId, modelId) {
    // Import dynamique pour éviter circular dep
    const { prisma } = require("../config/database.js");
    const model = await prisma.bIMModel.findFirst({
      where: { id: modelId, tenantId, deletedAt: null },
      select: { id: true },
    });
    return !!model;
  }

  subscribe(ws, modelId, channelType) {
    const subKey = `${ws.user.orgId}:${modelId}`;
    if (!this.subscriptions.has(subKey)) {
      this.subscriptions.set(subKey, new Set());
    }
    this.subscriptions.get(subKey).add(ws);
    ws.subscribedChannels.add(subKey);
    
    // S'abonner au channel Redis pour recevoir les updates
    if (this.redis) {
      this.subscribeToRedisChannel(`bim:${channelType}:${ws.user.orgId}:${modelId}`, ws);
    }

    metrics.wsSubscriptions.inc();
    logger.debug("WS subscribed", { 
      wsId: ws.id, 
      tenantId: ws.user.orgId, 
      modelId, 
      channelType,
    });
  }

  async subscribeToRedisChannel(channel, ws) {
    // Note: Upstash Redis via REST ne supporte pas pubsub directement
    // On utilise BullMQ pour le pubsub via Queue events
    // Alternative : utiliser un Redis classique si déployé en local
  }

  setupMessageHandlers(ws, modelId, channelType) {
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === "ping") {
          ws.alive = true;
          this.send(ws, { type: "pong", timestamp: Date.now() });
          return;
        }

        if (message.type === "subscribe_heatmap_value") {
          // Demander valeurs heatmap initiales
          const initialData = await this.getInitialHeatmap(ws.user.orgId, modelId);
          this.send(ws, { type: "heatmap_initial", values: initialData });
          return;
        }

        // Délégation au channel handler
        const handler = this.channelHandlers.get(channelType);
        if (handler) {
          await handler.handleClientMessage(ws, message, modelId);
        }
      } catch (err) {
        logger.warn("Invalid WS message", { error: err.message });
        this.send(ws, { type: "error", message: "Invalid message format" });
      }
    });

    ws.on("pong", () => { ws.alive = true; });
  }

  setupLifecycle(ws) {
    ws.on("close", () => this.handleDisconnect(ws));
    ws.on("error", (err) => {
      logger.warn("WS error", { wsId: ws.id, error: err.message });
      Sentry.captureException(err, { tags: { component: "websocket" } });
    });
  }

  handleDisconnect(ws) {
    const tenantId = ws.user.orgId;
    
    // Cleanup subscriptions
    for (const channel of ws.subscribedChannels) {
      this.subscriptions.get(channel)?.delete(ws);
    }

    // Cleanup tenant connections
    const tenantConns = this.tenantConnections.get(tenantId);
    if (tenantConns) {
      tenantConns.delete(ws);
      metrics.wsActiveConnections.set(tenantConns.size);
    }

    metrics.wsDisconnects.inc();
    logger.debug("WS disconnected", { wsId: ws.id, tenantId });
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.alive) {
          logger.debug("Terminating dead WS connection", { wsId: ws.id });
          ws.terminate();
          return;
        }
        ws.alive = false;
        try {
          ws.ping();
        } catch (e) {
          ws.terminate();
        }
      });
    }, HEARTBEAT_INTERVAL);
  }

  // ===== PUBLIC API pour broadcaster =====

  broadcast(channel, message, filterFn = null) {
    const messageStr = JSON.stringify(message);
    let count = 0;

    for (const ws of this.wss.clients) {
      if (ws.readyState !== 1) continue; // OPEN
      if (!ws.subscribedChannels.has(channel)) continue;
      if (filterFn && !filterFn(ws)) continue;

      try {
        ws.send(messageStr);
        count++;
      } catch (err) {
        logger.warn("Broadcast send failed", { wsId: ws.id, error: err.message });
      }
    }

    metrics.wsBroadcasts.inc({ channel });
    return count;
  }

  broadcastHeatmapUpdate(tenantId, modelId, values) {
    const subKey = `${tenantId}:${modelId}`;
    return this.broadcast(subKey, {
      type: "heatmap_update",
      modelId,
      values,
      timestamp: Date.now(),
    });
  }

  broadcastAlert(tenantId, modelId, alert) {
    const subKey = `${tenantId}:${modelId}`;
    return this.broadcast(subKey, {
      type: "alert",
      modelId,
      severity: alert.severity,
      title: alert.title,
      alert,
      timestamp: Date.now(),
    });
  }

  async getInitialHeatmap(tenantId, modelId) {
    const { getCurrentHeatmap } = require("../services/iot/heatmap.service.js"); // Mock or real
    return await getCurrentHeatmap(tenantId, modelId);
  }

  send(ws, data) {
    if (ws.readyState !== 1) return false;
    try {
      ws.send(JSON.stringify(data));
      return true;
    } catch (err) {
      logger.warn("WS send failed", { error: err.message });
      return false;
    }
  }

  async shutdown() {
    logger.info("Shutting down WebSocket server");
    
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    
    // Fermer toutes les connexions proprement
    for (const ws of this.wss.clients) {
      this.send(ws, { type: "server_shutdown", message: "Maintenance en cours" });
      ws.close(1001, "Server shutting down");
    }

    await new Promise((resolve) => this.wss.close(resolve));
    
    if (this.redis?.quit) {
      await this.redis.quit();
    }
  }
}

// Singleton
const wsManager = new WebSocketManager();

// Helper export
const initializeWebSocket = async (httpServer) => {
  return await wsManager.initialize(httpServer);
};

const broadcastToBIMChannel = (tenantId, modelId, message) => {
  const subKey = `${tenantId}:${modelId}`;
  return wsManager.broadcast(subKey, message);
};

module.exports = { wsManager, initializeWebSocket, broadcastToBIMChannel };
