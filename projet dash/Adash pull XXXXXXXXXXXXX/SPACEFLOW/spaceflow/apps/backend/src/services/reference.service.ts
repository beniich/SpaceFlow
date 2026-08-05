import { prisma } from '../config/database';

/**
 * Génère une référence unique pour une réservation
 * Format: BK-YYYY-XXXX (ex: BK-2025-0042)
 */
export async function generateBookingReference(organizationId: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `BK-${year}-`;

  // Count existing bookings for this org this year to generate sequence
  const count = await prisma.booking.count({
    where: {
      organizationId,
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00Z`),
      },
    },
  });

  const seq = String(count + 1).padStart(4, '0');
  const candidate = `${prefix}${seq}`;

  // Ensure uniqueness (very edge case with concurrent requests)
  const existing = await prisma.booking.findUnique({ where: { reference: candidate } });
  if (existing) {
    return `${prefix}${String(count + 2).padStart(4, '0')}`;
  }

  return candidate;
}
