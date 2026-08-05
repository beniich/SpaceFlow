import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}

export const errorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log l'erreur
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode
  });

  // Réponse
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } else {
    // Erreur inconnue - ne pas leak les détails
    logger.error('💥 UNKNOWN ERROR:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
};