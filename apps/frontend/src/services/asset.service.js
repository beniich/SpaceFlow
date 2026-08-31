import api from './api';
import { db } from './db';
import { encryptData, decryptData } from './crypto.service';
import { addPendingAction, pullUpdates } from './syncService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service Local-First pour la gestion du Parc d'Équipements (Assets)
 */
export const assetService = {
  /**
   * Récupère la liste des équipements (Local d'abord, puis SWR arrière-plan)
   * @param {Function} [onBackgroundUpdated]
   */
  async getAssets(onBackgroundUpdated) {
    let localAssets = [];
    try {
      const records = await db.cached_assets.toArray();
      if (records.length > 0) {
        localAssets = await Promise.all(records.map(async r => {
          const decrypted = await decryptData(r.payload);
          return {
            ...(decrypted || r),
            hasConflict: r.hasConflict
          };
        }));
      }
    } catch (e) {
      console.warn('[assetService] Could not read local cache:', e);
    }

    // Background sync SWR
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      pullUpdates('assets').then(async () => {
        if (onBackgroundUpdated) {
          const refreshedRecords = await db.cached_assets.toArray();
          const refreshed = await Promise.all(refreshedRecords.map(async r => {
            const decrypted = await decryptData(r.payload);
            return {
              ...(decrypted || r),
              hasConflict: r.hasConflict
            };
          }));
          onBackgroundUpdated(refreshed);
        }
      }).catch(() => {});
    }

    return localAssets;
  },

  /**
   * Enregistre ou met à jour un équipement en Local-First
   */
  async saveAsset(assetData) {
    const isNew = !assetData.id;
    const id = assetData.id || `temp-${uuidv4()}`;
    const payload = {
      ...assetData,
      id,
      updatedAt: Date.now(),
      _isOfflineQueued: true
    };

    await db.cached_assets.put({
      id,
      type: payload.type,
      code: payload.code,
      status: payload.status || 'OPERATIONAL',
      buildingId: payload.buildingId,
      updatedAt: payload.updatedAt,
      hasConflict: false,
      payload: await encryptData(payload)
    });

    const method = isNew ? 'post' : 'put';
    const url = isNew ? '/assets' : `/assets/${id}`;
    await addPendingAction(method, url, assetData, isNew ? 'CREATE_ASSET' : 'UPDATE_ASSET');

    return payload;
  }
};
