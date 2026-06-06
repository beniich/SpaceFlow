import Skeleton from './Skeleton';

/**
 * Full dashboard skeleton layout that mirrors DashboardPage's grid structure.
 * Shown while data/modules are loading via React Suspense.
 */
export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Node cards grid – 4 columns on large, 2 on medium, 1 on small */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#0d1c2d] border border-slate-800/60 rounded-md p-4 space-y-3"
          >
            {/* Node header: icon + title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="card" width={80} height={12} className="rounded" />
              </div>
              <Skeleton variant="card" width={48} height={18} className="rounded-full" />
            </div>

            {/* Progress bar */}
            <Skeleton variant="card" height={6} className="rounded-full" />

            {/* Stats row */}
            <div className="flex justify-between gap-2">
              <Skeleton variant="card" width="45%" height={32} className="rounded" />
              <Skeleton variant="card" width="45%" height={32} className="rounded" />
            </div>

            {/* Action button */}
            <Skeleton variant="card" height={28} className="rounded" />
          </div>
        ))}
      </div>

      {/* Attack simulator panel */}
      <div className="bg-[#0d1c2d] border border-slate-800/60 rounded-md p-4 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="card" width={180} height={12} className="rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="card" height={36} className="rounded" />
          ))}
        </div>
      </div>

      {/* Chart + Terminal grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric Chart */}
        <div className="bg-[#0d1c2d] border border-slate-800/60 rounded-md p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton variant="card" width={140} height={12} className="rounded" />
            <Skeleton variant="card" width={60} height={20} className="rounded-full" />
          </div>
          <Skeleton variant="chart" height={180} />
          <div className="flex gap-4">
            <Skeleton variant="card" width={80} height={10} className="rounded" />
            <Skeleton variant="card" width={80} height={10} className="rounded" />
            <Skeleton variant="card" width={80} height={10} className="rounded" />
          </div>
        </div>

        {/* Cyber Terminal */}
        <div className="bg-[#010f1f] border border-slate-800/60 rounded-md p-4 space-y-2">
          <div className="flex items-center gap-1.5 mb-3">
            {/* Traffic-light dots */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <Skeleton variant="card" width={120} height={9} className="rounded ml-2" />
          </div>
          <Skeleton variant="text" lines={8} className="opacity-60" />
          <Skeleton variant="card" height={28} className="rounded mt-4" />
        </div>
      </div>
    </div>
  );
}
