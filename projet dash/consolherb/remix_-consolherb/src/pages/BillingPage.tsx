import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Coins, CreditCard, Receipt, Zap, ArrowRight,
  TrendingUp, Activity, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { usePlan } from '../hooks/usePlan';
import FeatureGate from '../components/ui/FeatureGate';

export default function BillingPage() {
  const { subscription, setSubscription, addLog } = useStore();
  const { plan, tokensLeft, tokenPct, planLabel, isFree } = usePlan();
  const [buyingTokens, setBuyingTokens] = useState(false);
  const [tokenPack, setTokenPack] = useState(1000);

  const mockTransactions = [
    { id: 'TX-4928', date: '2026-05-18', amount: 49.00, status: 'payé', desc: 'Abonnement Professionnel (PRO)' },
    { id: 'TX-4811', date: '2026-04-18', amount: 49.00, status: 'payé', desc: 'Abonnement Professionnel (PRO)' },
    { id: 'TX-4091', date: '2026-03-24', amount: 15.00, status: 'payé', desc: 'Achat de pack +1 000 jetons IA' },
  ];

  const handleBuyTokens = () => {
    setBuyingTokens(true);
    setTimeout(() => {
      setSubscription({
        tokensLimit: subscription.tokensLimit + tokenPack
      });
      addLog('success', `💰 Pack de +${tokenPack} jetons IA acheté et ajouté à votre solde.`);
      setBuyingTokens(false);
      alert(`Paiement simulé réussi ! Votre quota de jetons a été augmenté de +${tokenPack}.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Gestion de l'Abonnement & Facturation</h1>
        <p className="text-slate-400 text-xs mt-1">
          Suivez la consommation de vos ressources API, achetez des jetons IA et gérez votre plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Plan status & details */}
        <div className="lg:col-span-2 bg-[#0d1c2d] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Plan Actuel : {planLabel}
              </span>
              <h2 className="text-lg font-bold text-white mt-3">AgroMaître {planLabel}</h2>
              <p className="text-xs text-slate-400 mt-1">
                {isFree 
                  ? "Votre essai gratuit expire bientôt. Passez à PRO pour débloquer les fonctionnalités." 
                  : `Prochaine facturation le ${new Date(subscription.renewalDate).toLocaleDateString('fr-FR')} de 49.00 €.`}
              </p>
            </div>
            
            <motion.a
              href="/upgrade"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all"
            >
              <Zap size={14} />
              Mettre à niveau
            </motion.a>
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* Detailed Usage Quotas */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Utilisation des quotas</h3>
            
            {/* Tokens Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Coins size={14} className="text-amber-400" /> Jetons / Tokens IA
                </span>
                <span className="text-slate-400">{subscription.tokensUsed} / {subscription.tokensLimit}</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${tokenPct >= 90 ? 'bg-red-500' : tokenPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(tokenPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{tokensLeft} jetons restants</span>
                <span>{tokenPct.toFixed(1)}% consommés</span>
              </div>
            </div>

            {/* API Calls Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Activity size={14} className="text-sky-400" /> Requêtes API Temps Réel
                </span>
                <span className="text-slate-400">{subscription.apiCallsUsed} / {subscription.apiCallsLimit}</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 rounded-full transition-all"
                  style={{ width: `${Math.min((subscription.apiCallsUsed / subscription.apiCallsLimit) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{subscription.apiCallsLimit - subscription.apiCallsUsed} requêtes libres</span>
                <span>{((subscription.apiCallsUsed / subscription.apiCallsLimit) * 100).toFixed(1)}% consommées</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Tokens Widget */}
        <div className="bg-[#0d1c2d] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Coins size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Recharger des jetons</h3>
                <p className="text-[10px] text-slate-500">Jetons valables à vie, non-expirables</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              L'utilisation des modèles d'IA prédictive et de reconnaissance visuelle consomme des jetons.
            </p>

            <div className="space-y-2 mb-6">
              {[
                { count: 1000, price: '15 €' },
                { count: 5000, price: '60 € (économisez 20%)' },
                { count: 10000, price: '100 € (économisez 33%)' },
              ].map((pack) => (
                <button
                  key={pack.count}
                  onClick={() => setTokenPack(pack.count)}
                  className={`w-full text-left p-3 rounded-xl border text-xs flex justify-between items-center transition-all ${
                    tokenPack === pack.count
                      ? 'border-amber-500 bg-amber-500/5 text-white'
                      : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'
                  }`}
                >
                  <span className="font-semibold">+{pack.count.toLocaleString()} Jetons IA</span>
                  <span className="font-bold text-amber-400">{pack.price}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyTokens}
            disabled={buyingTokens}
            className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {buyingTokens ? 'Paiement en cours...' : 'Acheter les jetons'}
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* Payment methods & transaction history */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payment Method */}
        <div className="bg-[#0d1c2d] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Moyen de paiement</h3>
          {isFree ? (
            <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-slate-500 text-xs">
              Aucun moyen de paiement enregistré.
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center border border-white/10">
                  <CreditCard size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Visa terminant par 4242</p>
                  <p className="text-[10px] text-slate-500">Expire le 12/28</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 hover:text-white cursor-pointer transition-colors">Modifier</span>
            </div>
          )}
        </div>

        {/* Invoice list */}
        <div className="lg:col-span-2 bg-[#0d1c2d] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Factures & transactions</h3>
          <div className="space-y-2">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all text-xs">
                <div className="flex items-center gap-3">
                  <Receipt size={16} className="text-slate-500" />
                  <div>
                    <p className="font-bold text-white">{tx.desc}</p>
                    <p className="text-[10px] text-slate-500">{tx.date} • {tx.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white">{tx.amount.toFixed(2)} €</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {tx.status}
                  </span>
                  <ChevronRight size={14} className="text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
