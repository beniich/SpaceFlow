#!/bin/bash
cat << 'WOR' > frontend/src/pages/WorkOrders.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, ClipboardList, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusConfig = {
  PENDING: { label: 'En attente', color: 'bg-slate-100 text-slate-700', icon: Clock },
  IN_PROGRESS: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  COMPLETED: { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  CANCELLED: { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: XCircle }
};

const priorityColors = {
  LOW: 'border-l-slate-400',
  MEDIUM: 'border-l-blue-500',
  HIGH: 'border-l-orange-500',
  CRITICAL: 'border-l-red-500'
};

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/workorders')
      .then(({ data }) => setWorkOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? workOrders : workOrders.filter((wo) => wo.status === filter);

  const stats = {
    total: workOrders.length,
    pending: workOrders.filter((w) => w.status === 'PENDING').length,
    inProgress: workOrders.filter((w) => w.status === 'IN_PROGRESS').length,
    completed: workOrders.filter((w) => w.status === 'COMPLETED').length
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ordres de travail</h1>
          <p className="text-slate-500">Gestion et suivi des interventions</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" />
          Nouvel ordre
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'slate' },
          { label: 'En attente', value: stats.pending, color: 'slate' },
          { label: 'En cours', value: stats.inProgress, color: 'blue' },
          { label: 'Terminés', value: stats.completed, color: 'green' }
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 border border-slate-300'
            }`}
          >
            {f === 'ALL' ? 'Tous' : statusConfig[f].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Chargement...</div>
        ) : filtered.map((wo) => {
          const Status = statusConfig[wo.status];
          return (
            <div key={wo.id} className={`bg-white rounded-xl border-l-4 ${priorityColors[wo.priority]} border border-slate-200 p-5 hover:shadow-sm transition`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="w-4 h-4 text-slate-400" />
                    <h3 className="font-semibold text-slate-900">{wo.title}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${Status.color}`}>
                      {Status.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{wo.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>📍 {wo.asset?.location} • {wo.asset?.name}</span>
                    <span>👤 {wo.assignedTo?.firstName} {wo.assignedTo?.lastName}</span>
                    <span>📅 {format(new Date(wo.scheduledAt), 'dd MMM yyyy', { locale: fr })}</span>
                    <span>💰 {wo.estimatedCost?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    wo.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    wo.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    wo.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {wo.priority}
                  </span>
                  <span className="text-xs text-slate-500">{wo.type}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
WOR

cat << 'ANA' > frontend/src/pages/Analytics.jsx
import { useEffect, useState } from 'react';
import {
  BarChart3, TrendingUp, Leaf, DollarSign, Zap, ThermometerSun
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';

const energyData = [
  { month: 'Jan', elec: 8500, gas: 3200, water: 220, cost: 1450 },
  { month: 'Fév', elec: 8200, gas: 3400, water: 210, cost: 1420 },
  { month: 'Mar', elec: 7800, gas: 2800, water: 230, cost: 1320 },
  { month: 'Avr', elec: 7200, gas: 2200, water: 240, cost: 1180 },
  { month: 'Mai', elec: 6800, gas: 1500, water: 280, cost: 1080 },
  { month: 'Jun', elec: 7500, gas: 800, water: 310, cost: 1090 },
  { month: 'Jul', elec: 9200, gas: 400, water: 340, cost: 1380 },
  { month: 'Aoû', elec: 9800, gas: 350, water: 360, cost: 1480 },
  { month: 'Sep', elec: 8400, gas: 1200, water: 290, cost: 1320 },
  { month: 'Oct', elec: 7900, gas: 2200, water: 250, cost: 1290 },
  { month: 'Nov', elec: 8100, gas: 3100, water: 220, cost: 1410 },
  { month: 'Déc', elec: 8600, gas: 3600, water: 215, cost: 1520 }
];

const performanceData = [
  { metric: 'Disponibilité', value: 94 },
  { metric: 'Efficacité', value: 87 },
  { metric: 'Conformité', value: 92 },
  { metric: 'Durabilité', value: 78 },
  { metric: 'Satisfaction', value: 88 },
  { metric: 'Coût', value: 82 }
];

const costByCategory = [
  { category: 'HVAC', cost: 45000 },
  { category: 'Électrique', cost: 28000 },
  { category: 'IT', cost: 18000 },
  { category: 'Mobilier', cost: 12000 },
  { category: 'Sécurité', cost: 9000 }
];

export default function Analytics() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analytique & Rapports</h1>
        <p className="text-slate-500">Performance, durabilité et insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Zap, label: 'Énergie consommée', value: '98.5 MWh', sub: 'Ce mois', color: 'yellow' },
          { icon: Leaf, label: 'CO₂ évité', value: '12.4t', sub: 'vs 2023', color: 'green' },
          { icon: DollarSign, label: 'Économies', value: '€18.2k', sub: '+23% YoY', color: 'blue' },
          { icon: TrendingUp, label: 'ROI CAFM', value: '312%', sub: 'Sur 3 ans', color: 'purple' }
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200">
            <div className={`w-10 h-10 bg-${s.color}-100 rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 text-${s.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Consommation énergétique annuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="elec" name="Électricité" stroke="#6366f1" fill="url(#colorElec)" />
              <Area type="monotone" dataKey="gas" name="Gaz" stroke="#f59e0b" fill="url(#colorGas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Indicateurs de performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" fontSize={12} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
              <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Coûts de maintenance par catégorie</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="category" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip formatter={(v) => `${v.toLocaleString('fr-FR')} €`} />
            <Bar dataKey="cost" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
ANA

cat << 'SPC' > frontend/src/pages/Spaces.jsx
import { useEffect, useState } from 'react';
import { MapPin, Users, Maximize2 } from 'lucide-react';

export default function Spaces() {
  const [floor, setFloor] = useState(1);
  
  // Mock data
  const spaces = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `E${floor.toString().padStart(2, '0')}.${(i + 1).toString().padStart(2, '0')}`,
    type: i < 4 ? 'meeting' : i < 20 ? 'office' : 'common',
    capacity: i < 4 ? 8 : 2,
    occupancy: Math.floor(Math.random() * (i < 4 ? 8 : 2) * 0.9),
    area: i < 4 ? 30 : 14,
    status: Math.random() > 0.4 ? 'occupied' : 'available'
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Plan des espaces</h1>
          <p className="text-slate-500">Tour Horizon - {spaces.length} espaces sur cet étage</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((f) => (
            <button
              key={f}
              onClick={() => setFloor(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                floor === f ? 'bg-primary-600 text-white' : 'bg-white border border-slate-300'
              }`}
            >
              Étage {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {spaces.map((s) => (
          <div
            key={s.id}
            className={`p-4 rounded-xl border-2 cursor-pointer transition hover:scale-105 ${
              s.status === 'occupied' ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">{s.name}</span>
              <span className={`w-2 h-2 rounded-full ${
                s.status === 'occupied' ? 'bg-orange-500' : 'bg-green-500'
              }`} />
            </div>
            <p className="text-xs text-slate-600 capitalize mb-2">
              {s.type === 'meeting' ? 'Salle réunion' : s.type === 'office' ? 'Bureau' : 'Commun'}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {s.occupancy}/{s.capacity}
              </span>
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> {s.area}m²
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Légende</h3>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Occupé</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400" />
            <span>Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
SPC
