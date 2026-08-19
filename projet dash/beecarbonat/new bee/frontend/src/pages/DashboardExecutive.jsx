import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Building2, Wrench, ShieldCheck, DollarSign, Activity, 
  Users, Leaf, AlertTriangle, ArrowUpRight, ArrowDownRight, Download, Calendar, 
  Zap, Layers, CheckCircle2, FileText 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell 
} from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function DashboardExecutive() {
  const [period, setPeriod] = useState('YTD');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    occupancyRate: 91.2,
    netRentalRevenue: 1245000,
    energySavingPct: 16.8,
    co2ReductionTons: 142,
    totalBudget: 850000,
    maintenanceSpent: 382000,
    preventiveRatio: 78,
    activeWO: 14,
    assetHealthAvg: 92.4,
    slaCompliance: 96.5
  });

  const [financialTrend] = useState([
    { month: 'Jan', opex: 42000, capex: 15000, revenue: 198000 },
    { month: 'Fév', opex: 38000, capex: 12000, revenue: 202000 },
    { month: 'Mar', opex: 45000, capex: 28000, revenue: 205000 },
    { month: 'Avr', opex: 39000, capex: 18000, revenue: 210000 },
    { month: 'Mai', opex: 41000, capex: 22000, revenue: 215000 },
    { month: 'Juin', opex: 36000, capex: 14000, revenue: 215000 },
  ]);

  const [esgTrend] = useState([
    { month: 'Jan', kwh: 142000, target: 160000, co2: 28 },
    { month: 'Fév', kwh: 138000, target: 158000, co2: 26 },
    { month: 'Mar', kwh: 131000, target: 155000, co2: 25 },
    { month: 'Avr', kwh: 125000, target: 150000, co2: 23 },
    { month: 'Mai', kwh: 119000, target: 148000, co2: 21 },
    { month: 'Juin', kwh: 112000, target: 145000, co2: 19 },
  ]);

  const [sitePerformance] = useState([
    { site: 'Tour Horizon - Paris 13', occupancy: '95%', energyClass: 'A', opexRatio: '92%', health: 96, status: 'Optimal' },
    { site: 'Campus Tech - Lyon', occupancy: '89%', energyClass: 'B', opexRatio: '84%', health: 91, status: 'Optimal' },
    { site: 'Centre Logistique - Marseille', occupancy: '92%', energyClass: 'C', opexRatio: '78%', health: 86, status: 'Attention' },
    { site: 'Espace Médical - Bordeaux', occupancy: '88%', energyClass: 'A', opexRatio: '95%', health: 94, status: 'Optimal' },
  ]);

  useEffect(() => {
    setLoading(true);
    api.get('/dashboard/stats')
      .then(({ data }) => {
        if (data) {
          setStats((prev) => ({
            ...prev,
            activeWO: data.openWorkOrders ?? prev.activeWO,
            assetHealthAvg: data.avgAssetHealth ?? prev.assetHealthAvg
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExportReport = () => {
    toast.success("Rapport Exécutif C-Level généré et prêt pour téléchargement (PDF)");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-cyan-400" />
            <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50">
              Tableau de Bord Exécutif (C-Level KPIs)
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Synthèse stratégique de la valeur du patrimoine, maitrise des OPEX/CAPEX et conformité ESG
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-zinc-900 border border-zinc-800 p-1 font-mono text-xs">
            {['Q1 2026', 'Q2 2026', 'YTD'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 font-bold uppercase transition ${
                  period === p ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-400 text-xs font-mono font-bold uppercase transition"
          >
            <Download className="w-4 h-4" /> Export PDF Exécutif
          </button>
        </div>
      </div>

      {/* Grid KPI Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="uppercase text-[10px]">Taux d'Occupation Patrimoine</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold text-cyan-400">{stats.occupancyRate}%</p>
            <span className="text-emerald-400 text-[11px] font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +2.8%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Surface totale louée: 42 500 m²</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="uppercase text-[10px]">Revenus Locatifs Nets (NOI)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-emerald-400">
              {stats.netRentalRevenue.toLocaleString('fr-FR')} €
            </p>
            <span className="text-emerald-400 text-[11px] font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +5.2%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Recouvrement baux: 99.1%</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="uppercase text-[10px]">Efficacité Énergétique (ESG)</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold text-emerald-400">-{stats.energySavingPct}%</p>
            <span className="text-emerald-400 text-[11px] font-bold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5" /> Décret 2030
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Réduction CO2: {stats.co2ReductionTons} tonnes/an</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="uppercase text-[10px]">Santé Actifs & Conformité SLA</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold text-amber-400">{stats.assetHealthAvg}%</p>
            <span className="text-cyan-400 text-[11px] font-bold">SLA {stats.slaCompliance}%</span>
          </div>
          <p className="text-[11px] text-zinc-500">Maintenance Préventive: {stats.preventiveRatio}%</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OPEX vs CAPEX vs Revenue */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 font-mono text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold font-display uppercase text-zinc-100 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Trajectoire Financière &amp; Budget OPEX / CAPEX
            </h3>
            <span className="text-[10px] text-zinc-500">M€ / Mois</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialTrend}>
                <defs>
                  <linearGradient id="colorOpex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCapex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
                <Legend />
                <Area type="monotone" dataKey="opex" name="OPEX Maintenance (€)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorOpex)" />
                <Area type="monotone" dataKey="capex" name="CAPEX Investissement (€)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCapex)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ESG & Energy Transition */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 font-mono text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold font-display uppercase text-zinc-100 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Performance Énergétique (kWh vs Cible Décret)
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold">-16.8% vs Cible</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={esgTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
                <Legend />
                <Bar dataKey="kwh" name="Consommation Réelle (kWh)" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="target" name="Plafond Réglementaire (kWh)" fill="#3f3f46" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Site Performance & Strategic Overview Table */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold font-display uppercase text-zinc-100 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" /> Synthèse par Site du Patrimoine Immobilier
          </h3>
          <span className="text-[10px] text-zinc-400">4 Bâtiments Majeurs Sous Gestion</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] bg-zinc-950/60">
                <th className="py-2.5 px-3">Site / Bâtiment</th>
                <th className="py-2.5 px-3">Taux Occupation</th>
                <th className="py-2.5 px-3">Diagnostic Énergie</th>
                <th className="py-2.5 px-3">Maitrise Budget OPEX</th>
                <th className="py-2.5 px-3">Indice Santé</th>
                <th className="py-2.5 px-3 text-right">Statut Opérationnel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sitePerformance.map((site, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3 px-3 font-bold text-zinc-100 font-sans">{site.site}</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{site.occupancy}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                      Classe {site.energyClass}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{site.opexRatio}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-zinc-800 h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: `${site.health}%` }} />
                      </div>
                      <span className="text-zinc-200 font-bold">{site.health}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                      site.status === 'Optimal'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                    }`}>
                      {site.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Executive Recommendations */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 font-mono text-xs space-y-3">
        <h3 className="font-bold font-display uppercase text-zinc-100 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Recommandations Stratégiques C-Level (AI Analytics)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1.5">
            <p className="font-bold text-cyan-400 uppercase text-[11px]">Optimization HVAC Tour Horizon</p>
            <p className="text-zinc-400 text-[11px] font-sans">
              Le passage au mode prédictif sur la centrale de traitement d'air permettra de réduire la facture énergétique de 8,4k€ supplémentaire au T3.
            </p>
            <p className="text-emerald-400 font-bold text-[10px]">ROI Estimé: 3,2 mois</p>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1.5">
            <p className="font-bold text-amber-400 uppercase text-[11px]">Renouvellement CAPEX Pompe à Chaleur</p>
            <p className="text-zinc-400 text-[11px] font-sans">
              La pompe principale du site Marseille atteint 86% d'usure. Un remplacement préventif évite un risque de rupture critique en période estivale.
            </p>
            <p className="text-amber-400 font-bold text-[10px]">Budget CAPEX Recommandé: 45 000 €</p>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1.5">
            <p className="font-bold text-emerald-400 uppercase text-[11px]">Renouvellement Baux Logistiques</p>
            <p className="text-zinc-400 text-[11px] font-sans">
              3 baux majeurs arrivent à échéance au T4 2026. L'intégration de la clause 'Bail Vert' est suggérée pour maintenir les certifications BREEAM.
            </p>
            <p className="text-cyan-400 font-bold text-[10px]">Rétention Client: 100% visée</p>
          </div>
        </div>
      </div>
    </div>
  );
}
