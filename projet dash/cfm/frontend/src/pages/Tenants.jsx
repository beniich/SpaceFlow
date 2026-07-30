import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Users, Building2, Package, Wrench, Shield, Key,
  Activity, Settings, Plus, CheckCircle2, XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function Tenants() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, activityRes] = await Promise.all([
        api.get('/tenant/stats'),
        api.get('/tenant/users'),
        api.get('/tenant/activity')
      ]);
      setData(statsRes.data);
      setUsers(usersRes.data);
      setActivity(activityRes.data);
    } catch (err) {
      toast.error('Erreur de chargement des données tenant');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const changeRole = async (userId, newRole) => {
    try {
      await api.put(`/tenant/users/${userId}/role`, { role: newRole });
      toast.success('Rôle mis à jour');
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors du changement de rôle');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-600" />
            Organisation
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {data.tenant.name} — Plan {data.tenant.plan}
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
          { id: 'users', label: 'Utilisateurs & Rôles', icon: Users },
          { id: 'features', label: 'Fonctionnalités', icon: Settings }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex justify-between mb-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-semibold text-slate-400">
                  {data.stats.users} / {data.limits.maxUsers}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{data.stats.users}</p>
              <p className="text-sm text-slate-500">Utilisateurs</p>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(data.stats.users / data.limits.maxUsers) * 100}%` }} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex justify-between mb-2">
                <Package className="w-5 h-5 text-green-500" />
                <span className="text-xs font-semibold text-slate-400">
                  {data.stats.assets} / {data.limits.maxAssets}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{data.stats.assets}</p>
              <p className="text-sm text-slate-500">Actifs gérés</p>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${(data.stats.assets / data.limits.maxAssets) * 100}%` }} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex justify-between mb-2">
                <Wrench className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{data.stats.workOrders}</p>
              <p className="text-sm text-slate-500">Ordres de travail</p>
              <p className="text-xs text-orange-600 mt-2 font-medium">{data.stats.pendingWO} en attente</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex justify-between mb-2">
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{data.stats.schedules}</p>
              <p className="text-sm text-slate-500">Plannings maintenance</p>
              <p className="text-xs text-purple-600 mt-2 font-medium">Actifs</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Journal d'activité récent</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {activity.map((act) => (
                <div key={act.id} className="p-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {act.action.includes('COMPLETED') ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Activity className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{act.description}</p>
                    <p className="text-xs text-slate-500">Par {act.user}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true, locale: fr })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Gestion des accès</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
              <Plus className="w-4 h-4" /> Inviter
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase">
                <th className="px-6 py-3">Utilisateur</th>
                <th className="px-6 py-3">Rôle</th>
                <th className="px-6 py-3">Créé le</th>
                <th className="px-6 py-3">Ordres créés / assignés</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className={clsx(
                        'text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer outline-none ring-2 ring-transparent focus:ring-primary-300',
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                        u.role === 'TECH' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                      )}
                    >
                      <option value="ADMIN">Administrateur</option>
                      <option value="MANAGER">Manager</option>
                      <option value="TECH">Technicien</option>
                      <option value="USER">Utilisateur</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {u._count.createdWorkOrders} / {u._count.workOrders}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'features' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.features.map(f => (
            <div key={f.name} className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">{f.name}</span>
              {f.enabled ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-300" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
