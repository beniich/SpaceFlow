import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Play } from 'lucide-react';
import { AuditTemplate } from '../types';

interface NewAuditModalProps {
  templates: AuditTemplate[];
  onClose: () => void;
  onStart: (templateId: string, entityId: string) => void;
}

export const NewAuditModal = ({ templates, onClose, onStart }: NewAuditModalProps) => {
  const [templateId, setTemplateId] = useState(templates[0]?.id || '');
  const [entityId, setEntityId] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl border border-brand-border shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-brand-border bg-slate-50">
          <h3 className="font-bold text-brand-text-main">Nouvelle Mission de Terrain</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">
              Référentiel / Template
            </label>
            <select 
              value={templateId} 
              onChange={(e) => setTemplateId(e.target.value)}
              className="px-4 py-3 bg-white border border-brand-border rounded-lg text-sm text-brand-text-main focus:outline-none focus:border-brand-accent transition-all"
            >
              {templates.map(tpl => (
                <option key={tpl.id} value={tpl.id}>{tpl.title} (v{tpl.version})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">
              Entité / Site
            </label>
            <input 
              type="text" 
              placeholder="Ex: Usine Lyon-Sud"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              className="px-4 py-3 bg-white border border-brand-border rounded-lg text-sm text-brand-text-main focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>
        </div>

        <div className="p-6 border-t border-brand-border flex justify-end gap-3 bg-slate-50">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-xs font-bold text-brand-text-muted hover:bg-slate-200 transition-all uppercase tracking-widest"
          >
            Annuler
          </button>
          <button 
            onClick={() => {
              if (templateId && entityId) onStart(templateId, entityId);
            }}
            disabled={!templateId || !entityId}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-sidebar text-white text-xs font-bold shadow-md hover:bg-brand-sidebar/90 hover:shadow-lg disabled:opacity-50 transition-all uppercase tracking-widest"
          >
            <Play size={14} /> Démarrer Audit
          </button>
        </div>
      </motion.div>
    </div>
  );
};
