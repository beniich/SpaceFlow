import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';

/**
 * GET /api/auth/me
 * Returns the authenticated user's profile from the database.
 * If the user does not yet exist (first login), it is auto-created.
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const firebaseUser = req.user;

    if (!firebaseUser) {
      throw new AppError('Unauthorized', 401);
    }

    // Upsert: create the user record on first login
    const user = await prisma.user.upsert({
      where: { firebaseUid: firebaseUser.uid },
      update: {
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.name ?? null,
        photoURL: firebaseUser.picture ?? null,
      },
      create: {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.name ?? null,
        photoURL: firebaseUser.picture ?? null,
      },
      include: {
        team: true,
      },
    });

    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/users
 * Admin-only: returns all registered users.
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const firebaseUser = req.user;
    if (!firebaseUser) throw new AppError('Unauthorized', 401);

    // Fetch the requesting user to check their role
    const requestingUser = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
      select: { role: true },
    });

    if (!requestingUser || requestingUser.role !== 'ADMIN') {
      throw new AppError('Forbidden: admin access required', 403);
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { team: { select: { id: true, name: true } } },
    });

    res.status(200).json({ data: users, total: users.length });
  } catch (err) {
    next(err);
  }
};
