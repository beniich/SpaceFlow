import crypto from 'crypto';
import { AuditEvent } from '../types';

/**
 * Calcule le hash d'un événement en incluant le hash du précédent
 * → Forme une chaîne (blockchain simplifiée) assurant la non-répudiation
 */
export function computeEventHash(event: AuditEvent, previousHash: string = '0'.repeat(64)): string {
  const data = JSON.stringify({
    id: event.id,
    auditId: event.auditId,
    type: event.type,
    timestamp: event.timestamp,
    userId: event.userId,
    payload: event.payload,
    previousHash
  });
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Vérifie l'intégrité de toute la chaîne d'événements
 */
export function verifyEventChain(events: (AuditEvent & { sha256_hash: string })[]): {
  valid: boolean;
  compromisedAt?: string;
} {
  let previousHash = '0'.repeat(64);
  for (const event of events) {
    const expectedHash = computeEventHash(event, previousHash);
    if (expectedHash !== event.sha256_hash) {
      return { valid: false, compromisedAt: event.id };
    }
    previousHash = event.sha256_hash;
  }
  return { valid: true };
}
