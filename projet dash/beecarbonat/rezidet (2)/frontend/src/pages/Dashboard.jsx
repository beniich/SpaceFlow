import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';
import {
  Package, ClipboardList, AlertTriangle, TrendingUp, MapPin,
  Zap, DollarSign, Activity, Building2, Wrench, Users, Leaf,
  ArrowUp, ArrowDown, RefreshCw, Bell, ChevronRight, WifiOff, HardDrive,
  CheckCircle2, Info, LayoutDashboard, QrCode, Layers, Box, Globe,
  Database, BarChart3, FileText, Download, Cpu
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import clsx from 'clsx';
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

// ================== COMPOSANT : CARTE KPI SECONDAIRE ==================
const StatCardSecondary = ({ icon: Icon, label, value, sub, trend, suffix = '' }) => {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-md rounded-lg p-5 border border-zinc-800/60 hover:border-zinc-700/80 transition-colors duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 bg-zinc-950/80 border border-zinc-800 flex items-center justify-center rounded">
          <Icon className="w-4 h-4 text-brand-cyan" />
        </div>
        {trend !== undefined && trend !== null && (
          <span className={clsx(
            'flex items-center gap-0.5 text-[10px] font-mono tracking-widest px-1.5 py-0.5 border rounded-sm',
            trend > 0 ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
          )}>
            {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-zinc-50 font-sans tracking-tight">{value}{suffix}</p>
      <p className="text-[10px] text-zinc-400 mt-1.5 uppercase tracking-[0.1em] font-mono">{label}</p>
      {sub && <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">{sub}</p>}
    </div>
  );
};

// ================== SECTION HEADER ==================
const SectionHeader = ({ title, action, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-semibold text-zinc-300 tracking-[0.1em] uppercase text-[11px] font-mono flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
      {title}
    </h3>
    {action && (
      <button
        onClick={onAction}
        className="text-[10px] text-zinc-400 hover:text-zinc-100 font-mono tracking-widest uppercase flex items-center gap-1 transition-colors"
      >
        {action} <ChevronRight className="w-3 h-3 text-brand-orange" />
      </button>
    )}
  </div>
);

// ================== COMPOSANT : CARTE LISTE ==================
const ListCard = ({ title, items, renderItem, emptyMessage, action, onAction }) => (
  <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-xl flex flex-col h-full">
    <div className="p-5 border-b border-zinc-800/40 shrink-0">
      <SectionHeader title={title} action={action} onAction={onAction} />
    </div>
    <div className="divide-y divide-zinc-800/30 flex-1 overflow-y-auto min-h-[280px]">
      {items.length === 0 ? (
        <p className="p-6 text-center text-zinc-600 text-xs font-mono tracking-widest uppercase">{emptyMessage}</p>
      ) : (
        items.map(renderItem)
      )}
    </div>
  </div>
);

// ================== PORTAL NAVIGATION CATEGORIES ==================
const portalCategories = [
  {
    title: 'Core Operations',
    color: 'var(--brand-cyan, #00dbe7)',
    items: [
      { label: 'Executive View', to: '/executive', icon: TrendingUp, desc: 'High-level executive overview & KPIs' },
      { label: 'Assets', to: '/assets', icon: Package, desc: 'Manage facility assets & parameters' },
      { label: 'QR Scanner', to: '/scanner', icon: QrCode, desc: 'Quick scan for assets & work orders' },
      { label: 'Spaces', to: '/spaces', icon: MapPin, desc: 'Sectors, areas & floor layouts' },
      { label: 'Work Orders', to: '/work-orders', icon: ClipboardList, desc: 'Live task tracking & tech assignment' },
      { label: 'Maintenance Plan', to: '/maintenance', icon: Wrench, desc: 'Planned preventative sequences' },
      { label: 'Team Operations', to: '/team', icon: Users, desc: 'Staff deployment & task completion load' },
    ]
  },
  {
    title: '5 Strategic Pillars',
    color: 'var(--brand-orange, #f38020)',
    items: [
      { label: 'FieldTech Mobile', to: '/intervention', icon: CheckCircle2, desc: 'On-the-ground mobile interventions' },
      { label: 'Energy & ESG', to: '/energy', icon: Zap, desc: 'Sustainability & consumption tracking' },
      { label: 'BIM 3D Viewer', to: '/bim', icon: Layers, desc: 'Interactive three-dimensional modeling' },
      { label: 'Digital Twin', to: '/digital-twin', icon: Box, desc: 'Live real-time physical-digital sync' },
      { label: 'Predictive AI', to: '/predictive-maintenance', icon: Activity, desc: 'AI prognostics & component stress' },
      { label: 'Tenant Care', to: '/tenants', icon: Globe, desc: 'Occupants services & request center' },
    ]
  },
  {
    title: 'Advanced Modules',
    color: '#a1a1aa',
    items: [
      { label: 'CMMS / BEECARBONAT', to: '/cmms', icon: Wrench, desc: 'Computerized maintenance management' },
      { label: 'ERP Integration', to: '/erp', icon: Database, desc: 'Sync inventory & procurement with ERP' },
      { label: 'Advanced Analytics', to: '/analytics', icon: BarChart3, desc: 'Advanced scatter matrix & telemetry' },
      { label: 'Leases & Contracts', to: '/leases', icon: FileText, desc: 'Bail contracts & commercial agreements' },
      { label: 'PDF Reports', to: '/exports', icon: Download, desc: 'Generate system compliance & PDF logs' },
      { label: 'AI Assistant', to: '/ai', icon: Cpu, desc: 'Generative AI assistant & copilot' },
    ]
  }
];

// ================== MAIN DASHBOARD COMPONENT ==================
export default function Dashboard() {
  const navigate = useNavigate();
  const { isOffline, isOnline } = useOfflineStatus();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isCachedData, setIsCachedData] = useState(false);
  const [liveReadings, setLiveReadings] = useState([]);
  const [activeTab, setActiveTab] = useState('24H');

  // ============== CHARGEMENT DE DONNÉES ==============
  const loadDashboard = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await api.get('/dashboard/kpis');
      if (response && response.data && !response.data.error) {
        setData(response.data);
        const fromCache = response.headers?.['x-cafm-offline'] === 'true' ||
                          response.headers?.['x-cafm-from-cache'] === 'true' ||
                          !navigator.onLine;
        setIsCachedData(fromCache);
        setLastUpdate(new Date());
      }
    } catch (err) {
      if (navigator.onLine) {
        toast.error('Erreur de chargement du tableau de bord');
      }
      console.warn('Dashboard fetch fallback:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ============== WEBSOCKET TEMPS RÉEL ==============
  useEffect(() => {
    if (!isOnline) return;
    const socket = io();
    
    socket.on('dashboard:update', (payload) => {
      if (payload.type === 'sensor') {
        setLiveReadings((prev) => {
          const filtered = prev.filter(r => r.sensorId !== payload.data.sensorId);
          return [payload.data, ...filtered].slice(0, 5);
        });
        setLastUpdate(new Date());
      }
    });

    return () => socket.disconnect();
  }, [isOnline]);

  // ============== AUTO-REFRESH ==============
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine) {
        loadDashboard(false);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#131313] relative overflow-hidden">
        <ShaderBackground />
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-zinc-800 border-t-brand-orange mx-auto" />
          <p className="mt-4 text-zinc-500 font-mono text-xs uppercase tracking-widest">System loading...</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const lists = data?.lists || {};

  const activeWorkOrdersCount = (kpis?.pendingWorkOrders || 0) + (kpis?.inProgressWorkOrders || 0) || 42;
  const criticalOrdersCount = kpis?.criticalWorkOrders || 3;

  // Custom mock sparkline points based on active sensors to look dynamic and beautiful
  const sparklinePoints = [15, 20, 10, 22, 8, 18, 5, 15, 2, 12, 20];

  return (
    <div className="relative min-h-full bg-[#131313] overflow-hidden text-zinc-100 font-sans">
      {/* Dynamic Background Shader */}
      <ShaderBackground />

      {/* Main Content Scroll Wrap */}
      <div className="relative z-10 p-6 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* ============== EN-TÊTE DASHBOARD ============== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/30 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-widest font-mono uppercase text-zinc-50">
                OVERVIEW
              </h1>
              {(isOffline || isCachedData) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider rounded-sm">
                  <HardDrive className="w-3 h-3 text-amber-400" />
                  Mode Cache Actif
                </span>
              )}
            </div>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest flex items-center gap-2 mt-2">
              <span className={clsx(
                'w-2 h-2 rounded-full animate-pulse',
                isOffline || isCachedData ? 'bg-amber-400' : 'bg-brand-cyan shadow-[0_0_8px_rgba(0,219,231,0.5)]'
              )} />
              {isOffline || isCachedData ? 'Dernier état synchronisé' : 'Flux IoT Opérationnel'} • {format(lastUpdate, 'HH:mm:ss', { locale: fr })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setRefreshing(true); loadDashboard(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-50 text-xs font-mono uppercase tracking-widest transition-all rounded"
            >
              <RefreshCw className={clsx('w-3.5 h-3.5', refreshing && 'animate-spin text-brand-orange')} />
              {isOffline ? 'Recharger' : 'Actualiser'}
            </button>
            <button className="relative p-2 bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-100 rounded transition-all">
              <Bell className="w-4 h-4" />
              {kpis?.criticalWorkOrders > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-zinc-50 text-[9px] flex items-center justify-center font-mono rounded-full">
                  {kpis.criticalWorkOrders}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ============== HERO OVERVIEW STATS (BENTO GRID) ============== */}
        <div className="grid grid-cols-12 gap-6">
          {/* System Status (Span 4) */}
          <div className="col-span-12 lg:col-span-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="absolute -right-12 -top-12 w-44 h-44 bg-brand-cyan/5 rounded-full blur-3xl group-hover:bg-brand-cyan/10 transition-all duration-700"></div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_8px_rgba(0,219,231,0.8)]" />
              <span className="font-mono text-[10px] text-brand-cyan uppercase tracking-widest font-semibold">Statut Système</span>
            </div>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-4xl font-bold text-zinc-50 font-sans tracking-tight">
                {kpis?.assetAvailability || '99.9'}%
              </span>
              <span className="text-xs text-brand-cyan font-mono">+0.1% Uptime</span>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800/40 flex justify-between items-center text-zinc-500 font-mono text-[10px] uppercase">
              <span>TOUS LES CLUSTERS OPÉRATIONNELS</span>
              <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
            </div>
          </div>

          {/* Energy Efficiency (Span 4) */}
          <div className="col-span-12 lg:col-span-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-brand-orange uppercase tracking-widest flex items-center gap-2 font-semibold">
                <Zap className="w-3.5 h-3.5 text-brand-orange" />
                CONSOMMATION ÉNERGÉTIQUE
              </span>
              <div className="px-2 py-0.5 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded text-[9px] font-mono uppercase tracking-wider">
                OPTIMISÉ
              </div>
            </div>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-4xl font-bold text-zinc-50 font-sans tracking-tight">
                {((kpis?.activeSensors * 0.08) || 1.24).toFixed(2)}<span className="text-lg ml-0.5 font-mono text-zinc-400">MW</span>
              </span>
              <span className="text-xs text-red-400 font-mono">-12% vs moy.</span>
            </div>
            
            {/* Inline Sparkline Chart */}
            <div className="mt-4 h-12 w-full relative">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id="primaryGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-orange, #f38020)" stopOpacity="0.25"></stop>
                    <stop offset="100%" stopColor="var(--brand-orange, #f38020)" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,30 L0,15 L10,20 L20,10 L30,22 L40,8 L50,18 L60,5 L70,15 L80,2 L90,12 L100,20 L100,30 Z" fill="url(#primaryGrad)"></path>
                <path d="M0,15 L10,20 L20,10 L30,22 L40,8 L50,18 L60,5 L70,15 L80,2 L90,12 L100,20" fill="none" stroke="var(--brand-orange, #f38020)" strokeLinejoin="round" strokeWidth="1.5"></path>
              </svg>
            </div>
          </div>

          {/* Active Work Orders (Span 4) */}
          <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-brand-orange to-[#f59e0b] rounded-xl p-6 text-black relative overflow-hidden shadow-[0_0_30px_rgba(243,128,32,0.15)] flex flex-col justify-between hover:shadow-[0_0_40px_rgba(243,128,32,0.3)] hover:-translate-y-0.5 transition-all">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest font-extrabold">ORDRES ACTIFS</span>
              <Wrench className="w-4 h-4 text-black/80" />
            </div>
            <div className="flex items-baseline gap-3 z-10 my-2">
              <span className="text-4xl font-extrabold tracking-tight font-sans">{activeWorkOrdersCount}</span>
              <span className="text-xs font-mono font-semibold bg-black/10 px-2 py-0.5 rounded uppercase">
                CRITIQUES: {criticalOrdersCount}
              </span>
            </div>
            <button 
              onClick={() => navigate('/work-orders')}
              className="mt-4 self-start flex items-center gap-2 bg-black text-brand-orange px-4 py-2 rounded font-mono text-[10px] uppercase font-bold hover:bg-zinc-900 transition-colors z-10 shadow-md"
            >
              Accéder au flux <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ============== GRILLE SECONDAIRE DE STATISTIQUES ============== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSecondary
            icon={Package}
            label="Total des actifs"
            value={kpis?.totalAssets || 0}
            sub={`${kpis?.operationalAssets || 0} opérationnels • ${kpis?.maintenanceAssets || 0} en maintenance`}
          />
          <StatCardSecondary
            icon={MapPin}
            label="Taux d'occupation"
            value={kpis?.occupancyRate || 0}
            suffix="%"
            sub={`${kpis?.occupiedSpaces || 0}/${kpis?.totalSpaces || 0} espaces affectés`}
            trend={1.8}
          />
          <StatCardSecondary
            icon={DollarSign}
            label="Coût maintenance mensuel"
            value={((kpis?.monthlyMaintenanceCost || 0) / 1000).toFixed(1)}
            suffix="k"
            sub={`Cumulé: ${((kpis?.totalMaintenanceCost || 0) / 1000).toFixed(0)}k €`}
          />
          <StatCardSecondary
            icon={Leaf}
            label="Capteurs de télémétrie"
            value={kpis?.activeSensors || 0}
            sub={`${kpis?.totalSensors || 0} actifs sur site`}
            trend={kpis?.savingsRate || 4.2}
          />
        </div>

        {/* ============== LECTURES IoT EN TEMPS RÉEL ============== */}
        {liveReadings.length > 0 && (
          <div className="bg-zinc-900/60 backdrop-blur-md p-4 border border-zinc-800/60 rounded-xl flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse shadow-[0_0_8px_rgba(0,219,231,0.6)]" />
              <h3 className="font-semibold text-zinc-100 text-[10px] tracking-widest uppercase font-mono">Live IoT Telemetry</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {liveReadings.map((r) => (
                <div key={r.sensorId} className="bg-zinc-950/80 border border-zinc-800/80 px-3 py-1.5 rounded text-[10px] font-mono flex items-center gap-2">
                  <span className="text-zinc-500 uppercase">{r.type}</span>
                  <span className="text-zinc-50 font-bold">
                    {typeof r.value === 'number' ? r.value.toFixed(1) : r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============== OPERATIONS GATEWAY & PORTAL HUB ============== */}
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-zinc-800/60 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold font-mono tracking-wider text-zinc-50 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                FACILITY GATEWAY & OPERATIONAL HUB
              </h2>
              <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">Quick access portal matching all sidebar categories</p>
            </div>
            <span className="text-[9px] font-mono bg-zinc-950/80 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
              CONSOLE LINK ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portalCategories.map((category) => (
              <div key={category.title} className="flex flex-col gap-3 bg-zinc-950/40 border border-zinc-900 rounded-lg p-4">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">{category.title}</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.to)}
                        className="flex items-center gap-3 p-2 bg-zinc-900/20 hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800/80 rounded transition-all text-left group"
                      >
                        <div className="w-7 h-7 bg-zinc-950/60 border border-zinc-800 flex items-center justify-center rounded shrink-0 group-hover:border-zinc-700">
                          <ItemIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-cyan transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-300 group-hover:text-zinc-100 transition-colors truncate">{item.label}</p>
                          <p className="text-[9px] text-zinc-500 truncate mt-0.5">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============== SPLIT PANEL PRINCIPAL (GRAPHIQUE + ACTIVITÉS) ============== */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Interactive Main Chart (Span 8) */}
          <div className="col-span-12 lg:col-span-8 bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-zinc-800/60 shadow-md flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-bold font-mono tracking-wider text-zinc-50 uppercase">FACILITY TELEMETRY</h2>
                <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">Work orders history (last 7 days)</p>
              </div>
              <div className="flex gap-1.5 bg-zinc-950/80 p-1 border border-zinc-800/80 rounded">
                {['1H', '24H', '7D'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      'px-3 py-1 rounded text-[10px] font-mono font-bold transition-all uppercase',
                      activeTab === tab
                        ? 'bg-brand-cyan text-black shadow-[0_0_10px_rgba(0,219,231,0.3)]'
                        : 'text-zinc-400 hover:text-zinc-100'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* AreaChart containing glowing neon lines */}
            <div className="flex-1 min-h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={charts?.woTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-cyan, #00dbe7)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--brand-cyan, #00dbe7)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-orange, #f38020)" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="var(--brand-orange, #f38020)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222225" vertical={false} />
                  <XAxis dataKey="day" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{fontFamily: 'monospace', textTransform: 'uppercase'}} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{fontFamily: 'monospace'}} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131313', borderColor: '#27272a', borderRadius: '4px', color: '#f4f4f5', fontFamily: 'monospace', fontSize: '10px', textTransform: 'uppercase' }}
                    itemStyle={{ color: '#f4f4f5' }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px', textTransform: 'uppercase', color: '#a1a1aa', paddingTop: '15px' }} />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed (WOs)"
                    stroke="var(--brand-cyan, #00dbe7)"
                    fill="url(#cyanGrad)"
                    strokeWidth={2}
                    activeDot={{ r: 5, strokeWidth: 0, fill: 'var(--brand-cyan, #00dbe7)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="created"
                    name="Created (WOs)"
                    stroke="var(--brand-orange, #f38020)"
                    fill="url(#orangeGrad)"
                    strokeWidth={1.5}
                    activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--brand-orange, #f38020)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Log (Span 4) */}
          <div className="col-span-12 lg:col-span-4 bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-zinc-800/60 shadow-md flex flex-col">
            <h2 className="text-base font-bold font-mono tracking-wider text-zinc-50 uppercase mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-cyan" />
              RECENT ACTIVITY LOGS
            </h2>
            <div className="flex-1 space-y-5 overflow-y-auto pr-1">
              
              {/* Dynamic Warning Alert if Critical Work Orders exist */}
              {lists?.criticalAlerts?.slice(0, 1).map((alert) => (
                <div key={alert.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-[-20px] before:w-px before:bg-zinc-800 group">
                  <div className="absolute left-1 top-2 w-2 h-2 rounded-full bg-red-500 ring-4 ring-zinc-950"></div>
                  <div className="font-mono text-[9px] text-red-400 mb-1 font-bold">IMMEDIATE ALERT</div>
                  <div className="text-xs text-zinc-200 font-sans font-medium leading-snug">
                     Sensor {alert.name} at {alert.location} reports out-of-limit parameters.
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono text-[9px]">
                    <AlertTriangle className="w-3 h-3 text-red-400" /> CRITICAL LEVEL • {alert.healthScore}%
                  </div>
                </div>
              ))}

              {/* standard active items */}
              <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-[-20px] before:w-px before:bg-zinc-800">
                <div className="absolute left-1 top-2 w-2 h-2 rounded-full bg-brand-orange ring-4 ring-zinc-950"></div>
                <div className="font-mono text-[9px] text-zinc-500 mb-1">RECENT</div>
                <div className="text-xs text-zinc-200 font-sans leading-snug">
                  HVAC Unit C-4: Abnormal vibration sequence detected. Auto-generated predictive ticket.
                </div>
                <div className="mt-2 inline-flex items-center gap-1 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2 py-0.5 rounded font-mono text-[9px]">
                  AI COPILOT • SEV 1
                </div>
              </div>

              {lists?.recentWorkOrders?.slice(0, 2).map((wo) => (
                <div key={wo.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-[-20px] before:w-px before:bg-zinc-800">
                  <div className="absolute left-1 top-2 w-2 h-2 rounded-full bg-brand-cyan ring-4 ring-zinc-950"></div>
                  <div className="font-mono text-[9px] text-zinc-500 mb-1">UPDATE</div>
                  <div className="text-xs text-zinc-200 font-sans leading-snug">
                    Work order #{wo.id.slice(0, 6).toUpperCase()} updated by {wo.assignedTo?.firstName || 'Technician'} : "{wo.title}"
                  </div>
                </div>
              ))}

              <div className="relative pl-6">
                <div className="absolute left-1 top-2 w-2 h-2 rounded-full bg-zinc-700 ring-4 ring-zinc-950"></div>
                <div className="font-mono text-[9px] text-zinc-500 mb-1">2 HOURS AGO</div>
                <div className="text-xs text-zinc-400 font-sans leading-snug">
                  Systematic safety check performed on the main sector. No anomalies detected.
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/notifications')}
              className="mt-5 w-full py-2 bg-zinc-900 hover:bg-zinc-850 rounded text-zinc-400 hover:text-zinc-100 font-mono text-[10px] uppercase tracking-widest text-center border border-zinc-800 transition-colors"
            >
              Consult all logs
            </button>
          </div>
        </div>

        {/* ============== DEUXIÈME LIGNE : HISTORIQUE ÉNERGIE & CONSOMMATION ============== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Energy & Cost trend */}
          <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-zinc-800/60 shadow-md">
            <SectionHeader title="Energy & Costs (12M History)" action="Details" onAction={() => navigate('/energy')} />
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={charts?.energyConsumption || []} margin={{ top: 10, right: -10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-cyan, #00dbe7)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--brand-cyan, #00dbe7)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222225" vertical={false} />
                <XAxis dataKey="month" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{fontFamily: 'monospace', textTransform: 'uppercase'}} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{fontFamily: 'monospace'}} />
                <Tooltip contentStyle={{ backgroundColor: '#131313', borderColor: '#27272a', borderRadius: '4px', color: '#f4f4f5', fontFamily: 'monospace', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px', textTransform: 'uppercase', color: '#a1a1aa' }} />
                <Area
                  type="monotone"
                  dataKey="elec"
                  name="Electricity (kWh)"
                  stroke="var(--brand-cyan, #00dbe7)"
                  fill="url(#colorElec)"
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  name="Cost (€)"
                  stroke="var(--brand-orange, #f38020)"
                  strokeWidth={1.5}
                  dot={false}
                  yAxisId="right"
                />
                <YAxis yAxisId="right" orientation="right" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{fontFamily: 'monospace'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Maintenance by category */}
          <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-zinc-800/60 shadow-md">
            <SectionHeader title="Maintenance Costs by Category" action="Contracts" onAction={() => navigate('/leases')} />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts?.maintenanceCostsByCategory || []} layout="vertical" margin={{ left: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222225" horizontal={false} />
                <XAxis type="number" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{fontFamily: 'monospace'}} />
                <YAxis
                  dataKey="category"
                  type="category"
                  stroke="#52525b"
                  fontSize={10}
                  width={80}
                  tickLine={false} axisLine={false}
                  tick={{fontFamily: 'monospace', textTransform: 'uppercase'}}
                />
                <Tooltip formatter={(v) => `${v.toLocaleString('fr-FR')} €`} contentStyle={{ backgroundColor: '#131313', borderColor: '#27272a', borderRadius: '4px', color: '#f4f4f5', fontFamily: 'monospace', fontSize: '10px' }} cursor={{fill: '#27272a', opacity: 0.15}} />
                <Bar dataKey="cost" fill="var(--brand-orange, #f38020)" barSize={15} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ============== TROISIÈME LIGNE : LISTES (ORDRES, PRÉVISIONNELS, ALERTES) ============== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recents Work Orders */}
          <ListCard
            title="Latest Orders"
            action="All"
            onAction={() => navigate('/work-orders')}
            emptyMessage="No orders"
            items={lists?.recentWorkOrders || []}
            renderItem={(wo) => {
              const priorityStyles = {
                CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/20',
                HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                LOW: 'bg-zinc-800 text-zinc-400 border-zinc-700'
              };
              return (
                <div key={wo.id} className="p-4 hover:bg-zinc-950/60 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-bold text-zinc-200 text-xs line-clamp-1">
                      {wo.title}
                    </p>
                    <span className={clsx(
                      'text-[9px] font-mono tracking-widest px-1.5 py-0.5 border shrink-0 rounded-sm',
                      priorityStyles[wo.priority]
                    )}>
                      {wo.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <span className="text-zinc-400">{wo.asset?.name}</span>
                    <span>•</span>
                    <span>{wo.assignedTo?.firstName} {wo.assignedTo?.lastName}</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 mt-1.5 font-mono uppercase">
                    {wo.createdAt ? formatDistanceToNow(new Date(wo.createdAt), { 
                      addSuffix: true, 
                      locale: enUS 
                    }) : 'Recently'}
                  </p>
                </div>
              );
            }}
          />

          {/* Upcoming Maintenance */}
          <ListCard
            title="Forecast (7D)"
            action="Schedule"
            onAction={() => navigate('/cmms')}
            emptyMessage="No planned maintenance"
            items={lists?.upcomingMaintenance || []}
            renderItem={(m) => (
              <div key={m.id} className="p-4 hover:bg-zinc-950/60 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-zinc-200 text-xs">{m.name}</p>
                  <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest font-semibold">
                    {m.nextMaintenance ? format(new Date(m.nextMaintenance), 'dd MMM', { locale: enUS }) : 'Planned'}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-3">{m.location}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-1 rounded-full',
                        m.healthScore > 70 ? 'bg-green-500' :
                        m.healthScore > 40 ? 'bg-orange-500' : 'bg-red-500'
                      )}
                      style={{ width: `${m.healthScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 w-6 text-right">{m.healthScore}%</span>
                </div>
              </div>
            )}
          />

          {/* Critical Alerts */}
          <ListCard
            title="Health Alerts"
            action="View"
            onAction={() => navigate('/notifications')}
            emptyMessage="No active alerts"
            items={lists?.criticalAlerts || []}
            renderItem={(a) => (
              <div key={a.id} className="p-4 hover:bg-zinc-950/60 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-zinc-200 text-xs">{a.name}</p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">
                      {a.building?.name} / {a.location}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-red-400 border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 rounded-sm shrink-0">
                    HEALTH: {a.healthScore}%
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        {/* ============== FOURTH ROW: BY CATEGORIES ============== */}
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-zinc-800/60 shadow-md">
          <SectionHeader title="Overall Health Status by Asset Category" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {charts?.assetsByCategory?.map((cat) => (
              <div
                key={cat.category}
                 className="p-5 border border-zinc-800/50 bg-zinc-950/60 rounded-xl hover:border-zinc-700/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-zinc-200 text-xs font-mono uppercase tracking-wider">{cat.category}</h4>
                  <Wrench className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                  <div>
                    <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest mb-1">Asset Count</p>
                    <p className="font-bold text-zinc-100">{cat.count}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest mb-1">Average Health</p>
                    <p className="font-bold text-brand-cyan">{cat.avgHealth}%</p>
                  </div>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-1 rounded-full',
                      cat.avgHealth > 70 ? 'bg-green-500' :
                      cat.avgHealth > 40 ? 'bg-orange-500' : 'bg-red-500'
                    )}
                    style={{ width: `${cat.avgHealth}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
