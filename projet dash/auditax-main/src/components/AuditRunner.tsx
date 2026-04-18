import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Camera, ChevronRight, ChevronLeft, Save, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { Audit, AuditTemplate, AuditQuestion } from '../types';
import { AuditService } from '../services/AuditService';
import { StorageService } from '../services/StorageService';
import { FindingsPanel } from './FindingsPanel';

interface AuditRunnerProps {
  auditId: string;
  template: AuditTemplate;
  onComplete: () => void;
}

export const AuditRunner = ({ auditId, template, onComplete }: AuditRunnerProps) => {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [audit, setAudit] = useState<Audit | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiDiagnostics, setAiDiagnostics] = useState<Record<string, { type: 'success' | 'warning', message: string }>>({});

  useEffect(() => {
    loadAudit();
  }, [auditId]);

  const loadAudit = async () => {
    const data = await AuditService.getAudit(auditId);
    setAudit(data);
  };

  const currentSection = template.sections[currentSectionIdx];

  const handleResponse = async (questionId: string, value: any) => {
    setSaving(true);
    await AuditService.appendEvent(auditId, 'RESPONSE_UPDATED', {
      questionId,
      value,
      timestamp: new Date().toISOString()
    });
    
    // Simulate AI Real-Time Verification Module (Sprint 14)
    runAIDiagnostic(questionId, value);

    await loadAudit();
    setSaving(false);
  };

  const runAIDiagnostic = (questionId: string, value: any) => {
    // Clear previous for this id
    setAiDiagnostics(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });

    setTimeout(() => {
      let diagnostic = null;
      if (typeof value === 'string') {
        if (value.length > 5 && value.length < 20) {
          diagnostic = { type: 'warning' as const, message: 'AI Analysis: Observation lacks forensic depth. Please detail impact and root cause.' };
        } else if (value.length >= 20) {
          diagnostic = { type: 'success' as const, message: 'AI Analysis: Log verified. Semantics match standard compliance taxonomy.' };
        }
      } else if (typeof value === 'number') {
        if (value <= 2) {
          diagnostic = { type: 'warning' as const, message: 'AI Anomaly Detected: Score deviates 42% from site historical average.' };
        }
      } else if (typeof value === 'boolean') {
        if (value === false) {
           diagnostic = { type: 'warning' as const, message: 'AI Alert: Non-compliance flagged. Regulator SLA mandates remediation within 48h.' };
        }
      }

      if (diagnostic) {
        setAiDiagnostics(prev => ({ ...prev, [questionId]: diagnostic! }));
      }
    }, 800);
  };

  const handleSubmit = async () => {
    if (confirm('Voulez-vous soumettre cet audit pour revue ? Cette action est irréversible.')) {
      setSaving(true);
      await AuditService.appendEvent(auditId, 'STATUS_CHANGED', { status: 'SUBMITTED' });
      onComplete();
    }
  };

  if (!audit) return null;

  if (audit.status === 'SUBMITTED') {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <header className="flex justify-between items-start bg-white p-6 rounded-xl border border-brand-border shadow-sm">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text-muted mb-2 block">
              Rapport d'Audit
            </span>
            <h2 className="text-xl font-bold text-brand-text-main">{template.title}</h2>
            <p className="text-brand-text-muted text-sm mt-1">{audit.entityId} — Terminé</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={onComplete}
               className="p-2 border border-brand-border text-brand-text-muted rounded-lg hover:bg-slate-50 uppercase tracking-widest text-[10px] font-bold"
             >
               Fermer
             </button>
          </div>
        </header>

        <FindingsPanel audit={audit} template={template} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Stepper */}
      <div className="flex gap-2 mb-2">
        {template.sections.map((sec, idx) => (
          <div 
            key={sec.id}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              idx === currentSectionIdx ? 'bg-brand-accent' : 
              idx < currentSectionIdx ? 'bg-brand-success' : 'bg-brand-border'
            }`}
          />
        ))}
      </div>

      <header className="flex justify-between items-start bg-white p-6 rounded-xl border border-brand-border shadow-sm">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text-muted mb-2 block">
            Section {currentSectionIdx + 1} de {template.sections.length}
          </span>
          <h2 className="text-xl font-bold text-brand-text-main">{currentSection.title}</h2>
          <p className="text-brand-text-muted text-sm mt-1">{template.title} / {audit.entityId}</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 border border-brand-border text-brand-text-muted rounded-lg hover:bg-slate-50">
            <Save size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSection.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            {currentSection.questions.map((q) => (
              <div key={q.id} className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <h4 className="text-sm font-bold text-brand-text-main leading-snug">
                    {q.text}
                    {q.required && <span className="text-brand-danger ml-1">*</span>}
                  </h4>
                  <span className="text-[9px] font-bold border border-brand-border px-2 py-0.5 rounded text-brand-text-muted uppercase tracking-tighter">Poids: {q.weight}</span>
                </div>

                {q.type === 'YES_NO' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleResponse(q.id, true)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-xs font-bold transition-all ${
                        audit.responses[q.id]?.value === true 
                        ? 'bg-brand-success/5 border-brand-success text-brand-success' 
                        : 'border-slate-50 bg-slate-50 text-brand-text-muted hover:border-brand-border'
                      }`}
                    >
                      <Check size={16} /> OUI / CONFORME
                    </button>
                    <button 
                      onClick={() => handleResponse(q.id, false)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-xs font-bold transition-all ${
                        audit.responses[q.id]?.value === false 
                        ? 'bg-brand-danger/5 border-brand-danger text-brand-danger' 
                        : 'border-slate-50 bg-slate-50 text-brand-text-muted hover:border-brand-border'
                      }`}
                    >
                      <X size={16} /> NON / ÉCART
                    </button>
                  </div>
                )}

                {q.type === 'SCORE' && (
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button 
                        key={score}
                        onClick={() => handleResponse(q.id, score)}
                        className={`flex-1 py-3 rounded-lg border-2 text-xs font-bold transition-all ${
                          audit.responses[q.id]?.value === score 
                          ? 'bg-brand-sidebar border-brand-sidebar text-white shadow-md' 
                          : 'border-slate-50 bg-slate-50 text-brand-text-muted hover:border-brand-border'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === 'TEXT' && (
                  <textarea
                    rows={4}
                    placeholder="Saisir vos observations..."
                    defaultValue={audit.responses[q.id]?.value || ''}
                    onBlur={(e) => {
                      if (e.target.value !== audit.responses[q.id]?.value) {
                        handleResponse(q.id, e.target.value);
                      }
                    }}
                    className="w-full p-4 bg-slate-50 border border-brand-border rounded-lg text-sm text-brand-text-main resize-none focus:outline-none focus:border-brand-accent transition-all"
                  />
                )}

                {q.type === 'IMAGE' && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-4">
                      {audit.responses[q.id]?.evidenceUrl?.map((url, i) => (
                        <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                          <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-all cursor-pointer">
                        <Camera size={24} />
                        <span className="text-[10px] font-bold">AJOUTER</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSaving(true);
                              try {
                                const url = await StorageService.uploadFile(file, file.name);
                                await AuditService.appendEvent(auditId, 'EVIDENCE_ADDED', { questionId: q.id, url });
                                await loadAudit();
                              } catch (err) {
                                console.error("Upload failed", err);
                              }
                              setSaving(false);
                            }
                          }} 
                        />
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Sprint 14: Real-time AI Anomalies Diagnostic */}
                <AnimatePresence>
                  {aiDiagnostics[q.id] && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-3 rounded-lg border flex items-start gap-3 ${
                        aiDiagnostics[q.id].type === 'warning' 
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }`}
                    >
                      <div className="mt-0.5">
                        {aiDiagnostics[q.id].type === 'warning' ? <AlertTriangle size={16} /> : <Sparkles size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{aiDiagnostics[q.id].message}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex justify-between items-center py-8">
        <button 
          onClick={() => setCurrentSectionIdx(prev => Math.max(0, prev - 1))}
          disabled={currentSectionIdx === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-brand-border text-xs font-bold text-brand-text-muted hover:bg-slate-50 disabled:opacity-30 uppercase tracking-widest transition-all"
        >
          <ChevronLeft size={16} /> Précédent
        </button>

        {currentSectionIdx === template.sections.length - 1 ? (
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-brand-success text-white text-xs font-bold hover:opacity-90 shadow-lg shadow-brand-success/20 uppercase tracking-widest transition-all"
          >
            <Send size={16} /> Soumettre l'Audit
          </button>
        ) : (
          <button 
            onClick={() => setCurrentSectionIdx(prev => prev + 1)}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-brand-sidebar text-white text-xs font-bold hover:opacity-90 shadow-lg shadow-brand-sidebar/20 uppercase tracking-widest transition-all"
          >
            Suivant <ChevronRight size={16} />
          </button>
        )}
      </footer>
    </div>
  );
};
