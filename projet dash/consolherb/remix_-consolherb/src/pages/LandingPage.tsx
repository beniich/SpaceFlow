import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Bell, Shield, TrendingUp, Cpu, Brain,
  CheckCircle, ArrowRight, Star, Leaf, Activity,
  ChevronRight, Play, Users, BarChart3, Globe,
  Zap, Lock, RefreshCw, AlertCircle, Clock
} from 'lucide-react';

/* ─── Animated counter hook ─── */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Mini circular progress ─── */
function CircleProgress({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={5} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={5} strokeLinecap="round"
        strokeDasharray={`${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
    </svg>
  );
}

/* ─── Dashboard Mockup (faithful to the screenshot) ─── */
function DashboardMockup() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const alerts = [
    { icon: AlertCircle, color: 'text-red-500 bg-red-50', title: 'Alert: Cow #452B', sub: 'Elevated Temp. – Request Check', time: '10:15 AM' },
    { icon: Bell, color: 'text-amber-500 bg-amber-50', title: 'Vaccination Reminder', sub: 'Poultry Coop #3 – Due Tomorrow', time: 'Yesterday' },
    { icon: Shield, color: 'text-green-500 bg-green-50', title: 'Health Status Update', sub: 'Herd B – Stable', time: 'Yesterday' },
  ];
  const animals = [
    { img: '🐄', name: 'Cow #452B', breed: 'Holstein', score: 88, sub: 'Last Checkup – Jan 17, 2024', color: '#c25a3d' },
    { img: '🐔', name: 'Chicken #11A', breed: 'Leghorn', score: 95, sub: 'Egg production – 17 eggs', color: '#16a34a' },
    { img: '🐂', name: 'Bull #88C', breed: 'Angus', score: 92, sub: 'Weight gain – 2316 min', color: '#2563eb' },
  ];

  return (
    <div className="bg-[#f5f0e8] rounded-2xl shadow-2xl overflow-hidden border border-stone-200 select-none text-[#1c1c1c]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#c25a3d] flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-bold text-[15px]">Agro<span className="text-[#c25a3d]">Maître</span></span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          {['Dashboard','Livestock','Health Records','Traceability','Reports'].map((tab, i) => (
            <span key={tab} className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${i === 0 ? 'bg-[#c25a3d] text-white' : 'text-stone-500 hover:text-stone-800'}`}>{tab}</span>
          ))}
        </div>
        <div className="w-7 h-7 rounded-full bg-stone-300 flex items-center justify-center text-[11px] font-bold text-stone-600">AB</div>
      </div>

      {/* Title */}
      <div className="px-5 py-3 bg-[#f5f0e8]">
        <h2 className="text-[15px] font-bold text-stone-800">Livestock Health &amp; Traceability Hub</h2>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-5 gap-3 px-4 pb-4">
        {/* Map card */}
        <div className="col-span-3 bg-white rounded-xl p-3 shadow-sm border border-stone-100">
          <p className="text-[11px] font-semibold text-stone-700 mb-2 flex items-center gap-1"><MapPin size={11} className="text-[#c25a3d]" /> Real-Time Location Tracking</p>
          {/* Map placeholder */}
          <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-green-200 via-green-300 to-emerald-400 mb-3">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 10px,rgba(0,0,0,.05) 10px,rgba(0,0,0,.05) 11px),repeating-linear-gradient(90deg,transparent,transparent 10px,rgba(0,0,0,.05) 10px,rgba(0,0,0,.05) 11px)' }} />
            {/* Pins */}
            {[{ x: 28, y: 45, e: '🐄' }, { x: 42, y: 30, e: '🐄' }, { x: 35, y: 55, e: '🐄' }, { x: 58, y: 48, e: '🐔' }, { x: 65, y: 38, e: '🐔' }, { x: 72, y: 55, e: '🐔' }, { x: 48, y: 62, e: '🐔' }].map((p, i) => (
              <motion.span key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontSize: 14 }}
                animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: i * 0.2 }}>
                {p.e}
              </motion.span>
            ))}
            <div className="absolute top-1 left-1 flex gap-1 text-[8px] bg-white/80 px-1.5 py-0.5 rounded-full">
              <span>🐄 Cattle</span><span>🐔 Poultry</span>
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />Active</span>
            </div>
          </div>
          {/* Feeding schedules */}
          <div className="flex gap-3">
            {[{ label: 'Cattle Feeding', pct: 75, color: '#c25a3d', next: '2:00 PM' }, { label: 'Poultry Feeding', pct: 90, color: '#16a34a', next: '3:30 PM' }].map(s => (
              <div key={s.label} className="flex-1 flex items-center gap-2">
                <div className="relative">
                  <CircleProgress pct={s.pct} color={s.color} size={40} />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div>
                  <p className="text-[9px] font-semibold text-stone-700">{s.label}</p>
                  <p className="text-[8px] text-stone-500">{s.pct}% Complete</p>
                  <p className="text-[8px] text-stone-400">Next: {s.next}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="col-span-2 bg-white rounded-xl p-3 shadow-sm border border-stone-100">
          <p className="text-[11px] font-semibold text-stone-700 mb-2 flex items-center gap-1"><Bell size={11} className="text-amber-500" /> Veterinary Alert Feed</p>
          <div className="flex flex-col gap-2">
            {alerts.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div key={i} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-stone-50 transition-colors"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <div className={`w-5 h-5 rounded-full ${a.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={10} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold text-stone-700 truncate">{a.title}</p>
                    <p className="text-[8px] text-stone-400 truncate">{a.sub}</p>
                  </div>
                  <span className="text-[7px] text-stone-400 flex-shrink-0">{a.time}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animal profiles */}
      <div className="px-4 pb-4">
        <p className="text-[11px] font-bold text-stone-700 mb-2">Individual Animal Health Profiles</p>
        <div className="grid grid-cols-3 gap-3">
          {animals.map((a, i) => (
            <motion.div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-stone-100 flex items-center gap-2"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-xl flex-shrink-0">{a.img}</div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-stone-700 truncate">{a.name} – {a.breed}</p>
                <p className="text-[11px] font-black" style={{ color: a.color }}>{a.score}<span className="text-[8px] text-stone-400 font-normal">/100</span></p>
                <p className="text-[7px] text-stone-400 truncate">{a.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-stone-200 bg-white text-[9px] text-stone-400">
        <span>AgroMaître © 2024</span>
        <div className="flex gap-3">
          <span className="cursor-pointer hover:text-stone-600">Privacy Policy</span>
          <span className="cursor-pointer hover:text-stone-600">Terms of Service</span>
          <span className="w-4 h-4 rounded-full bg-[#c25a3d] inline-flex items-center justify-center text-white font-bold text-[6px]">AM</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat card ─── */
function StatCard({ value, suffix, label, icon: Icon, color }: { value: number; suffix: string; label: string; icon: any; color: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, 2000, inView);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="flex flex-col items-center gap-1 p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1`} style={{ background: `${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <p className="text-3xl font-black text-white">{count.toLocaleString()}{suffix}</p>
      <p className="text-sm text-stone-400 text-center">{label}</p>
    </motion.div>
  );
}

/* ─── Feature card ─── */
function FeatureCard({ icon: Icon, color, title, desc, delay }: { icon: any; color: string; title: string; desc: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${color}25` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: MapPin,     color: '#c25a3d', title: 'Localisation en Temps Réel',  desc: 'Suivez chaque animal sur votre exploitation avec une précision GPS. Détectez les sorties de zone et les comportements anormaux instantanément.', delay: 0 },
    { icon: Activity,   color: '#16a34a', title: 'Santé & Diagnostics IA',       desc: "Notre moteur d'intelligence artificielle analyse les indicateurs vitaux et vous alerte avant qu'une maladie ne se propage dans votre troupeau.", delay: 0.1 },
    { icon: Shield,     color: '#2563eb', title: 'Traçabilité Blockchain',        desc: 'Chaque lot, chaque traitement, chaque transfert est ancré dans un registre immuable. Conformité totale aux normes européennes.', delay: 0.2 },
    { icon: TrendingUp, color: '#d97706', title: 'Finance & ROI Engine',          desc: 'Calculez la rentabilité réelle par animal, par zone, par saison. Des décisions basées sur des données, pas sur des intuitions.', delay: 0.3 },
    { icon: Brain,      color: '#7c3aed', title: 'Agro‑Brain (RAG AI)',           desc: "Posez vos questions en langage naturel. L'assistant contextuel connaît vos données et génère des recommandations actionnables.", delay: 0.4 },
    { icon: Globe,      color: '#0891b2', title: 'Irrigation & Capteurs IoT',     desc: 'Pilotage automatique de vos systèmes d\'irrigation basé sur l\'humidité du sol, la météo et les cycles de vos cultures.', delay: 0.5 },
  ];

  const testimonials = [
    { name: 'Mohammed A.', role: 'Éleveur bovin, Maroc',       stars: 5, text: "AgroMaître a réduit notre mortalité animale de 40% en six mois. L'alerte précoce de maladies est révolutionnaire." },
    { name: 'Fatima B.',   role: 'Directrice, Ferme Bio Rabat', stars: 5, text: "La traçabilité blockchain nous a permis d'accéder aux marchés européens. Notre chiffre d'affaires a doublé en un an." },
    { name: 'Youssef K.',  role: 'Agronome, Souss‑Massa',      stars: 5, text: "L'IA de diagnostic visuel détecte les maladies foliaires bien avant que l'œil humain ne les perçoive. Incroyable précision." },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Floating Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-6 py-3 rounded-2xl transition-all duration-300 ${scrolled ? 'bg-[#0a0f0a]/90 border border-white/20 shadow-2xl backdrop-blur-xl' : 'bg-white/5 border border-white/10 backdrop-blur-md'}`}
        style={{ width: 'calc(100% - 48px)', maxWidth: 1100 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c25a3d] to-[#e2725b] flex items-center justify-center shadow-lg shadow-[#c25a3d]/30">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">Agro<span className="text-[#c25a3d]">Maître</span></span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-400 flex-1 justify-center">
          {['Fonctionnalités','Tarifs','Clients','À propos'].map(l => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="hidden sm:block text-sm font-medium text-stone-400 hover:text-white transition-colors">
            Se connecter
          </button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/portails')}
            className="flex items-center gap-2 px-4 py-2 bg-[#c25a3d] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c25a3d]/30 hover:bg-[#e2725b] transition-colors">
            Essai Gratuit <ArrowRight size={14} />
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#c25a3d]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#16a34a]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1e293b]/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex items-center gap-2 px-4 py-2 bg-[#c25a3d]/15 border border-[#c25a3d]/30 rounded-full text-sm font-medium text-[#e2725b] mb-8">
          <Zap size={14} className="text-[#c25a3d]" />
          Nouveau — Vision IA & Traçabilité Blockchain disponibles
          <ChevronRight size={14} />
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
          className="text-center text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 max-w-4xl">
          L'agriculture intelligente,{' '}
          <span className="bg-gradient-to-r from-[#c25a3d] via-[#e2725b] to-[#f97316] bg-clip-text text-transparent">
            sans compromis
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }}
          className="text-center text-lg md:text-xl text-stone-400 max-w-2xl mb-10 leading-relaxed">
          AgroMaître est la plateforme ERP agricole tout-en-un qui centralise le suivi des animaux, la santé des cultures, la traçabilité et la rentabilité — alimentée par l'IA.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(194,90,61,0.4)' }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/portails')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#c25a3d] to-[#e2725b] text-white text-base font-bold rounded-2xl shadow-xl shadow-[#c25a3d]/25 transition-all">
            Démarrer maintenant — Gratuit
            <ArrowRight size={18} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setVideoPlaying(true)}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/15 text-white text-base font-semibold rounded-2xl hover:bg-white/10 transition-all">
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
              <Play size={12} className="ml-0.5" />
            </div>
            Voir la démo
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500 mb-14">
          {[
            { icon: CheckCircle, text: 'SOC 2 Certifié', color: '#16a34a' },
            { icon: Lock,        text: 'RGPD Conforme',  color: '#2563eb' },
            { icon: RefreshCw,   text: '99.9% Uptime',   color: '#d97706' },
            { icon: Users,       text: '+2 400 Éleveurs', color: '#c25a3d' },
          ].map(b => {
            const Icon = b.icon;
            return (
              <div key={b.text} className="flex items-center gap-2">
                <Icon size={15} style={{ color: b.color }} />
                <span>{b.text}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl relative"
        >
          {/* Glow behind mockup */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#c25a3d]/20 via-transparent to-[#16a34a]/20 rounded-3xl blur-xl" />
          <div className="relative rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-white/10">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="flex-1 mx-4 px-3 py-1 bg-white/5 rounded-md text-[11px] text-stone-400 font-mono">
                app.agromatre.com/dashboard
              </div>
              <div className="flex items-center gap-1 text-[10px] text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />LIVE
              </div>
            </div>
            <DashboardMockup />
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/10">
          <StatCard value={2400}  suffix="+"  label="Éleveurs actifs"          icon={Users}    color="#c25a3d" />
          <StatCard value={98}    suffix="%"  label="Taux de satisfaction"     icon={Star}     color="#d97706" />
          <StatCard value={40}    suffix="%"  label="Réduction mortalité"      icon={Activity} color="#16a34a" />
          <StatCard value={120}   suffix="K+" label="Animaux suivis"           icon={BarChart3} color="#2563eb" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <p className="text-[#c25a3d] text-sm font-bold uppercase tracking-widest mb-4">Fonctionnalités</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Tout ce dont vous avez besoin,{' '}
              <span className="text-stone-400">dans un seul outil</span>
            </h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">
              De la parcelle au bilan financier, AgroMaître couvre l'intégralité de votre exploitation agricole.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <p className="text-[#c25a3d] text-sm font-bold uppercase tracking-widest mb-4">Comment ça marche</p>
            <h2 className="text-4xl font-black tracking-tight">Opérationnel en 3 étapes</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Cpu,       title: 'Connectez vos capteurs',   desc: 'Branchez vos capteurs IoT, balises GPS et équipements. Notre plateforme détecte tout automatiquement.' },
              { step: '02', icon: Brain,     title: 'L\'IA apprend vos données', desc: "En 48h, l'algorithme établit les baselines de votre exploitation et commence à générer des alertes personnalisées." },
              { step: '03', icon: TrendingUp, title: 'Pilotez & optimisez',      desc: 'Accédez à votre Command Center depuis n\'importe quel appareil. Prenez les bonnes décisions, au bon moment.' },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#c25a3d]/40 transition-all group">
                <div className="text-6xl font-black text-white/5 group-hover:text-[#c25a3d]/20 transition-all leading-none mb-4">{s.step}</div>
                <div className="w-12 h-12 rounded-xl bg-[#c25a3d]/20 flex items-center justify-center mb-4">
                  <s.icon size={22} className="text-[#c25a3d]" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{s.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <p className="text-[#c25a3d] text-sm font-bold uppercase tracking-widest mb-4">Témoignages</p>
            <h2 className="text-4xl font-black tracking-tight">Ils transforment leur exploitation</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={14} className="text-[#d97706] fill-[#d97706]" />
                  ))}
                </div>
                <p className="text-stone-300 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c25a3d] to-[#e2725b] flex items-center justify-center text-xs font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-stone-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #1a0e0a 0%, #2d1208 50%, #1a0e0a 100%)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#c25a3d]/20 to-[#16a34a]/10" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#c25a3d]/20 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <p className="text-[#e2725b] text-sm font-bold uppercase tracking-widest mb-4">Commencez aujourd'hui</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Rejoignez 2 400+ agriculteurs<br className="hidden md:block" /> qui font confiance à AgroMaître
            </h2>
            <p className="text-stone-400 text-lg mb-10 max-w-2xl mx-auto">
              14 jours d'essai gratuit. Aucune carte bancaire requise. Configuration en moins de 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(194,90,61,0.5)' }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/portails')}
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#c25a3d] to-[#e2725b] text-white text-lg font-black rounded-2xl shadow-xl">
                Démarrer l'essai gratuit <ArrowRight size={20} />
              </motion.button>
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-8 py-4 text-stone-300 hover:text-white text-base font-semibold transition-colors">
                <Clock size={18} /> Voir la démo live
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c25a3d] to-[#e2725b] flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-black text-xl">Agro<span className="text-[#c25a3d]">Maître</span></span>
          </div>
          <div className="flex gap-6 text-sm text-stone-500">
            {['Confidentialité','Conditions d\'utilisation','Contact','Blog'].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-stone-600 text-sm">© 2026 AgroMaître. Tous droits réservés.</p>
        </div>
      </footer>

      {/* ── Video Modal ── */}
      <AnimatePresence>
        {videoPlaying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setVideoPlaying(false)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#0f172a] rounded-2xl overflow-hidden w-full max-w-3xl border border-white/20 shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <span className="font-bold text-white">Démo AgroMaître – 2 min</span>
                <button onClick={() => setVideoPlaying(false)} className="text-stone-400 hover:text-white text-xl font-bold">✕</button>
              </div>
              <div className="aspect-video bg-[#051424] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#c25a3d]/20 flex items-center justify-center mx-auto mb-4">
                    <Play size={32} className="text-[#c25a3d] ml-1" />
                  </div>
                  <p className="text-stone-400">Cliquez sur "Démarrer maintenant" pour accéder à l'application complète</p>
                  <button onClick={() => { setVideoPlaying(false); navigate('/portails'); }}
                    className="mt-6 px-6 py-3 bg-[#c25a3d] text-white font-bold rounded-xl hover:bg-[#e2725b] transition-colors">
                    Accéder à la plateforme →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
