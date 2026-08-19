const prisma = require('../config/database');
const pushService = require('../services/push.service');

exports.subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: 'Données d\'abonnement invalides' });
    }

    const { endpoint, keys } = subscription;
    const sub = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, active: true },
      create: {
        userId: req.user?.id || 'mock-123',
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: req.headers['user-agent']
      }
    });

    res.status(201).json(sub);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user?.id || 'mock-123' },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true, readAt: new Date() }
    });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user?.id || 'mock-123';
    let pref = await prisma.notificationPreference.findUnique({
      where: { userId }
    });

    if (!pref) {
      pref = await prisma.notificationPreference.create({
        data: { userId }
      });
    }

    res.json(pref);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user?.id || 'mock-123';
    const pref = await prisma.notificationPreference.upsert({
      where: { userId },
      update: req.body,
      create: { userId, ...req.body }
    });
    res.json(pref);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
