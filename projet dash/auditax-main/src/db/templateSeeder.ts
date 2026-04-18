import db from './database';
import { SAFETY_TEMPLATE } from '../services/AuditService';

export function seedTemplates() {
  const existing = db.prepare('SELECT id FROM audit_templates WHERE id = ?').get('tpl-safety');
  
  if (!existing) {
    console.log('Seeding initial audit templates...');
    const stmt = db.prepare(`INSERT INTO audit_templates (id, title, description, version, content, created_at) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(
      SAFETY_TEMPLATE.id,
      SAFETY_TEMPLATE.title,
      SAFETY_TEMPLATE.description,
      SAFETY_TEMPLATE.version,
      JSON.stringify(SAFETY_TEMPLATE.sections),
      new Date().toISOString()
    );
  }
}
