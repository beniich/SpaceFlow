import { useQuery } from '@tanstack/react-query';
import { statsService } from '../../services/statsService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity, Calendar, LogIn } from 'lucide-react';

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  CHECKED_IN: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
  NO_SHOW: 'bg-orange-100 text-orange-600',
};

const statusLabels: Record<string, string> = {
  CONFIRMED: 'Confirmée',
  PENDING: 'En attente',
  CHECKED_IN: 'Check-in',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
  NO_SHOW: 'Absent',
};

function ActivityRow({ item }: { item: any }) {
  const isBooking = item.type === 'booking';
  const memberName = item.member
    ? `${item.member.firstName || ''} ${item.member.lastName || ''}`.trim()
    : 'Inconnu';

  const ago = formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: fr });

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isBooking ? 'bg-indigo-50' : 'bg-emerald-50'}`}>
        {isBooking ? (
          <Calendar size={14} className="text-indigo-500" />
        ) : (
          <LogIn size={14} className="text-emerald-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
          {memberName}
          <span className="text-gray-400 font-normal"> — {item.space?.name}</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{ago}</p>
      </div>
      {isBooking && item.status && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColors[item.status] || 'bg-gray-100 text-gray-500'}`}>
          {statusLabels[item.status] || item.status}
        </span>
      )}
      {!isBooking && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${item.success ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {item.success ? 'Accès OK' : 'Refusé'}
        </span>
      )}
    </div>
  );
}

export function ActivityFeed() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['stats', 'activity'],
    queryFn: () => statsService.getActivityFeed(15),
    refetchInterval: 30_000,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={18} className="text-rose-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Activité récente</h2>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Aucune activité</p>
      ) : (
        <div>
          {data.map((item: any) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
