import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { BookingType, BookingStatus, BookingSource } from '@prisma/client';
import { generateBookingReference } from '../services/reference.service';
import QRCode from 'qrcode';
import emailService from '../services/email.service';
import { emitToOrg } from '../realtime/socket.server';

// ============================================================
// SCHEMAS
// ============================================================
const createBookingSchema = z.object({
  memberId: z.string().uuid(),
  spaceId: z.string().uuid(),
  type: z.nativeEnum(BookingType),
  source: z.nativeEnum(BookingSource).optional().default('WEB'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  attendees: z.number().int().min(1).max(500).optional().default(1),
  notes: z.string().max(2000).optional(),
});

const updateBookingSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  notes: z.string().max(2000).optional(),
  internalNotes: z.string().max(2000).optional(),
  attendees: z.number().int().min(1).optional(),
});

const cancelBookingSchema = z.object({
  reason: z.string().max(500).optional(),
});

// ============================================================
// HELPERS
// ============================================================

async function generateQRCode(bookingId: string): Promise<string> {
  const payload = JSON.stringify({ type: 'BOOKING_CHECKIN', id: bookingId, ts: Date.now() });
  return QRCode.toDataURL(payload);
}

function calculatePricing(space: any, startTime: Date, endTime: Date) {
  const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const days = hours / 8;

  let hourlyRateCents = space.hourlyRateCents || 0;
  let subtotalCents = 0;

  if (days >= 5 && space.weeklyRateCents) {
    subtotalCents = Math.ceil(days / 5) * space.weeklyRateCents;
  } else if (days >= 1 && space.dailyRateCents) {
    subtotalCents = Math.ceil(days) * space.dailyRateCents;
  } else if (hours >= 4 && space.halfDayRateCents) {
    subtotalCents = Math.ceil(hours / 4) * space.halfDayRateCents;
  } else {
    subtotalCents = Math.ceil(hours) * hourlyRateCents;
  }

  const cleaningFeeCents = space.cleaningFeeCents || 0;
  const totalCents = subtotalCents + cleaningFeeCents;

  return { hours, hourlyRateCents, subtotalCents, cleaningFeeCents, totalCents };
}

// ============================================================
// CONTROLLERS
// ============================================================

// GET /bookings
export async function getBookings(req: AuthRequest, res: Response) {
  const {
    page = '1',
    limit = '20',
    status,
    spaceId,
    memberId,
    startDate,
    endDate,
    type,
  } = req.query as Record<string, string>;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where: any = { organizationId: req.user!.organizationId };
  if (status) where.status = status;
  if (spaceId) where.spaceId = spaceId;
  if (memberId) where.memberId = memberId;
  if (type) where.type = type;
  if (startDate || endDate) {
    where.startTime = {};
    if (startDate) where.startTime.gte = new Date(startDate);
    if (endDate) where.startTime.lte = new Date(endDate);
  }

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: { startTime: 'desc' },
      include: {
        space: { select: { id: true, name: true, type: true, floor: true } },
        member: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
      },
    }),
  ]);

  res.json({
    data: bookings,
    meta: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) },
  });
}

// GET /bookings/:id
export async function getBooking(req: AuthRequest, res: Response) {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, organizationId: req.user!.organizationId },
    include: { space: true, member: true },
  });
  if (!booking) throw new AppError('Booking not found', 404);
  res.json(booking);
}

// POST /bookings
export async function createBooking(req: AuthRequest, res: Response) {
  const data = createBookingSchema.parse(req.body);
  const orgId = req.user!.organizationId;

  const space = await prisma.space.findFirst({ where: { id: data.spaceId, organizationId: orgId } });
  if (!space) throw new AppError('Space not found', 404);
  if (space.status !== 'AVAILABLE') throw new AppError('Space is not available', 400);

  const member = await prisma.member.findFirst({ where: { id: data.memberId, organizationId: orgId } });
  if (!member) throw new AppError('Member not found', 404);

  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (startTime >= endTime) throw new AppError('startTime must be before endTime', 400);
  if (startTime < new Date()) throw new AppError('Cannot book in the past', 400);

  const conflict = await prisma.booking.findFirst({
    where: {
      spaceId: data.spaceId,
      status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  });
  if (conflict) throw new AppError('Space is already booked for this time slot', 409);

  const pricing = calculatePricing(space, startTime, endTime);
  const reference = await generateBookingReference(orgId);

  const booking = await prisma.booking.create({
    data: {
      organizationId: orgId,
      reference,
      memberId: data.memberId,
      spaceId: data.spaceId,
      type: data.type,
      source: data.source,
      status: 'CONFIRMED',
      startTime,
      endTime,
      hours: pricing.hours,
      hourlyRateCents: pricing.hourlyRateCents,
      subtotalCents: pricing.subtotalCents,
      cleaningFeeCents: pricing.cleaningFeeCents,
      totalCents: pricing.totalCents,
      attendees: data.attendees,
      notes: data.notes,
    },
  });

  const qrCode = await generateQRCode(booking.id);
  await prisma.booking.update({ where: { id: booking.id }, data: { qrCode } });

  await prisma.member.update({
    where: { id: data.memberId },
    data: { totalBookings: { increment: 1 }, totalSpentCents: { increment: pricing.totalCents } },
  });

  const fullBooking = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: { member: true, space: true },
  });

  if (fullBooking?.member?.email) {
    emailService.sendBookingConfirmation(fullBooking).catch(err => logger.error('Email error:', err));
  }

  emitToOrg(orgId, 'booking:created', {
    id: booking.id,
    reference: booking.reference,
    spaceId: booking.spaceId,
    spaceName: space.name,
    memberName: member.firstName || member.companyName,
    startTime: booking.startTime,
    endTime: booking.endTime,
    totalCents: booking.totalCents
  });

  logger.info(`✅ Booking created: ${reference} (org: ${orgId})`);
  res.status(201).json({ ...booking, qrCode });
}

