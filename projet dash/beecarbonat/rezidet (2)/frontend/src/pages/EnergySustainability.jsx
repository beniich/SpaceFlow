import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, Leaf, TrendingDown, Sun, BarChart3, ShieldCheck,
  CheckCircle2, RefreshCw, AlertCircle, Cpu, Thermometer,
  Compass, Award, Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Database
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import { useEsgSummary, useSeedEsg } from '../features/esg/hooks/useEsgQueries';

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
    vec3 color2 = vec3(0.01, 0.05, 0.04); // Deep green/emerald depth
    
    float pulse = sin(u_time * 0.12) * 0.5 + 0.5;
    float dist = length(uv - mouse);
    
    // Subtle flowing noise-like pattern
    float noise = sin(uv.x * 6.0 - u_time * 0.3) * cos(uv.y * 6.0 + u_time * 0.1);
    vec3 finalColor = mix(color1, color2, noise * 0.07 + pulse * 0.03);
    
    // Accentuate mouse proximity with subtle emerald glow
    finalColor += vec3(0.0, 0.86, 0.45) * (1.0 - smoothstep(0.0, 0.5, dist)) * 0.03;
    
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

export default function EnergySustainability() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data: summary, isLoading, isError } = useEsgSummary(selectedYear);
  const { mutate: seedDatabase, isPending: isSeeding } = useSeedEsg();

  const [activeOptimizations, setActiveOptimizations] = useState({
    hvacSetback: true,
    smartLighting: true,
    offPeakVentilation: false
  });

  const handleToggleOpt = (key) => {
    setActiveOptimizations((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success(
        next[key]
          ? 'Règle d\'optimisation énergétique activée !'
          : 'Règle d\'optimisation désactivée.'
      );
      return next;
    });
  };

  const handleSeed = () => {
    if (window.confirm("Générer de fausses données pour l'année en cours (POC) ?")) {
      seedDatabase();
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-zinc-500 font-mono animate-pulse">Chargement des données ESG...</div>;
  }

  // Formatting helper
  const formatNum = (val) => new Intl.NumberFormat('fr-FR').format(val || 0);
  const formatCost = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val || 0);

  // Fallback data if no summary
  const s = summary || { totalCO2eKg: 0, byType: {}, byScope: {}, totalCost: 0 };
  const totalTonnes = (s.totalCO2eKg / 1000).toFixed(2);
  const totalKwh = Object.values(s.byType).reduce((sum, t) => sum + (t.energy || 0), 0);

  // Prepare chart data (Scopes)
  const scopeData = [
    { name: 'Scope 1 (Direct)', CO2e: s.byScope.scope1 || 0, fill: '#f38020' }, // Orange
    { name: 'Scope 2 (Indirect - Énergie)', CO2e: s.byScope.scope2 || 0, fill: '#00dbe7' }, // Cyan
    { name: 'Scope 3 (Autres)', CO2e: s.byScope.scope3 || 0, fill: '#34d399' }  // Emerald
  ];

  return (
    <div className="relative min-h-full bg-[#131313] overflow-hidden text-zinc-100 font-sans pb-12">
      <ShaderBackground />

      <div className="relative z-10 p-6 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* ============== HEADER BAR ============== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/30 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-widest font-mono uppercase text-zinc-50 flex items-center gap-3">
              <Zap className="w-6 h-6 text-brand-cyan drop-shadow-[0_0_8px_rgba(0,219,231,0.5)]" />
              ÉNERGIE &amp; ÉCO-RESPONSABILITÉ (ESG)
            </h1>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              Supervision de l'empreinte carbone et régulation prédictive de l'infrastructure
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="px-3 py-1.5 bg-brand-orange/20 border border-brand-orange/50 text-brand-orange hover:bg-brand-orange/30 font-bold text-xs uppercase rounded transition-colors flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              {isSeeding ? 'Génération...' : 'POC Seed Data'}
            </button>

            <div className="flex border border-zinc-800 bg-zinc-950/60 p-1 rounded">
              {[selectedYear - 1, selectedYear, selectedYear + 1].map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded transition-all ${
                    selectedYear === y
                      ? 'bg-brand-cyan text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>

            <div className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px] rounded flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ISO 50001 Certified</span>
            </div>
          </div>
        </div>

        {/* ============== KINETIC METRIC CARDS ============== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total CO2e */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-xl p-5 flex flex-col justify-between h-[150px] relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <Leaf className="w-12 h-12 text-brand-cyan" />
            </div>
            <div>
              <span className="font-mono text-brand-cyan text-[10px] tracking-[0.2em] uppercase block mb-1">EMPREINTE CARBONE (YTD)</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-4xl font-bold tracking-tight text-zinc-50 font-sans">{totalTonnes}</span>
                <span className="text-sm text-zinc-400 font-mono">tCO₂e</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-zinc-950/80 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-cyan to-teal-400 shadow-[0_0_10px_var(--brand-cyan, #00dbe7)]" 
                  style={{ width: `${Math.min((s.totalCO2eKg / 50000) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                <span>Total Scope 1/2/3</span>
                <span>Max Target: 50T</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Energy */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-xl p-5 flex items-center justify-between h-[150px] relative overflow-hidden shadow-lg group">
            <div className="flex flex-col justify-between h-full py-0.5">
              <div>
                <span className="font-mono text-emerald-400 text-[10px] tracking-[0.2em] uppercase block mb-1">ÉNERGIE CONSOMMÉE</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-4xl font-bold tracking-tight text-zinc-50 font-sans">{formatNum(totalKwh)}</span>
                  <span className="text-sm text-zinc-400 font-mono">kWh</span>
                </div>
              </div>
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                Électricité &amp; Gaz
              </span>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <Activity className="w-12 h-12 text-emerald-400" />
            </div>
          </div>

          {/* Card 3: Total Cost */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-xl p-5 flex flex-col justify-between h-[150px] relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <TrendingDown className="w-12 h-12 text-brand-orange" />
            </div>
            <div>
              <span className="font-mono text-brand-orange text-[10px] tracking-[0.2em] uppercase block mb-1">COÛT ÉNERGÉTIQUE (YTD)</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-4xl font-bold tracking-tight text-zinc-50 font-sans">{formatCost(s.totalCost)}</span>
              </div>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-500/10 rounded px-3 py-2 flex items-center gap-2">
              <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-300">
                <span className="font-bold text-emerald-400">Suivi rigoureux</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============== MAIN SECTION: CO2e BY SCOPE ============== */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="p-6 border-b border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-brand-cyan text-[10px] tracking-[0.2em] uppercase block mb-1">GHG Protocol Analysis</span>
              <h3 className="font-bold text-base text-zinc-50 font-sans tracking-tight uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_6px_var(--brand-cyan, #00dbe7)] animate-pulse"></span>
                ÉMISSIONS PAR SCOPE (kg CO₂e)
              </h3>
            </div>
          </div>

          <div className="p-6 h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scopeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={12} fontFamily="monospace" tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(19, 19, 19, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontFamily: 'monospace', color: '#fff' }}
                />
                <Bar dataKey="CO2e" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ============== BMS OPTIMIZATION RULES SECTION ============== */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-xl p-6 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/40 pb-4">
            <div>
              <span className="font-mono text-brand-cyan text-[10px] tracking-[0.2em] uppercase block mb-1">Building Management System (BMS)</span>
              <h3 className="font-bold text-base text-zinc-50 font-sans tracking-tight uppercase flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                Règles d'Automate d'Efficacité Énergétique (BMS / GTB)
              </h3>
            </div>
            <div className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/40 px-3 py-1.5 border border-emerald-500/20 rounded">
              Économie Estimée : ~15%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Rule 1 */}
            <div onClick={() => handleToggleOpt('hvacSetback')} className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 flex flex-col justify-between h-[170px] ${activeOptimizations.hvacSetback ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-100' : 'bg-zinc-950/50 border-zinc-850 text-zinc-400'}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Thermometer className={`w-6 h-6 ${activeOptimizations.hvacSetback ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span className={`text-[9px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-sm ${activeOptimizations.hvacSetback ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500'}`}>
                    {activeOptimizations.hvacSetback ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <h4 className={`font-bold text-sm tracking-tight ${activeOptimizations.hvacSetback ? 'text-zinc-50' : 'text-zinc-300'}`}>Consigne HVAC Adaptative (+1.5°C)</h4>
                <p className="text-xs text-zinc-500">Ajuste la température à 21.5°C pendant les pics de tarification.</p>
              </div>
            </div>

            {/* Rule 2 */}
            <div onClick={() => handleToggleOpt('smartLighting')} className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 flex flex-col justify-between h-[170px] ${activeOptimizations.smartLighting ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-100' : 'bg-zinc-950/50 border-zinc-850 text-zinc-400'}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Sun className={`w-6 h-6 ${activeOptimizations.smartLighting ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <span className={`text-[9px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-sm ${activeOptimizations.smartLighting ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500'}`}>
                    {activeOptimizations.smartLighting ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <h4 className={`font-bold text-sm tracking-tight ${activeOptimizations.smartLighting ? 'text-zinc-50' : 'text-zinc-300'}`}>Gradation DALI selon Luminosité</h4>
                <p className="text-xs text-zinc-500">Réduit l'intensité des bureaux selon l'éclairage naturel.</p>
              </div>
            </div>

            {/* Rule 3 */}
            <div onClick={() => handleToggleOpt('offPeakVentilation')} className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 flex flex-col justify-between h-[170px] ${activeOptimizations.offPeakVentilation ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-100' : 'bg-zinc-950/50 border-zinc-850 text-zinc-400'}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Zap className={`w-6 h-6 ${activeOptimizations.offPeakVentilation ? 'text-brand-cyan' : 'text-zinc-500'}`} />
                  <span className={`text-[9px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-sm ${activeOptimizations.offPeakVentilation ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500'}`}>
                    {activeOptimizations.offPeakVentilation ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <h4 className={`font-bold text-sm tracking-tight ${activeOptimizations.offPeakVentilation ? 'text-zinc-50' : 'text-zinc-300'}`}>Surventilation Nocturne</h4>
                <p className="text-xs text-zinc-500">Rafraîchit gratuitement la structure entre 03h00 et 06h00.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
