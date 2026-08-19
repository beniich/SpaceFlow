# 📋 CORRECTIONS_BACKEND.md — ReclamTrack Backend

> Document de référence de toutes les corrections identifiées, leur statut, et les fichiers concernés.  
> Mis à jour au fur et à mesure de l'implémentation.

---

## 🔴 Critique (Sécurité)

### COR-001 — CORS ouvert à toutes les origines

|                |                                                                                   |
| -------------- | --------------------------------------------------------------------------------- |
| **Fichier**    | `backend/src/index.ts` ligne 63                                                   |
| **Problème**   | `app.use(cors({ origin: '*' }))` — accepte les requêtes de n'importe quel domaine |
| **Risque**     | CSRF, accès non autorisé depuis des domaines tiers                                |
| **Correction** | Remplacer par `origin: process.env.ALLOWED_ORIGINS?.split(',')`                   |
| **Statut**     | ⏳ À faire (Phase 7)                                                              |

```diff
- app.use(cors({ origin: '*' }));
+ const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [];
+ app.use(cors({ origin: allowedOrigins, credentials: true }));
```

---

### COR-002 — Webhook Stripe sans vérification de signature (fallback non sécurisé)

|                |                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------- |
| **Fichier**    | `backend/src/routes/billing.ts` lignes 95-99                                                |
| **Problème**   | Si `STRIPE_WEBHOOK_SECRET` absent, le webhook accepte n'importe quel body sans vérification |
| **Risque**     | Un attaquant peut simuler des paiements réussis                                             |
| **Correction** | Pas de fallback — forcer la vérification en production                                      |
| **Statut**     | ⏳ À faire (Phase 4)                                                                        |

```diff
- } else {
-   event = req.body; // Fallback for testing without signature verification (NOT SECURE)
- }
+ } else {
+   throw new AppError('Stripe webhook secret not configured', 500, 'CONFIG_ERROR');
+ }
```

---

### COR-003 — Middleware d'authentification dupliqué (deux sources de vérité)

|                |                                                                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichiers**   | `middleware/auth.ts` ET `middleware/security.ts`                                                                                                                                 |
| **Problème**   | `protect` dans `auth.ts` et `authenticate` dans `security.ts` font la même chose mais avec des formats de réponse différents. Certaines routes utilisent l'un, d'autres l'autre. |
| **Risque**     | Incohérence des codes d'erreur, maintenance difficile, tests incomplets                                                                                                          |
| **Correction** | Supprimer `auth.ts` et `organization.ts`, utiliser uniquement `security.ts`                                                                                                      |
| **Statut**     | ⏳ À faire (Phase 1)                                                                                                                                                             |

**Routes utilisant l'ancien `auth.ts`** (à migrer) :

- `billing.ts` → `import { protect } from '../middleware/auth.js'`
- `memberships.ts` → `import { protect } from '../middleware/auth.js'`
- Autres routes à identifier par `grep_search`

---

### COR-004 — Access token longue durée sans refresh token

|                |                                                                                         |
| -------------- | --------------------------------------------------------------------------------------- |
| **Fichiers**   | `routes/auth.ts`, `middleware/security.ts`                                              |
| **Problème**   | JWT signé avec durée `7d` par défaut, pas de mécanisme de révocation                    |
| **Risque**     | Token volé reste valide 7 jours, impossible à révoquer                                  |
| **Correction** | Access token 15 min + Refresh token haché en DB (révocable), détection de réutilisation |
| **Statut**     | ⏳ À faire (Phase 2)                                                                    |

---

### COR-005 — Token JWT expiré et invalide retournent le même code d'erreur

|                |                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------- |
| **Fichier**    | `middleware/security.ts` lignes 54-63                                                         |
| **Problème**   | `TokenExpiredError` et `JsonWebTokenError` retournent le même message générique               |
| **Risque**     | Le frontend ne peut pas distinguer "token expiré → rafraîchir" vs "token invalide → re-login" |
| **Correction** | Différencier dans le catch : `AUTH_TOKEN_EXPIRED` vs `AUTH_TOKEN_INVALID`                     |
| **Statut**     | ⏳ À faire (Phase 2)                                                                          |

