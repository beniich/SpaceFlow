import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { usePlan } from '../../hooks/usePlan';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  /** override message */
  message?: string;
}

/**
 * FeatureGate — wraps any content with a plan-gate overlay.
 * If the user's plan cannot access `feature`, shows an upgrade overlay.
 */
export default function FeatureGate({ feature, children, message }: FeatureGateProps) {
  const navigate = useNavigate();
  const { canAccess, plan, planLabel } = usePlan();

  if (canAccess(feature)) return <>{children}</>;

  const requiredPlan = plan === 'free' ? 'PRO' : 'ELITE';

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blurred content behind */}
      <div className="pointer-events-none select-none opacity-30 blur-sm">
        {children}
      </div>

      {/* Glassmorphism Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-[#051424]/70 backdrop-blur-md border border-white/10 rounded-2xl"
      >
        <div className="text-center p-8 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">
            Fonctionnalité {requiredPlan}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {message ?? `Cette rubrique nécessite le plan ${requiredPlan}. Votre plan actuel : ${planLabel}.`}
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/upgrade')}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
          >
            <Zap size={16} />
            Passer au plan {requiredPlan}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
