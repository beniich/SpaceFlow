/**
 * WOTemplateSelector — Sélecteur de templates de Work Orders
 * Permet de créer un WO pré-rempli depuis un template défini par l'admin.
 */
import { useState } from 'react';
import { useWOTemplates } from '../../hooks/useWorkOrderMutation';
import { FileText, ChevronRight, Star, Clock, DollarSign } from 'lucide-react';

const PRIORITY_COLORS = {
  LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f38020', CRITICAL: '#ef4444'
};

const TYPE_LABELS = {
  CORRECTIVE: '🔧 Correctif',
  PREVENTIVE: '📅 Préventif',
  PREDICTIVE: '🔮 Prédictif',
  INSPECTION: '🔍 Inspection',
  EMERGENCY: '🚨 Urgence'
};

export default function WOTemplateSelector({ onSelect, assetCategory }) {
  const [selectedType, setSelectedType] = useState('');
  const { data: templates = [], isLoading } = useWOTemplates(selectedType || undefined);

  // Filtrer par catégorie d'asset si fournie
  const filtered = assetCategory
    ? templates.filter(t => !t.assetCategory || t.assetCategory === assetCategory)
    : templates;

  return (
    <div className="space-y-4">
      {/* Filtre par type */}
      <div className="flex flex-wrap gap-2">
        {['', 'CORRECTIVE', 'PREVENTIVE', 'PREDICTIVE', 'INSPECTION', 'EMERGENCY'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              selectedType === type
                ? 'bg-brand-orange text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {type ? TYPE_LABELS[type] : '📋 Tous'}
          </button>
        ))}
      </div>

      {/* Liste templates */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 text-sm font-mono">
          <FileText className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
          Aucun template disponible
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(template => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className="w-full text-left p-4 bg-zinc-900 border border-zinc-800 hover:border-brand-orange/40 rounded-xl transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PRIORITY_COLORS[template.priority] }}
                    />
                    <span className="font-sans font-semibold text-sm text-zinc-200 truncate">{template.name}</span>
                    {template.isGlobal && (
                      <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-mono text-zinc-500 line-clamp-2">{template.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs font-mono text-zinc-600">
                      {TYPE_LABELS[template.type]}
                    </span>
                    {template.estimatedHours && (
                      <span className="flex items-center gap-1 text-xs font-mono text-zinc-600">
                        <Clock className="w-3 h-3" />{template.estimatedHours}h
                      </span>
                    )}
                    {template.estimatedCost && (
                      <span className="flex items-center gap-1 text-xs font-mono text-zinc-600">
                        <DollarSign className="w-3 h-3" />{template.estimatedCost}€
                      </span>
                    )}
                    {template.usageCount > 0 && (
                      <span className="text-xs font-mono text-zinc-700">× {template.usageCount}</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-brand-orange transition-colors flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
