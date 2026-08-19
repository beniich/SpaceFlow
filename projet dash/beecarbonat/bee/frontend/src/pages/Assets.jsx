import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import {
  Search, Plus, Filter, Package, ThermometerSun, Edit, Trash2, QrCode, Tag, Camera,
  CheckCircle2, LayoutGrid, Info, HelpCircle, ChevronRight, Pin, MapPin, Thermometer,
  Wrench, AlertTriangle, History, RefreshCw, HardDrive, Layers, DownloadCloud, ChevronDown
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

// Mock hierarchical structure for H1 Master Data Model
const MOCK_HIERARCHY = [
  {
    id: 'SITE-01',
    type: 'SITE',
    name: 'Campus Paris',
    code: 'CP-01',
    expanded: true,
    children: [
      {
        id: 'BLD-A',
        type: 'BUILDING',
        name: 'Bâtiment A - Tertiaire',
        code: 'BAT-A',
        expanded: true,
        children: [
          {
            id: 'FL-0',
            type: 'FLOOR',
            name: 'Rez-de-chaussée',
            code: 'RDC',
            expanded: true,
            children: [
              {
                id: 'RM-01',
                type: 'ROOM',
                name: 'Local TGBT',
                code: 'L-TGBT',
                expanded: false,
                children: [
                  { id: 'AST-7892', type: 'EQUIPMENT', name: 'Armoire TGBT Principale', code: 'E-TGBT-01', status: 'OPERATIONAL', category: 'ELECTRICAL', cobieClass: 'Electrical.Switchboard', bimRef: '1kL89_b4D4xQvW8294XyZ' },
                ]
              }
            ]
          },
          {
            id: 'FL-R',
            type: 'FLOOR',
            name: 'Toiture Terrasse',
            code: 'R-ROOF',
            expanded: true,
            children: [
              { id: 'AST-9921', type: 'EQUIPMENT', name: 'Groupe Froid CTA-1', code: 'E-HVAC-01', status: 'MAINTENANCE', category: 'HVAC', cobieClass: 'HVAC.Chiller', bimRef: '0B4vX9_1H908uP45x9z$k' },
              { id: 'AST-9922', type: 'EQUIPMENT', name: 'Extracteur VMC', code: 'E-HVAC-02', status: 'OPERATIONAL', category: 'HVAC', cobieClass: 'HVAC.Fan', bimRef: '2L7mD1_9K438jF12v8z@m' }
            ]
          }
        ]
      }
    ]
  }
];

// Helper to flatten the tree for filtering/searching while maintaining visual indent
const flattenTree = (nodes, level = 0, parentId = null) => {
  let result = [];
  nodes.forEach(node => {
    result.push({ ...node, level, parentId });
    if (node.children && node.expanded) {
      result = result.concat(flattenTree(node.children, level + 1, node.id));
    }
  });
  return result;
};

export default function Assets() {
  const navigate = useNavigate();
  const { isOffline, isOnline } = useOfflineStatus();
  
  // Data State
  const [assetTree, setAssetTree] = useState(MOCK_HIERARCHY);
  const [flatAssets, setFlatAssets] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryTab, setCategoryTab] = useState('ALL');
  
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedQRTagAsset, setSelectedQRTagAsset] = useState(null);
  
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    // In a real app, we would fetch the tree here based on Tenant ID (RLS applied on backend)
    const flat = flattenTree(assetTree);
    
    // Apply filters
    const filtered = flat.filter(node => {
      if (search && !node.name.toLowerCase().includes(search.toLowerCase()) && !node.code.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && node.type === 'EQUIPMENT' && node.status !== statusFilter) return false;
      if (categoryTab !== 'ALL' && node.type === 'EQUIPMENT' && node.category !== categoryTab) return false;
      return true;
    });

    setFlatAssets(filtered);

    if (filtered.length > 0 && !selectedAsset) {
      // Auto-select the first equipment found
      const firstEq = filtered.find(a => a.type === 'EQUIPMENT');
      if (firstEq) setSelectedAsset(firstEq);
    }
  }, [search, statusFilter, categoryTab, assetTree]);

  const toggleNode = (nodeId) => {
    const toggleRecursive = (nodes) => {
      return nodes.map(n => {
        if (n.id === nodeId) return { ...n, expanded: !n.expanded };
        if (n.children) return { ...n, children: toggleRecursive(n.children) };
        return n;
      });
    };
    setAssetTree(toggleRecursive(assetTree));
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
    toast.success(`Intervention (WO) créée pour l'équipement ${asset?.code || asset?.name} !`);
  };

  const handleSyncBIM = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Synchronisation du modèle IFC/COBie Lite en cours...',
        success: 'Modèle de données maître mis à jour depuis le BIM.',
        error: 'Erreur de synchronisation.',
      }
    );
  };

  return (
    <div className="relative min-h-full bg-background overflow-hidden text-zinc-100 font-sans pb-12">
      {/* Dynamic Background Shader */}
      <ShaderBackground />

      {/* Main Container */}
      <div className="relative z-10 p-6 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* ============== HEADER BAR ============== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/40 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight font-display uppercase text-zinc-50">
                MODÈLE DE DONNÉES ACTIFS
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-brand-cyan rounded">
                Structure Canonique (H1)
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_var(--brand-cyan,_#00dbe7)] animate-pulse" />
              Conformité stricte COBie Lite • Multi-niveaux (Site → Équipement)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncBIM}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-brand-cyan hover:border-brand-cyan/50 text-[10px] font-mono uppercase font-bold rounded transition-colors"
            >
              <DownloadCloud className="w-4 h-4" />
              Sync. IFC / BIM
            </button>
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
              Ajouter
            </button>
          </div>
        </div>

        {/* ============== SCANNER INTEGRATION ============== */}
        {showScanner && (
          <div className="transition-all animate-in fade-in duration-300">
            <AssetQRScanner onAssetSelected={(asset) => {}} />
          </div>
        )}

        {/* ============== MAIN WORKSPACE (SPLIT VIEW) ============== */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* LEFT SIDE: Hierarchical Tree Table */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            <div className="bg-surface/60 backdrop-blur-md rounded-xl border border-zinc-800/60 shadow-lg flex flex-col flex-1 overflow-hidden h-[700px]">
              <div className="p-5 border-b border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold font-mono tracking-wider text-zinc-100 text-xs uppercase flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-cyan" />
                  RÉFÉRENTIEL HIÉRARCHIQUE (SPATIAL & TECHNIQUE)
                </h3>
                
                {/* Filter and Tab Controllers */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Filtrer code ou nom..."
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
                </div>
              </div>

              {/* Hierarchical Table Layout */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800/60">
                    <tr className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider">
                      <th className="p-4 w-12 text-center"></th>
                      <th className="p-4">Nomenclature & Structure</th>
                      <th className="p-4">Code / Type</th>
                      <th className="p-4">Standard (COBie / IFC)</th>
                      <th className="p-4 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs divide-y divide-zinc-800/30">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-zinc-500">Chargement de la hiérarchie...</td>
                      </tr>
                    ) : flatAssets.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-zinc-500">Aucun élément trouvé.</td>
                      </tr>
                    ) : (
                      flatAssets.map((node) => {
                        const isSelected = selectedAsset?.id === node.id;
                        const isEquipment = node.type === 'EQUIPMENT';
                        
                        return (
                          <tr
                            key={node.id}
                            onClick={() => {
                              if (isEquipment) setSelectedAsset(node);
                            }}
                            className={`transition-colors relative ${isEquipment ? 'cursor-pointer hover:bg-zinc-800/30' : 'bg-zinc-900/20'} ${
                              isSelected ? 'bg-brand-cyan/5 text-zinc-100' : 'text-zinc-300'
                            }`}
                          >
                            <td className="p-4 text-center relative">
                              {isSelected && (
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-cyan shadow-[0_0_10px_var(--brand-cyan,_#00dbe7)]"></div>
                              )}
                              {isEquipment ? (
                                <div className={`w-2 h-2 rounded-full mx-auto shadow-md ${
                                  node.status === 'OPERATIONAL' ? 'bg-emerald-400 shadow-emerald-400/50' :
                                  node.status === 'MAINTENANCE' ? 'bg-brand-orange shadow-brand-orange/50' :
                                  'bg-red-500 shadow-red-500/50 animate-pulse'
                                }`} />
                              ) : (
                                <button onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }} className="text-zinc-500 hover:text-zinc-300">
                                  <ChevronRight className={`w-4 h-4 transition-transform ${node.expanded ? 'rotate-90' : ''}`} />
                                </button>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2" style={{ paddingLeft: `${node.level * 1.5}rem` }}>
                                {!isEquipment && <Layers className="w-3.5 h-3.5 text-zinc-500" />}
                                <span className={`${isEquipment ? 'text-zinc-100 font-sans font-medium' : 'text-brand-cyan/80 font-mono font-bold'}`}>
                                  {node.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-400 uppercase">
                                {node.code}
                              </span>
                            </td>
                            <td className="p-4 text-zinc-500 text-[10px]">
                              {isEquipment && node.cobieClass && (
                                <span title={`BIM Ref: ${node.bimRef}`}>{node.cobieClass}</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              {isEquipment && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                                  node.status === 'OPERATIONAL' ? 'text-emerald-400 bg-emerald-400/10' :
                                  node.status === 'MAINTENANCE' ? 'text-brand-orange bg-brand-orange/10' :
                                  'text-red-400 bg-red-400/10'
                                }`}>
                                  {node.status}
                                </span>
                              )}
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

          {/* RIGHT SIDE: Dedicated Equipment Sidebar Card (400px wide) */}
          <div className="w-full lg:w-[400px] shrink-0 bg-surface/80 backdrop-blur-md border border-zinc-800/60 shadow-2xl rounded-xl overflow-hidden flex flex-col justify-between self-start h-[700px]">
            
            {selectedAsset && selectedAsset.type === 'EQUIPMENT' ? (
              <>
                {/* Header Asset Schematic Image */}
                <div className="h-44 relative w-full bg-zinc-900/50 overflow-hidden shrink-0">
                  <div className={`absolute inset-0 mix-blend-color z-10 pointer-events-none ${selectedAsset.status === 'OPERATIONAL' ? 'bg-brand-cyan/5' : 'bg-brand-orange/5'}`}></div>
                  <img
                    className="w-full h-full object-cover opacity-50 mix-blend-luminosity hover:scale-105 transition-transform duration-500"
                    alt="Asset Schematic Visualizer"
                    src={selectedAsset.category === 'ELECTRICAL' 
                      ? "https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?q=80&w=800&auto=format&fit=crop"
                      : "https://lh3.googleusercontent.com/aida-public/AB6AXuDe653f-6JCMQJnhQopki0Ww1jW3K6GKz-k4Ta6MlecyI6S2A1ErTP0xRSV5BqewtYBEzy19Ae5ORstLrb0ZPBsBBlAM--aM4G3PBvA_nI4RoXnnhygYu6XC6mAWD5X87t74Nh93xvU9cGwYtO05lUpCObubzXS9ytSaI1fEIpTTOY2LtT5pMZT1Cj9EB1rG_oHnFI3UjPOUAAZ-J68PeERkA0Z6EBmKoL-p980J3xV8fstEb6Ch8-k"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent"></div>
                  
                  {/* Floating Action/Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider border rounded-sm ${
                      selectedAsset.status === 'OPERATIONAL'
                        ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                        : 'bg-brand-orange/10 text-brand-orange border-brand-orange/20 shadow-[0_0_10px_rgba(243,128,32,0.2)]'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {selectedAsset.status}
                    </span>
                  </div>
                </div>

                {/* Main Details Body */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                  
                  {/* Identity Row */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[9px] font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded uppercase">
                        {selectedAsset.code}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-brand-cyan font-bold">
                        {selectedAsset.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-display tracking-tight text-zinc-100">{selectedAsset.name}</h3>
                  </div>

                  {/* COBie & BIM Data Section */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-800/40 pb-2 flex justify-between">
                      <span>Données BIM & COBie</span>
                      <span className="text-brand-cyan">Certifié IFC</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800/60 flex justify-between items-center">
                        <span className="font-mono text-zinc-500 text-[10px] uppercase">COBie.Type.Category</span>
                        <span className="text-[10px] text-zinc-300 font-mono bg-zinc-800 px-2 py-0.5 rounded">{selectedAsset.cobieClass}</span>
                      </div>
                      <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800/60 flex justify-between items-center">
                        <span className="font-mono text-zinc-500 text-[10px] uppercase">IFC GUID (GlobalId)</span>
                        <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[150px]" title={selectedAsset.bimRef}>{selectedAsset.bimRef}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Action Block if Maintenance/Breakdown */}
                  {selectedAsset.status !== 'OPERATIONAL' && (
                    <div className="bg-brand-orange/5 border-l-2 border-brand-orange p-4 rounded-r space-y-1 animate-pulse">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-mono text-brand-orange font-bold text-[10px] uppercase tracking-wider">Intervention Requise</span>
                          <span className="block font-sans text-xs text-zinc-300 leading-snug">
                            Cet équipement est en état de défaut ou nécessite une maintenance préventive immédiate.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="p-5 border-t border-zinc-800/50 bg-zinc-950/80 flex gap-3 shrink-0">
                  <button
                    onClick={() => handleDispatchTech(selectedAsset)}
                    className="flex-1 bg-zinc-100 text-zinc-900 font-mono font-bold py-3 rounded text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 duration-200 uppercase"
                  >
                    Créer Work Order
                  </button>
                  
                  <button
                    onClick={() => setSelectedQRTagAsset(selectedAsset)}
                    className="w-12 h-12 flex items-center justify-center border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 rounded transition-all bg-zinc-900"
                    title="Imprimer Tag QR"
                  >
                    <QrCode className="w-4 h-4 text-brand-cyan" />
                  </button>

                  <button
                    onClick={() => handleEdit(selectedAsset)}
                    className="w-12 h-12 flex items-center justify-center border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 rounded transition-all bg-zinc-900"
                    title="Modifier l'actif"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-12 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
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
        onSuccess={() => {}}
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
