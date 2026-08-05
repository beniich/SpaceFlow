import React, { useState, useEffect } from 'react';
import { SpaceflowAIPrediction } from '../../types';
import { 
  BarChart3, Sparkles, TrendingUp, PieChart as PieChartIcon, Send, 
  Zap, Brain, CheckCircle2, ArrowRight, RefreshCw, Award
} from 'lucide-react';

interface AnalyticsAiViewProps {
  isDarkMode: boolean;
}

export const AnalyticsAiView: React.FC<AnalyticsAiViewProps> = ({ isDarkMode }) => {
  const [period, setPeriod] = useState('30d');
  const [prediction, setPrediction] = useState<SpaceflowAIPrediction | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Bonjour ! Je suis l\'Assistant Gemini IA de SPACEFLOW. Je peux analyser le taux d\'occupation de vos salles, optimiser vos grilles tarifaires et prédire la rentabilité de vos bureaux.',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const cardBg = isDarkMode
    ? 'glass-card-purple text-slate-100 border-white/10 shadow-lg'
    : 'bg-white text-slate-900 border-slate-200 shadow-sm';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const mainTitleText = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const valueText = isDarkMode ? 'text-slate-100' : 'text-slate-800';

  useEffect(() => {
    fetch('/api/ai/predictions')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setPrediction(data);
      })
      .catch(() => {});
  }, []);

  const handleSendAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userMsg = aiPrompt.trim();
    setAiChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiPrompt('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setAiChatHistory(prev => [...prev, { role: 'ai', text: data.response || 'Analyse IA générée.' }]);
    } catch {
      setAiChatHistory(prev => [...prev, { role: 'ai', text: 'Service IA temporairement indisponible.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Mock charts data visualization
  const monthlyRevenueData = [
    { label: 'Jan', val: 9200 },
    { label: 'Fév', val: 9800 },
    { label: 'Mar', val: 10500 },
    { label: 'Avr', val: 11200 },
    { label: 'Mai', val: 11800 },
    { label: 'Juin', val: 12100 },
    { label: 'Juil', val: 12400 },
  ];

  const occupancyDaysData = [
    { label: 'Lun', percent: 82 },
    { label: 'Mar', percent: 94 },
    { label: 'Mer', percent: 96 },
    { label: 'Jeu', percent: 91 },
    { label: 'Ven', percent: 78 },
    { label: 'Sam', percent: 35 },
    { label: 'Dim', percent: 12 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-black uppercase tracking-tight flex items-center gap-2.5 ${mainTitleText}`}>
            <BarChart3 className="w-6 h-6 text-orange-500" />
            <span>ANALYTICS & PRÉDICTIONS IA SPACEFLOW</span>
          </h2>
          <p className={`text-xs ${subText}`}>Rapports d'activité, rentabilité des espaces et moteur prédictif Gemini 2.5 Flash</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={`p-2.5 rounded-xl border text-xs font-bold focus:outline-none ${
              isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">Année 2026</option>
          </select>
        </div>
      </div>

      {/* AI Predictive Insight Banner */}
      {prediction && (
        <div className={`${cardBg} p-6 rounded-2xl border border-orange-500/30 bg-orange-500/10 space-y-4 shadow-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-orange-400 font-black text-sm uppercase tracking-wide">
              <Brain className="w-5 h-5 animate-pulse" />
              <span>RECOMMANDATIONS MOTEUR PRÉDICTIF GEMINI IA (PRO)</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-orange-500 text-white font-mono font-bold text-xs">
              INDICE DE CONFIANCE: {Math.round(prediction.confidenceScore * 100)}%
            </span>
          </div>

          <p className="text-slate-100 text-xs font-medium leading-relaxed">
            "{prediction.summary}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <span className={`text-[10px] font-bold uppercase ${subText}`}>PIC D'OCCUPATION PRÉVU</span>
              <div className="font-bold text-amber-400 text-sm mt-0.5">{prediction.predictedPeakHour}</div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <span className={`text-[10px] font-bold uppercase ${subText}`}>AJUSTEMENT TARIF CONSEILLÉ</span>
              <div className="font-bold text-emerald-400 text-sm mt-0.5">+{prediction.suggestedRateAdjustmentPercent}% pendant les pics</div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <span className={`text-[10px] font-bold uppercase ${subText}`}>PRÉVISION SEMAINE PROCHAINE</span>
              <div className="font-bold text-purple-300 text-sm mt-0.5">{prediction.forecastOccupancyNextWeekPercent}% Taux moyen</div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Growth Line Chart */}
        <div className={`${cardBg} p-6 rounded-2xl border space-y-4`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>ÉVOLUTION DES REVENUS MENSUELS (€)</span>
              </h3>
              <p className={`text-xs ${subText}`}>Croissance du Chiffre d'Affaires et MRR</p>
            </div>
            <span className="text-emerald-400 font-mono font-black text-sm">€12,400 MRR</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyRevenueData.map((d) => {
              const heightPercent = Math.round((d.val / 13000) * 100);
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-300">€{(d.val / 1000).toFixed(1)}k</span>
                  <div 
                    className="w-full max-w-[36px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl transition-all duration-700 hover:opacity-80"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Occupancy Rate Bar Chart */}
        <div className={`${cardBg} p-6 rounded-2xl border space-y-4`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-400" />
                <span>TAUX D'OCCUPATION MOYEN PAR JOUR (%)</span>
              </h3>
              <p className={`text-xs ${subText}`}>Utilisation hebdomadaire des bureaux et salles</p>
            </div>
            <span className="text-orange-400 font-mono font-black text-sm">87% Moyen</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {occupancyDaysData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono font-bold text-slate-300">{d.percent}%</span>
                <div 
                  className={`w-full max-w-[36px] rounded-t-xl transition-all duration-700 ${
                    d.percent > 90 ? 'bg-gradient-to-t from-orange-600 to-amber-400' : 'bg-gradient-to-t from-slate-700 to-slate-500'
                  }`}
                  style={{ height: `${d.percent}%` }}
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Plan Distribution & Gemini Chatbot Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie Distribution Card */}
        <div className={`${cardBg} p-6 rounded-2xl border space-y-5`}>
          <h3 className="text-sm font-black uppercase text-slate-100 border-b border-white/10 pb-3 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-purple-400" />
            <span>RÉPARTITION DES PLANS ABONNEMENTS</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-amber-400">HOT_DESK (60%)</span>
                <span>85 Membres</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-blue-400">DEDICATED (25%)</span>
                <span>35 Membres</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-purple-400">PRIVATE_OFFICE (15%)</span>
                <span>22 Membres</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Gemini AI Interactive Chatbot */}
        <div className={`lg:col-span-2 ${cardBg} p-6 rounded-2xl border flex flex-col justify-between space-y-4`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase text-slate-100">ASSISTANT CHATBOT COWORKER IA</h3>
                <p className={`text-[11px] ${subText}`}>Posez vos questions de gestion en langage naturel</p>
              </div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-3 max-h-56 overflow-y-auto p-2 font-sans text-xs">
            {aiChatHistory.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[85%] ${
                  m.role === 'user'
                    ? 'ml-auto bg-orange-500 text-white font-medium'
                    : 'mr-auto bg-white/5 border border-white/10 text-slate-200'
                }`}
              >
                {m.text}
              </div>
            ))}
            {isAiLoading && (
              <div className="mr-auto p-3 rounded-2xl bg-white/5 text-amber-400 text-xs font-bold animate-pulse flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Génération de la réponse par Gemini 2.5...</span>
              </div>
            )}
          </div>

          {/* Input Prompt */}
          <form onSubmit={handleSendAiChat} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ex: 'Comment augmenter de +15% le chiffre d'affaires des salles ?'"
              className={`flex-1 p-2.5 rounded-xl border text-xs focus:outline-none ${
                isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            <button
              type="submit"
              disabled={isAiLoading}
              className="px-4 py-2.5 rounded-xl btn-gradient-orange text-white text-xs font-bold flex items-center gap-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>ENVOYER</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
