import { Audit, AuditTemplate, KPI } from '../types';
import { computeComplianceScore } from './scoreEngine';

export function computeGlobalKPIs(audits: Audit[], templates: AuditTemplate[]): KPI[] {
  let totalScore = 0;
  let scoredAudits = 0;
  let inProgressAudits = 0;
  let risksDetected = 0;

  audits.forEach(audit => {
    if (audit.status === 'SUBMITTED') {
      const template = templates.find(t => t.id === audit.templateId);
      if (template) {
        totalScore += computeComplianceScore(audit, template);
        scoredAudits++;

        // Detect risks: scores below 3 or YES_NO = false
        template.sections.forEach(sec => {
          sec.questions.forEach(q => {
            const resp = audit.responses[q.id];
            if (resp && ((q.type === 'YES_NO' && resp.value === false) || (q.type === 'SCORE' && typeof resp.value === 'number' && resp.value < 3))) {
              risksDetected++;
            }
          });
        });
      }
    } else if (audit.status === 'IN_PROGRESS' || audit.status === 'DRAFT') {
      inProgressAudits++;
    }
  });

  const avgCompliance = scoredAudits > 0 ? (totalScore / scoredAudits) : 0;

  return [
    { title: 'Conformité Globale', value: avgCompliance > 0 ? `${avgCompliance.toFixed(1)}%` : 'N/A', trend: avgCompliance >= 80 ? 'up' : 'down', color: 'bg-emerald-500' },
    { title: 'Missions ouvertes', value: inProgressAudits, trend: 'neutral', color: 'bg-blue-500' },
    { title: 'Écarts & Risques', value: risksDetected, trend: risksDetected > 5 ? 'up' : 'down', color: 'bg-amber-500' },
    { title: 'Audits Complétés', value: scoredAudits, trend: 'up', color: 'bg-emerald-500' }
  ];
}

// Fonction pour récupérer l'évolution des scores
export function getScoreTrend(audits: Audit[], templates: AuditTemplate[]): number[] {
  const submitted = audits.filter(a => a.status === 'SUBMITTED').sort((a, b) => {
    // Trier par timestamp du dernier event. Simplification: ordre de l'array
    return 1;
  });
  
  return submitted.map(a => {
     const tpl = templates.find(t => t.id === a.templateId);
     return tpl ? computeComplianceScore(a, tpl) : 0;
  }).filter(s => s > 0);
}
