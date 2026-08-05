import { useQuery } from '@tanstack/react-query';
import { statsService } from '../../services/statsService';
import { formatCurrency } from '../../utils/format';
import { BarChart2 } from 'lucide-react';

const SPACE_TYPE_COLORS: Record<string, string> = {
  MEETING_ROOM: 'bg-indigo-500',
  PRIVATE_OFFICE: 'bg-violet-500',
  COWORKING: 'bg-emerald-500',
  EVENT_SPACE: 'bg-amber-500',
  STUDIO: 'bg-pink-500',
  WORKSHOP: 'bg-sky-500',
  PHONE_BOOTH: 'bg-orange-500',
  COMMUNAL: 'bg-teal-500',
};

export function TopSpaces() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['stats', 'top-spaces'],
    queryFn: () => statsService.getTopSpaces(30),
    refetchInterval: 60_000,
  });

  const max = data.reduce((m: number, s: any) => Math.max(m, s.revenueCents), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={18} className="text-violet-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Top Espaces</h2>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Aucune donnée</p>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 7).map((space: any, idx: number) => (
            <div key={space.spaceId}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-4 text-xs font-bold">{idx + 1}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[130px]">{space.name}</span>
                </div>
                <span className="text-gray-500 text-xs">{formatCurrency(space.revenueCents)}</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${SPACE_TYPE_COLORS[space.type] || 'bg-indigo-500'}`}
                  style={{ width: `${max > 0 ? (space.revenueCents / max) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
