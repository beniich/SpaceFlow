import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X } from 'lucide-react';
import { useState } from 'react';

export default function PWAInstallPrompt() {
  const { isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(
    localStorage.getItem('pwa-prompt-dismissed') === 'true'
  );

  if (!isInstallable || dismissed) return null;

  const handleInstall = async () => {
    const success = await install();
    if (success) setDismissed(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-[#18181b]/80 backdrop-blur-md rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-zinc-800 p-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-white">Installer BEECARBONAT Dashboard</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Accédez rapidement à vos données depuis votre écran d'accueil
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-indigo-600 text-white text-xs py-2 rounded-lg hover:bg-indigo-500 transition-colors shadow-[0_0_10px_rgba(99,102,241,0.3)]"
            >
              Installer
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-zinc-500 hover:text-zinc-300">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
