import React, { useEffect, useState } from 'react';
import {
  Check, X, Zap, Shield, Sparkles, Building2, Wrench, FileText,
  Layers, ArrowRight, ExternalLink, ChevronDown, ChevronUp,
  HelpCircle, Gauge, Activity, Users, Box, Headphones, Lock
} from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Pricing() {
  const { user } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState('YEARLY'); // 'MONTHLY' | 'YEARLY'
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [currentBilling, setCurrentBilling] = useState(null);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // ROI Calculator states
  const [calcAssets, setCalcAssets] = useState(150);
  const [calcTickets, setCalcTickets] = useState(120);
  const [calcUsers, setCalcUsers] = useState(8);

  const fetchCurrentBilling = async () => {
    if (!user) return;
    try {
      setLoadingCurrent(true);
      const res = await api.get('/billing/current');
      setCurrentBilling(res.data);
    } catch (err) {
      console.error('Erreur chargement statut abonnement:', err);
    } finally {
      setLoadingCurrent(false);
    }
  };

  useEffect(() => {
    fetchCurrentBilling();
  }, [user]);

  const handleCheckout = async (planKey) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour souscrire à un plan');
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    if (planKey === 'FREE') {
      toast.success('Vous êtes déjà sur le plan Free ou pouvez l\'utiliser directement.');
      return;
    }

    if (planKey === 'ENTERPRISE') {
      window.location.href = 'mailto:contact@beecarbonit.com?subject=Demande%20devis%20BeeCarbonIT%20Enterprise';
      return;
    }

    try {
      setLoadingPlan(planKey);
      const res = await api.post('/billing/checkout', {
        planKey,
        interval: billingCycle,
        successUrl: `${window.location.origin}/pricing?success=true&plan=${planKey}`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error('Erreur checkout:', err);
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la redirection Stripe');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleOpenPortal = async () => {
    try {
      setLoadingPlan('portal');
      const res = await api.post('/billing/portal', {
        returnUrl: window.location.href
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Impossible d\'ouvrir le portail de facturation');
    } finally {
      setLoadingPlan(null);
    }
  };

  // Recommended plan based on calculator
  const getRecommendedPlan = () => {
    if (calcAssets > 100 || calcUsers > 10 || calcTickets > 200) return 'PRO';
    if (calcAssets > 10 || calcTickets > 50 || calcUsers > 3) return 'STARTER';
    return 'FREE';
  };

  const PLANS_DATA = [
    {
      key: 'FREE',
      name: 'Free',
      badge: 'Démarrage Solo & TPE',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Idéal pour tester la GMAO, pour solo ou très petite structure.',
      cta: 'Commencer Gratuitement',
      popular: false,
      quotas: [
        '3 utilisateurs max',
        '50 tickets / mois',
        '10 équipements max',
        '1 site unique'
      ],
      features: [
        { name: 'Création & suivi de tickets', included: true },
        { name: 'Scan QR Code sur équipement', included: true },
        { name: 'Support communautaire', included: true },
        { name: 'Maintenance préventive', included: false },
        { name: 'Rapports PDF & Excel', included: false },
        { name: 'Digital Twin & BIM Viewer 3D', included: false },
        { name: 'Accès API & Webhooks', included: false },
        { name: 'Multi-sites (jusqu\'à 5)', included: false },
        { name: 'SSO & Audit Logs', included: false }
      ]
    },
    {
      key: 'STARTER',
      name: 'Starter',
      badge: 'PME & Croissance',
      priceMonthly: 29,
      priceYearly: 24, // 24€/mois facturé annuellement
      description: 'Pour les équipes opérationnelles qui veulent automatiser la maintenance.',
      cta: 'Choisir Starter',
      popular: false,
      quotas: [
        'Utilisateurs illimités',
        'Tickets illimités',
        '100 équipements',
        '1 site'
      ],
      features: [
        { name: 'Création & suivi de tickets', included: true },
        { name: 'Scan QR Code sur équipement', included: true },
        { name: 'Support email garanti 48h', included: true },
        { name: 'Maintenance préventive', included: true },
        { name: 'Rapports PDF & Excel', included: true },
        { name: 'Digital Twin & BIM Viewer 3D', included: false },
        { name: 'Accès API & Webhooks', included: false },
        { name: 'Multi-sites (jusqu\'à 5)', included: false },
        { name: 'SSO & Audit Logs', included: false }
      ]
    },
    {
      key: 'PRO',
      name: 'Pro',
      badge: '⭐ Le Plus Populaire',
      priceMonthly: 79,
      priceYearly: 65, // 65€/mois facturé annuellement
      description: 'Le standard de l\'industrie : BIM 3D, Analytics et multi-sites.',
      cta: 'Passer à Pro',
      popular: true,
      quotas: [
        'Utilisateurs illimités',
        'Tickets illimités',
        'Équipements illimités',
        'Jusqu\'à 5 sites'
      ],
      features: [
        { name: 'Création & suivi de tickets', included: true },
        { name: 'Scan QR Code sur équipement', included: true },
        { name: 'Support prioritaire 24h', included: true },
        { name: 'Maintenance préventive & planning', included: true },
        { name: 'Rapports PDF & Excel avancés', included: true },
        { name: 'Digital Twin & BIM Viewer 3D', included: true },
        { name: 'Accès API REST & Webhooks', included: true },
        { name: 'Multi-sites (jusqu\'à 5)', included: true },
        { name: 'SSO & Audit Logs', included: false }
      ]
    },
    {
      key: 'BUSINESS',
      name: 'Business',
      badge: 'Grands Comptes & ETI',
      priceMonthly: 149,
      priceYearly: 125, // 125€/mois facturé annuellement
      description: 'Pour organisations complexes : SSO, conformité SOC2/ISO et SLA 99.9%.',
      cta: 'Choisir Business',
      popular: false,
      quotas: [
        'Utilisateurs illimités',
        'Tickets illimités',
        'Équipements illimités',
        'Sites illimités'
      ],
      features: [
        { name: 'Création & suivi de tickets', included: true },
        { name: 'Scan QR Code sur équipement', included: true },
        { name: 'Support dédié 24/7 (chat + tél)', included: true },
        { name: 'Maintenance préventive & planning', included: true },
        { name: 'Rapports PDF & Excel avancés', included: true },
        { name: 'Digital Twin & BIM Viewer 3D', included: true },
        { name: 'Accès API REST & Webhooks', included: true },
        { name: 'Multi-sites illimités', included: true },
        { name: 'SSO SAML, 2FA forcé & Audit Logs', included: true }
      ]
    },
    {
      key: 'ENTERPRISE',
      name: 'Enterprise',
      badge: 'Sur Devis',
      priceMonthly: 'Sur mesure',
      priceYearly: 'Sur mesure',
      description: 'Déploiement On-premise, intégrations ERP custom et SLA 99.99%.',
      cta: 'Contacter l\'Équipe',
      popular: false,
      quotas: [
        'Sur mesure complet',
        'Instance dédiée isolée',
        'Multi-organisations',
        'SLA 99.99%'
      ],
      features: [
        { name: 'Tout le plan Business inclus', included: true },
        { name: 'Déploiement Cloud dédié ou On-Premise', included: true },
        { name: 'Intégration ERP custom (SAP, Oracle)', included: true },
        { name: 'Account Manager & Formations sur site', included: true },
        { name: 'Accès code source & clauses OEM', included: true }
      ]
    }
  ];

  const FAQS = [
    {
      q: 'Puis-je changer de plan ou annuler à tout moment ?',
      a: 'Oui, sans aucun engagement. Si vous passez à un plan supérieur, le montant sera calculé au prorata. Si vous résiliez, vous conservez l\'accès jusqu\'à la fin de la période payée.'
    },
    {
      q: 'Comment fonctionne l\'essai gratuit du plan Pro ?',
      a: 'Vous pouvez tester le plan Pro pendant 14 jours sans carte bancaire requise. Vous bénéficiez de toutes les fonctionnalités avancées (BIM, multi-sites, équipements illimités).'
    },
    {
      q: 'Que se passe-t-il si je dépasse les quotas du plan Free ?',
      a: 'Vous recevez une notification vous invitant à mettre à niveau votre compte. Vos données restent sécurisées et consultables à tout moment.'
    },
    {
      q: 'Les paiements sont-ils sécurisés ?',
      a: 'Tous les paiements sont traités par Stripe avec cryptage SSL de niveau bancaire. Aucune coordonnée bancaire n\'est stockée sur nos serveurs.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* ─── EN-TÊTE PRINCIPAL ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-brand-orange">
          <Sparkles className="w-3.5 h-3.5" />
          Monétisation & Plans Tarifaires GMAO
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Tarifs simples, transparents et adaptés à votre échelle
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
          De la gestion de maintenance pour TPE jusqu'aux plateformes industrielles multi-sites avec Digital Twin & BIM 3D.
        </p>

        {/* ─── TOGGLE MENSUEL / ANNUEL ─────────────────────────────────────── */}
        <div className="flex items-center justify-center pt-4">
          <div className="relative flex items-center bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-inner">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                billingCycle === 'MONTHLY'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Facturation Mensuelle
            </button>
            <button
              onClick={() => setBillingCycle('YEARLY')}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                billingCycle === 'YEARLY'
                  ? 'bg-brand-orange text-black font-bold shadow-md'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <span>Engagement Annuel</span>
              <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                -20% (2 mois offerts)
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── BANNIÈRE ABONNEMENT ACTUEL (SI CONNECTÉ) ────────────────────── */}
      {currentBilling && (
        <div className="max-w-6xl mx-auto mb-12 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Plan Actuel de l'Organisation</span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                  {currentBilling.subscription?.planName || currentBilling.subscription?.plan}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono uppercase ${
                  currentBilling.subscription?.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  {currentBilling.subscription?.status}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Organisation: <strong className="text-black dark:text-white">{currentBilling.tenant?.name}</strong> • 
                Renouvellement: <strong className="text-black dark:text-white">{currentBilling.subscription?.currentPeriodEnd ? new Date(currentBilling.subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleOpenPortal}
                disabled={loadingPlan === 'portal'}
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-black dark:text-white transition w-full md:w-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Gérer Facturation Stripe
              </button>
            </div>
          </div>

          {/* Jauges d'utilisation en temps réel */}
          {currentBilling.usage && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-zinc-500">Utilisateurs</span>
                  <span className="font-bold">{currentBilling.usage.users.current} / {currentBilling.usage.users.isUnlimited ? '∞' : currentBilling.usage.users.max}</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-orange h-full rounded-full transition-all"
                    style={{ width: `${currentBilling.usage.users.percent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-zinc-500">Équipements (Assets)</span>
                  <span className="font-bold">{currentBilling.usage.assets.current} / {currentBilling.usage.assets.isUnlimited ? '∞' : currentBilling.usage.assets.max}</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${currentBilling.usage.assets.percent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-zinc-500">Tickets ce mois</span>
                  <span className="font-bold">{currentBilling.usage.tickets.current} / {currentBilling.usage.tickets.isUnlimited ? '∞' : currentBilling.usage.tickets.max}</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${currentBilling.usage.tickets.percent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── GRILLE DES PLANS ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
        {PLANS_DATA.map((plan) => {
          const isCurrent = currentBilling?.subscription?.plan === plan.key;
          const displayPrice = billingCycle === 'YEARLY' ? plan.priceYearly : plan.priceMonthly;

          return (
            <div
              key={plan.key}
              className={`relative flex flex-col justify-between p-6 rounded-2xl transition-all duration-200 ${
                plan.popular
                  ? 'bg-zinc-50 dark:bg-zinc-900 border-2 border-brand-orange shadow-xl shadow-brand-orange/10 scale-105 z-10'
                  : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-orange text-black font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div className="mb-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    {!plan.popular && plan.badge}
                  </div>
                  <h3 className="text-xl font-bold mt-1">{plan.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-baseline gap-1">
                    {typeof displayPrice === 'number' ? (
                      <>
                        <span className="text-4xl font-extrabold">{displayPrice}€</span>
                        <span className="text-xs text-zinc-500 font-medium">/user/mois</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">{displayPrice}</span>
                    )}
                  </div>
                  {typeof displayPrice === 'number' && displayPrice > 0 && (
                    <div className="text-[11px] text-zinc-500 mt-1">
                      {billingCycle === 'YEARLY' ? `Facturé ${displayPrice * 12}€ / an` : 'Facturé mensuellement'}
                    </div>
                  )}
                </div>

                {/* Quotas */}
                <div className="mb-6 space-y-2">
                  <div className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Quotas inclus :</div>
                  {plan.quotas.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <Zap className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-8">
                  <div className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Fonctionnalités :</div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      {feat.included ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-300 dark:text-zinc-700 shrink-0 mt-0.5" />
                      )}
                      <span className={feat.included ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-600 line-through'}>
                        {feat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action CTA */}
              <button
                onClick={() => handleCheckout(plan.key)}
                disabled={isCurrent || loadingPlan === plan.key}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-default'
                    : plan.popular
                    ? 'bg-brand-orange hover:bg-orange-600 text-black shadow-lg shadow-brand-orange/20'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                }`}
              >
                {loadingPlan === plan.key ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isCurrent ? (
                  'Plan Actuel'
                ) : (
                  <>
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── SIMULATEUR DE QUOTAS & ROI ────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto mb-16 p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Simulateur & Recommandation de Plan</h3>
            <p className="text-xs text-zinc-500">Ajustez vos volumes pour découvrir le plan le plus économique et adapté.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="text-xs font-mono uppercase text-zinc-500 block mb-2">
              Nombre d'équipements : <strong className="text-black dark:text-white text-sm">{calcAssets}</strong>
            </label>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={calcAssets}
              onChange={(e) => setCalcAssets(Number(e.target.value))}
              className="w-full accent-brand-orange"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-zinc-500 block mb-2">
              Tickets prévus / mois : <strong className="text-black dark:text-white text-sm">{calcTickets}</strong>
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={calcTickets}
              onChange={(e) => setCalcTickets(Number(e.target.value))}
              className="w-full accent-brand-orange"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-zinc-500 block mb-2">
              Utilisateurs actifs : <strong className="text-black dark:text-white text-sm">{calcUsers}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={calcUsers}
              onChange={(e) => setCalcUsers(Number(e.target.value))}
              className="w-full accent-brand-orange"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-zinc-500">Plan recommandé :</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-orange text-black uppercase">
              Plan {getRecommendedPlan()}
            </span>
          </div>
          <button
            onClick={() => handleCheckout(getRecommendedPlan())}
            className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition"
          >
            Sélectionner ce plan
          </button>
        </div>
      </div>

      {/* ─── SECTION FAQ ─────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-center mb-8">Questions Fréquentes</h3>
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950"
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition"
            >
              <span>{faq.q}</span>
              {openFaq === idx ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </button>
            {openFaq === idx && (
              <div className="p-4 pt-0 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-900">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
