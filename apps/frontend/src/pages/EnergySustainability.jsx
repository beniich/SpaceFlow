import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, Leaf, TrendingDown, Sun, BarChart3, ShieldCheck,
  CheckCircle2, RefreshCw, AlertCircle, Cpu, Thermometer,
  Compass, Award, Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Download
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, Legend
} from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import CarbonFootprintDashboard from '../components/CarbonFootprintDashboard';

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

// ESG Data mapped to H1 Objectives
const emissionsData = [
  { month: 'Jan', scope1: 12.5, scope2: 34.2, scope3: 8.1 },
  { month: 'Fév', scope1: 11.2, scope2: 32.1, scope3: 7.9 },
  { month: 'Mar', scope1: 10.8, scope2: 29.5, scope3: 8.4 },
  { month: 'Avr', scope1: 9.5,  scope2: 26.2, scope3: 9.1 },
  { month: 'Mai', scope1: 8.2,  scope2: 24.8, scope3: 8.5 },
  { month: 'Juin', scope1: 7.5,  scope2: 28.4, scope3: 8.2 },
];

export default function EnergySustainability() {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('MONTH');

  const [metrics, setMetrics] = useState({
    energyIntensity: 142, // kWh/m²/an
    intensityVariance: -14.2,
    totalCarbon: 124.5, // tCO2e
    carbonVariance: -8.4,
    scope1Percentage: 25,
    scope2Percentage: 60,
    scope3Percentage: 15
  });

  const handleCSRDExport = () => {
    // Génération du rapport ESG/CSRD au format structuré (futur : XBRL)
    const report = {
      meta: {
        standard: 'CSRD/ESRS E1 — Climate Change',
        generatedAt: new Date().toISOString(),
        reportingPeriod: `${new Date().getFullYear()}`,
        entity: 'beecarbonit — Tour Horizon Alpha',
        version: '1.0.0'
      },
      summary: {
        energyIntensity_kWh_m2: metrics.energyIntensity,
        totalEmissions_tCO2e: metrics.totalCarbon,
        reductionVsPreviousYear_percent: Math.abs(metrics.carbonVariance)
      },
      emissions: {
        scope1_tCO2e: parseFloat((metrics.totalCarbon * metrics.scope1Percentage / 100).toFixed(2)),
        scope2_tCO2e: parseFloat((metrics.totalCarbon * metrics.scope2Percentage / 100).toFixed(2)),
        scope3_tCO2e: parseFloat((metrics.totalCarbon * metrics.scope3Percentage / 100).toFixed(2))
      },
      monthlyTimeSeries: emissionsData,
      disclosure: {
        ESRS_E1_1: 'Politique de transition climatique définie et approuvée par la direction.',
        ESRS_E1_4: `Objectif de réduction : -40% tCO2e d'ici 2030 (base 2023).`,
        ESRS_E1_6: `Scope 1+2 Intensity : ${metrics.energyIntensity} kWh/m²/an (-${Math.abs(metrics.intensityVariance)}% vs N-1).`
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beecarbonit_rapport_CSRD_${new Date().getFullYear()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Rapport CSRD (ESRS E1) généré et téléchargé avec succès !', { duration: 3000 });
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
            <h1 className="text-2xl font-bold tracking-tight font-display uppercase text-zinc-50 flex items-center gap-3">
              <Leaf className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              ESG &amp; BILAN CARBONE
            </h1>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_var(--brand-cyan,_#00dbe7)] animate-pulse" />
              Préparation Audit CSRD - Horizon 1 (Scope 1, 2, 3 partiel)
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <button 
              onClick={handleCSRDExport}
              className="px-4 py-2 bg-zinc-100 text-zinc-900 hover:bg-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-2 transition-colors shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export CSRD-Ready
            </button>
            <div className="px-3 py-2 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] rounded flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Conforme ADEME 2026</span>
            </div>
          </div>
        </div>

        {/* ============== KINETIC METRIC CARDS ============== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Energy Intensity */}
          <div className="bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl p-5 flex flex-col justify-between h-[150px] relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <Activity className="w-12 h-12 text-brand-cyan" />
            </div>
            <div>
              <span className="font-mono text-brand-cyan text-[10px] tracking-[0.2em] uppercase block mb-1">INTENSITÉ ÉNERGÉTIQUE</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-4xl font-bold tracking-tight text-zinc-50 font-display">{metrics.energyIntensity}</span>
                <span className="text-sm text-zinc-400 font-mono">kWh/m²/an</span>
              </div>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-500/10 rounded px-3 py-2 flex items-center gap-2">
              <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-300">
                <span className="font-bold text-emerald-400">{metrics.intensityVariance}%</span> vs année précédente
              </div>
            </div>
          </div>

          {/* Card 2: Total Carbon */}
          <div className="bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl p-5 flex flex-col justify-between h-[150px] relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <TrendingDown className="w-12 h-12 text-brand-orange" />
            </div>
            <div>
              <span className="font-mono text-brand-orange text-[10px] tracking-[0.2em] uppercase block mb-1">ÉMISSIONS GLOBALES</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-4xl font-bold tracking-tight text-zinc-50 font-display">{metrics.totalCarbon}</span>
                <span className="text-sm text-zinc-400 font-mono">tCO₂e</span>
              </div>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-500/10 rounded px-3 py-2 flex items-center gap-2">
              <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-300">
                <span className="font-bold text-emerald-400">{metrics.carbonVariance}%</span> Trajectoire SBTi respectée
              </div>
            </div>
          </div>

          {/* Card 3: Scope Breakdown Gauge */}
          <div className="bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl p-5 flex items-center justify-between h-[150px] relative overflow-hidden shadow-lg group">
            <div className="flex flex-col justify-between h-full py-0.5 flex-1">
              <div>
                <span className="font-mono text-zinc-400 text-[10px] tracking-[0.2em] uppercase block mb-2">RÉPARTITION SCOPES</span>
                <div className="space-y-2 w-full pr-4 font-mono text-[10px] uppercase">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400">Scope 1 (Direct)</span>
                    <span className="font-bold">{metrics.scope1Percentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-cyan">Scope 2 (Indirect)</span>
                    <span className="font-bold">{metrics.scope2Percentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-orange">Scope 3 (Cat 13)</span>
                    <span className="font-bold">{metrics.scope3Percentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
              {/* Fake pie representation */}
              <div className="w-full h-full rounded-full border-4 border-zinc-800 relative overflow-hidden">
                 <div className="absolute inset-0 bg-brand-cyan opacity-40"></div>
                 <div className="absolute inset-0 bg-emerald-500 opacity-60" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)' }}></div>
                 <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-orange opacity-80"></div>
                 <div className="absolute inset-2 bg-[#18181b] rounded-full"></div>
              </div>
            </div>
          </div>

        </div>

        {/* ============== MAIN VISUALIZATION SECTION: CARBON FOOTPRINT & TRAJECTORY CHART ============== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 3D Isometric Carbon Footprint Visual */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl overflow-hidden shadow-lg p-4 flex flex-col justify-center">
              <span className="font-mono text-cyan-400 text-[10px] tracking-[0.2em] uppercase block mb-3 pl-2">
                Cartographie 3D des Émissions
              </span>
              <div className="flex-1 flex items-center justify-center">
                <CarbonFootprintDashboard />
              </div>
            </div>
          </div>

          {/* Emissions Trajectory Chart */}
          <div className="lg:col-span-7 bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="p-6 border-b border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-emerald-400 text-[10px] tracking-[0.2em] uppercase block mb-1">M1-M6 ESG Target</span>
                <h3 className="font-bold text-base text-zinc-50 font-display tracking-tight uppercase flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-zinc-400" />
                  TRAJECTOIRE CARBONE (tCO₂e)
                </h3>
              </div>
            </div>

            <div className="p-6 h-[400px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emissionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#555" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#555" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(24, 24, 27, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', marginTop: '10px' }}/>
                  <Bar dataKey="scope1" name="Scope 1 (Fuites, Gaz)" stackId="a" fill="#10b981" />
                  <Bar dataKey="scope2" name="Scope 2 (Électricité, Réseaux)" stackId="a" fill="var(--brand-cyan,_#00dbe7)" />
                  <Bar dataKey="scope3" name="Scope 3 (Cat 13: Aval)" stackId="a" fill="var(--brand-orange,_#f38020)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ============== CSRD READINESS SECTION ============== */}
        <div className="bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl p-6 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/40 pb-4">
            <div>
              <span className="font-mono text-zinc-400 text-[10px] tracking-[0.2em] uppercase block mb-1">Reporting de durabilité</span>
              <h3 className="font-bold text-base text-zinc-50 font-display tracking-tight uppercase flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
                Facteurs d'Émission &amp; Préparation CSRD
              </h3>
            </div>
            <div className="text-xs text-brand-cyan font-mono font-bold bg-brand-cyan/10 px-3 py-1.5 border border-brand-cyan/20 rounded">
              Confiance des données : Élevée (92%)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 bg-zinc-950/40 border border-zinc-800/60 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-xs uppercase text-zinc-300 font-mono">Sources Électricité</h4>
                <Zap className="w-4 h-4 text-brand-cyan" />
              </div>
              <p className="text-xs text-zinc-500 mb-2">Connecté via API Enedis/RTE. Conversion auto via base ADEME Base Empreinte v23.1.</p>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-4">
                <div className="bg-brand-cyan h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-[9px] text-right mt-1 text-zinc-500 font-mono">100% Automatisé</p>
            </div>

            <div className="p-4 bg-zinc-950/40 border border-zinc-800/60 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-xs uppercase text-zinc-300 font-mono">Fuites Réfrigérants (S1)</h4>
                <AlertTriangle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-zinc-500 mb-2">Calcul automatique depuis les bons d'intervention (Work Orders) type "Recharge Gaz".</p>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-4">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-[9px] text-right mt-1 text-zinc-500 font-mono">85% Couverture</p>
            </div>

            <div className="p-4 bg-zinc-950/40 border border-zinc-800/60 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-xs uppercase text-zinc-300 font-mono">Scope 3 (Catégorie 13)</h4>
                <Compass className="w-4 h-4 text-brand-orange" />
              </div>
              <p className="text-xs text-zinc-500 mb-2">Impact des actifs loués en aval (locataires). Estimation basée sur les surfaces louées.</p>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-4">
                <div className="bg-brand-orange h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-[9px] text-right mt-1 text-zinc-500 font-mono">60% Précision</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

