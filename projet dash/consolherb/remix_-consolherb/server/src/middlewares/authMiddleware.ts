import { Request, Response, NextFunction } from 'express';
import admin from '../utils/firebaseAdmin';
import { firebaseAuth } from '../utils/firebaseAdmin';

// ─── Extend Express Request to carry the decoded Firebase token ───────────────
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

/**
 * authMiddleware
 *
 * Reads the `Authorization: Bearer <token>` header, verifies the Firebase
 * ID token, and attaches the decoded payload to `req.user`.
 *
 * Responds with 401 if the header is missing or the token is invalid/expired.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: no token provided', status: 401 });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1].trim();

  if (!idToken) {
    res.status(401).json({ error: 'Unauthorized: empty token', status: 401 });
    return;
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Token verification failed';
    res.status(401).json({ error: `Unauthorized: ${message}`, status: 401 });
  }
};

export default authMiddleware;
