import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireTenant } from '../middleware/tenant.middleware';
import { generateInvoicePDF } from '../controllers/pdf.controller';

const router = Router();

router.use(authenticate);
router.use(requireTenant);

router.get('/invoice/:id', generateInvoicePDF);

export default router;
