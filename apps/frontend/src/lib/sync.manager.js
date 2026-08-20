/**
 * sync.manager.js — Gestionnaire de synchronisation offline → online
 * Horizon 2 beecarbonit : PWA offline-first
 *
 * Stratégie : Last-Write-Wins par défaut + signalement des conflits si même entité
 */
import axios from 'axios';
import { getPendingActions, markActionSynced } from './offline.db';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Flush l'outbox IndexedDB vers l'API.
 * Appelé automatiquement au retour du réseau (listener 'online').
 *
 * @param {string} tenantId
 * @param {string} token    — JWT de l'utilisateur
 * @returns {{ synced: number, failed: number, conflicts: number }}
 */
export async function flushOfflineQueue(tenantId, token) {
  const actions = await getPendingActions(tenantId);
  if (!actions.length) return { synced: 0, failed: 0, conflicts: 0 };

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  let synced = 0;
  let failed = 0;
  let conflicts = 0;

  for (const action of actions) {
    try {
      await axios({
        method: action.method,
        url: `${API_BASE}${action.endpoint}`,
        data: action.payload,
        headers: {
          ...headers,
          'Idempotency-Key': action.idempotencyKey,
        },
        timeout: 10_000,
      });

      await markActionSynced(action.id);
      synced++;
    } catch (err) {
      const status = err?.response?.status;

      if (status === 409) {
        // Conflict — LWW: on force avec un timestamp
        conflicts++;
        try {
          await axios({
            method: action.method,
            url: `${API_BASE}${action.endpoint}`,
            data: { ...action.payload, _forceOverwrite: true },
            headers,
          });
          await markActionSynced(action.id);
          synced++;
        } catch {
          failed++;
        }
      } else {
        failed++;
        console.warn(`[Sync] Failed action ${action.id} (${action.type}): ${err.message}`);
      }
    }
  }

  return { synced, failed, conflicts };
}

/**
 * Démarre l'écoute du retour réseau et flush automatiquement
 */
export function initSyncManager(tenantId, token, onComplete) {
  const handleOnline = async () => {
    console.info('[Sync] Réseau détecté — flush de l\'outbox...');
    const result = await flushOfflineQueue(tenantId, token);
    console.info(`[Sync] Résultat: ${result.synced} synced, ${result.failed} failed, ${result.conflicts} conflicts`);
    if (onComplete) onComplete(result);
  };

  window.addEventListener('online', handleOnline);

  // Flush immédiatement si déjà en ligne (ex: après reload)
  if (navigator.onLine) handleOnline();

  // Cleanup
  return () => window.removeEventListener('online', handleOnline);
}