```diff
  } catch (err) {
-   return res.status(401).json({ success: false, error: 'Token invalide ou expiré', code: 'AUTH_TOKEN_INVALID' });
+   if (err instanceof jwt.TokenExpiredError) {
+     return res.status(401).json({ success: false, error: 'Token expiré', code: 'AUTH_TOKEN_EXPIRED' });
+   }
+   return res.status(401).json({ success: false, error: 'Token invalide', code: 'AUTH_TOKEN_INVALID' });
  }
```

---

## 🟠 Majeur (Architecture / Maintenabilité)

### COR-006 — Gestionnaire d'erreurs trop minimal

|                |                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------ |
| **Fichier**    | `middleware/errorHandler.ts`                                                                     |
| **Problème**   | Handler de 14 lignes qui ne gère pas les types d'erreurs spécifiques (Mongoose, JWT, Validation) |
| **Risque**     | Fuite d'informations internes, messages d'erreur non standardisés                                |
| **Correction** | Handler complet avec gestion typée + classe `AppError`                                           |
| **Statut**     | ⏳ À faire (Phase 1)                                                                             |

---

### COR-007 — Rate limiter en mémoire (non-scalable)

|                |                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------- |
| **Fichier**    | `middleware/security.ts` lignes 225-256                                                        |
| **Problème**   | `rateLimitStore = new Map()` — perd l'état au redémarrage, ne fonctionne pas en multi-instance |
| **Risque**     | Rate limiting inefficace en production distribuée                                              |
| **Correction** | Utiliser `express-rate-limit` (déjà présent en dépendance) avec presets par route              |
| **Statut**     | ⏳ À faire (Phase 6)                                                                           |

---

### COR-008 — Prix Stripe hardcodé dans le code

|                |                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------ |
| **Fichier**    | `routes/billing.ts` ligne 28                                                               |
| **Problème**   | `const priceId = 'price_1234567890'` — non fonctionnel, ne correspond à aucun produit réel |
| **Risque**     | Checkout Stripe cassé en production                                                        |
| **Correction** | Lookup dynamique depuis le modèle `Subscription` ou depuis les Stripe Products             |
| **Statut**     | ⏳ À faire (Phase 4)                                                                       |

---

### COR-009 — Imports `require()` dans les gestionnaires d'événements

|                |                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**    | `backend/src/index.ts` lignes 128, 161                                                                                             |
| **Problème**   | `require('./services/socketService.js')` et `require('./models/Complaint.js')` dans des handlers runtime — mélange ESM et CommonJS |
| **Risque**     | Comportement imprévisible selon le bundler, difficile à tester                                                                     |
| **Correction** | Déplacer l'handler d'événements dans `routes/events.ts` et utiliser des imports ES au niveau du module                             |
| **Statut**     | ⏳ À faire (Phase 7)                                                                                                               |

---

### COR-010 — Validation des variables d'environnement incomplète

|                |                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------- |
| **Fichier**    | `config/envValidator.ts`                                                                  |
| **Problème**   | `JWT_REFRESH_SECRET`, `ALLOWED_ORIGINS`, `API_KEY_SALT` ne sont pas vérifiés au démarrage |
| **Risque**     | Serveur démarre avec une configuration invalide → erreurs en runtime                      |
| **Correction** | Ajouter les nouvelles variables requises à la liste de validation                         |
| **Statut**     | ⏳ À faire (Phase 1)                                                                      |

---

### COR-011 — Pas de couche DTO — validation ad-hoc et incohérente

