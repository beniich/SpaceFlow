import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { subscribeToPush, isPushSupported } from '../services/push-notifications';
import api from '../services/api';
import toast from 'react-hot-toast';

export function NotificationPermissionPrompt() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPushSupported()) return;
    if (Notification.permission !== 'default') return;
    
    const dismissed = localStorage.getItem('push-prompt-dismissed');
    if (dismissed) return;
    
    const timer = setTimeout(() => setShow(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      const subscription = await subscribeToPush();
      if (subscription) {
        await api.post('/push/subscribe', subscription);
        toast.success('🔔 Notifications activées !');
      } else {
        toast.error('Impossible d\'activer les notifications');
      }
    } catch (err) {
      toast.error('Erreur lors de l\'activation');
    } finally {
      setLoading(false);
      setShow(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push-prompt-dismissed', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Activer les notifications</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Recevez des alertes même quand l'app est fermée
              </p>
            </div>
          </div>

          <div className="space-y-1 mb-4 text-xs text-slate-600">
            <p>✓ Nouvelles réservations</p>
            <p>✓ Check-in et confirmations</p>
            <p>✓ Alertes importantes</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Plus tard
            </button>
            <button
              onClick={handleEnable}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white rounded-lg text-sm py-2 hover:bg-indigo-700 transition"
            >
              Activer
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
