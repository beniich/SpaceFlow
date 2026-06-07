import React from 'react';
import { motion } from 'motion/react';
import { Check, Shield, Star, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { usePlan } from '../hooks/usePlan';
import { SubscriptionPlan } from '../types';

export default function UpgradePage() {
  const navigate = useNavigate();
  const { setSubscription, addLog } = useStore();
  const { plan } = usePlan();

  const handleSelectPlan = (selectedPlan: SubscriptionPlan) => {
    setSubscription({ plan: selectedPlan });
    
    // Log in the console
    addLog(
      'success',
      `💳 Plan d'abonnement mis à jour avec succès : ${selectedPlan.toUpperCase()}`
    );

    // Dynamic message based on plan
    const details = selectedPlan === 'free' 
      ? 'Abonnement changé vers l\'Essai Gratuit.' 
      : selectedPlan === 'pro' 
        ? 'Abonnement changé vers le plan PRO. 5 000 tokens et 10 utilisateurs débloqués.'
        : 'Abonnement changé vers le plan ELITE. Usage illimité et traçabilité complète débloqués.';
        
    alert(`Félicitations ! Votre abonnement a été mis à jour vers le plan ${selectedPlan.toUpperCase()}.\n${details}`);
    navigate('/dashboard');
  };

  const plans = [
    {
      id: 'free' as SubscriptionPlan,
      name: 'Essai Gratuit',
      price: '0 €',
      period: '14 jours d\'essai',
      desc: 'Pour tester les fonctionnalités de base d\'AgroMaître.',
      icon: Shield,
      color: 'border-slate-800 bg-slate-900/50',
      iconColor: 'text-slate-400',
      buttonText: 'Plan Actuel',
      features: [
        'Accès au tableau de bord minimal',
        'Suivi de 4 métriques de base',
        'Historique des logs d\'audit (100 max)',
        'Limite de 50 tokens IA par mois',
        '1 seul utilisateur admin',
      ],
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: 'Professionnel (PRO)',
      price: '49 €',
      period: 'par mois',
      desc: 'Pour les moyennes et grandes exploitations agricoles.',
      icon: Zap,
      color: 'border-amber-500/50 bg-[#122131] ring-1 ring-amber-500/30 shadow-amber-500/10 shadow-2xl',
      iconColor: 'text-amber-400',
      buttonText: 'Activer PRO',
      popular: true,
      features: [
        'Accès à tous les modules standards',
        'Tableau de bord de sécurité complet',
        'Capteurs & Télémétrie en temps réel',
        'Assistant IA Agro-Brain & Vision IA',
        '5 000 tokens IA par mois',
        'Jusqu\'à 10 utilisateurs',
        'Rapports par email chaque semaine',
      ],
    },
    {
      id: 'elite' as SubscriptionPlan,
      name: 'Elite / Enterprise',
      price: '149 €',
      period: 'par mois',
      desc: 'Pour une traçabilité totale et un usage illimité de l\'IA.',
      icon: Star,
      color: 'border-[#c25a3d]/50 bg-[#1a141b]/80 ring-1 ring-[#c25a3d]/30 shadow-[#c25a3d]/10 shadow-2xl',
      iconColor: 'text-[#e2725b]',
      buttonText: 'Activer ELITE',
      features: [
        'Tout le contenu du plan PRO',
        'Traçabilité Blockchain agricole complète',
        '50 000 tokens IA par mois',
        'Utilisateurs illimités avec rôles granulaires',
        'Support prioritaire 24h/7 & SLA 99.9%',
        'API d\'intégration externe',
        'Personnalisation complète des rapports',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#051424] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c25a3d]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour au tableau de bord
        </button>
        
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Abonnements & Tarification
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Choisissez la formule adaptée à vos besoins et débloquez la puissance de l'IA agricole, de la traçabilité avancée et de la gestion d'équipe.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((p, idx) => {
          const Icon = p.icon;
          const isCurrent = plan === p.id;

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-3xl border p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${p.color}`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-amber-500/20">
                  Le plus populaire
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${p.iconColor}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-white">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.desc}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-white">{p.price}</span>
                  <span className="text-xs text-slate-500">/ {p.period}</span>
                </div>

                <div className="w-full h-px bg-white/5 mb-6" />

                <ul className="space-y-3.5 mb-8">
                  {p.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-3 text-xs text-slate-300">
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileHover={isCurrent ? {} : { scale: 1.03 }}
                whileTap={isCurrent ? {} : { scale: 0.97 }}
                disabled={isCurrent}
                onClick={() => handleSelectPlan(p.id)}
                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  isCurrent
                    ? 'bg-white/10 text-slate-400 border border-white/5 cursor-default'
                    : p.id === 'pro'
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                      : p.id === 'elite'
                        ? 'bg-gradient-to-r from-[#c25a3d] to-[#f97316] text-white hover:opacity-90 shadow-lg shadow-[#c25a3d]/20'
                        : 'bg-white text-slate-950 hover:bg-slate-200'
                }`}
              >
                {isCurrent ? 'Plan Actuel' : p.buttonText}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Guarantee Banner */}
      <div className="max-w-2xl mx-auto text-center mt-16 text-slate-500 text-xs">
        <p>Paiement sécurisé crypté SSL. Annulez ou changez de forfait à tout moment depuis votre tableau de bord.</p>
        <p className="mt-1">Besoin d'un devis sur-mesure pour une coopérative agricole ? <span className="text-amber-400 cursor-pointer hover:underline">Contactez notre équipe</span></p>
      </div>
    </div>
  );
}
