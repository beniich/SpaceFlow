import { db } from './db';
import api from './api';
import { encryptData, decryptData } from './crypto.service';

const SYNC_EVENT_NAME = 'cafm_sync_queue_changed';
const DATA_SYNC_EVENT = 'cafm_data_synced';
const CONFLICT_THRESHOLD_MS = 5000; // 5 secondes pour détection de conflit

function notifyQueueChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
  }
}

function notifyDataSynced(entity, items) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATA_SYNC_EVENT, { detail: { entity, items } }));
  }
}

export async function getPendingActionsCount() {
  try {
    return await db.pending_actions.where('status').equals('pending').count();
  } catch {
    return 0;
  }
}

export async function getPendingActions() {
  try {
    return await db.pending_actions.toArray();
  } catch {
    return [];
  }
}

export async function clearFailedActions() {
  try {
    await db.pending_actions.where('status').equals('failed').delete();
    notifyQueueChange();
  } catch (err) {
    console.error('[Sync] Error clearing failed actions:', err);
  }
}

/**
 * Ajoute une mutation dans la queue Outbox avec ordre séquentiel
 */
export async function addPendingAction(method, url, data, actionType = 'MUTATION') {
  try {
    const encryptedPayload = await encryptData(data);

    await db.pending_actions.add({
      actionType,
      method,
      url,
      payload: encryptedPayload,
      timestamp: Date.now(),
      status: 'pending' // 'pending' | 'failed' | 'in_flight'
    });
    notifyQueueChange();
    
    // Tentative de flush immédiat si connexion active
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      flushPendingActions();
    }
  } catch (err) {
    console.error('[Sync] Error adding pending action:', err);
  }
}

/**
 * Envoie séquentiellement les actions en attente (Outbox Pattern)
 */
export async function flushPendingActions() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return { flushed: 0, failed: 0 };

  let actions = [];
  try {
    actions = await db.pending_actions.where('status').equals('pending').sortBy('timestamp');
  } catch (err) {
    console.error('[Sync] Could not read pending actions:', err);
    return { flushed: 0, failed: 0 };
  }

  if (actions.length === 0) return { flushed: 0, failed: 0 };

  console.log(`[Sync Outbox] Flushing ${actions.length} actions in sequence...`);
  let flushed = 0;
  let failed = 0;

  for (const action of actions) {
    try {
      await db.pending_actions.update(action.id, { status: 'in_flight' });
      
      const rawData = await decryptData(action.payload);

      const response = await api.request({
        method: action.method,
        url: action.url,
        data: rawData,
        headers: { 'X-Offline-Retry': 'true' }
      });

      // Si c'était une création avec ID temporaire, remplacer l'item local par l'item serveur officiel
      if (response.data && response.data.id) {
        if (action.actionType === 'CREATE_WORKORDER' || action.url.includes('/workorders')) {
          await db.cached_workorders.put({
            id: response.data.id,
            status: response.data.status,
            type: response.data.type,
            priority: response.data.priority,
            title: response.data.title,
            updatedAt: new Date(response.data.updatedAt || Date.now()).getTime(),
            hasConflict: false,
            payload: await encryptData(response.data)
          });
        }
      }

      await db.pending_actions.delete(action.id);
      flushed++;
      console.log(`[Sync Outbox] Action ${action.id} synced successfully`);
    } catch (error) {
      console.error(`[Sync Outbox] Failed to flush action ${action.id}:`, error);
      failed++;
      
      // Erreurs 4xx définitives (hors 401/429) -> marquées en échec pour ne pas bloquer la queue indéfiniment
      if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 401 && error.response.status !== 429) {
        await db.pending_actions.update(action.id, { status: 'failed', error: error.message });
      } else {
        await db.pending_actions.update(action.id, { status: 'pending' });
        // Arrêter l'exécution séquentielle en cas de coupure réseau inattendue
        break;
      }
    }
  }

  notifyQueueChange();
  return { flushed, failed };
}

/**
 * Delta Sync : Récupération incrémentale des modifications serveur (Pull)
 * Avec résolution de conflits (LWW + Flag hasConflict si < 5s)
 */
export async function pullUpdates(entity = 'all', siteId = null) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  try {
    if (entity === 'all' || entity === 'workorders') {
      const meta = await db.sync_metadata.get('workorders');
      const since = meta?.lastSyncedAt ? new Date(meta.lastSyncedAt).toISOString() : null;
      
      const { data } = await api.get('/workorders', {
        params: { ...(since ? { since } : {}), ...(siteId ? { siteId } : {}) }
      });

      if (Array.isArray(data) && data.length > 0) {
        for (const wo of data) {
          const localItem = await db.cached_workorders.get(wo.id);
          const serverUpdated = new Date(wo.updatedAt || Date.now()).getTime();
          const localUpdated = localItem?.updatedAt || 0;

          // Détection de conflit potentiel (modifications concurrentes à moins de 5 sec d'intervalle)
          const hasConflict = localItem && Math.abs(serverUpdated - localUpdated) < CONFLICT_THRESHOLD_MS;

          // LWW (Last-Write-Wins) : le plus récent gagne
          if (!localItem || serverUpdated >= localUpdated) {
            await db.cached_workorders.put({
              id: wo.id,
              status: wo.status,
              type: wo.type,
              priority: wo.priority,
              title: wo.title,
              updatedAt: serverUpdated,
              hasConflict: hasConflict,
              payload: await encryptData(wo)
            });
          }
        }
        await db.sync_metadata.put({ key: 'workorders', lastSyncedAt: Date.now() });
        notifyDataSynced('workorders', data);
      }
    }

    if (entity === 'all' || entity === 'assets') {
      const meta = await db.sync_metadata.get('assets');
      const since = meta?.lastSyncedAt ? new Date(meta.lastSyncedAt).toISOString() : null;

      const { data } = await api.get('/assets', {
        params: { ...(since ? { since } : {}), ...(siteId ? { siteId } : {}) }
      });

      if (Array.isArray(data) && data.length > 0) {
        for (const asset of data) {
          const localItem = await db.cached_assets.get(asset.id);
          const serverUpdated = new Date(asset.updatedAt || Date.now()).getTime();
          const localUpdated = localItem?.updatedAt || 0;

          const hasConflict = localItem && Math.abs(serverUpdated - localUpdated) < CONFLICT_THRESHOLD_MS;

          if (!localItem || serverUpdated >= localUpdated) {
            await db.cached_assets.put({
              id: asset.id,
              type: asset.type,
              code: asset.code,
              status: asset.status,
              buildingId: asset.buildingId,
              updatedAt: serverUpdated,
              hasConflict: hasConflict,
              payload: await encryptData(asset)
            });
          }
        }
        await db.sync_metadata.put({ key: 'assets', lastSyncedAt: Date.now() });
        notifyDataSynced('assets', data);
      }
    }
  } catch (err) {
    console.warn(`[Sync Pull] Error pulling delta updates for ${entity}:`, err);
  }
}

// Déclencheurs automatiques lors du retour en ligne
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushPendingActions().then(() => pullUpdates('all'));
  });
}

export { SYNC_EVENT_NAME, DATA_SYNC_EVENT };
