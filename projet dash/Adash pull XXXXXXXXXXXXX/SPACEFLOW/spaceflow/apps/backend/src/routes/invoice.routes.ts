import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { requireTenant } from '../middleware/tenant.middleware';
import invoiceService from '../services/invoice.service';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { AppError } from '../middleware/error.middleware';

const router = Router();

router.use(authenticate);
router.use(requireTenant);

// GET /api/invoices
router.get('/', async (req: any, res) => {
  try {
    const { status, memberId, page, limit } = req.query;
    const result = await invoiceService.list(req.user.organizationId, {
      status: status as string | undefined,
      memberId: memberId as string | undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    res.json(result);
  } catch (err) {
    logger.error('List invoices error:', err);
    res.status(500).json({ error: 'Failed to list invoices' });
  }
});

// GET /api/invoices/stats
router.get('/stats', async (req: any, res) => {
  try {
    const stats = await invoiceService.getStats(req.user.organizationId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// GET /api/invoices/:id
router.get('/:id', async (req: any, res) => {
  try {
    const invoice = await invoiceService.get(req.params.id, req.user.organizationId);
    res.json(invoice);
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json({ error: err.message });
    res.status(500).json({ error: 'Failed to get invoice' });
  }
});

// POST /api/invoices
router.post('/', async (req: any, res) => {
  try {
    const { memberId, items, dueDate, notes, type } = req.body;
    if (!memberId || !items?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const invoice = await invoiceService.create({
      organizationId: req.user.organizationId,
      memberId,
      type,
      items,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      notes
    });
    res.status(201).json(invoice);
  } catch (err) {
    logger.error('Create invoice error:', err);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// POST /api/invoices/:id/mark-paid
router.post('/:id/mark-paid', async (req: any, res) => {
  try {
    const invoice = await invoiceService.markAsPaid(req.params.id, req.user.organizationId);
    res.json(invoice);
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json({ error: err.message });
    res.status(500).json({ error: 'Failed to mark invoice paid' });
  }
});

// DELETE /api/invoices/:id — soft delete (void)
router.delete('/:id', async (req: any, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, organizationId: req.user.organizationId }
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    await prisma.invoice.update({ where: { id: req.params.id }, data: { status: 'void' } });
    res.json({ message: 'Invoice cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel invoice' });
  }
});

export default router;
