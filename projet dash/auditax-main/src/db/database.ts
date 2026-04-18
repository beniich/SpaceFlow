import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');

// S'assurer que le dossier data existe
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, 'auditax.db');

export const db = new Database(DB_PATH);

// Activer WAL pour les performances
db.pragma('journal_mode = WAL');

// Créer les tables si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    audit_id TEXT NOT NULL,
    type TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    user_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    sha256_hash TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_audit_events_audit_id ON audit_events(audit_id);
  CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp);

  CREATE TABLE IF NOT EXISTS audit_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export default db;
