/**
 * PayPalSubscribe.jsx
 * Page /subscribe — Abonnements PayPal Récurrents + Google Auth Firebase.
 * Logo BeeCarbonIt en header/footer, sélection plan Pro / Enterprise.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { onFirebaseAuthStateChanged, signInWithGoogle, firebaseSignOut } from '../lib/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';

// ─── Icône Abeille SVG ────────────────────────────────────────────────────────
const BeeIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.5 5.5L14 7L12 5L10 7L8.5 5.5L12 2ZM6 8L8 10L6.5 11.5L4.5 9.5L6 8ZM18 8L19.5 9.5L17.5 11.5L16 10L18 8ZM12 8C14.21 8 16 9.79 16 12C16 13.5 15.2 14.8 14 15.5V18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18V15.5C8.8 14.8 8 13.5 8 12C8 9.79 9.79 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" />
  </svg>
);

// ─── Logo Google SVG ─────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

// ─── Données des plans ────────────────────────────────────────────────────────
const PLANS_DATA = {
  PRO: {
    label: 'Plan Pro',
    price: '49 €',
    period: '/ mois',
    badge: 'Populaire',
    badgeClass: 'bg-amber-500 text-black',
    priceClass: 'text-amber-400',
    description: 'Bilan Scopes 1-2-3 + IA Prédictive Gemini',
    features: ['Télémétrie temps réel', 'IA CVC Gemini', 'Rapport ESG auto', 'Jusqu\'à 50 sites'],
  },
  ENTERPRISE: {
    label: 'Enterprise',
    price: '199 €',
    period: '/ mois',
    badge: 'Multi-Sites',
    badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    priceClass: 'text-white',
    description: 'Cockpit CAFM illimité + Intégrations BACnet',
    features: ['Sites illimités', 'API BACnet & Modbus', 'SSO SAML2', 'Support dédié 24/7'],
  },
};

export default function PayPalSubscribe() {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('PRO');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // 'ACTIVE' | null
  const [loading, setLoading] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [plans, setPlans] = useState(null);
  const paypalContainerRef = useRef(null);
  const paypalScriptLoaded = useRef(false);

  // ── Firebase Auth state ──────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onFirebaseAuthStateChanged((currentUser) => setUser(currentUser));
    return unsub;
  }, []);

  // ── Chargement des plans depuis le backend ────────────────────────────────
  useEffect(() => {
    api.get('/paypal/plans')
      .then(res => setPlans(res.data))
      .catch(() => {
        // Fallback sur les placeholders si le backend n'est pas encore démarré
        setPlans({
          plans: {
            PRO: { planId: import.meta.env.VITE_PAYPAL_PLAN_ID_PRO || 'P-PLACEHOLDER_PRO' },
            ENTERPRISE: { planId: import.meta.env.VITE_PAYPAL_PLAN_ID_ENTERPRISE || 'P-PLACEHOLDER_ENTERPRISE' },
          },
          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
        });
      });
  }, []);

  // ── Chargement SDK PayPal ────────────────────────────────────────────────
  useEffect(() => {
    if (!plans?.clientId || paypalScriptLoaded.current) return;

    const existingScript = document.getElementById('paypal-sdk');
    if (existingScript) {
      if (window.paypal) {
        setPaypalReady(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${plans.clientId}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => {
      paypalScriptLoaded.current = true;
      setPaypalReady(true);
    };
    script.onerror = () => {
      toast.error('Impossible de charger le SDK PayPal');
    };
    document.body.appendChild(script);
  }, [plans]);

  // ── Rendu des boutons PayPal ─────────────────────────────────────────────
  const renderPayPalButtons = useCallback(() => {
    if (!window.paypal || !paypalContainerRef.current || !plans) return;

    // Vider le container pour éviter double rendu
    paypalContainerRef.current.innerHTML = '';

    const planId = plans.plans?.[selectedPlan]?.planId;
    if (!planId || planId.startsWith('P-PLACEHOLDER')) {
      paypalContainerRef.current.innerHTML = `
        <div class="text-amber-400/70 text-xs text-center p-4 border border-amber-500/20 rounded-xl">
          ⚙️ Configurez <code>PAYPAL_PLAN_ID_${selectedPlan}</code> dans votre .env backend
        </div>
      `;
      return;
    }

    window.paypal.Buttons({
      style: { shape: 'pill', color: 'gold', layout: 'vertical', label: 'subscribe' },

      createSubscription: (_data, actions) => {
        return actions.subscription.create({
          plan_id: planId,
          custom_id: user ? user.uid : 'ANONYMOUS',
        });
      },

      onApprove: async (data) => {
        setLoading(true);
        try {
          const res = await api.post('/paypal/verify-subscription', {
            subscriptionId: data.subscriptionID,
          });
          if (res.data?.success) {
            setSubscriptionStatus('ACTIVE');
            toast.success('🎉 Abonnement activé avec succès !');
          } else {
            toast.error(`Statut inattendu: ${res.data?.status}`);
          }
        } catch (err) {
          toast.error(err.response?.data?.error || 'Erreur lors de la vérification');
        } finally {
          setLoading(false);
        }
      },

      onError: (err) => {
        console.error('PayPal SDK error:', err);
        toast.error('Erreur PayPal — veuillez réessayer');
      },

      onCancel: () => {
        toast('Abonnement annulé', { icon: 'ℹ️' });
      },
    }).render(paypalContainerRef.current);
  }, [paypalReady, selectedPlan, user, plans]);

  // Re-render boutons quand plan ou état PayPal change
  useEffect(() => {
    if (paypalReady) renderPayPalButtons();
  }, [paypalReady, selectedPlan, renderPayPalButtons]);

  // ── Google Sign-In ───────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { user: fbUser } = await signInWithGoogle();
      setUser(fbUser);
      toast.success(`Connecté en tant que ${fbUser.displayName}`);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Erreur Google Sign-In');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await firebaseSignOut();
    setUser(null);
    setSubscriptionStatus(null);
    toast('Déconnexion effectuée', { icon: '👋' });
  };

  return (
    <div className="min-h-screen bg-[#0a0715] text-white flex flex-col font-sans">

      {/* ══════════════════ HEADER ══════════════════ */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b border-amber-500/20 bg-[#0d0a1e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-[1.5px] shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <div className="w-full h-full bg-[#0d0a1e] rounded-[10px] flex items-center justify-center">
                  <BeeIcon className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">
              Bee<span className="text-amber-400">CarbonIt</span>
            </span>
          </a>

          {/* Centre — titre page */}
          <p className="text-xs text-zinc-400 hidden md:block font-medium tracking-wide uppercase">
            Abonnements RecurringPay · PayPal Vault
          </p>

          {/* Auth state */}
          <div className="flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-amber-500/50 object-cover"
                  />
                )}
                <span className="text-sm text-zinc-300 hidden sm:block truncate max-w-[140px]">
                  {user.displayName || user.email}
                </span>
                <button
                  id="btn-signout"
                  onClick={handleSignOut}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                id="btn-google-signin-header"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-900 font-semibold text-xs hover:bg-gray-100 transition-all shadow-md disabled:opacity-50"
              >
                <GoogleIcon />
                <span className="hidden sm:inline">Connexion Google</span>
                <span className="sm:hidden">Google</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ══════════════════ MAIN ══════════════════ */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col items-center">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            PayPal Subscriptions · Vault Sécurisé
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Abonnements{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              BeeCarbonIt Pro
            </span>
          </h1>
          <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
            Activez la télémétrie en temps réel, l'IA CVC et la conformité ESG automatisée.
            Paiement récurrent sécurisé via PayPal Vault.
          </p>
        </div>

        {/* Sélection de plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
          {Object.entries(PLANS_DATA).map(([key, plan]) => (
            <button
              key={key}
              id={`plan-card-${key.toLowerCase()}`}
              onClick={() => setSelectedPlan(key)}
              className={`relative p-6 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                selectedPlan === key
                  ? 'border-amber-500/60 bg-amber-500/8 shadow-[0_0_30px_rgba(245,158,11,0.12)]'
                  : 'border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5'
              }`}
              style={selectedPlan === key ? { background: 'rgba(245,158,11,0.06)' } : {}}
            >
              {selectedPlan === key && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="flex items-start justify-between mb-3 pr-6">
                <span className="font-bold text-lg text-white">{plan.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.badgeClass}`}>
                  {plan.badge}
                </span>
              </div>

              <div className={`text-3xl font-mono font-black ${plan.priceClass} mb-1`}>
                {plan.price}
                <span className="text-sm text-zinc-400 font-sans font-normal ml-1">{plan.period}</span>
              </div>

              <p className="text-zinc-500 text-xs mt-2 mb-4">{plan.description}</p>

              <ul className="space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                    <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Bloc paiement PayPal */}
        <div className="w-full max-w-md">
          <div className="bg-[#0d0a1e] border border-white/8 rounded-2xl overflow-hidden shadow-2xl">

            {/* Header du bloc */}
            <div className="px-6 pt-6 pb-4 border-b border-white/6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {PLANS_DATA[selectedPlan].label}
                    <span className={`ml-2 text-lg font-mono font-black ${PLANS_DATA[selectedPlan].priceClass}`}>
                      {PLANS_DATA[selectedPlan].price}
                    </span>
                    <span className="text-xs text-zinc-500 ml-1">/mois</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">Abonnement récurrent · Annulable à tout moment</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  SSL 256-bit
                </div>
              </div>
            </div>

            {/* Message auth */}
            <div className="px-6 pt-4">
              {user ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Connecté : {user.email}
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-xs text-zinc-400 mb-3">
                    Connectez-vous avec Google pour associer votre abonnement à votre compte.
                  </p>
                  <button
                    id="btn-google-signin-main"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-all shadow-md disabled:opacity-50"
                  >
                    <GoogleIcon />
                    Se connecter avec Google / Gmail
                  </button>
                </div>
              )}
            </div>

            {/* Container bouton PayPal SDK */}
            <div className="px-6 pb-6">
              {subscriptionStatus === 'ACTIVE' ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <p className="text-emerald-400 font-bold text-sm">Abonnement activé avec succès !</p>
                  <p className="text-emerald-500/70 text-xs mt-1">
                    Plan {PLANS_DATA[selectedPlan].label} · PayPal Vault
                  </p>
                  <a
                    href="/dashboard"
                    className="mt-4 inline-block px-6 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors"
                  >
                    Accéder au Dashboard →
                  </a>
                </div>
              ) : (
                <>
                  <div
                    id="paypal-button-container"
                    ref={paypalContainerRef}
                    className="min-h-[100px] flex items-center justify-center"
                  >
                    {!paypalReady && !plans && (
                      <div className="flex flex-col items-center gap-3 py-6 text-zinc-500">
                        <div className="w-6 h-6 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                        <span className="text-xs">Chargement PayPal SDK…</span>
                      </div>
                    )}
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-zinc-400">
                      <div className="w-4 h-4 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                      Vérification de l'abonnement…
                    </div>
                  )}
                </>
              )}
            </div>

          </div>

          {/* Badges sécurité */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-zinc-600">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              RGPD Compliant
            </span>
            <span>·</span>
            <span>ISO 27001</span>
            <span>·</span>
            <span>CSRD Ready</span>
            <span>·</span>
            <span>PayPal Vault</span>
          </div>
        </div>

      </main>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t border-white/6 bg-[#070510] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">

          <div className="flex items-center gap-2.5">
            <BeeIcon className="w-4 h-4 text-amber-500" />
            <span className="text-zinc-300 font-semibold">BeeCarbonIt Platform</span>
            <span className="text-zinc-600">·</span>
            <span>Paiements chiffrés SSL 256-bit via PayPal Vault</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="/pricing" className="hover:text-zinc-300 transition-colors">Tarifs Stripe</a>
            <span>·</span>
            <span>© 2026 BeeCarbonIt</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