|                |                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichiers**   | Toutes les routes (`routes/*.ts`)                                                                                                                       |
| **Problème**   | Validation express-validator inline dans chaque route, règles inconsistantes (ex: mot de passe min 6 chars dans une route, pas de règle dans une autre) |
| **Risque**     | Données invalides en base, sécurité insuffisante                                                                                                        |
| **Correction** | Créer `src/dto/` avec interfaces TypeScript + validateurs centralisés                                                                                   |
| **Statut**     | ⏳ À faire (Phase 3)                                                                                                                                    |

---

### COR-012 — Endpoint de test de notification exposé en production

|                |                                                                                  |
| -------------- | -------------------------------------------------------------------------------- |
| **Fichier**    | `backend/src/index.ts` lignes 127-141                                            |
| **Problème**   | `POST /api/test-notification` accessible sans authentification en production     |
| **Risque**     | Spam de notifications WebSocket par des tiers                                    |
| **Correction** | Conditionner à `process.env.NODE_ENV !== 'production'` ou ajouter `authenticate` |
| **Statut**     | ⏳ À faire (Phase 7)                                                             |

---

## 🟡 Mineur (Qualité / Lisibilité)

### COR-013 — `console.log` / `console.error` directs dans les middlewares

|                |                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------- |
| **Fichiers**   | `middleware/security.ts`, `middleware/auth.ts`, `middleware/organization.ts`                    |
| **Problème**   | Mixes de `console.log` et `logger.ts` — pas de format uniforme, pas de niveaux de log cohérents |
| **Correction** | Remplacer tous les `console.*` par `logger.debug/warn/error`                                    |
| **Statut**     | ⏳ À faire (Phases 1–2)                                                                         |

---

### COR-014 — `any` TypeScript partout dans les routes

|                |                                                                     |
| -------------- | ------------------------------------------------------------------- |
| **Fichiers**   | `routes/memberships.ts`, `routes/billing.ts`, la plupart des routes |
| **Problème**   | `async (req: any, res: Response)` — perd la sécurité de type        |
| **Correction** | Utiliser `AuthenticatedRequest` depuis `middleware/security.ts`     |
| **Statut**     | ⏳ À faire (Phase 1–3)                                              |

---

### COR-015 — Request ID absent — corrélation de logs impossible

|                |                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------ |
| **Fichiers**   | `index.ts`, `utils/logger.ts`                                                              |
| **Problème**   | Aucun identifiant unique par requête — impossible de tracer une requête à travers les logs |
| **Correction** | Middleware `requestId.ts` qui génère UUID, l'attache à `req.id` et header `x-request-id`   |
| **Statut**     | ⏳ À faire (Phase 6)                                                                       |

---

## ✅ Corrections Déjà En Place

### OK-001 — Réponses API standardisées

`utils/apiResponse.ts` fournit `successResponse`, `errorResponse`, `paginatedResponse`, etc. avec un format `{ success, data/error, code, timestamp }`. ✅

### OK-002 — Audit Log fonctionnel

`models/AuditLog.ts` + création dans `routes/auth.ts` (LOGIN, REGISTER). ✅

### OK-003 — Hachage bcrypt des mots de passe

`models/User.ts` utilise un hook `pre('save')` avec `bcrypt.genSalt(10)`. ✅

### OK-004 — Helmet activé

`index.ts` utilise `helmet()` pour les en-têtes de sécurité HTTP de base. ✅

### OK-005 — Middleware `requireOrganization` vérifie l'appartenance en DB

`middleware/security.ts` vérifie le statut `ACTIVE` du membership avant d'autoriser. ✅

---

## 📊 Résumé des Statuts

| Priorité    | Nombre | Résolus | Restants |
| ----------- | ------ | ------- | -------- |
| 🔴 Critique | 5      | 0       | **5**    |
| 🟠 Majeur   | 7      | 0       | **7**    |
| 🟡 Mineur   | 3      | 0       | **3**    |
| ✅ OK       | 5      | 5       | 0        |
| **Total**   | **20** | **5**   | **15**   |

> Voir le plan d'implémentation pour l'ordre de résolution : `implementation_plan.md`
