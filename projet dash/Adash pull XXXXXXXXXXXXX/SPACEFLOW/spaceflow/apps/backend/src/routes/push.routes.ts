import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

const router = Router();

router.use(authenticate);

router.post('/subscribe', async (req: any, res) => {
  try {
    const { endpoint, keys } = req.body;
    
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }

    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        pushSubscription: {
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth
        }
      }
    });

    res.json({ success: true });
  } catch (err) {
    logger.error('Push subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

router.post('/unsubscribe', async (req: any, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { pushSubscription: null as any }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;
