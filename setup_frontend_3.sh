#!/bin/bash
cat << 'DASH' > frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Package, ClipboardList, AlertTriangle, TrendingUp,
  MapPin, Zap, DollarSign, Activity
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StatCard = ({ icon: Icon, label, value, sub, color = 'primary', trend }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-2">{sub}</p>}
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/kpis')
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const { kpis, recentWorkOrders, upcomingMaintenance, woTrend } = data;

  const statusData = [
    { name: 'Opérationnel', value: kpis.totalAssets - (kpis.totalAssets - kpis.operationalAssets), color: '#10b981' },
    { name: 'En maintenance', value: kpis.totalAssets - kpis.operationalAssets, color: '#f59e0b' }
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500">Vue d'ensemble en temps réel de vos installations</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Package}
          label="Total des actifs"
          value={kpis.totalAssets}
          sub={`${kpis.operationalAssets} opérationnels`}
          color="primary"
        />
        <StatCard
          icon={Activity}
          label="Disponibilité"
          value={`${kpis.assetAvailability.toFixed(1)}%`}
          sub="Performance des actifs"
          color="green"
        />
        <StatCard
          icon={ClipboardList}
          label="Ordres en attente"
          value={kpis.pendingWorkOrders}
          sub={`${kpis.criticalWorkOrders} critiques`}
          color="orange"
        />
        <StatCard
          icon={MapPin}
          label="Taux d'occupation"
          value={`${kpis.occupancyRate}%`}
          sub={`${kpis.activeLeases} baux actifs`}
          color="blue"
        />
        <StatCard
          icon={DollarSign}
          label="Coût maintenance (mois)"
          value={`${(kpis.monthlyMaintenanceCost / 1000).toFixed(1)}k €`}
          sub={`Total: ${(kpis.totalMaintenanceCost / 1000).toFixed(0)}k €`}
          color="purple"
        />
        <StatCard
          icon={Zap}
          label="Économies estimées"
          value="18.2%"
          sub="vs année précédente"
          color="yellow"
          trend={18.2}
        />
        <StatCard
          icon={AlertTriangle}
          label="Alertes actives"
          value="3"
          sub="Capteurs en vigilance"
          color="red"
        />
        <StatCard
          icon={TrendingUp}
          label="Cycle de vie moyen"
          value="7.2 ans"
          sub="+12% vs objectif"
          color="indigo"
          trend={12}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Work orders trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Ordres de travail (7 derniers jours)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={woTrend}>
              <defs>
                <linearGradient id="colorWo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#colorWo)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Statut des actifs */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Statut des actifs</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                paddingAngle={5} dataKey="value"
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work orders récents */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Ordres de travail récents</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {recentWorkOrders.map((wo) => (
              <div key={wo.id} className="p-4 hover:bg-slate-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">{wo.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{wo.asset?.name}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full
                    ${wo.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : ''}
                    ${wo.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : ''}
                    ${wo.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' : ''}
                    ${wo.priority === 'LOW' ? 'bg-slate-100 text-slate-700' : ''}
                  `}>
                    {wo.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenances à venir */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Maintenances à venir (7 jours)</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingMaintenance.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{m.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {format(new Date(m.nextMaintenance), 'dd MMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        m.healthScore > 70 ? 'bg-green-500' :
                        m.healthScore > 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${m.healthScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 w-8">{m.healthScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
DASH

cat << 'AST' > frontend/src/pages/Assets.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Plus, Filter, Package, ThermometerSun } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusColors = {
  OPERATIONAL: 'bg-green-100 text-green-700',
  MAINTENANCE: 'bg-orange-100 text-orange-700',
  BREAKDOWN: 'bg-red-100 text-red-700',
  RETIRED: 'bg-slate-100 text-slate-700'
};

const statusLabels = {
  OPERATIONAL: 'Opérationnel',
  MAINTENANCE: 'En maintenance',
  BREAKDOWN: 'En panne',
  RETIRED: 'Retiré'
};

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadAssets();
  }, [search, statusFilter]);

  const loadAssets = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/assets', { params });
      setAssets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des actifs</h1>
          <p className="text-slate-500">{assets.length} actifs enregistrés</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" />
          Nouvel actif
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro de série..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-slate-900"
        >
          <option value="">Tous les statuts</option>
          <option value="OPERATIONAL">Opérationnel</option>
          <option value="MAINTENANCE">En maintenance</option>
          <option value="BREAKDOWN">En panne</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3">Actif</th>
              <th className="px-6 py-3">Catégorie</th>
              <th className="px-6 py-3">Emplacement</th>
              <th className="px-6 py-3">Santé</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3">Prochaine maint.</th>
              <th className="px-6 py-3">Coût</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-12 text-slate-500">Chargement...</td></tr>
            ) : assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{asset.name}</p>
                      <p className="text-xs text-slate-500">{asset.serialNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{asset.category}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{asset.location}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          asset.healthScore > 70 ? 'bg-green-500' :
                          asset.healthScore > 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${asset.healthScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">{asset.healthScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[asset.status]}`}>
                    {statusLabels[asset.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {asset.nextMaintenance ? format(new Date(asset.nextMaintenance), 'dd MMM yyyy', { locale: fr }) : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {asset.purchasePrice?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
AST

