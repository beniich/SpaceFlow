/**
 * Service de notifications in-app via Socket.io
 * Pas de web-push : notifications dans le navigateur via WebSocket
 */

// Store in-memory des notifications (en prod: persisté en BDD)
const notificationStore = new Map(); // userId → notifications[]

class PushService {
  constructor() {
    this.io = null;
  }

  init(io) {
    this.io = io;
  }

  /**
   * Envoie une notification à un utilisateur via Socket.io
   */
  async sendToUser(userId, notification) {
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };

    // Persister en mémoire
    if (!notificationStore.has(userId)) notificationStore.set(userId, []);
    const userNotifs = notificationStore.get(userId);
    userNotifs.unshift(notif);
    if (userNotifs.length > 50) userNotifs.pop(); // max 50 par user

    // Émettre via Socket.io
    if (this.io) {
      this.io.emit(`notification:${userId}`, notif);
      this.io.emit('notification:global', { ...notif, userId });
    }

    return notif;
  }

  /**
   * Broadcast à tous les utilisateurs connectés
   */
  async broadcast(notification) {
    const notif = {
      id: `notif_${Date.now()}`,
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };

    if (this.io) this.io.emit('notification:broadcast', notif);
    return notif;
  }

  /**
   * Notifie l'assignation d'un ordre de travail
   */
  async notifyWorkOrderAssigned(workOrder, assigneeId) {
    return this.sendToUser(assigneeId, {
      type: 'WORK_ORDER',
      title: '📋 Nouvel ordre de travail',
      body: workOrder.title,
      priority: workOrder.priority === 'CRITICAL' ? 'URGENT' : 'HIGH',
      data: { workOrderId: workOrder.id }
    });
  }

  /**
   * Alerte stock bas
   */
  async notifyLowInventory(partName, quantity) {
    return this.broadcast({
      type: 'INVENTORY',
      title: '📦 Stock bas',
      body: `${partName} : ${quantity} restant(s)`,
      priority: 'NORMAL'
    });
  }

  /**
   * Alerte actif critique
   */
  async notifyCriticalAsset(asset) {
    return this.broadcast({
      type: 'ASSET',
      title: '⚠️ Actif critique',
      body: `${asset.name} — Santé : ${asset.healthScore}%`,
      priority: 'HIGH',
      data: { assetId: asset.id }
    });
  }

  getForUser(userId) {
    return notificationStore.get(userId) || [];
  }

  markAsRead(userId, notifId) {
    const notifs = notificationStore.get(userId) || [];
    const n = notifs.find((x) => x.id === notifId);
    if (n) n.read = true;
    return n;
  }

  markAllAsRead(userId) {
    const notifs = notificationStore.get(userId) || [];
    notifs.forEach((n) => (n.read = true));
    return notifs;
  }

  getAll() {
    return Array.from(notificationStore.entries()).flatMap(([userId, notifs]) =>
      notifs.map((n) => ({ ...n, userId }))
    );
  }
}

module.exports = new PushService();
