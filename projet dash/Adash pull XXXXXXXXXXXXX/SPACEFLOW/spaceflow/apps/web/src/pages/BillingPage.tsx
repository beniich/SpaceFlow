import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Check, Loader2, ExternalLink } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { billingService } from '../services/billingService';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const PLAN_FEATURES: Record<string, string[]> = {
  FREE: ['1 espace', '20 members', '50 réservations/mois', 'Support communautaire'],
  STARTER: ['3 espaces', '100 members', 'Réservations illimitées', 'Facturation Stripe', 'Support email'],
  PRO: ['10 espaces', '500 members', 'API + Webhooks', 'Multi-utilisateurs', 'IA prédictive', 'Support prioritaire'],
  ENTERPRISE: ['Espaces illimités', 'Members illimités', 'SSO / SAML', 'Account manager', 'SLA 99.99%', 'White label']
};

export default function BillingPage() {
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get('canceled');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: plansData } = useQuery({
    queryKey: ['plans'],
    queryFn: () => billingService.getPlans()
  });

  const { data: subData, refetch } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => billingService.getSubscription()
  });

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => billingService.getInvoices()
  });

  const checkoutMutation = useMutation({
    mutationFn: ({ plan }: { plan: string }) =>
      billingService.createCheckout(plan, billingInterval),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      toast.error('Erreur lors du checkout');
      setLoadingPlan(null);
    }
  });

  const portalMutation = useMutation({
    mutationFn: () => billingService.openPortal(),
    onSuccess: (data) => {
      window.location.href = data.url;
    }
  });

  const cancelMutation = useMutation({
    mutationFn: () => billingService.cancel(),
    onSuccess: () => {
      toast.success('Abonnement annulé à la fin de la période');
      refetch();
    }
  });

  const handleSelectPlan = (planId: string) => {
    if (planId === 'FREE') return;
    setLoadingPlan(planId);
    checkoutMutation.mutate({ plan: planId });
  };

  const currentPlan = subData?.subscription?.plan || 'FREE';

  return (
    <div className="space-y-6">
      {canceled && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
          Paiement annulé. Vous pouvez réessayer à tout moment.
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Plan & Facturation</h1>
        <p className="text-slate-500 mt-1">
          Plan actuel : <span className="font-semibold capitalize">{currentPlan.toLowerCase()}</span>
        </p>
      </div>

      {/* Current subscription */}
      {subData?.subscription && currentPlan !== 'FREE' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="font-medium">Gérer mon abonnement</p>
            <p className="text-sm text-slate-500">
              Voir mes factures, moyen de paiement, annuler
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition flex items-center gap-2"
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
            >
              <ExternalLink className="w-4 h-4" />
              Portail Stripe
            </button>
            {subData.subscription.status === 'active' && !subData.subscription.cancelAtPeriodEnd && (
              <button 
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition"
                onClick={() => {
                  if (confirm('Annuler à la fin de la période ?')) {
                    cancelMutation.mutate();
                  }
                }}
                disabled={cancelMutation.isPending}
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 rounded-lg p-1">
          {(['month', 'year'] as const).map(i => (
            <button
              key={i}
              onClick={() => setBillingInterval(i)}
              className={clsx(
                'px-4 py-1.5 text-sm font-medium rounded transition',
                billingInterval === i ? 'bg-white shadow-sm' : 'text-slate-600'
              )}
            >
              {i === 'month' ? 'Mensuel' : 'Annuel (-20%)'}
            </button>
          ))}
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plansData?.plans?.map((plan: any) => {
          const features = PLAN_FEATURES[plan.id] || [];
          const isCurrent = currentPlan === plan.id;
          const price = billingInterval === 'year' && plan.price > 0
            ? Math.round(plan.price * 12 * 0.8)
            : plan.price;

          return (
            <div
              key={plan.id}
              className={clsx(
                'bg-white p-6 rounded-2xl shadow-sm border relative',
                plan.popular ? 'border-2 border-indigo-500' : 'border-slate-200',
                isCurrent && 'bg-indigo-50 border-indigo-300'
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Populaire
                </span>
              )}
              
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900">{price}€</span>
                {price > 0 && (
                  <span className="text-slate-500 text-sm">
                    /{billingInterval === 'year' ? 'an' : 'mois'}
                  </span>
                )}
              </div>

              <ul className="mt-4 space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isCurrent || loadingPlan === plan.id}
                className={clsx(
                  'w-full mt-6 py-2 rounded-lg font-medium transition',
                  isCurrent
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200',
                  loadingPlan === plan.id && 'opacity-50'
                )}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : isCurrent ? (
                  'Plan actuel'
                ) : plan.id === 'FREE' ? (
                  'Plan gratuit'
                ) : (
                  'Choisir'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoices history */}
      {invoicesData?.invoices && invoicesData.invoices.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Historique des factures</h2>
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-sm text-slate-500">
                <th className="py-2">Numéro</th>
                <th className="py-2"> Date</th>
                <th className="py-2"> Montant</th>
                <th className="py-2"> Statut</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoicesData.invoices.map((inv: any) => (
                <tr key={inv.id}>
                  <td className="py-3 text-sm font-mono">{inv.number}</td>
                  <td className="py-3 text-sm">
                    {new Date(inv.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 text-sm font-medium">
                    {(inv.amount / 100).toFixed(2)}€
                  </td>
                  <td className="py-3">
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded-full',
                      inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                      inv.status === 'open' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    )}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {inv.invoicePdfUrl && (
                      <a 
                        href={inv.invoicePdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 text-sm"
                      >
                        PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
