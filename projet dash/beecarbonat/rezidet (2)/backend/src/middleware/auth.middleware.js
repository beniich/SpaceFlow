const { verifyFirebaseToken } = require('../services/firebase-admin.service');
const prisma = require('../config/database');

const authMiddleware = async (req, res, next) => {
  let idToken;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    idToken = authHeader.split('Bearer ')[1];
  } else if (req.cookies && req.cookies.token) {
    idToken = req.cookies.token;
  }

  if (!idToken) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    // 1. Vérifie le token (Firebase ou JWT local)
    let decoded;
    try {
      decoded = await verifyFirebaseToken(idToken);
    } catch (e) {
      // Fallback au JWT local
      const jwt = require('jsonwebtoken');
      decoded = jwt.verify(idToken, process.env.JWT_SECRET || 'secret-jwt-cafm-pro-key');
    }

    // 2. Récupère le rôle réel depuis Prisma (source unique de vérité)
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { id: true, role: true, email: true }
    });

    if (!user) {
      return res.status(403).json({ error: 'Utilisateur non provisionné' });
    }

    req.user = user; // { id, role, email } — vient de Prisma, jamais de Firebase
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès refusé pour ce rôle' });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
