/**
 * IndexedDB configuration via Dexie.js
 * Sert de store offline-first pour :
 * - outbox : Work Orders créés/modifiés hors-ligne, en attente de sync
 * - assets : cache local des assets pour consultation offline
 * - drafts : brouillons autosave de formulaires
 */
import Dexie from 'dexie';

const db = new Dexie('beecarbonit_cafm');

db.version(1).stores({
  outbox: '++id, action, resource, payload, createdAt, retries, lastError',
  assets: 'id, name, type, buildingId, updatedAt',
  drafts: 'id, type, data, updatedAt'
});

/**
 * Ajouter un item dans la file d'attente de synchronisation
 * @param {'CREATE'|'UPDATE'|'DELETE'} action
 * @param {string} resource - ex: 'workorders', 'assets'
 * @param {object} payload  - Corps de la requête
 */
export async function addToOutbox(action, resource, payload) {
  return db.outbox.add({
    action,
    resource,
    payload,
    createdAt: new Date().toISOString(),
    retries: 0,
    lastError: null
  });
}

/**
 * Récupérer tous les éléments en attente de sync
 */
export async function getPendingOutbox() {
  return db.outbox.toArray();
}

/**
 * Supprimer un item de l'outbox après sync réussie
 */
export async function removeFromOutbox(id) {
  return db.outbox.delete(id);
}

/**
 * Mettre à jour un asset dans le cache local
 */
export async function cacheAssets(assets) {
  return db.assets.bulkPut(assets);
}

export default db;
