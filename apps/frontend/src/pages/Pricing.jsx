import React, { useEffect, useState } from 'react';
import {
  Check, X, Zap, Shield, Sparkles, Building2, Wrench, FileText,
  Layers, ArrowRight, ExternalLink, ChevronDown, ChevronUp,
  HelpCircle, Gauge, Activity, Users, Box, Headphones, Lock,
  CreditCard, CheckCircle2, User, LogIn, LogOut
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

// ─── Logo Google SVG ─────────────────────────────────────────────────────────
const GoogleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={`${className} flex-shrink-0`} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

// ─── Logo PayPal SVG ─────────────────────────────────────────────────────────
const PayPalIcon = ({ className = "w-4 h-4" }) => (
  <svg className={`${className} flex-shrink-0`} viewBox="0 0 24 24" fill="currentColor">
    <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .77-.655h6.76c2.25 0 4.02.535 5.114 1.545 1.045.967 1.442 2.37 1.148 4.056-.037.214-.083.435-.138.662-.77 3.208-2.923 4.838-6.223 4.838H9.332l-1.378 6.883a.641.641 0 0 1-.633.535l-.245-.247z"/>
    <path fill="#0079C1" d="M19.047 8.666c-.037.214-.083.435-.138.662-.77 3.208-2.923 4.838-6.223 4.838H9.332l-1.378 6.883a.641.641 0 0 1-.633.535H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .77-.655h6.76c2.25 0 4.02.535 5.114 1.545.485.45.82 1.01 1.007 1.674-.383-.34-.863-.61-1.448-.79-1.094-.34-2.483-.51-4.167-.51H9.983L8.04 15.688h2.646c2.75 0 4.544-1.358 5.186-4.03.046-.192.085-.38.115-.563.245-1.405-.085-2.57-.94-3.429z"/>
  </svg>
);

export default function Pricing() {
  const { user, loginWithGoogleFirebase, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState('YEARLY'); // 'MONTHLY' | 'YEARLY'
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [currentBilling, setCurrentBilling] = useState(null);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Modal de sélection de méthode de paiement
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);

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

  // Gestion des retours de paiement (URL params)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      const plan = params.get('plan') || 'PRO';
      toast.success(`🎉 Félicitations ! Votre abonnement ${plan} est activé avec succès.`);
      fetchCurrentBilling();
    } else if (params.get('canceled') === 'true') {
      toast('Souscription annulée. Aucun prélèvement n\'a été effectué.', { icon: 'ℹ️' });
    }
  }, [location.search]);

  // Connexion rapide Google / Gmail
  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      await loginWithGoogleFirebase();
      toast.success('Connecté avec succès via Google / Gmail !');
      await fetchCurrentBilling();
    } catch (err) {
      console.error('Erreur Google Auth:', err);
      toast.error(err.message || 'Erreur lors de la connexion Google');
    } finally {
      setAuthLoading(false);
    }
  };

  // Clic sur un plan
  const handlePlanClick = (planKey) => {
    if (planKey === 'FREE') {
      if (!user) {
        navigate('/signup');
      } else {
        toast.success('Vous avez accès à toutes les fonctionnalités du plan Free.');
      }
      return;
    }

    if (planKey === 'ENTERPRISE') {
      window.location.href = 'mailto:contact@beecarbonit.com?subject=Demande%20devis%20BeeCarbonIT%20Enterprise';
      return;
    }

    // Ouvrir la modale de sélection de paiement pour les plans payants
    setSelectedPlanForModal(planKey);
  };

  // Paiement via Stripe Checkout
  const handleStripeCheckout = async (planKey) => {
    if (!user) {
      toast.error('Veuillez d\'abord vous connecter avec Google ou votre compte');
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
      console.error('Erreur checkout Stripe:', err);
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la redirection Stripe');
    } finally {
      setLoadingPlan(null);
    }
  };

  // Redirection vers abonnement PayPal Subscriptions
  const handlePayPalRedirect = (planKey) => {
    navigate(`/subscribe?plan=${planKey}`);
  };

  // Ouverture du portail client Stripe
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
      priceYearly: 24,
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
      priceYearly: 65,
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
      priceYearly: 125,
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
      q: 'Quels moyens de paiement sont acceptés ?',
      a: 'Nous acceptons les abonnements récurrents sécurisés via PayPal (PayPal Vault) et les cartes bancaires (Visa, Mastercard, American Express, Prélèvements SEPA) via Stripe.'
    },
    {
      q: 'Puis-je changer de plan ou annuler à tout moment ?',
      a: 'Oui, sans aucun engagement. Si vous passez à un plan supérieur, le montant sera calculé au prorata. Si vous résiliez, vous conservez l\'accès jusqu\'à la fin de la période payée.'
    },
    {
      q: 'Comment s\'effectue la liaison avec mon compte Google / Gmail ?',
      a: 'Cliquez sur "Connexion Google / Gmail" pour associer automatiquement votre adresse Gmail. Votre abonnement sera rattaché à votre compte sécurisé et accessible immédiatement.'
    },
    {
      q: 'Comment gérer ma facturation et télécharger mes factures ?',
      a: 'Depuis votre espace connecté sur cette page, cliquez sur "Gérer Facturation" pour accéder à l\'historique de vos factures, changer de moyen de paiement ou modifier vos coordonnées.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* ─── BANDEAU SUPÉRIEUR AUTHENTIFICATION & STATUT ────────────────── */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-zinc-500">Liaison Compte & Facturation</div>
            <div className="text-sm font-semibold">
              {user ? (
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Connecté en tant que : <strong>{user.email || user.name}</strong>
                </span>
              ) : (
                <span className="text-zinc-600 dark:text-zinc-400">
                  Connectez-vous avec Google / Gmail pour rattacher votre abonnement
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
              >
                Mon Dashboard
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white text-gray-900 font-semibold text-xs border border-zinc-300 hover:bg-gray-100 shadow-sm transition disabled:opacity-50"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>{authLoading ? 'Connexion…' : 'Connexion Google / Gmail'}</span>
              </button>
              <button
                onClick={() => navigate('/login?redirect=/pricing')}
                className="px-3 py-2.5 text-xs font-semibold rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
              >
                Connexion Email
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── EN-TÊTE PRINCIPAL ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-brand-orange">
          <Sparkles className="w-3.5 h-3.5" />
          Abonnements & Facturation Sécurisée
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Tarifs simples, transparents et sans engagement
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
          Gestion de maintenance assistée par ordinateur (GMAO), conformité ESG CSRD et Digital Twin BIM 3D.
        </p>

        {/* ─── BANDEAU MÉTHODES DE PAIEMENT SÉCURISÉES ─────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <PayPalIcon className="w-3.5 h-3.5" />
            PayPal Subscriptions (Vault Sécurisé)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
            <CreditCard className="w-3.5 h-3.5" />
            Cartes Bancaires & SEPA (Stripe)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            Chiffrement SSL 256-bit
          </span>
        </div>

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
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Plan Actif de l'Organisation</span>
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
                Organisation : <strong className="text-black dark:text-white">{currentBilling.tenant?.name}</strong> • 
                Prochain renouvellement : <strong className="text-black dark:text-white">{currentBilling.subscription?.currentPeriodEnd ? new Date(currentBilling.subscription.currentPeriodEnd).toLocaleDateString('fr-FR') : 'N/A'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleOpenPortal}
                disabled={loadingPlan === 'portal'}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-black dark:text-white transition w-full md:w-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Gérer Facturation Stripe
              </button>
              <button
                onClick={() => navigate('/subscribe')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition w-full md:w-auto"
              >
                <PayPalIcon className="w-3.5 h-3.5" />
                Abonnements PayPal
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
                onClick={() => handlePlanClick(plan.key)}
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

      {/* ─── MODAL DE SOUSCRIPTION & CHOIX DU MOYEN DE PAIEMENT ─────────────── */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white shadow-2xl p-6 sm:p-8 overflow-hidden">
            
            {/* Bouton fermer */}
            <button
              onClick={() => setSelectedPlanForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête modale */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-zinc-500">Souscription Immédiate</div>
                <h3 className="text-xl font-extrabold">Plan {selectedPlanForModal}</h3>
              </div>
            </div>

            {/* Étape 1 : Si non connecté, inviter à se connecter */}
            {!user ? (
              <div className="space-y-4 my-6">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                  ⚠️ Pour rattacher votre abonnement à votre organisation, veuillez vous identifier en un clic :
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white text-gray-900 font-bold text-sm border border-zinc-300 hover:bg-gray-100 shadow-md transition disabled:opacity-50"
                >
                  <GoogleIcon className="w-5 h-5" />
                  <span>{authLoading ? 'Connexion en cours…' : 'Continuer avec Google / Gmail'}</span>
                </button>

                <div className="text-center text-xs text-zinc-500">
                  ou{' '}
                  <button
                    onClick={() => navigate(`/login?redirect=/pricing`)}
                    className="underline hover:text-brand-orange"
                  >
                    se connecter avec un mot de passe
                  </button>
                </div>
              </div>
            ) : (
              /* Étape 2 : Si connecté, choisir la méthode de paiement */
              <div className="space-y-4 my-6">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Abonnement rattaché à : <strong>{user.email}</strong></span>
                </div>

                <p className="text-xs text-zinc-500 font-medium">Choisissez votre passerelle de paiement sécurisée :</p>

                {/* Option 1: Carte Bancaire via Stripe */}
                <button
                  onClick={() => handleStripeCheckout(selectedPlanForModal)}
                  disabled={loadingPlan === selectedPlanForModal}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-brand-orange hover:bg-brand-orange/5 transition group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Carte Bancaire / Prélèvement</div>
                      <div className="text-[11px] text-zinc-500">Sécurisé par Stripe Checkout (Visa, Mastercard)</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-orange group-hover:translate-x-1 transition" />
                </button>

                {/* Option 2: PayPal Subscriptions */}
                <button
                  onClick={() => handlePayPalRedirect(selectedPlanForModal)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-blue-500 hover:bg-blue-500/5 transition group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition">
                      <PayPalIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Abonnement PayPal Vault</div>
                      <div className="text-[11px] text-zinc-500">Paiement récurrent mensuel sans ressaisie</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-1 transition" />
                </button>
              </div>
            )}

            {/* Footer modale */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Chiffrement 256-bit
              </span>
              <span>Annulation en 1 clic</span>
            </div>

          </div>
        </div>
      )}

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
              Tickets mensuels estimés : <strong className="text-black dark:text-white text-sm">{calcTickets}</strong>
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

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-xs sm:text-sm">
              Configuration recommandée : <strong className="text-brand-orange font-bold uppercase">{calcAssets > 100 || calcUsers > 10 || calcTickets > 200 ? 'Plan PRO' : calcAssets > 10 ? 'Plan STARTER' : 'Plan FREE'}</strong>
            </span>
          </div>

          <button
            onClick={() => handlePlanClick(calcAssets > 100 || calcUsers > 10 || calcTickets > 200 ? 'PRO' : calcAssets > 10 ? 'STARTER' : 'FREE')}
            className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-black font-bold text-xs uppercase tracking-wider transition shadow-md"
          >
            Sélectionner cette offre →
          </button>
        </div>
      </div>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold">Questions Fréquentes</h3>
          <p className="text-xs text-zinc-500 mt-1">Tout ce que vous devez savoir sur la facturation et les abonnements.</p>
        </div>

        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 cursor-pointer transition"
            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{faq.q}</span>
              {openFaq === idx ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
            {openFaq === idx && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 leading-relaxed">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
