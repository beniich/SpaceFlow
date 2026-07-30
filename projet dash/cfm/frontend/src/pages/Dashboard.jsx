import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';
import {
  Package, ClipboardList, AlertTriangle, TrendingUp, MapPin,
  DollarSign, Activity, Building2, Wrench, Leaf,
  ArrowUp, ArrowDown, RefreshCw, Bell, ChevronRight,
  UserCircle, Briefcase, Users, Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ============== COMPOSANT : CARTE KPI ==============
const StatCard = ({ icon: Icon, label, value, sub, color = 'primary', trend, suffix = '' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && trend !== null && (
          <span className={clsx(
            'flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded',
            trend > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
          )}>
            {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}{suffix}</p>
      <p className="text-sm text-slate-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-2">{sub}</p>}
    </div>
  );
};

// ============== COMPOSANT : SECTION HEADER ==============
const SectionHeader = ({ title, action, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-semibold text-slate-900">{title}</h3>
    {action && (
      <button
        onClick={onAction}
        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
      >
        {action} <ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

// ============== COMPOSANT : CARTE LISTE ==============
const ListCard = ({ title, items, renderItem, emptyMessage, action, onAction }) => (
  <div className="bg-white rounded-xl border border-slate-200">
    <div className="p-5 border-b border-slate-200">
      <SectionHeader title={title} action={action} onAction={onAction} />
    </div>
    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
      {items.length === 0 ? (
        <p className="p-6 text-center text-slate-400 text-sm">{emptyMessage}</p>
      ) : (
        items.map(renderItem)
      )}
    </div>
  </div>
);

// ============== COMPOSANT PRINCIPAL ==============
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [liveReadings, setLiveReadings] = useState([]);
  const [crmData, setCrmData] = useState(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState(null);

  // ============== CHARGEMENT ==============
  const loadDashboard = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const [cafmRes, crmRes] = await Promise.all([
        api.get('/dashboard/kpis'),
        api.get('/auth/dashboard').catch(() => ({ data: null }))
      ]);
      setData(cafmRes.data);
      if (crmRes.data) {
        setCrmData(crmRes.data);
        if (crmRes.data.organization?.trialEndsAt) {
          const days = Math.ceil(
            (new Date(crmRes.data.organization.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24)
          );
          setTrialDaysLeft(days);
        }
      }
      setLastUpdate(new Date());
    } catch (err) {
      toast.error('Erreur de chargement du tableau de bord');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // ============== WEBSOCKET ==============
  useEffect(() => {
    const socket = io();
    socket.on('dashboard:update', (payload) => {
      if (payload.type === 'sensor') {
        setLiveReadings((prev) => {
          const filtered = prev.filter((r) => r.sensorId !== payload.data.sensorId);
          return [payload.data, ...filtered].slice(0, 5);
        });
        setLastUpdate(new Date());
      }
    });
    return () => socket.disconnect();
  }, []);

  // ============== AUTO-REFRESH 30s ==============
  useEffect(() => {
    const interval = setInterval(() => loadDashboard(false), 30000);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  // ============== LOADING ==============
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-slate-500">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { kpis, charts, lists } = data;

  const priorityStyles = {
    CRITICAL: 'bg-red-100 text-red-700',
    HIGH: 'bg-orange-100 text-orange-700',
    MEDIUM: 'bg-blue-100 text-blue-700',
    LOW: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="p-8 bg-slate-50 min-h-full">

      {/* ============== EN-TÊTE ============== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Mise à jour : {format(lastUpdate, 'HH:mm:ss', { locale: fr })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRefreshing(true); loadDashboard(false); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm"
          >
            <RefreshCw className={clsx('w-4 h-4', refreshing && 'animate-spin')} />
            Actualiser
          </button>
          <button className="relative p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
            <Bell className="w-4 h-4" />
            {kpis.criticalWorkOrders > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {kpis.criticalWorkOrders}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Trial banner */}
      {trialDaysLeft > 0 && trialDaysLeft <= 14 && (
        <div className="bg-gradient-to-r from-primary-500 to-indigo-600 text-white rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <div>
              <p className="font-semibold">Essai gratuit - {trialDaysLeft} jours restants</p>
              <p className="text-sm text-primary-100">Explorez toutes les fonctionnalités sans limite</p>
            </div>
          </div>
          <button className="bg-white text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition">
            Passer à Pro
          </button>
        </div>
      )}

      {/* CRM Stats (Phase 1) */}
      {crmData && (
        <>
          <SectionHeader title="Vue d'ensemble CRM & Organisation" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard icon={UserCircle} label="Contacts" value={crmData.stats.contacts} color="blue" />
            <StatCard icon={Briefcase} label="Deals en cours" value={crmData.stats.deals} color="green" />
            <StatCard icon={Users} label="Membres d'équipe" value={crmData.stats.users} color="purple" />
          </div>
        </>
      )}

      {/* ============== KPI CARDS CAFM ============== */}
      <SectionHeader title="KPIs Opérationnels (CAFM)" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Package}
          label="Total des actifs"
          value={kpis.totalAssets}
          sub={`${kpis.operationalAssets} opérationnels • ${kpis.maintenanceAssets} en maintenance`}
          color="primary"
        />
        <StatCard
          icon={Activity}
          label="Disponibilité"
          value={kpis.assetAvailability}
          suffix="%"
          sub={`${kpis.breakdownAssets} actifs en panne`}
          color="green"
          trend={2.3}
        />
        <StatCard
          icon={ClipboardList}
          label="Ordres en attente"
          value={kpis.pendingWorkOrders + kpis.inProgressWorkOrders}
          sub={`${kpis.criticalWorkOrders} critiques • ${kpis.completedThisMonth} complétés ce mois`}
          color="orange"
        />
        <StatCard
          icon={MapPin}
          label="Taux d'occupation"
          value={kpis.occupancyRate}
          suffix="%"
          sub={`${kpis.occupiedSpaces}/${kpis.totalSpaces} espaces • ${kpis.totalBuildings} bâtiments`}
          color="blue"
          trend={1.8}
        />
        <StatCard
          icon={DollarSign}
          label="Coût maintenance (mois)"
          value={(kpis.monthlyMaintenanceCost / 1000).toFixed(1)}
          suffix="k €"
          sub={`Total cumulé : ${(kpis.totalMaintenanceCost / 1000).toFixed(0)}k €`}
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Économies réalisées"
          value={kpis.savingsRate}
          suffix="%"
          sub="vs année précédente"
          color="yellow"
          trend={kpis.savingsRate}
        />
        <StatCard
          icon={Building2}
          label="Revenus locatifs"
          value={(kpis.monthlyRevenue / 1000).toFixed(1)}
          suffix="k €"
          sub={`${kpis.activeLeases} baux actifs`}
          color="indigo"
        />
        <StatCard
          icon={Leaf}
          label="Capteurs actifs"
          value={kpis.activeSensors}
          sub={`${kpis.totalSensors} au total • IoT temps réel`}
          color="green"
        />
      </div>

      {/* ============== LECTURES IoT LIVE ============== */}
      {liveReadings.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-4 border border-primary-200 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <h3 className="font-semibold text-slate-900 text-sm">Données IoT en temps réel</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {liveReadings.map((r) => (
              <div key={r.sensorId} className="bg-white rounded-lg px-3 py-2 text-xs shadow-sm">
                <span className="text-slate-500 capitalize">{r.type} :</span>
                <span className="font-semibold text-slate-900 ml-1">
                  {typeof r.value === 'number' ? r.value.toFixed(1) : r.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============== GRAPHIQUES PRINCIPAUX ============== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Tendance Work Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
          <SectionHeader title="Activité des ordres de travail (7 derniers jours)" />
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={charts.woTrend}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Area type="monotone" dataKey="created" name="Créés" stroke="#6366f1" fill="url(#colorCreated)" strokeWidth={2} />
              <Area type="monotone" dataKey="completed" name="Complétés" stroke="#10b981" fill="url(#colorCompleted)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Statut des actifs */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <SectionHeader title="Statut des actifs" />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.assetStatus}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={95}
                paddingAngle={3} dataKey="value"
                label={({ value }) => `${value}`}
              >
                {charts.assetStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ============== ÉNERGIE & COÛTS ============== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <SectionHeader title="Consommation énergétique (12 mois)" action="Détails" onAction={() => {}} />
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={charts.energyConsumption}>
              <defs>
                <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="elec" name="Électricité (kWh)" stroke="#6366f1" fill="url(#colorElec)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <SectionHeader title="Coûts de maintenance par catégorie" action="Rapport" onAction={() => {}} />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={charts.maintenanceCostsByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={80} />
              <Tooltip formatter={(v) => `${v.toLocaleString('fr-FR')} €`} />
              <Bar dataKey="cost" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ============== LISTES D'ACTIVITÉ ============== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Work Orders récents */}
        <ListCard
          title="Ordres de travail récents"
          action="Tout voir"
          onAction={() => {}}
          emptyMessage="Aucun ordre de travail récent"
          items={lists.recentWorkOrders}
          renderItem={(wo) => (
            <div key={wo.id} className="p-4 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-medium text-slate-900 text-sm line-clamp-1">{wo.title}</p>
                <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full shrink-0', priorityStyles[wo.priority])}>
                  {wo.priority}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>📍 {wo.asset?.name}</span>
                <span>👤 {wo.assignedTo?.firstName} {wo.assignedTo?.lastName}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {formatDistanceToNow(new Date(wo.createdAt), { addSuffix: true, locale: fr })}
              </p>
            </div>
          )}
        />

        {/* Maintenances à venir */}
        <ListCard
          title="Maintenances à venir (7j)"
          action="Calendrier"
          onAction={() => {}}
          emptyMessage="Aucune maintenance planifiée"
          items={lists.upcomingMaintenance}
          renderItem={(m) => (
            <div key={m.id} className="p-4 hover:bg-slate-50 transition">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-slate-900 text-sm">{m.name}</p>
                <span className="text-xs text-slate-500">
                  {format(new Date(m.nextMaintenance), 'dd MMM', { locale: fr })}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">📍 {m.location}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                  <div
                    className={clsx('h-1.5 rounded-full', m.healthScore > 70 ? 'bg-green-500' : m.healthScore > 40 ? 'bg-orange-500' : 'bg-red-500')}
                    style={{ width: `${m.healthScore}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 w-8">{m.healthScore}%</span>
              </div>
            </div>
          )}
        />

        {/* Alertes critiques */}
        <ListCard
          title="Alertes critiques"
          action="Voir tout"
          onAction={() => {}}
          emptyMessage="Aucune alerte 🎉"
          items={lists.criticalAlerts}
          renderItem={(a) => (
            <div key={a.id} className="p-4 hover:bg-slate-50 transition">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 text-sm">{a.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{a.building?.name} • {a.location}</p>
                </div>
                <span className="text-xs font-semibold text-red-600">{a.healthScore}%</span>
              </div>
            </div>
          )}
        />
      </div>

      {/* ============== CATÉGORIES D'ACTIFS ============== */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-slate-200">
        <SectionHeader title="Répartition par catégorie d'actifs" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {charts.assetsByCategory.map((cat) => (
            <div key={cat.category} className="p-4 rounded-lg border border-slate-200 hover:border-primary-300 transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900">{cat.category}</h4>
                <Wrench className="w-4 h-4 text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Quantité</p>
                  <p className="font-semibold text-slate-900">{cat.count}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Santé moy.</p>
                  <p className="font-semibold text-slate-900">{cat.avgHealth}%</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className={clsx('h-1.5 rounded-full', cat.avgHealth > 70 ? 'bg-green-500' : cat.avgHealth > 40 ? 'bg-orange-500' : 'bg-red-500')}
                  style={{ width: `${cat.avgHealth}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
