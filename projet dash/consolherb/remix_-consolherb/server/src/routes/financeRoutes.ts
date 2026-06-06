import { Router, Request, Response, NextFunction } from 'express';
import { FinanceService } from '../services/financeService';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Secure all finance endpoints
router.use(authMiddleware);

// Get all transaction logs (income/expense)
router.get('/records', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await FinanceService.getRecords();
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// Add a transaction manually
router.post('/records', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cropName, amount, type, category, description } = req.body;
    if (!cropName || !amount || !type || !category) {
      res.status(400).json({ error: 'Missing required parameters: cropName, amount, type, category' });
      return;
    }
    const record = await FinanceService.createRecord({
      cropName,
      amount: Number(amount),
      type,
      category,
      description,
    });
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
});

// Record a new product sale
router.post('/sales', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cropName, quantity, unitPrice, buyer } = req.body;
    if (!cropName || !quantity || !unitPrice) {
      res.status(400).json({ error: 'Missing required parameters: cropName, quantity, unitPrice' });
      return;
    }
    const sale = await FinanceService.recordSale({
      cropName,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      buyer,
    });
    res.status(201).json(sale);
  } catch (err) {
    next(err);
  }
});

// Get aggregated ROI calculations
router.get('/roi', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roi = await FinanceService.calculateROI();
    res.json(roi);
  } catch (err) {
    next(err);
  }
});

export default router;
