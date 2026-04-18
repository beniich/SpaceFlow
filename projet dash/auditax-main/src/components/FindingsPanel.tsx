import React from 'react';
import { Audit, AuditTemplate, AuditQuestion } from '../types';
import { AlertTriangle, Clock } from 'lucide-react';

export const FindingsPanel = ({ audit, template }: { audit: Audit, template: AuditTemplate }) => {
  const findings: { question: AuditQuestion, section: string, response: any }[] = [];

  template.sections.forEach(sec => {
    sec.questions.forEach(q => {
      const resp = audit.responses[q.id];
      // Vérifier si c'est une non-conformité
      if (resp && ((q.type === 'YES_NO' && resp.value === false) || (q.type === 'SCORE' && typeof resp.value === 'number' && resp.value < 3))) {
        findings.push({ question: q, section: sec.title, response: resp });
      }
    });
  });

  if (findings.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center shadow-sm">
         <h4 className="font-bold text-emerald-800">Aucune trouvaille d'audit</h4>
         <p className="text-sm text-emerald-600 mt-1">L'entité satisfait tous les critères vérifiés.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-amber-100 text-amber-600 flex items-center justify-center">
          <AlertTriangle size={18} />
        </div>
        <div>
          <h3 className="font-bold text-brand-text-main">Actions Correctives (CAPA)</h3>
          <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">{findings.length} Écarts détectés</p>
        </div>
      </div>

      <div className="grid gap-4 mt-2">
        {findings.map((f, i) => (
          <div key={i} className="bg-white border-l-4 border-l-amber-500 border border-brand-border p-5 rounded-r-xl shadow-sm">
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-text-muted mb-1">{f.section}</div>
            <h4 className="text-sm font-bold text-brand-text-main mb-4">{f.question.text}</h4>
            
            <div className="flex gap-4">
              <textarea 
                className="flex-1 bg-slate-50 border border-brand-border rounded p-3 text-xs resize-none focus:border-amber-500 focus:outline-none"
                placeholder="Décrire l'action corrective ou préventive..."
                rows={2}
              ></textarea>
              <div className="w-48 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-2 border border-brand-border rounded bg-slate-50 text-xs">
                  <Clock size={14} className="text-slate-400" />
                  <input type="date" className="bg-transparent focus:outline-none w-full text-brand-text-main" />
                </div>
                <button className="bg-brand-sidebar text-white text-[10px] font-bold uppercase tracking-widest rounded py-2 opacity-90 hover:opacity-100">
                  Assigner
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
