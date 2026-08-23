import { db } from './db';
import api from './api';

const SYNC_EVENT_NAME = 'cafm_sync_queue_changed';

function notifyQueueChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
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

export async function addPendingAction(method, url, data) {
  try {
    await db.pending_actions.add({
      method,
      url,
      data,
      timestamp: Date.now(),
      status: 'pending' // 'pending' | 'failed'
    });
    notifyQueueChange();
    
    // Trigger a sync attempt if online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      flushPendingActions();
    }
  } catch (err) {
    console.error('[Sync] Error adding pending action:', err);
  }
}

export async function flushPendingActions() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return { flushed: 0, failed: 0 };

  let actions = [];
  try {
    actions = await db.pending_actions.where('status').equals('pending').toArray();
  } catch (err) {
    console.error('[Sync] Could not read pending actions:', err);
    return { flushed: 0, failed: 0 };
  }

  if (actions.length === 0) return { flushed: 0, failed: 0 };

  console.log(`[Sync] Flushing ${actions.length} pending actions...`);
  let flushed = 0;
  let failed = 0;

  for (const action of actions) {
    try {
      // Execute the request
      await api.request({
        method: action.method,
        url: action.url,
        data: action.data,
        headers: { 'X-Offline-Retry': 'true' }
      });
      // Remove on success
      await db.pending_actions.delete(action.id);
      flushed++;
      console.log(`[Sync] Successfully flushed action ${action.id}`);
    } catch (error) {
      console.error(`[Sync] Failed to flush action ${action.id}:`, error);
      failed++;
      // If it's a 4xx error (except 401/429), mark as failed so we don't retry forever
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        await db.pending_actions.update(action.id, { status: 'failed', error: error.message });
      }
    }
  }

  notifyQueueChange();
  return { flushed, failed };
}

// Auto-flush when coming online
if (typeof window !== 'undefined') {
  window.addEventListener('online', flushPendingActions);
}

export { SYNC_EVENT_NAME };

