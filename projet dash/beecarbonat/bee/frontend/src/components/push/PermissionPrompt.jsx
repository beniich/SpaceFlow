import { useState } from 'react';
import { Bell, ShieldCheck, X } from 'lucide-react';
import { requestPushPermission } from '../../services/push.service';

export default function PermissionPrompt() {
  const [closed, setClosed] = useState(false);
  const [status, setStatus] = useState(null);

  if (closed || Notification.permission === 'granted') return null;

  const handleEnable = async () => {
    try {
      await requestPushPermission();
      setStatus('Notifications activées avec succès !');
      setTimeout(() => setClosed(true), 2000);
    } catch (err) {
      setStatus('Erreur ou refus de la permission push');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-4 rounded-xl shadow-lg border border-indigo-700/50 flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Bell className="w-6 h-6 text-white animate-bounce" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Activer les Notifications Push en temps réel</h4>
          <p className="text-xs text-indigo-200">
            Recevez immédiatement les alerte capteurs, ruptures de stock et nouveaux ordres de travail.
          </p>
          {status && <p className="text-xs font-semibold text-emerald-400 mt-1">{status}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleEnable}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs rounded-lg transition shadow"
        >
          Activer Web Push
        </button>
        <button
          onClick={() => setClosed(true)}
          className="p-2 text-indigo-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
