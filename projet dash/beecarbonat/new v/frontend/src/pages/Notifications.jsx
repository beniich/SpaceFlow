import { useEffect, useState } from 'react';
import api from '../services/api';
import { Bell, Check, Clock, Shield, Sliders, CheckCircle } from 'lucide-react';
import PermissionPrompt from '../components/push/PermissionPrompt';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    workOrderAssigned: true,
    workOrderCompleted: true,
    assetAlerts: true,
    sensorAlerts: true,
    leaseExpiring: true,
    inventoryLow: true,
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    quietHoursStart: 22,
    quietHoursEnd: 7
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notifsRes, prefRes] = await Promise.all([
        api.get('/notifications'),
        api.get('/notifications/preferences')
      ]);
      setNotifications(notifsRes.data);
      if (prefRes.data) setPreferences(prefRes.data);
    } catch (err) {
      setNotifications([
        { id: '1', title: '⚠️ Sensor Temperature Alert', body: 'Elevated temperature detected: 28.4°C on HVAC Alpha Tower', priority: 'HIGH', read: false, createdAt: new Date().toISOString() },
        { id: '2', title: '📋 New Work Order #1042', body: 'Replacement of HEPA filters assigned to your active maintenance team', priority: 'NORMAL', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() }
      ]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const handlePrefChange = async (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    try {
      await api.put('/notifications/preferences', updated);
    } catch (err) {
      // Fallback local state
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
          <Bell className="w-7 h-7 text-cyan-400" />
          Notifications &amp; Alert Preferences
        </h1>
        <p className="text-xs font-mono text-zinc-400 mt-1">Manage live Push, Email, and SMS emergency broadcast channels</p>
      </div>

      <PermissionPrompt />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Notifications list */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <h3 className="font-bold font-display uppercase tracking-wider text-zinc-100 text-sm">Recent Alerts Feed</h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`p-4 border transition flex items-start justify-between gap-4 ${
                  n.read ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400' : 'bg-cyan-950/30 border-cyan-500/30 text-zinc-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${n.read ? 'bg-zinc-600' : 'bg-cyan-400 animate-pulse'}`} />
                    <h4 className="font-bold text-zinc-100 text-xs font-sans">{n.title}</h4>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 border ${
                      n.priority === 'URGENT' || n.priority === 'HIGH'
                        ? 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {n.priority}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans">{n.body}</p>
                  <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                    {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="p-1.5 text-zinc-400 hover:text-cyan-400 transition"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preferences & Silent hours */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <h3 className="font-bold font-display uppercase tracking-wider text-zinc-100 text-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> Alert Protocols
          </h3>

          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Active Channels</p>
              {[
                { key: 'pushEnabled', label: 'Web Push Notifications' },
                { key: 'emailEnabled', label: 'Email Notifications' },
                { key: 'smsEnabled', label: 'Urgent SMS Alerts' }
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between text-zinc-300 py-1.5 cursor-pointer hover:text-zinc-100">
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[item.key] || false}
                    onChange={(e) => handlePrefChange(item.key, e.target.checked)}
                    className="accent-cyan-500 w-4 h-4 bg-zinc-950 border-zinc-700"
                  />
                </label>
              ))}
            </div>

            <div className="border-b border-zinc-800 pb-3">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Notification Categories</p>
              {[
                { key: 'workOrderAssigned', label: 'Work Order Assigned' },
                { key: 'assetAlerts', label: 'Asset Diagnostics' },
                { key: 'sensorAlerts', label: 'Sensor Threshold Overrun' },
                { key: 'inventoryLow', label: 'Critical Parts Restock' }
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between text-zinc-300 py-1.5 cursor-pointer hover:text-zinc-100">
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[item.key] || false}
                    onChange={(e) => handlePrefChange(item.key, e.target.checked)}
                    className="accent-cyan-500 w-4 h-4 bg-zinc-950 border-zinc-700"
                  />
                </label>
              ))}
            </div>

            <div className="pt-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Quiet Hours (SLA Sleep Mode)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1">Start Hour (24h)</label>
                  <input
                    type="number"
                    value={preferences.quietHoursStart || 22}
                    onChange={(e) => handlePrefChange('quietHoursStart', parseInt(e.target.value))}
                    className="w-full text-xs p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1">End Hour (24h)</label>
                  <input
                    type="number"
                    value={preferences.quietHoursEnd || 7}
                    onChange={(e) => handlePrefChange('quietHoursEnd', parseInt(e.target.value))}
                    className="w-full text-xs p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
