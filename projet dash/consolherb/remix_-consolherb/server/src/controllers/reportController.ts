import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';

/**
 * GET /api/reports
 * Returns all reports ordered by newest first.
 */
export const getAllReports = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { id: true, displayName: true, email: true } },
      },
    });

    res.status(200).json({ data: reports, total: reports.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/:id
 * Returns a single report by its id.
 */
export const getReportById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, displayName: true, email: true } },
      },
    });

    if (!report) throw new AppError(`Report with id "${id}" not found`, 404);

    res.status(200).json({ data: report });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/reports
 * Creates a new report. The author is derived from the authenticated user.
 * Body: { title: string, type: string, content: object }
 */
export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const firebaseUser = req.user;
    if (!firebaseUser) throw new AppError('Unauthorized', 401);

    const { title, type, content } = req.body as {
      title?: string;
      type?: string;
      content?: Prisma.InputJsonValue;
    };

    if (!title || !type || content === undefined) {
      throw new AppError('Missing required fields: title, type, content', 400);
    }

    // Resolve the DB user from the firebase uid
    const dbUser = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
    });
    if (!dbUser) {
      throw new AppError(
        'User profile not found. Call GET /api/auth/me first to create your profile.',
        404
      );
    }

    const report = await prisma.report.create({
      data: {
        title,
        type,
        content,
        createdById: dbUser.id,
      },
      include: {
        createdBy: { select: { id: true, displayName: true, email: true } },
      },
    });

    res.status(201).json({ data: report });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/reports/:id
 * Deletes a report. Admin role required.
 */
export const deleteReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const firebaseUser = req.user;
    if (!firebaseUser) throw new AppError('Unauthorized', 401);

    const { id } = req.params;

    // Resolve DB user and check role
    const dbUser = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== 'ADMIN') {
      throw new AppError('Forbidden: admin access required', 403);
    }

    // Verify the report exists before deleting
    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) throw new AppError(`Report with id "${id}" not found`, 404);

    await prisma.report.delete({ where: { id } });

    res.status(200).json({ message: `Report "${id}" deleted successfully` });
  } catch (err) {
    next(err);
  }
};
