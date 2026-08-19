import { db } from './db';
import api from './api';

export async function addPendingAction(method, url, data) {
  await db.pending_actions.add({
    method,
    url,
    data,
    timestamp: Date.now(),
    status: 'pending' // 'pending' | 'failed'
  });
  
  // Trigger a sync attempt if online
  if (navigator.onLine) {
    flushPendingActions();
  }
}

export async function flushPendingActions() {
  if (!navigator.onLine) return;

  const actions = await db.pending_actions.where('status').equals('pending').toArray();
  if (actions.length === 0) return;

  console.log(`[Sync] Flushing ${actions.length} pending actions...`);

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
      console.log(`[Sync] Successfully flushed action ${action.id}`);
    } catch (error) {
      console.error(`[Sync] Failed to flush action ${action.id}:`, error);
      // If it's a 4xx error (except 401/429 maybe), it might be unrecoverable (bad request).
      // If it's 5xx or network, keep it pending.
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        // Mark as failed so we don't retry forever, or delete it
        await db.pending_actions.update(action.id, { status: 'failed', error: error.message });
      }
    }
  }
}

// Auto-flush when coming online
window.addEventListener('online', flushPendingActions);
