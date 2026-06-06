import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, X, Zap } from 'lucide-react';
import { useStore, ToastNotif } from '../../store/useStore';
import { useNotifications } from '../../hooks/useNotifications';

function ToastItem({ toast }: { toast: ToastNotif }) {
  const removeToast = useStore((s) => s.removeToast);

  // Auto-dismiss after 5 seconds (errors stay 8s)
  useEffect(() => {
    const delay = toast.level === 'error' ? 8000 : 5000;
    const t = setTimeout(() => removeToast(toast.id), delay);
    return () => clearTimeout(t);
  }, [toast.id, toast.level, removeToast]);

  // Haptic feedback on mobile (Vibration API)
  useEffect(() => {
    if (!('vibrate' in navigator)) return;
    if (toast.level === 'error') {
      navigator.vibrate([100, 50, 100]); // double pulse for critical
    } else if (toast.level === 'warn') {
      navigator.vibrate(60); // single short buzz for warning
    }
  }, [toast.id, toast.level]); // run once per new toast


  const config = {
    error: {
      icon: <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />,
      bg: 'bg-red-950/95 border-red-500/60',
      text: 'text-red-300',
      title: '🚨 ALERTE CRITIQUE',
    },
    warn: {
      icon: <Zap className="w-4 h-4 shrink-0 mt-0.5" />,
      bg: 'bg-amber-950/95 border-amber-500/50',
      text: 'text-amber-300',
      title: '⚠️ AVERTISSEMENT',
    },
    success: {
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />,
      bg: 'bg-emerald-950/95 border-emerald-500/50',
      text: 'text-emerald-300',
      title: '✅ OPÉRATION RÉUSSIE',
    },
    info: {
      icon: <Info className="w-4 h-4 shrink-0 mt-0.5" />,
      bg: 'bg-slate-900/95 border-slate-600/50',
      text: 'text-slate-300',
      title: 'ℹ️ INFO SYSTÈME',
    },
  }[toast.level];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`relative flex items-start gap-3 p-3 rounded-md border backdrop-blur-sm shadow-2xl max-w-sm font-mono text-xs ${config.bg} ${config.text}`}
    >
      {/* Glowing left accent bar */}
      <div
        className={`absolute left-0 top-0 h-full w-0.5 rounded-l-md ${
          toast.level === 'error' ? 'bg-red-400' :
          toast.level === 'warn' ? 'bg-amber-400' :
          toast.level === 'success' ? 'bg-emerald-400' : 'bg-slate-400'
        }`}
      />

      {config.icon}

      <div className="flex-1 min-w-0">
        <p className="font-bold text-[10px] uppercase tracking-wider text-white mb-0.5">
          {config.title}
        </p>
        <p className="leading-relaxed text-[11px] break-words">
          {toast.message.length > 100 ? `${toast.message.slice(0, 100)}…` : toast.message}
        </p>
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-slate-500 hover:text-white transition cursor-pointer mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar auto-dismiss indicator */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 rounded-b-md ${
          toast.level === 'error' ? 'bg-red-400' :
          toast.level === 'warn' ? 'bg-amber-400' :
          toast.level === 'success' ? 'bg-emerald-400' : 'bg-slate-400'
        }`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: toast.level === 'error' ? 8 : 5, ease: 'linear' }}
      />
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useStore((s) => s.toasts);

  // Mount the notifications watcher here
  useNotifications();

  return (
    <div className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
