import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { statsService } from '../../services/statsService';
import { formatCurrency } from '../../utils/format';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white rounded-xl px-4 py-2 shadow-xl text-sm">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="font-semibold text-emerald-400">{formatCurrency(payload[0].value * 100)}</p>
        <p className="text-gray-400">{payload[1]?.value} résa</p>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['stats', 'revenue'],
    queryFn: () => statsService.getRevenueChart(30),
    refetchInterval: 60_000,
  });

  const chartData = data.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    revenue: d.revenueCents / 100,
    bookings: d.bookings,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={18} className="text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Revenus (30j)</h2>
      </div>
      {isLoading ? (
        <div className="h-56 bg-gray-100 animate-pulse rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={6} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
