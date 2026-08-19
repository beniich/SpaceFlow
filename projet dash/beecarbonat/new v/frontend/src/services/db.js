import Dexie from 'dexie';

export const db = new Dexie('beecarbonit-offline-db');

db.version(1).stores({
  // pending_actions: outbox for mutations when offline
  // 'url' is the endpoint, 'method' is POST/PUT/DELETE, 'data' is payload
  pending_actions: '++id, method, url, timestamp, status',
  
  // cached queries for fast offline access (handled partially by Workbox, but we can store explicit structured data here if needed)
  cached_workorders: 'id, status, type, priority, title',
  cached_assets: 'id, type, code'
});
