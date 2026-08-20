import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Plus, Clock, AlertCircle, CheckCircle2, XCircle, MapPin, UserPlus, Settings, Camera, PenTool, Filter, Layers, User, CheckSquare, Search, FileText, Wifi, WifiOff, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

// ================== WEBGL BACKGROUND SHADER ==================
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

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    
    // Create a dark, subtle moving grid/nebula effect
    float strength = 0.5;
    vec3 color1 = vec3(0.01, 0.01, 0.02); // Onyx base
    vec3 color2 = vec3(0.02, 0.04, 0.06); // Deep cyan depth
    
    float pulse = sin(u_time * 0.15) * 0.5 + 0.5;
    float dist = length(uv - mouse);
    
    // Subtle flowing noise-like pattern
    float noise = sin(uv.x * 8.0 + u_time * 0.4) * cos(uv.y * 8.0 - u_time * 0.2);
    vec3 finalColor = mix(color1, color2, noise * 0.08 + pulse * 0.03);
    
    // Accentuate mouse proximity with subtle orange glow
    finalColor += vec3(0.95, 0.5, 0.12) * (1.0 - smoothstep(0.0, 0.4, dist)) * 0.04;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    let frameId;
    function render(t) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPlanViewer, setShowPlanViewer] = useState(false);
  const [selectedWO, setSelectedWO] = useState(null);
  
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/workorders');
      let serverWOs = Array.isArray(data) ? data : (data?.data || []);
      
      // Merge with pending offline creations/updates if any
      if (window.indexedDB) {
        try {
          const { db } = await import('../services/db.js');
          const pending = await db.pending_actions.where('status').equals('pending').toArray();
          
          pending.forEach(action => {
             if (action.url.includes('/workorders')) {
               if (action.method.toLowerCase() === 'post' && action.data) {
                 // It's a new offline WO
                 serverWOs.push({
                   ...action.data,
                   id: action.data.id || `pending-${action.id}`,
                   _isOfflineQueued: true
                 });
               } else if (action.method.toLowerCase() === 'put' && action.data) {
                 // It's an offline update
                 const parts = action.url.split('/');
                 const woId = parts[parts.length - 1];
                 const idx = serverWOs.findIndex(w => w.id === woId);
                 if (idx !== -1) {
                   serverWOs[idx] = { ...serverWOs[idx], ...action.data, _isOfflineQueued: true };
                 }
               }
             }
          });
        } catch(e) {
          console.warn('Failed to merge offline data:', e);
        }
      }
      
      setWorkOrders(serverWOs);
    } catch (err) {
      if (navigator.onLine) toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update status on Drag and Drop
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;

    try {
      // Optimitic update
      setWorkOrders(prev => prev.map(wo => wo.id === id ? { ...wo, status: targetStatus } : wo));
      
      await api.put(`/workorders/${id}`, { status: targetStatus });
      toast.success(`Statut mis à jour : ${targetStatus}`);
      loadData();
    } catch (err) {
      toast.error('Échec de la mise à jour');
      loadData();
    }
  };

  // Filter logic
  const filteredWOs = workOrders.filter(w => {
    if (search && !w.title.toLowerCase().includes(search.toLowerCase()) && !w.id.includes(search)) return false;
    if (filterType !== 'ALL' && w.type !== filterType) return false;
    if (filterPriority !== 'ALL' && w.priority !== filterPriority) return false;
    return true;
  });

  // Group work orders by column
  const pendingWOs = filteredWOs.filter(w => w.status === 'PENDING');
  const inProgressWOs = filteredWOs.filter(w => w.status === 'IN_PROGRESS');
  const reviewWOs = filteredWOs.filter(w => w.status === 'COMPLETED');
  const doneWOs = filteredWOs.filter(w => w.status === 'CANCELLED');

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-background text-on-surface overflow-x-hidden">
      <ShaderBackground />

      <div className="relative z-10 p-6 md:p-8 flex-1 flex flex-col gap-6 w-full max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display uppercase text-zinc-50 flex items-center gap-3">
              <Layers className="w-6 h-6 text-brand-orange" />
              OPÉRATIONS & MAINTENANCE
            </h1>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_var(--brand-orange,_#f38020)] animate-pulse" />
              Work Orders (M3) • Plans 2D Annotables • Mode Terrain Offline
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setShowPlanViewer(true)}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm font-bold"
            >
              <FileText className="w-4 h-4 text-brand-cyan" />
              Plans 2D
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-zinc-100 text-zinc-900 font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm font-bold hover:bg-white"
            >
              <CheckSquare className="w-4 h-4" />
              Templates
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-brand-orange text-black font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(243,128,32,0.3)] hover:shadow-[0_0_20px_rgba(243,128,32,0.5)] font-bold hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-black" strokeWidth={3} />
              Nouveau WO
            </button>
          </div>
        </div>

        {/* FILTERS BAR */}
        <div className="flex flex-wrap gap-3 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/60">
           <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Rechercher #WO ou titre..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 pl-9 pr-4 py-2 rounded text-xs font-mono focus:outline-none focus:border-brand-orange"
              />
           </div>
           <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-400 py-2 px-3 rounded text-xs font-mono focus:outline-none focus:border-brand-orange"
           >
              <option value="ALL">Tous les Types</option>
              <option value="PREVENTIVE">Préventif</option>
              <option value="CORRECTIVE">Correctif</option>
              <option value="REGULATORY">Réglementaire</option>
           </select>
           <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-400 py-2 px-3 rounded text-xs font-mono focus:outline-none focus:border-brand-orange"
           >
              <option value="ALL">Toutes Priorités</option>
              <option value="HIGH">Haute</option>
              <option value="CRITICAL">Critique</option>
           </select>
           <button className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-100 py-2 px-3 rounded flex items-center gap-2 text-xs font-mono transition-colors">
              <Filter className="w-3.5 h-3.5" /> Mes assignations
           </button>
        </div>

        {/* KANBAN BOARD WRAPPER */}
        {loading && workOrders.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-24 text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
            Syncing Operations...
          </div>
        ) : (
          <div className="flex gap-6 w-full overflow-x-auto pb-6 pt-2 snap-x snap-mandatory flex-1 min-h-[600px] custom-scrollbar">
            
            {/* COLUMN: PENDING */}
            <div 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'PENDING')}
              className="flex-none w-[290px] snap-start flex flex-col gap-4 bg-zinc-950/20 border border-zinc-900/40 p-4 rounded-xl min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                  <h2 className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-widest">Pending</h2>
                </div>
                <span className="bg-zinc-900/80 text-zinc-400 font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-zinc-800/40">
                  {pendingWOs.length}
                </span>
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1">
                {pendingWOs.length === 0 ? (
                  <div className="border border-dashed border-zinc-900 p-8 text-center text-zinc-600 font-mono text-[10px] uppercase rounded-lg">
                    No Pending WOs
                  </div>
                ) : (
                  pendingWOs.map(wo => (
                    <div 
                      key={wo.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, wo.id)}
                      onClick={() => setSelectedWO(wo)}
                      className="bg-surface/80 backdrop-blur-md p-4 rounded-xl border border-zinc-800/60 cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:border-brand-cyan/50 transition-all shadow-md group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded tracking-wider ${
                          wo.priority === 'CRITICAL' ? 'bg-rose-950/40 text-rose-400 border border-rose-900/50' :
                          wo.priority === 'HIGH' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/50' :
                          'bg-zinc-900 text-zinc-400 border border-zinc-800/60'
                        }`}>
                          {wo.priority}
                        </span>
                        <div className="flex items-center gap-2">
                          {wo._isOfflineQueued && (
                            <WifiOff className="w-3 h-3 text-amber-500 animate-pulse" title="Pending Sync" />
                          )}
                          <span className="font-mono text-[9px] text-zinc-600">
                            #{wo.id.toString().slice(0, 8)}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-sans text-sm font-bold text-zinc-100 leading-tight mb-2 uppercase tracking-tight">{wo.title}</h3>
                      <p className="font-sans text-[12px] text-zinc-400 leading-relaxed line-clamp-2 mb-4">{wo.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[10px]">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{wo.asset?.location || 'Sector 7G'}</span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center border-dashed text-zinc-500 hover:text-zinc-300 transition-colors">
                          <UserPlus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN: IN PROGRESS */}
            <div 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'IN_PROGRESS')}
              className="flex-none w-[290px] snap-start flex flex-col gap-4 bg-zinc-950/20 border border-zinc-900/40 p-4 rounded-xl min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_8px_var(--brand-orange,_#f38020)] animate-pulse"></span>
                  <h2 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest">In Progress</h2>
                </div>
                <span className="bg-zinc-900/80 text-brand-orange font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-zinc-800/40">
                  {inProgressWOs.length}
                </span>
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1">
                {inProgressWOs.length === 0 ? (
                  <div className="border border-dashed border-zinc-900 p-8 text-center text-zinc-600 font-mono text-[10px] uppercase rounded-lg">
                    Drag here to start
                  </div>
                ) : (
                  inProgressWOs.map(wo => (
                    <div 
                      key={wo.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, wo.id)}
                      onClick={() => setSelectedWO(wo)}
                      className="bg-surface/80 backdrop-blur-md p-4 rounded-xl border border-brand-orange/40 cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:border-brand-orange transition-all shadow-md relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange shadow-[0_0_10px_var(--brand-orange,_#f38020)]"></div>
                      
                      <div className="flex justify-between items-start mb-3 pl-1">
                        <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded tracking-wider ${
                          wo.priority === 'CRITICAL' ? 'bg-rose-950/40 text-rose-400 border border-rose-900/50' :
                          'bg-brand-orange/10 text-brand-orange border border-brand-orange/30'
                        }`}>
                          {wo.priority}
                        </span>
                        <div className="flex items-center gap-2">
                          {wo._isOfflineQueued && <WifiOff className="w-3 h-3 text-amber-500 animate-pulse" title="Pending Sync" />}
                          <span className="font-mono text-[9px] text-zinc-600">
                            #{wo.id.toString().slice(0, 8)}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-sans text-sm font-bold text-zinc-100 leading-tight mb-2 pl-1 uppercase tracking-tight">{wo.title}</h3>
                      <p className="font-sans text-[12px] text-zinc-400 leading-relaxed line-clamp-2 mb-4 pl-1">{wo.description}</p>
                      
                      {/* Technical progress bar */}
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full mb-4 overflow-hidden ml-1">
                        <div className="bg-brand-orange h-full w-[65%] rounded-full shadow-[0_0_5px_var(--brand-orange,_#f38020)]"></div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pl-1">
                        <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[10px]">
                          <Settings className="w-3.5 h-3.5 text-brand-orange animate-spin" style={{ animationDuration: '3s' }} />
                          <span className="text-brand-orange uppercase font-bold">Diagnosing</span>
                        </div>
                        <img 
                          className="w-7 h-7 rounded-full border border-zinc-800 object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHcl6asZsWxj4JMx6FHo0WrZoZYjaheX8t0u9vTAsLXq6pDdlPWTzIDgC278qeY1Rzw_nR0Qa9bRjjMAWOt3NOCBFFD7cts3ThSAmGPYPJOqlraR1Cnihz-tHS_r4A2v1DmfOkI4eChATvNApT-13t2m4Zaj6B6BIncYcDgL3Z8FccPW0SRjC2SxnR8iEcaKYjvLZ1TCepU2qYbIfXkATuYxUmL-54M0HAPr_34xx2au_cCK18yh9i" 
                          alt="Tech" 
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN: REVIEW (COMPLETED) */}
            <div 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'COMPLETED')}
              className="flex-none w-[290px] snap-start flex flex-col gap-4 bg-zinc-950/20 border border-zinc-900/40 p-4 rounded-xl min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_var(--brand-cyan,_#00dbe7)]"></span>
                  <h2 className="font-mono text-xs font-bold text-brand-cyan uppercase tracking-widest">Review</h2>
                </div>
                <span className="bg-zinc-900/80 text-brand-cyan font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-zinc-800/40">
                  {reviewWOs.length}
                </span>
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1">
                {reviewWOs.length === 0 ? (
                  <div className="border border-dashed border-zinc-900 p-8 text-center text-zinc-600 font-mono text-[10px] uppercase rounded-lg">
                    Drop finished tasks here
                  </div>
                ) : (
                  reviewWOs.map(wo => (
                    <div 
                      key={wo.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, wo.id)}
                      onClick={() => setSelectedWO(wo)}
                      className="bg-surface/80 backdrop-blur-md p-4 rounded-xl border border-brand-cyan/20 cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:border-brand-cyan transition-all shadow-md relative group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded tracking-wider bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                          {wo.priority}
                        </span>
                        <div className="flex items-center gap-2">
                          {wo._isOfflineQueued && <WifiOff className="w-3 h-3 text-amber-500 animate-pulse" title="Pending Sync" />}
                          <span className="font-mono text-[9px] text-zinc-600">
                            #{wo.id.toString().slice(0, 8)}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-sans text-sm font-bold text-zinc-100 leading-tight mb-2 uppercase tracking-tight">{wo.title}</h3>
                      <p className="font-sans text-[12px] text-zinc-400 leading-relaxed line-clamp-2 mb-4">{wo.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-900">
                        <button className="text-brand-cyan hover:text-[#5ce9ff] font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors">
                          Review Logs <span>&rarr;</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN: DONE (CANCELLED / COMPLETED ARCHIVE) */}
            <div 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'CANCELLED')}
              className="flex-none w-[290px] snap-start flex flex-col gap-4 bg-zinc-950/20 border border-zinc-900/40 p-4 rounded-xl min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
                  <h2 className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-widest">Done</h2>
                </div>
                <span className="bg-zinc-900/80 text-zinc-500 font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-zinc-800/40">
                  {doneWOs.length}
                </span>
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1">
                {doneWOs.length === 0 ? (
                  <div className="border border-dashed border-zinc-900 p-8 text-center text-zinc-700 font-mono text-[10px] uppercase rounded-lg">
                    Cancelled/Completed Archive
                  </div>
                ) : (
                  doneWOs.map(wo => (
                    <div 
                      key={wo.id}
                      className="bg-[#1c1b1b]/40 backdrop-blur-sm p-4 rounded-xl border border-zinc-900/40 opacity-60"
                    >
                      <h3 className="font-sans text-[13px] font-bold text-zinc-400 leading-tight mb-1 line-through decoration-zinc-700">{wo.title}</h3>
                      <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-zinc-600 uppercase">
                        <span>#WO-{wo.id.slice(0,4)}</span>
                        <span>Archived</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* NEW TICKET MODAL */}
      {showModal && (
        <WorkOrderModalInner
          onClose={() => setShowModal(false)}
          onSuccess={loadData}
        />
      )}

      {/* TECHNICIAN MOBILE EXECUTION PANEL */}
      {selectedWO && (
        <TechnicianExecutionPanel
          wo={selectedWO}
          onClose={() => setSelectedWO(null)}
          onComplete={async (id) => {
            try {
              await api.put(`/workorders/${id}`, { status: 'COMPLETED' });
              toast.success('Intervention clôturée avec succès');
              setSelectedWO(null);
              loadData();
            } catch (err) {
               toast.error('Erreur lors de la clôture');
            }
          }}
        />
      )}

      {/* PLAN VIEWER / ANNOTATIONS MODAL */}
      {showPlanViewer && (
        <PlanViewerModal onClose={() => setShowPlanViewer(false)} />
      )}
    </div>
  );
}

function TechnicianExecutionPanel({ wo, onClose, onComplete }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="w-full sm:w-[450px] h-full bg-[#18181b] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 sm:rounded-xl overflow-hidden border-l sm:border border-zinc-800">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center shrink-0">
           <div>
             <span className="font-mono text-[10px] text-brand-orange uppercase">Mode Terrain</span>
             <h3 className="font-bold text-zinc-100 font-display uppercase tracking-tight">Exécution WO</h3>
           </div>
           <div className="flex items-center gap-4">
             <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase bg-emerald-950/30 text-emerald-400 px-2.5 py-1.5 rounded border border-emerald-500/20">
               <Wifi className="w-3 h-3" /> Offline Sync
             </span>
             <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 p-1">
               <XCircle className="w-5 h-5" />
             </button>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
           <div>
              <h2 className="text-lg font-bold text-zinc-100 font-display uppercase tracking-tight leading-tight">{wo.title}</h2>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{wo.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                 <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] px-2 py-1 rounded font-mono uppercase">
                   {wo.type || 'CORRECTIVE'}
                 </span>
                 <span className="bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] px-2 py-1 rounded font-mono uppercase">
                   {wo.priority}
                 </span>
              </div>
           </div>
           
           <div className="space-y-4 pt-4 border-t border-zinc-800/60">
             <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               <CheckSquare className="w-4 h-4 text-brand-cyan" />
               Preuves & Clôture
             </h4>
             
             <button className="w-full flex items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed border-zinc-800 text-zinc-400 hover:border-brand-cyan hover:text-brand-cyan hover:bg-brand-cyan/5 transition-colors bg-zinc-950/50">
                <Camera className="w-5 h-5" />
                <span className="font-mono text-xs uppercase font-bold">Capturer Photo Terrain</span>
             </button>

             <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3 text-zinc-400">
                  <PenTool className="w-4 h-4" />
                  <span className="font-mono text-[10px] uppercase">Signature Client / Responsable</span>
                </div>
                <div className="h-28 bg-zinc-900 rounded border border-zinc-800 border-dashed cursor-crosshair relative flex items-center justify-center group hover:border-brand-orange/50 transition-colors">
                  <span className="text-zinc-600 font-mono text-[10px] uppercase group-hover:text-brand-orange/50">Signer ici</span>
                </div>
             </div>
           </div>
        </div>
        <div className="p-5 bg-zinc-950 border-t border-zinc-800 shrink-0">
           <button onClick={() => onComplete(wo.id)} className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold uppercase tracking-widest text-xs py-3.5 rounded transition-colors flex justify-center items-center gap-2">
             <CheckCircle2 className="w-4 h-4" /> Finaliser l'intervention
           </button>
        </div>
      </div>
    </div>
  );
}

function PlanViewerModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-[#18181b] rounded-xl flex flex-col shadow-2xl border border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-brand-cyan" />
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-zinc-100">Visionneuse de Plans 2D</h2>
            <span className="bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 px-2 py-0.5 rounded text-[9px] font-mono uppercase">Annotable</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 relative bg-zinc-900 overflow-hidden cursor-crosshair">
           <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <button className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center text-zinc-400 hover:text-brand-cyan shadow-lg"><Plus className="w-5 h-5" /></button>
              <button className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center text-zinc-400 hover:text-brand-cyan shadow-lg"><PenTool className="w-4 h-4" /></button>
              <button className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center text-zinc-400 hover:text-brand-orange shadow-lg"><MapPin className="w-4 h-4" /></button>
           </div>
           
           {/* Mock Blueprint */}
           <img 
             src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop" 
             alt="Blueprint" 
             className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
           />
           <div className="absolute inset-0 bg-brand-cyan/5 mix-blend-overlay pointer-events-none"></div>
           
           {/* Mock Annotations */}
           <div className="absolute top-1/3 left-1/3 w-8 h-8 -ml-4 -mt-4 group">
             <div className="absolute inset-0 bg-brand-orange rounded-full opacity-20 animate-ping"></div>
             <div className="absolute inset-2 bg-brand-orange rounded-full shadow-[0_0_15px_var(--brand-orange,_#f38020)]"></div>
             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
               Fuite détectée (WO-9214)
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function WorkOrderModalInner({ onClose, onSuccess }) {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', type: 'PREVENTIVE', priority: 'MEDIUM',
    scheduledAt: '', assetId: '', estimatedCost: 0
  });

  useEffect(() => {
    api.get('/assets').then(({ data }) => {
      const list = Array.isArray(data) ? data : (data?.data || []);
      setAssets(list);
      if (list.length > 0) setForm(f => ({ ...f, assetId: list[0].id }));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        estimatedCost: Number(form.estimatedCost),
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : new Date().toISOString()
      };
      await api.post('/workorders', payload);
      toast.success('Ordre de travail créé avec succès');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur de création');
    }
  };

  const field = (key, props) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    className: 'w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-brand-cyan font-mono text-xs rounded transition-colors',
    ...props
  });

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1b1b] border border-zinc-800/80 rounded-xl max-w-lg w-full shadow-2xl text-zinc-200 font-mono text-xs">
        <form onSubmit={handleSubmit}>
          <div className="p-5 border-b border-zinc-800/60 bg-zinc-950/40 flex justify-between items-center">
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-100">Nouvel Ordre de Travail</h2>
            <button type="button" onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-sm">&times;</button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px]">Titre</label>
              <input required placeholder="Chambre Froide / HVAC Failure" {...field('title')} />
            </div>
            
            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px]">Description</label>
              <textarea required placeholder="Description de l'intervention technique" {...field('description')} rows={3} />
            </div>
            
            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px]">Actif associé</label>
              <select required {...field('assetId')}>
                {assets.length === 0 && <option value="">Aucun actif disponible</option>}
                {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.location || 'Localisation N/A'})</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 mb-1 block uppercase text-[10px]">Type</label>
                <select required {...field('type')}>
                  <option value="PREVENTIVE">Préventif (Routine)</option>
                  <option value="CORRECTIVE">Correctif (Panne)</option>
                  <option value="REGULATORY">Réglementaire (Conformité)</option>
                  <option value="INSPECTION">Inspection / Audit</option>
                  <option value="UPGRADE">Mise à niveau</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400 mb-1 block uppercase text-[10px]">Priorité</label>
                <select required {...field('priority')}>
                  <option value="LOW">Basse</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Haute</option>
                  <option value="CRITICAL">Critique</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 mb-1 block uppercase text-[10px]">Date prévue</label>
                <input type="datetime-local" required {...field('scheduledAt')} />
              </div>
              <div>
                <label className="text-zinc-400 mb-1 block uppercase text-[10px]">Coût estimé (€)</label>
                <input type="number" min="0" step="10" {...field('estimatedCost')} />
              </div>
            </div>
          </div>
          <div className="p-5 border-t border-zinc-800/60 flex justify-end gap-3 bg-zinc-950/40">
            <button type="button" onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-zinc-100 uppercase transition">Annuler</button>
            <button type="submit" className="px-5 py-2 bg-brand-orange text-black font-bold uppercase transition hover:bg-[#ff9540]">Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
