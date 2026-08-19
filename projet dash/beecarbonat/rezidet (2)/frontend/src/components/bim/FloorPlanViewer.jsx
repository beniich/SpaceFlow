/**
 * FloorPlanViewer — Plan 2D interactif avec calques annotables
 * 
 * Fonctionnalités :
 * - Affichage plan PDF/image (via iframe ou img)
 * - Overlay SVG pour les annotations (assets, WO, alertes)
 * - Clic sur annotation → panneau détail asset/WO
 * - Ajout d'annotation en mode édition
 * - Compatible mobile-first (touch pan/zoom via CSS)
 */
import { useState, useRef, useCallback } from 'react';
import { useAssetFromBIM } from '../../features/bim/hooks/useAssetFromBIM';
import { MapPin, Wrench, AlertTriangle, Plus, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Types d'annotations avec couleurs
const ANNOTATION_TYPES = {
  asset:    { color: '#00dbe7', icon: '⚙', label: 'Asset' },
  workorder:{ color: '#f38020', icon: '🔧', label: 'Work Order' },
  alert:    { color: '#ef4444', icon: '⚠', label: 'Alerte' },
  note:     { color: '#a855f7', icon: '📝', label: 'Note' }
};

export default function FloorPlanViewer({ 
  planUrl, 
  annotations = [], 
  onAnnotationClick,
  onAddAnnotation,
  editMode = false,
  className = ''
}) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [newAnnotationPos, setNewAnnotationPos] = useState(null);

  // Récupérer l'asset sélectionné depuis BIM si ifcGuid dispo
  const selectedIfcGuid = selectedAnnotation?.ifcGuid || null;
  const { data: assetData } = useAssetFromBIM(selectedIfcGuid);

  // ── Gestion du zoom ──────────────────────────────────────────────────────────
  const handleZoom = useCallback((delta) => {
    setZoom(z => Math.min(Math.max(z + delta, 0.3), 4));
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // ── Pan (clic + glisser) ─────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('[data-annotation]')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  // ── Clic sur le plan en mode édition ─────────────────────────────────────────
  const handlePlanClick = useCallback((e) => {
    if (!editMode || isPanning) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - pan.x) / (rect.width * zoom)) * 100;
    const y = ((e.clientY - rect.top - pan.y) / (rect.height * zoom)) * 100;
    setNewAnnotationPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, [editMode, isPanning, pan, zoom]);

  if (!planUrl) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900/40 rounded-xl border border-dashed border-zinc-700 min-h-[300px] ${className}`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Aucun plan disponible pour cet étage</p>
          {editMode && (
            <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 rounded-lg text-brand-orange text-sm cursor-pointer hover:bg-brand-orange/20 transition-colors">
              <Plus className="w-4 h-4" />
              Importer un plan
              <input type="file" accept=".pdf,.png,.jpg,.svg" className="hidden" />
            </label>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => handleZoom(0.2)} className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => handleZoom(-0.2)} className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={resetView} className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
        <span className="text-zinc-500 text-xs font-mono ml-1">{Math.round(zoom * 100)}%</span>
        {editMode && (
          <span className="ml-auto text-xs font-mono text-brand-orange border border-brand-orange/30 px-2 py-0.5 rounded">
            MODE ÉDITION — Cliquer pour ajouter
          </span>
        )}
      </div>

      {/* ── Conteneur plan ──────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 cursor-grab active:cursor-grabbing select-none"
        style={{ minHeight: 400 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handlePlanClick}
      >
        {/* Plan image/PDF */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease'
          }}
          className="relative w-full"
        >
          {planUrl.endsWith('.pdf') ? (
            <iframe src={planUrl} className="w-full" style={{ height: 500, border: 'none' }} title="Plan 2D" />
          ) : (
            <img src={planUrl} alt="Plan de l'étage" className="w-full h-auto" draggable={false} />
          )}

          {/* ── Annotations SVG overlay ──────────────────────────────────────── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {annotations.map((ann) => {
              const config = ANNOTATION_TYPES[ann.type] || ANNOTATION_TYPES.note;
              const isSelected = selectedAnnotation?.id === ann.id;
              return (
                <g key={ann.id} style={{ pointerEvents: 'all' }}>
                  {/* Pulse d'alerte pour les WO critiques */}
                  {ann.type === 'alert' && (
                    <circle cx={ann.x} cy={ann.y} r="3" fill={config.color} opacity="0.3">
                      <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={ann.x} cy={ann.y} r={isSelected ? 3 : 2}
                    fill={config.color}
                    stroke="white"
                    strokeWidth="0.5"
                    data-annotation
                    style={{ cursor: 'pointer', filter: isSelected ? `drop-shadow(0 0 4px ${config.color})` : 'none' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAnnotation(isSelected ? null : ann);
                      onAnnotationClick?.(ann);
                    }}
                  />
                  {/* Label */}
                  <text
                    x={ann.x + 2.5} y={ann.y - 2}
                    fontSize="3" fill={config.color}
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                    fontFamily="monospace"
                  >
                    {ann.label?.slice(0, 12)}
                  </text>
                </g>
              );
            })}

            {/* Nouvelle annotation en cours */}
            {newAnnotationPos && (
              <circle
                cx={newAnnotationPos.x} cy={newAnnotationPos.y}
                r="2.5" fill="#f38020" stroke="white" strokeWidth="0.5"
                strokeDasharray="1"
                style={{ animation: 'pulse 1s infinite' }}
              />
            )}
          </svg>
        </div>
      </div>

      {/* ── Panneau détail annotation sélectionnée ───────────────────────────── */}
      {selectedAnnotation && (
        <div className="mt-3 p-4 bg-zinc-900/80 border border-zinc-700 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{ANNOTATION_TYPES[selectedAnnotation.type]?.icon}</span>
            <span className="font-mono text-sm text-zinc-200 font-semibold">{selectedAnnotation.label}</span>
            <span className="ml-auto text-xs font-mono text-zinc-500 uppercase">{selectedAnnotation.type}</span>
          </div>
          {assetData && (
            <div className="text-xs font-mono text-zinc-400 space-y-1">
              <div>Catégorie : <span className="text-zinc-200">{assetData.category}</span></div>
              <div>Statut : <span className="text-zinc-200">{assetData.status}</span></div>
              <div>Score santé : <span className="text-zinc-200">{assetData.healthScore}%</span></div>
              {assetData.workOrders?.length > 0 && (
                <div className="mt-2 text-brand-orange">
                  {assetData.workOrders.length} WO actif(s)
                </div>
              )}
            </div>
          )}
          {selectedAnnotation.description && (
            <p className="text-xs text-zinc-500 mt-2">{selectedAnnotation.description}</p>
          )}
        </div>
      )}

      {/* ── Formulaire nouvelle annotation ───────────────────────────────────── */}
      {newAnnotationPos && editMode && (
        <div className="mt-3 p-4 bg-zinc-900/80 border border-brand-orange/30 rounded-xl">
          <p className="text-xs font-mono text-zinc-400 mb-3">
            Nouvelle annotation à ({newAnnotationPos.x.toFixed(1)}%, {newAnnotationPos.y.toFixed(1)}%)
          </p>
          <div className="flex gap-2">
            {Object.entries(ANNOTATION_TYPES).map(([type, config]) => (
              <button
                key={type}
                onClick={() => {
                  onAddAnnotation?.({ ...newAnnotationPos, type, label: config.label });
                  setNewAnnotationPos(null);
                }}
                className="flex-1 py-1.5 rounded text-xs font-mono transition-colors"
                style={{ backgroundColor: `${config.color}20`, color: config.color, border: `1px solid ${config.color}40` }}
              >
                {config.icon} {config.label}
              </button>
            ))}
            <button
              onClick={() => setNewAnnotationPos(null)}
              className="px-3 py-1.5 rounded text-xs font-mono bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
