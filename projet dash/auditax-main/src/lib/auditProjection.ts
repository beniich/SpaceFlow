import { Audit, AuditEvent, AuditStatus, AuditResponse } from '../types';

export const projectAudit = (events: AuditEvent[]): Audit | null => {
  if (events.length === 0) return null;

  // Find the initialization event
  const initEvent = events.find(e => e.type === 'AUDIT_STARTED');
  if (!initEvent) return null;

  const audit: Audit = {
    id: initEvent.auditId,
    templateId: initEvent.payload.templateId,
    status: 'DRAFT',
    auditorId: initEvent.userId,
    entityId: initEvent.payload.entityId,
    startedAt: initEvent.timestamp,
    responses: {},
    gpsLocation: initEvent.payload.gpsLocation
  };

  // Re-apply all events in order
  events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .forEach(event => {
      switch (event.type) {
        case 'STATUS_CHANGED':
          audit.status = event.payload.status as AuditStatus;
          if (audit.status === 'SUBMITTED') {
            audit.submittedAt = event.timestamp;
          }
          break;
        case 'RESPONSE_UPDATED':
          const resp = event.payload as AuditResponse;
          audit.responses[resp.questionId] = {
            ...resp,
            timestamp: event.timestamp
          };
          break;
        case 'EVIDENCE_ADDED': {
          const { questionId, url } = event.payload;
          if (!audit.responses[questionId]) {
            audit.responses[questionId] = { questionId, value: null, timestamp: event.timestamp };
          }
          audit.responses[questionId].evidenceUrl = [
            ...(audit.responses[questionId].evidenceUrl || []),
            url
          ];
          break;
        }
      }
    });

  return audit;
};
