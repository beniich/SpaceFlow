import { useStore } from '../store/useStore';
import { SubscriptionPlan } from '../types';

// Features accessible per plan
const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  free: ['dashboard', 'logs', 'settings'],
  pro: ['dashboard', 'logs', 'settings', 'modules', 'portails', 'vision', 'finance', 'agro-brain', 'infra'],
  elite: ['dashboard', 'logs', 'settings', 'modules', 'portails', 'vision', 'finance', 'agro-brain', 'infra', 'traceability', 'reports', 'team', 'billing'],
};

const TOKEN_LIMITS: Record<SubscriptionPlan, number> = {
  free: 50,
  pro: 5000,
  elite: 50000,
};

const API_LIMITS: Record<SubscriptionPlan, number> = {
  free: 100,
  pro: 10000,
  elite: 100000,
};

const USER_LIMITS: Record<SubscriptionPlan, number> = {
  free: 1,
  pro: 10,
  elite: Infinity,
};

export function usePlan() {
  const { subscription, teamMembers } = useStore();
  const { plan, tokensUsed, tokensLimit, trialDaysLeft } = subscription;

  const canAccess = (feature: string): boolean => {
    return PLAN_FEATURES[plan]?.includes(feature) ?? false;
  };

  const tokensLeft = Math.max(0, tokensLimit - tokensUsed);
  const tokenPct = tokensLimit > 0 ? (tokensUsed / tokensLimit) * 100 : 0;
  const isTrialExpired = plan === 'free' && trialDaysLeft <= 0;
  const isTokensExhausted = tokensLeft === 0;
  const userLimit = USER_LIMITS[plan];
  const canAddUser = teamMembers.length < userLimit;

  return {
    plan,
    canAccess,
    tokensLeft,
    tokenPct,
    tokensLimit: TOKEN_LIMITS[plan],
    apiLimit: API_LIMITS[plan],
    userLimit,
    canAddUser,
    isTrialExpired,
    isTokensExhausted,
    trialDaysLeft,
    isPro: plan === 'pro' || plan === 'elite',
    isElite: plan === 'elite',
    isFree: plan === 'free',
    planLabel: plan === 'free' ? 'Essai Gratuit' : plan === 'pro' ? 'Pro' : 'Elite',
  };
}
