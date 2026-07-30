import { useEffect, useState } from 'react';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  Bell, Check, CheckCheck, Trash2, ShieldAlert, Wrench, Package, Info, RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const NOTIF_CONFIG = {
  ASSET: { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' },
  WORK_ORDER: { icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200' },
  INVENTORY: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
  TEST: { icon: Bell, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200' },
  INFO: { icon: Info, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD
  const { socket, connected } = useSocket();

  const loadNotifications = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications || []);
    } catch (err) {
      toast.error('Erreur de chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for personal notifications
    const onNotification = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      toast.success(notif.title, { icon: '🔔' });
    };

    // Replace 'user-id-here' with actual user ID from store if available
    // For demo, we just listen to a generic broadcast or global
    socket.on('notification:broadcast', onNotification);
    socket.on('notification:global', onNotification);

    return () => {
      socket.off('notification:broadcast', onNotification);
      socket.off('notification:global', onNotification);
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/all/read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('Tout marqué comme lu');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const sendTestNotif = async () => {
    try {
      await api.post('/notifications/test');
    } catch (err) {
      toast.error('Erreur d\'envoi');
    }
  };

  const filteredNotifs = notifications.filter(n => filter === 'ALL' || !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-600" />
            Centre de notifications
          </h1>
          <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
            <span className={clsx('w-2 h-2 rounded-full', connected ? 'bg-green-500 animate-pulse' : 'bg-red-500')} />
            {connected ? 'Connecté au flux temps réel' : 'Déconnecté'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={sendTestNotif}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
          >
            Tester
          </button>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={clsx(
                'px-4 py-1.5 rounded-full text-sm font-medium transition',
                filter === 'ALL' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              )}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('UNREAD')}
              className={clsx(
                'px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-2',
                filter === 'UNREAD' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              )}
            >
              Non lues
              {unreadCount > 0 && (
                <span className={clsx(
                  'px-1.5 py-0.5 rounded-full text-xs',
                  filter === 'UNREAD' ? 'bg-white/20' : 'bg-primary-100 text-primary-700'
                )}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <button onClick={() => loadNotifications(false)} className="text-slate-400 hover:text-slate-600">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>Aucune notification {filter === 'UNREAD' ? 'non lue' : ''}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredNotifs.map(notif => {
              const conf = NOTIF_CONFIG[notif.type] || NOTIF_CONFIG.INFO;
              const Icon = conf.icon;
              return (
                <div
                  key={notif.id}
                  className={clsx(
                    'p-4 flex items-start gap-4 transition hover:bg-slate-50',
                    !notif.read ? 'bg-blue-50/30' : ''
                  )}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${conf.bg} ${conf.border}`}>
                    <Icon className={`w-5 h-5 ${conf.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={clsx('text-sm font-medium truncate', !notif.read ? 'text-slate-900' : 'text-slate-700')}>
                        {notif.title}
                      </p>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{notif.body}</p>
                    
                    {notif.priority === 'URGENT' && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        URGENT
                      </span>
                    )}
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-full transition"
                      title="Marquer comme lu"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
