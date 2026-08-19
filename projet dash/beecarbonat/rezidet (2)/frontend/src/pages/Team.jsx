import { useEffect, useState, useRef } from 'react';
import { Users, Filter, Plus, Calendar, MapPin, BarChart2, Shield } from 'lucide-react';
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

export default function Team() {
  const [squad, setSquad] = useState([
    {
      id: 1,
      name: 'Elena Rostova',
      role: 'Lvl 4 / HVAC Systems',
      status: 'Deployed',
      completionRate: 94,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHcl6asZsWxj4JMx6FHo0WrZoZYjaheX8t0u9vTAsLXq6pDdlPWTzIDgC278qeY1Rzw_nR0Qa9bRjjMAWOt3NOCBFFD7cts3ThSAmGPYPJOqlraR1Cnihz-tHS_r4A2v1DmfOkI4eChATvNApT-13t2m4Zaj6B6BIncYcDgL3Z8FccPW0SRjC2SxnR8iEcaKYjvLZ1TCepU2qYbIfXkATuYxUmL-54M0HAPr_34xx2au_cCK18yh9i',
      tags: ['Thermal Imaging', 'Acoustic Diag', 'LOTO Cert']
    },
    {
      id: 2,
      name: 'Marcus Vance',
      role: 'Lvl 5 / High Voltage',
      status: 'In Transit',
      completionRate: 88,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHrohLaZ1KfibDuxXrvv4O6JyuzC88VFGYSSTAF4XuDjSkDczQRskilG3HMJMsEFz3_XGgg42VcrC_dI2TWjmPKg19J1y8EYet8JkTgGUjfPjExngEJPpQn0m3BzBbQUAJC-t7yfBP3p2abJXBpIXVGfmfLrvyIdYZOeXvRwy1mVOEem3Pv128F60auu9srcRNgSw3gBVLFVbdyJT90i9PKJe98f9FK5C0SzXP8_a19BCm_KlbJwhp',
      tags: ['Grid Sec', 'Substation', 'PLC Prog']
    }
  ]);

  const handleFilterSquad = () => {
    toast.success('Filtre appliqué : Techniciens certifiés HVAC/HT');
  };

  const handleDeployNew = () => {
    toast.loading('Déploiement d\'un technicien de garde...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Technicien supplémentaire déployé sur le Secteur B');
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-background text-on-surface overflow-x-hidden">
      <ShaderBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 via-zinc-950/80 to-zinc-900/90 z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto p-6 md:p-8 flex flex-col gap-8">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end pb-4 border-b border-outline-variant/20">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-brand-cyan uppercase tracking-widest mb-1">Human Capital</span>
            <h1 className="font-display-lg text-4xl font-bold text-on-surface tracking-tight">Team Operations</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleFilterSquad}
              className="px-6 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 transition-all font-mono text-[11px] uppercase font-bold"
            >
              FILTER SQUAD
            </button>
            <button 
              onClick={handleDeployNew}
              className="px-6 py-2.5 rounded-full bg-brand-orange hover:bg-[#ff9540] text-black font-bold shadow-[0_0_20px_rgba(243,128,32,0.3)] hover:shadow-[0_0_30px_rgba(243,128,32,0.5)] transition-all font-mono text-[11px] uppercase flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-black" strokeWidth={3} /> DEPLOY NEW
            </button>
          </div>
        </div>

        {/* MAIN BODY GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* SQUAD PANEL (SPAN 8) */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <div className="flex items-center gap-4 text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping shadow-[0_0_8px_var(--brand-cyan, #00dbe7)]"></span>
              <h2 className="font-sans font-bold text-lg text-zinc-200">Active Technicians</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {squad.map((tech) => (
                <div 
                  key={tech.id}
                  className="bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-zinc-800/60 hover:border-brand-cyan/40 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-brand-cyan/10 transition-all"></div>
                  
                  <div className="flex items-start gap-4 mb-6 relative z-10">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-zinc-800">
                      <img className="w-full h-full object-cover" src={tech.avatar} alt={tech.name} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-sans font-bold text-base text-zinc-100">{tech.name}</h3>
                          <p className="font-mono text-[11px] text-zinc-400 mt-1">{tech.role}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${tech.status === 'Deployed' ? 'bg-brand-cyan' : 'bg-brand-orange'} animate-pulse`}></span>
                          <span className={`font-mono text-[9px] uppercase tracking-wider font-bold ${tech.status === 'Deployed' ? 'text-brand-cyan' : 'text-brand-orange'}`}>
                            {tech.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                    {tech.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-1 rounded bg-zinc-950 text-zinc-400 font-mono text-[10px] border border-zinc-800/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Task completion load */}
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between text-zinc-500 font-mono text-[10px] uppercase">
                      <span>Task Completion Rate</span>
                      <span className="text-zinc-200 font-bold">{tech.completionRate}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-cyan/50 to-brand-cyan rounded-full shadow-[0_0_10px_rgba(0,219,231,0.5)]"
                        style={{ width: `${tech.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FLEET PERFORMANCE METRICS GRAPH */}
            <div className="bg-zinc-900/40 border border-zinc-850/60 rounded-xl p-6 relative overflow-hidden mt-4 shadow-lg">
              <h3 className="font-sans font-bold text-zinc-100 mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-zinc-500" />
                Fleet Performance Metrics
              </h3>
              
              <div className="flex items-end gap-3 h-44 w-full pl-4 pb-4 border-b border-l border-zinc-800/40 font-mono">
                
                {/* Mon */}
                <div className="flex-1 flex flex-col justify-end group h-full">
                  <div className="w-full bg-brand-cyan/20 border border-brand-cyan/50 rounded-t h-[60%] group-hover:bg-brand-cyan/40 transition-colors relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-brand-cyan font-bold">60%</div>
                  </div>
                  <div className="text-center text-[10px] text-zinc-500 mt-2">MON</div>
                </div>

                {/* Tue */}
                <div className="flex-1 flex flex-col justify-end group h-full">
                  <div className="w-full bg-brand-cyan/20 border border-brand-cyan/50 rounded-t h-[75%] group-hover:bg-brand-cyan/40 transition-colors relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-brand-cyan font-bold">75%</div>
                  </div>
                  <div className="text-center text-[10px] text-zinc-500 mt-2">TUE</div>
                </div>

                {/* Wed */}
                <div className="flex-1 flex flex-col justify-end group h-full">
                  <div className="w-full bg-brand-orange/20 border border-brand-orange/50 rounded-t h-[40%] group-hover:bg-brand-orange/40 transition-colors relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-brand-orange font-bold">40%</div>
                  </div>
                  <div className="text-center text-[10px] text-zinc-500 mt-2">WED</div>
                </div>

                {/* Thu */}
                <div className="flex-1 flex flex-col justify-end group h-full">
                  <div className="w-full bg-brand-cyan/30 border border-brand-cyan/60 rounded-t h-[90%] group-hover:bg-brand-cyan/50 transition-colors relative shadow-[0_0_15px_rgba(0,219,231,0.25)]">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-100 font-mono text-[10px] text-brand-cyan font-bold">90%</div>
                  </div>
                  <div className="text-center text-[10px] text-brand-cyan font-bold mt-2">THU</div>
                </div>

                {/* Fri */}
                <div className="flex-1 flex flex-col justify-end group h-full">
                  <div className="w-full bg-brand-cyan/20 border border-brand-cyan/50 rounded-t h-[55%] group-hover:bg-brand-cyan/40 transition-colors relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-brand-cyan font-bold">55%</div>
                  </div>
                  <div className="text-center text-[10px] text-zinc-500 mt-2">FRI</div>
                </div>

              </div>
            </div>
          </div>

          {/* SCHEDULE & SATELLITE SIDEBAR (SPAN 4) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* SCHEDULE MATRIX */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-850/60 rounded-xl p-6">
              <h3 className="font-sans font-bold text-zinc-100 mb-6 flex items-center justify-between">
                Schedule Matrix
                <Calendar className="w-4 h-4 text-zinc-400" />
              </h3>

              {/* Day column headers */}
              <div className="grid grid-cols-7 gap-1.5 mb-2 text-center font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>

              {/* Grid month layout */}
              <div className="grid grid-cols-7 gap-1.5 font-mono text-[10px]">
                {/* Week 1 */}
                <div className="aspect-square bg-zinc-950/20 border border-zinc-900/30 rounded flex items-center justify-center text-zinc-600">28</div>
                <div className="aspect-square bg-zinc-950/20 border border-zinc-900/30 rounded flex items-center justify-center text-zinc-600">29</div>
                <div className="aspect-square bg-zinc-950/60 border border-zinc-850 rounded flex items-center justify-center text-zinc-400">1</div>
                <div className="aspect-square bg-zinc-950/60 border border-zinc-850 rounded flex items-center justify-center text-zinc-400">2</div>
                <div className="aspect-square bg-brand-cyan/15 border border-brand-cyan/40 rounded flex items-center justify-center text-brand-cyan font-bold shadow-[inset_0_0_10px_rgba(0,219,231,0.1)]">3</div>
                <div className="aspect-square bg-zinc-950/60 border border-zinc-850 rounded flex items-center justify-center text-zinc-400">4</div>
                <div className="aspect-square bg-zinc-950/60 border border-zinc-850 rounded flex items-center justify-center text-zinc-400">5</div>
                {/* Week 2 */}
                <div className="aspect-square bg-zinc-950/60 border border-zinc-850 rounded flex items-center justify-center text-zinc-400">6</div>
                <div className="aspect-square bg-brand-orange/15 border border-brand-orange/40 rounded flex items-center justify-center text-brand-orange font-bold">7</div>
                <div className="aspect-square bg-zinc-950/60 border border-zinc-850 rounded flex items-center justify-center text-zinc-400">8</div>
                <div className="aspect-square bg-zinc-950/60 border border-zinc-850 rounded flex items-center justify-center text-zinc-400">9</div>
                <div className="aspect-square bg-zinc-950/60 border border-zinc-850 rounded flex items-center justify-center text-zinc-400">10</div>
                <div className="aspect-square bg-brand-cyan/10 border border-brand-cyan/30 rounded flex items-center justify-center text-brand-cyan">11</div>
                <div className="aspect-square bg-zinc-950/60 border border-zinc-850 rounded flex items-center justify-center text-zinc-400">12</div>
              </div>

              {/* Dynamic highlights info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-zinc-950/40 rounded border border-zinc-900/60">
                  <div className="w-1 h-8 bg-brand-cyan rounded-full"></div>
                  <div>
                    <p className="font-sans font-bold text-zinc-200 text-xs">System Audit Alpha</p>
                    <p className="font-mono text-[9px] text-zinc-500 uppercase mt-0.5">Rostova &bull; Sector 4</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-950/40 rounded border border-zinc-900/60">
                  <div className="w-1 h-8 bg-brand-orange rounded-full"></div>
                  <div>
                    <p className="font-sans font-bold text-zinc-200 text-xs">Grid Realignment</p>
                    <p className="font-mono text-[9px] text-zinc-500 uppercase mt-0.5">Vance &bull; Node 8B</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE GPS SATELLITE MAP */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-zinc-850/60 group shadow-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzGaS6wAAbfVo0jH2v5Lqa_Yh2r2xhC4pYteUfLbKRLIltXaqJSl3Z_-0Ig-u44OFKWyx7777J-YLXmvFshKkk62za7HRjriPSKemmnp-r-gfKCea8gC7A9gN0zT_gPB6VAyQ5i0z-IfNude7KIXhJKFXnM0Eul_x-xHHG6CWoznq7rOcwFQWB7L09BNm7hhaq1z_rhC97ymfc9cVmZRgGM1c1afDTWVPYA9aIRpubilgDsNJGALAc')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
                <div>
                  <p className="font-mono text-[9px] text-brand-cyan tracking-widest uppercase mb-1">Live Tracking</p>
                  <p className="font-sans font-bold text-zinc-100 text-base">Sector 4 Grid</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-zinc-200" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
