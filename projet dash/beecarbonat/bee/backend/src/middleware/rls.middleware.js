const prisma = require('../config/database');

/**
 * Middleware Express qui injecte le contexte tenant dans PostgreSQL
 * pour activer le Row Level Security (RLS) automatiquement.
 *
 * Doit être utilisé APRÈS authMiddleware (qui peuple req.user).
 *
 * Comment ça fonctionne :
 * - Chaque requête utilise un $transaction Prisma pour exécuter
 *   SET LOCAL app.current_tenant_id = '<tenantId>'
 *   avant la requête métier.
 *
 * Utilisation dans les routes :
 *   router.get('/assets', authMiddleware, rls, assetController.list);
 */
const rls = async (req, res, next) => {
  if (!req.user) return next();

  const tenantId = req.user.tenantId || null;
  const role = req.user.role || 'VIEWER';

  // Injecter le contexte tenant dans les requêtes Prisma de cette requête HTTP
  // via $executeRaw (SET LOCAL est limité à la transaction courante)
  req.prismaWithRLS = async (fn) => {
    return prisma.$transaction(async (tx) => {
      if (tenantId) {
        await tx.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`;
      }
      await tx.$executeRaw`SELECT set_config('app.user_role', ${role}, true)`;
      return fn(tx);
    });
  };

  next();
};

module.exports = { rls };
