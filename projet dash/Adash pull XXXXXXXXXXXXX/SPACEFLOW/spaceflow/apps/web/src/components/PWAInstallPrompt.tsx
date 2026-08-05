import { useState, useEffect } from 'react';
import { X, Download, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAInstallPrompt() {
  const { isInstallable, install, isOnline } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
      const timer = setTimeout(() => setShowOffline(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {/* Install prompt */}
      {isInstallable && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50"
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Installer SpaceFlow</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Accès rapide depuis votre écran d'accueil
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDismissed(true)}
              className="flex-1 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Plus tard
            </button>
            <button
              onClick={install}
              className="flex-1 bg-indigo-600 text-white rounded-lg text-sm py-2 hover:bg-indigo-700 transition"
            >
              Installer
            </button>
          </div>
        </motion.div>
      )}

      {/* Offline indicator */}
      {showOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 z-50"
        >
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">
            Mode hors ligne · Vos modifications seront synchronisées
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
