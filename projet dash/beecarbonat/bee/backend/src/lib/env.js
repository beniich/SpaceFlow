/**
 * env.js — Validation fail-fast des variables d'environnement
 * Utilise Zod pour garantir que toutes les clés critiques sont définies
 * avant le démarrage du serveur.
 */
const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('8081'),

  // ─── JWT ──────────────────────────────────────────────────
  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit faire ≥ 32 caractères'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // ─── Base de données ─────────────────────────────────────
  DATABASE_URL: z.string().min(1, 'DATABASE_URL est requis'),

  // ─── Redis (optionnel) ───────────────────────────────────
  REDIS_URL: z.string().url().optional().or(z.literal('')),

  // ─── Optionnels en développement ─────────────────────────
  STRIPE_SECRET_KEY:      z.string().optional(),
  STRIPE_WEBHOOK_SECRET:  z.string().optional(),
  RESEND_API_KEY:         z.string().optional(),
  SENTRY_DSN:             z.string().optional(),
  ENCRYPTION_KEY:         z.string().min(32).optional(),
});

let _env;

function getEnv() {
  if (_env) return _env;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues
      .map(i => `  ❌ ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    console.error('\n🚨 ERREUR DE CONFIGURATION — Variables manquantes ou invalides:\n');
    console.error(issues);
    console.error('\nConsultez .env.example pour les valeurs requises.\n');
    process.exit(1);
  }

  _env = result.data;

  // ─── Garde contre les secrets de dev en production ──────
  if (_env.NODE_ENV === 'production') {
    const FORBIDDEN_PATTERNS = [
      'cafm', 'secret-jwt', 'dummy', 'changeme', 'development', 'test123'
    ];
    const secretsToCheck = [_env.JWT_SECRET];

    for (const secret of secretsToCheck) {
      for (const pattern of FORBIDDEN_PATTERNS) {
        if (secret.toLowerCase().includes(pattern)) {
          console.error(`\n🚨 SECURITY: Secret de développement détecté en production: "${pattern}"\n`);
          process.exit(1);
        }
      }
    }
  }

  return _env;
}

module.exports = { getEnv };
