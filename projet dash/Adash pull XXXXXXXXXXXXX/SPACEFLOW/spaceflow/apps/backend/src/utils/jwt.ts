import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';

export interface JWTPayload {
  userId: string;
  organizationId: string;
  role: string;
  email: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch (err) {
    logger.error('JWT verify error:', err);
    throw new Error('Invalid token');
  }
};