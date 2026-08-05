import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { requireTenant } from '../middleware/tenant.middleware';
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  checkInBooking,
  checkOutBooking,
  getCalendar,
  checkAvailability,
} from '../controllers/booking.controller';

const router = Router();

router.use(authenticate, requireTenant);

router.get('/', asyncHandler(getBookings));
router.get('/calendar', asyncHandler(getCalendar));
router.get('/availability', asyncHandler(checkAvailability));
router.get('/:id', asyncHandler(getBooking));
router.post('/', asyncHandler(createBooking));
router.patch('/:id', asyncHandler(updateBooking));
router.post('/:id/cancel', asyncHandler(cancelBooking));
router.post('/:id/checkin', asyncHandler(checkInBooking));
router.post('/:id/checkout', asyncHandler(checkOutBooking));

export default router;
