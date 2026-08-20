/**
 * offline.db.js — IndexedDB via Dexie.js
 * Architecture PWA Horizon 2 beecarbonit
 *
 * Stores:
 *  - pending_actions : outbox — mutations à synchroniser au retour réseau
 *  - cached_assets   : snapshot read-only des assets (consultation offline)
 *  - cached_wo       : snapshot des Work Orders assignés à l'utilisateur
 *  - drafts          : brouillons autosauvegardés (WO non soumis)
 */
import Dexie from 'dexie';

export const db = new Dexie('beecarbonit-offline');

db.version(1).stores({
  // Outbox: actions en attente de sync
  // id est autogénéré par Dexie, idempotencyKey = UUID côté client
  pending_actions: '++id, type, entityId, tenantId, createdAt, synced',

  // Cache lecture seule des assets
  cached_assets: 'id, tenantId, parentId, type, status, updatedAt',

  // Cache des Work Orders assignées à l'utilisateur courant
  cached_wo: 'id, tenantId, status, priority, assignedToId, scheduledAt',

  // Brouillons — survit aux fermetures du navigateur
  drafts: '++id, type, updatedAt',
});

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} PendingAction
 * @property {number}  id
 * @property {string}  type           — CREATE_WO | UPDATE_WO | ADD_ANNOTATION | ADD_READING
 * @property {string}  entityId       — ID côté client (UUID généré offline)
 * @property {string}  tenantId
 * @property {Object}  payload        — corps de la requête API
 * @property {string}  endpoint       — chemin API ex: /api/work-orders
 * @property {string}  method         — POST | PUT | PATCH
 * @property {string}  idempotencyKey — UUID pour éviter les doublons
 * @property {boolean} synced
 * @property {Date}    createdAt
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Ajoute une action dans l'outbox offline
 */
export async function queueOfflineAction({ type, entityId, tenantId, payload, endpoint, method = 'POST' }) {
  const idempotencyKey = crypto.randomUUID();
  return db.pending_actions.add({
    type,
    entityId,
    tenantId,
    payload,
    endpoint,
    method,
    idempotencyKey,
    synced: false,
    createdAt: new Date(),
  });
}

/**
 * Récupère toutes les actions en attente d'un tenant
 */
export async function getPendingActions(tenantId) {
  return db.pending_actions
    .where({ tenantId, synced: false })
    .sortBy('createdAt');
}

/**
 * Marque une action comme synchronisée
 */
export async function markActionSynced(id) {
  return db.pending_actions.update(id, { synced: true });
}

/**
 * Sauvegarde un snapshot d'assets pour la consultation offline
 */
export async function cacheAssets(assets) {
  return db.cached_assets.bulkPut(assets);
}

/**
 * Sauvegarde un snapshot de Work Orders
 */
export async function cacheWorkOrders(workOrders) {
  return db.cached_wo.bulkPut(workOrders);
}

/**
 * Sauvegarde un brouillon (WO, annotation, etc.)
 */
export async function saveDraft(type, data) {
  const existing = await db.drafts.where({ type }).first();
  if (existing) {
    return db.drafts.update(existing.id, { ...data, updatedAt: new Date() });
  }
  return db.drafts.add({ type, ...data, updatedAt: new Date() });
}

export async function getDraft(type) {
  return db.drafts.where({ type }).first();
}

export async function deleteDraft(type) {
  return db.drafts.where({ type }).delete();
}
