/**
 * Middlewares de sécurité : sanitization, rate limiting, etc.
 */
const rateLimit = require('express-rate-limit');

// ============== SANITIZATION XSS ==============
exports.sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .trim();
    }
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj && typeof obj === 'object') {
      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
        cleaned[key] = sanitize(value);
      }
      return cleaned;
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};

// ============== RATE LIMITING ==============
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requêtes par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de requêtes, veuillez réessayer dans 15 minutes'
  }
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 tentatives de login par 15 min
  skipSuccessfulRequests: true,
  message: {
    error: 'Trop de tentatives de connexion, réessayez dans 15 minutes'
  }
});

// ============== HEADERS DE SÉCURITÉ ==============
exports.securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};
