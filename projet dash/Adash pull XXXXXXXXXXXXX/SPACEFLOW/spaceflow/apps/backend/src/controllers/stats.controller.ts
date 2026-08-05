import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

// ============================================================
// KPIs
// ============================================================
export async function getKPIs(req: AuthRequest, res: Response) {
  const orgId = req.user!.organizationId;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    spacesTotal, spacesActive,
    membersTotal, membersActive,
    bookingsThisMonth, bookingsToday, bookingsCurrentlyActive,
    revenueThisMonth, avgBooking,
  ] = await Promise.all([
    prisma.space.count({ where: { organizationId: orgId } }),
    prisma.space.count({ where: { organizationId: orgId, status: 'AVAILABLE' } }),
    prisma.member.count({ where: { organizationId: orgId } }),
    prisma.member.count({ where: { organizationId: orgId, status: 'ACTIVE' } }),
    prisma.booking.count({ where: { organizationId: orgId, createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } } }),
    prisma.booking.count({ where: { organizationId: orgId, createdAt: { gte: startOfDay }, status: { not: 'CANCELLED' } } }),
    prisma.booking.count({ where: { organizationId: orgId, status: 'CHECKED_IN' } }),
    prisma.booking.aggregate({
      where: { organizationId: orgId, createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
      _sum: { totalCents: true },
    }),
    prisma.booking.aggregate({
      where: { organizationId: orgId, status: { not: 'CANCELLED' } },
      _avg: { totalCents: true },
    }),
  ]);

  res.json({
    spaces: { total: spacesTotal, active: spacesActive },
    members: { total: membersTotal, active: membersActive },
    bookings: { thisMonth: bookingsThisMonth, today: bookingsToday, currentlyActive: bookingsCurrentlyActive },
    revenue: {
      thisMonthCents: revenueThisMonth._sum.totalCents || 0,
      avgBookingCents: Math.round(avgBooking._avg.totalCents || 0),
    },
  });
}

// ============================================================
// Revenue Chart
// ============================================================
export async function getRevenueChart(req: AuthRequest, res: Response) {
  const orgId = req.user!.organizationId;
  const months = Math.min(12, parseInt((req.query.months as string) || '6'));

  const result = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

    const agg = await prisma.booking.aggregate({
      where: { organizationId: orgId, createdAt: { gte: start, lte: end }, status: { not: 'CANCELLED' } },
      _sum: { totalCents: true },
      _count: { id: true },
    });

    result.push({
      month: start.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      revenue: (agg._sum.totalCents || 0) / 100,
      bookings: agg._count.id,
    });
  }

  res.json(result);
}

// ============================================================
// Top Spaces
// ============================================================
export async function getTopSpaces(req: AuthRequest, res: Response) {
  const orgId = req.user!.organizationId;
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const bookings = await prisma.booking.findMany({
    where: { organizationId: orgId, createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
    select: { spaceId: true, totalCents: true, space: { select: { id: true, name: true, type: true, coverPhoto: true } } },
  });

  const map: Record<string, any> = {};
  for (const b of bookings) {
    if (!map[b.spaceId]) {
      map[b.spaceId] = { space: b.space, bookings: 0, revenue: 0 };
    }
    map[b.spaceId].bookings += 1;
    map[b.spaceId].revenue += b.totalCents / 100;
  }

  const sorted = Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  res.json(sorted);
}

// ============================================================
// Activity Feed
// ============================================================
export async function getActivityFeed(req: AuthRequest, res: Response) {
  const orgId = req.user!.organizationId;
  const limit = parseInt((req.query.limit as string) || '20');

  const bookings = await prisma.booking.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true, reference: true, status: true, createdAt: true,
      member: { select: { firstName: true, lastName: true, avatar: true } },
      space: { select: { name: true } },
    },
  });

  const activities = bookings.map(b => ({
    id: b.id,
    type: 'BOOKING_CREATED',
    description: `Réservation ${b.reference} — ${b.space?.name}`,
    createdAt: b.createdAt,
    status: b.status,
    member: b.member,
    space: b.space,
  }));

  res.json(activities);
}

// Alias routes
export { getKPIs as getStats };
