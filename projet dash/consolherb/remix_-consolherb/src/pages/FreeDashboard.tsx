import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Thermometer, Droplets, AlertTriangle, Wifi,
  ArrowRight, Lock, Zap, Clock, TrendingUp
} from 'lucide-react';
import { useStore } from '../store/useStore';

const LOCKED_SECTIONS = [
  { label: 'Vision IA', desc: 'Diagnostic visuel des cultures', route: '/vision' },
  { label: 'Finance ROI', desc: 'Calcul de rentabilité', route: '/finance' },
  { label: 'Agro-Brain', desc: 'Assistant IA contextuel', route: '/agro-brain' },
  { label: 'Traçabilité', desc: 'Blockchain de registre', route: '/traceability' },
  { label: 'Équipe', desc: 'Gestion multi-utilisateurs', route: '/team' },
  { label: 'Rapports', desc: 'Envois email hebdomadaires', route: '/reports' },
];

export default function FreeDashboard() {
  const navigate = useNavigate();
  const { subscription } = useStore();
  const { tokensUsed, tokensLimit, trialDaysLeft } = subscription;
  const tokenPct = (tokensUsed / tokensLimit) * 100;

  const metrics = [
    { label: 'Température', value: '24.5°C', icon: Thermometer, color: '#f97316', sub: 'Serre principale' },
    { label: 'Humidité sol', value: '68%', icon: Droplets, color: '#38bdf8', sub: 'Parcelle A' },
    { label: 'Alertes actives', value: '2', icon: AlertTriangle, color: '#ef4444', sub: 'Capteurs critiques' },
    { label: 'Capteurs en ligne', value: '7/8', icon: Wifi, color: '#4de082', sub: '87% opérationnels' },
  ];

  return (
    <div className="space-y-6">
      {/* Trial Badge */}
      {trialDaysLeft > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl px-5 py-3"
        >
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-amber-400" />
            <span className="text-amber-300 font-semibold text-sm">
              Essai gratuit — <span className="font-bold text-amber-400">{trialDaysLeft} jours restants</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/upgrade')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-xl transition-all"
          >
            <Zap size={13} /> Passer à PRO
          </button>
        </motion.div>
      )}

      {/* 4 Essential Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#0d1c2d] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${m.color}20`, border: `1px solid ${m.color}30` }}
                >
                  <Icon size={20} style={{ color: m.color }} />
                </div>
                <TrendingUp size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
              </div>
              <p className="text-2xl font-black text-white mb-1">{m.value}</p>
              <p className="text-xs font-semibold text-slate-400">{m.label}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{m.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Token Usage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#0d1c2d] border border-white/10 rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-300">Tokens IA utilisés ce mois</span>
          <span className="text-xs text-slate-500">{tokensUsed} / {tokensLimit}</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(tokenPct, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${tokenPct >= 90 ? 'bg-red-500' : tokenPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          {Math.max(0, tokensLimit - tokensUsed)} tokens restants — Réinitialisation le 1er du mois prochain.
        </p>
      </motion.div>

      {/* Locked Sections Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          Fonctionnalités disponibles avec <span className="text-amber-400">PRO / ELITE</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {LOCKED_SECTIONS.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              onClick={() => navigate('/upgrade')}
              className="relative bg-[#0d1c2d] border border-white/10 rounded-2xl p-4 text-left hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <Lock size={16} className="text-slate-600 group-hover:text-amber-400 transition-colors" />
                <ArrowRight size={14} className="text-slate-700 group-hover:text-amber-400 transition-colors" />
              </div>
              <p className="font-bold text-slate-400 group-hover:text-slate-200 text-sm transition-colors">{s.label}</p>
              <p className="text-[11px] text-slate-600">{s.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="sticky bottom-4 bg-gradient-to-r from-[#c25a3d] via-[#e2725b] to-[#f97316] rounded-2xl p-5 flex items-center justify-between shadow-2xl shadow-orange-500/20"
      >
        <div>
          <p className="font-black text-white text-base">🚀 Passez à PRO maintenant</p>
          <p className="text-white/70 text-xs mt-0.5">Débloquez Vision IA, Finance ROI, 5 000 tokens/mois et 10 utilisateurs.</p>
        </div>
        <button
          onClick={() => navigate('/upgrade')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 font-black text-sm rounded-xl shadow-lg hover:scale-105 transition-all whitespace-nowrap"
        >
          Voir les plans <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
