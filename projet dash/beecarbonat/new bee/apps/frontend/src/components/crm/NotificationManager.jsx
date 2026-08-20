import { useEffect, useRef, useCallback } from 'react';
import { useSSE } from '../../hooks/useSSE';
import toast from 'react-hot-toast';
import { Trophy, AlertTriangle, UserPlus, TrendingUp, Package, BarChart2 } from 'lucide-react';
import { useCrmStore } from '../../store/crmStore';

// ── Sons (silencieux si fichier absent) ──────────────────────────────────────
const createAudio = (src) => {
  try {
    const a = new Audio(src);
    a.volume = 0.3;
    a.preload = 'none'; // charge à la demande
    return a;
  } catch { return null; }
};

const SOUNDS = {
  success: createAudio('/sounds/success.mp3'),
  alert:   createAudio('/sounds/alert.mp3'),
  ding:    createAudio('/sounds/ding.mp3'),
};

const playSound = (type) => {
  try { SOUNDS[type]?.play().catch(() => {}); } catch {}
};

// ── Config par type d'événement ───────────────────────────────────────────────
const EVENT_CONFIG = {
  deal_won: {
    Icon: Trophy, sound: 'success', duration: 6000,
    title: '🎉 Deal gagné !',
    format: (d) => `${d.name} — ${formatCurrency(d.amount)}`
  },
  critical_workorder: {
    Icon: AlertTriangle, sound: 'alert', duration: 8000,
    title: '🚨 Intervention critique',
    format: (d) => d.title || d.name || 'Alerte critique'
  },
  new_deal: {
    Icon: TrendingUp, sound: 'ding', duration: 4000,
    title: '📈 Nouveau deal',
    format: (d) => `${d.name}${d.amount ? ` — ${formatCurrency(d.amount)}` : ''}`
  },
  new_contact: {
    Icon: UserPlus, sound: 'ding', duration: 4000,
    title: '👤 Nouveau contact',
    format: (d) => d.name || 'Contact ajouté'
  },
  asset_alert: {
    Icon: Package, sound: 'alert', duration: 6000,
    title: '⚠️ Alerte actif',
    format: (d) => d.message || d.name || 'Anomalie détectée'
  },
  kpi_threshold: {
    Icon: BarChart2, sound: 'alert', duration: 5000,
    title: '📊 Seuil KPI atteint',
    format: (d) => d.message || `${d.kpi}: ${d.value}`
  },
};

const formatCurrency = (amount) =>
  Number(amount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

// ── Toast personnalisé ────────────────────────────────────────────────────────
const CustomToast = ({ t, config, message }) => {
  const { Icon } = config;
  return (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'}
        max-w-sm w-full bg-zinc-900/95 backdrop-blur border border-zinc-700
        rounded-xl shadow-2xl flex items-start gap-3 p-4 pointer-events-auto`}
    >
      <div className="shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-50 font-mono">{config.title}</p>
        <p className="text-xs text-zinc-400 mt-0.5 truncate">{message}</p>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="shrink-0 text-zinc-600 hover:text-zinc-300 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
export default function NotificationManager() {
  const lastNotif   = useRef({});
  const fetchDashboard = useCrmStore(s => s.fetchDashboard);
  const fetchDeals     = useCrmStore(s => s.fetchDeals);
  const fetchContacts  = useCrmStore(s => s.fetchContacts);

  // Anti-spam: 1 notif par type toutes les 4s
  const canNotify = (type) => {
    const now = Date.now();
    if (now - (lastNotif.current[type] || 0) < 4000) return false;
    lastNotif.current[type] = now;
    return true;
  };

  const handleEvent = useCallback(({ type, data }) => {
    if (!canNotify(type)) return;
    const config = EVENT_CONFIG[type];
    if (!config) return;

    const message = config.format(data);
    playSound(config.sound);

    toast.custom(
      (t) => <CustomToast t={t} config={config} message={message} />,
      { duration: config.duration, position: 'top-right' }
    );

    // Refresh stores concernés
    if (['deal_won', 'new_deal'].includes(type)) fetchDeals?.();
    if (type === 'new_contact') fetchContacts?.();
    if (['deal_won', 'kpi_threshold'].includes(type)) fetchDashboard?.();
  }, [fetchDashboard, fetchDeals, fetchContacts]);

  const { connected } = useSSE(handleEvent);

  // Log debug
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[NotificationManager] SSE:', connected ? '✅ connected' : '🔴 disconnected');
    }
  }, [connected]);

  return null;
}
