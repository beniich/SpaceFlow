import { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  Info, 
  Wrench, 
  CheckCircle2, 
  Layers, 
  User, 
  Tag, 
  Calendar,
  Trash2,
  Check
} from 'lucide-react';

const CATEGORIES = [
  { id: 'incident', label: 'Incident / Alerte', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  { id: 'maintenance', label: 'Maintenance / Travaux', icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'observation', label: 'Observation / Note', icon: Info, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  { id: 'validation', label: 'Validation / Conforme', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
];

const PRIORITIES = [
  { id: 'low', label: 'Faible', color: 'text-zinc-400 bg-zinc-800' },
  { id: 'medium', label: 'Moyenne', color: 'text-amber-300 bg-amber-950/60 border border-amber-800/40' },
  { id: 'high', label: 'Haute', color: 'text-orange-300 bg-orange-950/60 border border-orange-800/40' },
  { id: 'critical', label: 'Critique', color: 'text-red-300 bg-red-950/60 border border-red-800/40' },
];

const QUICK_SUGGESTIONS = [
  "Défaut d'étanchéité menuiserie",
  "Contrôle vibration CVC",
  "Réservation passage gaines",
  "Fissure de surface à surveiller",
  "Conformité coupe-feu validée",
  "Raccordement électrique non conforme"
];

export default function AnnotationModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  annotation, // if editing existing
  pendingPosition, // if creating new: { x, y, z, elementId, elementName, elementType }
}) {
  const isEditing = Boolean(annotation?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('incident');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('open');
  const [author, setAuthor] = useState('BIM Manager');
  const [elementId, setElementId] = useState('');
  const [elementName, setElementName] = useState('');
  const [elementType, setElementType] = useState('');
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (!isOpen) return;

    if (annotation) {
      setTitle(annotation.title || '');
      setDescription(annotation.description || '');
      setCategory(annotation.category || 'incident');
      setPriority(annotation.priority || 'medium');
      setStatus(annotation.status || 'open');
      setAuthor(annotation.author || 'BIM Manager');
      setElementId(annotation.elementId || '');
      setElementName(annotation.elementName || '');
      setElementType(annotation.elementType || '');
      setCoordinates(annotation.position || { x: 0, y: 0, z: 0 });
    } else if (pendingPosition) {
      setTitle('');
      setDescription('');
      setCategory('incident');
      setPriority('medium');
      setStatus('open');
      setAuthor('BIM Manager');
      setElementId(pendingPosition.elementId || '');
      setElementName(pendingPosition.elementName || '');
      setElementType(pendingPosition.elementType || '');
      setCoordinates({
        x: Number(pendingPosition.x?.toFixed(2)) || 0,
        y: Number(pendingPosition.y?.toFixed(2)) || 0,
        z: Number(pendingPosition.z?.toFixed(2)) || 0,
      });
    }
  }, [isOpen, annotation, pendingPosition]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data = {
      ...(annotation || {}),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      author: author.trim() || 'BIM Manager',
      elementId,
      elementName,
      elementType,
      position: coordinates,
      updatedAt: new Date().toISOString(),
      ...(isEditing ? {} : { id: `anno-${Date.now()}`, createdAt: new Date().toISOString() })
    };

    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 font-display uppercase tracking-wider">
                {isEditing ? "Modifier l'annotation 3D" : 'Nouvelle Annotation 3D'}
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Position 3D: X={coordinates.x} | Y={coordinates.y} | Z={coordinates.z}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-mono text-xs">
          {/* Linked Element Info */}
          {elementName && (
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between text-zinc-300">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Élément IFC Cible</span>
                  <span className="font-semibold text-zinc-200">{elementName}</span>
                </div>
              </div>
              {elementType && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                  {elementType.replace('Ifc', '')}
                </span>
              )}
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Type / Catégorie
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition ${
                      isSelected 
                        ? `${cat.bg} ${cat.color} font-bold ring-1 ring-cyan-500/50` 
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title input & suggestions */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Titre de l'annotation *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Défaut d'isolation thermique"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            
            {/* Quick Suggestions Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTitle(sug)}
                  className="text-[10px] bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-cyan-300 border border-zinc-800 px-2 py-0.5 rounded transition"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="open">En cours / Ouverte</option>
                <option value="pending">En attente / Bloquée</option>
                <option value="resolved">Résolue / Validée</option>
              </select>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Description & Remarques techniques
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Précisez la constatation technique, les mesures prises ou les actions correctives requises..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Author field */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Auteur / Responsable
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="BIM Manager"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Coordonnées 3D
              </label>
              <div className="grid grid-cols-3 gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={coordinates.x}
                  onChange={(e) => setCoordinates(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
                  className="bg-zinc-950 border border-zinc-700 rounded p-1.5 text-center text-zinc-200"
                  title="X"
                />
                <input
                  type="number"
                  step="0.1"
                  value={coordinates.y}
                  onChange={(e) => setCoordinates(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
                  className="bg-zinc-950 border border-zinc-700 rounded p-1.5 text-center text-zinc-200"
                  title="Y"
                />
                <input
                  type="number"
                  step="0.1"
                  value={coordinates.z}
                  onChange={(e) => setCoordinates(prev => ({ ...prev, z: parseFloat(e.target.value) || 0 }))}
                  className="bg-zinc-950 border border-zinc-700 rounded p-1.5 text-center text-zinc-200"
                  title="Z"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(annotation.id)}
                className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 rounded-lg font-semibold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-lg font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Check className="w-4 h-4" />
                {isEditing ? 'Enregistrer' : 'Placer Annotation'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
