import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import crmApi from '../../services/crmApi';
import { useCrmAuthStore } from '../../store/crmAuthStore';
import { Users, Target, Activity, ArrowUpRight, TrendingUp, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function CRMDashboard() {
  const { user } = useCrmAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState({
    stats: { users: 0, contacts: 0, deals: 0 },
    recentActivity: [],
    loading: true
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await crmApi.get('/auth/dashboard');
        setData({ ...res.data, loading: false });
      } catch (err) {
        toast.error('Erreur lors du chargement du tableau de bord');
        setData(d => ({ ...d, loading: false }));
      }
    };
    fetchDashboard();
  }, []);

  if (data.loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-800/50 border border-zinc-700/50 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Contacts Total', value: data.stats.contacts, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border border-indigo-500/20', trend: '+12% ce mois' },
    { label: 'Deals Actifs', value: data.stats.deals, icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/10 border border-violet-500/20', trend: '+3 nouveaux' },
    { label: 'Utilisateurs', value: data.stats.users, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/20', trend: 'Equipe' },
  ];

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'UPDATE': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'DELETE': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-zinc-400 bg-zinc-800/50 border-zinc-700/50';
    }
  };

  const translateEntity = (entity) => {
    const map = { contact: 'Contact', deal: 'Deal', user: 'Utilisateur' };
    return map[entity] || entity;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Bonjour, {user?.firstName} <span className="animate-pulse inline-block">👋</span></h1>
        <p className="text-zinc-400 mt-1 text-lg">Voici un apercu de l'activite de <span className="text-white font-medium">{user?.organization?.name}</span> aujourd'hui.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[#18181b]/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-zinc-800/60 flex flex-col justify-between hover:bg-[#18181b]/80 transition-all hover:border-zinc-700/60 group relative overflow-hidden">
            <div className={`absolute -right-10 -top-10 w-32 h-32 blur-[50px] ${kpi.bg} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                <kpi.icon className={kpi.color} size={24} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full shadow-sm">
                <TrendingUp size={14} className="mr-1" /> {kpi.trend}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-1">{kpi.value}</h3>
              <p className="text-zinc-400 font-medium">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Onboarding Checklist */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] rounded-2xl p-6 text-white shadow-2xl border border-indigo-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
            <h3 className="text-lg font-bold mb-2 flex items-center relative z-10"><Activity size={20} className="mr-2 text-indigo-400" /> Demarrage Rapide</h3>
            <p className="text-indigo-200/70 text-sm mb-6 relative z-10">Completez ces etapes pour maitriser votre CRM.</p>
            
            <div className="space-y-4 relative z-10">
              {[
                { label: 'Importer vos contacts', done: data.stats.contacts > 0 },
                { label: 'Creer un premier deal', done: data.stats.deals > 0 },
                { label: 'Inviter un collaborateur', done: data.stats.users > 1 }
              ].map((step, i) => (
                <div key={i} className="flex items-center group cursor-default">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border-2 transition-colors ${step.done ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-indigo-800 text-transparent group-hover:border-indigo-600'}`}>
                    {step.done && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${step.done ? 'line-through text-indigo-400/50' : 'text-zinc-300'}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#18181b]/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-zinc-800/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Activite Recente</h3>
            <button onClick={() => navigate('/crm/contacts')} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
              Voir tout <ArrowUpRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-5">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((log) => (
                <div key={log.id} className="flex items-start group">
                  <div className={`px-2 py-1 text-xs font-bold rounded border uppercase mr-4 w-20 text-center ${getActionColor(log.action)}`}>
                    {log.action}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300">
                      <span className="font-semibold text-white">{log.user?.firstName || 'Systeme'}</span> a {log.action === 'CREATE' ? 'cree' : log.action === 'UPDATE' ? 'modifie' : 'supprime'} un {translateEntity(log.entity)}.
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5 group-hover:text-zinc-400 transition-colors">
                      {format(new Date(log.createdAt), 'dd MMMM yyyy HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-zinc-600 font-medium">
                Aucune activite recente enregistree.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
