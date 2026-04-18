import { Audit, AuditTemplate } from '../types';

export function computeComplianceScore(audit: Audit, template: AuditTemplate): number {
  let totalWeight = 0;
  let earnedWeight = 0;

  template.sections.forEach(section => {
    section.questions.forEach(q => {
      const response = audit.responses[q.id];
      totalWeight += q.weight;
      
      if (response) {
        if (q.type === 'YES_NO' && response.value === true) earnedWeight += q.weight;
        if (q.type === 'SCORE' && typeof response.value === 'number') {
           earnedWeight += (response.value / 5) * q.weight;
        }
        if (q.type === 'TEXT' && typeof response.value === 'string' && response.value.trim().length > 0) {
           earnedWeight += q.weight;
        }
        // Points pour les preuves uploadées au lieu de pénaliser
        if (q.type === 'IMAGE' && response.evidenceUrl && response.evidenceUrl.length > 0) {
           earnedWeight += q.weight;
        }
      }
    });
  });

  return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}
