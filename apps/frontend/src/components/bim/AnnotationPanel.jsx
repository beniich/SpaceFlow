import { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Info, 
  Wrench, 
  CheckCircle2, 
  ChevronRight, 
  Trash2, 
  Edit3, 
  Eye, 
  Layers, 
  Clock, 
  Download,
  CheckCircle,
  RotateCcw
} from 'lucide-react';

const CATEGORY_MAP = {
  incident: { label: 'Incident', color: 'text-red-400', bg: 'bg-red-950/60 border-red-800/60', icon: AlertTriangle },
  maintenance: { label: 'Travaux', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-800/60', icon: Wrench },
  observation: { label: 'Note', color: 'text-cyan-400', bg: 'bg-cyan-950/60 border-cyan-800/60', icon: Info },
  validation: { label: 'Validé', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800/60', icon: CheckCircle2 },
};

const PRIORITY_BADGES = {
  low: { label: 'Faible', bg: 'bg-zinc-800 text-zinc-400' },
  medium: { label: 'Moyenne', bg: 'bg-amber-950 text-amber-300 border border-amber-800/50' },
  high: { label: 'Haute', bg: 'bg-orange-950 text-orange-300 border border-orange-800/50' },
  critical: { label: 'Critique', bg: 'bg-red-950 text-red-300 border border-red-800/50 animate-pulse' },
};

export default function AnnotationPanel({
  annotations = [],
  selectedAnnotationId,
  onSelectAnnotation,
  onEditAnnotation,
  onDeleteAnnotation,
  onToggleStatus,
  onAddNew,
  isPlacingMode,
  onTogglePlacingMode,
  onFocusAnnotation
}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnnotations = annotations.filter((anno) => {
    if (filterCategory !== 'all' && anno.category !== filterCategory) return false;
    if (filterStatus !== 'all' && anno.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = anno.title?.toLowerCase().includes(q);
      const matchDesc = anno.description?.toLowerCase().includes(q);
      const matchEl = anno.elementName?.toLowerCase().includes(q);
      const matchAuthor = anno.author?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchEl && !matchAuthor) return false;
    }
    return true;
  });

  const exportAnnotationsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(annotations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bim_annotations_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-[550px] overflow-hidden font-mono text-xs text-zinc-300 flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-zinc-200">Annotations 3D ({annotations.length})</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={exportAnnotationsJSON}
              title="Exporter les annotations au format JSON"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onTogglePlacingMode}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                isPlacingMode
                  ? 'bg-amber-500 text-zinc-950 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              {isPlacingMode ? 'Placer...' : 'Ajouter'}
            </button>
          </div>
        </div>

        {/* Placing instruction hint when active */}
        {isPlacingMode && (
          <div className="p-2 bg-amber-950/50 border border-amber-600/40 rounded-lg text-amber-300 text-[11px] flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Cliquez sur la maquette 3D pour épingler
            </span>
            <button
              onClick={onTogglePlacingMode}
              className="text-[10px] underline hover:text-white"
            >
              Annuler
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher annotations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 text-[11px]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded p-1 text-[10px] text-zinc-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Toutes catégories</option>
            <option value="incident">Incidents</option>
            <option value="maintenance">Maintenance</option>
            <option value="observation">Observations</option>
            <option value="validation">Validations</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded p-1 text-[10px] text-zinc-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tous statuts</option>
            <option value="open">En cours</option>
            <option value="pending">En attente</option>
            <option value="resolved">Résolues</option>
          </select>
        </div>
      </div>

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto my-2 pr-1 space-y-2">
        {filteredAnnotations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-zinc-500">
            <MapPin className="w-8 h-8 text-zinc-700 mb-2" />
            <p className="text-[11px]">Aucune annotation trouvée.</p>
            <p className="text-[10px] text-zinc-600 mt-1">
              Activez le mode d'ajout et cliquez sur le modèle 3D pour créer une annotation.
            </p>
          </div>
        ) : (
          filteredAnnotations.map((anno, idx) => {
            const cat = CATEGORY_MAP[anno.category] || CATEGORY_MAP.observation;
            const Icon = cat.icon;
            const isSelected = anno.id === selectedAnnotationId;
            const priorityBadge = PRIORITY_BADGES[anno.priority] || PRIORITY_BADGES.low;

            return (
              <div
                key={anno.id}
                onClick={() => {
                  onSelectAnnotation(anno.id);
                  if (onFocusAnnotation) onFocusAnnotation(anno);
                }}
                className={`p-2.5 rounded-lg border transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-zinc-800/90 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                    : 'bg-zinc-950/70 border-zinc-800/80 hover:bg-zinc-800/40 hover:border-zinc-700'
                }`}
              >
                {/* Top Row: Index Badge, Category, Priority, Status */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 shrink-0">
                      #{idx + 1}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border ${cat.bg} ${cat.color} shrink-0`}>
                      <Icon className="w-2.5 h-2.5" />
                      {cat.label}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${priorityBadge.bg} shrink-0`}>
                      {priorityBadge.label}
                    </span>
                  </div>

                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    anno.status === 'resolved'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                      : anno.status === 'pending'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                  }`}>
                    {anno.status === 'resolved' ? 'Résolu' : anno.status === 'pending' ? 'Attente' : 'En cours'}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-zinc-100 text-xs truncate mb-1">
                  {anno.title}
                </h4>

                {/* Description snippet */}
                {anno.description && (
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 leading-relaxed">
                    {anno.description}
                  </p>
                )}

                {/* Target IFC element info */}
                {anno.elementName && (
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900/90 px-1.5 py-0.5 rounded border border-zinc-800 mb-2 truncate">
                    <Layers className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{anno.elementName}</span>
                  </div>
                )}

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1.5 border-t border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <span>{anno.author || 'BIM Mgr'}</span>
                    <span>•</span>
                    <span className="font-mono">({anno.position.x}, {anno.position.y}, {anno.position.z})</span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleStatus && onToggleStatus(anno.id)}
                      title={anno.status === 'resolved' ? 'Marquer comme en cours' : 'Marquer comme résolu'}
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition"
                    >
                      {anno.status === 'resolved' ? <RotateCcw className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => onEditAnnotation && onEditAnnotation(anno)}
                      title="Modifier"
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-cyan-400 transition"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteAnnotation && onDeleteAnnotation(anno.id)}
                      title="Supprimer"
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
        <span>{filteredAnnotations.length} affichée(s)</span>
        <span className="text-zinc-400">Clic sur une note = focus 3D</span>
      </div>
    </div>
  );
}
