import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

// ─── Custom application error ─────────────────────────────────────────────────
export class AppError extends Error {
  public readonly status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

// ─── Global error handler (must have 4 params for Express to recognise it) ────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log full stack in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ErrorHandler]', err);
  }

  // ── Known: custom AppError ────────────────────────────────────────────────
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message, status: err.status });
    return;
  }

  // ── Known: Prisma errors ──────────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = Unique constraint violation
    if (err.code === 'P2002') {
      res.status(409).json({
        error: `Conflict: a record with that value already exists (${err.meta?.target})`,
        status: 409,
      });
      return;
    }
    // P2025 = Record not found
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Not found: the requested record does not exist', status: 404 });
      return;
    }
    res.status(400).json({ error: `Database error: ${err.message}`, status: 400 });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ error: 'Invalid data provided to the database', status: 400 });
    return;
  }

  // ── Known: Firebase errors ────────────────────────────────────────────────
  if (err instanceof Error && err.message.includes('Firebase')) {
    res.status(401).json({ error: err.message, status: 401 });
    return;
  }

  // ── Generic Error ─────────────────────────────────────────────────────────
  if (err instanceof Error) {
    res.status(500).json({ error: err.message || 'Internal server error', status: 500 });
    return;
  }

  // ── Totally unknown ───────────────────────────────────────────────────────
  res.status(500).json({ error: 'An unexpected error occurred', status: 500 });
};

export default errorHandler;
