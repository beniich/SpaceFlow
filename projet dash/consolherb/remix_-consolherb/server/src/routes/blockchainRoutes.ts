import { Router, Request, Response, NextFunction } from 'express';
import { BlockchainService } from '../services/blockchainService';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Secure all traceability endpoints
router.use(authMiddleware);

// Retrieve full chain history
router.get('/batches', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batches = await BlockchainService.getTraces();
    res.json(batches);
  } catch (err) {
    next(err);
  }
});

// Record a new step in the blockchain ledger
router.post('/record', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { batchId, cropName, action, operator, location } = req.body;
    if (!batchId || !cropName || !action || !operator || !location) {
      res.status(400).json({ error: 'Missing required parameters: batchId, cropName, action, operator, location' });
      return;
    }
    const block = await BlockchainService.recordTrace({
      batchId,
      cropName,
      action,
      operator,
      location,
    });
    res.status(201).json(block);
  } catch (err) {
    next(err);
  }
});

// Verify cryptographic integrity of the ledger
router.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await BlockchainService.verifyChain();
    res.json(report);
  } catch (err) {
    next(err);
  }
});

export default router;
