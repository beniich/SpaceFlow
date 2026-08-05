import React, { useState } from 'react';
import { PageId, Language, PricingPlan } from '../../types';
import { PRICING_PLANS, COMPARISON_ROWS } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';
import { Check, X, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (page: PageId) => void;
  language: Language;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, language: propLang }) => {
  const { t, language } = useTranslation(propLang);
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [subscribedMessage, setSubscribedMessage] = useState('');

  const monthlyLabels: Record<Language, string> = {
    FR: 'Facturation Mensuelle',
    EN: 'Monthly Billing',
    DE: 'Monatliche Abrechnung',
    ES: 'Facturación Mensual',
  };

  const yearlyLabels: Record<Language, string> = {
    FR: 'Facturation Annuelle',
    EN: 'Annual Billing',
    DE: 'Jährliche Abrechnung',
    ES: 'Facturación Anual',
  };

  const handleSubscribe = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const confirmSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribedMessage(`Successfully subscribed to ${selectedPlan?.name} plan!`);
    setTimeout(() => {
      setSubscribedMessage('');
      setSelectedPlan(null);
    }, 2500);
  };

  return (
    <div className="space-y-16 animate-fade-in">
      
      {/* Title Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
          {t('pricingHeaderTitle', language)}
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 font-light max-w-2xl mx-auto">
          {t('pricingHeaderSubtitle', language)}
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-4">
          <span className={`text-xs font-bold uppercase ${!isAnnual ? 'text-orange-400' : 'text-gray-400'}`}>
            {monthlyLabels[language]}
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 rounded-full glass-card p-1 border border-orange-500/50 transition-colors relative cursor-pointer"
          >
            <div
              className={`w-6 h-6 rounded-full btn-gradient-orange glow-orange transition-transform transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold uppercase ${isAnnual ? 'text-orange-400' : 'text-gray-400'}`}>
              {yearlyLabels[language]}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              SAVE 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {PRICING_PLANS.map((plan) => {
          const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.id}
              className={`glass-card-purple rounded-3xl p-8 flex flex-col items-center text-center relative transition-all duration-300 hover:scale-[1.02] shadow-2xl ${
                plan.popular
                  ? 'border-2 border-orange-500 glow-border'
                  : 'border border-white/10'
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="bg-orange-500 text-white font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 shadow-xl glow-orange-sm">
                  {plan.badge}
                </div>
              )}

              {/* Price Tag */}
              <div className="bg-nexus-orange-gradient btn-gradient-orange text-white px-8 py-3 rounded-2xl text-4xl font-black mb-4 shadow-xl glow-orange">
                {price}€
                <span className="text-xs font-normal text-white/80 block -mt-1 font-mono">/month</span>
              </div>

              <h3 className="text-2xl font-black tracking-widest text-white uppercase mb-2">
                {plan.name}
              </h3>

              <p className="text-xs text-gray-300 mb-6 font-light">{plan.description}</p>

              {/* Feature List */}
              <ul className="text-left space-y-3 mb-8 w-full text-xs text-gray-200">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Subscribe Button */}
              <button
                onClick={() => handleSubscribe(plan)}
                className="w-full btn-gradient-orange text-white font-bold py-4 rounded-2xl uppercase tracking-widest mt-auto hover:scale-105 active:scale-95 transition-all shadow-lg glow-orange cursor-pointer text-xs"
              >
                {plan.ctaText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table Section */}
      <div className="glass-card-purple outer-frame rounded-3xl p-8 border border-white/10 space-y-6">
        <h3 className="text-2xl font-black text-white text-center tracking-tight">
          Feature Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/15 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                <th className="py-4 px-4 w-1/4">Feature</th>
                <th className="py-4 px-4 text-center w-1/4">Starter</th>
                <th className="py-4 px-4 text-center w-1/4">Professional</th>
                <th className="py-4 px-4 text-center w-1/4">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-gray-300 font-medium">{row.feature}</td>

                  {/* Starter */}
                  <td className="py-4 px-4 text-center font-mono text-gray-200">
                    {typeof row.starter === 'boolean' ? (
                      row.starter ? (
                        <Check className="w-5 h-5 text-orange-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-orange-500/50 mx-auto" />
                      )
                    ) : (
                      row.starter
                    )}
                  </td>

                  {/* Pro */}
                  <td className="py-4 px-4 text-center font-mono text-gray-200 font-bold">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? (
                        <Check className="w-5 h-5 text-orange-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-orange-500/50 mx-auto" />
                      )
                    ) : (
                      row.pro
                    )}
                  </td>

                  {/* Enterprise */}
                  <td className="py-4 px-4 text-center font-mono text-gray-200">
                    {typeof row.enterprise === 'boolean' ? (
                      row.enterprise ? (
                        <Check className="w-5 h-5 text-orange-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-orange-500/50 mx-auto" />
                      )
                    ) : (
                      row.enterprise
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card-purple w-full max-w-lg rounded-3xl p-8 border border-orange-500/50 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-400" />
                <h3 className="text-xl font-bold text-white">Subscribe to {selectedPlan.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {subscribedMessage ? (
              <div className="p-6 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-base font-bold text-white">{subscribedMessage}</p>
                <p className="text-xs text-gray-300">Setting up your Sovereign Device Nexus dashboard...</p>
              </div>
            ) : (
              <form onSubmit={confirmSubscription} className="space-y-4">
                <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">{selectedPlan.name} Plan</div>
                    <div className="text-xs text-gray-300">Billed {isAnnual ? 'Annually' : 'Monthly'}</div>
                  </div>
                  <div className="text-xl font-black text-orange-400 font-mono">
                    {isAnnual ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice}€ / mo
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Company / Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Acme Corp / Jane Doe"
                    className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 border border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Work Email</label>
                  <input
                    required
                    type="email"
                    placeholder="jane@acme.com"
                    className="w-full glass-card rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 border border-white/10"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-gradient-orange text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider glow-orange"
                >
                  Confirm & Start Trial
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
