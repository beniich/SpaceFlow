const prisma = require('../config/database');
const pushService = require('../services/push.service');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = pushService.getForUser(userId);
    const unreadCount = notifications.filter((n) => !n.read).length;
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notif = pushService.markAsRead(req.user.id, req.params.id);
    if (!notif) return res.status(404).json({ error: 'Notification non trouvée' });
    res.json(notif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const notifs = pushService.markAllAsRead(req.user.id);
    res.json({ updated: notifs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendTest = async (req, res) => {
  try {
    const notif = await pushService.sendToUser(req.user.id, {
      type: 'TEST',
      title: '🧪 Notification test',
      body: `Envoyée le ${new Date().toLocaleTimeString('fr-FR')}`,
      priority: 'NORMAL'
    });
    res.status(201).json(notif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.broadcast = async (req, res) => {
  try {
    const { title, body, type = 'INFO', priority = 'NORMAL' } = req.body;
    const notif = await pushService.broadcast({ title, body, type, priority });
    res.status(201).json(notif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
