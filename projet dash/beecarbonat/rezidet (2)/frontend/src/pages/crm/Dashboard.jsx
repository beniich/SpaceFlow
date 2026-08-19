import React from 'react';
import { useCrmAuthStore } from '../../store/crmAuthStore';
import { Target, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useCrmAnalytics, useCrmFunnel } from '../../features/crm/hooks/useCrmQueries';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CRMDashboard() {
  const { user } = useCrmAuthStore();
  const { data: analytics, isLoading: isAnalyticsLoading } = useCrmAnalytics();
  const { data: funnel, isLoading: isFunnelLoading } = useCrmFunnel();

  const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val || 0);

  if (isAnalyticsLoading || isFunnelLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-800/50 border border-zinc-700/50 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Pipeline Pondéré', value: formatCurrency(analytics?.pipelineWeightedValue), icon: Target, color: 'text-brand-orange', bg: 'bg-brand-orange/10 border-brand-orange/20' },
    { label: 'Chiffre d\'Affaires Généré', value: formatCurrency(analytics?.wonTotalValue), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Taux de Conversion', value: `${analytics?.conversionRate}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Nouveaux Leads (30j)', value: analytics?.newLeads30d, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl text-sm font-mono">
          <p className="text-zinc-300 font-bold mb-1">{data.label}</p>
          <p className="text-zinc-400">Valeur: <span className="text-brand-orange">{formatCurrency(data.value)}</span></p>
          <p className="text-zinc-400">Nb Deals: <span className="text-cyan-400">{data.count}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
          <Activity className="w-8 h-8 text-brand-orange" />
          CRM Analytics
        </h1>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Performances commerciales de <span className="text-zinc-200">{user?.organization?.name}</span>
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className={`bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 border flex flex-col justify-between relative overflow-hidden ${kpi.bg}`}>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-950/50`}>
                <kpi.icon className={kpi.color} size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-bold text-white mb-1">{kpi.value}</h3>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel des Ventes */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-sans font-bold text-zinc-100 mb-6 flex items-center gap-2">
            Entonnoir des Ventes (Pipeline)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel || []} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12, fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {(funnel || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.stage === 'WON' ? '#34d399' :
                      entry.stage === 'LOST' ? '#ef4444' :
                      '#f97316'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repartition des Opportunites par Statut */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-sans font-bold text-zinc-100 mb-6 flex items-center gap-2">
            Vue d'Ensemble
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
              <div>
                <p className="text-xs font-mono text-zinc-500 uppercase">Opportunités Gagnées</p>
                <p className="text-xl font-bold text-emerald-400">{analytics?.wonCount} deals</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-zinc-500 uppercase">Valeur</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(analytics?.wonTotalValue)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
              <div>
                <p className="text-xs font-mono text-zinc-500 uppercase">Opportunités Perdues</p>
                <p className="text-xl font-bold text-red-400">{analytics?.lostCount} deals</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-zinc-500 uppercase">Ratio Win/Loss</p>
                <p className="text-lg font-bold text-zinc-300">
                  {analytics?.lostCount > 0 ? (analytics.wonCount / analytics.lostCount).toFixed(2) : analytics?.wonCount || 0}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-zinc-950/50 rounded-xl border border-brand-orange/20">
              <div>
                <p className="text-xs font-mono text-brand-orange uppercase">Pipeline Brut Total</p>
                <p className="text-xs text-zinc-400 mt-1">Non pondéré par la probabilité</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-brand-orange">{formatCurrency(analytics?.pipelineTotalValue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
