const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification JWT
 * SOC2: CC6 — Contrôle d'accès
 * ISO 27001: A.9.4.2
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant ou format invalide' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expirée. Reconnectez-vous.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token invalide', code: 'TOKEN_INVALID' });
  }
};

/**
 * Middleware de contrôle des rôles (RBAC)
 * SOC2: CC6 — Accès au principe du moindre privilège
 * ISO 27001: A.9.2.3
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    if (!roles.includes(req.user.role)) {
      // Log de l'accès refusé (SOC2 CC7 / ISO 27001 A.12.4.3)
      console.warn(`[SECURITY] Accès refusé — User: ${req.user.id} | Role: ${req.user.role} | Required: ${roles.join(',')} | Path: ${req.path}`);
      return res.status(403).json({ error: 'Accès refusé — Permissions insuffisantes' });
    }
    next();
  };
};

/**
 * Middleware de logging des événements de sécurité
 * SOC2: CC7 — Opérations système
 * ISO 27001: A.12.4.1
 */
const securityLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const isError = res.statusCode >= 400;

    if (isError) {
      const severity = res.statusCode >= 500 ? 'ERROR' : 'WARN';
      console.warn(`[${severity}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms) | IP: ${req.ip} | User: ${req.user?.id || 'anon'}`);
    }
  });

  next();
};

module.exports = { authMiddleware, requireRole, securityLogger };
