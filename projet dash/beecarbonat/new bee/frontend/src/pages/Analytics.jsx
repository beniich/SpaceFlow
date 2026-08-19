import { useEffect, useState, useRef } from 'react';
import { Settings, RefreshCw, Cpu, Brain, Database, Filter, Download, Radar } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);

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
    <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0 mix-blend-screen">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export default function Analytics() {
  const [telemetryLogs, setTelemetryLogs] = useState([
    { timestamp: '2023-10-27T14:32:01Z', nodeId: 'HVAC-A1-Z1', metricType: 'FLOW_RATE', value: '142.5 L/s', status: 'NOMINAL' },
    { timestamp: '2023-10-27T14:31:55Z', nodeId: 'CHLR-SYS-02', metricType: 'PRESSURE', value: '84.2 PSI', status: 'ELEVATED' },
    { timestamp: '2023-10-27T14:31:42Z', nodeId: 'PMP-M-11', metricType: 'VIBRATION', value: '0.04 mm/s', status: 'NOMINAL' },
    { timestamp: '2023-10-27T14:31:10Z', nodeId: 'AHU-F3-01', metricType: 'TEMP_RETURN', value: '22.4 °C', status: 'NOMINAL' },
    { timestamp: '2023-10-27T14:30:45Z', nodeId: 'HVAC-B2-Z3', metricType: 'HUMIDITY', value: '48.2 %', status: 'NOMINAL' },
    { timestamp: '2023-10-27T14:30:12Z', nodeId: 'PMP-CH-02', metricType: 'VIBRATION', value: '0.88 mm/s', status: 'WARNING' }
  ]);
  const [loading, setLoading] = useState(false);

  const generateWorkOrder = () => {
    toast.loading('Generating predictive work order...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Work order generated for CHILLER PUMP #2 (PMP-CH-02)');
    }, 1200);
  };

  const handleExportCSV = () => {
    toast.success('CSV Export completed (1,429 active metrics)');
  };

  const chartJsData = {
    labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    datasets: [
      {
        label: 'Vibration Spec (Hz)',
        data: [12, 19, 3, 5, 2, 3, 15, 22, 10, 8, 14, 18],
        borderColor: 'var(--brand-orange,_#f38020)',
        backgroundColor: 'rgba(243, 128, 32, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'var(--brand-orange,_#f38020)',
        pointBorderColor: '#18181b',
        pointHoverRadius: 6,
      },
      {
        label: 'Ref Signature (Hz)',
        data: [10, 15, 5, 8, 4, 6, 12, 18, 12, 10, 12, 15],
        borderColor: 'var(--brand-cyan,_#00dbe7)',
        backgroundColor: 'rgba(0, 219, 231, 0.05)',
        borderWidth: 1.5,
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'var(--brand-cyan,_#00dbe7)',
        pointBorderColor: '#18181b',
      }
    ]
  };

  const chartJsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a1a1aa',
          font: {
            family: 'monospace',
            size: 10
          }
        }
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleFont: { family: 'monospace', size: 10 },
        bodyFont: { family: 'monospace', size: 10 },
        borderColor: '#27272a',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.03)',
        },
        ticks: {
          color: '#71717a',
          font: { family: 'monospace', size: 9 }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.03)',
        },
        ticks: {
          color: '#71717a',
          font: { family: 'monospace', size: 9 }
        }
      }
    }
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-background text-on-surface overflow-x-hidden">
      <ShaderBackground />
      
      {/* Absolute layout background gradient to guarantee dark lux aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 via-zinc-950/85 to-zinc-900/90 z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col w-full px-6 py-8 md:px-8 gap-8 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span className="w-12 h-[1px] bg-brand-cyan"></span>
            <span className="font-mono text-[10px] text-brand-cyan uppercase tracking-[0.2em]">[ SYSTEM_MODULE: ANALYTICS ]</span>
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl font-black text-on-surface flex items-baseline gap-4 tracking-tight">
            ADVANCED
            <span className="text-zinc-700 font-mono text-[10px] tracking-widest uppercase">// DATA_LAKE</span>
            TELEMETRY
          </h1>
        </div>

        {/* METRICS & GRAPH GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SECTION (GRID SPAN 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* THERMAL DISPERSION MATRIX */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl p-6 flex flex-col h-[500px] relative overflow-hidden group shadow-xl border border-zinc-800/40 hover:border-brand-cyan/30 transition-colors duration-500">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h2 className="font-sans text-lg font-bold text-zinc-100 tracking-tight">Thermal Dispersion Matrix</h2>
                  <p className="font-mono text-[11px] text-zinc-400 mt-1">Multi-layered scatter analysis of core HVAC nodes.</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-950/60 border border-zinc-800/60 py-1.5 px-3 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_8px_var(--brand-cyan,_#00dbe7)]"></span>
                  <span className="font-mono text-[9px] text-brand-cyan tracking-wider uppercase">LIVE SYNC</span>
                </div>
              </div>

              {/* Svg Plotter */}
              <div className="flex-1 relative z-10 w-full h-full rounded-lg overflow-hidden bg-zinc-950/40 border border-zinc-900/60 flex items-center justify-center p-4">
                <svg className="w-full h-full text-brand-cyan overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
                  <defs>
                    <linearGradient id="heatGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="var(--brand-cyan,_#00dbe7)" stopOpacity={0.1}></stop>
                      <stop offset="50%" stopColor="var(--brand-cyan,_#00dbe7)" stopOpacity={0.8}></stop>
                      <stop offset="100%" stopColor="var(--brand-orange,_#f38020)" stopOpacity={0.9}></stop>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur result="coloredBlur" stdDeviation="3"></feGaussianBlur>
                      <feMerge>
                        <feMergeNode in="coloredBlur"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Grid Lines */}
                  <g className="grid-lines" stroke="rgba(255,255,255,0.03)" strokeWidth="1">
                    <line x1="0" x2="800" y1="50" y2="50"></line>
                    <line x1="0" x2="800" y1="100" y2="100"></line>
                    <line x1="0" x2="800" y1="150" y2="150"></line>
                    <line x1="0" x2="800" y1="200" y2="200"></line>
                    <line x1="0" x2="800" y1="250" y2="250"></line>
                    
                    <line x1="100" x2="100" y1="0" y2="300"></line>
                    <line x1="200" x2="200" y1="0" y2="300"></line>
                    <line x1="300" x2="300" y1="0" y2="300"></line>
                    <line x1="400" x2="400" y1="0" y2="300"></line>
                    <line x1="500" x2="500" y1="0" y2="300"></line>
                    <line x1="600" x2="600" y1="0" y2="300"></line>
                    <line x1="700" x2="700" y1="0" y2="300"></line>
                  </g>

                  {/* Scatter wave paths */}
                  <path d="M0,250 C100,220 200,280 300,150 C400,20 500,100 600,80 C700,60 750,120 800,100" fill="none" filter="url(#glow)" stroke="url(#heatGradient)" strokeWidth="3"></path>
                  <path d="M0,280 C150,260 250,180 350,200 C450,220 550,150 650,190 C750,230 780,210 800,200" fill="none" stroke="var(--brand-cyan,_#00dbe7)" strokeDasharray="5 5" strokeOpacity="0.4" strokeWidth="2"></path>
                  
                  {/* Glowing scatter nodes */}
                  <g className="scatter-points" fill="var(--brand-orange,_#f38020)">
                    <circle cx="300" cy="150" filter="url(#glow)" r="4">
                      <animate attributeName="r" dur="2s" repeatCount="indefinite" values="3;6;3"></animate>
                    </circle>
                    <circle cx="600" cy="80" fill="var(--brand-orange,_#f38020)" filter="url(#glow)" r="5">
                      <animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="1;0.5;1"></animate>
                    </circle>
                    <circle cx="200" cy="245" fill="var(--brand-cyan,_#00dbe7)" r="3.5"></circle>
                    <circle cx="450" cy="65" fill="var(--brand-cyan,_#00dbe7)" r="3"></circle>
                    <circle cx="700" cy="165" fill="var(--brand-cyan,_#00dbe7)" r="4.5"></circle>
                  </g>
                </svg>
                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                  X: TIME (H) / Y: VARIANCE (&Delta;T)
                </div>
              </div>
            </div>

            {/* CHART.JS SPECTRAL ANALYSIS */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl p-6 flex flex-col h-[350px] relative overflow-hidden group shadow-xl border border-zinc-800/40 hover:border-brand-orange/30 transition-colors duration-500">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h2 className="font-sans text-lg font-bold text-zinc-100 tracking-tight">Spectral Vibration Analysis</h2>
                  <p className="font-mono text-[11px] text-zinc-400 mt-1">Real-time telemetry processed via Chart.js engine.</p>
                </div>
                <span className="font-mono text-[9px] text-brand-orange border border-brand-orange/40 px-2.5 py-0.5 rounded font-bold uppercase">
                  CHARTJS ACTIVE
                </span>
              </div>
              <div className="flex-1 relative z-10 w-full h-full min-h-[200px]">
                <Line
                  options={chartJsOptions}
                  data={chartJsData}
                />
              </div>
            </div>

            {/* DATA QUERY LOG TABLE */}
            <div className="bg-[#131313]/50 backdrop-blur-xl border border-zinc-800/60 rounded-xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-sans text-base font-bold text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                    Data Query Log
                  </h3>
                  <p className="font-mono text-[10px] text-zinc-500">Live operational events stream</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-transparent border border-zinc-800/60 hover:border-zinc-700 rounded-lg font-mono text-[10px] text-zinc-400 hover:text-zinc-100 transition-all flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> FILTER
                  </button>
                  <button 
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 hover:bg-brand-orange/20 rounded-lg font-mono text-[10px] text-brand-orange transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> EXPORT CSV
                  </button>
                </div>
              </div>
              <div className="w-full overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-zinc-800/40 bg-zinc-950/20 font-mono text-[10px] text-zinc-500">
                      <th className="py-3 px-6 font-medium uppercase tracking-wider">TIMESTAMP</th>
                      <th className="py-3 px-6 font-medium uppercase tracking-wider">NODE_ID</th>
                      <th className="py-3 px-6 font-medium uppercase tracking-wider">METRIC_TYPE</th>
                      <th className="py-3 px-6 font-medium uppercase tracking-wider">VALUE</th>
                      <th className="py-3 px-6 font-medium uppercase tracking-wider text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-[12px] text-zinc-400">
                    {telemetryLogs.map((log, index) => (
                      <tr key={index} className="border-b border-zinc-900/30 hover:bg-zinc-900/30 transition-colors">
                        <td className="py-3.5 px-6 text-zinc-600">{log.timestamp}</td>
                        <td className="py-3.5 px-6 text-brand-cyan font-semibold">{log.nodeId}</td>
                        <td className="py-3.5 px-6 font-medium text-zinc-300">{log.metricType}</td>
                        <td className="py-3.5 px-6 text-zinc-200">{log.value}</td>
                        <td className="py-3.5 px-6 text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-bold ${
                            log.status === 'NOMINAL' ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20' :
                            log.status === 'WARNING' ? 'bg-brand-orange/15 text-brand-orange border border-brand-orange/20' :
                            'bg-rose-950/30 text-rose-400 border border-rose-900/40'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT SECTION - SIDEBAR (GRID SPAN 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* AI PROGNOSTICS */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl p-6 relative overflow-hidden group shadow-[0_0_35px_rgba(243,128,32,0.1)] border border-brand-orange/20">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-orange/10 rounded-full blur-[40px] pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-mono text-xs font-bold text-brand-orange flex items-center gap-2 uppercase tracking-widest">
                  <Brain className="w-4 h-4 text-brand-orange" />
                  AI Prognostics
                </h3>
                <span className="font-mono text-[9px] text-brand-orange animate-pulse border border-brand-orange/40 px-2.5 py-0.5 rounded font-bold uppercase">
                  MODEL_ACTIVE
                </span>
              </div>

              <div className="space-y-6 relative z-10">
                <div>
                  <p className="font-sans text-sm text-zinc-300 font-bold mb-3">High Probability of Component Stress</p>
                  
                  <div className="p-4 bg-zinc-950/60 border-l-2 border-brand-orange rounded-r">
                    <div className="flex justify-between items-end mb-1 font-mono text-[10px]">
                      <span className="text-zinc-400 font-bold">CHILLER PUMP #2 (PMP-CH-02)</span>
                      <span className="text-brand-orange font-bold">87%</span>
                    </div>
                    <p className="font-sans text-[11px] text-zinc-500 mt-2 leading-relaxed">
                      Vibration signature indicates bearing degradation. Estimated time to critical failure is 48-72 hours.
                    </p>
                    <div className="w-full bg-zinc-900 h-1.5 mt-3.5 rounded overflow-hidden">
                      <div className="bg-brand-orange h-full w-[87%] shadow-[0_0_10px_var(--brand-orange,_#f38020)]"></div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={generateWorkOrder}
                  className="w-full py-3 bg-brand-orange text-black font-mono text-xs font-bold uppercase rounded hover:bg-[#ff9540] transition-all shadow-[0_0_15px_rgba(243,128,32,0.3)] flex items-center justify-center gap-2"
                >
                  GENERATE WORK ORDER &rarr;
                </button>
              </div>
            </div>

            {/* CORRELATION MATRIX */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl p-6 relative border border-zinc-850/60 flex-1 flex flex-col">
              <h3 className="font-sans text-sm font-bold text-zinc-100 uppercase tracking-tight mb-4">Correlation Matrix</h3>
              
              <div className="flex-1 min-h-[220px] rounded bg-zinc-950/40 border border-zinc-900/80 p-4 flex flex-col justify-between">
                <div className="grid grid-cols-4 gap-1.5 h-full">
                  <div className="bg-brand-cyan/80 rounded-sm hover:opacity-100 transition-opacity cursor-pointer shadow-[0_0_6px_rgba(0,219,231,0.2)]" title="Temp / Temp: 1.0"></div>
                  <div className="bg-brand-cyan/40 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Temp / Press: 0.4"></div>
                  <div className="bg-brand-orange/20 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Temp / Flow: 0.2"></div>
                  <div className="bg-brand-orange/90 rounded-sm hover:opacity-100 transition-opacity cursor-pointer shadow-[0_0_6px_rgba(243,128,32,0.2)]" title="Temp / Hz: 0.9"></div>
                  
                  <div className="bg-brand-cyan/50 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Press / Temp: 0.5"></div>
                  <div className="bg-brand-cyan/90 rounded-sm hover:opacity-100 transition-opacity cursor-pointer shadow-[0_0_6px_rgba(0,219,231,0.2)]" title="Press / Press: 1.0"></div>
                  <div className="bg-brand-orange/40 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Press / Flow: 0.4"></div>
                  <div className="bg-brand-orange/60 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Press / Hz: 0.6"></div>
                  
                  <div className="bg-brand-orange/30 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Flow / Temp: 0.3"></div>
                  <div className="bg-brand-orange/50 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Flow / Press: 0.5"></div>
                  <div className="bg-brand-cyan/70 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Flow / Flow: 0.7"></div>
                  <div className="bg-brand-cyan/30 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Flow / Hz: 0.3"></div>
                  
                  <div className="bg-brand-orange/80 rounded-sm hover:opacity-100 transition-opacity cursor-pointer shadow-[0_0_6px_rgba(243,128,32,0.2)]" title="Hz / Temp: 0.8"></div>
                  <div className="bg-brand-orange/50 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Hz / Press: 0.5"></div>
                  <div className="bg-brand-cyan/40 rounded-sm hover:opacity-100 transition-opacity cursor-pointer" title="Hz / Flow: 0.4"></div>
                  <div className="bg-brand-cyan/90 rounded-sm hover:opacity-100 transition-opacity cursor-pointer shadow-[0_0_6px_rgba(0,219,231,0.2)]" title="Hz / Hz: 1.0"></div>
                </div>
                
                <div className="flex justify-between mt-4 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                  <span>Variables: Temp, Press, Flow, Hz</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
