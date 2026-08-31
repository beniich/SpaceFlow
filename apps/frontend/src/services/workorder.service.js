import api from './api';
import { db } from './db';
import { encryptData, decryptData } from './crypto.service';
import { addPendingAction, pullUpdates } from './syncService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service Local-First pour la gestion des Ordres de Travail (Work Orders)
 * Pattern Stale-While-Revalidate (SWR) avec persistance chiffrée
 */
export const workorderService = {
  /**
   * Récupère la liste des bons de travail (IndexedDB instantané puis SWR)
   * @param {Function} [onBackgroundUpdated] Callback appelé si les données serveur changent
   */
  async getWorkOrders(onBackgroundUpdated) {
    let localWOs = [];
    try {
      const records = await db.cached_workorders.toArray();
      if (records.length > 0) {
        localWOs = await Promise.all(records.map(async r => {
          const decrypted = await decryptData(r.payload);
          return {
            ...(decrypted || r),
            hasConflict: r.hasConflict
          };
        }));
      }
    } catch (e) {
      console.warn('[workorderService] Could not read local cache:', e);
    }

    // Déclenchement de la synchronisation serveur en tâche de fond (SWR)
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      pullUpdates('workorders').then(async () => {
        if (onBackgroundUpdated) {
          const refreshedRecords = await db.cached_workorders.toArray();
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

    return localWOs;
  },

  /**
   * Crée un ordre de travail avec mise à jour optimiste locale immédiate
   * @param {Object} woData
   */
  async createWorkOrder(woData) {
    const tempId = `temp-${uuidv4()}`;
    const newWO = {
      ...woData,
      id: tempId,
      status: woData.status || 'OPEN',
      updatedAt: Date.now(),
      _isOfflineQueued: true
    };

    // 1. Sauvegarde locale chiffrée
    await db.cached_workorders.put({
      id: tempId,
      status: newWO.status,
      type: newWO.type,
      priority: newWO.priority,
      title: newWO.title,
      updatedAt: newWO.updatedAt,
      hasConflict: false,
      payload: await encryptData(newWO)
    });

    // 2. Ajout dans l'Outbox
    await addPendingAction('post', '/workorders', woData, 'CREATE_WORKORDER');

    return newWO;
  },

  /**
   * Met à jour le statut d'un bon de travail en local-first
   */
  async updateStatus(id, newStatus, resolutionNotes = '') {
    const existing = await db.cached_workorders.get(id);
    let updatedPayload = null;
    if (existing) {
      const raw = await decryptData(existing.payload) || {};
      updatedPayload = { ...raw, status: newStatus, resolutionNotes, updatedAt: Date.now() };
      await db.cached_workorders.put({
        ...existing,
        status: newStatus,
        updatedAt: updatedPayload.updatedAt,
        payload: await encryptData(updatedPayload)
      });
    }

    await addPendingAction('patch', `/workorders/${id}/status`, { status: newStatus, resolutionNotes }, 'UPDATE_WO_STATUS');
    return updatedPayload;
  }
};
