import Dexie from 'dexie';

export const db = new Dexie('beecarbonat-offline-db');

// Définition du schéma Dexie V3 avec support des timestamps de sync et payload chiffré
db.version(3).stores({
  // Outbox / Queue d'actions séquentielles
  // 'actionType': 'CREATE_WO', 'UPDATE_ASSET', etc.
  // 'url': endpoint API, 'method': POST/PUT/PATCH/DELETE
  // 'payload': payload chiffré ou brut, 'timestamp': Date.now(), 'status': 'pending' | 'failed' | 'in_flight'
  pending_actions: '++id, actionType, method, url, timestamp, status',
  
  // Cache chiffré des Bons de Travail
  // id: ID réel ou ID temporaire (temp-xxx)
  // hasConflict: boolean si conflit détecté (LWW < 5s)
  cached_workorders: 'id, status, type, priority, title, updatedAt, hasConflict',
  
  // Cache chiffré des Équipements / Assets
  cached_assets: 'id, type, code, status, buildingId, updatedAt, hasConflict',
  
  // Cache BIM & Espaces
  cached_bim_models: 'id, buildingId, name, updatedAt',
  cached_spaces: 'id, buildingId, name, updatedAt',

  // Métadonnées de synchronisation (dernière sync timestamp par entité)
  sync_metadata: 'key, lastSyncedAt'
});
