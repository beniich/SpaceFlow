import rateLimit from 'express-rate-limit';
import { redis } from '../config/redis';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes' }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Trop de tentatives de connexion' }
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 3,
  message: { error: 'Limite d\'inscription atteinte' }
});