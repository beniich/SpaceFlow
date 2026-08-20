import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Key, Lock, Eye, CheckCircle2, AlertTriangle, RefreshCw,
  Terminal, ShieldAlert, Cpu, UserCheck, Search, Filter,
  TrendingUp, Leaf, Activity, BarChart3, Clock, ChevronRight,
  Sparkles, Check, Database, Play, Monitor, Network, ArrowRight,
  CornerDownRight, CheckSquare, Zap, Layers, Box, Globe, Download,
  Mail, Phone, Building, Info, Server, Layers2, EyeOff, Send, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'solutions' | 'technology' | 'case-studies' | 'pricing'
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [caseFilter, setCaseFilter] = useState('all'); // 'all' | 'datacenter' | 'commercial' | 'industrial'
  const [caseSort, setCaseSort] = useState('impact'); // 'impact' | 'recent' | 'scale'
  const [simulationActive, setSimulationActive] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoStep, setDemoStep] = useState(1); // 1: Form, 2: Provisioning, 3: Success

  // Form states
  const [demoForm, setDemoForm] = useState({
    fullName: '',
    email: '',
    company: '',
    plan: 'Advanced'
  });

  // Space Utilization interactive state
  const [selectedFloor, setSelectedFloor] = useState('L4');
  const floorData = {
    L1: { name: 'Ground Lobby & Security', occupancy: 40, status: 'Normal', temp: '21.5°C', noise: '45 dB' },
    L2: { name: 'BIM CAD Suites & Tech Lab', occupancy: 65, status: 'Normal', temp: '22.0°C', noise: '52 dB' },
    L3: { name: 'Executive Offices & Lounge', occupancy: 85, status: 'Active', temp: '21.8°C', noise: '58 dB' },
    L4: { name: 'HVAC Plant Room & Servers', occupancy: 95, status: 'High Volatility', temp: '24.2°C', noise: '72 dB' },
    L5: { name: 'Solar Deck & Power Storage', occupancy: 50, status: 'Charging', temp: '19.4°C', noise: '38 dB' }
  };

  // SRE Terminal States (Technology Section)
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'input', text: 'help' },
    { type: 'output', text: 'Available commands: [status, logs, diagnose, clear]' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef(null);

  // Live telemetry feed ticker
  const [liveTicker, setLiveTicker] = useState([
    { text: 'CHILLER PUMP #2 RPM stabilized at 1420.', time: '1s ago', type: 'info' },
    { text: 'BIM Spatial Model L4 synchronization verified.', time: '5s ago', type: 'success' },
    { text: 'HVAC Zone 4 fan speed deviation logged (12.4% over spec).', time: '12s ago', type: 'warning' },
  ]);

  // Handle live logs update
  useEffect(() => {
    const logsPool = [
      { text: 'Core Server Room B temperature nominal at 21.4°C.', type: 'success' },
      { text: 'Scheduled automated database backup complete.', type: 'info' },
      { text: 'Grid sensor Node 7 reports minor vibration frequency variation.', type: 'warning' },
      { text: 'Active 2FA confirmation verified for operator Jane Doe.', type: 'success' },
      { text: 'SRE load balancing optimization triggered by AI Copilot.', type: 'info' }
    ];

    const interval = setInterval(() => {
      const randomLog = logsPool[Math.floor(Math.random() * logsPool.length)];
      setLiveTicker(prev => [
        { text: randomLog.text, time: 'Just Now', type: randomLog.type },
        ...prev.map(l => l.time === 'Just Now' ? { ...l, time: '3s ago' } : l).slice(0, 5)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Scroll to terminal bottom on update
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  // Scroll event listener for glassmorphic header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Canvas background animation for circuit glowing lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 1.8);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight * 1.8;
    };
    window.addEventListener('resize', handleResize);

    const lines = [];
    const lineCount = 10;
    
    // Generate curved paths
    for (let i = 0; i < lineCount; i++) {
      const isOrange = i % 2 === 0;
      const color = isOrange ? '#f38020' : '#00dbe7';
      const startX = Math.random() * width * 0.3;
      const startY = height * (0.4 + Math.random() * 0.5);
      const cp1x = width * (0.2 + Math.random() * 0.4);
      const cp1y = height * (0.3 + Math.random() * 0.4);
      const cp2x = width * (0.4 + Math.random() * 0.4);
      const cp2y = height * (0.2 + Math.random() * 0.3);
      const endX = width * (0.7 + Math.random() * 0.3);
      const endY = height * (0.05 + Math.random() * 0.25);

      lines.push({
        color,
        isOrange,
        points: [startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY],
        particles: Array.from({ length: 2 }, () => ({
          t: Math.random(),
          speed: 0.0004 + Math.random() * 0.0008,
          size: 1.5 + Math.random() * 2
        }))
      });
    }

    const getBezierPoint = (t, x0, y0, x1, y1, x2, y2, x3, y3) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;
      return {
        x: uuu * x0 + 3 * uu * t * x1 + 3 * u * tt * x2 + ttt * x3,
        y: uuu * y0 + 3 * uu * t * y1 + 3 * u * tt * y2 + ttt * y3
      };
    };

    let scrollOffset = 0;
    const handleScroll = () => {
      scrollOffset = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      lines.forEach(line => {
        const [x0, y0, x1, y1, x2, y2, x3, y3] = line.points;
        
        // Draw path with scroll-parallax
        ctx.beginPath();
        const py0 = y0 - scrollOffset * 0.25;
        const py1 = y1 - scrollOffset * 0.25;
        const py2 = y2 - scrollOffset * 0.25;
        const py3 = y3 - scrollOffset * 0.25;

        ctx.moveTo(x0, py0);
        ctx.bezierCurveTo(x1, py1, x2, py2, x3, py3);
        ctx.strokeStyle = line.isOrange ? 'rgba(243, 128, 32, 0.06)' : 'rgba(0, 219, 231, 0.06)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Draw glowing particles running along the path
        line.particles.forEach(p => {
          p.t += p.speed;
          if (p.t > 1) {
            p.t = 0;
            p.speed = 0.0004 + Math.random() * 0.0008;
          }

          const pos = getBezierPoint(p.t, x0, py0, x1, py1, x2, py2, x3, py3);

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = line.color;
          ctx.shadowColor = line.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    let responseText = '';

    if (cmd === 'help') {
      responseText = 'Available commands: [status, logs, diagnose, clear]';
    } else if (cmd === 'status') {
      responseText = 'BEECARBONAT-V4 System: ONLINE | DB Status: SECURE | Active Nodes: 12 | Latency: 8ms | CPU Load: 14.2%';
    } else if (cmd === 'logs') {
      responseText = `SYSTEM LOGS DIRECTORY: \n- 08:24:15 [INFO] Automated energy audit triggered for Core Room B \n- 08:21:42 [WARN] HVAC Zone 4 fan speed deviation logged \n- 08:15:30 [SUCCESS] Physical 3D node structural link confirmed`;
    } else if (cmd === 'diagnose') {
      responseText = 'DIAGNOSING INFRASTRUCTURE PERIMETER... \n[........................] 100% \nSTATUS: No active structural anomalies or breaches detected.';
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      responseText = `Command not found: "${cmd}". Type "help" for active options.`;
    }

    setTerminalHistory(prev => [
      ...prev,
      { type: 'input', text: terminalInput },
      { type: 'output', text: responseText }
    ]);
    setTerminalInput('');
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!demoForm.fullName || !demoForm.email || !demoForm.company) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setDemoSubmitting(true);
    setDemoStep(2);

    // Simulate provisioning workflow
    setTimeout(() => {
      setDemoStep(3);
      setDemoSubmitting(false);
      toast.success(`Deployment Workspace created for ${demoForm.company}!`);
    }, 2500);
  };

  // Case Studies list
  const initialCaseStudies = [
    {
      id: 'case-1',
      title: 'Project Nexus - Hyperscale Optimization',
      category: 'datacenter',
      categoryLabel: 'Data Center',
      desc: 'Implementation of predictive thermal modeling and automated workload distribution across a 500,000 sq ft facility, resolving chronic hotspot issues and reducing PUE to near-theoretical limits.',
      cooling: '-42%',
      uptime: '+99.999%',
      roi: '8 Months',
      progress: 75,
      impactScore: 98,
      scaleSqFt: 500000,
      year: 2026,
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArEMv5VtJoK1wFhUs1qt_djFUZISX5xza79RaTVhkHMWK-kMQ0mQ-tdzBV_zbw5LOlopCzj0XPrvcJ5xkua1rDId6DCM3z5QTpTJEr1aF_VbjjXaXQ3Bb9munxzjIAF3EFg5FrGTalf3uIHLnHX4hD59HFBX6D4aGUW5YvTXUEKLV0SP_AaEzXpdbYSpFihy3N9n_CcLWruHuWd2SSG47icmhAs6mq-17a8Fo6boeEQHfRxh8LD5MG'
    },
    {
      id: 'case-2',
      title: 'Global Hub Alpha: Automated Resource Routing',
      category: 'industrial',
      categoryLabel: 'Logistics / Industrial',
      desc: 'Integration of IoT spatial sensors with robotic fulfillment systems to dynamically manage HVAC and lighting based on real-time machine occupancy rather than human schedules.',
      cooling: '+28%',
      coolingLabel: 'Spatial Efficiency',
      uptime: '-15%',
      uptimeLabel: 'Maint. Overhead',
      roi: '6 Months',
      progress: 90,
      impactScore: 92,
      scaleSqFt: 350000,
      year: 2025,
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMURsK7XOaLo6eADLkLBLiz98ippfi14iohKzDaqOEe2H_e6EYqz1mOtCB7MIN9lVse1Naxdp7z4HQdZgrI3bW85cD7rBXguy2VBNDLBCGlsU2ViivZrq0_wSE8_OfK80xL3IHcorNIdH_rCG8FTrIZILeom-1poAQ_Nl3QzIiU4fQczih2f918c4TqVt_UNfNYGKBE4LI2M6Ag7ZBsNygNh4xQ2P5JSgiEzAQvL7yiRNDMNZAUtC1'
    },
    {
      id: 'case-3',
      title: 'Tower 42: Intelligent Climate Response',
      category: 'commercial',
      categoryLabel: 'Commercial',
      desc: 'Deployment of a building-wide neural network predicting localized thermal loads based on solar positioning and real-time tenant density mapping.',
      cooling: '98/100',
      coolingLabel: 'Comfort Score',
      uptime: '1.2kT',
      uptimeLabel: 'Carbon Reduction',
      roi: '12 Months',
      progress: 60,
      impactScore: 89,
      scaleSqFt: 180000,
      year: 2026,
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANY0gBpCOBc7BlFdSNBcTGTIayeVKxwVUIn_959LtDW3J4OVnyWiMLcIQxpkAoygVTIwvQXse1yt7oVMi7sFyScasmoND91uxJNhUEF-zEtpuD-rNSZ_cRSegoJIh29c6iEU2Z_ZcUviHIBZeAIu488V5esw-h9XR_I0uIfEEn-s10GN7DMu4hRUG_wIrIGhjYLvbXdisRZHigR6r7taQ0lghh691vIlz2o-3QDHTa29XDToq-rK1l'
    }
  ];

  // Filtering & Sorting calculations for Case Studies
  const filteredCases = initialCaseStudies
    .filter(c => caseFilter === 'all' || c.category === caseFilter)
    .sort((a, b) => {
      if (caseSort === 'impact') return b.impactScore - a.impactScore;
      if (caseSort === 'recent') return b.year - a.year;
      if (caseSort === 'scale') return b.scaleSqFt - a.scaleSqFt;
      return 0;
    });

  const handleAuditAction = () => {
    toast.success('Analyzing system metrics... No active risks detected on external ports.');
  };

  return (
    <div className="min-h-screen bg-[#1a1e23] text-zinc-100 font-sans selection:bg-brand-orange selection:text-black relative overflow-x-hidden"
         style={{
           backgroundImage: `radial-gradient(circle at 75% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 40%), radial-gradient(circle at 25% 70%, rgba(255, 138, 0, 0.1) 0%, transparent 40%)`
         }}>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .glass-panel {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        .glow-text-orange {
          text-shadow: 0 0 10px rgba(255, 138, 0, 0.8), 0 0 20px rgba(255, 138, 0, 0.5);
        }
        .glow-text-cyan {
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.5);
        }
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .btn-glow-cyan {
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
          transition: all 0.3s ease;
        }
        .btn-glow-cyan:hover {
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.9);
        }
        .btn-glow-orange {
          box-shadow: 0 0 15px rgba(255, 138, 0, 0.6);
          transition: all 0.3s ease;
        }
        .btn-glow-orange:hover {
          box-shadow: 0 0 25px rgba(255, 138, 0, 0.9);
        }
        .btn-dual-glow {
          position: relative;
          background: transparent;
          border: 2px solid transparent;
          background-image: linear-gradient(rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.8)), linear-gradient(to right, #FF8A00, #00F0FF);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          box-shadow: -5px 0 15px -5px rgba(255, 138, 0, 0.6), 5px 0 15px -5px rgba(0, 240, 255, 0.6);
        }
      `}</style>

      {/* Background Graphic Overlay */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-full h-full select-none pointer-events-none opacity-[0.9] mix-blend-normal z-0"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida/AEtjO1VcgUYyBe89n_gLeSWrGf6XTcy1vX1YynqiR5dl0lj0MXGhdpBYRc7ryJtZcCf8d7-oVvH5dz9mSDjr-GW_hm2IbTy9tbMw3KFrZDPVSAgnsP0CLEXSdNCf_DFHwAoeHKNXj8y-hzEuBWxfaBKDSvL61GjthcNakHuf5srYTSMNYezCpmDAApvWT2OV-FfW1nhZwjzxtDpuIgUIl8J7dZIfd0BvH6EFkbdAhRK1-zbQztKkT3vjolGyQhY')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Interactive Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Floating Header */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
        <header
          className={`pointer-events-auto transition-all duration-500 ease-out flex items-center justify-between glass-panel shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden ${
            scrolled
              ? 'mt-3 py-2 px-8 rounded-full w-[85%] max-w-5xl mx-4 shadow-[0_10px_40px_rgba(0,0,0,0.7),_0_0_20px_rgba(0,240,255,0.06)]'
              : 'mt-6 py-4 px-12 rounded-full w-[90%] max-w-6xl mx-4'
          }`}
        >
          {/* Logo */}
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform relative">
              <img src="/logo.png" className="w-8 h-8 object-contain relative z-10" alt="BeeCarbonit Logo" />
            </div>
            <span className="text-xl font-bold tracking-wide text-white">BeeCarbonit</span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            {[
              { id: 'solutions', label: 'Solutions', accentColor: '#FF8A00' },
              { id: 'home', label: 'Platform', accentColor: '#FF8A00' },
              { id: 'case-studies', label: 'Impact', accentColor: '#FF8A00' },
              { id: 'pricing', label: 'Resources', accentColor: '#00F0FF' },
              { id: 'contact', label: 'Contact', accentColor: '#00F0FF' }
            ].map(tab => {
              const isActive = activeTab === tab.id || (tab.id === 'contact' && demoModalOpen);
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'contact') {
                      setDemoForm({ ...demoForm, plan: 'Advanced' });
                      setDemoModalOpen(true);
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`transition-colors relative py-1 hover:text-white ${
                    isActive ? 'text-white font-semibold' : 'text-gray-300'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-2 left-0 w-full h-[2px] rounded-full"
                      style={{
                        backgroundColor: tab.accentColor,
                        boxShadow: `0 0 8px ${tab.accentColor}`
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded-full px-6 py-2 transition-colors"
            >
              Login
            </Link>
            <button
              onClick={() => {
                setDemoForm({ ...demoForm, plan: 'Advanced' });
                setDemoModalOpen(true);
                setDemoStep(1);
              }}
              className="bg-[#00F0FF] text-zinc-950 font-bold text-sm rounded-full px-6 py-2 hover:opacity-90 transition-opacity shadow-[inset_0_0_10px_rgba(255,255,255,0.5)] btn-glow-cyan"
            >
              Get Started
            </button>
          </div>
        </header>
      </div>

      {/* Main Container */}
      <main className="pt-24 min-h-screen relative z-10 flex flex-col items-center">

        {/* ========================================================= */}
        {/* VIEW: HOME PAGE */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div className="w-full flex flex-col items-center">
            
            {/* Hero Section */}
            <section className="w-full max-w-6xl mx-auto min-h-[75vh] flex items-center px-8 relative z-10">
              <div className="max-w-2xl mt-16">
                <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                  <span className="text-transparent text-gradient bg-gradient-to-b from-white to-[#FF8A00] glow-text-orange block pb-1">
                    Carbon-Neutral
                  </span>
                  <span className="text-transparent text-gradient bg-gradient-to-t from-[#00F0FF] to-white glow-text-cyan block pb-1">
                    Facility Management
                  </span>
                </h1>
                
                <p className="text-gray-300 text-lg mb-10 max-w-lg leading-relaxed font-sans font-normal">
                  Optimize, track, and reduce your facility's carbon footprint with advanced AI and real-time analytics.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Link
                    to="/signup"
                    className="btn-dual-glow text-white font-bold py-3 px-8 rounded-full text-lg text-center transition-all inline-block shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"
                    style={{
                      boxShadow: '-8px 0 20px -5px rgba(255, 138, 0, 0.9), 8px 0 20px -5px rgba(0, 240, 255, 0.9)'
                    }}
                  >
                    Launch Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setActiveTab('solutions');
                    }}
                    className="text-gray-300 hover:text-white underline underline-offset-4 decoration-gray-500 hover:decoration-white transition-all text-lg font-medium"
                  >
                    Explore Our Technology
                  </button>
                </div>
              </div>
            </section>

            {/* Parallax Stats and Metric Grid */}
            <section className="max-w-7xl mx-auto px-6 relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Metric Card 1 */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-6 space-y-4 hover:border-brand-orange/40 transition duration-500 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-bl-full blur-xl pointer-events-none group-hover:bg-brand-orange/10 transition-colors" />
                  <div className="flex justify-between items-start">
                    <Leaf className="w-6 h-6 text-brand-orange" />
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">METRIC</span>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-brand-orange tracking-tight">30%</h3>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200 mt-1">Energy Reduction</h4>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">Automated HVAC optimization derived from spatial telemetry and occupancy heat maps.</p>
                </div>

                {/* Metric Card 2 */}
                <div className="bg-zinc-900/40 border border-brand-cyan/30 rounded-lg p-6 space-y-4 hover:border-brand-cyan/50 transition duration-500 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-bl-full blur-xl pointer-events-none group-hover:bg-brand-cyan/10 transition-colors" />
                  <div className="flex justify-between items-start">
                    <Layers className="w-6 h-6 text-brand-cyan" />
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">INTEGRATION</span>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-brand-cyan tracking-tight">100%</h3>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200 mt-1">BIM Sync</h4>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">Real-time bidirectional synchronization with full-scale digital twins and structural mapping.</p>
                </div>

                {/* Metric Card 3 */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-6 space-y-4 hover:border-zinc-700 transition duration-500 relative group overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <Activity className="w-6 h-6 text-brand-cyan" />
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">UPTIME</span>
                  </div>
                  <div className="py-2">
                    {/* SVG Sparkline Sparking with cyan-and-orange-dashed wave */}
                    <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 60">
                      <path
                        d="M0 50 Q 40 30, 80 45 T 160 20 T 200 5 L 200 60 L 0 60 Z"
                        fill="rgba(0, 219, 231, 0.02)"
                      />
                      <path
                        d="M0 50 Q 40 30, 80 45 T 160 20 T 200 5"
                        fill="none"
                        stroke="url(#sparkGrad)"
                        strokeWidth="2.5"
                        strokeDasharray="5 3"
                        className="animate-pulse"
                      />
                      <defs>
                        <linearGradient id="sparkGrad" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="var(--brand-cyan,_#00dbe7)" />
                          <stop offset="60%" stopColor="var(--brand-cyan,_#00dbe7)" />
                          <stop offset="100%" stopColor="var(--brand-orange,_#f38020)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">Operational Stability</h4>
                    <p className="text-xs text-zinc-400 font-sans mt-1">Predictive anomaly detection prevents critical asset failure before it occurs.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* AI-Driven Predictive Maintenance Section */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
              <div className="absolute top-1/2 -right-40 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 -left-40 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />

              {/* Left Column Description */}
              <div className="col-span-1 lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-orange rounded-sm" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-orange font-bold">Neural Engine</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 max-w-lg leading-tight font-display">
                  AI-Driven Predictive Maintenance
                </h2>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans max-w-xl">
                  Shift from reactive triage to absolute operational foresight. Our machine learning core ingests thousands of sensor signals per second, calculating exact structural degradation and component fatigue.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">Fatigue Modeling</h4>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono mt-0.5">Material stress forecasting</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <Network className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">IoT Ingestion</h4>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono mt-0.5">Sub-millisecond telemetry</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Layout mockup */}
              <div className="col-span-1 lg:col-span-6 relative">
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-lg p-6 space-y-6 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-center border-b border-zinc-800/40 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-100 font-bold">TURBINE ALPHA</span>
                    </div>
                    <span className="font-mono text-[9px] text-brand-orange border border-brand-orange/20 px-2.5 py-0.5 rounded uppercase font-semibold">EDGE NODE</span>
                  </div>

                  {/* Diagnostic details */}
                  <div className="space-y-4">
                    <div className="bg-zinc-950 p-4 border border-zinc-800/50 space-y-3">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">Structural Health</span>
                        <span className="text-brand-cyan font-bold">94.2%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-orange to-brand-cyan h-full w-[94.2%] rounded-full shadow-[0_0_10px_rgba(0,219,231,0.5)]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-950 p-4 border border-zinc-800/50 text-center font-mono">
                        <span className="text-zinc-500 text-[9px] uppercase block mb-1">Vibration (Hz)</span>
                        <span className="text-zinc-200 text-sm font-bold">14.2 Hz</span>
                      </div>
                      <div className="bg-zinc-950 p-4 border border-zinc-800/50 text-center font-mono">
                        <span className="text-zinc-500 text-[9px] uppercase block mb-1">Thermal Load</span>
                        <span className="text-green-400 text-sm font-bold">NOMINAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Alerts Block status */}
                  <div className="p-4 bg-zinc-950 border border-zinc-850 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-300">0 Active Alerts</p>
                        <p className="text-[9px] font-mono text-zinc-500">Node operating within normal specs.</p>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded font-mono text-[9px] text-brand-orange flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>SECURE</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Command the Infrastructure Section */}
            <section className="bg-zinc-950/40 border-y border-zinc-900 py-20 px-6">
              <div className="max-w-7xl mx-auto space-y-16">
                
                {/* Header text */}
                <div className="text-center space-y-4">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-zinc-100 uppercase tracking-widest">
                    Command the Infrastructure
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto font-sans leading-relaxed">
                    Comprehensive, precision-engineered tooling designed for total operational dominance over complex facilities.
                  </p>
                </div>

                {/* Grid of four key feature cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-zinc-900/60 p-6 border border-zinc-850 hover:border-brand-cyan/40 hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-[180px]">
                    <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">Centralized Control</h4>
                      <p className="text-[11px] text-zinc-400 leading-normal font-sans">Unified dashboard aggregating diverse protocol feeds into a single pane of glass.</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-zinc-900/60 p-6 border border-zinc-850 hover:border-brand-orange/40 hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-[180px]">
                    <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">Access Analytics</h4>
                      <p className="text-[11px] text-zinc-400 leading-normal font-sans">Biometric cross-referencing and dynamic physical perimeter management.</p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-zinc-900/60 p-6 border border-zinc-850 hover:border-brand-cyan/40 hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-[180px]">
                    <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <Database className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">Asset Genealogy</h4>
                      <p className="text-[11px] text-zinc-400 leading-normal font-sans">Track lifecycle histories, warranty thresholds, and maintenance ledgers immutably.</p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-zinc-900/60 p-6 border border-zinc-850 hover:border-brand-orange/40 hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-[180px]">
                    <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <Network className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">Resource Allocation</h4>
                      <p className="text-[11px] text-zinc-400 leading-normal font-sans">Algorithmic distribution of maintenance personnel based on threat matrices.</p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* BEGIN: Footer */}
            <footer className="w-[90%] max-w-6xl glass-panel rounded-full px-12 py-4 flex flex-col md:flex-row items-center justify-between z-10 mt-12 mb-8 mx-auto">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <img src="/logo.png" className="w-6 h-6 object-contain" alt="BeeCarbonit Logo" />
                <span className="text-lg font-bold tracking-wide">BeeCarbonit</span>
              </div>
              
              {/* Navigation */}
              <nav className="flex items-center gap-6 text-sm font-medium text-gray-400 mb-4 md:mb-0">
                <button onClick={() => setActiveTab('solutions')} className="hover:text-white transition-colors">Solutions</button>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">Platform</button>
                <button onClick={() => setActiveTab('case-studies')} className="hover:text-white transition-colors">Impact</button>
                <button onClick={() => setActiveTab('pricing')} className="hover:text-white transition-colors">Resources</button>
                <button onClick={() => {
                  setDemoForm({ ...demoForm, plan: 'Advanced' });
                  setDemoModalOpen(true);
                }} className="hover:text-white transition-colors">Contact</button>
              </nav>
              
              {/* Newsletter */}
              <form onSubmit={handleSubscribe} className="flex items-center bg-gray-800/50 border border-gray-600 rounded-full p-1 pl-4">
                <input
                  type="email"
                  required
                  placeholder="Newsletter"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-transparent border-none text-sm text-white focus:ring-0 w-32 placeholder-gray-400 outline-none focus:outline-none"
                />
                <button type="submit" className="bg-[#00F0FF] text-zinc-950 font-bold text-sm rounded-full px-4 py-1.5 ml-2 hover:opacity-90 transition-opacity shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]">
                  Subscribe
                </button>
              </form>
            </footer>
            {/* END: Footer */}

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: SOLUTIONS */}
        {/* ========================================================= */}
        {activeTab === 'solutions' && (
          <div className="space-y-24 pb-24">
            
            {/* Header / Intro */}
            <section className="pt-24 md:pt-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="col-span-1 lg:col-span-6 space-y-6">
                <span className="font-mono text-[9px] text-brand-cyan border border-brand-cyan/20 px-2.5 py-1 rounded-sm uppercase tracking-widest font-semibold bg-brand-cyan/5">SOLUTIONS ARCHITECTURE</span>
                <h1 className="text-4xl md:text-6xl font-bold font-display max-w-2xl text-zinc-100 tracking-tight leading-tight">
                  <span className="text-brand-orange">Engineered</span> Solutions for Modern Infrastructure.
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm font-sans max-w-lg leading-relaxed">
                  Precision management across the entire facility lifecycle. From digital twins to real-time security, our platform integrates seamlessly with your built environment.
                </p>
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => {
                      setDemoForm({ ...demoForm, plan: 'Advanced' });
                      setDemoModalOpen(true);
                      setDemoStep(1);
                    }}
                    className="px-6 py-2.5 bg-brand-orange text-black font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-[#e27010] transition"
                  >
                    Explore Platform
                  </button>
                  <button
                    onClick={() => setSimulationActive(true)}
                    className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[10px] uppercase tracking-wider hover:bg-zinc-800 transition flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 text-brand-cyan" /> View Demo
                  </button>
                </div>
              </div>

              {/* Wireframe blueprint visualization */}
              <div className="col-span-1 lg:col-span-6 relative">
                <div className="w-full aspect-[4/3] bg-zinc-950 border border-zinc-800/80 rounded p-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBc9yX6-bOvufqsWdDcD4RCz2PCLRK_eWtIL-M3ohkIHPjcu1_G7JsaNVyIkw8zGF6lF5Fo5oUapfL-69ZznDaueV2yvVJxJ5vh2hit-IUdPdsCkpMsJe-gcU1CzX5nxwkDT1HULgZesSQf2Un3NUdFKrfYKJkwb05WGY8GwVwzsmowXmEgelBEqy5P8Qw8ngkz8cIhu7aesdKDsvPjCh0UG7ZcPoVvbUvvhZXmn5g7OyX34jcndJnQ')" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 flex items-center gap-2.5 bg-zinc-900/90 border border-zinc-800 px-4 py-2 rounded-sm shadow-xl z-10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="font-mono text-[10px] text-zinc-100 uppercase tracking-widest font-semibold">System Online</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Split layout: BIM Asset Management */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-zinc-900">
              
              {/* Module 01 info */}
              <div className="col-span-1 lg:col-span-5 space-y-6">
                <span className="font-mono text-[9px] text-brand-orange border border-brand-orange/20 px-2.5 py-1 rounded-sm uppercase tracking-widest font-semibold bg-brand-orange/5">MODULE 01</span>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-zinc-100 tracking-tight uppercase">BIM Asset Management</h2>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Transform static models into dynamic operational dashboards. Link live telemetry data directly to your 3D assets for unprecedented context and control.
                </p>
                <div className="space-y-3 font-mono text-xs text-zinc-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Bidirectional COBie data synchronization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Visual lifecycle tracking and predictive maintenance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Spatial collision and space utilization analytics</span>
                  </div>
                </div>
              </div>

              {/* Interactive BIM metrics cards */}
              <div className="col-span-1 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* HVAC Component matrix */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 space-y-4 hover:border-zinc-700 transition relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">HVAC Component Matrix</h3>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Level 4 Overview</span>
                    </div>
                    <span className="w-8 h-8 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-400">
                      <Zap className="w-4 h-4 text-brand-orange" />
                    </span>
                  </div>
                  <div className="w-full h-32 bg-zinc-950 border border-zinc-850 rounded-sm relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2SCCrd-epZxf3mXdDdA2L-Dc_Qtypynrrlb_rIY7XD-YvGghpd6PzRn66_YI4ih43fMrj63yXZddY45ekk2T9iPLE9fOjcOjzEJfI-BOVtXc_ZaRKRxC8Z8Fic3mRsJjuTKTCOtpqFw_3AnA3078THdAV_4jrTai-oS_M_aKUqHMBsn4fVqV2EG1njFs9T4sxs7kkYkLLHNvDniwU62NQCX4HqQk0DM0knnYQ-DzbhICJ6XSBXIP_')" }} />
                    <span className="font-mono text-[9px] text-zinc-500 relative z-10">CORE ENGINE WIREFRAME ACTIVE</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center border-t border-zinc-800/60 pt-4">
                    <div>
                      <span className="text-[9px] text-zinc-500 font-mono uppercase block">Efficiency</span>
                      <span className="font-mono text-sm font-bold text-brand-cyan">94%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 font-mono uppercase block">Status</span>
                      <span className="font-mono text-sm font-bold text-green-400">Optimal</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 font-mono uppercase block">Next Maint.</span>
                      <span className="font-mono text-sm font-bold text-brand-orange">12d</span>
                    </div>
                  </div>
                </div>

                {/* Space utilization map (Interactive bar-graph selector) */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 space-y-4 hover:border-zinc-700 transition flex flex-col justify-between">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">Space Utilization Map</h3>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Click a level to view current volumetric sensor metrics:</p>
                  </div>

                  {/* Level bars graph */}
                  <div className="flex items-end justify-between h-20 px-2 pb-1 border-b border-zinc-800">
                    {Object.keys(floorData).map(flKey => (
                      <button
                        key={flKey}
                        onClick={() => setSelectedFloor(flKey)}
                        className={`w-1/6 rounded-t-sm relative transition-all duration-300 group ${
                          flKey === selectedFloor
                            ? 'bg-brand-orange'
                            : 'bg-zinc-800 hover:bg-zinc-700'
                        }`}
                        style={{ height: `${floorData[flKey].occupancy}%` }}
                        title={`Floor ${flKey}: ${floorData[flKey].occupancy}%`}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-950 text-brand-cyan text-[8px] px-1 py-0.5 rounded border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
                          {floorData[flKey].occupancy}%
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Horizontal bar names indicator */}
                  <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                    {Object.keys(floorData).map(fl => (
                      <span key={fl} className={fl === selectedFloor ? 'text-brand-orange font-bold' : ''}>{fl}</span>
                    ))}
                  </div>

                  {/* Selected Floor detailed print out */}
                  <div className="bg-zinc-950 p-3 border border-zinc-850/60 font-mono text-[10px] space-y-1">
                    <p className="text-zinc-300 font-semibold truncate">{floorData[selectedFloor].name}</p>
                    <div className="flex justify-between text-zinc-500 text-[9px]">
                      <span>Temp: <strong className="text-zinc-300">{floorData[selectedFloor].temp}</strong></span>
                      <span>Noise: <strong className="text-zinc-300">{floorData[selectedFloor].noise}</strong></span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Smart Energy Monitoring Module */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-zinc-900">
              
              {/* Consumption topography chart section */}
              <div className="col-span-1 lg:col-span-7 order-2 lg:order-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Consumption Topography slot */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 md:col-span-2 space-y-4 hover:border-zinc-700 transition relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">Consumption Topography</h3>
                      <p className="text-[10px] font-mono text-zinc-500">Real-time KW/h distribution</p>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                  </div>
                  <div className="w-full h-44 bg-zinc-950 border border-zinc-850 rounded relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9m9SifUWik87zUAR2zJn28k9ruVGSZD39IwxNzXRvCvLLKvfHexpBgA1LUjiaTa1jGy0HOVDTUp_hISDzNrIJeMmJXjAQxVFvIP4q-WRr6-ZNKh5clociB472B2v9Mh8ae4XyvzoIoLPOPdwCqLWbziNwjfBAU9dUQL514ZD2poqqkwgqHdI4ZagNviyhzRDT3G0_lAEyIHgwPEc6HKbLTx_XJWOQL132fmchI5ShAqIaWd3CBQR6')" }} />
                    <span className="font-mono text-[9px] text-zinc-500 relative z-10">REAL-TIME TELEMETRY STREAM</span>
                  </div>
                </div>

                {/* Demand and Carbon metrics cards */}
                <div className="space-y-6 flex flex-col justify-between h-full">
                  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm flex-1 flex flex-col justify-between">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Peak Demand</span>
                    <span className="font-mono text-2xl font-bold text-zinc-100 block">4.2 MW</span>
                    <span className="text-red-400 font-mono text-[9px] uppercase tracking-wider block mt-2">▲ +2.4% vs last week</span>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm flex-1 flex flex-col justify-between">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Carbon Offset</span>
                    <span className="font-mono text-2xl font-bold text-brand-cyan block">1,240 t</span>
                    <span className="text-green-400 font-mono text-[9px] uppercase tracking-wider block mt-2">▼ -5.1% vs last week</span>
                  </div>
                </div>

              </div>

              {/* Module 02 info */}
              <div className="col-span-1 lg:col-span-5 order-1 lg:order-2 space-y-6 lg:pl-6">
                <span className="font-mono text-[9px] text-brand-cyan border border-brand-cyan/20 px-2.5 py-1 rounded-sm uppercase tracking-widest font-semibold bg-brand-cyan/5">MODULE 02</span>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-zinc-100 tracking-tight uppercase">Smart Energy Monitoring</h2>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Harness granular telemetry to identify inefficiencies. Our platform aggregates data across HVAC, lighting, and specialized equipment to drive sustainable operations.
                </p>
                <div className="space-y-3 font-mono text-xs text-zinc-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>Automated demand-response protocols</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>Machine learning anomaly detection algorithms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>ESG compliance reporting automation</span>
                  </div>
                </div>
              </div>

            </section>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: TECHNOLOGY */}
        {/* ========================================================= */}
        {activeTab === 'technology' && (
          <div className="space-y-24 pb-24">
            
            <section className="pt-24 md:pt-32 px-6 max-w-7xl mx-auto space-y-8">
              <div className="space-y-4 max-w-3xl">
                <span className="font-mono text-[9px] text-brand-cyan border border-brand-cyan/20 px-2.5 py-1 rounded-sm uppercase tracking-widest font-semibold bg-brand-cyan/5">CORE TECHNOLOGY MATRIX</span>
                <h1 className="text-4xl md:text-6xl font-bold font-display text-zinc-100 tracking-tight leading-tight">
                  THE PREVENTATIVE SRE ENGINE
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans">
                  BEECARBONAT runs on a localized edge networking mesh, deploying sub-millisecond hardware acceleration shaders to evaluate thermal stresses and secure perimeter authentication logs instantly.
                </p>
              </div>

              {/* Hardware Diagnostic Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Tech card 1 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-3">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-zinc-400 text-xs uppercase font-bold">Node Latency</span>
                    <span className="text-brand-cyan font-bold text-sm">8 ms</span>
                  </div>
                  <p className="text-zinc-500 text-xs font-sans">Active routing connections mapping directly to our Cloud Run containers.</p>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-cyan h-full w-[88%]" />
                  </div>
                </div>

                {/* Tech card 2 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-3">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-zinc-400 text-xs uppercase font-bold">Memory Overhead</span>
                    <span className="text-brand-orange font-bold text-sm">14.2%</span>
                  </div>
                  <p className="text-zinc-500 text-xs font-sans">Optimized client-side service worker cache and browser storage allocation.</p>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-orange h-full w-[14.2%]" />
                  </div>
                </div>

                {/* Tech card 3 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-3">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-zinc-400 text-xs uppercase font-bold">Active WebSockets</span>
                    <span className="text-green-400 font-bold text-sm">12 Nodes</span>
                  </div>
                  <p className="text-zinc-500 text-xs font-sans">Active telemetry pipelines feeding directly into visual BIM overlays.</p>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-[95%]" />
                  </div>
                </div>

              </div>
            </section>

            {/* Interactive SRE Terminal simulator */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
                
                {/* Terminal top header */}
                <div className="bg-zinc-900 px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="font-mono text-[10px] text-zinc-400 ml-2">ssh developer@beecarbonat-sre-shell</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">SECURE SHELL v4.2</span>
                </div>

                {/* Terminal screen */}
                <div className="p-6 font-mono text-xs space-y-4 max-h-[350px] overflow-y-auto scrollbar-hide text-zinc-300">
                  
                  {/* Instructions help text */}
                  <div className="space-y-1 text-zinc-500 border-b border-zinc-900 pb-4">
                    <p>BEECARBONAT SRE Interactive Shell Console.</p>
                    <p>Type diagnostic command keys to query the facility database.</p>
                    <p>Available commands: <code className="text-brand-orange">status</code>, <code className="text-brand-orange">logs</code>, <code className="text-brand-orange">diagnose</code>, <code className="text-brand-orange">clear</code></p>
                  </div>

                  {/* Terminal history list */}
                  {terminalHistory.map((line, idx) => (
                    <div key={idx} className="space-y-1">
                      {line.type === 'input' ? (
                        <p className="text-zinc-500 flex items-center gap-2">
                          <span className="text-brand-cyan">&gt;</span> {line.text}
                        </p>
                      ) : (
                        <p className="text-zinc-300 whitespace-pre-line leading-relaxed pl-4 border-l border-zinc-900">
                          {line.text}
                        </p>
                      )}
                    </div>
                  ))}

                  <div ref={terminalBottomRef} />
                </div>

                {/* Command prompt form */}
                <form onSubmit={handleTerminalSubmit} className="bg-zinc-900/60 p-4 border-t border-zinc-800 flex items-center gap-3">
                  <span className="text-brand-cyan font-mono text-sm font-bold pl-2">&gt;</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Enter command key (e.g., status, diagnose)..."
                    className="flex-1 bg-transparent text-zinc-100 font-mono text-xs outline-none focus:ring-0 placeholder-zinc-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-orange text-black font-mono text-[10px] font-bold uppercase rounded-sm hover:bg-[#e27010] transition"
                  >
                    Send
                  </button>
                </form>

              </div>
            </section>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: CASE STUDIES */}
        {/* ========================================================= */}
        {activeTab === 'case-studies' && (
          <div className="space-y-24 pb-24">
            
            {/* Title & Stats */}
            <section className="pt-24 md:pt-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end justify-between relative overflow-hidden">
              <div className="col-span-1 lg:col-span-8 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-brand-orange" />
                  <span className="font-mono text-[9px] text-brand-orange uppercase tracking-widest font-semibold">PERFORMANCE VALIDATION</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold font-display text-zinc-100 tracking-tight leading-tight">
                  Proven Intelligence.<br />Measurable Impact.
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm font-sans max-w-2xl leading-relaxed">
                  Explore how BEECARBONAT transforms complex infrastructure data into actionable insights, driving unprecedented efficiency and sustainability across global facilities.
                </p>
              </div>

              {/* Quick stats totals */}
              <div className="col-span-1 lg:col-span-4 bg-zinc-900/40 p-6 border border-zinc-800 rounded-sm flex justify-between gap-6">
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">Avg Energy Red.</span>
                  <span className="font-mono text-2xl font-bold text-brand-cyan mt-1">32%</span>
                </div>
                <div className="w-px bg-zinc-800" />
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">ROI Multiplier</span>
                  <span className="font-mono text-2xl font-bold text-brand-orange mt-1">15x</span>
                </div>
              </div>
            </section>

            {/* Filter buttons and Sorting row */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
                
                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'All Projects' },
                    { id: 'datacenter', label: 'Data Centers' },
                    { id: 'commercial', label: 'Commercial' },
                    { id: 'industrial', label: 'Industrial' }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setCaseFilter(filter.id)}
                      className={`px-5 py-2 font-mono text-[10px] uppercase tracking-wider rounded-sm border transition ${
                        caseFilter === filter.id
                          ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/40'
                          : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-zinc-100 hover:border-zinc-800'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Sorting Select option */}
                <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  <span>Sort By:</span>
                  <select
                    value={caseSort}
                    onChange={(e) => setCaseSort(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 py-1.5 px-3 rounded-sm outline-none focus:border-brand-orange transition"
                  >
                    <option value="impact">Highest Impact</option>
                    <option value="recent">Most Recent</option>
                    <option value="scale">Facility Scale</option>
                  </select>
                </div>

              </div>
            </section>

            {/* Case Studies Grid list */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {filteredCases.map(item => (
                  <article key={item.id} className="bg-zinc-900/60 border border-zinc-850/80 rounded overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between h-[520px]">
                    
                    {/* Image visual header */}
                    <div className="h-1/2 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60" style={{ backgroundImage: `url('${item.bgImage}')` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                      <span className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-wider bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-sm">
                        {item.categoryLabel}
                      </span>
                    </div>

                    {/* Description content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wide truncate">{item.title}</h3>
                        <p className="text-zinc-400 text-xs font-sans line-clamp-3 leading-relaxed">{item.desc}</p>
                      </div>

                      {/* Quick specifications */}
                      <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/60 pt-4">
                        <div className="bg-zinc-950/60 p-3 border border-zinc-850 rounded-sm">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase block">{item.coolingLabel || 'Cooling Energy'}</span>
                          <span className="text-sm font-mono font-bold text-brand-cyan">{item.cooling}</span>
                        </div>
                        <div className="bg-zinc-950/60 p-3 border border-zinc-850 rounded-sm">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase block">{item.uptimeLabel || 'Uptime Gain'}</span>
                          <span className="text-sm font-mono font-bold text-brand-orange">{item.uptime}</span>
                        </div>
                      </div>

                      {/* View Analysis CTA click trigger */}
                      <div className="flex items-center justify-between font-mono text-[10px] text-brand-cyan pt-2">
                        <span>ROI Timeline: <strong className="text-zinc-100">{item.roi}</strong></span>
                        <button
                          onClick={() => {
                            toast.success(`Opening deep technical audit sheet for: ${item.title}`);
                            setSimulationActive(true);
                          }}
                          className="hover:text-zinc-50 flex items-center gap-1 font-semibold uppercase tracking-wider"
                        >
                          View Analysis <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </article>
                ))}

              </div>
            </section>

            {/* Biotech Campus Deep Dive section */}
            <section className="max-w-7xl mx-auto px-6 py-12 bg-zinc-900/40 border border-zinc-800/80 rounded-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left detailed text */}
                <div className="col-span-1 lg:col-span-8 space-y-6">
                  <span className="font-mono text-[9px] text-brand-cyan uppercase tracking-widest font-semibold block">DEEP DIVE ANALYSIS</span>
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-zinc-100 uppercase tracking-tight">BioTech Campus Synthesis</h2>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    How deploying BEECARBONAT's unified digital twin architecture resolved critical clean-room compliance issues while slashing operational waste.
                  </p>

                  {/* SVG Wave Line graph */}
                  <div className="w-full h-44 bg-zinc-950 border border-zinc-850 rounded-sm p-4 relative overflow-hidden flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">Environmental Volatility Index (Volatility reduced from 14/mo down to 0)</span>
                    <svg className="w-full h-full absolute bottom-0 left-0 right-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 150">
                      <path
                        d="M 0 120 Q 150 100 250 60 T 450 80 T 650 30 T 850 50 T 1000 20 L 1000 150 L 0 150 Z"
                        fill="rgba(0, 219, 231, 0.02)"
                      />
                      <path
                        d="M 0 120 Q 150 100 250 60 T 450 80 T 650 30 T 850 50 T 1000 20"
                        fill="none"
                        stroke="var(--brand-cyan,_#00dbe7)"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                      <path
                        d="M 0 90 L 1000 90"
                        fill="none"
                        stroke="var(--brand-orange,_#f38020)"
                        strokeWidth="1.5"
                        strokeDasharray="5 5"
                        opacity="0.3"
                      />
                    </svg>
                  </div>

                  {/* Descriptive sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs font-sans">
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs font-bold text-zinc-200 uppercase tracking-wider">The Challenge</h4>
                      <p className="text-zinc-400 leading-relaxed font-light">Maintaining strict ISO class clean-room environments required constant, manual intervention. The legacy BMS systems were siloed, leading to delayed responses in pressure differentials and humidity spikes.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs font-bold text-zinc-200 uppercase tracking-wider">The Solution Architecture</h4>
                      <p className="text-zinc-400 leading-relaxed font-light">BEECARBONAT instituted a comprehensive sensor mesh integrated via secure API layers to a central Digital Twin. This allowed for predictive algorithms to preemptively adjust HVAC systems minutes before thresholds were breached.</p>
                    </div>
                  </div>
                </div>

                {/* Right detailed KPI indicators */}
                <div className="col-span-1 lg:col-span-4 space-y-6 lg:pl-6">
                  <div className="bg-zinc-950 p-6 border border-zinc-800 space-y-4">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">COMPLIANCE INCIDENTS</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-mono font-bold text-green-400">0</span>
                      <span className="text-zinc-500 text-xs line-through">14/month</span>
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-6 border border-zinc-800 space-y-4">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">ENGINEER TIME SAVED</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-mono font-bold text-brand-cyan">320</span>
                      <span className="text-zinc-400 text-xs uppercase font-mono">Hrs/Month</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDemoForm({ ...demoForm, plan: 'Enterprise' });
                      setDemoModalOpen(true);
                      setDemoStep(1);
                    }}
                    className="w-full py-3 bg-brand-orange hover:bg-[#e27010] text-black font-mono text-[10px] font-bold uppercase tracking-wider text-center block transition shadow-lg"
                  >
                    Request Assessment
                  </button>
                </div>

              </div>
            </section>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: PRICING */}
        {/* ========================================================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-24 pb-24">
            
            {/* Title intro */}
            <section className="pt-24 md:pt-32 px-6 max-w-7xl mx-auto text-center space-y-6">
              <span className="font-mono text-[9px] text-brand-cyan border border-brand-cyan/20 px-2.5 py-1 rounded-sm uppercase tracking-widest font-semibold bg-brand-cyan/5">TRANSPARENT PRICING</span>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-zinc-100 tracking-tight leading-tight">
                Engineered for Scale.<br />
                <span className="text-brand-orange">Priced for Precision.</span>
              </h1>
              <p className="text-zinc-400 text-xs md:text-sm font-sans max-w-xl mx-auto leading-relaxed">
                Select the deployment configuration that aligns with your infrastructure requirements. All plans include mission-critical SLA and 24/7 telemetry monitoring.
              </p>

              {/* Monthly vs annual billing slide toggle */}
              <div className="pt-4 flex justify-center">
                <div className="inline-flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-sm relative">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 font-mono text-[9px] uppercase tracking-wider transition ${
                      billingCycle === 'monthly' ? 'bg-brand-orange text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-6 py-2 font-mono text-[9px] uppercase tracking-wider transition flex items-center gap-1.5 ${
                      billingCycle === 'annual' ? 'bg-brand-orange text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Annual <span className="text-brand-cyan text-[8px] font-bold">-20%</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Pricing cards grid */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative">
              
              {/* Card 1: Core */}
              <div className="bg-zinc-900/60 border border-zinc-800 p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition">
                <div className="space-y-4">
                  <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">CORE</h3>
                  <p className="text-zinc-500 text-xs min-h-[40px]">Essential telemetry and work order automation for single sites.</p>
                  <div className="flex items-baseline gap-1.5 pt-2">
                    <span className="text-4xl font-mono font-bold text-brand-cyan">
                      {billingCycle === 'annual' ? '$399' : '$499'}
                    </span>
                    <span className="text-zinc-500 text-[10px] font-mono">/mo</span>
                  </div>
                </div>

                {/* Features checklist */}
                <div className="space-y-3.5 text-xs font-sans text-zinc-300 border-t border-zinc-800/60 pt-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Up to 50,000 sq ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>100 Connected Assets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Standard Work Orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <span className="w-4 h-px bg-zinc-800 shrink-0" />
                    <span>Digital Twin Generation</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDemoForm({ ...demoForm, plan: 'Core' });
                    setDemoModalOpen(true);
                    setDemoStep(1);
                  }}
                  className="w-full py-3.5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 font-mono text-[10px] font-bold uppercase tracking-wider text-center transition"
                >
                  Deploy Core
                </button>
              </div>

              {/* Card 2: Advanced (Recommended Standard) */}
              <div className="bg-zinc-900 border-2 border-brand-orange p-8 flex flex-col justify-between space-y-6 relative hover:shadow-[0_0_25px_rgba(243,128,32,0.15)] transition">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-black px-4 py-1 rounded-sm font-mono text-[8px] uppercase tracking-widest font-bold">
                  Recommended Standard
                </span>

                <div className="space-y-4 pt-2">
                  <h3 className="font-mono text-xs font-bold text-zinc-100 uppercase tracking-widest">ADVANCED</h3>
                  <p className="text-zinc-400 text-xs min-h-[40px]">Predictive maintenance and multi-site orchestration with AI Copilot.</p>
                  <div className="flex items-baseline gap-1.5 pt-2">
                    <span className="text-4xl font-mono font-bold text-brand-orange">
                      {billingCycle === 'annual' ? '$799' : '$999'}
                    </span>
                    <span className="text-zinc-500 text-[10px] font-mono">/mo</span>
                  </div>
                </div>

                {/* Features checklist */}
                <div className="space-y-3.5 text-xs font-sans text-zinc-200 border-t border-zinc-800/60 pt-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>Up to 250,000 sq ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>Unlimited Connected Assets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>AI Predictive Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>Basic Digital Twin layout</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDemoForm({ ...demoForm, plan: 'Advanced' });
                    setDemoModalOpen(true);
                    setDemoStep(1);
                  }}
                  className="w-full py-3.5 bg-brand-orange hover:bg-[#e27010] text-black font-mono text-[10px] font-bold uppercase tracking-wider text-center transition shadow-lg"
                >
                  Deploy Advanced
                </button>
              </div>

              {/* Card 3: Enterprise */}
              <div className="bg-zinc-900/60 border border-zinc-800 p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition">
                <div className="space-y-4">
                  <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">ENTERPRISE</h3>
                  <p className="text-zinc-500 text-xs min-h-[40px]">Custom architecture for global portfolios and ISO cleanroom compliance.</p>
                  <div className="flex items-baseline gap-1.5 pt-2">
                    <span className="text-3xl font-mono font-bold text-zinc-100">Custom</span>
                  </div>
                </div>

                {/* Features checklist */}
                <div className="space-y-3.5 text-xs font-sans text-zinc-300 border-t border-zinc-800/60 pt-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Unlimited Area &amp; Assets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Full 3D LiDAR Digital Twin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Dedicated SRE Instance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>Custom SAP ERP Integrations</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDemoForm({ ...demoForm, plan: 'Enterprise' });
                    setDemoModalOpen(true);
                    setDemoStep(1);
                  }}
                  className="w-full py-3.5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 font-mono text-[10px] font-bold uppercase tracking-wider text-center transition"
                >
                  Contact Engineering
                </button>
              </div>

            </section>

          </div>
        )}

      </main>

      {/* Ticker Bottom Strip on Home/SRE screen */}
      <footer className="w-full bg-[#131313] border-t border-zinc-800/60 mt-16 py-12 font-sans">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-left">
              <div className="w-6 h-6 flex items-center justify-center relative">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                  <path d="M12 2v20" stroke="var(--brand-orange,_#f38020)" />
                  <path d="M7 6v16" stroke="var(--brand-cyan,_#00dbe7)" />
                  <path d="M17 6v16" stroke="var(--brand-cyan,_#00dbe7)" />
                  <path d="M3 10v12" stroke="var(--brand-cyan,_#00dbe7)" />
                  <path d="M21 10v12" stroke="var(--brand-cyan,_#00dbe7)" />
                  <path d="M12 2L7 6L3 10" stroke="var(--brand-orange,_#f38020)" />
                  <path d="M12 2L17 6L21 10" stroke="var(--brand-orange,_#f38020)" />
                  <path d="M3 22h18" stroke="var(--brand-orange,_#f38020)" />
                  <path d="M7 14l5-3l5 3" stroke="var(--brand-orange,_#f38020)" />
                  <path d="M7 18l5-3l5 3" stroke="var(--brand-orange,_#f38020)" />
                </svg>
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">
                BEECARBONAT
              </span>
            </button>
            <p className="text-zinc-500 text-[11px] leading-relaxed max-w-xs">
              The precision engineering standard for facility management. Empowering global infrastructure since 2024.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3 font-mono text-[10px] uppercase tracking-wider">
            <span className="text-zinc-500 font-bold block">Platform</span>
            <ul className="space-y-2 text-zinc-400">
              <li><button onClick={() => setActiveTab('solutions')} className="hover:text-brand-orange">Automation</button></li>
              <li><button onClick={() => setActiveTab('technology')} className="hover:text-brand-cyan">SRE Terminal</button></li>
              <li><button onClick={() => setActiveTab('case-studies')} className="hover:text-brand-orange">Digital Twins</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3 font-mono text-[10px] uppercase tracking-wider">
            <span className="text-zinc-500 font-bold block">Company</span>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-brand-orange">Our Story</a></li>
              <li><a href="#" className="hover:text-brand-cyan">Careers</a></li>
              <li><a href="#" className="hover:text-brand-orange">Press</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3 font-mono text-[10px] uppercase tracking-wider">
            <span className="text-zinc-500 font-bold block">Connect</span>
            <div className="flex gap-4 text-zinc-400">
              <button onClick={() => toast('Connected SRE Web Interface Active')} className="hover:text-brand-cyan" title="Network Topology">
                <Network className="w-4 h-4" />
              </button>
              <button onClick={() => toast('Security Matrix Enforced')} className="hover:text-brand-orange" title="Audit Shield">
                <Shield className="w-4 h-4" />
              </button>
              <a href="mailto:zatexsols@gmail.com" className="hover:text-brand-cyan" title="Email Support">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-zinc-500">
          <p>© 2026 BEECARBONAT. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-300">PRIVACY POLICY</a>
            <a href="#" className="hover:text-zinc-300">TERMS OF SERVICE</a>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* MODAL: LIVE WATCH SIMULATION SCREEN */}
      {/* ========================================================= */}
      {simulationActive && (
        <div className="fixed inset-0 z-50 bg-[#09090b]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-zinc-800 max-w-2xl w-full p-6 relative overflow-hidden space-y-6 shadow-2xl">
            
            {/* Close */}
            <button
              onClick={() => setSimulationActive(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 border border-transparent hover:border-zinc-800 p-1.5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                <h3 className="font-mono text-xs font-bold text-brand-cyan uppercase tracking-widest">Holographic Telemetry Simulation</h3>
              </div>
              <p className="text-zinc-400 text-xs font-sans">
                Real-time mapping of predictive analysis models. The system scans edge node vibrations to secure facility stability instantly.
              </p>
            </div>

            {/* Simulated Live scan screen */}
            <div className="bg-zinc-950 p-4 border border-zinc-850 font-mono text-[10px] text-zinc-400 space-y-3 h-56 overflow-y-auto scrollbar-hide">
              <div className="flex justify-between border-b border-zinc-900 pb-2 text-zinc-500">
                <span>EVENT NODE IDENTIFIER</span>
                <span>STATE</span>
                <span>STABILITY</span>
              </div>
              {liveTicker.map((tick, index) => (
                <div key={index} className="flex justify-between items-center text-[10px]">
                  <span className="truncate max-w-[280px] text-zinc-300 flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full ${tick.type === 'success' ? 'bg-green-400' : tick.type === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                    {tick.text}
                  </span>
                  <span className={`text-[9px] font-bold ${tick.type === 'success' ? 'text-green-400' : tick.type === 'warning' ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {tick.type.toUpperCase()}
                  </span>
                  <span className="text-zinc-500 font-semibold">{tick.time}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleAuditAction}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold uppercase border border-zinc-800"
              >
                Perform Manual Node Check
              </button>
              <button
                onClick={() => setSimulationActive(false)}
                className="px-5 py-2.5 bg-brand-orange hover:bg-[#e27010] text-black font-mono text-[10px] font-bold uppercase"
              >
                Close Stream
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DEMO REGISTRATION / PROVISIONING FLOW */}
      {/* ========================================================= */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090b]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-zinc-850 max-w-lg w-full p-6 relative overflow-hidden space-y-6 shadow-2xl">
            
            {/* Close */}
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 border border-transparent hover:border-zinc-800 p-1.5"
            >
              <X className="w-4 h-4" />
            </button>

            {/* STEP 1: FORM */}
            {demoStep === 1 && (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest">Request Facility Demo Workspace</h3>
                  <p className="text-zinc-500 text-xs font-sans">Provide your organization parameters to spin up a mock SRE dashboard immediately.</p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Dr. Aris Thorne"
                      value={demoForm.fullName}
                      onChange={(e) => setDemoForm({ ...demoForm, fullName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs font-mono rounded-sm outline-none focus:border-brand-orange text-zinc-200 placeholder-zinc-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">Company Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="E.g., thorne@biotech.org"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs font-mono rounded-sm outline-none focus:border-brand-orange text-zinc-200 placeholder-zinc-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">Organization / Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., BioTech Synthesis Ltd."
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs font-mono rounded-sm outline-none focus:border-brand-orange text-zinc-200 placeholder-zinc-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">Target Deployment Plan</label>
                    <select
                      value={demoForm.plan}
                      onChange={(e) => setDemoForm({ ...demoForm, plan: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs font-mono rounded-sm outline-none focus:border-brand-orange text-zinc-300"
                    >
                      <option value="Core">Core Plan - Single Site Telemetry</option>
                      <option value="Advanced">Advanced Plan - AI Preventive Suite</option>
                      <option value="Enterprise">Enterprise Plan - Complete Digital Twin</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(false)}
                    className="px-5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-mono text-[10px] font-bold uppercase rounded-sm transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-orange text-black font-mono text-[10px] font-bold uppercase rounded-sm hover:bg-[#e27010] transition"
                  >
                    Initialize Demo Setup
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PROVISIONING LOAD STATE ANIMATION */}
            {demoStep === 2 && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 font-mono text-xs">
                <RefreshCw className="w-10 h-10 text-brand-orange animate-spin" />
                <div className="space-y-2">
                  <p className="font-bold text-zinc-200 uppercase tracking-widest animate-pulse">PROVISIONING WORKSPACE CONTROLLER...</p>
                  <p className="text-zinc-500 text-[10px]">Spinning up Docker VM Node on Cloud Run... {Math.random().toString(16).substr(2, 4).toUpperCase()}</p>
                </div>
                <div className="bg-zinc-950 p-4 border border-zinc-850 text-left text-[10px] text-zinc-500 max-w-sm w-full space-y-1 font-mono">
                  <p className="text-brand-cyan">&gt; docker run --env PLAN={demoForm.plan} {demoForm.company.toLowerCase().replace(/\s+/g, '-')}</p>
                  <p>&gt; Initializing BIM shaders mapping level layouts...</p>
                  <p>&gt; Handshaking secure Firebase DB rules...</p>
                  <p>&gt; Deployment workspace initialized successfully.</p>
                </div>
              </div>
            )}

            {/* STEP 3: PROVISIONING SUCCESS SCREEN */}
            {demoStep === 3 && (
              <div className="py-6 text-center space-y-6">
                <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
                  <CheckCircle2 className="w-6 h-6 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wider">Workspace Live!</h4>
                  <p className="text-zinc-400 text-xs font-sans max-w-sm mx-auto leading-relaxed">
                    A secure trial instance for <strong className="text-brand-orange">{demoForm.company}</strong> has been provisioned. Access the live operator portal to manage assets and run diagnostics.
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 border border-zinc-850 text-left font-mono text-[10px] text-zinc-400 space-y-1.5 max-w-xs mx-auto">
                  <p><span className="text-zinc-500">Workspace ID:</span> {Math.random().toString(16).substr(2, 8).toUpperCase()}</p>
                  <p><span className="text-zinc-500">Plan Category:</span> {demoForm.plan}</p>
                  <p><span className="text-zinc-500">Operator Key:</span> <code className="text-brand-cyan">bee_live_ Thorne_prod</code></p>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDemoModalOpen(false);
                      navigate('/login');
                    }}
                    className="px-6 py-2.5 bg-brand-orange text-black font-mono text-[10px] font-bold uppercase rounded-sm hover:bg-[#e27010] transition"
                  >
                    Open Live Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(false)}
                    className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-mono text-[10px] uppercase rounded-sm transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
