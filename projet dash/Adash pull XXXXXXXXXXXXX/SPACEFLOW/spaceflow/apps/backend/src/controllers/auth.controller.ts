import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { firebaseAdmin } from '../config/firebase';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// ============== SCHEMAS ==============
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organizationName: z.string().min(1),
  organizationType: z.enum(['OPERATOR', 'NETWORK', 'INDEPENDENT']).default('OPERATOR')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const firebaseLoginSchema = z.object({
  idToken: z.string(),
  organizationName: z.string().optional()
});

const refreshSchema = z.object({
  refreshToken: z.string()
});

// ============== HELPERS ==============
const generateUniqueSlug = (name: string): string => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 40);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomSuffix}`;
};

// ============== CONTROLLERS ==============

/**
 * POST /api/auth/register
 * Inscription classique email/password
 */
export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    // Vérifier si email existe déjà
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (existing) {
      throw new AppError('Email already registered', 400);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Créer org + user en transaction
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug: generateUniqueSlug(data.organizationName),
          type: data.organizationType,
          email: data.email,
          plan: 'FREE',
          maxSpaces: 1,
          maxMembers: 50,
          maxUsers: 3
        }
      });

      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'ORG_OWNER',
          organizationId: organization.id
        }
      });

      return { organization, user };
    });

    // Générer tokens
    const tokenPayload = {
      userId: result.user.id,
      organizationId: result.organization.id,
      role: result.user.role,
      email: result.user.email
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    logger.info(`✅ New user registered: ${data.email}`);

    res.status(201).json({
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        organization: {
          id: result.organization.id,
          name: result.organization.name,
          slug: result.organization.slug
        }
      },
      token,
      refreshToken
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: err.errors 
      });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    logger.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * POST /api/auth/login
 * Connexion email/password
 */
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { organization: true }
    });

    if (!user || !user.password) {
      throw new AppError('Invalid credentials', 401);
    }

    // Vérifier password
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account disabled', 403);
    }

    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Tokens
    const tokenPayload = {
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      email: user.email
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    logger.info(`✅ User logged in: ${user.email}`);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
          plan: user.organization.plan
        }
      },
      token,
      refreshToken
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    logger.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * POST /api/auth/firebase
 * Login via Firebase (Google, Apple, etc.)
 */
export const firebaseLogin = async (req: Request, res: Response) => {
  try {
    if (!firebaseAdmin) {
      throw new AppError('Firebase not configured', 500);
    }

    const { idToken, organizationName } = firebaseLoginSchema.parse(req.body);

    // Vérifier le token Firebase
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { email, name, uid, picture } = decoded;

    if (!email) {
      throw new AppError('Email required from Firebase', 400);
    }

    // Chercher ou créer user
    let user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user) {
      // Créer nouvel user + organization
      const [firstName, ...lastNameParts] = (name || email.split('@')[0]).split(' ');
      const lastName = lastNameParts.join(' ') || 'User';

      const orgName = organizationName || `${firstName}'s Workspace`;

      const result = await prisma.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            name: orgName,
            slug: generateUniqueSlug(orgName),
            type: 'OPERATOR',
            email,
            plan: 'FREE',
            maxSpaces: 1,
            maxMembers: 50,
            maxUsers: 3
          }
        });

        const newUser = await tx.user.create({
          data: {
            email,
            firebaseUid: uid,
            firstName,
            lastName,
            avatar: picture,
            role: 'ORG_OWNER',
            emailVerified: true,
            organizationId: org.id
          }
        });

        return { user: newUser, organization: org };
      });

      user = await prisma.user.findUnique({
        where: { id: result.user.id },
        include: { organization: true }
      });

      logger.info(`✅ New Firebase user: ${email}`);
    } else {
      logger.info(`✅ Firebase user login: ${email}`);
    }

    if (!user) {
      throw new AppError('User creation failed', 500);
    }

    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Tokens
    const tokenPayload = {
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      email: user.email
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
          plan: user.organization.plan
        }
      },
      token,
      refreshToken
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    logger.error('Firebase login error:', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * POST /api/auth/refresh
 * Rafraîchir le token
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const decoded = verifyToken(refreshToken);

    // Vérifier que l'user existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid user', 401);
    }

    const tokenPayload = {
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      email: user.email
    };

    const newToken = generateToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

/**
 * GET /api/auth/me
 * Récupérer l'utilisateur courant
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            logoUrl: true,
            primaryColor: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization
      }
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to get user' });
  }
};

/**
 * POST /api/auth/logout
 * Logout (côté client principalement)
 */
export const logout = async (req: AuthRequest, res: Response) => {
  // En JWT, le logout se fait côté client (suppression du token)
  // On peut logger l'action
  if (req.user) {
    logger.info(`User logged out: ${req.user.email}`);
  }
  res.json({ message: 'Logged out' });
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // TODO: Envoyer email de reset
    // Pour l'instant, juste logger
    logger.info(`Password reset requested for: ${email}`);

    // Toujours retourner 200 (sécurité)
    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process request' });
  }
};