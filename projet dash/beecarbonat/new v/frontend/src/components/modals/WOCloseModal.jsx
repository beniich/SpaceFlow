/**
 * WOCloseModal — Modal de clôture d'intervention terrain (mobile-first)
 * 
 * Fonctionnalités :
 * - Champ notes texte
 * - Pad de signature numérique (canvas)
 * - Ajout photos (camera mobile / upload)
 * - Heures de main d'œuvre + coût réel
 * - Support offline via hook useCloseWorkOrder
 */
import { useRef, useState, useEffect } from 'react';
import { CheckCircle, Pen, Camera, X, Clock, DollarSign, RotateCcw } from 'lucide-react';
import { useCloseWorkOrder } from '../../hooks/useWorkOrderMutation';

export default function WOCloseModal({ workOrder, onClose, onSuccess }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [laborHours, setLaborHours] = useState('');
  const [actualCost, setActualCost] = useState(workOrder?.estimatedCost || '');
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const { mutate: closeWO, isPending } = useCloseWorkOrder();

  // ── Initialiser le canvas de signature ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#00dbe7';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Fond transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // ── Helpers position (souris + touch) ──────────────────────────────────────
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0] || e;
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  // ── Dessin signature ──────────────────────────────────────────────────────────
  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);
    setIsDrawing(true);
    setLastPos(pos);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setLastPos(pos);
    setHasSignature(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // ── Ajout photos ──────────────────────────────────────────────────────────────
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos(prev => [...prev, { dataUrl: ev.target.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // ── Soumettre la clôture ──────────────────────────────────────────────────────
  const handleSubmit = () => {
    const signatureDataUrl = hasSignature ? canvasRef.current.toDataURL('image/png') : null;
    const photoUrls = photos.map(p => p.dataUrl); // En prod : uploader sur S3 d'abord

    closeWO(
      {
        id: workOrder.id,
        closureData: {
          notes,
          signatureDataUrl,
          photoUrls,
          laborHours: laborHours ? parseFloat(laborHours) : null,
          actualCost: actualCost ? parseFloat(actualCost) : null
        }
      },
      { onSuccess: () => { onSuccess?.(); onClose?.(); } }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-sans font-bold text-zinc-100 text-sm">Clôturer l'intervention</h2>
              <p className="text-xs font-mono text-zinc-500 mt-0.5 truncate max-w-[200px]">{workOrder?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Notes */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wide">
              Rapport d'intervention
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Décrivez les actions réalisées, les pièces remplacées..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-brand-orange/50 transition-colors"
              rows={4}
            />
          </div>

          {/* Heures + Coût */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wide">
                <Clock className="w-3.5 h-3.5" /> Heures MO
              </label>
              <input
                type="number"
                value={laborHours}
                onChange={e => setLaborHours(e.target.value)}
                placeholder="0.0"
                step="0.5"
                min="0"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-brand-orange/50"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wide">
                <DollarSign className="w-3.5 h-3.5" /> Coût réel (€)
              </label>
              <input
                type="number"
                value={actualCost}
                onChange={e => setActualCost(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-brand-orange/50"
              />
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wide">
              <Camera className="w-3.5 h-3.5" /> Photos ({photos.length})
            </label>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-500 transition-colors">
              <Camera className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-500">Ajouter des photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment" // Ouvre la caméra sur mobile
                className="hidden"
                onChange={handlePhotos}
              />
            </label>
            {photos.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {photos.map((p, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <img src={p.dataUrl} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Signature */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wide">
                <Pen className="w-3.5 h-3.5" /> Signature technicien
              </label>
              {hasSignature && (
                <button onClick={clearSignature} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  <RotateCcw className="w-3 h-3" /> Effacer
                </button>
              )}
            </div>
            <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
              <canvas
                ref={canvasRef}
                width={400}
                height={120}
                className="w-full touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-xs font-mono text-zinc-600">Signer ici...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-sm font-mono text-zinc-400 hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !notes.trim()}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-sm font-mono text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <span className="animate-spin text-base">⏳</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Clôturer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