// PATCH /bookings/:id
export async function updateBooking(req: AuthRequest, res: Response) {
  const data = updateBookingSchema.parse(req.body);
  const existing = await prisma.booking.findFirst({
    where: { id: req.params.id, organizationId: req.user!.organizationId },
  });
  if (!existing) throw new AppError('Booking not found', 404);
  const updated = await prisma.booking.update({ where: { id: req.params.id }, data });
  res.json(updated);
}

// POST /bookings/:id/cancel
export async function cancelBooking(req: AuthRequest, res: Response) {
  const { reason } = cancelBookingSchema.parse(req.body);

  const existing = await prisma.booking.findFirst({
    where: { id: req.params.id, organizationId: req.user!.organizationId },
    include: { member: true, space: true },
  });
  if (!existing) throw new AppError('Booking not found', 404);
  if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(existing.status)) {
    throw new AppError(`Cannot cancel a booking with status ${existing.status}`, 400);
  }

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED', cancelledAt: new Date(), cancelledBy: req.user!.userId, cancelReason: reason },
  });

  await prisma.member.update({
    where: { id: existing.memberId },
    data: { totalBookings: { decrement: 1 }, totalSpentCents: { decrement: existing.totalCents } },
  });

  emailService.sendBookingCancellation(existing).catch(err => logger.error('Email error:', err));

  emitToOrg(req.user!.organizationId, 'booking:cancelled', { id: existing.id, reference: existing.reference });

  res.json({ message: 'Booking cancelled' });
}

// POST /bookings/:id/checkin
export async function checkInBooking(req: AuthRequest, res: Response) {
  const existing = await prisma.booking.findFirst({
    where: { id: req.params.id, organizationId: req.user!.organizationId },
    include: { member: true, space: true },
  });
  if (!existing) throw new AppError('Booking not found', 404);
  if (!['CONFIRMED', 'PENDING'].includes(existing.status)) {
    throw new AppError(`Cannot check-in booking with status ${existing.status}`, 400);
  }

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: 'CHECKED_IN', checkedInAt: new Date(), checkedInBy: req.user!.userId },
    include: { member: true, space: true },
  });

  await prisma.accessLog.create({
    data: {
      organizationId: req.user!.organizationId,
      spaceId: existing.spaceId,
      memberId: existing.memberId,
      bookingId: existing.id,
      accessType: 'MANUAL',
      success: true,
    },
  });

  emailService.sendCheckInConfirmation(updated).catch(err => logger.error('Email error:', err));

  emitToOrg(req.user!.organizationId, 'booking:checked-in', {
    reference: existing.reference,
    memberName: existing.member?.firstName,
    spaceName: existing.space?.name,
  });

  res.json(updated);
}

// POST /bookings/:id/checkout
export async function checkOutBooking(req: AuthRequest, res: Response) {
  const existing = await prisma.booking.findFirst({
    where: { id: req.params.id, organizationId: req.user!.organizationId },
  });
  if (!existing) throw new AppError('Booking not found', 404);
  if (existing.status !== 'CHECKED_IN') throw new AppError('Booking is not checked in', 400);

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: 'COMPLETED', checkedOutAt: new Date() },
  });

  emitToOrg(req.user!.organizationId, 'booking:checkout', { id: updated.id, spaceId: updated.spaceId });

  res.json(updated);
}

// GET /bookings/calendar
export async function getCalendar(req: AuthRequest, res: Response) {
  const { spaceId, start, end } = req.query as Record<string, string>;
  if (!start || !end) throw new AppError('start and end query params are required', 400);

  const where: any = {
    organizationId: req.user!.organizationId,
    status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
    startTime: { gte: new Date(start), lte: new Date(end) },
  };
  if (spaceId) where.spaceId = spaceId;

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      space: { select: { id: true, name: true, type: true } },
      member: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { startTime: 'asc' },
  });

  res.json(bookings);
}

// GET /bookings/availability
export async function checkAvailability(req: AuthRequest, res: Response) {
  const { spaceId, start, end } = req.query as Record<string, string>;
  if (!spaceId || !start || !end) throw new AppError('spaceId, start and end are required', 400);

  const space = await prisma.space.findFirst({
    where: { id: spaceId, organizationId: req.user!.organizationId },
  });
  if (!space) throw new AppError('Space not found', 404);

  const conflict = await prisma.booking.findFirst({
    where: {
      spaceId,
      status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
      AND: [{ startTime: { lt: new Date(end) } }, { endTime: { gt: new Date(start) } }],
    },
  });

  res.json({ available: !conflict, conflict: conflict || null });
}
