import { useNavigate } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { usePlan } from '../../hooks/usePlan';

/**
 * TokenWidget — compact header widget showing token consumption.
 * Clicking navigates to /billing.
 */
export default function TokenWidget() {
  const { subscription } = useStore();
  const { tokensLeft, tokenPct, planLabel } = usePlan();
  const navigate = useNavigate();

  const { tokensUsed, tokensLimit } = subscription;

  const colorClass =
    tokenPct >= 90
      ? 'text-red-400 border-red-500/30 bg-red-500/10'
      : tokenPct >= 75
      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
      : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

  const barColor =
    tokenPct >= 90 ? 'bg-red-500' : tokenPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <button
      onClick={() => navigate('/billing')}
      title={`${tokensLeft} tokens restants — Cliquez pour gérer votre abonnement`}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:scale-105 text-[11px] font-semibold ${colorClass}`}
    >
      <Coins size={13} />
      <span className="hidden sm:inline">
        {tokensUsed.toLocaleString()}/{tokensLimit.toLocaleString()}
      </span>
      {/* Mini progress bar */}
      <div className="hidden md:block w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(tokenPct, 100)}%` }}
        />
      </div>
      <span className="hidden lg:inline text-[10px] opacity-70">{planLabel}</span>
    </button>
  );
}
