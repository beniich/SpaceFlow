import { useState, useRef, useEffect } from 'react';
import { Plus, Clock, CheckCircle2, MapPin, UserPlus, FileText, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useWorkOrders, useWorkOrderStats, useCreateWorkOrder, useUpdateWorkOrder } from '../hooks/useWorkOrderMutation';
import WOTemplateSelector from '../components/modals/WOTemplateSelector';
import WOCloseModal from '../components/modals/WOCloseModal';
import toast from 'react-hot-toast';

// ================== WEBGL BACKGROUND SHADER (KEEPING ORIGINAL AESTHETICS) ==================
function ShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    const observer = new ResizeObserver(syncSize);
    observer.observe(canvas);
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position; varying vec2 v_texCoord; void main() { v_texCoord = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0.0, 1.0); }`;
    const fs = `precision highp float; uniform float u_time; uniform vec2 u_resolution; uniform vec2 u_mouse; varying vec2 v_texCoord; void main() { vec2 uv = v_texCoord; vec2 mouse = u_mouse / u_resolution; float dist = length(uv - mouse); float noise = sin(uv.x * 8.0 + u_time * 0.4) * cos(uv.y * 8.0 - u_time * 0.2); vec3 color1 = vec3(0.01, 0.01, 0.02); vec3 color2 = vec3(0.02, 0.04, 0.06); vec3 finalColor = mix(color1, color2, noise * 0.08); finalColor += vec3(0.95, 0.5, 0.12) * (1.0 - smoothstep(0.0, 0.4, dist)) * 0.04; gl_FragColor = vec4(finalColor, 1.0); }`;

    function compile(src, type) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(vs, gl.VERTEX_SHADER));
    gl.attachShader(prog, compile(fs, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mx = 0, my = 0;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = r.height - (e.clientY - r.top);
    };
    window.addEventListener('mousemove', onMove);

    let t0 = performance.now();
    let frame;
    function render(now) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - t0) * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    }
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />;
}

const PRIORITY_COLORS = { LOW: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-400/20', HIGH: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20', CRITICAL: 'text-red-500 bg-red-500/10 border-red-500/20' };
const STATUS_LABELS = { PENDING: 'En attente', ASSIGNED: 'Assigné', IN_PROGRESS: 'En cours', COMPLETED: 'Terminé', CANCELLED: 'Annulé' };

export default function WorkOrders() {
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', page: 1, limit: 10 });
  const { data: woData, isLoading } = useWorkOrders(filters);
  const { data: stats } = useWorkOrderStats();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWOToClose, setSelectedWOToClose] = useState(null);

  const { mutate: updateWO } = useUpdateWorkOrder();

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === 'COMPLETED') {
      // Ouvre la modale de clôture terrain
      const wo = woData?.data?.find(w => w.id === id);
      if (wo) setSelectedWOToClose(wo);
    } else {
      updateWO({ id, data: { status: newStatus } });
    }
  };

  return (
    <>
      <ShaderBackground />
      <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 min-h-screen font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">
              Work Orders
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">Gestion des interventions, templates & mobilité</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white font-mono text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(243,128,32,0.3)] hover:shadow-[0_0_25px_rgba(243,128,32,0.5)]"
          >
            <Plus className="w-4 h-4" /> Nouveau WO
          </button>
        </div>

        {/* Stats KPIs */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl">
              <div className="text-xs font-mono text-zinc-400 mb-1">En attente</div>
              <div className="text-2xl font-display font-bold text-zinc-100">
                {stats.byStatus.find(s => s.status === 'PENDING')?._count?.id || 0}
              </div>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl">
              <div className="text-xs font-mono text-zinc-400 mb-1">En cours</div>
              <div className="text-2xl font-display font-bold text-amber-400">
                {stats.byStatus.find(s => s.status === 'IN_PROGRESS')?._count?.id || 0}
              </div>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-md border border-brand-orange/30 p-4 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-orange/5" />
              <div className="relative text-xs font-mono text-brand-orange mb-1">Interventions en retard</div>
              <div className="relative text-2xl font-display font-bold text-brand-orange">
                {stats.overdue || 0}
              </div>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl">
              <div className="text-xs font-mono text-zinc-400 mb-1">Terminées</div>
              <div className="text-2xl font-display font-bold text-emerald-400">
                {stats.byStatus.find(s => s.status === 'COMPLETED')?._count?.id || 0}
              </div>
            </div>
          </div>
        )}

        {/* Filtres & Recherche */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher par titre, description..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-200 focus:outline-none focus:border-brand-orange/50 backdrop-blur-sm"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-300 focus:outline-none focus:border-brand-orange/50 backdrop-blur-sm"
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-300 focus:outline-none focus:border-brand-orange/50 backdrop-blur-sm"
            value={filters.priority}
            onChange={e => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">Toutes priorités</option>
            <option value="LOW">Basse</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Haute</option>
            <option value="CRITICAL">Critique</option>
          </select>
        </div>

        {/* Liste WO */}
        <div className="grid gap-3">
          {isLoading ? (
            <div className="text-center py-10 text-zinc-500 font-mono text-sm animate-pulse">Chargement des interventions...</div>
          ) : woData?.data?.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
              <CheckCircle2 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-mono text-sm">Aucune intervention trouvée</p>
            </div>
          ) : (
            woData?.data?.map(wo => (
              <div key={wo.id} className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Info Principale */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${PRIORITY_COLORS[wo.priority]}`}>
                        {wo.priority}
                      </span>
                      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{wo.type}</span>
                    </div>
                    <h3 className="text-lg font-sans font-bold text-zinc-100 mb-1">{wo.title}</h3>
                    <p className="text-sm font-mono text-zinc-400 line-clamp-2 max-w-3xl mb-3">{wo.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500">
                      {wo.asset && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {wo.asset.building?.name} {wo.asset.floor ? `(Niv ${wo.asset.floor.level})` : ''} - {wo.asset.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Prévu le : {format(new Date(wo.scheduledAt), 'PP', { locale: fr })}
                      </span>
                      {wo.assignedTo && (
                        <span className="flex items-center gap-1">
                          <UserPlus className="w-3.5 h-3.5" />
                          Assigné à : {wo.assignedTo.firstName} {wo.assignedTo.lastName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions / Statut */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:min-w-[140px] gap-2">
                    <select
                      value={wo.status}
                      onChange={(e) => handleStatusChange(wo.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold appearance-none cursor-pointer focus:outline-none ${
                        wo.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        wo.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                    
                    {wo.status === 'COMPLETED' && wo.closedByTech && (
                      <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Clôturé sur site
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modale de création depuis Template */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-sans font-bold text-zinc-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-orange" />
                Créer une intervention depuis un modèle
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <WOTemplateSelector
                onSelect={(template) => {
                  toast.success(`Modèle "${template.name}" sélectionné. Redirection...`);
                  setShowCreateModal(false);
                  // Redirection logique vers formulaire complet pré-rempli
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modale de Clôture Terrain (Signature/Photos) */}
      {selectedWOToClose && (
        <WOCloseModal
          workOrder={selectedWOToClose}
          onClose={() => setSelectedWOToClose(null)}
          onSuccess={() => setSelectedWOToClose(null)}
        />
      )}
    </>
  );
}
