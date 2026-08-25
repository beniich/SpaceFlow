import React from 'react';
import { X, Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Modale d'upgrade contextuelle pour les quotas atteints ou features restreintes
 */
export default function UpgradeModal({
  isOpen,
  onClose,
  title = "Passez au plan supérieur",
  featureName,
  reason = "Pour débloquer cette fonctionnalité ou étendre vos quotas, mettez à niveau votre compte.",
  recommendedPlan = "PRO",
  price = "79€"
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Accent glow top */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="inline-flex p-3 rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Title & Reason */}
        <h3 className="text-2xl font-extrabold tracking-tight mb-2">
          {title}
        </h3>
        
        {featureName && (
          <div className="inline-block text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-3">
            Module : {featureName}
          </div>
        )}

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          {reason}
        </p>

        {/* Plan card preview */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-mono uppercase text-zinc-500">Recommandé</span>
              <h4 className="font-bold text-base">Plan {recommendedPlan}</h4>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-brand-orange">{price}</span>
              <span className="text-xs text-zinc-500">/mois</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-brand-orange shrink-0" />
              <span>Équipements & tickets illimités</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span>Digital Twin BIM 3D & Analytics avancés</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Multi-sites & support prioritaire 24h</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleUpgrade}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-orange hover:bg-orange-600 text-black shadow-lg shadow-brand-orange/20 transition flex items-center justify-center gap-2"
          >
            <span>Voir les offres & Mettre à niveau</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white transition text-center"
          >
            Plus tard
          </button>
        </div>

      </div>
    </div>
  );
}
