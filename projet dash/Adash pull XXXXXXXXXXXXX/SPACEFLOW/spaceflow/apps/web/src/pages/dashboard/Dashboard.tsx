import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, TrendingUp, DollarSign, Activity, Clock } from 'lucide-react';
import { statsService } from '../../services/statsService';
import { RevenueChart } from '../../components/dashboard/RevenueChart';
import { TopSpaces } from '../../components/dashboard/TopSpaces';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { useSocket } from '../../hooks/useSocket';
import { formatCurrency } from '../../utils/format';

// ----------------------------------------------------------------
// KPI Card
// ----------------------------------------------------------------
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  growth?: number;
  color: string;
  loading?: boolean;
}

function KpiCard({ icon, label, value, growth, color, loading }: KpiCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        {loading ? (
          <div className="h-7 w-24 bg-gray-200 animate-pulse rounded mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        )}
        {growth !== undefined && !loading && (
          <p className={`text-xs mt-1 font-medium ${growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {growth >= 0 ? '▲' : '▼'} {Math.abs(growth)}% vs période préc.
          </p>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Dashboard Page
// ----------------------------------------------------------------
export default function Dashboard() {
  const token = localStorage.getItem('sf_access_token') || '';
  useSocket(token);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: () => statsService.getOverview(30),
    refetchInterval: 60_000,
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">30 derniers jours</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity size={14} className="text-emerald-500 animate-pulse" />
          <span>Temps réel</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <KpiCard
          icon={<Calendar size={20} className="text-indigo-600" />}
          label="Réservations"
          value={stats?.bookings.current ?? 0}
          growth={stats?.bookings.growth}
          color="bg-indigo-50"
          loading={isLoading}
        />
        <KpiCard
          icon={<DollarSign size={20} className="text-emerald-600" />}
          label="Chiffre d'affaires"
          value={formatCurrency(stats?.revenue.currentCents ?? 0)}
          growth={stats?.revenue.growth}
          color="bg-emerald-50"
          loading={isLoading}
        />
        <KpiCard
          icon={<Users size={20} className="text-violet-600" />}
          label="Membres actifs"
          value={stats?.members.total ?? 0}
          color="bg-violet-50"
          loading={isLoading}
        />
        <KpiCard
          icon={<TrendingUp size={20} className="text-blue-600" />}
          label="Taux d'occupation"
          value={`${stats?.occupancyRate ?? 0}%`}
          color="bg-blue-50"
          loading={isLoading}
        />
        <KpiCard
          icon={<Clock size={20} className="text-amber-600" />}
          label="Check-ins en cours"
          value={stats?.checkedInNow ?? 0}
          color="bg-amber-50"
          loading={isLoading}
        />
        <KpiCard
          icon={<Activity size={20} className="text-rose-600" />}
          label="Espaces disponibles"
          value={stats?.spaces.active ?? 0}
          color="bg-rose-50"
          loading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <TopSpaces />
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
}
