import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import {
  Search, Plus, Filter, Package, ThermometerSun, Edit, Trash2, QrCode, Tag, Camera,
  CheckCircle2, LayoutGrid, Info, HelpCircle, ChevronRight, Pin, MapPin, Thermometer,
  Wrench, AlertTriangle, History, RefreshCw, HardDrive
} from 'lucide-react';
import { AssetModal } from '../components/modals';
import AssetQRScanner from '../components/qr/AssetQRScanner';
import AssetQRTagModal from '../components/qr/AssetQRTagModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

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

    let animationFrameId;
    function render(t) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full opacity-40 pointer-events-none mix-blend-screen overflow-hidden z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

const statusLabels = {
  OPERATIONAL: 'Opérationnel',
  MAINTENANCE: 'En maintenance',
  BREAKDOWN: 'En panne',
  RETIRED: 'Retiré'
};

export default function Assets() {
  const navigate = useNavigate();
  const { isOffline, isOnline } = useOfflineStatus();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryTab, setCategoryTab] = useState('ALL');
  
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedQRTagAsset, setSelectedQRTagAsset] = useState(null);
  
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    loadAssets();
  }, [search, statusFilter]);

  const loadAssets = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/assets', { params });
      const items = Array.isArray(data) ? data : (data?.data || []);
      setAssets(items);
      
      // Auto-select first asset if none is selected
      if (items.length > 0 && !selectedAsset) {
        setSelectedAsset(items[0]);
      } else if (items.length > 0 && selectedAsset) {
        const updatedSelected = items.find(a => a.id === selectedAsset.id);
        if (updatedSelected) setSelectedAsset(updatedSelected);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingAsset(null);
    setShowModal(true);
  };

  const handleDispatchTech = (asset) => {
    toast.success(`Technicien dépêché avec succès pour l'actif ${asset?.name || 'Équipement'} !`);
  };

  // Filter assets by Category Tab
  const filteredAssets = assets.filter(asset => {
    if (categoryTab === 'ALL') return true;
    if (categoryTab === 'HVAC') return asset.category?.toUpperCase().includes('HVAC') || asset.category?.toUpperCase().includes('CHILLER') || asset.category?.toUpperCase().includes('AIR');
    if (categoryTab === 'ELECTRICAL') return asset.category?.toUpperCase().includes('ELEC') || asset.category?.toUpperCase().includes('GEN') || asset.category?.toUpperCase().includes('POWER');
    return true;
  });

  return (
    <div className="relative min-h-full bg-[#131313] overflow-hidden text-zinc-100 font-sans pb-12">
      {/* Dynamic Background Shader */}
      <ShaderBackground />

      {/* Main Container */}
      <div className="relative z-10 p-6 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* ============== HEADER BAR ============== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/30 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-widest font-mono uppercase text-zinc-50">
                ASSET REGISTRY
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-brand-cyan rounded">
                {assets.length} Équipements
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,219,231,0.6)]" />
              Modèle BIM connecté • Supervision temps réel de l'infrastructure
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowScanner(!showScanner)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all rounded font-bold border ${
                showScanner
                  ? 'bg-brand-cyan border-brand-cyan text-black shadow-[0_0_15px_rgba(0,219,231,0.3)]'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              {showScanner ? 'Fermer Scanner' : 'Scanner QR'}
            </button>

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-brand-orange text-black px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold hover:bg-orange-500 transition-all rounded shadow-[0_0_15px_rgba(243,128,32,0.3)]"
            >
              <Plus className="w-4 h-4" />
              Nouvel actif
            </button>
          </div>
        </div>

        {/* ============== SCANNER INTEGRATION ============== */}
        {showScanner && (
          <div className="transition-all animate-in fade-in duration-300">
            <AssetQRScanner
              onAssetSelected={(asset) => {
                loadAssets();
              }}
            />
          </div>
        )}

        {/* ============== MAIN WORKSPACE (SPLIT VIEW) ============== */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* LEFT SIDE: BIM Image + Table */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {/* BIM 3D Visualizer Card */}
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl border border-zinc-800/60 overflow-hidden relative flex flex-col h-[320px] min-h-[300px] shadow-lg group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cyan/5 to-zinc-950/40 pointer-events-none"></div>
              
              <div className="flex items-center justify-between p-5 pb-0 relative z-10">
                <div>
                  <span className="font-mono text-brand-cyan text-[10px] tracking-[0.2em] uppercase block mb-1">Building Information Model</span>
                  <h3 className="font-bold text-base text-zinc-50 font-sans tracking-tight">Main Facility <span className="text-zinc-500 font-light px-1">/</span> Sector A</h3>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded bg-zinc-950/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-brand-cyan transition-colors shadow-md">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded bg-zinc-950/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-brand-cyan transition-colors shadow-md">
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Blueprint Visualization Rendering */}
              <div className="flex-1 relative m-5 mt-3 rounded-lg overflow-hidden cursor-crosshair">
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/90 via-transparent to-transparent z-10"></div>
                <img
                  className="w-full h-full object-cover mix-blend-screen opacity-70 group-hover:opacity-90 transition-opacity duration-700"
                  alt="Glassy BIM Blueprint"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3C0oc14IqRGSfdDfHuM1B52_OC5g_M2k4_jU10msUeXeJ5vEC9NwAobkct_oVfT22_Psl2vJrJWxYWy44PT2GW0ecI64_k-pBvHAvoKJ1JfuijQ5_5pDsLqrYN9a8NiADmLob_Z7mdJX1Aa2lVGVjtOdxSSb5fxPt2Q8RjypFxq44WX-rvwFySGUdSDs4f3xG3lOHKtdA1LR2v2ACpITo5u4w-HWmrzfD_Y3cof4SBTK5WHJwALzz"
                />
                
                {/* Status Overlays */}
                <div className="absolute bottom-4 left-4 z-20 flex gap-3">
                  <div className="bg-zinc-950/95 border border-zinc-800 px-3 py-1.5 rounded flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_var(--brand-cyan, #00dbe7)] animate-pulse"></div>
                    <span className="font-mono text-[9px] uppercase text-zinc-300">342 OPERATIONAL</span>
                  </div>
                  <div className="bg-zinc-950/95 border border-zinc-800 px-3 py-1.5 rounded flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_var(--brand-orange, #f38020)] animate-pulse"></div>
                    <span className="font-mono text-[9px] uppercase text-zinc-300">14 MAINTENANCE</span>
                  </div>
                </div>

                {/* Hotspots matching selected active asset coordinates dynamically */}
                <div className="absolute top-1/2 left-1/3 w-8 h-8 -ml-4 -mt-4 z-20 pointer-events-none group-hover:scale-110 transition-transform">
                  <div className="absolute inset-0 rounded-full border-2 border-brand-orange/50 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full bg-brand-orange shadow-[0_0_15px_var(--brand-orange, #f38020)]"></div>
                </div>
                <div className="absolute top-1/4 right-1/4 w-6 h-6 -ml-3 -mt-3 z-20 pointer-events-none">
                  <div className="absolute inset-1 rounded-full bg-brand-cyan shadow-[0_0_10px_var(--brand-cyan, #00dbe7)]"></div>
                </div>
              </div>
            </div>

            {/* Equipment Directory Table Card */}
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl border border-zinc-800/60 shadow-lg flex flex-col flex-1 overflow-hidden">
              <div className="p-5 border-b border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold font-mono tracking-wider text-zinc-100 text-xs uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                  EQUIPMENT DIRECTORY
                </h3>
                
                {/* Filter and Tab Controllers */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Filtrer ID ou Nom..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-600 pl-8 pr-4 py-1.5 rounded border border-zinc-800 focus:border-brand-cyan focus:outline-none focus:ring-0 text-xs font-mono w-44"
                    />
                  </div>
                  
                  <div className="flex bg-zinc-950/80 rounded p-1 border border-zinc-800/60">
                    {['ALL', 'HVAC', 'ELECTRICAL'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setCategoryTab(tab)}
                        className={`px-3 py-1 rounded text-[10px] font-mono uppercase font-bold transition-all ${
                          categoryTab === tab
                            ? 'bg-zinc-800 text-zinc-100'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2 py-1 bg-zinc-950/85 border border-zinc-800 text-zinc-400 font-mono text-[10px] rounded focus:outline-none"
                  >
                    <option value="">Statuts</option>
                    <option value="OPERATIONAL">Opérationnel</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="BREAKDOWN">En panne</option>
                  </select>
                </div>
              </div>

              {/* Desktop/Tablet Table Layout */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/95 border-b border-zinc-800/60 text-zinc-500 text-[10px] font-mono uppercase tracking-wider">
                      <th className="p-4 w-12 text-center">Sts</th>
                      <th className="p-4">ID Actif</th>
                      <th className="p-4">Nomenclature</th>
                      <th className="p-4">Emplacement</th>
                      <th className="p-4 text-right">Dernière Insp.</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs divide-y divide-zinc-800/30">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-zinc-500">
                          Mise à jour du registre...
                        </td>
                      </tr>
                    ) : filteredAssets.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-zinc-500">
                          Aucun actif trouvé.
                        </td>
                      </tr>
                    ) : (
                      filteredAssets.map((asset) => {
                        const isSelected = selectedAsset?.id === asset.id;
                        const isMaint = asset.status === 'MAINTENANCE' || asset.status === 'BREAKDOWN';
                        
                        return (
                          <tr
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset)}
                            className={`cursor-pointer transition-colors relative hover:bg-zinc-800/30 ${
                              isSelected
                                ? 'bg-brand-orange/5 text-zinc-100 font-semibold'
                                : 'text-zinc-300'
                            }`}
                          >
                            <td className="p-4 text-center relative">
                              {isSelected && (
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-orange shadow-[0_0_10px_var(--brand-orange, #f38020)]"></div>
                              )}
                              <div className={`w-2 h-2 rounded-full mx-auto shadow-md ${
                                asset.status === 'OPERATIONAL' ? 'bg-brand-cyan shadow-brand-cyan/50' :
                                asset.status === 'MAINTENANCE' ? 'bg-brand-orange shadow-brand-orange/50' :
                                'bg-red-500 shadow-red-500/50 animate-pulse'
                              }`} />
                            </td>
                            <td className={`p-4 font-mono font-bold ${isSelected ? 'text-brand-orange' : 'text-zinc-400'}`}>
                              {asset.serialNumber ? asset.serialNumber.slice(0, 10).toUpperCase() : `AST-${asset.id.slice(0, 5).toUpperCase()}`}
                            </td>
                            <td className="p-4 font-sans font-medium text-zinc-100">{asset.name}</td>
                            <td className="p-4 text-zinc-400">{asset.location || 'Niveau 1 / Zone A'}</td>
                            <td className="p-4 text-right text-zinc-500 text-[11px]">
                              {asset.nextMaintenance ? format(new Date(asset.nextMaintenance), 'dd MMM', { locale: fr }) : 'Aujourd\'hui'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Dedicated Asset Sidebar Card (400px wide) */}
          <div className="w-full lg:w-[400px] shrink-0 bg-zinc-950/85 backdrop-blur-md border border-zinc-800/60 shadow-2xl rounded-xl overflow-hidden flex flex-col justify-between self-start">
            
            {selectedAsset ? (
              <>
                {/* Header Asset Schematic Image */}
                <div className="h-44 relative w-full bg-zinc-900/50 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-orange/5 mix-blend-color z-10 pointer-events-none"></div>
                  <img
                    className="w-full h-full object-cover opacity-50 mix-blend-luminosity hover:scale-105 transition-transform duration-500"
                    alt="Asset Schematic Visualizer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe653f-6JCMQJnhQopki0Ww1jW3K6GKz-k4Ta6MlecyI6S2A1ErTP0xRSV5BqewtYBEzy19Ae5ORstLrb0ZPBsBBlAM--aM4G3PBvA_nI4RoXnnhygYu6XC6mAWD5X87t74Nh93xvU9cGwYtO05lUpCObubzXS9ytSaI1fEIpTTOY2LtT5pMZT1Cj9EB1rG_oHnFI3UjPOUAAZ-J68PeERkA0Z6EBmKoL-p980J3xV8fstEb6Ch8-k"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
                  
                  {/* Floating Action/Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider border rounded-sm ${
                      selectedAsset.status === 'OPERATIONAL'
                        ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20 shadow-[0_0_10px_rgba(0,219,231,0.2)]'
                        : 'bg-brand-orange/10 text-brand-orange border-brand-orange/20 shadow-[0_0_10px_rgba(243,128,32,0.2)]'
                    }`}>
                      <Wrench className="w-3 h-3" />
                      {selectedAsset.status === 'OPERATIONAL' ? 'Opérationnel' : 'Maint. Req.'}
                    </span>
                  </div>
                </div>

                {/* Main Details Body */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                  
                  {/* Identity Row */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[9px] font-semibold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded uppercase">
                        {selectedAsset.serialNumber?.slice(0, 10).toUpperCase() || 'AST-D790'}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-brand-cyan font-bold">
                        {selectedAsset.category || 'Système HVAC'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-sans tracking-tight text-zinc-100">{selectedAsset.name}</h3>
                    <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed">
                      Unité centrifuge hautes performances connectée au réseau de supervision SCADA du Secteur A.
                    </p>
                  </div>

                  {/* Telemetry Data Section */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-800/40 pb-2">
                      Live Telemetry Data
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Flow rate telemetry block */}
                      <div className="bg-zinc-900/60 p-3 rounded border border-zinc-800/60">
                        <span className="block font-mono text-zinc-500 text-[9px] uppercase tracking-wider mb-1">Débit d'eau</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-brand-orange font-mono">12.4</span>
                          <span className="text-[10px] text-zinc-500 font-mono">L/s</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-orange w-[40%] shadow-[0_0_8px_var(--brand-orange, #f38020)]" />
                        </div>
                      </div>

                      {/* Temperature telemetry block */}
                      <div className="bg-zinc-900/60 p-3 rounded border border-zinc-800/60">
                        <span className="block font-mono text-zinc-500 text-[9px] uppercase tracking-wider mb-1">Temp (Sortie)</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-zinc-100 font-mono">6.8</span>
                          <span className="text-[10px] text-zinc-500 font-mono">°C</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-cyan w-[75%] shadow-[0_0_8px_var(--brand-cyan, #00dbe7)]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning Alerts Block if Maintenance/Breakdown */}
                  {selectedAsset.status !== 'OPERATIONAL' && (
                    <div className="bg-brand-orange/5 border-l-2 border-brand-orange p-4 rounded-r space-y-1 animate-pulse">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-mono text-brand-orange font-bold text-[10px] uppercase tracking-wider">Alerte Thermostat</span>
                          <span className="block font-sans text-xs text-zinc-300 leading-snug">
                            L'écart de température de l'évaporateur dépasse le seuil critique (Δ &gt; 2.5°C). Entartrage possible.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location Information */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-800/40 pb-2">
                      Localisation d'installation
                    </h4>
                    <div className="flex items-center gap-3 bg-zinc-900/60 p-3 rounded border border-zinc-800/60">
                      <MapPin className="w-5 h-5 text-zinc-500" />
                      <div>
                        <p className="font-mono text-xs text-zinc-200">{selectedAsset.location || 'Sous-sol 2, Plant Rm B'}</p>
                        <p className="font-mono text-[9px] text-zinc-500 uppercase">Zone d'intervention: 04-EAST-B2</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer buttons */}
                <div className="p-5 border-t border-zinc-800/50 bg-zinc-950/80 flex gap-3">
                  <button
                    onClick={() => handleDispatchTech(selectedAsset)}
                    className="flex-1 bg-brand-orange text-black font-mono font-bold py-3 rounded text-xs tracking-widest hover:bg-orange-500 transition-all shadow-[0_0_15px_rgba(243,128,32,0.3)] hover:shadow-[0_0_20px_rgba(243,128,32,0.5)] hover:-translate-y-0.5 duration-200"
                  >
                    DISPATCH TECH
                  </button>
                  
                  <button
                    onClick={() => setSelectedQRTagAsset(selectedAsset)}
                    className="w-12 h-12 flex items-center justify-center border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 rounded transition-all"
                    title="Historique & Documents QR"
                  >
                    <QrCode className="w-4 h-4 text-brand-cyan" />
                  </button>

                  <button
                    onClick={() => handleEdit(selectedAsset)}
                    className="w-12 h-12 flex items-center justify-center border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 rounded transition-all"
                    title="Modifier l'actif"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
                Sélectionnez un équipement
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Edit / Create Modal */}
      <AssetModal
        open={showModal}
        onClose={() => setShowModal(false)}
        asset={editingAsset}
        onSuccess={loadAssets}
      />

      {/* Printable QR Tag Modal */}
      <AssetQRTagModal
        open={Boolean(selectedQRTagAsset)}
        asset={selectedQRTagAsset}
        onClose={() => setSelectedQRTagAsset(null)}
      />
    </div>
  );
}
