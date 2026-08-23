import Dexie from 'dexie';

export const db = new Dexie('beecarbonat-offline-db');

db.version(2).stores({
  // pending_actions: outbox for mutations when offline
  // 'url' is the endpoint, 'method' is POST/PUT/DELETE, 'data' is payload
  pending_actions: '++id, method, url, timestamp, status',
  
  // cached queries for fast offline access
  cached_workorders: 'id, status, type, priority, title',
  cached_assets: 'id, type, code',
  cached_bim_models: 'id, buildingId, name, updatedAt'
});
